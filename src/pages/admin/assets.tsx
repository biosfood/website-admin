import { adminPages } from '@/pages/admin/index'
import { Navigation } from '@/navigation'
import { Grid, Card, Row, Button, Text, Image as NextImage, Input, Spacer } from '@nextui-org/react';
import { loadAssets, createAsset } from '@/api'
import { useEffect, useState, useRef } from 'react';
import { FileDropZone } from '@/fileDropZone'

export default function Assets() {
  const [assets, setAssets] = useState(new Array())
  const updateAssets = () => {
    loadAssets().then(newAssets => {
      if (newAssets) {
        setAssets(newAssets)
      }
    })
  }
  useEffect(updateAssets, [])
  
  const [filesToProcess, setFiles] = useState(new Array())
  function onFileDrop(file) {
    setFiles([...filesToProcess, file])
  }

  function File() {
    if (!filesToProcess.length) {
      return (<FileDropZone onFileDrop={onFileDrop}/>)
    } else {
      const file = filesToProcess[0]
      const [imageSource, setImageSource] = useState('')
      const reader = new FileReader()
      const titleRef = useRef()
      reader.readAsDataURL(file)
      reader.onload = () => {
        const image = new Image()
        image.src = reader.result
        image.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = 64
          canvas.height = 64
          canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height)
          setImageSource(canvas.toDataURL('image/jpeg', 0.5))
        }
      }
      reader.onError = error => console.log(error)
      function endUpload() {
        console.log(filesToProcess)
        setFiles(filesToProcess.slice(1, filesToProcess.length + 1))
        console.log(filesToProcess)
      }

      function upload() {
        createAsset(titleRef.current.value, imageSource, reader.result)
        updateAssets()
        endUpload()
      }

      return (
        <Card>
          <Card.Header><Text h2>Add file</Text></Card.Header>
          <Card.Body>
            <Input aria-label="title"
              bordered fullWidth ref={titleRef}
              color="secondary" size="lg" placeholder="Title"/>
            <Spacer y={1} />
            <Text h3>Preview:</Text>
            <NextImage src={imageSource} width={256} height={256} css={{scale: 4}}/>
          </Card.Body>
          <Card.Footer style={{display: "flex", justifyContent: "space-between"}}>
              <Button size="sm" light color="error" onPress={endUpload}>Cancel Upload</Button>
              <Button size="sm" color="primary" onPress={upload}>Upload Image</Button>
          </Card.Footer>
        </Card>)
    }
  }

  return (
    <>
      <Navigation pages={adminPages} />
      <Grid.Container gap={2} justify="center">
        <Grid md>
          <File/>
        </Grid>
        {assets.map((asset) => (
            <Grid md id={"ASSET-"+asset.id}>
              <Card>
                <Card.Header><Text h3>{asset.name}</Text></Card.Header>
                <Card.Body>
                  <NextImage src={asset.preview} width={128} height={128} css={{scale: 2}}/>
                </Card.Body>
              </Card>
            </Grid>))}
      </Grid.Container>
    </>)
}
