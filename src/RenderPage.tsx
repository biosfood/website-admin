import ReactMarkdown from 'react-markdown'
import { useEffect, useState, ReactNode } from 'react'
import Link from 'next/link'
import rehypeRaw from 'rehype-raw'
import { Card } from '@nextui-org/react';

export default function RenderPage({children}: {children: ReactNode}) {
  return (
  <ReactMarkdown
    components={{
      a: ({node, href, ...props}: {node: any, href?: string}) => {
        return <Link {...props} href={href!}/>},
        card: ({node, ...props}: {node: any}) => <Card><Card.Body {...props}/></Card>}}
    rehypePlugins={[rehypeRaw]}>
    {children as string}
  </ReactMarkdown>)
}

