import {
  Card, Spacer, Button,
  Text, Input, Row, Container,
} from '@nextui-org/react'
import Head from 'next/head'
import validate from 'node-email-validator'
import { useState } from 'react'
import { login as doLogin } from '@/api'


export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  async function login() {
    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
      setErrorMessage("please enter a valid email")
      return
    }
    if (!password) {
      setErrorMessage("please enter a password")
      return
    }
    setErrorMessage("Loading...")
    doLogin(email, password).then(response => {
      if (!response.data.login) {
        setErrorMessage("access denied")
        return
      }
      setErrorMessage("Success!")
    })
  }

  return (
    <>
      <Head>
        <title>Log In</title>
      </Head>
      <Container
        display="flex"
        alignItems="center"
        justify="center"
        css={{ minHeight: '90vh', padding: '0' }}
      >
        <Card css={{ mw: '420px', p: '20px' }}>
          <Text
            size={24}
            weight="bold"
            css={{
              as: 'center',
              mb: '20px',
            }}
          >
            Eisenhauer Backend Login
          </Text>
            <Input aria-label="email"
              bordered fullWidth
              color="primary" size="lg" placeholder="Email"
              onChange={e => setEmail(e.currentTarget.value)}
            />
            <Spacer y={1} />
          <Input aria-label="password" bordered fullWidth 
            type="password" color="primary" size="lg" placeholder="Password"
              onChange={e => setPassword(e.currentTarget.value)}
            />
            <Text color="error">{errorMessage}</Text>
            <Button onPress={e => login()}>Log in</Button>
        </Card>
      </Container>
    </>
  );
}
