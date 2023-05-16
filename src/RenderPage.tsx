import ReactMarkdown from 'react-markdown'
import { useEffect, useState, ReactNode } from 'react'
import Link from 'next/link'
import rehypeRaw from 'rehype-raw'
import remarkGfm from 'remark-gfm'
import { Card, Table, Image } from '@nextui-org/react';
import Head from 'next/head'

const processHref = (href: string, username: string) => {
  if (href.startsWith("/")) {
    if (username == process.env.rootUser) {
      return href
    }
    return `users/${username}/${href}`
  }
  return href
}

export default function RenderPage({children, username, onNavigate}: {children: ReactNode, username: string, onNavigate?: () => void}) {
  return (
  <ReactMarkdown
    components={{
      a: ({node, href, ...props}: {node: any, href?: string}) => {
        return <Link {...props} href={processHref(href!, username)} onClick={onNavigate}/>
      },
      card: ({node, ...props}: {node: any}) => <Card><Card.Body {...props}/></Card>,
      table: ({node, children, ...props}: {node: any, children: ReactNode}) => {
        if (!children) {
          return null
        }
        const header = <Table.Header>
          {(children as Array<{props: {children: Array<{props: {children: Array<any>}}>}}>)[0].props.children[0].props.children.map(
              (child: {props: {children: any[]}}) => <Table.Column key={child.props.children[0]}>{child.props.children[0]}</Table.Column>)
          }
        </Table.Header>
        const body = <Table.Body>
          {(children as Array<{props: {children: Array<any>}}>)[1].props.children.map(
              (child: {props: {children: Array<any>}}, index: number) => <Table.Row key={index}>
            {child.props.children.map((child: {props: {children: any}}, index: number) => <Table.Cell key={index}>{child.props.children}</Table.Cell>)}
          </Table.Row>)}
        </Table.Body>
        return <Table>
          {header}
          {body}
        </Table>
      },
      title: ({node, ...props}: {node: any}) => <Head><title {...props}/></Head>,
      img: ({node, alt, src, ...props}: {node: any, alt: string, src: string}) => {
        const realSrc = src.startsWith("resource?id=") ? `${process.env.api}/${src}` : src
        if (alt == "favicon") {
          return <Head><link rel="icon" type="image/x-icon" href={realSrc} /></Head>
        }
        return <Image src={realSrc} alt={alt}/>
      },
    } as {a: any,  table: any}}
    rehypePlugins={[rehypeRaw]}
    remarkPlugins={[remarkGfm]}>
    {children as string}
  </ReactMarkdown>)
}

