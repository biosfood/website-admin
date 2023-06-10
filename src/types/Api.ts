export interface Request {
  method: string,
  body: object,
  query?: { id?: number }
}

export interface Response {
  status: (status: number) => {json: (data: object) => any}
}
