import axios from 'axios';

const LINKEDIN_ORG_URN = `urn:li:organization:${process.env.LINKEDIN_ORG_ID || '114964223'}`;
const LINKEDIN_API_URL = 'https://api.linkedin.com/rest/posts';
const SITE_URL = process.env.SITE_URL || 'https://ledger-bandhu.vercel.app';

/**
 * Formats a Job document into a LinkedIn-style post text.
 */
export function formatLinkedInPost(job) {
    // If the job already has an AI-generated post, use it directly
    if (job.linkedInPost) {
        return job.linkedInPost.trim();
    }

    const company = job.companyName || job.employerId?.companyName || 'Ledger Bandhu';
    const jobUrl = `${SITE_URL}/jobs/${job.jobId || job._id}`;

    // Helper to strip HTML and clean text
    const cleanText = (text) => {
        if (!text) return '';
        return text
            .replace(/<[^>]*>?/gm, '') // Strip HTML
            .replace(/&nbsp;/g, ' ')    // Replace &nbsp;
            .replace(/\s+/g, ' ')      // Normalize whitespace
            .trim();
    };

    const description = cleanText(job.description);
    const requirements = Array.isArray(job.requirements) ? job.requirements : [];

    // Split requirements roughly into two sections if they exist
    // Otherwise use some defaults that sound professional
    let responsibilities = '';
    let skills = '';

    if (requirements.length > 0) {
        const mid = Math.ceil(requirements.length / 2);
        responsibilities = requirements.slice(0, mid).map(r => `${r}`).join('\n');
        skills = requirements.slice(mid).map(r => `${r}`).join('\n');
    }

    const postDate = new Date().toLocaleDateString('en-GB', { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
    });

    // Formatting hashtags
    const titleHash = job.title ? `#${job.title.replace(/[^a-zA-Z0-9]/g, '')}` : '';
    const locHash = job.location ? `#${job.location.split(',')[0].replace(/[^a-zA-Z0-9]/g, '')}Jobs` : '';
    const catHash = job.category ? `#${job.category.replace(/[^a-zA-Z0-9]/g, '')}Jobs` : '';

    const post = `Hiring Alert | ${job.title}
Location: ${job.location}
Experience: ${job.experienceLevel || '0-2 Years'}
Salary: ${job.salary && job.salary !== 'Not disclosed' ? job.salary : 'Competitive (as per industry standards)'}
Posted On: ${postDate}
Openings: ${job.openings || 1}
Department: ${job.category}

Job Overview

${description || `We are seeking a skilled ${job.title} to join our team at ${company}. The ideal candidate will be responsible for managing core operations in line with industry standards.`}

Key Responsibilities
${responsibilities || '• Manage financial planning and analysis\n• Monitor budgets and performance metrics\n• Ensure regulatory compliance'}

Key Skills & Requirements
${skills || '• Bachelor’s degree in relevant field\n• Strong analytical and problem-solving skills\n• Proficiency in industry-standard tools'}

How to Apply

Comment "Interested" below and we will reach out to you with the next steps.
Tag someone who might be the perfect fit for this role.

#Hiring ${catHash} ${titleHash} ${locHash} #AccountingJobs #CorporateFinance #HiringNow #LedgerBandhu`;

    return post.trim();
}

/**
 * Posts a job to the Ledger Bandhu LinkedIn Company Page.
 * Requires LINKEDIN_ACCESS_TOKEN and LINKEDIN_ORG_ID in .env
 */
export async function postJobToLinkedIn(job) {
    const token = process.env.LINKEDIN_ACCESS_TOKEN;

    if (!token) {
        console.warn('[LinkedIn] LINKEDIN_ACCESS_TOKEN not set. Skipping LinkedIn post.');
        return { success: false, reason: 'No access token configured' };
    }

    const commentary = formatLinkedInPost(job);

    // Default Org Payload
    let payload = {
        author: LINKEDIN_ORG_URN,
        commentary,
        visibility: 'PUBLIC',
        distribution: {
            feedDistribution: 'MAIN_FEED',
            targetEntities: [],
            thirdPartyDistributionChannels: [],
        },
        lifecycleState: 'PUBLISHED',
        isReshareDisabledByAuthor: false,
    };

    try {
        console.log(`[LinkedIn] Attempting to post to Organization page (${LINKEDIN_ORG_URN})...`);
        const response = await axios.post(LINKEDIN_API_URL, payload, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
                'LinkedIn-Version': '202604',
                'X-Restli-Protocol-Version': '2.0.0',
            },
        });

        const postId = response.headers['x-restli-id'] || response.data?.id;
        console.log(`[LinkedIn] ✅ Job posted successfully to Org page. Post ID: ${postId}`);
        return { success: true, postId };

    } catch (err) {
        const errMsg = err.response?.data?.message || err.message;
        console.warn(`[LinkedIn] ⚠️ Failed to post to Org page: ${errMsg}. Trying personal profile fallback...`);
        
        try {
            // Fetch personal profile URN using v2/userinfo (OpenID)
            const profileRes = await axios.get('https://api.linkedin.com/v2/userinfo', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const personUrn = `urn:li:person:${profileRes.data.sub}`;
            
            payload.author = personUrn;
            
            console.log(`[LinkedIn] Attempting to post to Personal Profile (${personUrn})...`);
            const fallbackResponse = await axios.post(LINKEDIN_API_URL, payload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'LinkedIn-Version': '202401',
                    'X-Restli-Protocol-Version': '2.0.0',
                },
            });
            
            const postId = fallbackResponse.headers['x-restli-id'] || fallbackResponse.data?.id;
            console.log(`[LinkedIn] ✅ Job posted successfully to Personal Profile. Post ID: ${postId}`);
            return { success: true, postId, fallback: true };
            
        } catch (fallbackErr) {
             const fbErrMsg = fallbackErr.response?.data?.message || fallbackErr.message;
             console.error('[LinkedIn] ❌ Failed to post job to personal profile too:', fbErrMsg);
             return { success: false, reason: `Org: ${errMsg} | Personal: ${fbErrMsg}` };
        }
    }
}
