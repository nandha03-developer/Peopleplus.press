import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const response = await axios.put(
        'https://jza447wx6usznr32vnfhy7q2ii0bnoms.lambda-url.ap-south-1.on.aws/api/customer',
        req.body,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      // Send the response from the external API back to the client
      res.status(200).json(response.data);
    } catch (error: any) {
      // Log detailed error information
      console.error('Error occurred while handling POST request:', {
        message: error.message,
        stack: error.stack,
        response: error.response?.data,
      });

      // Send an appropriate error response to the client
      res.status(error.response?.status || 500).json({
        error: error.response?.data?.message || 'An unexpected error occurred',
      });
    }
  } else {
    // Handle method not allowed
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
