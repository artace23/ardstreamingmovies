import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';

interface SearchResult {
  id: number;
  title?: string;
  name?: string;
  poster_path: string;
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
  media_type: 'movie' | 'tv';
}

async function getSearchResults(query: string) {
  if (!query) return [];
  try {
    const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
    const res = await axios.get(
      `https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&query=${encodeURIComponent(
        query
      )}`
    );
    // Keep only movies & tv shows
    return res.data.results.filter(
      (r: any) => r.media_type === 'movie' || r.media_type === 'tv'
    );
  } catch (error) {
    console.error('Error fetching search results:', error);
    return [];
  }
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { q } = await searchParams;
  const query = typeof q === 'string' ? q : '';

  const results: SearchResult[] = await getSearchResults(query);

  const getTitle = (res: SearchResult) => res.title || res.name || 'Unknown';
  const getDate = (res: SearchResult) => res.release_date || res.first_air_date;
  const getYear = (dateStr?: string) => (dateStr ? new Date(dateStr).getFullYear() : 'N/A');

  return (
    <div style={{ minHeight: '100vh', padding: 'calc(var(--nav-height) + 2rem) clamp(1rem, 3vw, 2rem)' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ marginBottom: '2.5rem' }}>
          <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
            Search Results
          </h1>
          {query ? (
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
              Showing results for <span style={{ color: 'var(--accent)', fontWeight: 600 }}>"{query}"</span>
            </p>
          ) : (
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
              Enter a search term above to find movies and TV shows.
            </p>
          )}
        </div>

        {/* Results Grid */}
        {query && results.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1.25rem', paddingBottom: '3rem' }}>
            {results.map((media) => (
              <Link href={`/${media.media_type}/${media.id}`} key={media.id} style={{ textDecoration: 'none' }}>
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
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-elevated)', fontSize: '2rem' }}>
                        🎬
                      </div>
                    )}
                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '50%', background: 'linear-gradient(to top, rgba(8,10,15,0.95) 0%, transparent 100%)', pointerEvents: 'none' }} />

                    {/* Type Badge */}
                    <div style={{ position: 'absolute', top: '10px', left: '10px', background: media.media_type === 'tv' ? 'rgba(96, 165, 250, 0.2)' : 'rgba(52, 211, 153, 0.2)', border: `1px solid ${media.media_type === 'tv' ? 'rgba(96, 165, 250, 0.4)' : 'rgba(52, 211, 153, 0.4)'}`, color: media.media_type === 'tv' ? '#60a5fa' : '#34d399', fontSize: '0.65rem', fontWeight: 800, padding: '2px 6px', borderRadius: '4px', textTransform: 'uppercase', backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)', zIndex: 10 }}>
                      {media.media_type === 'tv' ? 'TV Show' : 'Movie'}
                    </div>

                    <div className="card-overlay">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
                        {media.vote_average > 0 && (
                          <span style={{ color: '#fbbf24', fontSize: '0.8rem', fontWeight: 700 }}>★ {media.vote_average.toFixed(1)}</span>
                        )}
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{getYear(getDate(media))}</span>
                      </div>
                      <h3 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#fff', lineHeight: 1.3, marginBottom: '0.75rem' }}>{getTitle(media)}</h3>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', background: 'var(--accent)', color: '#fff', fontSize: '0.75rem', fontWeight: 700, padding: '0.4rem 0.875rem', borderRadius: '6px', letterSpacing: '0.03em' }}>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21" /></svg>
                        {media.media_type === 'tv' ? 'Episodes' : 'Watch'}
                      </div>
                    </div>
                  </div>
                  <div style={{ padding: '0.75rem', background: 'var(--bg-card)' }}>
                    <h3 style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: '0.25rem' }}>{getTitle(media)}</h3>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{getYear(getDate(media))}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          query && (
            <div style={{ padding: '4rem 1rem', textAlign: 'center', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: '16px' }}>
              <span style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem', opacity: 0.5 }}>🔍</span>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>No results found</h3>
              <p style={{ color: 'var(--text-secondary)' }}>We couldn't find any movies or TV shows matching "{query}".</p>
            </div>
          )
        )}

      </div>
    </div>
  );
}
