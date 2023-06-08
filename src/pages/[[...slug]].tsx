import { retrieveResourceByHostname } from '@/api'
import { RenderPage } from '@/components'

export default function Page({content}: {content: string}) {
  return (
    <RenderPage basePath="">{content}</RenderPage>
  )
}

export async function getServerSideProps({params, req}: {params: {slug?: string[]}, req: {headers: {host: string}}}) {
  const hostname = req.headers.host
  const content = await retrieveResourceByHostname(hostname, "/" + (params.slug?.join("/") || "")) || "Resource not found"
  return { props: { content } }
}
