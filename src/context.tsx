import { useContext, useState, createContext, useEffect } from 'react'
import { useRouter } from 'next/router'

const defaultContext = {
  username: '',
  useremail: '',
  path: '',
  token: '???',
}

const GlobalContext = createContext(defaultContext)
export const useGlobalContext = () => useContext(GlobalContext)

export function ContextProvider({children}) {
  const [context, setContext] = useState(defaultContext)

  return (
    <GlobalContext.Provider value={{context, setContext}}>
      {children}
    </GlobalContext.Provider>
  )
}
