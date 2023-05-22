import { useContext, useState, createContext, useEffect, ReactNode } from 'react'
import { defaultContext, GlobalContext } from '@/context'

export default function ContextProvider({children}: {children?: ReactNode}) {
  const [context, setContext] = useState(defaultContext)

  return (
    <GlobalContext.Provider value={{context, setContext}}>
      {children}
    </GlobalContext.Provider>
  )
}
