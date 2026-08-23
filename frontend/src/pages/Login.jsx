import { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useNavigate, Link, useSearchParams, useLocation } from 'react-router-dom';
import { LogIn, Mail, Lock, Eye, EyeOff, AlertCircle, Loader2, TrendingUp, Shield, Zap, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import SeoHead from '../components/SeoHead';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const { login, isLoading, error } = useAuthStore();
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const redirectPath = searchParams.get('redirect');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await login(email, password);
        if (success) {
            const { user } = useAuthStore.getState();
            if (user?.role === 'admin') {
                navigate('/admin');
            } else {
                navigate(redirectPath || '/dashboard');
            }
        }
    };

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

    return (
        <div className="min-h-screen flex" style={{ fontFamily: 'Plus Jakarta Sans, Inter, sans-serif' }}>
            <SeoHead
                title="Login — Sign in to LedgerBandhu"
                description="Sign in to your LedgerBandhu account to access finance job listings, applications, and your dashboard."
                canonical="https://www.ledgerbandhu.com/login"
                noIndex={true}
            />

            {/* ── LEFT PANEL (dark, desktop only) ─────────────────────── */}
            <div className="hidden lg:flex lg:w-5/12 xl:w-2/5 relative overflow-hidden flex-col justify-between p-12"
                style={{ background: 'linear-gradient(145deg, #0a0a0f 0%, #111118 60%, #0f0f1a 100%)' }}>
                {/* Orbs */}
                <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(249,115,22,0.2) 0%, transparent 65%)', filter: 'blur(60px)', pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', bottom: '-10%', left: '-10%', width: '320px', height: '320px', background: 'radial-gradient(circle, rgba(234,88,12,0.12) 0%, transparent 65%)', filter: 'blur(50px)', pointerEvents: 'none' }} />
                <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)', backgroundSize: '48px 48px' }} />

                <div className="relative z-10">
                    {/* Logo */}
                    <Link to="/" className="inline-flex items-center gap-3 mb-16">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                            style={{ background: 'linear-gradient(135deg, #FB923C, #F97316)', boxShadow: '0 8px 24px rgba(249,115,22,0.4)' }}>
                            <LogIn size={18} color="white" />
                        </div>
                        <span className="text-xl font-black text-white" style={{ letterSpacing: '-0.03em' }}>
                            Ledger<span style={{ color: '#F97316' }}>Bandhu</span>
                        </span>
                    </Link>

                    <h1 className="text-3xl font-black text-white mb-4" style={{ letterSpacing: '-0.035em', lineHeight: '1.1' }}>
                        Welcome back to<br />
                        <span style={{ background: 'linear-gradient(135deg, #FB923C, #F97316)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                            your Finance Hub
                        </span>
                    </h1>
                    <p className="text-sm font-medium leading-relaxed mb-12" style={{ color: 'rgba(255,255,255,0.45)' }}>
                        Access your dashboard, track applications, and explore the latest finance opportunities.
                    </p>

                    {/* Feature list */}
                    <div className="space-y-4">
                        {[
                            { icon: TrendingUp, text: 'Track all your applications' },
                            { icon: Shield, text: 'Verified employer contacts' },
                            { icon: Zap, text: 'AI-powered career tools' },
                        ].map(({ icon: Icon, text }) => (
                            <div key={text} className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                                    style={{ background: 'rgba(249,115,22,0.12)', border: '1px solid rgba(249,115,22,0.2)' }}>
                                    <Icon size={14} style={{ color: '#F97316' }} />
                                </div>
                                <span className="text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.6)' }}>{text}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom testimonial */}
                <div className="relative z-10 p-5 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <p className="text-xs font-medium italic leading-relaxed" style={{ color: 'rgba(255,255,255,0.4)' }}>
                        "Got placed at a Big 4 firm within 3 weeks of using LedgerBandhu. Highly recommended!"
                    </p>
                    <p className="text-[10px] font-black mt-2" style={{ color: '#F97316' }}>— Ayaz Khan</p>
                </div>
            </div>

            {/* ── RIGHT PANEL (form) ───────────────────────────────────── */}
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
                                <LogIn size={16} color="white" />
                            </div>
                            <span className="text-xl font-black" style={{ color: '#111111', letterSpacing: '-0.03em' }}>
                                Ledger<span style={{ color: '#F97316' }}>Bandhu</span>
                            </span>
                        </Link>
                    </div>

                    {/* Heading */}
                    <div className="mb-8">
                        <h2 className="text-2xl font-black mb-1" style={{ color: '#111111', letterSpacing: '-0.03em' }}>
                            Welcome back
                        </h2>
                        <p className="text-sm font-medium" style={{ color: '#9CA3AF' }}>
                            Don't have an account?{' '}
                            <Link to={`/register${location.search}`} className="font-bold" style={{ color: '#F97316' }}>
                                Create one
                            </Link>
                        </p>
                    </div>

                    {/* Form card */}
                    <div className="rounded-2xl overflow-hidden"
                        style={{ background: 'white', border: '1px solid rgba(0,0,0,0.07)', boxShadow: '0 8px 40px rgba(0,0,0,0.07)' }}>
                        <form onSubmit={handleSubmit} className="p-7 space-y-4">

                            {/* Error */}
                            <AnimatePresence>
                                {error && (
                                    <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold"
                                        style={{ background: 'rgba(244,63,94,0.08)', border: '1px solid rgba(244,63,94,0.2)', color: '#F43F5E' }}>
                                        <AlertCircle size={15} style={{ flexShrink: 0 }} />
                                        {error}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Email */}
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: '#9CA3AF' }}>
                                    Email Address
                                </label>
                                <div className="relative">
                                    <Mail size={15} className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#9CA3AF' }} />
                                    <input
                                        id="email-address"
                                        name="email"
                                        type="email"
                                        required
                                        placeholder="you@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        style={inputBase}
                                        onFocus={onFocus}
                                        onBlur={onBlur}
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: '#9CA3AF' }}>
                                    Password
                                </label>
                                <div className="relative">
                                    <Lock size={15} className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#9CA3AF' }} />
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        style={{ ...inputBase, paddingRight: '48px' }}
                                        onFocus={onFocus}
                                        onBlur={onBlur}
                                    />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3.5 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center transition-colors"
                                        style={{ color: '#9CA3AF' }}
                                        onMouseEnter={e => e.currentTarget.style.color = '#F97316'}
                                        onMouseLeave={e => e.currentTarget.style.color = '#9CA3AF'}>
                                        {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                                    </button>
                                </div>
                            </div>

                            {/* Remember + Forgot */}
                            <div className="flex items-center justify-between">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox"
                                        className="w-4 h-4 rounded"
                                        style={{ accentColor: '#F97316' }} />
                                    <span className="text-xs font-semibold" style={{ color: '#6B7280' }}>Remember me</span>
                                </label>
                                <Link to="/forgot-password" className="text-xs font-bold transition-colors"
                                    style={{ color: '#F97316' }}
                                    onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'}
                                    onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}>
                                    Forgot password?
                                </Link>
                            </div>

                            {/* Submit */}
                            <motion.button
                                type="submit"
                                disabled={isLoading}
                                whileHover={!isLoading ? { scale: 1.01, y: -1 } : {}}
                                whileTap={{ scale: 0.98 }}
                                className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl font-bold text-sm text-white disabled:opacity-50 mt-1"
                                style={{
                                    background: 'linear-gradient(135deg, #111118, #1a1a26)',
                                    boxShadow: '0 8px 28px rgba(0,0,0,0.18)',
                                }}>
                                {isLoading
                                    ? <><Loader2 size={15} className="animate-spin" style={{ color: '#F97316' }} /> Signing in...</>
                                    : <><LogIn size={15} style={{ color: '#F97316' }} /> Sign In <ArrowRight size={13} style={{ color: '#F97316' }} /></>
                                }
                            </motion.button>

                            {/* Divider */}
                            <div className="flex items-center gap-3 py-1">
                                <div className="flex-1 h-px" style={{ background: 'rgba(0,0,0,0.07)' }} />
                                <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#D1D5DB' }}>or</span>
                                <div className="flex-1 h-px" style={{ background: 'rgba(0,0,0,0.07)' }} />
                            </div>

                            {/* Employer CTA */}
                            <Link to="/employer-register"
                                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all"
                                style={{
                                    border: '1.5px dashed rgba(0,0,0,0.12)',
                                    color: '#6B7280',
                                    background: 'transparent',
                                }}
                                onMouseEnter={e => { e.currentTarget.style.border = '1.5px dashed rgba(249,115,22,0.35)'; e.currentTarget.style.color = '#F97316'; }}
                                onMouseLeave={e => { e.currentTarget.style.border = '1.5px dashed rgba(0,0,0,0.12)'; e.currentTarget.style.color = '#6B7280'; }}>
                                Post Jobs as an Employer
                            </Link>
                        </form>

                        <div className="px-7 py-4 text-center" style={{ borderTop: '1px solid rgba(0,0,0,0.06)', background: '#FAFAFA' }}>
                            <p className="text-[10px] font-medium" style={{ color: '#9CA3AF' }}>
                                Protected by LedgerBandhu security · Your data is safe
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Login;
