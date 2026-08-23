import Parser from 'rss-parser';
import { processJobAutomation, logDebug } from '../controllers/aiController.js';

export const runJobAutomation = async () => {
    console.log('[Job Automation] Starting 4-hour cycle...');
    const parser = new Parser();
    
    try {
        // Query refined for India finance jobs from Google News RSS
        // Focused on CA, CMA, CS, CFA, ACCA as requested
        const query = encodeURIComponent('CA CMA CS CFA ACCA "Chartered Accountant" "Cost Accountant" "Company Secretary" jobs India');
        const feedUrl = `https://news.google.com/rss/search?q=${query}+when:1d&hl=en-IN&gl=IN&ceid=IN:en`;
        
        logDebug(`JOB_AUTO: Fetching jobs with query: ${query}`);
        const feed = await parser.parseURL(feedUrl);
        
        if (!feed.items || feed.items.length === 0) {
            logDebug('[Job Automation] No new jobs found in feed.');
            return;
        }

        // Prioritize items that contain our target keywords in the title
        const targetKeywords = ['CA', 'CMA', 'CS', 'CFA', 'ACCA', 'Accountant', 'Finance', 'Auditor'];
        const prioritizedItems = feed.items.filter(item => 
            targetKeywords.some(kw => item.title.toUpperCase().includes(kw.toUpperCase()))
        );

        // Fallback to original items if none match, then take top 5
        const itemsToProcess = (prioritizedItems.length > 0 ? prioritizedItems : feed.items).slice(0, 5);
        
        let successCount = 0;
        const maxPerCycle = 1; // The user asked for "one job" every 4 hours

        for (const item of itemsToProcess) {
            if (successCount >= maxPerCycle) break;

            logDebug(`JOB_AUTO: Processing article: ${item.title}`);
            try {
                const result = await processJobAutomation(item.link);
                if (result.success) {
                    logDebug(`JOB_AUTO: Successfully posted: ${item.title}`);
                    successCount++;
                } else if (result.message === "Duplicate") {
                    logDebug(`JOB_AUTO: Skipping duplicate: ${item.title}`);
                }
            } catch (err) {
                logDebug(`JOB_AUTO: Failed for ${item.title}: ${err.message}`);
            }
        }

        console.log(`[Job Automation] Cycle finished. Posted ${successCount} jobs.`);

    } catch (error) {
        console.error('[Job Automation] RSS Fetch Error:', error.message);
    }
};
