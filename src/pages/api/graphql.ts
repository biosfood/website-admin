import type { Request, Response } from "@/types"

export default async function graphql(request: Request, response: Response) {
  if (request.method != "POST") {
    // Method not allowed
    response.status(405).json({})
    return
  }
  const serverResponse = await fetch(`${process.env.api}/graphql`, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(request.body)
  }).then(res => res.json())
  response.status(200).json(serverResponse)
}

export const config = {
    api: {
        bodyParser: {
            sizeLimit: '4mb'
        }
    }
}
