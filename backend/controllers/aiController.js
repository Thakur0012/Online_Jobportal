import * as cheerio from 'cheerio';
import Groq from 'groq-sdk';
import Job from '../models/Job.js';
import DailyDigest from '../models/DailyDigest.js';
import Parser from 'rss-parser';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdf = require('pdf-parse');
import mammoth from 'mammoth';
import { postJobToLinkedIn } from '../services/linkedinService.js';
import User from '../models/User.js';

const DEBUG_LOG = path.join(process.cwd(), 'ai-debug.log');

export function logDebug(msg) {
    const time = new Date().toISOString();
    fs.appendFileSync(DEBUG_LOG, `[${time}] ${msg}\n`);
}

puppeteer.use(StealthPlugin());

// Helper to fetch and clean text from URL using a headless browser to bypass 403 Forbidden blocks
async function scrapeUrlText(url) {
    if (!url) return '';
    logDebug(`Scraping URL: ${url}`);
    let browser;
    try {
        browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        const page = await browser.newPage();
        await page.setViewport({ width: 1366, height: 768 });
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

        const response = await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
        await new Promise(r => setTimeout(r, 3000)); // wait for JS render

        if (response && response.status() >= 400 && response.status() !== 403) {
            console.warn(`Warning: Page returned status ${response.status()}`);
        }

        let detectedSalary = '';

        // ── LAYER 0: NaukriGulf / Naukri specific salary grab ──
        // These sites render salary in a labeled grid — grab it directly
        try {
            const naukSalary = await page.evaluate(() => {
                // NaukriGulf pattern: find a label/span that says "Monthly Salary" or "Salary"
                // then grab its sibling or parent's next element
                const allText = document.querySelectorAll('*');
                for (const el of allText) {
                    const txt = (el.innerText || el.textContent || '').trim();
                    // Label element that says Monthly Salary
                    if (/^(monthly\s*salary|salary|package|ctc|compensation)$/i.test(txt) && txt.length < 40) {
                        // Check next sibling or parent's next sibling
                        const candidates = [
                            el.nextElementSibling,
                            el.parentElement?.nextElementSibling,
                            el.nextSibling,
                        ];
                        for (const c of candidates) {
                            const val = (c?.innerText || c?.textContent || '').trim();
                            if (val && val.length > 3 && val.length < 200 &&
                                /(AED|USD|INR|₹|\$|LPA|lacs|lakhs|\d)/i.test(val)) {
                                return val;
                            }
                        }
                    }
                }
                return '';
            });
            if (naukSalary) {
                detectedSalary = naukSalary;
                logDebug(`[Layer 0] NaukriGulf salary found: "${naukSalary}"`);
            }
        } catch (_) {}

        // ── LAYER 1: JSON-LD structured data (Naukri, Indeed, LinkedIn embed this) ──
        if (!detectedSalary) try {
            const jsonLdSalary = await page.evaluate(() => {
                const scripts = Array.from(document.querySelectorAll('script[type="application/ld+json"]'));
                for (const s of scripts) {
                    try {
                        const data = JSON.parse(s.textContent);
                        const nodes = Array.isArray(data['@graph']) ? data['@graph'] : [data];
                        for (const node of nodes) {
                            if (node.baseSalary) {
                                const sal = node.baseSalary;
                                const min = sal?.value?.minValue || sal?.minValue || '';
                                const max = sal?.value?.maxValue || sal?.maxValue || '';
                                const currency = sal?.currency || sal?.value?.currency || '';
                                if (min || max) return `${currency} ${min}${max ? ' - ' + max : ''}`.trim();
                            }
                            if (node.salary) return String(node.salary);
                        }
                    } catch (_) {}
                }
                return '';
            });
            if (jsonLdSalary) detectedSalary = jsonLdSalary;
        } catch (_) {}

        // ── LAYER 2: Live DOM search via page.evaluate() ──
        if (!detectedSalary) {
            try {
                const domSalary = await page.evaluate(() => {
                    // Check known salary CSS selectors first
                    const selectors = [
                        '[class*="salary"]', '[class*="Salary"]', '[class*="SALARY"]',
                        '[id*="salary"]', '[class*="compensation"]', '[class*="ctc"]',
                        '[class*="package"]', '[class*="wage"]', '[class*="rupee"]',
                        '[data-testid*="salary"]', '[data-cy*="salary"]',
                        '.sal-wrap', '.sfSal', '.salaryInfo',
                        // NaukriGulf / Gulf job sites
                        '[class*="monthlySalary"]', '[class*="MonthlySalary"]',
                        '[class*="monthly-salary"]', '[class*="salary-range"]',
                        '[class*="salRange"]', '[class*="job-salary"]',
                        '.salary', '.salaryContainer', '.salaryDetails'
                    ];
                    const isSalaryLike = (t) => (
                        /[₹$]/.test(t) ||
                        /AED\s*[\d,]+/i.test(t) ||
                        /[\d,]+\s*AED/i.test(t) ||
                        /\d+\s*[-–]\s*\d+\s*(lpa|lacs?|lakhs?|pa)/i.test(t) ||
                        /\d+\s*(lpa|lacs|lakhs|ctc)/i.test(t) ||
                        /(per annum|per month)/i.test(t) ||
                        /(lacs?|lakhs?|lpa|ctc)\s*[\d.]+/i.test(t) ||
                        /monthly salary/i.test(t)
                    );
                    for (const sel of selectors) {
                        try {
                            const el = document.querySelector(sel);
                            const t = el?.innerText?.trim();
                            if (t && t.length > 2 && t.length < 250 && isSalaryLike(t)) return t;
                        } catch (_) {}
                    }
                    // Scan ALL visible elements for salary-like text
                    const allEls = document.querySelectorAll('span, p, div, li, td, strong, b, h1, h2, h3, h4');
                    for (const el of allEls) {
                        const t = (el.innerText || '').trim();
                        if (t.length < 250 && isSalaryLike(t)) return t;
                    }
                    return '';
                });
                if (domSalary) detectedSalary = domSalary;
            } catch (_) {}
        }

        // ── LAYER 3: Regex on full body text ──
        const html = await page.content();
        const $ = cheerio.load(html);
        $('script, style, noscript, nav, footer, header').remove();
        let text = $('body').text().replace(/\s+/g, ' ').trim();

        if (!detectedSalary) {
            const salaryPatterns = [
                // AED / Gulf salaries (highest priority for NaukriGulf)
                /AED\s*[\d,]+(?:\s*[-–]\s*[\d,]+)?(?:\s*per\s*(?:month|annum))?/i,
                /[\d,]+\s*[-–]\s*[\d,]+\s*AED/i,
                /(?:Monthly Salary|Salary)\s*:?\s*AED\s*[\d,]+(?:\s*[-–]\s*[\d,]+)?/i,
                // INR / Indian salaries
                /(?:₹|Rs\.?|INR)\s*[\d,]+(?:\s*[-–to]+\s*[\d,]+)?\s*(?:Lacs?|Lakhs?|L)?\.?\s*(?:PA|P\.A\.|LPA|CTC|per\s*annum)?/i,
                /[\d,]+\s*[-–]\s*[\d,]+\s*(?:Lacs?|Lakhs?|LPA|CTC|PA)/i,
                /(?:Salary|CTC|Package|Pay|Compensation)\s*:?\s*[\d₹$,.\s]+(?:Lacs?|Lakhs?|LPA|PA|USD|AED)/i,
                // USD salaries
                /\$\s*[\d,]+(?:\s*[-–]\s*[\d,]+)?\s*(?:per\s*(?:year|annum|month))?/i,
            ];
            for (const pattern of salaryPatterns) {
                const match = text.match(pattern);
                if (match) { detectedSalary = match[0].trim(); break; }
            }
        }

        logDebug(`Salary detected: "${detectedSalary || 'none'}"`
        );

        if (detectedSalary) {
            text = `SALARY_DETECTED: ${detectedSalary} | ` + text;
        }

        return text.substring(0, 25000);
    } catch (error) {
        console.error('Puppeteer Scraping error:', error);
        throw new Error(`Failed to scrape URL with headless browser: ${error.message}`);
    } finally {
        if (browser) await browser.close();
    }
}

