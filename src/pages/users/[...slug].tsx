import { Text } from '@nextui-org/react'
import { useGlobalContext } from '@/context'
import { useRouter } from "next/router";
import { useState, useEffect } from 'react'
import { retrieveResourceByName } from '@/api'
import Head from 'next/head'
import { Client } from "react-hydration-provider";
import { RenderPage } from '@/components'

export default function Page({content, username}: {content: string, username: string}) {
  return (
    <Client>
      <div style={{margin: 10}}><RenderPage basePath={`/users/${username}`}>{content}</RenderPage></div>
    </Client>
  )
}

export async function getServerSideProps({params}: {params: {slug: string[]}}) {
  const username = params.slug[0]
  const content = await retrieveResourceByName(username, "/" + params.slug.slice(1).join("/")) || "Resource not found"
  return { props: { content, username } }
}
