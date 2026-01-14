import React from 'react';
import { motion } from 'framer-motion';

/**
 * HeroFloatingElements Component
 * 
 * Theme: "Molecular Engineering & Data"
 * Visuals: 3D Floating Glass Cards with technical parameters + 3D Spheres.
 * Uses CSS perspective and Framer Motion for pseudo-3D parallax effects.
 */
const HeroFloatingElements: React.FC = () => {

  // Technical Terms specific to Food Engineering
  const dataPoints = [
    { 
      label: "pH 3.5", 
      sub: "Acidic Profile", 
      color: "text-lab-mint", 
      x: "10%", y: "20%", 
      delay: 0,
      rotate: -5
    },
    { 
      label: "11.5° Bx", 
      sub: "Soluble Solids", 
      color: "text-lab-citrus", 
      x: "85%", y: "15%", 
      delay: 1.5,
      rotate: 5
    },
    { 
      label: "Aw 0.92", 
      sub: "Water Activity", 
      color: "text-lab-water", 
      x: "15%", y: "65%", 
      delay: 0.5,
      rotate: 3
    },
    { 
      label: "η 1.8 cP", 
      sub: "Viscosity", 
      color: "text-purple-400", 
      x: "80%", y: "70%", 
      delay: 2,
      rotate: -3
    }
  ];

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden perspective-1000">
      
      {/* 1. Abstract 3D Molecules (CSS Radial Gradients) */}
      <FloatingSphere x="20%" y="40%" size={60} color="from-green-200 to-green-400" delay={0} />
      <FloatingSphere x="75%" y="30%" size={80} color="from-orange-200 to-orange-400" delay={1} />
      <FloatingSphere x="50%" y="15%" size={40} color="from-blue-200 to-blue-400" delay={2} />
      
      {/* 2. Technical Data Cards */}
      {dataPoints.map((item, index) => (
        <motion.div
          key={index}
          className="absolute bg-white/70 backdrop-blur-md border border-white/80 px-5 py-3 rounded-xl shadow-lg flex flex-col items-start gap-1 w-32 md:w-40"
          style={{ 
            left: item.x, 
            top: item.y,
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)', // Glassmorphism shadow
          }}
          initial={{ opacity: 0, scale: 0.8, rotateX: 0, rotateY: 0 }}
          animate={{
            y: [0, -15, 0], // Floating vertical
            rotateX: [0, 5, 0], // 3D Tilt X
            rotateY: [0, 5, 0], // 3D Tilt Y
            opacity: 1,
            scale: 1,
          }}
          transition={{
            duration: 6 + index,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
            delay: item.delay
          }}
        >
          {/* Decorator Dot */}
          <div className={`absolute top-3 right-3 w-2 h-2 rounded-full ${item.color.replace('text-', 'bg-')} animate-pulse`} />
          
          <span className={`font-mono text-xl font-bold tracking-tight ${item.color}`}>
            {item.label}
          </span>
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">
            {item.sub}
          </span>
          
          {/* Technical decorative lines */}
          <div className="w-full h-[1px] bg-gradient-to-r from-slate-200 to-transparent mt-1" />
          <span className="text-[8px] text-slate-300 font-mono mt-0.5">REF-0{index + 1}</span>
        </motion.div>
      ))}

      {/* 3. Background Grid Effect (Subtle Graph Paper) */}
      <div className="absolute inset-0 opacity-[0.03]" 
           style={{ 
             backgroundImage: 'radial-gradient(#64748b 1px, transparent 1px)', 
             backgroundSize: '40px 40px' 
           }} 
      />
    </div>
  );
};

// Helper Component for 3D Spheres
const FloatingSphere = ({ x, y, size, color, delay }: { x: string, y: string, size: number, color: string, delay: number }) => (
  <motion.div
    className={`absolute rounded-full bg-gradient-to-br ${color} shadow-xl`}
    style={{ 
      left: x, 
      top: y, 
      width: size, 
      height: size,
      // Create faux-3D lighting with box-shadow inset
      boxShadow: 'inset -5px -5px 15px rgba(0,0,0,0.1), inset 5px 5px 15px rgba(255,255,255,0.5)'
    }}
    initial={{ opacity: 0, scale: 0 }}
    animate={{ 
      opacity: 0.6, 
      scale: 1,
      y: [0, -40, 0]
    }}
    transition={{
      duration: 8,
      delay: delay,
      repeat: Infinity,
      repeatType: "reverse",
      ease: "easeInOut"
    }}
  >
    {/* Highlight reflection */}
    <div className="absolute top-[15%] left-[15%] w-[25%] h-[25%] bg-white rounded-full opacity-70 blur-[1px]" />
  </motion.div>
);

export default HeroFloatingElements;