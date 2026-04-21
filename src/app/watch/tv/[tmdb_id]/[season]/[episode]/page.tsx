import { notFound } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import type { TVShow } from '@/lib/types';
import VideoPlayer from '@/components/VideoPlayer';
import SidebarEpisodes from '@/components/SidebarEpisodes';

async function getTVShow(id: string) {
  try {
    const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
    const res = await axios.get(`https://api.themoviedb.org/3/tv/${id}?api_key=${apiKey}`);
    return res.data;
  } catch {
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
    const validSeasons = show.seasons
      .filter((s) => s.season_number > 0)
      .sort((a, b) => a.season_number - b.season_number);
    const thisSeasonData = validSeasons.find((s) => s.season_number === currentSeason);

    if (thisSeasonData) {
      if (currentEpisode > 1) {
        prevLink = `/watch/tv/${tmdb_id}/${currentSeason}/${currentEpisode - 1}`;
      } else {
        const prevSeasonData = validSeasons.find((s) => s.season_number === currentSeason - 1);
        if (prevSeasonData && prevSeasonData.episode_count > 0) {
          prevLink = `/watch/tv/${tmdb_id}/${currentSeason - 1}/${prevSeasonData.episode_count}`;
        }
      }

      if (currentEpisode < thisSeasonData.episode_count) {
        nextLink = `/watch/tv/${tmdb_id}/${currentSeason}/${currentEpisode + 1}`;
      } else {
        const nextSeasonData = validSeasons.find((s) => s.season_number === currentSeason + 1);
        if (nextSeasonData && nextSeasonData.episode_count > 0) {
          nextLink = `/watch/tv/${tmdb_id}/${currentSeason + 1}/1`;
        }
      }
    }
  }

  return (
    <div className="tv-watch-root">
      <div className="tv-watch-container">

        {/* ── Left Sidebar ──────────────────────────────── */}
        <div className="tv-watch-sidebar-col">
          <SidebarEpisodes
            tmdbId={tmdb_id}
            showName={show?.name ?? 'TV Show'}
            posterPath={show?.poster_path ?? null}
            backdropPath={show?.backdrop_path ?? null}
            overview={show?.overview ?? ''}
            voteAverage={show?.vote_average ?? 0}
            genres={show?.genres}
            firstAirDate={show?.first_air_date}
            numberOfSeasons={show?.number_of_seasons}
            seasons={show?.seasons}
            currentSeason={currentSeason}
            currentEpisode={currentEpisode}
          />
        </div>

        {/* ── Right: Player + Controls ──────────────────── */}
        <div className="tv-watch-main-col">
          {/* Header */}
          <div className="tv-watch-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0 }}>
              <div
                style={{
                  width: '4px',
                  height: '24px',
                  background: 'var(--accent)',
                  borderRadius: '2px',
                  flexShrink: 0,
                  boxShadow: '0 0 10px var(--accent-glow)',
                }}
              />
              <h1 className="tv-watch-title">
                {show ? show.name : 'Now Playing'}
                <span className="tv-watch-ep-label">
                  S{currentSeasonStr}:E{currentEpisodeStr}
                </span>
              </h1>
            </div>

            {/* Prev / Next */}
            <div className="tv-watch-nav-btns">
              {prevLink ? (
                <Link href={prevLink} className="tv-nav-btn tv-nav-btn--ghost">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 12H5" /><path d="M12 19l-7-7 7-7" />
                  </svg>
                  Prev
                </Link>
              ) : (
                <div className="tv-nav-btn tv-nav-btn--disabled">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 12H5" /><path d="M12 19l-7-7 7-7" />
                  </svg>
                  Prev
                </div>
              )}

              {nextLink ? (
                <Link href={nextLink} className="tv-nav-btn tv-nav-btn--accent">
                  Next
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14" /><path d="M12 5l7 7-7 7" />
                  </svg>
                </Link>
              ) : (
                <div className="tv-nav-btn tv-nav-btn--disabled">
                  Next
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14" /><path d="M12 5l7 7-7 7" />
                  </svg>
                </div>
              )}
            </div>
          </div>

          {/* Player */}
          <VideoPlayer
            type="tv"
            tmdbId={tmdb_id}
            season={currentSeasonStr}
            episode={currentEpisodeStr}
          />

          {/* Notice */}
          <div className="tv-watch-notice">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={{ color: 'var(--text-muted)', flexShrink: 0, marginTop: '1px' }}>
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>
              If the stream does not load, the episode may not be currently available.{' '}
              <span style={{ color: 'var(--text-secondary)' }}>Try another server or check back later.</span>
            </p>
          </div>
        </div>
      </div>

      <style>{`
        /* ── Root ─────────────────────────────────────── */
        .tv-watch-root {
          background: var(--bg-primary);
          padding: 0.75rem clamp(0.75rem, 2vw, 1.25rem) 1.5rem;
          padding-top: calc(var(--nav-height) + 0.75rem);
        }
        .tv-watch-container {
          max-width: 1400px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 320px 1fr;
          gap: 1.5rem;
          align-items: start;
        }

        /* ── Sidebar column ───────────────────────────── */
        .tv-watch-sidebar-col {
          position: sticky;
          top: calc(var(--nav-height) + 1rem);
          height: calc(100vh - var(--nav-height) - 2.5rem);
          display: flex;
          flex-direction: column;
          min-width: 0;
        }

        /* ── Main column ──────────────────────────────── */
        .tv-watch-main-col {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          min-width: 0;
        }

        /* ── Header ───────────────────────────────────── */
        .tv-watch-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.75rem;
          flex-wrap: wrap;
        }
        .tv-watch-title {
          font-size: clamp(1rem, 2vw, 1.3rem);
          font-weight: 800;
          letter-spacing: -0.02em;
          color: var(--text-primary);
          display: flex;
          align-items: center;
          gap: 0.6rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          margin: 0;
        }
        .tv-watch-ep-label {
          color: var(--text-muted);
          font-weight: 600;
          font-size: 0.95rem;
        }

        /* ── Nav buttons ──────────────────────────────── */
        .tv-watch-nav-btns {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-shrink: 0;
        }
        .tv-nav-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.45rem 0.85rem;
          border-radius: 8px;
          font-size: 0.8rem;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.2s;
          white-space: nowrap;
        }
        .tv-nav-btn--ghost {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          color: var(--text-primary);
        }
        .tv-nav-btn--ghost:hover {
          background: rgba(255,255,255,0.1);
          border-color: rgba(255,255,255,0.2);
        }
        .tv-nav-btn--accent {
          background: var(--accent);
          border: 1px solid var(--accent-dark);
          color: #fff;
          box-shadow: 0 4px 12px var(--accent-glow);
        }
        .tv-nav-btn--accent:hover {
          background: var(--accent-dark);
          transform: translateY(-1px);
        }
        .tv-nav-btn--disabled {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.05);
          color: var(--text-muted);
          cursor: not-allowed;
        }

        /* ── Notice ───────────────────────────────────── */
        .tv-watch-notice {
          display: flex;
          align-items: flex-start;
          gap: 0.6rem;
          padding: 0.85rem 1rem;
          background: rgba(255,255,255,0.03);
          border: 1px solid var(--border);
          border-radius: 10px;
        }

        /* ── Responsive ───────────────────────────────── */

        /* Tablet: narrow sidebar */
        @media (max-width: 1024px) {
          .tv-watch-container {
            grid-template-columns: 230px 1fr;
          }
        }

        /* Mobile/small tablet: stack vertically, player first */
        @media (max-width: 768px) {
          .tv-watch-container {
            grid-template-columns: 1fr;
            grid-template-rows: auto auto;
          }
          /* Player column comes first visually */
          .tv-watch-main-col {
            order: 1;
          }
          .tv-watch-sidebar-col {
            order: 2;
            position: static;
            max-height: none;
            overflow: visible;
          }
        }

        @media (max-width: 480px) {
          .tv-watch-root {
            padding: 0.75rem 0.75rem;
            padding-top: calc(var(--nav-height) + 0.75rem);
          }
          .tv-watch-title {
            font-size: 0.95rem;
          }
          .tv-nav-btn {
            padding: 0.4rem 0.65rem;
            font-size: 0.75rem;
          }
        }
      `}</style>
    </div>
  );
}