/**
 * Internal logic to scrape a URL, use AI to format it as a LedgerBandhu job,
 * save it, and cross-post to LinkedIn.
 * Useful for both manual triggers and automated cron tasks.
 */
export const processJobAutomation = async (url, adminId = null, fallbackText = null, overrideCategory = null, isSponsored = false) => {
    try {
        if (!process.env.GROQ_API_KEY) {
            throw new Error("Groq API Key is not configured.");
        }

        // If no adminId provided, find the main admin account
        if (!adminId) {
            const admin = await User.findOne({ role: 'admin' });
            adminId = admin?._id;
        }

        if (!adminId) {
             throw new Error("No admin account found to assign the job to.");
        }

        let scrapedContext = fallbackText || "";
        let scrapeFailed = false;
        
        if (!fallbackText) {
            try {
                scrapedContext = await scrapeUrlText(url);
            } catch (scrapeErr) {
                logDebug(`Scraping error (falling back to URL inference): ${scrapeErr.message}`);
                scrapeFailed = true;
            }
        }

        const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
        const sysPrompt = `
You are an expert recruitment assistant for LedgerBandhu. Analyze the following job description and convert it into a structured JSON.

CRITICAL RULES:
1. Extract the ORIGINAL company name as "companyName" field — this is the actual hiring company from the job post.
2. In the "description" field, keep the ORIGINAL company name exactly as it is. Do NOT replace it with LedgerBandhu or any other name.
3. Requirements: 5-7 short bullet points.
4. SALARY (MOST CRITICAL): Search the ENTIRE text very carefully for any salary information:
   - Look for AED, USD, INR, ₹, Rs, Lacs, Lakhs, LPA, CTC, package, pay, compensation, monthly salary, annual salary.
   - If text starts with "SALARY_DETECTED:" — use that exact value DIRECTLY, do not modify it.
   - For NaukriGulf: salary often appears as "AED X,XXX - X,XXX" format.
   - If found, return it as-is (e.g., "AED 7,000 - 12,000 per month" or "15 LPA" or "₹8L - 12L per year").
   - ONLY return "Not Disclosed" if absolutely no salary or pay information exists anywhere in the text.
5. experienceLevel MUST be one of exactly: "0-2 Years", "2-5 Years", "5-10 Years", "10+ Years".
6. educationLevel MUST be one of exactly: "10th", "12th", "ITI", "Diploma", "Graduation", "Post Grad", "PhD".

7. GENERATE a professional LinkedIn post in the "linkedInPost" field using EXACTLY this format:
   [Company Name] is Hiring | [Job Title]
   Location: [Location]
   Experience: [Experience Level]
   Salary: [Salary — use actual value, NOT "Not Disclosed" if salary was found]
   Posted On: [Current Date]
   Openings: [Number]
   Department: [Category]

   Job Overview
   [2-3 sentence overview mentioning the company name]

   Key Responsibilities
   [5-7 bullet points from the post]

   Key Skills & Requirements
   [5-7 bullet points of skills/education]

   How to Apply
   Comment "Interested" below and we will reach out to you with the next steps.
   Tag someone who might be the perfect fit for this role.

   [Relevant Hashtags including #LedgerBandhu]

Return ONLY this JSON:
{
  "companyName": "String — actual hiring company name from the job post",
  "title": "String",
  "description": "HTML String (min 3 paragraphs, company name replaced with LedgerBandhu)",
  "location": "String",
  "salary": "String — REQUIRED, use actual value from text",
  "requirements": ["Array of 5-7 strings"],
  "category": "String",
  "openings": 1,
  "educationLevel": "Graduation",
  "experienceLevel": "0-2 Years",
  "linkedInPost": "String - The formatted LinkedIn post"
}

Context: ${scrapedContext || 'No description found from URL'}
URL: ${url}
`;

        const chatCompletion = await groq.chat.completions.create({
            messages: [
                { role: "system", content: "Output valid JSON only." },
                { role: "user", content: sysPrompt }
            ],
            model: "llama-3.3-70b-versatile",
            response_format: { type: "json_object" },
            temperature: 0.3
        });

        const jobData = JSON.parse(chatCompletion.choices[0]?.message?.content || "{}");
        if (!jobData.title) throw new Error("AI failed to extract job details.");

        // If a manual category was provided, override the AI's guess
        if (overrideCategory) {
            jobData.category = overrideCategory;
        }

        // Save the original company name before stripping it from jobData
        const companyName = jobData.companyName || 'Unknown Company';
        delete jobData.companyName; // Don't store companyName in the Job document

        const fiftyDaysFromNow = new Date(Date.now() + 50 * 24 * 60 * 60 * 1000);

        // Normalize experienceLevel to valid enum values
        const normalizeExperience = (raw) => {
            if (!raw) return '0-2 Years';
            const str = raw.toString().toLowerCase().replace(/\s+/g, '');
            // Extract min years from strings like "12-20", "5+", "10 to 15"
            const num = parseInt(str.match(/\d+/)?.[0] || '0', 10);
            if (num >= 10) return '10+ Years';
            if (num >= 5)  return '5-10 Years';
            if (num >= 2)  return '2-5 Years';
            return '0-2 Years';
        };

        // Normalize educationLevel to valid enum values
        const normalizeEducation = (raw) => {
            if (!raw) return 'Graduation';
            const s = raw.toString().toLowerCase();
            if (s.includes('phd') || s.includes('doctorate')) return 'PhD';
            if (s.includes('post') || s.includes('mba') || s.includes('master')) return 'Post Grad';
            if (s.includes('diploma')) return 'Diploma';
            if (s.includes('iti')) return 'ITI';
            if (s.includes('12') || s.includes('hsc') || s.includes('intermediate')) return '12th';
            if (s.includes('10') || s.includes('ssc') || s.includes('matric')) return '10th';
            return 'Graduation';
        };

        const newJob = new Job({
            ...jobData,
            experienceLevel: normalizeExperience(jobData.experienceLevel),
            educationLevel: normalizeEducation(jobData.educationLevel),
            employerId: adminId,
            jobStatus: "approved",
            postedByAdmin: true,
            isActive: true,
            deadline: fiftyDaysFromNow,
            externalUrl: url,
            isSponsored: isSponsored
        });

        await newJob.save();
        logDebug(`Saved Job: ${newJob.title}`);

        // Cross-post to LinkedIn
        let linkedInStatus = { success: false, error: 'Not attempted' };
        if (process.env.LINKEDIN_ACCESS_TOKEN) {
            linkedInStatus = await postJobToLinkedIn(newJob);
        }

        return { success: true, job: newJob, companyName, linkedIn: linkedInStatus };

    } catch (err) {
        logDebug(`Job Automation Failure: ${err.message}`);
        console.error("Internal Job Automation Error:", err);
        throw err;
    }
};

