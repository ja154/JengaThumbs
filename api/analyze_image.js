/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { GoogleGenAI } = await import('https://esm.sh/@google/genai');
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const { image } = req.body;
    if (!image) {
      return res.status(400).json({ error: 'Image data is required.' });
    }

    const mimeType = image.match(/data:(.*);base64,/)?.[1];
    if (!mimeType) {
      throw new Error('Invalid image data URL');
    }
    const base64ImageData = image.split(',')[1];

    const imagePart = {
      inlineData: {
        data: base64ImageData,
        mimeType,
      },
    };

    const textPart = {
      text: "Analyze this image and generate a descriptive prompt for creating a similar but improved YouTube thumbnail. Focus on the subject, style, colors, and any text elements. The prompt should be concise and actionable for an image generation AI.",
    };
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [imagePart, textPart] },
    });
    
    const description = response.text;

    res.status(200).json({ description });
  } catch (error) {
    console.error('Error in /api/analyze_image:', error);
    res.status(500).json({ error: error.message || 'An internal server error occurred.' });
  }
}
