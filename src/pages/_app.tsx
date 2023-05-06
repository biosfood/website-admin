import type { AppProps } from 'next/app'
import { SSRProvider } from '@react-aria/ssr';
import { createTheme, NextUIProvider } from "@nextui-org/react"
import { useGlobalContext } from '@/context'
import { ContextProvider } from '@/ContextProvider'
import { Navigation } from "@/navigation"
import { useEffect } from 'react'
import { useRouter } from "next/router";
import { updateUserData, getResources } from '@/api'
import { Footer } from '@/footer'
import { HydrationProvider } from "react-hydration-provider";

const theme = createTheme({type: "dark",})

export class Page {
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
      if (router.query.slug != undefined && !context.resources.length) {
        getResources(router.query.slug[0]).then(resources => {
          if (resources == undefined) {
            return
          }
          setContext({...context, resources})
        })
      }
    }
    useEffect(updateContext, [context.token])

    useEffect(() => {
      setContext({...context, path: router.pathname})
    }, [router.pathname])

    useEffect(() => setContext({...context, token: localStorage.getItem('token') || undefined, updateContext}), [])

    return (
      <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '100vh'}}>
        <div>
          <Navigation pages={adminPages} />
          <Component {...pageProps} />
        </div>
        <Footer/>
      </div>
    )
  }

  return ( 
    <HydrationProvider>
      <NextUIProvider theme={theme}>
        <ContextProvider>
          <MainPage />
        </ContextProvider>
      </NextUIProvider>
    </HydrationProvider>
  )
}
