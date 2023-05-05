import { Html, Head, Main, NextScript } from 'next/document'
import { ThemeProvider } from 'next-themes';
import { CssBaseline } from '@nextui-org/react';
import { SSRProvider } from 'react-aria';

export default function Document() {
  return (
    <Html lang="en">
      <Head>{CssBaseline.flush()}
      </Head>
      <body>
        <SSRProvider>
          <Main />
          <NextScript />
        </SSRProvider>
      </body>
    </Html>
  )
}
