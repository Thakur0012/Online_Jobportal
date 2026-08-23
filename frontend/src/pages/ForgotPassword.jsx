import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Mail, KeyRound, Lock, Eye, EyeOff,
    ArrowRight, ArrowLeft, Loader2, CheckCircle,
    AlertCircle, RefreshCw, ShieldCheck
} from 'lucide-react';
import api from '../lib/axios';
import SeoHead from '../components/SeoHead';

// Step indicator
const Step = ({ num, label, active, done }) => (
    <div className="flex flex-col items-center gap-1.5">
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-black transition-all duration-300"
            style={{
                background: done ? '#22C55E' : active ? 'linear-gradient(135deg, #FB923C, #F97316)' : 'rgba(0,0,0,0.07)',
                color: (active || done) ? 'white' : '#9CA3AF',
                boxShadow: active ? '0 4px 14px rgba(249,115,22,0.4)' : done ? '0 4px 14px rgba(34,197,94,0.3)' : 'none',
            }}>
            {done ? <CheckCircle size={14} /> : num}
        </div>
        <span className="text-[9px] font-bold uppercase tracking-wider"
            style={{ color: active ? '#F97316' : done ? '#22C55E' : '#9CA3AF' }}>
            {label}
        </span>
    </div>
);
const StepLine = ({ done }) => (
    <div className="flex-1 h-px mt-4 transition-all duration-500"
        style={{ background: done ? '#22C55E' : 'rgba(0,0,0,0.08)' }} />
);

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1); // 1=email, 2=otp, 3=newPassword
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [resendCooldown, setResendCooldown] = useState(0);

    const inputBase = {
        background: '#F9FAFB',
        border: '1.5px solid rgba(0,0,0,0.09)',
        color: '#111111',
        borderRadius: '12px',
        padding: '12px 16px 12px 44px',
        fontSize: '14px',
        fontWeight: 600,
        width: '100%',
        outline: 'none',
        transition: 'all 0.2s',
        fontFamily: 'Plus Jakarta Sans, Inter, sans-serif',
    };
    const onFocus = (e) => { e.currentTarget.style.border = '1.5px solid rgba(249,115,22,0.45)'; e.currentTarget.style.background = 'white'; };
    const onBlur = (e) => { e.currentTarget.style.border = '1.5px solid rgba(0,0,0,0.09)'; e.currentTarget.style.background = '#F9FAFB'; };

    // Step 1: Send OTP
    const handleSendOtp = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await api.post('/auth/forgot-otp', { email });
            setStep(2);
            startCooldown();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send OTP. Please try again.');
        } finally { setLoading(false); }
    };

    const startCooldown = () => {
        setResendCooldown(60);
        const t = setInterval(() => {
            setResendCooldown(prev => {
                if (prev <= 1) { clearInterval(t); return 0; }
                return prev - 1;
            });
        }, 1000);
    };

    const handleResend = async () => {
        if (resendCooldown > 0) return;
        setError('');
        setLoading(true);
        try {
            await api.post('/auth/forgot-otp', { email });
            startCooldown();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to resend OTP.');
        } finally { setLoading(false); }
    };

    // OTP box input handler
    const handleOtpChange = (index, value) => {
        if (!/^\d*$/.test(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value.slice(-1);
        setOtp(newOtp);
        if (value && index < 5) {
            document.getElementById(`otp-${index + 1}`)?.focus();
        }
    };
    const handleOtpKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            document.getElementById(`otp-${index - 1}`)?.focus();
        }
    };

    // Step 2: Verify OTP
    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        const otpString = otp.join('');
        if (otpString.length < 6) { setError('Please enter the complete 6-digit OTP.'); return; }
        setError('');
        setLoading(true);
        try {
            // We verify OTP at reset step — just advance to step 3
            setStep(3);
        } catch (err) {
            setError('Something went wrong.');
        } finally { setLoading(false); }
    };

    // Step 3: Reset Password
    const handleReset = async (e) => {
        e.preventDefault();
        if (newPassword.length < 6) { setError('Password must be at least 6 characters.'); return; }
        if (newPassword !== confirmPassword) { setError('Passwords do not match.'); return; }
        setError('');
        setLoading(true);
        try {
            await api.post('/auth/reset-password', { email, otp: otp.join(''), newPassword });
            setStep(4); // success
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to reset password. OTP may have expired.');
        } finally { setLoading(false); }
    };

    return (
        <div className="min-h-screen flex" style={{ fontFamily: 'Plus Jakarta Sans, Inter, sans-serif' }}>
            <SeoHead
                title="Forgot Password — LedgerBandhu"
                description="Reset your LedgerBandhu account password using your registered email and OTP verification."
                canonical="https://www.ledgerbandhu.com/forgot-password"
                noIndex={true}
            />

            {/* ── LEFT PANEL ────────────────────────────────────────────── */}
            <div className="hidden lg:flex lg:w-5/12 xl:w-2/5 relative overflow-hidden flex-col justify-between p-12"
                style={{ background: 'linear-gradient(145deg, #0a0a0f 0%, #111118 60%, #0f0f1a 100%)' }}>
                <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(249,115,22,0.2) 0%, transparent 65%)', filter: 'blur(60px)', pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', bottom: '-10%', left: '-10%', width: '320px', height: '320px', background: 'radial-gradient(circle, rgba(234,88,12,0.12) 0%, transparent 65%)', filter: 'blur(50px)', pointerEvents: 'none' }} />
                <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)', backgroundSize: '48px 48px' }} />

                <div className="relative z-10">
                    <Link to="/" className="inline-flex items-center gap-3 mb-16">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                            style={{ background: 'linear-gradient(135deg, #FB923C, #F97316)', boxShadow: '0 8px 24px rgba(249,115,22,0.4)' }}>
                            <ShieldCheck size={18} color="white" />
                        </div>
                        <span className="text-xl font-black text-white" style={{ letterSpacing: '-0.03em' }}>
                            Ledger<span style={{ color: '#F97316' }}>Bandhu</span>
                        </span>
                    </Link>

                    <h1 className="text-3xl font-black text-white mb-4" style={{ letterSpacing: '-0.035em', lineHeight: '1.1' }}>
                        Locked out?<br />
                        <span style={{ background: 'linear-gradient(135deg, #FB923C, #F97316)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                            We've got you
                        </span>
                    </h1>
                    <p className="text-sm font-medium leading-relaxed mb-10" style={{ color: 'rgba(255,255,255,0.45)' }}>
                        Reset your password in 3 quick steps. We'll send a one-time code directly to your registered email.
                    </p>

                    <div className="space-y-5">
                        {[
                            { n: '1', text: 'Enter your registered email' },
                            { n: '2', text: 'Verify the OTP sent to you' },
                            { n: '3', text: 'Set a brand new password' },
                        ].map(({ n, text }) => (
                            <div key={n} className="flex items-center gap-3">
                                <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black shrink-0"
                                    style={{ background: 'rgba(249,115,22,0.12)', border: '1px solid rgba(249,115,22,0.2)', color: '#F97316' }}>
                                    {n}
                                </div>
                                <span className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.55)' }}>{text}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="relative z-10 p-5 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <p className="text-xs font-medium italic leading-relaxed" style={{ color: 'rgba(255,255,255,0.4)' }}>
                        "Your account security is our top priority. OTPs expire after 5 minutes."
                    </p>
                    <p className="text-[10px] font-black mt-2" style={{ color: '#F97316' }}>— LedgerBandhu Security Team</p>
                </div>
            </div>

            {/* ── RIGHT PANEL ───────────────────────────────────────────── */}
            <div className="flex-1 flex items-center justify-center py-10 px-4 sm:px-8"
                style={{ background: '#F8F9FA' }}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md"
                >
                    {/* Mobile logo */}
                    <div className="lg:hidden text-center mb-8">
                        <Link to="/" className="inline-flex items-center gap-2">
                            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                                style={{ background: 'linear-gradient(135deg, #FB923C, #F97316)', boxShadow: '0 4px 14px rgba(249,115,22,0.4)' }}>
                                <ShieldCheck size={16} color="white" />
                            </div>
                            <span className="text-xl font-black" style={{ color: '#111111', letterSpacing: '-0.03em' }}>
                                Ledger<span style={{ color: '#F97316' }}>Bandhu</span>
                            </span>
                        </Link>
                    </div>

                    {/* Step indicator (only for steps 1–3) */}
                    {step <= 3 && (
                        <div className="flex items-center mb-8">
                            <Step num={1} label="Email" active={step === 1} done={step > 1} />
                            <StepLine done={step > 1} />
                            <Step num={2} label="Verify" active={step === 2} done={step > 2} />
                            <StepLine done={step > 2} />
                            <Step num={3} label="Reset" active={step === 3} done={step > 3} />
                        </div>
                    )}

                    {/* Heading */}
                    {step < 4 && (
                        <div className="mb-6">
                            <h2 className="text-2xl font-black mb-1" style={{ color: '#111111', letterSpacing: '-0.03em' }}>
                                {step === 1 && 'Forgot your password?'}
                                {step === 2 && 'Check your email'}
                                {step === 3 && 'Create new password'}
                            </h2>
                            <p className="text-sm font-medium" style={{ color: '#9CA3AF' }}>
                                {step === 1 && "Enter your email and we'll send you a reset code."}
                                {step === 2 && `We sent a 6-digit code to ${email}`}
                                {step === 3 && 'Your OTP is verified. Set a strong new password.'}
                            </p>
                        </div>
                    )}

                    {/* Form card */}
                    <AnimatePresence mode="wait">

                        {/* ── STEP 1: Email ─────────────────────────── */}
                        {step === 1 && (
                            <motion.div key="s1"
                                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                                className="rounded-2xl overflow-hidden"
                                style={{ background: 'white', border: '1px solid rgba(0,0,0,0.07)', boxShadow: '0 8px 40px rgba(0,0,0,0.07)' }}>
                                <form onSubmit={handleSendOtp} className="p-7 space-y-4">
                                    <AnimatePresence>
                                        {error && (
                                            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                                                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold"
                                                style={{ background: 'rgba(244,63,94,0.08)', border: '1px solid rgba(244,63,94,0.2)', color: '#F43F5E' }}>
                                                <AlertCircle size={15} style={{ flexShrink: 0 }} /> {error}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                    <div>
                                        <label className="block text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: '#9CA3AF' }}>Registered Email</label>
                                        <div className="relative">
                                            <Mail size={15} className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#9CA3AF' }} />
                                            <input type="email" required placeholder="you@example.com"
                                                value={email} onChange={e => setEmail(e.target.value)}
                                                style={inputBase} onFocus={onFocus} onBlur={onBlur} />
                                        </div>
                                    </div>
                                    <motion.button type="submit" disabled={loading}
                                        whileHover={!loading ? { scale: 1.01, y: -1 } : {}} whileTap={{ scale: 0.98 }}
                                        className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl font-bold text-sm text-white disabled:opacity-50"
                                        style={{ background: 'linear-gradient(135deg, #111118, #1a1a26)', boxShadow: '0 8px 28px rgba(0,0,0,0.18)' }}>
                                        {loading ? <><Loader2 size={15} className="animate-spin" style={{ color: '#F97316' }} /> Sending...</>
                                            : <><Mail size={15} style={{ color: '#F97316' }} /> Send Reset Code <ArrowRight size={13} style={{ color: '#F97316' }} /></>}
                                    </motion.button>
                                    <div className="text-center pt-1">
                                        <Link to="/login" className="text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                                            style={{ color: '#9CA3AF' }}
                                            onMouseEnter={e => e.currentTarget.style.color = '#F97316'}
                                            onMouseLeave={e => e.currentTarget.style.color = '#9CA3AF'}>
                                            <ArrowLeft size={12} /> Back to Sign In
                                        </Link>
                                    </div>
                                </form>
                            </motion.div>
                        )}

                        {/* ── STEP 2: OTP ───────────────────────────── */}
                        {step === 2 && (
                            <motion.div key="s2"
                                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                                className="rounded-2xl overflow-hidden"
                                style={{ background: 'white', border: '1px solid rgba(0,0,0,0.07)', boxShadow: '0 8px 40px rgba(0,0,0,0.07)' }}>
                                <form onSubmit={handleVerifyOtp} className="p-7 space-y-5">
                                    <AnimatePresence>
                                        {error && (
                                            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                                                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold"
                                                style={{ background: 'rgba(244,63,94,0.08)', border: '1px solid rgba(244,63,94,0.2)', color: '#F43F5E' }}>
                                                <AlertCircle size={15} style={{ flexShrink: 0 }} /> {error}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    <div>
                                        <label className="block text-[10px] font-black uppercase tracking-widest mb-4 text-center" style={{ color: '#9CA3AF' }}>
                                            Enter 6-Digit Code
                                        </label>
                                        {/* OTP boxes */}
                                        <div className="flex gap-2 justify-center">
                                            {otp.map((digit, i) => (
                                                <input
                                                    key={i}
                                                    id={`otp-${i}`}
                                                    type="text"
                                                    inputMode="numeric"
                                                    maxLength={1}
                                                    value={digit}
                                                    onChange={e => handleOtpChange(i, e.target.value)}
                                                    onKeyDown={e => handleOtpKeyDown(i, e)}
                                                    className="text-center font-black text-xl transition-all"
                                                    style={{
                                                        width: '46px', height: '54px',
                                                        borderRadius: '12px',
                                                        border: digit ? '1.5px solid rgba(249,115,22,0.45)' : '1.5px solid rgba(0,0,0,0.09)',
                                                        background: digit ? 'rgba(249,115,22,0.04)' : '#F9FAFB',
                                                        color: '#111111',
                                                        outline: 'none',
                                                        fontFamily: 'Plus Jakarta Sans, Inter, sans-serif',
                                                    }}
                                                    onFocus={e => { e.currentTarget.style.border = '1.5px solid rgba(249,115,22,0.55)'; e.currentTarget.style.background = 'white'; }}
                                                    onBlur={e => { e.currentTarget.style.border = digit ? '1.5px solid rgba(249,115,22,0.45)' : '1.5px solid rgba(0,0,0,0.09)'; e.currentTarget.style.background = digit ? 'rgba(249,115,22,0.04)' : '#F9FAFB'; }}
                                                />
                                            ))}
                                        </div>
                                    </div>

                                    <motion.button type="submit" disabled={loading || otp.join('').length < 6}
                                        whileHover={!loading ? { scale: 1.01, y: -1 } : {}} whileTap={{ scale: 0.98 }}
                                        className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl font-bold text-sm text-white disabled:opacity-50"
                                        style={{ background: 'linear-gradient(135deg, #111118, #1a1a26)', boxShadow: '0 8px 28px rgba(0,0,0,0.18)' }}>
                                        {loading ? <><Loader2 size={15} className="animate-spin" style={{ color: '#F97316' }} /> Verifying...</>
                                            : <><KeyRound size={15} style={{ color: '#F97316' }} /> Verify Code <ArrowRight size={13} style={{ color: '#F97316' }} /></>}
                                    </motion.button>

                                    <div className="flex items-center justify-between pt-1">
                                        <button type="button" onClick={() => { setStep(1); setOtp(['','','','','','']); setError(''); }}
                                            className="text-xs font-bold flex items-center gap-1.5 transition-colors"
                                            style={{ color: '#9CA3AF' }}
                                            onMouseEnter={e => e.currentTarget.style.color = '#F97316'}
                                            onMouseLeave={e => e.currentTarget.style.color = '#9CA3AF'}>
                                            <ArrowLeft size={12} /> Change email
                                        </button>
                                        <button type="button" onClick={handleResend}
                                            disabled={resendCooldown > 0 || loading}
                                            className="text-xs font-bold flex items-center gap-1.5 disabled:opacity-40 transition-colors"
                                            style={{ color: resendCooldown > 0 ? '#9CA3AF' : '#F97316' }}>
                                            <RefreshCw size={12} />
                                            {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend OTP'}
                                        </button>
                                    </div>
                                </form>
                            </motion.div>
                        )}

                        {/* ── STEP 3: New Password ──────────────────── */}
                        {step === 3 && (
                            <motion.div key="s3"
                                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                                className="rounded-2xl overflow-hidden"
                                style={{ background: 'white', border: '1px solid rgba(0,0,0,0.07)', boxShadow: '0 8px 40px rgba(0,0,0,0.07)' }}>
                                <form onSubmit={handleReset} className="p-7 space-y-4">
                                    <AnimatePresence>
                                        {error && (
                                            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                                                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold"
                                                style={{ background: 'rgba(244,63,94,0.08)', border: '1px solid rgba(244,63,94,0.2)', color: '#F43F5E' }}>
                                                <AlertCircle size={15} style={{ flexShrink: 0 }} /> {error}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                    <div>
                                        <label className="block text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: '#9CA3AF' }}>New Password</label>
                                        <div className="relative">
                                            <Lock size={15} className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#9CA3AF' }} />
                                            <input type={showPassword ? 'text' : 'password'} required placeholder="Min. 6 characters"
                                                value={newPassword} onChange={e => setNewPassword(e.target.value)}
                                                style={{ ...inputBase, paddingRight: '48px' }} onFocus={onFocus} onBlur={onBlur} />
                                            <button type="button" onClick={() => setShowPassword(p => !p)}
                                                className="absolute right-3.5 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center"
                                                style={{ color: '#9CA3AF' }}
                                                onMouseEnter={e => e.currentTarget.style.color = '#F97316'}
                                                onMouseLeave={e => e.currentTarget.style.color = '#9CA3AF'}>
                                                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                                            </button>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: '#9CA3AF' }}>Confirm Password</label>
                                        <div className="relative">
                                            <Lock size={15} className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#9CA3AF' }} />
                                            <input type={showConfirm ? 'text' : 'password'} required placeholder="Re-enter new password"
                                                value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                                                style={{ ...inputBase, paddingRight: '48px', borderColor: confirmPassword && confirmPassword !== newPassword ? 'rgba(244,63,94,0.5)' : undefined }}
                                                onFocus={onFocus} onBlur={onBlur} />
                                            <button type="button" onClick={() => setShowConfirm(p => !p)}
                                                className="absolute right-3.5 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center"
                                                style={{ color: '#9CA3AF' }}
                                                onMouseEnter={e => e.currentTarget.style.color = '#F97316'}
                                                onMouseLeave={e => e.currentTarget.style.color = '#9CA3AF'}>
                                                {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                                            </button>
                                        </div>
                                        {confirmPassword && confirmPassword !== newPassword && (
                                            <p className="text-[10px] font-semibold mt-1.5" style={{ color: '#F43F5E' }}>Passwords do not match</p>
                                        )}
                                    </div>
                                    <motion.button type="submit" disabled={loading}
                                        whileHover={!loading ? { scale: 1.01, y: -1 } : {}} whileTap={{ scale: 0.98 }}
                                        className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl font-bold text-sm text-white disabled:opacity-50 mt-1"
                                        style={{ background: 'linear-gradient(135deg, #111118, #1a1a26)', boxShadow: '0 8px 28px rgba(0,0,0,0.18)' }}>
                                        {loading ? <><Loader2 size={15} className="animate-spin" style={{ color: '#F97316' }} /> Resetting...</>
                                            : <><ShieldCheck size={15} style={{ color: '#F97316' }} /> Reset Password</>}
                                    </motion.button>
                                </form>
                            </motion.div>
                        )}

                        {/* ── STEP 4: Success ───────────────────────── */}
                        {step === 4 && (
                            <motion.div key="s4"
                                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                                className="rounded-2xl p-8 text-center"
                                style={{ background: 'white', border: '1px solid rgba(0,0,0,0.07)', boxShadow: '0 8px 40px rgba(0,0,0,0.07)' }}>
                                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                                    style={{ background: 'linear-gradient(135deg, rgba(34,197,94,0.12), rgba(34,197,94,0.06))', border: '1px solid rgba(34,197,94,0.25)' }}>
                                    <CheckCircle size={28} style={{ color: '#22C55E' }} />
                                </div>
                                <h2 className="text-2xl font-black mb-2" style={{ color: '#111111', letterSpacing: '-0.025em' }}>
                                    Password Reset!
                                </h2>
                                <p className="text-sm font-medium mb-6 max-w-xs mx-auto leading-relaxed" style={{ color: '#6B7280' }}>
                                    Your password has been reset successfully. You can now sign in with your new password.
                                </p>
                                <motion.button
                                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                                    onClick={() => navigate('/login')}
                                    className="flex items-center gap-2 px-7 py-3 rounded-xl text-sm font-bold text-white mx-auto"
                                    style={{ background: 'linear-gradient(135deg, #FB923C, #F97316)', boxShadow: '0 4px 16px rgba(249,115,22,0.35)' }}>
                                    Sign In Now <ArrowRight size={14} />
                                </motion.button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>
        </div>
    );
};

export default ForgotPassword;
