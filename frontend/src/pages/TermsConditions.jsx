import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    FileText, CheckCircle, AlertCircle, Info,
    ShieldCheck, Shield, Lock, Eye, Globe, Bell, MessageSquare
} from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../lib/axios';
import SeoHead from '../components/SeoHead';

const STATIC_TERMS = [
    { title: 'Acceptance of Terms', icon: 'CheckCircle', content: 'By accessing or using LedgerBandhu, you agree to be bound by these Terms and Conditions. If you do not agree, you may not use our platform.' },
    { title: 'User Responsibilities', icon: 'Info', content: 'Users are responsible for maintaining the confidentiality of their account details and for all activities that occur under their account. You agree to provide accurate and complete information.' },
    { title: 'Platform Usage', icon: 'ShieldCheck', content: 'The platform is for legitimate job search and recruitment activities. Any misuse, such as posting fraudulent jobs, spamming, or scraping data, is strictly prohibited and results in immediate termination.' },
    { title: 'Intellectual Property', icon: 'FileText', content: 'All content on LedgerBandhu, including logos, graphics, and text, is our property and protected by intellectual property laws. You may not use it without express permission.' },
    { title: 'Limitation of Liability', icon: 'AlertCircle', content: 'LedgerBandhu is not liable for any direct, indirect, incidental, or consequential damages resulting from your use of the platform or any job applications/hirings.' },
];

const iconMap = {
    Shield: Shield, Lock: Lock, Eye: Eye, FileText: FileText,
    Globe: Globe, Bell: Bell, CheckCircle: CheckCircle,
    AlertCircle: AlertCircle, Info: Info, ShieldCheck: ShieldCheck,
};

const SectionCard = ({ section, idx }) => {
    const Icon = iconMap[section.icon] || CheckCircle;
    const accentColors = ['#F97316', '#8B5CF6', '#06B6D4', '#22C55E', '#F59E0B'];
    const accent = accentColors[idx % accentColors.length];
    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.07 }}
            className="flex gap-5 rounded-2xl p-6 transition-all duration-200 group"
            style={{ background: 'white', border: '1px solid rgba(0,0,0,0.07)', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}
            onMouseEnter={e => { e.currentTarget.style.border = `1px solid ${accent}28`; e.currentTarget.style.boxShadow = `0 8px 28px ${accent}12`; }}
            onMouseLeave={e => { e.currentTarget.style.border = '1px solid rgba(0,0,0,0.07)'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.04)'; }}
        >
            {/* Left number + accent bar */}
            <div className="flex flex-col items-center gap-2 shrink-0">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{ background: `${accent}12`, border: `1px solid ${accent}25` }}>
                    <Icon size={16} style={{ color: accent }} />
                </div>
                <div className="flex-1 w-px" style={{ background: `linear-gradient(180deg, ${accent}30, transparent)` }} />
            </div>
            {/* Content */}
            <div className="pb-2">
                <div className="flex items-center gap-2 mb-2">
                    <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: accent }}>
                        Section {idx + 1}
                    </span>
                </div>
                <h2 className="text-base font-black mb-2 leading-tight" style={{ color: '#111111', letterSpacing: '-0.02em', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                    {section.title}
                </h2>
                <p className="text-sm font-medium leading-relaxed" style={{ color: '#6B7280' }}>
                    {section.content}
                </p>
            </div>
        </motion.div>
    );
};

