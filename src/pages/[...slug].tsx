import { Text } from '@nextui-org/react'
import { useGlobalContext } from '@/context'
import { useRouter } from "next/router";
import { useState } from 'react'
import { retrieveAsset } from '@/api'
import { RenderPage } from '@/pages/admin/pages'

export default function Page({props}) {
  const {context, setContext} = useGlobalContext()
  const router = useRouter()
  const slug = router.query.slug
  if (!slug) {
    return
  }
  const resourceName = slug.length > 1 ? slug.slice(1).join("/") : "/"
  const resource = context.resources.find(resource => resource.name == resourceName)
  const [content, setContent] = useState("")
  if (resource) {
    retrieveAsset(resource.id).then(resource => setContent(resource?.content))
  }

  return (<div style={{margin: 10}}><RenderPage content={content}/></div>)
}
