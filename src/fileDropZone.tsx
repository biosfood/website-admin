import { Button, Container } from '@nextui-org/react';
import React, { useState, useRef, RefObject } from 'react'

interface FileDropEvent {
  target: { files?: FileList | undefined | null },
  preventDefault: () => any
}

interface DataTransferEvent {
  dataTransfer: { files?: FileList | undefined | null },
  preventDefault: () => any
}

export function FileDropZone({onFileDrop, style}: {onFileDrop: (file: File) => void, style?: object}) {
  function onFileInputChange(event: FileDropEvent) {
    event.preventDefault()
    const files = Array.from(event.target?.files!)
    files.map((file: File) => onFileDrop(file))
  }

  function onDrop(event: DataTransferEvent) {
    event.preventDefault()
    Array.from(event.dataTransfer.files!).map((file: File) => onFileDrop(file))
  } 
  
  const fileInputRef = React.createRef<HTMLInputElement>();
  const [hover, setHover] = useState(false)

  return (
    <Container
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={style}
    >
      <input ref={fileInputRef} type='file' accept='image/png, image/jpeg'
        onChange={onFileInputChange} style={{display: 'none'}}/>
      <Button bordered rounded color={hover ? "success" : "primary"} size="xl" css={{minHeight: '7em', minWidth: "100%"}}
        onDrop={onDrop} onPress={() => fileInputRef.current!.click()}
        onDragOver={event => {event.preventDefault(); setHover(true)}}
        onDragLeave={event => setHover(false)}>
        Upload your images here
      </Button>
    </Container>
  )
}
