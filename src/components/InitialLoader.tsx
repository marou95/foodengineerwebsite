import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FlaskConical } from 'lucide-react';

const InitialLoader: React.FC = () => {
    const [messageIndex, setMessageIndex] = useState(0);

    const messages = [
        "Initializing Lab Equipment...",
        "Scanning Formulations...",
        "Calibrating pH Levels...",
        "Optimizing Brix Values...",
        "Finalizing Lab Journal..."
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setMessageIndex((prev) => (prev + 1) % messages.length);
        }, 800);
        return () => clearInterval(interval);
    }, []);

    return (
        <motion.div
            initial={{ opacity: 1 }}
            exit={{
                opacity: 0,
                pointerEvents: 'none',
                transition: { duration: 0.8 }
            }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-lab-white"
        >
            <div className="relative">
                {/* Cercle pulsant en arrière-plan */}
                <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 bg-lab-mint/30 blur-3xl rounded-full"
                />

                {/* Icône de fiole animée */}
                <motion.div
                    animate={{ y: [0, -15, 0], rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="relative bg-white p-8 rounded-full shadow-2xl border border-lab-mint/20 text-lab-dark mb-8"
                >
                    <FlaskConical size={64} strokeWidth={1.5} />
                </motion.div>
            </div>

            {/* Texte de chargement dynamique */}
            <motion.div
                key={messageIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-center"
            >
                <p className="font-serif text-2xl text-lab-dark mb-2">The Flavour Lab</p>
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-lab-citrus">
                    {messages[messageIndex]}
                </p>
            </motion.div>

            {/* Barre de progression discrète */}
            <div className="w-48 h-[2px] bg-slate-100 mt-12 overflow-hidden rounded-full">
                <motion.div
                    initial={{ x: "-100%" }}
                    animate={{ x: "100%" }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    className="w-full h-full bg-lab-mint"
                />
            </div>
        </motion.div>
    );
};

export default InitialLoader;