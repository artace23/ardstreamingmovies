'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

interface SearchResult {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
}

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchResults = async () => {
      if (query.length < 2) {
        setResults([]);
        return;
      }
      setLoading(true);
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/search/movie?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&query=${query}`
        );
        setResults(response.data.results);
      } catch (error) {
        console.error('Error fetching search results:', error);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(fetchResults, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  return (
    <div className="relative">
      <input
        type="text"
        placeholder="Search movies and shows..."
        className="px-4 py-2 border-1 rounded text-white w-full"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <AnimatePresence>
        {results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 bg-white dark:bg-gray-800 rounded-lg shadow-lg mt-2 z-50"
          >
            {results.map((result) => (
              <Link href={`/movie/${result.id}`} key={result.id}>
                <div className="flex items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                  <Image
                    src={`https://image.tmdb.org/t/p/w92${result.poster_path}`}
                    alt={result.title}
                    width={50}
                    height={75}
                    className="rounded"
                  />
                  <div className="ml-4">
                    <h3 className="font-semibold">{result.title}</h3>
                    <p className="text-sm text-gray-500">{result.release_date?.slice(0, 4)}</p>
                  </div>
                </div>
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 