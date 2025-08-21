/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import {GoogleGenAI} from '@google/genai'
import {limitFunction} from 'p-limit'

const ai = new GoogleGenAI({apiKey: process.env.API_KEY})
const maxRetries = 3
const baseDelay = 1000

export default limitFunction(
  async ({prompt}) => {
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const fullPrompt = `You are a helpful and creative social media assistant. Your task is to write an engaging and SEO-friendly YouTube video caption based on a thumbnail prompt.
        
        Instructions:
        1.  **Keep it concise and punchy:** Start with a hook to grab attention.
        2.  **Incorporate Emojis:** Use relevant emojis to add visual appeal and emotion.
        3.  **Include Hashtags:** Add 3-5 relevant hashtags at the end to improve discoverability.
        4.  **Match the Tone:** The tone should be enthusiastic and engaging, suitable for YouTube.

        Thumbnail Prompt: "${prompt}"

        Now, generate the caption.`

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: fullPrompt
        })

        return response.text
      } catch (error) {
        console.error(
          `Attempt ${attempt + 1} failed for caption generation:`,
          error
        )
        if (attempt === maxRetries - 1) {
          throw error
        }
        const delay = baseDelay * 2 ** attempt
        await new Promise(res => setTimeout(res, delay))
      }
    }
  },
  {concurrency: 5}
)
