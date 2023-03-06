import {useGlobalContext} from '@/context'
import { Container, Text, Card, Button, Modal, Input } from '@nextui-org/react';
import Head from 'next/head'
import { PaperPlus } from 'react-iconly'
import { useEffect, useState, useRef } from 'react'
import { updateUserData, createArticle } from '@/api'

function getNextName(title, directory) {
  const remainder = title.substring(directory.length)
  const parts = remainder.split('/')
  return parts[0]? parts[0] : parts[1]
}

function CustomInput({value, setValue, placeholder}) {
  return (
    <Input value={value} onChange={e => {setValue(e.target.value)}} aria-label={placeholder} placeholder={placeholder}/>
  )
}

export default function Pages() {
  const {context, setContext} = useGlobalContext()
  const [modalOpen, setModalOpen] = useState(false)
  const [newName, setNewName] = useState('')
  const [error, setError] = useState('')
  
  function createPage(directory) {
    setNewName(directory)
    setModalOpen(true)
  }

  function finishCreatePage() {
    if (newName[newName.length-1] == '/') {
      return setError("Please don't end a page name with a \"/\"")
    }
    if (context.resources.find(resource => resource.name == newName)) {
      return setError("A resource with that name already exists...")
    }
    createArticle(context, newName, `preview for ${newName}`, '<Content>').then(() => {
      updateUserData(context, setContext).then(() => setModalOpen(false))
    })
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
        <Modal.Body>
          <Text>New page path:</Text>
          <CustomInput value={newName} setValue={newName => {if (newName) {setNewName(newName)}}} placeholder="/"/>
          <Text color="error">{error}</Text>
        </Modal.Body>
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
