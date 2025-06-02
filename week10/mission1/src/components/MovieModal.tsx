import type { Movie } from "../types/movie";

interface MovieModalProps {
    movie: Movie;
    onClose: () => void;
}

const MovieModal = ({ movie, onClose }: MovieModalProps) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg w-[90%] max-w-lg relative">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-500 hover:text-black text-xl"
                >
                    &times;
                </button>
                <h2 className="text-2xl font-bold mb-4">{movie.title}</h2>
                <p className="text-sm text-gray-700 mb-2">{movie.overview}</p>
                <p><strong>개봉일:</strong> {movie.release_date}</p>
                <p><strong>평점:</strong> {movie.vote_average} / 10</p>
                {movie.poster_path && (
                    <img
                        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                        alt={movie.title}
                        className="mt-4 rounded"
                    />
                )}
            </div>
        </div>
    );
};

export default MovieModal;
