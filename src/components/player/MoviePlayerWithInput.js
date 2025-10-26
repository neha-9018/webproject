import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import MoviePlayer from './MoviePlayer';


const MoviePlayerWithInput = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const urlParam = params.get('url') || '';
  const [url, setUrl] = useState(urlParam);
  const [playUrl, setPlayUrl] = useState(urlParam);
  const [error, setError] = useState("");

  // Helper to clean YouTube URLs
  function cleanYouTubeUrl(link) {
    if (!link) return link;
    
    if (link.includes('youtu.be/')) {
      return link.split('?')[0];
    }
    
    if (link.includes('youtube.com/watch')) {
      try {
        const urlObj = new URL(link);
        const videoId = urlObj.searchParams.get('v');
        if (videoId) {
          return `https://www.youtube.com/watch?v=${videoId}`;
        }
      } catch (error) {
        console.error("Invalid URL for cleaning:", link, error);
        return link; // Return original link on error
      }
    }
    
    return link;
  }

  useEffect(() => {
    if (urlParam) {
      setUrl(urlParam);
      setPlayUrl(cleanYouTubeUrl(urlParam));
      setError("");
    }
  }, [urlParam]);

  const handlePlay = (e) => {
    e.preventDefault();
    setError("");
    setPlayUrl(cleanYouTubeUrl(url));
  };

  const handlePlayerError = useCallback((e) => {
    setError("Video could not be played. Please check the link or try a different one.");
    console.error('MoviePlayer error:', e);
  }, []);

  return (
    <div style={{ maxWidth: 800, margin: '2rem auto' }}>
      <form onSubmit={handlePlay} style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        <input
          type="text"
          placeholder="Enter YouTube or video URL"
          value={url}
          onChange={e => setUrl(e.target.value)}
          style={{ flex: 1, padding: 8, borderRadius: 6, border: '1px solid #ccc', fontSize: 16 }}
        />
        <button type="submit" style={{ background: '#ffb400', color: '#222', border: 'none', borderRadius: 6, padding: '8px 18px', fontWeight: 600, cursor: 'pointer' }}>
          Play
        </button>
      </form>
      <div style={{ color: '#888', fontSize: 13, marginBottom: 8, textAlign: 'center' }}>
        Debug: Video URL being played: <span style={{ color: '#ffb400' }}>{playUrl || '(none)'}</span>
      </div>
      {error && (
        <div style={{ color: 'red', marginBottom: 12, fontWeight: 500 }}>{error}</div>
      )}
      {playUrl ? (
        <MoviePlayer
          src={playUrl}
          title="Now Playing"
          onError={handlePlayerError}
        />
      ) : (
        <div style={{ color: '#ccc', textAlign: 'center', marginTop: 32, fontSize: 18 }}>
          Enter a YouTube or video link above and click Play to watch.
        </div>
      )}
    </div>
  );
};

export default MoviePlayerWithInput;