import React, { useState, FunctionComponent, useEffect } from 'react';
import Player from './Player';
import '../styles/app.less';
import { MediaFilePath } from '../types/types';
import ElmMediaList from './ElmMediaList';

const App: FunctionComponent = () => { 
  const [mediaUrl, setMediaUrl] = useState('')
  const [mediaFilePaths, setMediaFilePaths] = useState<MediaFilePath[]>()

  useEffect(() => {
    // @ts-ignore
    window.api.receive('data-url', (mediaUrl: any) => {
      setMediaUrl(mediaUrl)
    })

    // @ts-ignore
    window.api.receive('media-directory', (mediaFilePaths: MediaFilePath[]) => {
      setMediaFilePaths(mediaFilePaths)
    })
  })

  const handleSelectFile = (path: string): void => {
    setMediaUrl('')
    // @ts-ignore
    window.api.send('select-file', path)
  }

  return (
    <>
      <div className="window">
        <ElmMediaList mediaFilePaths={mediaFilePaths} onSelectFile={handleSelectFile} />
        <Player mediaUrl={mediaUrl} />
      </div>
    </>
  );
}

export default App;
