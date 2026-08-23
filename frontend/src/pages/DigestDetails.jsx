import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, ChevronLeft, Sparkles, Share2, Printer, MapPin, Tag } from 'lucide-react';
import api from '../lib/axios';

const DigestDetails = () => {
    const { slug } = useParams();
    const [digest, setDigest] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDigest = async () => {
            try {
                const res = await api.get(`/news/${slug}`);
                setDigest(res.data);
            } catch (err) {
                console.error("Error fetching digest:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchDigest();
    }, [slug]);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="flex flex-col items-center gap-6">
                <div className="w-16 h-16 border-4 border-orange-100 border-t-[#F97316] rounded-full animate-spin" />
                <p className="text-gray-400 font-extrabold text-[10px] uppercase tracking-[0.3em]">AI Loading Intelligence...</p>
            </div>
        </div>
    );

    if (!digest) return (
        <div className="min-h-screen flex items-center justify-center bg-white text-center p-8">
            <div>
                <h2 className="text-3xl font-black mb-6">Intelligence Unavailable</h2>
                <p className="text-gray-500 font-bold mb-8">This digest may have been removed or published under a different ID.</p>
                <Link to="/daily-digest" className="btn-primary px-10 py-4 rounded-2xl inline-block text-[10px] uppercase tracking-widest">Back to Library</Link>
            </div>
        </div>
    );

    return (
        <div className="bg-white min-h-screen pb-24 text-[#111111]">
            {/* Context Header */}
            <div className="pt-24 pb-12 bg-gray-50/50 border-b border-gray-100">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
                    <Link to="/daily-digest" className="flex items-center gap-3 text-gray-400 hover:text-orange-600 font-black text-[10px] uppercase tracking-widest transition-colors group">
                        <ChevronLeft size={16} className="transition-transform group-hover:-translate-x-2" /> Back to Newsroom
                    </Link>
                    <div className="flex gap-4">
                        <button className="p-2 text-gray-400 hover:text-orange-600 transition-colors"><Share2 size={18} /></button>
                        <button className="p-2 text-gray-400 hover:text-orange-600 transition-colors"><Printer size={18} /></button>
                    </div>
                </div>
            </div>

            <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
                {/* Meta */}
                <header className="mb-16">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="px-4 py-1 rounded-full bg-orange-50 text-orange-600 border border-orange-100 font-black text-[10px] uppercase tracking-widest">
                            Finance Digest
                        </div>
                        <div className="h-4 w-px bg-gray-200" />
                        <div className="flex items-center gap-2 text-gray-400 font-black text-[10px] uppercase tracking-widest">
                            <Calendar size={12} className="text-[#F97316]" /> {new Date(digest.publishedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </div>
                    </div>
                    
                    <h1 className="text-4xl md:text-7xl font-black text-[#111111] leading-[0.95] tracking-tighter mb-10">
                        {digest.title}
                    </h1>
                    
                    <p className="text-xl md:text-2xl text-gray-600 font-medium leading-relaxed indent-0 border-l-4 border-orange-500 pl-8 ml-2 italic">
                        {digest.excerpt}
                    </p>
                </header>

                {/* Featured Image */}
                {digest.thumbnail && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mb-20 rounded-[3rem] overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border border-gray-100"
                    >
                        <img src={digest.thumbnail} alt={digest.title} className="w-full h-auto object-cover max-h-[500px]" />
                    </motion.div>
                )}

                {/* Content */}
                <div 
                    className="prose prose-orange prose-lg max-w-none 
                    prose-p:text-gray-600 prose-p:font-medium prose-p:leading-[1.9] prose-p:mb-8
                    prose-headings:text-[#111111] prose-headings:font-black prose-headings:tracking-tighter
                    prose-h2:text-3xl prose-h2:md:text-4xl prose-h2:border-b-2 prose-h2:border-gray-50 prose-h2:pb-6 prose-h2:mt-20 prose-h2:mb-10
                    prose-h3:text-xl prose-h3:mt-12 prose-h3:mb-6 prose-h3:text-orange-600
                    prose-ul:list-disc prose-ul:my-10 prose-li:text-gray-600 prose-li:font-medium prose-li:mb-4
                    prose-strong:text-[#111111] prose-strong:font-extrabold
                    prose-blockquote:border-l-4 prose-blockquote:border-[#F97316] prose-blockquote:bg-gray-50 prose-blockquote:py-10 prose-blockquote:px-12 prose-blockquote:rounded-r-[2rem] prose-blockquote:font-black prose-blockquote:text-xl prose-blockquote:text-gray-900 prose-blockquote:italic prose-blockquote:my-16
                    prose-hr:border-gray-100 prose-hr:my-20
                    mb-24 news-body-content"
                    dangerouslySetInnerHTML={{ __html: digest.content }}
                />

                {/* Keywords/Footer */}
                <footer className="pt-12 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-8 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                    <div className="flex flex-wrap items-center gap-3">
                        <Tag size={14} className="text-orange-500" />
                        {digest.keywords?.map(tag => (
                            <span key={tag} className="px-4 py-1.5 bg-gray-50 rounded-full border border-gray-100">#{tag}</span>
                        ))}
                    </div>
                    <div>
                        Content Generated by LedgerBandhu AI 1.0.1
                    </div>
                </footer>
            </article>

            {/* CTA */}
            <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
                <div className="bg-[#111111] rounded-[3rem] p-12 text-center relative overflow-hidden shadow-2xl group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-orange-600 blur-[80px] opacity-20 group-hover:opacity-30 transition-opacity" />
                    <div className="relative z-10">
                        <Sparkles size={32} className="mx-auto text-[#F97316] mb-6" />
                        <h4 className="text-2xl font-black text-white mb-4 tracking-tight">Looking for a Finance Career?</h4>
                        <p className="text-white/40 font-bold mb-10 max-w-md mx-auto">Apply your intelligence to the best roles in the industry. Browse our curated listings today.</p>
                        <Link to="/jobs" className="btn-primary px-12 py-4 rounded-2xl inline-block text-[10px] uppercase tracking-widest shadow-xl">Browse Openings</Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default DigestDetails;
