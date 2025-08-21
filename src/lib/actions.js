/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import useStore from './store'
import modes from './modes'
import llmGen from './llm'
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
  isEditing: false
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

  newRound.outputs.forEach(async (output, i) => {
    let res

    try {
      res = await llmGen({
        model: models[output.model].modelString,
        prompt: fullPrompt
      })
    } catch (e) {
      console.error(e)
      set(state => {
        const round = state.feed.find(round => round.id === newRound.id)
        if (!round) {
          return
        }
        round.outputs[i] = {
          ...output,
          isBusy: false,
          gotError: true,
          totalTime: Date.now() - output.startTime
        }
      })
      return
    }

    set(state => {
      const round = state.feed.find(round => round.id === newRound.id)

      if (!round) {
        return
      }

      round.outputs[i] = {
        ...output,
        outputData: res,
        isBusy: false,
        totalTime: Date.now() - output.startTime
      }
    })
  })

  set(state => {
    state.feed.unshift(newRound)
  })
}

export const regenerateOutput = async (roundId, outputId, newPrompt) => {
  const round = get().feed.find(r => r.id === roundId)
  if (!round) return

  const outputIndex = round.outputs.findIndex(o => o.id === outputId)
  if (outputIndex === -1) return

  const output = round.outputs[outputIndex]
  const systemInstruction = round.systemInstruction
  const fullPrompt = `${systemInstruction}\n\n${newPrompt}`

  set(state => {
    const round = state.feed.find(r => r.id === roundId)
    const output = round.outputs.find(o => o.id === outputId)
    output.isBusy = true
    output.gotError = false
    output.startTime = Date.now()
    output.prompt = newPrompt
  })

  let res
  try {
    res = await llmGen({
      model: models[output.model].modelString,
      prompt: fullPrompt
    })
  } catch (e) {
    console.error(e)
    set(state => {
      const round = state.feed.find(r => r.id === roundId)
      const output = round.outputs.find(o => o.id === outputId)
      output.isBusy = false
      output.gotError = true
      output.totalTime = Date.now() - output.startTime
      output.isEditing = false
    })
    return
  }

  set(state => {
    const round = state.feed.find(r => r.id === roundId)
    const output = round.outputs.find(o => o.id === outputId)
    output.outputData = res
    output.isBusy = false
    output.totalTime = Date.now() - output.startTime
    output.isEditing = false
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
