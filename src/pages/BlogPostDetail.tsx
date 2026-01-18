import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Calendar, User, Clock } from 'lucide-react';
import { PortableText } from '@portabletext/react';
import { getPostBySlug, urlFor } from '../services/sanity.client';
import { BlogPost } from '../types';

const BlogPostDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const lang = (i18n.language || 'en') as 'en' | 'tr';

  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      if (slug) {
        try {
          const decodedSlug = decodeURIComponent(slug);
          const data = await getPostBySlug(decodedSlug);
          setPost(data);
        } catch (error) {
          console.error("Erreur Lab Journal:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchPost();
  }, [slug]);

  // --- CONFIGURATION PORTABLE TEXT (Styles du Body) ---
  const ptComponents = {
    block: {
      normal: ({ children }: any) => <p className="mb-6 leading-relaxed text-slate-700">{children}</p>,
      h2: ({ children }: any) => (
        <h2 className="text-3xl font-serif font-bold text-lab-dark mt-12 mb-6 border-l-4 border-lab-mint pl-4">
          {children}
        </h2>
      ),
      h3: ({ children }: any) => (
        <h3 className="text-xl font-bold text-lab-citrus uppercase tracking-widest mt-10 mb-4 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-lab-citrus"></span>
          {children}
        </h3>
      ),
      blockquote: ({ children }: any) => (
        <blockquote className="border-l-4 border-lab-citrus pl-6 py-2 my-8 italic text-xl text-slate-500 bg-lab-white/50 rounded-r-lg">
          "{children}"
        </blockquote>
      ),
    },
    list: {
      bullet: ({ children }: any) => <ul className="list-none space-y-3 my-6 pl-4">{children}</ul>,
      number: ({ children }: any) => <ol className="list-decimal list-inside space-y-3 my-6 text-lab-dark font-medium">{children}</ol>,
    },
    listItem: {
      bullet: ({ children }: any) => (
        <li className="relative pl-6 before:content-['•'] before:absolute before:left-0 before:text-lab-citrus before:text-xl before:-top-1">
          {children}
        </li>
      ),
      number: ({ children }: any) => <li className="pl-2 marker:text-lab-citrus marker:font-bold">{children}</li>,
    },
    types: {
      image: ({ value }: any) => {
        if (!value?.asset?._ref) return null;
        const size = value.size || 'normal';
        let fetchWidth = 800;
        let containerClass = "my-10 max-w-3xl mx-auto";
        let imgClass = "w-full rounded-xl shadow-md";

        if (size === 'wide') {
          fetchWidth = 1200;
          containerClass = "my-12 w-full max-w-5xl mx-auto md:-ml-[10%] md:w-[120%]"; 
          imgClass = "w-full rounded-2xl shadow-xl";
        } else if (size === 'small') {
          fetchWidth = 500;
          containerClass = "my-8 max-w-sm mx-auto";
          imgClass = "w-full rounded-lg shadow-sm border border-slate-100";
        }

        const imageUrl = urlFor(value).width(fetchWidth).fit('max').auto('format').url();

        return (
          <figure className={`flex flex-col items-center group ${containerClass}`}>
            <img src={imageUrl} alt={value.alt || ''} className={`${imgClass} object-cover`} loading="lazy" />
            {value.caption && (
              <figcaption className="mt-3 text-center text-sm text-slate-500 font-serif italic">
                — {value.caption}
              </figcaption>
            )}
          </figure>
        );
      }
    },
    marks: {
      strong: ({ children }: any) => <strong className="font-bold text-lab-dark">{children}</strong>,
      em: ({ children }: any) => <em className="italic text-slate-600">{children}</em>,
      link: ({ value, children }: any) => {
        const target = (value?.href || '').startsWith('http') ? '_blank' : undefined;
        return (
          <a href={value?.href} target={target} rel={target === '_blank' ? 'noindex nofollow' : undefined} className="text-lab-citrus font-bold hover:underline decoration-2">
            {children}
          </a>
        );
      },
    },
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-lab-white font-serif text-xl animate-pulse text-lab-dark">
        Accessing Lab Journal...
      </div>
    );
  }

  if (!post) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-lab-white p-6">
        <h2 className="text-2xl font-serif mb-4 text-lab-dark">Journal Entry Not Found</h2>
        <button onClick={() => navigate('/')} className="bg-lab-dark text-white px-8 py-3 rounded-full flex items-center gap-2">
          <ArrowLeft size={18} /> {t('nav.back')}
        </button>
      </div>
    );
  }

  const imageUrl = post.mainImage?.asset?._ref
    ? urlFor(post.mainImage).width(1200).url()
    : null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen pt-32 pb-20 px-6 bg-transparent relative z-10"
    >
      <article className="max-w-3xl mx-auto">
        {/* Navigation */}
        <button
          onClick={() => navigate('/blog')}
          className="flex items-center gap-2 text-slate-400 hover:text-lab-dark mb-10 transition-colors group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          {t('nav.back') || 'Back to Archive'}
        </button>

        {/* Header */}
        <header className="mb-20 relative">
          {/* Fond décoratif */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-lab-mint/10 rounded-full blur-3xl -z-10" />
          
          <div className="flex flex-col md:flex-row items-start gap-8 md:gap-12">
            
            {/* COLONNE GAUCHE (Texte) */}
            <div className="flex-1 relative z-10 w-full">
              
              {/* Méta-données */}
              <div className="flex flex-wrap items-center gap-4 text-[10px] font-bold text-lab-citrus uppercase tracking-[0.2em] mb-6 border-b border-lab-citrus/20 pb-4">
                <span className="flex items-center gap-2">
                  <Calendar size={14} />
                  {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : 'Recent'}
                </span>
                <span className="w-1 h-1 rounded-full bg-lab-citrus/50" />
                <span className="flex items-center gap-2">
                  <User size={14} />
                  {t('hero.role')}
                </span>
              </div>

              {/* --- LAYOUT TITRE + IMAGE (Hybrid Mobile/Desktop) --- */}
              <div className="flex items-start justify-between gap-4 mb-8">
                
                {/* Le Titre (Prend toute la place sur PC, partage sur mobile) */}
                <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-lab-dark leading-[1.1]">
                  {post.title?.[lang] || 'Untitled Report'}
                </h1>

                {/* --- VIGNETTE MOBILE SEULEMENT (md:hidden) --- */}
                {/* S'affiche uniquement sur mobile à droite du titre */}
                {imageUrl && (
                  <div className="md:hidden w-24 h-24 flex-shrink-0 relative rotate-3 mt-1">
                    <div className="absolute inset-0 bg-lab-mint/20 rounded-lg blur-md" />
                    <img 
                      src={urlFor(post.mainImage).width(200).height(200).url()} 
                      alt="Thumbnail" 
                      className="w-full h-full object-cover rounded-lg shadow-lg border border-white relative z-10"
                    />
                  </div>
                )}
              </div>

              <p className="text-lg md:text-xl text-slate-500 font-light leading-relaxed border-l-[3px] border-lab-mint pl-6 italic">
                {post.excerpt?.[lang]}
              </p>
            </div>

            {/* COLONNE DROITE (Image Desktop) */}
            {imageUrl && (
              <div className="hidden md:block w-[40%] flex-shrink-0 relative group perspective-1000">
                <motion.div
                  initial={{ opacity: 0, rotate: 5, y: 20 }}
                  animate={{ opacity: 1, rotate: 2, y: 0 }}
                  transition={{ duration: 0.8, type: "spring" }}
                  className="relative z-10"
                >
                  <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-white p-2 border border-white/50">
                    <div className="aspect-square overflow-hidden rounded-xl bg-slate-100">
                      <img
                        src={imageUrl}
                        alt={post.title?.[lang]}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-tr from-lab-dark/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                    </div>
                  </div>
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-4 bg-lab-mint/30 backdrop-blur-sm -rotate-1 shadow-sm" />
                </motion.div>
                <div className="absolute -inset-4 bg-lab-citrus/20 rounded-full blur-2xl opacity-0 group-hover:opacity-40 transition-opacity duration-700 -z-10" />
              </div>
            )}

          </div>
        </header>

        {/* Body Content */}
        <div className="prose prose-lg prose-slate max-w-none font-sans text-slate-700 leading-loose prose-headings:font-serif prose-headings:text-lab-dark prose-a:text-lab-citrus prose-img:rounded-xl">
          {post.body && post.body[lang] ? (
            <PortableText value={post.body[lang]} components={ptComponents} />
          ) : (
            <p className="italic text-slate-400">No content analysis available.</p>
          )}
        </div>
      </article>
    </motion.div>
  );
};

export default BlogPostDetail;