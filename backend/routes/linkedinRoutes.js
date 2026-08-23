import express from 'express';
import axios from 'axios';

const router = express.Router();

const CLIENT_ID = process.env.LINKEDIN_CLIENT_ID;
const CLIENT_SECRET = process.env.LINKEDIN_CLIENT_SECRET;
const REDIRECT_URI = `${process.env.BACKEND_URL || 'https://ledger-bandhu.onrender.com'}/api/linkedin/callback`;

// Step 1: Redirect admin to LinkedIn authorization page
router.get('/auth', (req, res) => {
    const scope = encodeURIComponent('w_member_social openid profile email');
    const authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${scope}&state=LedgerBandhu_linkedin_auth`;
    res.redirect(authUrl);
});

// Step 2: LinkedIn redirects here with ?code=xxx
router.get('/callback', async (req, res) => {
    const { code, error, error_description } = req.query;

    if (error) {
        return res.send(`
            <h2 style="color:red">❌ LinkedIn OAuth Error</h2>
            <p>${error}: ${error_description}</p>
        `);
    }

    if (!code) {
        return res.send('<h2 style="color:red">❌ No authorization code received.</h2>');
    }

    try {
        const tokenResponse = await axios.post(
            'https://www.linkedin.com/oauth/v2/accessToken',
            new URLSearchParams({
                grant_type: 'authorization_code',
                code,
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRET,
                redirect_uri: REDIRECT_URI,
            }),
            { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
        );

        const { access_token, expires_in } = tokenResponse.data;
        const expiresInDays = Math.round(expires_in / 86400);

        res.send(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>LinkedIn Access Token</title>
                <style>
                    body { font-family: Inter, sans-serif; max-width: 700px; margin: 60px auto; padding: 20px; background: #f8fafc; }
                    h1 { color: #0a66c2; }
                    .token-box { background: #1e293b; color: #f1f5f9; padding: 20px; border-radius: 12px; word-break: break-all; font-family: monospace; font-size: 13px; margin: 16px 0; }
                    .copy-btn { background: #0a66c2; color: white; border: none; padding: 10px 24px; border-radius: 8px; cursor: pointer; font-size: 14px; font-weight: bold; }
                    .steps { background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; }
                    .steps li { margin: 10px 0; }
                    .tag { background: #fef3c7; color: #92400e; padding: 2px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; }
                </style>
            </head>
            <body>
                <h1>✅ LinkedIn Access Token Generated!</h1>
                <p>Your token is valid for <strong>${expiresInDays} days</strong>. Copy it and add to Render.</p>
                <div class="token-box" id="token">${access_token}</div>
                <button class="copy-btn" onclick="navigator.clipboard.writeText('${access_token}'); this.textContent='✅ Copied!'">📋 Copy Token</button>
                
                <br/><br/>
                <div class="steps">
                    <h3>📌 Next Steps</h3>
                    <ol>
                        <li>Go to <strong>Render Dashboard → ledger-bandhu → Environment</strong></li>
                        <li>Add a new variable: <span class="tag">Key:</span> <code>LINKEDIN_ACCESS_TOKEN</code></li>
                        <li>Paste the token above as the value</li>
                        <li>Click <strong>Save Changes</strong> — Render will redeploy</li>
                        <li>✅ Jobs posted on LedgerBandhu will now auto-post to LinkedIn!</li>
                    </ol>
                </div>
            </body>
            </html>
        `);

    } catch (err) {
        const details = err.response?.data || err.message;
        res.send(`
            <h2 style="color:red">❌ Token Exchange Failed</h2>
            <pre>${JSON.stringify(details, null, 2)}</pre>
        `);
    }
});

// Step 3: Diagnostic route to test posting
router.get('/test', async (req, res) => {
    const token = process.env.LINKEDIN_ACCESS_TOKEN;
    if (!token) return res.json({ error: 'No LINKEDIN_ACCESS_TOKEN found in environment' });

    try {
        const profileRes = await axios.get('https://api.linkedin.com/v2/userinfo', {
            headers: { Authorization: `Bearer ${token}` }
        });
        const personUrn = `urn:li:person:${profileRes.data.sub}`;
        
        let orgResult = 'Not attempted';
        let orgError = null;
        let personalResult = 'Not attempted';
        let personalError = null;

        const payload = {
            commentary: "Test post from Ledger Bandhu Diagnostic Tool! 🚀",
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

        // Try formatting for Org
        try {
            await axios.post('https://api.linkedin.com/rest/posts', {
                ...payload,
                author: `urn:li:organization:${process.env.LINKEDIN_ORG_ID}`
            }, { headers });
            orgResult = 'Success';
        } catch (e) {
            orgError = e.response?.data || e.message;
            
            // Fallback to Person
            try {
                await axios.post('https://api.linkedin.com/rest/posts', {
                    ...payload,
                    author: personUrn
                }, { headers });
                personalResult = 'Success';
            } catch (fallbackE) {
                personalError = fallbackE.response?.data || fallbackE.message;
            }
        }

        res.json({
            status: "Diagnostic Run Complete",
            linkedInUser: profileRes.data.name,
            urn: personUrn,
            results: {
                organizationPostTest: orgResult,
                organizationError: orgError,
                personalProfilePostTest: personalResult,
                personalProfileError: personalError
            }
        });

    } catch (e) {
        res.json({ error: "Failed to authenticate LinkedIn Token", details: e.response?.data || e.message });
    }
});

export default router;
