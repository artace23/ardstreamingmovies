'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import type { Season, Episode, Genre } from '@/lib/types';

interface SidebarEpisodesProps {
  tmdbId: string;
  showName: string;
  posterPath: string | null;
  backdropPath: string | null;
  overview: string;
  voteAverage: number;
  genres?: Genre[];
  firstAirDate?: string;
  numberOfSeasons?: number;
  seasons?: Season[];
  currentSeason: number;
  currentEpisode: number;
}

export default function SidebarEpisodes({
  tmdbId,
  showName,
  posterPath,
  backdropPath,
  overview,
  voteAverage,
  genres,
  firstAirDate,
  numberOfSeasons,
  seasons,
  currentSeason,
  currentEpisode,
}: SidebarEpisodesProps) {
  const validSeasons = (seasons ?? [])
    .filter((s) => s.season_number > 0)
    .sort((a, b) => a.season_number - b.season_number);

  const [selectedSeason, setSelectedSeason] = useState(currentSeason);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(false);
  const [showFullOverview, setShowFullOverview] = useState(false);

  useEffect(() => {
    const fetchEpisodes = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `https://api.themoviedb.org/3/tv/${tmdbId}/season/${selectedSeason}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`
        );
        setEpisodes(res.data.episodes);
      } catch {
        setEpisodes([]);
      } finally {
        setLoading(false);
      }
    };
    fetchEpisodes();
  }, [tmdbId, selectedSeason]);

  const year = firstAirDate ? new Date(firstAirDate).getFullYear() : null;
  const rating = voteAverage ? voteAverage.toFixed(1) : null;
  const ratingPercent = voteAverage ? Math.round((voteAverage / 10) * 100) : 0;

  const activeEpisodeRef = useRef<HTMLAnchorElement | null>(null);

  useEffect(() => {
    if (activeEpisodeRef.current) {
      activeEpisodeRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [episodes, currentEpisode, selectedSeason]);

  return (
    <aside className="sb-root">

      {/* ══════════ SHOW INFO CARD ══════════ */}
      <div className="sb-card">
        {/* Backdrop blur header */}
        {backdropPath && (
          <div className="sb-card-backdrop">
            <Image
              src={`https://image.tmdb.org/t/p/w500${backdropPath}`}
              alt=""
              fill
              style={{ objectFit: 'cover' }}
              sizes="300px"
              priority
            />
            <div className="sb-card-backdrop-overlay" />
          </div>
        )}

        {/* Content */}
        <div className="sb-card-body">
          {/* Poster */}
          {posterPath && (
            <div className="sb-poster-wrap">
              <Image
                src={`https://image.tmdb.org/t/p/w342${posterPath}`}
                alt={showName}
                fill
                style={{ objectFit: 'cover' }}
                sizes="88px"
                priority
              />
              <div className="sb-poster-shine" />
            </div>
          )}

          {/* Text info */}
          <div className="sb-info">
            <h2 className="sb-title">{showName}</h2>

            {/* Rating bar */}
            {rating && (
              <div className="sb-rating">
                <span className="sb-rating-score">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="#fbbf24">
                    <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
                  </svg>
                  {rating}
                </span>
                <div className="sb-rating-bar-bg">
                  <div className="sb-rating-bar-fill" style={{ width: `${ratingPercent}%` }} />
                </div>
                <span className="sb-rating-max">/10</span>
              </div>
            )}

            {/* Pills row */}
            <div className="sb-pills">
              {year && <span className="sb-pill">{year}</span>}
              {numberOfSeasons && (
                <span className="sb-pill">
                  {numberOfSeasons} Season{numberOfSeasons > 1 ? 's' : ''}
                </span>
              )}
            </div>

            {/* Genres */}
            {genres && genres.length > 0 && (
              <div className="sb-genres">
                {genres.slice(0, 3).map((g) => (
                  <span key={g.id} className="sb-genre-tag">{g.name}</span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Overview */}
        {overview && (
          <div className="sb-overview-wrap">
            <p
              className="sb-overview"
              style={{
                WebkitLineClamp: showFullOverview ? 'unset' : 3,
                display: showFullOverview ? 'block' : '-webkit-box',
              }}
            >
              {overview}
            </p>
            {overview.length > 120 && (
              <button
                onClick={() => setShowFullOverview((v) => !v)}
                className="sb-overview-btn"
              >
                {showFullOverview ? '↑ Show less' : 'Read more →'}
              </button>
            )}
          </div>
        )}
      </div>

      {/* ══════════ EPISODES ══════════ */}
      <div className="sb-eps-section">

        {/* Header */}
        <div className="sb-eps-header">
          <div className="sb-eps-heading">
            <span className="sb-eps-heading-bar" />
            <span className="sb-eps-heading-text">Episodes</span>
          </div>

          {validSeasons.length > 1 && (
            <div className="sb-season-wrap">
              <select
                value={selectedSeason}
                onChange={(e) => setSelectedSeason(Number(e.target.value))}
                className="sb-season-select"
              >
                {validSeasons.map((s) => (
                  <option
                    key={s.id}
                    value={s.season_number}
                    style={{ background: '#0d1117', color: '#f1f5f9' }}
                  >
                    Season {s.season_number}
                  </option>
                ))}
              </select>
              <svg className="sb-season-chevron" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          )}
        </div>

        {/* Grid */}
        <div className="sb-ep-scroll">
        {loading ? (
          <div className="sb-ep-list">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="shimmer sb-ep-skeleton" />
            ))}
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <div className="sb-ep-list">
              {episodes.map((ep, i) => {
                const isActive =
                  ep.episode_number === currentEpisode && selectedSeason === currentSeason;
                return (
                  <motion.div
                    key={ep.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.18, delay: i * 0.012 }}
                  >
                    <Link
                      href={`/watch/tv/${tmdbId}/${selectedSeason}/${ep.episode_number}`}
                      className={`sb-ep-card${isActive ? ' sb-ep-card--active' : ''}`}
                      ref={isActive ? activeEpisodeRef : null}
                    >
                      {/* Thumbnail — fixed width left side */}
                      <div className="sb-ep-thumb">
                        {ep.still_path ? (
                          <Image
                            src={`https://image.tmdb.org/t/p/w185${ep.still_path}`}
                            alt={ep.name}
                            fill
                            style={{ objectFit: 'cover' }}
                            sizes="96px"
                          />
                        ) : (
                          <div className="sb-ep-no-thumb">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                              <polygon points="5,3 19,12 5,21" />
                            </svg>
                          </div>
                        )}

                        {/* Hover play */}
                        <div className="sb-ep-hover-play">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                            <polygon points="5,3 19,12 5,21" />
                          </svg>
                        </div>

                        {/* Active overlay */}
                        {isActive && (
                          <div className="sb-ep-active-overlay">
                            <div className="sb-ep-active-icon">
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
                                <polygon points="5,3 19,12 5,21" />
                              </svg>
                            </div>
                          </div>
                        )}

                        {/* Ep number badge */}
                        <span className="sb-ep-num">E{ep.episode_number}</span>
                      </div>

                      {/* Info — fills remaining width */}
                      <div className="sb-ep-info">
                        <p className="sb-ep-name">{ep.name}</p>
                        <div className="sb-ep-meta">
                          {ep.runtime && (
                            <span className="sb-ep-runtime">
                              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                              </svg>
                              {ep.runtime}m
                            </span>
                          )}
                          {isActive && (
                            <span className="sb-ep-live">
                              <span className="sb-ep-live-dot" />
                              Playing
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </AnimatePresence>
        )}
        </div>
      </div>

      {/* ══════════ STYLES ══════════ */}
      <style>{`

        /* ─── Root ─────────────────────────────── */
        .sb-root {
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
          width: 100%;
          height: 100%;
          min-height: 0;
        }

        /* ─── Info Card ──────────────────────────── */
        .sb-card {
          position: relative;
          border-radius: 16px;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.08);
          background: var(--bg-card);
        }
        .sb-card-backdrop {
          position: absolute;
          inset: 0;
          z-index: 0;
        }
        .sb-card-backdrop-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            160deg,
            rgba(8,10,15,0.55) 0%,
            rgba(8,10,15,0.92) 60%,
            rgba(8,10,15,1) 100%
          );
        }
        .sb-card-body {
          position: relative;
          z-index: 1;
          display: flex;
          gap: 0.75rem;
          padding: 0.75rem 0.75rem 0.6rem;
          align-items: flex-start;
        }

        /* Poster */
        .sb-poster-wrap {
          position: relative;
          width: 82px;
          min-width: 82px;
          aspect-ratio: 2/3;
          border-radius: 10px;
          overflow: hidden;
          background: var(--bg-elevated);
          flex-shrink: 0;
          box-shadow: 0 8px 24px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.08);
        }
        .sb-poster-shine {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 60%);
          pointer-events: none;
        }

        /* Text info */
        .sb-info {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 0.45rem;
          padding-top: 0.15rem;
        }
        .sb-title {
          font-size: 1rem;
          font-weight: 800;
          color: var(--text-primary);
          letter-spacing: -0.02em;
          line-height: 1.25;
          margin: 0;
        }

        /* Rating */
        .sb-rating {
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }
        .sb-rating-score {
          display: inline-flex;
          align-items: center;
          gap: 3px;
          font-size: 0.75rem;
          font-weight: 700;
          color: #fbbf24;
          min-width: 32px;
        }
        .sb-rating-bar-bg {
          flex: 1;
          height: 3px;
          background: rgba(255,255,255,0.08);
          border-radius: 99px;
          overflow: hidden;
          max-width: 60px;
        }
        .sb-rating-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, #fbbf24, #f59e0b);
          border-radius: 99px;
          transition: width 0.8s ease;
        }
        .sb-rating-max {
          font-size: 0.65rem;
          color: var(--text-muted);
          font-weight: 500;
        }

        /* Pills */
        .sb-pills {
          display: flex;
          flex-wrap: wrap;
          gap: 0.3rem;
        }
        .sb-pill {
          display: inline-flex;
          align-items: center;
          padding: 2px 8px;
          border-radius: 6px;
          font-size: 0.62rem;
          font-weight: 600;
          letter-spacing: 0.03em;
          background: rgba(255,255,255,0.06);
          color: var(--text-secondary);
          border: 1px solid rgba(255,255,255,0.08);
        }

        /* Genres */
        .sb-genres {
          display: flex;
          flex-wrap: wrap;
          gap: 0.3rem;
        }
        .sb-genre-tag {
          display: inline-flex;
          padding: 2px 8px;
          border-radius: 20px;
          font-size: 0.6rem;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          background: rgba(229,9,20,0.12);
          color: #ff6b6b;
          border: 1px solid rgba(229,9,20,0.25);
        }

        .sb-overview-wrap {
          position: relative;
          z-index: 1;
          padding: 0 0.75rem 0.75rem;
          border-top: 1px solid rgba(255,255,255,0.05);
          margin-top: 0.15rem;
          padding-top: 0.6rem;
        }
        .sb-overview {
          font-size: 0.75rem;
          color: var(--text-muted);
          line-height: 1.65;
          -webkit-box-orient: vertical;
          overflow: hidden;
          margin: 0 0 0.3rem;
        }
        .sb-overview-btn {
          background: none;
          border: none;
          color: var(--accent);
          font-size: 0.7rem;
          font-weight: 600;
          cursor: pointer;
          padding: 0;
          transition: opacity 0.15s;
        }
        .sb-overview-btn:hover { opacity: 0.75; }

        /* ─── Episodes Section ───────────────────── */
        .sb-eps-section {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          flex: 1;
          min-height: 0;
        }
        .sb-ep-scroll {
          overflow-y: auto;
          overflow-x: hidden;
          flex: 1;
          padding-right: 2px;
          scrollbar-width: thin;
          scrollbar-color: var(--bg-elevated) transparent;
        }
        .sb-ep-scroll::-webkit-scrollbar { width: 3px; }
        .sb-ep-scroll::-webkit-scrollbar-track { background: transparent; }
        .sb-ep-scroll::-webkit-scrollbar-thumb {
          background: var(--bg-elevated);
          border-radius: 2px;
        }
        .sb-eps-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.5rem;
        }
        .sb-eps-heading {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .sb-eps-heading-bar {
          display: block;
          width: 3px;
          height: 14px;
          background: var(--accent);
          border-radius: 2px;
          box-shadow: 0 0 8px var(--accent-glow);
        }
        .sb-eps-heading-text {
          font-size: 0.78rem;
          font-weight: 700;
          color: var(--text-primary);
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }

        /* Season select */
        .sb-season-wrap {
          position: relative;
          display: inline-flex;
          align-items: center;
        }
        .sb-season-select {
          appearance: none;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 8px;
          color: var(--text-primary);
          padding: 0.3rem 1.7rem 0.3rem 0.65rem;
          font-size: 0.72rem;
          font-weight: 600;
          cursor: pointer;
          outline: none;
          transition: border-color 0.2s, background 0.2s;
        }
        .sb-season-select:hover {
          background: rgba(255,255,255,0.08);
          border-color: rgba(255,255,255,0.18);
        }
        .sb-season-chevron {
          position: absolute;
          right: 0.5rem;
          pointer-events: none;
          color: var(--text-muted);
        }

        /* ─── Episode List (horizontal rows) ──────── */
        .sb-ep-list {
          display: flex;
          flex-direction: column;
          gap: 0.45rem;
        }
        .sb-ep-skeleton {
          height: 64px;
          border-radius: 10px;
        }

        /* Card — horizontal row */
        .sb-ep-card {
          display: flex;
          flex-direction: row;
          align-items: center;
          border-radius: 10px;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.06);
          background: var(--bg-card);
          text-decoration: none;
          transition: background 0.2s,
                      border-color 0.2s,
                      box-shadow 0.2s;
          cursor: pointer;
          gap: 0;
        }
        .sb-ep-card:hover {
          background: rgba(255,255,255,0.04);
          border-color: rgba(255,255,255,0.12);
          box-shadow: 0 4px 16px rgba(0,0,0,0.35);
        }
        .sb-ep-card:hover .sb-ep-hover-play {
          opacity: 1;
        }
        .sb-ep-card--active {
          border-color: rgba(229,9,20,0.4) !important;
          background: rgba(229,9,20,0.06) !important;
          box-shadow: 0 0 0 1px rgba(229,9,20,0.15),
                      0 4px 16px rgba(229,9,20,0.1) !important;
        }

        /* Thumbnail — fixed width on left */
        .sb-ep-thumb {
          position: relative;
          width: 96px;
          min-width: 96px;
          height: 64px;
          background: var(--bg-elevated);
          overflow: hidden;
          flex-shrink: 0;
        }
        .sb-ep-no-thumb {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-muted);
          background: var(--bg-elevated);
        }
        /* Hover play icon */
        .sb-ep-hover-play {
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,0.45);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.2s;
          z-index: 2;
        }
        /* Active overlay */
        .sb-ep-active-overlay {
          position: absolute;
          inset: 0;
          background: rgba(229,9,20,0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 3;
        }
        .sb-ep-active-icon {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: rgba(229,9,20,0.9);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 12px rgba(229,9,20,0.6);
        }
        /* Ep number badge */
        .sb-ep-num {
          position: absolute;
          bottom: 5px;
          right: 6px;
          z-index: 4;
          background: rgba(0,0,0,0.72);
          backdrop-filter: blur(4px);
          color: rgba(255,255,255,0.85);
          font-size: 0.58rem;
          font-weight: 700;
          padding: 2px 5px;
          border-radius: 5px;
          letter-spacing: 0.03em;
        }

        /* Info section — fills remaining width */
        .sb-ep-info {
          flex: 1;
          min-width: 0;
          padding: 0.5rem 0.65rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 4px;
        }
        .sb-ep-name {
          font-size: 0.72rem;
          font-weight: 600;
          color: var(--text-primary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          margin: 0;
          line-height: 1.3;
        }
        .sb-ep-meta {
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }
        .sb-ep-runtime {
          display: inline-flex;
          align-items: center;
          gap: 3px;
          font-size: 0.6rem;
          color: var(--text-muted);
          font-weight: 500;
        }
        .sb-ep-live {
          display: inline-flex;
          align-items: center;
          gap: 3px;
          font-size: 0.6rem;
          font-weight: 700;
          color: #e50914;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }
        .sb-ep-live-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #e50914;
          display: inline-block;
          animation: sb-pulse 1.4s ease-in-out infinite;
        }
        @keyframes sb-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.4; transform: scale(0.7); }
        }

        /* ─── Responsive ─────────────────────────── */
        @media (max-width: 1024px) {
          .sb-poster-wrap { width: 72px; min-width: 72px; }
          .sb-title { font-size: 0.9rem; }
        }
        @media (max-width: 768px) {
          .sb-ep-thumb { width: 110px; min-width: 110px; height: 70px; }
        }
        @media (max-width: 480px) {
          .sb-card-body { padding: 0.875rem 0.875rem 0.625rem; }
          .sb-poster-wrap { width: 66px; min-width: 66px; }
          .sb-ep-thumb { width: 88px; min-width: 88px; height: 58px; }
        }
      `}</style>
    </aside>
  );
}
