import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Beaker, Droplets, Activity } from 'lucide-react';
import { getDrinkBySlug, urlFor } from '../services/sanity.client';
import { DrinkProject } from '../types';

const DEFAULT_IMAGE = "/images/default.jpg";

const DrinkDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const lang = (i18n.language || 'en') as 'en' | 'tr';

  const [drink, setDrink] = useState<DrinkProject | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDrink = async () => {
      if (slug && slug !== 'undefined') {
        try {
          const data = await getDrinkBySlug(slug);
          setDrink(data);
        } catch (error) {
          console.error("Error fetching drink:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    fetchDrink();
  }, [slug]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-transparent">
        <p className="font-serif text-xl animate-pulse text-lab-dark">Analysing...</p>
      </div>
    );
  }

  if (!drink) return null;

  const imageUrl = drink.mainImage?.asset?._ref
    ? urlFor(drink.mainImage).height(800).fit('max').auto('format').url()
    : DEFAULT_IMAGE;

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="min-h-screen pt-28 pb-20 px-6 bg-transparent relative z-10"
    >
      <div className="max-w-7xl mx-auto">
        
        {/* Navigation */}
        <button onClick={() => navigate('/')} className="flex items-center gap-1 text-slate-400 hover:text-lab-dark mb-8 text-sm font-bold uppercase tracking-wider transition-colors">
          <ArrowLeft size={16} /> {t('nav.back') || 'Back'}
        </button>

        {/* --- LAYOUT HYBRIDE --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-24 items-center">
          
          {/* --- VERSION MOBILE --- */}
          <div className="lg:hidden mb-12">
            <span className="text-lab-citrus font-bold tracking-[0.2em] uppercase text-[10px] mb-2 block">
                {drink.client || 'Lab Project'}
            </span>
            <div className="flex items-center justify-between gap-6">
                <div className="flex-1">
                    <h1 className="font-serif text-4xl text-lab-dark leading-tight">
                        {drink.title?.[lang]}
                    </h1>
                </div>
                <div className="w-[120px] h-[160px] flex-shrink-0 relative">
                     <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 bg-lab-mint/20 rounded-full blur-xl" />
                     <img 
                        src={imageUrl} 
                        alt="" 
                        className="w-full h-full object-contain rounded-xl drop-shadow-xl relative z-10 rotate-3" 
                     />
                </div>
            </div>
            <div className="w-full h-[1px] bg-gradient-to-r from-lab-mint to-transparent mt-8" />
          </div>


          {/* --- VERSION DESKTOP : IMAGE FLOTTANTE --- */}
          <div className="hidden lg:flex relative h-[550px] w-full items-center justify-center group">
             
             {/* Lumière d'ambiance (Glow) */}
             <div className="absolute inset-20 bg-lab-mint/30 blur-[100px] rounded-full opacity-40 group-hover:opacity-60 transition-opacity duration-700" />
             
             {/* image produit */}
             <img 
                src={imageUrl} 
                alt={drink.title?.[lang]} 
                className="relative z-10 h-full w-auto object-contain rounded-2xl drop-shadow-2xl hover:scale-[1.02] transition-transform duration-500 ease-out" 
            />
          </div>


          {/* ZONE 2 : CONTENU DÉTAILLÉ */}
          <div className="flex flex-col justify-center">
            <div className="hidden lg:block mb-12">
                <span className="text-lab-citrus font-bold tracking-[0.2em] uppercase text-xs mb-4 block flex items-center gap-2">
                  <span className="w-8 h-[2px] bg-lab-citrus"></span>
                  {drink.client || 'Internal Project'}
                </span>
                <h1 className="font-serif text-6xl md:text-7xl text-lab-dark leading-tight">
                {drink.title?.[lang] || 'Untitled'}
                </h1>
            </div>

            <p className="text-lg md:text-xl text-slate-600 font-light leading-relaxed mb-12">
              {drink.description?.[lang] || 'No technical description provided.'}
            </p>

            <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] p-8 border border-white shadow-xl shadow-lab-mint/10 mb-12">
                <div className="grid grid-cols-2 divide-x divide-slate-200/50">
                    <div className="px-6 flex flex-col items-center justify-center text-center">
                        <span className="flex items-center gap-2 text-xs font-black uppercase text-slate-400 tracking-wider mb-2">
                            <Droplets size={14} className="text-lab-water"/> pH Level
                        </span>
                        <span className="text-4xl font-mono text-lab-dark font-bold">{drink.specs?.ph || '--'}</span>
                    </div>
                    <div className="px-6 flex flex-col items-center justify-center text-center">
                        <span className="flex items-center gap-2 text-xs font-black uppercase text-slate-400 tracking-wider mb-2">
                            <Activity size={14} className="text-lab-citrus"/> Brix Value
                        </span>
                        <span className="text-4xl font-mono text-lab-dark font-bold">{drink.specs?.brix || '--'}°</span>
                    </div>
                </div>
            </div>

            {drink.specs?.ingredients && (
              <div className="space-y-6 pl-2">
                <h3 className="flex items-center gap-3 font-bold text-lab-dark text-sm uppercase tracking-[0.15em] opacity-80">
                  <Beaker size={18} className="text-lab-mint" /> Key Compounds
                </h3>
                <div className="flex flex-wrap gap-3">
                  {drink.specs.ingredients.map((ing, i) => (
                    <span key={i} className="pl-4 pr-5 py-2.5 bg-white border-2 border-slate-100/80 rounded-full text-sm font-semibold text-slate-700 shadow-sm flex items-center gap-2 hover:border-lab-mint/30 transition-colors cursor-default">
                      <span className="w-2 h-2 rounded-full bg-lab-mint shadow-sm shadow-lab-mint/50" />
                      {ing}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </motion.div>
  );
};

export default DrinkDetail;