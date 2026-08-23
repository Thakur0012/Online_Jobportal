import { motion } from 'framer-motion';
import { Sparkles, MessageSquare, Target, Zap, Shield, ChevronRight, Briefcase, GraduationCap, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const InterviewCoach = () => {
    return (
        <div className="bg-white min-h-screen pb-24 text-[#111111]">
            {/* Hero Section */}
            <header className="relative pt-32 pb-24 overflow-hidden" style={{ background: 'radial-gradient(circle at top right, rgba(249,115,22,0.1) 0%, white 100%)' }}>
                <div className="absolute inset-0 opacity-[0.03]"
                    style={{ backgroundImage: 'linear-gradient(rgba(0,0,0,.07) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,.07) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
                
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-orange-50 border border-orange-100 text-orange-600 font-black text-[10px] uppercase tracking-[0.3em] mb-8 shadow-sm"
                    >
                        <Sparkles size={14} /> AI Powered Excellence
                    </motion.div>
                    
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-7xl font-black text-[#111111] mb-8 tracking-tighter leading-[0.95]"
                    >
                        Land Your Dream Job with <br />
                        <span className="text-gradient-orange italic">AI Interview Coach</span>
                    </motion.h1>
                    
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="max-w-2xl mx-auto text-gray-500 font-bold text-lg mb-12 leading-relaxed"
                    >
                        Master the art of interviewing with our sophisticated Llama 3.3 intelligence. 
                        Practice role-specific questions, receive instant feedback, and build the confidence to conquer any finance interview.
                    </motion.p>
                    
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-6"
                    >
                        <Link to="/jobs" className="btn-primary px-10 py-5 rounded-2xl w-full sm:w-auto shadow-2xl shadow-orange-200">
                            Find a Job to Practice
                        </Link>
                        <a href="#how-it-works" className="px-10 py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest text-gray-400 hover:text-[#111111] transition-all border border-gray-100 hover:border-gray-200 bg-white w-full sm:w-auto">
                            How it Works
                        </a>
                    </motion.div>
                </div>
            </header>

            {/* Steps Section */}
            <section id="how-it-works" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-20">
                    <h2 className="text-xs font-black text-[#F97316] uppercase tracking-[0.4em] mb-4">The Methodology</h2>
                    <h3 className="text-4xl font-black text-[#111111] tracking-tight">Three Steps to Interview Success</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {[
                        {
                            step: "01",
                            title: "Select Job Listing",
                            desc: "Browse our premium job board and pick the position you're aiming for. Every interview is tailored to the specific job description.",
                            icon: <Briefcase />
                        },
                        {
                            step: "02",
                            title: "Initialize Coach",
                            desc: "On the job details page, find the 'Practice for this Role' section and click 'Start Mock Interview' to begin your session.",
                            icon: <Zap />
                        },
                        {
                            step: "03",
                            title: "Conquer the Chat",
                            desc: "Engage with our AI Recruiter in a professional chat. Answer specialized questions and refine your pitch before the real interview.",
                            icon: <Target />
                        }
                    ].map((item, idx) => (
                        <motion.div 
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="relative card-professional p-12 group hover:border-orange-200 transition-all"
                        >
                            <div className="text-6xl font-black text-gray-100 absolute top-6 right-8 group-hover:text-orange-50 transition-colors">
                                {item.step}
                            </div>
                            <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-[#F97316] mb-8 border border-gray-100 group-hover:bg-orange-50 transition-colors">
                                {item.icon}
                            </div>
                            <h4 className="text-xl font-black text-[#111111] mb-4 tracking-tight">{item.title}</h4>
                            <p className="text-gray-400 font-bold text-sm leading-relaxed">{item.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Features Section */}
            <section className="py-24 bg-gray-50/50 border-y border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <div>
                            <h2 className="text-xs font-black text-[#F97316] uppercase tracking-[0.4em] mb-6">Cutting-Edge Intelligence</h2>
                            <h3 className="text-4xl md:text-5xl font-black text-[#111111] mb-8 tracking-tight leading-tight">
                                Built with the Power of <br />
                                <span className="text-orange-500">Llama 3.3 Intelligence</span>
                            </h3>
                            <div className="space-y-8">
                                {[
                                    { title: "Role-Specific Accuracy", desc: "Our AI understands nuanced finance roles from Investment Banking to Credit Analysis.", icon: <Shield size={20} /> },
                                    { title: "High-Speed Inference", desc: "Powered by Groq for instantaneous responses, mimicking a real conversation flow.", icon: <Zap size={20} /> },
                                    { title: "Privacy Guaranteed", desc: "Your practice sessions are private and stateless. Practice as much as you want.", icon: <Sparkles size={20} /> }
                                ].map((feature, i) => (
                                    <div key={i} className="flex gap-6">
                                        <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-orange-600 border border-gray-100 shrink-0">
                                            {feature.icon}
                                        </div>
                                        <div>
                                            <h5 className="font-black text-[#111111] text-lg mb-1 tracking-tight">{feature.title}</h5>
                                            <p className="text-gray-400 font-bold text-sm leading-relaxed">{feature.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="relative">
                            <div className="absolute inset-0 bg-orange-400/20 blur-[120px] rounded-full" />
                            <div className="relative card-professional p-12 bg-white/80 backdrop-blur-xl border-white shadow-2xl rounded-[3rem]">
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600 border border-orange-100 shadow-sm">
                                        <GraduationCap size={24} />
                                    </div>
                                    <h4 className="text-xl font-black text-[#111111] tracking-tight">Practice Preview</h4>
                                </div>
                                <div className="space-y-6">
                                    <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 flex gap-4">
                                        <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600 shrink-0 border border-orange-100 font-bold text-xs uppercase tracking-tighter">AI</div>
                                        <p className="text-sm font-bold text-gray-500 italic">"Welcome! For this Investment Banking role, can you explain a time you managed a complex financial model under a tight deadline?"</p>
                                    </div>
                                    <div className="bg-[#111111] p-6 rounded-2xl flex gap-4 justify-end">
                                        <p className="text-sm font-bold text-white text-right">"Absolutely. During my internship at X firm, I was tasked with valuing a distressed asset..."</p>
                                        <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-white shrink-0 font-bold text-xs uppercase tracking-tighter">ME</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-24 text-center">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-[#111111] rounded-[3rem] p-16 md:p-24 relative overflow-hidden shadow-2xl">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-600/20 blur-[100px]" />
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-600/20 blur-[100px]" />
                        
                        <h3 className="text-4xl md:text-5xl font-black text-white mb-8 relative z-10 leading-tight">Ready to Master Your Next Interview?</h3>
                        <p className="text-white/40 font-bold text-lg mb-12 relative z-10">Select a job from our listing and start practicing with your AI coach today.</p>
                        
                        <Link to="/jobs" className="btn-primary px-12 py-5 rounded-2xl inline-flex items-center gap-3 relative z-10 group">
                            Start Practicing Now
                            <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default InterviewCoach;