export const generateJobFromAI = async (req, res) => {
    try {
        const { url, fallbackText, category, isSponsored } = req.body;
        if (!url) return res.status(400).json({ error: "No URL provided." });

        const result = await processJobAutomation(url, req.user?._id, fallbackText, category, isSponsored);

        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// postScrapedJob is now largely handled by processJobAutomation for convenience
export const postScrapedJob = async (req, res) => {
    try {
        const jobData = req.body;
        if (!jobData._id) {
            return res.status(400).json({ error: "Job ID is required for confirmation." });
        }

        // Update the existing job with the edited data from review
        const updatedJob = await Job.findByIdAndUpdate(
            jobData._id,
            { ...jobData },
            { new: true }
        );

        if (!updatedJob) {
            return res.status(404).json({ error: "Job not found." });
        }

        res.status(200).json({ success: true, job: updatedJob });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const conductMockInterview = async (req, res) => {
    try {
        const { jobId, messages } = req.body;
        
        if (!process.env.GROQ_API_KEY) {
            return res.status(500).json({ error: "AI Service is currently offline (Key missing)." });
        }

        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ error: "Job context not found." });
        }

        const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

        const sysPrompt = `
You are an expert Finance HR Interviewer for 'LedgerBandhu', a premium career platform. Your goal is to conduct a professional, high-standard mock interview for the position of '${job.title}'.

CONTEXT:
Job Description: ${job.description.replace(/<[^>]*>?/gm, '')}
Job Requirements: ${job.requirements.join(', ')}

INTERVIEW RULES:
1. Stay in character as a professional, polite, but firm LedgerBandhu recruiter.
2. Ask only ONE question at a time.
3. Base your questions on the specific job requirements, skills, and professional finance standards.
4. If this is the very beginning, welcome the candidate to LedgerBandhu and ask them to briefly introduce themselves.
5. If the user's answer is too short or vague, ask them to elaborate on specific experiences.
6. Do not provide immediate feedback after every answer unless it is naturally part of a follow-up question.
7. Keep the tone sophisticated, encouraging, and focused on identifying the best talent.

Current conversation history is provided below. Respond with only the next logical interview question or recruiter response.
`;

        const chatCompletion = await groq.chat.completions.create({
            messages: [
                { role: "system", content: sysPrompt },
                ...(messages || [])
            ],
            model: "llama-3.3-70b-versatile",
            temperature: 0.7,
            max_tokens: 1024
        });

        const aiResponse = chatCompletion.choices[0]?.message?.content || "I apologize, I'm having trouble connecting to the interview system. Please try again.";

        res.status(200).json({ message: aiResponse });
        
    } catch (error) {
        console.error("Mock Interview Error:", error);
        res.status(500).json({ error: "Failed to connect with the AI Interviewer." });
    }
};

export const generateDailyDigestTask = async () => {
    try {
        const parser = new Parser();
        logDebug("DAILY_DIGEST: Checking for existing digest for today...");

        // Check if a digest was already created today (IST context)
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);
        const endOfToday = new Date();
        endOfToday.setHours(23, 59, 59, 999);

        const alreadyExists = await DailyDigest.findOne({
            createdAt: { $gte: startOfToday, $lte: endOfToday }
        });

        if (alreadyExists) {
            logDebug(`DAILY_DIGEST: Digest already exists for today: ${alreadyExists.title}. Skipping generation.`);
            return alreadyExists;
        }

        logDebug("DAILY_DIGEST: No digest found for today. Fetching news...");
        // Google News RSS for Indian Finance
        const feed = await parser.parseURL('https://news.google.com/rss/search?q=finance+india+when:1d&hl=en-IN&gl=IN&ceid=IN:en');
        
        if (!feed.items || feed.items.length === 0) {
            logDebug("DAILY_DIGEST: No news items found in RSS feed. Aborting.");
            throw new Error("No news items found in Google News RSS.");
        }

        const topArticles = feed.items.slice(0, 10).map(item => ({
            title: item.title,
            link: item.link
        }));

        logDebug(`DAILY_DIGEST: Found ${topArticles.length} articles. Initiating AI generation...`);

        if (!process.env.GROQ_API_KEY) {
            throw new Error("AI Service is offline.");
        }

        const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
        const today = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

        const sysPrompt = `
You are a Lead Financial Editor and SEO Expert for 'LedgerBandhu'. Write a highly comprehensive, SEO-optimized "Daily Finance Digest" for ${today}.

HEADLINES TO SUMMARIZE:
${topArticles.map((a, i) => `${i+1}. ${a.title}`).join('\n')}

SEO & CONTENT RULES:
1. WORD COUNT: Provide extensive content (minimum 1000-1200 words).
2. MAGAZINE-STYLE FORMATTING:
   - Use <h2> for major sections.
   - Use <h3> for specific sub-topics within sections.
   - Use <blockquote> for significant quotes, market insights, or "Analyst Bites".
   - Use <hr /> to separate major sections visually.
   - Use <ul> and <li> for lists of data points, stocks to watch, or regulatory changes.
   - Use <strong> for emphasis on key figures, company names, or dates.
3. KEYWORD OPTIMIZATION:
   - Identify 2-3 "Focus Keywords".
   - Include keywords in the Title, first paragraph, and at least two subheadings.
4. READABILITY: Use short paragraphs (2-3 sentences).
5. SECTIONS REQUIRED:
   - Captivating Introduction.
   - Global Macro & Market Sentiment.
   - Indian Equity Markets (Deep dive).
   - Sectoral Spotlight.
   - Regulatory Headlines (RBI, SEBI, GST).
   - Corporate Actions & Earning Highlights.
   - 'LedgerBandhu Analyst Outlook'.

You MUST return ONLY a JSON object:
{
  "title": "String - Catchy, SEO-optimized title",
  "content": "String - Rich HTML body (using <h2>, <h3>, <p>, <ul>, <li>, <strong>, <blockquote>, <hr />)",
  "excerpt": "String - Professional meta description",
  "keywords": ["Array of 10 tags"]
}
`;

        const chatCompletion = await groq.chat.completions.create({
            messages: [
                { role: "system", content: "You output strictly valid JSON. Provide highly detailed, lengthy analysis." },
                { role: "user", content: sysPrompt }
            ],
            model: "llama-3.3-70b-versatile",
            response_format: { type: "json_object" },
            temperature: 0.7
        });

        const blogData = JSON.parse(chatCompletion.choices[0]?.message?.content || "{}");
        
        if (!blogData.title || !blogData.content) {
             throw new Error("AI returned malformed digest data");
        }
        
        // Simple slug generation
        const slug = blogData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now().toString().slice(-4);

        // Use Unsplash source API for reliable finance-themed thumbnails
        const unsplashKeywords = ['finance', 'banking', 'stock-market', 'economy', 'investment'];
        const keyword = unsplashKeywords[Math.floor(Math.random() * unsplashKeywords.length)];
        const dynamicThumbnail = `https://source.unsplash.com/1280x720/?${keyword},india&sig=${Date.now()}`;
        
        const newDigest = new DailyDigest({
            title: blogData.title,
            slug: slug,
            content: blogData.content,
            excerpt: blogData.excerpt,
            keywords: blogData.keywords,
            thumbnail: dynamicThumbnail
        });

        await newDigest.save();
        logDebug(`DAILY_DIGEST: Successfully saved: ${blogData.title}`);
        console.log(`[AI Worker] Daily Digest generated successfully: ${blogData.title}`);
        return newDigest;

    } catch (error) {
        logDebug(`DAILY_DIGEST: Task failed with error: ${error.message}`);
        console.error("AI News Generation Error:", error);
        throw error;
    }
};

