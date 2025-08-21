/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import useStore from './store'
import modes from './modes'
import llmGen from './llm'
import llmCaptionGen from './llm_caption'
import models from './models'

const get = useStore.getState
const set = useStore.setState

export const init = () => {
  if (get().didInit) {
    return
  }

  set(state => {
    state.didInit = true
  })
}

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

export const addRound = prompt => {
  scrollTo({top: 0, left: 0, behavior: 'smooth'})

  const {outputMode, batchSize, batchModel} = get()

  const systemInstruction = modes[outputMode].systemInstruction
  const fullPrompt = `${systemInstruction}\n\n${prompt}`

  const newRound = {
    prompt,
    systemInstruction,
    id: crypto.randomUUID(),
    createdAt: new Date(),
    outputMode,
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
      prompt: fullPrompt
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

  const systemInstruction = round.systemInstruction
  const fullPrompt = `${systemInstruction}\n\n${newPrompt}`

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
    prompt: fullPrompt
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

init()
