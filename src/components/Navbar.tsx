import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Menu, X, Globe, FlaskConical } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';

const Navbar: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  const location = useLocation();
  const isHome = location.pathname === "/";
  const currentLang = i18n.language || 'en';

  // Gestion du style au scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fermer le menu mobile lors d'un changement de route
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const toggleLang = () => {
    const newLang = currentLang === 'en' ? 'tr' : 'en';
    i18n.changeLanguage(newLang);
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    const targetId = href.replace('#', '');
    
    // Fermeture immédiate pour mobile
    setIsOpen(false);

    if (isHome) {
      const element = document.getElementById(targetId);
      if (element) {
        e.preventDefault(); // On bloque le lien seulement si on peut scroller
        const navHeight = 85;
        const offsetPosition = element.getBoundingClientRect().top + window.scrollY - navHeight;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }
    // Si on n'est pas sur Home, le <Link to="/#id"> géré par React Router fera la redirection
  };

  const navLinks = [
    { name: t('nav.portfolio'), href: '#portfolio' },
    { name: t('nav.blog'), href: '#blog' },
    { name: t('nav.contact'), href: '#contact' },
  ];

  return (
    <nav
      className={`fixed top-0 w-full z-[80] transition-all duration-500 border-b
      ${scrolled 
        ? 'bg-white/80 backdrop-blur-xl shadow-sm py-3 border-slate-200/50' 
        : 'bg-transparent py-6 border-transparent'}`}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        
        {/* LOGO */}
        <Link 
          to="/" 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center gap-2 group relative z-[91]"
        >
          <div className="p-2 bg-lab-mint/20 rounded-full text-lab-dark group-hover:bg-lab-mint/40 transition-colors">
            <FlaskConical size={24} />
          </div>
          <span className="font-serif text-xl font-semibold tracking-tight text-lab-dark">
            Melisa Mumcu
          </span>
        </Link>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={`/${link.href}`}
              onClick={(e) => handleNavClick(e, link.href)}
              className="text-sm font-bold uppercase tracking-widest text-slate-600 hover:text-lab-dark transition-colors relative group"
            >
              {link.name}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-lab-citrus transition-all group-hover:w-full" />
            </Link>
          ))}
          
          <button
            onClick={toggleLang}
            className="flex items-center gap-2 text-xs font-black px-4 py-2 rounded-full border border-slate-200 hover:bg-white hover:shadow-md transition-all uppercase"
          >
            <Globe size={14} />
            {currentLang}
          </button>
        </div>

        {/* MOBILE TOGGLE */}
        <button 
          className="md:hidden relative z-[91] p-2 text-lab-dark hover:bg-slate-100 rounded-xl transition-colors"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Menu"
        >
          {isOpen ? <X size={30} /> : <Menu size={30} />}
        </button>
      </div>

      {/* MOBILE MENU DROPDOWN */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay pour fermer en cliquant à côté */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm md:hidden z-[79]"
            />
            
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute top-0 left-0 w-full bg-white/95 backdrop-blur-2xl border-b border-slate-200 pt-24 pb-12 px-6 shadow-2xl md:hidden z-[80]"
            >
              <div className="flex flex-col gap-8 items-center text-center">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="w-full"
                  >
                    <Link
                      to={`/${link.href}`}
                      onClick={(e) => handleNavClick(e, link.href)}
                      className="text-2xl font-serif font-medium text-lab-dark block py-2"
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                ))}
                
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  onClick={toggleLang}
                  className="mt-4 flex items-center gap-2 bg-lab-mint/10 text-lab-dark px-8 py-3 rounded-full font-bold uppercase tracking-tighter"
                >
                  <Globe size={18} />
                  {currentLang === 'en' ? 'Türkçe\'ye geç' : 'Switch to English'}
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;