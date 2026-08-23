import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Mail, Loader2, Search, Calendar, User as UserIcon } from 'lucide-react';
import api from '../../lib/axios';

const ManageSubscribers = () => {
    const [subscribers, setSubscribers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchSubscribers = async () => {
        setLoading(true);
        try {
            const res = await api.get('/subscribers');
            setSubscribers(res.data);
        } catch (err) {
            console.error("Failed to fetch subscribers", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSubscribers();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to remove this subscriber?')) {
            try {
                await api.delete(`/subscribers/${id}`);
                setSubscribers(subscribers.filter(s => s._id !== id));
            } catch (err) {
                alert('Failed to remove subscriber');
            }
        }
    };

    const filteredSubscribers = subscribers.filter(s => 
        s.email.toLowerCase().includes(searchTerm.toLowerCase()) || 
        (s.user?.name && s.user.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (loading && subscribers.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="w-10 h-10 text-[#F47920] animate-spin mb-4" />
                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Loading Subscribers...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header Action */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h3 className="text-2xl font-black text-[#111D45] tracking-tight">Email Subscribers</h3>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Manage users who joined the newsletter</p>
                </div>
                
                <div className="relative max-w-md w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                        type="text"
                        placeholder="Search by email or name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-2xl pl-12 pr-6 py-3.5 font-semibold text-slate-700 focus:border-[#F47920] outline-none transition-all shadow-sm"
                    />
                </div>
            </div>

            {/* Subscribers Table */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">User</th>
                                <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Subscription Email</th>
                                <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Joined Date</th>
                                <th className="px-8 py-6 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredSubscribers.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="px-8 py-20 text-center">
                                        <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-200">
                                            <Mail size={32} />
                                        </div>
                                        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No subscribers found</p>
                                    </td>
                                </tr>
                            ) : (
                                filteredSubscribers.map((sub) => (
                                    <tr key={sub._id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-8 py-5 border-b border-slate-50">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-black text-xs">
                                                    {sub.user?.name?.charAt(0).toUpperCase() || '?'}
                                                </div>
                                                <div>
                                                    <p className="font-black text-[#111D45] text-sm leading-none">{sub.user?.name || 'Guest User'}</p>
                                                    <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">ID: {sub.user?._id ? sub.user._id.slice(-6) : 'N/A'}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 border-b border-slate-50">
                                            <div className="flex items-center gap-2 text-slate-600 font-bold text-sm italic">
                                                <Mail size={14} className="text-[#F47920] opacity-50" />
                                                {sub.email}
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 border-b border-slate-50">
                                            <div className="flex items-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-tighter">
                                                <Calendar size={14} className="opacity-50" />
                                                {new Date(sub.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 border-b border-slate-50 text-right">
                                            <button 
                                                onClick={() => handleDelete(sub._id)}
                                                className="w-9 h-9 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all shadow-sm opacity-0 group-hover:opacity-100"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            
            <div className="flex justify-between items-center px-4">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Showing {filteredSubscribers.length} of {subscribers.length} subscribers
                </p>
                <div className="bg-white px-5 py-2 rounded-xl border border-slate-100 shadow-sm text-xs font-black text-[#111D45] italic">
                    💡 These emails are captured from the Footer and Gulf Jobs page
                </div>
            </div>
        </div>
    );
};

export default ManageSubscribers;
