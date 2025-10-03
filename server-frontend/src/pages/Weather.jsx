import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { weatherAPI } from '../lib/api'
import { useNavigate } from 'react-router-dom'

const Weather = () => {
  const [weatherData, setWeatherData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [allWeather, setAllWeather] = useState([])
  const [showAll, setShowAll] = useState(false)
  const navigate = useNavigate()
  
  const { isAuthenticated } = useAuth()

  // Base64 이미지 처리 함수
  const getBase64ImageSrc = (base64String, format = 'jpeg') => {
    if (!base64String) return ''
    const cleanString = base64String.replace(/\s/g, '') // 공백/줄바꿈 제거
    return `data:image/${format};base64,${cleanString}`
  }

  const handleGoToPost = (weatherData) => {
    console.log('우리가 봐야할 Weather ID:', weatherData.id)
    navigate('/posts', { state: { weatherData } })
  }

  const handleGetWeatherImage = async () => {
    if (!isAuthenticated) {
      setError('로그인이 필요합니다.')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await weatherAPI.getWeatherImage()
      setWeatherData(response.data)
    } catch (err) {
      setError('날씨 이미지 생성에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const handleGetAllWeather = async () => {
    setLoading(true)
    setError('')

    try {
      const response = await weatherAPI.getAllWeather()
      setAllWeather(response.data || [])
      setShowAll(true)
    } catch (err) {
      setError('날씨 데이터를 불러오는데 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">AI 날씨 의상 추천</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* AI 의상 이미지 생성 */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">AI 의상 이미지 생성</h2>
        <p className="text-gray-600 mb-4">
          현재 날씨를 기반으로 AI가 추천하는 의상을 생성합니다.
        </p>
        
        <button
          onClick={handleGetWeatherImage}
          disabled={loading || !isAuthenticated}
          className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? '생성 중...' : 'AI 의상 이미지 받기'}
        </button>

        {!isAuthenticated && (
          <p className="text-sm text-gray-500 mt-2">
            로그인이 필요한 기능입니다.
          </p>
        )}
      </div>

      {/* 생성된 이미지 */}
      {weatherData && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">생성된 의상 이미지</h3>
          <div className="space-y-4">
            {weatherData.image && (
              <img 
                src={getBase64ImageSrc(weatherData.image)} 
                alt="AI 추천 의상" 
                className="max-w-full h-auto rounded-lg"
              />
            )}
            {weatherData.weather_prompt && (
              <p className="text-sm text-gray-500">
                온도: {weatherData.weather_prompt}°C
              </p>
            )}
            <button
                  onClick={() => handleGoToPost(weatherData)}
                  className="mt-3 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
               게시글 작성하기
            </button>
                  
          </div>
        </div>
      )}

      {/* 모든 날씨 데이터 */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">모든 의상 데이터</h2>
        <p className="text-gray-600 mb-4">
          본인의 저장된 모든 의상 데이터를 확인할 수 있습니다.
        </p>
        
        <button
          onClick={handleGetAllWeather}
          disabled={loading}
          className="bg-gray-600 text-white px-6 py-3 rounded-md hover:bg-gray-700 disabled:opacity-50"
        >
          {loading ? '로딩 중...' : '모든 의상 데이터 보기'}
        </button>

        {showAll && allWeather.length > 0 && (
          <div className="mt-6 space-y-4">
            <h3 className="text-lg font-semibold">저장된 의상 데이터</h3>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {allWeather.map((weather, index) => (
                <div key={weather.id || index} className="border rounded-lg p-4">
                  <h4 className="font-medium">저장된 사진 #{index + 1}</h4>

                  {weather.image && (
                    <img 
                      src={getBase64ImageSrc(weather.image)} 
                      alt={`날씨 ${index + 1}`}
                      className="mt-2 w-full h-32 object-cover rounded"
                    />
                  )}
                  <button
                  onClick={() => handleGoToPost(weather)}
                  className="mt-3 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    게시글 작성하기
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {showAll && allWeather.length === 0 && (
          <div className="mt-6 text-center text-gray-500">
            저장된 의상 데이터가 없습니다.
          </div>
        )}
      </div>
    </div>
  )
}

export default Weather

