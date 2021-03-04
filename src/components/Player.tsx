import { useState, FunctionComponent, useRef, useEffect } from 'react';
import '../styles/player.css';
import { BufferedRange } from '../types/PlayerTypes';

const Player: FunctionComponent = () => {
  const [isPlaying, setIsPlaying] = useState(false)
  const audioElement = useRef<HTMLMediaElement>(null)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [buffered, setBuffered] = useState(0)

  useEffect(() => {
    if (audioElement?.current?.src) {
      setDuration(audioElement.current.duration)
      const buffered = audioElement.current.buffered
      setBuffered(buffered.end(buffered.length - 1))

      if (audioElement.current.ended) {
        setIsPlaying(false)
      }
    }
  })

  const togglePlay = (): void => {
    if (!audioElement?.current) {
      return
    }

    setIsPlaying(!isPlaying)
    if (!isPlaying) {
      audioElement.current.play()
    } else {
      audioElement.current.pause()
    }
  }

  const stopPlaying = (): void => {
    if (!audioElement?.current) {
      return
    }
    audioElement.current['pause']()
    audioElement.current['currentTime'] = 0
    setIsPlaying(false)
  }

  const updateCurrentTime = (e: React.SyntheticEvent<HTMLAudioElement, Event>): void => {
    const target = e.target as HTMLAudioElement
    setCurrentTime(target.currentTime)
  }

  const handleChangeTime = (e: React.MouseEvent<HTMLDivElement, MouseEvent>): void => {
    if (!audioElement?.current) {
      return
    }

    const barElement = e.target as HTMLDivElement
    const positionOnBar = e.clientX - barElement.offsetLeft
    const selectedPosition = positionOnBar / barElement.clientWidth
    audioElement.current.currentTime = selectedPosition * audioElement.current.duration
  }

  return (
    <div className="player-window">
      <audio style={{width: '100%'}} controls ref={audioElement} onTimeUpdate={updateCurrentTime} src="http://localhost:3001/stream">
      </audio>
      <div className="player-controls">
        <div className="seeker-bar-container" onMouseDown={handleChangeTime}>
          <div className="seeker-bar">
            <div
              className="buffered"
              style={{
                width: buffered ? `${(buffered / duration) * 100}%` : '0'
              }}
            />
            <div
              className="progress"
              style={{
                width: currentTime ? `${(currentTime / duration) * 100}%` : '0'
              }}
            />
          </div>
        </div>
        <div className="control-buttons">
          <button onClick={togglePlay}>
            {isPlaying ? 'Pause' : 'Play'}
          </button>
          <button onClick={stopPlaying}>Stop</button>
          <button>Previous</button>
          <button>Next</button>
        </div>
      </div>
    </div>
  );
}

export default Player;
