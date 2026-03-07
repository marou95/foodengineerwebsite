import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Send, Linkedin } from 'lucide-react';

// Components
import Hero from '../components/Hero';
import Journey from '../components/Journey';
import LabJournal from '../components/JournalLab';

// Types
import { JourneyStep, BlogPost, EngineerProfile } from '../types';

interface HomePageProps {
    profile?: EngineerProfile;
    posts: BlogPost[];
    journeySteps: JourneyStep[];
    loading: boolean;
}

const HomePage: React.FC<HomePageProps> = ({ profile, journeySteps = [], posts = [], loading }) => {
    const { t } = useTranslation();

    const [formStatus, setFormStatus] = useState<'IDLE' | 'SENDING' | 'SUCCESS' | 'ERROR'>('IDLE');

    // Défilement automatique vers l'ancre au chargement (depuis une autre page)
    useEffect(() => {
        if (!loading && window.location.hash) {
            const targetId = window.location.hash.replace('#', '');
            const element = document.getElementById(targetId);
            if (element) {
                setTimeout(() => {
                    window.scrollTo({
                        top: element.getBoundingClientRect().top + window.scrollY - 85,
                        behavior: 'smooth'
                    });
                }, 100);
            }
        }
    }, [loading]);

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

    return (
        <main className="relative z-10">

            {/* --- HERO SECTION --- */}
            <Hero profile={profile} />

            {/* --- JOURNEY SECTION --- */}
            <Journey journeySteps={journeySteps} loading={loading} />

            {/* --- BLOG SECTION (Lab Journal) --- */}
            <LabJournal posts={posts} />

            {/* --- CONTACT SECTION --- */}
            <section id="contact" className="py-24 px-6 max-w-3xl mx-auto">
                <div className="bg-white/60 backdrop-blur-2xl rounded-[2rem] p-6 md:p-10 shadow-xl border border-white/50 relative overflow-hidden">
                    <h2 className="font-serif text-3xl md:text-4xl text-center text-lab-dark mb-10">{t('contact.title', 'Get in Touch')}</h2>

                    {formStatus === 'SUCCESS' ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center py-8"
                        >
                            <div className="bg-lab-mint/10 text-lab-dark p-8 rounded-2xl border border-lab-mint/20 inline-block">
                                <p className="font-serif text-2xl mb-2 text-lab-dark">Message Received.</p>
                                <p className="text-sm opacity-70">I will process your request and respond shortly.</p>
                                <button
                                    onClick={() => setFormStatus('IDLE')}
                                    className="mt-6 text-xs font-bold underline uppercase tracking-[0.2em] hover:text-lab-citrus transition-colors"
                                >
                                    Send another message
                                </button>
                            </div>
                        </motion.div>
                    ) : (
                        <form className="space-y-6 relative z-10" onSubmit={handleContactSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                                <input
                                    required
                                    name="name"
                                    type="text"
                                    placeholder={t('contact.name', 'Your Name')}
                                    className="w-full bg-transparent border-b border-slate-300 px-0 py-3 focus:outline-none focus:border-lab-citrus transition-colors text-lab-dark placeholder:text-slate-400"
                                />
                                <input
                                    required
                                    name="email"
                                    type="email"
                                    placeholder={t('contact.email', 'Email Address')}
                                    className="w-full bg-transparent border-b border-slate-300 px-0 py-3 focus:outline-none focus:border-lab-citrus transition-colors text-lab-dark placeholder:text-slate-400"
                                />
                            </div>
                            
                            <input
                                required
                                name="subject"
                                type="text"
                                placeholder={t('contact.subject', 'Subject')}
                                className="w-full bg-transparent border-b border-slate-300 px-0 py-3 focus:outline-none focus:border-lab-citrus transition-colors text-lab-dark placeholder:text-slate-400"
                            />

                            <textarea
                                required
                                name="message"
                                rows={4}
                                placeholder={t('contact.message', 'Your Message')}
                                className="w-full bg-transparent border-b border-slate-300 px-0 py-3 focus:outline-none focus:border-lab-citrus transition-colors text-lab-dark placeholder:text-slate-400 resize-none"
                            ></textarea>

                            <button
                                disabled={formStatus === 'SENDING'}
                                type="submit"
                                className={`w-full bg-lab-dark text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-3 mt-4
                  ${formStatus === 'SENDING' ? 'opacity-50 cursor-wait' : 'hover:bg-slate-800 shadow-lg hover:-translate-y-0.5'}`}
                            >
                                {formStatus === 'SENDING' ? (
                                    <span className="animate-pulse tracking-widest uppercase text-xs">Transmitting...</span>
                                ) : (
                                    <><Send size={18} /> <span className="uppercase tracking-widest text-xs">{t('contact.send', 'Send Message')}</span></>
                                )}
                            </button>

                            {formStatus === 'ERROR' && (
                                <motion.div 
                                    initial={{ opacity: 0, y: -10 }} 
                                    animate={{ opacity: 1, y: 0 }} 
                                    className="bg-red-50 text-red-800 p-4 rounded-xl text-center border border-red-100 mt-4"
                                >
                                    <p className="text-sm font-medium mb-3">Service temporarily unavailable.</p>
                                    <a 
                                        href="https://www.linkedin.com/in/melisa-mumcu/" 
                                        target="_blank" 
                                        rel="noreferrer" 
                                        className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest bg-white px-4 py-2 rounded-lg shadow-sm hover:shadow hover:text-lab-citrus transition-all"
                                    >
                                        <Linkedin size={14} /> Text me on LinkedIn
                                    </a>
                                </motion.div>
                            )}
                        </form>
                    )}

                    {formStatus !== 'ERROR' && (
                        <div className="mt-10 pt-8 border-t border-slate-200 flex flex-col items-center">
                            <p className="text-sm text-slate-500 mb-4 font-serif italic">Or reach out directly</p>
                            <a 
                                href="https://www.linkedin.com/in/melisa-mumcu/" 
                                target="_blank" 
                                rel="noreferrer" 
                                className="flex items-center gap-2 text-lab-dark font-bold uppercase tracking-widest text-xs hover:text-lab-citrus transition-colors group"
                            >
                                <Linkedin size={18} className="group-hover:scale-110 transition-transform" /> 
                                Connect on LinkedIn
                            </a>
                        </div>
                    )}
                </div>

                {/* --- FOOTER --- */}
                <footer className="mt-20 flex flex-col items-center gap-4 text-slate-400">
                    <p className="text-[10px] font-bold uppercase tracking-[0.4em] opacity-50 text-center">
                        © {new Date().getFullYear()} Melisa Mumcu • Food Engineer • All rights reserved
                    </p>
                </footer>
            </section>
        </main>
    );
};

export default HomePage;