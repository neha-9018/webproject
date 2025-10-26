import {useParams} from 'react-router-dom';
import ReactPlayer from 'react-player';
import './Trailer.css';

import React, { useEffect, useRef } from 'react'

const Trailer = () => {
    let params = useParams();
    let key = params.ytTrailerId;
    const playerRef = useRef(null);

    // Add cleanup effect to handle component unmounting
    useEffect(() => {
        // Store ref value to avoid the React Hook exhaustive-deps warning
        const currentPlayerRef = playerRef.current;
        
        return () => {
            // This cleanup function will run when the component unmounts
            // It helps prevent the "play() request was interrupted" error
            if (currentPlayerRef) {
                try {
                    // Try to pause the player directly
                    if (typeof currentPlayerRef.pause === 'function') {
                        currentPlayerRef.pause();
                    }
                } catch (error) {
                    console.log("Error pausing player:", error);
                }
            }
            
            // Force any YouTube iframes to be removed from DOM
            const iframes = document.querySelectorAll('iframe[src*="youtube.com"]');
            iframes.forEach(iframe => {
                iframe.src = '';
            });
        };
    }, []);

    return (
        <div className="react-player-container">
            {key ? (
                <ReactPlayer 
                    ref={playerRef}
                    controls 
                    playing={true} 
                    url={`https://www.youtube.com/watch?v=${key}`} 
                    width="100%" 
                    height="100%" 
                    config={{
                        youtube: {
                            playerVars: { 
                                autoplay: 1,
                                origin: window.location.origin
                            }
                        }
                    }}
                    onError={(e) => console.error("Player error:", e)}
                />
            ) : null}
        </div>
    )
}

export default Trailer