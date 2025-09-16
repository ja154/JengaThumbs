/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, {useState, useRef, useCallback} from 'react'
import ReactCrop, {centerCrop, makeAspectCrop} from 'react-image-crop'
import useStore from '../lib/store'
import {setUploadedImage} from '../lib/actions'

export default function ImageUploader() {
  const uploadedImage = useStore.use.uploadedImage()
  const [imgSrc, setImgSrc] = useState('')
  const imgRef = useRef(null)
  const [crop, setCrop] = useState()
  const [completedCrop, setCompletedCrop] = useState(null)

  const processFile = useCallback(file => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.addEventListener('load', () =>
        setImgSrc(reader.result.toString() || ''),
      )
      reader.readAsDataURL(file)
    }
  }, [])

  const handleFileChange = useCallback(
    e => {
      if (e.target.files && e.target.files.length > 0) {
        processFile(e.target.files[0])
      }
    },
    [processFile],
  )

  const handleDrop = useCallback(
    e => {
      e.preventDefault()
      e.stopPropagation()
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        processFile(e.dataTransfer.files[0])
      }
    },
    [processFile],
  )

  const onImageLoad = e => {
    const {width, height} = e.currentTarget
    const crop = centerCrop(
      makeAspectCrop({unit: '%', width: 90}, 16 / 9, width, height),
      width,
      height,
    )
    setCrop(crop)
  }

  const handleCropImage = useCallback(() => {
    if (!completedCrop || !imgRef.current) {
      return
    }

    const image = imgRef.current
    const canvas = document.createElement('canvas')
    const scaleX = image.naturalWidth / image.width
    const scaleY = image.naturalHeight / image.height

    const targetWidth = 1280
    const targetHeight = 720

    canvas.width = targetWidth
    canvas.height = targetHeight

    const ctx = canvas.getContext('2d')
    if (!ctx) {
      return
    }

    const cropX = completedCrop.x * scaleX
    const cropY = completedCrop.y * scaleY
    const cropWidth = completedCrop.width * scaleX
    const cropHeight = completedCrop.height * scaleY

    ctx.drawImage(
      image,
      cropX,
      cropY,
      cropWidth,
      cropHeight,
      0,
      0,
      targetWidth,
      targetHeight,
    )

    const base64Image = canvas.toDataURL('image/jpeg', 0.95)
    setUploadedImage(base64Image)
    setImgSrc('')
  }, [completedCrop])

  const handleRemoveImage = useCallback(e => {
    e.stopPropagation()
    setUploadedImage(null)
    const input = document.getElementById('image-upload-input')
    if (input) input.value = ''
  }, [])

  const handleCancelCrop = () => {
    setImgSrc('')
    const input = document.getElementById('image-upload-input')
    if (input) input.value = ''
  }

  const handleDragOver = useCallback(e => {
    e.preventDefault()
    e.stopPropagation()
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
    <>
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
      {imgSrc && (
        <div className="fullscreen-overlay">
          <div className="crop-modal">
            <h3>Crop Image to 16:9</h3>
            <div className="crop-container">
              <ReactCrop
                crop={crop}
                onChange={(_, percentCrop) => setCrop(percentCrop)}
                onComplete={c => setCompletedCrop(c)}
                aspect={16 / 9}
                minWidth={100}
              >
                <img
                  ref={imgRef}
                  alt="Crop me"
                  src={imgSrc}
                  onLoad={onImageLoad}
                />
              </ReactCrop>
            </div>
            <div className="crop-actions">
              <button className="button minor" onClick={handleCancelCrop}>
                Cancel
              </button>
              <button className="button primary" onClick={handleCropImage}>
                <span className="icon">crop</span> Crop & Use
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}