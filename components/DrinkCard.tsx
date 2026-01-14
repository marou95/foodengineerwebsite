import React from 'react';
import { motion } from 'framer-motion';
import { DrinkProject } from '../types';
import { useTranslation } from 'react-i18next';
import { Droplets, Activity, Beaker } from 'lucide-react';

interface DrinkCardProps {
  project: DrinkProject;
}

const DrinkCard: React.FC<DrinkCardProps> = ({ project }) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language as 'en' | 'tr';

  // Fallback image if Sanity ref is missing (using Picsum as per guidelines)
  const imageUrl = "https://picsum.photos/400/500?random=" + project._id; 
  // In real app use: urlFor(project.mainImage).width(400).url();

  return (
    <motion.div
      className="group relative h-[450px] w-full cursor-pointer perspective-1000"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      {/* Card Container with Vapor Effect */}
      <div className="absolute inset-0 rounded-2xl overflow-hidden bg-white/40 backdrop-blur-md border border-white/50 shadow-xl transition-all duration-500 group-hover:shadow-2xl group-hover:-translate-y-2">
        
        {/* Image Area */}
        <div className="h-3/5 w-full overflow-hidden relative">
           <div className="absolute inset-0 bg-gradient-to-t from-lab-dark/60 to-transparent z-10" />
           <img 
            src={imageUrl} 
            alt={project.title[lang]} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
           />
           <div className="absolute bottom-4 left-4 z-20 text-white">
             <p className="text-xs uppercase tracking-widest opacity-80 mb-1">{project.client}</p>
             <h3 className="font-serif text-2xl font-medium">{project.title[lang]}</h3>
           </div>
        </div>

        {/* Content Area - Default View */}
        <div className="p-6 h-2/5 flex flex-col justify-between relative bg-white/60">
          <p className="text-sm text-slate-600 line-clamp-3">
            {project.description[lang]}
          </p>
          
          {/* Technical Specs Overlay (Reveals on Hover) */}
          <motion.div 
            className="absolute inset-0 bg-lab-mint/10 backdrop-blur-lg p-6 flex flex-col justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            <h4 className="text-xs font-bold uppercase text-lab-dark tracking-widest border-b border-lab-dark/10 pb-2 mb-2">
              {t('portfolio.specs_label')}
            </h4>
            
            <div className="flex items-center justify-between text-sm text-slate-700">
              <span className="flex items-center gap-2"><Droplets size={16} className="text-lab-water"/> {t('portfolio.ph')}</span>
              <span className="font-mono font-semibold">{project.specs.ph}</span>
            </div>

            <div className="flex items-center justify-between text-sm text-slate-700">
              <span className="flex items-center gap-2"><Activity size={16} className="text-lab-citrus"/> {t('portfolio.brix')}</span>
              <span className="font-mono font-semibold">{project.specs.brix}°</span>
            </div>

            <div className="mt-2 text-xs text-slate-500">
              <div className="flex items-center gap-1 mb-1 font-semibold text-slate-700">
                <Beaker size={14} /> {t('portfolio.ingredients')}
              </div>
              <p>{project.specs.ingredients.join(' • ')}</p>
            </div>
          </motion.div>

        </div>
      </div>
    </motion.div>
  );
};

export default DrinkCard;