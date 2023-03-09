import {useGlobalContext} from '@/context'
import { Container, Text, Card, Button, Modal, Input } from '@nextui-org/react';
import Head from 'next/head'
import { PaperPlus, Delete, Edit } from 'react-iconly'
import { useEffect, useState, useRef } from 'react'
import { updateUserData, createArticle, deleteResource } from '@/api'

function getNextName(title, directory) {
  const remainder = title.substring(directory.length)
  const parts = remainder.split('/')
  return parts[0]? parts[0] : parts[1]
}

function createPageTemplate(context, setContext) {
  const [modalOpen, setModalOpen] = useState(false)
  const [startNewName, setStartNewName] = useState('')
  const [error, setError] = useState('')
  const newName = useRef()

  const modal = (
    <Modal closeButton blur open={modalOpen} onClose={() => setModalOpen(false)}
      onOpen={() => setTimeout(() => newName.current.value = startNewName,  0)}>
      <Modal.Header>
        <Text h3>Create a new page</Text>
      </Modal.Header>
      <Modal.Body>
        <Text>New page path:</Text>
        <Input ref={newName} aria-label="new page name" placeholder="new page name"/>
        <Text color="error">{error}</Text>
      </Modal.Body>
      <Modal.Footer style={{display: "flex", justifyContent: "space-between"}}>
        <Button color="error" auto onPress={() => setModalOpen(false)}>Cancel</Button>
        <Button color="primary" auto onPress={finishCreatePage}>Create Page</Button>
      </Modal.Footer>
    </Modal>
  )

  function createPage(directory) {
    setStartNewName(directory)
    setModalOpen(true)
  }
  
  function finishCreatePage() {
    const filename = newName.current.value
    if (!filename) {
      return setError("Please enter a path for your new page")
    }
    if (filename[0] != '/') {
      return setError("Please have your path start with a \"/\"")
    }
    if (filename[newName.length-1] == '/') {
      return setError("Please don't end a page name with a \"/\"")
    }
    if (context.resources.find(resource => resource.name == filename)) {
      return setError("A resource with that name already exists...")
    }
    createArticle(context, filename, `preview for ${filename}`, '<Content>').then(() => {
      updateUserData(context, setContext).then(() => setModalOpen(false))
    })
  }

  return [modal, createPage]
}


function editPageTemplate(context, setContext) {
  const [modalOpen, setModalOpen] = useState(false)
  const [error, setError] = useState('')
  const [pageToEdit, setPageToEdit] = useState({})

  const modal = (
    <Modal closeButton blur open={modalOpen} onClose={() => setModalOpen(false)}
      onOpen={() => setTimeout(() => {}, 0)}>
      <Modal.Header>
        <Text h3>Edit page</Text>
      </Modal.Header>
      <Modal.Body>
        <Text>Title:</Text>
        <Text color="error">{error}</Text>
      </Modal.Body>
      <Modal.Footer style={{display: "flex", justifyContent: "space-between"}}>
        <Button color="error" auto onPress={() => setModalOpen(false)}>Cancel</Button>
        <Button color="primary" auto onPress={finishEditPage}>Create Page</Button>
      </Modal.Footer>
    </Modal>
  )

  function editPage(page) {
    setPageToEdit(page)
    setModalOpen(true)
  }
  
  function finishEditPage() {
  }

  return [modal, editPage]
}

function Page({pageDirectory, context, setContext, createPage, editPage}) {
  const children = [...new Set(context.resources.filter(resource => resource.name.startsWith(pageDirectory) && resource.name.length > pageDirectory.length)
                             .map(resource => getNextName(resource.name, pageDirectory)))]
  const page = context.resources.find(resource => resource.name == pageDirectory)
  return (
    <Card>
      <Card.Header style={{display: "flex", justifyContent: "space-between"}}>
        <Text h2>{pageDirectory}</Text>
        {page ? <div style={{display: "flex", flexDirection: "horizontal", gap: '1em'}}>
          <Button auto color="error" icon={<Delete />} onPress={() => {
            deleteResource(context, page.id).then(() => updateUserData(context, setContext))}}/>
          <Button auto color="primary" icon={<Edit />} onPress={() => editPage(context, page)}/>
        </div>: null}
      </Card.Header>
      <Card.Body>
        {page?.preview}
        <Container style={{display: 'flex', justifyContent: 'space-around'}}>
          <Button auto color="success" icon={(<PaperPlus/>)} onPress={() => createPage(pageDirectory)}/>
        </Container>
        {children.map(child => (<Page pageDirectory={pageDirectory + (pageDirectory == '/' ? '' : '/') + child}
          context={context} setContext={setContext} createPage={createPage} editPage={editPage}/>))}
      </Card.Body>
    </Card>
  )
}


export default function Pages() {
  const {context, setContext} = useGlobalContext()
  const [newPageModal, createPage] = createPageTemplate(context, setContext)
  const [editPageModal, editPage] = editPageTemplate(context, setContext)

  return (
    <Container style={{marginBottom: '10px'}}>
      {newPageModal}
      {editPageModal}
      <Head>
        <title>Pages</title>
      </Head>
      <Text h1>Pages overview</Text>
      <Page pageDirectory='/' context={context} setContext={setContext} createPage={createPage} editPage={editPage}/>
    </Container>
  )
}
