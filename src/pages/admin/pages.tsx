import { useGlobalContext } from '@/context'
import { Container, Text, Card, Button, Modal, Input, Textarea, Navbar, Spacer, Dropdown, FormElement } from '@nextui-org/react';
import Head from 'next/head'
import { PaperPlus, Delete, Edit, Image2, Send, Show } from 'react-iconly'
import { useState, useRef } from 'react'
import { updateUserData, createArticle, deleteResource, retrieveAsset, updateResource } from '@/api'
import { AssetPicker, RenderPage } from '@/components'
import { Client } from "react-hydration-provider";
import { useRouter } from "next/router";
import { ContextState, Resource } from '@/types'

function getNextName(title: string, directory: string) {
  const remainder = title.substring(directory.length)
  const parts = remainder.split('/')
  return parts[0]? parts[0] : parts[1]
}

function CreatePageTemplate({context, setContext}: ContextState) {
  const [modalOpen, setModalOpen] = useState(false)
  const [startNewName, setStartNewName] = useState('')
  const [error, setError] = useState('')
  const newName = useRef<FormElement>(null)

  const modal = (
    <Modal closeButton blur open={modalOpen} onClose={() => setModalOpen(false)}
      onOpen={() => setTimeout(() => newName.current!.value = startNewName,  0)}>
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

  function createPage(directory: string) {
    setError('')
    setStartNewName(directory)
    setModalOpen(true)
  }
  
  function finishCreatePage() {
    const filename = newName.current!.value
    if (!filename) {
      return setError("Please enter a path for your new page")
    }
    if (context.resources.find((resource: Resource) => resource.name == filename)) {
      return setError("A resource with that name already exists...")
    }
    if (filename[0] != '/') {
      return setError("Please have your path start with a \"/\"")
    }
    if (filename.length > 1 && filename[filename.length-1] == '/') {
      return setError("Please don't end a page name with a \"/\"")
    }
    createArticle(context, filename, `preview for ${filename}`, '<Content>').then(() => {
      updateUserData(context, setContext).then(() => setModalOpen(false))
    })
  }

  return {createPageModal: modal, createPage}
}

function EditPageTemplate({context, setContext}: ContextState) {
  const [modalOpen, setModalOpen] = useState(false)
  const [error, setError] = useState('')
  const [pageToEdit, setPageToEdit] = useState<Resource | null>(null)
  // TODO: change title
  const preview = useRef<FormElement>(null)
  const content = useRef<HTMLTextAreaElement>(null)
  const [mode, setMode] = useState('edit')

  function insertText(text: (selected: string) => string) {
    const selectedText = content.current!.value.substring(content.current!.selectionStart!, content.current!.selectionEnd!)
    content.current!.focus()
    document.execCommand("insertText", false, text(selectedText))
    window.dispatchEvent(new Event('resize'));
  }

  function addImage(resource?: Resource) {
    if (!resource) {
      return
    }
    insertText((text: string) => `![${text}](/api/resource?id=${resource?.id})`)
  }

  function createHref(resource?: Resource) {
    if (!resource) {
      return "URL"
    }
    return resource.name
  }

  function finishEditPage() {
    updateResource(context, setContext, pageToEdit!.id, preview.current!.value, content.current!.value)
    .then(() =>setModalOpen(false))
  }

  const addLink = (resource?: Resource) => insertText((text: string) => 
    `[${text != "" ? text : (resource?.name || "HERE")}](${createHref(resource)})`)

  const modal = (
    <Modal closeButton blur open={modalOpen} onClose={() => setModalOpen(false)}
      onOpen={() => setTimeout(() => {}, 0)} fullScreen>
      <Modal.Header>
        <Navbar isCompact css={{$$navbarBackgroundColor: "transparent", $$navbarBlurBackgroundColor: "transparent"}}>
          <Navbar.Content>
            <Navbar.Link isActive={mode == "edit"} onPress={() => setMode('edit')}>Edit</Navbar.Link>
            <Navbar.Link isActive={mode == "view"} onPress={() => setMode('view')}>View</Navbar.Link>
          </Navbar.Content>
          {mode == "edit" && (
            <Navbar.Content>
              <Navbar.Item>
                <AssetPicker onPick={addImage} showDescription>
                  <Dropdown.Button auto icon={<Image2 />}/>
                </AssetPicker>
              </Navbar.Item>
              <Navbar.Item>
                <AssetPicker onPick={addLink} resourceType={"article"} noselect={"custom link URL"}>
                  <Dropdown.Button auto icon={<Send />}/>
                </AssetPicker>
              </Navbar.Item>
            </Navbar.Content>
          )}
        </Navbar>
      </Modal.Header>
      <Modal.Body>
        <div style={{display: mode=='edit' ? '' : 'none'}}>
          <Text>Preview:</Text>
          <Spacer y={0.5}/>
          <Input ref={preview} aria-label="page preview" placeholder="page preview" bordered width="100%"/>
          <Spacer y={0.5}/>
          <Text>Content:</Text>
          <Spacer y={0.5}/>
          <Textarea placeholder="content" ref={content} bordered width="100%" maxRows={100}/>
          <Spacer y={0.5}/>
          <Text color="error">{error}</Text>
        </div>
        <div style={{display: mode=='view' ? '' : 'none'}}>
          <RenderPage basePath={`/users/${context.username}`} onNavigate={finishEditPage}>{content.current?.value}</RenderPage>
        </div>
      </Modal.Body>
      <Modal.Footer style={{display: "flex", justifyContent: "space-between"}}>
        <Button color="error" auto onPress={() => setModalOpen(false)}>Cancel</Button>
        <Button color="primary" auto onPress={finishEditPage}>Save Changes</Button>
      </Modal.Footer>
    </Modal>
  )

  function editPage(page: Resource) {
    setPageToEdit(page)
    setModalOpen(true)
    setMode("edit")
    retrieveAsset(page.id).then((resource: {preview: string, content: string}) => {
      if (!resource) {
        return setModalOpen(false)
      }
      preview.current!.value = resource.preview!
      content.current!.value = resource.content!
      window.dispatchEvent(new Event('resize'));
    })
  }
  
  return {editPageModal: modal, editPage}
}

function Page({pageDirectory, context, setContext, createPage, editPage}:
              ContextState & {pageDirectory: string, createPage: (directory: string) => void, editPage: (page: Resource) => void}) {
  const children = Array.from(new Set(context.resources.filter((resource: Resource) => resource.name.startsWith(pageDirectory) && resource.name.length > pageDirectory.length)
                             .map((resource: Resource) => getNextName(resource.name, pageDirectory))))
  const page = context.resources.find((resource: Resource) => resource.name == pageDirectory)
  const router = useRouter()
  return (
    <Card variant="bordered" style={{marginTop: '1em', background: 
        (pageDirectory.slice(0, -1).match(/\//g)|| []).length % 2 ? "var(--nextui-colors-background)" : ""}}>
      <Card.Header style={{display: "flex", justifyContent: "space-between"}}>
        <Text h2>{pageDirectory}</Text>
        {page ? <div style={{display: "flex", flexDirection: "row", gap: '1em'}}>
          <Button auto color="success" icon={<Show />} onPress={() => router.push('/users/'+context.username+page.name)}/>
          <Button auto color="error" icon={<Delete />} onPress={() => {
            deleteResource(context, page.id).then(() => updateUserData(context, setContext))}}/>
          <Button auto color="primary" icon={<Edit />} onPress={() => editPage(page)}/>
        </div>: null}
      </Card.Header>
      <Card.Body>
        {page?.preview}
        <Container style={{display: 'flex', justifyContent: 'space-around'}}>
          <Button auto color="success" icon={(<PaperPlus/>)} onPress={() => createPage(pageDirectory)}/>
        </Container>
        {children.map(child => (<Page pageDirectory={pageDirectory + (pageDirectory == '/' ? '' : '/') + child}
          context={context} setContext={setContext} createPage={createPage} editPage={editPage} key={child}/>))}
      </Card.Body>
    </Card>
  )
}


export default function Pages() {
  const {context, setContext} = useGlobalContext()
  const {createPageModal, createPage} = CreatePageTemplate({context, setContext})
  const {editPageModal, editPage} = EditPageTemplate({context, setContext})

  return (
    <Container style={{marginBottom: '10px'}}>
      <>
        {createPageModal}
        {editPageModal}
        <Head>
          <title>Pages</title>
        </Head>
        <Text h1>Pages overview</Text>
        <Client>
          <Page pageDirectory='/' context={context} setContext={setContext} createPage={createPage} editPage={editPage}/>
        </Client>
      </>
    </Container>
  )
}
