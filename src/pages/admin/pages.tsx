import {useGlobalContext} from '@/context'
import { Container, Text, Card } from '@nextui-org/react';
import Head from 'next/head'

function Page({allPages, pageDirectory}) {
  const children = allPages.filter(resource => resource.title.startsWith(pageDirectory))
  return (
  <Card>
    <Card.Header><Text h2>{pageDirectory}</Text></Card.Header>
    <Card.Body>
      content: todo
    </Card.Body>
  </Card>)
}

export default function Pages() {
  const {context, setContext} = useGlobalContext()

  return (
    <Container>
      <Head>
        <title>Pages</title>
      </Head>
      <Text h1>Pages overview</Text>
      <Page allPages={context.resources.filter(resource => resource.resourceType == 'article')} pageDirectory='/' />
    </Container>
  )
}
