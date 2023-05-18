import { Text } from '@nextui-org/react'
import { useGlobalContext } from '@/context'
import { useRouter } from "next/router";
import { useState, useEffect } from 'react'
import { retrieveAsset, Resource, getResources } from '@/api'
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
  const content = await fetch(`${process.env.api}/graphql`, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      query: "query ResourceByName($username: String, $name: String) { resourceByName(username: $username, name: $name) {content} }",
      variables: {username: process.env.rootUser, name: "/" + (params.slug?.join("/") || "") }
    })
  }).then(res => res.json()).then(data => data.data?.resourceByName?.content)
  if (!content) {
    // Show error message or redirect?
  }
  return { props: { content } }
}
