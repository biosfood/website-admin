import { retrieveResourceByHostname } from '@/api'
import { RenderPage } from '@/components'
import Head from 'next/head'

export default function Page({content, favicon}: {content: string, favicon: string}) {
  return (
    <>
      <RenderPage basePath="">{content}</RenderPage>
      <Head>
        {favicon.length > 0 && <link rel="icon" href={favicon} key="favicon"/>}
      </Head>
    </>
  )
}

export async function getServerSideProps({params, req}: {params: {slug?: string[]}, req: {headers: {host: string}}}) {
  const hostname = req.headers.host
  var content = "", favicon = ""
  const contentPromise = retrieveResourceByHostname(hostname, "/" + (params.slug?.join("/") || ""))
  .then( data => { content = data || "Resource not found" })
  const faviconPromise = fetch(`${process.env.api}/favicon?hostname=${hostname}`)
  .then(response => response.text()).then(data => { favicon = data })
  await Promise.all([contentPromise, faviconPromise])
  return { props: { content, hostname, favicon } }
}
