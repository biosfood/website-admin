import { Button, Container } from '@nextui-org/react';
import { useState, useRef } from 'react'

export function FileDropZone({onFileDrop, color, highlightColor}) {
  function onFileInputChange(event) {
    event.preventDefault()
    const files = Array.from(event.target.files)
    files.map(file => onFileDrop(file))
  }

  function onDrop(event) {
    event.preventDefault()
    Array.from(event.dataTransfer.files).map(file => onFileDrop(file))
  } 
  
  const fileInputRef = useRef();
  const [hover, setHover] = useState(false)

  return (
    <Container
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <input ref={fileInputRef} type='file' accept='image/png, image/jpeg'
        onChange={onFileInputChange} style={{display: 'none'}}/>
      <Button bordered rounded color={hover ? "success" : "primary"} size="xl" css={{minHeight: '7em', minWidth: "100%"}}
        onDrop={onDrop} onPress={() => fileInputRef.current.click()}
        onDragOver={event => {event.preventDefault(); setHover(true)}}
        onDragLeave={event => setHover(false)}>
        Upload your images here
      </Button>
    </Container>
  )
}
