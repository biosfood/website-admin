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
  useEffect(() => {
    const main = async () => {
      const resources = await getResources(process.env.rootUser)
      const resourceName = "/"
      const resource = resources.find((resource: Resource) => resource.name == resourceName)
      if (resource) {
        retrieveAsset(resource.id).then((resource: {content: string}) => setContent(resource?.content))
      }
    }
    main()
  }, [router.query.slug])

  return (
    <>
      <div style={{margin: 10}}><RenderPage>{content}</RenderPage></div>
    </>)
}
