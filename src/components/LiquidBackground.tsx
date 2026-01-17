import React from 'react';
import { motion } from 'framer-motion';

const LiquidBackground: React.FC = () => {

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-lab-white">
      {/* Orb 1: Minty Fresh - Top Left */}
      <motion.div
        className="absolute 
          w-64 h-64 md:w-[600px] md:h-[600px] 
          rounded-full bg-lab-mint mix-blend-multiply 
          opacity-30 md:opacity-50 
          filter blur-[50px] md:blur-[90px]"
        animate={{
          x: [-50, 50, -50], // Mouvement réduit sur mobile (géré par la taille relative)
          y: [-30, 30, -30],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{ top: '-10%', left: '-10%' }}
      />

      {/* Orb 2: Citrus Zest - Top Right */}
      <motion.div
        className="absolute 
          w-56 h-56 md:w-[500px] md:h-[500px] 
          rounded-full bg-lab-citrus mix-blend-multiply 
          opacity-30 md:opacity-50 
          filter blur-[50px] md:blur-[90px]"
        animate={{
          x: [30, -30, 30],
          y: [0, 50, 0],
          scale: [1.2, 1, 1.2],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{ top: '5%', right: '-15%' }}
      />

      {/* Orb 3: Water Base - Bottom Left */}
      <motion.div
        className="absolute 
          w-72 h-72 md:w-[700px] md:h-[700px] 
          rounded-full bg-lab-water mix-blend-multiply 
          opacity-30 md:opacity-50 
          filter blur-[60px] md:blur-[100px]"
        animate={{
          x: [-30, 30, -30],
          y: [30, -30, 30],
          rotate: [0, 180, 360]
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear"
        }}
        style={{ bottom: '-10%', left: '-10%' }}
      />

      {/* Orb 4: Deep Accent - Bottom Right */}
      <motion.div
        className="absolute 
          w-48 h-48 md:w-[400px] md:h-[400px] 
          rounded-full bg-purple-200 mix-blend-multiply 
          opacity-25 md:opacity-40 
          filter blur-[40px] md:blur-[80px]"
        animate={{
          x: [0, -50, 0],
          y: [0, -30, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{ bottom: '5%', right: '-5%' }}
      />
    </div>
  );
};

export default LiquidBackground;