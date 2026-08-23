import { useEffect, useState } from 'react';
import { Briefcase, Facebook, Linkedin, Instagram, Mail, Phone, MapPin, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../lib/axios';
import { useAuthStore } from '../store/authStore';
import { motion, AnimatePresence } from 'framer-motion';

const BASE_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

const DEFAULT_FOOTER = {
    brandTagline: 'LedgerBandhu',
    brandDescription: 'Connecting talent with opportunity. We provide the most comprehensive job search and hiring experience in the industry.',
    quickLinks: [
        { label: 'Home', url: '/' },
        { label: 'Browse Jobs', url: '/jobs' },
        { label: 'AI Interview Coach', url: '/interview-coach' },
        { label: 'Job PDF', url: '/job-pdf' },
        { label: 'Post a Job', url: '/post-job' },
        { label: 'Join as Seeker', url: '/register' },
    ],
    supportLinks: [
        // { label: 'Terms of Service', url: '/terms' },
        // { label: 'Privacy Policy', url: '/privacy' },
        { label: 'Companies ', url: '/companies' },
        { label: 'Community', url: '/community' },
        { label: 'Services', url: '/services' },
        { label: 'FAQ', url: '/faq' },
        { label: 'Contact Us', url: '/contact' },
    ],
    contactAddress: '123 Tech Park, Sector 62, Noida',
    contactPhone: '+91 98765 43210',
    contactEmail: 'support@ledgerbandhu.com',
    socialFacebook: '#',
    socialLinkedin: '#',
    socialInstagram: '#',
    copyrightText: `© ${new Date().getFullYear()} LedgerBandhu. All rights reserved.`,
    copyrightSub: 'Designed with ❤️ for better careers.',
    newsletterHeading: 'Stay Updated',
};

const Footer = () => {
    const { isAuthenticated } = useAuthStore();
    const [subEmail, setSubEmail] = useState('');
    const [subLoading, setSubLoading] = useState(false);
    const [subStatus, setSubStatus] = useState(null); // { type: 'success' | 'error', message: string }
    const [showCaptcha, setShowCaptcha] = useState(false);
    const [isVerified, setIsVerified] = useState(false);
    const [footer, setFooter] = useState(DEFAULT_FOOTER);
    const [branding, setBranding] = useState(() => {
        try {
            const cached = localStorage.getItem('ledgerbandhu_branding');
            return cached ? JSON.parse(cached) : {};
        } catch (e) { return {}; }
    });
    const [loading, setLoading] = useState(!branding.logoUrl);

    const updateFavicon = (url) => {
        if (!url) return;
        const fullUrl = url.startsWith('http') ? url : `${BASE_URL}${url}`;

        // Update standard favicon
        let favicon = document.getElementById('dynamic-favicon');
        if (favicon) favicon.href = fullUrl;

        // Update site icon (apple-touch-icon)
        let siteIcon = document.getElementById('dynamic-siteicon');
        if (siteIcon) siteIcon.href = fullUrl;

        // Update shortcut icon
        let shortcutIcon = document.getElementById('dynamic-shortcut-icon');
        if (shortcutIcon) shortcutIcon.href = fullUrl;

        // Update Windows Tile image
        let tileIcon = document.getElementById('dynamic-tile-icon');
        if (tileIcon) tileIcon.content = fullUrl;
    };

    useEffect(() => {
        if (subStatus) {
            const timer = setTimeout(() => setSubStatus(null), 5000);
            return () => clearTimeout(timer);
        }
    }, [subStatus]);

    const handleSubscribe = async (e) => {
        if (e && e.preventDefault) e.preventDefault();

        if (!isAuthenticated) {
            setSubStatus({ type: 'error', message: 'Please login to subscribe' });
            return;
        }
        if (!subEmail || !subEmail.includes('@')) {
            setSubStatus({ type: 'error', message: 'Please enter a valid email' });
            return;
        }

        if (!showCaptcha) {
            setShowCaptcha(true);
            return;
        }

        if (!isVerified) {
            setSubStatus({ type: 'error', message: 'Please verify you are not a robot' });
            return;
        }

        setSubLoading(true);
        setSubStatus(null);
        try {
            await api.post('/subscribers', { email: subEmail });
            setSubStatus({ type: 'success', message: 'Successfully subscribed!' });
            setSubEmail('');
            setShowCaptcha(false);
            setIsVerified(false);
        } catch (error) {
            setSubStatus({ type: 'error', message: error.response?.data?.message || 'Failed to subscribe' });
        } finally {
            setSubLoading(false);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [footerRes, brandingRes] = await Promise.all([
                    fetch(`${BASE_URL}/api/cms/page/footer`).then(r => r.json()),
                    fetch(`${BASE_URL}/api/cms/branding`).then(r => r.json()),
                ]);
                if (footerRes?.content && Object.keys(footerRes.content).length > 0) {
                    const updated = { ...footerRes.content };
                    if (updated.supportLinks) {
                        updated.supportLinks = updated.supportLinks.map(ln => {
                            if (ln.label === 'Contact Us') return { ...ln, url: '/contact' };
                            if (ln.label === 'Help Center' || ln.label === 'FAQ') return { label: 'FAQ', url: '/faq' };
                            if (ln.label === 'Terms of Service' || ln.label === 'Terms and Conditions') return { label: 'Terms of Service', url: '/terms' };
                            if (ln.label === 'Privacy Policy') return { label: 'Privacy Policy', url: '/privacy' };
                            return ln;
                        });
                        updated.supportLinks = updated.supportLinks.filter(ln => ln.label !== 'Home');
                    }
                    setFooter(prev => ({ ...prev, ...updated }));
                }
                if (brandingRes) {
                    setBranding(brandingRes);
                    localStorage.setItem('ledgerbandhu_branding', JSON.stringify(brandingRes));
                    if (brandingRes.iconUrl) updateFavicon(brandingRes.iconUrl);
                }
            } catch (e) {
                // Use defaults
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const renderLink = (lnk, i, className, children) => {
        const isExternal = lnk.url?.startsWith('http') || lnk.url === '#';
        const content = children || lnk.label;
        return isExternal ? (
            <a key={i} href={lnk.url} className={className}>{content}</a>
        ) : (
            <Link key={i} to={lnk.url} className={className}>{content}</Link>
        );
    };

    const socials = [
        { icon: <Facebook size={17} />, href: footer.socialFacebook, label: 'Facebook' },
        { icon: <Linkedin size={17} />, href: footer.socialLinkedin, label: 'LinkedIn' },
        { icon: <Instagram size={17} />, href: footer.socialInstagram, label: 'Instagram' },
    ];

    return (
        <footer className="relative overflow-hidden pt-24 pb-10 bg-[#111111]">
            {/* Decorative Ambient */}
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#F97316]/30 to-transparent" />
            <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] opacity-[0.05] pointer-events-none filter blur-[120px]"
                style={{ background: 'radial-gradient(circle, #F97316 0%, transparent 70%)' }} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-12 mb-14">

                    {/* Brand */}
                    <div className="space-y-5 sm:col-span-2 lg:col-span-1">
                        <Link to="/" className="flex items-center gap-3 group">
                            {loading && !branding.logoUrl && !branding.footerLogoUrl ? (
                                <div className="h-10 w-40 bg-white/5 animate-pulse rounded-2xl" />
                            ) : (branding.footerLogoUrl || branding.logoUrl) ? (
                                <img
                                    src={(branding.footerLogoUrl || branding.logoUrl)?.startsWith('http') ? (branding.footerLogoUrl || branding.logoUrl) : `${BASE_URL}${branding.footerLogoUrl || branding.logoUrl}`}
                                    alt="LedgerBandhu"
                                    style={{ height: `${branding.footerLogoHeight || branding.logoHeight || 38}px`, width: 'auto' }}
                                    className="object-contain brightness-0 invert opacity-70 group-hover:opacity-100 transition-all duration-500"
                                />
                            ) : (
                                <div className="flex items-center gap-2">
                                    <div className="p-2 rounded-xl bg-[#F97316] shadow-lg shadow-orange-500/30">
                                        <Briefcase className="h-5 w-5 text-white" />
                                    </div>
                                    <span className="text-2xl font-black text-white tracking-tight">
                                        Ledger<span className="text-[#F97316]">Bandhu</span>
                                    </span>
                                </div>
                            )}
                        </Link>
                        <p className="text-gray-400 leading-relaxed text-sm font-medium">{footer.brandDescription}</p>
                        <div className="flex gap-3">
                            {socials.map((social, i) => (
                                <a key={i} href={social.href} aria-label={social.label}
                                    className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-400 hover:text-white transition-all duration-300 hover:-translate-y-1 bg-white/5 border border-white/10 hover:bg-[#F97316] hover:border-[#F97316]">
                                    {social.icon}
                                </a>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="text-white font-bold text-xs uppercase tracking-widest mb-6 relative inline-block">
                            Navigation
                            <span className="absolute -bottom-2 left-0 w-6 h-0.5 bg-[#F97316] rounded-full" />
                        </h3>
                        <ul className="space-y-3">
                            {(footer.quickLinks || []).map((lnk, i) => (
                                <li key={i}>
                                    {renderLink(lnk, i, 'group flex items-center gap-2 text-gray-400 hover:text-white text-sm font-medium transition-all duration-200 hover:translate-x-1', (
                                        <>
                                            <div className="w-1 h-1 rounded-full bg-gray-600 group-hover:bg-[#F97316] transition-all" />
                                            {lnk.label}
                                        </>
                                    ))}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-white font-bold text-xs uppercase tracking-widest mb-6 relative inline-block">
                            Legal & Support
                            <span className="absolute -bottom-2 left-0 w-6 h-0.5 bg-[#F97316] rounded-full" />
                        </h3>
                        <ul className="space-y-3">
                            {(footer.supportLinks || []).map((lnk, i) => (
                                <li key={i}>
                                    {renderLink(lnk, i, 'group flex items-center gap-2 text-gray-400 hover:text-white text-sm font-medium transition-all hover:translate-x-1', (
                                        <>
                                            <ArrowRight size={12} className="text-[#F97316] transition-transform duration-300 group-hover:translate-x-1" />
                                            {lnk.label}
                                        </>
                                    ))}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-white font-bold text-xs uppercase tracking-widest mb-6 relative inline-block">
                            Connect
                            <span className="absolute -bottom-2 left-0 w-6 h-0.5 bg-[#F97316] rounded-full" />
                        </h3>
                        <ul className="space-y-4 text-sm">
                            {[
                                { icon: <MapPin size={15} className="shrink-0 mt-0.5" />, content: footer.contactAddress },
                                { icon: <Phone size={15} className="shrink-0" />, content: footer.contactPhone },
                                { icon: <Mail size={15} className="shrink-0" />, content: footer.contactEmail },
                            ].map((item, i) => item.content && (
                                <li key={i} className="flex items-start gap-3 text-gray-400 font-medium group hover:text-white transition-colors">
                                    <span className="text-[#F97316] p-1.5 bg-white/5 rounded-lg group-hover:bg-[#F97316] group-hover:text-white transition-all duration-300">{item.icon}</span>
                                    <span className="leading-snug pt-1">{item.content}</span>
                                </li>
                            ))}
                        </ul>
                        <div className="mt-8 pt-8 border-t border-white/10">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4">{footer.newsletterHeading}</p>
                            <form onSubmit={handleSubscribe} className="space-y-3">
                                <div className="flex rounded-xl overflow-hidden border border-white/10 focus-within:border-[#F97316]/50 transition-all bg-white/5 p-1">
                                    <input
                                        type="email"
                                        required
                                        value={subEmail}
                                        onChange={(e) => setSubEmail(e.target.value)}
                                        disabled={showCaptcha && !isVerified}
                                        placeholder="Enter your email"
                                        className="flex-1 bg-transparent border-none focus:ring-0 px-3 py-2 text-sm font-medium text-white placeholder-gray-500 outline-none min-w-0"
                                    />
                                    <button
                                        id="footer-newsletter-submit"
                                        type="submit"
                                        disabled={subLoading}
                                        className="px-6 py-2.5 font-black text-[10px] uppercase tracking-widest text-white shrink-0 transition-all hover:opacity-90 disabled:opacity-50 rounded-xl"
                                        style={{ background: 'linear-gradient(135deg, #FB923C, #F97316)' }}
                                    >
                                        {subLoading ? '...' : (showCaptcha && !isVerified ? 'Verify' : 'Subscribe')}
                                    </button>
                                </div>
                                <AnimatePresence>
                                    {showCaptcha && !isVerified && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0, y: -10 }}
                                            animate={{ opacity: 1, height: 'auto', y: 0 }}
                                            exit={{ opacity: 0, height: 0, y: -10 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="bg-[#fafafa] p-3 rounded-lg flex items-center justify-between border border-gray-300 mt-1 shadow-sm">
                                                <div className="flex items-center gap-3 pl-1">
                                                    <div className="relative flex items-center justify-center w-6 h-6">
                                                        <input
                                                            type="checkbox"
                                                            id="robot-check"
                                                            className="w-5 h-5 rounded border-2 border-gray-400 text-green-600 focus:ring-0 cursor-pointer appearance-none checked:bg-green-600 checked:border-green-600 transition-all peer"
                                                            onChange={(e) => {
                                                                const checked = e.target.checked;
                                                                setIsVerified(checked);
                                                                if (checked) {
                                                                    setSubStatus({ type: 'success', message: 'Verification successful' });
                                                                    setTimeout(() => {
                                                                        document.getElementById('footer-newsletter-submit')?.click();
                                                                    }, 500);
                                                                }
                                                            }}
                                                        />
                                                        <svg className="absolute w-3 h-3 text-white pointer-events-none opacity-0 peer-checked:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    </div>
                                                    <label htmlFor="robot-check" className="text-gray-700 text-[13px] font-medium cursor-pointer select-none">
                                                        I'm not a robot
                                                    </label>
                                                </div>
                                                <div className="flex flex-col items-center pr-1">
                                                    <img src="https://www.gstatic.com/recaptcha/api2/logo_48.png" alt="reCAPTCHA" className="w-7 h-7 object-contain" />
                                                    <span className="text-[8px] text-gray-500 mt-0.5 font-medium">reCAPTCHA</span>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                                <AnimatePresence>
                                    {subStatus && (
                                        <motion.p
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className={`text-[10px] font-bold uppercase tracking-wider ${subStatus.type === 'success' ? 'text-emerald-400' : 'text-rose-400'}`}
                                        >
                                            {subStatus.message}
                                        </motion.p>
                                    )}
                                </AnimatePresence>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-10 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500 font-medium">
                    <p>{footer.copyrightText}</p>
                    <div className="flex gap-6">
                        <Link to="/terms" className="hover:text-[#F97316] transition-colors">Terms</Link>
                        <Link to="/privacy" className="hover:text-[#F97316] transition-colors">Privacy</Link>
                        <p className="text-gray-600">
                            Developed by <a href="https://nazrasoftware.com/" target="_blank" rel="noopener noreferrer" className="hover:text-[#F97316] transition-colors underline decoration-dotted underline-offset-4">NazraSoftware</a>
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
