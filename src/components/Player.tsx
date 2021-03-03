import { useState, FunctionComponent } from 'react';
import '../styles/player.css';

const Player: FunctionComponent = () => {
  const [isPlaying, setIsPlaying] = useState(false)
  
  const togglePlay = (): void => {
    setIsPlaying(!isPlaying)
  }

  return (
    <div className="player-window">
      <div className="player-controls">
        <button onClick={togglePlay}>
          {isPlaying ? 'Play' : 'Pause'}
        </button>
        <button>Stop</button>
        <button>Previous</button>
        <button>Next</button>
      </div>
    </div>
  );
}

export default Player;
