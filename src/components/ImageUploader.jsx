/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import {useCallback} from 'react'
import useStore from '../lib/store'
import {setUploadedImage} from '../lib/actions'

export default function ImageUploader() {
  const uploadedImage = useStore.use.uploadedImage()

  const handleFileChange = useCallback(e => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = () => {
        setUploadedImage(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }, [])

  const handleDrop = useCallback(e => {
    e.preventDefault()
    e.stopPropagation()
    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = () => {
        setUploadedImage(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }, [])

  const handleDragOver = useCallback(e => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleRemoveImage = useCallback(e => {
    e.stopPropagation()
    setUploadedImage(null)
    const input = document.getElementById('image-upload-input')
    if (input) {
      input.value = ''
    }
  }, [])

  if (uploadedImage) {
    return (
      <div className="imagePreview">
        <img src={uploadedImage} alt="Uploaded preview" />
        <button
          className="iconButton removeImageButton"
          onClick={handleRemoveImage}
        >
          <span className="icon">close</span>
          <span className="tooltip">Remove image</span>
        </button>
      </div>
    )
  }

  return (
    <div className="imageInput">
      <label
        htmlFor="image-upload-input"
        className="dropZone"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <span className="icon">upload_file</span>
        Upload Image
        <input
          id="image-upload-input"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{display: 'none'}}
        />
      </label>
    </div>
  )
}
