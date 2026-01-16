import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { DrinkProject } from '../types';
import { useTranslation } from 'react-i18next';
import { urlFor } from '../services/sanity.client';
import { Droplets, Activity } from 'lucide-react';

interface DrinkCardProps {
  project: DrinkProject;
}

const DrinkCard: React.FC<DrinkCardProps> = ({ project }) => {
  const { i18n } = useTranslation();
  const lang = (i18n.language || 'en') as 'en' | 'tr';

  const slug = project.slug?.current;

  const imageUrl = project.mainImage?.asset?._ref 
    ? urlFor(project.mainImage).width(400).url()
    : "https://picsum.photos/400/600" + '?random=' + project._id;

  return (
    <Link to={slug ? `/drink/${slug}` : "#"}>
      <motion.div
        whileHover={{ y: -5 }}
        className="group relative h-[300px] rounded-xl overflow-hidden cursor-pointer shadow-md border border-white/20 bg-slate-400"
      >
        {/* Image de fond */}
        <img 
          src={imageUrl} 
          alt={project.title?.[lang] || 'Drink'} 
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Overlay sombre par défaut */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10 transition-opacity duration-500 group-hover:opacity-0" />

        {/* --- EFFET VAPOR (Détails au hover) --- */}
        <div className="absolute inset-0 bg-lab-mint/200 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center gap-6 z-20">
          
          {/* Bloc pH */}
          <div className="flex flex-col items-center text-white transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
            <Droplets className="text-lab-water mb-1" size={20} />
            <span className="text-[8px] uppercase font-bold tracking-widest opacity-80">pH Level</span>
            <span className="text-xl font-mono font-bold">{project.specs?.ph || '3.5'}</span>
          </div>

          {/* Bloc Brix */}
          <div className="flex flex-col items-center text-white transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500 delay-75">
            <Activity className="text-lab-citrus mb-1" size={20} />
            <span className="text-[8px] uppercase font-bold tracking-widest opacity-80">Brix Value</span>
            <span className="text-xl font-mono font-bold">{project.specs?.brix || '11.0'}°</span>
          </div>
          
        </div>

        {/* Titre et Client (Toujours visibles en bas) */}
        <div className="absolute bottom-0 p-5 w-full text-white z-30">
          <p className="text-[10px] font-bold text-lab-mint uppercase tracking-widest mb-1">
            {project.client || 'Project'}
          </p>
          <h3 className="font-serif text-xl leading-tight group-hover:text-white transition-colors">
            {project.title?.[lang] || 'Untitled'}
          </h3>
          
          {!slug && (
            <span className="text-[8px] bg-red-600 px-2 py-0.5 rounded mt-2 inline-block uppercase">
              Slug Missing
            </span>
          )}
        </div>
      </motion.div>
    </Link>
  );
};

export default DrinkCard;