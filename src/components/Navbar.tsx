'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SearchBar from './SearchBar';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-20">
      <nav className="container mx-auto flex justify-between items-center shadow-lg bg-gradient-to-r from-[#181c24] via-[#232a3a] to-[#181c24] px-6 py-3 rounded-b-xl">
        <a href="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold text-white tracking-wide">
            ArdStreaming<span className="text-[#e50914]">Movies</span>
          </span>
        </a>
        <div className="hidden md:flex items-center space-x-4 w-96 max-w-full">
          <SearchBar />
        </div>
        <button
          className="md:hidden text-white hover:text-[#e50914] transition"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span className="text-2xl">☰</span>
        </button>
      </nav>
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween' }}
            className="fixed top-0 right-0 h-full w-64 bg-[#232a3a] p-4 shadow-lg z-50 rounded-l-xl"
          >
            <button
              className="absolute top-4 right-4 text-white hover:text-[#e50914]"
              onClick={() => setIsMenuOpen(false)}
            >
              <span className="text-2xl">✕</span>
            </button>
            <div className="mt-8 flex flex-col space-y-4">
              <SearchBar />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
} 