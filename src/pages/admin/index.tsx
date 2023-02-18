import Head from 'next/head'
import Image from 'next/image'

export default function Home() {
  const user = loadUserInfo();
  return (
      <main>
          <h1>Hello, </h1>
      </main>
  )
}
