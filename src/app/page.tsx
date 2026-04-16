'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import type { Movie, TVShow } from '@/lib/types';
import { useSearchParams, useRouter } from 'next/navigation';

const MOVIE_GENRES = [
  { id: null, name: 'Trending' },
  { id: 28, name: 'Action' },
  { id: 12, name: 'Adventure' },
  { id: 16, name: 'Animation' },
  { id: 35, name: 'Comedy' },
  { id: 80, name: 'Crime' },
  { id: 99, name: 'Documentary' },
  { id: 18, name: 'Drama' },
  { id: 10751, name: 'Family' },
  { id: 14, name: 'Fantasy' },
  { id: 27, name: 'Horror' },
  { id: 9648, name: 'Mystery' },
  { id: 10749, name: 'Romance' },
  { id: 878, name: 'Sci-Fi' },
  { id: 53, name: 'Thriller' }
];

const TV_GENRES = [
  { id: null, name: 'Trending' },
  { id: 10759, name: 'Action & Adventure' },
  { id: 16, name: 'Animation' },
  { id: 35, name: 'Comedy' },
  { id: 80, name: 'Crime' },
  { id: 99, name: 'Documentary' },
  { id: 18, name: 'Drama' },
  { id: 10751, name: 'Family' },
  { id: 10762, name: 'Kids' },
  { id: 9648, name: 'Mystery' },
  { id: 10764, name: 'Reality' },
  { id: 10765, name: 'Sci-Fi & Fantasy' }
];

