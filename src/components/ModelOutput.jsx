/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import {useEffect, useState, memo} from 'react'
import c from 'clsx'
import models from '../lib/models'
import modes from '../lib/modes'
import {
  showFullscreen,
  setOutputEditing,
  regenerateOutput
} from '../lib/actions'
import Renderer from './Renderer'

function ModelOutput({roundId, output}) {
  const {
    id,
    model,
    outputData,
    outputMode,
    isBusy,
    startTime,
    totalTime,
    gotError,
    prompt,
    isEditing,
    caption,
    isGeneratingCaption,
    captionError
  } = output

  const [time, setTime] = useState(0)
  const [copied, setCopied] = useState(false)
  const [copiedStates, setCopiedStates] = useState({})
  const [editedPrompt, setEditedPrompt] = useState(prompt)
  const isImageOutput = modes[outputMode]?.imageOutput

  useEffect(() => {
    setEditedPrompt(prompt)
  }, [prompt])

  const copySource = () => {
    if (isImageOutput) {
      const byteString = atob(outputData.split(',')[1])
      const mimeString = outputData.split(',')[0].split(':')[1].split(';')[0]
      const ab = new ArrayBuffer(byteString.length)
      const ia = new Uint8Array(ab)

      byteString.split('').forEach((char, i) => (ia[i] = char.charCodeAt(0)))

      const item = new ClipboardItem({
        [mimeString]: new Blob([ab], {type: mimeString})
      })
      navigator.clipboard.write([item]).then(() => {
        setCopied(true)
        setTimeout(() => setCopied(false), 1000)
      })
    } else {
      navigator.clipboard.writeText(outputData.trim())
      setCopied(true)
      setTimeout(() => setCopied(false), 1000)
    }
  }

  const copyToClipboard = (text, key) => {
    if (!text) return
    navigator.clipboard.writeText(text.trim())
    setCopiedStates(prev => ({...prev, [key]: true}))
    setTimeout(() => {
      setCopiedStates(prev => ({...prev, [key]: false}))
    }, 2000)
  }

  useEffect(() => {
    let interval

    if (isBusy) {
      interval = setInterval(() => setTime(Date.now() - startTime), 10)
    } else {
      clearInterval(interval)
    }

    return () => clearInterval(interval)
  }, [startTime, isBusy])

  const handleRegenerate = () => {
    regenerateOutput(roundId, id, editedPrompt)
  }

  const handleCancel = () => {
    setEditedPrompt(prompt)
    setOutputEditing(roundId, id, false)
  }

  const parseCaption = captionStr => {
    if (!captionStr) return null

    const sections = {
      title: '',
      description: '',
      tags: ''
    }

    const titleMatch = captionStr.match(
      /🎬 Title\s*([\s\S]*?)(?=\n\n📝 Description|\n\n🏷️ Tags|$)/
    )
    if (titleMatch) sections.title = titleMatch[1].trim()

    const descriptionMatch = captionStr.match(
      /📝 Description \(SEO-Ready\)\s*([\s\S]*?)(?=\n\n🏷️ Tags|$)/
    )
    if (descriptionMatch) sections.description = descriptionMatch[1].trim()

    const tagsMatch = captionStr.match(/🏷️ Tags\s*([\s\S]*)$/)
    if (tagsMatch) sections.tags = tagsMatch[1].trim()

    if (!sections.title && !sections.description && !sections.tags) {
      return {raw: captionStr}
    }

    return sections
  }

  const parsedCaption = parseCaption(caption)

  const editorUi = (
    <div className="editorUi">
      <textarea
        value={editedPrompt}
        onChange={e => setEditedPrompt(e.target.value)}
        rows={5}
      />
      <div className="actions">
        <button className="button minor" onClick={handleCancel}>
          Cancel
        </button>
        <button className="button primary" onClick={handleRegenerate}>
          <span className="icon">auto_awesome</span> Regenerate
        </button>
      </div>
    </div>
  )

  const rendererUi = (
    <>
      {gotError && (
        <div className="error">
          <p>
            <span className="icon">error</span>
          </p>
          <p>Response error</p>
        </div>
      )}

      {isBusy && (
        <div className="loader">
          <span className="icon">hourglass</span>
        </div>
      )}

      {outputData && <Renderer mode={outputMode} code={outputData} />}
    </>
  )

  return (
    <div className="modelOutput">
      <div className="outputRendering">
        <div
          className={c('front', {'renderer-clickable': !isEditing})}
          onClick={() =>
            !isEditing && outputData && showFullscreen(outputData)
          }
        >
          {isEditing ? editorUi : rendererUi}
        </div>
      </div>

      <div className="modelInfo">
        <div className="modelName">
          <div>
            {models[model].name} v{models[model].version}
          </div>
          {(time || totalTime) && (
            <div className="timer">
              {((isBusy ? time : totalTime) / 1000).toFixed(2)}s
            </div>
          )}
        </div>

        <div className={c('outputActions', {active: outputData})}>
          {isImageOutput && (
            <a
              className="iconButton"
              href={outputData}
              download={`thumbnail-${Date.now()}.jpeg`}
            >
              <span className="icon">download</span>
              <span className="tooltip">Download image</span>
            </a>
          )}
          <button
            className="iconButton"
            onClick={() => setOutputEditing(roundId, id, true)}
          >
            <span className="icon">edit</span>
            <span className="tooltip">Edit and regenerate</span>
          </button>
          <button className="iconButton" onClick={copySource}>
            <span className="icon">content_copy</span>
            <span className="tooltip">
              {copied ? 'Copied!' : isImageOutput ? 'Copy image' : 'Copy code'}
            </span>
          </button>
        </div>
      </div>

      {(caption || isGeneratingCaption || captionError) && (
        <div className="captionContainer">
          {isGeneratingCaption ? (
            <p className="captionStatus">Generating caption...</p>
          ) : captionError ? (
            <p className="captionStatus error">Could not generate caption.</p>
          ) : parsedCaption ? (
            parsedCaption.raw ? (
              <div className="captionCard">
                <div className="captionHeader">
                  <h4>✍️ Suggested Caption</h4>
                  <button
                    className="iconButton"
                    onClick={() => copyToClipboard(parsedCaption.raw, 'raw')}
                  >
                    <span className="icon">content_copy</span>
                    <span className="tooltip right">
                      {copiedStates.raw ? 'Copied!' : 'Copy caption'}
                    </span>
                  </button>
                </div>
                <p className="captionText">{parsedCaption.raw}</p>
              </div>
            ) : (
              <>
                {parsedCaption.title && (
                  <div className="captionCard">
                    <div className="captionHeader">
                      <h4>🎬 Title</h4>
                      <button
                        className="iconButton"
                        onClick={() =>
                          copyToClipboard(parsedCaption.title, 'title')
                        }
                      >
                        <span className="icon">content_copy</span>
                        <span className="tooltip right">
                          {copiedStates.title ? 'Copied!' : 'Copy title'}
                        </span>
                      </button>
                    </div>
                    <p className="captionText">{parsedCaption.title}</p>
                  </div>
                )}
                {parsedCaption.description && (
                  <div className="captionCard">
                    <div className="captionHeader">
                      <h4>📝 Description</h4>
                      <button
                        className="iconButton"
                        onClick={() =>
                          copyToClipboard(
                            parsedCaption.description,
                            'description'
                          )
                        }
                      >
                        <span className="icon">content_copy</span>
                        <span className="tooltip right">
                          {copiedStates.description
                            ? 'Copied!'
                            : 'Copy description'}
                        </span>
                      </button>
                    </div>
                    <p className="captionText">{parsedCaption.description}</p>
                  </div>
                )}
                {parsedCaption.tags && (
                  <div className="captionCard">
                    <div className="captionHeader">
                      <h4>🏷️ Tags</h4>
                      <button
                        className="iconButton"
                        onClick={() =>
                          copyToClipboard(parsedCaption.tags, 'tags')
                        }
                      >
                        <span className="icon">content_copy</span>
                        <span className="tooltip right">
                          {copiedStates.tags ? 'Copied!' : 'Copy tags'}
                        </span>
                      </button>
                    </div>
                    <p className="captionText">{parsedCaption.tags}</p>
                  </div>
                )}
              </>
            )
          ) : null}
        </div>
      )}
    </div>
  )
}

export default memo(ModelOutput)
