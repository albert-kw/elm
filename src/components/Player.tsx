import React, { useState, FunctionComponent, useRef, useEffect } from 'react';
import '../styles/player.less';
import { BufferedRange } from '../types/types';
import * as uuid from 'uuid'
import IconButton from './IconButton';
import { PAUSE_CIRCLE, PLAY_CIRCLE, STEP_BACKWARD, STEP_FORWARD } from './assets/svgIcons';

interface PlayerProps {
  mediaUrl: string
}

const Player: FunctionComponent<PlayerProps> = ({mediaUrl}) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const audioElement = useRef<HTMLMediaElement>(null)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [bufferedRanges, setBufferedRanges] = useState<BufferedRange[]>()
  const [isDragging, setDragging] = useState(false)
  const seekerBarElement = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (audioElement?.current?.src) {
      setDuration(audioElement.current.duration)
    }
  })

  useEffect(() => {
    if (audioElement?.current?.src) {
      setDuration(audioElement.current.duration)
    }
    setIsPlaying(false)
    setCurrentTime(0)
  }, [mediaUrl])

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

    if (audioElement?.current) {
      const audioBuffered = audioElement.current.buffered
      const newBufferedRanges: BufferedRange[] = []

      for (let i = 0; i < audioBuffered.length; i++) {
        const bufferedRange: BufferedRange = {
          id: uuid.v1(),
          start: audioBuffered.start(i),
          end: audioBuffered.end(i),
        }

        newBufferedRanges.push(bufferedRange)
      }
  
      setBufferedRanges(newBufferedRanges)

      if (audioElement.current.ended) {
        setIsPlaying(false)
      }
    }
  }

  const handleChangeTime = (e: React.MouseEvent<HTMLDivElement, MouseEvent>): void => {
    if (!audioElement?.current) {
      return
    }

    if (isPlaying) {
      audioElement.current.pause()
    }

    setDragging(true)

    const barElement = e.target as HTMLDivElement
    let positionOnBar = e.clientX - barElement.offsetLeft
    let selectedPosition = positionOnBar / barElement.clientWidth
    audioElement.current.currentTime = selectedPosition * audioElement.current.duration

    const dragMove = (e: MouseEvent): void => {
      positionOnBar = e.clientX - barElement.offsetLeft
      selectedPosition = positionOnBar / barElement.clientWidth
      audioElement.current.currentTime = selectedPosition * audioElement.current.duration
    }

    const stopDragMove = (): void => {
      document.onmouseup = null
      document.onmousemove = null
      setDragging(false)
      if (isPlaying) {
        audioElement.current.play()
      }
    }

    const mouseDownDrag = (e: React.MouseEvent<HTMLDivElement, MouseEvent>): void => {
      document.onmousemove = dragMove
      document.onmouseup = stopDragMove
    }

    mouseDownDrag(e)
  }

  return (
    <>
      {mediaUrl && (
        <audio
          ref={audioElement}
          onTimeUpdate={updateCurrentTime}
          src={mediaUrl}
        />
      )}
      <div className="player-controls">
        <div className="seeker-bar-container" onMouseDown={handleChangeTime}>
          <div className="seeker-bar" ref={seekerBarElement}>
            {bufferedRanges?.map(range => {
              return (
                <div
                  className="buffered"
                  key={range.id}
                  style={{
                    left: `${(range.start / duration) * 100}%`,
                    right: `calc(100% - ${(range.end / duration) * 100}%)`,
                  }}
                />
              )
            })}
            <div
              className="progress"
              style={{
                width: currentTime ? `${(currentTime / duration) * 100}%` : '0'
              }}
            />
          </div>
          {!isDragging && (
            <div className="pin" style={{
              left: currentTime ? `calc(${(currentTime / duration) * 100}% - 6px)` : '-6px',
            }}/>
          )}
          {isDragging && (
            <div className="pin-dragging" style={{
              left: currentTime ? `calc(${(currentTime / duration) * 100}% - 6px)` : '-6px',
            }}/>
          )}
        </div>
        <div className="control-buttons">
          <IconButton size={22} disabled={!mediaUrl}>
            {STEP_BACKWARD}
          </IconButton>
          <IconButton size={45} onClick={togglePlay} disabled={!mediaUrl}>
            {isPlaying ? PAUSE_CIRCLE : PLAY_CIRCLE}
          </IconButton>
          {/* <button disabled={!mediaUrl} onClick={stopPlaying}>Stop</button> */}
          <IconButton size={22} disabled={!mediaUrl}>
            {STEP_FORWARD}
          </IconButton>
        </div>
      </div>
    </>
  );
}

export default Player;
