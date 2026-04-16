'use client';

import { useState } from 'react';
import EpisodeSelector from './EpisodeSelector';
import type { Season } from '@/lib/types';

interface WatchEpisodeListProps {
  tmdbId: string;
  showName: string;
  seasons?: Season[];
  currentSeason: number;
}

export default function WatchEpisodeList({ tmdbId, showName, seasons, currentSeason }: WatchEpisodeListProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (!seasons) return null;

  return (
    <div style={{ width: '100%' }}>
      {!isOpen ? (
        <button 
          onClick={() => setIsOpen(true)}
          style={{
             display: 'inline-flex', alignItems: 'center', gap: '0.6rem',
             background: 'rgba(255, 255, 255, 0.05)', padding: '0.6rem 1.25rem',
             borderRadius: '8px', border: '1px solid var(--border)',
             color: 'var(--text-primary)', fontWeight: 600, cursor: 'pointer',
             fontSize: '0.9rem', transition: 'all 0.2s'
          }}
          className="hover:bg-white/10 hover:border-white/20"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="9" y1="3" x2="9" y2="21"/></svg>
          All Episodes
        </button>
      ) : (
        <div style={{ animation: 'fadeIn 0.3s ease', width: '100%' }}>
          <button 
            onClick={() => setIsOpen(false)}
            style={{
               display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
               background: 'transparent', padding: '0.5rem 0',
               color: 'var(--text-muted)', fontWeight: 600, cursor: 'pointer',
               fontSize: '0.85rem', border: 'none', marginBottom: '-1rem'
            }}
            className="hover:text-white transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 15l-7-7-7 7" /></svg>
            Collape Episodes
          </button>
          
          <div style={{ marginTop: '-1rem' }}>
            <EpisodeSelector showId={tmdbId} showName={showName} seasons={seasons} defaultSeason={currentSeason} />
          </div>
        </div>
      )}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
