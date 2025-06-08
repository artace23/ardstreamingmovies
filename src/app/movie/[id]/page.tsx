import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';

interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
  genres: { id: number; name: string }[];
  imdb_id: string;
}

interface SimilarMovie {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
}

async function getMovie(id: string) {
  const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
  const movieRes = await axios.get(`https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&append_to_response=external_ids`);
  return movieRes.data;
}

async function getSimilar(id: string) {
  const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
  const res = await axios.get(`https://api.themoviedb.org/3/movie/${id}/similar?api_key=${apiKey}`);
  return res.data.results;
}

export default async function MovieDetail({ params }: { params: { id: string } }) {
  const movie: Movie = await getMovie(params.id);
  const similar: SimilarMovie[] = await getSimilar(params.id);

  return (
    <div className="max-w-4xl mx-auto p-4 bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-4 text-center">{movie.title}</h1>
      <div className="flex flex-col md:flex-row gap-8">
        <Image
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          width={300}
          height={450}
          className="rounded-lg shadow-lg"
        />
        <div>
          <p className="text-gray-400 mb-2">{new Date(movie.release_date).getFullYear()}</p>
          <div className="flex gap-2 mb-2 flex-wrap">
            {movie.genres.map((g) => (
              <span key={g.id} className="bg-gray-800 rounded px-2 py-1 text-xs">{g.name}</span>
            ))}
          </div>
          <p className="mb-4">{movie.overview}</p>
          <p className="mb-2">Rating: <span className="font-semibold">{movie.vote_average.toFixed(1)}</span></p>
          <Link
            href={`/watch/${movie.imdb_id}`}
            className="inline-block bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 transition"
          >
            Watch Now
          </Link>
        </div>
      </div>
      <div className="mt-12">
        <h2 className="text-xl font-bold mb-4">Similar Movies</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {similar.slice(0, 8).map((sm) => (
            <Link href={`/movie/${sm.id}`} key={sm.id}>
              <div className="bg-gray-800 rounded-lg overflow-hidden shadow hover:shadow-lg transition">
                <Image
                  src={`https://image.tmdb.org/t/p/w500${sm.poster_path}`}
                  alt={sm.title}
                  width={200}
                  height={300}
                  className="w-full h-auto"
                />
                <div className="p-2">
                  <h3 className="text-sm font-semibold truncate">{sm.title}</h3>
                  <p className="text-xs text-gray-500">{sm.release_date?.slice(0, 4)}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
} 