export const generateDailyDigest = async (req, res) => {
    try {
        const newDigest = await generateDailyDigestTask();
        res.status(201).json({ message: "Digest Generated", digest: newDigest });
    } catch (error) {
        res.status(500).json({ error: "Failed to generate Daily News Digest.", details: error.message });
    }
};

export const fixExistingThumbnails = async (req, res) => {
    try {
        const digests = await DailyDigest.find({});
        let updatedCount = 0;

        for (const digest of digests) {
            // If thumbnail is missing, broken (unsplash), or specifically requested to be AI generated
            const isBroken = !digest.thumbnail || digest.thumbnail.includes('unsplash.com');
            
            if (isBroken) {
                const imagePrompt = encodeURIComponent(`Premium finance news: ${digest.title}. Modern professional aesthetic, 4k resolution.`);
                digest.thumbnail = `https://image.pollinations.ai/prompt/${imagePrompt}?width=1280&height=720&nologo=true&seed=${Math.floor(Math.random() * 1000000)}`;
                await digest.save();
                updatedCount++;
            }
        }

        res.status(200).json({ message: `${updatedCount} posts updated with AI-generated finance thumbnails.` });
    } catch (error) {
        console.error("Fix Thumbnails Error:", error);
        res.status(500).json({ error: "Failed to fix thumbnails." });
    }
};

