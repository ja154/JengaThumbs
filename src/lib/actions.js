/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import useStore from './store'
import modes from './modes'
import layouts from './layouts'
import {llmGen} from './llm'
import llmCaptionGen from './llm_caption'
import models from './models'

const get = useStore.getState
const set = useStore.setState

const newOutput = (model, mode, prompt) => ({
  model,
  id: crypto.randomUUID(),
  startTime: Date.now(),
  outputData: null,
  isBusy: true,
  gotError: false,
  outputMode: mode,
  rating: 0,
  isFavorite: false,
  comments: '',
  prompt,
  isEditing: false,
  caption: null,
  isGeneratingCaption: true,
  captionError: false
})

const getSystemInstruction = (outputMode, uploadedImage) => {
  const originalSystemInstruction = modes[outputMode].systemInstruction

  if (uploadedImage) {
    const styleInstructionPart = 'The specific art style is:'
    const styleInstructionIndex =
      originalSystemInstruction.indexOf(styleInstructionPart)

    const styleInstruction =
      styleInstructionIndex !== -1
        ? originalSystemInstruction
            .substring(styleInstructionIndex + styleInstructionPart.length)
            .trim()
        : 'a modern, high-impact style.' // Fallback style

    const newBaseInstruction = `You are an expert AI photo editor and YouTube thumbnail designer. Your task is to edit the user-provided image based on their text prompt to create a professional 16:9 YouTube thumbnail.

**Key Capabilities:**
*   **Subject Extraction & Background Replacement:** If the prompt implies creating a new scene, perfectly extract the main subject (e.g., person) from the original image and place them in a completely new, dynamic background that matches the prompt's description.
*   **In-painting & Object Manipulation:** You can add, remove, or modify objects in the image as requested. For example, "add a hat on my head" or "remove the cup from the table".
*   **Style Transfer:** Apply the requested art style to the entire image or parts of it.
*   **Text Addition:** Add large, bold, and highly readable text as specified. Ensure perfect spelling.

**CRITICAL INSTRUCTIONS (MUST be followed):**
1.  **Follow the User's Prompt:** The user's text prompt is the primary instruction. Interpret it carefully to perform the desired edits.
2.  **Preserve the Subject (Unless Asked Otherwise):** By default, assume the user wants to keep the main person/subject from their image. Do not replace them unless explicitly asked to do so (e.g., "replace me with a robot").
3.  **Final Aspect Ratio:** The final output image MUST be in a 16:9 landscape aspect ratio.

The specific art style for any new elements or overall feel is:`

    return `${newBaseInstruction} ${styleInstruction}`
  }

  return originalSystemInstruction
}

export const addRound = prompt => {
  scrollTo({top: 0, left: 0, behavior: 'smooth'})

  const {outputMode, batchSize, batchModel, layout, uploadedImage} = get()

  const systemInstruction = getSystemInstruction(outputMode, uploadedImage)

  const layoutInstruction = layouts[layout].instruction
  const fullPrompt = `${systemInstruction}\n\n${
    layoutInstruction ? `Layout instruction: ${layoutInstruction}\n\n` : ''
  }${prompt}`

  const newRound = {
    prompt,
    systemInstruction,
    id: crypto.randomUUID(),
    createdAt: new Date(),
    outputMode,
    layout,
    uploadedImage,
    outputs: new Array(batchSize)
      .fill(null)
      .map(() => newOutput(batchModel, outputMode, prompt))
  }

  set(state => {
    state.feed.unshift(newRound)
  })

  newRound.outputs.forEach((output, i) => {
    // Generate image
    llmGen({
      model: models[output.model].modelString,
      prompt: fullPrompt,
      image: uploadedImage
    })
      .then(res => {
        set(state => {
          const round = state.feed.find(round => round.id === newRound.id)
          if (!round) return
          const targetOutput = round.outputs[i]
          if (!targetOutput) return
          targetOutput.outputData = res
          targetOutput.isBusy = false
          targetOutput.totalTime = Date.now() - output.startTime
        })
      })
      .catch(e => {
        console.error(e)
        set(state => {
          const round = state.feed.find(round => round.id === newRound.id)
          if (!round) return
          const targetOutput = round.outputs[i]
          if (!targetOutput) return
          targetOutput.isBusy = false
          targetOutput.gotError = true
          targetOutput.totalTime = Date.now() - output.startTime
        })
      })

    // Generate caption
    llmCaptionGen({prompt})
      .then(caption => {
        set(state => {
          const round = state.feed.find(round => round.id === newRound.id)
          if (!round) return
          const targetOutput = round.outputs[i]
          if (!targetOutput) return
          targetOutput.caption = caption
          targetOutput.isGeneratingCaption = false
        })
      })
      .catch(e => {
        console.error(e)
        set(state => {
          const round = state.feed.find(round => round.id === newRound.id)
          if (!round) return
          const targetOutput = round.outputs[i]
          if (!targetOutput) return
          targetOutput.isGeneratingCaption = false
          targetOutput.captionError = true
        })
      })
  })
}

