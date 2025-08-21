/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import {useEffect} from 'react'
import useStore from '../lib/store'
import {hideFullscreen} from '../lib/actions'

export default function FullscreenViewer() {
  const fullscreenImageUrl = useStore.use.fullscreenImageUrl()

  useEffect(() => {
    const handleKeyDown = e => {
      if (e.key === 'Escape') {
        hideFullscreen()
      }
    }

    if (fullscreenImageUrl) {
      window.addEventListener('keydown', handleKeyDown)
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [fullscreenImageUrl])

  if (!fullscreenImageUrl) {
    return null
  }

  return (
    <div className="fullscreen-overlay" onClick={hideFullscreen}>
      <img
        src={fullscreenImageUrl}
        alt="Fullscreen view of generated thumbnail"
        onClick={e => e.stopPropagation()}
      />
      <button className="iconButton close-button" onClick={hideFullscreen}>
        <span className="icon">close</span>
      </button>
    </div>
  )
}
