import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MovieList from "../components/MovieList";
import MovieDropdown from "../components/MovieDropdown";
import {
    fetchNowPlaying,
    fetchPopular,
    fetchTopRated,
    fetchUpcoming
} from "../api/tmdb";

function Home() {
    const [movies, setMovies] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        fetchNowPlaying().then(setMovies);
    }, []);

    const apiMap = {
        now_playing: fetchNowPlaying,
        popular: fetchPopular,
        top_rated: fetchTopRated,
        upcoming: fetchUpcoming
    };

    const handleCategoryChange = (category) => {
        apiMap[category]().then(setMovies);
    };

    const handleMovieClick = (movie) => {
        navigate(`/seat/${movie.id}`);
    };

    return (
        <>
            <MovieDropdown onChange={handleCategoryChange} />
            <MovieList movies={movies} onMovieClick={handleMovieClick} />
        </>
    );
}

export default Home;
