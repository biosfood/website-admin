import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import {SSRProvider} from '@react-aria/ssr';
import { createTheme, NextUIProvider } from "@nextui-org/react"
import { ContextProvider } from '@/context'
import { Navigation, user } from "@/navigation"

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
  return ( 
    <SSRProvider>
      <NextUIProvider theme={theme}>
        <ContextProvider>
          <Navigation pages={adminPages} />
          <Component {...pageProps} />
        </ContextProvider>
      </NextUIProvider>
    </SSRProvider>
  )
}
