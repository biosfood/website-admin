import { useContext, useState, createContext, useEffect, ReactNode } from 'react'
import { GlobalContext, Context, defaultContext } from '@/context'

export function ContextProvider({children}: {children?: ReactNode}) {
  const [context, setContext] = useState(defaultContext)

  return (
    <GlobalContext.Provider value={{context, setContext}}>
      {children}
    </GlobalContext.Provider>
  )
}
