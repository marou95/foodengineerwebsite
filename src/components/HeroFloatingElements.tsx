// import React from 'react';

// const HeroFloatingElements: React.FC = () => {
//   // On définit seulement 4 ou 5 éléments maximum pour la performance
//   const elements = [
//     { id: 1, size: 'w-20 h-20', pos: 'top-[10%] left-[5%]', delay: '0s', duration: '15s' },
//     { id: 2, size: 'w-32 h-32', pos: 'top-[60%] right-[10%]', delay: '-2s', duration: '20s' },
//     { id: 3, size: 'w-16 h-16', pos: 'bottom-[20%] left-[15%]', delay: '-5s', duration: '18s' },
//     { id: 4, size: 'w-24 h-24', pos: 'top-[20%] right-[20%]', delay: '-10s', duration: '25s' },
//   ];

//   return (
//     <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
//       {elements.map((el) => (
//         <div
//           key={el.id}
//           className={`absolute ${el.size} ${el.pos} rounded-full bg-lab-mint/10 blur-2xl animate-float`}
//           style={{
//             animationDelay: el.delay,
//             animationDuration: el.duration,
//             willChange: 'transform', // Force l'accélération GPU
//           }}
//         />
//       ))}
//     </div>
//   );
// };

// export default HeroFloatingElements;