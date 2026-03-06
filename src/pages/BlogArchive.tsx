import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Calendar, ArrowLeft, ChevronLeft, ChevronRight, Search, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getPosts, urlFor } from '../services/sanity.client';
import { BlogPost } from '../types';

const BlogArchive: React.FC = () => {
  const { t, i18n } = useTranslation();
  const lang = (i18n.language || 'en') as 'en' | 'tr';

  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  // Nouveaux états pour la recherche et le filtrage
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

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

  // Extraction de tous les tags uniques disponibles dans les articles
  const availableTags = useMemo(() => {
    const tags = new Set<string>();
    posts.forEach(post => {
      if (post.tags && Array.isArray(post.tags)) {
        post.tags.forEach(tag => tags.add(tag));
      }
    });
    return Array.from(tags);
  }, [posts]);

  // Logique de filtrage par texte ET par tag
  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      const searchLower = searchTerm.toLowerCase();
      const title = post.title?.[lang]?.toLowerCase() || '';
      const excerpt = post.excerpt?.[lang]?.toLowerCase() || '';
      
      const matchesSearch = title.includes(searchLower) || excerpt.includes(searchLower);
      const matchesTag = selectedTag ? post.tags?.includes(selectedTag) : true;

      return matchesSearch && matchesTag;
    });
  }, [posts, searchTerm, selectedTag, lang]);

  // Réinitialisation de la page 1 lors d'une nouvelle recherche
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedTag]);

  // Calcul des index pour la page actuelle basée sur les résultats filtrés
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

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
      className="relative z-10 min-h-screen pt-32 pb-20 px-6 bg-white/20 backdrop-blur-sm"
    >
      <div className="max-w-7xl mx-auto">
        
        {/* --- HEADER --- */}
        <div className="mb-16">
          <Link to="/#blog" className="inline-flex items-center gap-2 text-slate-400 hover:text-lab-dark mb-8 transition-colors group text-sm uppercase tracking-widest font-bold">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            {t('nav.back', 'Return')}
          </Link>
          <h1 className="font-serif text-5xl md:text-7xl text-lab-dark mb-4">{t('blog.title', 'Lab Journal')}</h1>
          <p className="text-slate-500 max-w-2xl font-light text-lg">
            {t('blog.archiveIntro', 'Explore our complete collection of research, formulation insights, and technical articles.')}
          </p>
        </div>

        {/* --- RECHERCHE ET FILTRES --- */}
        <div className="mb-16 flex flex-col lg:flex-row gap-8 justify-between items-start lg:items-center">
            
            {/* Barre de recherche texte */}
            <div className="relative w-full lg:w-1/3">
                <Search className="absolute left-0 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                    type="text"
                    placeholder={t('blog.search', 'Search archives...') as string}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-transparent border-b border-slate-300 pl-10 pr-4 py-3 focus:outline-none focus:border-lab-citrus transition-colors text-lab-dark placeholder:text-slate-400"
                />
            </div>

            {/* Filtres par Tags */}
            {availableTags.length > 0 && (
                <div className="flex flex-wrap gap-3">
                    <button
                        onClick={() => setSelectedTag(null)}
                        className={`px-4 py-2 text-xs font-bold uppercase tracking-widest transition-all ${
                            selectedTag === null 
                            ? 'bg-lab-dark text-white border border-lab-dark' 
                            : 'border border-slate-200 text-slate-500 hover:border-lab-dark hover:text-lab-dark'
                        }`}
                    >
                        {t('blog.all_tags', 'All Topics')}
                    </button>
                    {availableTags.map(tag => (
                        <button
                            key={tag}
                            onClick={() => setSelectedTag(tag)}
                            className={`px-4 py-2 text-xs font-bold uppercase tracking-widest transition-all ${
                                selectedTag === tag 
                                ? 'bg-lab-dark text-white border border-lab-dark' 
                                : 'border border-slate-200 text-slate-500 hover:border-lab-dark hover:text-lab-dark'
                            }`}
                        >
                            {tag}
                        </button>
                    ))}
                </div>
            )}
        </div>

        {/* --- RÉSULTATS --- */}
        {filteredPosts.length === 0 ? (
            <div className="py-20 text-center text-slate-400 font-serif italic text-xl">
                No entries found for this criteria.
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16 min-h-[600px]">
            <AnimatePresence mode="wait">
                {currentPosts.map((post, index) => {
                const slug = post.slug?.current;
                const imageUrl = post.mainImage?.asset?._ref
                    ? urlFor(post.mainImage).width(450).height(600).fit('crop').url()
                    : "/images/default.jpg";

                return (
                    <motion.div
                        key={post._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ delay: index * 0.05 }}
                    >
                        <Link 
                            to={`/blog/${slug}`} 
                            className="flex flex-col group cursor-pointer h-full p-4 md:p-6 rounded-2xl hover:bg-white/40 hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] transition-all duration-500"
                        >
                            <div className="w-full aspect-[3/4] overflow-hidden bg-slate-50 mb-8 rounded-none">
                                <img
                                    src={imageUrl}
                                    loading="lazy"
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
                                    alt={post.title?.[lang] || 'Article illustration'}
                                />
                            </div>
                            
                            <div className="flex flex-col flex-1">
                                <div className="flex items-center flex-wrap gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">
                                    <div className="flex items-center gap-2">
                                        <Calendar size={14} className="opacity-50" />
                                        <span>{post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : 'Recent'}</span>
                                    </div>
                                    
                                    {post.tags && post.tags.length > 0 && (
                                        <>
                                            <span className="opacity-30 mx-1">•</span>
                                            <span className="text-lab-citrus truncate max-w-[120px]">
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
                    </motion.div>
                );
                })}
            </AnimatePresence>
            </div>
        )}

        {/* --- PAGINATION CONTROLS --- */}
        {totalPages > 1 && (
          <div className="mt-20 flex justify-center items-center gap-4">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-3 rounded-full border border-slate-200 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white transition-all text-lab-dark"
            >
              <ChevronLeft size={20} />
            </button>

            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                <button
                  key={number}
                  onClick={() => paginate(number)}
                  className={`w-10 h-10 rounded-full font-bold text-sm transition-all
                    ${currentPage === number
                      ? 'bg-lab-dark text-white shadow-lg'
                      : 'text-slate-400 hover:bg-white hover:text-lab-dark border border-transparent hover:border-slate-200'}`}
                >
                  {number}
                </button>
              ))}
            </div>

            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-3 rounded-full border border-slate-200 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white transition-all text-lab-dark"
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