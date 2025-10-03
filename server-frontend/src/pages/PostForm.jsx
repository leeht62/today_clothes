import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { boardAPI } from '../lib/api'
import { useNavigate } from 'react-router-dom'

const PostForm = ({ weather, onSubmitSuccess }) => {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    weatherId: '',
    // 화면 표시용 데이터 (서버로 전송하지 않음)
    weather_prompt: '',
    gpt_answer: '',
    image: ''
  })

  useEffect(() => {
    if (weather) {
      console.log('전달받은 weather 객체:', weather) // 디버깅용
      console.log('weather.id:', weather.id) // 디버깅용
      
      setFormData(prev => ({
        ...prev,
        weatherId: weather.id,                    // 서버 전송용
        weather_prompt: weather.weather_prompt,   // 화면 표시용
        gpt_answer: weather.gpt_answer,          // 화면 표시용
        image: weather.image                     // 화면 표시용
      }))
    }
  }, [weather])

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!isAuthenticated) {
      setError('로그인이 필요합니다.')
      return
    }

    setSubmitting(true)
    setError('')
    
    try {
      // 서버로 전송할 데이터 (3개 필드만)
      const submitData = {
        title: formData.title,
        content: formData.content,
        weatherId: formData.weatherId
      }

      console.log('서버로 전송할 데이터:', submitData)
      console.log('weatherId 값:', formData.weatherId)
      console.log('weatherId 타입:', typeof formData.weatherId)

      const response = await boardAPI.createBoard(submitData)

      // PostDetail로 이동 (필요한 데이터만 전달)
      navigate(`/posts/${response.data.id}`)
      
      // 작성 완료 후 부모 컴포넌트에 알림
      if (onSubmitSuccess) {
        onSubmitSuccess()
      }
      
    } catch (err) {
      console.error('게시글 작성 오류:', err)
      setError('게시글 작성에 실패했습니다.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">새 게시글 작성</h2>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            제목
          </label>
          <input
            type="text"
            id="title"
            name="title"
            required
            value={formData.title}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="제목을 입력하세요"
          />
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700">
            내용
          </label>
          <textarea
            id="content"
            name="content"
            rows={4}
            required
            value={formData.content}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="내용을 입력하세요"
          />
        </div>

        {/* 날씨 정보 표시 (참고용) */}
        {formData.weather_prompt && (
          <div className="bg-gray-50 p-4 rounded-md">
            <p className="text-sm text-gray-600 font-medium mb-2">참고한 날씨 정보</p>
            <p className="text-gray-800">{formData.weather_prompt}</p>
            {formData.image && (
              <img 
                src={`data:image/jpeg;base64,${formData.image}`} 
                alt="날씨 이미지" 
                className="mt-3 w-40 h-40 object-cover rounded-md border" 
              />
            )}
          </div>
        )}

        <div className="flex justify-end space-x-3">
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? '작성 중...' : '게시글 작성'}
          </button>
        </div>
      </div>
    </form>
  )
}

export default PostForm