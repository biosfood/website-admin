import { useContext, useState, createContext, useEffect } from 'react'
import { useRouter } from 'next/router'
import { getUserData } from '@/api'

const defaultContext = {
  username: '',
  useremail: '',
  router: undefined,
}

const GlobalContext = createContext(defaultContext)
export const useGlobalContext = () => useContext(GlobalContext)

export function ContextProvider({children}) {
  const [context, setContext] = useState({...defaultContext, router: useRouter()})
  const enforceLogin = context.router.pathname.startsWith("/admin")

  useEffect(() => {
    getUserData(context.router).then(userData => {
      if (enforceLogin && !userData) {
        context.router.push("/login")
        return
      }
      setContext({...context, username: userData.name, useremail: userData.email})
    })
  }, []);
  
  return (
    <GlobalContext.Provider value={{context, setContext}}>
      {children}
    </GlobalContext.Provider>)
}
