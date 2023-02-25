import {useGlobalContext} from '@/context'
import { Card, Text, Container, Spacer, Button, Input} from '@nextui-org/react'
import {AssetPicker} from '@/assetPicker'
import {setProfilePicture, login, changePassword as doChangePassword, changeEmail as doChangeEmail} from '@/api'
import { useEffect, useState, useRef } from 'react';

function PasswordChange({context, setContext}) {
  const [errorMessage, setErrorMessage] = useState('')
  const oldPassword = useRef()
  const password = useRef()
  const repeatPassword = useRef()

  function cancel() {
    oldPassword.current.value = ''
    password.current.value = ''
    repeatPassword.current.value = ''
    setErrorMessage('')
  }

  function changePassword() {
    if (!oldPassword.current.value) {
      setErrorMessage('please enter your current password')
      return
    }
    if (!password.current.value) {
      setErrorMessage('please enter a new password')
      return
    }
    if (password.current.value != repeatPassword.current.value) {
      setErrorMessage('please enter your new password twice, exactly the same way')
      return
    }
    const newPassword = password.current.value
    login(context, setContext, context.useremail, oldPassword.current.value, false).then(response => {
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

  return (
    <Card>
      <Card.Header><Text h2>Change password</Text></Card.Header>
      <Card.Body>
        <Container style={{display: "flex", justifyContent: "space-around"}}>
          <Input ref={oldPassword} aria-label="current password" bordered type="password" color="primary" size="xl"
            placeholder="Current password" clearable/>
          <Input ref={password} aria-label="new password" bordered type="password" color="primary" size="xl"
            placeholder="New password" clearable/>
          <Input ref={repeatPassword} aria-label="repeat new password" bordered type="password" color="primary" size="xl"
            placeholder="Repeat new password" clearable/>
        </Container>
        <Spacer y={1}/>
        <Text color="error">{errorMessage}</Text>
      </Card.Body>
      <Card.Footer style={{display: "flex", justifyContent: "space-around"}}>
        <Button light color="error" onPress={cancel}>Cancel</Button>
        <Button color="primary" onPress={changePassword}>Change Password</Button>
      </Card.Footer>
    </Card>
  )
}

function EmailChange({context, setContext}) {
  const inputRef = useRef()
  const [errorMessage, setErrorMessage] = useState('')

  function cancel() {
    inputRef.current.value = ''
  }

  function changeEmail() {
    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(inputRef.current.value)) {
      setErrorMessage('please enter a vaild email address')
      return
    }
    doChangeEmail(context, inputRef.current.value).then(success => {
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

export default function Settings() {
  const { context, setContext} = useGlobalContext();

  return (
    <Container>
      <Text h1>Settings</Text>
      <EmailChange context={context} setContext={setContext}/>
      <Spacer y={1}/>
      <PasswordChange context={context} setContext={setContext}/>
      <Spacer y={1}/>
      <Card>
        <Card.Header><Text h2>Profile picture</Text></Card.Header>
        <Card.Body><AssetPicker selection={context.profilePicture} 
          onPick={asset => setProfilePicture(context, setContext, asset)}/>
        </Card.Body>
      </Card>
      <Spacer y={1}/>
    </Container>
  )
}
