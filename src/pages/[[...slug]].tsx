import { Text } from '@nextui-org/react'
import { useGlobalContext } from '@/context'
import { useRouter } from "next/router";
import { useState, useEffect } from 'react'
import { retrieveResourceByHostname } from '@/api'
import Head from 'next/head'
import { Client } from "react-hydration-provider";
import { RenderPage } from '@/components'

export default function Page({content}: {content: string}) {
  return (
    <Client>
      <div style={{margin: 10}}><RenderPage basePath="">{content}</RenderPage></div>
    </Client>
  )
}

export async function getServerSideProps({params, req}: {params: {slug?: string[]}, req: {headers: {host: string}}}) {
  const hostname = req.headers.host
  const content = await retrieveResourceByHostname(hostname, "/" + (params.slug?.join("/") || "")) || "Resource not found"
  return { props: { content } }
}
