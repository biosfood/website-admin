import { Text } from '@nextui-org/react'
import { useGlobalContext } from '@/context'
import { useRouter } from "next/router";
import { useState } from 'react'
import { retrieveAsset, Resource } from '@/api'
import { RenderPage } from '@/pages/admin/pages'

export default function Page() {
  const {context, setContext} = useGlobalContext()
  const router = useRouter()
  const [content, setContent] = useState("")
  const slug = router.query.slug
  if (!slug) {
    return
  }
  const resourceName = slug instanceof Array ? "/" + slug.slice(1).join("/") : "/"
  const resource = context.resources.find((resource: Resource) => resource.name == resourceName)
  if (resource) {
    retrieveAsset(resource.id).then((resource: {content: string}) => setContent(resource?.content))
  }

  return (<div style={{margin: 10}}><RenderPage content={content}/></div>)
}
