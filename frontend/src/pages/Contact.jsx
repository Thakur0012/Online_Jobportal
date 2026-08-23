import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Phone, MapPin, Send, CheckCircle, AlertCircle, Loader2, MessageSquare } from 'lucide-react';
import api from '../lib/axios';
import SeoHead from '../components/SeoHead';

const Contact = () => {
    const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
    const [status, setStatus] = useState('idle'); // idle | loading | success | error
    const [errorMsg, setErrorMsg] = useState('');
    const [pageContent, setPageContent] = useState({
        heroTitle: 'Establish <span class="text-gradient-orange">Channel</span>',
        heroSubtitle: 'Configure strategic communications with our global financial support infrastructure.',
        addressTitle: 'Regional Node',
        addressDetails: 'Tech Executive Park, Level 15, NCR Strategic Hub',
        phoneTitle: 'Secure Line',
        phoneDetails: '+91 85955 63930',
        emailTitle: 'Encrypted Comms',
        emailDetails: 'corporate@LedgerBandhu.com',
    });

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const res = await api.get('/cms/page/contact');
                if (res.data?.content) {
                    setPageContent(prev => ({ ...prev, ...res.data.content }));
                }
            } catch (error) {
                console.error('Failed to fetch contact page content', error);
            }
        };
        fetchContent();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('loading');
        try {
            await api.post('/cms/contact', formData);
            setStatus('success');
            setFormData({ name: '', email: '', subject: '', message: '' });
        } catch (error) {
            setStatus('error');
            setErrorMsg(error.response?.data?.message || 'Something went wrong. Please try again.');
        }
    };

    const contactInfo = [
        { icon: MapPin, title: pageContent.addressTitle, details: pageContent.addressDetails },
        { icon: Phone, title: pageContent.phoneTitle, details: pageContent.phoneDetails },
        { icon: Mail, title: pageContent.emailTitle, details: pageContent.emailDetails },
    ];

    const inputStyle = {
        background: '#F9FAFB',
        border: '1.5px solid rgba(0,0,0,0.09)',
        color: '#111111',
    };

    const focusInput = (e) => { e.currentTarget.style.border = '1.5px solid rgba(249,115,22,0.45)'; e.currentTarget.style.background = 'white'; };
    const blurInput = (e) => { e.currentTarget.style.border = '1.5px solid rgba(0,0,0,0.09)'; e.currentTarget.style.background = '#F9FAFB'; };

    return (
        <div className="min-h-screen selection:bg-[#F97316]/30"
            style={{ background: '#F8F9FA', fontFamily: 'Plus Jakarta Sans, Inter, sans-serif' }}>
            <SeoHead
                title="Contact Us — LedgerBandhu Support"
                description="Get in touch with LedgerBandhu for finance job listings, employer partnerships, or general inquiries. We respond within 24 hours."
                canonical="https://www.ledgerbandhu.com/contact"
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

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 mb-6">
                        <span className="flex items-center gap-2 text-[11px] font-black tracking-[0.18em] uppercase px-4 py-2 rounded-full"
                            style={{ background: 'rgba(249,115,22,0.12)', border: '1px solid rgba(249,115,22,0.3)', color: '#FB923C' }}>
                            <MessageSquare size={12} />
                            Get In Touch
                        </span>
                    </motion.div>

                    <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                        className="text-4xl sm:text-5xl md:text-6xl font-black tracking-[-0.04em] leading-[1.05] mb-5"
                        style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                        <span className="text-white">Contact </span>
                        <span style={{
                            background: 'linear-gradient(135deg, #FB923C 0%, #F97316 50%, #EA580C 100%)',
                            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                        }}>Us</span>
                    </motion.h1>

                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}
                        className="text-base font-medium max-w-lg mx-auto leading-relaxed"
                        style={{ color: 'rgba(255,255,255,0.45)' }}>
                        Have a question or want to partner with us? We're here to help and typically respond within 24 hours.
                    </motion.p>
                </div>
            </div>

            {/* ── MAIN CONTENT ──────────────────────────────────────────── */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">

                    {/* ── Contact Info Cards ─────────────────────────────── */}
                    <div className="lg:col-span-4 space-y-4">
                        {contactInfo.map(({ icon: Icon, title, details }, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="group flex items-start gap-4 p-6 rounded-2xl transition-all duration-200"
                                style={{
                                    background: 'white',
                                    border: '1px solid rgba(0,0,0,0.07)',
                                    boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.border = '1px solid rgba(249,115,22,0.25)';
                                    e.currentTarget.style.boxShadow = '0 8px 28px rgba(249,115,22,0.1)';
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.border = '1px solid rgba(0,0,0,0.07)';
                                    e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.04)';
                                }}
                            >
                                <div className="shrink-0 w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-105"
                                    style={{ background: 'linear-gradient(135deg, #FFF7ED, #FFEDD5)', border: '1px solid rgba(249,115,22,0.2)' }}>
                                    <Icon size={18} style={{ color: '#F97316' }} />
                                </div>
                                <div>
                                    <h3 className="text-sm font-black mb-1 tracking-tight" style={{ color: '#111111' }}>{title}</h3>
                                    <p className="text-xs font-medium leading-relaxed" style={{ color: '#6B7280' }}>{details}</p>
                                </div>
                            </motion.div>
                        ))}

                        {/* Response time note */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.35 }}
                            className="p-5 rounded-2xl"
                            style={{ background: 'rgba(249,115,22,0.05)', border: '1px solid rgba(249,115,22,0.15)' }}>
                            <div className="flex items-center gap-2 mb-1">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: '#22C55E' }}>
                                    Typically online
                                </span>
                            </div>
                            <p className="text-xs font-medium" style={{ color: '#6B7280' }}>
                                Mon–Sat · 10am–6pm IST<br />
                                Response within <span className="font-bold" style={{ color: '#F97316' }}>24 hours</span>
                            </p>
                        </motion.div>
                    </div>

                    {/* ── Contact Form ───────────────────────────────────── */}
                    <div className="lg:col-span-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="rounded-2xl overflow-hidden"
                            style={{ background: 'white', border: '1px solid rgba(0,0,0,0.07)', boxShadow: '0 8px 40px rgba(0,0,0,0.07)' }}
                        >
                            {/* Form header */}
                            <div className="px-8 py-5 flex items-center gap-3"
                                style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                                <Send size={15} style={{ color: '#F97316' }} />
                                <span className="text-xs font-black uppercase tracking-widest" style={{ color: '#111111' }}>
                                    Send us a message
                                </span>
                            </div>

                            <AnimatePresence mode="wait">
                                {status === 'success' ? (
                                    <motion.div
                                        key="success"
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="flex flex-col items-center justify-center py-20 px-8 text-center"
                                    >
                                        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5"
                                            style={{ background: 'linear-gradient(135deg, rgba(34,197,94,0.12), rgba(34,197,94,0.06))', border: '1px solid rgba(34,197,94,0.25)' }}>
                                            <CheckCircle size={28} style={{ color: '#22C55E' }} />
                                        </div>
                                        <h2 className="text-2xl font-black mb-2" style={{ color: '#111111', letterSpacing: '-0.025em' }}>
                                            Message Sent!
                                        </h2>
                                        <p className="text-sm font-medium mb-8 max-w-sm leading-relaxed" style={{ color: '#6B7280' }}>
                                            Thanks for reaching out. Our team will get back to you within 24 hours.
                                        </p>
                                        <motion.button
                                            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                                            onClick={() => setStatus('idle')}
                                            className="flex items-center gap-2 px-7 py-3 rounded-xl text-sm font-bold text-white"
                                            style={{ background: 'linear-gradient(135deg, #FB923C, #F97316)', boxShadow: '0 4px 16px rgba(249,115,22,0.35)' }}>
                                            <Send size={14} />
                                            Send Another Message
                                        </motion.button>
                                    </motion.div>
                                ) : (
                                    <motion.form
                                        key="form"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        onSubmit={handleSubmit}
                                        className="p-8 space-y-5"
                                    >
                                        {/* Name + Email */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                            <div>
                                                <label className="text-[10px] font-black uppercase tracking-widest mb-2 block" style={{ color: '#9CA3AF' }}>
                                                    Your Name
                                                </label>
                                                <input
                                                    required
                                                    type="text"
                                                    placeholder="Full name"
                                                    value={formData.name}
                                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                    className="w-full px-5 py-3.5 rounded-xl text-sm font-semibold focus:outline-none transition-all"
                                                    style={inputStyle}
                                                    onFocus={focusInput}
                                                    onBlur={blurInput}
                                                />
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-black uppercase tracking-widest mb-2 block" style={{ color: '#9CA3AF' }}>
                                                    Email Address
                                                </label>
                                                <input
                                                    required
                                                    type="email"
                                                    placeholder="you@example.com"
                                                    value={formData.email}
                                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                    className="w-full px-5 py-3.5 rounded-xl text-sm font-semibold focus:outline-none transition-all"
                                                    style={inputStyle}
                                                    onFocus={focusInput}
                                                    onBlur={blurInput}
                                                />
                                            </div>
                                        </div>

                                        {/* Subject */}
                                        <div>
                                            <label className="text-[10px] font-black uppercase tracking-widest mb-2 block" style={{ color: '#9CA3AF' }}>
                                                Subject
                                            </label>
                                            <input
                                                required
                                                type="text"
                                                placeholder="How can we help?"
                                                value={formData.subject}
                                                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                                className="w-full px-5 py-3.5 rounded-xl text-sm font-semibold focus:outline-none transition-all"
                                                style={inputStyle}
                                                onFocus={focusInput}
                                                onBlur={blurInput}
                                            />
                                        </div>

                                        {/* Message */}
                                        <div>
                                            <label className="text-[10px] font-black uppercase tracking-widest mb-2 block" style={{ color: '#9CA3AF' }}>
                                                Message
                                            </label>
                                            <textarea
                                                required
                                                rows={5}
                                                placeholder="Tell us more about your inquiry..."
                                                value={formData.message}
                                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                                className="w-full px-5 py-3.5 rounded-xl text-sm font-semibold focus:outline-none transition-all resize-none"
                                                style={inputStyle}
                                                onFocus={focusInput}
                                                onBlur={blurInput}
                                            />
                                        </div>

                                        {/* Error */}
                                        <AnimatePresence>
                                            {status === 'error' && (
                                                <motion.div
                                                    initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                                                    className="flex items-center gap-3 px-5 py-3.5 rounded-xl text-sm font-semibold"
                                                    style={{ background: 'rgba(244,63,94,0.08)', border: '1px solid rgba(244,63,94,0.2)', color: '#F43F5E' }}>
                                                    <AlertCircle size={16} style={{ flexShrink: 0 }} />
                                                    {errorMsg}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>

                                        {/* Submit */}
                                        <motion.button
                                            type="submit"
                                            disabled={status === 'loading'}
                                            whileHover={status !== 'loading' ? { scale: 1.01, y: -1 } : {}}
                                            whileTap={{ scale: 0.98 }}
                                            className="w-full flex items-center justify-center gap-2.5 py-4 rounded-xl font-bold text-sm text-white disabled:opacity-60"
                                            style={{
                                                background: 'linear-gradient(135deg, #111118, #1a1a26)',
                                                boxShadow: '0 8px 28px rgba(0,0,0,0.18)',
                                            }}
                                        >
                                            {status === 'loading' ? (
                                                <><Loader2 size={16} className="animate-spin" style={{ color: '#F97316' }} /> Sending...</>
                                            ) : (
                                                <><Send size={15} style={{ color: '#F97316' }} /> Send Message</>
                                            )}
                                        </motion.button>
                                    </motion.form>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
