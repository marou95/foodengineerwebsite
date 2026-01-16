import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Beaker, Droplets, Activity } from 'lucide-react';
import { getDrinkBySlug, urlFor } from '../services/sanity.client';
import { DrinkProject } from '../types';

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
          console.error("Error fetching drink detail:", error);
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
      <div className="h-screen flex items-center justify-center bg-lab-white">
        <p className="font-serif text-xl animate-pulse">Analysing Lab Records...</p>
      </div>
    );
  }

  // Si on arrive ici avec slug="undefined" ou si Sanity n'a rien trouvé
  if (!drink) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-lab-white p-6 text-center">
        <h2 className="text-2xl font-serif mb-4">Formulation Not Found</h2>
        <p className="text-slate-500 mb-8">The slug is missing or the project hasn't been published.</p>
        <button onClick={() => navigate('/')} className="bg-lab-dark text-white px-6 py-3 rounded-full">
          Return to Laboratory
        </button>
      </div>
    );
  }

  const imageUrl = drink.mainImage?.asset?._ref
    ? urlFor(drink.mainImage).width(1200).url()
    : "https://picsum.photos/1200/800";

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="min-h-screen pt-32 pb-20 px-6 bg-lab-white relative z-10"
    >
      <div className="max-w-6xl mx-auto">
        <button onClick={() => navigate('/')} className="flex items-center gap-2 text-slate-400 hover:text-lab-dark mb-10 transition-colors group">
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          {t('Back') || 'Back'}
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* IMAGE */}
          <div className="relative">
            <div className="absolute -inset-4 bg-lab-mint/10 blur-3xl rounded-full opacity-50" />
            <img src={imageUrl} alt="" className="relative rounded-3xl w-full shadow-2xl border border-white" />
          </div>

          {/* CONTENT */}
          <div>
            <span className="text-lab-citrus font-bold tracking-widest uppercase text-xs mb-4 block">
              {drink.client || 'Döhler Project'}
            </span>
            <h1 className="font-serif text-5xl text-lab-dark mb-8">
              {drink.title?.[lang] || 'Untitled Formulation'}
            </h1>
            <p className="text-xl text-slate-600 font-light leading-relaxed mb-12">
              {drink.description?.[lang] || 'No description provided.'}
            </p>

            {/* SPECS */}
            <div className="grid grid-cols-2 gap-4 mb-10">
              <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm">
                <Droplets className="text-lab-water mb-2" size={24} />
                <span className="block text-xs text-slate-400 uppercase font-bold">pH Level</span>
                <span className="text-2xl font-mono text-lab-dark">{drink.specs?.ph || '--'}</span>
              </div>
              <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm">
                <Activity className="text-lab-citrus mb-2" size={24} />
                <span className="block text-xs text-slate-400 uppercase font-bold">Brix Value</span>
                <span className="text-2xl font-mono text-lab-dark">{drink.specs?.brix || '--'}°</span>
              </div>
            </div>

            {/* INGREDIENTS */}
            {drink.specs?.ingredients && (
              <div className="space-y-4">
                <h3 className="flex items-center gap-2 font-bold text-lab-dark text-xs uppercase tracking-widest">
                  <Beaker size={18} className="text-lab-mint" /> Ingredients
                </h3>
                <div className="flex flex-wrap gap-2">
                  {drink.specs.ingredients.map((ing, i) => (
                    <span key={i} className="px-4 py-2 bg-lab-mint/5 border border-lab-mint/10 rounded-full text-sm">
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