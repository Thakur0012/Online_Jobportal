import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft, Search } from 'lucide-react';

const NotFound = () => {
    return (
        <div className="min-h-[70vh] flex items-center justify-center px-4 bg-white">
            <div className="max-w-xl w-full text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    {/* Large 404 Illustration/Text */}
                    <div className="relative mb-8">
                        <h1 className="text-[12rem] font-black leading-none text-[#111111]/5 select-none">404</h1>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <motion.div 
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                className="bg-white p-6 rounded-[2.5rem] shadow-2xl shadow-[#F97316]/10 border border-gray-200"
                            >
                                <Search size={64} className="text-[#F97316]" />
                            </motion.div>
                        </div>
                    </div>

                    <h2 className="text-3xl md:text-4xl font-black text-[#111111] mb-4">Oops! Page not found</h2>
                    <p className="text-gray-400 font-medium mb-10 max-w-md mx-auto">
                        The page you're looking for doesn't exist or has been moved. 
                        Let's get you back on track!
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link 
                            to="/" 
                            className="w-full sm:w-auto flex items-center justify-center gap-2 btn-primary active:scale-95"
                        >
                            <Home size={18} /> Take Me Home
                        </Link>
                        <button 
                            onClick={() => window.history.back()}
                            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-transparent border border-gray-200 hover:bg-gray-50 text-[#111111] px-8 py-4 rounded-2xl font-bold transition-all active:scale-95"
                        >
                            <ArrowLeft size={18} /> Go Back
                        </button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default NotFound;
