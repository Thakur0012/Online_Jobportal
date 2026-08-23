import { useState, useEffect, useRef } from 'react';
import {
    Briefcase, Building2, MapPin, TrendingUp, Search, ArrowRight, Zap, Shield, Users,
    ChevronRight, CircleDollarSign, ChevronDown, Landmark, BarChart2, FileText,
    PieChart, Scale, Wallet, CreditCard, Calculator, LineChart, Globe, Cpu,
    BookOpen, Award, BadgeCheck, Banknote, ClipboardList, ReceiptText, Layers,
    BarChart, Activity, Target, Network, DollarSign, Percent, FilePlus2, Coins
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import api from '../lib/axios';
import SeoHead from '../components/SeoHead';

const DEFAULT_CMS = {
    heroTitle: 'Find your dream',
    heroTitleHighlight: 'job now',
    heroSubtitle: '5 lakh+ jobs across Banking, Accountancy, Fintech & Finance — all in one place.',
    heroBadge: 'The Future of Hiring is Here',
    searchPlaceholder1: 'Designation, Skills...',
    searchPlaceholder2: 'Location',
    searchButtonText: 'Search Now',
    categoriesTitle: 'Popular Categories',
    categoriesSubtitle: 'Explore jobs in your specialized field',
    featuredJobsTitle: 'Featured Jobs',
    featuredJobsSubtitle: 'Handpicked opportunities for you',
    stat1Value: '5L+',
    stat1Label: 'Active Jobs',
    stat2Value: '50K+',
    stat2Label: 'Companies',
    stat3Value: '2M+',
    stat3Label: 'Job Seekers',
    stat4Value: '95%',
    stat4Label: 'Success Rate',
};

const FLOATING_COMPANIES = [
    { name: 'HDFC', color: '#003087' },
    { name: 'ICICI', color: '#F58220' },
    { name: 'Deloitte', color: '#86BC25' },
    { name: 'EY', color: '#FFE600' },
    { name: 'Axis', color: '#97144D' },
    { name: 'KPMG', color: '#00338D' },
];

// ── Smart Lucide icon resolver for finance categories ──────────────────────────
const getCategoryIcon = (name = '') => {
    const n = name.toLowerCase();
    if (n.includes('investment bank') || n.includes('invest')) return Landmark;
    if (n.includes('financial analys') || n.includes('analysis')) return BarChart2;
    if (n.includes('accountan') || n.includes('audit') || n.includes('acca') || n.includes('ca ') || n.startsWith('ca')) return Calculator;
    if (n.includes('fintech') || n.includes('technology') || n.includes('digital')) return Cpu;
    if (n.includes('insurance') || n.includes('risk')) return Shield;
    if (n.includes('tax') || n.includes('legal') || n.includes('compliance')) return Scale;
    if (n.includes('wealth') || n.includes('portfolio')) return Wallet;
    if (n.includes('corporate finance') || n.includes('corporate')) return Building2;
    if (n.includes('banking') || n.includes('bank')) return Landmark;
    if (n.includes('cfa') || n.includes('cma') || n.includes('cpa')) return Award;
    if (n.includes('asset')) return PieChart;
    if (n.includes('equity') || n.includes('stock') || n.includes('market')) return LineChart;
    if (n.includes('credit') || n.includes('loan') || n.includes('mortgage')) return CreditCard;
    if (n.includes('treasury')) return Banknote;
    if (n.includes('payroll') || n.includes('salary')) return ReceiptText;
    if (n.includes('consulting') || n.includes('advisory')) return ClipboardList;
    if (n.includes('management') || n.includes('manager')) return Target;
    if (n.includes('research') || n.includes('analyst')) return Activity;
    if (n.includes('international') || n.includes('global') || n.includes('forex')) return Globe;
    if (n.includes('nbfc') || n.includes('nbfc')) return Layers;
    if (n.includes('mutual fund') || n.includes('fund')) return Coins;
    if (n.includes('business')) return BarChart;
    if (n.includes('article') || n.includes('trainee')) return FileText;
    if (n.includes('intermediate') || n.includes('qualification') || n.includes('degree')) return BookOpen;
    if (n.includes('certif') || n.includes('qualified')) return BadgeCheck;
    if (n.includes('finance') || n.includes('financial')) return DollarSign;
    if (n.includes('operation') || n.includes('ops')) return Layers;
    if (n.includes('sales')) return TrendingUp;
    return Briefcase;
};

const Home = () => {
    const [cmsContent, setCmsContent] = useState(DEFAULT_CMS);
    const [dbCategories, setDbCategories] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [locationQuery, setLocationQuery] = useState('');
    const [showAllCategories, setShowAllCategories] = useState(false);
    const [activeTag, setActiveTag] = useState(null);
    const heroRef = useRef(null);
    const navigate = useNavigate();

    const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
    const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '25%']);
    const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

    useEffect(() => {
        api.get('/cms/page/home')
            .then(res => { if (res.data?.content) setCmsContent(prev => ({ ...prev, ...res.data.content })); })
            .catch(() => { });
        api.get('/categories')
            .then(res => setDbCategories(res.data || []))
            .catch(() => { });
    }, []);

    const handleSearch = (e) => {
        if (e) e.preventDefault();
        const params = new URLSearchParams();
        if (searchQuery) params.append('search', searchQuery);
        if (locationQuery) params.append('location', locationQuery);
        navigate(`/jobs?${params.toString()}`);
    };

    const handleTagClick = (tag) => {
        setActiveTag(tag);
        navigate(`/jobs?search=${encodeURIComponent(tag)}`);
    };

    const cms = { ...DEFAULT_CMS, ...cmsContent };

    const allMappedCategories = dbCategories.map(cat => ({
        name: cat.name,
        lucideIcon: getCategoryIcon(cat.name),
        count: cat.count || '',
        image: cat.image,
    }));

    const fallbackCategories = [
        { name: 'Investment Banking', lucideIcon: Landmark, count: '1.2k+ jobs' },
        { name: 'Financial Analysis', lucideIcon: BarChart2, count: '2.5k+ jobs' },
        { name: 'Accountancy & Audit', lucideIcon: Calculator, count: '3.8k+ jobs' },
        { name: 'Fintech Solutions', lucideIcon: Cpu, count: '900+ jobs' },
        { name: 'Insurance & Risk', lucideIcon: Shield, count: '1.5k+ jobs' },
        { name: 'Taxation & Legal', lucideIcon: Scale, count: '1.1k+ jobs' },
        { name: 'Wealth Management', lucideIcon: Wallet, count: '800+ jobs' },
        { name: 'Corporate Finance', lucideIcon: Building2, count: '2.2k+ jobs' },
    ];

    const categoriesList = dbCategories.length > 0 ? allMappedCategories : fallbackCategories;
    const categoriesToShow = showAllCategories ? categoriesList : categoriesList.slice(0, 8);
    const popularTags = dbCategories.length > 0 ? dbCategories.slice(0, 6).map(c => c.name) : ['Banking', 'Finance', 'Taxation', 'Audit', 'Fintech', 'Insurance'];

    return (
        <div className="min-h-screen bg-white text-[#0A0A0A]" style={{ fontFamily: 'Plus Jakarta Sans, Inter, sans-serif' }}>
            <SeoHead
                title="Find Your Dream Finance & Banking Job in India"
                description="India's most trusted finance job portal. Browse 5 lakh+ jobs in Banking, Accountancy, Fintech & Finance — all in one place."
                canonical="https://www.ledgerbandhu.com/"
            />

            {/* ── HERO ─────────────────────────────────────────────────── */}
            <section ref={heroRef} className="relative min-h-screen flex flex-col justify-center overflow-hidden"
                style={{ background: 'linear-gradient(135deg, #0a0a0f 0%, #10101a 40%, #141420 70%, #0f0f18 100%)' }}>

                {/* Animated mesh gradient orbs */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <motion.div
                        animate={{ x: [0, 30, 0], y: [0, -20, 0], scale: [1, 1.05, 1] }}
                        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
                        className="absolute -top-40 -left-40 w-[700px] h-[700px] rounded-full"
                        style={{ background: 'radial-gradient(circle, rgba(249,115,22,0.18) 0%, transparent 65%)', filter: 'blur(60px)' }}
                    />
                    <motion.div
                        animate={{ x: [0, -25, 0], y: [0, 25, 0], scale: [1, 1.08, 1] }}
                        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
                        className="absolute -bottom-40 -right-20 w-[600px] h-[600px] rounded-full"
                        style={{ background: 'radial-gradient(circle, rgba(234,88,12,0.15) 0%, transparent 65%)', filter: 'blur(80px)' }}
                    />
                    <motion.div
                        animate={{ x: [0, 20, 0], y: [0, -15, 0] }}
                        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 6 }}
                        className="absolute top-1/3 right-1/4 w-[400px] h-[400px] rounded-full"
                        style={{ background: 'radial-gradient(circle, rgba(251,146,60,0.08) 0%, transparent 65%)', filter: 'blur(40px)' }}
                    />
                </div>

                {/* Grid pattern */}
                <div className="absolute inset-0 pointer-events-none opacity-[0.04]"
                    style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

                {/* Floating company pills */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden hidden lg:block">
                    {FLOATING_COMPANIES.map((co, i) => (
                        <motion.div
                            key={co.name}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 0.7, y: [0, -8, 0] }}
                            transition={{ delay: i * 0.2 + 1, duration: 4 + i, repeat: Infinity, ease: 'easeInOut' }}
                            className="absolute flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold text-white/90"
                            style={{
                                background: 'rgba(255,255,255,0.06)',
                                backdropFilter: 'blur(12px)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                left: `${[8, 80, 5, 85, 12, 78][i]}%`,
                                top: `${[18, 22, 55, 58, 78, 75][i]}%`,
                            }}
                        >
                            <span className="w-2 h-2 rounded-full" style={{ background: co.color }} />
                            {co.name}
                        </motion.div>
                    ))}
                </div>

                <motion.div style={{ y: heroY, opacity: heroOpacity }}
                    className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 text-center">

                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: -16, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.6, ease: 'backOut' }}
                        className="inline-flex items-center gap-2.5 mb-10"
                    >
                        <span className="flex items-center gap-2.5 text-xs font-bold tracking-widest uppercase px-5 py-2.5 rounded-full"
                            style={{
                                background: 'rgba(249,115,22,0.12)',
                                border: '1px solid rgba(249,115,22,0.3)',
                                color: '#FB923C',
                                backdropFilter: 'blur(8px)',
                            }}>
                            <motion.span
                                animate={{ scale: [1, 1.4, 1], opacity: [1, 0.6, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="w-1.5 h-1.5 bg-orange-400 rounded-full"
                            />
                            <Zap size={11} />
                            {cms.heroBadge}
                        </span>
                    </motion.div>

                    {/* Headline */}
                    <motion.h1
                        initial={{ opacity: 0, y: 32 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.1, ease: 'easeOut' }}
                        className="text-5xl sm:text-6xl md:text-7xl lg:text-[88px] font-extrabold leading-[1.0] tracking-[-0.04em] mb-6"
                        style={{ fontFamily: 'Plus Jakarta Sans, Inter, sans-serif' }}
                    >
                        <span className="text-white">{cms.heroTitle}</span>
                        <br />
                        <span style={{
                            background: 'linear-gradient(135deg, #FB923C 0%, #F97316 40%, #EA580C 80%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                        }}>
                            {cms.heroTitleHighlight}
                        </span>
                    </motion.h1>

                    {/* Subtitle */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.25 }}
                        className="text-lg md:text-xl font-normal max-w-xl mx-auto leading-relaxed mb-12"
                        style={{ color: 'rgba(255,255,255,0.55)' }}
                    >
                        {cms.heroSubtitle}
                    </motion.p>

                    {/* Search Bar — glassmorphism */}
                    <motion.div
                        initial={{ opacity: 0, y: 24, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.35, ease: 'easeOut' }}
                        className="max-w-3xl mx-auto mb-8"
                    >
                        <form onSubmit={handleSearch}
                            className="flex flex-col md:flex-row items-stretch overflow-hidden rounded-2xl"
                            style={{
                                background: 'rgba(255,255,255,0.07)',
                                backdropFilter: 'blur(24px)',
                                WebkitBackdropFilter: 'blur(24px)',
                                border: '1px solid rgba(255,255,255,0.12)',
                                boxShadow: '0 32px 80px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)',
                            }}>
                            {/* Job title field */}
                            <label className="flex-1 flex items-center px-5 py-4 gap-3 cursor-text border-b md:border-b-0 md:border-r"
                                style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                                <Search className="w-5 h-5 shrink-0" style={{ color: '#F97316' }} />
                                <input
                                    type="text"
                                    placeholder="Job title, skills, or company"
                                    className="w-full bg-transparent focus:outline-none font-medium text-base"
                                    style={{ color: 'white' }}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                />
                            </label>
                            {/* Location field */}
                            <label className="flex-1 flex items-center px-5 py-4 gap-3 cursor-text border-b md:border-b-0 md:border-r"
                                style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                                <MapPin className="w-5 h-5 shrink-0" style={{ color: 'rgba(255,255,255,0.35)' }} />
                                <input
                                    type="text"
                                    placeholder="Location (city or remote)"
                                    className="w-full bg-transparent focus:outline-none font-medium text-base"
                                    style={{ color: 'white' }}
                                    value={locationQuery}
                                    onChange={(e) => setLocationQuery(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                />
                            </label>
                            {/* Button */}
                            <div className="p-2.5">
                                <button type="submit"
                                    className="group flex items-center justify-center gap-2 h-full px-7 py-3 rounded-xl font-bold text-sm whitespace-nowrap text-white transition-all duration-300 w-full md:w-auto"
                                    style={{
                                        background: 'linear-gradient(135deg, #FB923C 0%, #F97316 50%, #EA580C 100%)',
                                        boxShadow: '0 8px 24px rgba(249,115,22,0.45)',
                                    }}
                                    onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 12px 32px rgba(249,115,22,0.6)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                                    onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 8px 24px rgba(249,115,22,0.45)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                                >
                                    <Search size={15} />
                                    Search Jobs
                                </button>
                            </div>
                        </form>
                    </motion.div>

                    {/* Popular Tags */}
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                        className="flex flex-wrap justify-center gap-2 items-center">
                        <span className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.35)' }}>Popular:</span>
                        {popularTags.map(tag => (
                            <button key={tag} onClick={() => handleTagClick(tag)}
                                className="text-xs font-semibold px-4 py-1.5 rounded-full transition-all duration-200"
                                style={{
                                    background: activeTag === tag ? 'rgba(249,115,22,0.25)' : 'rgba(255,255,255,0.06)',
                                    border: activeTag === tag ? '1px solid rgba(249,115,22,0.5)' : '1px solid rgba(255,255,255,0.1)',
                                    color: activeTag === tag ? '#FB923C' : 'rgba(255,255,255,0.6)',
                                }}>
                                {tag}
                            </button>
                        ))}
                    </motion.div>
                </motion.div>

                {/* Scroll indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2 }}
                    className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
                    style={{ color: 'rgba(255,255,255,0.25)' }}
                >
                    <span className="text-[10px] font-bold uppercase tracking-widest">Scroll</span>
                    <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                        <ChevronDown size={16} />
                    </motion.div>
                </motion.div>
            </section>

            {/* ── STATS STRIP ──────────────────────────────────────────── */}
            <section className="relative z-20 -mt-1">
                <div className="max-w-5xl mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 32 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="grid grid-cols-2 md:grid-cols-4 overflow-hidden rounded-2xl"
                        style={{
                            background: 'white',
                            border: '1px solid rgba(0,0,0,0.07)',
                            boxShadow: '0 20px 60px rgba(0,0,0,0.12), 0 4px 16px rgba(0,0,0,0.06)',
                        }}
                    >
                        {[
                            { value: cms.stat1Value, label: cms.stat1Label, icon: Briefcase },
                            { value: cms.stat2Value, label: cms.stat2Label, icon: Building2 },
                            { value: cms.stat3Value, label: cms.stat3Label, icon: Users },
                            { value: cms.stat4Value, label: cms.stat4Label, icon: TrendingUp },
                        ].map((stat, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 12 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.08 }}
                            className="group flex flex-col items-center justify-center py-8 px-4 cursor-default relative overflow-hidden"
                                style={{ borderRight: i < 3 ? '1px solid rgba(0,0,0,0.06)' : 'none' }}
                            >
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                                    style={{ background: 'linear-gradient(135deg, rgba(249,115,22,0.04) 0%, rgba(249,115,22,0.02) 100%)' }} />
                                <span className="text-3xl md:text-4xl font-black tracking-tight mb-1 group-hover:text-[#F97316] transition-colors duration-300"
                                    style={{ color: '#111111', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                                    {stat.value}
                                </span>
                                <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#9CA3AF' }}>
                                    {stat.label}
                                </span>
                                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-0 group-hover:w-12 transition-all duration-400 rounded-full"
                                    style={{ background: 'linear-gradient(90deg, #FB923C, #F97316)' }} />
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* ── CATEGORIES ────────────────────────────────────────────── */}
            <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
                style={{ background: 'linear-gradient(180deg, #ffffff 0%, #fafafa 100%)' }}>

                {/* Background decoration */}
                <div className="absolute inset-0 pointer-events-none">
                    <div style={{
                        position: 'absolute', top: '-10%', left: '50%', transform: 'translateX(-50%)',
                        width: '800px', height: '500px',
                        background: 'radial-gradient(ellipse, rgba(249,115,22,0.04) 0%, transparent 65%)',
                        filter: 'blur(40px)',
                    }} />
                </div>

                <div className="max-w-7xl mx-auto relative">

                    {/* Section Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.55 }}
                        className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16"
                    >
                        <div>
                            <div className="flex items-center gap-2.5 mb-4">
                                <div className="h-px w-8" style={{ background: 'linear-gradient(90deg, #F97316, #FB923C)' }} />
                                <span className="text-[11px] font-black uppercase tracking-[0.18em]" style={{ color: '#F97316' }}>
                                    Industry Specialized
                                </span>
                            </div>
                            <h2 className="text-4xl md:text-5xl font-black leading-[1.05] tracking-[-0.03em]"
                                style={{ color: '#111111', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                                Explore jobs by{' '}
                                <span style={{
                                    background: 'linear-gradient(135deg, #FB923C 0%, #F97316 50%, #EA580C 100%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text',
                                }}>category</span>
                            </h2>
                            <p className="mt-3 text-base font-medium" style={{ color: '#9CA3AF' }}>
                                {cms.categoriesSubtitle}
                            </p>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                            <span className="text-sm font-semibold" style={{ color: '#9CA3AF' }}>
                                {categoriesList.length}+ categories
                            </span>
                            <div className="h-4 w-px" style={{ background: '#E5E7EB' }} />
                            <button
                                onClick={() => navigate('/jobs')}
                                className="flex items-center gap-2 text-sm font-bold px-5 py-2.5 rounded-xl transition-all duration-200"
                                style={{ color: '#F97316', border: '1.5px solid rgba(249,115,22,0.3)', background: 'transparent' }}
                                onMouseEnter={e => { e.currentTarget.style.background = '#F97316'; e.currentTarget.style.color = 'white'; }}
                                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#F97316'; }}
                            >
                                All Jobs <ArrowRight size={14} />
                            </button>
                        </div>
                    </motion.div>

                    {/* Category Cards Grid — horizontal layout */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                        {categoriesToShow.map((cat, index) => (
                            <motion.button
                                key={index}
                                initial={{ opacity: 0, y: 18 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.04, duration: 0.4, ease: 'easeOut' }}
                                whileHover={{ y: -5, transition: { duration: 0.18 } }}
                                onClick={() => navigate(`/jobs?category=${encodeURIComponent(cat.name)}`)}
                                className="group relative flex items-center gap-4 text-left overflow-hidden cursor-pointer"
                                style={{
                                    background: 'white',
                                    border: '1px solid rgba(0,0,0,0.07)',
                                    borderRadius: '16px',
                                    padding: '18px 20px',
                                    boxShadow: '0 1px 8px rgba(0,0,0,0.04)',
                                    transition: 'all 0.22s cubic-bezier(0.4,0,0.2,1)',
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.border = '1px solid rgba(249,115,22,0.28)';
                                    e.currentTarget.style.boxShadow = '0 12px 40px rgba(249,115,22,0.13), 0 2px 12px rgba(0,0,0,0.06)';
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.border = '1px solid rgba(0,0,0,0.07)';
                                    e.currentTarget.style.boxShadow = '0 1px 8px rgba(0,0,0,0.04)';
                                }}
                            >
                                {/* Hover warm background wash */}
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-250 pointer-events-none rounded-2xl"
                                    style={{ background: 'linear-gradient(135deg, rgba(255,247,237,0.85) 0%, rgba(255,255,255,0.5) 100%)' }} />

                                {/* Icon container */}
                                <div className="relative shrink-0 w-12 h-12 rounded-xl flex items-center justify-center overflow-hidden transition-all duration-300 group-hover:scale-105"
                                    style={{
                                        background: 'linear-gradient(135deg, #FFF7ED, #FFEDD5)',
                                        border: '1px solid rgba(249,115,22,0.14)',
                                        color: '#F97316',
                                    }}>
                                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                        style={{ background: 'linear-gradient(135deg, #FB923C, #EA580C)' }} />
                                    <div className="relative z-10 group-hover:text-white transition-colors duration-300"
                                        style={{ color: 'inherit' }}>
                                        {cat.image ? (
                                            <img src={cat.image} alt={cat.name}
                                                className="w-6 h-6 object-contain group-hover:brightness-0 group-hover:invert transition-all duration-300" />
                                        ) : (() => {
                                            const IconComp = cat.lucideIcon || getCategoryIcon(cat.name);
                                            return <IconComp size={20} strokeWidth={1.75} />;
                                        })()}
                                    </div>

                                </div>

                                {/* Text */}
                                <div className="relative flex-1 min-w-0">
                                    <p className="text-sm font-bold leading-tight transition-colors duration-200 group-hover:text-[#F97316] truncate"
                                        style={{ color: '#111111', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                                        {cat.name}
                                    </p>
                                    {cat.count && (
                                        <span className="text-[11px] font-semibold mt-0.5 block"
                                            style={{ color: '#9CA3AF' }}>
                                            {cat.count}
                                        </span>
                                    )}
                                </div>

                                {/* Arrow */}
                                <div className="relative shrink-0 w-7 h-7 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 -translate-x-1 group-hover:translate-x-0"
                                    style={{ background: 'rgba(249,115,22,0.1)', color: '#F97316' }}>
                                    <ArrowRight size={13} />
                                </div>
                            </motion.button>
                        ))}
                    </div>

                    {/* Show more / less */}
                    {categoriesList.length > 8 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            className="mt-12 flex justify-center"
                        >
                            <motion.button
                                whileHover={{ y: -2 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={() => setShowAllCategories(!showAllCategories)}
                                className="flex items-center gap-3 text-sm font-bold uppercase tracking-widest px-8 py-3.5 rounded-xl transition-all duration-250"
                                style={{
                                    color: '#F97316',
                                    border: '1.5px solid rgba(249,115,22,0.32)',
                                    background: 'transparent',
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.background = '#F97316';
                                    e.currentTarget.style.color = 'white';
                                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(249,115,22,0.28)';
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.background = 'transparent';
                                    e.currentTarget.style.color = '#F97316';
                                    e.currentTarget.style.boxShadow = 'none';
                                }}
                            >
                                {showAllCategories ? 'Show Less' : 'View all categories'}
                                <ChevronRight size={15} className={`transition-transform duration-300 ${showAllCategories ? 'rotate-90' : ''}`} />
                            </motion.button>
                        </motion.div>
                    )}
                </div>
            </section>

            {/* ── FEATURED JOBS ─────────────────────────────────────────── */}
            <FeaturedJobsSection title={cms.featuredJobsTitle} subtitle={cms.featuredJobsSubtitle} />

            {/* ── WHY LEDGERBANDHU ──────────────────────────────────────── */}
            <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
                style={{ background: '#FAFAFA' }}>
                <div className="absolute inset-0 pointer-events-none"
                    style={{ background: 'radial-gradient(ellipse 60% 40% at 50% 100%, rgba(249,115,22,0.04) 0%, transparent 60%)' }} />

                <div className="max-w-7xl mx-auto relative">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <span className="section-label">Why Choose Us</span>
                        <h2 className="text-4xl md:text-5xl font-black mt-3 mb-4"
                            style={{ color: '#111111', letterSpacing: '-0.03em', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                            Built for{' '}
                            <span style={{
                                background: 'linear-gradient(135deg, #FB923C, #F97316)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                            }}>finance professionals</span>
                        </h2>
                        <p className="text-gray-400 max-w-lg mx-auto text-lg">Everything you need to land your next big finance role</p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            {
                                icon: '🎯',
                                title: 'Finance-First Platform',
                                desc: 'Exclusively curated for Banking, Finance, Fintech, and Accounting professionals. No noise, only the right opportunities.',
                                accent: '#F97316',
                            },
                            {
                                icon: '⚡',
                                title: 'Instant Job Alerts',
                                desc: 'Get real-time notifications the moment a matching job goes live. Never miss a career-defining opportunity again.',
                                accent: '#F97316',
                                featured: true,
                            },
                            {
                                icon: '🛡️',
                                title: 'Verified Employers',
                                desc: 'Every company on LedgerBandhu is verified. Apply with confidence knowing employers are 100% legitimate.',
                                accent: '#F97316',
                            },
                        ].map((f, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                                className="relative p-8 rounded-2xl overflow-hidden cursor-default"
                                style={{
                                    background: f.featured
                                        ? 'linear-gradient(135deg, #111111 0%, #1a1a2e 100%)'
                                        : 'white',
                                    border: f.featured ? 'none' : '1px solid rgba(0,0,0,0.07)',
                                    boxShadow: f.featured
                                        ? '0 20px 60px rgba(0,0,0,0.25)'
                                        : '0 2px 16px rgba(0,0,0,0.05)',
                                }}
                            >
                                {f.featured && (
                                    <div className="absolute inset-0 pointer-events-none"
                                        style={{ background: 'radial-gradient(ellipse 80% 60% at 50% -20%, rgba(249,115,22,0.25) 0%, transparent 60%)' }} />
                                )}
                                <div className="relative">
                                    <div className="text-4xl mb-6">{f.icon}</div>
                                    <h3 className="text-xl font-black mb-3" style={{
                                        color: f.featured ? 'white' : '#111111',
                                        fontFamily: 'Plus Jakarta Sans, sans-serif',
                                        letterSpacing: '-0.02em',
                                    }}>
                                        {f.title}
                                    </h3>
                                    <p className="text-sm leading-relaxed font-medium"
                                        style={{ color: f.featured ? 'rgba(255,255,255,0.55)' : '#9CA3AF' }}>
                                        {f.desc}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CTA BANNER ────────────────────────────────────────────── */}
            <section className="px-4 sm:px-6 lg:px-8 pb-28 pt-8">
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 28 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="relative overflow-hidden rounded-3xl text-center"
                        style={{
                            background: 'linear-gradient(135deg, #0a0a0f 0%, #14141f 50%, #0f0f18 100%)',
                            padding: '5rem 2rem',
                        }}
                    >
                        {/* Orbs */}
                        <div className="absolute -top-24 left-1/4 w-80 h-80 rounded-full pointer-events-none"
                            style={{ background: 'radial-gradient(circle, rgba(249,115,22,0.2) 0%, transparent 65%)', filter: 'blur(60px)' }} />
                        <div className="absolute -bottom-24 right-1/4 w-80 h-80 rounded-full pointer-events-none"
                            style={{ background: 'radial-gradient(circle, rgba(234,88,12,0.15) 0%, transparent 65%)', filter: 'blur(60px)' }} />

                        {/* Dot grid overlay */}
                        <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
                            style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

                        <div className="relative z-10">
                            <motion.span
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase px-5 py-2.5 rounded-full mb-8"
                                style={{
                                    background: 'rgba(249,115,22,0.12)',
                                    border: '1px solid rgba(249,115,22,0.25)',
                                    color: '#FB923C',
                                    backdropFilter: 'blur(8px)',
                                }}
                            >
                                <Shield size={12} /> Trusted by 10,000+ Professionals
                            </motion.span>

                            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-5 leading-[1.0] tracking-[-0.03em]"
                                style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                                Find your perfect hire —<br />
                                <span style={{
                                    background: 'linear-gradient(135deg, #FB923C, #F97316)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text',
                                }}>or career</span>
                            </h2>

                            <p className="mb-12 max-w-lg mx-auto text-lg leading-relaxed"
                                style={{ color: 'rgba(255,255,255,0.45)', fontWeight: 400 }}>
                                India's most trusted finance talent network. Connecting professionals with top employers.
                            </p>

                            <div className="flex flex-wrap items-center justify-center gap-4">
                                <Link to="/employer-register">
                                    <motion.span
                                        whileHover={{ y: -2, boxShadow: '0 16px 40px rgba(249,115,22,0.5)' }}
                                        whileTap={{ scale: 0.97 }}
                                        className="flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-sm text-white transition-all"
                                        style={{
                                            background: 'linear-gradient(135deg, #FB923C, #F97316, #EA580C)',
                                            boxShadow: '0 8px 28px rgba(249,115,22,0.4)',
                                            display: 'inline-flex',
                                        }}
                                    >
                                        Post a Job Vacancy <ArrowRight size={16} />
                                    </motion.span>
                                </Link>
                                <Link to="/register">
                                    <motion.span
                                        whileHover={{ y: -2 }}
                                        className="flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-sm transition-all"
                                        style={{
                                            background: 'rgba(255,255,255,0.06)',
                                            border: '1px solid rgba(255,255,255,0.15)',
                                            color: 'rgba(255,255,255,0.85)',
                                            backdropFilter: 'blur(8px)',
                                            display: 'inline-flex',
                                        }}
                                    >
                                        Join as Candidate
                                    </motion.span>
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

// ─── Featured Jobs Section ─────────────────────────────────────────────────────
const FeaturedJobsSection = ({ title, subtitle }) => {
    const [featuredJobs, setFeaturedJobs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [hoveredIdx, setHoveredIdx] = useState(null);

    useEffect(() => {
        api.get('/jobs')
            .then(res => {
                setFeaturedJobs((res.data || []).slice(0, 3));
                setIsLoading(false);
            })
            .catch(() => setIsLoading(false));
    }, []);

    const staticJobs = [
        { _id: 1, title: 'Senior React Developer', employerId: { companyName: 'Google' }, location: 'Bangalore', salary: '₹20L - ₹30L', category: 'Full-time' },
        { _id: 2, title: 'Backend Node.js Engineer', employerId: { companyName: 'Amazon' }, location: 'Hyderabad', salary: '₹18L - ₹28L', category: 'Full-time' },
        { _id: 3, title: 'UI/UX Designer', employerId: { companyName: 'Microsoft' }, location: 'Remote', salary: '₹15L - ₹25L', category: 'Contract' },
    ];

    const jobs = featuredJobs.length > 0 ? featuredJobs : staticJobs;

    const categoryColors = {
        'Full-time': { bg: 'rgba(34,197,94,0.1)', text: '#16A34A', dot: '#22C55E' },
        'Part-time': { bg: 'rgba(59,130,246,0.1)', text: '#2563EB', dot: '#3B82F6' },
        'Contract': { bg: 'rgba(168,85,247,0.1)', text: '#9333EA', dot: '#A855F7' },
        'Remote': { bg: 'rgba(249,115,22,0.1)', text: '#EA580C', dot: '#F97316' },
    };

    return (
        <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden" style={{ background: '#F8F9FA' }}>
            {/* Subtle top border accent */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-px"
                style={{ background: 'linear-gradient(90deg, transparent, rgba(249,115,22,0.3), transparent)' }} />

            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-14 gap-6"
                >
                    <div>
                        <span className="section-label">Top Opportunities</span>
                        <h2 className="text-4xl md:text-5xl font-black mt-3 leading-tight"
                            style={{ color: '#111111', letterSpacing: '-0.03em', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                            Handpicked{' '}
                            <span style={{
                                background: 'linear-gradient(135deg, #FB923C, #F97316)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                            }}>jobs</span>
                        </h2>
                        <p className="mt-2 text-lg font-medium" style={{ color: '#9CA3AF' }}>{subtitle}</p>
                    </div>
                    <Link to="/jobs">
                        <motion.span
                            whileHover={{ y: -2 }}
                            className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest px-6 py-3 rounded-xl transition-all"
                            style={{
                                color: '#F97316',
                                border: '1.5px solid rgba(249,115,22,0.35)',
                                display: 'inline-flex',
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.background = '#F97316';
                                e.currentTarget.style.color = 'white';
                                e.currentTarget.style.boxShadow = '0 8px 24px rgba(249,115,22,0.3)';
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.background = 'transparent';
                                e.currentTarget.style.color = '#F97316';
                                e.currentTarget.style.boxShadow = 'none';
                            }}
                        >
                            View all <ArrowRight size={15} />
                        </motion.span>
                    </Link>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                    {isLoading ? (
                        [1, 2, 3].map((i) => (
                            <div key={i} className="p-7 rounded-2xl animate-pulse flex flex-col gap-4 bg-white"
                                style={{ border: '1px solid rgba(0,0,0,0.07)', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
                                <div className="flex justify-between">
                                    <div className="w-12 h-12 skeleton rounded-xl" />
                                    <div className="w-20 h-6 skeleton rounded-full" />
                                </div>
                                <div className="h-5 skeleton w-3/4" />
                                <div className="h-4 skeleton w-1/2" />
                                <div className="pt-5 border-t border-gray-50 flex justify-between">
                                    <div className="h-4 skeleton w-24" />
                                    <div className="h-4 skeleton w-16" />
                                </div>
                            </div>
                        ))
                    ) : (
                        jobs.map((job, idx) => {
                            const catStyle = categoryColors[job.category] || { bg: 'rgba(249,115,22,0.1)', text: '#EA580C' };
                            return (
                                <motion.div
                                    key={job._id}
                                    initial={{ opacity: 0, y: 24 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.1 }}
                                    whileHover={{ y: -6, transition: { duration: 0.2 } }}
                                    className="group relative flex flex-col p-7 rounded-2xl cursor-pointer overflow-hidden bg-white"
                                    style={{
                                        border: '1px solid rgba(0,0,0,0.07)',
                                        boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                                    }}
                                    onMouseEnter={e => {
                                        e.currentTarget.style.border = '1px solid rgba(249,115,22,0.25)';
                                        e.currentTarget.style.boxShadow = '0 20px 48px rgba(249,115,22,0.1), 0 4px 16px rgba(0,0,0,0.08)';
                                    }}
                                    onMouseLeave={e => {
                                        e.currentTarget.style.border = '1px solid rgba(0,0,0,0.07)';
                                        e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.04)';
                                    }}
                                >
                                    {/* Hover gradient */}
                                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                                        style={{ background: 'linear-gradient(135deg, rgba(255,247,237,0.5) 0%, white 100%)' }} />

                                    <div className="relative">
                                        <div className="flex items-start justify-between mb-5">
                                            <div className="w-13 h-13 rounded-2xl flex items-center justify-center text-lg font-black transition-all duration-300 group-hover:scale-110"
                                                style={{
                                                    background: 'linear-gradient(135deg, #FFF7ED, #FFEDD5)',
                                                    color: '#F97316',
                                                    width: '52px',
                                                    height: '52px',
                                                    border: '1px solid rgba(249,115,22,0.15)',
                                                }}>
                                                <span className="group-hover:scale-110 transition-transform"
                                                    style={{ transition: 'none' }}>
                                                    {(job.employerId?.companyName || 'C')[0]}
                                                </span>
                                            </div>
                                            <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full"
                                                style={{ background: catStyle.bg, color: catStyle.text }}>
                                                {job.category}
                                            </span>
                                        </div>

                                        <Link to={`/jobs/${job.jobId || job._id}`} className="block">
                                            <h3 className="text-lg font-bold mb-1 leading-tight transition-colors duration-200 group-hover:text-[#F97316]"
                                                style={{ color: '#111111', fontFamily: 'Plus Jakarta Sans, sans-serif', letterSpacing: '-0.02em' }}>
                                                {job.title}
                                            </h3>
                                        </Link>
                                        <p className="text-sm font-semibold mb-5" style={{ color: '#9CA3AF' }}>
                                            {job.employerId?.companyName || 'Company'}
                                        </p>

                                        <div className="flex items-center justify-between pt-5"
                                            style={{ borderTop: '1px solid rgba(0,0,0,0.06)' }}>
                                            <span className="flex items-center gap-1.5 text-sm font-semibold" style={{ color: '#9CA3AF' }}>
                                                <MapPin size={13} style={{ color: '#F97316' }} />
                                                {job.location}
                                            </span>
                                            <span className="flex items-center gap-1.5 text-sm font-bold" style={{ color: '#111111' }}>
                                                <CircleDollarSign size={13} style={{ color: '#F97316' }} />
                                                {job.salary || 'Not disclosed'}
                                            </span>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })
                    )}
                </div>
            </div>
        </section>
    );
};

export default Home;
