import { Card } from '@nextui-org/react';
import { useRouter } from "next/router"
import { SaveLink as Link } from "@/components"

export default function ImageButtonLink({href, src, size}: {href: string, src: string, size?: string}) {
  const router = useRouter()
  return <Link href={href}>
    <Card isPressable onPress={() => router.push(href)}>
      <Card.Image src={src} objectFit="cover" height={size || "3em"}/>
    </Card>
  </Link>
}
