import { Card } from '@nextui-org/react';
import { useRouter } from "next/router"
import { SaveLink as Link } from "@/components"

export default function ImageButtonLink({href, src, size, style}: {href: string, src: string, size?: string, style?: object}) {
  const router = useRouter()
  return <Link href={href} style={style}>
    <Card isPressable onPress={() => router.push(href)}>
      <Card.Image src={src} objectFit="cover" height={size || "3em"}/>
    </Card>
  </Link>
}
