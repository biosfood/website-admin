import { Navbar, Dropdown, Avatar, Text } from '@nextui-org/react'
import { useGlobalContext } from '@/context'
import { useState } from 'react'

export function Navigation({pages, enforceLogin, setUserState}) {
  const {context, setContext} = useGlobalContext()
  const [avatarSource, setAvatarSource ] = useState('')
  function CustomLink({ target, children}) {
    const path = context.router.pathname
    if (path == target || path == target + "/") {
      return (
        <Navbar.Link isActive href={target}>
          {children}
        </Navbar.Link>
      )
    }
    return (
      <Navbar.Link href={target}>
        {children}
      </Navbar.Link>
    )
  }

  return (
    <Navbar variant="floating" isBordered>
      <Navbar.Content variant="highlight-rounded">
        {pages.map((page) => 
        <CustomLink target={page.target} key={page.target}>
          {page.name}
        </CustomLink>)}
      </Navbar.Content>
      <Navbar.Content css={{ w: "12%", jc: "flex-end"}}>
        <Dropdown placement="bottom-right">
          <Navbar.Item>
            <Dropdown.Trigger>
              <Avatar bordered as="button" color="secondary" size="md" text={context.username} src={avatarSource}/>
            </Dropdown.Trigger>
          </Navbar.Item>
          <Dropdown.Menu aria-label="User menu actions" color="secondary">
            <Dropdown.Item key="profile">
              Signed in as {context.username}
            </Dropdown.Item>
            <Dropdown.Item key="settings" withDivider>
              Settings
            </Dropdown.Item>
            <Dropdown.Item key="logout" withDivider color="error">
              Log Out
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </Navbar.Content>
    </Navbar>
  )
}
