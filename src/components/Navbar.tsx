'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import SearchBar from './SearchBar';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        transition: 'all 0.3s ease',
        background: scrolled
          ? 'rgba(8, 10, 15, 0.92)'
          : 'linear-gradient(to bottom, rgba(8,10,15,0.9) 0%, transparent 100%)',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
        boxShadow: scrolled ? '0 4px 30px rgba(0,0,0,0.4)' : 'none',
        height: 'var(--nav-height)',
      }}
    >
      <nav
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 1.5rem',
          gap: '1.5rem',
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
            textDecoration: 'none',
            flexShrink: 0,
          }}
        >
          <Image
            src="/logo.png"
            alt="ArdStreaming Logo"
            width={35}
            height={35}
            style={{
              borderRadius: '6px',
              marginRight: '0.5rem',
              flexShrink: 0,
              boxShadow: '0 0 12px var(--accent-glow)',
              objectFit: 'cover'
            }}
            priority
          />
          <span style={{ fontSize: '1.125rem', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
            ArdStreaming
          </span>
          <span style={{ fontSize: '1.125rem', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--accent)' }}>
            Movies
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex ml-4 gap-6 items-center">
          <Link href="/?category=movie" style={{ textDecoration: 'none', color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.9rem', transition: 'color 0.2s' }}>
            Movies
          </Link>
          <Link href="/?category=tv" style={{ textDecoration: 'none', color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.9rem', transition: 'color 0.2s' }}>
            TV Shows
          </Link>
        </div>

        {/* Desktop Search */}
        <div style={{ flex: 1, maxWidth: '400px', display: 'none' }} className="md-search-visible">
          <SearchBar />
        </div>

        {/* Mobile hamburger */}
        <button
          aria-label="Open menu"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '5px',
            background: 'none',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            padding: '8px 10px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            flexShrink: 0,
          }}
          className="hamburger-btn"
        >
          <span style={{ display: 'block', width: '20px', height: '2px', background: 'var(--text-primary)', borderRadius: '1px', transition: 'all 0.3s ease', transform: isMenuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none' }} />
          <span style={{ display: 'block', width: '20px', height: '2px', background: 'var(--text-primary)', borderRadius: '1px', transition: 'all 0.3s ease', opacity: isMenuOpen ? 0 : 1 }} />
          <span style={{ display: 'block', width: '20px', height: '2px', background: 'var(--text-primary)', borderRadius: '1px', transition: 'all 0.3s ease', transform: isMenuOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none' }} />
        </button>
      </nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsMenuOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 40 }} />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} style={{ position: 'fixed', top: 0, right: 0, height: '100%', width: '300px', background: 'var(--bg-secondary)', borderLeft: '1px solid var(--border)', padding: '1.5rem', zIndex: 51, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '1rem' }}>Menu</span>
                <button onClick={() => setIsMenuOpen(false)} style={{ background: 'none', border: '1px solid var(--border)', borderRadius: '6px', color: 'var(--text-secondary)', cursor: 'pointer', padding: '4px 8px', fontSize: '1rem', lineHeight: 1 }}>✕</button>
              </div>
              <SearchBar />

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                <Link href="/?category=movie" onClick={() => setIsMenuOpen(false)} style={{ textDecoration: 'none', color: 'var(--text-primary)', fontWeight: 600, fontSize: '1rem' }}>Movies</Link>
                <Link href="/?category=tv" onClick={() => setIsMenuOpen(false)} style={{ textDecoration: 'none', color: 'var(--text-primary)', fontWeight: 600, fontSize: '1rem' }}>TV Shows</Link>
              </div>

              <div style={{ marginTop: 'auto', paddingTop: '2rem', borderTop: '1px solid var(--border)' }}>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>© {new Date().getFullYear()} ArdStreamingMovies</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style>{`
        @media (min-width: 768px) {
          .md-search-visible { display: block !important; }
          .hamburger-btn { display: none !important; }
          .hidden.md\\:flex { display: flex !important; }
        }
        .hidden.md\\:flex { display: none; }
      `}</style>
    </header>
  );
}