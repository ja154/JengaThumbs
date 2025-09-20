/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import {GoogleGenAI, Modality} from '@google/genai'
import {limitFunction} from 'p-limit'

const ai = new GoogleGenAI({apiKey: process.env.API_KEY})
const maxRetries = 3
const baseDelay = 1000

export const llmGen = limitFunction(
  async ({model, prompt, image}) => {
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        if (image) {
          const mimeType = image.match(/data:(.*);base64,/)?.[1]
          if (!mimeType) {
            throw new Error('Invalid image data URL')
          }
          const base64ImageData = image.split(',')[1]

          const imagePart = {
            inlineData: {
              data: base64ImageData,
              mimeType
            }
          }
          const textPart = {
            text: prompt
          }

          const response = await ai.models.generateContent({
            model,
            contents: {parts: [imagePart, textPart]},
            config: {
              responseModalities: [Modality.IMAGE, Modality.TEXT]
            }
          })

          const imageResponsePart = response.candidates?.[0]?.content?.parts.find(
            part => part.inlineData
          )

          if (!imageResponsePart) {
            throw new Error('No image found in response')
          }
          const {data, mimeType: responseMimeType} = imageResponsePart.inlineData
          return `data:${responseMimeType};base64,${data}`
        } else {
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
        }
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
  {concurrency: 3}
)
