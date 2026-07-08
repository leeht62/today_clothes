export const getBase64ImageSrc = (base64String, format = 'jpeg') => {
  if (!base64String) return ''

  if (base64String.startsWith('http') || base64String.startsWith('data:image')) {
    return base64String
  }

  return `data:image/${format};base64,${base64String.replace(/\s/g, '')}`
}

export const getProductImage = (product) => product?.displayImage || product?.aiImage || product?.originalImage || ''

export const formatPrice = (value) => {
  if (value === null || value === undefined || value === '') {
    return '-'
  }

  return `${Number(value).toLocaleString()}원`
}

export const getWeatherText = (weather) =>
  weather?.weatherPrompt || weather?.weather_prompt || weather?.gptAnswer || weather?.gpt_answer || ''

export const getAiComment = (weather) => weather?.gptAnswer || weather?.gpt_answer || ''
