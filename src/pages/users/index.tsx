import Head from 'next/head'
import { Text, Card, Container, Grid, Avatar, Row } from '@nextui-org/react'
import { findUsersServerside, User } from '@/api'
import { useState, useEffect } from 'react'
import { useRouter } from "next/router";

export default function Home({users}: {users: User[]}) {
  const router = useRouter()

  return (
    <>
      <Head>
        <title>Users</title>
      </Head>
      <Container fluid>
        <Text h1>Users</Text>
        <Grid.Container gap={2} justify="center">
          {users.map((user: User) => (<Grid sm justify="center" alignContent="stretch" alignItems="stretch" css={{width: '100%'}} key={user.name}>
            <Card isPressable onPress={() => router.push(`/users/${user.name}`)}>
              <Card.Body>
                <Row css={{alignItems: 'center'}}>
                  <Avatar bordered color="primary" size="xl" text={user.name} src={user.profilePicture?.preview}/>
                  <Text h3 css={{margin: '15px'}}>{user.name}</Text>
                </Row>
              </Card.Body>
            </Card>
          </Grid>))}
        </Grid.Container>
      </Container>
    </>
  )
}

export async function getServerSideProps() {
  const users = await findUsersServerside()
  return { props: { users }}
}
