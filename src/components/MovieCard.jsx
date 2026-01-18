function MovieCard({ movie, onClick }) {
    return (
        <div className="movie-card" onClick={onClick}>
            <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
            />
            <h3>{movie.title}</h3>
            <p>⭐ {movie.vote_average.toFixed(1)}</p>
        </div>
    );
}

export default MovieCard;
