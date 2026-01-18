function MovieDropdown({ onChange }) {
    return (
        <nav>
            <h2>CinemaNow 🎬</h2>
            <select className='menu' onChange={(e) => onChange(e.target.value)}>
                <option value="now_playing">Now Playing</option>
                <option value="popular">Popular</option>
                <option value="top_rated">Top Rated</option>
                <option value="upcoming">Latest Releases</option>
            </select>
        </nav>
    );
}

export default MovieDropdown;
