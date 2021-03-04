import React, { useState, FunctionComponent } from 'react';
import Player from './components/Player';
import { FileFoundResponse } from './types/PlayerTypes';
require('dotenv').config();

const App: FunctionComponent = () => { 
  const baseURL = process.env.REACT_APP_BASE_URL
  const [path, setPath] = useState('')
  const [filePath, setFilePath] = useState('')

  const handleChangePath = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setPath(e.target.value)
  }

  const browsePath = (): void => {
    fetch(`${baseURL}/find-file?path=${path}`)
      .then(response => response.json())
      .then((data: FileFoundResponse) => {
        if (data.found) {
          setFilePath(path)
        }
      })
  }

  return (
    <>
      MP3 Path: <input type="text" value={path} onChange={handleChangePath} />
      <button onClick={browsePath}>Select</button>
      <Player filePath={filePath}/>
    </>
  );
}

export default App;
