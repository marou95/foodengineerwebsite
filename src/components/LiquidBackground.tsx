import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

/**
 * LiquidBackground Component
 * Acts as the base layer for the application.
 * Contains the white background color AND the animated mixology orbs.
 */
const LiquidBackground: React.FC = () => {
  useEffect(() => {
    console.log('LiquidBackground mounted and active');
  }, []);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-lab-white">
      {/* Orb 1: Minty Fresh - Top Left */}
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full bg-lab-mint mix-blend-multiply opacity-50 filter blur-[90px]"
        animate={{
          x: [-100, 100, -100],
          y: [-50, 50, -50],
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
        className="absolute w-[500px] h-[500px] rounded-full bg-lab-citrus mix-blend-multiply opacity-50 filter blur-[90px]"
        animate={{
          x: [50, -50, 50],
          y: [0, 100, 0],
          scale: [1.2, 1, 1.2],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{ top: '10%', right: '-15%' }}
      />

      {/* Orb 3: Water Base - Bottom Left */}
      <motion.div
        className="absolute w-[700px] h-[700px] rounded-full bg-lab-water mix-blend-multiply opacity-50 filter blur-[100px]"
        animate={{
          x: [-50, 50, -50],
          y: [50, -50, 50],
          rotate: [0, 180, 360]
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear"
        }}
        style={{ bottom: '-20%', left: '10%' }}
      />
      
      {/* Orb 4: Deep Accent - Bottom Right */}
      <motion.div
        className="absolute w-[400px] h-[400px] rounded-full bg-purple-200 mix-blend-multiply opacity-40 filter blur-[80px]"
        animate={{
          x: [0, -100, 0],
          y: [0, -50, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{ bottom: '10%', right: '5%' }}
      />
    </div>
  );
};

export default LiquidBackground;