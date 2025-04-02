import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
}

interface Credit {
  id: number;
  cast: Array<{ name: string; character: string; profile_path: string }>;
  crew: Array<{ name: string; job: string }>;
}

const MovieDetailPage: React.FC = () => {
  const { movieId } = useParams<{ movieId: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [credits, setCredits] = useState<Credit | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovieData = async () => {
      try {
        setLoading(true);
        const apiKey = import.meta.env.VITE_TMDB_API_KEY;
        const movieResponse = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}`);
        console.log(movieResponse.data);
        const creditsResponse = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${apiKey}`);
        
        setMovie(movieResponse.data);
        setCredits(creditsResponse.data);
      } catch (err) {
        setError('영화 정보를 불러오는 데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchMovieData();
  }, [movieId]);

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      {movie && (
        <div>
          <h1>{movie.title}</h1>
          <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
          <p>{movie.overview}</p>
        </div>
      )}
      {credits && (
        <div>
          <h2>출연진</h2>
          <ul>
            {credits.cast.map((actor) => (
              <li key={actor.name}>
                <img src={`https://image.tmdb.org/t/p/w500${actor.profile_path}`} alt={actor.name} />
                <p>{actor.name} as {actor.character}</p>
              </li>
            ))}
          </ul>
          <h2>감독</h2>
          <ul>
            {credits.crew.filter(member => member.job === 'Director').map(director => (
              <li key={director.name}>{director.name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default MovieDetailPage;
