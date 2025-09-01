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
  async ({model, prompt}) => {
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const response = await ai.models.generateImages({
          model,
          prompt,
          config: {
            numberOfImages: 1,
            outputMimeType: 'image/jpeg',
            aspectRatio: '16:9'
          }
        })

        const base64ImageBytes = response.generatedImages[0].image.imageBytes
        return `data:image/jpeg;base64,${base64ImageBytes}`
      } catch (error) {
        console.error(
          `Attempt ${attempt + 1} failed for model ${model}:`,
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
