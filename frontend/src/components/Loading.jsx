import { motion } from 'framer-motion';
import { Briefcase } from 'lucide-react';

const Loading = () => {
    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #0a0a0f 0%, #111118 60%, #0f0f1a 100%)' }}>

            {/* ── Background orbs ──────────────────────────────────── */}
            <div style={{
                position: 'absolute', top: '-15%', right: '-10%',
                width: '520px', height: '520px',
                background: 'radial-gradient(circle, rgba(249,115,22,0.2) 0%, transparent 65%)',
                filter: 'blur(70px)', pointerEvents: 'none',
            }} />
            <div style={{
                position: 'absolute', bottom: '-15%', left: '-10%',
                width: '400px', height: '400px',
                background: 'radial-gradient(circle, rgba(234,88,12,0.12) 0%, transparent 65%)',
                filter: 'blur(60px)', pointerEvents: 'none',
            }} />

            {/* ── Grid overlay ─────────────────────────────────────── */}
            <div className="absolute inset-0 opacity-[0.035]" style={{
                backgroundImage: 'linear-gradient(rgba(255,255,255,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.7) 1px, transparent 1px)',
                backgroundSize: '48px 48px',
            }} />

            {/* ── Main content ─────────────────────────────────────── */}
            <div className="relative z-10 flex flex-col items-center">

                {/* Animated logo mark */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className="relative mb-10"
                >
                    {/* Outer rotating ring */}
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
                        style={{
                            position: 'absolute',
                            inset: '-20px',
                            borderRadius: '50%',
                            border: '1.5px dashed rgba(249,115,22,0.25)',
                        }}
                    />
                    {/* Inner counter-rotating ring */}
                    <motion.div
                        animate={{ rotate: -360 }}
                        transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                        style={{
                            position: 'absolute',
                            inset: '-10px',
                            borderRadius: '50%',
                            border: '1.5px dashed rgba(255,255,255,0.08)',
                        }}
                    />

                    {/* Logo container */}
                    <div style={{
                        width: '80px', height: '80px',
                        borderRadius: '22px',
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        backdropFilter: 'blur(20px)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 0 40px rgba(249,115,22,0.2), 0 20px 60px rgba(0,0,0,0.4)',
                    }}>
                        <motion.div
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                            style={{
                                background: 'linear-gradient(135deg, #FB923C, #F97316, #EA580C)',
                                padding: '12px',
                                borderRadius: '14px',
                                boxShadow: '0 8px 24px rgba(249,115,22,0.45)',
                            }}
                        >
                            <Briefcase size={24} color="white" />
                        </motion.div>
                    </div>
                </motion.div>

                {/* Brand name */}
                <motion.h2
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    style={{
                        fontFamily: 'Plus Jakarta Sans, Inter, sans-serif',
                        fontSize: '26px',
                        fontWeight: 900,
                        letterSpacing: '-0.03em',
                        color: 'white',
                        marginBottom: '6px',
                    }}
                >
                    Ledger<span style={{
                        background: 'linear-gradient(135deg, #FB923C, #F97316)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                    }}>Bandhu</span>
                </motion.h2>

                {/* Animated dot loader */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '28px', marginTop: '4px' }}
                >
                    {[0, 1, 2].map(i => (
                        <motion.div
                            key={i}
                            animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.2, 0.8] }}
                            transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2, ease: 'easeInOut' }}
                            style={{
                                width: '6px', height: '6px', borderRadius: '50%',
                                background: '#F97316',
                            }}
                        />
                    ))}
                </motion.div>

                {/* Progress bar */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    style={{ width: '160px', height: '3px', borderRadius: '999px', background: 'rgba(255,255,255,0.07)', overflow: 'hidden' }}
                >
                    <motion.div
                        animate={{ x: ['-100%', '100%'] }}
                        transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
                        style={{
                            height: '100%', width: '60%', borderRadius: '999px',
                            background: 'linear-gradient(90deg, transparent, #F97316, transparent)',
                        }}
                    />
                </motion.div>

                {/* Status text */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0.4, 0.8, 0.4] }}
                    transition={{ delay: 0.7, duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    style={{
                        marginTop: '16px',
                        fontSize: '9px',
                        fontWeight: 700,
                        letterSpacing: '0.22em',
                        textTransform: 'uppercase',
                        color: 'rgba(255,255,255,0.3)',
                        fontFamily: 'Plus Jakarta Sans, Inter, sans-serif',
                    }}
                >
                    Authenticating
                </motion.p>
            </div>
        </div>
    );
};

export default Loading;
