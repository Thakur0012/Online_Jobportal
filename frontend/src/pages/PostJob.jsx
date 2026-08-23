import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import api from '../lib/axios';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

const PostJob = () => {
    const { user, isAuthenticated, isLoading } = useAuthStore();
    const navigate = useNavigate();

    const getDefaultDeadline = () => {
        const d = new Date();
        d.setDate(d.getDate() + 45);
        return d.toISOString().split('T')[0];
    };

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        location: '',
        salary: '',
        category: '',
        requirements: '',
        openings: 1,
        deadline: getDefaultDeadline(),
        educationLevel: 'Graduation',
        experienceLevel: '0-2 Years',
    });
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await api.get('/categories');
                setCategories(res.data);
                // Set initial category if available
                if (res.data.length > 0) {
                    setFormData(prev => ({ ...prev, category: res.data[0].name }));
                }
            } catch (err) {
                console.error("Error fetching categories:", err);
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        if (!isLoading && (!isAuthenticated || user?.role !== 'employer')) {
            navigate('/register?role=employer&redirect=/post-job');
        }
    }, [isAuthenticated, user, navigate, isLoading]);

    if (isLoading || !isAuthenticated || user?.role !== 'employer') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="flex flex-col items-center gap-6">
                    <div className="w-14 h-14 border-2 border-gray-100 border-t-[#F97316] rounded-full animate-spin shadow-[0_0_20px_#F9731630]"></div>
                    <p className="font-black italic text-gray-300 uppercase tracking-[0.4em] text-[10px]">Authorizing Signal</p>
                </div>
            </div>
        );
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Convert requirements from comma-separated string to array
            const jobData = {
                ...formData,
                requirements: formData.requirements.split(',').map(r => r.trim()).filter(r => r !== '')
            };

            await api.post('/jobs', jobData);
            setLoading(false);
            navigate('/dashboard'); // Go back to dashboard to see the posted job
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to post job');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-24 px-4 overflow-hidden relative">
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#F97316]/5 blur-[120px] rounded-full -mr-64 -mt-64"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gray-50 blur-[120px] rounded-full -ml-48 -mb-48"></div>

            <div className="max-w-4xl mx-auto relative z-10">
                <div className="card-professional p-12 md:p-16">
                    <header className="mb-12 text-center">
                        <h1 className="text-4xl font-black text-[#111111] mb-4 tracking-tighter uppercase leading-tight">Asset <span className="text-gradient-orange">Deployment</span></h1>
                        <p className="text-gray-500 font-bold text-[10px] uppercase tracking-[0.3em]">Configure parameters for global strategic placement</p>
                    </header>

                    {error && (
                        <div className="bg-rose-500/10 text-rose-500 p-6 rounded-3xl mb-12 border border-rose-500/20 text-[10px] uppercase tracking-widest font-black flex items-center justify-center gap-3">
                            <span className="w-2 h-2 bg-rose-500 rounded-full animate-pulse shadow-[0_0_8px_#f43f5e]" />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] ml-6">Opportunity Title</label>
                                <input
                                    required
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-[#111111] font-black text-sm focus:border-[#F97316] outline-none transition-all placeholder-white/5"
                                    placeholder="e.g. Lead Financial Architect"
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] ml-6">Asset Category</label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-[#111111] font-black text-sm focus:border-[#F97316] outline-none transition-all appearance-none"
                                >
                                    {categories.map(cat => (
                                        <option key={cat._id} value={cat.name} className="bg-[#121224]">{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-3">
                                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] ml-6">Geographic Node</label>
                                <input
                                    required
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-[#111111] font-black text-sm focus:border-[#F97316] outline-none transition-all placeholder-white/5"
                                    placeholder="e.g. Global Remote / Mumbai"
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] ml-6">Remuneration Logic</label>
                                <input
                                    type="text"
                                    name="salary"
                                    value={formData.salary}
                                    onChange={handleChange}
                                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-[#111111] font-black text-sm focus:border-[#F97316] outline-none transition-all placeholder-white/5"
                                    placeholder="e.g. Disclosed on Selection"
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] ml-6">Engagement Capacity</label>
                                <input
                                    type="number"
                                    name="openings"
                                    min="1"
                                    value={formData.openings}
                                    onChange={handleChange}
                                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-[#111111] font-black text-sm focus:border-[#F97316] outline-none transition-all"
                                    placeholder="1"
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] ml-6">Acquisition Deadline</label>
                                <input
                                    type="date"
                                    name="deadline"
                                    value={formData.deadline}
                                    onChange={handleChange}
                                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-[#111111] font-black text-sm focus:border-[#F97316] outline-none transition-all color-scheme-dark"
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] ml-6">Intellectual Baseline</label>
                                <select
                                    name="educationLevel"
                                    value={formData.educationLevel}
                                    onChange={handleChange}
                                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-[#111111] font-black text-sm focus:border-[#F97316] outline-none transition-all appearance-none"
                                >
                                    {['10th', '12th', 'ITI', 'Diploma', 'Graduation', 'Post Grad', 'PhD'].map(lvl => (
                                        <option key={lvl} value={lvl} className="bg-[#121224]">{lvl}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-3">
                                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] ml-6">Experience Threshold</label>
                                <select
                                    name="experienceLevel"
                                    value={formData.experienceLevel}
                                    onChange={handleChange}
                                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-[#111111] font-black text-sm focus:border-[#F97316] outline-none transition-all appearance-none"
                                >
                                    {['0-2 Years', '2-5 Years', '5-10 Years', '10+ Years'].map(lvl => (
                                        <option key={lvl} value={lvl} className="bg-[#121224]">{lvl}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] ml-6">Strategic Parameters (Description)</label>
                            <div className="bg-gray-50 border border-gray-100 rounded-3xl overflow-hidden focus-within:border-[#F97316] transition-all quill-dark">
                                <ReactQuill 
                                    theme="snow" 
                                    value={formData.description} 
                                    onChange={(val) => setFormData({ ...formData, description: val })} 
                                    placeholder="Outline the vision, responsibilities, and corporate culture..." 
                                    className="h-64"
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] ml-6">Core Competencies (Comma separated)</label>
                            <input
                                type="text"
                                name="requirements"
                                value={formData.requirements}
                                onChange={handleChange}
                                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-8 py-5 text-[#111111] font-black text-sm focus:border-[#F97316] outline-none transition-all placeholder-white/5"
                                placeholder="Strategic Vision, Team Leadership, 10+ Years"
                            />
                            <p className="text-[10px] text-[#111111]/10 font-bold italic ml-6 uppercase tracking-widest mt-3">Synthesize skills into distinct comma-separated strings</p>
                        </div>

                        <div className="pt-12 border-t border-gray-100 flex justify-end items-center gap-8">
                            <button
                                type="button"
                                onClick={() => navigate('/dashboard')}
                                className="text-gray-300 font-black text-[10px] uppercase tracking-[0.4em] hover:text-[#111111] transition-colors"
                            >
                                Abort Deployment
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-primary px-12 py-4 text-[10px] font-black uppercase tracking-[0.3em] shadow-[0_20px_40px_rgba(249,115,22,0.2)]"
                            >
                                {loading ? 'Synchronizing...' : 'Authorize Placement'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default PostJob;
