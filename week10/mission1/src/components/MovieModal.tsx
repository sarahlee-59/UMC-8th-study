import { useEffect, useState } from "react";
import type { Movie } from "../types/movie";
import axios from "axios";

interface MovieModalProps {
    movie: Movie;
    onClose: () => void;
}

const MovieModal = ({ movie, onClose }: MovieModalProps) => {
    const [imdbId, setImdbId] = useState<string | null>(null);
    const [localizedTitle, setLocalizedTitle] = useState<string | null>(null);

    useEffect(() => {
        const fetchImdbId = async () => {
            try {
                const response = await axios.get(
                    `https://api.themoviedb.org/3/movie/${movie.id}/external_ids`,
                    {
                        headers: {
                            Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
                        },
                    }
                );
                setImdbId(response.data.imdb_id);
            } catch (error) {
                console.error("IMDB ID 가져오기 실패:", error);
            }
        };

        fetchImdbId();
    }, [movie.id]);

    useEffect(() => {
        const fetchLocalizedTitle = async () => {
            try {
                const response = await axios.get(
                    `https://api.themoviedb.org/3/movie/${movie.id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
                        },
                        params: {
                            language: "ko-KR",
                        },
                    }
                );
                setLocalizedTitle(response.data.title);
            } catch (error) {
                console.error("한국어 제목 가져오기 실패:", error);
            }
        };

        fetchLocalizedTitle();
    }, [movie.id]);

    const imdbUrl = imdbId
        ? `https://www.imdb.com/title/${imdbId}`
        : `https://www.imdb.com/find?q=${encodeURIComponent(movie.title)}`;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
            <div className="relative flex flex-col md:flex-row bg-white rounded-xl shadow-xl max-w-4xl w-full p-6 md:p-8">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl font-bold"
                >
                    &times;
                </button>

                {movie.poster_path && (
                    <div className="w-full md:w-1/3 mb-6 md:mb-0">
                        <img
                            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                            alt={movie.title}
                            className="rounded-lg shadow-md"
                        />
                    </div>
                )}

                <div className="md:ml-8 w-full md:w-2/3">
                    <h2 className="text-3xl font-bold mb-2 text-black">
                        {localizedTitle || movie.title}
                        {movie.original_title &&
                            movie.original_title !== (localizedTitle || movie.title) && (
                                <span className="block text-base font-medium text-black mt-1">
                                    ({movie.original_title})
                                </span>
                            )}
                    </h2>

                    <hr className="mb-4" />
                    <p className="text-gray-800 mb-2">
                        <strong>📅 개봉일:</strong> {movie.release_date}
                    </p>
                    <p className="text-gray-800 mb-2">
                        <strong>⭐ 평점:</strong> {movie.vote_average} / 10 ({movie.vote_count}표)
                    </p>
                    <p className="text-gray-700 mb-4 leading-relaxed">{movie.overview}</p>

                    <div className="flex space-x-4">
                        <a
                            href={imdbUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded transition"
                        >
                            🎬 IMDB에서 보기
                        </a>
                        <button
                            onClick={onClose}
                            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded transition"
                        >
                            닫기
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MovieModal;
