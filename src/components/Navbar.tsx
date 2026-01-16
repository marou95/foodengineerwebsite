import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Menu, X, Globe, FlaskConical } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Navbar: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === "/";
  
  const currentLang = i18n.language || 'en';

  // Effet de scroll pour le style de la barre
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleLang = () => {
    const newLang = currentLang === 'en' ? 'tr' : 'en';
    i18n.changeLanguage(newLang);
  };

  /**
   * Gestion du Scroll ou de la Navigation
   */
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    const targetId = href.replace('#', '');
    
    if (isHome) {
      // On est sur l'accueil : Scroll fluide
      e.preventDefault();
      const element = document.getElementById(targetId);
      if (element) {
        const navHeight = 85;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - navHeight;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    } 
    // Si on n'est pas sur Home, le lien <Link to="/#id"> fera le travail nativement
    setIsOpen(false);
  };

  const navLinks = [
    { name: t('nav.portfolio'), href: '#portfolio' },
    { name: t('nav.blog'), href: '#blog' },
    { name: t('nav.contact'), href: '#contact' },
  ];

  return (
    <nav
      className={`fixed top-0 w-full z-[70] transition-all duration-300 border-b border-white/10
      ${scrolled ? 'bg-white/60 backdrop-blur-lg shadow-sm py-3' : 'bg-transparent py-5'}`}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        
        {/* Logo Area - Retourne à Home */}
        <Link 
          to="/" 
          onClick={() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            setIsOpen(false);
          }}
          className="flex items-center gap-2 group"
        >
          <div className="p-2 bg-lab-mint/20 rounded-full text-lab-dark group-hover:bg-lab-mint/40 transition-colors">
            <FlaskConical size={24} />
          </div>
          <span className="font-serif text-xl font-semibold tracking-wide text-lab-dark">
            Melisa Mumcu
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={`/${link.href}`}
              onClick={(e) => handleNavClick(e, link.href)}
              className="text-sm font-medium text-lab-text hover:text-lab-dark relative after:content-[''] after:absolute after:w-0 after:h-[2px] after:bg-lab-citrus after:left-0 after:-bottom-1 hover:after:w-full after:transition-all"
            >
              {link.name}
            </Link>
          ))}
          
          <button
            onClick={toggleLang}
            className="flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full border border-slate-200 hover:bg-white hover:shadow-md transition-all"
          >
            <Globe size={14} />
            {currentLang.toUpperCase()}
          </button>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden text-lab-dark"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white/90 backdrop-blur-lg border-t border-slate-100 overflow-hidden"
          >
            <div className="flex flex-col p-6 gap-4 items-center">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={`/${link.href}`}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="text-lg font-medium text-lab-dark"
                >
                  {link.name}
                </Link>
              ))}
              <button
                onClick={() => {
                  toggleLang();
                  setIsOpen(false);
                }}
                className="mt-2 text-sm font-bold bg-lab-mint/20 px-6 py-2 rounded-full"
              >
                {currentLang === 'en' ? 'Türkçe' : 'English'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;