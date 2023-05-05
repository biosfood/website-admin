import { Navigation } from '@/navigation'
import { Grid, Card, Row, Button, Text, Image as NextImage, Input, Spacer, FormElement } from '@nextui-org/react';
import { createAsset, deleteResource, updateUserData } from '@/api'
import { useEffect, useState, createRef } from 'react';
import { FileDropZone } from '@/fileDropZone'
import { Delete } from 'react-iconly'
import {useGlobalContext} from '@/context'
import Head from 'next/head'

export default function Assets() {
  const {context, setContext} = useGlobalContext()
  
  const [filesToProcess, setFiles] = useState(new Array<File>())
  function onFileDrop(file: File) {
    setFiles([...filesToProcess, file])
  }


  function endUpload() {
    setFiles(filesToProcess.slice(1, filesToProcess.length + 1))
  }

  function upload(title: string, imageSource: string, readerResult: string) {
    createAsset(context, title, imageSource, readerResult).then(() => {
      updateUserData(context, setContext)
      endUpload()
    })
  }


  function File({style}: {style?: object}) {
    const [imageSource, setImageSource] = useState('')
    const titleRef = createRef<FormElement>()
    if (!filesToProcess.length) {
      return (<FileDropZone onFileDrop={onFileDrop} style={style}/>)
    } else {
      const file = filesToProcess[0]
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => {
        const image = new Image()
        image.src = reader.result! as string
        image.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = 64
          canvas.height = 64
          canvas.getContext('2d')?.drawImage(image, 0, 0, canvas.width, canvas.height)
          setImageSource(canvas.toDataURL('image/jpeg', 0.5))
        }
      }
      return (
        <Card style={style}>
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
            <Button size="sm" color="primary"
              onPress={() => upload(titleRef.current!.value, imageSource, reader.result! as string)}>
                Upload Image
            </Button>
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
