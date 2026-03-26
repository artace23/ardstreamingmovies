import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import ScrollToTop from '@/components/ScrollToTop';
import EpisodeSelector from '@/components/EpisodeSelector';
import type { TVShow, TVShow as SimilarTVShow } from '@/lib/types';

async function getTVShow(id: string) {
  const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
  const showRes = await axios.get(
    `https://api.themoviedb.org/3/tv/${id}?api_key=${apiKey}&append_to_response=external_ids`
  );
  return showRes.data;
}

async function getSimilar(id: string) {
  const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
  const res = await axios.get(
    `https://api.themoviedb.org/3/tv/${id}/similar?api_key=${apiKey}`
  );
  return res.data.results;
}

export default async function TVShowDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const show: TVShow = await getTVShow(id);
  const similar: SimilarTVShow[] = await getSimilar(id);

  const ratingColor =
    show.vote_average >= 7.5
      ? '#22c55e'
      : show.vote_average >= 6
      ? '#fbbf24'
      : '#ef4444';

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <ScrollToTop />

      {/* ── Backdrop Hero ──────────────────────────────────── */}
      {show.backdrop_path && (
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: 'clamp(300px, 45vw, 520px)',
            overflow: 'hidden',
          }}
        >
          <Image
            src={`https://image.tmdb.org/t/p/original${show.backdrop_path}`}
            alt={show.name}
            fill
            priority
            style={{ objectFit: 'cover', objectPosition: 'center 20%' }}
          />
          {/* Overlays */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(to bottom, rgba(8,10,15,0.2) 0%, rgba(8,10,15,1) 100%)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(to right, rgba(8,10,15,0.8) 0%, transparent 60%)',
            }}
          />
        </div>
      )}

      {/* ── Main Content ───────────────────────────────────── */}
      <div
        style={{
          maxWidth: '1100px',
          margin: '0 auto',
          padding: '0 clamp(1rem, 3vw, 2rem)',
          marginTop: show.backdrop_path ? '-180px' : '2rem',
          position: 'relative',
          zIndex: 10,
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '2.5rem',
          }}
          className="movie-detail-layout"
        >
          {/* Poster + Info Row */}
          <div
            style={{
              display: 'flex',
              gap: 'clamp(1.5rem, 4vw, 3rem)',
              alignItems: 'flex-start',
            }}
            className="movie-detail-row"
          >
            {/* Poster */}
            <div
              style={{
                flexShrink: 0,
                width: 'clamp(160px, 22vw, 280px)',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 24px 64px rgba(0,0,0,0.8), 0 0 0 1px var(--border)',
              }}
            >
              <Image
                src={`https://image.tmdb.org/t/p/w500${show.poster_path}`}
                alt={show.name}
                width={280}
                height={420}
                style={{ width: '100%', height: 'auto', display: 'block' }}
              />
            </div>

            {/* Details */}
            <div style={{ flex: 1, minWidth: 0, paddingTop: '1rem' }}>
              {/* Title */}
              <h1
                style={{
                  fontSize: 'clamp(1.75rem, 4vw, 3rem)',
                  fontWeight: 900,
                  letterSpacing: '-0.03em',
                  color: '#fff',
                  lineHeight: 1.1,
                  marginBottom: '1rem',
                }}
              >
                {show.name}
              </h1>

              {/* Meta row */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  marginBottom: '1.25rem',
                  flexWrap: 'wrap',
                }}
              >
                {/* Rating pill */}
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    background: `${ratingColor}18`,
                    border: `1px solid ${ratingColor}50`,
                    borderRadius: '20px',
                    padding: '0.3rem 0.75rem',
                    color: ratingColor,
                    fontWeight: 700,
                    fontSize: '0.875rem',
                  }}
                >
                  ★ {show.vote_average.toFixed(1)}
                </div>

                <span
                  style={{
                    color: 'var(--text-secondary)',
                    fontSize: '0.875rem',
                  }}
                >
                  {show.first_air_date ? new Date(show.first_air_date).getFullYear() : 'N/A'}
                </span>

                {show.number_of_seasons && (
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                    {show.number_of_seasons} {show.number_of_seasons === 1 ? 'Season' : 'Seasons'}
                  </span>
                )}
              </div>

              {/* Genres */}
              {show.genres && show.genres.length > 0 && (
                <div
                  style={{
                    display: 'flex',
                    gap: '0.5rem',
                    flexWrap: 'wrap',
                    marginBottom: '1.5rem',
                  }}
                >
                  {show.genres.map((g) => (
                    <span key={g.id} className="genre-badge">
                      {g.name}
                    </span>
                  ))}
                </div>
              )}

              {/* Overview */}
              <p
                style={{
                  color: 'var(--text-secondary)',
                  fontSize: '0.975rem',
                  lineHeight: 1.8,
                  marginBottom: '2rem',
                  maxWidth: '600px',
                }}
              >
                {show.overview}
              </p>
            </div>
          </div>

          <hr className="section-divider" style={{ border: 'none' }} />

          {/* Episode Selector Box embedded natively for TV Shows */}
          <EpisodeSelector showId={id} showName={show.name} seasons={show.seasons || []} />

        </div>

        {/* ── Similar TV Shows ────────────────────────────────── */}
        {similar.length > 0 && (
          <section style={{ marginTop: '5rem', paddingBottom: '2rem' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '2rem',
              }}
            >
              <h2 className="section-heading">Similar TV Shows</h2>
              <span
                style={{
                  fontSize: '0.8rem',
                  color: 'var(--text-muted)',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid var(--border)',
                  borderRadius: '20px',
                  padding: '0.3rem 0.875rem',
                }}
              >
                {similar.slice(0, 8).length} titles
              </span>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
                gap: '1.25rem',
              }}
            >
              {similar.slice(0, 8).map((sm) => (
                <Link
                  href={`/tv/${sm.id}`}
                  key={sm.id}
                  style={{ textDecoration: 'none' }}
                >
                  <div className="movie-card card-glow">
                    <div style={{ position: 'relative', aspectRatio: '2/3' }}>
                      {sm.poster_path ? (
                        <Image
                          src={`https://image.tmdb.org/t/p/w342${sm.poster_path}`}
                          alt={sm.name}
                          fill
                          style={{ objectFit: 'cover' }}
                          sizes="(max-width: 640px) 50vw, 25vw"
                        />
                      ) : (
                        <div
                          style={{
                            width: '100%',
                            height: '100%',
                            background: 'var(--bg-elevated)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '2rem',
                          }}
                        >
                          🎬
                        </div>
                      )}
                      <div
                        style={{
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          right: 0,
                          height: '40%',
                          background:
                            'linear-gradient(to top, rgba(8,10,15,0.85) 0%, transparent 100%)',
                          pointerEvents: 'none',
                        }}
                      />
                      {/* Hover overlay */}
                      <div className="card-overlay">
                        {sm.vote_average > 0 && (
                          <span
                            style={{
                              color: '#fbbf24',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              marginBottom: '0.4rem',
                              display: 'block',
                            }}
                          >
                            ★ {sm.vote_average.toFixed(1)}
                          </span>
                        )}
                        <h3
                          style={{
                            fontSize: '0.8rem',
                            fontWeight: 700,
                            color: '#fff',
                            lineHeight: 1.3,
                          }}
                        >
                          {sm.name}
                        </h3>
                      </div>
                    </div>
                    <div
                      style={{
                        padding: '0.625rem 0.75rem',
                        background: 'var(--bg-card)',
                      }}
                    >
                      <h3
                        style={{
                          fontSize: '0.775rem',
                          fontWeight: 600,
                          color: 'var(--text-primary)',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          marginBottom: '0.2rem',
                        }}
                      >
                        {sm.name}
                      </h3>
                      <span
                        style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}
                      >
                        {sm.first_air_date ? new Date(sm.first_air_date).getFullYear() : 'N/A'}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>

      <style>{`
        @media (max-width: 640px) {
          .movie-detail-row {
            flex-direction: column !important;
            align-items: center !important;
          }
          .movie-detail-row > div:first-child {
            width: 200px !important;
          }
        }
      `}</style>
    </div>
  );
}
