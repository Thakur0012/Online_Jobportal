import { Helmet } from 'react-helmet-async';

const BASE_URL = 'https://www.ledgerbandhu.com';

/**
 * SeoHead — drop this into any page component to set per-page SEO tags.
 *
 * Props:
 *  title       — <title> text (site name is appended automatically)
 *  description — meta description
 *  canonical   — full canonical URL (defaults to current path from window.location)
 *  ogImage     — optional OG image URL
 *  noIndex     — set true on private/auth pages (dashboard, admin, profile, etc.)
 */
const SeoHead = ({
    title,
    description,
    canonical,
    ogImage,
    noIndex = false,
}) => {
    const canonicalUrl = canonical || (typeof window !== 'undefined'
        ? `${BASE_URL}${window.location.pathname}`
        : BASE_URL);

    const fullTitle = title
        ? `${title} | LedgerBandhu`
        : 'LedgerBandhu — Find Your Dream Finance & Banking Job in India';

    const metaDesc = description ||
        'India\'s most trusted finance job portal. Browse 5 lakh+ jobs in Banking, Accountancy, Fintech & Finance — all in one place.';

    return (
        <Helmet>
            {/* ── Core ────────────────────────────────────── */}
            <title>{fullTitle}</title>
            <meta name="description" content={metaDesc} />
            <link rel="canonical" href={canonicalUrl} />
            {noIndex && <meta name="robots" content="noindex, nofollow" />}

            {/* ── Open Graph ──────────────────────────────── */}
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={metaDesc} />
            <meta property="og:url" content={canonicalUrl} />
            <meta property="og:type" content="website" />
            <meta property="og:site_name" content="LedgerBandhu" />
            {ogImage && <meta property="og:image" content={ogImage} />}

            {/* ── Twitter Card ────────────────────────────── */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={metaDesc} />
            {ogImage && <meta name="twitter:image" content={ogImage} />}
        </Helmet>
    );
};

export default SeoHead;