const TermsConditions = () => {
    const [sections, setSections] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const res = await api.get('/cms/page/terms');
                if (res.data?.content?.sections) {
                    setSections(res.data.content.sections);
                } else {
                    setSections(STATIC_TERMS);
                }
            } catch (error) {
                console.error('Error fetching terms:', error);
                setSections(STATIC_TERMS);
            } finally {
                setLoading(false);
            }
        };
        fetchContent();
    }, []);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center" style={{ background: '#F8F9FA' }}>
            <div className="w-10 h-10 rounded-full border-2 border-transparent border-t-orange-500 animate-spin" />
        </div>
    );

    return (
        <div className="min-h-screen" style={{ background: '#F8F9FA', fontFamily: 'Plus Jakarta Sans, Inter, sans-serif' }}>
            <SeoHead
                title="Terms & Conditions — LedgerBandhu"
                description="Read the terms and conditions governing your use of LedgerBandhu, India's leading finance job portal. Understand your rights and responsibilities."
                canonical="https://www.ledgerbandhu.com/terms"
            />

            {/* ── HERO ─────────────────────────────────────────────────── */}
            <div className="relative overflow-hidden pt-16 pb-20"
                style={{ background: 'linear-gradient(135deg, #0a0a0f 0%, #111118 50%, #0f0f1a 100%)' }}>
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div style={{ position: 'absolute', top: '-20%', right: '-5%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(249,115,22,0.18) 0%, transparent 65%)', filter: 'blur(60px)' }} />
                    <div style={{ position: 'absolute', bottom: '-10%', left: '5%', width: '350px', height: '350px', background: 'radial-gradient(circle, rgba(234,88,12,0.1) 0%, transparent 65%)', filter: 'blur(50px)' }} />
                </div>
                <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)', backgroundSize: '48px 48px' }} />

                <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
                    <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 mb-6">
                        <span className="flex items-center gap-2 text-[11px] font-black tracking-[0.18em] uppercase px-4 py-2 rounded-full"
                            style={{ background: 'rgba(249,115,22,0.12)', border: '1px solid rgba(249,115,22,0.3)', color: '#FB923C' }}>
                            <FileText size={12} /> Legal Document
                        </span>
                    </motion.div>
                    <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                        className="text-4xl sm:text-5xl md:text-6xl font-black tracking-[-0.04em] leading-[1.05] mb-5"
                        style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                        <span className="text-white">Terms & </span>
                        <span style={{ background: 'linear-gradient(135deg, #FB923C 0%, #F97316 50%, #EA580C 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                            Conditions
                        </span>
                    </motion.h1>
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}
                        className="text-base font-medium max-w-lg mx-auto leading-relaxed"
                        style={{ color: 'rgba(255,255,255,0.45)' }}>
                        Please read these terms carefully before using LedgerBandhu. By accessing our platform, you agree to these conditions.
                    </motion.p>
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}
                        className="text-xs font-semibold mt-4" style={{ color: 'rgba(255,255,255,0.25)' }}>
                        Last updated: {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </motion.p>
                </div>
            </div>

            {/* ── CONTENT ──────────────────────────────────────────────── */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-4">
                {sections.map((term, idx) => (
                    <SectionCard key={idx} section={term} idx={idx} />
                ))}

                {/* Termination note */}
                <motion.div
                    initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
                    className="flex items-start gap-3 p-5 rounded-xl"
                    style={{ background: 'rgba(244,63,94,0.06)', border: '1px solid rgba(244,63,94,0.15)' }}>
                    <AlertCircle size={16} style={{ color: '#F43F5E', flexShrink: 0, marginTop: '2px' }} />
                    <p className="text-sm font-medium leading-relaxed" style={{ color: '#F43F5E' }}>
                        We reserve the right to terminate accounts that violate these terms without prior notice.
                    </p>
                </motion.div>

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                    className="relative overflow-hidden rounded-2xl p-8 text-center mt-4"
                    style={{ background: 'linear-gradient(145deg, #111118 0%, #1a1a26 100%)', border: '1px solid rgba(249,115,22,0.15)', boxShadow: '0 16px 48px rgba(0,0,0,0.18)' }}>
                    <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 70% 50% at 50% -10%, rgba(249,115,22,0.18) 0%, transparent 60%)' }} />
                    <div className="relative z-10">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4"
                            style={{ background: 'rgba(249,115,22,0.12)', border: '1px solid rgba(249,115,22,0.25)' }}>
                            <MessageSquare size={20} style={{ color: '#F97316' }} />
                        </div>
                        <h3 className="text-2xl font-black text-white mb-2" style={{ letterSpacing: '-0.03em' }}>Have a legal question?</h3>
                        <p className="text-sm font-medium mb-6 max-w-xs mx-auto" style={{ color: 'rgba(255,255,255,0.4)' }}>
                            Our team is happy to clarify any part of these terms.
                        </p>
                        <Link to="/contact"
                            className="inline-flex items-center gap-2 text-sm font-bold px-6 py-3 rounded-xl text-white"
                            style={{ background: 'linear-gradient(135deg, #FB923C, #F97316)', boxShadow: '0 6px 20px rgba(249,115,22,0.38)' }}>
                            <MessageSquare size={14} /> Contact Us
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default TermsConditions;
