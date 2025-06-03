import { useCallback, useMemo, useState } from "react";
import MovieFilter from "../components/MovieFilter";
import MovieList from "../components/MovieList";
import useFetch from "../hooks/useFetch";
import type { Movie, MovieFilters, MovieResponse } from "../types/movie";
import MovieModal from "../components/MovieModal";

export default function HomePage() {
    const [filters, setFilters] = useState<MovieFilters>({
        query: "어벤져스",
        include_adult: false,
        language: "ko-KR",
    })

    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

    const axiosRequestConfig = useMemo(
        () => ({
            params: filters,
        }),
        [filters],
    )

    const { data, error, isLoading } = 
        useFetch<MovieResponse>(
        "/search/movie", 
        axiosRequestConfig,
    );

    const movies = useMemo(() => data?.results || [], [data]);

    const handleMovieFilters = useCallback((filters: MovieFilters) => {
        setFilters(filters);
    }, 
    []);

     const handleCardClick = useCallback((movie: Movie) => {
        setSelectedMovie(movie);
    }, []);

    const handleCloseModal = useCallback(() => {
        setSelectedMovie(null);
    }, []);

    if (error) {
        return <div>{error}</div>;
    }


    return (
        <div className="container">
            <MovieFilter onChange={handleMovieFilters}/>
            {isLoading ? (
                <div>로딩 중 입니다...</div>
            ) : (
                <MovieList movies={movies} onClickCard={handleCardClick}/>
            )}   

            {selectedMovie && (
                <MovieModal movie={selectedMovie} onClose={handleCloseModal} />
            )}     
        </div>
    );
}
    


// 검색 필터
// 영화 무비