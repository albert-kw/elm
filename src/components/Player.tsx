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
  const [bufferedRanges, setBufferedRanges] = useState<BufferedRange[]>()
  const [isDragging, setDragging] = useState(false)
  const barProgressElement = useRef<HTMLDivElement>(null)
  const progressPinElement = useRef<HTMLDivElement>(null)

  useEffect(() => {
    stopPlaying()
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
    barProgressElement.current.style.width = '0%'
    progressPinElement.current.style.left = '0%'
    setIsPlaying(false)
  }

  const updateCurrentTime = (e: React.SyntheticEvent<HTMLAudioElement, Event>): void => {
    if (isDragging) {
      return
    }

    const target = e.target as HTMLAudioElement
    const duration = audioElement.current.duration

    barProgressElement.current.style.width = `${(target.currentTime / duration) * 100}%`
    progressPinElement.current.style.left = `calc(${(target.currentTime / duration) * 100}% - 6px)`

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

    setDragging(true)

    const barElement = e.target as HTMLDivElement
    let positionOnBar = e.clientX - barElement.offsetLeft
    let selectedPosition = positionOnBar / barElement.clientWidth
    let selectedPositionPercent
    if (selectedPosition > 0 && selectedPosition < 1) {
      selectedPositionPercent = selectedPosition * 100
    } else if (selectedPosition <= 0) {
      selectedPositionPercent = 0
    } else {
      selectedPositionPercent = 100
    }

    barProgressElement.current.style.width = `${selectedPositionPercent}%`
    progressPinElement.current.style.left = `calc(${selectedPositionPercent}% - 6px)`
    progressPinElement.current.style.opacity = '1'

    const dragMove = (e: MouseEvent): void => {
      positionOnBar = e.clientX - barElement.offsetLeft
      selectedPosition = positionOnBar / barElement.clientWidth
      if (selectedPosition > 0 && selectedPosition < 1) {
        selectedPositionPercent = selectedPosition * 100
      } else if (selectedPosition <= 0) {
        selectedPositionPercent = 0
      } else {
        selectedPositionPercent = 100
      }

      barProgressElement.current.style.width = `${selectedPositionPercent}%`
      progressPinElement.current.style.left = `calc(${selectedPositionPercent}% - 6px)`
      progressPinElement.current.style.opacity = '1'
    }

    const stopDragMove = (): void => {
      document.onmouseup = null
      document.onmousemove = null
      progressPinElement.current.style.opacity = '0'
      audioElement.current.currentTime = audioElement.current.duration * selectedPosition
      setDragging(false)
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
          <div className="seeker-bar">
            {bufferedRanges?.map(range => {
              if (!audioElement.current) {
                return
              }
              const duration = audioElement.current.duration
              if (!duration) {
                return
              }
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
              ref={barProgressElement}
            />
          </div>
          <div className="pin" ref={progressPinElement} />
          
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
