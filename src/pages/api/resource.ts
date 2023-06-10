import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios'

export default async function resource(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const response = await axios.get(`${process.env.api}/resource?id=${req.query.id}`, { responseType: 'stream' });

    res.setHeader('Content-Type', 'image');
    res.setHeader('Content-Disposition', 'inline; filename="image.jpg"');

    response.data.pipe(res);
  } catch (error) {
    console.error(error);
    res.status(500).end();
  }
}
