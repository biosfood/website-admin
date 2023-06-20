import Link from 'next/link'
import { ReactNode } from 'react'

export default function SaveLink({onNavigate, href, ...props}:
                                 {onNavigate?: () => any, href: string, children?: ReactNode, style?: object}) {
  let result: ReactNode = null
  process.env.refreshURLs!.split(",").map((url: string) => {
    if (href?.startsWith(url)) {
      result = <a {...props} href={href}/>
    }
  })
  return result || <Link {...props} href={href} onClick={onNavigate}/>
}
