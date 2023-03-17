import { Navbar, Dropdown, Avatar, Text, Button } from '@nextui-org/react'
import { useGlobalContext } from '@/context'
import { useState, useRef } from 'react'
import { logout } from '@/api'
import { useRouter } from "next/router";
import Link from 'next/link'
import {Logo} from '@/logo'

export function Navigation({pages, enforceLogin, setUserState}) {
  const {context, setContext} = useGlobalContext()
  const router = useRouter()

  function CustomLink({ target, children}) {
    const linkRef = useRef()

    return <>
      <Link ref={linkRef} href={target} />
      <Navbar.Link isActive={router.pathname == target} onPress={() => linkRef.current.click()}>{children}</Navbar.Link>
    </>
  }

  function onAction(key) {
    if (key == 'settings') {
      router.push("/admin/settings")
    }
  }

  return (
    <Navbar variant="floating" isBordered>
      <Navbar.Brand>
        <Logo/>
      </Navbar.Brand>
      <Navbar.Content variant="highlight-rounded">
        {pages.map((page) => 
        <CustomLink target={page.target} key={page.target}>
          {page.name}
        </CustomLink>)}
      </Navbar.Content>
      <Navbar.Content css={{jc: "flex-end"}}>
        {context.username ? (
        <Dropdown placement="bottom-right">
          <Navbar.Item>
            <Dropdown.Trigger>
              <Avatar bordered as="button" color="secondary" size="md" text={context.username} src={context.profilePicture?.preview}/>
            </Dropdown.Trigger>
          </Navbar.Item>
          <Dropdown.Menu aria-label="User menu actions" onAction={onAction}>
            <Dropdown.Item key="profile">
              Signed in as {context.username}
            </Dropdown.Item>
            <Dropdown.Item key="settings" withDivider>
                Settings
            </Dropdown.Item>
            <Dropdown.Item key="logout" withDivider>
              <Button flat color="error" onPress={() => logout({context, setContext})}>Log Out</Button>
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>) : (
          <Navbar.Link color="secondary" href="/login" aria-label="Log in">Log in</Navbar.Link>
        )}
      </Navbar.Content>
    </Navbar>
  )
}
