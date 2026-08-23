import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Upload, FileText, CheckCircle2, AlertCircle,
    Info, Star, ShieldCheck, ArrowRight,
    Target, Layout, Loader2, Lock, RotateCcw, Zap,
    TrendingUp, AlertTriangle, Sparkles
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import api from '../lib/axios';

const ResumeScorer = () => {
    const { isAuthenticated, isLoading: authLoading } = useAuthStore();
    const navigate = useNavigate();
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [analysis, setAnalysis] = useState(null);
    const [error, setError] = useState('');
    const [scanningStep, setScanningStep] = useState(0);
    const [dragging, setDragging] = useState(false);

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            navigate('/login', { state: { from: '/resume-scorer', message: 'Please login to use the AI Resume Scorer.' } });
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

    const scanningTexts = [
        'Initializing Finance Alpha Core...',
        'Parsing IFRS & GAAP terminology...',
        'Benchmarking against Tier-1 Bank standards...',
        'Identifying quantitative impact gaps...',
        'Finalizing Resume Alpha Insights...',
    ];

    const handleFileChange = (e) => {
        const selected = e.target.files[0];
        if (selected) { setFile(selected); setError(''); }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragging(false);
        const dropped = e.dataTransfer.files[0];
        if (dropped) { setFile(dropped); setError(''); }
    };

    const handleUpload = async () => {
        if (!file) { setError('Please select a resume file first.'); return; }
        setLoading(true);
        setAnalysis(null);
        setError('');
        const interval = setInterval(() => {
            setScanningStep(prev => (prev < 4 ? prev + 1 : prev));
        }, 1500);
        try {
            const formData = new FormData();
            formData.append('resume', file);
            const res = await api.post('/ai/score-resume', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setAnalysis(res.data);
        } catch (err) {
            const errMsg = err.response?.data?.error || err.response?.data?.details || err.message || 'Failed to analyze resume. Please try again.';
            setError(errMsg);
        } finally {
            clearInterval(interval);
            setLoading(false);
            setScanningStep(0);
        }
    };

    const getScoreGradient = (score) => {
        if (score >= 80) return { color: '#22C55E', bg: 'rgba(34,197,94,0.1)', border: 'rgba(34,197,94,0.25)', label: 'Gold Standard' };
        if (score >= 60) return { color: '#F59E0B', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.25)', label: 'Competitive' };
        return { color: '#F43F5E', bg: 'rgba(244,63,94,0.1)', border: 'rgba(244,63,94,0.25)', label: 'Needs Work' };
    };

    // SVG circle progress
    const CircleScore = ({ score }) => {
        const palette = getScoreGradient(score);
        const r = 54; const circ = 2 * Math.PI * r;
        const dash = (score / 100) * circ;
        return (
            <div className="relative flex items-center justify-center" style={{ width: 140, height: 140 }}>
                <svg width={140} height={140} style={{ transform: 'rotate(-90deg)', position: 'absolute' }}>
                    <circle cx={70} cy={70} r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={8} />
                    <motion.circle
                        cx={70} cy={70} r={r} fill="none"
                        stroke={palette.color} strokeWidth={8}
                        strokeLinecap="round"
                        strokeDasharray={circ}
                        initial={{ strokeDashoffset: circ }}
                        animate={{ strokeDashoffset: circ - dash }}
                        transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
                        style={{ filter: `drop-shadow(0 0 8px ${palette.color}88)` }}
                    />
                </svg>
                <div className="text-center z-10">
                    <motion.span
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5, type: 'spring' }}
                        className="text-4xl font-black"
                        style={{ color: palette.color, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                        {score}
                    </motion.span>
                    <p className="text-[9px] font-black uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.3)' }}>/ 100</p>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen" style={{ background: '#F8F9FA', fontFamily: 'Plus Jakarta Sans, Inter, sans-serif' }}>

            {/* ── HERO ──────────────────────────────────────────────────── */}
            <div className="relative overflow-hidden pt-16 pb-20"
                style={{ background: 'linear-gradient(135deg, #0a0a0f 0%, #111118 50%, #0f0f1a 100%)' }}>
                {/* Orbs */}
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
                            <Sparkles size={12} />
                            AI Career Tool
                        </span>
                    </motion.div>

                    <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.6 }}
                        className="text-4xl sm:text-5xl md:text-6xl font-black tracking-[-0.04em] leading-[1.05] mb-5"
                        style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                        <span className="text-white">Resume </span>
                        <span style={{
                            background: 'linear-gradient(135deg, #FB923C 0%, #F97316 50%, #EA580C 100%)',
                            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', fontStyle: 'italic'
                        }}>Alpha</span>
                        <span className="text-white"> Scorer</span>
                    </motion.h1>

                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}
                        className="text-base font-medium max-w-xl mx-auto leading-relaxed"
                        style={{ color: 'rgba(255,255,255,0.45)' }}>
                        See your resume through the eyes of a Tier-1 Finance Recruiter. Get your Alpha Score and master the ATS.
                    </motion.p>

                    {/* Feature pills */}
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
                        className="flex flex-wrap items-center justify-center gap-3 mt-8">
                        {['ATS-Optimized Scan', 'Finance-Specific AI', 'Instant Insights'].map(feat => (
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

                {/* Upload Zone */}
                <AnimatePresence mode="wait">
                    {!analysis && !loading && (
                        <motion.div
                            key="upload"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="rounded-2xl overflow-hidden"
                            style={{ background: 'white', border: '1px solid rgba(0,0,0,0.07)', boxShadow: '0 8px 40px rgba(0,0,0,0.08)' }}
                        >
                            {/* Drop zone */}
                            <div
                                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                                onDragLeave={() => setDragging(false)}
                                onDrop={handleDrop}
                                className="relative m-6 rounded-xl transition-all duration-300"
                                style={{
                                    border: `2px dashed ${dragging ? '#F97316' : file ? 'rgba(34,197,94,0.5)' : 'rgba(0,0,0,0.12)'}`,
                                    background: dragging ? 'rgba(249,115,22,0.04)' : file ? 'rgba(34,197,94,0.04)' : 'rgba(0,0,0,0.02)',
                                    minHeight: '220px',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }}
                            >
                                <input
                                    type="file"
                                    onChange={handleFileChange}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    accept=".pdf,.docx"
                                />
                                <div className="text-center py-8 px-6">
                                    <motion.div
                                        animate={dragging ? { scale: 1.1 } : file ? { scale: 1.05 } : { scale: 1 }}
                                        className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 transition-all"
                                        style={{
                                            background: file
                                                ? 'linear-gradient(135deg, rgba(34,197,94,0.15), rgba(34,197,94,0.08))'
                                                : dragging
                                                    ? 'linear-gradient(135deg, rgba(249,115,22,0.15), rgba(249,115,22,0.08))'
                                                    : 'linear-gradient(135deg, #FFF7ED, #FFEDD5)',
                                            border: file ? '1px solid rgba(34,197,94,0.3)' : '1px solid rgba(249,115,22,0.2)',
                                        }}
                                    >
                                        {file
                                            ? <FileText size={28} style={{ color: '#22C55E' }} />
                                            : <Upload size={28} style={{ color: '#F97316' }} />
                                        }
                                    </motion.div>
                                    <h3 className="text-lg font-black mb-1.5" style={{ color: '#111111', letterSpacing: '-0.025em' }}>
                                        {file ? file.name : 'Drop your resume here'}
                                    </h3>
                                    <p className="text-sm font-medium" style={{ color: '#9CA3AF' }}>
                                        {file
                                            ? `${(file.size / 1024).toFixed(1)} KB • Click to change file`
                                            : 'PDF or DOCX · Max 5MB · Click or drag to upload'
                                        }
                                    </p>
                                </div>
                            </div>

                            {/* Error */}
                            <AnimatePresence>
                                {error && (
                                    <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                                        className="mx-6 mb-4 flex items-center gap-3 px-5 py-3.5 rounded-xl text-sm font-semibold"
                                        style={{ background: 'rgba(244,63,94,0.08)', border: '1px solid rgba(244,63,94,0.2)', color: '#F43F5E' }}>
                                        <AlertCircle size={16} style={{ flexShrink: 0 }} />
                                        {error}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Submit button */}
                            <div className="p-6 pt-2">
                                <motion.button
                                    onClick={handleUpload}
                                    disabled={!file}
                                    whileHover={file ? { scale: 1.01, y: -1 } : {}}
                                    whileTap={file ? { scale: 0.98 } : {}}
                                    className="w-full flex items-center justify-center gap-3 py-4 rounded-xl font-bold text-base text-white transition-all disabled:opacity-40"
                                    style={{
                                        background: 'linear-gradient(135deg, #111118, #1a1a26)',
                                        boxShadow: file ? '0 8px 28px rgba(0,0,0,0.2)' : 'none',
                                    }}
                                >
                                    <Zap size={17} style={{ color: '#F97316' }} />
                                    Get My Alpha Score
                                    <ArrowRight size={16} style={{ color: '#F97316' }} />
                                </motion.button>
                            </div>
                        </motion.div>
                    )}

                    {/* ── Scanning / Loading ─────────────────────────────── */}
                    {loading && (
                        <motion.div
                            key="loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center justify-center py-24 rounded-2xl"
                            style={{ background: 'white', border: '1px solid rgba(0,0,0,0.07)', boxShadow: '0 8px 40px rgba(0,0,0,0.08)' }}
                        >
                            {/* Spinning ring */}
                            <div className="relative mb-10">
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                                    className="w-28 h-28 rounded-full"
                                    style={{ border: '6px solid rgba(0,0,0,0.05)', borderTop: '6px solid #F97316' }}
                                />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Target size={28} style={{ color: '#F97316' }} className="animate-pulse" />
                                </div>
                            </div>

                            {/* Scanning step text */}
                            <AnimatePresence mode="wait">
                                <motion.p
                                    key={scanningStep}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="text-xl font-black mb-2 text-center px-8"
                                    style={{ color: '#111111', letterSpacing: '-0.025em' }}
                                >
                                    {scanningTexts[scanningStep]}
                                </motion.p>
                            </AnimatePresence>
                            <p className="text-sm font-medium animate-pulse" style={{ color: '#9CA3AF' }}>
                                Our AI is auditing your professional profile...
                            </p>

                            {/* Step progress dots */}
                            <div className="flex gap-2 mt-8">
                                {scanningTexts.map((_, i) => (
                                    <motion.div key={i} className="h-1.5 rounded-full transition-all duration-500"
                                        style={{
                                            width: i <= scanningStep ? '24px' : '6px',
                                            background: i <= scanningStep ? '#F97316' : 'rgba(0,0,0,0.12)',
                                        }} />
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* ── Analysis Results ───────────────────────────────── */}
                    {analysis && (
                        <motion.div
                            key="results"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="space-y-5"
                        >
                            {/* Score Overview Row */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                {/* Score circle card */}
                                <div className="flex flex-col items-center justify-center py-8 rounded-2xl"
                                    style={{ background: 'linear-gradient(145deg, #111118 0%, #1a1a26 100%)', border: '1px solid rgba(249,115,22,0.15)', boxShadow: '0 16px 40px rgba(0,0,0,0.18)' }}>
                                    <p className="text-[9px] font-black uppercase tracking-widest mb-6" style={{ color: 'rgba(255,255,255,0.3)' }}>
                                        Alpha Score
                                    </p>
                                    <CircleScore score={analysis.score} />
                                    <div className="mt-5 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest"
                                        style={{
                                            background: getScoreGradient(analysis.score).bg,
                                            color: getScoreGradient(analysis.score).color,
                                            border: `1px solid ${getScoreGradient(analysis.score).border}`,
                                        }}>
                                        {getScoreGradient(analysis.score).label}
                                    </div>
                                </div>

                                {/* Verdict card */}
                                <div className="md:col-span-2 p-7 rounded-2xl"
                                    style={{ background: 'white', border: '1px solid rgba(0,0,0,0.07)', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                                    <div className="flex items-center gap-2 mb-4">
                                        <ShieldCheck size={14} style={{ color: '#F97316' }} />
                                        <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: '#9CA3AF' }}>AI Auditor Verdict</span>
                                    </div>
                                    <p className="text-lg font-bold leading-relaxed mb-5" style={{ color: '#111111', letterSpacing: '-0.015em' }}>
                                        {analysis.summary}
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {analysis.strengths?.map((s, i) => (
                                            <span key={i} className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full"
                                                style={{ background: 'rgba(34,197,94,0.08)', color: '#16A34A', border: '1px solid rgba(34,197,94,0.2)' }}>
                                                <CheckCircle2 size={11} />
                                                {s}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Keyword Gaps & Formatting Tips */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {/* Keyword Gaps */}
                                <div className="p-7 rounded-2xl"
                                    style={{ background: 'white', border: '1px solid rgba(0,0,0,0.07)', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                                    <div className="flex items-center justify-between mb-5">
                                        <div className="flex items-center gap-2">
                                            <AlertTriangle size={14} style={{ color: '#F59E0B' }} />
                                            <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: '#9CA3AF' }}>High Priority Gaps</span>
                                        </div>
                                        <span className="text-[9px] font-bold px-2.5 py-1 rounded-full"
                                            style={{ background: 'rgba(245,158,11,0.1)', color: '#F59E0B', border: '1px solid rgba(245,158,11,0.2)' }}>
                                            Add to Resume
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap gap-2 mb-5">
                                        {analysis.keywordGaps?.map((kw, i) => (
                                            <motion.span key={i}
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: i * 0.05 }}
                                                className="text-xs font-bold px-3 py-1.5 rounded-full cursor-default transition-all"
                                                style={{ background: '#F3F4F6', color: '#374151', border: '1px solid rgba(0,0,0,0.06)' }}
                                                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(249,115,22,0.08)'; e.currentTarget.style.color = '#F97316'; e.currentTarget.style.border = '1px solid rgba(249,115,22,0.2)'; }}
                                                onMouseLeave={e => { e.currentTarget.style.background = '#F3F4F6'; e.currentTarget.style.color = '#374151'; e.currentTarget.style.border = '1px solid rgba(0,0,0,0.06)'; }}>
                                                {kw}
                                            </motion.span>
                                        ))}
                                    </div>
                                    <div className="flex items-start gap-3 p-4 rounded-xl"
                                        style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.15)' }}>
                                        <Info size={14} style={{ color: '#F59E0B', flexShrink: 0, marginTop: '2px' }} />
                                        <p className="text-xs font-medium leading-relaxed" style={{ color: '#92400E' }}>
                                            Finance recruiters use automated software to scan for these specific terms. Including them naturally will boost your ATS ranking by 40–60%.
                                        </p>
                                    </div>
                                </div>

                                {/* Formatting Tips */}
                                <div className="p-7 rounded-2xl flex flex-col"
                                    style={{ background: 'white', border: '1px solid rgba(0,0,0,0.07)', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                                    <div className="flex items-center gap-2 mb-5">
                                        <TrendingUp size={14} style={{ color: '#F97316' }} />
                                        <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: '#9CA3AF' }}>ATS Formatting Tips</span>
                                    </div>
                                    <div className="space-y-3 flex-1">
                                        {analysis.formattingTips?.map((tip, i) => (
                                            <motion.div key={i}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: i * 0.08 }}
                                                className="flex items-start gap-3 p-3.5 rounded-xl transition-all"
                                                style={{ background: '#F9FAFB', border: '1px solid transparent' }}
                                                onMouseEnter={e => { e.currentTarget.style.border = '1px solid rgba(249,115,22,0.15)'; e.currentTarget.style.background = 'rgba(249,115,22,0.04)'; }}
                                                onMouseLeave={e => { e.currentTarget.style.border = '1px solid transparent'; e.currentTarget.style.background = '#F9FAFB'; }}>
                                                <span className="w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black shrink-0"
                                                    style={{ background: 'linear-gradient(135deg, #FFF7ED, #FFEDD5)', color: '#F97316', border: '1px solid rgba(249,115,22,0.2)' }}>
                                                    {i + 1}
                                                </span>
                                                <p className="text-xs font-medium leading-relaxed" style={{ color: '#374151' }}>{tip}</p>
                                            </motion.div>
                                        ))}
                                    </div>
                                    <button className="mt-5 w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-white transition-all"
                                        style={{
                                            background: 'linear-gradient(135deg, #22C55E, #16A34A)',
                                            boxShadow: '0 4px 16px rgba(34,197,94,0.25)',
                                        }}
                                        onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 24px rgba(34,197,94,0.4)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                                        onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(34,197,94,0.25)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                                        <Layout size={14} />
                                        Download Premium Template
                                    </button>
                                </div>
                            </div>

                            {/* Re-scan button */}
                            <div className="flex justify-center pt-2">
                                <button
                                    onClick={() => { setAnalysis(null); setFile(null); }}
                                    className="flex items-center gap-2.5 px-6 py-3 rounded-xl text-sm font-bold transition-all"
                                    style={{ background: 'white', border: '1px solid rgba(0,0,0,0.08)', color: '#6B7280', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
                                    onMouseEnter={e => { e.currentTarget.style.color = '#F97316'; e.currentTarget.style.border = '1px solid rgba(249,115,22,0.2)'; }}
                                    onMouseLeave={e => { e.currentTarget.style.color = '#6B7280'; e.currentTarget.style.border = '1px solid rgba(0,0,0,0.08)'; }}>
                                    <RotateCcw size={14} />
                                    Scan Another Resume
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default ResumeScorer;
