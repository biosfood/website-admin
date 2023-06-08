import { retrieveResourceByName } from '@/api'
import { RenderPage } from '@/components'

export default function Page({content, username}: {content: string, username: string}) {
  return (
    <RenderPage basePath={`/users/${username}`}>{content}</RenderPage>
  )
}

export async function getServerSideProps({params}: {params: {slug: string[]}}) {
  const username = params.slug[0]
  const content = await retrieveResourceByName(username, "/" + params.slug.slice(1).join("/")) || "Resource not found"
  return { props: { content, username } }
}
