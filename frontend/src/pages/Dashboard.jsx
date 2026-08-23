import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import { User, FileText, Briefcase, Settings, CircleDollarSign } from 'lucide-react';
import api from '../lib/axios';

const Dashboard = () => {
    const { user, isAuthenticated } = useAuthStore();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('profile');
    const [applications, setApplications] = useState([]);

    // Employer states
    const [employerJobs, setEmployerJobs] = useState([]);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        }
    }, [isAuthenticated, navigate]);

    useEffect(() => {
        const fetchSeekerData = async () => {
            try {
                const res = await api.get('/applications/seeker');
                setApplications(res.data);
            } catch (error) {
                console.error("Failed to fetch applications", error);
            }
        };

        const fetchEmployerData = async () => {
            try {
                const res = await api.get('/jobs/my-jobs');
                setEmployerJobs(res.data);
            } catch (error) {
                console.error("Failed to fetch employer jobs", error);
            }
        };

        if (user?.role === 'seeker') {
            fetchSeekerData();
        } else if (user?.role === 'employer') {
            fetchEmployerData();
        }
    }, [user]);

    if (!user) return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="flex flex-col items-center gap-6">
                <div className="w-14 h-14 border-2 border-gray-100 border-t-[#F97316] rounded-full animate-spin shadow-[0_0_20px_#F9731630]"></div>
                <p className="font-black italic text-gray-300 uppercase tracking-[0.4em] text-[10px]">Initializing Controller</p>
            </div>
        </div>
    );

    return (
        <div className="bg-white min-h-screen pt-24 pb-32">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar */}
                <div className="w-full lg:w-80 space-y-8">
                    <div className="card-professional p-8">
                        <div className="flex flex-col items-center text-center mb-10">
                            <div className="w-24 h-24 bg-gray-50 border border-gray-200 rounded-3xl flex items-center justify-center text-[#111111] font-black text-4xl mb-6 shadow-2xl relative group">
                                <div className="absolute inset-0 bg-[#F97316]/20 blur-[20px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                                <span className="relative z-10">{user.name.charAt(0)}</span>
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-[#111111] mb-2 tracking-tight">{user.name}</h2>
                                <span className="text-[#F97316] text-[10px] font-black px-4 py-1.5 bg-[#F97316]/10 rounded-full uppercase tracking-[0.2em] border border-[#F97316]/20">
                                    Strategic {user.role} Identity
                                </span>
                            </div>
                        </div>

                        <nav className="space-y-2">
                            {[
                                { id: 'profile', icon: User, label: 'Core Identity' },
                                { id: 'applications', icon: FileText, label: 'Application Vault', hide: user.role !== 'seeker' },
                                { id: 'manage-jobs', icon: Briefcase, label: 'Asset Management', hide: user.role !== 'employer' },
                                { id: 'settings', icon: Settings, label: 'Security Config' }
                            ].map(item => !item.hide && (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveTab(item.id)}
                                    className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-left transition-all text-[10px] font-black uppercase tracking-widest ${activeTab === item.id
                                        ? 'bg-[#F97316]/10 text-[#F97316] border border-[#F97316]/20'
                                        : 'text-gray-500 hover:bg-gray-50 hover:text-[#111111]'
                                        }`}
                                >
                                    <item.icon size={16} />
                                    <span>{item.label}</span>
                                </button>
                            ))}
                        </nav>
                    </div>

                    {/* Quick Info */}
                    <div className="card-professional p-8 bg-gradient-to-br from-[#121224] to-[#050505] border-[#F97316]/20 shadow-[0_20px_40px_rgba(249,115,22,0.05)]">
                        <h3 className="text-[10px] font-black text-[#F97316] uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                             System Status
                        </h3>
                        <p className="text-3xl font-black text-[#111111] italic tracking-tight mb-2 uppercase">Verified</p>
                        <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em]">Platinum Tier Authority</p>
                    </div>
                </div>

                {/* Main Content Areas */}
                <div className="flex-1">
                    <div className="card-professional p-8 md:p-12">
                        {activeTab === 'profile' && (
                            <div className="space-y-12">
                                <div>
                                    <h3 className="text-3xl font-black text-[#111111] mb-3 tracking-tight">Identity Synchronization</h3>
                                    <p className="text-gray-400 text-sm font-bold uppercase tracking-widest">Manage your credential parameters</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="p-8 bg-gray-50 border border-gray-100 rounded-3xl group hover:border-[#F97316]/20 transition-all">
                                        <label className="block text-[10px] font-black text-gray-300 uppercase tracking-[0.2em] mb-4">Primary Identifier</label>
                                        <p className="text-xl font-black text-[#111111]">{user.name}</p>
                                    </div>
                                    <div className="p-8 bg-gray-50 border border-gray-100 rounded-3xl group hover:border-[#F97316]/20 transition-all">
                                        <label className="block text-[10px] font-black text-gray-300 uppercase tracking-[0.2em] mb-4">Secure Channel</label>
                                        <p className="text-xl font-black text-[#111111]">{user.email}</p>
                                    </div>
                                    <div className="p-8 bg-gray-50 border border-gray-100 rounded-3xl md:col-span-2 group hover:border-[#F97316]/20 transition-all">
                                        <label className="block text-[10px] font-black text-gray-300 uppercase tracking-[0.2em] mb-4">
                                            {user.role === 'seeker' ? 'Professional Dossier' : 'Corporate Entity Parameters'}
                                        </label>
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                            <p className="text-base font-black text-gray-500">
                                                {user.role === 'seeker' ? (user.resumeUrl ? 'Credentials Encrypted & Verified' : 'Dossier Not Found') : (user.companyName || 'Undefined Identity')}
                                            </p>
                                            <div className="flex items-center gap-6">
                                                {user.role === 'seeker' && user.resumeUrl && (
                                                    <a 
                                                        href={`${import.meta.env.VITE_API_URL.replace('/api', '')}${user.resumeUrl}`} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer"
                                                        className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] hover:text-[#F97316] transition-colors"
                                                    >
                                                        Access Data
                                                    </a>
                                                )}
                                                <input
                                                    type="file"
                                                    id="resume-upload"
                                                    className="hidden"
                                                    accept=".pdf,.doc,.docx"
                                                    onChange={async (e) => {
                                                        const file = e.target.files[0];
                                                        if (file) {
                                                                const formData = new FormData();
                                                                formData.append('resume', file);
                                                                const { updateProfile } = useAuthStore.getState();
                                                                await updateProfile(formData);
                                                        }
                                                    }}
                                                />
                                                <button 
                                                    onClick={() => document.getElementById('resume-upload').click()}
                                                    className="btn-primary text-[10px] font-black uppercase tracking-[0.2em] px-8 py-3 rounded-2xl"
                                                >
                                                    Upload New
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'applications' && user.role === 'seeker' && (
                            <div className="space-y-12">
                                <div>
                                    <h3 className="text-3xl font-black text-[#111111] mb-3 tracking-tight">Acquisition Vault</h3>
                                    <p className="text-gray-400 text-sm font-bold uppercase tracking-widest">Real-time engagement tracking</p>
                                </div>

                                {applications.length === 0 ? (
                                    <div className="py-24 text-center border-2 border-gray-100 border-dashed rounded-[3rem] bg-gray-50 shadow-2xl">
                                        <FileText size={48} className="text-[#111111]/10 mx-auto mb-6" />
                                        <p className="text-gray-300 text-[10px] font-black uppercase tracking-[0.4em]">Vault Exhausted</p>
                                        <button onClick={() => navigate('/jobs')} className="mt-8 btn-primary px-10 py-3 text-[10px] font-black uppercase tracking-[0.2em]">Procure Opportunity</button>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        {applications.slice(0, 5).map(app => (
                                            <div key={app._id}
                                                className="p-8 bg-gray-50 border border-gray-100 rounded-3xl flex flex-col md:flex-row justify-between items-center gap-8 hover:border-[#F97316]/40 transition-all shadow-2xl group"
                                            >
                                                <div className="flex items-center gap-6">
                                                    <div className="w-14 h-14 bg-gray-50 text-[#111111] font-black rounded-2xl flex items-center justify-center border border-gray-200 group-hover:border-[#F97316]/40 transition-all">
                                                        {app.jobId?.title?.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <h4 className="text-lg font-black text-[#111111] tracking-tight mb-1 group-hover:text-[#F97316] transition-colors">{app.jobId?.title}</h4>
                                                        <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em]">Executed {new Date(app.createdAt).toLocaleDateString()}</p>
                                                    </div>
                                                </div>
                                                <div className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.3em] border shadow-lg ${app.status === 'accepted' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                                                    app.status === 'rejected' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' :
                                                        'bg-[#F97316]/10 text-[#F97316] border-[#F97316]/20 shadow-[0_0_15px_#F9731610]'
                                                    }`}>
                                                    {app.status}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'manage-jobs' && user.role === 'employer' && (
                            <div className="space-y-12">
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
                                    <div>
                                        <h3 className="text-3xl font-black text-[#111111] mb-3 tracking-tight">Asset Infrastructure</h3>
                                        <p className="text-gray-400 text-sm font-bold uppercase tracking-widest">Global placement and audit control</p>
                                    </div>
                                    <button onClick={() => navigate('/post-job')} className="btn-primary px-10 py-4 text-[10px] font-black uppercase tracking-[0.3em] shadow-[0_20px_40px_rgba(249,115,22,0.2)]">
                                        Execute Placement
                                    </button>
                                </div>

                                {employerJobs.length === 0 ? (
                                    <div className="py-24 text-center border-2 border-gray-100 border-dashed rounded-[3rem] bg-gray-50 shadow-2xl">
                                        <Briefcase size={48} className="text-[#111111]/10 mx-auto mb-6" />
                                        <p className="text-gray-300 text-[10px] font-black uppercase tracking-[0.4em]">Assets Undefined</p>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        {employerJobs.map(job => (
                                            <div key={job._id}
                                                className="p-8 bg-gray-50 border border-gray-100 rounded-3xl hover:border-[#F97316]/40 transition-all shadow-2xl group"
                                            >
                                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                                                    <div className="flex items-center gap-6">
                                                        <div className="w-16 h-16 bg-gray-100 text-[#111111] font-black rounded-2xl flex items-center justify-center text-xl shrink-0 border border-gray-200 group-hover:bg-[#F97316] group-hover:border-[#F97316] transition-all duration-500">
                                                            {job.title.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <h4 className="text-xl font-black text-[#111111] tracking-tight mb-2 group-hover:text-[#F97316] transition-colors">{job.title}</h4>
                                                            <div className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] flex flex-wrap items-center gap-4">
                                                                <span className="flex items-center gap-2"><MapPin size={12} className="text-[#F97316]" /> {job.location}</span>
                                                                <span className="flex items-center gap-2"><CircleDollarSign size={12} className="text-[#F97316]" /> {job.salary || "Disclosed on call"}</span>
                                                                {job.category && <span className="text-[#F97316]/60">• {job.category}</span>}
                                                            </div>
                                                            <p className="text-[10px] text-gray-300 uppercase font-black tracking-widest mt-3">Initialized {new Date(job.createdAt).toLocaleDateString()}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-4 ml-20 md:ml-0">
                                                        <span className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.3em] border shadow-xl ${job.jobStatus === 'approved' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                                                                job.jobStatus === 'rejected' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' :
                                                                    'bg-[#F97316]/10 text-[#F97316] border-[#F97316]/20 shadow-[0_0_15px_#F9731610] animate-pulse'
                                                            }`}>
                                                            {job.jobStatus === 'pending' ? '⏳ Auditing' : job.jobStatus === 'approved' ? '✓ Authenticated' : '✕ Dismissed'}
                                                        </span>
                                                        <button
                                                            onClick={() => navigate(`/jobs/${job.jobId || job._id}`)}
                                                            className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] border border-gray-100 bg-gray-50 px-6 py-2.5 rounded-xl hover:bg-gray-100 hover:text-[#111111] transition-all"
                                                        >
                                                            Inspect
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
