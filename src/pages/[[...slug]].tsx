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
  const content = await retrieveResourceByHostname(hostname, "/" + (params.slug?.join("/") || "")) || "Resource not found"
  const favicon = await (await fetch(`${process.env.api}/favicon?hostname=${hostname}`)).text()
  return { props: { content, hostname, favicon } }
}
