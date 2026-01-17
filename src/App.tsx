import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Components
import Navbar from './components/Navbar';
import LiquidBackground from './components/LiquidBackground';

// Pages
import HomePage from './pages/HomePage';
import DrinkDetail from './pages/DrinkDetail';
import BlogPostDetail from './pages/BlogPostDetail';
import BlogArchive from './pages/BlogArchive';

// Services & Types
import { getDrinks, getRecentPosts } from './services/sanity.client';
import { DrinkProject, BlogPost } from './types';

const App: React.FC = () => {
  const [drinks, setDrinks] = useState<DrinkProject[]>([]);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBackground, setShowBackground] = useState(false);

  // Fetch Data
useEffect(() => {
  const loadData = async () => {
    try {
      // 1. On charge d'abord les boissons (Priorité haute)
      const drinksData = await getDrinks();
      setDrinks(drinksData);
      setLoading(false); // On cache le loader DÈS QUE les boissons sont là !

      // 2. On charge le blog en arrière-plan (Priorité basse)
      // On peut même ajouter un petit délai pour laisser respirer le navigateur
      setTimeout(async () => {
        const postsData = await getRecentPosts();
        setPosts(postsData);
      }, 300);
      
    } catch (error) {
      console.error("Fetch error:", error);
      setLoading(false);
    }
  };
  loadData();
}, []);

  // Background performance optimization
  useEffect(() => {
    const timer = setTimeout(() => setShowBackground(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Router>
      <div className="relative min-h-screen bg-lab-white">
        {/* Dynamic Background */}
        {showBackground && <LiquidBackground />}

        {/* Persistent Navigation */}
        <Navbar />

        {/* Main Routes */}
        <Routes>
          <Route 
            path="/" 
            element={<HomePage drinks={drinks} posts={posts} loading={loading} />} 
          />
          <Route path="/drink/:slug" element={<DrinkDetail />} />
          <Route path="/blog/:slug" element={<BlogPostDetail />} />
          <Route path="/blog" element={<BlogArchive />} />
        </Routes>

      </div>
    </Router>
  );
};

export default App;