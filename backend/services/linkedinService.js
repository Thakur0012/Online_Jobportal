import axios from 'axios';

/**
 * Service to handle automatic posting to LinkedIn profiles or organizations.
 * Requires LINKEDIN_ACCESS_TOKEN and LINKEDIN_ORG_ID in environment variables.
 */
export const postJobToLinkedIn = async (job) => {
    const token = process.env.LINKEDIN_ACCESS_TOKEN;
    const orgId = process.env.LINKEDIN_ORG_ID;

    if (!token) {
        console.warn('[LinkedIn Service] LINKEDIN_ACCESS_TOKEN not found. Skipping post.');
        return { success: false, error: 'Token missing' };
    }

    // Helper to extract a readable error string from LinkedIn API error responses
    const extractError = (err) => {
        const data = err.response?.data;
        if (!data) return err.message;
        if (typeof data === 'string') return data;
        return data.message || data.error || data.errorDetails || JSON.stringify(data);
    };

    try {
        // 1. Identify the user (URN)
        const profileRes = await axios.get('https://api.linkedin.com/v2/userinfo', {
            headers: { Authorization: `Bearer ${token}` }
        });
        const personUrn = `urn:li:person:${profileRes.data.sub}`;

        // 2. Prepare the payload
        const jobUrl = `${process.env.FRONTEND_URL || 'https://www.ledgerbandhu.com'}/job/${job.jobId || job._id}`;
        const commentary = `New Opportunity Alert at LedgerBandhu!\n\nPosition: ${job.title}\nCategory: ${job.category}\nLocation: ${job.location}\nSalary: ${job.salary}\n\nApply here: ${jobUrl}\n\n#FinanceJobs #Accounting #CA #CFA #JobAlert #IndiaFinance #LedgerBandhu`;

        const payload = {
            commentary,
            visibility: "PUBLIC",
            distribution: { feedDistribution: "MAIN_FEED", targetEntities: [], thirdPartyDistributionChannels: [] },
            lifecycleState: "PUBLISHED",
            isReshareDisabledByAuthor: false
        };

        const headers = {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            'LinkedIn-Version': '202604',
            'X-Restli-Protocol-Version': '2.0.0',
        };

        // 3. Try posting to Organization first, then fallback to Personal Profile
        if (orgId) {
            try {
                console.log(`[LinkedIn Service] Attempting to post to Organization: ${orgId}`);
                await axios.post('https://api.linkedin.com/rest/posts', {
                    ...payload,
                    author: `urn:li:organization:${orgId}`
                }, { headers });
                console.log('[LinkedIn Service] Successfully posted to Organization Page.');
                return { success: true, target: 'organization' };
            } catch (orgErr) {
                const orgErrorMsg = extractError(orgErr);
                console.error('[LinkedIn Service] Org post failed:', orgErrorMsg);
                console.error('[LinkedIn Service] Falling back to personal profile...');
            }
        }

        // Fallback to Personal Profile
        console.log(`[LinkedIn Service] Attempting to post to Personal Profile: ${personUrn}`);
        await axios.post('https://api.linkedin.com/rest/posts', {
            ...payload,
            author: personUrn
        }, { headers });
        console.log('[LinkedIn Service] Successfully posted to Personal Profile.');

        return { success: true, target: 'personal' };

    } catch (err) {
        const errorMessage = extractError(err);
        console.error('[LinkedIn Service] Final post failure:', errorMessage);
        return { success: false, error: errorMessage };
    }
};
