import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Search, HelpCircle, User, Briefcase, Globe, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../lib/axios';
import SeoHead from '../components/SeoHead';

const FAQ = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeIdx, setActiveIdx] = useState(null);
    const [faqs, setFaqs] = useState([]);
    const [loading, setLoading] = useState(true);

    const categoryIcons = {
        'General': Globe,
        'For Job Seekers': User,
        'For Employers': Briefcase,
    };

    useEffect(() => {
        const fetchFAQs = async () => {
            try {
                const res = await api.get('/faqs');
                const data = res.data.filter(f => f.isActive);
                const groups = ['General', 'For Job Seekers', 'For Employers'].map(cat => ({
                    category: cat,
                    Icon: categoryIcons[cat] || HelpCircle,
                    questions: data.filter(f => f.category === cat).map(f => ({ q: f.question, a: f.answer })),
                })).filter(g => g.questions.length > 0);
                setFaqs(groups);
            } catch (error) {
                console.error('Error fetching FAQs:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchFAQs();
    }, []);

    const filteredFaqs = faqs.map(cat => ({
        ...cat,
        questions: cat.questions.filter(q =>
            q.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
            q.a.toLowerCase().includes(searchTerm.toLowerCase())
        ),
    })).filter(cat => cat.questions.length > 0);

    const toggleFAQ = (idx) => setActiveIdx(activeIdx === idx ? null : idx);

    return (
        <div className="min-h-screen" style={{ background: '#F8F9FA', fontFamily: 'Plus Jakarta Sans, Inter, sans-serif' }}>
            <SeoHead
                title="FAQ — Frequently Asked Questions"
                description="Find answers to common questions about LedgerBandhu — India's leading finance job portal. Learn how to apply for jobs, post vacancies, and more."
                canonical="https://www.ledgerbandhu.com/faq"
            />

            {/* ── HERO ──────────────────────────────────────────────────── */}
            <div className="relative overflow-hidden pt-16 pb-20"
                style={{ background: 'linear-gradient(135deg, #0a0a0f 0%, #111118 50%, #0f0f1a 100%)' }}>
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div style={{ position: 'absolute', top: '-20%', right: '-5%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(249,115,22,0.18) 0%, transparent 65%)', filter: 'blur(60px)' }} />
                    <div style={{ position: 'absolute', bottom: '-10%', left: '5%', width: '350px', height: '350px', background: 'radial-gradient(circle, rgba(234,88,12,0.1) 0%, transparent 65%)', filter: 'blur(50px)' }} />
                </div>
                <div className="absolute inset-0 opacity-[0.04]"
                    style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)', backgroundSize: '48px 48px' }} />

                <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
                    <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 mb-6">
                        <span className="flex items-center gap-2 text-[11px] font-black tracking-[0.18em] uppercase px-4 py-2 rounded-full"
                            style={{ background: 'rgba(249,115,22,0.12)', border: '1px solid rgba(249,115,22,0.3)', color: '#FB923C' }}>
                            <HelpCircle size={12} />
                            Frequently Asked Questions
                        </span>
                    </motion.div>

                    <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                        className="text-4xl sm:text-5xl md:text-6xl font-black tracking-[-0.04em] leading-[1.05] mb-5"
                        style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                        <span className="text-white">Got </span>
                        <span style={{
                            background: 'linear-gradient(135deg, #FB923C 0%, #F97316 50%, #EA580C 100%)',
                            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                        }}>Questions?</span>
                    </motion.h1>

                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}
                        className="text-base font-medium max-w-md mx-auto leading-relaxed mb-10"
                        style={{ color: 'rgba(255,255,255,0.45)' }}>
                        Everything you need to know about LedgerBandhu — for job seekers, employers, and everyone in between.
                    </motion.p>

                    {/* Search bar */}
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
                        className="relative max-w-xl mx-auto group">
                        <Search size={16} className="absolute left-5 top-1/2 -translate-y-1/2 pointer-events-none transition-colors duration-200"
                            style={{ color: 'rgba(255,255,255,0.3)' }} />
                        <input
                            type="text"
                            placeholder="Search questions..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-5 py-4 rounded-xl text-sm font-semibold focus:outline-none transition-all"
                            style={{
                                background: 'rgba(255,255,255,0.07)',
                                border: '1.5px solid rgba(255,255,255,0.1)',
                                color: 'white',
                            }}
                            onFocus={e => { e.currentTarget.style.border = '1.5px solid rgba(249,115,22,0.4)'; e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
                            onBlur={e => { e.currentTarget.style.border = '1.5px solid rgba(255,255,255,0.1)'; e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; }}
                        />
                    </motion.div>
                </div>
            </div>

            {/* ── MAIN CONTENT ──────────────────────────────────────────── */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">

                {loading ? (
                    /* Skeletons */
                    <div className="space-y-3">
                        {[1, 2, 3, 4, 5].map(i => (
                            <div key={i} className="h-16 rounded-2xl animate-pulse"
                                style={{ background: 'white', border: '1px solid rgba(0,0,0,0.07)' }} />
                        ))}
                    </div>

                ) : filteredFaqs.length > 0 ? (
                    filteredFaqs.map((category, catIdx) => {
                        const { Icon } = category;
                        return (
                            <motion.div key={catIdx}
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: catIdx * 0.08 }}>

                                {/* Category header */}
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                                        style={{ background: 'linear-gradient(135deg, #FFF7ED, #FFEDD5)', border: '1px solid rgba(249,115,22,0.2)' }}>
                                        <Icon size={16} style={{ color: '#F97316' }} />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: '#9CA3AF' }}>
                                        {category.category}
                                    </span>
                                    <div className="flex-1 h-px" style={{ background: 'rgba(0,0,0,0.07)' }} />
                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                                        style={{ background: 'rgba(249,115,22,0.08)', color: '#F97316', border: '1px solid rgba(249,115,22,0.15)' }}>
                                        {category.questions.length}
                                    </span>
                                </div>

                                {/* Accordion items */}
                                <div className="space-y-2">
                                    {category.questions.map((faq, qIdx) => {
                                        const globalIdx = `${catIdx}-${qIdx}`;
                                        const isOpen = activeIdx === globalIdx;
                                        return (
                                            <motion.div
                                                key={qIdx}
                                                className="overflow-hidden rounded-2xl transition-all duration-200"
                                                style={{
                                                    background: 'white',
                                                    border: isOpen ? '1px solid rgba(249,115,22,0.25)' : '1px solid rgba(0,0,0,0.07)',
                                                    boxShadow: isOpen ? '0 8px 28px rgba(249,115,22,0.08)' : '0 2px 8px rgba(0,0,0,0.03)',
                                                }}
                                            >
                                                {/* Question row */}
                                                <button
                                                    onClick={() => toggleFAQ(globalIdx)}
                                                    className="w-full text-left px-6 py-4 flex items-center justify-between gap-4 group"
                                                >
                                                    <span className="text-sm font-bold leading-snug transition-colors duration-200"
                                                        style={{ color: isOpen ? '#F97316' : '#111111', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                                                        {faq.q}
                                                    </span>
                                                    <div className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300"
                                                        style={{
                                                            background: isOpen ? 'rgba(249,115,22,0.1)' : '#F3F4F6',
                                                            color: isOpen ? '#F97316' : '#9CA3AF',
                                                            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                                                        }}>
                                                        <ChevronDown size={15} />
                                                    </div>
                                                </button>

                                                {/* Answer */}
                                                <AnimatePresence>
                                                    {isOpen && (
                                                        <motion.div
                                                            initial={{ height: 0, opacity: 0 }}
                                                            animate={{ height: 'auto', opacity: 1 }}
                                                            exit={{ height: 0, opacity: 0 }}
                                                            transition={{ duration: 0.22, ease: 'easeInOut' }}
                                                            className="overflow-hidden"
                                                        >
                                                            <div className="px-6 pb-5 pt-1"
                                                                style={{ borderTop: '1px solid rgba(0,0,0,0.05)' }}>
                                                                <p className="text-sm font-medium leading-relaxed" style={{ color: '#6B7280' }}>
                                                                    {faq.a}
                                                                </p>
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            </motion.div>
                        );
                    })
                ) : (
                    /* Empty / no search results */
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="flex flex-col items-center justify-center py-20 rounded-2xl text-center"
                        style={{ background: 'white', border: '1px solid rgba(0,0,0,0.07)' }}>
                        <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
                            style={{ background: 'linear-gradient(135deg, #FFF7ED, #FFEDD5)' }}>
                            <HelpCircle size={24} style={{ color: '#F97316' }} />
                        </div>
                        <h3 className="text-lg font-black mb-1" style={{ color: '#111111' }}>No results found</h3>
                        <p className="text-sm font-medium mb-0" style={{ color: '#9CA3AF' }}>
                            Try a different search term or browse the categories above.
                        </p>
                    </motion.div>
                )}

                {/* ── Still Have Questions CTA ──────────────────────── */}
                {!loading && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="relative overflow-hidden rounded-2xl p-8 text-center mt-6"
                        style={{ background: 'linear-gradient(145deg, #111118 0%, #1a1a26 100%)', border: '1px solid rgba(249,115,22,0.15)', boxShadow: '0 16px 48px rgba(0,0,0,0.18)' }}
                    >
                        <div className="absolute inset-0 pointer-events-none"
                            style={{ background: 'radial-gradient(ellipse 70% 50% at 50% -10%, rgba(249,115,22,0.18) 0%, transparent 60%)' }} />
                        <div className="relative z-10">
                            <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4"
                                style={{ background: 'rgba(249,115,22,0.12)', border: '1px solid rgba(249,115,22,0.25)' }}>
                                <MessageSquare size={20} style={{ color: '#F97316' }} />
                            </div>
                            <h3 className="text-2xl font-black text-white mb-2" style={{ letterSpacing: '-0.03em' }}>
                                Still have questions?
                            </h3>
                            <p className="text-sm font-medium mb-6 max-w-xs mx-auto" style={{ color: 'rgba(255,255,255,0.4)' }}>
                                Our support team is happy to help you with anything not covered here.
                            </p>
                            <Link to="/contact"
                                className="inline-flex items-center gap-2 text-sm font-bold px-6 py-3 rounded-xl text-white transition-all"
                                style={{
                                    background: 'linear-gradient(135deg, #FB923C, #F97316)',
                                    boxShadow: '0 6px 20px rgba(249,115,22,0.38)',
                                }}
                                onMouseEnter={e => e.currentTarget.style.boxShadow = '0 10px 28px rgba(249,115,22,0.5)'}
                                onMouseLeave={e => e.currentTarget.style.boxShadow = '0 6px 20px rgba(249,115,22,0.38)'}
                            >
                                <MessageSquare size={14} />
                                Contact Us
                            </Link>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default FAQ;
