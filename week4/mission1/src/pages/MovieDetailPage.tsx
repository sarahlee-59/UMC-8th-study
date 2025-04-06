import { useParams } from "react-router-dom";
import useCustomFetch from "../hooks/useCustomFetch";
import { MovieDetailResponse, CastResponse } from "../types/movie";

const MovieDetailPage = () => {
  const { movieId } = useParams();

  const movieUrl = `https://api.themoviedb.org/3/movie/${movieId}?language=en-US`;
  const castUrl = `https://api.themoviedb.org/3/movie/${movieId}/credits?language=en-US`;

  const {
    data: movie,
    isPending: movieLoading,
    isError: movieError,
  } = useCustomFetch<MovieDetailResponse>(movieUrl, "en-US");

  const {
    data: castData,
    isPending: castLoading,
    isError: castError,
  } = useCustomFetch<CastResponse>(castUrl, "en-US");

  if (movieLoading || castLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-500"></div>
      </div>
    );
  }

  if (movieError || castError) {
    return (
      <div className="text-center text-red-500 font-bold text-xl mt-10">
        영화 정보를 불러오는 중 오류가 발생했어요.
      </div>
    );
  }

  if (!movie) return null;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div
        className="relative w-full h-96 bg-cover bg-center"
        style={{
          backgroundImage: `url(https://image.tmdb.org/t/p/w1280/${movie.backdrop_path})`,
        }}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>
      </div>

      <div className="container mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <img
              className="rounded-lg shadow-lg w-full"
              src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
              alt={movie.title}
            />
          </div>

          <div className="md:col-span-2">
            <h1 className="text-4xl font-bold mb-4">{movie.title}</h1>
            <p className="text-gray-300 text-lg mb-6">{movie.overview}</p>
            <p className="mb-2">
              <strong>개봉일:</strong> {movie.release_date}
            </p>
            <p className="mb-2">
              <strong>평점:</strong> {movie.vote_average} / 10
            </p>
            <p className="mb-2">
              <strong>러닝타임:</strong> {movie.runtime}분
            </p>
            <div className="flex gap-2 flex-wrap mt-4">
              {movie.genres.map((genre) => (
                <span
                  key={genre.id}
                  className="px-3 py-1 bg-purple-500 text-white rounded-full text-sm"
                >
                  {genre.name}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* 출연진 */}
        <div className="mt-12">
          <h2 className="text-2xl font-semibold mb-4">감독/출연</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {castData?.cast.map((actor) => (
              <div key={actor.id} className="text-center">
                <img
                  className="w-28 h-28 object-cover rounded-full mx-auto"
                  src={
                    actor.profile_path
                      ? `https://image.tmdb.org/t/p/w200/${actor.profile_path}`
                      : "https://via.placeholder.com/100x100"
                  }
                  alt={actor.name}
                />
                <p className="mt-2 font-semibold">{actor.name}</p>
                <p className="text-sm text-gray-400">{actor.character}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetailPage;
