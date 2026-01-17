import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion'; // <--- Import nécessaire

// Components
import Navbar from './components/Navbar';
import LiquidBackground from './components/LiquidBackground';

// Pages
import HomePage from './pages/HomePage';
import DrinkDetail from './pages/DrinkDetail';
import BlogPostDetail from './pages/BlogPostDetail';
import BlogArchive from './pages/BlogArchive';

// Services & Types
import { getDrinks, getPosts } from './services/sanity.client';
import { DrinkProject, BlogPost } from './types';

const App: React.FC = () => {
  const [drinks, setDrinks] = useState<DrinkProject[]>([]);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBackground, setShowBackground] = useState(false);

  // 1. CHARGEMENT DONNÉES (Waterfall)
  useEffect(() => {
    const loadData = async () => {
      try {
        const drinksData = await getDrinks();
        setDrinks(drinksData);
        setLoading(false); // UI débloquée rapidement

        setTimeout(async () => {
          const postsData = await getPosts();
          setPosts(postsData);
        }, 300);

      } catch (error) {
        console.error("Fetch error:", error);
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // 2. CHARGEMENT BACKGROUND (Différé)
  useEffect(() => {
    const timer = setTimeout(() => setShowBackground(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Router>
      <div className="relative min-h-screen bg-lab-white overflow-x-hidden">

        {showBackground && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2, ease: "easeOut" }}
            className="fixed inset-0 z-0"
          >
            <LiquidBackground />
          </motion.div>
        )}

        {/* Navbar */}
        <Navbar />

        {/* Routes */}
        <div className="relative z-10">
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

      </div>
    </Router>
  );
};

export default App;