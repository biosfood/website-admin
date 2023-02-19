import Head from 'next/head'
import Image from 'next/image'
import { useEffect, useState } from 'react';
import { useRouter } from "next/router";
import { Navigation, user } from "@/navigation"
import { useGlobalContext } from '@/context'

class Page {
  target: string
  name: string

  constructor(target: string, name: string) {
    this.target = target
    this.name = name
  }
}

export const adminPages = [
  new Page("/admin", "Home"),
  new Page("/admin/assets", "Assets"),
  new Page("/admin/pages", "Pages"),
]

export default function Home() {
  const {context, setContext} = useGlobalContext()
  return (
    <>
      <Navigation pages={adminPages}/>
      <h1>Hello {context.username}, found at {context.useremail}</h1>
    </>
  )
}
