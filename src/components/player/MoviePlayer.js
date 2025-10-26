import React from 'react';
import ReactPlayer from 'react-player';
import './Movieplayer.css';

const MoviePlayer = ({ url }) => {
  return (
    <div className='player-wrapper'>
      <ReactPlayer
        className='react-player'
        url={url}
        width='100%'
        height='100%'
        controls={true}
      />
    </div>
  );
};

export default MoviePlayer;
