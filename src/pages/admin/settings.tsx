import { useGlobalContext } from '@/context'
import { Card, Text, Container, Spacer, Button, Input, FormElement, Grid } from '@nextui-org/react'
import { AssetPicker } from '@/components'
import {setProfilePicture, login, changePassword as doChangePassword, changeEmail as doChangeEmail, changeHost as doChangeHost } from '@/api'
import { useEffect, useState, useRef } from 'react';
import Head from 'next/head'
import { Client } from "react-hydration-provider"
import { ContextState, Resource } from '@/types'

function PasswordChange({context, setContext}: ContextState) {
  const [errorMessage, setErrorMessage] = useState('')
  const oldPassword = useRef<FormElement>(null)
  const password = useRef<FormElement>(null)
  const repeatPassword = useRef<FormElement>(null)

  function cancel() {
    oldPassword.current!.value = ''
    password.current!.value = ''
    repeatPassword.current!.value = ''
    setErrorMessage('')
  }

  function changePassword() {
    if (!oldPassword.current!.value) {
      setErrorMessage('please enter your current password')
      return
    }
    if (!password.current!.value) {
      setErrorMessage('please enter a new password')
      return
    }
    if (password.current!.value != repeatPassword.current!.value) {
      setErrorMessage('please enter your new password twice, exactly the same way')
      return
    }
    const newPassword = password.current!.value
    login(context, setContext, context.useremail, oldPassword.current!.value, false).then(response => {
      if (!response.data.login) {
        setErrorMessage('you entered the wrong current password')
        return
      }
      doChangePassword({...context, token: response.data.login}, newPassword).then(success => {
        if (success) {
          cancel()
          setErrorMessage('password change was successful')
          return
        }
        setErrorMessage('something went wrong while changing your password')
        return
      })
    })
  }
  const widthCss = {minWidth: '20em', width: '100%'}

  return (
    <>
    <Head>
      <title>Settings</title>
    </Head>
    <Card>
      <Card.Header><Text h2>Change password</Text></Card.Header>
      <Card.Body>
        <Grid.Container gap={1}>
          <Grid xs css={widthCss}>
            <Input ref={oldPassword} aria-label="current password" bordered type="password" color="primary" size="xl"
              placeholder="Current password" clearable css={widthCss}/>
          </Grid>
          <Grid xs css={widthCss}>
            <Input ref={password} aria-label="new password" bordered type="password" color="primary" size="xl"
              placeholder="New password" clearable css={widthCss}/>
            </Grid>
          <Grid xs css={widthCss}>
          <Input ref={repeatPassword} aria-label="repeat new password" bordered type="password" color="primary" size="xl"
            placeholder="Repeat new password" clearable css={widthCss}/>
          </Grid>
        </Grid.Container>
        <Spacer y={1}/>
        <Text color="error">{errorMessage}</Text>
      </Card.Body>
      <Card.Footer style={{display: "flex", justifyContent: "space-around"}}>
        <Button light color="error" onPress={cancel}>Cancel</Button>
        <Button color="primary" onPress={changePassword}>Change Password</Button>
      </Card.Footer>
    </Card>
    </>
  )
}

function EmailChange({context, setContext}: ContextState) {
  const inputRef = useRef<FormElement>(null)
  const [errorMessage, setErrorMessage] = useState('')

  function cancel() {
    inputRef.current!.value = ''
  }

  function changeEmail() {
    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(inputRef.current!.value)) {
      setErrorMessage('please enter a vaild email address')
      return
    }
    doChangeEmail(context, inputRef.current!.value).then(success => {
      if (success) {
        cancel()
        setErrorMessage('email change was successful')
        return
      }
      setErrorMessage('something went wrong while changing your email')
      return
    })
  }

  return (
    <Card>
      <Card.Header><Text h2>Change E-mail, current address: {context.useremail}</Text></Card.Header>
      <Card.Body>
        <Input ref={inputRef} aria-label="new email address" bordered type="email" color="primary" size="xl"
          placeholder="new email address" clearable/>
        <Spacer y={1}/>
        <Text color="error">{errorMessage}</Text>
      </Card.Body>
      <Card.Footer style={{display: "flex", justifyContent: "space-around"}}>
        <Button light color="error" onPress={cancel}>Cancel</Button>
        <Button color="primary" onPress={changeEmail}>Change E-mail</Button>
      </Card.Footer>
    </Card>
  )
}

function HostChange({context, setContext}: ContextState) {
  const inputRef = useRef<FormElement>(null)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {inputRef.current!.value = context.hostname}, [context.hostname])

  function cancel() {
    inputRef.current!.value = context.hostname
  }

  function changeHost() {
    doChangeHost(context, inputRef.current!.value).then(success => {
      if (success) {
        setErrorMessage('hostname change was successful')
        return
      }
      setErrorMessage('something went wrong while changing your hostname')
      return
    })
  }

  return (
    <Card>
      <Card.Header><Text h2>Change hostname</Text></Card.Header>
      <Card.Body>
        <Input ref={inputRef} aria-label="new hostname" bordered type="text" color="primary" size="xl"
          placeholder="new hostname" clearable/>
        <Spacer y={1}/>
        <Text color="error">{errorMessage}</Text>
      </Card.Body>
      <Card.Footer style={{display: "flex", justifyContent: "space-around"}}>
        <Button light color="error" onPress={cancel}>Cancel</Button>
        <Button color="primary" onPress={changeHost}>Change Hostname</Button>
      </Card.Footer>
    </Card>
  )
}

export default function Settings() {
  const { context, setContext} = useGlobalContext();

  return (
  <Client>
    <Container>
      <Text h1>Settings</Text>
      <Grid sm css={{width: '100%'}}>
        <HostChange context={context} setContext={setContext}/>
      </Grid>
      <Grid.Container gap={1}>
        <Grid sm css={{width: '100%'}}>
          <EmailChange context={context} setContext={setContext}/>
        </Grid>
        <Grid sm css={{width: '100%'}}>
          <PasswordChange context={context} setContext={setContext}/>
        </Grid>
        <Grid sm css={{width: '100%'}}>
        <Card>
            <Card.Header><Text h2>Profile picture</Text></Card.Header>
            <Card.Body><AssetPicker selection={context.profilePicture} 
              onPick={(resource?: Resource) => setProfilePicture(context, setContext, resource)} noselect="no profile picture"/>
            </Card.Body>
          </Card>
        </Grid>
      </Grid.Container>
    </Container>
  </Client>
  )
}
