import { motion } from 'framer-motion';
import { Zap, Shield, TrendingUp, Users, CheckCircle, ArrowRight, Briefcase, Building2, Scale, FileCheck, Landmark, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import SeoHead from '../components/SeoHead';

const services = [
    {
        icon: <Zap size={26} />,
        gradient: 'linear-gradient(135deg, #F97316, #EA580C)',
        text: '#F97316',
        title: 'Instant Acquisition',
        description: 'Accelerated job application pipeline. One-click synchronization with elite corporate entities.',
        features: ['Global Connectivity', 'Automated Profiling', 'Real-time Tracking'],
    },
    {
        icon: <Shield size={26} />,
        gradient: 'linear-gradient(135deg, #1F2937, #0F172A)',
        text: '#F97316',
        title: 'Elite Verification',
        description: 'Tier-1 security protocols for employer validation. Zero-tolerance for non-verified listings.',
        features: ['Multilevel Auditing', 'Secure Data Vault', 'Authentic Exposure'],
    },
    {
        icon: <TrendingUp size={26} />,
        gradient: 'linear-gradient(135deg, #059669, #047857)',
        text: '#10B981',
        title: 'Strategic Growth',
        description: 'AI-driven career trajectory mapping. Alignment with high-yield financial benchmarks.',
        features: ['Predictive Matching', 'Salary Optimization', 'Skill Synthesis'],
    },
    {
        icon: <Users size={26} />,
        gradient: 'linear-gradient(135deg, #6D28D9, #4C1D95)',
        text: '#8B5CF6',
        title: 'Corporate Solutions',
        description: 'End-to-end talent acquisition suite for high-growth financial firms and startups.',
        features: ['Priority Listings', 'Applicant Intelligence', 'Brand Elevation'],
    },
];

const howItWorks = [
    { step: '01', title: 'Create Profile', desc: 'Sign up and build your professional profile with skills, experience and preferences.', icon: <Users size={20} /> },
    { step: '02', title: 'Discover Jobs', desc: 'Browse thousands of verified job listings filtered to your preferences.', icon: <Briefcase size={20} /> },
    { step: '03', title: 'Apply & Connect', desc: 'Apply in one click and connect directly with hiring managers at top companies.', icon: <Building2 size={20} /> },
    { step: '04', title: 'Get Hired', desc: 'Land your dream role and kickstart your next chapter with confidence.', icon: <CheckCircle size={20} /> },
];

const Services = () => {
    return (
        <div className="bg-white min-h-screen pb-0 text-[#111111] leading-relaxed">
            <SeoHead
                title="Finance Career Services — Job Portal & CA Expertise"
                description="LedgerBandhu offers instant job acquisition, elite employer verification, career growth tools, and CA Bandhu financial services for finance professionals."
                canonical="https://www.ledgerbandhu.com/services"
            />
            {/* Hero */}
            <div className="pt-24 pb-32 relative overflow-hidden">
                <div className="absolute inset-0 opacity-[0.03]"
                    style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.07) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.07) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
                <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] opacity-[0.05] pointer-events-none filter blur-[100px]"
                    style={{ background: 'radial-gradient(circle, #F97316 0%, transparent 70%)' }} />
                <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
                    <span className="inline-flex items-center gap-2 bg-gray-50 border border-gray-200 text-gray-400 text-[10px] font-black uppercase tracking-[0.3em] px-6 py-2.5 rounded-full mb-8">
                        <Zap size={14} className="text-[#F97316]" /> Service Excellence
                    </span>
                    <h1 className="text-5xl md:text-7xl font-black text-[#111111] mb-8 tracking-tight">
                        Powering the Future of<br />
                        <span className="text-gradient-orange">Financial Careers</span>
                    </h1>
                    <p className="text-gray-400 font-bold text-lg max-w-2xl mx-auto uppercase tracking-wide">
                        Elite infrastructure for professional discovery and corporate acquisition.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
                {/* Services Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-32">
                    {services.map((s, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-white rounded-[2.5rem] border border-gray-100 p-8 md:p-12 hover:border-[#F97316]/40 transition-all duration-500 group shadow-2xl overflow-hidden relative"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br transition-opacity duration-500 opacity-0 group-hover:opacity-[0.05]" 
                                style={{ background: s.gradient }} />
                            <div className="flex items-start gap-8 mb-8 relative z-10">
                                <div className="w-20 h-20 rounded-2xl flex items-center justify-center shrink-0 text-[#111111] transition-all group-hover:scale-110 duration-500 bg-gray-50 border border-gray-200 group-hover:border-[#F97316]/40"
                                    style={{ boxShadow: `0 20px 40px ${s.text}10` }}>
                                    <span style={{ color: s.text }}>{s.icon}</span>
                                </div>
                                <div className="pt-2">
                                    <h3 className="text-2xl font-black text-[#111111] mb-3 tracking-tight">{s.title}</h3>
                                    <p className="text-gray-400 font-bold text-sm leading-relaxed">{s.description}</p>
                                </div>
                            </div>
                            <ul className="space-y-4 pt-8 border-t border-gray-100 relative z-10">
                                {s.features.map((f, j) => (
                                    <li key={j} className="flex items-center gap-4 text-xs font-black uppercase tracking-widest text-[#111111]/50 group-hover:text-gray-700 transition-colors">
                                        <div className="w-1.5 h-1.5 rounded-full bg-[#F97316] shadow-[0_0_8px_#F97316]" />
                                        {f}
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}
                </div>

                {/* How It Works */}
                <div className="mb-32">
                    <div className="text-center mb-20">
                        <span className="text-[10px] font-black text-[#F97316] uppercase tracking-[0.4em] mb-4 block">Operational Flow</span>
                        <h2 className="text-4xl md:text-5xl font-black text-[#111111] tracking-tight">Systematic Onboarding</h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {howItWorks.map((step, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-white rounded-3xl p-10 border border-gray-100 shadow-2xl hover:border-[#F97316]/40 transition-all group text-center"
                            >
                                <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-[#F97316] group-hover:bg-[#F97316] group-hover:text-[#111111] transition-all mx-auto mb-8 bg-gray-50 border border-gray-100">
                                    {step.icon}
                                </div>
                                <h3 className="font-black text-[#111111] mb-4 uppercase tracking-widest text-sm">{step.title}</h3>
                                <p className="text-gray-400 text-[11px] font-bold leading-relaxed uppercase tracking-wider">{step.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* CA Bandhu Section */}
                <div className="mb-32">
                    <div className="bg-[#111111] rounded-[3rem] p-8 md:p-20 overflow-hidden relative border border-white/5">
                        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#F97316] opacity-[0.05] blur-[120px] pointer-events-none" />
                        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-[#EA580C] opacity-[0.03] blur-[100px] pointer-events-none" />
                        
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
                            <div>
                                <span className="inline-flex items-center gap-2 bg-white/5 border border-white/10 text-[#F97316] text-[10px] font-black uppercase tracking-[0.3em] px-6 py-2.5 rounded-full mb-8">
                                    <Landmark size={14} /> Sister Concern
                                </span>
                                <h2 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tight">
                                    Unified Financial <br />
                                    <span className="text-[#F97316]">Excellence</span>
                                </h2>
                                <p className="text-gray-400 font-bold text-lg mb-10 leading-relaxed uppercase tracking-wide max-w-xl">
                                    Founded by a CA Ayaz Khan, our ecosystem integrates professional growth with financial integrity through our sister concern, <span className="text-white">CA Bandhu</span>.
                                </p>
                                
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    {[
                                        { title: 'Tax Planning', icon: <FileCheck size={20} />, desc: 'Strategic income tax and GST optimization.' },
                                        { title: 'Audit Services', icon: <Scale size={20} />, desc: 'Rigorous auditing for financial transparency.' },
                                        { title: 'Compliance', icon: <Landmark size={20} />, desc: 'End-to-end ROC and statutory compliance.' },
                                        { title: 'Advisory', icon: <BarChart3 size={20} />, desc: 'Data-driven strategic financial consulting.' },
                                        { title: 'Business Setup', icon: <Building2 size={20} />, desc: 'Company incorporation and startup advisory.' },
                                        { title: 'GST Services', icon: <Zap size={20} />, desc: 'GST registration, filing, and reconciliation.' },
                                    ].map((item, idx) => (
                                        <div key={idx} className="flex gap-4 group">
                                            <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:border-[#F97316]/50 transition-all text-[#F97316]">
                                                {item.icon}
                                            </div>
                                            <div>
                                                <h4 className="text-white font-black text-xs uppercase tracking-widest mb-1">{item.title}</h4>
                                                <p className="text-gray-500 text-[10px] font-bold uppercase tracking-wider">{item.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                
                                <div className="mt-12">
                                    <Link to="/contact" className="inline-flex items-center gap-3 bg-white text-[#111111] px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#F97316] hover:text-white transition-all shadow-xl active:scale-95">
                                        Consult Our CA Experts <ArrowRight size={18} />
                                    </Link>
                                </div>
                            </div>

                            <div className="relative">
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    className="aspect-square bg-gradient-to-br from-white/10 to-transparent rounded-[2.5rem] border border-white/10 p-1 flex items-center justify-center relative overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-white/5 backdrop-blur-3xl" />
                                    <div className="relative z-10 text-center px-8">
                                        <div className="w-24 h-24 bg-[#F97316] rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-[0_20px_40px_rgba(249,115,22,0.3)]">
                                            <Scale size={48} className="text-[#111111]" />
                                        </div>
                                        <h3 className="text-3xl font-black text-white mb-4 tracking-tighter uppercase">CA Bandhu</h3>
                                        <div className="h-px w-16 bg-[#F97316] mx-auto mb-6" />
                                        <p className="text-gray-400 font-bold text-[10px] uppercase tracking-[0.2em] leading-loose">
                                            Elite Professional Compliance & <br /> Financial Management Suite
                                        </p>
                                    </div>
                                    
                                    {/* Decorative elements */}
                                    <div className="absolute top-10 right-10 w-2 h-2 rounded-full bg-[#F97316] animate-pulse" />
                                    <div className="absolute bottom-10 left-10 w-2 h-2 rounded-full bg-white/20" />
                                </motion.div>
                                
                                {/* Float Tags */}
                                <motion.div 
                                    animate={{ y: [0, -10, 0] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                    className="absolute -top-6 -right-6 bg-[#F97316] text-[#111111] font-black text-[10px] uppercase tracking-widest px-6 py-3 rounded-2xl shadow-2xl"
                                >
                                    CA Led Platform
                                </motion.div>
                                <motion.div 
                                    animate={{ y: [0, 10, 0] }}
                                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                                    className="absolute -bottom-6 -left-6 bg-white text-[#111111] font-black text-[10px] uppercase tracking-widest px-6 py-3 rounded-2xl shadow-2xl"
                                >
                                    Unified Services
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* CTA Banner */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-white border border-gray-100 rounded-3xl p-10 md:p-16 text-center relative overflow-hidden mb-16"
                >
                    <div className="absolute inset-0 opacity-20"
                        style={{ backgroundImage: 'radial-gradient(circle at 70% 50%, #F97316 0%, transparent 60%)' }} />
                    <div className="relative z-10">
                        <h2 className="text-3xl md:text-4xl font-black text-[#111111] mb-4">Ready to get started?</h2>
                        <p className="text-gray-500 font-medium mb-8 max-w-xl mx-auto">
                            Join thousands of professionals already building their careers with LedgerBandhu.
                        </p>
                        <div className="flex flex-wrap items-center justify-center gap-4">
                            <Link to="/jobs"
                                className="inline-flex items-center gap-2 font-bold px-8 py-4 rounded-2xl text-[#111111] hover:opacity-90 transition-all shadow-[0_8px_24px_rgba(249,115,22,0.45)] bg-gradient-to-br from-[#F97316] to-[#EA580C]">
                                Browse Jobs <ArrowRight size={18} />
                            </Link>
                            <Link to="/register"
                                className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-[#111111] font-bold px-8 py-4 rounded-2xl transition-all border border-gray-200">
                                Create Free Account
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Services;
