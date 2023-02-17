import { Html, Head, Main, NextScript } from 'next/document'
import { createTheme, NextUIProvider } from "@nextui-org/react"
import { ThemeProvider } from 'next-themes';

const theme = createTheme({type: "dark",})

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <ThemeProvider defaultTheme="dark" attribute="class" value={{dark: theme}}>
          <NextUIProvider theme={theme}>
            <Main />
            <NextScript />
          </NextUIProvider>
        </ThemeProvider>
      </body>
    </Html>
  )
}
