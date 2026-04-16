'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import type { Season, Episode } from '@/lib/types';

interface EpisodeSelectorProps {
  showId: string;
  showName: string;
  seasons: Season[];
  defaultSeason?: number;
}

export default function EpisodeSelector({ showId, showName, seasons, defaultSeason }: EpisodeSelectorProps) {
  // Filter out season 0 (Specials) if preferred, or keep it. We'll sort numerically.
  const validSeasons = seasons.filter(s => s.season_number > 0).sort((a, b) => a.season_number - b.season_number);
  
  const [selectedSeason, setSelectedSeason] = useState<number>(defaultSeason || validSeasons[0]?.season_number || 1);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchEpisodes = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/tv/${showId}/season/${selectedSeason}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`
        );
        setEpisodes(response.data.episodes);
      } catch (error) {
        console.error('Error fetching episodes:', error);
      } finally {
        setLoading(false);
      }
    };

    if (showId && selectedSeason !== null) {
      fetchEpisodes();
    }
  }, [showId, selectedSeason]);

  return (
    <div style={{ marginTop: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <h2 className="section-heading">Episodes</h2>
        
        {/* Season Dropdown */}
        <div style={{ position: 'relative' }}>
          <select
            value={selectedSeason}
            onChange={(e) => setSelectedSeason(Number(e.target.value))}
            style={{
              appearance: 'none',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              color: 'var(--text-primary)',
              padding: '0.5rem 2.5rem 0.5rem 1rem',
              fontSize: '0.9rem',
              fontWeight: 600,
              cursor: 'pointer',
              outline: 'none',
            }}
          >
            {validSeasons.map((season) => (
              <option key={season.id} value={season.season_number} style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>
                {season.name}
              </option>
            ))}
          </select>
          {/* Custom Dropdown Arrow */}
          <div style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--text-muted)' }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {[...Array(4)].map((_, i) => (
            <div key={i} className="shimmer" style={{ height: '140px', borderRadius: '12px' }} />
          ))}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <AnimatePresence mode="wait">
            {episodes.map((ep, i) => (
              <motion.div
                key={ep.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, delay: i * 0.02 }}
                style={{
                  display: 'flex',
                  gap: '1rem',
                  padding: '1rem',
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid var(--border)',
                  borderRadius: '12px',
                  alignItems: 'center'
                }}
              >
                {/* Thumbnail */}
                <div style={{ flexShrink: 0, width: '160px', aspectRatio: '16/9', borderRadius: '8px', overflow: 'hidden', background: 'var(--bg-card)', position: 'relative' }}>
                  {ep.still_path ? (
                    <Image
                      src={`https://image.tmdb.org/t/p/w300${ep.still_path}`}
                      alt={ep.name}
                      fill
                      style={{ objectFit: 'cover' }}
                      sizes="160px"
                    />
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', color: 'var(--text-muted)' }}>
                      🎬
                    </div>
                  )}
                  <div style={{ position: 'absolute', bottom: '6px', right: '6px', background: 'rgba(0,0,0,0.8)', padding: '2px 6px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 600 }}>
                    {ep.runtime ? `${ep.runtime}m` : ''}
                  </div>
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0, paddingRight: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', marginBottom: '0.25rem' }}>
                    <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-muted)' }}>{ep.episode_number}</span>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {ep.name}
                    </h3>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.5 }}>
                    {ep.overview || "No exact overview provided..."}
                  </p>
                </div>
                
                {/* Play Button */}
                <Link 
                  href={`/watch/tv/${showId}/${selectedSeason}/${ep.episode_number}`}
                  style={{ flexShrink: 0 }}
                >
                  <button 
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: 'var(--text-primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = 'var(--accent)';
                      e.currentTarget.style.borderColor = 'var(--accent)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                    }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style={{ marginLeft: '4px' }}>
                      <polygon points="5,3 19,12 5,21" />
                    </svg>
                  </button>
                </Link>

              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
      <style>{`
        @media (max-width: 640px) {
          div[style*="padding: 1rem"] {
            flex-direction: column !important;
            align-items: stretch !important;
          }
          div[style*="width: 160px"] {
            width: 100% !important;
            height: auto !important;
          }
        }
      `}</style>
    </div>
  );
}
