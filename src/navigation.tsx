import {Navbar} from '@nextui-org/react'
import {useGlobalContext} from '@/context'

function CustomLink({ target, children}) {
  const {context, setContext} = useGlobalContext()
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

export function Navigation({pages, enforceLogin, setUserState}) {
  return (
    <Navbar variant="floating" isBordered>
      <Navbar.Content variant="highlight-rounded">
        {pages.map((page) => 
        <CustomLink target={page.target} key={page.target}>
          {page.name}
        </CustomLink>)}
      </Navbar.Content>
    </Navbar>
  )
}
