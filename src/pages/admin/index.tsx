import Head from 'next/head'
import { useGlobalContext } from '@/context'

export default function Home() {
  const {context, setContext} = useGlobalContext()
  return (
    <>
      <Head>
        <title>Home</title>
      </Head>
      <h1>Hello {context.username}, found at {context.useremail}</h1>
    </>
  )
}
