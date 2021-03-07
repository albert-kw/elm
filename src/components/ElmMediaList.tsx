import React, { useState, FunctionComponent } from 'react';
import { MediaFilePath } from '../types/types';

interface ElmMediaListProps {
  mediaFilePaths: MediaFilePath[]
  onSelectFile: (path: string) => void
}

const ElmMediaList: FunctionComponent<ElmMediaListProps> = ({
  mediaFilePaths,
  onSelectFile,
}) => {
  const [selectedFileKey, setSelectedFileKey] = useState('')

  const handleSelectFile = (mediaFilePath: MediaFilePath): void => {
    setSelectedFileKey(mediaFilePath.id)
    onSelectFile(mediaFilePath.path)
  }

  return (
    <>
      {mediaFilePaths && mediaFilePaths.map(m => (
        <div
          key={m.id}
          onClick={() => handleSelectFile(m)}
          style={{
            color: selectedFileKey === m.id && 'blue',
            cursor: 'pointer',
            userSelect: 'none',
          }}
        >
          {m.name}
        </div>
      ))}
    </>
  )
}

export default ElmMediaList