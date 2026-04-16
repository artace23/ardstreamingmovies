'use client';

import { useRouter } from 'next/navigation';
import type { Season } from '@/lib/types';

interface WatchEpisodeDropdownProps {
  tmdbId: string;
  currentSeason: number;
  currentEpisode: number;
  seasons?: Season[];
}

export default function WatchEpisodeDropdown({ tmdbId, currentSeason, currentEpisode, seasons }: WatchEpisodeDropdownProps) {
  const router = useRouter();
  
  if (!seasons) return null;

  const validSeasons = seasons.filter(s => s.season_number > 0).sort((a, b) => a.season_number - b.season_number);
  const selectedSeasonData = validSeasons.find(s => s.season_number === currentSeason);
  const episodeCount = selectedSeasonData ? selectedSeasonData.episode_count : 0;

  const handleSeasonChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSeason = e.target.value;
    router.push(`/watch/tv/${tmdbId}/${newSeason}/1`);
  };

  const handleEpisodeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newEpisode = e.target.value;
    router.push(`/watch/tv/${tmdbId}/${currentSeason}/${newEpisode}`);
  };

  return (
    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
      {/* Season Select */}
      <div style={{ position: 'relative' }}>
        <select
          value={currentSeason}
          onChange={handleSeasonChange}
          style={{
            appearance: 'none',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            color: 'var(--text-primary)',
            padding: '0.6rem 2.5rem 0.6rem 1rem',
            fontSize: '0.85rem',
            fontWeight: 600,
            cursor: 'pointer',
            outline: 'none',
            transition: 'all 0.2s'
          }}
        >
          {validSeasons.map(s => (
            <option key={s.season_number} value={s.season_number} style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>
              Season {s.season_number} - {s.name}
            </option>
          ))}
        </select>
        <div style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--text-muted)' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
             <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      <span style={{ color: 'var(--text-muted)' }}>/</span>

      {/* Episode Select */}
      <div style={{ position: 'relative' }}>
         <select
          value={currentEpisode}
          onChange={handleEpisodeChange}
          style={{
            appearance: 'none',
            background: 'var(--accent)',
            border: '1px solid var(--accent-dark)',
            borderRadius: '8px',
            color: '#fff',
            padding: '0.6rem 2.5rem 0.6rem 1rem',
            fontSize: '0.85rem',
            fontWeight: 700,
            cursor: 'pointer',
            outline: 'none',
            transition: 'all 0.2s',
            boxShadow: '0 4px 12px var(--accent-glow)'
          }}
        >
          {Array.from({ length: episodeCount }, (_, i) => i + 1).map(epNum => (
            <option key={epNum} value={epNum} style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>
              Episode {epNum}
            </option>
          ))}
        </select>
        <div style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'rgba(255,255,255,0.7)' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
             <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );
}
