/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, {useEffect, useState, useCallback, useRef} from 'react'
import shuffle from 'lodash.shuffle'
import c from 'clsx'
import modes from '../lib/modes'
import models from '../lib/models'
import layouts from '../lib/layouts'
import useStore from '../lib/store'
import {
  addRound,
  setOutputMode,
  setBatchSize,
  setBatchModel,
  reset,
  setLayout,
  setUploadedImage
} from '../lib/actions'
import {isTouch, isIframe} from '../lib/consts'
import FeedItem from './FeedItem'
import Intro from './Intro'
import FullscreenViewer from './FullscreenViewer'
import ImageUploader from './ImageUploader'

function EditingTools({onModifyPrompt}) {
  const tools = [
    {label: 'Change background', prompt: 'Change the background to '},
    {label: 'Remove something', prompt: 'Remove the '},
    {label: 'Add something', prompt: 'Add a '},
    {label: 'Change my clothes', prompt: 'Change my clothes to '},
    {label: 'Change expression', prompt: 'Make me look more '},
    {label: 'Apply a filter', prompt: 'Apply a filter, making it look '}
  ]

  return (
    <ul className="editing-tools">
      {tools.map(({label, prompt}) => (
        <li key={label}>
          <button onClick={() => onModifyPrompt(prompt)} className="chip">
            {label}
          </button>
        </li>
      ))}
    </ul>
  )
}

