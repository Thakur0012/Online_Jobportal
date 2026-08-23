import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Building2, Users, Briefcase, Search, MapPin, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../lib/axios';
import SeoHead from '../components/SeoHead';

const Companies = () => {
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                // Fall back to scraping from /jobs to maintain compatibility with live backend
                const res = await api.get('/jobs');
                const seen = new Set();
                const unique = [];
                if (res.data && Array.isArray(res.data)) {
                    res.data.forEach(job => {
                        const emp = job.employerId;
                        if (emp && !seen.has(emp._id)) {
                            seen.add(emp._id);
                            unique.push(emp);
                        }
                    });
                }
                setCompanies(unique);
            } catch (e) {
                console.error('Failed to fetch companies', e);
            } finally {
                setLoading(false);
            }
        };
        fetchCompanies();
    }, []);

    const filtered = companies.filter(c =>
        (c.companyName || c.name || '').toLowerCase().includes(search.toLowerCase())
    );

    const displayList = filtered;

    const getColor = (name = '') => {
        const colors = [
            { bg: 'var(--orange-subtle)', text: 'var(--orange-dark)', border: 'rgba(249, 115, 22, 0.2)' },
            { bg: '#F3F4F6', text: '#374151', border: '#E5E7EB' },
            { bg: '#EFF6FF', text: '#1D4ED8', border: '#BFDBFE' },
            { bg: '#ECFDF5', text: '#047857', border: '#A7F3D0' }
        ];
        return colors[name.charCodeAt(0) % colors.length];
    };

    return (
        <div className="bg-white min-h-screen pb-32 pt-24 text-[#0A0A0A]">
            <SeoHead
                title="Top Finance & Banking Companies Hiring in India"
                description="Discover and connect with leading financial institutions, banks, fintech companies, and accounting firms actively hiring finance professionals on LedgerBandhu."
                canonical="https://www.ledgerbandhu.com/companies"
            />
            {/* Hero Section */}
            <div className="pt-20 pb-20 relative overflow-hidden text-center">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-50/50 blur-[100px] rounded-full -mr-64 -mt-64"></div>
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gray-50 blur-[100px] rounded-full -ml-48 -mb-48"></div>

                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <span className="inline-flex items-center gap-2 bg-orange-50 text-orange-600 border border-orange-100/50 text-[11px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6">
                        <Building2 size={12} className="text-[#F97316]" /> Verified Partners
                    </span>
                    <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold text-[#0A0A0A] mb-6 tracking-tight" style={{ fontFamily: 'Plus Jakarta Sans, Inter, sans-serif' }}>
                        Top Finance <span className="text-gradient-orange">Companies</span>
                    </h1>
                    <p className="text-gray-500 font-medium text-lg md:text-xl max-w-2xl mx-auto">
                        Discover and connect with leading financial institutions actively hiring elite professionals.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
                {/* Search */}
                <div className="relative mb-16 max-w-2xl mx-auto">
                    <Search size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search for companies..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full pl-14 pr-6 py-4 rounded-2xl border border-gray-200 bg-white shadow-sm text-base font-medium text-[#0A0A0A] placeholder-gray-400 focus:outline-none focus:border-[#F97316] focus:ring-4 focus:ring-[#F97316]/10 transition-all"
                    />
                </div>

                {/* Loading Skeletons */}
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                            <div key={i} className="card-professional p-8 animate-pulse text-center flex flex-col items-center">
                                <div className="w-16 h-16 bg-gray-100 rounded-2xl mb-5" />
                                <div className="h-4 bg-gray-100 rounded-full w-2/3 mb-4" />
                                <div className="h-3 bg-gray-50 rounded-full w-1/2" />
                            </div>
                        ))}
                    </div>
                ) : displayList.length === 0 ? (
                    <div className="bg-white p-16 rounded-3xl border border-gray-200 text-center shadow-sm max-w-2xl mx-auto">
                        <Building2 size={48} className="mx-auto text-gray-200 mb-6" />
                        <h3 className="text-xl font-bold text-[#0A0A0A] mb-2 font-jakarta">No Companies Found</h3>
                        <p className="text-gray-500 font-medium">Try adjusting your search to find what you're looking for.</p>
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8"
                    >
                        {displayList.map((company, i) => {
                            const color = getColor(company.companyName || company.name || '');
                            return (
                                <motion.div
                                    key={company._id || i}
                                    initial={{ opacity: 0, y: 16 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.04 }}
                                    className="card-professional p-8 group cursor-pointer flex flex-col text-center items-center h-full hover:border-orange-200"
                                >
                                    <div className="w-16 h-16 rounded-xl flex items-center justify-center font-bold text-2xl transition-transform duration-300 group-hover:scale-110 mb-5 shadow-sm"
                                        style={{ background: color.bg, color: color.text, border: `1px solid ${color.border}` }}>
                                        {(company.companyName || company.name || 'C')[0].toUpperCase()}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-[#0A0A0A] text-lg mb-2 group-hover:text-[#F97316] transition-colors leading-snug">
                                            {company.companyName || company.name || 'Unknown Entity'}
                                        </h3>
                                        {company.companyDescription && (
                                            <p className="text-gray-500 text-sm font-medium line-clamp-3 leading-relaxed">
                                                {company.companyDescription}
                                            </p>
                                        )}
                                    </div>
                                    <div className="mt-6 pt-5 w-full border-t border-gray-100 flex justify-center text-xs text-orange-600 font-semibold uppercase tracking-wider group-hover:text-orange-500 transition-colors">
                                        View Profile
                                    </div>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                )}

                {/* CTA */}
                {!loading && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mt-24 p-12 md:p-16 text-center relative overflow-hidden rounded-3xl"
                        style={{ background: 'linear-gradient(135deg, #F9FAFB 0%, #F3F4F6 100%)', border: '1px solid #E5E7EB' }}
                    >
                        <div className="relative z-10 max-w-2xl mx-auto">
                            <h2 className="text-3xl md:text-4xl font-extrabold text-[#0A0A0A] mb-4 tracking-tight" style={{ fontFamily: 'Plus Jakarta Sans, Inter, sans-serif' }}>
                                Are you an <span className="text-gradient-orange">Employer?</span>
                            </h2>
                            <p className="text-gray-500 font-medium text-lg mb-10">
                                Join our network of top companies and find the perfect talent for your organization today.
                            </p>
                            <Link to="/employer-register" className="btn-primary inline-flex items-center gap-2 shadow-lg">
                                Create Employer Profile <ArrowRight size={18} />
                            </Link>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default Companies;
