import React, { useState, FunctionComponent, useRef, useEffect } from 'react';
import '../styles/player.less';
import { BufferedRange } from '../types/types';
import * as uuid from 'uuid'

import Notify from '../components/Notify';
import Snackbar from '@material-ui/core/Snackbar';

interface PlayerProps {
  mediaUrl: string
}

const Player: FunctionComponent<PlayerProps> = ({mediaUrl}) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const audioElement = useRef<HTMLMediaElement>(null)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [bufferedRanges, setBufferedRanges] = useState<BufferedRange[]>()
  const [notif, setNotif] = useState(null);
  const [openSnack, setOpenSnack] = useState(false);

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

    const handleSnackBarClose = () => {
        setOpenSnack(false);
    };

  const togglePlay = (): void => {
    if (!audioElement?.current) {
      return
    }

    setIsPlaying(!isPlaying)
    if (!isPlaying) {
      audioElement.current.play()

      setNotif({
        title: "Elm Player",
        message: "Playing"
      })
      setOpenSnack(true);


    } else {
      audioElement.current.pause()
      setNotif({
        title: "Elm Player",
        message: "Paused"
      })
      setOpenSnack(true);
    }
  }

  const stopPlaying = (): void => {
    if (!audioElement?.current) {
      return
    }
    audioElement.current['pause']()
    audioElement.current['currentTime'] = 0
    setIsPlaying(false)

    setNotif({
        title: "Elm Player",
        message: "Stopped"
    })
    setOpenSnack(true);
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

    const barElement = e.target as HTMLDivElement
    const positionOnBar = e.clientX - barElement.offsetLeft
    const selectedPosition = positionOnBar / barElement.clientWidth
    audioElement.current.currentTime = selectedPosition * audioElement.current.duration
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
      { notif && (
        <div className="notification">
           {/* <Snackbar open={openSnack}
                autoHideDuration={3000}
                onClose={handleSnackBarClose}>

                <div className="notif-message">{notif.message}</div>
        </Snackbar> */}
        <Notify title={notif.title} message={notif.message} open={openSnack} onClose={handleSnackBarClose}/>
        </div>
      )// && () && (setNotif (null))
      }
      <div className="player-controls">
        <div className="seeker-bar-container" onMouseDown={handleChangeTime}>
          <div className="seeker-bar">
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
          <div className="pin" style={{
            left: currentTime ? `calc(${(currentTime / duration) * 100}% - 6px)` : '-6px'
          }}/>
        </div>
        <div className="control-buttons">
          <button disabled={!mediaUrl} onClick={togglePlay}>
            {isPlaying ? 'Pause' : 'Play'}
          </button>
          <button disabled={!mediaUrl} onClick={stopPlaying}>Stop</button>
          <button disabled={!mediaUrl}>Previous</button>
          <button disabled={!mediaUrl}>Next</button>
        </div>
      </div>
    </>
  );
}

export default Player;
