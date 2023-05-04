import { Navigation } from '@/navigation'
import { Grid, Card, Row, Button, Text, Image as NextImage, Input, Spacer } from '@nextui-org/react';
import { loadAssets, createAsset, deleteResource, updateUserData } from '@/api'
import { useEffect, useState, useRef } from 'react';
import { FileDropZone } from '@/fileDropZone'
import { Delete } from 'react-iconly'
import {useGlobalContext} from '@/context'
import Head from 'next/head'

export default function Assets() {
  const {context, setContext} = useGlobalContext()
  
  const [filesToProcess, setFiles] = useState(new Array())
  function onFileDrop(file) {
    setFiles([...filesToProcess, file])
  }

  function File() {
    const [imageSource, setImageSource] = useState('')
    const titleRef = useRef()
    if (!filesToProcess.length) {
      return (<FileDropZone onFileDrop={onFileDrop}/>)
    } else {
      const file = filesToProcess[0]
      const reader = new FileReader()
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
      function endUpload() {
        setFiles(filesToProcess.slice(1, filesToProcess.length + 1))
      }

      function upload() {
        createAsset(context, titleRef.current.value, imageSource, reader.result).then(() => {
          updateUserData(context, setContext)
          endUpload()
        })
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
      <Head>
        <title>Assets</title>
      </Head>
      <Grid.Container gap={2} justify="center">
        <Grid md id={"FILE"}>
          <File style={{width: '100%'}}/>
        </Grid>
        {context.resources.filter(resource => resource.resourceType == 'image').map((asset) => (
            <Grid md key={"ASSET-"+asset.id} style={{width: '100%'}}>
              <Card>
                <Card.Header style={{display: 'flex', justifyContent: 'space-between'}}>
                  <Text h3>{asset.name}</Text>
                  <Button auto color="error" icon={<Delete />} onPress={() => {
                    deleteResource(context, asset.id).then(() => updateUserData(context, setContext))
                  }}/>
                </Card.Header>
                <Card.Body>
                  <NextImage src={asset.preview} width={128} height={128} css={{scale: 2}}/>
                </Card.Body>
              </Card>
            </Grid>))}
      </Grid.Container>
    </>)
}
