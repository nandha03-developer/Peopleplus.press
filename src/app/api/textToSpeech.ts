// pages/api/text-to-speech.ts

import { NextApiRequest, NextApiResponse } from 'next';
import gTTS from 'gtts';

type RequestBody = {
  content: string;
  language: 'en' | 'ta' | 'hi';
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  const { content, language }: RequestBody = req.body;

  // Validate the input parameters
  if (!content) {
    return res.status(400).send('Error: content parameter is required.');
  }

  if (!['en', 'ta', 'hi'].includes(language)) {
    return res.status(400).send('Error: language parameter must be one of "en", "ta", "hi".');
  }

  // Create an instance of gTTS with the content and language
  const gtts = new gTTS(content, language);

  // Set the response headers to serve an audio file
  res.setHeader('Content-Type', 'audio/mpeg');
  res.setHeader('Content-Disposition', 'inline; filename="speech.mp3"');

  // Stream the generated speech to the response
//   gtts.stream().pipe(res).on('error', (err) => {
//     console.error(err); // Log the error for debugging
//     res.status(500).send('Error generating speech.');
//   });
}
