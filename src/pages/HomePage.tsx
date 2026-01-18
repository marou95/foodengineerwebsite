import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Send, Linkedin, Calendar, User } from 'lucide-react';
import { Link } from 'react-router-dom';

// Components
import DrinkCard from '../components/DrinkCard';
// Services & Types
import { urlFor } from '../services/sanity.client';
import { DrinkProject, BlogPost } from '../types';

interface HomePageProps {
    drinks: DrinkProject[];
    posts: BlogPost[];
    loading: boolean;
}

const HomePage: React.FC<HomePageProps> = ({ drinks, posts, loading }) => {
    const { t, i18n } = useTranslation();
    const lang = (i18n.language || 'en') as 'en' | 'tr';

    // État du formulaire de contact
    const [formStatus, setFormStatus] = useState<'IDLE' | 'SENDING' | 'SUCCESS' | 'ERROR'>('IDLE');

    // Gestion du scroll fluide interne
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

    // Envoi du formulaire via Formspree
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
            <section className="relative min-h-screen flex items-center justify-center px-6 pt-32 pb-20 overflow-hidden">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12 lg:gap-16 relative z-10">

                    {/* COLONNE GAUCHE : PHOTO RONDE & BADGE */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="relative w-full md:w-1/3 flex justify-center md:justify-end"
                    >
                        <div className="relative group">
                            {/* Décoration de fond (halo mint) */}
                            <div className="absolute -inset-4 bg-lab-mint/20 rounded-full blur-2xl group-hover:bg-lab-mint/30 transition-all duration-700" />

                            {/* Conteneur Photo Circulaire */}
                            <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden border-4 border-white shadow-2xl bg-white">
                                <img
                                    src="/images/picture.jpeg" // Ta photo
                                    alt="Melisa Mumcu"
                                    className="w-full h-full object-cover scale-105 group-hover:scale-110 transition-transform duration-500"
                                />
                                {/* Overlay très léger */}
                                <div className="absolute inset-0 bg-lab-dark/5" />
                            </div>

                            {/* Badge d'expérience ajusté pour le format rond */}
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

                    {/* COLONNE DROITE : TEXTE & PARCOURS */}
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
                                href="#portfolio"
                                onClick={(e) => handleSmoothScroll(e, '#portfolio')}
                                className="inline-flex items-center gap-2 bg-lab-dark text-white px-8 py-4 rounded-full font-bold hover:bg-slate-800 transition-all shadow-xl shadow-lab-mint/10"
                            >
                                {t('hero.cta')} <ArrowRight size={18} />
                            </a>
                        </motion.div>
                    </div>

                </div>
            </section>
            {/* --- PORTFOLIO SECTION (Horizontal Scroll) --- */}
            <section id="portfolio" className="py-24 overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 mb-16">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="border-l-4 border-lab-citrus pl-6"
                    >
                        <h2 className="font-serif text-4xl text-lab-dark">{t('portfolio.title')}</h2>
                    </motion.div>
                </div>

                <div
                    className="flex gap-8 overflow-x-auto px-6 md:px-[calc((100vw-1280px)/2+24px)] snap-x snap-mandatory"
                    style={{
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none',
                        WebkitOverflowScrolling: 'touch'
                    }}
                >
                    {loading ? (
                        <div className="w-full text-center py-20 text-slate-400 animate-pulse font-serif italic text-xl">
                            Calibrating Data...
                        </div>
                    ) : (
                        drinks.map((drink) => (
                            <div key={drink._id} className="flex-shrink-0 w-[280px] snap-center">
                                <DrinkCard project={drink} />
                            </div>
                        ))
                    )}
                    <div className="flex-shrink-0 w-10 h-1"></div>
                </div>

                <style jsx>{`
        div.overflow-x-auto::-webkit-scrollbar {
            display: none;
        }
    `}</style>
            </section>

            {/* --- BLOG SECTION (Lab Journal) --- */}
            <section id="blog" className="py-24 bg-white/20 backdrop-blur-sm border-y border-white/20">
                <div className="max-w-7xl mx-auto px-6">

                    {/* Titre transformé en Lien vers l'archive */}
                    <Link to="/blog" className="group inline-block mb-12">
                        <motion.h2
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            className="font-serif text-4xl text-lab-dark group-hover:text-lab-citrus transition-colors flex items-center gap-4"
                        >
                            {t('blog.title')}
                            <ArrowRight
                                size={24}
                                className="opacity-1 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-lab-citrus"
                            />
                        </motion.h2>
                    </Link>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        {posts.map((post) => {
                            const slug = post.slug?.current;
                            const imageUrl = post.mainImage?.asset?._ref
                                ? urlFor(post.mainImage).width(500).height(400).url()
                                : "/images/default.jpg";

                            return (
                                <Link
                                    key={post._id}
                                    to={slug ? `/blog/${slug}` : '#'}
                                    className="flex flex-col md:flex-row gap-6 group cursor-pointer"
                                >
                                    {/* ... reste du code des cartes d'articles ... */}
                                    <div className="w-full md:w-48 h-48 rounded-2xl overflow-hidden shadow-lg flex-shrink-0">
                                        <img
                                            src={imageUrl}
                                            alt=""
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                    </div>
                                    <div className="flex-1 flex flex-col justify-center">
                                        <div className="flex items-center gap-3 text-[10px] font-bold text-lab-citrus uppercase tracking-widest mb-3">
                                            <Calendar size={12} />
                                            {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : 'Recent'}
                                        </div>
                                        <h3 className="text-xl font-serif font-semibold text-lab-dark mb-3 group-hover:text-lab-citrus transition-colors">
                                            {post.title?.[lang] || 'Untitled'}
                                        </h3>
                                        <p className="text-sm text-slate-600 mb-4 line-clamp-2 leading-relaxed">
                                            {post.excerpt?.[lang]}
                                        </p>
                                        <span className="text-xs font-bold underline decoration-lab-mint underline-offset-8 group-hover:decoration-lab-citrus transition-all">
                                            {t('blog.read_more') || 'Read Full Entry'}
                                        </span>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* --- CONTACT SECTION (Functional) --- */}
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