import { useState } from 'react';
import React from 'react';
import './App.css';
import {
  useQuery,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';

// API URL and API key
const API_KEY = '44a956178dd73105f015fb8978c09a47';
const BASE_URL = 'https://api.themoviedb.org/3';
//endpoints for the movie types as follows
const endpoints = {
  trending: `${BASE_URL}/trending/all/week?api_key=${API_KEY}&language=en-US`,
  topRated: `${BASE_URL}/movie/top_rated?api_key=${API_KEY}&language=en-US`,
  action: `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=28`,
  animation: `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=16`,
  comedy: `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=35`,
};

// Define the union type for the category
type Category = 'trending' | 'topRated' | 'action' | 'animation' | 'comedy';

// Define the Movie type
type MovieType = {
  id: number;
  title: string;
  poster_path: string;
  overview: string;
  release_date: string;
  vote_average: number;
};

// fetch API to fetch data from The Movie DB API
const getMovies = async (category: Category): Promise<MovieType[]> => {
  const response = await fetch(endpoints[category]);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  const data = await response.json();
  return data.results.slice(0, 10); // Display the first 10 movies
};

// Define the Movies component
export const Movies = ({ category }: { category: Category }) => {
  const { isLoading, data, error } = useQuery<MovieType[]>({
    queryKey: ['movies', category],
    queryFn: () => getMovies(category),
  });

  if (isLoading) return <h1 className="loading">Loading...</h1>;
  if (error) return <h1 className="error">Error fetching data</h1>;

  return (
    <div className="movies-grid">
      {(data ?? []).length > 0 &&
        (data ?? []).map((movie) => (
          <div key={movie.id} className="movie">
            <h2 className="font-bold uppercase">{movie.title}</h2>{' '}
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
            />
            <p className="font-bold underline">Overview</p>{' '}
            <p>{movie.overview}</p>
            <p className="font-bold">Release Date: {movie.release_date}</p>{' '}
          </div>
        ))}
    </div>
  );
};

// This is the Default option Trending
function App() {
  const [category, setCategory] = useState<Category>('trending');

  return (
    <>
      <h1>My Movie Listings Application</h1>
      <div>
        <button onClick={() => setCategory('trending')}>Trending</button>
        <button onClick={() => setCategory('topRated')}>Top Rated</button>
        <button onClick={() => setCategory('action')}>Action</button>
        <button onClick={() => setCategory('animation')}>Animation</button>
        <button onClick={() => setCategory('comedy')}>Comedy</button>
      </div>
      <Movies category={category} />
    </>
  );
}

const queryClient = new QueryClient();

const Root = () => (
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
);

export default Root;
