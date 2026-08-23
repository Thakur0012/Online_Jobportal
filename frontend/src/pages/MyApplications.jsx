import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useNavigate, Link } from 'react-router-dom';
import { Briefcase, Clock, CheckCircle2, XCircle, AlertCircle, ArrowRight, MapPin } from 'lucide-react';
import api from '../lib/axios';

const MyApplications = () => {
    const { user, isAuthenticated } = useAuthStore();
    const navigate = useNavigate();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        const fetchApplications = async () => {
            try {
                const res = await api.get('/applications/seeker');
                setApplications(res.data);
            } catch (error) {
                console.error("Failed to fetch applications", error);
            } finally {
                setLoading(false);
            }
        };

        if (user?.role === 'seeker') {
            fetchApplications();
        } else {
            setLoading(false);
        }
    }, [isAuthenticated, navigate, user]);

    const getStatusStyles = (status) => {
        switch (status) {
            case 'accepted': return 'bg-green-500/10 text-green-500 border-green-500/20';
            case 'rejected': return 'bg-red-500/10 text-red-500 border-red-500/20';
            case 'reviewed': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
            default: return 'bg-gray-50 text-[#111111]/50 border-gray-200';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'accepted': return <CheckCircle2 size={16} />;
            case 'rejected': return <XCircle size={16} />;
            case 'reviewed': return <AlertCircle size={16} />;
            default: return <Clock size={16} />;
        }
    };

    if (loading) return <div className="p-20 text-center text-gray-400 font-black italic uppercase tracking-widest text-[10px]">Interrogating Records...</div>;

    if (user?.role !== 'seeker') {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center italic bg-white">
                <AlertCircle size={48} className="text-gray-300 mb-4" />
                <h2 className="text-2xl font-black text-[#111111] mb-2 tracking-tight">Employers Do Not Apply</h2>
                <p className="text-gray-400 font-bold text-sm">Access your management console to oversee job postings.</p>
                <Link to="/dashboard" className="mt-8 btn-primary text-[10px] uppercase tracking-[0.2em]">Access Dashboard</Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-24 px-4">
            <div className="max-w-4xl mx-auto">
                <header className="mb-10 text-center md:text-left">
                    <span className="text-[10px] font-black text-[#F97316] uppercase tracking-[0.3em] mb-2 block">Candidacy Log</span>
                    <h1 className="text-3xl md:text-4xl font-black text-[#111111] mb-2 tracking-tight">Active Applications</h1>
                    <p className="text-gray-400 font-bold text-sm tracking-wide">Monitor the status of your submitted profiles across corporate networks.</p>
                </header>

                {applications.length === 0 ? (
                    <div className="bg-white rounded-[2.5rem] border border-gray-100 p-16 text-center shadow-2xl">
                        <div className="w-16 h-16 bg-gray-50 rounded-[1.5rem] flex items-center justify-center mx-auto mb-6 border border-gray-100 shadow-inner">
                            <Briefcase size={28} className="text-[#F97316]" />
                        </div>
                        <h3 className="text-xl font-black text-[#111111] mb-3">No Application Data Found</h3>
                        <p className="text-gray-400 text-sm font-bold mb-8 max-w-sm mx-auto">Initiate contact with top employers to populate your application log.</p>
                        <Link to="/jobs" className="btn-primary px-8 py-3.5 text-[10px] uppercase tracking-[0.2em]">
                            Browse Opportunities
                        </Link>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {applications.map((app) => (
                            <div key={app._id} className="card-professional p-6 group">
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-3">
                                            <Link to={`/jobs/${app.jobId?.jobId || app.jobId?._id}`}>
                                                <h3 className="text-xl font-black text-[#111111] hover:text-[#F97316] transition-colors tracking-tight">
                                                    {app.jobId?.title || 'Unknown Position'}
                                                </h3>
                                            </Link>
                                            <span className={`flex items-center gap-1.5 px-3 py-1 rounded border text-[9px] font-black uppercase tracking-[0.2em] shadow-sm ${getStatusStyles(app.status)}`}>
                                                {getStatusIcon(app.status)}
                                                {app.status}
                                            </span>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-gray-400">
                                            <span className="text-[#F97316] tracking-wider uppercase">{app.jobId?.employerId?.companyName || 'Corporate Entity'}</span>
                                            <span className="flex items-center gap-1.5"><MapPin size={12} className="text-gray-300" /> {app.jobId?.location}</span>
                                            <span className="flex items-center gap-1.5"><Clock size={12} className="text-gray-300" /> Applied: <span className="text-gray-700">{new Date(app.createdAt).toLocaleDateString()}</span></span>
                                        </div>
                                    </div>

                                    <Link
                                        to={`/jobs/${app.jobId?.jobId || app.jobId?._id}`}
                                        className="text-black bg-white/90 hover:bg-white px-5 py-2.5 rounded-xl text-[10px] font-black flex items-center gap-2 uppercase tracking-[0.2em] transition-all"
                                    >
                                        Inspect <ArrowRight size={14} />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyApplications;
