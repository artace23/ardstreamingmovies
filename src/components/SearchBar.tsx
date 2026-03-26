'use client';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

interface SearchResult {
  id: number;
  title?: string;
  name?: string;
  poster_path: string;
  release_date?: string;
  first_air_date?: string;
  media_type: 'movie' | 'tv' | 'person';
}

export default function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchResults = async () => {
      if (query.trim().length < 2) {
        setResults([]);
        setShowDropdown(false);
        return;
      }
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/search/multi?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&query=${encodeURIComponent(query)}`
        );
        // Filter out people, just keep movies and tv
        const filtered = response.data.results.filter((res: SearchResult) => res.media_type === 'movie' || res.media_type === 'tv');
        setResults(filtered);
        setShowDropdown(true);
      } catch {
        setResults([]);
        setShowDropdown(false);
      }
    };
    const debounce = setTimeout(fetchResults, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
        setIsFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getTitle = (res: SearchResult) => res.title || res.name || 'Unknown';
  const getDate = (res: SearchResult) => res.release_date || res.first_air_date;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setShowDropdown(false);
      setIsFocused(false);
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%' }}>
      {/* Input */}
      <form
        onSubmit={handleSubmit}
        style={{
          display: 'flex',
          alignItems: 'center',
          background: isFocused
            ? 'rgba(255, 255, 255, 0.08)'
            : 'rgba(255, 255, 255, 0.05)',
          border: isFocused
            ? '1px solid rgba(229, 9, 20, 0.5)'
            : '1px solid var(--border)',
          borderRadius: '10px',
          padding: '0 0.875rem',
          gap: '0.625rem',
          transition: 'all 0.25s ease',
          boxShadow: isFocused ? '0 0 0 3px rgba(229,9,20,0.12)' : 'none',
        }}
      >
        {/* Search icon */}
        <button
          type="submit"
          style={{
            background: 'none',
            border: 'none',
            padding: 0,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            style={{
              width: '16px',
              height: '16px',
              color: isFocused ? 'var(--accent)' : 'var(--text-muted)',
              flexShrink: 0,
              transition: 'color 0.25s ease',
            }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z" />
          </svg>
        </button>

        <input
          type="text"
          placeholder="Search movies and shows..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            setIsFocused(true);
            if (results.length > 0) setShowDropdown(true);
          }}
          style={{
            flex: 1,
            background: 'none',
            border: 'none',
            outline: 'none',
            color: 'var(--text-primary)',
            fontSize: '0.875rem',
            padding: '0.625rem 0',
            caretColor: 'var(--accent)',
          }}
        />

        {/* Clear button */}
        <AnimatePresence>
          {query && (
            <motion.button
              type="button"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={() => { setQuery(''); setShowDropdown(false); document.querySelector('input')?.focus(); }}
              style={{
                background: 'rgba(255,255,255,0.1)',
                border: 'none',
                borderRadius: '50%',
                width: '18px',
                height: '18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'var(--text-secondary)',
                fontSize: '10px',
                flexShrink: 0,
              }}
            >
              ✕
            </motion.button>
          )}
        </AnimatePresence>
      </form>

      {/* Dropdown */}
      <AnimatePresence>
        {showDropdown && results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'absolute',
              top: 'calc(100% + 8px)',
              left: 0,
              right: 0,
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              overflow: 'hidden',
              zIndex: 100,
              boxShadow: '0 20px 60px rgba(0,0,0,0.7)',
              maxHeight: '420px',
              overflowY: 'auto',
            }}
          >
            {results.slice(0, 8).map((result, i) => (
              <Link
                href={`/${result.media_type}/${result.id}`}
                key={result.id}
                onClick={() => { setShowDropdown(false); setQuery(''); }}
                style={{ textDecoration: 'none' }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.875rem',
                    padding: '0.75rem 1rem',
                    transition: 'background 0.15s ease',
                    borderTop: i > 0 ? '1px solid var(--border)' : 'none',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.05)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.background = 'transparent';
                  }}
                >
                  {/* Poster thumbnail */}
                  <div
                    style={{
                      width: '44px',
                      height: '66px',
                      borderRadius: '6px',
                      overflow: 'hidden',
                      flexShrink: 0,
                      background: 'var(--bg-card)',
                    }}
                  >
                    {result.poster_path ? (
                      <Image
                        src={`https://image.tmdb.org/t/p/w92${result.poster_path}`}
                        alt={getTitle(result)}
                        width={44}
                        height={66}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <div
                        style={{
                          width: '100%',
                          height: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '1.2rem',
                        }}
                      >
                        🎬
                      </div>
                    )}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h3
                      style={{
                        fontWeight: 600,
                        fontSize: '0.875rem',
                        color: 'var(--text-primary)',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        marginBottom: '0.25rem',
                      }}
                    >
                      {getTitle(result)}
                    </h3>
                    <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                      <span
                        style={{
                          fontSize: '0.7rem',
                          color: result.media_type === 'tv' ? '#60a5fa' : '#34d399',
                          background: 'rgba(255,255,255,0.05)',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          textTransform: 'uppercase',
                          fontWeight: 700
                        }}
                      >
                        {result.media_type === 'tv' ? 'TV' : 'Movie'}
                      </span>
                      {getDate(result) && (
                        <span
                          style={{
                            fontSize: '0.75rem',
                            color: 'var(--text-muted)',
                          }}
                        >
                          {getDate(result)?.slice(0, 4)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Arrow */}
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    style={{ color: 'var(--text-muted)', flexShrink: 0 }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 18l6-6-6-6" />
                  </svg>
                </div>
              </Link>
            ))}

            {results.length > 8 && (
              <div
                style={{
                  padding: '0.625rem 1rem',
                  fontSize: '0.75rem',
                  color: 'var(--text-muted)',
                  textAlign: 'center',
                  borderTop: '1px solid var(--border)',
                  background: 'rgba(255,255,255,0.02)',
                }}
              >
                + {results.length - 8} more results
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}