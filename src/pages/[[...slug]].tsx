import { Text } from '@nextui-org/react'
import { useGlobalContext } from '@/context'
import { useRouter } from "next/router";
import { useState, useEffect } from 'react'
import { getContentServerside } from '@/api'
import RenderPage from '@/RenderPage'
import Head from 'next/head'
import { Client } from "react-hydration-provider";

export default function Page({content}: {content: string}) {
  return (
    <Client>
      <div style={{margin: 10}}><RenderPage username={process.env.rootUser!}>{content}</RenderPage></div>
    </Client>
  )
}

export async function getServerSideProps({params}: {params: {slug?: string[]}}) {
  const content = await getContentServerside(process.env.rootUser!, "/" + (params.slug?.join("/") || ""))
  if (!content) {
    // Show error message or redirect?
  }
  return { props: { content } }
}
