import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { useNavigate, Link, useLocation, useSearchParams } from 'react-router-dom';
import { UserPlus, Upload, Eye, EyeOff, CheckCircle2, AlertCircle, Loader2, Briefcase, Users, ChevronDown, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../lib/axios';
import SeoHead from '../components/SeoHead';

const Register = () => {
    const location = useLocation();
    const [searchParams] = useSearchParams();

    const isEmployerAutoSelect = location.pathname === '/employer-register' || searchParams.get('role') === 'employer';
    const redirectPath = searchParams.get('redirect');

    const [role, setRole] = useState(isEmployerAutoSelect ? 'employer' : 'seeker');

    useEffect(() => {
        const isEmployer = location.pathname === '/employer-register' || searchParams.get('role') === 'employer';
        setRole(isEmployer ? 'employer' : 'seeker');
        setFormValues({});
        setResumeFile(null);
    }, [location.pathname]);

    const [formValues, setFormValues] = useState({});
    const [resumeFile, setResumeFile] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [fields, setFields] = useState([]);
    const [fieldsLoading, setFieldsLoading] = useState(true);
    const [otpSent, setOtpSent] = useState(false);
    const [sendingOtp, setSendingOtp] = useState(false);
    const [otpError, setOtpError] = useState('');

    const { register, isLoading, error } = useAuthStore();
    const navigate = useNavigate();

    useEffect(() => {
        api.get('/form-fields')
            .then(res => { setFields(res.data || []); setFieldsLoading(false); })
            .catch(() => {
                setFields([
                    { _id: 'name', fieldName: 'name', label: 'Full Name', type: 'text', placeholder: 'Enter your full name', required: true, forRole: 'both', isCore: true },
                    { _id: 'email', fieldName: 'email', label: 'Email Address', type: 'email', placeholder: 'Enter your email', required: true, forRole: 'both', isCore: true },
                    { _id: 'password', fieldName: 'password', label: 'Password', type: 'password', placeholder: 'Create a password', required: true, forRole: 'both', isCore: true },
                ]);
                setFieldsLoading(false);
            });
    }, []);

    const visibleFields = fields.filter(f => f.forRole === 'both' || f.forRole === role);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues(prev => ({ ...prev, [name]: value }));
        if (name === 'email') setOtpSent(false);
    };

    const handleSendOtp = async () => {
        if (!formValues.email) { setOtpError('Please enter your email first'); return; }
        setSendingOtp(true); setOtpError('');
        try {
            await api.post('/auth/send-otp', { email: formValues.email });
            setOtpSent(true);
        } catch (err) {
            setOtpError(err.response?.data?.message || 'Failed to send OTP');
        } finally { setSendingOtp(false); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const fd = new FormData();
        fd.append('role', role);
        Object.entries(formValues).forEach(([k, v]) => {
            if (v !== undefined && v !== null && v !== '') fd.append(k, v);
        });
        if (resumeFile) fd.append('resume', resumeFile);
        const success = await register(fd);
        if (success) navigate(redirectPath || '/dashboard');
    };

    // Shared input style helpers
    const inputBase = {
        background: '#F9FAFB',
        border: '1.5px solid rgba(0,0,0,0.09)',
        color: '#111111',
        borderRadius: '12px',
        padding: '12px 16px',
        fontSize: '14px',
        fontWeight: 600,
        width: '100%',
        outline: 'none',
        transition: 'all 0.2s',
        fontFamily: 'Plus Jakarta Sans, Inter, sans-serif',
    };
    const onFocus = (e) => { e.currentTarget.style.border = '1.5px solid rgba(249,115,22,0.45)'; e.currentTarget.style.background = 'white'; };
    const onBlur = (e) => { e.currentTarget.style.border = '1.5px solid rgba(0,0,0,0.09)'; e.currentTarget.style.background = '#F9FAFB'; };

    const LabelEl = ({ field }) => (
        <label className="block text-[10px] font-black uppercase tracking-widest mb-2"
            style={{ color: '#9CA3AF' }}>
            {field.label}
            {field.required && <span style={{ color: '#F97316', marginLeft: '4px' }}>*</span>}
        </label>
    );

    const renderField = (field) => {
        if (field.type === 'file') {
            return (
                <div key={field._id}>
                    <LabelEl field={field} />
                    <label className="flex items-center gap-3 cursor-pointer rounded-xl px-4 py-3 transition-all"
                        style={{ background: '#F9FAFB', border: '1.5px dashed rgba(0,0,0,0.12)' }}
                        onMouseEnter={e => e.currentTarget.style.border = '1.5px dashed rgba(249,115,22,0.35)'}
                        onMouseLeave={e => e.currentTarget.style.border = '1.5px dashed rgba(0,0,0,0.12)'}>
                        <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                            style={{ background: 'linear-gradient(135deg, #FFF7ED, #FFEDD5)', border: '1px solid rgba(249,115,22,0.2)' }}>
                            <Upload size={16} style={{ color: '#F97316' }} />
                        </div>
                        <span className="text-sm font-medium truncate" style={{ color: '#9CA3AF' }}>
                            {resumeFile ? resumeFile.name : (field.placeholder || 'Select Document (PDF/DOCX)')}
                        </span>
                        <input type="file" name={field.fieldName} accept=".pdf,.doc,.docx" className="hidden" required={field.required}
                            onChange={e => setResumeFile(e.target.files[0] || null)} />
                    </label>
                    {resumeFile && (
                        <motion.p initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                            className="text-[10px] font-bold flex items-center gap-1.5 mt-1.5"
                            style={{ color: '#22C55E' }}>
                            <CheckCircle2 size={12} /> File selected
                        </motion.p>
                    )}
                </div>
            );
        }

        if (field.type === 'textarea') {
            return (
                <div key={field._id}>
                    <LabelEl field={field} />
                    <textarea name={field.fieldName} rows={3} required={field.required}
                        placeholder={field.placeholder} value={formValues[field.fieldName] || ''}
                        onChange={handleChange} className="resize-none"
                        style={inputBase} onFocus={onFocus} onBlur={onBlur} />
                </div>
            );
        }

        if (field.type === 'select' && field.options?.length) {
            return (
                <div key={field._id}>
                    <LabelEl field={field} />
                    <div className="relative">
                        <select name={field.fieldName} required={field.required}
                            value={formValues[field.fieldName] || ''} onChange={handleChange}
                            className="appearance-none w-full pr-10"
                            style={inputBase} onFocus={onFocus} onBlur={onBlur}>
                            <option value="">Select {field.label}...</option>
                            {field.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                        <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#9CA3AF' }} />
                    </div>
                </div>
            );
        }

        if (field.type === 'password') {
            return (
                <div key={field._id}>
                    <LabelEl field={field} />
                    <div className="relative">
                        <input type={showPassword ? 'text' : 'password'} name={field.fieldName}
                            required={field.required} placeholder={field.placeholder}
                            value={formValues[field.fieldName] || ''} onChange={handleChange}
                            style={{ ...inputBase, paddingRight: '48px' }} onFocus={onFocus} onBlur={onBlur} />
                        <button type="button" onClick={() => setShowPassword(p => !p)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center transition-colors"
                            style={{ color: '#9CA3AF' }}
                            onMouseEnter={e => e.currentTarget.style.color = '#F97316'}
                            onMouseLeave={e => e.currentTarget.style.color = '#9CA3AF'}>
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>
                </div>
            );
        }

        if (field.fieldName === 'email') {
            return (
                <div key={field._id}>
                    <LabelEl field={field} />
                    <input type="email" name="email" required={field.required}
                        placeholder={field.placeholder} value={formValues.email || ''}
                        onChange={handleChange} style={inputBase} onFocus={onFocus} onBlur={onBlur} />
                </div>
            );
        }

        let displayPlaceholder = field.placeholder;
        if (field.fieldName === 'skills') displayPlaceholder = 'e.g. CA, CMA, ACCA';

        return (
            <div key={field._id}>
                <LabelEl field={field} />
                <input type={field.type} name={field.fieldName} required={field.required}
                    placeholder={displayPlaceholder} value={formValues[field.fieldName] || ''}
                    onChange={handleChange} style={inputBase} onFocus={onFocus} onBlur={onBlur} />
            </div>
        );
    };

    return (
        <div className="min-h-screen flex" style={{ fontFamily: 'Plus Jakarta Sans, Inter, sans-serif' }}>
            <SeoHead
                title={isEmployerAutoSelect ? 'Post a Job — Register as Employer' : 'Register — Create Your Finance Career Account'}
                description={isEmployerAutoSelect
                    ? 'Register as an employer on LedgerBandhu and post finance & banking jobs to reach thousands of qualified candidates.'
                    : 'Create your free LedgerBandhu account and apply to 5 lakh+ finance jobs in Banking, Accountancy, Fintech and more.'}
                canonical={`https://www.ledgerbandhu.com${location.pathname}`}
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
                            <UserPlus size={18} color="white" />
                        </div>
                        <span className="text-xl font-black text-white" style={{ letterSpacing: '-0.03em' }}>
                            Ledger<span style={{ color: '#F97316' }}>Bandhu</span>
                        </span>
                    </Link>

                    <h1 className="text-3xl font-black text-white mb-4" style={{ letterSpacing: '-0.035em', lineHeight: '1.1' }}>
                        Join India's #1<br />
                        <span style={{ background: 'linear-gradient(135deg, #FB923C, #F97316)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                            Finance Network
                        </span>
                    </h1>
                    <p className="text-sm font-medium leading-relaxed mb-12" style={{ color: 'rgba(255,255,255,0.45)' }}>
                        Connect with thousands of finance professionals and top employers. Your next big move starts here.
                    </p>

                    {/* Feature list */}
                    <div className="space-y-4">
                        {[
                            { icon: Briefcase, text: '5 Lakh+ Finance Jobs' },
                            { icon: Users, text: 'Verified Employers Only' },
                            { icon: CheckCircle2, text: 'Free Account — Forever' },
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

                {/* Bottom quote */}
                <div className="relative z-10 p-5 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <p className="text-xs font-medium italic leading-relaxed" style={{ color: 'rgba(255,255,255,0.4)' }}>
                        "LedgerBandhu helped me land my CA internship within 2 weeks of signing up."
                    </p>
                    <p className="text-[10px] font-black mt-2" style={{ color: '#F97316' }}>— Ayaz Khan</p>
                </div>
            </div>

            {/* ── RIGHT PANEL (form) ───────────────────────────────────── */}
            <div className="flex-1 flex items-center justify-center py-10 px-4 sm:px-8 overflow-y-auto"
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
                                <UserPlus size={16} color="white" />
                            </div>
                            <span className="text-xl font-black" style={{ color: '#111111', letterSpacing: '-0.03em' }}>
                                Ledger<span style={{ color: '#F97316' }}>Bandhu</span>
                            </span>
                        </Link>
                    </div>

                    {/* Heading */}
                    <div className="mb-8">
                        <h2 className="text-2xl font-black mb-1" style={{ color: '#111111', letterSpacing: '-0.03em' }}>
                            Create your account
                        </h2>
                        <p className="text-sm font-medium" style={{ color: '#9CA3AF' }}>
                            Already have one?{' '}
                            <Link to="/login" className="font-bold" style={{ color: '#F97316' }}>Sign in</Link>
                        </p>
                    </div>

                    {/* Role Toggle */}
                    <div className="flex gap-2 p-1.5 rounded-xl mb-6"
                        style={{ background: 'rgba(0,0,0,0.05)' }}>
                        {[
                            { key: 'seeker', label: 'Job Seeker' },
                            { key: 'employer', label: 'Hiring Partner' },
                        ].map(({ key, label }) => (
                            <button key={key} type="button"
                                onClick={() => { setRole(key); setFormValues({}); setResumeFile(null); }}
                                className="flex-1 py-2.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all"
                                style={{
                                    background: role === key ? 'white' : 'transparent',
                                    color: role === key ? '#F97316' : '#9CA3AF',
                                    boxShadow: role === key ? '0 2px 8px rgba(0,0,0,0.1)' : 'none',
                                    border: role === key ? '1px solid rgba(249,115,22,0.15)' : '1px solid transparent',
                                }}>
                                {label}
                            </button>
                        ))}
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

                            {/* Dynamic fields */}
                            {fieldsLoading ? (
                                <div className="py-12 flex flex-col items-center gap-3">
                                    <Loader2 size={24} className="animate-spin" style={{ color: '#F97316' }} />
                                    <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#9CA3AF' }}>Loading form...</p>
                                </div>
                            ) : (
                                visibleFields.map(field => renderField(field))
                            )}

                            {/* Submit */}
                            <motion.button
                                type="submit"
                                disabled={isLoading || fieldsLoading}
                                whileHover={!isLoading ? { scale: 1.01, y: -1 } : {}}
                                whileTap={{ scale: 0.98 }}
                                className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl font-bold text-sm text-white disabled:opacity-50 mt-2"
                                style={{
                                    background: 'linear-gradient(135deg, #111118, #1a1a26)',
                                    boxShadow: '0 8px 28px rgba(0,0,0,0.2)',
                                }}>
                                {isLoading
                                    ? <><Loader2 size={15} className="animate-spin" style={{ color: '#F97316' }} /> Creating account...</>
                                    : <><UserPlus size={15} style={{ color: '#F97316' }} /> Create {role === 'employer' ? 'Employer' : ''} Account <ArrowRight size={14} style={{ color: '#F97316' }} /></>
                                }
                            </motion.button>
                        </form>

                        <div className="px-7 py-4 text-center" style={{ borderTop: '1px solid rgba(0,0,0,0.06)', background: '#FAFAFA' }}>
                            <p className="text-[10px] font-medium" style={{ color: '#9CA3AF' }}>
                                By registering you agree to our{' '}
                                <Link to="/terms" className="font-bold" style={{ color: '#F97316' }}>Terms</Link>
                                {' '}and{' '}
                                <Link to="/privacy" className="font-bold" style={{ color: '#F97316' }}>Privacy Policy</Link>
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Register;
