'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
  backdrop_path: string;
  vote_average: number;
}

export default function Home() {
  const [trending, setTrending] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [featuredMovie, setFeaturedMovie] = useState<Movie | null>(null);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/trending/movie/week?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`
        );
        setTrending(response.data.results);
        setFeaturedMovie(response.data.results[0]);
      } catch (error) {
        console.error('Error fetching trending movies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrending();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      {featuredMovie && (
        <div className="relative h-96 mb-8 rounded-lg overflow-hidden">
          <Image
            src={`https://image.tmdb.org/t/p/original${featuredMovie.backdrop_path}`}
            alt={featuredMovie.title}
            layout="fill"
            objectFit="cover"
            className="rounded-lg"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent flex items-end justify-center p-8">
            <div className="text-center text-white">
              <h2 className="text-4xl font-bold">{featuredMovie.title}</h2>
              <p className="mt-2">{new Date(featuredMovie.release_date).getFullYear()}</p>
              <Link
                href={`/movie/${featuredMovie.id}`}
                className="inline-block bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 transition mt-4"
              >
                Watch Now
              </Link>
            </div>
          </div>
        </div>
      )}
      <h1 className="text-2xl font-bold mb-4">Trending Movies</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {trending.map((movie) => (
          <motion.div
            key={movie.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            whileHover={{ scale: 1.05 }}
          >
            <Link href={`/movie/${movie.id}`}>
              <div className="border rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition">
                <div className="relative">
                  <Image
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    width={500}
                    height={750}
                    className="w-full h-auto"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent flex items-end justify-center p-4">
                    <div className="text-center text-white">
                      <h2 className="text-lg font-semibold">{movie.title}</h2>
                      <p className="text-sm">{movie.vote_average.toFixed(1)} ⭐</p>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
