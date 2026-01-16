import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ArrowRight, Send, Linkedin, Instagram } from 'lucide-react';

import Navbar from './components/Navbar';
import LiquidBackground from './components/LiquidBackground';
import DrinkCard from './components/DrinkCard';
import HeroFloatingElements from './components/HeroFloatingElements';
import DrinkDetail from './components/DrinkDetail';
import BlogPostDetail from './components/BlogPostDetail';
import { getDrinks, getPosts, urlFor } from './services/sanity.client';
import { DrinkProject, BlogPost } from './types';
import { AnimatePresence } from 'framer-motion';
import InitialLoader from './components/InitialLoader';

const App: React.FC = () => {
  const { t, i18n } = useTranslation();
  const lang = (i18n.language || 'en') as 'en' | 'tr';

  const [drinks, setDrinks] = useState<DrinkProject[]>([]);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUsingMocks, setIsUsingMocks] = useState(false);

  // Récupération des données Sanity
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [drinksData, postsData] = await Promise.all([getDrinks(), getPosts()]);
        setDrinks(drinksData);
        setPosts(postsData);

        const hasMockId = drinksData.some(d => d._id === '1' || d._id === '2');
        if (hasMockId) setIsUsingMocks(true);
      } catch (error) {
        console.error("Erreur de chargement des données Sanity:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Fonction de scroll fluide pour les ancres de la page d'accueil
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

  // --- COMPOSANT PAGE D'ACCUEIL ---
  const HomePage = () => (
    <main className="relative z-10">
      {/* HERO SECTION */}
      <section className="relative h-screen flex items-center justify-center px-6 pt-20 overflow-hidden">
        <HeroFloatingElements />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold text-lab-dark mb-6 leading-tight"
          >
            {t('hero.title')}
          </motion.h1>
          <p className="text-lg md:text-2xl text-slate-600 font-light max-w-2xl mx-auto mb-10 leading-relaxed">
            <span className="relative inline-block whitespace-nowrap mr-2 font-medium text-slate-800">
              <span className="relative z-10">{t('hero.role')}</span>
              <motion.span
                initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
                transition={{ delay: 1.2, duration: 0.8 }}
                className="absolute bottom-1 left-0 right-0 h-[40%] bg-lab-mint/90 -rotate-1 rounded-sm mix-blend-multiply -z-0"
              />
            </span>
            {t('hero.description')}
          </p>
          <a
            href="#portfolio"
            onClick={(e) => handleSmoothScroll(e, '#portfolio')}
            className="inline-flex items-center gap-2 bg-lab-dark text-white px-8 py-4 rounded-full font-medium hover:bg-slate-800 transition-colors shadow-lg"
          >
            {t('hero.cta')} <ArrowRight size={18} />
          </a>
        </div>
      </section>

      {/* PORTFOLIO SECTION (HORIZONTAL SCROLL) */}
      <section id="portfolio" className="py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 mb-16">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="border-l-4 border-lab-citrus pl-6"
          >
            <h2 className="font-serif text-4xl text-lab-dark">{t('portfolio.title')}</h2>
          </motion.div>
        </div>

        {/* Conteneur avec scrollbar-hide (Défilement horizontal) */}
        <div className="flex gap-8 overflow-x-auto pb-12 px-6 md:px-[calc((100vw-1280px)/2+24px)] snap-x snap-mandatory scrollbar-hide">
          {loading ? (
            <div className="w-full text-center py-20 text-slate-500 animate-pulse font-serif italic text-xl">
              Analyzing Lab Formulations...
            </div>
          ) : (
            drinks.map((drink) => (
              <div key={drink._id} className="flex-shrink-0 w-[280px] snap-center">
                <DrinkCard project={drink} />
              </div>
            ))
          )}
          {/* Petit espaceur pour la fin du scroll */}
          <div className="flex-shrink-0 w-1 h-1 shadow-none outline-none"></div>
        </div>
      </section>

      {/* BLOG SECTION (LAB JOURNAL) */}
      <section id="blog" className="py-24 bg-white/20 backdrop-blur-sm border-y border-white/20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="font-serif text-4xl text-lab-dark mb-12">{t('blog.title')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {posts.map((post) => {
              const slug = post.slug?.current;
              const imageUrl = post.mainImage?.asset?._ref
                ? urlFor(post.mainImage).width(400).height(400).url()
                : `https://picsum.photos/400/400?random=${post._id}`;

              return (
                <Link
                  to={slug ? `/blog/${slug}` : '#'}
                  key={post._id}
                  className="flex flex-col md:flex-row gap-6 group cursor-pointer"
                >
                  <div className="w-full md:w-48 h-48 rounded-xl overflow-hidden shadow-md flex-shrink-0">
                    <img
                      src={imageUrl}
                      alt=""
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-center">
                    <span className="text-xs font-bold text-lab-citrus uppercase tracking-wider mb-2">
                      {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString(lang === 'tr' ? 'tr-TR' : 'en-US') : 'Recent'}
                    </span>
                    <h3 className="text-xl font-serif font-semibold text-lab-dark mb-3 group-hover:text-lab-citrus transition-colors">
                      {post.title?.[lang] || 'Untitled'}
                    </h3>
                    <p className="text-sm text-slate-600 mb-4 line-clamp-2 leading-relaxed">
                      {post.excerpt?.[lang] || ''}
                    </p>
                    <span className="text-xs font-bold underline decoration-lab-mint underline-offset-4 group-hover:text-lab-mint transition-colors">
                      {t('blog.read_more') || 'Read More'}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section id="contact" className="py-24 px-6 max-w-4xl mx-auto">
        <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-8 md:p-12 shadow-2xl border border-white/50">
          <h2 className="font-serif text-3xl text-center text-lab-dark mb-10">{t('contact.title')}</h2>
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input type="text" placeholder={t('contact.name')} className="w-full bg-white/50 border border-slate-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-lab-mint outline-none" />
              <input type="email" placeholder={t('contact.email')} className="w-full bg-white/50 border border-slate-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-lab-mint outline-none" />
            </div>
            <textarea rows={4} placeholder={t('contact.message')} className="w-full bg-white/50 border border-slate-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-lab-mint outline-none"></textarea>
            <button className="w-full bg-lab-dark text-white font-bold py-4 rounded-lg hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
              <Send size={18} /> {t('contact.send')}
            </button>
          </form>
        </div>
        <footer className="mt-20 flex flex-col items-center gap-4 text-slate-400">
          <div className="flex gap-6">
            <a href="https://www.linkedin.com/in/melisa-mumcu/" target="_blank" rel="noreferrer" className="hover:text-lab-dark transition-colors">
              <Linkedin size={24} />
            </a>
          </div>
          <p className="text-xs">© {new Date().getFullYear()} Melisa Mumcu. All rights reserved.</p>
        </footer>
      </section>
    </main>
  );

  return (
    <Router>
      <div className="relative min-h-screen overflow-hidden bg-lab-white">
        {/* 1. ON AJOUTE LE LOADER ICI AVEC ANIMATEPRESENCE */}
        <AnimatePresence>
          {loading && <InitialLoader />}
        </AnimatePresence>
        <LiquidBackground />
        {/* La Navbar doit être à l'intérieur du Router pour utiliser Link et useNavigate */}
        <Navbar />

        {isUsingMocks && !loading && (
          <div className="fixed bottom-0 left-0 right-0 z-[60] bg-orange-500/90 backdrop-blur-md text-white text-xs py-2 px-4 text-center">
            <span><b>Demo Mode:</b> Connected to Sanity, but using mock data.</span>
          </div>
        )}

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/drink/:slug" element={<DrinkDetail />} />
          <Route path="/blog/:slug" element={<BlogPostDetail />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;