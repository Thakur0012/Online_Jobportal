import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Newspaper, Calendar, ArrowRight, Sparkles,
    Clock, TrendingUp, BookOpen, Zap
} from 'lucide-react';
import api from '../lib/axios';
import SeoHead from '../components/SeoHead';

const FINANCE_IMAGES = [
    'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1280&h=720&fit=crop',
    'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=1280&h=720&fit=crop',
    'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=1280&h=720&fit=crop',
    'https://images.unsplash.com/photo-1642543492481-44e81e3914a7?w=1280&h=720&fit=crop',
    'https://images.unsplash.com/photo-1535320903710-d993d3d77d29?w=1280&h=720&fit=crop',
    'https://images.unsplash.com/photo-1518183214770-9cffbec72538?w=1280&h=720&fit=crop',
];

const isBrokenUrl = (url) => {
    if (!url) return true;
    if (url.includes('pollinations.ai')) return true;
    if (url.includes('source.unsplash.com')) return true;
    return false;
};

const DigestImage = ({ thumbnail, title, index }) => {
    const fallbackSrc = FINANCE_IMAGES[index % FINANCE_IMAGES.length];
    const initialSrc = isBrokenUrl(thumbnail) ? fallbackSrc : thumbnail;
    return (
        <img
            src={initialSrc}
            alt={title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            onError={(e) => { e.target.onerror = null; e.target.src = fallbackSrc; }}
        />
    );
};

const formatDate = (date) =>
    new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

const DailyDigest = () => {
    const [digests, setDigests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDigests = async () => {
            try {
                const res = await api.get('/news');
                setDigests(res.data);
            } catch (err) {
                console.error('Error fetching news:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchDigests();
    }, []);

    const featured = digests[0] || null;
    const rest = digests.slice(1);

    return (
        <div className="min-h-screen text-[#111111]"
            style={{ background: '#F8F9FA', fontFamily: 'Plus Jakarta Sans, Inter, sans-serif' }}>
            <SeoHead
                title="Daily Finance Digest — AI-Powered Market Insights"
                description="Stay ahead with LedgerBandhu's daily AI-curated finance news covering Indian market trends, banking updates, RBI policy, and economic analysis."
                canonical="https://www.ledgerbandhu.com/daily-digest"
            />

            {/* ── HERO ──────────────────────────────────────────────── */}
            <div className="relative overflow-hidden pt-16 pb-20"
                style={{ background: 'linear-gradient(135deg, #0a0a0f 0%, #111118 50%, #0f0f1a 100%)' }}>
                {/* Orbs */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div style={{ position: 'absolute', top: '-20%', right: '-5%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(249,115,22,0.18) 0%, transparent 65%)', filter: 'blur(60px)' }} />
                    <div style={{ position: 'absolute', bottom: '-10%', left: '5%', width: '350px', height: '350px', background: 'radial-gradient(circle, rgba(234,88,12,0.1) 0%, transparent 65%)', filter: 'blur(50px)' }} />
                </div>
                <div className="absolute inset-0 opacity-[0.04]"
                    style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)', backgroundSize: '48px 48px' }} />

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 mb-6">
                        <span className="flex items-center gap-2 text-[11px] font-black tracking-[0.18em] uppercase px-4 py-2 rounded-full"
                            style={{ background: 'rgba(249,115,22,0.12)', border: '1px solid rgba(249,115,22,0.3)', color: '#FB923C' }}>
                            <motion.span animate={{ scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }} transition={{ duration: 2, repeat: Infinity }}
                                className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                            AI-Powered Financial Intelligence
                        </span>
                    </motion.div>

                    <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                        className="text-4xl sm:text-5xl md:text-6xl font-black tracking-[-0.04em] leading-[1.05] mb-5"
                        style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                        <span className="text-white">Daily Finance </span>
                        <span style={{
                            background: 'linear-gradient(135deg, #FB923C 0%, #F97316 50%, #EA580C 100%)',
                            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', fontStyle: 'italic',
                        }}>Digest</span>
                    </motion.h1>

                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}
                        className="text-base font-medium max-w-xl mx-auto leading-relaxed"
                        style={{ color: 'rgba(255,255,255,0.45)' }}>
                        Stay ahead of the market with our daily AI-curated analysis of Indian market trends, banking updates, and economic shifts.
                    </motion.p>

                    {/* Stats pills */}
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
                        className="flex flex-wrap items-center justify-center gap-3 mt-8">
                        {[
                            { icon: Zap, label: 'AI-Curated Daily' },
                            { icon: TrendingUp, label: 'Market Insights' },
                            { icon: BookOpen, label: 'Deep Analysis' },
                        ].map(({ icon: Icon, label }) => (
                            <span key={label} className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full"
                                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)' }}>
                                <Icon size={10} style={{ color: '#F97316' }} />
                                {label}
                            </span>
                        ))}
                    </motion.div>
                </div>
            </div>

            {/* ── MAIN CONTENT ──────────────────────────────────────── */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

                {loading ? (
                    /* Skeletons */
                    <div className="space-y-6">
                        {/* Featured skeleton */}
                        <div className="animate-pulse rounded-2xl overflow-hidden h-80"
                            style={{ background: 'white', border: '1px solid rgba(0,0,0,0.07)' }}>
                            <div className="h-full skeleton" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="animate-pulse rounded-2xl overflow-hidden"
                                    style={{ background: 'white', border: '1px solid rgba(0,0,0,0.07)' }}>
                                    <div className="h-44 skeleton" />
                                    <div className="p-5 space-y-3">
                                        <div className="h-3 skeleton rounded w-1/3" />
                                        <div className="h-5 skeleton rounded w-4/5" />
                                        <div className="h-3 skeleton rounded w-full" />
                                        <div className="h-3 skeleton rounded w-3/4" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                ) : digests.length === 0 ? (
                    /* Empty State */
                    <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center justify-center py-24 rounded-2xl text-center"
                        style={{ background: 'white', border: '1px solid rgba(0,0,0,0.07)', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5"
                            style={{ background: 'linear-gradient(135deg, #FFF7ED, #FFEDD5)' }}>
                            <Newspaper size={28} style={{ color: '#F97316' }} />
                        </div>
                        <h3 className="text-xl font-black mb-2" style={{ color: '#111111' }}>No Digests Published Yet</h3>
                        <p className="text-sm font-medium mb-6" style={{ color: '#9CA3AF' }}>Come back soon for the latest market insights.</p>
                        <Link to="/jobs"
                            className="flex items-center gap-2 text-sm font-bold px-6 py-3 rounded-xl text-white"
                            style={{ background: 'linear-gradient(135deg, #FB923C, #F97316)', boxShadow: '0 4px 16px rgba(249,115,22,0.35)' }}>
                            Browse Jobs <ArrowRight size={14} />
                        </Link>
                    </motion.div>

                ) : (
                    <div className="space-y-6">

                        {/* ── FEATURED CARD ─────────────────────────────── */}
                        {featured && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="group relative overflow-hidden rounded-2xl cursor-pointer"
                                style={{ boxShadow: '0 8px 40px rgba(0,0,0,0.12)' }}
                                whileHover={{ y: -4, transition: { duration: 0.18 } }}
                            >
                                <Link to={`/daily-digest/${featured.slug}`} className="block">
                                    {/* Image */}
                                    <div className="relative h-[420px] md:h-[480px] overflow-hidden">
                                        <DigestImage thumbnail={featured.thumbnail} title={featured.title} index={0} />
                                        {/* Dark gradient overlay */}
                                        <div className="absolute inset-0"
                                            style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.5) 40%, rgba(0,0,0,0.15) 100%)' }} />

                                        {/* Featured badge */}
                                        <div className="absolute top-5 left-5 z-20">
                                            <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full"
                                                style={{ background: 'linear-gradient(135deg, #FB923C, #F97316)', color: 'white', boxShadow: '0 4px 12px rgba(249,115,22,0.5)' }}>
                                                <Sparkles size={10} />
                                                Featured
                                            </span>
                                        </div>

                                        {/* Content overlay */}
                                        <div className="absolute bottom-0 left-0 right-0 p-8 z-10">
                                            <div className="flex items-center gap-3 mb-3">
                                                <Calendar size={12} style={{ color: '#FB923C' }} />
                                                <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.5)' }}>
                                                    {formatDate(featured.publishedAt)}
                                                </span>
                                            </div>
                                            <h2 className="text-2xl md:text-3xl font-black text-white leading-tight mb-4 group-hover:text-orange-300 transition-colors"
                                                style={{ letterSpacing: '-0.03em', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                                                {featured.title}
                                            </h2>
                                            <p className="text-sm font-medium leading-relaxed mb-5 line-clamp-2"
                                                style={{ color: 'rgba(255,255,255,0.55)' }}>
                                                {featured.excerpt}
                                            </p>
                                            <span className="inline-flex items-center gap-2 text-sm font-bold transition-all"
                                                style={{ color: '#FB923C' }}>
                                                Read Full Analysis
                                                <ArrowRight size={14} className="group-hover:translate-x-1.5 transition-transform duration-200" />
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        )}

                        {/* ── GRID CARDS ────────────────────────────────── */}
                        {rest.length > 0 && (
                            <>
                                <div className="flex items-center gap-3 pt-2">
                                    <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: '#9CA3AF' }}>More Insights</span>
                                    <div className="flex-1 h-px" style={{ background: 'rgba(0,0,0,0.07)' }} />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                    {rest.map((digest, idx) => (
                                        <motion.div
                                            key={digest.slug}
                                            initial={{ opacity: 0, y: 16 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: idx * 0.07 }}
                                            whileHover={{ y: -4, transition: { duration: 0.18 } }}
                                            className="group flex flex-col rounded-2xl overflow-hidden cursor-pointer"
                                            style={{
                                                background: 'white',
                                                border: '1px solid rgba(0,0,0,0.07)',
                                                boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                                                transition: 'border 0.2s, box-shadow 0.2s',
                                            }}
                                            onMouseEnter={e => {
                                                e.currentTarget.style.border = '1px solid rgba(249,115,22,0.25)';
                                                e.currentTarget.style.boxShadow = '0 12px 40px rgba(249,115,22,0.1), 0 4px 16px rgba(0,0,0,0.06)';
                                            }}
                                            onMouseLeave={e => {
                                                e.currentTarget.style.border = '1px solid rgba(0,0,0,0.07)';
                                                e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.04)';
                                            }}
                                        >
                                            <Link to={`/daily-digest/${digest.slug}`} className="flex flex-col flex-1">
                                                {/* Thumbnail */}
                                                <div className="relative h-44 overflow-hidden bg-gray-100">
                                                    {/* Hover top bar */}
                                                    <div className="absolute top-0 left-0 right-0 h-[3px] z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                                        style={{ background: 'linear-gradient(90deg, #FB923C, #F97316, #EA580C)' }} />
                                                    <div className="absolute inset-0 z-10"
                                                        style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 60%)' }} />
                                                    <DigestImage thumbnail={digest.thumbnail} title={digest.title} index={idx + 1} />
                                                    {/* Latest badge */}
                                                    <div className="absolute top-3 right-3 z-20">
                                                        <span className="text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full"
                                                            style={{ background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(8px)', color: 'white', border: '1px solid rgba(255,255,255,0.25)' }}>
                                                            Latest
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Content */}
                                                <div className="p-5 flex flex-col flex-1">
                                                    <div className="flex items-center gap-2 mb-3">
                                                        <Calendar size={11} style={{ color: '#F97316' }} />
                                                        <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#9CA3AF' }}>
                                                            {formatDate(digest.publishedAt)}
                                                        </span>
                                                    </div>
                                                    <h2 className="text-base font-black leading-snug mb-3 group-hover:text-[#F97316] transition-colors flex-1"
                                                        style={{ color: '#111111', letterSpacing: '-0.02em', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                                                        {digest.title}
                                                    </h2>
                                                    <p className="text-xs font-medium leading-relaxed mb-4 line-clamp-2" style={{ color: '#6B7280' }}>
                                                        {digest.excerpt}
                                                    </p>
                                                    <div className="flex items-center gap-1.5 text-xs font-bold pt-3"
                                                        style={{ color: '#F97316', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
                                                        Full Analysis
                                                        <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform duration-200" />
                                                    </div>
                                                </div>
                                            </Link>
                                        </motion.div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DailyDigest;
