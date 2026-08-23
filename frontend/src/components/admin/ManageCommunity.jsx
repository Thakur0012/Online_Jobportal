import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Trash2, MessageSquare, Heart, Clock, 
    Filter, Search, User, Shield, AlertCircle, 
    Loader2, CheckCircle2, Eye, ExternalLink
} from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../lib/axios';

const ManageCommunity = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilter, setActiveFilter] = useState('All');

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const res = await api.get('/community/posts');
            setPosts(res.data);
        } catch (err) {
            console.error("Failed to fetch posts", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const handleDelete = async (postId) => {
        if (window.confirm("Are you sure you want to permanently delete this post and all its comments?")) {
            try {
                await api.delete(`/community/posts/${postId}`);
                setPosts(posts.filter(p => p._id !== postId));
            } catch (err) {
                alert("Failed to delete post");
            }
        }
    };

    const filteredPosts = posts.filter(post => {
        const matchesSearch = post.content.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             post.user?.name?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = activeFilter === 'All' || post.category === activeFilter;
        return matchesSearch && matchesFilter;
    });

    if (loading && posts.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="w-10 h-10 text-[#F47920] animate-spin mb-4" />
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Loading Community Data...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 max-w-6xl">
            {/* Header / Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Total Discussions', value: posts.length, icon: <MessageSquare />, color: 'orange' },
                    { label: 'Engagement Likes', value: posts.reduce((acc, p) => acc + p.likes.length, 0), icon: <Heart />, color: 'rose' },
                    { label: 'Anonymous Posts', value: posts.filter(p => p.isAnonymous).length, icon: <Shield />, color: 'blue' },
                ].map((stat, idx) => (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        key={idx} 
                        className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm"
                    >
                        <div className={`w-12 h-12 rounded-2xl bg-${stat.color}-50 text-${stat.color}-600 flex items-center justify-center mb-6`}>
                            {stat.icon}
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{stat.label}</p>
                        <h4 className="text-3xl font-black text-slate-900">{stat.value}</h4>
                    </motion.div>
                ))}
            </div>

            {/* Controls */}
            <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search posts or users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-6 py-4 font-bold text-sm text-slate-900 focus:bg-white focus:border-orange-400 outline-none transition-all"
                    />
                </div>
                <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto">
                    {['All', 'General', 'Career Advice', 'Job Help', 'Finance Tips'].map(filter => (
                        <button
                            key={filter}
                            onClick={() => setActiveFilter(filter)}
                            className={`px-5 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all whitespace-nowrap ${
                                activeFilter === filter 
                                ? 'bg-slate-900 text-white shadow-lg' 
                                : 'bg-slate-50 text-slate-400 hover:bg-slate-100'
                            }`}
                        >
                            {filter}
                        </button>
                    ))}
                </div>
            </div>

            {/* Posts Table */}
            <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-slate-50">
                                <th className="p-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Discussion / Preview</th>
                                <th className="p-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Author / Identity</th>
                                <th className="p-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Metrics</th>
                                <th className="p-8 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredPosts.map((post) => (
                                <tr key={post._id} className="group hover:bg-slate-50/50 transition-colors">
                                    <td className="p-8 max-w-md">
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <span className="px-2 py-0.5 rounded bg-orange-50 text-orange-600 text-[8px] font-black uppercase tracking-widest border border-orange-100">
                                                    {post.category}
                                                </span>
                                                <span className="text-[10px] font-bold text-slate-300">#{post._id.slice(-6)}</span>
                                            </div>
                                            <p className="text-sm font-bold text-slate-900 line-clamp-2 leading-relaxed italic">"{post.content}"</p>
                                            <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400 italic">
                                                <Clock size={12} /> {new Date(post.createdAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-8">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs ${post.isAnonymous ? 'bg-slate-100 text-slate-400' : 'bg-indigo-50 text-indigo-600'}`}>
                                                {post.isAnonymous ? '?' : post.user?.name?.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-slate-900 flex items-center gap-2 italic">
                                                    {post.user?.name || 'Unknown User'}
                                                    {post.isAnonymous && <span className="text-[8px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-400 uppercase">Anon</span>}
                                                </p>
                                                <p className="text-[10px] font-bold text-slate-400 italic">{post.user?.role || 'Member'}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-8">
                                        <div className="flex items-center gap-6">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Likes</span>
                                                <span className="text-sm font-black text-slate-900">{post.likes.length}</span>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Comments</span>
                                                <span className="text-sm font-black text-slate-900">{post.commentsCount}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-8 text-right">
                                        <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Link 
                                                to="/community" 
                                                className="w-10 h-10 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:bg-orange-500 hover:text-white transition-all shadow-sm active:scale-95"
                                            >
                                                <Eye size={16} />
                                            </Link>
                                            <button 
                                                onClick={() => handleDelete(post._id)}
                                                className="w-10 h-10 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-300 hover:bg-rose-500 hover:text-white transition-all shadow-sm active:scale-95"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredPosts.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="py-20 text-center">
                                        <AlertCircle size={48} className="mx-auto text-slate-100 mb-6" />
                                        <p className="text-slate-300 font-bold italic">No discussions found matching your search.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ManageCommunity;
