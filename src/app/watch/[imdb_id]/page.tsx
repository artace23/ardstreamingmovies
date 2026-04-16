import { notFound } from 'next/navigation';
import VideoPlayer from '@/components/VideoPlayer';

export default async function WatchPage({
  params,
}: {
  params: Promise<{ imdb_id: string }>;
}) {
  const { imdb_id } = await params;
  if (!imdb_id) return notFound();

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--bg-primary)',
        padding: 'clamp(1.5rem, 4vw, 3rem) clamp(1rem, 3vw, 2rem)',
      }}
    >
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            marginBottom: '1.75rem',
          }}
        >
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
            }}
          >
            Now Playing
          </h1>
          <div
            style={{
              marginLeft: 'auto',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: 'rgba(229, 9, 20, 0.12)',
              border: '1px solid rgba(229, 9, 20, 0.3)',
              borderRadius: '20px',
              padding: '0.3rem 0.875rem',
            }}
          >
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: 'var(--accent)',
                display: 'inline-block',
                animation: 'live-pulse 2s infinite',
              }}
            />
            <span
              style={{
                fontSize: '0.7rem',
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: '#ff6b6b',
              }}
            >
              Live Stream
            </span>
          </div>
        </div>

        <VideoPlayer type="movie" imdbId={imdb_id} />

        {/* Notice */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.75rem',
            marginTop: '1.5rem',
            padding: '1rem 1.25rem',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid var(--border)',
            borderRadius: '12px',
          }}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            style={{ color: 'var(--text-muted)', flexShrink: 0, marginTop: '1px' }}
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', lineHeight: 1.7 }}>
            If the stream does not load, the movie may not be currently available.{' '}
            <span style={{ color: 'var(--text-secondary)' }}>
              Try another title or check back later.
            </span>
          </p>
        </div>
      </div>

      <style>{`
        @keyframes live-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.85); }
        }
      `}</style>
    </div>
  );
}