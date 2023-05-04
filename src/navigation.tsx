import { Navbar, Dropdown, Avatar, Text, Button } from '@nextui-org/react'
import { useGlobalContext } from '@/context'
import { useState, useRef, useId } from 'react'
import { logout } from '@/api'
import { useRouter } from "next/router";
import Link from 'next/link'
import {Logo} from '@/logo'
import { Client } from "react-hydration-provider";

export function Navigation({pages, enforceLogin, setUserState}) {
  const {context, setContext} = useGlobalContext()
  const router = useRouter()

  function onAction(key) {
    if (key == 'settings') {
      router.push("/admin/settings")
    }
  }

  return (router.pathname.startsWith("/admin") || router.pathname == "/") && (<Client>
    <Navbar variant="floating" isBordered>
      <Navbar.Brand>
        <Logo/>
      </Navbar.Brand>
      <Navbar.Content variant="highlight-rounded">
        {pages.map((page) => 
        <Link href={page.target} passHref legacyBehavior key={page.target}><Navbar.Link isActive={router.pathname == page.target}>
          {page.name}
        </Navbar.Link></Link>)}
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
              <Button flat color="error" onPress={() => logout(context, setContext)}>Log Out</Button>
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>) : (
          <Navbar.Link color="secondary" href="/login" aria-label="Log in">Log in</Navbar.Link>
        )}
      </Navbar.Content>
    </Navbar></Client>
  )
}
