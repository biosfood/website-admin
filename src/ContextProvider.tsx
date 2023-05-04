import { useContext, useState, createContext, useEffect } from 'react'
import { GlobalContext, defaultContext } from '@/context'

export function ContextProvider({children}) {
  const [context, setContext] = useState(defaultContext)

  return (
    <GlobalContext.Provider value={{context, setContext}}>
      {children}
    </GlobalContext.Provider>
  )
}
