import Head from 'next/head'
import Image from 'next/image'
import { getUserData, UserAccount } from '@/api'
import { useEffect, useState } from 'react';
import { useRouter } from "next/router";

export default function Home() {
  const [user, setUser] = useState({name: "", email: ""})
  const router = useRouter()
  useEffect(() => {getUserData(router).then(userData => setUser(userData))}, []);
  return (
      <main>
        <h1>Hello {user?.name || "<username>"}, found at {user?.email || "<email>"}</h1>
      </main>
  )
}
