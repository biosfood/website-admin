import { useContext, useState, createContext, useEffect } from 'react'
import { useRouter } from 'next/router'
import { getUserData } from '@/api'

const defaultContext = {
  username: '',
  useremail: '',
  currentPath: '',
  router: undefined,
}

const GlobalContext = createContext(defaultContext)
export const useGlobalContext = () => useContext(GlobalContext)

export function ContextProvider({children}) {
  const router = useRouter()
  const [context, setContext] = useState({...defaultContext, router})

  function updateContext() {
    const enforceLogin = context.router.pathname.startsWith("/admin")
    getUserData(GlobalContext.router).then(userData => {
      if (enforceLogin && !userData) {
        context.router.push("/login")
        return
      }
      if (userData) {
        setContext({...context, username: userData.name, useremail: userData.email})
      }
    })
    setContext({...context, updateContext, currentPath: context.router.pathname})
  }
  useEffect(updateContext, [router.asPath])
  useEffect(updateContext, [])
 
  return (
    <GlobalContext.Provider value={{context, setContext}}>
      {children}
    </GlobalContext.Provider>)
}
