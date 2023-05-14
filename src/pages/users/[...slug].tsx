import { Text } from '@nextui-org/react'
import { useGlobalContext } from '@/context'
import { useRouter } from "next/router";
import { useState, useEffect } from 'react'
import { retrieveAsset, Resource, getResources } from '@/api'
import RenderPage from '@/RenderPage'
import Head from 'next/head'

export default function Page() {
  const {context, setContext} = useGlobalContext()
  const router = useRouter()
  const [content, setContent] = useState("")
  const [username, setUsername] = useState("")

  useEffect(() => {
    const main = async () => {
      const slug = router.query.slug
      if (!slug) {
        return
      }
      if (slug[0] == process.env.rootUser) {
        router.replace(slug instanceof Array ? "/" + slug.slice(1).join("/") : "/")
      }
      setUsername(slug[0])
      const resources = await getResources(slug[0])
      const resourceName = slug instanceof Array ? "/" + slug.slice(1).join("/") : "/"
      const resource = resources.find((resource: Resource) => resource.name == resourceName)
      if (resource) {
        retrieveAsset(resource.id).then((resource: {content: string}) => setContent(resource?.content))
      }
    }
    main()
  }, [router.query.slug])

  return (
    <>
      <div style={{margin: 10}}><RenderPage username={username}>{content}</RenderPage></div>
    </>)
}
