/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, {useState} from 'react'
import shuffle from 'lodash.shuffle'
import modes from '../lib/modes'
import {setOutputMode} from '../lib/actions'
import useStore from '../lib/store'

export default function Intro({onModifyPrompt}) {
  const [presets] = useState(
    Object.fromEntries(
      Object.entries(modes).map(([key, mode]) => [
        key,
        shuffle(mode.presets.slice(0, 50))
      ])
    )
  )

  return (
    <section className="intro">
      <p>Or, try a preset prompt below to get started:</p>

      {Object.entries(modes).map(([key, mode]) => (
        <div key={key}>
          <h3>
            {mode.emoji} {mode.name} Style
          </h3>

          <div className="selector presetList">
            <ul className="presets wrapped">
              {presets[key].map(({label, prompt}) => (
                <li key={label}>
                  <button
                    onClick={() => {
                      setOutputMode(key)
                      onModifyPrompt(prompt)
                      scrollTo({top: 0, left: 0, behavior: 'smooth'})
                    }}
                    className="chip"
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </section>
  )
}