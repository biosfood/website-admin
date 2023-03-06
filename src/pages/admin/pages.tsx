import {useGlobalContext} from '@/context'
import { Container, Text, Card, Button, Modal } from '@nextui-org/react';
import Head from 'next/head'
import { PaperPlus } from 'react-iconly'
import { useEffect, useState, useRef } from 'react';

function getNextName(title, directory) {
  const remainder = title.substring(directory.length)
  const parts = remainder.split('/')
  return parts[0]? parts[0] : parts[1]
}


export default function Pages() {
  const {context, setContext} = useGlobalContext()
  const [modalOpen, setModalOpen] = useState(false)
  
  function createPage(directory) {
    setModalOpen(true)
  }

  function finishCreatePage() {
    setModalOpen(false)
  }

  function Page({pageDirectory}) {
    const children = [...new Set(context.resources.filter(resource => resource.name.startsWith(pageDirectory) && resource.name.length > pageDirectory.length)
                               .map(resource => getNextName(resource.name, pageDirectory)))]
    const page = context.resources.find(resource => resource.name == pageDirectory)
    return (
    <Card>
      <Card.Header><Text h2>{pageDirectory}</Text></Card.Header>
      <Card.Body>
        {page?.preview}
        <Container style={{display: 'flex', justifyContent: 'space-around'}}>
          <Button auto color="success" icon={(<PaperPlus/>)} onPress={() => createPage(pageDirectory)}/>
        </Container>
        {children.map(child => (<Page pageDirectory={pageDirectory + (pageDirectory == '/' ? '' : '/') + child}/>))}
      </Card.Body>
    </Card>)
  }


  return (
    <Container style={{marginBottom: '10px'}}>
      <Modal closeButton blur open={modalOpen} onClose={() => setModalOpen(false)}>
        <Modal.Header>
          <Text h3>Create a new page</Text>
        </Modal.Header>
        <Modal.Footer style={{display: "flex", justifyContent: "space-between"}}>
          <Button color="error" auto onPress={() => setModalOpen(false)}>Cancel</Button>
          <Button color="primary" auto onPress={finishCreatePage}>Create Page</Button>
        </Modal.Footer>
      </Modal>
      <Head>
        <title>Pages</title>
      </Head>
      <Text h1>Pages overview</Text>
      <Page pageDirectory='/' />
    </Container>
  )
}
