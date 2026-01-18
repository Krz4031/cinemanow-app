import { useNavigate } from "react-router-dom";

function MovieList({ movies }) {
    const navigate = useNavigate();

    return (
        <div className="movie-list">
            {movies.map((movie) => (
                <div
                    key={movie.id}
                    className="movie-card"
                    onClick={() => navigate(`/movie/${movie.id}`)}
                >
                    <img
                        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                        alt={movie.title}
                    />
                    <h3>{movie.title}</h3>
                    <p>⭐ {movie.vote_average.toFixed(1)}</p>
                </div>
            ))}
        </div>
    );
}

export default MovieList;
