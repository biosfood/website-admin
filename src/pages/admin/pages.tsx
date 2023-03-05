import {useGlobalContext} from '@/context'
import { Container, Text, Card } from '@nextui-org/react';
import Head from 'next/head'

function getNextName(title, directory) {
  const remainder = title.substring(directory.length)
  const parts = remainder.split('/')
  return parts[0]? parts[0] : parts[1]
}

function Page({context, pageDirectory}) {
  const children = [...new Set(context.resources.filter(resource => resource.name.startsWith(pageDirectory) && resource.name.length > pageDirectory.length)
                               .map(resource => getNextName(resource.name, pageDirectory)))]
  const page = context.resources.find(resource => resource.name == pageDirectory)
  return (
  <Card>
    <Card.Header><Text h2>{pageDirectory}</Text></Card.Header>
    <Card.Body>
      {page?.preview}
      {children.map(child => (<Page context={context} pageDirectory={pageDirectory + (pageDirectory == '/' ? '' : '/') + child}/>))}
    </Card.Body>
  </Card>)
}

export default function Pages() {
  const {context, setContext} = useGlobalContext()

  return (
    <Container style={{marginBottom: '10px'}}>
      <Head>
        <title>Pages</title>
      </Head>
      <Text h1>Pages overview</Text>
      <Page context={context} pageDirectory='/' />
    </Container>
  )
}
