import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Save, X, ChevronUp, ChevronDown, Layers } from 'lucide-react';
import api from '../../lib/axios';

const ManageFAQs = () => {
    const [faqs, setFaqs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        question: '',
        answer: '',
        category: 'General',
        order: 0,
        isActive: true
    });

    const categories = ['General', 'For Job Seekers', 'For Employers'];

    const fetchFAQs = async () => {
        setLoading(true);
        try {
            const res = await api.get('/faqs');
            setFaqs(res.data);
        } catch (error) {
            console.error("Error fetching FAQs:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFAQs();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await api.put(`/faqs/${editingId}`, formData);
            } else {
                await api.post('/faqs', formData);
            }
            setIsAdding(false);
            setEditingId(null);
            setFormData({ question: '', answer: '', category: 'General', order: 0, isActive: true });
            fetchFAQs();
        } catch (error) {
            alert(error.response?.data?.message || 'Action failed');
        }
    };

    const handleEdit = (faq) => {
        setEditingId(faq._id);
        setFormData({
            question: faq.question,
            answer: faq.answer,
            category: faq.category,
            order: faq.order,
            isActive: faq.isActive
        });
        setIsAdding(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this FAQ?')) {
            try {
                await api.delete(`/faqs/${id}`);
                fetchFAQs();
            } catch (error) {
                alert('Deletion failed');
            }
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
                <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Manage <span className="text-[#F47920]">FAQs</span></h2>
                    <p className="text-slate-500 font-medium text-sm mt-1">Add, edit, or remove frequently asked questions from the website.</p>
                </div>
                {!isAdding && (
                    <button
                        onClick={() => { setIsAdding(true); setEditingId(null); setFormData({ question: '', answer: '', category: 'General', order: 0, isActive: true }); }}
                        className="bg-[#F47920] hover:bg-[#D4641A] text-white px-6 py-3 rounded-2xl font-black text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#F4792015] active:scale-95"
                    >
                        <Plus size={18} /> Add New FAQ
                    </button>
                )}
            </div>

            {isAdding && (
                <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border-2 border-[#F4792010] animate-in slide-in-from-top-4 duration-300">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2 space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Question</label>
                                <input
                                    type="text"
                                    name="question"
                                    value={formData.question}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter the question..."
                                    className="w-full bg-slate-50 border-2 border-transparent focus:bg-white focus:border-[#F4792020] rounded-2xl px-6 py-4 text-slate-900 font-bold outline-none transition-all placeholder-slate-300"
                                />
                            </div>
                            <div className="md:col-span-2 space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Answer</label>
                                <textarea
                                    name="answer"
                                    value={formData.answer}
                                    onChange={handleChange}
                                    required
                                    rows={4}
                                    placeholder="Enter the answer..."
                                    className="w-full bg-slate-50 border-2 border-transparent focus:bg-white focus:border-[#F4792020] rounded-2xl px-6 py-4 text-slate-900 font-bold outline-none transition-all placeholder-slate-300"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Category</label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="w-full bg-slate-50 border-2 border-transparent focus:bg-white focus:border-[#F4792020] rounded-2xl px-6 py-4 text-slate-900 font-bold outline-none transition-all appearance-none cursor-pointer"
                                >
                                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Display Order</label>
                                <input
                                    type="number"
                                    name="order"
                                    value={formData.order}
                                    onChange={handleChange}
                                    className="w-full bg-slate-50 border-2 border-transparent focus:bg-white focus:border-[#F4792020] rounded-2xl px-6 py-4 text-slate-900 font-bold outline-none transition-all"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-4 pt-4">
                            <button
                                type="submit"
                                className="bg-[#1B2E6B] hover:bg-[#111D45] text-white px-8 py-4 rounded-2xl font-black transition-all flex items-center gap-2 shadow-lg shadow-[#1B2E6B]/10 active:scale-95"
                            >
                                <Save size={18} /> {editingId ? 'Update FAQ' : 'Save FAQ'}
                            </button>
                            <button
                                type="button"
                                onClick={() => { setIsAdding(false); setEditingId(null); }}
                                className="bg-slate-100 hover:bg-slate-200 text-slate-600 px-8 py-4 rounded-2xl font-black transition-all active:scale-95"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 gap-4">
                {loading ? (
                    <div className="py-20 text-center">
                        <div className="w-12 h-12 border-4 border-[#F4792020] border-t-[#F47920] rounded-full animate-spin mx-auto"></div>
                        <p className="mt-4 text-slate-400 font-bold text-sm uppercase tracking-widest italic">Loading FAQs...</p>
                    </div>
                ) : faqs.length > 0 ? (
                    faqs.map((faq) => (
                        <div key={faq._id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                            <div className="flex items-start justify-between gap-4">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <span className="bg-[#F4792010] text-[#F47920] text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                                            {faq.category}
                                        </span>
                                        <span className="text-slate-300 text-[10px] font-bold">Order: {faq.order}</span>
                                    </div>
                                    <h4 className="text-lg font-black text-slate-900 leading-tight">{faq.question}</h4>
                                    <p className="text-slate-500 font-medium text-sm line-clamp-2">{faq.answer}</p>
                                </div>
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                                    <button
                                        onClick={() => handleEdit(faq)}
                                        className="p-3 text-blue-500 hover:bg-blue-50 rounded-xl transition-all"
                                        title="Edit"
                                    >
                                        <Pencil size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(faq._id)}
                                        className="p-3 text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                                        title="Delete"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="bg-white py-20 text-center rounded-[3rem] border-2 border-dashed border-slate-100 mt-8">
                        <Layers size={48} className="mx-auto text-slate-100 mb-4" />
                        <h3 className="text-xl font-bold text-slate-400 font-black uppercase tracking-widest">No FAQs Found</h3>
                        <p className="text-slate-400">Add your first FAQ to help your users.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageFAQs;
