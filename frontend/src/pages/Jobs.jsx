import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    MapPin, Briefcase, Clock, Search, SlidersHorizontal, X, ChevronDown,
    AlertCircle, CircleDollarSign, GraduationCap, Sparkles, ArrowRight,
    Building2, CheckSquare, Square, RotateCcw, Shield, Filter
} from 'lucide-react';
import api from '../lib/axios';
import SeoHead from '../components/SeoHead';

const Jobs = () => {
    const [jobs, setJobs] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchParams, setSearchParams] = useSearchParams();
    const [showFilters, setShowFilters] = useState(false);

    const searchTerm = searchParams.get('search') || '';
    const locationTerm = searchParams.get('location') || '';
    const categoryTerm = searchParams.get('category') || '';
    const experienceTerm = searchParams.get('experience') || '';
    const educationTerm = searchParams.get('education') || '';

    const [localSearch, setLocalSearch] = useState(searchTerm);
    const [localLocation, setLocalLocation] = useState(locationTerm);
    const [selectedCategories, setSelectedCategories] = useState(categoryTerm ? categoryTerm.split(',') : []);
    const [selectedExps, setSelectedExps] = useState(experienceTerm ? experienceTerm.split(',') : []);
    const [selectedEdus, setSelectedEdus] = useState(educationTerm ? educationTerm.split(',') : []);

    useEffect(() => {
        setLocalSearch(searchTerm);
        setLocalLocation(locationTerm);
        setSelectedCategories(categoryTerm ? categoryTerm.split(',') : []);
        setSelectedExps(experienceTerm ? experienceTerm.split(',') : []);
        setSelectedEdus(educationTerm ? educationTerm.split(',') : []);
    }, [searchTerm, locationTerm, categoryTerm, experienceTerm, educationTerm]);

    const handleSearchSubmit = (e) => {
        if (e) e.preventDefault();
        const params = new URLSearchParams(searchParams);
        if (localSearch) params.set('search', localSearch); else params.delete('search');
        if (localLocation) params.set('location', localLocation); else params.delete('location');
        setSearchParams(params);
    };

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await api.get('/categories');
                setCategories(res.data);
            } catch (err) {
                console.error('Error fetching categories:', err);
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        const fetchJobs = async () => {
            setLoading(true);
            try {
                const res = await api.get('/jobs', {
                    params: {
                        search: searchTerm,
                        location: locationTerm,
                        category: categoryTerm,
                        experienceLevel: experienceTerm,
                        educationLevel: educationTerm,
                    },
                });
                setJobs(res.data);
                setLoading(false);
            } catch {
                setLoading(false);
            }
        };
        fetchJobs();
    }, [searchTerm, locationTerm, categoryTerm, experienceTerm, educationTerm]);

    const handleCategoryFilter = (cat) => {
        const params = new URLSearchParams(searchParams);
        let newSelection = selectedCategories.includes(cat)
            ? selectedCategories.filter(c => c !== cat)
            : [...selectedCategories, cat];
        setSelectedCategories(newSelection);
        if (newSelection.length > 0) params.set('category', newSelection.join(','));
        else params.delete('category');
        setSearchParams(params);
    };

    const handleExpFilter = (exp) => {
        const params = new URLSearchParams(searchParams);
        let newSelection = selectedExps.includes(exp)
            ? selectedExps.filter(e => e !== exp)
            : [...selectedExps, exp];
        setSelectedExps(newSelection);
        if (newSelection.length > 0) params.set('experience', newSelection.join(','));
        else params.delete('experience');
        setSearchParams(params);
    };

    const handleEduFilter = (edu) => {
        const params = new URLSearchParams(searchParams);
        let newSelection = selectedEdus.includes(edu)
            ? selectedEdus.filter(e => e !== edu)
            : [...selectedEdus, edu];
        setSelectedEdus(newSelection);
        if (newSelection.length > 0) params.set('education', newSelection.join(','));
        else params.delete('education');
        setSearchParams(params);
    };

    const clearAll = () => {
        setSelectedCategories([]);
        setSelectedExps([]);
        setSelectedEdus([]);
        setSearchParams({});
    };

    const activeFilterCount = selectedCategories.length + selectedExps.length + selectedEdus.length;

    return (
        <div className="min-h-screen text-[#111111]" style={{ background: '#F8F9FA', fontFamily: 'Plus Jakarta Sans, Inter, sans-serif' }}>
            <SeoHead
                title="Browse Finance & Banking Jobs in India"
                description="Search 5 lakh+ finance jobs in Banking, Accountancy, Fintech, Taxation, and more. Filter by location, experience, and category."
                canonical="https://www.ledgerbandhu.com/jobs"
            />

            {/* ── HERO HEADER ─────────────────────────────────────────── */}
            <div className="relative overflow-hidden pt-16 pb-20"
                style={{ background: 'linear-gradient(135deg, #0a0a0f 0%, #111118 50%, #0f0f1a 100%)' }}>

                {/* Orbs */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div style={{
                        position: 'absolute', top: '-20%', right: '-5%',
                        width: '500px', height: '500px',
                        background: 'radial-gradient(circle, rgba(249,115,22,0.18) 0%, transparent 65%)',
                        filter: 'blur(60px)',
                    }} />
                    <div style={{
                        position: 'absolute', bottom: '-10%', left: '10%',
                        width: '350px', height: '350px',
                        background: 'radial-gradient(circle, rgba(234,88,12,0.12) 0%, transparent 65%)',
                        filter: 'blur(50px)',
                    }} />
                </div>
                {/* Grid overlay */}
                <div className="absolute inset-0 opacity-[0.04]"
                    style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)', backgroundSize: '48px 48px' }} />

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: -12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 mb-6"
                    >
                        <span className="flex items-center gap-2 text-[11px] font-black tracking-[0.18em] uppercase px-4 py-2 rounded-full"
                            style={{
                                background: 'rgba(249,115,22,0.12)',
                                border: '1px solid rgba(249,115,22,0.3)',
                                color: '#FB923C',
                            }}>
                            <motion.span
                                animate={{ scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="w-1.5 h-1.5 rounded-full bg-orange-400"
                            />
                            Live Listings
                        </span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-4xl sm:text-5xl md:text-6xl font-black leading-[1.05] tracking-[-0.04em] text-white mb-4"
                        style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
                    >
                        Active{' '}
                        <span style={{
                            background: 'linear-gradient(135deg, #FB923C 0%, #F97316 50%, #EA580C 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                        }}>
                            Opportunities
                        </span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.25 }}
                        className="text-xs font-black uppercase tracking-[0.22em] mb-10"
                        style={{ color: 'rgba(255,255,255,0.3)' }}
                    >
                        Curated listings for high-end professionals
                    </motion.p>

                    {/* Search bar */}
                    <motion.form
                        initial={{ opacity: 0, y: 20, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.55, delay: 0.3 }}
                        onSubmit={handleSearchSubmit}
                        className="max-w-4xl mx-auto flex flex-col md:flex-row items-stretch gap-0 overflow-hidden"
                        style={{
                            background: 'rgba(255,255,255,0.07)',
                            backdropFilter: 'blur(24px)',
                            WebkitBackdropFilter: 'blur(24px)',
                            border: '1px solid rgba(255,255,255,0.12)',
                            borderRadius: '18px',
                            boxShadow: '0 32px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)',
                        }}
                    >
                        <label className="flex-1 flex items-center gap-3 px-5 py-4 cursor-text"
                            style={{ borderRight: '1px solid rgba(255,255,255,0.08)' }}>
                            <Search size={16} style={{ color: '#F97316', flexShrink: 0 }} />
                            <input
                                type="text"
                                placeholder="Search by skills, designation, or company"
                                className="w-full bg-transparent focus:outline-none text-sm font-semibold"
                                style={{ color: 'white' }}
                                value={localSearch}
                                onChange={(e) => setLocalSearch(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearchSubmit()}
                            />
                        </label>
                        <label className="flex-1 flex items-center gap-3 px-5 py-4 cursor-text"
                            style={{ borderRight: '1px solid rgba(255,255,255,0.08)' }}>
                            <MapPin size={16} style={{ color: 'rgba(255,255,255,0.3)', flexShrink: 0 }} />
                            <input
                                type="text"
                                placeholder="City, state, or location"
                                className="w-full bg-transparent focus:outline-none text-sm font-semibold"
                                style={{ color: 'white' }}
                                value={localLocation}
                                onChange={(e) => setLocalLocation(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearchSubmit()}
                            />
                        </label>
                        <div className="p-2.5">
                            <button type="submit"
                                className="h-full w-full md:w-auto flex items-center justify-center gap-2 px-7 py-3 rounded-xl text-sm font-bold text-white whitespace-nowrap transition-all duration-200"
                                style={{
                                    background: 'linear-gradient(135deg, #FB923C, #F97316, #EA580C)',
                                    boxShadow: '0 6px 20px rgba(249,115,22,0.45)',
                                }}
                                onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 10px 30px rgba(249,115,22,0.6)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                                onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 6px 20px rgba(249,115,22,0.45)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                            >
                                <Search size={14} />
                                Search Jobs
                            </button>
                        </div>
                    </motion.form>
                </div>
            </div>

            {/* ── MAIN CONTENT ─────────────────────────────────────────── */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

                {/* Mobile Filter Toggle */}
                <div className="lg:hidden mb-5">
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="flex items-center gap-2.5 px-5 py-3 rounded-xl font-bold text-sm transition-all"
                        style={{
                            background: 'white',
                            border: showFilters ? '1.5px solid rgba(249,115,22,0.4)' : '1px solid rgba(0,0,0,0.08)',
                            color: '#F97316',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                        }}
                    >
                        <Filter size={15} />
                        Filters
                        {activeFilterCount > 0 && (
                            <span className="flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-black text-white"
                                style={{ background: '#F97316' }}>
                                {activeFilterCount}
                            </span>
                        )}
                        <ChevronDown size={14} className={`transition-transform duration-300 ${showFilters ? 'rotate-180' : ''}`} />
                    </button>
                </div>

                {/* Mobile Filter Panel */}
                <AnimatePresence>
                    {showFilters && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="lg:hidden overflow-hidden mb-6"
                        >
                            <FilterPanel
                                categories={categories}
                                selectedCategories={selectedCategories}
                                handleCategoryFilter={handleCategoryFilter}
                                selectedExps={selectedExps}
                                handleExpFilter={handleExpFilter}
                                selectedEdus={selectedEdus}
                                handleEduFilter={handleEduFilter}
                                clearAll={clearAll}
                                activeFilterCount={activeFilterCount}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Desktop Sidebar */}
                    <div className="hidden lg:block lg:col-span-1">
                        <div className="sticky top-24 overflow-y-auto custom-scrollbar"
                            style={{ maxHeight: 'calc(100vh - 110px)' }}>
                            <FilterPanel
                                categories={categories}
                                selectedCategories={selectedCategories}
                                handleCategoryFilter={handleCategoryFilter}
                                selectedExps={selectedExps}
                                handleExpFilter={handleExpFilter}
                                selectedEdus={selectedEdus}
                                handleEduFilter={handleEduFilter}
                                clearAll={clearAll}
                                activeFilterCount={activeFilterCount}
                            />
                        </div>
                    </div>

                    {/* Job Listings */}
                    <div className="lg:col-span-3 space-y-4">
                        {loading ? (
                            [1, 2, 3, 4].map(i => <JobSkeleton key={i} />)
                        ) : jobs.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.97 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex flex-col items-center justify-center py-24 px-8 rounded-2xl text-center"
                                style={{ background: 'white', border: '1px solid rgba(0,0,0,0.07)', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}
                            >
                                <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6"
                                    style={{ background: 'linear-gradient(135deg, #FFF7ED, #FFEDD5)' }}>
                                    <Briefcase size={34} style={{ color: '#F97316' }} />
                                </div>
                                <h3 className="text-2xl font-black mb-2" style={{ color: '#111111' }}>No jobs found</h3>
                                <p className="text-sm font-medium mb-8" style={{ color: '#9CA3AF' }}>Try adjusting your filters or search terms.</p>
                                <button onClick={clearAll}
                                    className="flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-bold text-white transition-all"
                                    style={{ background: 'linear-gradient(135deg, #FB923C, #F97316)', boxShadow: '0 6px 20px rgba(249,115,22,0.35)' }}>
                                    <RotateCcw size={14} />
                                    Reset Filters
                                </button>
                            </motion.div>
                        ) : (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                                {/* Results count row */}
                                <div className="flex items-center justify-between pb-2">
                                    <div className="flex items-center gap-2">
                                        <span className="text-2xl font-black" style={{ color: '#F97316' }}>{jobs.length}</span>
                                        <span className="text-sm font-bold" style={{ color: '#6B7280' }}>positions found</span>
                                    </div>
                                    {activeFilterCount > 0 && (
                                        <button onClick={clearAll}
                                            className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg transition-all"
                                            style={{ color: '#F97316', background: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.2)' }}>
                                            <X size={11} />
                                            Clear all
                                        </button>
                                    )}
                                </div>

                                {/* Sponsored Jobs */}
                                {jobs.filter(j => j.isSponsored).length > 0 && (
                                    <div className="space-y-4 mb-2">
                                        <div className="flex items-center gap-2.5">
                                            <Sparkles size={14} style={{ color: '#F97316' }} className="animate-pulse" />
                                            <span className="text-[11px] font-black uppercase tracking-[0.2em]" style={{ color: '#111111' }}>
                                                Priority <span style={{ color: '#F97316' }}>Placements</span>
                                            </span>
                                        </div>
                                        {jobs.filter(j => j.isSponsored).map(job => (
                                            <JobCard key={job._id} job={job} isSponsored={true} />
                                        ))}
                                        <div className="h-px my-6" style={{ background: 'linear-gradient(90deg, transparent, rgba(0,0,0,0.1), transparent)' }} />
                                    </div>
                                )}

                                {/* Regular Jobs */}
                                {jobs.filter(j => !j.isSponsored).map((job, idx) => (
                                    <JobCard key={job._id} job={job} idx={idx} />
                                ))}
                            </motion.div>
                        )}

                        {/* Beware Banner */}
                        <motion.div
                            initial={{ opacity: 0, y: 12 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="mt-10 flex flex-col md:flex-row gap-6 items-start p-8 rounded-2xl overflow-hidden relative"
                            style={{
                                background: 'linear-gradient(135deg, rgba(249,115,22,0.05) 0%, rgba(255,255,255,0.8) 100%)',
                                border: '1px solid rgba(249,115,22,0.2)',
                                boxShadow: '0 4px 20px rgba(249,115,22,0.06)',
                            }}
                        >
                            <div className="absolute top-0 left-0 w-1 h-full rounded-l-2xl"
                                style={{ background: 'linear-gradient(180deg, #FB923C, #EA580C)' }} />
                            <div className="shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ml-2"
                                style={{ background: 'linear-gradient(135deg, #FB923C, #EA580C)', boxShadow: '0 4px 14px rgba(249,115,22,0.4)' }}>
                                <Shield size={22} style={{ color: 'white' }} />
                            </div>
                            <div>
                                <h4 className="text-base font-black mb-2 tracking-tight" style={{ color: '#111111' }}>
                                    Hiring Integrity Protections
                                </h4>
                                <p className="text-sm font-medium leading-relaxed" style={{ color: '#6B7280' }}>
                                    <span className="font-bold" style={{ color: '#F97316' }}>LedgerBandhu.com</span> enforces strict verification. We never facilitate job promises for monetary exchange.
                                    Fraudulent entities may solicit "registration" or "refundable" fees. Please report any such activity immediately.
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ─── Job Card ──────────────────────────────────────────────────────────────────
const JobCard = ({ job, isSponsored = false, idx = 0 }) => (
    <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: idx * 0.05, duration: 0.35 }}
        whileHover={{ y: -4, transition: { duration: 0.18 } }}
        className="group relative overflow-hidden cursor-pointer"
        style={{
            background: isSponsored
                ? 'linear-gradient(145deg, #111118 0%, #1a1a26 100%)'
                : 'white',
            border: isSponsored
                ? '1px solid rgba(249,115,22,0.25)'
                : '1px solid rgba(0,0,0,0.07)',
            borderRadius: '18px',
            boxShadow: isSponsored
                ? '0 20px 50px rgba(0,0,0,0.25), 0 0 0 1px rgba(249,115,22,0.08)'
                : '0 2px 12px rgba(0,0,0,0.04)',
            transition: 'all 0.22s cubic-bezier(0.4,0,0.2,1)',
        }}
        onMouseEnter={e => {
            if (!isSponsored) {
                e.currentTarget.style.border = '1px solid rgba(249,115,22,0.25)';
                e.currentTarget.style.boxShadow = '0 16px 48px rgba(249,115,22,0.1), 0 4px 16px rgba(0,0,0,0.06)';
            }
        }}
        onMouseLeave={e => {
            if (!isSponsored) {
                e.currentTarget.style.border = '1px solid rgba(0,0,0,0.07)';
                e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.04)';
            }
        }}
    >
        {/* Top accent bar */}
        <div className="h-[3px] w-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{
                background: 'linear-gradient(90deg, #FB923C, #F97316, #EA580C)',
                opacity: isSponsored ? 1 : undefined,
            }} />

        {/* Sponsored ambient glow */}
        {isSponsored && (
            <div className="absolute inset-0 pointer-events-none"
                style={{ background: 'radial-gradient(ellipse 80% 40% at 50% -5%, rgba(249,115,22,0.18) 0%, transparent 60%)' }} />
        )}

        {/* Hover warm wash on light cards */}
        {!isSponsored && (
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{ background: 'linear-gradient(135deg, rgba(255,247,237,0.6) 0%, white 60%)' }} />
        )}

        <div className="relative p-6 md:p-7">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                {/* Left: Logo + Title */}
                <div className="flex gap-4 flex-1 min-w-0">
                    {/* Company initial logo */}
                    <div className="shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black transition-all duration-300 group-hover:scale-105"
                        style={{
                            background: isSponsored
                                ? 'linear-gradient(135deg, rgba(249,115,22,0.2), rgba(234,88,12,0.1))'
                                : 'linear-gradient(135deg, #FFF7ED, #FFEDD5)',
                            color: '#F97316',
                            border: isSponsored
                                ? '1px solid rgba(249,115,22,0.3)'
                                : '1px solid rgba(249,115,22,0.15)',
                            fontFamily: 'Plus Jakarta Sans, sans-serif',
                        }}>
                        {(job.employerId?.companyName || 'C')[0]}
                    </div>

                    <div className="min-w-0 flex-1">
                        <Link to={`/jobs/${job.jobId || job._id}`}>
                            <h2 className="text-lg md:text-xl font-black leading-tight mb-1 transition-colors duration-200 group-hover:text-[#F97316] flex items-center gap-2"
                                style={{
                                    color: isSponsored ? 'white' : '#111111',
                                    fontFamily: 'Plus Jakarta Sans, sans-serif',
                                    letterSpacing: '-0.025em',
                                }}>
                                {job.title}
                                {isSponsored && <Sparkles size={15} style={{ color: '#FB923C', flexShrink: 0 }} />}
                            </h2>
                        </Link>
                        <p className="text-xs font-bold uppercase tracking-widest"
                            style={{ color: isSponsored ? 'rgba(255,255,255,0.4)' : '#9CA3AF' }}>
                            {job.employerId?.companyName || 'Corporate Entity'}
                        </p>
                    </div>
                </div>

                {/* Right: Category badge */}
                <div className="flex flex-col items-start sm:items-end gap-1.5 shrink-0">
                    <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full"
                        style={{
                            background: isSponsored ? 'rgba(249,115,22,0.15)' : 'rgba(249,115,22,0.08)',
                            color: '#F97316',
                            border: isSponsored ? '1px solid rgba(249,115,22,0.3)' : '1px solid rgba(249,115,22,0.15)',
                        }}>
                        {job.category}
                    </span>
                    {isSponsored && (
                        <span className="text-[9px] font-black uppercase tracking-[0.25em] animate-pulse"
                            style={{ color: 'rgba(249,115,22,0.6)' }}>
                            Sponsored
                        </span>
                    )}
                </div>
            </div>

            {/* Meta pills */}
            <div className="flex flex-wrap gap-2 mt-5">
                {[
                    { icon: MapPin, label: job.location },
                    { icon: CircleDollarSign, label: job.salary || 'Disclosed on call' },
                    { icon: Briefcase, label: job.experienceLevel },
                    { icon: GraduationCap, label: job.educationLevel },
                    { icon: Clock, label: new Date(job.createdAt).toLocaleDateString() },
                ].filter(m => m.label).map(({ icon: Icon, label }, i) => (
                    <span key={i} className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full"
                        style={{
                            background: isSponsored ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.04)',
                            color: isSponsored ? 'rgba(255,255,255,0.55)' : '#6B7280',
                        }}>
                        <Icon size={11} style={{ color: '#F97316', flexShrink: 0 }} />
                        {label}
                    </span>
                ))}
            </div>

            {/* Divider + Footer */}
            <div className="mt-5 pt-5 flex flex-wrap items-center justify-between gap-3"
                style={{ borderTop: isSponsored ? '1px solid rgba(255,255,255,0.07)' : '1px solid rgba(0,0,0,0.06)' }}>
                {/* Skill tags */}
                <div className="flex flex-wrap gap-2">
                    {job.requirements?.slice(0, 3).map((req, i) => (
                        <span key={i} className="text-[10px] font-bold uppercase tracking-wide px-3 py-1 rounded-full whitespace-nowrap"
                            style={{
                                background: isSponsored ? 'rgba(255,255,255,0.06)' : '#F3F4F6',
                                color: isSponsored ? 'rgba(255,255,255,0.4)' : '#6B7280',
                                maxWidth: '180px',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                display: 'inline-block',
                            }}
                            title={req}>
                            {req.length > 22 ? req.slice(0, 22) + '…' : req}
                        </span>
                    ))}
                </div>

                {/* CTA */}
                <Link to={`/jobs/${job.jobId || job._id}`}>
                    <motion.span
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.97 }}
                        className="flex items-center gap-2 text-sm font-bold px-5 py-2.5 rounded-xl"
                        style={{
                            background: isSponsored
                                ? 'linear-gradient(135deg, #FB923C, #F97316, #EA580C)'
                                : 'linear-gradient(135deg, #FFF7ED, #FFEDD5)',
                            color: isSponsored ? 'white' : '#EA580C',
                            boxShadow: isSponsored ? '0 6px 20px rgba(249,115,22,0.4)' : 'none',
                            display: 'inline-flex',
                        }}>
                        View Listing
                        <ArrowRight size={13} />
                    </motion.span>
                </Link>
            </div>
        </div>
    </motion.div>
);

