import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchMovieTrailer, fetchMovieDetail } from "../api/tmdb";
import BackButton from "./BackButton";
import "./MovieDetail.css";

function MovieDetail() {
    const { movieId } = useParams();
    const navigate = useNavigate();

    const [trailer, setTrailer] = useState(null);
    const [movie, setMovie] = useState(null);

    useEffect(() => {
        fetchMovieTrailer(movieId).then(setTrailer);
        fetchMovieDetail(movieId).then(setMovie);
    }, [movieId]);

    return (
        <div className="movie-detail">
            <h2>🎬ตัวอย่างหนัง</h2>
            <div className="trailer-container">
                {trailer ? (
                    <div className="trailer-wrapper">
                        <iframe
                            src={`https://www.youtube.com/embed/${trailer.key}`}
                            title="Movie Trailer"
                            allowFullScreen
                        />
                    </div>
                ) : (
                    <p>ไม่มีตัวอย่างหนัง</p>
                )}
                <div className="back-btn-wrapper">
                    <BackButton />
                </div>
            </div>
            {movie && (
                <div className="movie-info">
                    <h2>{movie.title}</h2>
                    <h4>เรื่องย่อ : {movie.overview}</h4>
                    <p>⭐ คะแนน: {movie.vote_average.toFixed(1)}</p>
                </div>
            )}
            <button
                className="book-btn"
                onClick={() => navigate(`/seat/${movieId}`)}
            >
                จองตั๋ว
            </button>
        </div>
    );
}

export default MovieDetail;
