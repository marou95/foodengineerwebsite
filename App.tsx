import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ArrowRight, Send, Linkedin, Instagram } from 'lucide-react';

import Navbar from './components/Navbar';
import LiquidBackground from './components/LiquidBackground';
import DrinkCard from './components/DrinkCard';
import HeroFloatingElements from './components/HeroFloatingElements';
import { getDrinks, getPosts } from './services/sanity.client';
import { DrinkProject, BlogPost } from './types';

const App: React.FC = () => {
  const { t, i18n } = useTranslation();
  // Safe language access with fallback to 'en'
  const lang = (i18n.language || 'en') as 'en' | 'tr';
  
  const [drinks, setDrinks] = useState<DrinkProject[]>([]);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch Data from Sanity (or Mock)
  useEffect(() => {
    const fetchData = async () => {
      const [drinksData, postsData] = await Promise.all([getDrinks(), getPosts()]);
      setDrinks(drinksData);
      setPosts(postsData);
      setLoading(false);
    };
    fetchData();
  }, []);

  /**
   * Smooth Scroll Handler
   * Replicated from Navbar logic to ensure the "Explore Portfolio" button
   * respects the fixed header height when scrolling.
   */
  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const targetId = href.replace('#', '');
    const element = document.getElementById(targetId);

    if (element) {
      const navHeight = 85; // Height of fixed navbar + breathing room
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - navHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Base Layer: Background Color + Animation (z-0) */}
      <LiquidBackground />
      
      {/* Navigation (Fixed, z-50) */}
      <Navbar />

      {/* Main Content Layer (z-10) to sit above background */}
      <main className="relative z-10">

        {/* --- HERO SECTION --- */}
        <section className="relative h-screen flex items-center justify-center px-6 pt-20 overflow-hidden">
          {/* Floating Engineering Elements */}
          <HeroFloatingElements />

          <div className="max-w-4xl mx-auto text-center relative z-10">
            <motion.h1 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold text-lab-dark mb-6 leading-tight"
            >
              {t('hero.title')}
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="text-lg md:text-2xl text-slate-600 font-light max-w-2xl mx-auto mb-10 leading-relaxed"
            >
              {/* Realistic Highlighter Effect */}
              <span className="relative inline-block whitespace-nowrap mr-2 font-medium text-slate-800">
                <span className="relative z-10">{t('hero.role')}</span>
                <motion.span 
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 1.2, duration: 0.8, ease: "circOut" }}
                  style={{ originX: 0 }}
                  className="absolute bottom-1 left-0 right-0 h-[40%] bg-lab-mint/90 -rotate-1 rounded-sm mix-blend-multiply -z-0"
                />
              </span>
              {t('hero.description')}
            </motion.p>
            
            <motion.a 
              href="#portfolio"
              onClick={(e) => handleSmoothScroll(e, '#portfolio')}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 }}
              className="inline-flex items-center gap-2 bg-lab-dark text-white px-8 py-4 rounded-full font-medium hover:bg-slate-800 transition-colors shadow-lg shadow-lab-mint/20 cursor-pointer"
            >
              {t('hero.cta')} <ArrowRight size={18} />
            </motion.a>
          </div>
        </section>

        {/* --- PORTFOLIO SECTION --- */}
        <section id="portfolio" className="py-24 px-6 max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-16 border-l-4 border-lab-citrus pl-6"
          >
            <h2 className="font-serif text-4xl text-lab-dark">{t('portfolio.title')}</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading 
              ? <div className="col-span-3 text-center py-20 text-slate-500">Loading formulations...</div> 
              : drinks.map((drink) => <DrinkCard key={drink._id} project={drink} />)
            }
          </div>
        </section>

        {/* --- BLOG SECTION --- */}
        <section id="blog" className="py-24 bg-white/20 backdrop-blur-sm border-y border-white/20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex justify-between items-end mb-12">
               <h2 className="font-serif text-4xl text-lab-dark">{t('blog.title')}</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {posts.map((post) => (
                <motion.article 
                  key={post._id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="flex flex-col md:flex-row gap-6 group cursor-pointer"
                >
                  <div className="w-full md:w-48 h-48 rounded-xl overflow-hidden shadow-md">
                     <img 
                      src={`https://picsum.photos/300/300?random=${post._id}blog`} 
                      alt="Blog thumbnail" 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                     />
                  </div>
                  <div className="flex-1 flex flex-col justify-center">
                    <span className="text-xs font-bold text-lab-citrus uppercase tracking-wider mb-2">
                      {post.publishedAt}
                    </span>
                    <h3 className="text-xl font-serif font-semibold text-lab-dark mb-3 group-hover:text-lab-citrus transition-colors">
                      {post.title[lang]}
                    </h3>
                    <p className="text-sm text-slate-600 mb-4 line-clamp-2">
                      {post.excerpt[lang]}
                    </p>
                    <span className="text-xs font-bold underline decoration-lab-mint underline-offset-4">
                      {t('blog.read_more')}
                    </span>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        {/* --- CONTACT SECTION --- */}
        <section id="contact" className="py-24 px-6 max-w-4xl mx-auto">
          <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-8 md:p-12 shadow-2xl border border-white/50">
            <div className="text-center mb-10">
              <h2 className="font-serif text-3xl md:text-4xl text-lab-dark mb-4">{t('contact.title')}</h2>
            </div>

            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500">{t('contact.name')}</label>
                  <input type="text" className="w-full bg-white/50 border border-slate-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-lab-mint transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500">{t('contact.email')}</label>
                  <input type="email" className="w-full bg-white/50 border border-slate-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-lab-mint transition-all" />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">{t('contact.message')}</label>
                <textarea rows={4} className="w-full bg-white/50 border border-slate-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-lab-mint transition-all"></textarea>
              </div>

              <button className="w-full bg-lab-dark text-white font-bold py-4 rounded-lg hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
                <Send size={18} /> {t('contact.send')}
              </button>
            </form>
          </div>
          
          {/* Footer */}
          <footer className="mt-20 flex flex-col items-center gap-4 text-slate-400">
             <div className="flex gap-6">
               <a href="#" className="hover:text-lab-dark transition-colors"><Linkedin size={24} /></a>
               <a href="#" className="hover:text-lab-dark transition-colors"><Instagram size={24} /></a>
             </div>
             <p className="text-xs">© 2024 The Flavour Lab. All rights reserved.</p>
          </footer>
        </section>

      </main>
    </div>
  );
};

export default App;