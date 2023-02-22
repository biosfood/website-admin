import type { AppProps } from 'next/app'
import {SSRProvider} from '@react-aria/ssr';
import { createTheme, NextUIProvider } from "@nextui-org/react"
import { ContextProvider, useGlobalContext } from '@/context'
import { Navigation, user } from "@/navigation"
import { useEffect } from 'react'
import { useRouter } from "next/router";
import { updateUserData } from '@/api'

const theme = createTheme({type: "dark",})

class Page {
  target: string
  name: string

  constructor(target: string, name: string) {
    this.target = target
    this.name = name
  }
}

export const adminPages = [
  new Page("/admin", "Home"),
  new Page("/admin/assets", "Assets"),
  new Page("/admin/pages", "Pages"),
]


export default function App({ Component, pageProps }: AppProps) {
  function MainPage( ) {
    const {context, setContext} = useGlobalContext()
    const router = useRouter()

    useEffect(() => {
      if (context.token == 'REMOVE_NOW') {
        localStorage.removeItem("token")
        setContext({...context, token: ''})
      } else if (context.token && context.token != '???') {
        localStorage.setItem("token", context.token)
        updateUserData(context, setContext).then(success => {
          if (!success && router.pathname.startsWith("/admin")) {
            router.push("/login")
          }
        })
        return
      }
      if (!context.token && router.pathname.startsWith("/admin")) {
        router.push("/login")
      }
    }, [context.token])

    useEffect(() => {
      setContext({...context, path: router.pathname})
    }, [router.pathname])

    useEffect(() => setContext({...context, token: localStorage.getItem('token')}), [])

    return (
      <>
        <Navigation pages={adminPages} />
        <Component {...pageProps} />
      </>
    )
  }
  return ( 
    <SSRProvider>
      <NextUIProvider theme={theme}>
        <ContextProvider>
          <MainPage />
        </ContextProvider>
      </NextUIProvider>
    </SSRProvider>
  )
}
