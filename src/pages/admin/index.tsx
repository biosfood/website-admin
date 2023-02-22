import Head from 'next/head'
import Image from 'next/image'
import { useEffect, useState } from 'react';
import { useRouter } from "next/router";
import { useGlobalContext } from '@/context'

export default function Home() {
  const {context, setContext} = useGlobalContext()
  return (
    <>
      <h1>Hello {context.username}, found at {context.useremail}</h1>
    </>
  )
}
