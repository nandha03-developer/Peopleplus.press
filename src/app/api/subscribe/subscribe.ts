import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      // Your POST request handling logic
      const response = await axios.post('https://jza447wx6usznr32vnfhy7q2ii0bnoms.lambda-url.ap-south-1.on.aws/api/newslettersubscription', req.body, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      res.status(200).json(response.data);
    } catch (error: any) {
      console.error('Error adding data:', error);
      res.status(error.response?.status || 500).json({ error: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}