import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Plus, Trash2, Image as ImageIcon, FileText, 
    Upload, X, Check, AlertCircle, Loader2,
    Calendar, ExternalLink, Download
} from 'lucide-react';
import api from '../../lib/axios';

const ManageNewsletters = () => {
    const [newsletters, setNewsletters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    
    // Form State
    const [title, setTitle] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [pdfFile, setPdfFile] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    const fetchNewsletters = async () => {
        setLoading(true);
        try {
            const res = await api.get('/newsletters');
            setNewsletters(res.data);
        } catch (err) {
            console.error("Failed to fetch newsletters", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNewsletters();
    }, []);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handlePdfChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPdfFile(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!imageFile || !pdfFile) {
            setError('Please select both a cover image and a PDF file.');
            return;
        }

        setSubmitting(true);
        setError('');

        const formData = new FormData();
        formData.append('title', title);
        formData.append('image', imageFile);
        formData.append('pdf', pdfFile);

        try {
            await api.post('/newsletters', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setIsAddModalOpen(false);
            setTitle('');
            setImageFile(null);
            setImagePreview(null);
            setPdfFile(null);
            fetchNewsletters();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to publish newsletter');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this newsletter?')) {
            try {
                await api.delete(`/newsletters/${id}`);
                fetchNewsletters();
            } catch (err) {
                alert('Failed to delete newsletter');
            }
        }
    };

    if (loading && newsletters.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="w-10 h-10 text-[#F47920] animate-spin mb-4" />
                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Loading Newsletters...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header Action */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h3 className="text-2xl font-black text-[#111D45] tracking-tight">Job PDF Management</h3>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Directly upload your weekly PDF brochures</p>
                </div>
                <button 
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center gap-2 text-white px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 hover:opacity-90 shadow-lg"
                    style={{ background: 'linear-gradient(135deg, #F47920, #D4641A)', boxShadow: '0 8px 20px rgba(244,121,32,0.3)' }}
                >
                    <Plus size={18} /> Add New Job PDF
                </button>
            </div>

            {/* Newsletter Grid */}
            {newsletters.length === 0 ? (
                <div className="bg-white rounded-[2rem] p-20 text-center border border-slate-100 shadow-sm">
                    <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-slate-200">
                        <FileText size={40} />
                    </div>
                    <h4 className="text-xl font-black text-[#111D45] mb-2">No newsletters uploaded yet</h4>
                    <p className="text-slate-400 font-medium">Click the button above to add your first newsletter edition.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {newsletters.map((nl) => (
                        <motion.div 
                            layout
                            key={nl._id}
                            className="bg-white rounded-[2rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 group"
                        >
                            <div className="h-48 relative overflow-hidden">
                                <img src={nl.image.startsWith('http') ? nl.image : `${api.defaults.baseURL.replace('/api', '')}${nl.image}`} alt={nl.title} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                                <div className="absolute top-4 right-4 flex gap-2">
                                    <button 
                                        onClick={() => handleDelete(nl._id)}
                                        className="w-10 h-10 rounded-xl bg-white/90 backdrop-blur-sm text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-sm"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                                <div className="absolute bottom-4 left-4">
                                    <span className="bg-[#111D45]/80 backdrop-blur-md text-white text-[10px] font-black px-3 py-1.5 rounded-lg uppercase tracking-widest border border-white/10">
                                        {new Date(nl.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                            <div className="p-6">
                                <h4 className="font-black text-[#111D45] mb-4 line-clamp-2">{nl.title}</h4>
                                <div className="flex items-center gap-3">
                                    <a 
                                        href={nl.pdfUrl.startsWith('http') ? nl.pdfUrl : `${api.defaults.baseURL.replace('/api', '')}${nl.pdfUrl}`} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="flex-1 flex items-center justify-center gap-2 bg-[#1B2E6B]/5 text-[#1B2E6B] py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-[#1B2E6B] hover:text-white transition-all"
                                    >
                                        <ExternalLink size={14} /> View PDF
                                    </a>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Add Modal */}
            <AnimatePresence>
                {isAddModalOpen && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsAddModalOpen(false)}
                            className="absolute inset-0 bg-[#111D45]/60 backdrop-blur-sm"
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-white w-full max-w-lg rounded-[2.5rem] p-10 relative z-10 shadow-2xl overflow-y-auto max-h-[90vh]"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#F47920] opacity-[0.03] rounded-full -translate-y-1/2 translate-x-1/2" />
                            
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-2xl font-black text-[#111D45]">Publish Job PDF</h3>
                                <button onClick={() => setIsAddModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                                    <X size={20} className="text-slate-400" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 block mb-2">Newsletter Title</label>
                                    <div className="relative">
                                        <FileText className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                        <input 
                                            required
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            placeholder="e.g. March 2024 Edition"
                                            className="w-full bg-slate-50 border-2 border-transparent focus:border-[#F47920] rounded-2xl pl-12 pr-6 py-4 font-bold text-slate-700 outline-none transition-all"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 block mb-2">Cover Image Upload</label>
                                    <div className="space-y-4">
                                        {imagePreview && (
                                            <div className="w-full h-32 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
                                                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                            </div>
                                        )}
                                        <label className="flex items-center gap-3 p-4 bg-slate-50 hover:bg-slate-100 border-2 border-dashed border-slate-200 rounded-2xl cursor-pointer transition-all">
                                            <ImageIcon className="text-slate-400" size={20} />
                                            <span className="text-sm font-bold text-slate-500">{imageFile ? imageFile.name : 'Choose cover image...'}</span>
                                            <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                                        </label>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 block mb-2">PDF Document Upload</label>
                                    <label className="flex items-center gap-3 p-4 bg-slate-50 hover:bg-slate-100 border-2 border-dashed border-slate-200 rounded-2xl cursor-pointer transition-all">
                                        <Upload className="text-slate-400" size={20} />
                                        <span className="text-sm font-bold text-slate-500">{pdfFile ? pdfFile.name : 'Choose PDF file...'}</span>
                                        <input type="file" accept="application/pdf" className="hidden" onChange={handlePdfChange} />
                                    </label>
                                </div>

                                {error && (
                                    <div className="bg-red-50 border border-red-100 p-4 rounded-2xl flex items-center gap-3 text-red-600">
                                        <AlertCircle size={18} />
                                        <p className="text-xs font-bold">{error}</p>
                                    </div>
                                )}

                                <button 
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs transition-all active:scale-95 disabled:opacity-50 mt-4 shadow-xl shadow-orange-500/20 flex items-center justify-center gap-3"
                                    style={{ background: 'linear-gradient(135deg, #F47920, #D4641A)' }}
                                >
                                    {submitting ? (
                                        <>
                                            <Loader2 size={18} className="animate-spin" />
                                            Uploading & Publishing...
                                        </>
                                    ) : (
                                        'Publish Job PDF'
                                    )}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ManageNewsletters;
