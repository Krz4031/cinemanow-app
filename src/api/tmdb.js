const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

async function fetchMovies(url) {
  const res = await fetch(url);
  const data = await res.json();
  return data.results;
}

export function fetchNowPlaying() {
  return fetchMovies(
    `${BASE_URL}/movie/now_playing?api_key=${API_KEY}&language=en-US&page=1`,
  );
}

export function fetchPopular() {
  return fetchMovies(
    `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=en-US&page=1`,
  );
}

export function fetchTopRated() {
  return fetchMovies(
    `${BASE_URL}/movie/top_rated?api_key=${API_KEY}&language=en-US&page=1`,
  );
}

export function fetchUpcoming() {
  return fetchMovies(
    `${BASE_URL}/movie/upcoming?api_key=${API_KEY}&language=en-US&page=1`,
  );
}

export async function fetchMovieTrailer(movieId) {
  const res = await fetch(
    `${BASE_URL}/movie/${movieId}/videos?api_key=${API_KEY}&language=en-US`,
  );
  const data = await res.json();

  return data.results.find(
    (video) => video.type === "Trailer" && video.site === "YouTube",
  );
}

export async function fetchMovieDetail(movieId) {
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/${movieId}?api_key=${import.meta.env.VITE_TMDB_API_KEY}&language=th-TH`,
  );
  return res.json();
}
