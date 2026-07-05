import { sellerProductAPI } from './api'

const DEFAULT_IMAGE_CONTENT_TYPE = 'application/octet-stream'

const getImageFileName = (file) => {
  if (file?.name) {
    return file.name
  }

  return `product-image-${Date.now()}`
}

const assertValidImageFile = (file) => {
  if (!file) {
    throw new Error('Image file is required.')
  }

  if (file.type && !file.type.startsWith('image/')) {
    throw new Error('Only image files can be uploaded.')
  }
}

const createProgressHandler = (onProgress) => {
  if (!onProgress) {
    return undefined
  }

  return (event) => {
    const total = event.total || 0
    const loaded = event.loaded || 0
    const percent = total > 0 ? Math.round((loaded / total) * 100) : 0

    onProgress({
      loaded,
      total,
      percent,
      event,
    })
  }
}

export const uploadProductOriginalImage = async (file, options = {}) => {
  assertValidImageFile(file)

  const fileName = options.fileName || getImageFileName(file)
  const contentType = options.contentType || file.type || DEFAULT_IMAGE_CONTENT_TYPE

  const presignedResponse = await sellerProductAPI.createPresignedUrl({
    fileName,
    contentType,
  })

  const presignedData = presignedResponse.data

  if (!presignedData?.uploadUrl || !presignedData?.objectKey) {
    throw new Error('Failed to create an image upload URL.')
  }

  await sellerProductAPI.uploadOriginalImage(
    presignedData.uploadUrl,
    file,
    contentType,
    {
      onUploadProgress: createProgressHandler(options.onProgress),
    }
  )

  return {
    ...presignedData,
    fileName,
    contentType,
    originalImageKey: presignedData.objectKey,
    originalImageUrl: presignedData.imageUrl,
  }
}
