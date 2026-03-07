import React, { useRef, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Calendar, ArrowRight, ArrowLeft } from 'lucide-react';
import { urlFor } from '../services/sanity.client';
import { BlogPost } from '../types';

interface LabJournalProps {
    posts: BlogPost[];
}

const LabJournal: React.FC<LabJournalProps> = ({ posts }) => {
    const { t, i18n } = useTranslation();
    const lang = (i18n.language || 'en') as 'en' | 'tr';

    const carouselRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    const checkScroll = () => {
        if (carouselRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
            setCanScrollLeft(scrollLeft > 0);
            setCanScrollRight(Math.ceil(scrollLeft + clientWidth) < scrollWidth);
        }
    };

    useEffect(() => {
        checkScroll();
        window.addEventListener('resize', checkScroll);
        return () => window.removeEventListener('resize', checkScroll);
    }, [posts]);

    const scroll = (direction: 'left' | 'right') => {
        if (carouselRef.current) {
            const cardWidth = carouselRef.current.firstElementChild?.clientWidth || 300;
            const distance = cardWidth + 32;

            carouselRef.current.scrollBy({
                left: direction === 'left' ? -distance : distance,
                behavior: 'smooth'
            });
        }
    };

    return (
        <section id="blog" className="py-12 bg-white/20 backdrop-blur-sm border-y border-white/20">
            <div className="max-w-6xl mx-auto px-6">

                {/* En-tête simplifié */}
                <div className="mb-16 text-center md:text-left">
                    <span className="text-lab-citrus font-bold tracking-[0.2em] uppercase text-xs mb-4 block">
                        Lab Journal
                    </span>
                    <h2 className="font-serif text-4xl md:text-5xl text-lab-dark">
                        {t('blog.title', 'Latest Insights')}
                    </h2>
                </div>

                {/* Carrousel */}
                <div className="relative -mx-6 px-6 md:mx-0 md:px-0">
                    <div
                        ref={carouselRef}
                        onScroll={checkScroll}
                        className="flex gap-8 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-4 [&::-webkit-scrollbar]:hidden"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                        {posts.map((post) => {
                            const slug = post.slug?.current;
                            const imageUrl = post.mainImage?.asset?._ref
                                ? urlFor(post.mainImage).width(500).height(600).fit('crop').url()
                                : "/images/default.jpg";

                            return (
                                <Link
                                    key={post._id}
                                    to={slug ? `/blog/${slug}` : '#'}
                                    className="w-full md:w-[calc(33.333%-1.35rem)] flex-shrink-0 snap-start flex flex-col group cursor-pointer h-auto p-4 md:p-6 rounded-2xl hover:bg-slate-400/10 hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] transition-all duration-500"
                                >
                                    <div className="w-full aspect-[3/4] overflow-hidden bg-slate-50 mb-8 rounded-none">
                                        <img
                                            src={imageUrl}
                                            alt={post.title?.[lang] || 'Article illustration'}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
                                        />
                                    </div>
                                    <div className="flex flex-col flex-1">
                                        <div className="flex items-center flex-wrap gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">
                                            <div className="flex items-center gap-2">
                                                <Calendar size={14} className="opacity-50" />
                                                <span>{post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : 'Recent'}</span>
                                            </div>

                                            {post.tags && post.tags.length > 0 && (
                                                <>
                                                    <span className="opacity-30 mx-1">•</span>
                                                    <span className="text-lab-citrus truncate max-w-[180px]">
                                                        {post.tags.join(' / ')}
                                                    </span>
                                                </>
                                            )}
                                        </div>

                                        <h3 className="text-2xl font-serif text-lab-dark mb-4 group-hover:text-lab-citrus transition-colors leading-tight">
                                            {post.title?.[lang] || 'Untitled Formulation'}
                                        </h3>

                                        <p className="text-slate-600 font-light mb-8 line-clamp-3 leading-relaxed flex-1">
                                            {post.excerpt?.[lang]}
                                        </p>

                                        <div className="mt-auto flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-lab-citrus group-hover:gap-4 transition-all">
                                            {t('blog.read_more', 'Read Full Entry')}
                                            <ArrowRight size={14} />
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>

                {/* Contrôles de navigation (en bas à droite) */}
                <div className="mt-8 flex justify-end gap-4">
                    <button
                        onClick={() => scroll('left')}
                        disabled={!canScrollLeft}
                        className="p-4 rounded-full border border-slate-200 text-lab-dark disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white transition-all shadow-sm"
                        aria-label="Previous articles"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <button
                        onClick={() => scroll('right')}
                        disabled={!canScrollRight}
                        className="p-4 rounded-full border border-slate-200 text-lab-dark disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white transition-all shadow-sm"
                        aria-label="Next articles"
                    >
                        <ArrowRight size={20} />
                    </button>
                </div>

                {/* Bouton See All */}
                <div className="mt-16 text-center">
                    <Link
                        to="/blog"
                        className="inline-flex items-center gap-4 border border-lab-dark text-lab-dark hover:bg-lab-dark hover:text-white transition-colors px-10 py-5 font-bold uppercase tracking-[0.2em] text-xs"
                    >
                        See All Journal Entries <ArrowRight size={16} />
                    </Link>
                </div>

            </div>
        </section>
    );
};

export default LabJournal;