export const regenerateOutput = (roundId, outputId, newPrompt) => {
  const round = get().feed.find(r => r.id === roundId)
  if (!round) return

  const output = round.outputs.find(o => o.id === outputId)
  if (!output) return

  const {uploadedImage, outputMode, layout} = round

  const systemInstruction = getSystemInstruction(outputMode, uploadedImage)

  const layoutInstruction =
    layout && layouts[layout] ? layouts[layout].instruction : ''
  const fullPrompt = `${systemInstruction}\n\n${
    layoutInstruction ? `Layout instruction: ${layoutInstruction}\n\n` : ''
  }${newPrompt}`

  set(state => {
    const round = state.feed.find(r => r.id === roundId)
    const output = round.outputs.find(o => o.id === outputId)
    output.isBusy = true
    output.gotError = false
    output.startTime = Date.now()
    output.prompt = newPrompt
    output.isGeneratingCaption = true
    output.caption = null
    output.captionError = false
  })

  // Generate image
  llmGen({
    model: models[output.model].modelString,
    prompt: fullPrompt,
    image: uploadedImage
  })
    .then(res => {
      set(state => {
        const round = state.feed.find(r => r.id === roundId)
        const output = round.outputs.find(o => o.id === outputId)
        if (!output) return
        output.outputData = res
        output.isBusy = false
        output.totalTime = Date.now() - output.startTime
        output.isEditing = false
      })
    })
    .catch(e => {
      console.error(e)
      set(state => {
        const round = state.feed.find(r => r.id === roundId)
        const output = round.outputs.find(o => o.id === outputId)
        if (!output) return
        output.isBusy = false
        output.gotError = true
        output.totalTime = Date.now() - output.startTime
        output.isEditing = false
      })
    })

  // Generate caption
  llmCaptionGen({prompt: newPrompt})
    .then(caption => {
      set(state => {
        const round = state.feed.find(r => r.id === roundId)
        const output = round.outputs.find(o => o.id === outputId)
        if (!output) return
        output.caption = caption
        output.isGeneratingCaption = false
      })
    })
    .catch(e => {
      console.error(e)
      set(state => {
        const round = state.feed.find(r => r.id === roundId)
        const output = round.outputs.find(o => o.id === outputId)
        if (!output) return
        output.isGeneratingCaption = false
        output.captionError = true
      })
    })
}

export const setOutputMode = mode =>
  set(state => {
    state.outputMode = mode
  })

export const setLayout = layout =>
  set(state => {
    state.layout = layout
  })

export const setBatchModel = model =>
  set(state => {
    state.batchModel = model
  })

export const setBatchSize = size =>
  set(state => {
    state.batchSize = size
  })

export const removeRound = id =>
  set(state => {
    state.feed = state.feed.filter(round => round.id !== id)
  })

export const reset = () => {
  set(state => {
    state.feed = []
  })
}

export const showFullscreen = url => {
  set(state => {
    state.fullscreenImageUrl = url
  })
}

export const hideFullscreen = () => {
  set(state => {
    state.fullscreenImageUrl = null
  })
}

export const setOutputEditing = (roundId, outputId, isEditing) => {
  set(state => {
    const round = state.feed.find(r => r.id === roundId)
    if (round) {
      const output = round.outputs.find(o => o.id === outputId)
      if (output) {
        output.isEditing = isEditing
      }
    }
  })
}

export const setUploadedImage = imageData => {
  const {batchModel} = get()
  const imageEditingModelKey = Object.keys(models).find(
    key => models[key].type === 'image-editing'
  )

  if (imageData) {
    if (models[batchModel].type !== 'image-editing') {
      set(state => {
        state.uploadedImage = imageData
        state.previousBatchModel = state.batchModel
        state.batchModel = imageEditingModelKey
      })
    } else {
      set(state => {
        state.uploadedImage = imageData
      })
    }
  } else {
    set(state => {
      state.uploadedImage = null
      if (state.previousBatchModel) {
        state.batchModel = state.previousBatchModel
        state.previousBatchModel = null
      }
    })
  }
}

export const startAiEditing = (roundId, outputId) => {
  const round = get().feed.find(r => r.id === roundId)
  if (!round) return
  const output = round.outputs.find(o => o.id === outputId)
  if (!output || !output.outputData) return

  set(state => {
    state.aiEditingOutput = {
      roundId,
      outputId,
      imageData: output.outputData
    }
  })
}

export const cancelAiEditing = () => {
  set(state => {
    state.aiEditingOutput = null
  })
}

export const applyAiEdit = async editPrompt => {
  const {aiEditingOutput} = get()
  if (!aiEditingOutput) return

  const {roundId, outputId, imageData} = aiEditingOutput

  const newImageData = await llmGen({
    model: 'gemini-2.5-flash-image-preview',
    prompt: editPrompt,
    image: imageData
  })

  set(state => {
    const round = state.feed.find(r => r.id === roundId)
    if (round) {
      const output = round.outputs.find(o => o.id === outputId)
      if (output) {
        output.outputData = newImageData
        output.prompt += ` | Edited with: ${editPrompt}`
      }
    }

    if (state.aiEditingOutput) {
      state.aiEditingOutput.imageData = newImageData
    }
  })
}
