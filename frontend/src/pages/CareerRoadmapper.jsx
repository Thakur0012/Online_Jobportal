import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Target, Map, Compass, BookOpen,
    Award, TrendingUp, ChevronRight,
    ArrowRight, Loader2, Sparkles, RotateCcw,
    CheckCircle2, Lock, AlertCircle, Zap, Navigation
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import api from '../lib/axios';

const CareerRoadmapper = () => {
    const { isAuthenticated, isLoading: authLoading } = useAuthStore();
    const navigate = useNavigate();
    const [currentRole, setCurrentRole] = useState('');
    const [targetRole, setTargetRole] = useState('');
    const [loading, setLoading] = useState(false);
    const [roadmap, setRoadmap] = useState(null);
    const [error, setError] = useState('');
    const [loadStep, setLoadStep] = useState(0);

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            navigate('/login', { state: { from: '/career-roadmap', message: 'Please login to use the AI Career Roadmapper.' } });
        }
    }, [isAuthenticated, authLoading, navigate]);

    if (authLoading || !isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #0a0a0f 0%, #111118 100%)' }}>
                <div className="text-center">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
                        style={{ background: 'rgba(249,115,22,0.12)', border: '1px solid rgba(249,115,22,0.3)' }}>
                        <Lock size={24} style={{ color: '#F97316' }} />
                    </div>
                    <p className="text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.4)' }}>Checking access...</p>
                </div>
            </div>
        );
    }

    const loadingTexts = [
        'Analyzing your career profile...',
        'Mapping finance career pathways...',
        'Sourcing Tier-1 benchmarks...',
        'Crafting your personalized roadmap...',
    ];

    const handleGenerate = async (e) => {
        e.preventDefault();
        if (!currentRole || !targetRole) {
            setError('Please describe both where you are and where you want to go.');
            return;
        }
        setLoading(true);
        setRoadmap(null);
        setError('');
        const interval = setInterval(() => {
            setLoadStep(prev => (prev < loadingTexts.length - 1 ? prev + 1 : prev));
        }, 1800);
        try {
            const res = await api.post('/ai/career-roadmap', { currentRole, targetRole });
            setRoadmap(res.data);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to generate roadmap. Please try again.');
        } finally {
            clearInterval(interval);
            setLoading(false);
            setLoadStep(0);
        }
    };

    const phaseColors = [
        { accent: '#F97316', bg: 'rgba(249,115,22,0.08)', border: 'rgba(249,115,22,0.2)', num: 'rgba(249,115,22,0.15)' },
        { accent: '#8B5CF6', bg: 'rgba(139,92,246,0.08)', border: 'rgba(139,92,246,0.2)', num: 'rgba(139,92,246,0.15)' },
        { accent: '#06B6D4', bg: 'rgba(6,182,212,0.08)', border: 'rgba(6,182,212,0.2)', num: 'rgba(6,182,212,0.15)' },
        { accent: '#22C55E', bg: 'rgba(34,197,94,0.08)', border: 'rgba(34,197,94,0.2)', num: 'rgba(34,197,94,0.15)' },
    ];

    return (
        <div className="min-h-screen" style={{ background: '#F8F9FA', fontFamily: 'Plus Jakarta Sans, Inter, sans-serif' }}>

            {/* ── HERO ──────────────────────────────────────────────────── */}
            <div className="relative overflow-hidden pt-16 pb-20"
                style={{ background: 'linear-gradient(135deg, #0a0a0f 0%, #111118 50%, #0f0f1a 100%)' }}>
                {/* Orbs */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div style={{ position: 'absolute', top: '-20%', right: '-5%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(249,115,22,0.18) 0%, transparent 65%)', filter: 'blur(60px)' }} />
                    <div style={{ position: 'absolute', bottom: '-10%', left: '5%', width: '350px', height: '350px', background: 'radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 65%)', filter: 'blur(50px)' }} />
                </div>
                <div className="absolute inset-0 opacity-[0.04]"
                    style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)', backgroundSize: '48px 48px' }} />

                <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
                    <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 mb-6">
                        <span className="flex items-center gap-2 text-[11px] font-black tracking-[0.18em] uppercase px-4 py-2 rounded-full"
                            style={{ background: 'rgba(249,115,22,0.12)', border: '1px solid rgba(249,115,22,0.3)', color: '#FB923C' }}>
                            <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}>
                                <Compass size={12} />
                            </motion.div>
                            Strategic AI
                        </span>
                    </motion.div>

                    <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                        className="text-4xl sm:text-5xl md:text-6xl font-black tracking-[-0.04em] leading-[1.05] mb-5"
                        style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                        <span className="text-white">Career </span>
                        <span style={{
                            background: 'linear-gradient(135deg, #FB923C 0%, #F97316 50%, #EA580C 100%)',
                            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', fontStyle: 'italic',
                        }}>Roadmapper</span>
                    </motion.h1>
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}
                        className="text-base font-medium max-w-xl mx-auto leading-relaxed"
                        style={{ color: 'rgba(255,255,255,0.45)' }}>
                        Map your ascent to the top of Finance. 3 years, 1 target, infinite possibilities.
                    </motion.p>

                    {/* Feature pills */}
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
                        className="flex flex-wrap items-center justify-center gap-3 mt-8">
                        {['AI-Powered Strategy', 'Phase-by-Phase Plan', 'Finance-Specific Path'].map(feat => (
                            <span key={feat} className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full"
                                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)' }}>
                                <CheckCircle2 size={10} style={{ color: '#22C55E' }} />
                                {feat}
                            </span>
                        ))}
                    </motion.div>
                </div>
            </div>

            {/* ── MAIN CONTENT ──────────────────────────────────────────── */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
                <AnimatePresence mode="wait">

                    {/* Input Form */}
                    {!roadmap && !loading && (
                        <motion.div key="form"
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                            className="rounded-2xl overflow-hidden"
                            style={{ background: 'white', border: '1px solid rgba(0,0,0,0.07)', boxShadow: '0 8px 40px rgba(0,0,0,0.08)' }}>
                            <div className="p-8">
                                <form onSubmit={handleGenerate} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 relative">
                                        {/* Connector */}
                                        <div className="hidden md:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full items-center justify-center"
                                            style={{ background: 'white', border: '2px solid rgba(249,115,22,0.2)', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                                            <ArrowRight size={13} style={{ color: '#F97316' }} />
                                        </div>

                                        {/* Current Role */}
                                        <div>
                                            <label className="text-[10px] font-black uppercase tracking-widest mb-2.5 block" style={{ color: '#9CA3AF' }}>
                                                Current Position
                                            </label>
                                            <div className="relative">
                                                <Map size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: '#9CA3AF', pointerEvents: 'none' }} />
                                                <input
                                                    value={currentRole}
                                                    onChange={(e) => setCurrentRole(e.target.value)}
                                                    placeholder="e.g. Junior Accountant"
                                                    className="w-full pl-11 pr-5 py-4 rounded-xl text-sm font-semibold focus:outline-none transition-all"
                                                    style={{ background: '#F9FAFB', border: '1.5px solid rgba(0,0,0,0.09)', color: '#111111' }}
                                                    onFocus={e => e.currentTarget.style.border = '1.5px solid rgba(249,115,22,0.4)'}
                                                    onBlur={e => e.currentTarget.style.border = '1.5px solid rgba(0,0,0,0.09)'}
                                                />
                                            </div>
                                        </div>

                                        {/* Target Role */}
                                        <div>
                                            <label className="text-[10px] font-black uppercase tracking-widest mb-2.5 block" style={{ color: '#F97316' }}>
                                                Dream Finance Role
                                            </label>
                                            <div className="relative">
                                                <Target size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: '#F97316', pointerEvents: 'none' }} />
                                                <input
                                                    value={targetRole}
                                                    onChange={(e) => setTargetRole(e.target.value)}
                                                    placeholder="e.g. Investment Banker"
                                                    className="w-full pl-11 pr-5 py-4 rounded-xl text-sm font-semibold focus:outline-none transition-all"
                                                    style={{ background: '#FFF7ED', border: '1.5px solid rgba(249,115,22,0.25)', color: '#111111' }}
                                                    onFocus={e => e.currentTarget.style.border = '1.5px solid rgba(249,115,22,0.5)'}
                                                    onBlur={e => e.currentTarget.style.border = '1.5px solid rgba(249,115,22,0.25)'}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Error */}
                                    <AnimatePresence>
                                        {error && (
                                            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                                                className="flex items-center gap-3 px-5 py-3.5 rounded-xl text-sm font-semibold"
                                                style={{ background: 'rgba(244,63,94,0.08)', border: '1px solid rgba(244,63,94,0.2)', color: '#F43F5E' }}>
                                                <AlertCircle size={16} style={{ flexShrink: 0 }} />
                                                {error}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    <motion.button
                                        type="submit"
                                        disabled={loading}
                                        whileHover={{ scale: 1.01, y: -1 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="w-full flex items-center justify-center gap-3 py-4 rounded-xl font-bold text-base text-white disabled:opacity-50"
                                        style={{
                                            background: 'linear-gradient(135deg, #111118, #1a1a26)',
                                            boxShadow: '0 8px 28px rgba(0,0,0,0.2)',
                                        }}>
                                        <Zap size={17} style={{ color: '#F97316' }} />
                                        Generate My Road to Success
                                        <Sparkles size={16} style={{ color: '#F97316' }} />
                                    </motion.button>
                                </form>
                            </div>
                        </motion.div>
                    )}

                    {/* Loading State */}
                    {loading && (
                        <motion.div key="loading"
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="flex flex-col items-center justify-center py-24 rounded-2xl"
                            style={{ background: 'white', border: '1px solid rgba(0,0,0,0.07)', boxShadow: '0 8px 40px rgba(0,0,0,0.08)' }}>
                            {/* Animated compass */}
                            <div className="relative mb-10">
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                                    className="w-28 h-28 rounded-full"
                                    style={{ border: '6px solid rgba(0,0,0,0.05)', borderTop: '6px solid #F97316' }}
                                />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Navigation size={28} style={{ color: '#F97316' }} className="animate-pulse" />
                                </div>
                            </div>
                            <AnimatePresence mode="wait">
                                <motion.p key={loadStep}
                                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                                    className="text-xl font-black mb-2 text-center px-8"
                                    style={{ color: '#111111', letterSpacing: '-0.025em' }}>
                                    {loadingTexts[loadStep]}
                                </motion.p>
                            </AnimatePresence>
                            <p className="text-sm font-medium animate-pulse" style={{ color: '#9CA3AF' }}>
                                Your personalized finance career map is being crafted...
                            </p>
                            <div className="flex gap-2 mt-8">
                                {loadingTexts.map((_, i) => (
                                    <motion.div key={i} className="h-1.5 rounded-full transition-all duration-500"
                                        style={{ width: i <= loadStep ? '24px' : '6px', background: i <= loadStep ? '#F97316' : 'rgba(0,0,0,0.12)' }} />
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* Roadmap Results */}
                    {roadmap && (
                        <motion.div key="results"
                            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                            className="space-y-8">

                            {/* Goal Destination Card */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="relative overflow-hidden rounded-2xl p-8 text-center"
                                style={{ background: 'linear-gradient(145deg, #111118 0%, #1a1a26 100%)', border: '1px solid rgba(249,115,22,0.2)', boxShadow: '0 20px 60px rgba(0,0,0,0.22)' }}>
                                <div className="absolute inset-0 pointer-events-none"
                                    style={{ background: 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(249,115,22,0.2) 0%, transparent 60%)' }} />
                                <div className="absolute top-4 right-4 opacity-[0.07]">
                                    <TrendingUp size={100} style={{ color: '#F97316' }} />
                                </div>
                                <div className="relative z-10">
                                    <span className="text-[9px] font-black uppercase tracking-[0.3em] block mb-3" style={{ color: 'rgba(249,115,22,0.6)' }}>
                                        Final Destination
                                    </span>
                                    <h2 className="text-3xl md:text-4xl font-black text-white mb-4" style={{ letterSpacing: '-0.035em' }}>
                                        {roadmap.goal}
                                    </h2>
                                    <span className="inline-flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-full"
                                        style={{ background: 'rgba(249,115,22,0.12)', border: '1px solid rgba(249,115,22,0.25)', color: '#FB923C' }}>
                                        <CheckCircle2 size={12} />
                                        Path Verified by Finance AI
                                    </span>
                                </div>
                            </motion.div>

                            {/* Roadmap Steps — vertical timeline */}
                            <div className="relative">
                                {/* Vertical line */}
                                <div className="absolute left-6 top-0 bottom-0 w-px"
                                    style={{ background: 'linear-gradient(180deg, #F97316 0%, rgba(249,115,22,0.1) 100%)' }} />

                                <div className="space-y-6">
                                    {roadmap.roadmaps?.map((step, idx) => {
                                        const palette = phaseColors[idx % phaseColors.length];
                                        return (
                                            <motion.div key={idx}
                                                initial={{ opacity: 0, x: -20 }}
                                                whileInView={{ opacity: 1, x: 0 }}
                                                viewport={{ once: true }}
                                                transition={{ delay: idx * 0.08 }}
                                                className="relative pl-16">

                                                {/* Phase bubble */}
                                                <div className="absolute left-0 top-0 w-12 h-12 rounded-xl flex flex-col items-center justify-center z-20"
                                                    style={{ background: 'white', border: `2px solid ${palette.accent}33`, boxShadow: `0 4px 16px ${palette.accent}22` }}>
                                                    <span className="text-[7px] font-black uppercase tracking-widest" style={{ color: palette.accent }}>Ph.</span>
                                                    <span className="text-lg font-black leading-none" style={{ color: palette.accent }}>{idx + 1}</span>
                                                </div>

                                                {/* Card */}
                                                <div className="rounded-2xl overflow-hidden transition-all duration-200 group"
                                                    style={{ background: 'white', border: '1px solid rgba(0,0,0,0.07)', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}
                                                    onMouseEnter={e => { e.currentTarget.style.border = `1px solid ${palette.accent}33`; e.currentTarget.style.boxShadow = `0 8px 32px ${palette.accent}18`; }}
                                                    onMouseLeave={e => { e.currentTarget.style.border = '1px solid rgba(0,0,0,0.07)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.05)'; }}>
                                                    {/* Card top accent */}
                                                    <div className="h-[3px]" style={{ background: `linear-gradient(90deg, ${palette.accent}, transparent)` }} />

                                                    <div className="p-6">
                                                        {/* Title */}
                                                        <div className="flex items-center justify-between mb-5">
                                                            <h3 className="text-lg font-black leading-tight" style={{ color: palette.accent, letterSpacing: '-0.025em' }}>
                                                                {step.title}
                                                            </h3>
                                                            <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 transition-all duration-200" style={{ color: palette.accent }} />
                                                        </div>

                                                        {/* Actions */}
                                                        <div className="mb-5">
                                                            <p className="text-[9px] font-black uppercase tracking-widest mb-3 flex items-center gap-1.5" style={{ color: '#9CA3AF' }}>
                                                                <Map size={10} />
                                                                Strategic Actions
                                                            </p>
                                                            <ul className="space-y-2">
                                                                {step.actions?.map((action, i) => (
                                                                    <li key={i} className="flex gap-2.5 text-sm font-medium leading-snug" style={{ color: '#374151' }}>
                                                                        <ArrowRight size={13} style={{ color: palette.accent, flexShrink: 0, marginTop: '3px' }} />
                                                                        {action}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>

                                                        {/* Certs + Skills */}
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-5"
                                                            style={{ borderTop: '1px solid rgba(0,0,0,0.06)' }}>
                                                            {/* Certifications */}
                                                            <div>
                                                                <p className="text-[9px] font-black uppercase tracking-widest mb-2.5 flex items-center gap-1.5" style={{ color: '#9CA3AF' }}>
                                                                    <Award size={10} style={{ color: '#F59E0B' }} />
                                                                    Certifications
                                                                </p>
                                                                <div className="flex flex-wrap gap-1.5">
                                                                    {step.certifications?.map((cert, c) => (
                                                                        <span key={c} className="text-[10px] font-bold px-2.5 py-1 rounded-full"
                                                                            style={{ background: 'rgba(245,158,11,0.08)', color: '#B45309', border: '1px solid rgba(245,158,11,0.2)' }}>
                                                                            {cert}
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                            </div>

                                                            {/* Skills */}
                                                            <div>
                                                                <p className="text-[9px] font-black uppercase tracking-widest mb-2.5 flex items-center gap-1.5" style={{ color: '#9CA3AF' }}>
                                                                    <BookOpen size={10} style={{ color: '#22C55E' }} />
                                                                    Target Skills
                                                                </p>
                                                                <div className="flex flex-wrap gap-1.5">
                                                                    {step.targetSkills?.map((skill, s) => (
                                                                        <span key={s} className="text-[10px] font-bold px-2.5 py-1 rounded-full"
                                                                            style={{ background: 'rgba(34,197,94,0.08)', color: '#15803D', border: '1px solid rgba(34,197,94,0.2)' }}>
                                                                            {skill}
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Regenerate button */}
                            <div className="flex justify-center pt-2">
                                <button
                                    onClick={() => { setRoadmap(null); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                                    className="flex items-center gap-2.5 px-6 py-3 rounded-xl text-sm font-bold transition-all"
                                    style={{ background: 'white', border: '1px solid rgba(0,0,0,0.08)', color: '#6B7280', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
                                    onMouseEnter={e => { e.currentTarget.style.color = '#F97316'; e.currentTarget.style.border = '1px solid rgba(249,115,22,0.2)'; }}
                                    onMouseLeave={e => { e.currentTarget.style.color = '#6B7280'; e.currentTarget.style.border = '1px solid rgba(0,0,0,0.08)'; }}>
                                    <RotateCcw size={14} />
                                    Create New Roadmap
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default CareerRoadmapper;
