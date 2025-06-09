import { notFound } from 'next/navigation';

export default async function WatchPage({ params }: { params: Promise<{ imdb_id: string }> }) {
  const { imdb_id } = await params;
  if (!imdb_id) return notFound();

  return (
    <div className="max-w-4xl mx-auto p-4">
      
      <div className="aspect-w-16 aspect-h-9 w-full rounded overflow-hidden mb-4">
        <iframe
          src={`https://vidsrc.icu/embed/movie/${imdb_id}`}
          allow="autoplay; fullscreen"
          scrolling="no"
          className="block w-full h-full min-h-[400px] bg-black"
          style={{ overflow: 'hidden', border: 'none', display: 'block' }}
        />
      </div>
      <div className="text-center text-gray-500 text-sm mt-2">
        If the stream does not load, the movie may not be available.<br />
        Try another title or check back later.
      </div>
    </div>
  );
} 