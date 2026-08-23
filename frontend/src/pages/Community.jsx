import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    MessageSquare, Heart, Share2, Send,
    Plus, Clock, ChevronRight,
    Loader2, Sparkles, TrendingUp,
    Shield, CheckCircle2, X, Users, Zap
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import api from '../lib/axios';
import { Link } from 'react-router-dom';
import SeoHead from '../components/SeoHead';

const CATEGORIES = ['All', 'General', 'Career Advice', 'Job Help', 'Finance Tips', 'Market Trends'];

const Community = () => {
    const { user, isAuthenticated } = useAuthStore();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState('All');
    const [showCreateModal, setShowCreateModal] = useState(false);

    const [newPostContent, setNewPostContent] = useState('');
    const [newPostCategory, setNewPostCategory] = useState('General');
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [communityStats, setCommunityStats] = useState({ totalPosts: null, totalMembers: null });

    // Fetch real stats: total posts + unique members
    useEffect(() => {
        api.get('/community/posts')
            .then(res => {
                const allPosts = res.data || [];
                const uniqueUsers = new Set(allPosts.map(p => p.user?._id).filter(Boolean));
                setCommunityStats({
                    totalPosts: allPosts.length,
                    totalMembers: uniqueUsers.size,
                });
            })
            .catch(() => {});
    }, []);

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/community/posts?category=${activeCategory}`);
            setPosts(res.data);
        } catch (error) {
            console.error('Failed to fetch posts', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchPosts(); }, [activeCategory]);

    const handleCreatePost = async (e) => {
        e.preventDefault();
        if (!newPostContent.trim()) return;
        setSubmitting(true);
        try {
            const res = await api.post('/community/posts', {
                content: newPostContent,
                category: newPostCategory,
                isAnonymous,
            });
            setPosts([res.data, ...posts]);
            setNewPostContent('');
            setShowCreateModal(false);
        } catch {
            alert('Failed to create post. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const toggleLike = async (postId) => {
        if (!isAuthenticated) return alert('Please login to like posts');
        try {
            const res = await api.post(`/community/posts/${postId}/like`);
            setPosts(posts.map(post => post._id === postId ? { ...post, likes: res.data } : post));
        } catch (error) {
            console.error('Like failed', error);
        }
    };

    return (
        <div className="min-h-screen text-[#0A0A0A] selection:bg-[#F97316] selection:text-white"
            style={{ background: '#F8F9FA', fontFamily: 'Plus Jakarta Sans, Inter, sans-serif' }}>
            <SeoHead
                title="Finance Community — Share Insights & Career Advice"
                description="Join India's most active finance professional community. Discuss career advice, market trends, banking, GST, taxation and more with verified finance experts."
                canonical="https://www.ledgerbandhu.com/community"
            />

            {/* ── HERO ─────────────────────────────────────────────────── */}
            <div className="relative overflow-hidden pt-16 pb-20"
                style={{ background: 'linear-gradient(135deg, #0a0a0f 0%, #111118 50%, #0f0f1a 100%)' }}>

                {/* Orbs */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div style={{ position: 'absolute', top: '-20%', right: '-5%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(249,115,22,0.18) 0%, transparent 65%)', filter: 'blur(60px)' }} />
                    <div style={{ position: 'absolute', bottom: '-10%', left: '5%', width: '350px', height: '350px', background: 'radial-gradient(circle, rgba(234,88,12,0.12) 0%, transparent 65%)', filter: 'blur(50px)' }} />
                </div>
                <div className="absolute inset-0 opacity-[0.04]"
                    style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)', backgroundSize: '48px 48px' }} />

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                        <div>
                            {/* Badge */}
                            <motion.div
                                initial={{ opacity: 0, y: -12 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                className="inline-flex items-center gap-2 mb-6"
                            >
                                <span className="flex items-center gap-2 text-[11px] font-black tracking-[0.18em] uppercase px-4 py-2 rounded-full"
                                    style={{ background: 'rgba(249,115,22,0.12)', border: '1px solid rgba(249,115,22,0.3)', color: '#FB923C' }}>
                                    <motion.span animate={{ scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }} transition={{ duration: 2, repeat: Infinity }}
                                        className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                                    Professional Network
                                </span>
                            </motion.div>

                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.1 }}
                                className="text-4xl sm:text-5xl md:text-6xl font-black leading-[1.05] tracking-[-0.04em] mb-4"
                                style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
                            >
                                <span className="text-white">LedgerBandhu</span>
                                <br />
                                <span style={{
                                    background: 'linear-gradient(135deg, #FB923C 0%, #F97316 50%, #EA580C 100%)',
                                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                                }}>Community</span>
                            </motion.h1>
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.25 }}
                                className="text-base font-medium max-w-lg leading-relaxed"
                                style={{ color: 'rgba(255,255,255,0.45)' }}
                            >
                                Connect with financial experts, share career insights, and grow your network in a premium professional space.
                            </motion.p>
                        </div>

                        {/* Stats + CTA */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="flex flex-col gap-4 shrink-0"
                        >
                            <div className="flex gap-3">
                                {[
                                    { icon: Users, val: communityStats.totalMembers !== null ? `${communityStats.totalMembers}+` : '—', label: 'Members' },
                                    { icon: TrendingUp, val: communityStats.totalPosts !== null ? `${communityStats.totalPosts}+` : '—', label: 'Posts' }
                                ].map(({ icon: Icon, val, label }) => (
                                    <div key={label} className="flex items-center gap-2.5 px-4 py-3 rounded-xl"
                                        style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
                                        <Icon size={14} style={{ color: '#F97316' }} />
                                        <div>
                                            <p className="text-sm font-black text-white leading-none">{val}</p>
                                            <p className="text-[9px] font-bold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.35)' }}>{label}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {isAuthenticated && (
                                <motion.button
                                    whileHover={{ scale: 1.03, y: -2 }}
                                    whileTap={{ scale: 0.97 }}
                                    onClick={() => setShowCreateModal(true)}
                                    className="flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-bold text-sm text-white"
                                    style={{
                                        background: 'linear-gradient(135deg, #FB923C, #F97316, #EA580C)',
                                        boxShadow: '0 8px 24px rgba(249,115,22,0.4)',
                                    }}
                                >
                                    <Plus size={16} />
                                    Share an Insight
                                </motion.button>
                            )}
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* ── MAIN CONTENT ─────────────────────────────────────────── */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                    {/* Left Sidebar */}
                    <div className="lg:col-span-3 space-y-4">
                        {/* Category filter */}
                        <div className="rounded-2xl overflow-hidden sticky top-24"
                            style={{ background: 'white', border: '1px solid rgba(0,0,0,0.07)', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                            <div className="px-5 py-4" style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                                <span className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2"
                                    style={{ color: '#9CA3AF' }}>
                                    <Sparkles size={11} style={{ color: '#F97316' }} />
                                    Categories
                                </span>
                            </div>
                            <div className="p-3 space-y-1">
                                {CATEGORIES.map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => setActiveCategory(cat)}
                                        className="w-full text-left px-4 py-2.5 rounded-xl font-semibold text-sm transition-all flex items-center justify-between group"
                                        style={{
                                            background: activeCategory === cat ? 'linear-gradient(135deg, #FFF7ED, #FFEDD5)' : 'transparent',
                                            color: activeCategory === cat ? '#F97316' : '#374151',
                                            border: activeCategory === cat ? '1px solid rgba(249,115,22,0.2)' : '1px solid transparent',
                                        }}
                                    >
                                        <span>{cat}</span>
                                        <ChevronRight size={13} className={`transition-all duration-200 ${activeCategory === cat ? 'opacity-100' : 'opacity-0 group-hover:opacity-40'}`} />
                                    </button>
                                ))}
                            </div>

                            {/* Community growth widget */}
                            <div className="m-3 p-4 rounded-xl" style={{ background: 'linear-gradient(135deg, #FFF7ED, #FFEDD5)', border: '1px solid rgba(249,115,22,0.15)' }}>
                                <TrendingUp size={16} style={{ color: '#F97316' }} className="mb-2" />
                                <h4 className="font-black text-xs tracking-tight mb-1" style={{ color: '#111111' }}>Community Growth</h4>
                                <p className="text-[10px] font-medium" style={{ color: '#9CA3AF' }}>Growing daily with verified pros.</p>
                            </div>
                        </div>
                    </div>

                    {/* Middle Feed */}
                    <div className="lg:col-span-6 space-y-4">
                        {/* Category pills (mobile-friendly horizontal scroll) */}
                        <div className="flex gap-2 overflow-x-auto pb-1 lg:hidden">
                            {CATEGORIES.map(cat => (
                                <button key={cat} onClick={() => setActiveCategory(cat)}
                                    className="whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold transition-all"
                                    style={{
                                        background: activeCategory === cat ? '#F97316' : 'white',
                                        color: activeCategory === cat ? 'white' : '#6B7280',
                                        border: activeCategory === cat ? 'none' : '1px solid rgba(0,0,0,0.08)',
                                        flexShrink: 0,
                                    }}>
                                    {cat}
                                </button>
                            ))}
                        </div>

                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-24 rounded-2xl"
                                style={{ background: 'white', border: '1px solid rgba(0,0,0,0.07)' }}>
                                <Loader2 className="w-8 h-8 animate-spin mb-3" style={{ color: '#F97316' }} />
                                <p className="text-[10px] font-black uppercase tracking-[0.25em]" style={{ color: '#9CA3AF' }}>Loading insights...</p>
                            </div>
                        ) : posts.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-24 rounded-2xl text-center"
                                style={{ background: 'white', border: '1px solid rgba(0,0,0,0.07)' }}>
                                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
                                    style={{ background: 'linear-gradient(135deg, #FFF7ED, #FFEDD5)' }}>
                                    <MessageSquare size={28} style={{ color: '#F97316' }} />
                                </div>
                                <h3 className="text-lg font-black mb-1" style={{ color: '#111111' }}>No discussions yet</h3>
                                <p className="text-sm font-medium" style={{ color: '#9CA3AF' }}>Be the first to start the conversation!</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {posts.map((post, idx) => (
                                    <PostCard
                                        key={post._id}
                                        post={post}
                                        onLike={() => toggleLike(post._id)}
                                        delay={idx * 0.06}
                                        currentUserId={user?._id}
                                        isAuthenticated={isAuthenticated}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right Sidebar */}
                    <div className="lg:col-span-3 space-y-4">
                        {/* Guidelines */}
                        <div className="rounded-2xl overflow-hidden"
                            style={{ background: 'white', border: '1px solid rgba(0,0,0,0.07)', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                            <div className="px-5 py-4" style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                                <span className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2" style={{ color: '#9CA3AF' }}>
                                    <Shield size={11} style={{ color: '#F97316' }} />
                                    Guidelines
                                </span>
                            </div>
                            <div className="p-5 space-y-3.5">
                                {[
                                    'Respect professional boundaries',
                                    'No spam or advertisements',
                                    'Verified insights only',
                                    'Keep it finance/career focused',
                                ].map((rule, idx) => (
                                    <div key={idx} className="flex items-start gap-3">
                                        <CheckCircle2 size={14} style={{ color: '#22C55E', flexShrink: 0, marginTop: '2px' }} />
                                        <p className="text-xs font-semibold leading-relaxed" style={{ color: '#374151' }}>{rule}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Post a Job CTA */}
                        <div className="rounded-2xl overflow-hidden relative"
                            style={{ background: 'linear-gradient(145deg, #111118 0%, #1a1a26 100%)', border: '1px solid rgba(249,115,22,0.15)', boxShadow: '0 16px 40px rgba(0,0,0,0.2)' }}>
                            <div className="absolute inset-0 pointer-events-none"
                                style={{ background: 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(249,115,22,0.18) 0%, transparent 60%)' }} />
                            <div className="relative p-6">
                                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                                    style={{ background: 'linear-gradient(135deg, rgba(249,115,22,0.2), rgba(234,88,12,0.1))', border: '1px solid rgba(249,115,22,0.3)' }}>
                                    <Zap size={18} style={{ color: '#F97316' }} />
                                </div>
                                <h3 className="text-lg font-black mb-2 text-white leading-tight">Need Expertise?</h3>
                                <p className="text-xs font-medium mb-5 leading-relaxed" style={{ color: 'rgba(255,255,255,0.4)' }}>
                                    Post a job and reach thousands of verified finance candidates.
                                </p>
                                <Link to="/post-job"
                                    className="flex items-center gap-2 text-xs font-bold px-4 py-2.5 rounded-xl w-fit transition-all"
                                    style={{
                                        background: 'linear-gradient(135deg, #FB923C, #F97316)',
                                        color: 'white',
                                        boxShadow: '0 4px 14px rgba(249,115,22,0.35)',
                                    }}>
                                    Post a Job <ChevronRight size={13} />
                                </Link>
                            </div>
                        </div>

                        {/* Mobile share button */}
                        {isAuthenticated && (
                            <button
                                onClick={() => setShowCreateModal(true)}
                                className="lg:hidden w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm text-white"
                                style={{ background: 'linear-gradient(135deg, #FB923C, #F97316)', boxShadow: '0 6px 20px rgba(249,115,22,0.35)' }}>
                                <Plus size={16} />
                                Share an Insight
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* ── CREATE POST MODAL ─────────────────────────────────────── */}
            <AnimatePresence>
                {showCreateModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowCreateModal(false)}
                            className="absolute inset-0"
                            style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.93, y: 24 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.93, y: 24 }}
                            transition={{ type: 'spring', damping: 22, stiffness: 280 }}
                            className="relative z-10 w-full max-w-2xl rounded-2xl overflow-hidden"
                            style={{ background: 'white', border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 32px 80px rgba(0,0,0,0.25)' }}
                        >
                            {/* Modal header */}
                            <div className="flex items-center justify-between px-8 py-5"
                                style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                                <div>
                                    <h2 className="text-xl font-black" style={{ color: '#111111', letterSpacing: '-0.025em' }}>
                                        Share an <span style={{
                                            background: 'linear-gradient(135deg, #FB923C, #F97316)',
                                            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                                        }}>Insight</span>
                                    </h2>
                                    <p className="text-[10px] font-black uppercase tracking-widest mt-0.5" style={{ color: '#9CA3AF' }}>Join the professional discussion</p>
                                </div>
                                <button
                                    onClick={() => setShowCreateModal(false)}
                                    className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
                                    style={{ background: '#F3F4F6' }}
                                    onMouseEnter={e => e.currentTarget.style.background = '#E5E7EB'}
                                    onMouseLeave={e => e.currentTarget.style.background = '#F3F4F6'}
                                >
                                    <X size={16} style={{ color: '#6B7280' }} />
                                </button>
                            </div>

                            <form onSubmit={handleCreatePost} className="p-8 space-y-5">
                                {/* Textarea */}
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest mb-2 block" style={{ color: '#9CA3AF' }}>
                                        What's on your mind?
                                    </label>
                                    <textarea
                                        required
                                        value={newPostContent}
                                        onChange={(e) => setNewPostContent(e.target.value)}
                                        placeholder="Discuss career trends, ask for advice, or share your thoughts..."
                                        rows={5}
                                        className="w-full rounded-xl px-5 py-4 text-sm font-medium focus:outline-none resize-none transition-all"
                                        style={{
                                            background: '#F9FAFB',
                                            border: '1.5px solid rgba(0,0,0,0.09)',
                                            color: '#111111',
                                        }}
                                        onFocus={e => e.currentTarget.style.border = '1.5px solid rgba(249,115,22,0.4)'}
                                        onBlur={e => e.currentTarget.style.border = '1.5px solid rgba(0,0,0,0.09)'}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Topic selector */}
                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-widest mb-2 block" style={{ color: '#9CA3AF' }}>
                                            Topic
                                        </label>
                                        <select
                                            value={newPostCategory}
                                            onChange={(e) => setNewPostCategory(e.target.value)}
                                            className="w-full rounded-xl px-5 py-3.5 text-xs font-bold focus:outline-none appearance-none cursor-pointer transition-all"
                                            style={{
                                                background: '#F9FAFB',
                                                border: '1.5px solid rgba(0,0,0,0.09)',
                                                color: '#F97316',
                                            }}
                                        >
                                            {CATEGORIES.filter(c => c !== 'All').map(c => (
                                                <option key={c} value={c}>{c}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Anonymous toggle */}
                                    <div className="flex items-center justify-between px-5 py-3.5 rounded-xl"
                                        style={{ background: '#F9FAFB', border: '1.5px solid rgba(0,0,0,0.09)' }}>
                                        <div>
                                            <p className="text-xs font-bold" style={{ color: '#111111' }}>Post Anonymously</p>
                                            <p className="text-[9px] font-semibold" style={{ color: '#9CA3AF' }}>Maintain Privacy</p>
                                        </div>
                                        <button
                                            disabled
                                            type="button"
                                            onClick={() => setIsAnonymous(!isAnonymous)}
                                            className="w-11 h-6 rounded-full relative transition-all duration-300"
                                            style={{ background: isAnonymous ? '#F97316' : '#E5E7EB' }}
                                        >
                                            <div className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-300"
                                                style={{ left: isAnonymous ? '24px' : '4px' }} />
                                        </button>
                                    </div>
                                </div>

                                {/* Submit */}
                                <motion.button
                                    disabled={submitting || !newPostContent}
                                    type="submit"
                                    whileHover={!submitting && newPostContent ? { scale: 1.01, y: -1 } : {}}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full flex items-center justify-center gap-2.5 py-4 rounded-xl font-bold text-sm text-white transition-all disabled:opacity-50"
                                    style={{
                                        background: 'linear-gradient(135deg, #FB923C, #F97316, #EA580C)',
                                        boxShadow: '0 6px 20px rgba(249,115,22,0.35)',
                                    }}
                                >
                                    {submitting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                                    {submitting ? 'Publishing...' : 'Publish Insight'}
                                </motion.button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

// ─── Post Card ──────────────────────────────────────────────────────────────────
const PostCard = ({ post, onLike, delay, currentUserId, isAuthenticated }) => {
    const isLiked = post.likes.includes(currentUserId);
    const initials = post.isAnonymous ? '?' : post.user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';

    const [showComments, setShowComments] = useState(false);
    const [comments, setComments] = useState([]);
    const [loadingComments, setLoadingComments] = useState(false);
    const [newComment, setNewComment] = useState('');
    const [postingComment, setPostingComment] = useState(false);

    const fetchComments = async () => {
        setLoadingComments(true);
        try {
            const res = await api.get(`/community/posts/${post._id}/comments`);
            setComments(res.data);
        } catch (error) {
            console.error('Failed to fetch comments', error);
        } finally {
            setLoadingComments(false);
        }
    };

    const handleComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;
        setPostingComment(true);
        try {
            const res = await api.post(`/community/posts/${post._id}/comments`, { content: newComment });
            setComments([...comments, res.data]);
            setNewComment('');
        } catch {
            alert('Failed to post comment');
        } finally {
            setPostingComment(false);
        }
    };

    useEffect(() => { if (showComments) fetchComments(); }, [showComments]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay, duration: 0.4 }}
            whileHover={{ y: -3, transition: { duration: 0.18 } }}
            className="group relative overflow-hidden"
            style={{
                background: 'white',
                border: '1px solid rgba(0,0,0,0.07)',
                borderRadius: '18px',
                boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                transition: 'all 0.22s cubic-bezier(0.4,0,0.2,1)',
            }}
            onMouseEnter={e => {
                e.currentTarget.style.border = '1px solid rgba(249,115,22,0.2)';
                e.currentTarget.style.boxShadow = '0 12px 40px rgba(249,115,22,0.1), 0 4px 16px rgba(0,0,0,0.06)';
            }}
            onMouseLeave={e => {
                e.currentTarget.style.border = '1px solid rgba(0,0,0,0.07)';
                e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.04)';
            }}
        >
            {/* Top accent bar on hover */}
            <div className="h-[3px] w-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: 'linear-gradient(90deg, #FB923C, #F97316, #EA580C)' }} />

            <div className="p-6">
                {/* Post Header */}
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                        {/* Avatar */}
                        <div className="w-11 h-11 rounded-xl flex items-center justify-center text-sm font-black text-white shrink-0"
                            style={{ background: 'linear-gradient(135deg, #111118, #1a1a26)' }}>
                            {initials}
                        </div>
                        <div>
                            <h4 className="font-black text-sm flex items-center gap-1.5" style={{ color: '#111111', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                                {post.isAnonymous ? 'Anonymous Member' : post.user?.name}
                                {!post.isAnonymous && post.user?.role === 'admin' && (
                                    <CheckCircle2 size={13} style={{ color: '#F97316' }} />
                                )}
                            </h4>
                            <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                                    style={{ background: 'rgba(249,115,22,0.08)', color: '#F97316' }}>
                                    {post.category}
                                </span>
                                <span className="text-[10px] font-semibold flex items-center gap-1" style={{ color: '#9CA3AF' }}>
                                    <Clock size={9} />
                                    {new Date(post.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    </div>
                    {/* Post ID badge */}
                    <span className="text-[9px] font-bold px-2.5 py-1 rounded-lg" style={{ background: '#F3F4F6', color: '#9CA3AF' }}>
                        #{post._id.slice(-4)}
                    </span>
                </div>

                {/* Content */}
                <p className="text-sm font-medium leading-[1.75] whitespace-pre-wrap mb-5" style={{ color: '#374151' }}>
                    {post.content}
                </p>

                {/* Action bar */}
                <div className="flex items-center justify-between pt-4"
                    style={{ borderTop: '1px solid rgba(0,0,0,0.06)' }}>
                    <div className="flex items-center gap-5">
                        <button
                            onClick={onLike}
                            className="flex items-center gap-1.5 transition-all duration-200"
                            style={{ color: isLiked ? '#F43F5E' : '#9CA3AF' }}
                            onMouseEnter={e => { if (!isLiked) e.currentTarget.style.color = '#F43F5E'; }}
                            onMouseLeave={e => { if (!isLiked) e.currentTarget.style.color = '#9CA3AF'; }}
                        >
                            <motion.div whileTap={{ scale: 1.5 }}>
                                <Heart size={16} fill={isLiked ? 'currentColor' : 'none'} />
                            </motion.div>
                            <span className="text-xs font-bold">{post.likes.length}</span>
                        </button>

                        <button
                            onClick={() => setShowComments(!showComments)}
                            className="flex items-center gap-1.5 transition-all duration-200"
                            style={{ color: showComments ? '#F97316' : '#9CA3AF' }}
                            onMouseEnter={e => { if (!showComments) e.currentTarget.style.color = '#F97316'; }}
                            onMouseLeave={e => { if (!showComments) e.currentTarget.style.color = showComments ? '#F97316' : '#9CA3AF'; }}
                        >
                            <MessageSquare size={16} />
                            <span className="text-xs font-bold">{post.commentsCount}</span>
                        </button>
                    </div>

                    <button className="transition-all duration-200" style={{ color: '#9CA3AF' }}
                        onMouseEnter={e => e.currentTarget.style.color = '#111111'}
                        onMouseLeave={e => e.currentTarget.style.color = '#9CA3AF'}>
                        <Share2 size={16} />
                    </button>
                </div>

                {/* Comments Section */}
                <AnimatePresence>
                    {showComments && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                        >
                            <div className="mt-5 pt-5 space-y-4" style={{ borderTop: '1px solid rgba(0,0,0,0.06)' }}>
                                {loadingComments ? (
                                    <div className="flex items-center gap-2.5 py-2" style={{ color: '#9CA3AF' }}>
                                        <Loader2 size={13} className="animate-spin" />
                                        <span className="text-[10px] font-bold uppercase tracking-widest">Loading comments...</span>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {comments.map(comment => (
                                            <div key={comment._id} className="flex gap-3">
                                                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-black shrink-0"
                                                    style={{ background: '#F3F4F6', color: '#6B7280' }}>
                                                    {comment.user?.name?.charAt(0).toUpperCase()}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="text-xs font-bold" style={{ color: '#111111' }}>{comment.user?.name}</span>
                                                        <span className="text-[9px] font-semibold" style={{ color: '#9CA3AF' }}>
                                                            {new Date(comment.createdAt).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs font-medium leading-relaxed" style={{ color: '#6B7280' }}>{comment.content}</p>
                                                </div>
                                            </div>
                                        ))}

                                        {/* Add comment */}
                                        {isAuthenticated ? (
                                            <form onSubmit={handleComment} className="flex gap-2.5 items-center pt-2">
                                                <input
                                                    value={newComment}
                                                    onChange={(e) => setNewComment(e.target.value)}
                                                    placeholder="Write a response..."
                                                    className="flex-1 rounded-xl px-4 py-2.5 text-xs font-medium focus:outline-none transition-all"
                                                    style={{
                                                        background: '#F9FAFB',
                                                        border: '1.5px solid rgba(0,0,0,0.09)',
                                                        color: '#111111',
                                                    }}
                                                    onFocus={e => e.currentTarget.style.border = '1.5px solid rgba(249,115,22,0.35)'}
                                                    onBlur={e => e.currentTarget.style.border = '1.5px solid rgba(0,0,0,0.09)'}
                                                />
                                                <button
                                                    disabled={postingComment || !newComment.trim()}
                                                    type="submit"
                                                    className="w-9 h-9 rounded-xl flex items-center justify-center text-white transition-all disabled:opacity-50"
                                                    style={{ background: 'linear-gradient(135deg, #FB923C, #F97316)' }}>
                                                    {postingComment ? <Loader2 size={13} className="animate-spin" /> : <Send size={13} />}
                                                </button>
                                            </form>
                                        ) : (
                                            <div className="pt-3 text-center">
                                                <p className="text-xs font-medium" style={{ color: '#9CA3AF' }}>
                                                    Please <Link to="/login" className="font-bold" style={{ color: '#F97316' }}>login</Link> to join the discussion.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
};

export default Community;
