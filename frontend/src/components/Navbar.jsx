import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Briefcase, User, LogOut, Search, Menu, X, Bell, LayoutDashboard, FileText, ChevronRight, Building2, Zap, Mail, Sparkles, Newspaper, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../lib/axios';

const BASE_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

const NAV_LINKS = [
    { to: '/jobs', label: 'Jobs', icon: <Briefcase size={18} /> },
    { to: '/community', label: 'Community', icon: <MessageSquare size={18} /> },
    { to: '/resume-scorer', label: 'Resume Scorer', icon: <FileText size={18} />, isNew: true },
    { to: '/career-roadmap', label: 'Roadmap', icon: <Sparkles size={18} />, isNew: true },
    // { to: '/companies', label: 'Companies', icon: <Building2 size={18} /> },
    { to: '/daily-digest', label: 'Daily Digest', icon: <Newspaper size={18} /> },
];

const Navbar = () => {
    const { user, isAuthenticated, logout } = useAuthStore();
    const navigate = useNavigate();
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [brandingData, setBrandingData] = useState(() => {
        try {
            const cached = localStorage.getItem('ledgerbandhu_branding');
            return cached ? JSON.parse(cached) : null;
        } catch (e) { return null; }
    });
    const [loadingBranding, setLoadingBranding] = useState(!brandingData);
    const [navLinks, setNavLinks] = useState([]);

    // Notifications State
    const [notifications, setNotifications] = useState([]);
    const [isNotifOpen, setIsNotifOpen] = useState(false);
    const notifRef = useRef(null);

    const updateFavicon = (url) => {
        if (!url) return;
        const fullUrl = url.startsWith('http') ? url : `${BASE_URL}${url}`;

        // Update standard favicon
        let favicon = document.getElementById('dynamic-favicon');
        if (favicon) favicon.href = fullUrl;

        // Update site icon (apple-touch-icon)
        let siteIcon = document.getElementById('dynamic-siteicon');
        if (siteIcon) siteIcon.href = fullUrl;

        // Update shortcut icon
        let shortcutIcon = document.getElementById('dynamic-shortcut-icon');
        if (shortcutIcon) shortcutIcon.href = fullUrl;

        // Update Windows Tile image
        let tileIcon = document.getElementById('dynamic-tile-icon');
        if (tileIcon) tileIcon.content = fullUrl;
    };

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => setIsMenuOpen(false), [location]);

    // Lock body scroll when mobile menu open
    useEffect(() => {
        document.body.style.overflow = isMenuOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [isMenuOpen]);

    useEffect(() => {
        const fetchCMS = async () => {
            try {
                const [headerRes, brandingRes] = await Promise.all([
                    fetch(`${BASE_URL}/api/cms/page/header`).then(r => r.json()),
                    fetch(`${BASE_URL}/api/cms/branding`).then(r => r.json()),
                ]);
                if (headerRes?.content?.navLinks) setNavLinks(headerRes.content.navLinks);
                if (brandingRes) {
                    setBrandingData(brandingRes);
                    localStorage.setItem('ledgerbandhu_branding', JSON.stringify(brandingRes));
                    if (brandingRes.iconUrl) updateFavicon(brandingRes.iconUrl);
                }
            } catch (e) {
                console.error("Failed to fetch CMS", e);
            } finally {
                setLoadingBranding(false);
            }
        };
        fetchCMS();
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    // Notifications Fetching & Handling
    useEffect(() => {
        if (isAuthenticated) {
            api.get('/notifications')
                .then(res => { if (Array.isArray(res.data)) setNotifications(res.data); })
                .catch(e => console.error("Error fetching notifications", e));
        }
    }, [isAuthenticated]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (notifRef.current && !notifRef.current.contains(e.target)) setIsNotifOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleNotificationClick = async (notif) => {
        if (!notif.isRead) {
            try {
                await api.patch(`/notifications/${notif._id}/read`);
                setNotifications(prev => prev.map(n => n._id === notif._id ? { ...n, isRead: true } : n));
            } catch (error) { console.error('Failed to mark read', error); }
        }
        setIsNotifOpen(false);
        if (notif.link) navigate(notif.link);
    };

    const unreadCount = notifications.filter(n => !n.isRead).length;

    const isActive = (path) => location.pathname === path;

    return (
        <>
            <nav className={`sticky top-0 z-50 transition-all duration-300 ${scrolled
                ? 'navbar-glass shadow-md py-0'
                : 'bg-white border-b border-gray-100 py-1'
                }`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">

                        {/* Logo */}
                        <div className="flex items-center min-w-[140px]">
                            <Link to="/" className="flex items-center gap-2 group">
                                {loadingBranding && !brandingData ? (
                                    <div className="h-9 w-32 skeleton" />
                                ) : brandingData?.logoUrl ? (
                                    <img
                                        src={brandingData.logoUrl.startsWith('http') ? brandingData.logoUrl : `${BASE_URL}${brandingData.logoUrl}`}
                                        alt="LedgerBandhu"
                                        style={{ height: `${brandingData.logoHeight ? (brandingData.logoHeight > 96 ? 96 : brandingData.logoHeight) : 80}px`, width: 'auto' }}
                                        className="object-contain"
                                    />
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <div className="bg-[#F97316] p-2 rounded-xl shadow shadow-orange-200 group-hover:scale-105 transition-transform">
                                            <Briefcase className="h-5 w-5 text-white" />
                                        </div>
                                        <span className="text-xl font-extrabold text-[#0A0A0A] tracking-tight" style={{ fontFamily: 'Plus Jakarta Sans, Inter, sans-serif' }}>
                                            Ledger<span className="text-[#F97316]">Bandhu</span>
                                        </span>
                                    </div>
                                )}
                            </Link>
                        </div>

                        {/* Desktop Nav Links */}
                        <div className="hidden lg:flex items-center gap-0.5 ml-8">
                            {NAV_LINKS.map(({ to, label }) => (
                                <button
                                    key={to}
                                    onClick={() => navigate(to)}
                                    className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive(to)
                                        ? 'text-[#F97316] font-semibold'
                                        : 'text-gray-500 hover:text-[#0A0A0A] hover:bg-gray-50'
                                        }`}
                                >
                                    {label}
                                    {isActive(to) && (
                                        <motion.span
                                            layoutId="nav-active"
                                            className="absolute -bottom-px left-3 right-3 h-0.5 rounded-full bg-[#F97316]"
                                        />
                                    )}
                                    {NAV_LINKS.find(l => l.to === to && l.isNew) && (
                                        <span className="absolute -top-1 -right-1 flex h-2 w-2">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                                        </span>
                                    )}
                                </button>
                            ))}
                            {navLinks.map((lnk, i) => (
                                lnk.isExternal ? (
                                    <a key={i} href={lnk.url} target="_blank" rel="noreferrer"
                                        className="px-4 py-2 rounded-lg text-sm font-medium text-gray-500 hover:text-[#0A0A0A] hover:bg-gray-50 transition-all">
                                        {lnk.label}
                                    </a>
                                ) : (
                                    <Link key={i} to={lnk.url}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${isActive(lnk.url)
                                            ? 'text-[#F97316] font-semibold'
                                            : 'text-gray-500 hover:text-[#0A0A0A] hover:bg-gray-50'
                                            }`}>
                                        {lnk.label}
                                    </Link>
                                )
                            ))}
                        </div>

                        {/* Desktop Actions */}
                        <div className="hidden md:flex items-center gap-2 ml-auto">
                            {!isAuthenticated ? (
                                <div className="flex items-center gap-2">
                                    <Link to="/login" className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-[#0A0A0A] hover:bg-gray-50 rounded-lg transition-all">
                                        Sign In
                                    </Link>
                                    <Link to="/register" className="btn-primary py-2 px-5 text-sm">
                                        Get Started
                                    </Link>
                                    <div className="w-px h-5 bg-gray-200 mx-1" />
                                    <Link to="/employer-register" className="text-xs font-semibold text-gray-400 hover:text-[#F97316] transition-colors whitespace-nowrap">
                                        For Employers
                                    </Link>
                                </div>
                            ) : (
                                <div className="flex items-center gap-3">
                                    {/* Bell Icon & Dropdown */}
                                    <div className="relative" ref={notifRef}>
                                        <button
                                            onClick={() => setIsNotifOpen(!isNotifOpen)}
                                            className="relative p-2 text-white/40 hover:text-[#F97316] hover:bg-white/5 rounded-xl transition-all"
                                        >
                                            <Bell size={20} />
                                            {unreadCount > 0 && (
                                                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-[#F97316] rounded-full border-2 border-[#050505]" />
                                            )}
                                        </button>

                                        {/* Notification Dropdown List */}
                                        <AnimatePresence>
                                            {isNotifOpen && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                    transition={{ duration: 0.15 }}
                                                    className="absolute right-0 top-full mt-4 w-80 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.15)] rounded-[2rem] border border-gray-100 overflow-hidden z-50 flex flex-col max-h-[400px]"
                                                >
                                                    <div className="p-5 border-b border-gray-100 flex items-center justify-between shrink-0 bg-gray-50/50">
                                                        <h3 className="font-black text-xs uppercase tracking-widest text-gray-900">Notifications</h3>
                                                        <span className="bg-[#F97316]/10 text-[#F97316] text-[10px] uppercase font-black tracking-widest px-3 py-1 rounded-full">
                                                            {unreadCount} Active
                                                        </span>
                                                    </div>

                                                    <div className="overflow-y-auto flex-1 custom-scrollbar">
                                                        {notifications.length === 0 ? (
                                                            <div className="p-8 text-center">
                                                                <Bell className="mx-auto h-8 w-8 text-slate-300 mb-2" />
                                                                <p className="text-sm font-semibold text-slate-500">No notifications yet</p>
                                                            </div>
                                                        ) : (
                                                            notifications.map((notif) => (
                                                                <button
                                                                    key={notif._id}
                                                                    onClick={() => handleNotificationClick(notif)}
                                                                    className={`w-full text-left p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors flex gap-3 items-start ${!notif.isRead ? 'bg-orange-50/50' : ''}`}
                                                                >
                                                                    <div className={`p-2 rounded-xl mt-0.5 shrink-0 ${!notif.isRead ? 'bg-[#F97316]/10 text-[#F97316]' : 'bg-gray-100 text-gray-400'}`}>
                                                                        <Bell size={16} />
                                                                    </div>
                                                                    <div>
                                                                        <h4 className={`text-sm tracking-tight ${!notif.isRead ? 'font-black text-gray-900' : 'font-semibold text-gray-600'}`}>
                                                                            {notif.title}
                                                                        </h4>
                                                                        <p className="text-xs text-gray-500 font-medium mt-1 leading-relaxed">
                                                                            {notif.message}
                                                                        </p>
                                                                    </div>
                                                                </button>
                                                            ))
                                                        )}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                    <div className="h-8 w-px bg-white/10" />
                                    <Link to="/profile" className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-gray-50 transition-all group">
                                        <div className="w-8 h-8 bg-[#F97316] rounded-lg flex items-center justify-center text-white font-bold text-sm">
                                            {user?.name?.charAt(0)}
                                        </div>
                                        <div className="hidden xl:block">
                                            <p className="font-semibold text-sm text-gray-800 group-hover:text-[#111111]">{user?.name}</p>
                                        </div>
                                    </Link>
                                    <button onClick={handleLogout} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                                        <LogOut size={18} />
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Mobile Menu Toggle */}
                        <div className="lg:hidden flex items-center gap-3 ml-auto">
                            {isAuthenticated && (
                                <Link to="/profile" className="w-9 h-9 bg-[#F97316] rounded-xl flex items-center justify-center text-white font-black text-sm shadow-lg">
                                    {user?.name?.charAt(0)}
                                </Link>
                            )}
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-100 text-gray-700 hover:bg-[#F97316] hover:text-white transition-all"
                                aria-label="Toggle menu"
                            >
                                {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMenuOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMenuOpen(false)}
                            className="fixed inset-0 bg-[#000000]/50 backdrop-blur-sm z-40 lg:hidden"
                        />

                        {/* Drawer */}
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 28, stiffness: 220 }}
                            className="fixed right-0 top-0 h-full w-[85%] max-w-sm bg-white border-l border-gray-100 z-50 lg:hidden flex flex-col shadow-2xl overflow-y-auto"
                        >
                            {/* Drawer Header */}
                            <div className="bg-gray-50/50 border-b border-gray-100 px-6 pt-12 pb-8 relative">
                                <div className="absolute inset-0 opacity-10"
                                    style={{ backgroundImage: "radial-gradient(circle at 70% 50%, #F97316 0%, transparent 60%)" }} />
                                <button
                                    onClick={() => setIsMenuOpen(false)}
                                    className="absolute top-4 right-4 w-8 h-8 bg-gray-200/50 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-all"
                                >
                                    <X size={16} />
                                </button>
                                {isAuthenticated ? (
                                    <div className="flex items-center gap-3 relative z-10">
                                        <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center text-[#F97316] font-black text-xl border border-orange-200/50">
                                            {user?.name?.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-black text-gray-900 text-lg leading-tight">{user?.name}</p>
                                            <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mt-0.5">{user?.role}</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="relative z-10">
                                        {brandingData?.logoUrl ? (
                                            <div className="bg-white rounded-2xl p-3 inline-block shadow-xl">
                                                <img
                                                    src={brandingData.logoUrl.startsWith('http') ? brandingData.logoUrl : `${BASE_URL}${brandingData.logoUrl}`}
                                                    alt="Logo"
                                                    style={{ height: '64px', width: 'auto' }}
                                                    className="object-contain"
                                                />
                                            </div>
                                        ) : (
                                            <>
                                                <div className="flex items-center gap-3 mb-2">
                                                    <div className="bg-orange-100 p-2.5 rounded-xl">
                                                        <Briefcase className="h-6 w-6 text-[#F97316]" />
                                                    </div>
                                                    <span className="text-2xl font-black text-gray-900 tracking-tight">
                                                        Ledger<span className="text-[#F97316]">Bandhu</span>
                                                    </span>
                                                </div>
                                                <p className="text-gray-500 text-base font-medium">Find your dream job</p>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="flex-1 px-4 py-6 space-y-2">
                                {/* ── Main Navigation ── */}
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-3 mb-3">Explore</p>
                                {NAV_LINKS.map(({ to, label, icon }) => (
                                    <Link
                                        key={to}
                                        to={to}
                                        className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl font-semibold transition-all ${isActive(to)
                                            ? 'bg-orange-50 text-[#F97316]'
                                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                            }`}
                                    >
                                        <span className={isActive(to) ? 'text-[#F97316]' : 'text-gray-400'}>{icon}</span>
                                        {label}
                                        <ChevronRight size={16} className="ml-auto opacity-30" />
                                    </Link>
                                ))}

                                {navLinks.length > 0 && navLinks.map((lnk, i) => (
                                    lnk.isExternal ? (
                                        <a key={i} href={lnk.url} target="_blank" rel="noreferrer"
                                            className="flex items-center gap-3 px-4 py-3.5 rounded-2xl font-semibold text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all">
                                            <Zap size={18} className="text-gray-400" />
                                            {lnk.label}
                                            <ChevronRight size={16} className="ml-auto opacity-30" />
                                        </a>
                                    ) : (
                                        <Link key={i} to={lnk.url}
                                            className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl font-semibold transition-all ${isActive(lnk.url)
                                                ? 'bg-orange-50 text-[#F97316]'
                                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                                }`}>
                                            <Zap size={18} className="text-gray-400" />
                                            {lnk.label}
                                            <ChevronRight size={16} className="ml-auto opacity-30" />
                                        </Link>
                                    )
                                ))}

                                <div className="border-t border-gray-100 pt-4 mt-4" />

                                {/* ── Auth / User Actions ── */}
                                {!isAuthenticated ? (
                                    <div className="space-y-3">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-3 mb-3">Account</p>
                                        <Link to="/login"
                                            className="flex items-center justify-between px-4 py-3.5 rounded-2xl font-semibold text-gray-600 border border-gray-100 hover:bg-gray-50 hover:text-gray-900 transition-all">
                                            Login <ChevronRight size={16} className="opacity-30" />
                                        </Link>
                                        <Link to="/register"
                                            className="flex items-center justify-between px-4 py-3.5 bg-[#F97316] text-white rounded-2xl font-bold shadow-lg shadow-orange-500/20 text-sm">
                                            Join LedgerBandhu <ChevronRight size={16} />
                                        </Link>
                                        <Link to="/employer-register"
                                            className="flex items-center justify-center px-4 py-3.5 rounded-2xl font-semibold text-[#F97316] border border-dashed border-[#F97316]/20 hover:bg-orange-50 transition-all text-sm">
                                            For Employers
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-3 mb-3">Account</p>
                                        {[
                                            { to: "/profile", icon: <User size={18} />, label: "My Profile" },
                                            ...(user?.role === 'seeker' ? [{ to: "/my-applications", icon: <FileText size={18} />, label: "My Applications" }] : []),
                                            ...(user?.role === 'employer' || user?.role === 'admin' ? [{ to: "/dashboard", icon: <LayoutDashboard size={18} />, label: "Dashboard", highlight: true }] : []),
                                        ].map((item, idx) => (
                                            <Link key={idx} to={item.to}
                                                className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl font-semibold transition-all ${item.highlight
                                                    ? 'bg-orange-50 text-[#F97316]'
                                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                                    }`}>
                                                <span className={item.highlight ? 'text-[#F97316]' : 'text-gray-400'}>{item.icon}</span>
                                                {item.label}
                                                <ChevronRight size={16} className="ml-auto opacity-30" />
                                            </Link>
                                        ))}
                                    </div>
                                )} 
                            </div>

                            {/* Drawer Footer */}
                            {isAuthenticated && (
                                <div className="px-4 pb-8">
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-semibold text-red-500 bg-red-50 hover:bg-red-100 border border-red-100 transition-all"
                                    >
                                        <LogOut size={18} /> Sign Out
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};

export default Navbar;
