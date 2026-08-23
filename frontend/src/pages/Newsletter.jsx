import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, ArrowRight, FileText, Download, Calendar, Zap, Lock } from 'lucide-react';
import api from '../lib/axios';
import { useAuthStore } from '../store/authStore';
import { Link } from 'react-router-dom';
import SeoHead from '../components/SeoHead';

const Newsletter = () => {
    const [newsletters, setNewsletters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [subEmail, setSubEmail] = useState('');
    const [subLoading, setSubLoading] = useState(false);
    const [subStatus, setSubStatus] = useState(null); // { type: 'success' | 'error', message: string }
    const [showCaptcha, setShowCaptcha] = useState(false);
    const [isVerified, setIsVerified] = useState(false);
    const { isAuthenticated } = useAuthStore();

    useEffect(() => {
        const fetchNewsletters = async () => {
            try {
                const res = await api.get('/newsletters');
                setNewsletters(res.data);
            } catch (error) {
                console.error("Failed to fetch newsletters", error);
            } finally {
                setLoading(false);
            }
        };
        fetchNewsletters();
    }, []);

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

    const getProxyViewUrl = (id) => `${api.defaults.baseURL}/newsletters/${id}/view`;
    const getProxyDownloadUrl = (id) => `${api.defaults.baseURL}/newsletters/${id}/download_file`;

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-[#F97316] border-t-transparent rounded-full animate-spin"></div>
                <p className="font-black italic text-gray-400 uppercase tracking-[0.3em] text-[10px]">Preparing Portfolios</p>
            </div>
        </div>
    );

    return (
        <div className="bg-white min-h-screen pb-20">
            <SeoHead
                title="Finance Job PDF Archive — Weekly Job Digest"
                description="Download or browse our weekly curated finance job PDFs. Jobs sourced from newspapers, classifieds, and verified portals — organized into one structured document."
                canonical="https://www.ledgerbandhu.com/job-pdf"
            />
            {/* Hero Section */}
            <div className="bg-white pt-32 pb-24 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10"
                    style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.07) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.07) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
                <div className="absolute top-0 right-0 w-96 h-96 opacity-20 pointer-events-none"
                    style={{ background: 'radial-gradient(circle, #F47920, transparent 70%)', transform: 'translate(30%, -30%)' }} />
                
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                    <motion.span 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 bg-gray-100 border border-gray-200 text-gray-700 text-xs font-bold uppercase tracking-widest px-5 py-2.5 rounded-full mb-6"
                    >
                        <Mail size={12} className="text-[#F47920]" /> Weekly Job Updates
                    </motion.span>
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl sm:text-5xl md:text-6xl font-black text-[#111111] mb-6 leading-tight"
                    >
                        Premium <br />
                        <span style={{ background: 'linear-gradient(90deg, #F97316, #FB923C)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                            Job PDF Archive
                        </span>
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-gray-500 font-medium text-lg max-w-2xl mx-auto"
                    >
                        Stay ahead in your job search with our weekly job digest. We gather and verify job postings from newspapers, classifieds, and multiple reliable sources, then organize them into a single, structured PDF—so you don't have to search everywhere.
                    </motion.p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20">
                {newsletters.length === 0 ? (
                    <div className="bg-white rounded-3xl p-20 text-center shadow-2xl border border-gray-100">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-500">
                            <Mail size={40} />
                        </div>
                        <h3 className="text-2xl font-black text-[#111111] mb-2">No Job PDF found</h3>
                        <p className="text-gray-400 font-medium">Check back later for our latest updates!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {newsletters.map((newsletter, index) => (
                            <motion.div
                                key={newsletter._id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-[0_20px_50px_rgba(249,115,22,0.15)] transition-all duration-500 border border-gray-100 group"
                            >
                                {/* Image Container */}
                                <div className="relative h-80 overflow-hidden">
                                    <img 
                                        src={newsletter.image.startsWith('http') ? newsletter.image : `${api.defaults.baseURL.replace('/api', '')}${newsletter.image}`} 
                                        alt={newsletter.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
                                        <span className="text-[#111111] text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                                            <Calendar size={14} className="text-[#F47920]" />
                                            {new Date(newsletter.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                        </span>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-8">

                                    <h3 className="text-xl font-black text-[#111111] mb-4 group-hover:text-[#F97316] transition-colors line-clamp-2">
                                        {newsletter.title}
                                    </h3>
                                    
                                    <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                                        {isAuthenticated ? (
                                            <a 
                                                href={getProxyViewUrl(newsletter._id)}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-2 text-[#111111] font-black text-sm hover:text-[#F97316] transition-colors group/btn"
                                            >
                                                Read <ArrowRight size={18} className="transition-transform group-hover/btn:translate-x-1" />
                                            </a>
                                        ) : (
                                            <Link 
                                                to="/login"
                                                className="inline-flex items-center gap-2 text-gray-400 font-black text-sm hover:text-[#F97316] transition-colors group/btn"
                                            >
                                                <Lock size={14} className="opacity-50" /> Read
                                            </Link>
                                        )}
                                        
                                        {isAuthenticated ? (
                                            <a 
                                                href={getProxyDownloadUrl(newsletter._id)}
                                                className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-[#111111] hover:bg-[#F97316] hover:text-[#111111] transition-all shadow-sm"
                                                title="Download PDF"
                                            >
                                                <Download size={18} />
                                            </a>
                                        ) : (
                                            <Link 
                                                to="/login"
                                                className="flex items-center gap-2 bg-gray-50 text-gray-400 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-gray-100 hover:bg-gray-100 hover:text-[#111111] transition-all"
                                            >
                                                <Lock size={12} /> Login to Download
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* Subscription CTA */}
                <motion.div 
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-24 bg-white rounded-[40px] p-12 md:p-20 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-12 border border-gray-100"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#F97316] opacity-[0.05] rounded-full -translate-y-1/2 translate-x-1/2" />
                    <div className="relative z-10 flex-1">
                        <h2 className="text-3xl md:text-4xl font-black text-[#111111] mb-6">
                            Never miss an <span className="text-[#F97316]">Update</span>
                        </h2>
                        <p className="text-gray-400 text-lg font-medium leading-relaxed max-w-lg">
                            Get our latest job PDF alerts, industry insights, and career tips delivered straight to your inbox every week.
                        </p>
                    </div>
                    <div className="relative z-10 flex-1 w-full max-w-md">
                        <form onSubmit={handleSubscribe} className="space-y-4">
                            <div className="flex flex-col gap-4">
                                <div className="flex p-2 bg-white border border-gray-200 rounded-3xl focus-within:ring-2 ring-[#F97316]/30 transition-all">
                                    <input 
                                        type="email" 
                                        required
                                        value={subEmail}
                                        disabled={showCaptcha && !isVerified}
                                        onChange={(e) => setSubEmail(e.target.value)}
                                        placeholder="Enter your email address"
                                        className="bg-transparent border-none focus:ring-0 flex-grow px-6 font-bold text-[#111111] placeholder:text-gray-400 disabled:opacity-50"
                                    />
                                    <button 
                                        id="newsletter-page-submit"
                                        type="submit"
                                        disabled={subLoading}
                                        className="bg-gradient-to-r from-[#F97316] to-[#EA580C] hover:opacity-90 text-[#111111] px-8 py-4 rounded-2xl font-bold transition-all flex items-center gap-2 shrink-0 disabled:opacity-50"
                                    >
                                        {subLoading ? '...' : (showCaptcha && !isVerified ? <>Verify <Zap size={16} className="text-gray-700" /></> : <>Join <Zap size={16} className="text-gray-700" /></>)}
                                    </button>
                                </div>
                                
                                <AnimatePresence>
                                    {showCaptcha && !isVerified && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0, y: -10 }}
                                            animate={{ opacity: 1, height: 'auto', y: 0 }}
                                            exit={{ opacity: 0, height: 0, y: -10 }}
                                            className="overflow-hidden self-end w-full max-w-[280px]"
                                        >
                                            <div className="bg-[#fafafa] p-3 rounded-2xl flex items-center justify-between border border-gray-200 mt-1 shadow-sm">
                                                <div className="flex items-center gap-3 pl-2">
                                                    <div className="relative flex items-center justify-center w-6 h-6">
                                                        <input 
                                                            type="checkbox" 
                                                            id="gulf-robot-check"
                                                            className="w-5 h-5 rounded border-2 border-gray-400 text-green-600 focus:ring-0 cursor-pointer appearance-none checked:bg-green-600 checked:border-green-600 transition-all peer"
                                                            onChange={(e) => {
                                                                const checked = e.target.checked;
                                                                setIsVerified(checked);
                                                                if (checked) {
                                                                    setSubStatus({ type: 'success', message: 'Verification successful' });
                                                                    setTimeout(() => {
                                                                        document.getElementById('newsletter-page-submit')?.click();
                                                                    }, 500);
                                                                }
                                                            }}
                                                        />
                                                        <svg className="absolute w-3 h-3 text-[#111111] pointer-events-none opacity-0 peer-checked:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    </div>
                                                    <label htmlFor="gulf-robot-check" className="text-gray-700 text-[13px] font-bold cursor-pointer select-none">
                                                        I'm not a robot
                                                    </label>
                                                </div>
                                                <div className="flex flex-col items-center pr-2">
                                                    <img src="https://www.gstatic.com/recaptcha/api2/logo_48.png" alt="reCAPTCHA" className="w-7 h-7 object-contain" />
                                                    <span className="text-[8px] text-gray-500 mt-0.5 font-bold">reCAPTCHA</span>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            <AnimatePresence>
                                {subStatus && (
                                    <motion.p 
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className={`text-sm font-bold text-center ${subStatus.type === 'success' ? 'text-emerald-600' : 'text-rose-600'}`}
                                    >
                                        {subStatus.message}
                                    </motion.p>
                                )}
                            </AnimatePresence>
                        </form>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Newsletter;
