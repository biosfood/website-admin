import {
  Card, Spacer, Button,
  Text, Input, Row, Container, FormElement
} from '@nextui-org/react'
import Head from 'next/head'
import { useState, useRef } from 'react'
import { login as doLogin } from '@/api'
import { useRouter } from "next/router";
import {useGlobalContext} from '@/context'
import { Client } from "react-hydration-provider";

export default function Login() {
  const router = useRouter()
  const [errorMessage, setErrorMessage] = useState('');
  const {context, setContext} = useGlobalContext()
  const email = useRef<FormElement>(null)
  const password = useRef<FormElement>(null)

  async function login(e: {preventDefault: () => any}) {
    e.preventDefault()
    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email.current!.value)) {
      setErrorMessage("please enter a valid email")
      return
    }
    if (!password.current!.value) {
      setErrorMessage("please enter a password")
      return
    }
    setErrorMessage("Loading...")
    doLogin(context, setContext, email.current!.value, password.current!.value).then(response => {
      if (!response.data.login) {
        setErrorMessage("access denied")
        return
      }
      setErrorMessage(`Success, redirecting to ${router.query['redirect'] || '/admin'}...`)
      router.push(router.query['redirect'] as string || '/admin')
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
          <Client>
            <form onSubmit={login}>
              <Input aria-label="email"
                bordered fullWidth
                color="primary" size="lg" placeholder="Email"
                ref={email}
              />
              <Spacer y={1} />
              <Input aria-label="password" bordered fullWidth 
                type="password" color="primary" size="lg" placeholder="Password"
                ref={password}
              />
              <Spacer y={1} />
              <Text color="error">{errorMessage}</Text>
              <Spacer y={1} />
              <Button type="submit" css={{width: '100%'}}>Log in</Button>
            </form>
          </Client>
        </Card>
      </Container>
    </>
  );
}
