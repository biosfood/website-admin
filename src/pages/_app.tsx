import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import {SSRProvider} from '@react-aria/ssr';
import { createTheme, NextUIProvider } from "@nextui-org/react"
import { ContextProvider } from '@/context'

const theme = createTheme({type: "dark",})

export default function App({ Component, pageProps }: AppProps) {
  return ( 
    <SSRProvider>
      <NextUIProvider theme={theme}>
        <ContextProvider>
          <Component {...pageProps} />
        </ContextProvider>
      </NextUIProvider>
    </SSRProvider>
  )
}
