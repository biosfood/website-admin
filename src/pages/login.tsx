import {
  Card, Spacer, Button,
  Text, Input, Row, Container,
} from '@nextui-org/react'
import Head from 'next/head'
import validate from 'node-email-validator'
import { useState } from 'react'
import { login as doLogin } from '@/api'
import { useRouter } from "next/router";
import {useGlobalContext} from '@/context'

export default function Login() {
  const router = useRouter()
  const [errorMessage, setErrorMessage] = useState('');
  const {context, setContext} = useGlobalContext()

  async function login(e) {
    e.preventDefault()
    const email = document.querySelector("#emailInput").value
    const password = document.querySelector("#passwordInput").value
    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
      setErrorMessage("please enter a valid email")
      return
    }
    if (!password) {
      setErrorMessage("please enter a password")
      return
    }
    setErrorMessage("Loading...")
    doLogin(context, setContext, email, password).then(response => {
      if (!response.data.login) {
        setErrorMessage("access denied")
        return
      }
      setErrorMessage("Success, redirecting...")
      router.push("/admin/")
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
          <form onSubmit={login}>
            <Input aria-label="email"
              bordered fullWidth
              color="primary" size="lg" placeholder="Email"
              id="emailInput"
            />
            <Spacer y={1} />
            <Input aria-label="password" bordered fullWidth 
              type="password" color="primary" size="lg" placeholder="Password"
              id="passwordInput"
            />
            <Spacer y={1} />
            <Text color="error">{errorMessage}</Text>
            <Spacer y={1} />
            <Button type="submit" css={{width: '100%'}}>Log in</Button>
        </form>
        </Card>
      </Container>
    </>
  );
}
