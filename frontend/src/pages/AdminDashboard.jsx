import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users, Briefcase, FileText, Trash2, ArrowRight, ShieldCheck, Shield,
    Mail, Calendar, MapPin, ExternalLink, Activity, Plus, Home,
    Info, MessageSquare, BookOpen, HelpCircle, Layers, Globe,
    Settings, LogOut, ChevronRight, Menu, X, Save,
    ClipboardList, ToggleLeft, ToggleRight, Download, Eye, Newspaper, Sparkles,
    Layout, Upload, Image, Pencil, Link2, Trash, Check, EyeOff, CircleDollarSign
} from 'lucide-react';
import api from '../lib/axios';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import ManageNewsletters from '../components/admin/ManageNewsletters';
import ManageSubscribers from '../components/admin/ManageSubscribers';
import ManageDownloads from '../components/admin/ManageDownloads';
import ManageFAQs from '../components/admin/ManageFAQs';
import ManageCommunity from '../components/admin/ManageCommunity';

const AdminDashboard = () => {
    const { user, isAuthenticated, isLoading: authLoading, login, logout } = useAuthStore();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const [activeSection, setActiveSection] = useState('dashboard');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [stats, setStats] = useState(null);
    const [users, setUsers] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [applications, setApplications] = useState([]);
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userTab, setUserTab] = useState('employers');
    const [jobTab, setJobTab] = useState('employer'); // 'employer' | 'admin' | 'pending' | 'categories' | 'post'
    const [regTab, setRegTab] = useState('fields'); // 'fields' | 'add' | 'data'
    const [formFields, setFormFields] = useState([]);
    const [registrations, setRegistrations] = useState([]);
    const [newField, setNewField] = useState({ fieldName: '', label: '', type: 'text', placeholder: '', required: false, forRole: 'both', options: '' });
    const [regRoleFilter, setRegRoleFilter] = useState('all');
    const [categories, setCategories] = useState([]);
    const getAdminDefaultDeadline = () => { const d = new Date(); d.setDate(d.getDate() + 45); return d.toISOString().split('T')[0]; };
    const [newJob, setNewJob] = useState({ title: '', description: '', location: '', salary: '', category: '', requirements: '', openings: 1, deadline: getAdminDefaultDeadline(), educationLevel: 'Graduation', experienceLevel: '0-2 Years', isSponsored: false });
    const [jobPostLoading, setJobPostLoading] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [newCategoryImage, setNewCategoryImage] = useState(null);
    const [catLoading, setCatLoading] = useState(false);
    const [editingCatId, setEditingCatId] = useState(null);
    const [editCatName, setEditCatName] = useState('');
    const [editCatImage, setEditCatImage] = useState(null);
    const [editCatLoading, setEditCatLoading] = useState(false);
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [loginError, setLoginError] = useState('');
    const [loginLoading, setLoginLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [selectedContacts, setSelectedContacts] = useState([]);
    const [selectedNews, setSelectedNews] = useState([]);
    const [selectedApplications, setSelectedApplications] = useState([]);
    const [selectedJobs, setSelectedJobs] = useState([]);
    const [selectedSeekers, setSelectedSeekers] = useState([]);
    const [viewingContact, setViewingContact] = useState(null);
    const [viewingApplication, setViewingApplication] = useState(null);
    const [viewingUser, setViewingUser] = useState(null);

    const formatResumeUrl = (url) => {
        if (!url) return '';
        if (url.startsWith('http')) return url;
        const baseUrl = import.meta.env.VITE_API_URL.replace(/\/api\/?$/, '');
        const cleanUrl = url.startsWith('/') ? url : `/${url}`;
        return `${baseUrl}${cleanUrl}`;
    };

    // CMS States — all fields that appear on the frontend Home page
    const DEFAULT_HOME_CMS = {
        heroBadge: 'The Future of Hiring is Here',
        heroTitle: 'Find your dream',
        heroTitleHighlight: 'job now',
        heroSubtitle: '5 lakh+ jobs across Banking, Accountancy, Fintech & Finance — all in one place.',
        searchPlaceholder1: 'Designation, Skills...',
        searchPlaceholder2: 'Location',
        searchButtonText: 'Search Now',
        categoriesTitle: 'Popular Categories',
        categoriesSubtitle: 'Explore jobs in your specialized field',
        featuredJobsTitle: 'Featured Jobs',
        featuredJobsSubtitle: 'Handpicked opportunities for you',
        stat1Value: '5L+',
        stat1Label: 'Active Jobs',
        stat2Value: '50K+',
        stat2Label: 'Companies',
        stat3Value: '2M+',
        stat3Label: 'Job Seekers',
        stat4Value: '95%',
        stat4Label: 'Success Rate',
    };
    const [homeContent, setHomeContent] = useState(DEFAULT_HOME_CMS);
    const [aboutContent, setAboutContent] = useState({ title: '', description: '' });
    const [contactPageContent, setContactPageContent] = useState({
        heroTitle: 'Get In Touch',
        heroSubtitle: "Have questions about our job portal? We're here to help you find your dream job or the perfect candidate for your team.",
        addressTitle: 'Visit Our Office',
        addressDetails: '123 Tech Park, Sector 62, Noida, Uttar Pradesh 201301',
        phoneTitle: 'Call Us',
        phoneDetails: '+91 98765 43210',
        emailTitle: 'Email Support',
        emailDetails: 'support@LedgerBandhu.com'
    });

    // Header/Footer/Branding CMS states
    const DEFAULT_HEADER = {
        navLinks: [],
    };
    const DEFAULT_FOOTER = {
        brandTagline: 'LedgerBandhu',
        brandDescription: 'Connecting talent with opportunity. We provide the most comprehensive job search and hiring experience in the industry.',
        quickLinks: [
            { label: 'Home', url: '/' },
            { label: 'Browse Jobs', url: '/jobs' },
            { label: 'Gulf Jobs PDF', url: '/gulf-jobs-pdf' },
            { label: 'Dashboard', url: '/dashboard' },
            { label: 'Post a Job', url: '/post-job' },
            { label: 'Join as Seeker', url: '/register' },
        ],
        supportLinks: [
            { label: 'Terms of Service', url: '#' },
            { label: 'Privacy Policy', url: '/privacy' },
            { label: 'FAQ', url: '/faq' },
            { label: 'Contact Us', url: '/contact' },
        ],
        contactAddress: '123 Tech Park, Sector 62, Noida',
        contactPhone: '+91 98765 43210',
        contactEmail: 'support@LedgerBandhu.com',
        socialFacebook: '#',
        socialTwitter: '#',
        socialLinkedin: '#',
        socialInstagram: '#',
        copyrightText: `© ${new Date().getFullYear()} LedgerBandhu. All rights reserved.`,
        copyrightSub: 'Designed with ❤️ for better careers.',
        newsletterHeading: 'Newsletter',
    };
    const [headerContent, setHeaderContent] = useState(DEFAULT_HEADER);
    const [footerContent, setFooterContent] = useState(DEFAULT_FOOTER);
    const [brandingData, setBrandingData] = useState({ logoUrl: null, iconUrl: null, logoHeight: 36 });
    const [hfTab, setHfTab] = useState('header'); // 'header' | 'footer' | 'branding'
    const [newNavLink, setNewNavLink] = useState({ label: '', url: '', isExternal: false });
    const [editNavIdx, setEditNavIdx] = useState(null);
    const [editNavLink, setEditNavLink] = useState({ label: '', url: '', isExternal: false });
    const [newQuickLink, setNewQuickLink] = useState({ label: '', url: '' });
    const [newSupportLink, setNewSupportLink] = useState({ label: '', url: '' });
    const [hfSaving, setHfSaving] = useState(false);
    const [logoFile, setLogoFile] = useState(null);
    const [iconFile, setIconFile] = useState(null);
    const [footerLogoFile, setFooterLogoFile] = useState(null);
    const [logoPreview, setLogoPreview] = useState(null);
    const [iconPreview, setIconPreview] = useState(null);
    const [footerLogoPreview, setFooterLogoPreview] = useState(null);
    const [uploadingLogo, setUploadingLogo] = useState(false);
    const [uploadingIcon, setUploadingIcon] = useState(false);
    const [uploadingFooterLogo, setUploadingFooterLogo] = useState(false);

    // AI Agent States
    const [aiUrl, setAiUrl] = useState('');
    const [aiFallbackText, setAiFallbackText] = useState('');
    const [aiCategory, setAiCategory] = useState('');
    const [aiPrompt, setAiPrompt] = useState('');
    const [aiLoading, setAiLoading] = useState(false);
    const [privacySections, setPrivacySections] = useState([]);
    const [termsSections, setTermsSections] = useState([]);
    const [aiResult, setAiResult] = useState(null);
    const [aiNewsPosts, setAiNewsPosts] = useState([]);
    const [linkedInPost, setLinkedInPost] = useState(null);
    const [linkedInCopied, setLinkedInCopied] = useState(false);
    const [aiIsSponsored, setAiIsSponsored] = useState(false);

    // Edit Job States
    const [editingJob, setEditingJob] = useState(null);
    const [editJobData, setEditJobData] = useState({});
    const [editJobLoading, setEditJobLoading] = useState(false);

    const handleAdminLogin = async (e) => {
        e.preventDefault();
        setLoginError('');
        setLoginLoading(true);
        const success = await login(loginEmail.trim(), loginPassword.trim());
        if (success) {
            const loggedInUser = useAuthStore.getState().user;
            if (loggedInUser?.role !== 'admin') {
                // Logged in but not an admin
                await logout();
                setLoginError('Access denied: This account does not have admin privileges.');
            }
            // If admin, the component will re-render and show the admin UI
        } else {
            const storeError = useAuthStore.getState().error;
            setLoginError(storeError || 'Invalid credentials. Please try again.');
        }
        setLoginLoading(false);
    };

    // NOTE: Do NOT redirect — show login form instead

    const updateFavicon = (url) => {
        if (!url) return;
        const apiPrefix = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        const baseUrl = apiPrefix.replace('/api', '');
        const fullUrl = url.startsWith('http') ? url : `${baseUrl}${url}`;

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
        if (brandingData?.iconUrl) {
            updateFavicon(brandingData.iconUrl);
        }
    }, [brandingData?.iconUrl]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [statsRes, usersRes, jobsRes, appsRes, catsRes, contactsRes] = await Promise.all([
                api.get('/admin/stats'),
                api.get('/admin/users'),
                api.get('/admin/jobs'),
                api.get('/admin/applications'),
                api.get('/admin/categories'),
                api.get('/cms/contacts'),
            ]);
            setStats(statsRes.data);
            setUsers(usersRes.data);
            setJobs(jobsRes.data);
            setApplications(appsRes.data);
            setCategories(catsRes.data);
            setContacts(contactsRes.data || []);

            const newsRes = await api.get('/news').catch(() => ({ data: [] }));
            setAiNewsPosts(newsRes.data || []);

            const [homeRes, contactPageRes] = await Promise.all([
                api.get('/cms/page/home').catch(() => ({ data: {} })),
                api.get('/cms/page/contact').catch(() => ({ data: {} })),
            ]);
            setHomeContent(prev => ({ ...prev, ...(homeRes.data?.content || {}) }));
            if (contactPageRes.data?.content) setContactPageContent(prev => ({ ...prev, ...contactPageRes.data.content }));

            // Fetch header, footer, branding
            const [headerRes, footerRes, brandingRes] = await Promise.all([
                api.get('/cms/page/header').catch(() => ({ data: {} })),
                api.get('/cms/page/footer').catch(() => ({ data: {} })),
                api.get('/cms/branding').catch(() => ({ data: {} })),
            ]);
            if (headerRes.data?.content) setHeaderContent(prev => ({ ...prev, ...headerRes.data.content }));
            if (footerRes.data?.content && Object.keys(footerRes.data.content).length > 0) {
                const updated = { ...footerRes.data.content };
                if (updated.supportLinks) {
                    updated.supportLinks = updated.supportLinks.map(ln =>
                        ln.label === 'Help Center' ? { label: 'FAQ', url: '/faq' } : ln
                    );
                }
                setFooterContent(prev => ({ ...prev, ...updated }));
            }
            if (brandingRes.data) setBrandingData(brandingRes.data);

            // Form fields and registrations
            const [ffRes, regRes, privacyRes, termsRes] = await Promise.all([
                api.get('/admin/form-fields').catch(() => ({ data: [] })),
                api.get('/admin/registrations').catch(() => ({ data: [] })),
                api.get('/cms/page/privacy').catch(() => ({ data: {} })),
                api.get('/cms/page/terms').catch(() => ({ data: {} })),
            ]);
            setFormFields(ffRes.data || []);
            setRegistrations(regRes.data || []);
            if (privacyRes.data?.content?.sections) setPrivacySections(privacyRes.data.content.sections);
            if (termsRes.data?.content?.sections) setTermsSections(termsRes.data.content.sections);

        } catch (error) {
            console.error("Failed to fetch admin data", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user?.role === 'admin') {
            fetchData();
            const section = searchParams.get('section');
            if (section) setActiveSection(section);
        }
    }, [user, searchParams]);

    const handleDelete = async (type, id) => {
        if (window.confirm(`Permanently delete this ${type}?`)) {
            try {
                const endpoint = type === 'contact' ? `/cms/contacts/${id}` : `/admin/${type}s/${id}`;
                await api.delete(endpoint);
                fetchData();
            } catch (error) {
                alert(error.response?.data?.message || `Failed to delete ${type}`);
            }
        }
    };

    const handleUpdateJobBtnSubmit = async (e) => {
        e.preventDefault();
        setEditJobLoading(true);
        try {
            await api.put(`/admin/jobs/${editingJob._id}`, editJobData);
            setEditingJob(null);
            fetchData();
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to update job');
        } finally {
            setEditJobLoading(false);
        }
    };

    const handleEditJobClick = (job) => {
        setEditingJob(job);
        setEditJobData({
            title: job.title || '',
            category: job.category || '',
            experienceLevel: job.experienceLevel || '',
            educationLevel: job.educationLevel || '',
            openings: job.openings || 1,
            location: job.location || '',
            salary: job.salary || '',
            description: job.description || '',
            requirements: job.requirements || [],
            deadline: job.deadline ? new Date(job.deadline).toISOString().split('T')[0] : '',
            isSponsored: job.isSponsored || false
        });
    };

    const handleMarkContactRead = async (id) => {
        try {
            await api.patch(`/cms/contacts/${id}/read`);
            fetchData();
        } catch (error) {
            alert('Failed to mark as read');
        }
    };

    const handleBulkDeleteContacts = async () => {
        if (selectedContacts.length === 0) return;
        if (window.confirm(`Permanently delete ${selectedContacts.length} selected contacts?`)) {
            try {
                await api.post('/cms/contacts/bulk-delete', { ids: selectedContacts });
                setSelectedContacts([]);
                fetchData();
                alert('Selected contacts deleted successfully');
            } catch (error) {
                alert('Failed to delete selected contacts');
            }
        }
    };

    const toggleContactSelection = (id) => {
        setSelectedContacts(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const toggleAllContacts = () => {
        if (selectedContacts.length === contacts.length) {
            setSelectedContacts([]);
        } else {
            setSelectedContacts(contacts.map(c => c._id));
        }
    };

    const toggleNewsSelection = (id) => {
        setSelectedNews(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const toggleAllNews = () => {
        if (selectedNews.length === aiNewsPosts.length) {
            setSelectedNews([]);
        } else {
            setSelectedNews(aiNewsPosts.map(p => p._id));
        }
    };

    const handleBulkDeleteNews = async () => {
        if (selectedNews.length === 0) return;
        if (window.confirm(`Permanently delete ${selectedNews.length} selected news digests?`)) {
            try {
                await api.post('/news/bulk-delete', { ids: selectedNews });
                setSelectedNews([]);
                fetchData();
                alert('Selected news digests deleted successfully');
            } catch (error) {
                alert('Failed to delete selected news');
            }
        }
    };

    const toggleApplicationSelection = (id) => {
        setSelectedApplications(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const toggleAllApplications = () => {
        if (selectedApplications.length === applications.length) {
            setSelectedApplications([]);
        } else {
            setSelectedApplications(applications.map(a => a._id));
        }
    };

    const handleBulkDeleteApplications = async () => {
        if (selectedApplications.length === 0) return;
        if (window.confirm(`Permanently delete ${selectedApplications.length} selected applications?`)) {
            try {
                await api.post('/admin/applications/bulk-delete', { ids: selectedApplications });
                setSelectedApplications([]);
                fetchData();
                alert('Selected applications deleted successfully');
            } catch (error) {
                alert('Failed to delete selected applications');
            }
        }
    };

    const toggleSeekerSelection = (id) => {
        setSelectedSeekers(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const toggleAllSeekers = () => {
        const seekers = users.filter(u => u.role === 'seeker');
        if (selectedSeekers.length === seekers.length) {
            setSelectedSeekers([]);
        } else {
            setSelectedSeekers(seekers.map(a => a._id));
        }
    };

    const handleBulkDeleteSeekers = async () => {
        if (selectedSeekers.length === 0) return;
        if (window.confirm(`Permanently delete ${selectedSeekers.length} selected job seekers?`)) {
            try {
                await api.post('/admin/users/bulk-delete', { ids: selectedSeekers });
                setSelectedSeekers([]);
                fetchData();
                alert('Selected job seekers deleted successfully');
            } catch (error) {
                alert('Failed to delete selected job seekers');
            }
        }
    };

    const toggleJobSelection = (id) => {
        setSelectedJobs(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const toggleAllJobs = (currentJobsList) => {
        if (selectedJobs.length === currentJobsList.length) {
            setSelectedJobs([]);
        } else {
            setSelectedJobs(currentJobsList.map(j => j._id));
        }
    };

    const handleBulkDeleteJobs = async () => {
        if (selectedJobs.length === 0) return;
        if (window.confirm(`Permanently delete ${selectedJobs.length} selected jobs?`)) {
            try {
                await api.post('/admin/jobs/bulk-delete', { ids: selectedJobs });
                setSelectedJobs([]);
                fetchData();
                alert('Selected jobs deleted successfully');
            } catch (error) {
                alert('Failed to delete selected jobs');
            }
        }
    };

    const handleAddCategory = async (e) => {
        e.preventDefault();
        setCatLoading(true);
        try {
            const formData = new FormData();
            formData.append('name', newCategoryName);
            if (newCategoryImage) formData.append('image', newCategoryImage);

            await api.post('/admin/categories', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setNewCategoryName('');
            setNewCategoryImage(null);
            fetchData();
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to add category');
        } finally {
            setCatLoading(false);
        }
    };

    const handleDeleteCategory = async (id) => {
        if (window.confirm('Delete this category? Jobs using this category will still exist.')) {
            try {
                await api.delete(`/admin/categories/${id}`);
                fetchData();
            } catch (error) {
                alert('Failed to delete category');
            }
        }
    };

    const handleStartEditCategory = (cat) => {
        setEditingCatId(cat._id);
        setEditCatName(cat.name);
        setEditCatImage(null);
    };

    const handleUpdateCategory = async (id) => {
        if (!editCatName.trim()) return alert('Category name cannot be empty');
        setEditCatLoading(true);
        try {
            const formData = new FormData();
            formData.append('name', editCatName.trim());
            if (editCatImage) formData.append('image', editCatImage);
            await api.put(`/admin/categories/${id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setEditingCatId(null);
            setEditCatName('');
            setEditCatImage(null);
            fetchData();
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to update category');
        } finally {
            setEditCatLoading(false);
        }
    };

    const handleSavePolicy = async (pageName, sections) => {
        try {
            await api.post('/cms/page', { pageName, content: { sections } });
            alert(`${pageName.charAt(0).toUpperCase() + pageName.slice(1)} updated successfully!`);
        } catch (error) {
            alert('Failed to update policy');
        }
    };

    const handleAddPolicySection = (setter) => {
        setter(prev => [...prev, { title: 'New Section', icon: 'Shield', content: 'Enter content here...' }]);
    };

    const handleRemovePolicySection = (setter, idx) => {
        setter(prev => prev.filter((_, i) => i !== idx));
    };

    const handleUpdatePolicySection = (setter, idx, field, value) => {
        setter(prev => prev.map((s, i) => i === idx ? { ...s, [field]: value } : s));
    };

    const PolicyEditor = ({ title, sections, setSections, onSave, pageName }) => (
        <div className="max-w-4xl space-y-8">
            <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-2xl font-black text-slate-900 italic">{title}</h3>
                        <p className="text-slate-400 text-xs italic font-bold mt-1">Manage sections for the {pageName} page</p>
                    </div>
                    <button onClick={() => onSave(pageName, sections)} className="flex items-center gap-2 bg-[#F47920] text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#D4641A] transition-all shadow-lg shadow-[#F4792010]">
                        <Save size={18} /> Update Live
                    </button>
                </div>

                <div className="space-y-6">
                    {sections.map((section, idx) => (
                        <div key={idx} className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 space-y-4 relative group">
                            <button
                                onClick={() => handleRemovePolicySection(setSections, idx)}
                                className="absolute -top-2 -right-2 w-8 h-8 bg-rose-500 text-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <X size={14} />
                            </button>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 italic ml-1">Section Title</label>
                                    <input
                                        value={section.title}
                                        onChange={e => handleUpdatePolicySection(setSections, idx, 'title', e.target.value)}
                                        className="w-full bg-white border border-slate-100 p-3 rounded-xl font-bold text-slate-700 outline-none focus:border-[#F4792050] transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 italic ml-1">Icon Name (Lucide)</label>
                                    <select
                                        value={section.icon}
                                        onChange={e => handleUpdatePolicySection(setSections, idx, 'icon', e.target.value)}
                                        className="w-full bg-white border border-slate-100 p-3 rounded-xl font-bold text-slate-700 outline-none focus:border-[#F4792050] transition-all"
                                    >
                                        <option value="Shield">Shield</option>
                                        <option value="Lock">Lock</option>
                                        <option value="Eye">Eye</option>
                                        <option value="FileText">FileText</option>
                                        <option value="Globe">Globe</option>
                                        <option value="Bell">Bell</option>
                                        <option value="CheckCircle">CheckCircle</option>
                                        <option value="AlertCircle">AlertCircle</option>
                                        <option value="Info">Info</option>
                                        <option value="ShieldCheck">ShieldCheck</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 italic ml-1">Section Content</label>
                                <textarea
                                    rows={3}
                                    value={section.content}
                                    onChange={e => handleUpdatePolicySection(setSections, idx, 'content', e.target.value)}
                                    className="w-full bg-white border border-slate-100 p-4 rounded-xl font-medium text-slate-600 outline-none focus:border-[#F4792050] transition-all leading-relaxed"
                                />
                            </div>
                        </div>
                    ))}

                    <button
                        onClick={() => handleAddPolicySection(setSections)}
                        className="w-full py-4 border-2 border-dashed border-slate-200 rounded-[2rem] text-slate-400 font-black text-xs uppercase tracking-widest hover:border-[#F4792050] hover:text-[#F47920] transition-all flex items-center justify-center gap-2"
                    >
                        <Plus size={16} /> Add New Section
                    </button>
                </div>
            </div>
        </div>
    );

    const handleSaveContent = async (pageName, content) => {
        try {
            await api.post('/cms/page', { pageName, content });
            alert(`${pageName} content updated successfully!`);
        } catch (error) {
            alert("Failed to update content");
        }
    };

    const handleApproveReject = async (userId, action) => {
        try {
            await api.patch(`/admin/users/${userId}/${action}`);
            fetchData();
        } catch (error) {
            alert(`Failed to ${action} employer`);
        }
    };

    const handleJobApproveReject = async (jobId, action) => {
        try {
            await api.patch(`/admin/jobs/${jobId}/${action}`);
            fetchData();
        } catch (error) {
            alert(`Failed to ${action} job`);
        }
    };

    const handleAdminPostJob = async (e) => {
        e.preventDefault();
        setJobPostLoading(true);
        try {
            const payload = {
                ...newJob,
                requirements: newJob.requirements.split(',').map(r => r.trim()).filter(Boolean),
            };
            await api.post('/admin/jobs', payload);
            setNewJob({ title: '', description: '', location: '', salary: '', category: '', requirements: '', openings: 1, deadline: getAdminDefaultDeadline(), educationLevel: 'Graduation', experienceLevel: '0-2 Years' });
            setJobTab('all');
            fetchData();
            alert('Job posted successfully!');
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to post job');
        } finally {
            setJobPostLoading(false);
        }
    };

    const handleGenerateAIJob = async (e) => {
        e.preventDefault();
        setAiLoading(true);
        setAiResult(null);
        setLinkedInPost(null);
        setLinkedInCopied(false);
        try {
            const res = await api.post('/admin/ai/generate', { 
                url: aiUrl, 
                fallbackText: aiFallbackText || null, 
                category: aiCategory || null,
                isSponsored: aiIsSponsored
            });
            const { job, linkedIn, companyName } = res.data;

            if (!job) {
                alert('Job generation failed or returned unexpected data. Please try again.');
                return;
            }

            setAiResult(job); // Set result for review section

            // Build a clean, premium, text-only LinkedIn Job Alert post
            const jobUrl = `https://www.ledgerbandhu.com/job/${job.jobId || job._id}`;

            const reqBullets = Array.isArray(job.requirements) && job.requirements.length > 0
                ? job.requirements.slice(0, 6).map(r => `— ${r.trim()}`).join('\n')
                : '— Strong finance domain knowledge\n— Relevant degree and certifications';

            const categoryTag = `#${(job.category || 'Finance').replace(/[\s&]+/g, '')}`;
            const titleTag = `#${(job.title || 'Finance').split(' ').slice(0, 2).join('')}`;

            const postText = [
                `${companyName || 'We'} is Hiring | ${job.title}`,
                ``,
                `${companyName || 'A leading company'} is looking for a ${job.title}. If you or someone you know fits this profile, we encourage you to apply.`,
                ``,
                `─────────────────────────`,
                `Role          :  ${job.title}`,
                `Department :  ${job.category}`,
                `Location     :  ${job.location}`,
                `Salary         :  ${job.salary}`,
                job.experienceLevel ? `Experience  :  ${job.experienceLevel}` : null,
                job.educationLevel  ? `Education    :  ${job.educationLevel}` : null,
                job.openings        ? `Openings     :  ${job.openings}` : null,
                `Posted On   :  ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}`,
                `─────────────────────────`,
                ``,
                `Key Skills and Requirements`,
                ``,
                reqBullets,
                ``,
                `─────────────────────────`,
                ``,
                `About LedgerBandhu`,
                ``,
                `LedgerBandhu is India's dedicated finance career platform — built exclusively for CA, CFA, Banking, Fintech, and Accounting professionals. We connect the right talent with the right opportunity.`,
                ``,
                `How to Apply`,
                ``,
                `Comment "Interested" below and we will reach out to you with the next steps.`,
                ``,
                `Tag someone who might be the perfect fit for this role.`,
                ``,
                `${titleTag} ${categoryTag} #FinanceJobs #Hiring #CA #CFA #Accounting #IndiaFinance #LedgerBandhu #FinanceCareers #JobAlert${aiIsSponsored ? ' #FeaturedJob' : ''}`,
            ].filter(line => line !== null).join('\n');
            setLinkedInPost({ text: postText, jobTitle: job.title, linkedInStatus: linkedIn });

            setAiUrl('');
            setAiPrompt('');
            fetchData();

        } catch (error) {
            console.error("AI Automation Error:", error);
            const errorMsg = error.response?.data?.message || error.response?.data?.error || error.message || 'Failed to automate job';
            alert(errorMsg);
        } finally {
            setAiLoading(false);
        }
    };

    const handlePostAIJob = async () => {
        setJobPostLoading(true);
        try {
            await api.post('/admin/ai/post', aiResult);
            alert('AI Job posted successfully!');
            setAiResult(null);
            setAiUrl('');
            setAiPrompt('');
            setAiIsSponsored(false);
            setActiveSection('jobs'); // Redirect to jobs list
            fetchData();
        } catch (error) {
            alert(error.response?.data?.error || 'Failed to post job');
        } finally {
            setJobPostLoading(false);
        }
    };

    // Auth check in progress
    if (authLoading) return (
        <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #111D45 0%, #0A1230 100%)' }}>
            <div className="flex flex-col items-center gap-6">
                <div className="w-16 h-16 border-4 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#F47920', borderTopColor: 'transparent' }}></div>
                <p className="font-black tracking-[0.3em] uppercase text-xs animate-pulse" style={{ color: '#F47920' }}>Checking credentials...</p>
            </div>
        </div>
    );

    // Not authenticated or not an admin — show dedicated admin login page
    if (!isAuthenticated || user?.role !== 'admin') return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0A0A0A 0%, #000000 100%)' }}>
            <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ background: 'radial-gradient(ellipse at top right, #F47920 0%, transparent 60%)' }} />
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ background: 'radial-gradient(ellipse at bottom left, #1A1A1A 0%, transparent 60%)' }} />
            <div className="relative z-10 w-full max-w-md px-6">
                <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[3rem] p-12 shadow-2xl">
                    <div className="text-center mb-12">
                        <div className="w-20 h-20 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-xl" style={{ background: 'linear-gradient(135deg, #0A0A0A, #000000)', boxShadow: '0 12px 40px rgba(244,121,32,0.25)', border: '2px solid rgba(244,121,32,0.3)' }}>
                            <ShieldCheck size={36} className="text-white" />
                        </div>
                        <h1 className="text-3xl font-black text-white tracking-tight">Admin <span style={{ color: '#F47920' }}>Portal</span></h1>
                        <p className="text-white/40 font-bold text-sm mt-2">LedgerBandhu Management System</p>
                    </div>
                    <form onSubmit={handleAdminLogin} className="space-y-4">
                        <div>
                            <label className="text-[10px] font-black uppercase tracking-widest ml-2 block mb-2" style={{ color: 'rgba(244,121,32,0.7)' }}>Admin Email</label>
                            <input
                                type="email"
                                id="admin-email"
                                value={loginEmail}
                                onChange={e => setLoginEmail(e.target.value)}
                                required
                                placeholder="admin@LedgerBandhu.com"
                                className="w-full bg-white/5 border border-white/10 text-white placeholder-white/20 rounded-2xl px-6 py-4 font-bold outline-none transition-all"
                                style={{ '--tw-ring-color': '#F47920' }}
                                onFocus={e => e.target.style.borderColor = 'rgba(244,121,32,0.5)'}
                                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-black uppercase tracking-widest ml-2 block mb-2" style={{ color: 'rgba(244,121,32,0.7)' }}>Password</label>
                            <div className="relative group/pass">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="admin-password"
                                    value={loginPassword}
                                    onChange={e => setLoginPassword(e.target.value)}
                                    required
                                    placeholder="••••••••"
                                    className="w-full bg-white/5 border border-white/10 text-white placeholder-white/20 rounded-2xl px-6 py-4 font-bold outline-none transition-all pr-14"
                                    onFocus={e => e.target.style.borderColor = 'rgba(244,121,32,0.5)'}
                                    onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-xl text-white/30 hover:text-[#F47920] hover:bg-white/5 transition-all"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>
                        {loginError && (
                            <p className="text-rose-400 text-xs font-bold text-center px-4 py-3 bg-rose-500/10 rounded-2xl border border-rose-500/20">
                                {loginError}
                            </p>
                        )}
                        <button
                            type="submit"
                            disabled={loginLoading}
                            className="w-full text-white font-black py-4 rounded-2xl transition-all active:scale-95 disabled:opacity-50"
                            style={{ background: 'linear-gradient(135deg, #F47920, #D4641A)', boxShadow: '0 8px 30px rgba(244,121,32,0.4)' }}
                        >
                            {loginLoading ? 'Please wait...' : 'Access Admin Portal'}
                        </button>
                    </form>
                    <p className="text-center text-white/20 text-[10px] font-bold mt-8 tracking-widest uppercase">Authorized Personnel Only</p>
                </div>
            </div>
        </div>
    );

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0A0A0A 0%, #000000 100%)' }}>
            <div className="flex flex-col items-center gap-6">
                <div className="w-16 h-16 border-4 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#F47920 #F47920 #F47920 transparent' }}></div>
                <p className="font-black tracking-[0.3em] uppercase text-xs animate-pulse" style={{ color: '#F47920' }}>Loading Dashboard...</p>
            </div>
        </div>
    );

    const sidebarItems = [
        { id: 'dashboard', label: 'Overview', icon: <Activity size={20} />, group: 'Main' },
        { id: 'ai-news', label: 'AI News Digest', icon: <Newspaper size={20} />, group: 'Main' },
        { id: 'ai-agent', label: 'AI Job Agent', icon: <Sparkles size={18} />, group: 'Main' },
        { id: 'users', label: 'Registered Users', icon: <Users size={20} />, group: 'Data' },
        { id: 'jobs', label: 'Job Listings', icon: <Briefcase size={20} />, group: 'Data' },
        { id: 'applications', label: 'Job Applications', icon: <FileText size={20} />, group: 'Data' },
        { id: 'contacts', label: 'Contact Submissions', icon: <MessageSquare size={20} />, group: 'Data' },
        { id: 'community', label: 'Manage Community', icon: <Users size={20} />, group: 'Data' },
        { id: 'forms', label: 'Registration Forms', icon: <ClipboardList size={20} />, group: 'Data' },
        { id: 'home', label: 'Homepage Content', icon: <Globe size={20} />, group: 'Content' },
        { id: 'contact-page', label: 'Contact Page Content', icon: <Mail size={20} />, group: 'Content' },
        { id: 'header-footer', label: 'Header & Footer', icon: <Layout size={20} />, group: 'Content' },
        { id: 'newsletters', label: 'Manage Job PDF', icon: <BookOpen size={20} />, group: 'Content' },
        { id: 'subscribers', label: 'Email Subscribers', icon: <Mail size={20} />, group: 'Content' },
        { id: 'faq', label: 'Manage FAQs', icon: <HelpCircle size={20} />, group: 'Content' },
        { id: 'downloads', label: 'Job PDF Downloads', icon: <Download size={20} />, group: 'Content' },
        { id: 'privacy', label: 'Manage Privacy Policy', icon: <Shield size={20} />, group: 'Content' },
        { id: 'terms', label: 'Manage Terms & Conditions', icon: <FileText size={20} />, group: 'Content' },
    ];

    return (
        <div className="min-h-screen bg-[#F0F2F9] flex" style={{ fontFamily: 'Inter, Arial, sans-serif' }}>
            {/* Sidebar */}
            <motion.aside
                initial={false}
                animate={{ width: isSidebarOpen ? '280px' : '88px' }}
                className="text-slate-300 flex flex-col fixed h-screen z-50 shadow-2xl overflow-hidden"
                style={{ background: 'linear-gradient(180deg, #0A0A0A 0%, #000000 100%)' }}
            >
                {/* Sidebar Header */}
                <div className="p-6 flex items-center justify-between h-[88px]" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                    {isSidebarOpen && (
                        <div className="flex items-center gap-3 w-full">
                            {brandingData?.iconUrl ? (
                                <div className="bg-white p-1 rounded-xl h-10 w-10 flex shrink-0 items-center justify-center shadow-lg">
                                    <img src={brandingData?.iconUrl?.startsWith('http') ? brandingData.iconUrl : `${import.meta.env.VITE_API_URL.replace('/api', '')}${brandingData.iconUrl}`} alt="Icon" className="max-h-full max-w-full object-contain" />
                                </div>
                            ) : (
                                <div className="p-2 rounded-xl shrink-0" style={{ background: 'linear-gradient(135deg, #F47920, #D4641A)' }}>
                                    <ShieldCheck className="text-white" size={22} />
                                </div>
                            )}
                            <div className="min-w-0">
                                {brandingData?.logoUrl ? (
                                    <img
                                        src={brandingData.logoUrl.startsWith('http') ? brandingData.logoUrl : `${import.meta.env.VITE_API_URL.replace('/api', '')}${brandingData.logoUrl}`}
                                        alt="Logo"
                                        style={{ height: '32px', width: 'auto' }}
                                        className="object-contain"
                                    />
                                ) : (
                                    <h1 className="text-white font-black text-xl tracking-tight truncate">Ledger<span style={{ color: '#F47920' }}>Bandhu</span></h1>
                                )}
                                <p className="text-[10px] font-bold uppercase tracking-widest leading-none mt-1 truncate" style={{ color: 'rgba(255,255,255,0.3)' }}>Admin Dashboard</p>
                            </div>
                        </div>
                    )}
                    {!isSidebarOpen && (
                        brandingData?.iconUrl ? (
                            <div className="bg-white p-1 rounded-xl h-10 w-10 mx-auto flex items-center justify-center shadow-md">
                                <img src={brandingData?.iconUrl?.startsWith('http') ? brandingData.iconUrl : `${import.meta.env.VITE_API_URL.replace('/api', '')}${brandingData.iconUrl}`} alt="Icon" className="max-h-full max-w-full object-contain" />
                            </div>
                        ) : (
                            <ShieldCheck style={{ color: '#F47920' }} className="mx-auto" size={26} />
                        )
                    )}
                </div>

                {/* Sidebar Content */}
                <div className="flex-1 py-8 px-4 space-y-8 overflow-y-auto custom-scrollbar">
                    {['Main', 'Data', 'Content'].map(group => (
                        <div key={group}>
                            {isSidebarOpen && <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 ml-4" style={{ color: 'rgba(255,255,255,0.25)' }}>{group}</p>}
                            <div className="space-y-1">
                                {sidebarItems.filter(item => item.group === group).map(item => (
                                    <button
                                        key={item.id}
                                        onClick={() => setActiveSection(item.id)}
                                        className={`w-full flex items-center gap-4 p-3.5 rounded-xl transition-all duration-200 group ${activeSection === item.id
                                            ? 'text-white shadow-lg'
                                            : 'hover:text-white'
                                            }`}
                                        style={activeSection === item.id
                                            ? { background: 'linear-gradient(135deg, #000000, #1A1A1A)', boxShadow: '0 4px 20px rgba(0,0,0,0.5)' }
                                            : { background: 'transparent' }
                                        }
                                        onMouseEnter={e => { if (activeSection !== item.id) e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
                                        onMouseLeave={e => { if (activeSection !== item.id) e.currentTarget.style.background = 'transparent'; }}
                                    >
                                        <div className={activeSection === item.id ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'}>
                                            {item.icon}
                                        </div>
                                        {isSidebarOpen && <span className="font-semibold text-sm">{item.label}</span>}
                                        {isSidebarOpen && activeSection === item.id && (
                                            <div className="ml-auto w-1.5 h-1.5 rounded-full" style={{ background: '#F47920', boxShadow: '0 0 8px #F47920' }} />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Sidebar Footer */}
                <div className="p-4" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                    <button
                        onClick={() => { logout(); navigate('/'); }}
                        className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-rose-500/10 hover:text-rose-400 transition-all group font-bold text-sm text-slate-500"
                    >
                        <LogOut size={18} className="group-hover:rotate-12 transition-transform" />
                        {isSidebarOpen && <span>Sign Out</span>}
                    </button>
                </div>
            </motion.aside>

            {/* Main Content Area */}
            <main className={`flex-1 transition-all duration-300 ml-[88px] ${isSidebarOpen ? 'lg:ml-[280px]' : 'ml-[88px]'}`}>
                {/* Top Header */}
                <header className="h-[88px] bg-white border-b border-slate-100 flex items-center justify-between px-8 sticky top-0 z-40 backdrop-blur-md bg-white/90">
                    <div className="flex items-center gap-5">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="p-2.5 rounded-xl text-slate-500 hover:text-[#0A0A0A] transition-colors bg-slate-50 hover:bg-[#0A0A0A]/8"
                        >
                            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                        <div>
                            <h2 className="text-lg font-black text-[#000000] capitalize tracking-tight">
                                {activeSection.replace('-', ' ')}
                            </h2>
                            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">LedgerBandhu Admin</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex flex-col items-end">
                            <p className="text-sm font-black text-[#111D45] capitalize leading-none">{user?.name}</p>
                            <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-widest mt-1">Administrator</p>
                        </div>
                        <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-white font-black shadow-lg text-sm"
                            style={{ background: 'linear-gradient(135deg, #F47920, #D4641A)', boxShadow: '0 4px 16px rgba(244,121,32,0.35)' }}>
                            {user?.name?.charAt(0).toUpperCase()}
                        </div>
                    </div>
                </header>

                {/* Section Content */}
                <div className="p-8 md:p-12">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeSection}
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.02 }}
                            transition={{ duration: 0.2 }}
                        >
                            {activeSection === 'dashboard' && (
                                <div className="space-y-12">
                                    {/* Quick Stats */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                        {[
                                            { label: 'Total Users', value: stats?.totalUsers, icon: <Users size={22} />, grad: 'linear-gradient(135deg,#1B2E6B,#253E8F)', glow: 'rgba(27,46,107,0.2)' },
                                            { label: 'Job Postings', value: stats?.totalJobs, icon: <Briefcase size={22} />, grad: 'linear-gradient(135deg,#F47920,#D4641A)', glow: 'rgba(244,121,32,0.2)' },
                                            { label: 'Applications', value: stats?.totalApplications, icon: <FileText size={22} />, grad: 'linear-gradient(135deg,#10b981,#059669)', glow: 'rgba(16,185,129,0.2)' },
                                            { label: 'Contacts', value: stats?.totalContacts, icon: <MessageSquare size={22} />, grad: 'linear-gradient(135deg,#8b5cf6,#7c3aed)', glow: 'rgba(139,92,246,0.2)' },
                                        ].map((s, i) => (
                                            <div key={i} className="bg-white p-7 rounded-2xl border border-slate-100 shadow-sm group hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
                                                <div className="w-13 h-13 rounded-xl flex items-center justify-center text-white mb-5 group-hover:scale-110 transition-transform duration-300"
                                                    style={{ background: s.grad, boxShadow: `0 6px 20px ${s.glow}`, width: '52px', height: '52px' }}>
                                                    {s.icon}
                                                </div>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">{s.label}</p>
                                                <p className="text-4xl font-black text-[#111D45] tracking-tight">{s.value || 0}</p>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Action Banner */}
                                    <div className="rounded-3xl p-10 md:p-14 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #111D45 0%, #0A1230 100%)' }}>
                                        <div className="absolute top-0 right-0 w-96 h-96 opacity-20 pointer-events-none" style={{ background: 'radial-gradient(circle, #F47920, transparent 70%)', transform: 'translate(30%, -30%)' }} />
                                        <div className="relative z-10">
                                            <div className="flex items-center gap-3 mb-5">
                                                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
                                                <span className="text-xs font-black text-emerald-400 uppercase tracking-[0.3em]">System Online</span>
                                            </div>
                                            <h3 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight mb-5">
                                                Welcome to the<br />
                                                <span style={{ background: 'linear-gradient(90deg,#F47920,#FF8F35)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Admin Control Center</span>
                                            </h3>
                                            <p className="max-w-xl text-white/50 font-medium text-base leading-relaxed mb-10">
                                                Manage content, verify users, approve jobs, and maintain the LedgerBandhu platform — all from one place.
                                            </p>
                                            <div className="flex flex-wrap gap-4">
                                                <button onClick={() => setActiveSection('home')} className="text-white px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 hover:opacity-90"
                                                    style={{ background: 'linear-gradient(135deg,#F47920,#D4641A)', boxShadow: '0 8px 24px rgba(244,121,32,0.4)' }}>
                                                    Edit Frontend Content
                                                </button>
                                                <button onClick={() => setActiveSection('users')} className="px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 text-white/70 hover:text-white hover:bg-white/10" style={{ border: '1px solid rgba(255,255,255,0.15)' }}>
                                                    Manage Users
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeSection === 'home' && (
                                <div className="max-w-4xl space-y-8">
                                    <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm space-y-10">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h3 className="text-2xl font-black text-slate-900 italic">Home Page Content</h3>
                                                <p className="text-slate-400 text-xs italic font-bold mt-1">All fields below are visible on the frontend — changes go live instantly</p>
                                            </div>
                                            <button onClick={() => handleSaveContent('home', homeContent)} className="flex items-center gap-2 text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all active:scale-95" style={{ background: 'linear-gradient(135deg,#F47920,#D4641A)', boxShadow: '0 6px 20px rgba(244,121,32,0.35)' }}>
                                                <Save size={18} /> Update Live
                                            </button>
                                        </div>

                                        {/* ── HERO ── */}
                                        <div>
                                            <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] mb-4 italic border-b border-blue-50 pb-2">🦸 Hero Section</p>
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 italic ml-1">Badge Text (small tag above title)</label>
                                                    <input value={homeContent.heroBadge} onChange={e => setHomeContent({ ...homeContent, heroBadge: e.target.value })} className="w-full bg-slate-50 border-transparent p-4 rounded-2xl font-bold text-slate-700 focus:bg-white focus:border-blue-500 border transition-all outline-none italic text-sm" />
                                                </div>
                                                <div>
                                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 italic ml-1">Main Hero Headline</label>
                                                    <input value={homeContent.heroTitle} onChange={e => setHomeContent({ ...homeContent, heroTitle: e.target.value })} className="w-full bg-slate-50 border-transparent p-5 rounded-2xl font-black text-xl italic text-slate-900 focus:bg-white focus:border-blue-500 border transition-all outline-none" />
                                                </div>
                                                <div>
                                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 italic ml-1">Highlighted Title Text (Orange)</label>
                                                    <input value={homeContent.heroTitleHighlight} onChange={e => setHomeContent({ ...homeContent, heroTitleHighlight: e.target.value })} className="w-full bg-slate-50 border-transparent p-5 rounded-2xl font-black text-xl italic text-slate-900 focus:bg-white focus:border-blue-500 border transition-all outline-none" />
                                                </div>
                                                <div>
                                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 italic ml-1">Hero Subtitle</label>
                                                    <textarea rows={2} value={homeContent.heroSubtitle} onChange={e => setHomeContent({ ...homeContent, heroSubtitle: e.target.value })} className="w-full bg-slate-50 border-transparent p-4 rounded-2xl font-bold text-slate-600 focus:bg-white focus:border-blue-500 border transition-all outline-none italic text-sm" />
                                                </div>
                                            </div>
                                        </div>

                                        {/* ── STATS STRIP ── */}
                                        <div>
                                            <p className="text-[10px] font-black text-orange-500 uppercase tracking-[0.2em] mb-4 italic border-b border-orange-50 pb-2">📊 Statistics Strip</p>
                                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                                                {[1, 2, 3, 4].map(num => (
                                                    <div key={num} className="space-y-3 bg-slate-50/50 p-4 rounded-3xl border border-slate-100">
                                                        <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Stat #{num}</p>
                                                        <div>
                                                            <label className="text-[9px] font-black text-slate-400 uppercase block mb-1 italic ml-1">Value (e.g. 5L+)</label>
                                                            <input
                                                                value={homeContent[`stat${num}Value`]}
                                                                onChange={e => setHomeContent({ ...homeContent, [`stat${num}Value`]: e.target.value })}
                                                                className="w-full bg-white border-transparent p-3 rounded-xl font-black text-lg text-indigo-600 focus:border-indigo-400 border transition-all outline-none text-center"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="text-[9px] font-black text-slate-400 uppercase block mb-1 italic ml-1">Label (e.g. Active Jobs)</label>
                                                            <input
                                                                value={homeContent[`stat${num}Label`]}
                                                                onChange={e => setHomeContent({ ...homeContent, [`stat${num}Label`]: e.target.value })}
                                                                className="w-full bg-white border-transparent p-2.5 rounded-xl font-bold text-slate-500 focus:border-indigo-400 border transition-all outline-none text-center text-xs italic"
                                                            />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* ── SEARCH BAR ── */}
                                        <div>
                                            <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em] mb-4 italic border-b border-indigo-50 pb-2">🔍 Search Bar</p>
                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                                <div>
                                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 italic ml-1">Skills Placeholder</label>
                                                    <input value={homeContent.searchPlaceholder1} onChange={e => setHomeContent({ ...homeContent, searchPlaceholder1: e.target.value })} className="w-full bg-slate-50 border-transparent p-4 rounded-2xl font-bold text-slate-700 focus:bg-white focus:border-blue-500 border transition-all outline-none italic text-sm" />
                                                </div>
                                                <div>
                                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 italic ml-1">Location Placeholder</label>
                                                    <input value={homeContent.searchPlaceholder2} onChange={e => setHomeContent({ ...homeContent, searchPlaceholder2: e.target.value })} className="w-full bg-slate-50 border-transparent p-4 rounded-2xl font-bold text-slate-700 focus:bg-white focus:border-blue-500 border transition-all outline-none italic text-sm" />
                                                </div>
                                                <div>
                                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 italic ml-1">Button Text</label>
                                                    <input value={homeContent.searchButtonText} onChange={e => setHomeContent({ ...homeContent, searchButtonText: e.target.value })} className="w-full bg-slate-50 border-transparent p-4 rounded-2xl font-bold text-slate-700 focus:bg-white focus:border-blue-500 border transition-all outline-none italic text-sm" />
                                                </div>
                                            </div>
                                        </div>

                                        {/* ── CATEGORIES SECTION ── */}
                                        <div>
                                            <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em] mb-4 italic border-b border-emerald-50 pb-2">📂 Popular Categories Section</p>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 italic ml-1">Section Title</label>
                                                    <input value={homeContent.categoriesTitle} onChange={e => setHomeContent({ ...homeContent, categoriesTitle: e.target.value })} className="w-full bg-slate-50 border-transparent p-4 rounded-2xl font-bold text-slate-700 focus:bg-white focus:border-blue-500 border transition-all outline-none italic text-sm" />
                                                </div>
                                                <div>
                                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 italic ml-1">Section Subtitle</label>
                                                    <input value={homeContent.categoriesSubtitle} onChange={e => setHomeContent({ ...homeContent, categoriesSubtitle: e.target.value })} className="w-full bg-slate-50 border-transparent p-4 rounded-2xl font-bold text-slate-700 focus:bg-white focus:border-blue-500 border transition-all outline-none italic text-sm" />
                                                </div>
                                            </div>
                                            <div className="mt-3 bg-slate-50 border border-slate-100 rounded-2xl p-4 text-xs text-slate-400 italic font-bold">
                                                💡 To manage category cards (names, icons), go to <span className="text-indigo-600 cursor-pointer" onClick={() => { setActiveSection('jobs'); setJobTab('categories'); }}>Job Listings → Categories tab</span>
                                            </div>
                                        </div>

                                        {/* ── FEATURED JOBS SECTION ── */}
                                        <div>
                                            <p className="text-[10px] font-black text-purple-500 uppercase tracking-[0.2em] mb-4 italic border-b border-purple-50 pb-2">⭐ Featured Jobs Section</p>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 italic ml-1">Section Title</label>
                                                    <input value={homeContent.featuredJobsTitle} onChange={e => setHomeContent({ ...homeContent, featuredJobsTitle: e.target.value })} className="w-full bg-slate-50 border-transparent p-4 rounded-2xl font-bold text-slate-700 focus:bg-white focus:border-blue-500 border transition-all outline-none italic text-sm" />
                                                </div>
                                                <div>
                                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 italic ml-1">Section Subtitle</label>
                                                    <input value={homeContent.featuredJobsSubtitle} onChange={e => setHomeContent({ ...homeContent, featuredJobsSubtitle: e.target.value })} className="w-full bg-slate-50 border-transparent p-4 rounded-2xl font-bold text-slate-700 focus:bg-white focus:border-blue-500 border transition-all outline-none italic text-sm" />
                                                </div>
                                            </div>
                                            <div className="mt-3 bg-slate-50 border border-slate-100 rounded-2xl p-4 text-xs text-slate-400 italic font-bold">
                                                💡 Featured jobs are the latest <strong>approved</strong> jobs from the database. To add new featured jobs, go to <span className="text-emerald-600 cursor-pointer" onClick={() => { setActiveSection('jobs'); setJobTab('post'); }}>Job Listings → Post New Job</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeSection === 'contact-page' && (
                                <div className="max-w-4xl space-y-8">
                                    <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm space-y-10">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h3 className="text-2xl font-black text-slate-900 italic">Contact Page Content</h3>
                                                <p className="text-slate-400 text-xs italic font-bold mt-1">Changes go live instantly on the /contact page</p>
                                            </div>
                                            <button onClick={() => handleSaveContent('contact', contactPageContent)} className="flex items-center gap-2 text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all active:scale-95" style={{ background: 'linear-gradient(135deg,#F47920,#D4641A)', boxShadow: '0 6px 20px rgba(244,121,32,0.35)' }}>
                                                <Save size={18} /> Update Live
                                            </button>
                                        </div>

                                        {/* ── HERO ── */}
                                        <div>
                                            <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] mb-4 italic border-b border-blue-50 pb-2">🦸 Hero Section</p>
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 italic ml-1">Hero Title</label>
                                                    <input value={contactPageContent.heroTitle} onChange={e => setContactPageContent({ ...contactPageContent, heroTitle: e.target.value })} className="w-full bg-slate-50 border-transparent p-5 rounded-2xl font-black text-xl italic text-slate-900 focus:bg-white focus:border-blue-500 border transition-all outline-none" />
                                                </div>
                                                <div>
                                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 italic ml-1">Hero Subtitle</label>
                                                    <textarea rows={2} value={contactPageContent.heroSubtitle} onChange={e => setContactPageContent({ ...contactPageContent, heroSubtitle: e.target.value })} className="w-full bg-slate-50 border-transparent p-4 rounded-2xl font-bold text-slate-600 focus:bg-white focus:border-blue-500 border transition-all outline-none italic text-sm" />
                                                </div>
                                            </div>
                                        </div>

                                        {/* ── CONTACT INFO ── */}
                                        <div>
                                            <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em] mb-4 italic border-b border-emerald-50 pb-2">📍 Contact Information</p>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-4">
                                                    <div>
                                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 italic ml-1">Address Title</label>
                                                        <input value={contactPageContent.addressTitle} onChange={e => setContactPageContent({ ...contactPageContent, addressTitle: e.target.value })} className="w-full bg-slate-50 border-transparent p-4 rounded-2xl font-bold text-slate-700 focus:bg-white focus:border-blue-500 border transition-all outline-none italic text-sm" />
                                                    </div>
                                                    <div>
                                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 italic ml-1">Address Details</label>
                                                        <textarea rows={2} value={contactPageContent.addressDetails} onChange={e => setContactPageContent({ ...contactPageContent, addressDetails: e.target.value })} className="w-full bg-slate-50 border-transparent p-4 rounded-2xl font-bold text-slate-600 focus:bg-white focus:border-blue-500 border transition-all outline-none italic text-sm" />
                                                    </div>
                                                </div>
                                                <div className="space-y-4">
                                                    <div>
                                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 italic ml-1">Phone Title</label>
                                                        <input value={contactPageContent.phoneTitle} onChange={e => setContactPageContent({ ...contactPageContent, phoneTitle: e.target.value })} className="w-full bg-slate-50 border-transparent p-4 rounded-2xl font-bold text-slate-700 focus:bg-white focus:border-blue-500 border transition-all outline-none italic text-sm" />
                                                    </div>
                                                    <div>
                                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 italic ml-1">Phone Details</label>
                                                        <input value={contactPageContent.phoneDetails} onChange={e => setContactPageContent({ ...contactPageContent, phoneDetails: e.target.value })} className="w-full bg-slate-50 border-transparent p-4 rounded-2xl font-bold text-slate-600 focus:bg-white focus:border-blue-500 border transition-all outline-none italic text-sm" />
                                                    </div>
                                                </div>
                                                <div className="space-y-4 md:col-span-2">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div>
                                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 italic ml-1">Email Title</label>
                                                            <input value={contactPageContent.emailTitle} onChange={e => setContactPageContent({ ...contactPageContent, emailTitle: e.target.value })} className="w-full bg-slate-50 border-transparent p-4 rounded-2xl font-bold text-slate-700 focus:bg-white focus:border-blue-500 border transition-all outline-none italic text-sm" />
                                                        </div>
                                                        <div>
                                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 italic ml-1">Email Details</label>
                                                            <input value={contactPageContent.emailDetails} onChange={e => setContactPageContent({ ...contactPageContent, emailDetails: e.target.value })} className="w-full bg-slate-50 border-transparent p-4 rounded-2xl font-bold text-slate-600 focus:bg-white focus:border-blue-500 border transition-all outline-none italic text-sm" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* === USERS SECTION with Tabs === */}
                            {activeSection === 'users' && (() => {
                                const employers = users.filter(u => u.role === 'employer');
                                const seekers = users.filter(u => u.role === 'seeker');
                                const pendingCount = employers.filter(e => e.approvalStatus === 'pending').length;
                                const currentList = userTab === 'employers' ? employers : seekers;
                                return (
                                    <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-sm overflow-hidden min-h-[600px]">
                                        {/* Tab Header */}
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
                                            <div className="flex gap-3">
                                                <button
                                                    onClick={() => setUserTab('employers')}
                                                    className={`px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all flex items-center gap-2 ${userTab === 'employers' ? 'text-white' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
                                                    style={userTab === 'employers' ? { background: 'linear-gradient(135deg,#1B2E6B,#253E8F)', boxShadow: '0 4px 16px rgba(27,46,107,0.3)' } : {}}
                                                >
                                                    <Briefcase size={14} /> Employers ({employers.length})
                                                    {pendingCount > 0 && <span className="bg-[#F47920] text-white text-[9px] font-black px-2 py-0.5 rounded-full animate-pulse">{pendingCount}</span>}
                                                </button>
                                                <button
                                                    onClick={() => setUserTab('seekers')}
                                                    className={`px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all flex items-center gap-2 ${userTab === 'seekers' ? 'text-white' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
                                                    style={userTab === 'seekers' ? { background: 'linear-gradient(135deg,#1B2E6B,#253E8F)', boxShadow: '0 4px 16px rgba(27,46,107,0.3)' } : {}}
                                                >
                                                    <Users size={14} /> Job Seekers ({seekers.length})
                                                </button>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                {userTab === 'seekers' && selectedSeekers.length > 0 && (
                                                    <button
                                                        onClick={handleBulkDeleteSeekers}
                                                        className="px-5 py-2.5 bg-rose-50 border border-rose-100 rounded-2xl text-[10px] font-black text-rose-500 uppercase tracking-widest italic hover:bg-rose-500 hover:text-white transition-all flex items-center gap-2"
                                                    >
                                                        <Trash size={12} /> Delete Selected ({selectedSeekers.length})
                                                    </button>
                                                )}
                                                <div className="px-5 py-2.5 bg-slate-50 border border-slate-100 rounded-2xl text-[10px] font-black text-slate-400 uppercase tracking-widest italic">
                                                    {currentList.length} Records
                                                </div>
                                            </div>
                                        </div>

                                        <div className="overflow-x-auto">
                                            {userTab === 'employers' ? (
                                                <table className="w-full text-left border-separate border-spacing-y-3">
                                                    <thead>
                                                        <tr className="text-slate-400">
                                                            <th className="px-6 pb-4 text-[10px] font-black uppercase tracking-widest">Employer Info</th>
                                                            <th className="pb-4 text-[10px] font-black uppercase tracking-widest">Company</th>
                                                            <th className="pb-4 text-[10px] font-black uppercase tracking-widest">Approval Status</th>
                                                            <th className="pb-4 text-[10px] font-black uppercase tracking-widest">Joined</th>
                                                            <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-right pr-6">Actions</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {employers.map(emp => (
                                                            <tr key={emp._id} className="group transition-all">
                                                                <td className="px-6 py-6 rounded-l-[2rem] border-y border-l bg-slate-50/40 border-transparent group-hover:bg-slate-50 transition-all">
                                                                    <div className="flex items-center gap-4">
                                                                        <div className="w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm italic bg-white text-slate-400 border border-slate-100 shadow-sm group-hover:text-indigo-500 transition-colors">
                                                                            {emp.name.charAt(0).toUpperCase()}
                                                                        </div>
                                                                        <div>
                                                                            <p className="font-black text-slate-900 text-sm italic">{emp.name}</p>
                                                                            <p className="text-[10px] text-slate-400 font-bold italic">{emp.email}</p>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                                <td className="py-6 border-y bg-slate-50/40 border-transparent group-hover:bg-slate-50 transition-all">
                                                                    <p className="text-sm font-bold text-slate-600 italic">{emp.companyName || <span className="text-slate-300 italic">—</span>}</p>
                                                                </td>
                                                                <td className="py-6 border-y bg-slate-50/40 border-transparent group-hover:bg-slate-50 transition-all">
                                                                    <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl italic ${emp.approvalStatus === 'approved' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' :
                                                                        emp.approvalStatus === 'rejected' ? 'bg-rose-50 text-rose-600 border border-rose-200' :
                                                                            'bg-amber-50 text-amber-600 border border-amber-200 animate-pulse'
                                                                        }`}>
                                                                        {emp.approvalStatus || 'pending'}
                                                                    </span>
                                                                </td>
                                                                <td className="py-6 text-xs font-bold text-slate-400 italic border-y bg-slate-50/40 border-transparent group-hover:bg-slate-50 transition-all">
                                                                    {new Date(emp.createdAt).toLocaleDateString()}
                                                                </td>
                                                                <td className="py-6 rounded-r-[2rem] border-y border-r pr-6 bg-slate-50/40 border-transparent group-hover:bg-slate-50 transition-all">
                                                                    <div className="flex items-center justify-end gap-2">
                                                                        <button onClick={() => setViewingUser(emp)} className="w-9 h-9 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:border-indigo-100 transition-all shadow-sm active:scale-95" title="View Details">
                                                                            <Eye size={14} />
                                                                        </button>
                                                                        {emp.approvalStatus !== 'approved' && (
                                                                            <button
                                                                                onClick={() => handleApproveReject(emp._id, 'approve')}
                                                                                className="px-4 py-2 rounded-xl bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all active:scale-95 shadow-md shadow-emerald-100"
                                                                            >
                                                                                ✓ Approve
                                                                            </button>
                                                                        )}
                                                                        {emp.approvalStatus !== 'rejected' && (
                                                                            <button
                                                                                onClick={() => handleApproveReject(emp._id, 'reject')}
                                                                                className="px-4 py-2 rounded-xl bg-rose-500 text-white text-[10px] font-black uppercase tracking-widest hover:bg-rose-600 transition-all active:scale-95 shadow-md shadow-rose-100"
                                                                            >
                                                                                ✕ Reject
                                                                            </button>
                                                                        )}
                                                                        <button onClick={() => handleDelete('user', emp._id)} className="w-9 h-9 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-300 hover:bg-rose-500 hover:text-white transition-all shadow-sm active:scale-95">
                                                                            <Trash2 size={14} />
                                                                        </button>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                        {employers.length === 0 && <tr><td colSpan="5" className="py-12 text-center text-slate-400 font-bold italic">No employers registered yet.</td></tr>}
                                                    </tbody>
                                                </table>
                                            ) : (
                                                <table className="w-full text-left border-separate border-spacing-y-3">
                                                    <thead>
                                                        <tr className="text-slate-400">
                                                            <th className="px-6 pb-4 w-12">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={selectedSeekers.length === seekers.length && seekers.length > 0}
                                                                    onChange={toggleAllSeekers}
                                                                    className="w-4 h-4 rounded-md border-slate-200 text-[#F47920] focus:ring-[#F47920]"
                                                                />
                                                            </th>
                                                            <th className="pb-4 text-[10px] font-black uppercase tracking-widest">Seeker Info</th>
                                                            <th className="pb-4 text-[10px] font-black uppercase tracking-widest">Skills</th>
                                                            <th className="pb-4 text-[10px] font-black uppercase tracking-widest">Joined</th>
                                                            <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-right pr-6">Actions</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {seekers.map(s => (
                                                            <tr key={s._id} className="group transition-all">
                                                                <td className="px-6 py-6 rounded-l-[2rem] border-y border-l bg-slate-50/40 border-transparent group-hover:bg-slate-50 transition-all">
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={selectedSeekers.includes(s._id)}
                                                                        onChange={() => toggleSeekerSelection(s._id)}
                                                                        className="w-4 h-4 rounded-md border-slate-200 text-[#F47920] focus:ring-[#F47920]"
                                                                    />
                                                                </td>
                                                                <td className="py-6 border-y bg-slate-50/40 border-transparent group-hover:bg-slate-50 transition-all">
                                                                    <div className="flex items-center gap-4">
                                                                        <div className="w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm italic bg-white text-slate-400 border border-slate-100 shadow-sm group-hover:text-[#F47920] transition-colors">
                                                                            {s.name.charAt(0).toUpperCase()}
                                                                        </div>
                                                                        <div>
                                                                            <p className="font-black text-slate-900 text-sm italic">{s.name}</p>
                                                                            <p className="text-[10px] text-slate-400 font-bold italic">{s.email}</p>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                                <td className="py-6 border-y bg-slate-50/40 border-transparent group-hover:bg-slate-50 transition-all">
                                                                    <div className="flex flex-wrap gap-1 max-w-xs">
                                                                        {(s.skills || []).slice(0, 3).map((sk, i) => (
                                                                            <span key={i} className="bg-indigo-50 text-indigo-600 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-lg italic">{sk}</span>
                                                                        ))}
                                                                        {(!s.skills || s.skills.length === 0) && <span className="text-slate-300 italic text-xs">—</span>}
                                                                    </div>
                                                                </td>
                                                                <td className="py-6 text-xs font-bold text-slate-400 italic border-y bg-slate-50/40 border-transparent group-hover:bg-slate-50 transition-all">
                                                                    {new Date(s.createdAt).toLocaleDateString()}
                                                                </td>
                                                                <td className="py-6 rounded-r-[2rem] border-y border-r pr-6 bg-slate-50/40 border-transparent group-hover:bg-slate-50 transition-all text-right">
                                                                    <div className="flex items-center justify-end gap-2">
                                                                        <button onClick={() => setViewingUser(s)} className="w-9 h-9 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-[#F47920] hover:border-[#F4792050] transition-all shadow-sm active:scale-95" title="View Details">
                                                                            <Eye size={14} />
                                                                        </button>
                                                                        <button onClick={() => handleDelete('user', s._id)} className="w-9 h-9 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-300 hover:bg-rose-500 hover:text-white transition-all shadow-sm active:scale-95">
                                                                            <Trash2 size={14} />
                                                                        </button>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                        {seekers.length === 0 && <tr><td colSpan="5" className="py-12 text-center text-slate-400 font-bold italic">No job seekers registered yet.</td></tr>}
                                                    </tbody>
                                                </table>
                                            )}
                                        </div>
                                    </div>
                                );
                            })()}

                            {activeSection === 'ai-news' && (() => {
                                const handleGenerateDigest = async () => {
                                    setAiLoading(true);
                                    try {
                                        const res = await api.post('/news/generate');
                                        alert(res.data.message || 'Daily Digest successfully generated!');
                                        fetchData();
                                    } catch (err) {
                                        console.error("Generation detailed error:", err);
                                        const errorMsg = err.response?.data?.error || err.response?.data?.message || err.message || 'Failed to generate digest';
                                        alert(`Error: ${errorMsg}`);
                                    } finally {
                                        setAiLoading(false);
                                    }
                                };
                                return (
                                    <div className="max-w-5xl space-y-10">
                                        <div className="bg-white p-12 rounded-[3rem] border border-slate-100 shadow-sm relative overflow-hidden">
                                            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 blur-[80px] -mr-32 -mt-32" />
                                            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                                                <div>
                                                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-50 text-orange-600 border border-orange-100 font-black text-[10px] uppercase tracking-widest mb-4">
                                                        <Sparkles size={14} /> AI Content Engine
                                                    </div>
                                                    <h3 className="text-3xl font-black text-slate-900 tracking-tight mb-4">Daily News <span className="text-[#F47920] italic">Generator</span></h3>
                                                    <p className="max-w-md text-slate-400 font-bold text-sm leading-relaxed">
                                                        Automatically fetch today's top Indian finance headlines and generate a premium blog post for your website and SEO.
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={handleGenerateDigest}
                                                    disabled={aiLoading}
                                                    className="flex items-center justify-center gap-3 bg-[#F47920] text-white px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#D4641A] transition-all shadow-xl shadow-orange-500/20 active:scale-95 disabled:opacity-50 min-w-[240px]"
                                                >
                                                    {aiLoading ? (
                                                        <>
                                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                            AI Printing News...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Newspaper size={18} /> Generate Today's Digest
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </div>

                                        <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-sm relative">
                                            {/* Bulk Action Bar for News */}
                                            <AnimatePresence>
                                                {selectedNews.length > 0 && (
                                                    <motion.div
                                                        initial={{ y: 20, opacity: 0 }}
                                                        animate={{ y: 0, opacity: 1 }}
                                                        exit={{ y: 20, opacity: 0 }}
                                                        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-50 flex items-center gap-6 bg-slate-900 text-white px-8 py-4 rounded-[2rem] shadow-2xl border border-white/10"
                                                    >
                                                        <div className="flex items-center gap-3 border-r border-white/20 pr-6">
                                                            <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-[10px] font-black">
                                                                {selectedNews.length}
                                                            </div>
                                                            <span className="text-xs font-black uppercase tracking-widest italic">Selected</span>
                                                        </div>
                                                        <div className="flex items-center gap-4">
                                                            <button
                                                                onClick={handleBulkDeleteNews}
                                                                className="flex items-center gap-2 text-rose-400 hover:text-rose-300 transition-colors font-black text-[10px] uppercase tracking-widest italic"
                                                            >
                                                                <Trash2 size={16} /> Delete Selected
                                                            </button>
                                                            <button
                                                                onClick={() => setSelectedNews([])}
                                                                className="text-white/50 hover:text-white transition-colors font-black text-[10px] uppercase tracking-widest italic"
                                                            >
                                                                Deselect All
                                                            </button>
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>

                                            <div className="flex items-center justify-between mb-8 px-4">
                                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] italic">Posted News Archive</h4>
                                                <button 
                                                    onClick={async () => {
                                                        try {
                                                            const res = await api.post('/news/fix-thumbnails');
                                                            alert(res.data.message);
                                                            fetchData();
                                                        } catch (err) {
                                                            alert('Failed to refresh thumbnails');
                                                        }
                                                    }}
                                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-50 text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 transition-all font-black text-[9px] uppercase tracking-widest border border-slate-100"
                                                >
                                                    <Image size={14} /> Refresh Archive Thumbnails
                                                </button>
                                            </div>
                                            
                                            {aiNewsPosts.length === 0 ? (
                                                <div className="py-20 text-center border-2 border-dashed border-slate-50 rounded-[2.5rem]">
                                                    <Newspaper size={48} className="mx-auto text-slate-100 mb-6" />
                                                    <p className="text-slate-300 font-bold italic">The news agent is ready. Click the button above to generate your first SEO-powered news post.</p>
                                                </div>
                                            ) : (
                                                <div className="overflow-x-auto">
                                                    <table className="w-full text-left">
                                                        <thead>
                                                            <tr className="border-b border-slate-50">
                                                                <th className="pb-6 pl-4 w-12">
                                                                    <button
                                                                        onClick={toggleAllNews}
                                                                        className={`w-5 h-5 rounded-lg border-2 transition-all flex items-center justify-center ${selectedNews.length === aiNewsPosts.length && aiNewsPosts.length > 0 ? 'bg-orange-600 border-orange-600' : 'border-slate-200 hover:border-slate-300 bg-white'}`}
                                                                    >
                                                                        {selectedNews.length === aiNewsPosts.length && aiNewsPosts.length > 0 && <Check size={12} className="text-white" />}
                                                                    </button>
                                                                </th>
                                                                <th className="pb-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Article Title</th>
                                                                <th className="pb-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date Published</th>
                                                                <th className="pb-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right pr-4">Actions</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="divide-y divide-slate-50">
                                                            {aiNewsPosts.map(post => (
                                                                <tr key={post._id} className={`group hover:bg-slate-50/50 transition-all ${selectedNews.includes(post._id) ? 'bg-orange-50/30' : ''}`}>
                                                                    <td className="py-6 pl-4">
                                                                        <button
                                                                            onClick={() => toggleNewsSelection(post._id)}
                                                                            className={`w-5 h-5 rounded-lg border-2 transition-all flex items-center justify-center ${selectedNews.includes(post._id) ? 'bg-orange-600 border-orange-600' : 'border-slate-200 hover:border-orange-400 bg-white'}`}
                                                                        >
                                                                            {selectedNews.includes(post._id) && <Check size={12} className="text-white" />}
                                                                        </button>
                                                                    </td>
                                                                    <td className="py-6">
                                                                        <div>
                                                                            <p className="font-black text-slate-900 text-sm italic">{post.title}</p>
                                                                            <p className="text-[10px] text-slate-400 font-bold italic mt-0.5">Slug: {post.slug}</p>
                                                                        </div>
                                                                    </td>
                                                                    <td className="py-6 text-xs font-bold text-slate-400 italic">
                                                                        {new Date(post.publishedAt).toLocaleDateString()}
                                                                    </td>
                                                                    <td className="py-6 pr-4">
                                                                        <div className="flex items-center justify-end gap-3">
                                                                            <Link 
                                                                                to={`/daily-digest/${post.slug}`} 
                                                                                target="_blank"
                                                                                className="w-10 h-10 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:bg-[#F47920] hover:text-white transition-all shadow-sm active:scale-95"
                                                                            >
                                                                                <Eye size={16} />
                                                                            </Link>
                                                                            <button 
                                                                                onClick={async () => {
                                                                                    if (window.confirm('Delete this AI News Digest?')) {
                                                                                        try {
                                                                                            await api.delete(`/news/${post._id}`);
                                                                                            fetchData();
                                                                                        } catch (err) {
                                                                                            alert('Failed to delete digest');
                                                                                        }
                                                                                    }
                                                                                }}
                                                                                className="w-10 h-10 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-300 hover:bg-rose-500 hover:text-white transition-all shadow-sm active:scale-95"
                                                                            >
                                                                                <Trash2 size={16} />
                                                                            </button>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })()}

                            {/* === JOBS SECTION === */}
                            {activeSection === 'jobs' && (() => {
                                const employerJobs = jobs.filter(j => !j.postedByAdmin);
                                const adminJobs = jobs.filter(j => j.postedByAdmin);
                                const pendingJobs = jobs.filter(j => j.jobStatus === 'pending');

                                const stripHtml = (html) => {
                                    const tmp = document.createElement("DIV");
                                    tmp.innerHTML = html;
                                    return tmp.textContent || tmp.innerText || "";
                                };

                                const TabBtn = ({ id, label, icon, count, color, badge }) => (
                                    <button onClick={() => setJobTab(id)} className={`px-5 py-2.5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center gap-2 ${jobTab === id ? `bg-${color}-600 text-white shadow-lg shadow-${color}-200` : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}>
                                        {icon} {label} {count !== undefined && `(${count})`}
                                        {badge > 0 && <span className="bg-rose-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full animate-pulse">{badge}</span>}
                                    </button>
                                );

                                const EditJobModal = () => {
                                    if (!editingJob) return null;
                                    return (
                                        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[9999] flex justify-center items-center p-4">
                                            <div className="bg-white max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl p-8 relative">
                                                <button onClick={() => setEditingJob(null)} className="absolute top-6 right-6 w-10 h-10 bg-slate-50 hover:bg-rose-50 hover:text-rose-600 rounded-full flex items-center justify-center text-slate-500 transition-all font-bold"><X size={18} /></button>
                                                <h3 className="text-2xl font-black text-slate-800 italic mb-6">Edit Job: {editingJob.title}</h3>
                                                <form onSubmit={handleUpdateJobBtnSubmit} className="space-y-6">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div className="space-y-1">
                                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Job Title</label>
                                                            <input type="text" required className="w-full bg-slate-50 border border-slate-100 p-3 rounded-2xl font-bold text-slate-800 focus:bg-white focus:border-indigo-400 outline-none transition-all text-sm" value={editJobData.title} onChange={e => setEditJobData({...editJobData, title: e.target.value})} />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Category</label>
                                                            <select required className="w-full bg-slate-50 border border-slate-100 p-3 rounded-2xl font-bold text-slate-800 focus:bg-white focus:border-indigo-400 outline-none transition-all text-sm appearance-none" value={editJobData.category} onChange={e => setEditJobData({...editJobData, category: e.target.value})}>
                                                                <option value="">Select Category</option>
                                                                {categories.map(c => <option key={c._id} value={c.name}>{c.name}</option>)}
                                                            </select>
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Location</label>
                                                            <input type="text" required className="w-full bg-slate-50 border border-slate-100 p-3 rounded-2xl font-bold text-slate-800 focus:bg-white focus:border-indigo-400 outline-none transition-all text-sm" value={editJobData.location} onChange={e => setEditJobData({...editJobData, location: e.target.value})} />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Salary</label>
                                                            <input type="text" className="w-full bg-slate-50 border border-slate-100 p-3 rounded-2xl font-bold text-slate-800 focus:bg-white focus:border-indigo-400 outline-none transition-all text-sm" value={editJobData.salary} onChange={e => setEditJobData({...editJobData, salary: e.target.value})} />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Openings</label>
                                                            <input type="number" min="1" className="w-full bg-slate-50 border border-slate-100 p-3 rounded-2xl font-bold text-slate-800 focus:bg-white focus:border-indigo-400 outline-none transition-all text-sm" value={editJobData.openings} onChange={e => setEditJobData({...editJobData, openings: e.target.value})} />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Experience Level</label>
                                                            <select className="w-full bg-slate-50 border border-slate-100 p-3 rounded-2xl font-bold text-slate-800 focus:bg-white focus:border-indigo-400 outline-none transition-all text-sm appearance-none" value={editJobData.experienceLevel} onChange={e => setEditJobData({...editJobData, experienceLevel: e.target.value})}>
                                                                {['0-2 Years', '2-5 Years', '5-10 Years', '10+ Years'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                                            </select>
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Education Level</label>
                                                            <select className="w-full bg-slate-50 border border-slate-100 p-3 rounded-2xl font-bold text-slate-800 focus:bg-white focus:border-indigo-400 outline-none transition-all text-sm appearance-none" value={editJobData.educationLevel} onChange={e => setEditJobData({...editJobData, educationLevel: e.target.value})}>
                                                                {['10th', '12th', 'ITI', 'Diploma', 'Graduation', 'Post Grad', 'PhD'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                                            </select>
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Deadline</label>
                                                            <input type="date" className="w-full bg-slate-50 border border-slate-100 p-3 rounded-2xl font-bold text-slate-800 focus:bg-white focus:border-indigo-400 outline-none transition-all text-sm" value={editJobData.deadline} onChange={e => setEditJobData({...editJobData, deadline: e.target.value})} />
                                                        </div>
                                                        <div className="flex items-center gap-3 pt-4">
                                                            <input 
                                                                type="checkbox" 
                                                                id="edit-isSponsored"
                                                                checked={editJobData.isSponsored} 
                                                                onChange={e => setEditJobData({...editJobData, isSponsored: e.target.checked})}
                                                                className="w-5 h-5 accent-indigo-600 rounded-lg cursor-pointer"
                                                            />
                                                            <label htmlFor="edit-isSponsored" className="text-sm font-black text-slate-700 italic cursor-pointer">Sponsor this job (Promote to top)</label>
                                                        </div>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Requirements (Comma Separated)</label>
                                                        <textarea className="w-full bg-slate-50 border border-slate-100 p-3 rounded-2xl font-bold text-slate-800 focus:bg-white focus:border-indigo-400 outline-none transition-all text-sm" rows="2" value={editJobData.requirements.join(', ')} onChange={e => setEditJobData({...editJobData, requirements: e.target.value.split(',').map(r => r.trim()).filter(Boolean)})}/>
                                                    </div>
                                                    <div className="space-y-1 pb-10">
                                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Description</label>
                                                        <div className="bg-white rounded-2xl overflow-hidden border border-slate-100">
                                                            <ReactQuill theme="snow" value={editJobData.description} onChange={val => setEditJobData({...editJobData, description: val})} className="h-48" />
                                                        </div>
                                                    </div>
                                                    <div className="pt-6 border-t border-slate-100 flex justify-end gap-3 pb-8">
                                                        <button type="button" onClick={() => setEditingJob(null)} className="px-6 py-3 rounded-xl bg-slate-100 text-slate-600 font-black text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-all">Cancel</button>
                                                        <button type="submit" disabled={editJobLoading} className="px-8 py-3 rounded-xl bg-indigo-600 text-white font-black text-[10px] uppercase tracking-widest hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-[0_4px_14px_rgba(79,70,229,0.3)] min-w-[140px] justify-center">{editJobLoading ? 'Saving...' : <><Save size={14}/> Save Changes</>}</button>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    );
                                };

                                const JobRow = ({ j }) => (
                                    <tr key={j._id} className={`group transition-all ${selectedJobs.includes(j._id) ? 'translate-x-2' : ''}`}>
                                        <td className={`px-6 py-5 rounded-l-[2rem] border-y border-l transition-all ${selectedJobs.includes(j._id) ? 'bg-indigo-50 border-indigo-100' : 'bg-slate-50/40 border-transparent group-hover:bg-slate-50'}`}>
                                            <input
                                                type="checkbox"
                                                checked={selectedJobs.includes(j._id)}
                                                onChange={() => toggleJobSelection(j._id)}
                                                className="w-4 h-4 rounded-md border-slate-200 text-indigo-600 focus:ring-indigo-600"
                                            />
                                        </td>
                                        <td className={`py-5 pr-4 border-y transition-all ${selectedJobs.includes(j._id) ? 'bg-indigo-50 border-indigo-100' : 'bg-slate-50/40 border-transparent group-hover:bg-slate-50'}`}>
                                            <p className="font-black text-slate-900 text-sm italic leading-tight">{j.title}</p>
                                            <div className="flex flex-wrap items-center gap-2 mt-0.5">
                                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-2 py-0.5 bg-white rounded-md border border-slate-100">{j.category}</span>
                                                <span className="text-[9px] font-black text-indigo-500 uppercase tracking-widest px-2 py-0.5 bg-white rounded-md border border-indigo-100">{j.experienceLevel || '0-2 Yrs'}</span>
                                                <span className="text-[9px] font-black text-purple-500 uppercase tracking-widest px-2 py-0.5 bg-white rounded-md border border-purple-100">{j.educationLevel || 'Graduation'}</span>
                                                {j.openings && <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest px-2 py-0.5 bg-white rounded-md border border-emerald-100">{j.openings} Openings</span>}
                                                {j.isSponsored && <span className="text-[9px] font-black text-amber-500 uppercase tracking-widest px-2 py-0.5 bg-white rounded-md border border-amber-200 shadow-sm animate-pulse">Sponsored</span>}
                                            </div>
                                        </td>
                                        <td className={`py-5 pr-4 border-y transition-all ${selectedJobs.includes(j._id) ? 'bg-indigo-50 border-indigo-100' : 'bg-slate-50/40 border-transparent group-hover:bg-slate-50'}`}>
                                            <p className="text-xs font-bold text-slate-600 italic">{j.employerId?.companyName || j.employerId?.name || '—'}</p>
                                            <p className="text-[10px] text-slate-400 italic">{j.employerId?.email || ''}</p>
                                        </td>
                                        <td className={`py-5 pr-4 border-y transition-all ${selectedJobs.includes(j._id) ? 'bg-indigo-50 border-indigo-100' : 'bg-slate-50/40 border-transparent group-hover:bg-slate-50'}`}>
                                            <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl italic border bg-white ${j.jobStatus === 'approved' ? 'text-emerald-600 border-emerald-200 shadow-sm' : j.jobStatus === 'rejected' ? 'text-rose-600 border-rose-200 shadow-sm' : 'text-amber-600 border-amber-200 shadow-sm animate-pulse'}`}>
                                                {j.jobStatus}
                                            </span>
                                        </td>
                                        <td className={`py-5 pr-4 border-y transition-all ${selectedJobs.includes(j._id) ? 'bg-indigo-50 border-indigo-100' : 'bg-slate-50/40 border-transparent group-hover:bg-slate-50'}`}><p className="text-xs font-bold text-slate-400 italic flex items-center gap-1"><MapPin size={11} />{j.location}</p></td>
                                        <td className={`py-5 pr-4 border-y transition-all ${selectedJobs.includes(j._id) ? 'bg-indigo-50 border-indigo-100' : 'bg-slate-50/40 border-transparent group-hover:bg-slate-50'}`}><p className="text-xs font-bold text-slate-400 italic">{new Date(j.createdAt).toLocaleDateString()}</p></td>
                                        <td className={`py-5 text-right w-28 rounded-r-[2rem] border-y border-r transition-all ${selectedJobs.includes(j._id) ? 'bg-indigo-50 border-indigo-100' : 'bg-slate-50/40 border-transparent group-hover:bg-slate-50'}`}>
                                            <div className="flex items-center justify-end gap-2 ml-auto pr-4">
                                                <button onClick={() => handleEditJobClick(j)} title="Edit Job" className="w-9 h-9 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:border-indigo-200 transition-all shadow-sm active:scale-95">
                                                    <Pencil size={14} />
                                                </button>
                                                <button onClick={() => handleDelete('job', j._id)} title="Delete Job" className="w-9 h-9 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-300 hover:bg-rose-500 hover:text-white hover:border-rose-500 transition-all shadow-sm active:scale-95">
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );

                                const JobTable = ({ list, empty }) => (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left border-separate border-spacing-y-3">
                                            <thead>
                                                <tr className="text-slate-400">
                                                    <th className="px-6 py-4 w-12">
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedJobs.length === list.length && list.length > 0}
                                                            onChange={() => toggleAllJobs(list)}
                                                            className="w-4 h-4 rounded-md border-slate-200 text-indigo-600 focus:ring-indigo-600"
                                                        />
                                                    </th>
                                                    <th className="pb-4 text-[10px] font-black uppercase tracking-widest pr-4">Job Title</th>
                                                    <th className="pb-4 text-[10px] font-black uppercase tracking-widest pr-4">Company</th>
                                                    <th className="pb-4 text-[10px] font-black uppercase tracking-widest pr-4">Status</th>
                                                    <th className="pb-4 text-[10px] font-black uppercase tracking-widest pr-4">Location</th>
                                                    <th className="pb-4 text-[10px] font-black uppercase tracking-widest pr-4">Date</th>
                                                    <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-right pr-4">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {list.map(j => <JobRow key={j._id} j={j} />)}
                                                {list.length === 0 && <tr><td colSpan="7" className="py-14 text-center text-slate-400 font-bold italic">{empty}</td></tr>}
                                            </tbody>
                                        </table>
                                    </div>
                                );

                                return (
                                    <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-sm overflow-hidden min-h-[600px] relative">
                                        <EditJobModal />
                                        
                                        {/* Tab Row */}
                                        <div className="flex flex-wrap gap-2 mb-10">
                                            <button onClick={() => setJobTab('employer')}
                                                className={`px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center gap-2 ${jobTab === 'employer' ? 'text-white' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
                                                style={jobTab === 'employer' ? { background: 'linear-gradient(135deg,#1B2E6B,#253E8F)', boxShadow: '0 4px 16px rgba(27,46,107,0.3)' } : {}}>
                                                🏢 Employer Jobs ({employerJobs.length})
                                            </button>
                                            <button onClick={() => setJobTab('admin')}
                                                className={`px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center gap-2 ${jobTab === 'admin' ? 'text-white' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
                                                style={jobTab === 'admin' ? { background: 'linear-gradient(135deg,#1B2E6B,#253E8F)', boxShadow: '0 4px 16px rgba(27,46,107,0.3)' } : {}}>
                                                🛡 Admin Jobs ({adminJobs.length})
                                            </button>
                                            <button onClick={() => setJobTab('pending')} className={`px-5 py-2.5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center gap-2 ${jobTab === 'pending' ? 'bg-amber-500 text-white shadow-lg shadow-amber-200' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}>
                                                <Activity size={13} /> Pending Review
                                                {pendingJobs.length > 0 && <span className="bg-rose-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full animate-pulse">{pendingJobs.length}</span>}
                                            </button>
                                            <button onClick={() => setJobTab('categories')} className={`px-5 py-2.5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center gap-2 ${jobTab === 'categories' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}>
                                                <Layers size={13} /> Categories ({categories.length})
                                            </button>
                                            <button onClick={() => setJobTab('post')} className={`px-5 py-2.5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center gap-2 ${jobTab === 'post' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}>
                                                <Plus size={13} /> Post New Job
                                            </button>
                                            {selectedJobs.length > 0 && (
                                                <button
                                                    onClick={handleBulkDeleteJobs}
                                                    className="px-5 py-2.5 bg-rose-50 border border-rose-100 rounded-2xl text-[10px] font-black text-rose-500 uppercase tracking-widest italic hover:bg-rose-500 hover:text-white transition-all flex items-center gap-2 ml-auto"
                                                >
                                                    <Trash size={12} /> Delete Selected ({selectedJobs.length})
                                                </button>
                                            )}
                                        </div>

                                        {/* EMPLOYER JOBS TAB */}
                                        {jobTab === 'employer' && <JobTable list={employerJobs} empty="No employer-posted jobs yet." />}

                                        {/* ADMIN JOBS TAB */}
                                        {jobTab === 'admin' && <JobTable list={adminJobs} empty="No admin-posted jobs yet. Use Post New Job to add one." />}

                                        {/* PENDING REVIEW TAB */}
                                        {jobTab === 'pending' && (
                                            pendingJobs.length === 0 ? (
                                                <div className="py-20 text-center">
                                                    <div className="text-5xl mb-4">✅</div>
                                                    <p className="text-slate-400 font-black italic text-lg">All clear! No pending jobs.</p>
                                                </div>
                                            ) : (
                                                <div className="overflow-x-auto">
                                                    <table className="w-full text-left border-separate border-spacing-y-3">
                                                        <thead>
                                                            <tr className="text-slate-400">
                                                                <th className="px-6 pb-4 text-[10px] font-black uppercase tracking-widest">Job Details</th>
                                                                <th className="pb-4 text-[10px] font-black uppercase tracking-widest">Submitted By</th>
                                                                <th className="pb-4 text-[10px] font-black uppercase tracking-widest">Location / Salary</th>
                                                                <th className="pb-4 text-[10px] font-black uppercase tracking-widest">Date</th>
                                                                <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-right pr-6">Decision</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {pendingJobs.map(j => (
                                                                <tr key={j._id} className="group transition-all">
                                                                    <td className="px-6 py-6 rounded-l-[2rem] border-y border-l bg-slate-50/40 border-transparent group-hover:bg-slate-50 transition-all">
                                                                        <p className="font-black text-slate-900 text-sm italic">{j.title}</p>
                                                                        <div className="flex items-center gap-2 mt-0.5 mb-1">
                                                                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-2 py-0.5 bg-white rounded-md border border-slate-100">{j.category}</span>
                                                                            <span className="text-[9px] font-black text-indigo-500 uppercase tracking-widest px-2 py-0.5 bg-white rounded-md border border-indigo-100">{j.experienceLevel || '0-2 Yrs'}</span>
                                                                        </div>
                                                                        <p className="text-[10px] text-slate-500 italic mt-1 max-w-xs line-clamp-2">{stripHtml(j.description)}</p>
                                                                    </td>
                                                                    <td className="py-6 pr-4 border-y bg-slate-50/40 border-transparent group-hover:bg-slate-50 transition-all">
                                                                        <p className="text-sm font-bold text-slate-700 italic">{j.employerId?.companyName || '—'}</p>
                                                                        <p className="text-[10px] text-slate-400 italic">{j.employerId?.email}</p>
                                                                    </td>
                                                                    <td className="py-6 pr-4 border-y bg-slate-50/40 border-transparent group-hover:bg-slate-50 transition-all">
                                                                        <p className="text-xs font-bold text-slate-500 italic flex items-center gap-1"><MapPin size={11} />{j.location}</p>
                                                                        <p className="text-[10px] text-slate-400 italic mt-1 flex items-center gap-1"><CircleDollarSign size={11} className="text-[#F47920]" /> {j.salary || "Not disclosed"}</p>
                                                                    </td>
                                                                    <td className="py-6 text-xs font-bold text-slate-400 italic pr-4 border-y bg-slate-50/40 border-transparent group-hover:bg-slate-50 transition-all">{new Date(j.createdAt).toLocaleDateString()}</td>
                                                                    <td className="py-6 pr-6 rounded-r-[2rem] border-y border-r bg-slate-50/40 border-transparent group-hover:bg-slate-50 transition-all">
                                                                        <div className="flex items-center justify-end gap-2">
                                                                            <button onClick={() => handleJobApproveReject(j._id, 'approve')} className="px-4 py-2 rounded-xl bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all active:scale-95 shadow-sm">✓ Approve</button>
                                                                            <button onClick={() => handleJobApproveReject(j._id, 'reject')} className="px-4 py-2 rounded-xl bg-rose-500 text-white text-[10px] font-black uppercase tracking-widest hover:bg-rose-600 transition-all active:scale-95 shadow-sm">✕ Reject</button>
                                                                            <button onClick={() => handleDelete('job', j._id)} className="w-9 h-9 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-300 hover:bg-rose-500 hover:text-white transition-all shadow-sm active:scale-95"><Trash2 size={14} /></button>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            )
                                        )}

                                        {/* CATEGORIES TAB */}
                                        {jobTab === 'categories' && (
                                            <div className="space-y-8">
                                                {/* Add category form */}
                                                <form onSubmit={handleAddCategory} className="flex flex-col md:flex-row gap-4 flex-wrap bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
                                                    <div className="flex-1 min-w-[200px] space-y-1">
                                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Name</label>
                                                        <input
                                                            required
                                                            value={newCategoryName}
                                                            onChange={e => setNewCategoryName(e.target.value)}
                                                            placeholder="e.g. Legal, Logistics"
                                                            className="w-full bg-slate-50 border border-slate-100 p-3 rounded-2xl font-bold text-slate-800 focus:bg-white focus:border-indigo-400 outline-none transition-all italic text-sm"
                                                        />
                                                    </div>
                                                    <div className="flex flex-col md:flex-row gap-4 flex-1">
                                                        <div className="flex-1 space-y-1">
                                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Icon/Image</label>
                                                            <div className="w-full h-[46px] bg-slate-50 border border-slate-100 px-3 rounded-2xl hover:bg-white transition-all flex items-center overflow-hidden">
                                                                <input
                                                                    type="file"
                                                                    accept="image/*"
                                                                    onChange={e => setNewCategoryImage(e.target.files[0])}
                                                                    className="w-full text-xs text-slate-500 file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-[10px] file:font-black file:uppercase file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer truncate"
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="w-full md:w-auto flex items-end">
                                                        <button type="submit" disabled={catLoading} className="w-full md:w-auto h-[46px] flex items-center justify-center gap-2 bg-indigo-600 text-white px-8 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-[0_8px_20px_rgba(79,70,229,0.25)] active:scale-95 disabled:opacity-50 shrink-0">
                                                            <Plus size={14} /> {catLoading ? 'Adding...' : 'Add'}
                                                        </button>
                                                    </div>
                                                </form>

                                                {/* Category grid */}
                                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                                    {categories.map(cat => (
                                                        <div key={cat._id} className="group bg-slate-50 hover:bg-indigo-50 border border-slate-100 hover:border-indigo-200 rounded-[1.5rem] transition-all overflow-hidden flex flex-col">
                                                            {editingCatId === cat._id ? (
                                                                /* ── EDIT MODE ── */
                                                                <div className="p-5 flex flex-col h-full gap-3">
                                                                    <div className="space-y-3 flex-1">
                                                                        <input
                                                                            value={editCatName}
                                                                            onChange={e => setEditCatName(e.target.value)}
                                                                            className="w-full bg-white border border-indigo-200 p-2.5 rounded-xl font-bold text-slate-800 text-sm outline-none focus:border-indigo-400 focus:shadow-[0_0_0_3px_rgba(129,140,248,0.2)] transition-all"
                                                                            placeholder="Category name"
                                                                        />
                                                                        <div className="bg-white border border-slate-100 rounded-xl p-2 hover:border-indigo-200 transition-all">
                                                                            <input
                                                                                type="file"
                                                                                accept="image/*"
                                                                                onChange={e => setEditCatImage(e.target.files[0])}
                                                                                className="w-full text-[10px] text-slate-500 file:mr-3 file:py-1 file:px-3 file:rounded-full file:border-0 file:font-bold file:uppercase file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex gap-2 shrink-0 mt-auto">
                                                                        <button
                                                                            onClick={() => handleUpdateCategory(cat._id)}
                                                                            disabled={editCatLoading}
                                                                            className="flex-1 flex items-center justify-center gap-1.5 bg-indigo-600 text-white py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-50"
                                                                        >
                                                                            <Check size={12} /> {editCatLoading ? 'Saving...' : 'Save'}
                                                                        </button>
                                                                        <button
                                                                            onClick={() => setEditingCatId(null)}
                                                                            className="flex-1 flex items-center justify-center gap-1.5 bg-slate-200 text-slate-600 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-300 transition-all active:scale-95"
                                                                        >
                                                                            <X size={12} /> Cancel
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                /* ── VIEW MODE ── */
                                                                <div className="p-5 flex items-center justify-between h-full">
                                                                    <div className="flex items-center gap-3 overflow-hidden">
                                                                        {cat.image ? (
                                                                            <img src={cat.image} alt={cat.name} className="w-10 h-10 object-contain shrink-0 rounded-lg bg-white p-1 border border-slate-100" />
                                                                        ) : (
                                                                            <div className="w-10 h-10 rounded-lg bg-slate-200 flex items-center justify-center shrink-0">
                                                                                <Briefcase size={16} className="text-slate-400" />
                                                                            </div>
                                                                        )}
                                                                        <div className="overflow-hidden">
                                                                            <span className="text-sm font-black text-slate-800 italic block truncate" title={cat.name}>{cat.name}</span>
                                                                            {cat.count ? <span className="text-[10px] text-slate-400 font-semibold">{cat.count}</span> : null}
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-all shrink-0 ml-2">
                                                                        <button
                                                                            onClick={() => handleStartEditCategory(cat)}
                                                                            className="w-7 h-7 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:bg-indigo-500 hover:text-white hover:border-indigo-500 transition-all shadow-sm active:scale-95"
                                                                            title="Edit category"
                                                                        >
                                                                            <Pencil size={12} />
                                                                        </button>
                                                                        <button
                                                                            onClick={() => handleDeleteCategory(cat._id)}
                                                                            className="w-7 h-7 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-300 hover:bg-rose-500 hover:text-white hover:border-rose-500 transition-all shadow-sm active:scale-95"
                                                                            title="Delete category"
                                                                        >
                                                                            <Trash2 size={12} />
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                                {categories.length === 0 && <p className="text-center text-slate-400 italic font-bold py-12">No categories found. Add one above.</p>}
                                            </div>
                                        )}

                                        {/* POST NEW JOB TAB */}
                                        {jobTab === 'post' && (
                                            <form onSubmit={handleAdminPostJob} className="max-w-2xl space-y-6">
                                                <div className="bg-purple-50 border border-purple-100 rounded-2xl p-4 flex items-start gap-3">
                                                    <ShieldCheck className="text-purple-500 mt-0.5 shrink-0" size={18} />
                                                    <p className="text-purple-700 font-bold text-xs italic">Admin-posted jobs are <strong>instantly approved</strong> and go live on the frontend immediately.</p>
                                                </div>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                                    <div>
                                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 italic ml-1">Job Title *</label>
                                                        <input required value={newJob.title} onChange={e => setNewJob({ ...newJob, title: e.target.value })} placeholder="e.g. Senior React Developer" className="w-full bg-slate-50 border border-transparent p-4 rounded-2xl font-bold text-slate-800 focus:bg-white focus:border-blue-400 outline-none transition-all italic text-sm" />
                                                    </div>
                                                    <div>
                                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 italic ml-1">Category *</label>
                                                        <select required value={newJob.category} onChange={e => setNewJob({ ...newJob, category: e.target.value })} className="w-full bg-slate-50 border border-transparent p-4 rounded-2xl font-bold text-slate-800 focus:bg-white focus:border-blue-400 outline-none transition-all italic text-sm">
                                                            <option value="">Select category</option>
                                                            {categories.map(c => <option key={c._id} value={c.name}>{c.icon} {c.name}</option>)}
                                                        </select>
                                                    </div>
                                                    <div>
                                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 italic ml-1">Location *</label>
                                                        <input required value={newJob.location} onChange={e => setNewJob({ ...newJob, location: e.target.value })} placeholder="e.g. Bangalore, Remote" className="w-full bg-slate-50 border border-transparent p-4 rounded-2xl font-bold text-slate-800 focus:bg-white focus:border-blue-400 outline-none transition-all italic text-sm" />
                                                    </div>
                                                    <div>
                                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 italic ml-1">Salary / CTC (Optional)</label>
                                                        <input value={newJob.salary} onChange={e => setNewJob({ ...newJob, salary: e.target.value })} placeholder="e.g. ₹8–12 LPA / Not disclosed" className="w-full bg-slate-50 border border-transparent p-4 rounded-2xl font-bold text-slate-800 focus:bg-white focus:border-blue-400 outline-none transition-all italic text-sm" />
                                                    </div>
                                                    <div>
                                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 italic ml-1">Number of Openings</label>
                                                        <input type="number" min="1" value={newJob.openings} onChange={e => setNewJob({ ...newJob, openings: e.target.value })} placeholder="e.g. 1" className="w-full bg-slate-50 border border-transparent p-4 rounded-2xl font-bold text-slate-800 focus:bg-white focus:border-blue-400 outline-none transition-all italic text-sm" />
                                                    </div>
                                                    <div>
                                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 italic ml-1">Application Deadline</label>
                                                        <input type="date" value={newJob.deadline} onChange={e => setNewJob({ ...newJob, deadline: e.target.value })} className="w-full bg-slate-50 border border-transparent p-4 rounded-2xl font-bold text-slate-800 focus:bg-white focus:border-blue-400 outline-none transition-all italic text-sm" />
                                                    </div>
                                                    <div>
                                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 italic ml-1">Education Level</label>
                                                        <select value={newJob.educationLevel} onChange={e => setNewJob({ ...newJob, educationLevel: e.target.value })} className="w-full bg-slate-50 border border-transparent p-4 rounded-2xl font-bold text-slate-800 focus:bg-white focus:border-blue-400 outline-none transition-all italic text-sm">
                                                            {['10th', '12th', 'ITI', 'Diploma', 'Graduation', 'Post Grad', 'PhD'].map(lvl => <option key={lvl} value={lvl}>{lvl}</option>)}
                                                        </select>
                                                    </div>
                                                    <div>
                                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 italic ml-1">Experience Level</label>
                                                        <select value={newJob.experienceLevel} onChange={e => setNewJob({ ...newJob, experienceLevel: e.target.value })} className="w-full bg-slate-50 border border-transparent p-4 rounded-2xl font-bold text-slate-800 focus:bg-white focus:border-blue-400 outline-none transition-all italic text-sm">
                                                            {['0-2 Years', '2-5 Years', '5-10 Years', '10+ Years'].map(lvl => <option key={lvl} value={lvl}>{lvl}</option>)}
                                                        </select>
                                                    </div>
                                                    <div className="flex items-center gap-3 pt-4 col-span-1 sm:col-span-2">
                                                        <input 
                                                            type="checkbox" 
                                                            id="isSponsored"
                                                            checked={newJob.isSponsored} 
                                                            onChange={e => setNewJob({ ...newJob, isSponsored: e.target.checked })}
                                                            className="w-6 h-6 accent-emerald-600 rounded-xl cursor-pointer"
                                                        />
                                                        <label htmlFor="isSponsored" className="text-sm font-black text-slate-700 italic cursor-pointer uppercase tracking-widest">Sponsor this job (Priority Placement)</label>
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 italic ml-1">Requirements (comma separated)</label>
                                                    <input value={newJob.requirements} onChange={e => setNewJob({ ...newJob, requirements: e.target.value })} placeholder="CA, CMA, ACCA" className="w-full bg-slate-50 border border-transparent p-4 rounded-2xl font-bold text-slate-800 focus:bg-white focus:border-blue-400 outline-none transition-all italic text-sm" />
                                                </div>
                                                <div className="mb-12">
                                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 italic ml-1">Job Description *</label>
                                                    <div className="bg-slate-50 border border-transparent rounded-2xl overflow-hidden focus-within:bg-white focus-within:border-blue-400 transition-all font-medium text-slate-800 italic text-sm">
                                                        <ReactQuill
                                                            theme="snow"
                                                            value={newJob.description}
                                                            onChange={val => setNewJob({ ...newJob, description: val })}
                                                            placeholder="Describe the role, responsibilities..."
                                                            className="h-48 border-none"
                                                        />
                                                    </div>
                                                </div>
                                                <button type="submit" disabled={jobPostLoading} className="flex items-center gap-3 bg-emerald-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 active:scale-95 disabled:opacity-50">
                                                    {jobPostLoading ? 'Posting...' : <><Plus size={16} /> Post Job Immediately</>}
                                                </button>
                                            </form>
                                        )}
                                    </div>
                                );
                            })()}





                            {/* === REGISTRATION FORMS SECTION === */}
                            {activeSection === 'forms' && (
                                <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-sm overflow-hidden min-h-[600px]">
                                    {/* Header */}
                                    <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                                        <div>
                                            <h2 className="text-3xl font-black text-slate-900 italic">Registration Form Manager</h2>
                                            <p className="text-slate-400 text-sm font-bold italic mt-1">Control what fields appear on the Seeker & Employer registration forms</p>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {[
                                                { id: 'fields', label: '⚙️ Manage Fields', count: formFields.length },
                                                { id: 'add', label: '➕ Add Field', count: null },
                                                { id: 'data', label: '📋 Registrations', count: registrations.length },
                                            ].map(t => (
                                                <button key={t.id} onClick={() => setRegTab(t.id)}
                                                    className={`px-5 py-2.5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center gap-2 ${regTab === t.id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}>
                                                    {t.label}{t.count !== null && <span className="bg-white/20 text-[10px] px-2 py-0.5 rounded-full">{t.count}</span>}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* TAB: MANAGE FIELDS */}
                                    {regTab === 'fields' && (
                                        <div>
                                            <div className="flex flex-wrap gap-3 mb-8 bg-slate-50 p-2 rounded-[1.5rem] w-fit border border-slate-100">
                                                {['All Fields', 'Seeker Fields', 'Employer Fields'].map((lbl, i) => (
                                                    <button key={i} className={`text-[10px] font-black uppercase tracking-widest px-5 py-2.5 rounded-xl transition-all ${i === 0 ? 'bg-white text-indigo-600 border border-slate-200 shadow-sm' : 'bg-transparent text-slate-400 hover:bg-slate-100 hover:text-slate-600 border border-transparent'}`}>{lbl}</button>
                                                ))}
                                            </div>
                                            <div className="space-y-4">
                                                {formFields.map(field => (
                                                    <div key={field._id} className="flex flex-col sm:flex-row sm:items-center justify-between p-6 rounded-[2rem] border border-transparent bg-slate-50/40 hover:bg-white hover:border-indigo-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                                                        <div className="flex items-start sm:items-center gap-5">
                                                            <div className={`shrink-0 w-12 h-12 rounded-[1.25rem] flex items-center justify-center font-black text-xl shadow-sm border ${field.type === 'file' ? 'bg-blue-50 text-blue-500 border-blue-100' : field.isCore ? 'bg-slate-100 text-slate-400 border-slate-200' : 'bg-indigo-50 text-indigo-500 border-indigo-100'}`}>
                                                                {field.type === 'file' ? '📄' : field.type === 'password' ? '🔑' : field.isCore ? '🔒' : '✏️'}
                                                            </div>
                                                            <div>
                                                                <div className="flex flex-wrap items-center gap-3">
                                                                    <p className="font-black text-slate-900 text-lg italic leading-none">{field.label}</p>
                                                                    <span className="text-[10px] text-slate-400 font-bold italic leading-none sm:mt-1">{field.fieldName}</span>
                                                                </div>
                                                                <div className="flex flex-wrap items-center gap-2 mt-3">
                                                                    <span className="text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-xl bg-slate-100 text-slate-500 border border-slate-200 shadow-sm">{field.type}</span>
                                                                    <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-xl border shadow-sm ${field.forRole === 'seeker' ? 'bg-cyan-50 text-cyan-600 border-cyan-100' : field.forRole === 'employer' ? 'bg-purple-50 text-purple-600 border-purple-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>{field.forRole}</span>
                                                                    {field.required && <span className="text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-xl border bg-rose-50 text-rose-600 border-rose-100 shadow-sm">required</span>}
                                                                    {field.isCore && <span className="text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-xl border bg-amber-50 text-amber-600 border-amber-200 shadow-sm">core</span>}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-3 mt-5 sm:mt-0 pt-5 sm:pt-0 border-t sm:border-none border-slate-100 w-full sm:w-auto justify-end">
                                                            {/* Toggle active */}
                                                            <button onClick={async () => {
                                                                const res = await api.patch(`/admin/form-fields/${field._id}/toggle`).catch(() => null);
                                                                if (res) setFormFields(prev => prev.map(f => f._id === field._id ? res.data : f));
                                                            }} className={`w-11 h-11 rounded-[1rem] flex items-center justify-center transition-all shadow-sm active:scale-95 border ${field.isActive ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white border-emerald-200 hover:border-emerald-500 hover:shadow-emerald-200' : 'bg-white text-slate-300 hover:bg-slate-200 hover:text-slate-500 border-slate-100'}`} title={field.isActive ? 'Active – click to disable' : 'Disabled – click to enable'}>
                                                                {field.isActive ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                                                            </button>
                                                            {/* Delete (only non-core) */}
                                                            {!field.isCore && (
                                                                <button onClick={async () => {
                                                                    await api.delete(`/admin/form-fields/${field._id}`).catch(() => null);
                                                                    setFormFields(prev => prev.filter(f => f._id !== field._id));
                                                                }} className="w-11 h-11 rounded-[1rem] bg-white border border-slate-100 flex items-center justify-center text-slate-300 hover:bg-rose-500 hover:text-white transition-all shadow-sm active:scale-95 hover:shadow-rose-200">
                                                                    <Trash2 size={16} />
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* TAB: ADD FIELD */}
                                    {regTab === 'add' && (
                                        <div className="max-w-lg">
                                            <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 mb-6 text-indigo-700 text-xs font-bold italic">
                                                ℹ️ Custom fields are saved to the database and automatically appear on the registration form. <strong>fieldName</strong> becomes the data key (e.g., <code>linkedin_url</code>).
                                            </div>
                                            <form className="space-y-4" onSubmit={async (e) => {
                                                e.preventDefault();
                                                const payload = { ...newField, options: newField.options ? newField.options.split(',').map(s => s.trim()) : [] };
                                                const res = await api.post('/admin/form-fields', payload).catch(err => {
                                                    alert(err.response?.data?.message || 'Error adding field'); return null;
                                                });
                                                if (res) {
                                                    setFormFields(prev => [...prev, res.data]);
                                                    setNewField({ fieldName: '', label: '', type: 'text', placeholder: '', required: false, forRole: 'both', options: '' });
                                                    setRegTab('fields');
                                                }
                                            }}>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 italic ml-1">Field Name (key) *</label>
                                                        <input required value={newField.fieldName} onChange={e => setNewField({ ...newField, fieldName: e.target.value })} placeholder="e.g. linkedin_url" className="w-full bg-slate-50 border border-transparent p-4 rounded-2xl font-bold text-slate-800 focus:bg-white focus:border-indigo-400 outline-none transition-all italic text-sm" />
                                                    </div>
                                                    <div>
                                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 italic ml-1">Display Label *</label>
                                                        <input required value={newField.label} onChange={e => setNewField({ ...newField, label: e.target.value })} placeholder="e.g. LinkedIn Profile URL" className="w-full bg-slate-50 border border-transparent p-4 rounded-2xl font-bold text-slate-800 focus:bg-white focus:border-indigo-400 outline-none transition-all italic text-sm" />
                                                    </div>
                                                    <div>
                                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 italic ml-1">Field Type</label>
                                                        <select value={newField.type} onChange={e => setNewField({ ...newField, type: e.target.value })} className="w-full bg-slate-50 border border-transparent p-4 rounded-2xl font-bold text-slate-800 focus:bg-white focus:border-indigo-400 outline-none transition-all italic text-sm">
                                                            {['text', 'email', 'tel', 'number', 'url', 'date', 'textarea', 'select', 'file'].map(t => <option key={t} value={t}>{t}</option>)}
                                                        </select>
                                                    </div>
                                                    <div>
                                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 italic ml-1">Show For</label>
                                                        <select value={newField.forRole} onChange={e => setNewField({ ...newField, forRole: e.target.value })} className="w-full bg-slate-50 border border-transparent p-4 rounded-2xl font-bold text-slate-800 focus:bg-white focus:border-indigo-400 outline-none transition-all italic text-sm">
                                                            <option value="both">Both (Seeker & Employer)</option>
                                                            <option value="seeker">Seeker Only</option>
                                                            <option value="employer">Employer Only</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 italic ml-1">Placeholder Text</label>
                                                    <input value={newField.placeholder} onChange={e => setNewField({ ...newField, placeholder: e.target.value })} placeholder="e.g. https://linkedin.com/in/yourname" className="w-full bg-slate-50 border border-transparent p-4 rounded-2xl font-bold text-slate-800 focus:bg-white focus:border-indigo-400 outline-none transition-all italic text-sm" />
                                                </div>
                                                {newField.type === 'select' && (
                                                    <div>
                                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 italic ml-1">Options (comma-separated)</label>
                                                        <input value={newField.options} onChange={e => setNewField({ ...newField, options: e.target.value })} placeholder="e.g. Option 1, Option 2, Option 3" className="w-full bg-slate-50 border border-transparent p-4 rounded-2xl font-bold text-slate-800 focus:bg-white focus:border-indigo-400 outline-none transition-all italic text-sm" />
                                                    </div>
                                                )}
                                                <label className="flex items-center gap-3 cursor-pointer group">
                                                    <input type="checkbox" checked={newField.required} onChange={e => setNewField({ ...newField, required: e.target.checked })} className="w-5 h-5 rounded-lg accent-indigo-600" />
                                                    <span className="text-sm font-bold text-slate-600 italic">Mark as required field</span>
                                                </label>
                                                <button type="submit" className="flex items-center gap-2 bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 active:scale-95">
                                                    <Plus size={16} /> Add Field to Form
                                                </button>
                                            </form>
                                        </div>
                                    )}

                                    {/* TAB: REGISTRATIONS DATA */}
                                    {regTab === 'data' && (
                                        <div>
                                            {/* Role filter */}
                                            <div className="flex gap-2 mb-6">
                                                {[['all', 'All Registrations'], ['seeker', '👤 Seekers'], ['employer', '🏢 Employers']].map(([v, l]) => (
                                                    <button key={v} onClick={() => setRegRoleFilter(v)}
                                                        className={`px-5 py-2.5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${regRoleFilter === v ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}>
                                                        {l} ({registrations.filter(r => v === 'all' || r.role === v).length})
                                                    </button>
                                                ))}
                                            </div>
                                            <div className="overflow-x-auto">
                                                <table className="w-full text-left">
                                                    <thead>
                                                        <tr className="border-b border-slate-50">
                                                            <th className="pb-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Name / Email</th>
                                                            <th className="pb-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Role</th>
                                                            <th className="pb-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Phone</th>
                                                            <th className="pb-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Details</th>
                                                            <th className="pb-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Resume</th>
                                                            <th className="pb-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Registered</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-slate-50">
                                                        {registrations
                                                            .filter(r => regRoleFilter === 'all' || r.role === regRoleFilter)
                                                            .map(reg => (
                                                                <tr key={reg._id} className="group hover:bg-slate-50/50 transition-colors">
                                                                    <td className="py-5">
                                                                        <p className="font-black text-slate-900 text-sm italic">{reg.name}</p>
                                                                        <p className="text-[10px] text-slate-400 italic">{reg.email}</p>
                                                                    </td>
                                                                    <td className="py-5">
                                                                        <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl border ${reg.role === 'seeker' ? 'bg-cyan-50 text-cyan-600 border-cyan-200' : 'bg-purple-50 text-purple-600 border-purple-200'}`}>
                                                                            {reg.role}
                                                                        </span>
                                                                    </td>
                                                                    <td className="py-5 text-xs font-bold text-slate-500 italic">{reg.phone || '—'}</td>
                                                                    <td className="py-5">
                                                                        {reg.role === 'seeker' ? (
                                                                            <div>
                                                                                {reg.skills?.length > 0 && <p className="text-[10px] text-slate-500 italic max-w-[160px] truncate">🛠 {reg.skills.join(', ')}</p>}
                                                                                {Object.entries(reg.extraFields || {}).map(([k, v]) => <p key={k} className="text-[10px] text-slate-400 italic">{k}: {v}</p>)}
                                                                            </div>
                                                                        ) : (
                                                                            <div>
                                                                                {reg.companyName && <p className="text-xs font-bold text-slate-700 italic">🏢 {reg.companyName}</p>}
                                                                                {reg.companyDescription && <p className="text-[10px] text-slate-400 italic max-w-[160px] truncate">{reg.companyDescription}</p>}
                                                                                {Object.entries(reg.extraFields || {}).map(([k, v]) => <p key={k} className="text-[10px] text-slate-400 italic">{k}: {v}</p>)}
                                                                            </div>
                                                                        )}
                                                                    </td>
                                                                    <td className="py-5">
                                                                        {reg.resumeUrl ? (
                                                                            <a href={formatResumeUrl(reg.resumeUrl)} target="_blank" rel="noreferrer"
                                                                                className="flex items-center gap-1.5 text-blue-600 font-black text-xs italic hover:text-blue-800 transition-colors">
                                                                                <Download size={13} /> Resume
                                                                            </a>
                                                                        ) : <span className="text-slate-300 text-xs italic">No resume</span>}
                                                                    </td>
                                                                    <td className="py-5 text-xs font-bold text-slate-400 italic">{new Date(reg.createdAt).toLocaleDateString()}</td>
                                                                </tr>
                                                            ))}
                                                        {registrations.filter(r => regRoleFilter === 'all' || r.role === regRoleFilter).length === 0 && (
                                                            <tr><td colSpan="6" className="py-16 text-center text-slate-400 font-bold italic">No registrations found.</td></tr>
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* === APPLICATIONS SECTION === */}
                            {activeSection === 'applications' && (() => {
                                const ApplicationDetailModal = () => {
                                    if (!viewingApplication) return null;
                                    const app = viewingApplication;
                                    return (
                                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
                                            <motion.div
                                                initial={{ scale: 0.9, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-[3rem] shadow-2xl relative"
                                            >
                                                <button onClick={() => setViewingApplication(null)} className="absolute top-8 right-8 w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-rose-500 hover:text-white transition-all z-10">
                                                    <X size={20} />
                                                </button>
                                                <div className="p-12">
                                                    <div className="flex items-center gap-4 mb-8">
                                                        <div className="w-16 h-16 rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-2xl font-black italic">
                                                            {app.applicantId?.name?.charAt(0).toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <h3 className="text-2xl font-black text-slate-900 italic">{app.applicantId?.name}</h3>
                                                            <p className="text-slate-400 font-bold italic">{app.applicantId?.email}</p>
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-8 mb-8">
                                                        <div className="space-y-1">
                                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block italic">Applied For</label>
                                                            <p className="text-sm font-bold text-slate-800 italic">{app.jobId?.title}</p>
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block italic">Application Date</label>
                                                            <p className="text-sm font-bold text-slate-800 italic">{new Date(app.createdAt).toLocaleString()}</p>
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block italic">Status</label>
                                                            <span className={`inline-block text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl border mt-1 ${app.status === 'accepted' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : app.status === 'rejected' ? 'bg-rose-50 text-rose-600 border-rose-200' : 'bg-amber-50 text-amber-600 border-amber-200'}`}>
                                                                {app.status || 'pending'}
                                                            </span>
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block italic">Phone Number</label>
                                                            <p className="text-sm font-bold text-slate-800 italic">{app.applicantId?.phone || 'Not provided'}</p>
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block italic">Skills</label>
                                                            <div className="flex flex-wrap gap-2 mt-1">
                                                                {app.applicantId?.skills?.length > 0 ? app.applicantId.skills.map((sk, i) => (
                                                                    <span key={i} className="bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-lg italic border border-indigo-100">{sk}</span>
                                                                )) : <span className="text-sm font-bold text-slate-400 italic">No skills listed</span>}
                                                            </div>
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block italic">Resume</label>
                                                            {(app.resumeUrl || app.applicantId?.resumeUrl) ? (
                                                                <a 
                                                                    href={formatResumeUrl(app.resumeUrl || app.applicantId?.resumeUrl)} 
                                                                    target="_blank" 
                                                                    rel="noreferrer" 
                                                                    className="flex items-center gap-2 text-indigo-600 font-bold text-sm italic hover:text-indigo-800 transition-colors mt-1"
                                                                >
                                                                    <Download size={14} /> View Resume
                                                                </a>
                                                            ) : <p className="text-sm font-bold text-slate-300 italic">No resume uploaded</p>}
                                                        </div>
                                                    </div>

                                                    {app.jobId?.externalUrl && (
                                                        <div className="mb-8 p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                                                            <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">External Link</p>
                                                            <a href={app.jobId.externalUrl} target="_blank" rel="noreferrer" className="text-indigo-600 font-bold text-sm flex items-start gap-2 hover:text-indigo-800 transition-colors">
                                                                <ExternalLink size={16} className="shrink-0 mt-0.5" /> 
                                                                <span className="break-all line-clamp-3">{app.jobId.externalUrl}</span>
                                                            </a>
                                                        </div>
                                                    )}

                                                    <div className="flex gap-4">
                                                        <button onClick={() => setViewingApplication(null)} className="flex-1 bg-slate-900 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all active:scale-95">
                                                            Close Details
                                                        </button>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        </div>
                                    );
                                };

                                return (
                                    <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-sm overflow-hidden min-h-[600px] relative">
                                        <ApplicationDetailModal />
                                        <div className="flex justify-between items-center mb-10">
                                        <div>
                                            <h2 className="text-3xl font-black text-slate-900 italic">Job Applications</h2>
                                            <p className="text-slate-400 text-sm font-bold italic mt-1">Manage and track candidate submissions</p>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            {selectedApplications.length > 0 && (
                                                <button
                                                    onClick={handleBulkDeleteApplications}
                                                    className="px-5 py-2.5 bg-rose-50 border border-rose-100 rounded-2xl text-[10px] font-black text-rose-500 uppercase tracking-widest italic hover:bg-rose-500 hover:text-white transition-all flex items-center gap-2"
                                                >
                                                    <Trash size={12} /> Delete Selected ({selectedApplications.length})
                                                </button>
                                            )}
                                            <div className="px-5 py-2.5 bg-slate-50 border border-slate-100 rounded-2xl text-[10px] font-black text-slate-400 uppercase tracking-widest italic">
                                                {applications.length} Total
                                            </div>
                                        </div>
                                    </div>

                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left border-separate border-spacing-y-3">
                                            <thead>
                                                <tr className="text-slate-400">
                                                    <th className="px-6 py-4">
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedApplications.length === applications.length && applications.length > 0}
                                                            onChange={toggleAllApplications}
                                                            className="w-4 h-4 rounded-md border-slate-200 text-indigo-600 focus:ring-indigo-600"
                                                        />
                                                    </th>
                                                    <th className="pb-4 text-[10px] font-black uppercase tracking-widest">Applicant</th>
                                                    <th className="pb-4 text-[10px] font-black uppercase tracking-widest">Applied For</th>
                                                    <th className="pb-4 text-[10px] font-black uppercase tracking-widest">Source</th>
                                                    <th className="pb-4 text-[10px] font-black uppercase tracking-widest">Status</th>
                                                    <th className="pb-4 text-[10px] font-black uppercase tracking-widest">Date</th>
                                                    <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-right pr-6">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {applications.map(app => (
                                                    <tr key={app._id} className={`group transition-all ${selectedApplications.includes(app._id) ? 'translate-x-2' : ''}`}>
                                                        <td className={`px-6 py-6 rounded-l-[2rem] border-y border-l transition-all ${selectedApplications.includes(app._id) ? 'bg-indigo-50 border-indigo-100' : 'bg-slate-50/40 border-transparent group-hover:bg-slate-50'}`}>
                                                            <input
                                                                type="checkbox"
                                                                checked={selectedApplications.includes(app._id)}
                                                                onChange={() => toggleApplicationSelection(app._id)}
                                                                className="w-4 h-4 rounded-md border-slate-200 text-indigo-600 focus:ring-indigo-600"
                                                            />
                                                        </td>
                                                        <td className={`py-6 border-y transition-all ${selectedApplications.includes(app._id) ? 'bg-indigo-50 border-indigo-100' : 'bg-slate-50/40 border-transparent group-hover:bg-slate-50'}`}>
                                                            <p className="font-black text-slate-900 text-sm italic">{app.applicantId?.name}</p>
                                                            <p className="text-[10px] text-slate-400 italic">{app.applicantId?.email}</p>
                                                        </td>
                                                        <td className={`py-6 border-y transition-all ${selectedApplications.includes(app._id) ? 'bg-indigo-50 border-indigo-100' : 'bg-slate-50/40 border-transparent group-hover:bg-slate-50'}`}>
                                                            <p className="text-sm font-bold text-slate-600 italic">{app.jobId?.title}</p>
                                                        </td>
                                                        <td className={`py-6 border-y transition-all ${selectedApplications.includes(app._id) ? 'bg-indigo-50 border-indigo-100' : 'bg-slate-50/40 border-transparent group-hover:bg-slate-50'}`}>
                                                            {app.jobId?.externalUrl ? (
                                                                <a href={app.jobId.externalUrl} target="_blank" rel="noreferrer" className="text-indigo-600 hover:text-indigo-800 flex items-center gap-1 font-bold text-xs italic">
                                                                    <ExternalLink size={14} /> External Link
                                                                </a>
                                                            ) : (
                                                                <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest bg-white px-2 py-1 rounded-md border border-slate-100">Internal</span>
                                                            )}
                                                        </td>
                                                        <td className={`py-6 border-y transition-all ${selectedApplications.includes(app._id) ? 'bg-indigo-50 border-indigo-100' : 'bg-slate-50/40 border-transparent group-hover:bg-slate-50'}`}>
                                                            <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl italic border bg-white ${app.status === 'accepted' ? 'text-emerald-600 border-emerald-200 shadow-sm' : app.status === 'rejected' ? 'text-rose-600 border-rose-200 shadow-sm' : 'text-amber-600 border-amber-200 shadow-sm'}`}>{app.status || 'pending'}</span>
                                                        </td>
                                                        <td className={`py-6 text-xs font-bold text-slate-400 italic border-y transition-all ${selectedApplications.includes(app._id) ? 'bg-indigo-50 border-indigo-100' : 'bg-slate-50/40 border-transparent group-hover:bg-slate-50'}`}>
                                                            {new Date(app.createdAt).toLocaleDateString()}
                                                        </td>
                                                        <td className={`py-6 pr-6 rounded-r-[2rem] border-y border-r transition-all text-right ${selectedApplications.includes(app._id) ? 'bg-indigo-50 border-indigo-100' : 'bg-slate-50/40 border-transparent group-hover:bg-slate-50'}`}>
                                                            <div className="flex items-center justify-end gap-2">
                                                                <button
                                                                    onClick={() => setViewingApplication(app)}
                                                                    className="w-9 h-9 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:border-indigo-200 transition-all shadow-sm active:scale-95"
                                                                    title="View Details"
                                                                >
                                                                    <Eye size={14} />
                                                                </button>
                                                                <button onClick={() => handleDelete('application', app._id)} className="w-9 h-9 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-300 hover:bg-rose-500 hover:text-white transition-all shadow-sm active:scale-95">
                                                                    <Trash2 size={14} />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                                {applications.length === 0 && <tr><td colSpan="7" className="py-12 text-center text-slate-400 font-bold italic">No applications submitted yet.</td></tr>}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            );
                        })()}

                            {/* === CONTACT SUBMISSIONS SECTION === */}
                            {activeSection === 'contacts' && (
                                <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-sm overflow-hidden min-h-[600px] relative">
                                    <div className="flex flex-wrap justify-between items-center mb-10 gap-4">
                                        <div>
                                            <h2 className="text-3xl font-black text-slate-900 italic">Contact Submissions</h2>
                                            <p className="text-slate-400 text-sm font-bold italic mt-1">Messages from the Contact Us page</p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            {selectedContacts.length > 0 && (
                                                <button
                                                    onClick={handleBulkDeleteContacts}
                                                    className="px-5 py-2.5 bg-rose-50 border border-rose-100 rounded-2xl text-[10px] font-black text-rose-500 uppercase tracking-widest italic hover:bg-rose-500 hover:text-white transition-all flex items-center gap-2"
                                                >
                                                    <Trash size={12} /> Delete Selected ({selectedContacts.length})
                                                </button>
                                            )}
                                            <div className="px-5 py-2.5 bg-rose-50 border border-rose-100 rounded-2xl text-[10px] font-black text-rose-400 uppercase tracking-widest italic">
                                                {contacts.filter(c => !c.isRead).length} New
                                            </div>
                                            <div className="px-5 py-2.5 bg-slate-50 border border-slate-100 rounded-2xl text-[10px] font-black text-slate-400 uppercase tracking-widest italic">
                                                {contacts.length} Total
                                            </div>
                                        </div>
                                    </div>

                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left border-separate border-spacing-y-3">
                                            <thead>
                                                <tr className="text-slate-400">
                                                    <th className="px-6 py-4">
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedContacts.length === contacts.length && contacts.length > 0}
                                                            onChange={toggleAllContacts}
                                                            className="w-4 h-4 rounded-md border-slate-200 text-indigo-600 focus:ring-indigo-600"
                                                        />
                                                    </th>
                                                    <th className="pb-4 text-[10px] font-black uppercase tracking-widest">Sender Info</th>
                                                    <th className="pb-4 text-[10px] font-black uppercase tracking-widest">Message Segment</th>
                                                    <th className="pb-4 text-[10px] font-black uppercase tracking-widest">Status</th>
                                                    <th className="pb-4 text-[10px] font-black uppercase tracking-widest">Date</th>
                                                    <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-right pr-6">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {contacts.map(contact => (
                                                    <tr
                                                        key={contact._id}
                                                        className={`group transition-all ${selectedContacts.includes(contact._id) ? 'translate-x-2' : ''}`}
                                                    >
                                                        <td className={`px-6 py-8 rounded-l-[2rem] border-y border-l transition-all ${selectedContacts.includes(contact._id) ? 'bg-indigo-50 border-indigo-100' : 'bg-slate-50/40 border-transparent group-hover:bg-slate-50'}`}>
                                                            <input
                                                                type="checkbox"
                                                                checked={selectedContacts.includes(contact._id)}
                                                                onChange={() => toggleContactSelection(contact._id)}
                                                                className="w-4 h-4 rounded-md border-slate-200 text-indigo-600 focus:ring-indigo-600"
                                                            />
                                                        </td>
                                                        <td className={`py-8 border-y transition-all ${selectedContacts.includes(contact._id) ? 'bg-indigo-50 border-indigo-100' : 'bg-slate-50/40 border-transparent group-hover:bg-slate-50'}`}>
                                                            <div className="flex items-center gap-4">
                                                                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm italic transition-all ${!contact.isRead ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-white text-slate-400 border border-slate-100'}`}>
                                                                    {contact.name.charAt(0).toUpperCase()}
                                                                </div>
                                                                <div>
                                                                    <p className="font-black text-slate-900 text-sm italic">{contact.name}</p>
                                                                    <p className="text-[10px] text-slate-400 font-bold italic">{contact.email}</p>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className={`py-8 border-y transition-all ${selectedContacts.includes(contact._id) ? 'bg-indigo-50 border-indigo-100' : 'bg-slate-50/40 border-transparent group-hover:bg-slate-50'}`}>
                                                            <div className="cursor-pointer group/msg" onClick={() => setViewingContact(contact)}>
                                                                <p className="text-sm font-bold text-slate-600 italic max-w-xs line-clamp-2 leading-relaxed group-hover/msg:text-indigo-600 transition-colors">
                                                                    {contact.message}
                                                                </p>
                                                                <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest opacity-0 group-hover/msg:opacity-100 transition-opacity">Click to read full</span>
                                                            </div>
                                                        </td>
                                                        <td className={`py-8 border-y transition-all ${selectedContacts.includes(contact._id) ? 'bg-indigo-50 border-indigo-100' : 'bg-slate-50/40 border-transparent group-hover:bg-slate-50'}`}>
                                                            <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl italic border shadow-sm ${contact.isRead ? 'bg-white text-slate-400 border-slate-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100 shadow-emerald-50'}`}>
                                                                {contact.isRead ? 'Archived' : 'Active Inquiry'}
                                                            </span>
                                                        </td>
                                                        <td className={`py-8 border-y transition-all ${selectedContacts.includes(contact._id) ? 'bg-indigo-50 border-indigo-100' : 'bg-slate-50/40 border-transparent group-hover:bg-slate-50'}`}>
                                                            <div className="text-xs font-bold text-slate-400 italic">
                                                                {new Date(contact.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                                                                <p className="text-[9px] opacity-50">{new Date(contact.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                                            </div>
                                                        </td>
                                                        <td className={`py-8 rounded-r-[2rem] border-y border-r text-right pr-6 transition-all ${selectedContacts.includes(contact._id) ? 'bg-indigo-50 border-indigo-100' : 'bg-slate-50/40 border-transparent group-hover:bg-slate-50'}`}>
                                                            <div className="flex items-center justify-end gap-2">
                                                                <button
                                                                    onClick={() => setViewingContact(contact)}
                                                                    className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:bg-indigo-600 hover:text-white transition-all shadow-sm active:scale-95"
                                                                    title="View Details"
                                                                >
                                                                    <Eye size={16} />
                                                                </button>
                                                                {!contact.isRead && (
                                                                    <button
                                                                        onClick={() => handleMarkContactRead(contact._id)}
                                                                        className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all shadow-sm active:scale-95"
                                                                        title="Mark as Resolved"
                                                                    >
                                                                        <Check size={16} />
                                                                    </button>
                                                                )}
                                                                <button
                                                                    onClick={() => handleDelete('contact', contact._id)}
                                                                    className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-300 hover:bg-rose-500 hover:text-white transition-all shadow-sm active:scale-95"
                                                                >
                                                                    <Trash2 size={16} />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                                {contacts.length === 0 && (
                                                    <tr>
                                                        <td colSpan="6" className="py-24 text-center">
                                                            <div className="text-5xl mb-6 grayscale opacity-20">📭</div>
                                                            <p className="text-slate-400 font-black italic text-lg uppercase tracking-widest">No messages yet</p>
                                                            <p className="text-slate-300 text-xs font-bold italic mt-2">When someone contacts you, their message will appear here.</p>
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}



                            {/* ══════════════════════════════════════════════════════
                                HEADER & FOOTER CMS SECTION
                            ══════════════════════════════════════════════════════ */}
                            {activeSection === 'header-footer' && (() => {
                                // ---------- helpers ----------
                                const saveHeader = async () => {
                                    setHfSaving(true);
                                    try {
                                        await api.post('/cms/page', { pageName: 'header', content: headerContent });
                                        alert('Header saved! Navbar will reflect changes.');
                                    } catch { alert('Failed to save header'); }
                                    finally { setHfSaving(false); }
                                };

                                const saveFooter = async () => {
                                    setHfSaving(true);
                                    try {
                                        await api.post('/cms/page', { pageName: 'footer', content: footerContent });
                                        alert('Footer saved! Changes live on frontend.');
                                    } catch { alert('Failed to save footer'); }
                                    finally { setHfSaving(false); }
                                };

                                const addNavLink = () => {
                                    if (!newNavLink.label || !newNavLink.url) return;
                                    setHeaderContent(p => ({ ...p, navLinks: [...(p.navLinks || []), { ...newNavLink }] }));
                                    setNewNavLink({ label: '', url: '', isExternal: false });
                                };

                                const deleteNavLink = (idx) => {
                                    setHeaderContent(p => ({ ...p, navLinks: p.navLinks.filter((_, i) => i !== idx) }));
                                };

                                const startEditNav = (idx) => {
                                    setEditNavIdx(idx);
                                    setEditNavLink({ ...headerContent.navLinks[idx] });
                                };

                                const saveEditNav = () => {
                                    setHeaderContent(p => ({
                                        ...p,
                                        navLinks: p.navLinks.map((lnk, i) => i === editNavIdx ? { ...editNavLink } : lnk)
                                    }));
                                    setEditNavIdx(null);
                                };

                                const addQuickLink = () => {
                                    if (!newQuickLink.label || !newQuickLink.url) return;
                                    setFooterContent(p => ({ ...p, quickLinks: [...(p.quickLinks || []), { ...newQuickLink }] }));
                                    setNewQuickLink({ label: '', url: '' });
                                };
                                const deleteQuickLink = (idx) => {
                                    setFooterContent(p => ({ ...p, quickLinks: p.quickLinks.filter((_, i) => i !== idx) }));
                                };

                                const addSupportLink = () => {
                                    if (!newSupportLink.label || !newSupportLink.url) return;
                                    setFooterContent(p => ({ ...p, supportLinks: [...(p.supportLinks || []), { ...newSupportLink }] }));
                                    setNewSupportLink({ label: '', url: '' });
                                };
                                const deleteSupportLink = (idx) => {
                                    setFooterContent(p => ({ ...p, supportLinks: p.supportLinks.filter((_, i) => i !== idx) }));
                                };

                                const handleLogoChange = (e) => {
                                    const file = e.target.files[0];
                                    if (!file) return;
                                    setLogoFile(file);
                                    setLogoPreview(URL.createObjectURL(file));
                                };

                                const handleIconChange = (e) => {
                                    const file = e.target.files[0];
                                    if (!file) return;
                                    setIconFile(file);
                                    setIconPreview(URL.createObjectURL(file));
                                };

                                const uploadLogo = async () => {
                                    if (!logoFile) return;
                                    setUploadingLogo(true);
                                    const formData = new FormData();
                                    formData.append('logo', logoFile);
                                    try {
                                        const res = await api.post('/cms/upload-logo', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
                                        setBrandingData(p => ({ ...p, logoUrl: res.data.url }));
                                        setLogoFile(null);
                                        alert('Logo uploaded! Navbar will show new logo.');
                                    } catch { alert('Logo upload failed'); }
                                    finally { setUploadingLogo(false); }
                                };

                                const handleFooterLogoChange = (e) => {
                                    const file = e.target.files[0];
                                    if (!file) return;
                                    setFooterLogoFile(file);
                                    setFooterLogoPreview(URL.createObjectURL(file));
                                };

                                const uploadFooterLogo = async () => {
                                    if (!footerLogoFile) return;
                                    setUploadingFooterLogo(true);
                                    const formData = new FormData();
                                    formData.append('logo', footerLogoFile);
                                    try {
                                        const res = await api.post('/cms/upload-logo?type=footer', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
                                        setBrandingData(p => ({ ...p, footerLogoUrl: res.data.url }));
                                        setFooterLogoFile(null);
                                        alert('Footer Logo uploaded successfully!');
                                    } catch { alert('Footer Logo upload failed'); }
                                    finally { setUploadingFooterLogo(false); }
                                };

                                const uploadIcon = async () => {
                                    if (!iconFile) return;
                                    setUploadingIcon(true);
                                    const formData = new FormData();
                                    formData.append('icon', iconFile);
                                    try {
                                        const res = await api.post('/cms/upload-icon', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
                                        setBrandingData(p => ({ ...p, iconUrl: res.data.url }));
                                        setIconFile(null);
                                        alert('Site icon uploaded!');
                                    } catch { alert('Icon upload failed'); }
                                    finally { setUploadingIcon(false); }
                                };

                                const saveBrandingSettings = async () => {
                                    try {
                                        setHfSaving(true);
                                        await api.post('/cms/page', { pageName: 'branding', content: brandingData });
                                        alert('Branding settings saved successfully!');
                                    } catch (error) {
                                        alert('Failed to save branding settings');
                                    } finally {
                                        setHfSaving(false);
                                    }
                                };

                                const inputCls = "w-full bg-slate-50 border border-transparent p-3.5 rounded-2xl font-bold text-slate-800 focus:bg-white focus:border-blue-400 outline-none transition-all italic text-sm";
                                const labelCls = "text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 italic ml-1";

                                return (
                                    <div className="space-y-8">
                                        {/* Tab Bar */}
                                        <div className="flex flex-wrap gap-3">
                                            {[
                                                { id: 'header', label: '🔗 Header Nav', color: 'blue' },
                                                { id: 'footer', label: '🦶 Footer Content', color: 'indigo' },
                                                { id: 'branding', label: '🎨 Branding (Logo & Icon)', color: 'violet' },
                                            ].map(t => (
                                                <button key={t.id} onClick={() => setHfTab(t.id)}
                                                    className={`px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${hfTab === t.id ? `bg-${t.color}-600 text-white shadow-lg shadow-${t.color}-200` : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}>
                                                    {t.label}
                                                </button>
                                            ))}
                                        </div>

                                        {/* ── HEADER NAV TAB ───────────────────────────── */}
                                        {hfTab === 'header' && (
                                            <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-sm space-y-8">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <h3 className="text-2xl font-black text-slate-900 italic">Header Navigation Links</h3>
                                                        <p className="text-slate-400 text-xs italic font-bold mt-1">Yahan add kiye links Navbar mein display honge</p>
                                                    </div>
                                                    <button onClick={saveHeader} disabled={hfSaving}
                                                        className="flex items-center gap-2 text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 disabled:opacity-50" style={{ background: 'linear-gradient(135deg,#F47920,#D4641A)', boxShadow: '0 6px 20px rgba(244,121,32,0.35)' }}>
                                                        <Save size={16} /> {hfSaving ? 'Saving...' : 'Save Header'}
                                                    </button>
                                                </div>

                                                {/* Existing nav links */}
                                                <div className="space-y-3">
                                                    <p className={labelCls}>Current Nav Links ({(headerContent.navLinks || []).length})</p>
                                                    {(headerContent.navLinks || []).length === 0 && (
                                                        <div className="bg-slate-50 rounded-2xl p-6 text-center text-slate-400 font-bold italic text-sm">
                                                            Koi nav link nahi hai abhi. Neeche se add karo ↓
                                                        </div>
                                                    )}
                                                    {(headerContent.navLinks || []).map((lnk, idx) => (
                                                        editNavIdx === idx ? (
                                                            <div key={idx} className="flex flex-col sm:flex-row gap-3 p-4 bg-blue-50 border border-blue-200 rounded-2xl">
                                                                <input value={editNavLink.label} onChange={e => setEditNavLink(p => ({ ...p, label: e.target.value }))}
                                                                    placeholder="Label" className={inputCls + " flex-1"} />
                                                                <input value={editNavLink.url} onChange={e => setEditNavLink(p => ({ ...p, url: e.target.value }))}
                                                                    placeholder="URL /path or https://" className={inputCls + " flex-1"} />
                                                                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-600 italic whitespace-nowrap">
                                                                    <input type="checkbox" checked={editNavLink.isExternal} onChange={e => setEditNavLink(p => ({ ...p, isExternal: e.target.checked }))}
                                                                        className="accent-blue-600 w-4 h-4" />
                                                                    External?
                                                                </label>
                                                                <div className="flex gap-2">
                                                                    <button onClick={saveEditNav} className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-500 text-white font-black text-xs uppercase tracking-widest hover:bg-emerald-600 transition-all">
                                                                        <Check size={14} /> Save
                                                                    </button>
                                                                    <button onClick={() => setEditNavIdx(null)} className="px-4 py-2.5 rounded-xl bg-slate-200 text-slate-600 font-black text-xs uppercase tracking-widest hover:bg-slate-300 transition-all">
                                                                        Cancel
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 hover:bg-blue-50/50 border border-slate-100 hover:border-blue-100 rounded-2xl transition-all group">
                                                                <div className="flex items-center gap-4">
                                                                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                                                                        <Link2 size={16} className="text-blue-600" />
                                                                    </div>
                                                                    <div>
                                                                        <p className="font-black text-slate-900 text-sm italic">{lnk.label}</p>
                                                                        <p className="text-[10px] text-slate-400 italic">{lnk.url} {lnk.isExternal && <span className="ml-1 text-amber-500">(external)</span>}</p>
                                                                    </div>
                                                                </div>
                                                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                    <button onClick={() => startEditNav(idx)} className="w-9 h-9 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:bg-blue-500 hover:text-white transition-all shadow-sm">
                                                                        <Pencil size={14} />
                                                                    </button>
                                                                    <button onClick={() => deleteNavLink(idx)} className="w-9 h-9 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-300 hover:bg-rose-500 hover:text-white transition-all shadow-sm">
                                                                        <Trash2 size={14} />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        )
                                                    ))}
                                                </div>

                                                {/* Add new nav link */}
                                                <div className="border-t border-slate-100 pt-8">
                                                    <p className={labelCls}>➕ Add New Nav Link</p>
                                                    <div className="flex flex-col sm:flex-row gap-3">
                                                        <input value={newNavLink.label} onChange={e => setNewNavLink(p => ({ ...p, label: e.target.value }))}
                                                            placeholder="Label (e.g. Blog)" className={inputCls + " flex-1"} />
                                                        <input value={newNavLink.url} onChange={e => setNewNavLink(p => ({ ...p, url: e.target.value }))}
                                                            placeholder="URL (e.g. /blog or https://...)" className={inputCls + " flex-1"} />
                                                        <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-600 italic whitespace-nowrap">
                                                            <input type="checkbox" checked={newNavLink.isExternal} onChange={e => setNewNavLink(p => ({ ...p, isExternal: e.target.checked }))}
                                                                className="accent-blue-600 w-4 h-4" />
                                                            External link?
                                                        </label>
                                                        <button onClick={addNavLink}
                                                            className="flex items-center gap-2 bg-emerald-600 text-white px-5 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-md whitespace-nowrap">
                                                            <Plus size={14} /> Add Link
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* ── FOOTER CONTENT TAB ──────────────────────── */}
                                        {hfTab === 'footer' && (
                                            <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-sm space-y-10">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <h3 className="text-2xl font-black text-slate-900 italic">Footer Content Manager</h3>
                                                        <p className="text-slate-400 text-xs italic font-bold mt-1">Footer ke har ek section ko edit karo</p>
                                                    </div>
                                                    <button onClick={saveFooter} disabled={hfSaving}
                                                        className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 disabled:opacity-50">
                                                        <Save size={16} /> {hfSaving ? 'Saving...' : 'Save Footer'}
                                                    </button>
                                                </div>

                                                {/* Brand Info */}
                                                <div>
                                                    <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] mb-4 italic border-b border-blue-50 pb-2">🏷 Brand Info</p>
                                                    <div className="space-y-4">
                                                        <div>
                                                            <label className={labelCls}>Brand Tagline (e.g. LedgerBandhu)</label>
                                                            <input value={footerContent.brandTagline} onChange={e => setFooterContent(p => ({ ...p, brandTagline: e.target.value }))} className={inputCls} />
                                                        </div>
                                                        <div>
                                                            <label className={labelCls}>Brand Description</label>
                                                            <textarea rows={3} value={footerContent.brandDescription} onChange={e => setFooterContent(p => ({ ...p, brandDescription: e.target.value }))} className={inputCls} />
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Quick Links */}
                                                <div>
                                                    <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em] mb-4 italic border-b border-emerald-50 pb-2">🔗 Quick Links</p>
                                                    <div className="space-y-2 mb-4">
                                                        {(footerContent.quickLinks || []).map((lnk, idx) => (
                                                            <div key={idx} className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100 group">
                                                                <span className="flex-1 text-sm font-bold text-slate-700 italic">{lnk.label}</span>
                                                                <span className="text-xs text-slate-400 italic">{lnk.url}</span>
                                                                <button onClick={() => deleteQuickLink(idx)} className="opacity-0 group-hover:opacity-100 w-8 h-8 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-300 hover:bg-rose-500 hover:text-white transition-all">
                                                                    <Trash2 size={13} />
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <div className="flex gap-3">
                                                        <input value={newQuickLink.label} onChange={e => setNewQuickLink(p => ({ ...p, label: e.target.value }))} placeholder="Label" className={inputCls + " flex-1"} />
                                                        <input value={newQuickLink.url} onChange={e => setNewQuickLink(p => ({ ...p, url: e.target.value }))} placeholder="URL" className={inputCls + " flex-1"} />
                                                        <button onClick={addQuickLink} className="flex items-center gap-1.5 bg-emerald-600 text-white px-5 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-700 transition-all whitespace-nowrap">
                                                            <Plus size={14} /> Add
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Support Links */}
                                                <div>
                                                    <p className="text-[10px] font-black text-purple-500 uppercase tracking-[0.2em] mb-4 italic border-b border-purple-50 pb-2">🛡 Support Links</p>
                                                    <div className="space-y-2 mb-4">
                                                        {(footerContent.supportLinks || []).map((lnk, idx) => (
                                                            <div key={idx} className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100 group">
                                                                <span className="flex-1 text-sm font-bold text-slate-700 italic">{lnk.label}</span>
                                                                <span className="text-xs text-slate-400 italic">{lnk.url}</span>
                                                                <button onClick={() => deleteSupportLink(idx)} className="opacity-0 group-hover:opacity-100 w-8 h-8 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-300 hover:bg-rose-500 hover:text-white transition-all">
                                                                    <Trash2 size={13} />
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <div className="flex gap-3">
                                                        <input value={newSupportLink.label} onChange={e => setNewSupportLink(p => ({ ...p, label: e.target.value }))} placeholder="Label" className={inputCls + " flex-1"} />
                                                        <input value={newSupportLink.url} onChange={e => setNewSupportLink(p => ({ ...p, url: e.target.value }))} placeholder="URL or #" className={inputCls + " flex-1"} />
                                                        <button onClick={addSupportLink} className="flex items-center gap-1.5 bg-purple-600 text-white px-5 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-purple-700 transition-all whitespace-nowrap">
                                                            <Plus size={14} /> Add
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Contact Info */}
                                                <div>
                                                    <p className="text-[10px] font-black text-rose-500 uppercase tracking-[0.2em] mb-4 italic border-b border-rose-50 pb-2">📞 Contact Info</p>
                                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                                        <div>
                                                            <label className={labelCls}>Phone Number</label>
                                                            <input value={footerContent.contactPhone} onChange={e => setFooterContent(p => ({ ...p, contactPhone: e.target.value }))} className={inputCls} placeholder="+91 98765 43210" />
                                                        </div>
                                                        <div>
                                                            <label className={labelCls}>Email Address</label>
                                                            <input value={footerContent.contactEmail} onChange={e => setFooterContent(p => ({ ...p, contactEmail: e.target.value }))} className={inputCls} placeholder="support@..." />
                                                        </div>
                                                        <div>
                                                            <label className={labelCls}>Address</label>
                                                            <input value={footerContent.contactAddress} onChange={e => setFooterContent(p => ({ ...p, contactAddress: e.target.value }))} className={inputCls} placeholder="123, City, State" />
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Social Links */}
                                                <div>
                                                    <p className="text-[10px] font-black text-sky-500 uppercase tracking-[0.2em] mb-4 italic border-b border-sky-50 pb-2">📱 Social Media Links</p>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                                        {[
                                                            { key: 'socialFacebook', label: '📘 Facebook URL' },
                                                            { key: 'socialTwitter', label: '🐦 Twitter URL' },
                                                            { key: 'socialLinkedin', label: '💼 LinkedIn URL' },
                                                            { key: 'socialInstagram', label: '📸 Instagram URL' },
                                                        ].map(({ key, label }) => (
                                                            <div key={key}>
                                                                <label className={labelCls}>{label}</label>
                                                                <input value={footerContent[key]} onChange={e => setFooterContent(p => ({ ...p, [key]: e.target.value }))} className={inputCls} placeholder="https://..." />
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Copyright & Newsletter */}
                                                <div>
                                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4 italic border-b border-slate-100 pb-2">©️ Copyright & Newsletter</p>
                                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                                        <div>
                                                            <label className={labelCls}>Copyright Text</label>
                                                            <input value={footerContent.copyrightText} onChange={e => setFooterContent(p => ({ ...p, copyrightText: e.target.value }))} className={inputCls} />
                                                        </div>
                                                        <div>
                                                            <label className={labelCls}>Copyright Sub-text</label>
                                                            <input value={footerContent.copyrightSub} onChange={e => setFooterContent(p => ({ ...p, copyrightSub: e.target.value }))} className={inputCls} />
                                                        </div>
                                                        <div>
                                                            <label className={labelCls}>Newsletter Heading</label>
                                                            <input value={footerContent.newsletterHeading} onChange={e => setFooterContent(p => ({ ...p, newsletterHeading: e.target.value }))} className={inputCls} />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* ── BRANDING TAB ────────────────────────────── */}
                                        {hfTab === 'branding' && (
                                            <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-sm space-y-10">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <h3 className="text-2xl font-black text-slate-900 italic">Branding</h3>
                                                        <p className="text-slate-400 text-xs italic font-bold mt-1">Logo aur site icon yahan se upload karo — Navbar aur Footer mein reflect hoga</p>
                                                    </div>
                                                    <button onClick={saveBrandingSettings} disabled={hfSaving}
                                                        className="flex items-center gap-2 bg-violet-600 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-violet-700 transition-all shadow-lg shadow-violet-100">
                                                        <Save size={16} /> {hfSaving ? 'Saving...' : 'Save Branding'}
                                                    </button>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                                    {/* Logo Upload */}
                                                    <div className="space-y-6">
                                                        <p className="text-[10px] font-black text-violet-500 uppercase tracking-[0.2em] border-b border-violet-50 pb-2">🖼 Site Logo</p>

                                                        {/* Current logo */}
                                                        {brandingData.logoUrl && !logoPreview && (
                                                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                                                <p className={labelCls}>Current Logo</p>
                                                                <img src={brandingData.logoUrl.startsWith('http') ? brandingData.logoUrl : `${import.meta.env.VITE_API_URL.replace('/api', '')}${brandingData.logoUrl}`} alt="Current Logo"
                                                                    className="h-16 object-contain mt-2" />
                                                            </div>
                                                        )}
                                                        {/* Preview */}
                                                        {logoPreview && (
                                                            <div className="p-4 bg-violet-50 border border-violet-100 rounded-2xl">
                                                                <p className={labelCls + " text-violet-600"}>New Logo Preview</p>
                                                                <img src={logoPreview} alt="Logo Preview" className="h-16 object-contain mt-2" />
                                                            </div>
                                                        )}
                                                        {!brandingData.logoUrl && !logoPreview && (
                                                            <div className="p-6 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl text-center text-slate-400 text-sm italic font-bold">
                                                                Abhi koi logo upload nahi hai
                                                            </div>
                                                        )}

                                                        <label className="flex flex-col items-center justify-center gap-3 p-6 bg-slate-50 hover:bg-violet-50 border-2 border-dashed border-slate-200 hover:border-violet-300 rounded-2xl cursor-pointer transition-all group">
                                                            <Upload size={24} className="text-slate-400 group-hover:text-violet-500 transition-colors" />
                                                            <span className="text-sm font-bold text-slate-500 italic group-hover:text-violet-600">Click to choose logo image</span>
                                                            <span className="text-[10px] text-slate-400 italic">PNG, JPG, SVG • Max 5MB</span>
                                                            <input type="file" accept="image/*" onChange={handleLogoChange} className="hidden" />
                                                        </label>

                                                        <button onClick={uploadLogo} disabled={!logoFile || uploadingLogo}
                                                            className="w-full flex items-center justify-center gap-2 bg-violet-600 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-violet-700 transition-all shadow-lg shadow-violet-100 disabled:opacity-40">
                                                            <Upload size={16} /> {uploadingLogo ? 'Uploading...' : 'Upload Logo'}
                                                        </button>

                                                        {/* Logo Size Control */}
                                                        <div className="pt-6 border-t border-slate-100">
                                                            <label className={labelCls}>Logo Height (px) - Controls visibility on site</label>
                                                            <div className="flex items-center gap-4">
                                                                <input
                                                                    type="range"
                                                                    min="20"
                                                                    max="150"
                                                                    value={brandingData.logoHeight || 36}
                                                                    onChange={(e) => setBrandingData(p => ({ ...p, logoHeight: parseInt(e.target.value) }))}
                                                                    className="flex-1 accent-violet-600"
                                                                />
                                                                <input
                                                                    type="number"
                                                                    value={brandingData.logoHeight || 36}
                                                                    onChange={(e) => setBrandingData(p => ({ ...p, logoHeight: parseInt(e.target.value) }))}
                                                                    className="w-20 bg-slate-50 border border-slate-100 p-2 rounded-xl font-bold text-center text-sm"
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Footer Logo Upload */}
                                                    <div className="space-y-6">
                                                        <p className="text-[10px] font-black text-rose-500 uppercase tracking-[0.2em] border-b border-rose-50 pb-2">🖼 Footer Logo</p>

                                                        {/* Current logo */}
                                                        {brandingData.footerLogoUrl && !footerLogoPreview && (
                                                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                                                <p className={labelCls}>Current Footer Logo</p>
                                                                <img src={brandingData.footerLogoUrl.startsWith('http') ? brandingData.footerLogoUrl : `${import.meta.env.VITE_API_URL.replace('/api', '')}${brandingData.footerLogoUrl}`} alt="Current Footer Logo"
                                                                    className="h-16 object-contain mt-2" />
                                                            </div>
                                                        )}
                                                        {brandingData.logoUrl && !brandingData.footerLogoUrl && !footerLogoPreview && (
                                                            <div className="p-4 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl text-center text-slate-400 text-sm italic font-bold">
                                                                <p className="mb-2">Using Main Logo</p>
                                                                <img src={brandingData.logoUrl.startsWith('http') ? brandingData.logoUrl : `${import.meta.env.VITE_API_URL.replace('/api', '')}${brandingData.logoUrl}`} alt="Main Logo Fallback"
                                                                    className="h-10 object-contain mx-auto opacity-50" />
                                                            </div>
                                                        )}
                                                        {/* Preview */}
                                                        {footerLogoPreview && (
                                                            <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl">
                                                                <p className={labelCls + " text-rose-600"}>New Footer Logo Preview</p>
                                                                <img src={footerLogoPreview} alt="Footer Logo Preview" className="h-16 object-contain mt-2" />
                                                            </div>
                                                        )}
                                                        {!brandingData.footerLogoUrl && !brandingData.logoUrl && !footerLogoPreview && (
                                                            <div className="p-6 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl text-center text-slate-400 text-sm italic font-bold">
                                                                Abhi koi footer logo upload nahi hai
                                                            </div>
                                                        )}

                                                        <label className="flex flex-col items-center justify-center gap-3 p-6 bg-slate-50 hover:bg-rose-50 border-2 border-dashed border-slate-200 hover:border-rose-300 rounded-2xl cursor-pointer transition-all group">
                                                            <Upload size={24} className="text-slate-400 group-hover:text-rose-500 transition-colors" />
                                                            <span className="text-sm font-bold text-slate-500 italic group-hover:text-rose-600">Click to choose footer logo image</span>
                                                            <span className="text-[10px] text-slate-400 italic">PNG, JPG, SVG • Max 5MB</span>
                                                            <input type="file" accept="image/*" onChange={handleFooterLogoChange} className="hidden" />
                                                        </label>

                                                        <button onClick={uploadFooterLogo} disabled={!footerLogoFile || uploadingFooterLogo}
                                                            className="w-full flex items-center justify-center gap-2 bg-rose-600 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-rose-700 transition-all shadow-lg shadow-rose-100 disabled:opacity-40">
                                                            <Upload size={16} /> {uploadingFooterLogo ? 'Uploading...' : 'Upload Footer Logo'}
                                                        </button>

                                                        {/* Logo Size Control */}
                                                        <div className="pt-6 border-t border-slate-100">
                                                            <label className={labelCls}>Footer Logo Height (px)</label>
                                                            <div className="flex items-center gap-4">
                                                                <input
                                                                    type="range"
                                                                    min="20"
                                                                    max="150"
                                                                    value={brandingData.footerLogoHeight || brandingData.logoHeight || 38}
                                                                    onChange={(e) => setBrandingData(p => ({ ...p, footerLogoHeight: parseInt(e.target.value) }))}
                                                                    className="flex-1 accent-rose-600"
                                                                />
                                                                <input
                                                                    type="number"
                                                                    value={brandingData.footerLogoHeight || brandingData.logoHeight || 38}
                                                                    onChange={(e) => setBrandingData(p => ({ ...p, footerLogoHeight: parseInt(e.target.value) }))}
                                                                    className="w-20 bg-slate-50 border border-slate-100 p-2 rounded-xl font-bold text-center text-sm"
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Icon / Favicon Upload */}
                                                    <div className="space-y-6">
                                                        <p className="text-[10px] font-black text-amber-500 uppercase tracking-[0.2em] border-b border-amber-50 pb-2">⭐ Site Icon / Favicon</p>

                                                        {brandingData.iconUrl && !iconPreview && (
                                                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                                                <p className={labelCls}>Current Icon</p>
                                                                <img src={brandingData.iconUrl.startsWith('http') ? brandingData.iconUrl : `${import.meta.env.VITE_API_URL.replace('/api', '')}${brandingData.iconUrl}`} alt="Current Icon"
                                                                    className="h-12 w-12 object-contain mt-2 rounded-xl" />
                                                            </div>
                                                        )}
                                                        {iconPreview && (
                                                            <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl">
                                                                <p className={labelCls + " text-amber-600"}>New Icon Preview</p>
                                                                <img src={iconPreview} alt="Icon Preview" className="h-12 w-12 object-contain mt-2 rounded-xl" />
                                                            </div>
                                                        )}
                                                        {!brandingData.iconUrl && !iconPreview && (
                                                            <div className="p-6 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl text-center text-slate-400 text-sm italic font-bold">
                                                                Abhi koi site icon upload nahi hai
                                                            </div>
                                                        )}

                                                        <label className="flex flex-col items-center justify-center gap-3 p-6 bg-slate-50 hover:bg-amber-50 border-2 border-dashed border-slate-200 hover:border-amber-300 rounded-2xl cursor-pointer transition-all group">
                                                            <Image size={24} className="text-slate-400 group-hover:text-amber-500 transition-colors" />
                                                            <span className="text-sm font-bold text-slate-500 italic group-hover:text-amber-600">Click to choose site icon</span>
                                                            <span className="text-[10px] text-slate-400 italic">Preferably square PNG • Max 2MB</span>
                                                            <input type="file" accept="image/*" onChange={handleIconChange} className="hidden" />
                                                        </label>

                                                        <button onClick={uploadIcon} disabled={!iconFile || uploadingIcon}
                                                            className="w-full flex items-center justify-center gap-2 bg-amber-500 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-amber-600 transition-all shadow-lg shadow-amber-100 disabled:opacity-40">
                                                            <Upload size={16} /> {uploadingIcon ? 'Uploading...' : 'Upload Site Icon'}
                                                        </button>

                                                        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 text-xs text-amber-700 font-bold italic">
                                                            💡 Site icon ko favicon ke roop mein use karne ke liye, aapko apne <code>index.html</code> mein link tag update karna hoga.
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })()}

                            {activeSection === 'ai-agent' && (
                                <div className="space-y-8">
                                    <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
                                        <div className="flex items-center gap-4 mb-8">
                                            <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl bg-slate-50 border border-slate-100 shadow-inner">
                                                ✨
                                            </div>
                                            <div>
                                                <h3 className="text-3xl font-black text-[#111D45] tracking-tight">AI Job Agent</h3>
                                                <p className="text-slate-400 font-bold text-sm mt-1">Generate automated job postings from a URL.</p>
                                            </div>
                                        </div>

                                        <form onSubmit={handleGenerateAIJob} className="space-y-6">
                                            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 mb-2">
                                                <div className="flex items-start gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
                                                        <Activity size={20} className="text-blue-600" />
                                                    </div>
                                                    <div>
                                                        <h4 className="text-sm font-black text-blue-900 uppercase tracking-tight">Full Automation Enabled</h4>
                                                        <p className="text-[11px] font-bold text-blue-600/70 italic leading-relaxed mt-1">
                                                            Pasting a URL below will: 1. Scrape data, 2. Use AI to structure it for LedgerBandhu, 
                                                            3. Save it to the database, and 4. Cross-post it to LinkedIn automatically.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 ml-1">Source URL</label>
                                                <input
                                                    type="url"
                                                    value={aiUrl}
                                                    onChange={e => setAiUrl(e.target.value)}
                                                    required
                                                    placeholder="https://company.com/careers/job-123"
                                                    className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl font-bold text-slate-700 outline-none focus:bg-white focus:border-indigo-500 transition-all shadow-inner"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 ml-1">Category (Optional)</label>
                                                <div className="relative">
                                                    <select
                                                        value={aiCategory}
                                                        onChange={e => setAiCategory(e.target.value)}
                                                        className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl font-bold text-slate-700 outline-none focus:bg-white focus:border-indigo-500 transition-all shadow-inner appearance-none"
                                                    >
                                                        <option value="">Auto-Detect Category via AI</option>
                                                        {categories.map(c => (
                                                            <option key={c._id} value={c.name}>{c.name}</option>
                                                        ))}
                                                    </select>
                                                    <ChevronRight size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none rotate-90" />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 ml-1">
                                                    Raw Job Text (Optional - Use if website blocks scraping)
                                                </label>
                                                <textarea
                                                    value={aiFallbackText}
                                                    onChange={e => setAiFallbackText(e.target.value)}
                                                    placeholder="If the website has strict anti-bot protection (like NaukriGulf), paste the entire text of the job description here. The AI will use this text instead of trying to scrape the URL."
                                                    className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl font-bold text-sm text-slate-700 outline-none focus:bg-white focus:border-indigo-500 transition-all shadow-inner h-32 resize-none"
                                                />
                                            </div>
                                            <div className="flex items-center gap-3 px-1">
                                                <input 
                                                    type="checkbox" 
                                                    id="ai-isSponsored"
                                                    checked={aiIsSponsored} 
                                                    onChange={e => setAiIsSponsored(e.target.checked)}
                                                    className="w-6 h-6 accent-indigo-600 rounded-xl cursor-pointer"
                                                />
                                                <label htmlFor="ai-isSponsored" className="text-sm font-black text-slate-700 italic cursor-pointer uppercase tracking-widest">Sponsor this job (Promote to top)</label>
                                            </div>
                                            <button
                                                type="submit"
                                                disabled={aiLoading || !aiUrl}
                                                className="w-full bg-indigo-600 text-white font-black py-4 rounded-2xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-0.5 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-3 text-lg"
                                            >
                                                {aiLoading ? (
                                                    <>
                                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                        Processing Everywhere...
                                                    </>
                                                ) : (
                                                    <>Automate & Share Job ✨</>
                                                )}
                                            </button>
                                        </form>
                                    </div>

                                    {/* LinkedIn Post Card — shown after successful job generation */}
                                    {linkedInPost && (
                                        <div className="bg-white p-8 rounded-[3rem] border-2 border-[#0a66c2]/20 shadow-xl shadow-blue-50">
                                            <div className="flex items-center gap-3 mb-6">
                                                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white text-xl font-black" style={{ background: 'linear-gradient(135deg, #0a66c2, #0077b5)' }}>in</div>
                                                <div>
                                                    <h3 className="text-xl font-black text-[#111D45]">✅ Job Posted! Ready-to-Copy LinkedIn Post</h3>
                                                    <p className="text-slate-400 text-xs font-bold mt-0.5">Copy this and paste it on your <strong>Ledger Bandhu</strong> LinkedIn page manually.</p>
                                                </div>
                                            </div>

                                            {linkedInPost.linkedInStatus?.success ? (
                                                <div className="mb-4 flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-2xl px-5 py-3">
                                                    <Check size={16} className="text-emerald-600 shrink-0" />
                                                    <p className="text-emerald-700 font-bold text-sm">Auto-posted to LinkedIn ({linkedInPost.linkedInStatus.target}) successfully!</p>
                                                </div>
                                            ) : (
                                                <div className="mb-4 flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-2xl px-5 py-3">
                                                    <span className="text-amber-500 text-lg shrink-0">⚠️</span>
                                                    <p className="text-amber-700 font-bold text-sm">Auto-post failed ({linkedInPost.linkedInStatus?.error || 'unknown error'}). Copy & paste manually below.</p>
                                                </div>
                                            )}

                                            {/* Post text box */}
                                            <div className="relative">
                                                <textarea
                                                    readOnly
                                                    rows={10}
                                                    value={linkedInPost.text}
                                                    className="w-full bg-slate-50 border-2 border-slate-100 p-5 rounded-2xl font-mono text-sm text-slate-700 outline-none resize-none leading-relaxed"
                                                />
                                            </div>

                                            <div className="flex gap-3 mt-4">
                                                <button
                                                    onClick={() => {
                                                        navigator.clipboard.writeText(linkedInPost.text);
                                                        setLinkedInCopied(true);
                                                        setTimeout(() => setLinkedInCopied(false), 3000);
                                                    }}
                                                    className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-black text-white text-sm uppercase tracking-widest transition-all active:scale-95"
                                                    style={{ background: linkedInCopied ? 'linear-gradient(135deg,#22c55e,#16a34a)' : 'linear-gradient(135deg,#0a66c2,#0077b5)', boxShadow: linkedInCopied ? '0 6px 20px rgba(34,197,94,0.3)' : '0 6px 20px rgba(10,102,194,0.3)' }}
                                                >
                                                    {linkedInCopied ? <><Check size={18} /> Copied!</> : <>📋 Copy LinkedIn Post</>}
                                                </button>
                                                <a
                                                    href="https://www.linkedin.com/company/114964223/admin/page-posts/published/"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-2 px-6 py-4 rounded-2xl font-black text-[#0a66c2] text-sm uppercase tracking-widest bg-blue-50 hover:bg-blue-100 border border-blue-100 transition-all"
                                                >
                                                    <ExternalLink size={16} /> Open LinkedIn Page
                                                </a>
                                            </div>

                                            <p className="text-slate-400 text-xs font-bold italic text-center mt-4">
                                                1. Click "Copy LinkedIn Post" → 2. Open LinkedIn Page → 3. Click "Start a post" → 4. Paste & Publish
                                            </p>
                                        </div>
                                    )}

                                    {aiResult && (
                                        <div className="bg-white p-10 rounded-[3rem] border border-emerald-100 shadow-xl shadow-emerald-50">
                                            <div className="flex items-center gap-3 mb-8">
                                                <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />
                                                <h3 className="text-2xl font-black text-[#111D45]">Review & Edit Generated Job</h3>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                                <div>
                                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 ml-1">Job Title</label>
                                                    <input value={aiResult.title || ''} onChange={e => setAiResult({ ...aiResult, title: e.target.value })} className="w-full bg-emerald-50 border border-emerald-100 p-4 rounded-2xl font-bold text-slate-700 outline-none focus:border-emerald-500 transition-all" />
                                                </div>
                                                <div>
                                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 ml-1">Category</label>
                                                    <input value={aiResult.category || ''} onChange={e => setAiResult({ ...aiResult, category: e.target.value })} className="w-full bg-emerald-50 border border-emerald-100 p-4 rounded-2xl font-bold text-slate-700 outline-none focus:border-emerald-500 transition-all" />
                                                </div>
                                                <div>
                                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 ml-1">Location</label>
                                                    <input value={aiResult.location || ''} onChange={e => setAiResult({ ...aiResult, location: e.target.value })} className="w-full bg-emerald-50 border border-emerald-100 p-4 rounded-2xl font-bold text-slate-700 outline-none focus:border-emerald-500 transition-all" />
                                                </div>
                                                <div>
                                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 ml-1">Salary</label>
                                                    <input value={aiResult.salary || ''} onChange={e => setAiResult({ ...aiResult, salary: e.target.value })} className="w-full bg-emerald-50 border border-emerald-100 p-4 rounded-2xl font-bold text-slate-700 outline-none focus:border-emerald-500 transition-all" />
                                                </div>
                                                <div className="flex items-center gap-3 pt-4 px-1">
                                                    <input 
                                                        type="checkbox" 
                                                        id="review-isSponsored"
                                                        checked={aiResult.isSponsored} 
                                                        onChange={e => setAiResult({ ...aiResult, isSponsored: e.target.checked })}
                                                        className="w-5 h-5 accent-emerald-600 rounded-lg cursor-pointer"
                                                    />
                                                    <label htmlFor="review-isSponsored" className="text-sm font-black text-slate-700 italic cursor-pointer">Sponsor this job</label>
                                                </div>
                                            </div>

                                            <div className="mb-6">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 ml-1">Full HTML Description</label>
                                                <textarea rows={8} value={aiResult.description || ''} onChange={e => setAiResult({ ...aiResult, description: e.target.value })} className="w-full bg-emerald-50 border border-emerald-100 p-4 rounded-2xl font-bold text-slate-700 outline-none focus:border-emerald-500 transition-all font-mono text-xs" />
                                            </div>

                                            <div className="mb-8">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 ml-1">Requirements (comma separated or JSON array)</label>
                                                <textarea rows={4} value={Array.isArray(aiResult.requirements) ? aiResult.requirements.join('\n') : aiResult.requirements} onChange={e => setAiResult({ ...aiResult, requirements: e.target.value.split('\n') })} className="w-full bg-emerald-50 border border-emerald-100 p-4 rounded-2xl font-bold text-slate-700 outline-none focus:border-emerald-500 transition-all" />
                                            </div>

                                            <button
                                                onClick={handlePostAIJob}
                                                disabled={jobPostLoading}
                                                className="w-full bg-emerald-500 text-white font-black py-4 rounded-3xl shadow-xl shadow-emerald-200 hover:bg-emerald-600 hover:-translate-y-1 transition-all disabled:opacity-50 flex items-center justify-center gap-3 text-lg"
                                            >
                                                <Check size={24} /> {jobPostLoading ? 'Posting...' : 'Confirm & Post Job'}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeSection === 'newsletters' && (
                                <ManageNewsletters />
                            )}

                            {activeSection === 'community' && (
                                <ManageCommunity />
                            )}

                            {activeSection === 'subscribers' && (
                                <ManageSubscribers />
                            )}

                            {activeSection === 'faq' && (
                                <ManageFAQs />
                            )}
                            {activeSection === 'downloads' && (
                                <ManageDownloads />
                            )}

                            {activeSection === 'privacy' && (
                                <PolicyEditor
                                    title="Privacy Policy Manager"
                                    sections={privacySections}
                                    setSections={setPrivacySections}
                                    onSave={handleSavePolicy}
                                    pageName="privacy"
                                />
                            )}

                            {activeSection === 'terms' && (
                                <PolicyEditor
                                    title="Terms & Conditions Manager"
                                    sections={termsSections}
                                    setSections={setTermsSections}
                                    onSave={handleSavePolicy}
                                    pageName="terms"
                                />
                            )}

                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>

            {/* View User Detail Modal */}
            <AnimatePresence>
                {viewingUser && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 flex items-center justify-center p-6"
                        style={{ zIndex: 999999 }}
                    >
                        <div
                            onClick={() => setViewingUser(null)}
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="relative w-full max-w-2xl bg-white rounded-[3rem] shadow-2xl overflow-hidden"
                        >
                            <div className="p-10 max-h-[85vh] overflow-y-auto">
                                <div className="flex justify-between items-start mb-8">
                                    <div className="flex items-center gap-5">
                                        <div className="w-16 h-16 bg-[#1B2E6B] rounded-[1.5rem] flex items-center justify-center text-2xl font-black text-white italic shadow-xl shadow-[#1B2E6B]/20">
                                            {viewingUser?.name?.charAt(0)?.toUpperCase() || '?'}
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-black text-slate-900 italic">{viewingUser?.name || 'Unknown'}</h3>
                                            <p className="text-slate-400 font-bold italic">{viewingUser?.email || 'No Email'}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setViewingUser(null)}
                                        className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 hover:bg-slate-100 transition-all"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>

                                <div className="grid grid-cols-2 gap-6 mb-6">
                                    <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 italic">Role</span>
                                        <p className="text-slate-700 font-black italic capitalize">{viewingUser?.role || 'N/A'}</p>
                                    </div>
                                    <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 italic">Joined</span>
                                        <p className="text-slate-700 font-black italic">{viewingUser?.createdAt ? new Date(viewingUser.createdAt).toLocaleDateString() : 'N/A'}</p>
                                    </div>
                                </div>

                                {viewingUser?.role === 'employer' && (
                                    <div className="space-y-6">
                                        <div className="bg-[#1B2E6B]/5 p-6 rounded-[2rem] border border-[#1B2E6B]/10">
                                            <span className="text-[10px] font-black text-[#1B2E6B]/50 uppercase tracking-widest block mb-2 italic">Company Details</span>
                                            <div className="space-y-3">
                                                <div><span className="text-xs font-bold text-slate-500">Company Name:</span> <span className="font-bold text-slate-800">{viewingUser?.companyName || 'N/A'}</span></div>
                                                <div><span className="text-xs font-bold text-slate-500">Website:</span> <span className="font-bold text-slate-800">{viewingUser?.website || 'N/A'}</span></div>
                                                <div><span className="text-xs font-bold text-slate-500">Approval Status:</span> <span className="font-bold text-slate-800 capitalize">{viewingUser?.approvalStatus || 'pending'}</span></div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {viewingUser?.role === 'seeker' && (
                                    <div className="space-y-6">
                                        <div className="bg-[#F47920]/5 p-6 rounded-[2rem] border border-[#F47920]/10">
                                            <span className="text-[10px] font-black text-[#F47920]/50 uppercase tracking-widest block mb-2 italic">Profile Details</span>
                                            <div className="space-y-3">
                                                <div><span className="text-xs font-bold text-slate-500">Phone:</span> <span className="font-bold text-slate-800">{viewingUser?.phone || 'N/A'}</span></div>
                                                <div><span className="text-xs font-bold text-slate-500">Location:</span> <span className="font-bold text-slate-800">{viewingUser?.location || viewingUser?.extraFields?.location || viewingUser?.extraFields?.Location || 'N/A'}</span></div>
                                                <div>
                                                    <span className="text-xs font-bold text-slate-500">Skills:</span> 
                                                    <div className="flex flex-wrap gap-2 mt-2">
                                                        {(viewingUser?.skills || []).map((sk, i) => (
                                                            <span key={i} className="bg-white border border-slate-200 text-slate-600 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-xl italic">{sk}</span>
                                                        ))}
                                                        {(!viewingUser?.skills || viewingUser.skills.length === 0) && <span className="text-slate-400 italic text-xs">No skills listed</span>}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* View Contact Detail Modal */}
            <AnimatePresence>
                {viewingContact && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setViewingContact(null)}
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="relative w-full max-w-2xl bg-white rounded-[3rem] shadow-2xl overflow-hidden"
                        >
                            <div className="p-10">
                                <div className="flex justify-between items-start mb-8">
                                    <div className="flex items-center gap-5">
                                        <div className="w-16 h-16 bg-indigo-600 rounded-[1.5rem] flex items-center justify-center text-2xl font-black text-white italic shadow-xl shadow-indigo-100">
                                            {viewingContact.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-black text-slate-900 italic">{viewingContact.name}</h3>
                                            <p className="text-slate-400 font-bold italic">{viewingContact.email}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setViewingContact(null)}
                                        className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 hover:bg-slate-100 transition-all"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>

                                <div className="space-y-6">
                                    <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 italic">Subject / Inquiry Type</span>
                                        <p className="text-slate-700 font-black italic">{viewingContact.subject || 'General Inquiry'}</p>
                                    </div>

                                    <div className="bg-indigo-50/30 p-8 rounded-[2rem] border border-indigo-100/50 min-h-[200px]">
                                        <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest block mb-4 italic">Message Content</span>
                                        <p className="text-slate-600 font-medium italic leading-relaxed whitespace-pre-wrap text-lg">
                                            "{viewingContact.message}"
                                        </p>
                                    </div>

                                    <div className="flex items-center justify-between pt-4">
                                        <p className="text-xs font-bold text-slate-400 italic">
                                            Received on {new Date(viewingContact.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                        <div className="flex gap-3">
                                            {!viewingContact.isRead && (
                                                <button
                                                    onClick={() => {
                                                        handleMarkContactRead(viewingContact._id);
                                                        setViewingContact(null);
                                                    }}
                                                    className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100"
                                                >
                                                    Mark as Resolved
                                                </button>
                                            )}
                                            <button
                                                onClick={() => {
                                                    handleDelete('contact', viewingContact._id);
                                                    setViewingContact(null);
                                                }}
                                                className="px-6 py-3 bg-rose-100 text-rose-600 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-rose-600 hover:text-white transition-all"
                                            >
                                                Delete Message
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminDashboard;
