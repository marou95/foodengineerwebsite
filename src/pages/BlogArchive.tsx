import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Calendar, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getPosts, urlFor } from '../services/sanity.client';
import { BlogPost } from '../types';

const BlogArchive: React.FC = () => {
  const { t, i18n } = useTranslation();
  const lang = (i18n.language || 'en') as 'en' | 'tr';

  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchAllPosts = async () => {
      try {
        const data = await getPosts();
        setPosts(data);
      } catch (error) {
        console.error("Error fetching archive:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllPosts();
  }, []);

  // Calcul des index pour la page actuelle
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(posts.length / postsPerPage);

  // Fonction pour changer de page avec scroll auto vers le haut
  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-transparent relative z-20 font-serif italic text-xl text-lab-dark animate-pulse">
        Accessing Lab Archives...
      </div>
    );
  }

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative z-10 min-h-screen pt-32 pb-20 px-6"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-16">
          <Link to="/#blog" className="inline-flex items-center gap-2 text-slate-400 hover:text-lab-dark mb-8 transition-colors group">
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            {t('nav.back')}
          </Link>
          <h1 className="font-serif text-5xl md:text-7xl text-lab-dark mb-4">{t('blog.title')}</h1>
          <p className="text-slate-500 max-w-2xl font-light text-lg">
            {t('blog.archiveIntro')}
          </p>
        </div>

        {/* Blog Grid with Animation */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 min-h-[600px]">
          <AnimatePresence mode="wait">
            {currentPosts.map((post, index) => {
              const slug = post.slug?.current;
              const imageUrl = post.mainImage?.asset?._ref
                ? urlFor(post.mainImage).width(500).quality(80).auto('format').url()
                : `https://picsum.photos/500/400?random=${post._id}`;

              return (
                <motion.div
                  key={post._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link to={`/blog/${slug}`} className="group block h-full bg-white/40 backdrop-blur-sm rounded-3xl overflow-hidden border border-white/50 hover:shadow-2xl transition-all duration-500">
                    <div className="aspect-[4/3] overflow-hidden">
                      <img
                        src={imageUrl}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        alt={post.title?.[lang] || ''}
                      />
                    </div>
                    <div className="p-8">
                      <div className="flex items-center gap-2 text-[10px] font-bold text-lab-citrus uppercase tracking-widest mb-4">
                        <Calendar size={12} />
                        {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : 'Recent'}
                      </div>
                      <h3 className="font-serif text-2xl text-lab-dark mb-4 group-hover:text-lab-citrus transition-colors line-clamp-2">
                        {post.title?.[lang] || 'Untitled Report'}
                      </h3>
                      <p className="text-slate-600 text-sm line-clamp-3 leading-relaxed">
                        {post.excerpt?.[lang]}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* --- PAGINATION CONTROLS --- */}
        {totalPages > 1 && (
          <div className="mt-20 flex justify-center items-center gap-2">
            {/* Bouton Précédent */}
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-full border border-slate-200 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white transition-all"
            >
              <ChevronLeft size={20} />
            </button>

            {/* Numéros de pages */}
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                <button
                  key={number}
                  onClick={() => paginate(number)}
                  className={`w-10 h-10 rounded-full font-bold text-sm transition-all
                    ${currentPage === number
                      ? 'bg-lab-dark text-white shadow-lg'
                      : 'text-slate-400 hover:bg-white hover:text-lab-dark'}`}
                >
                  {number}
                </button>
              ))}
            </div>

            {/* Bouton Suivant */}
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-full border border-slate-200 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white transition-all"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>
    </motion.main>
  );
};

export default BlogArchive;