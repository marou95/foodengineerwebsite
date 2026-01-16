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
          // On décode l'URL pour transformer "%20" en espace si nécessaire
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

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-lab-white font-serif text-xl animate-pulse">
        Accessing Lab Journal...
      </div>
    );
  }

  if (!post) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-lab-white p-6">
        <h2 className="text-2xl font-serif mb-4 text-lab-dark">Journal Entry Not Found</h2>
        <p className="text-slate-500 mb-8">The requested formulation report is missing.</p>
        <button onClick={() => navigate('/')} className="bg-lab-dark text-white px-8 py-3 rounded-full flex items-center gap-2">
          <ArrowLeft size={18} /> {t('common.back')}
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
      className="min-h-screen pt-32 pb-20 px-6 bg-lab-white relative z-10"
    >
      <article className="max-w-3xl mx-auto">
        {/* Navigation */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-slate-400 hover:text-lab-dark mb-10 transition-colors group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          {t('Back')}
        </button>

        {/* Header */}
        <header className="mb-12">
          <div className="flex flex-wrap items-center gap-6 text-[10px] font-bold text-lab-citrus uppercase tracking-[0.2em] mb-6">
            <span className="flex items-center gap-2"><Calendar size={14} /> {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : 'Recent'}</span>
            <span className="flex items-center gap-2"><User size={14} /> Food Engineer</span>
          </div>

          <h1 className="font-serif text-4xl md:text-6xl text-lab-dark leading-tight mb-8">
            {post.title?.[lang] || 'Untitled'}
          </h1>

          <div className="h-1 w-20 bg-lab-mint mb-8" />

          <p className="text-xl text-slate-500 font-light italic leading-relaxed border-l-4 border-lab-mint pl-6">
            {post.excerpt?.[lang]}
          </p>
        </header>

        {/* Featured Image */}
        {imageUrl && (
          <div className="rounded-[2rem] overflow-hidden shadow-2xl mb-12 border border-white max-h-[300px] relative aspect-video">
            <img
              src={imageUrl}
              alt={post.title?.[lang] || 'Article illustration'}
              className="w-full h-full object-cover absolute inset-0"
            />
          </div>
        )}

        {/* Body Content */}
        <div className="prose prose-lg prose-slate max-w-none font-sans text-slate-700 leading-loose">
          {post.body && post.body[lang] ? (
            <PortableText value={post.body[lang]} />
          ) : (
            <p className="italic text-slate-400">No content analysis available.</p>
          )}
        </div>
      </article>
    </motion.div>
  );
};

export default BlogPostDetail;