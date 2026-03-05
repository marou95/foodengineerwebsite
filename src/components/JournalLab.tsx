import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Calendar, ArrowRight } from 'lucide-react';
import { urlFor } from '../services/sanity.client';
import { BlogPost } from '../types';

interface LabJournalProps {
    posts: BlogPost[];
}

const LabJournal: React.FC<LabJournalProps> = ({ posts }) => {
    const { t, i18n } = useTranslation();
    const lang = (i18n.language || 'en') as 'en' | 'tr';

    return (
        <section id="blog" className="py-32 bg-white/20 backdrop-blur-sm border-y border-white/20">
            <div className="max-w-7xl mx-auto px-6">
                
                <div className="mb-20 text-center md:text-left">
                    <span className="text-lab-citrus font-bold tracking-[0.2em] uppercase text-xs mb-4 block">
                        Lab Journal
                    </span>
                    <h2 className="font-serif text-4xl md:text-5xl text-lab-dark">
                        {t('blog.title', 'Latest Insights')}
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
                    {posts.slice(0, 3).map((post) => {
                        const slug = post.slug?.current;
                        const imageUrl = post.mainImage?.asset?._ref
                            ? urlFor(post.mainImage).width(600).height(450).fit('crop').url()
                            : "/images/default.jpg";

                        return (
                            <Link
                                key={post._id}
                                to={slug ? `/blog/${slug}` : '#'}
                                className="flex flex-col group cursor-pointer h-full"
                            >
                                <div className="w-full aspect-[4/3] overflow-hidden bg-slate-50 mb-8 rounded-none">
                                    <img
                                        src={imageUrl}
                                        alt={post.title?.[lang] || 'Article illustration'}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
                                    />
                                </div>
                                
                                <div className="flex flex-col flex-1">
                                    
                                    {/* Ligne contenant la date et les tags */}
                                    <div className="flex items-center flex-wrap gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">
                                        <div className="flex items-center gap-2">
                                            <Calendar size={14} className="opacity-50" />
                                            <span>{post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : 'Recent'}</span>
                                        </div>
                                        
                                        {post.tags && post.tags.length > 0 && (
                                            <>
                                                <span className="opacity-30 mx-1">•</span>
                                                <span className="text-lab-citrus truncate max-w-[150px]">
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

                <div className="mt-24 text-center">
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