export interface Genre {
  id: number;
  name: string;
}

export interface MediaBase {
  id: number;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  overview: string;
}

export interface Movie extends MediaBase {
  title: string;
  release_date: string;
  genres?: Genre[];
  imdb_id?: string;
  runtime?: number;
}

export interface TVShow extends MediaBase {
  name: string;
  first_air_date: string;
  genres?: Genre[];
  number_of_seasons?: number;
  external_ids?: {
    imdb_id: string;
  };
  seasons?: Season[];
}

export interface Season {
  id: number;
  name: string;
  season_number: number;
  episode_count: number;
  poster_path: string | null;
}

export interface Episode {
  id: number;
  name: string;
  overview: string;
  vote_average: number;
  air_date: string;
  episode_number: number;
  season_number: number;
  still_path: string | null;
  runtime: number | null;
}