export default function App() {
  const feed = useStore.use.feed()
  const outputMode = useStore.use.outputMode()
  const batchModel = useStore.use.batchModel()
  const batchSize = useStore.use.batchSize()
  const layout = useStore.use.layout()
  const uploadedImage = useStore.use.uploadedImage()

  const [presets, setPresets] = useState([])
  const [showPresets, setShowPresets] = useState(false)
  const [showStyles, setShowStyles] = useState(false)
  const [showModels, setShowModels] = useState(false)
  const [showLayouts, setShowLayouts] = useState(false)
  const [isDark, setIsDark] = useState(true)

  const inputRef = useRef(null)

  const shufflePresets = useCallback(
    () => setPresets(shuffle(modes[outputMode].presets)),
    [outputMode]
  )

  const onModifyPrompt = useCallback(prompt => {
    inputRef.current.value = prompt
    inputRef.current.focus()
  }, [])

  const toggleTheme = useCallback(() => {
    setIsDark(!isDark)
  }, [isDark])

  const handleGenerate = useCallback(() => {
    const prompt = inputRef.current?.value
    if (prompt) {
      addRound(prompt)
      inputRef.current.blur()
    }
  }, [])

  const handlePromptFocus = useCallback(() => {
    if (inputRef.current?.value.trim() === '' && !uploadedImage) {
      setShowPresets(true)
    }
  }, [uploadedImage])

  const handlePromptBlur = useCallback(() => {
    // Delay to allow clicking on a preset
    setTimeout(() => {
      setShowPresets(false)
    }, 200)
  }, [])

  const handlePromptInput = useCallback(() => {
    if (inputRef.current) {
      setShowPresets(inputRef.current.value.trim() === '' && !uploadedImage)
    }
  }, [uploadedImage])

  useEffect(() => {
    shufflePresets()
  }, [shufflePresets])

  useEffect(() => {
    if (isTouch) {
      addEventListener('touchstart', () => {
        setShowStyles(false)
        setShowPresets(false)
        setShowModels(false)
        setShowLayouts(false)
      })
    }
  }, [])

  useEffect(() => {
    if (!isIframe) {
      document.documentElement.style.colorScheme = isDark ? 'dark' : 'light'
    }
  }, [isDark])

  return (
    <div className={isIframe ? '' : isDark ? 'dark' : 'light'}>
      <header>
        <div>
          <h1 className="logo">
            ThumbnailSafi <span>🖼️</span>
          </h1>
        </div>

        <div>
          <button
            className="circleButton resetButton"
            onClick={() => {
              reset()
              inputRef.current.value = ''
              setUploadedImage(null)
            }}
          >
            <span className="icon">replay</span>
          </button>
          <div className="label">Reset</div>
        </div>

        {!isIframe && (
          <div>
            <button className="circleButton resetButton" onClick={toggleTheme}>
              <span className="icon">
                {isDark ? 'light_mode' : 'dark_mode'}
              </span>
            </button>
            <div className="label">Theme</div>
          </div>
        )}
      </header>

      <main>
        <div className="intro-header">
          <h2>👋 Welcome to ThumbnailSafi 🖼️</h2>
          <p>
            Generate professional, eye-catching YouTube thumbnails in seconds.
            Just describe your video, pick a style, and let the AI do the work!
          </p>
        </div>
        <section className="input-area">
          <div>
            <ImageUploader />
            <div className="label">Source Image</div>
          </div>

          <div
            className="selectorWrapper prompt"
            onTouchStart={isTouch ? e => e.stopPropagation() : undefined}
          >
            <textarea
              className="promptInput"
              placeholder={
                uploadedImage
                  ? 'Describe edits for your image...'
                  : 'Describe your thumbnail...'
              }
              onFocus={handlePromptFocus}
              onBlur={handlePromptBlur}
              onInput={handlePromptInput}
              ref={inputRef}
              rows="3"
              onKeyDown={e => {
                if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                  e.preventDefault()
                  handleGenerate()
                }
              }}
            />
            {uploadedImage && <EditingTools onModifyPrompt={onModifyPrompt} />}
            <div
              className={c('selector', {
                active: showPresets && !uploadedImage
              })}
            >
              <ul className="presets wrapped">
                <li>
                  <button
                    onClick={() => {
                      const randomPrompt =
                        presets[Math.floor(Math.random() * presets.length)]
                          .prompt
                      onModifyPrompt(randomPrompt)
                      setShowPresets(false)
                    }}
                    className="chip primary"
                  >
                    <span className="icon">Ifl</span>
                    Random prompt
                  </button>
                </li>

                {presets.map(({label, prompt}) => (
                  <li key={label}>
                    <button
                      onClick={() => {
                        onModifyPrompt(prompt)
                        setShowPresets(false)
                      }}
                      className="chip"
                    >
                      {label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div className="label">Prompt</div>
          </div>

          <div className="flex-break"></div>

          <div
            className="selectorWrapper"
            onMouseEnter={!isTouch && (() => setShowStyles(true))}
            onMouseLeave={!isTouch && (() => setShowStyles(false))}
            onTouchStart={
              isTouch
                ? e => {
                    e.stopPropagation()
                    setShowStyles(s => !s)
                    setShowPresets(false)
                    setShowModels(false)
                    setShowLayouts(false)
                  }
                : null
            }
          >
            <p>
              {modes[outputMode].emoji} {modes[outputMode].name}
            </p>
            <div className={c('selector', {active: showStyles})}>
              <ul>
                {Object.keys(modes).map(key => (
                  <li key={key}>
                    <button
                      className={c('chip', {primary: key === outputMode})}
                      onClick={() => {
                        setOutputMode(key)
                        setShowStyles(false)
                      }}
                    >
                      {modes[key].emoji} {modes[key].name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div className="label">Style</div>
          </div>

          <div
            className="selectorWrapper"
            onMouseEnter={!isTouch && (() => setShowLayouts(true))}
            onMouseLeave={!isTouch && (() => setShowLayouts(false))}
            onTouchStart={
              isTouch
                ? e => {
                    e.stopPropagation()
                    setShowLayouts(s => !s)
                    setShowStyles(false)
                    setShowPresets(false)
                    setShowModels(false)
                  }
                : null
            }
          >
            <p>
              {layouts[layout].emoji} {layouts[layout].name}
            </p>
            <div className={c('selector', {active: showLayouts})}>
              <ul>
                {Object.keys(layouts).map(key => (
                  <li key={key}>
                    <button
                      className={c('chip', {primary: key === layout})}
                      onClick={() => {
                        setLayout(key)
                        setShowLayouts(false)
                      }}
                    >
                      {layouts[key].emoji} {layouts[key].name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div className="label">Layout</div>
          </div>

          <div
            className={c('selectorWrapper', {disabled: uploadedImage})}
            onMouseEnter={!isTouch && (() => setShowModels(true))}
            onMouseLeave={!isTouch && (() => setShowModels(false))}
            onTouchStart={
              isTouch
                ? e => {
                    e.stopPropagation()
                    setShowModels(s => !s)
                    setShowStyles(false)
                    setShowPresets(false)
                    setShowLayouts(false)
                  }
                : null
            }
          >
            <p>{models[batchModel].name}</p>
            <div className={c('selector', {active: showModels})}>
              <ul>
                {Object.keys(models).map(key => (
                  <li key={key}>
                    <button
                      className={c('chip', {primary: key === batchModel})}
                      onClick={() => {
                        setBatchModel(key)
                        setShowModels(false)
                      }}
                    >
                      {models[key].name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div className="label">Model</div>
          </div>

          <div>
            <div className="rangeWrap">
              <div className="batchSize">
                <input
                  type="range"
                  min={1}
                  max={6}
                  value={batchSize}
                  onChange={e => setBatchSize(e.target.valueAsNumber)}
                />{' '}
                {batchSize}
              </div>
            </div>
            <div className="label">Variations</div>
          </div>

          <div className="flex-break"></div>

          <div>
            <button
              className="button primary generate-button"
              onClick={handleGenerate}
            >
              <span className="icon">auto_awesome</span> Generate
            </button>
          </div>
        </section>
        {feed.length ? (
          <ul className="feed">
            {feed.map(round => (
              <FeedItem
                key={round.id}
                round={round}
                onModifyPrompt={onModifyPrompt}
              />
            ))}
          </ul>
        ) : (
          <Intro onModifyPrompt={onModifyPrompt} />
        )}
      </main>
      <FullscreenViewer />
    </div>
  )
}