'use client';

import { useState } from 'react';

type Server = {
  name: string;
  getUrl: () => string;
};

interface VideoPlayerProps {
  type: 'movie' | 'tv';
  imdbId?: string;
  tmdbId?: string;
  season?: string;
  episode?: string;
}

export default function VideoPlayer({ type, imdbId, tmdbId, season, episode }: VideoPlayerProps) {
  // Using user's requested custom colors for VidLink
  const customColors = `primaryColor=e50914&secondaryColor=94a3b8&iconColor=eefdec&icons=vid&player=default&title=true&poster=true&autoplay=false&nextbutton=false`;
  
  const movieServers: Server[] = [
    {
      name: 'Server 1',
      getUrl: () => `https://vidlink.pro/movie/${imdbId || tmdbId}?${customColors}`
    },
    {
      name: 'Server 2',
      getUrl: () => `https://vidlink.pro/movie/${imdbId || tmdbId}?primaryColor=e50914&secondaryColor=94a3b8&iconColor=eefdec&icons=default&player=jw&title=true&poster=true&autoplay=true&nextbutton=true`
    },
    {
      name: 'Server 3',
      getUrl: () => `https://vidsrc.net/embed/movie?imdb=${imdbId}`
    }
  ];

  const tvServers: Server[] = [
    {
      name: 'Server 1',
      getUrl: () => `https://vidlink.pro/tv/${tmdbId}/${season}/${episode}?${customColors}`
    },
    {
      name: 'Server 2',
      getUrl: () => `https://vidlink.pro/tv/${tmdbId}/${season}/${episode}?primaryColor=63b8bc&secondaryColor=a2a2a2&iconColor=eefdec&icons=default&player=jw&title=true&poster=true&autoplay=true&nextbutton=true`
    },
    {
      name: 'Server 3',
      getUrl: () => `https://vidsrc.net/embed/tv?tmdb=${tmdbId}&season=${season}&episode=${episode}`
    }
  ];

  const servers = type === 'movie' ? movieServers : tvServers;
  const [activeServer, setActiveServer] = useState(0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Server Selector */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center', marginBottom: '0.5rem' }}>
        <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600, marginRight: '0.5rem' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ display: 'inline-block', marginRight: '4px', verticalAlign: 'text-bottom' }}><rect x="2" y="2" width="20" height="8" rx="2" ry="2"/><rect x="2" y="14" width="20" height="8" rx="2" ry="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></svg>
          Servers:
        </span>
        {servers.map((server, index) => (
          <button
            key={server.name}
            onClick={() => setActiveServer(index)}
            style={{
              background: activeServer === index ? 'var(--accent)' : 'rgba(255, 255, 255, 0.05)',
              border: `1px solid ${activeServer === index ? 'rgba(229, 9, 20, 0.5)' : 'rgba(255, 255, 255, 0.1)'}`,
              color: activeServer === index ? '#fff' : 'var(--text-primary)',
              padding: '0.4rem 1rem',
              borderRadius: '8px',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: activeServer === index ? '0 0 10px rgba(229,9,20,0.3)' : 'none'
            }}
          >
            {server.name}
          </button>
        ))}
      </div>

      {/* Player Container */}
      <div
        style={{
          position: 'relative',
          borderRadius: '16px',
          overflow: 'hidden',
          background: '#000',
          boxShadow: '0 0 0 1px var(--border), 0 40px 100px rgba(0,0,0,0.8), 0 0 50px rgba(229,9,20,0.08)',
        }}
      >
        <div style={{ position: 'relative', paddingTop: '56.25%' }}>
          <iframe
            src={servers[activeServer].getUrl()}
            allow="autoplay; fullscreen"
            scrolling="no"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              border: 'none',
              display: 'block',
              overflow: 'hidden',
              background: '#000'
            }}
          />
        </div>
      </div>
    </div>
  );
}
