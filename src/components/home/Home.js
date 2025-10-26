import Hero from '../hero/Hero';
import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Home.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faPlay, faFilm } from '@fortawesome/free-solid-svg-icons';


const Home = ({movies}) => {
  const navigate = useNavigate();
  const [recent, setRecent] = useState([]);
  const [motd, setMotd] = useState(null);

  function addToRecentlyWatched(title) {
    let recent = JSON.parse(localStorage.getItem('recentlyWatched') || '[]');
    recent = recent.filter(t => t !== title);
    recent.unshift(title);
    if (recent.length > 5) recent = recent.slice(0, 5);
    localStorage.setItem('recentlyWatched', JSON.stringify(recent));
  }

  function goToReviews(movieId, title) {
    addToRecentlyWatched(title);
    navigate(`/Reviews/${movieId}`);
  }

  useEffect(() => {
    const stored = localStorage.getItem('recentlyWatched');
    if (stored) setRecent(JSON.parse(stored));
  }, []);

  useEffect(() => {
    if (movies && movies.length > 0) {
      const randomIdx = Math.floor(Math.random() * movies.length);
      setMotd(movies[randomIdx]);
    }
  }, [movies]);

  return (
    <div style={{ position: 'relative' }}>
      {/* Background only shows when no movies are available */}
      {(!movies || movies.length === 0) && (
        <div style={{
          minHeight: '100vh',
          width: '100vw',
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: -1,
          background: `url('https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=1500&q=80') center/cover no-repeat fixed`,
        }}>
          {/* Overlay for readability */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(26,26,46,0.82)',
            zIndex: 0
          }} />
        </div>
      )}
      <div style={{ position: 'relative', zIndex: 2 }}>
        <Hero movies={movies} />
        {motd && (
          <div className="movie-of-day">
            {motd.poster && (
              <img 
                src={motd.poster} 
                alt={motd.title} 
                className="movie-of-day-image"
              />
            )}
            <div className="movie-of-day-content">
              <div className="movie-of-day-badge">
                <FontAwesomeIcon icon={faFilm} />
                Featured Movie
              </div>
              <h2 className="movie-of-day-title">{motd.title}</h2>
              <div className="movie-of-day-meta">
                {motd.releaseDate ? `Released: ${motd.releaseDate}` : ''}
                {motd.genres && motd.genres.length > 0 && ` • ${motd.genres.join(', ')}`}
              </div>
              <p className="movie-of-day-description">
                {motd.plot || 'No description available.'}
              </p>
              <div className="movie-of-day-actions">
                <button 
                  className="btn btn-primary"
                  onClick={() => goToReviews(motd.imdbId, motd.title)}
                >
                  <FontAwesomeIcon icon={faStar} className="me-1" />
                  Read Reviews
                </button>
                {motd.trailerLink && motd.trailerLink.length >= 11 && (
                  <Link 
                    to={`/Trailer/${motd.trailerLink.substring(motd.trailerLink.length - 11)}`}
                    className="btn btn-secondary"
                    onClick={() => addToRecentlyWatched(motd.title)}
                  >
                    <FontAwesomeIcon icon={faPlay} className="me-1" />
                    Watch Trailer
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      {/* Movie Poster Gallery */}
        {movies && movies.length > 0 && (
          <div className="movie-gallery">
            <h3 className="gallery-title">
              <FontAwesomeIcon icon={faFilm} className="me-2" />
              All Movies
            </h3>
            <div className="movie-grid">
              {movies.map((movie, idx) => (
                <div key={movie.imdbId || idx} className="movie-card" style={{animationDelay: `${idx * 0.1}s`}}>
                  <img 
                    src={movie.poster} 
                    alt={movie.title} 
                    className="movie-card-image"
                  />
                  <div className="movie-card-overlay">
                    <h4 className="movie-card-overlay-title">{movie.title}</h4>
                    <div className="movie-card-overlay-buttons">
                      <button 
                        className="movie-card-button"
                        onClick={() => goToReviews(movie.imdbId, movie.title)}
                      >
                        <FontAwesomeIcon icon={faStar} className="me-1" />
                        Reviews
                      </button>
                      {movie.trailerLink && movie.trailerLink.length >= 11 && (
                        <Link 
                          to={`/Trailer/${movie.trailerLink.substring(movie.trailerLink.length - 11)}`}
                          className="movie-card-button"
                          onClick={() => addToRecentlyWatched(movie.title)}
                        >
                          <FontAwesomeIcon icon={faPlay} className="me-1" />
                          Trailer
                        </Link>
                      )}
                    </div>
                  </div>
                  <div className="movie-card-content">
                    <h4 className="movie-card-title">{movie.title}</h4>
                    <div className="movie-card-date">{movie.releaseDate || ''}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {recent.length > 0 && (
          <div className="recently-watched">
            <h3 className="recently-watched-title">
              <FontAwesomeIcon icon={faStar} className="me-2" />
              Recently Watched
            </h3>
            <ul className="recently-watched-list">
              {recent.map((title, idx) => (
                <li key={idx} className="recently-watched-item">
                  <FontAwesomeIcon icon={faStar} className="recently-watched-icon" />
                  <span className="recently-watched-text">{title}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;