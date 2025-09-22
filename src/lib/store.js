/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import 'immer'
import {create} from 'zustand'
import {immer} from 'zustand/middleware/immer'
import {persist} from 'zustand/middleware'
import {createSelectorFunctions} from 'auto-zustand-selectors-hook'
import modes from './modes'
import models from './models'
import layouts from './layouts'

export default createSelectorFunctions(
  create(
    persist(
      immer(() => ({
        didInit: false,
        feed: [],
        history: [],
        isHistoryVisible: false,
        outputMode: Object.keys(modes)[0],
        layout: 'no-preference',
        batchMode: true,
        batchSize: 3,
        batchModel: Object.keys(models)[0],
        versusModels: {},
        fullscreenImageUrl: null,
        uploadedImage: null,
        previousBatchModel: null,
        aiEditingOutput: null
      })),
      {
        name: 'thumbnail-safi-store',
        partialize: state => ({ feed: state.feed, history: state.history }),
      }
    )
  )
)
