import React from "react";
import './Hero.css';
import Carousel from 'react-material-ui-carousel';
import { Paper } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlay, faStar as faStarSolid } from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarRegular } from '@fortawesome/free-regular-svg-icons';
import {Link, useNavigate} from "react-router-dom";

const Hero = ({movies})=> {
  // eslint-disable-next-line
  const [isTransitioning, setIsTransitioning] = React.useState(false);
  // eslint-disable-next-line
  const [currentIndex, setCurrentIndex] = React.useState(0);
     const navigate = useNavigate();

    function addToRecentlyWatched(title) {
      let recent = JSON.parse(localStorage.getItem('recentlyWatched') || '[]');
      recent = recent.filter(t => t !== title);
      recent.unshift(title);
      if (recent.length > 5) recent = recent.slice(0, 5);
      localStorage.setItem('recentlyWatched', JSON.stringify(recent));
    }

    function toggleFavorite(movie) {
      let favs = JSON.parse(localStorage.getItem('favorites') || '[]');
      const exists = favs.some(f => f.imdbId === movie.imdbId);
      if (exists) {
        favs = favs.filter(f => f.imdbId !== movie.imdbId);
      } else {
        favs.unshift({ imdbId: movie.imdbId, title: movie.title, poster: movie.poster });
        if (favs.length > 20) favs = favs.slice(0, 20);
      }
      localStorage.setItem('favorites', JSON.stringify(favs));
      window.dispatchEvent(new Event('storage')); // trigger update in Favorites page
    }

    function isFavorite(movie) {
      let favs = JSON.parse(localStorage.getItem('favorites') || '[]');
      return favs.some(f => f.imdbId === movie.imdbId);
    }

    function reviews(movieId, title) {
        addToRecentlyWatched(title);
        navigate(`/Reviews/${movieId}`);
    }

  return (
    <div className="hero-section">
      <div className="hero-carousel">
        {movies && movies.length > 0 ? (
          <>
            {/* Material-UI Carousel with synchronized transitions */}
            <Carousel
              autoPlay={true}
              interval={5000}
              animation="fade"
              timeout={800}
              navButtonsAlwaysVisible={true}
              indicators={true}
              cycleNavigation={true}
              className="hero-carousel-sync"
              onChange={(index) => {
                setCurrentIndex(index);
                setIsTransitioning(true);
                setTimeout(() => setIsTransitioning(false), 400);
              }}
              stopAutoPlayOnHover={true}
              sx={{
                height: '100vh',
                position: 'relative',
                '& .MuiPaper-root': {
                  height: '100vh',
                  position: 'relative',
                  overflow: 'hidden',
                  margin: 0,
                  padding: 0,
                },
                '& .CarouselItem': {
                  height: '100vh',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                },
                /* Synchronized transition styles */
                '& .hero-slide': {
                  transition: 'opacity 0.8s ease-in-out',
                },
                '& .hero-content, & .hero-text, & .hero-image': {
                  transition: 'opacity 0.6s ease-in-out',
                }
              }}
            >
                {movies?.map((movie, index) => {
                  const backdrop = (movie && movie.backdrops && movie.backdrops.length > 0) ? movie.backdrops[0] : '';
                  const trailerId = (movie && movie.trailerLink && movie.trailerLink.length >= 11)
                    ? movie.trailerLink.substring(movie.trailerLink.length - 11)
                    : null;
                  
                  return (
                    <Paper key={movie.imdbId} sx={{ height: '100vh', margin: 0, padding: 0 }} className={index === currentIndex ? 'active' : ''}>
                      <div 
                        className="hero-slide" 
                        style={{
                          backgroundImage: backdrop ? `url(${backdrop})` : `url('/OIP.jpeg')`, 
                          backgroundSize: 'cover', 
                          backgroundPosition: 'center', 
                          backgroundRepeat: 'no-repeat', 
                          minHeight: '100vh'
                        }}
                      >
                        <div className={`hero-content ${isTransitioning ? 'hero-content--transitioning' : ''}`}>
                          <div className="hero-text">
                            <h1 className="hero-title">{movie?.title}</h1>
                            <p className="hero-description">
                              {movie?.releaseDate ? `Released: ${new Date(movie.releaseDate).getFullYear()}` : ''}
                              {movie?.genres && movie.genres.length > 0 && ` • ${movie.genres.join(', ')}`}
                            </p>
                            <div className="hero-buttons">
                              {trailerId && (
                                <Link 
                                  to={`/Trailer/${trailerId}`} 
                                  className="hero-button hero-button-primary"
                                  onClick={() => addToRecentlyWatched(movie.title)}
                                >
                                  <FontAwesomeIcon icon={faCirclePlay} />
                                  Watch Trailer
                                </Link>
                              )}
                              <button 
                                className="hero-button hero-button-secondary"
                                onClick={() => reviews(movie.imdbId, movie.title)}
                              >
                                Read Reviews
                              </button>
                              <button 
                                onClick={() => toggleFavorite(movie)}
                                className="hero-button hero-button-secondary"
                                title={isFavorite(movie) ? 'Remove from Favorites' : 'Add to Favorites'}
                              >
                                <FontAwesomeIcon
                                  icon={isFavorite(movie) ? faStarSolid : faStarRegular}
                                  style={{ color: '#f59e0b' }}
                                />
                                {isFavorite(movie) ? 'Favorited' : 'Favorite'}
                              </button>
                            </div>
                          </div>
                          <div className="hero-image">
                            <img 
                              src={movie?.poster} 
                              alt={movie?.title || ''} 
                              className="hero-poster"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = '/OIP.jpeg'; // Fallback to local image
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </Paper>
                  )
                })}
            </Carousel>
          </>
        ) : (
          <div className="hero-slide" style={{backgroundImage: `url('/OIP.jpeg')`}}>
            <div className="hero-content">
              <div className="hero-text">
                <h1 className="hero-title">Welcome to Movie Gold</h1>
                <p className="hero-description">Discover amazing movies and enjoy cinematic experiences</p>
                <div className="hero-buttons">
                  <button className="hero-button hero-button-primary">
                    Explore Movies
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Hero
