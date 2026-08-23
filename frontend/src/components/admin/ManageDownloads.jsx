import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
    Download, User, Mail, Calendar, 
    FileText, Search, Loader2, ExternalLink 
} from 'lucide-react';
import api from '../../lib/axios';

const ManageDownloads = () => {
    const [downloads, setDownloads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchDownloads = async () => {
            try {
                const res = await api.get('/newsletters/downloads');
                setDownloads(res.data);
            } catch (error) {
                console.error("Failed to fetch downloads", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDownloads();
    }, []);

    const filteredDownloads = downloads.filter(d => 
        d.user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.user?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.newsletter?.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="w-10 h-10 text-[#F47920] animate-spin mb-4" />
                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Loading Download Logs...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h3 className="text-2xl font-black text-[#111D45] tracking-tight">Brochure Downloads</h3>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Track who is downloading your newsletters</p>
                </div>
                
                <div className="relative w-full md:w-80">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <input 
                        type="text"
                        placeholder="Search logs..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white border border-slate-100 rounded-2xl pl-12 pr-6 py-3.5 font-bold text-slate-600 outline-none focus:ring-2 ring-[#F4792020] transition-all shadow-sm"
                    />
                </div>
            </div>

            <div className="bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">User Details</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Edition</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date & Time</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredDownloads.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="px-8 py-20 text-center text-slate-400 font-medium">
                                        No download logs found.
                                    </td>
                                </tr>
                            ) : (
                                filteredDownloads.map((log) => (
                                    <tr key={log._id} className="hover:bg-slate-50/30 transition-colors group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-[#1B2E6B]/5 flex items-center justify-center text-[#1B2E6B]">
                                                    <User size={18} />
                                                </div>
                                                <div>
                                                    <h4 className="font-black text-[#111D45] text-sm">{log.user?.name || 'Unknown User'}</h4>
                                                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">{log.user?.email || 'N/A'}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-[#F47920]/5 flex items-center justify-center text-[#F47920]">
                                                    <FileText size={14} />
                                                </div>
                                                <span className="font-bold text-slate-600 text-sm">{log.newsletter?.title || 'Deleted Edition'}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-sm">
                                            <div className="flex items-center gap-2 text-slate-500 font-medium">
                                                <Calendar size={14} className="text-slate-300" />
                                                {new Date(log.downloadedAt).toLocaleString()}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <span className="bg-green-50 text-green-600 text-[10px] font-black px-3 py-1.5 rounded-lg uppercase tracking-widest border border-green-100">
                                                Success
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ManageDownloads;
