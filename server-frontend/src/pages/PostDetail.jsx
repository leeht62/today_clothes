import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { boardAPI, weatherAPI } from '../lib/api'
import { useLocation } from 'react-router-dom'

const PostDetail = () => {
  const { id } = useParams()
  const [post, setPost] = useState(null)
  const [weatherData, setWeatherData] = useState(null)
  const [loading, setLoading] = useState(true)

  // 게시글 불러오기
  useEffect(() => {
    const fetchPost = async () => {
      const res = await boardAPI.getBoard(id)
      setPost(res.data)
    }
    fetchPost()
  }, [id])

  // 날씨 이미지/설명 가져오기
  useEffect(() => {
    if (post?.weatherId) {
      const fetchWeather = async () => {
        const res = await weatherAPI.getWeather(post.weatherId)
        setWeatherData(res.data)
      }
      fetchWeather()
    }
  }, [post])

  // Base64 이미지 src 변환
  const getBase64ImageSrc = (base64) => `data:image/png;base64,${base64}`

  if (!post) return <div>게시글이 존재하지 않습니다.</div>

  return (
    <div className="space-y-4">
      <div className="bg-white p-6 rounded-lg shadow">
        <h1 className="text-2xl font-bold">{post.title}</h1>
        <p className="text-gray-600">{post.content}</p>
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
                날씨: {weatherData.weather_prompt}°C
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default PostDetail
