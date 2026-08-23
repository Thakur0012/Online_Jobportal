import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Sparkles, User, Briefcase, ChevronRight, Loader2, MessageSquare } from 'lucide-react';
import api from '../lib/axios';

const MockInterviewModal = ({ isOpen, onClose, job }) => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef(null);

    // Initial greeting from AI
    useEffect(() => {
        if (isOpen && messages.length === 0) {
            startInterview();
        }
    }, [isOpen]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, loading]);

    const startInterview = async () => {
        setLoading(true);
        try {
            const res = await api.post('/ai/mock-interview', {
                jobId: job._id,
                messages: []
            });
            setMessages([{ role: 'assistant', content: res.data.message }]);
        } catch (err) {
            setMessages([{ role: 'assistant', content: "Hello! I'm your AI Interviewer. I'm having a bit of trouble connecting to our servers right now. Please try closing and reopening this window." }]);
        } finally {
            setLoading(false);
        }
    };

    const handleSend = async (e) => {
        if (e) e.preventDefault();
        if (!input.trim() || loading) return;

        const userMsg = { role: 'user', content: input };
        const updatedMessages = [...messages, userMsg];
        setMessages(updatedMessages);
        setInput('');
        setLoading(true);

        try {
            const res = await api.post('/ai/mock-interview', {
                jobId: job._id,
                messages: updatedMessages
            });
            setMessages(prev => [...prev, { role: 'assistant', content: res.data.message }]);
        } catch (err) {
            setMessages(prev => [...prev, { role: 'assistant', content: "I'm sorry, I lost my connection for a moment. Could you repeat that?" }]);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-[#0A0A0A]/40 backdrop-blur-sm"
                />

                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-4xl h-[85vh] bg-white rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden border border-gray-100"
                >
                    {/* Header */}
                    <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600 shadow-sm border border-orange-100">
                                <Sparkles size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-[#111111] tracking-tight">AI Interview Coach</h3>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                                    Live for: {job.title}
                                </p>
                            </div>
                        </div>
                        <button 
                            onClick={onClose}
                            className="p-3 hover:bg-white rounded-xl transition-all text-gray-400 hover:text-orange-600 shadow-sm border border-transparent hover:border-gray-100"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Chat Area */}
                    <div 
                        ref={scrollRef}
                        className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar bg-white"
                        style={{ scrollBehavior: 'smooth' }}
                    >
                        {messages.map((msg, idx) => (
                            <motion.div
                                initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                key={idx}
                                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} items-start gap-4`}
                            >
                                {msg.role === 'assistant' && (
                                    <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600 shrink-0 border border-orange-100 shadow-sm">
                                        <Briefcase size={18} />
                                    </div>
                                )}
                                <div className={`max-w-[80%] p-5 rounded-2xl text-sm leading-relaxed font-bold ${
                                    msg.role === 'user' 
                                    ? 'bg-[#111111] text-white rounded-tr-none' 
                                    : 'bg-gray-50 text-gray-600 border border-gray-100 rounded-tl-none shadow-sm'
                                }`}>
                                    {msg.content}
                                </div>
                                {msg.role === 'user' && (
                                    <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-600 shrink-0 border border-gray-200">
                                        <User size={18} />
                                    </div>
                                )}
                            </motion.div>
                        ))}
                        {loading && (
                            <div className="flex justify-start items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600 shrink-0 border border-orange-100">
                                    <Briefcase size={18} />
                                </div>
                                <div className="bg-gray-50 px-6 py-4 rounded-2xl rounded-tl-none border border-gray-100 flex items-center gap-3">
                                    <span className="flex gap-1.5">
                                        <span className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                        <span className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                        <span className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                    </span>
                                    <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Interviewer is thinking...</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer / Input */}
                    <div className="p-8 bg-gray-50/50 border-t border-gray-100">
                        <form onSubmit={handleSend} className="relative group">
                            <input
                                type="text"
                                placeholder="Type your response here..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                disabled={loading}
                                className="w-full pl-6 pr-16 py-5 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/5 transition-all text-sm font-bold text-[#111111] placeholder-gray-400 shadow-sm"
                            />
                            <button
                                type="submit"
                                disabled={loading || !input.trim()}
                                className={`absolute right-3 top-1/2 -translate-y-1/2 p-3 rounded-xl transition-all ${
                                    loading || !input.trim() 
                                    ? 'text-gray-300' 
                                    : 'text-orange-600 hover:bg-orange-50 active:scale-95'
                                }`}
                            >
                                {loading ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
                            </button>
                        </form>
                        <div className="mt-4 flex justify-between items-center text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2">
                            <span>Powered by Llama 3.3 Intelligence</span>
                            <span className="flex items-center gap-2">Press Enter <ChevronRight size={10} /></span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default MockInterviewModal;
