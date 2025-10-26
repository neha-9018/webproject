import React, { useEffect, useState } from 'react';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem('favorites');
    if (stored) setFavorites(JSON.parse(stored));
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      width: '100vw',
      position: 'fixed',
      top: 0,
      left: 0,
      zIndex: -1,
      background: `url('https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=1500&q=80') center/cover no-repeat fixed`,
    }}>
      <div style={{
        maxWidth: 700,
        margin: '2rem auto',
        background: 'rgba(26,26,46,0.82)',
        borderRadius: 12,
        boxShadow: '0 2px 12px #ffb40044',
        padding: '2rem',
        color: '#fff',
        position: 'relative',
        top: 0
      }}>
        <h2 style={{ color: '#ffb400', marginBottom: '1.5rem', letterSpacing: '0.08em' }}>Your Favorites</h2>
        {favorites.length === 0 ? (
          <p style={{ color: '#ccc' }}>No favorite movies yet. Click the star on a movie to add it here!</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {favorites.map((movie, idx) => (
              <li key={idx} style={{ marginBottom: 18, display: 'flex', alignItems: 'center', gap: 16 }}>
                {movie.poster && <img src={movie.poster} alt={movie.title} style={{ width: 60, borderRadius: 8, boxShadow: '0 1px 6px #0006' }} />}
                <span style={{ color: '#ffb400', fontWeight: 600, fontSize: '1.1rem' }}>{movie.title}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Favorites;
