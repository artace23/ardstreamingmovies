import { notFound } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import type { TVShow } from '@/lib/types';
import VideoPlayer from '@/components/VideoPlayer';
import WatchEpisodeList from '@/components/WatchEpisodeList';

async function getTVShow(id: string) {
  try {
    const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
    const res = await axios.get(`https://api.themoviedb.org/3/tv/${id}?api_key=${apiKey}`);
    return res.data;
  } catch (err) {
    return null;
  }
}

export default async function TVWatchPage({
  params,
}: {
  params: Promise<{ tmdb_id: string; season: string; episode: string }>;
}) {
  const { tmdb_id, season, episode } = await params;
  if (!tmdb_id || !season || !episode) return notFound();

  const currentSeasonStr = season;
  const currentEpisodeStr = episode;
  const currentSeason = parseInt(season, 10);
  const currentEpisode = parseInt(episode, 10);

  const show: TVShow | null = await getTVShow(tmdb_id);
  
  let prevLink = null;
  let nextLink = null;

  if (show && show.seasons) {
    // Filter out 'Specials' (season 0) to keep sequential navigation clean
    const validSeasons = show.seasons.filter(s => s.season_number > 0).sort((a, b) => a.season_number - b.season_number);
    const thisSeasonData = validSeasons.find(s => s.season_number === currentSeason);

    if (thisSeasonData) {
      // Calculate Previous
      if (currentEpisode > 1) {
        prevLink = `/watch/tv/${tmdb_id}/${currentSeason}/${currentEpisode - 1}`;
      } else {
        // Go to previous season's last episode
        const prevSeasonData = validSeasons.find(s => s.season_number === currentSeason - 1);
        if (prevSeasonData && prevSeasonData.episode_count > 0) {
          prevLink = `/watch/tv/${tmdb_id}/${currentSeason - 1}/${prevSeasonData.episode_count}`;
        }
      }

      // Calculate Next
      if (currentEpisode < thisSeasonData.episode_count) {
        nextLink = `/watch/tv/${tmdb_id}/${currentSeason}/${currentEpisode + 1}`;
      } else {
        // Go to next season's first episode
        const nextSeasonData = validSeasons.find(s => s.season_number === currentSeason + 1);
        if (nextSeasonData && nextSeasonData.episode_count > 0) {
          nextLink = `/watch/tv/${tmdb_id}/${currentSeason + 1}/1`;
        }
      }
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--bg-primary)',
        padding: 'clamp(1.5rem, 4vw, 3rem) clamp(1rem, 3vw, 2rem)',
      }}
    >
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        {/* Header & Navigation */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            marginBottom: '1.75rem',
            flexWrap: 'wrap'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div
              style={{
                width: '4px',
                height: '28px',
                background: 'var(--accent)',
                borderRadius: '2px',
                flexShrink: 0,
                boxShadow: '0 0 10px var(--accent-glow)',
              }}
            />
            <h1
              style={{
                fontSize: '1.375rem',
                fontWeight: 800,
                letterSpacing: '-0.02em',
                color: 'var(--text-primary)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem'
              }}
            >
              {show ? show.name : 'Now Playing'}
              <span style={{ color: 'var(--text-muted)', fontWeight: 600, fontSize: '1.1rem' }}>
                S{currentSeasonStr}:E{currentEpisodeStr}
              </span>
            </h1>
          </div>
          
          {/* Navigation Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            {prevLink ? (
              <Link href={prevLink} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', padding: '0.5rem 1rem', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '0.85rem', fontWeight: 600, transition: 'all 0.2s', textDecoration: 'none' }} className="hover:bg-white/10 hover:border-white/20">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
                Previous
              </Link>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.05)', padding: '0.5rem 1rem', borderRadius: '8px', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600, cursor: 'not-allowed' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
                Previous
              </div>
            )}
            
            {nextLink ? (
              <Link href={nextLink} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'var(--accent)', border: '1px solid var(--accent-dark)', padding: '0.5rem 1rem', borderRadius: '8px', color: '#fff', fontSize: '0.85rem', fontWeight: 600, transition: 'all 0.2s', textDecoration: 'none', boxShadow: '0 4px 12px var(--accent-glow)' }} className="hover:bg-red-700 hover:-translate-y-0.5">
                Next
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
              </Link>
            ) : (
               <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.05)', padding: '0.5rem 1rem', borderRadius: '8px', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600, cursor: 'not-allowed' }}>
                Next
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
              </div>
            )}
          </div>
        </div>

        {/* Player Container via VideoPlayer */}
        <VideoPlayer 
          type="tv" 
          tmdbId={tmdb_id} 
          season={currentSeasonStr} 
          episode={currentEpisodeStr} 
        />

        {/* Notice */}
        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'space-between',
            marginTop: '1.5rem',
            padding: '1rem 1.25rem',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            flexWrap: 'wrap',
            gap: '1rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              style={{ color: 'var(--text-muted)', flexShrink: 0, marginTop: '2px' }}
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', lineHeight: 1.7, margin: 0 }}>
              If the stream does not load, the episode may not be currently available.{' '}
              <span style={{ color: 'var(--text-secondary)' }}>
                Try another title or check back later.
              </span>
            </p>
          </div>
          
          <WatchEpisodeList 
            tmdbId={tmdb_id}
            showName={show?.name || 'TV Show'}
            currentSeason={currentSeason}
            seasons={show?.seasons}
          />
        </div>
      </div>
    </div>
  );
}
