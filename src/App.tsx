import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Components
import Navbar from './components/Navbar';
import LiquidBackground from './components/LiquidBackground';
import InitialLoader from './components/InitialLoader';

// Pages
import HomePage from './components/HomePage';
import DrinkDetail from './components/DrinkDetail';
import BlogPostDetail from './components/BlogPostDetail';

// Services & Types
import { getDrinks, getPosts } from './services/sanity.client';
import { DrinkProject, BlogPost } from './types';

const App: React.FC = () => {
  const [drinks, setDrinks] = useState<DrinkProject[]>([]);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBackground, setShowBackground] = useState(false);

  // Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [drinksData, postsData] = await Promise.all([getDrinks(), getPosts()]);
        setDrinks(drinksData);
        setPosts(postsData);
      } catch (error) {
        console.error("Sanity Fetch Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Background performance optimization
  useEffect(() => {
    const timer = setTimeout(() => setShowBackground(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Router>
      <div className="relative min-h-screen bg-lab-white">
        
        {/* Loading Overlay */}
        <AnimatePresence>
          {loading && <InitialLoader />}
        </AnimatePresence>

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
        </Routes>

      </div>
    </Router>
  );
};

export default App;