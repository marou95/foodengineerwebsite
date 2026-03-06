import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Send, Linkedin, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

// Components
import Journey from '../components/Journey';
import LabJournal from '../components/JournalLab';

// Services & Types
import { urlFor } from '../services/sanity.client';
import { JourneyStep, BlogPost } from '../types';

interface HomePageProps {
    posts: BlogPost[];
    journeySteps: JourneyStep[];
    loading: boolean;
}

const HomePage: React.FC<HomePageProps> = ({ journeySteps = [], posts = [], loading }) => {
    const { t, i18n } = useTranslation();
    const lang = (i18n.language || 'en') as 'en' | 'tr';

    const [formStatus, setFormStatus] = useState<'IDLE' | 'SENDING' | 'SUCCESS' | 'ERROR'>('IDLE');

    const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        e.preventDefault();
        const targetId = href.replace('#', '');
        const element = document.getElementById(targetId);
        if (element) {
            window.scrollTo({
                top: element.getBoundingClientRect().top + window.scrollY - 85,
                behavior: 'smooth'
            });
        }
    };

    const handleContactSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setFormStatus('SENDING');
        const form = e.currentTarget;
        const formData = new FormData(form);

        try {
            const response = await fetch("https://formspree.io/f/xgooooda", {
                method: "POST",
                body: formData,
                headers: { 'Accept': 'application/json' }
            });

            if (response.ok) {
                setFormStatus('SUCCESS');
                form.reset();
            } else {
                setFormStatus('ERROR');
            }
        } catch (error) {
            setFormStatus('ERROR');
        }
    };

    // Défilement automatique vers l'ancre au chargement (depuis une autre page)
    useEffect(() => {
        if (!loading && window.location.hash) {
            const targetId = window.location.hash.replace('#', '');
            const element = document.getElementById(targetId);
            if (element) {
                // Un léger délai permet au navigateur de finir de peindre le DOM
                setTimeout(() => {
                    window.scrollTo({
                        top: element.getBoundingClientRect().top + window.scrollY - 85,
                        behavior: 'smooth'
                    });
                }, 100);
            }
        }
    }, [loading]);

    return (
        <main className="relative z-10">

            {/* --- HERO SECTION --- */}
            <section className="relative min-h-screen flex items-center justify-center px-6 pt-32 pb-20 overflow-hidden">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12 lg:gap-16 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="relative w-full md:w-1/3 flex justify-center md:justify-end"
                    >
                        <div className="relative group">
                            <div className="absolute -inset-4 bg-lab-mint/20 rounded-full blur-2xl group-hover:bg-lab-mint/30 transition-all duration-700" />
                            <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden border-4 border-white shadow-2xl bg-white">
                                <img
                                    src="/images/picture.jpeg"
                                    alt="Melisa Mumcu"
                                    className="w-full h-full object-cover scale-105 group-hover:scale-110 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-lab-dark/5" />
                            </div>
                            <motion.div
                                animate={{ y: [0, -8, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute bottom-2 -right-2 bg-white/90 backdrop-blur-md p-3 rounded-2xl shadow-xl border border-lab-mint/30 z-20"
                            >
                                <p className="text-lab-citrus font-bold text-lg leading-none text-center">5+</p>
                                <p className="text-slate-500 text-[9px] uppercase font-black tracking-tighter">Years of Exp</p>
                            </motion.div>
                        </div>
                    </motion.div>

                    <div className="w-full md:w-2/3 text-left">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="font-serif text-5xl md:text-7xl font-bold text-lab-dark mb-4 leading-tight"
                        >
                            {t('hero.title')}
                        </motion.h1>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="flex items-center gap-3 mb-6"
                        >
                            <span className="h-[1px] w-12 bg-lab-citrus" />
                            <span className="text-lab-citrus font-bold uppercase backdrop-blur-xl tracking-widest text-sm">
                                {t('hero.role')}
                            </span>
                        </motion.div>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="text-lg md:text-xl text-slate-600 font-light mb-8 leading-relaxed border-l-2 border-lab-mint/30 pl-6 max-w-2xl"
                        >
                            {t('hero.bio') || "Food Engineer specialized in beverage formulation and R&D. From laboratory analysis to industrial scale-up, I bridge the gap between scientific innovation and sensory delight."}
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="flex flex-wrap gap-4"
                        >
                            <a
                                href="#journey"
                                onClick={(e) => handleSmoothScroll(e, '#journey')}
                                className="inline-flex items-center gap-2 bg-lab-dark text-white px-8 py-4 rounded-md font-bold hover:bg-slate-800 transition-all shadow-xl shadow-lab-mint/10"
                            >
                                {t('hero.cta')} <ArrowRight size={18} />
                            </a>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* --- JOURNEY SECTION (Composant Importé) --- */}
            <Journey journeySteps={journeySteps} loading={loading} />

            {/* --- BLOG SECTION (Lab Journal) --- */}
            <LabJournal posts={posts} />

            {/* --- CONTACT SECTION --- */}
            <section id="contact" className="py-24 px-6 max-w-4xl mx-auto">
                <div className="bg-white/70 backdrop-blur-2xl rounded-[2.5rem] p-8 md:p-16 shadow-2xl border border-white/50 relative overflow-hidden">
                    <h2 className="font-serif text-4xl text-center text-lab-dark mb-12">{t('contact.title')}</h2>

                    {formStatus === 'SUCCESS' ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center py-8"
                        >
                            <div className="bg-lab-mint/20 text-lab-dark p-8 rounded-3xl border border-lab-mint/30 inline-block">
                                <p className="font-serif text-2xl mb-2 text-lab-dark">Message Received.</p>
                                <p className="text-sm opacity-70">I will process your request and respond shortly.</p>
                                <button
                                    onClick={() => setFormStatus('IDLE')}
                                    className="mt-6 text-xs font-bold underline uppercase tracking-[0.2em]"
                                >
                                    Send another report
                                </button>
                            </div>
                        </motion.div>
                    ) : (
                        <form className="space-y-6 relative z-10" onSubmit={handleContactSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <input
                                    required
                                    name="name"
                                    type="text"
                                    placeholder={t('contact.name')}
                                    className="w-full bg-white/50 border-b-2 border-slate-200 px-0 py-4 focus:outline-none focus:border-lab-mint transition-all font-medium"
                                />
                                <input
                                    required
                                    name="email"
                                    type="email"
                                    placeholder={t('contact.email')}
                                    className="w-full bg-white/50 border-b-2 border-slate-200 px-0 py-4 focus:outline-none focus:border-lab-mint transition-all font-medium"
                                />
                            </div>
                            <textarea
                                required
                                name="message"
                                rows={4}
                                placeholder={t('contact.message')}
                                className="w-full bg-white/50 border-b-2 border-slate-200 px-0 py-4 focus:outline-none focus:border-lab-mint transition-all font-medium resize-none"
                            ></textarea>

                            <button
                                disabled={formStatus === 'SENDING'}
                                type="submit"
                                className={`w-full bg-lab-dark text-white font-bold py-5 rounded-2xl transition-all flex items-center justify-center gap-3 
                  ${formStatus === 'SENDING' ? 'opacity-50 cursor-wait' : 'hover:bg-slate-800 shadow-xl shadow-lab-mint/20 hover:-translate-y-1'}`}
                            >
                                {formStatus === 'SENDING' ? (
                                    <span className="animate-pulse tracking-widest uppercase text-xs">Transmitting...</span>
                                ) : (
                                    <><Send size={20} /> {t('contact.send')}</>
                                )}
                            </button>

                            {formStatus === 'ERROR' && (
                                <p className="text-red-500 text-xs text-center font-bold animate-shake">
                                    Transmission failed. Please try again or reach out via LinkedIn.
                                </p>
                            )}
                        </form>
                    )}
                </div>

                {/* --- FOOTER --- */}
                <footer className="mt-24 flex flex-col items-center gap-6 text-slate-400">
                    <div className="flex gap-8">
                        <a
                            href="https://www.linkedin.com/in/melisa-mumcu/"
                            target="_blank"
                            rel="noreferrer"
                            className="p-3 bg-white rounded-full shadow-md hover:text-lab-dark hover:shadow-lg transition-all"
                        >
                            <Linkedin size={22} />
                        </a>
                    </div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.4em] opacity-50 text-center">
                        © {new Date().getFullYear()} Melisa Mumcu • Food Engineer • All rights reserved
                    </p>
                </footer>
            </section>
        </main>
    );
};

export default HomePage;