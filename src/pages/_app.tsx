import type { AppProps } from 'next/app'
import { createTheme, NextUIProvider } from "@nextui-org/react"
import { useGlobalContext } from '@/context'
import { useEffect } from 'react'
import { useRouter } from "next/router";
import { updateUserData } from '@/api'
import { HydrationProvider } from "react-hydration-provider";
import { Navigation, Footer, ContextProvider } from "@/components"
import Head from 'next/head'

const theme = createTheme({type: "dark",})

export default function App({ Component, pageProps }: AppProps) {
  function MainPage( ) {
    const {context, setContext} = useGlobalContext()
    const router = useRouter()
    
    const updateContext = () => {
      if (context.token == 'REMOVE_NOW') {
        localStorage.removeItem("token")
        setContext({...context, token: ''})
      } else if (context.token && context.token != '???') {
        localStorage.setItem("token", context.token)
        updateUserData(context, setContext)
        return
      }
      if (!context.token && router.pathname.startsWith("/admin") && !router.pathname.includes("login")) {
        router.push({pathname: '/admin/login', query: {redirect: router.pathname}})
      }
    }
    useEffect(updateContext, [context.token])

    useEffect(() => {
      setContext({...context, path: router.pathname})
    }, [router.pathname])

    useEffect(() => setContext({...context, token: localStorage.getItem('token') || undefined, updateContext}), [])

    return (
      <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '100vh'}}>
        <Head>
          <link rel="icon" href="/favicon.svg" key="favicon"/>
        </Head>
        <div>
          <Navigation/>
          <Component {...pageProps} />
        </div>
        <Footer/>
      </div>
    )
  }

  return ( 
    <NextUIProvider theme={theme}>
      <HydrationProvider>
        <ContextProvider>
          <MainPage />
        </ContextProvider>
      </HydrationProvider>
    </NextUIProvider>
  )
}
