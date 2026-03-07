import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ArrowRight } from 'lucide-react';
import { PortableText } from '@portabletext/react';
import { EngineerProfile } from '../types';
import { urlFor } from '../services/sanity.client';

interface HeroProps {
    profile?: EngineerProfile;
}

const Hero: React.FC<HeroProps> = ({ profile }) => {
    const { t, i18n } = useTranslation();
    const lang = (i18n.language || 'en') as 'en' | 'tr';

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

    const imageUrl = profile?.profileImage?.asset?._ref
        ? urlFor(profile.profileImage).width(800).height(800).fit('crop').url()
        : "/images/picture.jpeg";

    return (
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
                                src={imageUrl}
                                alt={profile?.name || "Profile Picture"}
                                className="w-full h-full object-cover scale-105 group-hover:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-lab-dark/5" />
                        </div>
                        <motion.div
                            animate={{ y: [0, -8, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute bottom-2 -right-2 bg-white/90 backdrop-blur-md p-3 rounded-2xl shadow-xl border border-lab-mint/30 z-20"
                        >
                            <p className="text-lab-citrus font-bold text-lg leading-none text-center">
                                {profile?.yearsOfExperience || 5}+
                            </p>
                            <p className="text-slate-500 text-[9px] uppercase font-black tracking-tighter">
                                Years of Exp
                            </p>
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
                        {profile?.name || t('hero.title')}
                    </motion.h1>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="flex items-center gap-3 mb-6"
                    >
                        <span className="h-[1px] w-12 bg-lab-citrus" />
                        <span className="text-lab-citrus font-bold uppercase backdrop-blur-xl tracking-widest text-sm">
                            {profile?.role || t('hero.role')}
                        </span>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-lg md:text-xl text-slate-600 font-light mb-8 leading-relaxed border-l-2 border-lab-mint/30 pl-6 max-w-2xl prose prose-slate"
                    >
                        {profile?.bio?.[lang] ? (
                            <PortableText value={profile.bio[lang]} />
                        ) : (
                            <p>{t('hero.bio')}</p>
                        )}
                    </motion.div>

                    {profile?.specialties && profile.specialties.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.45 }}
                            className="flex flex-wrap gap-2 mb-8 pl-6 max-w-2xl"
                        >
                            {profile.specialties.map((specialty, index) => (
                                <span 
                                    key={index} 
                                    className="text-[10px] font-bold uppercase tracking-[0.2em] text-lab-dark border border-slate-200 px-3 py-1.5 hover:border-lab-citrus hover:text-lab-citrus transition-colors cursor-default"
                                >
                                    {specialty}
                                </span>
                            ))}
                        </motion.div>
                    )}

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
    );
};

export default Hero;