export const scoreResume = async (req, res) => {
    try {
        if (!process.env.GROQ_API_KEY) {
            return res.status(500).json({ error: "AI Service Configuration Missing (GROQ_API_KEY). Please check Vercel Environment Variables." });
        }

        if (!req.file) {
            return res.status(400).json({ error: "Please upload a resume file (PDF or Docx)." });
        }

        let text = "";
        const buffer = req.file.buffer;

        if (req.file.mimetype === 'application/pdf') {
            const data = await pdf(buffer);
            text = data.text;
        } else if (req.file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            const result = await mammoth.extractRawText({ buffer });
            text = result.value;
        } else {
            return res.status(400).json({ error: "Unsupported file format. Please upload PDF or Docx." });
        }

        if (text.length < 50) {
            return res.status(400).json({ error: "Could not extract enough text from the resume. Please ensure it's not an image-only skip." });
        }

        const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
        const sysPrompt = `
You are an expert Finance Talent Auditor for LedgerBandhu. Your goal is to analyze the provided resume text and give a "Finance Alpha Score" (0-100) and actionable advice for a career in banking, fintech, or corporate finance.

RESUME TEXT:
${text.substring(0, 8000)}

ANALYSIS GUIDELINES:
1. High Score (80+) requires strong technical skills (DCF, IFRS, SQL, CFA path), clear formatting, and quantified achievements.
2. Moderate Score (50-70) means the candidate has the basics but lacks advanced certifications or finance-specific keywords.
3. Low Score (<50) means the resume is not optimized for Automated Tracking Systems (ATS) or lacks core finance terminology.

You MUST respond ONLY with a valid JSON object:
{
  "score": "Number (0-100)",
  "summary": "String (2-3 sentences of overall feedback)",
  "keywordGaps": ["Array of 5-8 missing high-impact finance keywords"],
  "formattingTips": ["Array of 3 specific formatting or ATS improvements"],
  "strengths": ["Array of 3 strongest points in the resume"]
}
`;

        const chatCompletion = await groq.chat.completions.create({
            messages: [
                { role: "system", content: "You are a professional resume auditor. Output strictly valid JSON." },
                { role: "user", content: sysPrompt }
            ],
            model: "llama-3.3-70b-versatile",
            response_format: { type: "json_object" },
            temperature: 0.5
        });

        const analysis = JSON.parse(chatCompletion.choices[0]?.message?.content || "{}");
        res.status(200).json(analysis);

    } catch (error) {
        console.error("Resume Score Error:", error);
        res.status(500).json({ 
            error: "Internal Server Error during Resume Analysis.",
            details: error.message
        });
    }
};

