import { useQuery } from '@tanstack/react-query';
import React from 'react';

const API_KEY = '44a956178dd73105f015fb8978c09a47';
const ComedyApi = `https://api.themoviedb.org/3/comedy/movie/week?api_key=${API_KEY}`;

const fetchComedyMovies = async (): Promise<{ results: MovieType[] }> => {
  const response = await fetch(ComedyApi);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

type MovieType = {
  id: number;
  title: string;
  poster_path: string;
  overview: string;
  release_date: string;
  vote_average: number;
};

const Comedy = () => {
  const { data, error, isLoading } = useQuery({
    queryKey: ['comedyMovies'],
    queryFn: fetchComedyMovies,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error instanceof Error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1>Comedy Movies</h1>
      <ul>
        {data?.results.map((movie: MovieType) => (
          <li key={movie.id}>{movie.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default Comedy;
