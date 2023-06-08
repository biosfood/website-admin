import ReactMarkdown from 'react-markdown'
import { ReactNode } from 'react'
import Link from 'next/link'
import rehypeRaw from 'rehype-raw'
import remarkGfm from 'remark-gfm'
import { Card, Table, Image, Text, Grid, Row, Spacer, Container } from '@nextui-org/react';
import Head from 'next/head'
import {visit} from 'unist-util-visit'
import remarkDirective from 'remark-directive'
import queryString from 'query-string'
import { Client } from "react-hydration-provider";

function customComponents() {
  return (tree: any) => {
    visit(
      tree,
      ["textDirective", "leafDirective", "containerDirective"],
      (node) => {
        node.data = {
          hName: node.name,
          hProperties: node.attributes,
          ...node.data
        };
        return node;
      }
    );
  };
}

export default function RenderPage({children, basePath, onNavigate}: {children: ReactNode, basePath: string, onNavigate?: () => void}) {
  return (
  <ReactMarkdown
    components={{
      a: ({node, href, ...props}: {node: any, href?: string}) => {
        return <Link {...props} href={(href!.startsWith("/") ? basePath : "") + href!} onClick={onNavigate}/>
      },
      card: ({node, ...props}: {node: any}) => <Card><Card.Body {...props}/></Card>,
      table: ({children}: {node: any, children: ReactNode}) => {
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
      img: ({node, alt, src, ...props}: {node: any, alt: string, src: string, maxHeight?: string}) => {
        const params = alt.includes("?") ? queryString.parse(alt.split("?")[1]) : {}
        props = {...props, ...params}
        alt = alt.split("?")[0]
        const realSrc = src.startsWith("resource?id=") ? `${process.env.api}/${src}` : src
        if (alt == "favicon") {
          return <Head><link rel="icon" type="image/x-icon" href={realSrc} /></Head>
        }
        return <Client><Image {...props} src={realSrc} alt={alt} objectFit="fill"/></Client>
      },
      p: ({node, children, ...props}: {node: any, children: {type?: {name: string}}[]}) => {
        var hasText = false;
        children.map(child => {
          if (typeof child == "string") { hasText = true }
        })
        if (!hasText) {
          return <div>{children as ReactNode}</div>
        }
        return <Text {...props}>{children as ReactNode}</Text>
      },
      h1: ({node, ...props}: {node: any}) => <Text h1 {...props} style={{textAlign: "center", fontSize: "5em", margin: "1em"}}/>,
      h2: ({node, ...props}: {node: any}) => <Text h2 {...props} style={{textAlign: "center", fontSize: "3em", margin: "0.5em"}}/>,
      gridcontainer: ({node, children, ...props}: {node: any, children?: any[]}) => {
        return (<Grid.Container {...props}>
          {children?.map((child, index) => <Grid xs key={index}>{child}</Grid>)}
        </Grid.Container>)
      },
      row: ({node, ...props}: {node: any}) => <Row justify="space-around" {...props}/>,
      spacer: (props: object) => <Spacer {...props}/>,
      container: (props: object) => <Container {...props}/>
    } as {a: any,  table: any}}
    rehypePlugins={[rehypeRaw]}
    remarkPlugins={[remarkGfm, remarkDirective, customComponents]}>
    {children as string}
  </ReactMarkdown>)
}

