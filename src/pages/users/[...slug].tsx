import { retrieveResourceByName } from '@/api'
import { RenderPage } from '@/components'
import Head from 'next/head'

export default function Page({content, username, favicon}: {content: string, username: string, favicon: string}) {
  return (
    <>
      <RenderPage basePath={`/users/${username}`}>{content}</RenderPage>
      <Head>
        {favicon.length > 0 && <link rel="icon" href={favicon} key="favicon"/>}
      </Head>
    </>
  )
}

export async function getServerSideProps({params}: {params: {slug: string[]}}) {
  const username = params.slug[0]
  const content = await retrieveResourceByName(username, "/" + params.slug.slice(1).join("/")) || "Resource not found"
  const favicon = await (await fetch(`${process.env.api}/favicon?username=${username}`)).text()
  return { props: { content, username, favicon } }
}
