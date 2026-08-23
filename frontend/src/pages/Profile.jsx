import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { User, Mail, Briefcase, FileText, CheckCircle, Save, Building2, AlignLeft, LayoutDashboard } from 'lucide-react';
import api from '../lib/axios';

const BASE_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

const Profile = () => {
    const { user, checkAuth } = useAuthStore();
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const [formData, setFormData] = useState({
        name: user?.name || '',
        resumeUrl: user?.resumeUrl || '',
        skills: user?.skills?.join(', ') || '',
        companyName: user?.companyName || '',
        companyDescription: user?.companyDescription || '',
    });
    const [resumeFile, setResumeFile] = useState(null);

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name,
                resumeUrl: user.resumeUrl || '',
                skills: user.skills?.join(', ') || '',
                companyName: user.companyName || '',
                companyDescription: user.companyDescription || '',
            });
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const fd = new FormData();
            fd.append('name', formData.name);
            fd.append('skills', formData.skills.split(',').map(s => s.trim()).filter(s => s !== '').join(','));
            if (user.role === 'employer') {
                fd.append('companyName', formData.companyName);
                fd.append('companyDescription', formData.companyDescription);
            }
            if (resumeFile) {
                fd.append('resume', resumeFile);
            }

            await api.put('/auth/profile', fd, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
            setIsEditing(false);
            await checkAuth(); // Refetch user data
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to update profile' });
        } finally {
            setLoading(false);
        }
    };

    if (!user) return <div className="p-20 text-center text-gray-400 font-black italic uppercase tracking-widest text-[10px]">Loading Identity...</div>;

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Header / Banner */}
            <div className="h-32 bg-gradient-to-r from-[#F97316]/10 to-[#EA580C]/10 border-b border-gray-100 relative">
                <div className="max-w-5xl mx-auto px-4 relative h-full">
                    <div className="absolute -bottom-12 left-4 sm:left-10">
                        <div className="w-24 h-24 bg-white rounded-2xl shadow-md flex items-center justify-center p-1.5 border border-gray-100">
                            <div className="w-full h-full bg-white rounded-xl flex items-center justify-center text-[#F97316] border border-[#F97316]/20">
                                <User size={40} strokeWidth={1.5} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 mt-16 pt-4 flex flex-col md:flex-row gap-8">
                {/* Information Card */}
                <div className="flex-1 space-y-8">
                    <div className="card-professional p-8">
                        <div className="flex justify-between items-center mb-10">
                            <div>
                                <h1 className="text-2xl font-bold text-[#111111] tracking-tight">{user.name}</h1>
                                <p className="text-gray-400 flex items-center gap-2 mt-1 text-sm font-medium">
                                    <Mail size={14} /> {user.email}
                                </p>
                            </div>
                            <button
                                onClick={() => setIsEditing(!isEditing)}
                                className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition shadow-sm border ${isEditing ? 'bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500/20' : 'btn-primary'
                                    }`}
                            >
                                {isEditing ? 'Cancel' : 'Edit Profile'}
                            </button>
                        </div>

                        {message.text && (
                            <div className={`mb-8 p-4 rounded-lg flex items-center gap-3 border text-sm font-bold ${message.type === 'success' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-700 border-red-100'
                                }`}>
                                <CheckCircle size={18} />
                                {message.text}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Display Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        disabled={!isEditing}
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full p-3 rounded-lg border border-gray-200 bg-white text-[#111111] focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316]/20 outline-none transition text-sm font-medium disabled:bg-gray-50 disabled:text-gray-500"
                                        placeholder="Enter your name"
                                    />
                                </div>

                                 {user.role === 'seeker' && (
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Resume</label>
                                            {user.resumeUrl && (
                                                <div className="flex items-center gap-2 mb-2 p-2 bg-[#F97316]/10 border border-[#F97316]/20 rounded-lg">
                                                    <FileText size={16} className="text-[#F97316]" />
                                                    <a 
                                                        href={user.resumeUrl.startsWith('http') ? user.resumeUrl : `${BASE_URL}${user.resumeUrl}`} 
                                                        target="_blank" rel="noreferrer"
                                                        className="text-xs font-bold text-[#F97316] hover:underline truncate"
                                                    >
                                                        Current Resume
                                                    </a>
                                                </div>
                                            )}
                                            {isEditing ? (
                                                <label className="flex flex-col items-center justify-center w-full p-4 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-all bg-white group">
                                                    <AlignLeft className="text-gray-400 group-hover:text-[#F97316] mb-1" size={20} />
                                                    <span className="text-[10px] font-bold text-[#111111]/50 uppercase tracking-widest">{resumeFile ? resumeFile.name : 'Choose new Resume (PDF/Doc)'}</span>
                                                    <input type="file" className="hidden" accept=".pdf,.doc,.docx" onChange={(e) => setResumeFile(e.target.files[0])} />
                                                </label>
                                            ) : (
                                                <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 text-xs text-gray-500 font-medium italic">
                                                    {user.resumeUrl ? 'Document uploaded' : 'No resume uploaded yet'}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {user.role === 'employer' && (
                                    <div className="space-y-2">
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Company Name</label>
                                        <input
                                            type="text"
                                            name="companyName"
                                            disabled={!isEditing}
                                            value={formData.companyName}
                                            onChange={handleChange}
                                            className="w-full p-3 rounded-lg border border-gray-200 bg-white text-[#111111] focus:border-[#F97316] outline-none transition text-sm font-medium disabled:bg-gray-50 disabled:text-gray-500"
                                            placeholder="Your Company Name"
                                        />
                                    </div>
                                )}
                            </div>

                            {user.role === 'seeker' && (
                                <div className="space-y-2">
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Skills (comma separated)</label>
                                    <input
                                        type="text"
                                        name="skills"
                                        disabled={!isEditing}
                                        value={formData.skills}
                                        onChange={handleChange}
                                        className="w-full p-3 rounded-lg border border-gray-200 bg-white text-[#111111] focus:border-[#F97316] outline-none transition text-sm font-medium disabled:bg-gray-50 disabled:text-gray-500"
                                        placeholder="React, Node.js, TypeScript..."
                                    />
                                </div>
                            )}

                            {user.role === 'employer' && (
                                <div className="space-y-2">
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Company Description</label>
                                    <textarea
                                        name="companyDescription"
                                        disabled={!isEditing}
                                        value={formData.companyDescription}
                                        onChange={handleChange}
                                        rows={4}
                                        className="w-full p-3 rounded-lg border border-gray-200 bg-white text-[#111111] focus:border-[#F97316] outline-none transition text-sm font-medium disabled:bg-gray-50 disabled:text-gray-500"
                                        placeholder="Tell us about your company..."
                                    />
                                </div>
                            )}

                            {isEditing && (
                                <div className="pt-4 border-t border-gray-100">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="btn-primary flex items-center gap-2 px-10 py-2.5 text-xs font-bold uppercase tracking-wider disabled:opacity-50"
                                    >
                                        <Save size={16} />
                                        {loading ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </div>
                            )}
                        </form>
                    </div>

                    {user.role === 'seeker' && user.skills?.length > 0 && (
                        <div className="card-professional p-8">
                            <h3 className="text-sm font-bold text-[#111111] uppercase tracking-wider mb-6">Expertise</h3>
                            <div className="flex flex-wrap gap-2">
                                {user.skills.map((skill, index) => (
                                    <span key={index} className="px-4 py-1.5 bg-gray-50 border border-gray-100 rounded-full text-xs font-bold text-gray-500">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Account Details Sidebar */}
                <div className="w-full md:w-80 space-y-6">
                    <div className="card-professional p-6">
                        <h3 className="text-[#111111] text-sm font-bold uppercase tracking-wider mb-6">Account Overview</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                <span className="text-gray-500 text-[10px] font-bold uppercase">Role</span>
                                <span className="text-[#111111] font-bold text-xs capitalize">{user.role}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                <span className="text-gray-500 text-[10px] font-bold uppercase">Member Since</span>
                                <span className="text-[#111111] font-bold text-xs">{new Date(user.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>

                        {/* Employer Dashboard Button */}
                        {user.role === 'employer' && (
                            <Link
                                to="/dashboard"
                                className="mt-6 w-full flex items-center justify-center gap-2 btn-primary font-bold text-[10px] uppercase tracking-[0.2em] px-4 py-3 rounded-xl transition-all active:scale-95"
                            >
                                <LayoutDashboard size={16} />
                                Employer Dashboard
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
