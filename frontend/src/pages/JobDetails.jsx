import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, MapPin, IndianRupee, Clock, ChevronLeft, ChevronRight, Building2, CheckCircle2, AlertCircle, Sparkles, Globe, Users, ExternalLink, CircleDollarSign, Calendar, GraduationCap, MessageSquare } from 'lucide-react';
import api from '../lib/axios';
import MockInterviewModal from '../components/MockInterviewModal';

const JobDetails = () => {
    const { id } = useParams();
    const { user, isAuthenticated } = useAuthStore();
    const navigate = useNavigate();

    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [applying, setApplying] = useState(false);
    const [applyMessage, setApplyMessage] = useState('');
    const [applicants, setApplicants] = useState([]);
    const [isInterviewOpen, setIsInterviewOpen] = useState(false);

    useEffect(() => {
        const fetchJob = async () => {
            try {
                const res = await api.get(`/jobs/${id}`);
                setJob(res.data);

                if (user && (user.role === 'employer' || user.role === 'admin') && res.data.employerId?._id === user._id) {
                    const appsRes = await api.get('/applications/employer');
                    const jobApplicants = appsRes.data.filter(app => app.jobId._id === id);
                    setApplicants(jobApplicants);
                }
            } catch (error) {
                console.error("Failed to fetch job", error);
            } finally {
                setLoading(false);
            }
        };
        fetchJob();
    }, [id, user]);

    const handleApply = async () => {
        if (!isAuthenticated) {
            setApplyMessage('Authentication required: Please Login or Sign Up to execute this application.');
            // Scroll to message
            setTimeout(() => {
                document.getElementById('apply-message-box')?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
            return;
        }

        if (user.role !== 'seeker' && user.role !== 'admin') {
            setApplyMessage('Only candidate accounts are authorized to initiate applications.');
            return;
        }

        setApplying(true);
        setApplyMessage('');
        try {
            await api.post('/applications/apply', { jobId: job._id });
            setApplyMessage('Successfully applied for this job!');
            
            // If the job was posted via AI automation and has an external URL, redirect the user
            if (job.externalUrl) {
                window.open(job.externalUrl, '_blank');
            }

            if (user.role === 'admin') {
                setTimeout(() => navigate('/admin?section=applications'), 2000);
            }
        } catch (error) {
            setApplyMessage(error.response?.data?.message || 'Failed to apply.');
        } finally {
            setApplying(false);
        }
    };

    const updateStatus = async (appId, newStatus) => {
        try {
            await api.put(`/applications/${appId}/status`, { status: newStatus });
            setApplicants(applicants.map(app => app._id === appId ? { ...app, status: newStatus } : app));
        } catch (error) {
            alert("Failed to update status");
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="flex flex-col items-center gap-6">
                <div className="w-14 h-14 border-2 border-gray-100 border-t-[#F97316] rounded-full animate-spin shadow-[0_0_20px_#F9731630]"></div>
                <p className="font-black italic text-gray-300 uppercase tracking-[0.4em] text-[10px]">Synchronizing Intelligence</p>
            </div>
        </div>
    );

    if (!job) return (
        <div className="min-h-screen flex items-center justify-center bg-white italic font-black text-gray-300 uppercase tracking-widest">
            Identity Not Found
        </div>
    );

    const isOwner = (user?.role === 'employer' || user?.role === 'admin') && job.employerId?._id === user?._id;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white min-h-screen pt-24 pb-32 text-[#111111]"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header Actions */}
                <div className="flex justify-between items-center mb-10">
                    <Link to="/jobs" className="inline-flex items-center text-gray-500 hover:text-[#111111] font-black transition-all group uppercase tracking-widest text-[10px] bg-gray-50 px-8 py-3 rounded-2xl border border-gray-100 hover:bg-gray-100">
                        <ChevronLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" /> Return to directory
                    </Link>
                    {isOwner && (
                        <div className="flex items-center gap-4 bg-[#F97316]/10 px-6 py-3 rounded-2xl border border-[#F97316]/20">
                            <div className="w-1.5 h-1.5 bg-[#F97316] rounded-full animate-pulse shadow-[0_0_8px_#F97316]" />
                            <span className="text-[#F97316] text-[10px] font-black uppercase tracking-[0.2em]">Management Interface Active</span>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6 min-w-0">
                        {/* Hero Section Card - Professional Style */}
                        <div className="card-professional p-6 md:p-12">
                            <div className="flex flex-col gap-6">
                                <div>
                                    <h1 className="text-3xl md:text-5xl font-black text-[#111111] mb-6 tracking-tight">
                                        {job.title}
                                    </h1>
                                    <div className="flex items-center gap-3 text-gray-400 font-bold uppercase tracking-widest text-xs">
                                        <Building2 size={16} className="text-[#F97316]" />
                                        <span>{job.employerId?.companyName}</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-10 py-10 border-y border-gray-100 text-sm">
                                    <div className="flex items-center gap-5">
                                        <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-300">
                                            <Briefcase size={22} />
                                        </div>
                                        <div>
                                            <p className="text-gray-500 font-black text-[10px] uppercase tracking-widest mb-1">Expertise</p>
                                            <p className="text-[#111111] font-black">{job.experienceLevel || '2 - 5 years'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-5">
                                        <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-[#F97316]">
                                            <CircleDollarSign size={22} />
                                        </div>
                                        <div>
                                            <p className="text-gray-500 font-black text-[10px] uppercase tracking-widest mb-1">Fiscal Package</p>
                                            <p className="text-[#111111] font-black">{job.salary || "Disclosed on call"}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-5 col-span-2 md:col-span-1">
                                        <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-300">
                                            <MapPin size={22} />
                                        </div>
                                        <div>
                                            <p className="text-gray-500 font-black text-[10px] uppercase tracking-widest mb-1">Deployment</p>
                                            <p className="text-[#111111] font-black">{job.location}</p>
                                        </div>
                                    </div>
                                </div>

                                    <div className="flex flex-wrap items-center justify-between gap-6 pt-6 text-[10px] font-black uppercase tracking-widest text-gray-500">
                                        <div className="flex flex-wrap items-center gap-4 md:gap-8">
                                            <span>Published: <span className="text-[#111111]">{new Date(job.createdAt).toLocaleDateString()}</span></span>
                                            <span>Openings: <span className="text-[#111111]">{job.openings || 1}</span></span>
                                            <span>Interest: <span className="text-[#111111]">{applicants?.length || 0} Applicants</span></span>
                                        </div>
                                        <div className="bg-[#F97316]/10 text-[#F97316] px-5 py-2 rounded-full border border-[#F97316]/20 tracking-[0.2em]">
                                            {job.category}
                                        </div>
                                    </div>
                            </div>
                        </div>

                        {/* Content Card */}
                        <div className="card-professional p-6 md:p-12">
                            <section className="space-y-12">
                                <div>
                                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-gray-400 mb-8 border-l-2 border-[#F97316] pl-4">Job Specification</h3>
                                    <div 
                                        className="text-gray-600 text-base leading-relaxed font-medium prose max-w-none prose-p:my-4 prose-ul:list-disc prose-ul:pl-6 prose-ol:list-decimal prose-ol:pl-6 prose-strong:text-[#111111] prose-headings:text-[#111111] job-description-text break-words overflow-x-hidden"
                                        dangerouslySetInnerHTML={{ __html: job.description }}
                                    />
                                </div>

                                <div>
                                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-gray-400 mb-8 border-l-2 border-[#F97316] pl-4">Operational Prerequisites</h3>
                                    <div className="flex flex-wrap gap-3">
                                        {job.requirements?.map((req, i) => (
                                            <span
                                                key={i}
                                                className="px-6 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-[#F97316]/80"
                                            >
                                                {req}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Mock Interview Section */}
                                <div className="pt-12 border-t border-gray-100">
                                <div className="bg-orange-50/50 rounded-[2rem] border border-orange-100 p-6 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 w-40 h-40 bg-orange-400 blur-[100px] opacity-[0.05] group-hover:opacity-[0.1] transition-opacity" />
                                        <div className="relative z-10">
                                            <div className="flex items-center gap-2 text-orange-600 font-black text-[10px] uppercase tracking-widest mb-4 bg-white/80 px-4 py-1.5 rounded-full border border-orange-100 w-fit">
                                                <Sparkles size={12} /> Personalized Coaching
                                            </div>
                                            <h4 className="text-2xl font-black text-[#111111] mb-2 tracking-tight">Practice for this Role</h4>
                                            <p className="text-gray-500 text-sm font-bold max-w-md">Our AI Intelligence can conduct a mock interview specifically for this position to help you prepare.</p>
                                        </div>
                                        <button 
                                            onClick={() => setIsInterviewOpen(true)}
                                            className="relative z-10 w-full md:w-auto btn-primary px-10 py-4 rounded-2xl flex items-center justify-center gap-3 group/btn hover:shadow-orange-200"
                                        >
                                            <MessageSquare size={18} />
                                            <span>Start Mock Interview</span>
                                            <ChevronRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                                        </button>
                                    </div>
                                </div>

                                {/* Application Section */}
                                {(!isOwner || user?.role === 'admin') && user?.role !== 'employer' && (
                                    <div className="pt-12 border-t border-gray-100">
                                        <div className="flex flex-col md:flex-row items-center justify-between gap-10 p-6 md:p-10 bg-[#F97316]/5 rounded-[2rem] border border-[#F97316]/20 relative overflow-hidden group">
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#F97316] blur-[80px] opacity-[0.05] group-hover:opacity-[0.1] transition-opacity" />
                                            <div className="relative z-10">
                                                <h4 className="text-2xl font-black text-[#111111] mb-2">Initiate Acquisition</h4>
                                                <p className="text-gray-400 text-sm font-bold">Submit your professional credentials for immediate evaluation.</p>
                                            </div>
                                            <button
                                                onClick={handleApply}
                                                disabled={applying || applyMessage.includes('Successfully')}
                                                className={`relative z-10 w-full md:w-auto px-12 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-2xl ${applyMessage.includes('Successfully')
                                                    ? 'bg-green-600 text-[#111111] cursor-not-allowed opacity-100'
                                                    : 'btn-primary'
                                                    }`}
                                            >
                                                {applying ? 'Evaluating...' : applyMessage.includes('Successfully') ? 'Application Secured' : 'Execute Application'}
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {applyMessage && (
                                    <div id="apply-message-box" className={`p-4 rounded-lg flex items-center gap-3 text-sm font-bold ${applyMessage.includes('Successfully') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                                        }`}>
                                        {applyMessage.includes('Successfully') ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                                        <p>{applyMessage}</p>
                                    </div>
                                )}
                            </section>
                        </div>

                        {/* Employer Manage Applicants */}
                        <AnimatePresence>
                            {isOwner && (
                                <motion.section
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="card-professional p-6 md:p-12"
                                >
                                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                                        <div>
                                            <h3 className="text-xl font-bold text-[#111111] mb-1">Manage Applicants</h3>
                                            <p className="text-gray-400 text-sm font-medium">Review and update status for candidates who applied.</p>
                                        </div>
                                        <button className="text-[#F97316] text-xs font-bold uppercase tracking-wider hover:underline flex items-center gap-2">
                                            Export CSV <ExternalLink size={14} />
                                        </button>
                                    </div>

                                    {applicants.length === 0 ? (
                                        <div className="py-16 text-center border border-gray-100 border-dashed rounded-xl bg-white">
                                            <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-500 border border-gray-100">
                                                <Users size={24} />
                                            </div>
                                            <p className="text-gray-400 font-bold text-sm">No applications received yet.</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {applicants.map(app => (
                                                <div
                                                    key={app._id}
                                                    className="p-6 bg-white border border-gray-100 rounded-xl flex flex-col lg:flex-row justify-between items-center gap-6 hover:shadow-sm transition-all"
                                                >
                                                    <div className="flex items-center gap-4 w-full lg:w-auto">
                                                        <div className="w-10 h-10 bg-[#F97316]/10 text-[#F97316] rounded-lg flex items-center justify-center font-bold border border-[#F97316]/20">
                                                            {app.applicantId?.name?.charAt(0).toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <h4 className="font-bold text-[#111111]">{app.applicantId?.name}</h4>
                                                            <p className="text-xs text-gray-400 font-medium">{app.applicantId?.email}</p>
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                                                        <a
                                                            href={app.resumeUrl}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="flex-1 lg:flex-none text-center bg-transparent border border-gray-200 px-6 py-2 rounded-full text-xs font-bold text-gray-400 hover:bg-gray-50 hover:text-[#111111] transition-all uppercase tracking-wider"
                                                        >
                                                            Resume
                                                        </a>
                                                        <div className="flex-1 lg:flex-none">
                                                            <select
                                                                value={app.status}
                                                                onChange={(e) => updateStatus(app._id, e.target.value)}
                                                                className={`w-full lg:w-40 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border focus:outline-none transition-all cursor-pointer ${app.status === 'accepted' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                                                                    app.status === 'rejected' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                                                                        'bg-gray-50 text-gray-700 border-gray-200'
                                                                    }`}
                                                            >
                                                                <option value="pending" className="bg-white">Pending</option>
                                                                <option value="reviewed" className="bg-white">Shortlisted</option>
                                                                <option value="accepted" className="bg-white">Accepted</option>
                                                                <option value="rejected" className="bg-white">Rejected</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </motion.section>
                            )}
                        </AnimatePresence>
                        
                        {/* Beware Section */}
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.98 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            className="p-6 md:p-10 border-2 border-dashed border-[#F97316]/20 bg-[#F97316]/5 rounded-[3rem] flex flex-col md:flex-row gap-8 items-start shadow-2xl"
                        >
                            <div className="w-14 h-14 bg-[#F97316] rounded-2xl flex items-center justify-center text-[#111111] shadow-lg shrink-0">
                                <AlertCircle size={28} />
                            </div>
                            <div>
                                <h4 className="text-xl font-black text-[#111111] mb-3 uppercase tracking-widest italic">Hiring Integrity Protections</h4>
                                <p className="text-gray-400 text-sm font-bold leading-relaxed">
                                    <span className="text-[#F97316]">LedgerBandhu.com</span> enforces strict verification. We never facilitate job promises for monetary exchange. 
                                    Fraudulent entities may solicit "registration" or "refundable" fees. Please report any such activity immediately.
                                </p>
                            </div>
                        </motion.div>
                    </div>

                    {/* Sidebar */}
                    <aside className="space-y-6">
                        {/* Summary Sidebar */}
                        <div className="card-professional p-6 md:p-10">
                            <h4 className="text-xs font-black uppercase tracking-[0.3em] text-gray-400 mb-8 flex items-center gap-3">
                                <Sparkles size={16} className="text-[#F97316]" />
                                Metrics Overview
                            </h4>

                            <div className="space-y-6">
                                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                                    <span className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Job Category</span>
                                    <span className="text-[#111111] font-black text-xs uppercase tracking-widest">{job.category}</span>
                                </div>
                                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                                    <span className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Compensation</span>
                                    <span className="text-[#F97316] font-black text-xs uppercase tracking-widest">{job.salary || 'NA'}</span>
                                </div>
                                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                                    <span className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Proficiency</span>
                                    <span className="text-[#111111] font-black text-xs uppercase tracking-widest">{job.experienceLevel || 'Elite'}</span>
                                </div>
                                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                                    <span className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Credentials</span>
                                    <span className="text-[#111111] font-black text-xs uppercase tracking-widest">{job.educationLevel || 'Standard'}</span>
                                </div>
                                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                                    <span className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Headcount</span>
                                    <span className="text-[#111111] font-black text-xs uppercase tracking-widest">{job.openings || 1}</span>
                                </div>
                                <div className="flex justify-between items-center py-3">
                                    <span className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Terminus Date</span>
                                    <span className="text-rose-500 font-black text-xs uppercase tracking-widest">{job.deadline ? new Date(job.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Continuous'}</span>
                                </div>
                            </div>
                        </div>

                        {/* Company Details */}
                        <div className="card-professional p-6 md:p-10">
                            <h4 className="text-[10px] font-black text-[#F97316] uppercase tracking-[0.3em] mb-8">Corporate Integrity</h4>
                            <div className="flex items-center gap-6 mb-8">
                                <div className="w-16 h-16 rounded-2xl flex items-center justify-center font-black text-[#111111] text-2xl bg-gray-50 border border-gray-200">
                                    {(job.employerId?.companyName || 'C')[0]}
                                </div>
                                <div>
                                    <h5 className="font-black text-[#111111] text-lg tracking-tight mb-1">{job.employerId?.companyName}</h5>
                                    <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 bg-[#F97316] rounded-full shadow-[0_0_5px_#F97316]" />
                                        <p className="text-[#F97316] text-[10px] font-black uppercase tracking-widest whitespace-nowrap">Premier Hub Verified</p>
                                    </div>
                                </div>
                            </div>
                            <p className="text-gray-400 text-sm font-bold leading-relaxed mb-8">
                                Connecting elite talent with vetted corporate entities within the Ledger Bandhu sovereign ecosystem.
                            </p>
                            <button className="w-full py-3.5 rounded-2xl text-[10px] font-black transition-all uppercase tracking-[0.2em] bg-gray-50 text-gray-400 border border-gray-100 hover:border-[#F97316]/40 hover:text-[#F97316]">
                                Strategic Partner Profile
                            </button>
                        </div>
                    </aside>
                </div>
            </div>

            <MockInterviewModal 
                isOpen={isInterviewOpen} 
                onClose={() => setIsInterviewOpen(false)} 
                job={job} 
            />
        </motion.div>
    );
};

export default JobDetails;

