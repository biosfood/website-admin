import { Grid, Card, Row, Button, Text, Image as NextImage, Input, Spacer, FormElement, Modal, Container } from '@nextui-org/react';
import { createAsset, deleteResource, updateUserData, retrieveAsset } from '@/api'
import { useState, useRef } from 'react';
import { Delete, Show } from 'react-iconly'
import {useGlobalContext} from '@/context'
import Head from 'next/head'
import { Client } from "react-hydration-provider";
import { FileDropZone } from '@/components'
import { Resource } from '@/types'

function ViewModal() {
  const [modalOpen, setModalOpen] = useState(false)
  const [src, setSrc] = useState('')
  const [resource, setResource] = useState<Resource | null>(null)

  function show(resource: Resource) {
    setResource(resource)
    setModalOpen(true)
    retrieveAsset(resource.id).then((data: {content: string}) => setSrc(data.content))
  }

  const modal = <Modal closeButton blur open={modalOpen}
    onClose={() => {setModalOpen(false); setResource(null); setSrc('')}}>
      <Modal.Header><Text h2>{resource?.name}</Text></Modal.Header>
      <Modal.Body>
        <NextImage src={src}/>
      </Modal.Body>
    </Modal>
  return {modal, show}
}

export default function Assets() {
  const {context, setContext} = useGlobalContext()
  const {modal, show} = ViewModal()
  
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
    const titleRef = useRef<FormElement>(null)
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
            <Client>
              <Input aria-label="title"
                bordered fullWidth ref={titleRef}
                color="secondary" size="lg" placeholder="Title"/>
            </Client>
            <Spacer y={1} />
            <Text h3>Preview:</Text>
            <NextImage src={imageSource} width={256} height={256} css={{scale: 4}}/>
          </Card.Body>
          <Card.Footer style={{display: "flex", justifyContent: "space-between"}}>
            <Button size="sm" light color="error" onPress={endUpload}>Cancel Upload</Button>
            <Button size="sm" color="primary"
              onPress={() => upload(titleRef!.current!.value, imageSource, reader.result! as string)}>
                Upload Image
            </Button>
          </Card.Footer>
        </Card>)
    }
  }

  return (
    <>
      <Head>
        <title>Images</title>
      </Head>
      {modal}
      <Grid.Container gap={2} justify="center">
        <Grid md id={"FILE"}>
          <File style={{width: '100%'}}/>
        </Grid>
        {context.resources.filter((resource: Resource) => resource.resourceType == 'image').map((resource: Resource) => (
            <Grid sm key={resource.id} style={{minWidth: "20em"}}>
              <Card>
                <Card.Header style={{display: 'flex', justifyContent: 'space-between'}}>
                  <Text h3>{resource.name}</Text>
                  <div style={{display: "flex", flexDirection: "row", gap: '1em'}}>
                    <Button auto color="success" icon={<Show />} onPress={() => show(resource)}/>
                    <Button auto color="error" icon={<Delete />} onPress={() => {
                      deleteResource(context, resource.id).then(() => updateUserData(context, setContext))
                    }}/>
                  </div>
                </Card.Header>
                <Card.Body>
                  <NextImage src={resource.preview} width={128} height={128} css={{scale: 2}}/>
                </Card.Body>
              </Card>
            </Grid>))}
      </Grid.Container>
    </>)
}
