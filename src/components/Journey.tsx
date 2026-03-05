import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { PortableText } from '@portabletext/react';
import { ChevronDown } from 'lucide-react';
import { urlFor } from '../services/sanity.client';
import { JourneyStep } from '../types';

interface JourneyProps {
    journeySteps: JourneyStep[];
    loading: boolean;
}

const Journey: React.FC<JourneyProps> = ({ journeySteps, loading }) => {
    const { t, i18n } = useTranslation();
    const lang = (i18n.language || 'en') as 'en' | 'tr';
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const toggleStep = (id: string) => {
        setExpandedId((prevId) => (prevId === id ? null : id));
    };

    return (
        <section id="journey" className="py-8 relative overflow-hidden bg-white/40 backdrop-blur-sm border-t border-white/40">
            <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-lab-mint/40 to-transparent hidden md:block" />

            <div className="max-w-6xl mx-auto px-6 relative z-10">
                <div className="text-center mb-24">
                    {/* <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-lab-citrus font-bold tracking-[0.2em] uppercase text-xs mb-4 block"
                    >
                        {t('journey.subtitle') || 'My Journey'}
                    </motion.span> */}
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-serif text-lab-dark mb-6"
                    >
                        {t('journey.title') || 'Expertise in Flavors'}
                    </motion.h2>
                    <motion.div
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                        className="h-px w-24 bg-lab-mint mx-auto"
                    />
                </div>

                {loading ? (
                    <div className="w-full text-center py-20 text-slate-400 animate-pulse font-serif italic text-xl">
                        Tracing professional path...
                    </div>
                ) : (
                    <div className="space-y-32 md:space-y-36">
                        {journeySteps.map((step, index) => {
                            const hasImage = !!step.image?.asset?._ref;
                            const isEven = index % 2 === 0;
                            const isExpanded = expandedId === step._id;

                            return (
                                <motion.div
                                    key={step._id}
                                    initial={{ opacity: 0, y: 80 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-10%" }}
                                    transition={{ duration: 1, ease: "easeOut" }}
                                    className={`flex flex-col md:items-start ${hasImage
                                            ? (isEven ? 'md:flex-row' : 'md:flex-row-reverse')
                                            : 'items-center text-center'
                                        } gap-10 md:gap-20 relative`}
                                >

                                    <div className="hidden md:block absolute left-1/2 top-4 -translate-x-1/2 w-4 h-4 rounded-full bg-white border-[3px] border-lab-mint z-20 shadow-lg shadow-lab-mint/30" />

                                    {hasImage && (
                                        <div className="w-full md:w-[30%] max-w-sm flex-shrink-0 group">
                                            <div className="relative aspect-[4/3] md:aspect-[4/3] overflow-hidden shadow-lg bg-slate-50 rounded-none border-white">
                                                <img
                                                    src={urlFor(step.image).width(600).height(450).url()}
                                                    alt={step.company}
                                                    className="w-full h-full object-cover rounded-none transition-transform duration-1000 group-hover:scale-105"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-lab-dark/10 to-transparent opacity-60 rounded-none" />
                                            </div>
                                        </div>
                                    )}

                                    <div className={`w-full ${hasImage ? 'md:w-[70%] text-left' : 'max-w-2xl text-center'} flex flex-col justify-start mt-2`}>

                                        <span className="text-lab-citrus font-bold tracking-[0.2em] uppercase text-xs mb-3 block">
                                            {step.period?.[lang] || 'Date pending'}
                                        </span>

                                        <h3 className="font-serif text-3xl md:text-4xl text-lab-dark mb-3 leading-tight">
                                            {step.role?.[lang] || 'Untitled Role'}
                                        </h3>

                                        <span className="text-slate-500 font-serif italic text-xl md:text-2xl mb-6 block">
                                            {step.company}
                                        </span>

                                        <motion.div
                                            animate={{ height: isExpanded ? 'auto' : '5rem' }}
                                            transition={{ duration: 0.5, ease: [0.04, 0.62, 0.23, 0.98] }}
                                            className={`prose prose-lg prose-slate prose-p:font-light prose-p:leading-relaxed text-slate-600 overflow-hidden relative ${hasImage ? '' : 'mx-auto'}`}
                                        >
                                            {step.description?.[lang] ? (
                                                <PortableText value={step.description[lang]} />
                                            ) : (
                                                <p>Description pending.</p>
                                            )}

                                            <AnimatePresence>
                                                {!isExpanded && (
                                                    <motion.div
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        exit={{ opacity: 0 }}
                                                        className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none"
                                                    />
                                                )}
                                            </AnimatePresence>
                                        </motion.div>

                                        <button
                                            onClick={() => toggleStep(step._id)}
                                            className={`flex items-center gap-3 ${hasImage ? '' : 'justify-center'} mt-5 text-lab-citrus group`}
                                        >
                                            <span className="text-sm font-bold uppercase tracking-widest underline decoration-transparent group-hover:decoration-lab-citrus transition-all">
                                                {isExpanded ? (t('journey.read_less') || 'Read less') : (t('journey.read_more') || 'Read more')}
                                            </span>

                                            <motion.div
                                                animate={{ rotate: isExpanded ? 180 : 0 }}
                                                transition={{ duration: 0.3 }}
                                                className="bg-lab-mint/10 p-2 rounded-full flex-shrink-0"
                                            >
                                                <ChevronDown size={18} />
                                            </motion.div>
                                        </button>

                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>
        </section>
    );
};

export default Journey;