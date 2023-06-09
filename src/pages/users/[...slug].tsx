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
  var content = "", favicon = ""
  const contentPromise = retrieveResourceByName(username, "/" + params.slug.slice(1).join("/")).then(data => {
    content = data || "Resource not found"
  })
  const faviconPromise = fetch(`${process.env.api}/favicon?username=${username}`)
  .then(response => response.text()).then(data => { favicon = data })
  await Promise.all([contentPromise, faviconPromise])
  return { props: { content, username, favicon } }
}
