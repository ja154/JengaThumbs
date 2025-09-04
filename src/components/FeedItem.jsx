/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import {useState} from 'react'
import c from 'clsx'
import JSZip from 'jszip'
import {addRound, removeRound} from '../lib/actions'
import modes from '../lib/modes'
import layouts from '../lib/layouts'
import ModelOutput from './ModelOutput'

export default function FeedItem({round, onModifyPrompt}) {
  const [showSystemInstruction, setShowSystemInstruction] = useState(false)

  const isImageOutputMode = modes[round.outputMode]?.imageOutput
  const downloadableOutputs = round.outputs.filter(
    output => output.outputData && !output.isBusy && !output.gotError
  )

  const handleDownloadAll = () => {
    if (!isImageOutputMode || downloadableOutputs.length === 0) {
      return
    }

    const zip = new JSZip()

    downloadableOutputs.forEach((output, i) => {
      const base64Data = output.outputData.split(',')[1]
      const mimeType =
        output.outputData.match(/data:(.*);base64,/)?.[1] || 'image/jpeg'
      const fileExtension = mimeType.split('/')[1] || 'jpeg'
      zip.file(`thumbnail-${i + 1}.${fileExtension}`, base64Data, {base64: true})
    })

    zip.generateAsync({type: 'blob'}).then(content => {
      const link = document.createElement('a')
      link.href = URL.createObjectURL(content)
      const safePrompt = round.prompt
        .replace(/[^a-zA-Z0-9\s]/g, '')
        .replace(/\s+/g, '_')
        .substring(0, 30)
      link.download = `thumbnailsafi_batch_${safePrompt}.zip`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(link.href)
    })
  }

  return (
    <li key={round.id}>
      <div className={c('header', {anchorTop: showSystemInstruction})}>
        <h3 className={c({anchorTop: showSystemInstruction})}>
          {round.uploadedImage && (
            <div className="sourceImage">
              <img src={round.uploadedImage} alt="Source" />
              <div className="tooltip right">Source Image</div>
            </div>
          )}
          <div className="chip">
            {modes[round.outputMode].emoji} {modes[round.outputMode].name}
          </div>
          {round.layout &&
            layouts[round.layout] &&
            round.layout !== 'no-preference' && (
              <div className="chip">
                {layouts[round.layout].emoji} {layouts[round.layout].name}
              </div>
            )}
          <div className="prompt">
            {showSystemInstruction && (
              <p className="systemInstruction" style={{whiteSpace: 'pre-wrap'}}>
                {round.systemInstruction}
                {round.layout &&
                  layouts[round.layout] &&
                  layouts[round.layout].instruction &&
                  `\n\nLayout instruction: ${layouts[round.layout].instruction}`}
              </p>
            )}
            <p>{round.prompt}</p>
          </div>
        </h3>
        <div className="actions">
          <button
            className="iconButton"
            onClick={() => setShowSystemInstruction(!showSystemInstruction)}
          >
            <span className="icon">assignment</span>
            <span className="tooltip">
              {showSystemInstruction ? 'Hide' : 'Show'} system instruction
            </span>
          </button>

          <button className="iconButton" onClick={() => removeRound(round.id)}>
            <span className="icon">delete</span>
            <span className="tooltip">Remove</span>
          </button>

          <button
            className="iconButton"
            onClick={() => onModifyPrompt(round.prompt)}
          >
            <span className="icon">edit</span>
            <span className="tooltip">Modify prompt</span>
          </button>

          {isImageOutputMode && (
            <button
              className="iconButton"
              onClick={handleDownloadAll}
              disabled={downloadableOutputs.length === 0}
            >
              <span className="icon">folder_zip</span>
              <span className="tooltip">
                {downloadableOutputs.length > 0
                  ? `Download ${downloadableOutputs.length} image${
                      downloadableOutputs.length > 1 ? 's' : ''
                    } as ZIP`
                  : 'No images to download'}
              </span>
            </button>
          )}

          <button className="iconButton" onClick={() => addRound(round.prompt)}>
            <span className="icon">refresh</span>
            <span className="tooltip">Re-run prompt</span>
          </button>
        </div>
      </div>

      <ul className="outputs">
        {round.outputs.map(output => (
          <li key={output.id}>
            <ModelOutput roundId={round.id} output={output} />
          </li>
        ))}
      </ul>
    </li>
  )
}