export const generateRoadmap = async (req, res) => {
    try {
        const { currentRole, targetRole } = req.body;

        if (!currentRole || !targetRole) {
            return res.status(400).json({ error: "Please provide both current and target roles." });
        }

        const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
        const sysPrompt = `
You are a Senior Career Strategist at LedgerBandhu. Build a detailed 3-year career roadmap to help a user transition from '${currentRole}' to '${targetRole}' in the finance industry.

ROAMAP REQUIREMENTS:
1. Divide the roadmap into 3 distinctive years.
2. For each year, provide:
   - "title": A theme for that year.
   - "actions": 3 specific professional actions (e.g., job switch, project type).
   - "certifications": Relevant exams/certs (CFA, FRM, NISM, NCMP, etc.).
   - "targetSkills": 3 technical or soft skills to master.

You MUST respond ONLY with a valid JSON object:
{
  "goal": "String - The target career destination",
  "roadmaps": [
    {
      "year": "Year 1",
      "title": "String",
      "actions": ["Array of 3 strings"],
      "certifications": ["Array of 2-3 strings"],
      "targetSkills": ["Array of 3 strings"]
    },
    {
       "year": "Year 2",
       ... (repeat for Year 3)
    }
  ]
}
`;

        const chatCompletion = await groq.chat.completions.create({
            messages: [
                { role: "system", content: "You are a career strategist. Output strictly valid JSON." },
                { role: "user", content: sysPrompt }
            ],
            model: "llama-3.3-70b-versatile",
            response_format: { type: "json_object" },
            temperature: 0.7
        });

        const roadmap = JSON.parse(chatCompletion.choices[0]?.message?.content || "{}");
        res.status(200).json(roadmap);

    } catch (error) {
        console.error("Roadmap Error:", error);
        res.status(500).json({ error: "Failed to generate roadmap. Please try again later." });
    }
};