// ─── Skeleton ──────────────────────────────────────────────────────────────────
const JobSkeleton = () => (
    <div className="animate-pulse rounded-2xl overflow-hidden"
        style={{ background: 'white', border: '1px solid rgba(0,0,0,0.07)', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
        <div className="h-[3px] skeleton rounded-none" />
        <div className="p-6 md:p-7">
            <div className="flex gap-4 items-start mb-5">
                <div className="w-14 h-14 skeleton rounded-2xl shrink-0" />
                <div className="flex-1 space-y-2">
                    <div className="h-5 skeleton rounded w-3/5" />
                    <div className="h-3.5 skeleton rounded w-2/5" />
                </div>
                <div className="w-24 h-7 skeleton rounded-full shrink-0" />
            </div>
            <div className="flex flex-wrap gap-2 mb-5">
                {[1, 2, 3, 4].map(i => <div key={i} className="h-7 skeleton rounded-full w-24" />)}
            </div>
            <div className="pt-5 border-t border-gray-100 flex justify-between items-center">
                <div className="flex gap-2">
                    {[1, 2].map(i => <div key={i} className="h-6 skeleton rounded-full w-16" />)}
                </div>
                <div className="h-9 skeleton rounded-xl w-28" />
            </div>
        </div>
    </div>
);

// ─── Filter Panel ──────────────────────────────────────────────────────────────
const FilterPanel = ({ categories, selectedCategories, handleCategoryFilter, selectedExps, handleExpFilter, selectedEdus, handleEduFilter, clearAll, activeFilterCount }) => {
    const FilterCheckbox = ({ label, checked, onChange }) => (
        <label className="flex items-center gap-3 cursor-pointer group py-1">
            <button
                type="button"
                onClick={onChange}
                className="shrink-0 w-5 h-5 flex items-center justify-center rounded-md transition-all duration-200"
                style={{
                    background: checked ? 'linear-gradient(135deg, #FB923C, #F97316)' : 'transparent',
                    border: checked ? 'none' : '1.5px solid rgba(0,0,0,0.18)',
                    boxShadow: checked ? '0 2px 8px rgba(249,115,22,0.35)' : 'none',
                }}
            >
                {checked && (
                    <svg width="11" height="8" viewBox="0 0 11 8" fill="none">
                        <path d="M1 3.5L4 6.5L10 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                )}
            </button>
            <span className="text-xs font-semibold transition-colors duration-150 leading-tight"
                style={{ color: checked ? '#F97316' : '#374151' }}>
                {label}
            </span>
        </label>
    );

    return (
        <div className="rounded-2xl overflow-hidden"
            style={{ background: 'white', border: '1px solid rgba(0,0,0,0.07)', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4"
                style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                <div className="flex items-center gap-2.5">
                    <SlidersHorizontal size={15} style={{ color: '#F97316' }} />
                    <span className="text-xs font-black uppercase tracking-widest" style={{ color: '#111111' }}>
                        Filters
                    </span>
                    {activeFilterCount > 0 && (
                        <span className="flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-black text-white"
                            style={{ background: '#F97316' }}>
                            {activeFilterCount}
                        </span>
                    )}
                </div>
                {activeFilterCount > 0 && (
                    <button onClick={clearAll}
                        className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest transition-all"
                        style={{ color: '#F97316' }}>
                        <RotateCcw size={10} />
                        Reset
                    </button>
                )}
            </div>

            <div className="p-6 space-y-7">
                {/* Category filter */}
                <div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest mb-4 flex items-center gap-2"
                        style={{ color: '#9CA3AF' }}>
                        <span className="h-px flex-1" style={{ background: 'rgba(0,0,0,0.08)' }} />
                        Job Category
                        <span className="h-px flex-1" style={{ background: 'rgba(0,0,0,0.08)' }} />
                    </h4>
                    <div className="space-y-0.5 pr-1 custom-scrollbar">
                        {categories.map(cat => (
                            <FilterCheckbox
                                key={cat._id}
                                label={cat.name}
                                checked={selectedCategories.includes(cat.name)}
                                onChange={() => handleCategoryFilter(cat.name)}
                            />
                        ))}
                    </div>
                </div>

                {/* Experience filter */}
                <div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest mb-4 flex items-center gap-2"
                        style={{ color: '#9CA3AF' }}>
                        <span className="h-px flex-1" style={{ background: 'rgba(0,0,0,0.08)' }} />
                        Experience
                        <span className="h-px flex-1" style={{ background: 'rgba(0,0,0,0.08)' }} />
                    </h4>
                    <div className="space-y-0.5">
                        {['0-2 Years', '2-5 Years', '5-10 Years', '10+ Years'].map(level => (
                            <FilterCheckbox
                                key={level}
                                label={level}
                                checked={selectedExps.includes(level)}
                                onChange={() => handleExpFilter(level)}
                            />
                        ))}
                    </div>
                </div>

                {/* Education filter */}
                <div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest mb-4 flex items-center gap-2"
                        style={{ color: '#9CA3AF' }}>
                        <span className="h-px flex-1" style={{ background: 'rgba(0,0,0,0.08)' }} />
                        Education
                        <span className="h-px flex-1" style={{ background: 'rgba(0,0,0,0.08)' }} />
                    </h4>
                    <div className="space-y-0.5">
                        {['10th', '12th', 'ITI', 'Diploma', 'Graduation', 'Post Grad', 'PhD'].map(level => (
                            <FilterCheckbox
                                key={level}
                                label={level}
                                checked={selectedEdus.includes(level)}
                                onChange={() => handleEduFilter(level)}
                            />
                        ))}
                    </div>
                </div>

                {/* Apply button */}
                <button
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-white transition-all duration-200"
                    style={{
                        background: 'linear-gradient(135deg, #FB923C, #F97316, #EA580C)',
                        boxShadow: '0 4px 16px rgba(249,115,22,0.35)',
                    }}
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 24px rgba(249,115,22,0.5)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                    onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(249,115,22,0.35)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                    <Search size={14} />
                    Apply Filters
                </button>
            </div>
        </div>
    );
};

export default Jobs;