export default function Home() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Default to movies, but respect ?category=tv if present
  const initialCategory = searchParams.get('category') === 'tv' ? 'tv' : 'movie';
  const [category, setCategory] = useState<'movie' | 'tv'>(initialCategory);
  
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
  const [trending, setTrending] = useState<(Movie | TVShow)[]>([]);
  const [loading, setLoading] = useState(true);
  const [featuredMedia, setFeaturedMedia] = useState<Movie | TVShow | null>(null);

  const activeGenres = category === 'movie' ? MOVIE_GENRES : TV_GENRES;

  useEffect(() => {
    // Sync state with URL if it changes externally
    const cat = searchParams.get('category');
    if (cat === 'tv' || cat === 'movie') {
      if (cat !== category) {
        setCategory(cat);
        setSelectedGenre(null); // Reset genre on category change
      }
    }
  }, [searchParams, category]);

  useEffect(() => {
    const fetchTrending = async () => {
      setLoading(true);
      try {
        let url = `https://api.themoviedb.org/3/trending/${category}/week?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`;
        
        if (selectedGenre) {
          url = `https://api.themoviedb.org/3/discover/${category}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&with_genres=${selectedGenre}&sort_by=popularity.desc`;
        }
        
        const response = await axios.get(url);
        setTrending(response.data.results);
        
        // Only update the hero banner if we are on the main trending view, keeping it cinematic
        if (!selectedGenre && response.data.results.length > 0) {
          setFeaturedMedia(response.data.results[0]);
        }
      } catch (error) {
        console.error(`Error fetching ${category}:`, error);
      } finally {
        setLoading(false);
      }
    };
    fetchTrending();
  }, [category, selectedGenre]);

  const handleCategorySwitch = (newCat: 'movie' | 'tv') => {
    setCategory(newCat);
    setSelectedGenre(null);
    router.push(`/?category=${newCat}`, { scroll: false });
  };

  const getTitle = (media: any) => media.title || media.name;
  const getReleaseYear = (media: any) => 
    media.release_date ? new Date(media.release_date).getFullYear() : 
    media.first_air_date ? new Date(media.first_air_date).getFullYear() : '';
  const getDetailLink = (media: any) => `/${category}/${media.id}`;

  if (loading && !featuredMedia) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', gap: '2rem', padding: '2rem 1.5rem', paddingTop: 'var(--nav-height)' }}>
        <div className="shimmer" style={{ width: '100%', height: '80vh', borderRadius: '20px' }} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem' }}>
          {[...Array(8)].map((_, i) => (
            <div key={i} className="shimmer" style={{ height: '270px', borderRadius: '12px' }} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh' }}>
      
      {/* ── Category Switcher Floating Pill (Mobile Only) ──────── */}
      <div className="mobile-dock-only" style={{ position: 'fixed', bottom: '2rem', left: '50%', transform: 'translateX(-50%)', zIndex: 100 }}>
        <div style={{ 
          display: 'flex', 
          background: 'rgba(8, 10, 15, 0.85)', 
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid var(--border)',
          borderRadius: '40px',
          padding: '0.375rem',
          boxShadow: '0 20px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)'
        }}>
          {['movie', 'tv'].map((type) => {
            const isActive = category === type;
            return (
              <button
                key={type}
                onClick={() => handleCategorySwitch(type as 'movie' | 'tv')}
                style={{
                  position: 'relative',
                  padding: '0.625rem 1.5rem',
                  borderRadius: '30px',
                  border: 'none',
                  background: 'none',
                  color: isActive ? '#fff' : 'var(--text-secondary)',
                  fontWeight: 700,
                  fontSize: '0.875rem',
                  letterSpacing: '0.02em',
                  cursor: 'pointer',
                  zIndex: 1,
                  transition: 'color 0.3s ease'
                }}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeCategory"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'var(--accent)',
                      borderRadius: '30px',
                      zIndex: -1,
                      boxShadow: '0 0 20px rgba(229,9,20,0.4)'
                    }}
                  />
                )}
                <span style={{ position: 'relative', zIndex: 2 }}>{type === 'movie' ? 'Movies' : 'TV Shows'}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Hero Section ──────────────────────────────────────── */}
      {featuredMedia && (
        <section style={{ position: 'relative', width: '100%', height: 'clamp(500px, 80vh, 720px)', overflow: 'hidden' }}>
          <Image
            src={`https://image.tmdb.org/t/p/original${featuredMedia.backdrop_path}`}
            alt={getTitle(featuredMedia)}
            fill
            priority
            style={{ objectFit: 'cover', objectPosition: 'center top' }}
          />

          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(8,10,15,0.97) 0%, rgba(8,10,15,0.75) 45%, rgba(8,10,15,0.2) 100%)' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(8,10,15,1) 0%, rgba(8,10,15,0.5) 30%, transparent 70%)' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(8,10,15,0.4) 0%, transparent 30%)' }} />

          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'flex-end', padding: 'clamp(2rem, 5vw, 4rem)', maxWidth: '1280px', margin: '0 auto', left: 0, right: 0 }}>
            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }} style={{ maxWidth: '600px' }}>
              
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(229, 9, 20, 0.15)', border: '1px solid rgba(229, 9, 20, 0.4)', borderRadius: '20px', padding: '0.3rem 0.875rem', marginBottom: '1.25rem' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent)', display: 'inline-block', animation: 'pulse 2s infinite' }} />
                <span style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#ff6b6b' }}>
                  {category === 'movie' ? 'Featured Movie' : 'Featured TV Show'}
                </span>
              </div>

              <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.05, color: '#ffffff', marginBottom: '1rem', textShadow: '0 2px 20px rgba(0,0,0,0.5)' }}>
                {getTitle(featuredMedia)}
              </h1>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', color: '#fbbf24', fontWeight: 700, fontSize: '0.95rem' }}>
                  ★ {featuredMedia.vote_average?.toFixed(1)}
                </span>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{getReleaseYear(featuredMedia)}</span>
                <span style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '4px', padding: '2px 8px', fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.08em', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                  HD
                </span>
              </div>

              {featuredMedia.overview && (
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '2rem', maxWidth: '520px', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {featuredMedia.overview}
                </p>
              )}

              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <Link href={getDetailLink(featuredMedia)} className="btn-primary">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="5,3 19,12 5,21" />
                  </svg>
                  {category === 'movie' ? 'Watch Now' : 'Episodes & Info'}
                </Link>
                <Link href={getDetailLink(featuredMedia)} className="btn-secondary">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="16" />
                    <line x1="8" y1="12" x2="16" y2="12" />
                  </svg>
                  More Info
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* ── Content Section ───────────────────────────────────── */}
      <section style={{ maxWidth: '1280px', margin: '0 auto', padding: 'clamp(2rem, 5vw, 4rem) clamp(1rem, 3vw, 2rem)' }}>
        
        {/* Genre Pill Filter */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.5rem', 
          overflowX: 'auto', 
          paddingBottom: '1rem',
          marginBottom: '1rem',
          scrollbarWidth: 'none', // Firefox
          WebkitOverflowScrolling: 'touch'
        }} className="no-scrollbar">
          {activeGenres.map((genre) => {
            const isActive = selectedGenre === genre.id;
            return (
              <button
                key={genre.id || 'trending'}
                onClick={() => setSelectedGenre(genre.id)}
                style={{
                  whiteSpace: 'nowrap',
                  padding: '0.5rem 1.25rem',
                  borderRadius: '20px',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  background: isActive ? 'var(--accent)' : 'rgba(255,255,255,0.05)',
                  color: isActive ? '#fff' : 'var(--text-secondary)',
                  border: `1px solid ${isActive ? 'var(--accent-dark)' : 'rgba(255,255,255,0.1)'}`,
                  boxShadow: isActive ? '0 0 12px rgba(229,9,20,0.3)' : 'none'
                }}
                className={!isActive ? 'hover:bg-white/10 hover:text-white' : ''}
              >
                {genre.name}
              </button>
            )
          })}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
          <h2 className="section-heading">
            {selectedGenre 
              ? `${activeGenres.find(g => g.id === selectedGenre)?.name} ${category === 'movie' ? 'Movies' : 'TV Shows'}` 
              : `Trending ${category === 'movie' ? 'Movies' : 'TV Shows'}`
            }
          </h2>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)', borderRadius: '20px', padding: '0.3rem 0.875rem' }}>
            {trending.length} titles
          </span>
        </div>

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1.25rem' }}>
            {[...Array(12)].map((_, i) => (
              <div key={i} className="shimmer" style={{ height: '270px', borderRadius: '12px' }} />
            ))}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1.25rem', paddingBottom: '3rem' }}>
            {trending.map((media, i) => (
              <motion.div key={media.id} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: Math.min(i * 0.05, 0.5), ease: [0.22, 1, 0.36, 1] }}>
                <Link href={getDetailLink(media)} style={{ textDecoration: 'none' }}>
                  <div className="movie-card card-glow">
                    <div style={{ position: 'relative', aspectRatio: '2/3' }}>
                      {media.poster_path ? (
                        <Image
                          src={`https://image.tmdb.org/t/p/w500${media.poster_path}`}
                          alt={getTitle(media)}
                          fill
                          style={{ objectFit: 'cover' }}
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                        />
                      ) : (
                        <div style={{ width: '100%', height: '100%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>🎬</div>
                      )}
                      
                      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '50%', background: 'linear-gradient(to top, rgba(8,10,15,0.9) 0%, transparent 100%)', pointerEvents: 'none' }} />

                      <div className="card-overlay">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
                          {media.vote_average > 0 && <span style={{ color: '#fbbf24', fontSize: '0.8rem', fontWeight: 700 }}>★ {media.vote_average.toFixed(1)}</span>}
                          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{getReleaseYear(media)}</span>
                        </div>
                        <h3 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#fff', lineHeight: 1.3, marginBottom: '0.75rem' }}>{getTitle(media)}</h3>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', background: 'var(--accent)', color: '#fff', fontSize: '0.75rem', fontWeight: 700, padding: '0.4rem 0.875rem', borderRadius: '6px', letterSpacing: '0.03em' }}>
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21" /></svg>
                          {category === 'movie' ? 'Watch' : 'Episodes'}
                        </div>
                      </div>

                      {!selectedGenre && i < 3 && (
                        <div style={{ position: 'absolute', top: '10px', left: '10px', width: '28px', height: '28px', borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 900, color: '#fff', boxShadow: '0 2px 8px rgba(229,9,20,0.6)', zIndex: 5 }}>
                          #{i + 1}
                        </div>
                      )}
                    </div>
                    <div style={{ padding: '0.75rem', background: 'var(--bg-card)' }}>
                      <h3 style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: '0.25rem' }}>{getTitle(media)}</h3>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{getReleaseYear(media)}</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        @media (min-width: 768px) {
          .mobile-dock-only {
            display: none !important;
          }
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
