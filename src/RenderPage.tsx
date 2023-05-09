import ReactMarkdown from 'react-markdown'
import { useEffect, useState, ReactNode } from 'react'
import Link from 'next/link'

export default function RenderPage({children}: {children: ReactNode}) {
  return (
  <ReactMarkdown
    components={{
      a: ({node, href, ...props}: {node: any, href?: string}) => {
        return <Link {...props} href={href!}/>}
    }}>
    {children as string}
  </ReactMarkdown>)
}

