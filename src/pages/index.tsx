import Head from 'next/head'
import Image from 'next/image'
import { Container, Card, Text } from '@nextui-org/react'

export default function Home() {
  return (
    <>
      <Head>
        <title>Admin Panel</title>
      </Head>
      <Container>
        <Text h1>Welcome to the Eisenhauer Backend!</Text>
        <Text>This is where I edit all my websites from. You will need an account to access all the good stuff though.</Text>
      </Container>
    </>
  )
}
