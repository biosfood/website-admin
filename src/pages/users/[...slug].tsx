import { Text } from '@nextui-org/react'
import { useGlobalContext } from '@/context'
import { useRouter } from "next/router";
import { useState, useEffect } from 'react'
import { getContentServerside } from '@/api'
import RenderPage from '@/RenderPage'
import Head from 'next/head'
import { Client } from "react-hydration-provider";

export default function Page({content, username}: {content: string, username: string}) {
  return (
    <Client>
      <div style={{margin: 10}}><RenderPage username={username}>{content}</RenderPage></div>
    </Client>
  )
}

export async function getServerSideProps({params}: {params: {slug: string[]}}) {
  // TODO: redirect to /[slug] if user == rootUser
  const username = params.slug[0]
  const content = await getContentServerside(username, "/" + params.slug.slice(1).join("/"))
  if (!content) {
    // Show error message or redirect?
  }
  return { props: { content, username } }
}
