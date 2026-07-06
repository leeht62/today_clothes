import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { boardAPI, weatherAPI } from '../lib/api'

const initialPostForm = {
  title: '',
  content: '',
}

const getBase64ImageSrc = (base64String, format = 'jpeg') => {
  if (!base64String) return ''
  return `data:image/${format};base64,${base64String.replace(/\s/g, '')}`
}

const WeatherImageCard = ({ weather, title, onWritePost }) => {
  const imageUrl = getBase64ImageSrc(weather.image)

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
      {imageUrl ? (
        <img src={imageUrl} alt={title} className="h-64 w-full object-cover" />
      ) : (
        <div className="flex h-64 items-center justify-center bg-gray-100 text-sm text-gray-500">
          이미지가 없습니다
        </div>
      )}

      <div className="space-y-3 p-4">
        <h4 className="font-semibold text-gray-900">{title}</h4>
        {weather.weather_prompt && (
          <p className="line-clamp-3 text-sm text-gray-600">{weather.weather_prompt}</p>
        )}
        {weather.gpt_answer && (
          <p className="line-clamp-3 text-sm text-gray-500">{weather.gpt_answer}</p>
        )}
        <button
          type="button"
          onClick={() => onWritePost(weather)}
          disabled={!weather.id}
          className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          이 이미지로 게시글 작성
        </button>
      </div>
    </div>
  )
}

const Weather = () => {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()

  const [weatherData, setWeatherData] = useState(null)
  const [allWeather, setAllWeather] = useState([])
  const [showAll, setShowAll] = useState(false)
  const [selectedWeather, setSelectedWeather] = useState(null)
  const [postForm, setPostForm] = useState(initialPostForm)
  const [loading, setLoading] = useState(false)
  const [regenerating, setRegenerating] = useState(false)
  const [posting, setPosting] = useState(false)
  const [error, setError] = useState('')

  const handleGetWeatherImage = async () => {
    if (!isAuthenticated) {
      setError('로그인이 필요합니다.')
      return
    }

    try {
      setLoading(true)
      setError('')
      const response = await weatherAPI.getWeatherImage()
      setWeatherData(response.data)
    } catch (err) {
      console.error('AI 의상 이미지 생성 실패:', err)
      setError(err.response?.data?.message || 'AI 의상 이미지 생성에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const handleGetAllWeather = async () => {
    if (!isAuthenticated) {
      setError('로그인이 필요합니다.')
      return
    }

    try {
      setLoading(true)
      setError('')
      const response = await weatherAPI.getAllWeather()
      setAllWeather(response.data || [])
      setShowAll(true)
    } catch (err) {
      console.error('의상 데이터 조회 실패:', err)
      setError(err.response?.data?.message || '의상 데이터를 불러오지 못했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const handleRegenerateWeatherImage = async () => {
    if (!isAuthenticated) {
      setError('로그인이 필요합니다.')
      return
    }

    try {
      setRegenerating(true)
      setError('')
      const response = await weatherAPI.regenerateWeatherImage()
      setWeatherData(response.data)
      setSelectedWeather(null)

      if (showAll) {
        const allResponse = await weatherAPI.getAllWeather()
        setAllWeather(allResponse.data || [])
      }
    } catch (err) {
      console.error('AI 의상 이미지 재생성 실패:', err)
      setError(err.response?.data?.message || 'AI 의상 이미지 재생성에 실패했습니다.')
    } finally {
      setRegenerating(false)
    }
  }

  const openPostForm = (weather) => {
    setSelectedWeather(weather)
    setPostForm({
      title: '오늘 날씨 의상 추천',
      content: weather.gpt_answer || weather.weather_prompt || '',
    })
    setError('')
  }

  const handlePostFormChange = (event) => {
    const { name, value } = event.target
    setPostForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleCreateWeatherPost = async (event) => {
    event.preventDefault()

    if (!isAuthenticated) {
      setError('로그인이 필요합니다.')
      return
    }

    if (!selectedWeather?.id) {
      setError('게시글로 작성할 의상 데이터를 먼저 선택해주세요.')
      return
    }

    try {
      setPosting(true)
      setError('')
      const response = await boardAPI.createBoard({
        title: postForm.title.trim(),
        content: postForm.content.trim(),
        weatherId: selectedWeather.id,
        productId: null,
      })

      navigate(`/posts/${response.data.id}`, {
        state: {
          weather: selectedWeather,
        },
      })
    } catch (err) {
      console.error('날씨 의상 게시글 작성 실패:', err)
      setError(err.response?.data?.message || '게시글 작성에 실패했습니다.')
    } finally {
      setPosting(false)
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">AI 날씨 의상 추천</h1>

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <section className="rounded-lg bg-white p-6 shadow">
        <h2 className="text-xl font-semibold text-gray-900">AI 의상 이미지 생성</h2>
        <p className="mt-3 text-gray-600">
          현재 날씨를 기반으로 AI가 추천하는 의상 이미지를 생성합니다.
        </p>

        <div className="mt-5 flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={handleGetWeatherImage}
            disabled={loading || regenerating || !isAuthenticated}
            className="rounded-md bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? '생성 중...' : 'AI 의상 이미지 받기'}
          </button>

          <button
            type="button"
            onClick={handleRegenerateWeatherImage}
            disabled={loading || regenerating || !isAuthenticated}
            className="rounded-md border border-blue-200 bg-blue-50 px-6 py-3 text-sm font-semibold text-blue-700 hover:bg-blue-100 disabled:cursor-not-allowed disabled:border-gray-200 disabled:bg-gray-100 disabled:text-gray-500"
          >
            {regenerating ? '재생성 중...' : '캐시 삭제 후 재생성'}
          </button>
        </div>

        {!isAuthenticated && (
          <p className="mt-2 text-sm text-gray-500">로그인이 필요한 기능입니다.</p>
        )}
      </section>

      {weatherData && (
        <section className="rounded-lg bg-white p-6 shadow">
          <h3 className="text-lg font-semibold text-gray-900">생성된 의상 이미지</h3>
          <div className="mt-4 max-w-xl">
            <WeatherImageCard weather={weatherData} title="새로 생성한 의상" onWritePost={openPostForm} />
          </div>
        </section>
      )}

      <section className="rounded-lg bg-white p-6 shadow">
        <h2 className="text-xl font-semibold text-gray-900">모든 의상 데이터</h2>
        <p className="mt-3 text-gray-600">
          본인의 저장된 모든 의상 데이터를 확인하고 게시글로 작성할 수 있습니다.
        </p>

        <button
          type="button"
          onClick={handleGetAllWeather}
          disabled={loading || !isAuthenticated}
          className="mt-5 rounded-md bg-gray-600 px-6 py-3 text-sm font-semibold text-white hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? '로딩 중...' : '모든 의상 데이터 보기'}
        </button>

        {showAll && allWeather.length > 0 && (
          <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {allWeather.map((weather, index) => (
              <WeatherImageCard
                key={weather.id || index}
                weather={weather}
                title={`저장된 의상 #${index + 1}`}
                onWritePost={openPostForm}
              />
            ))}
          </div>
        )}

        {showAll && allWeather.length === 0 && (
          <div className="mt-6 rounded-md border border-gray-200 bg-gray-50 px-4 py-8 text-center text-sm text-gray-500">
            저장된 의상 데이터가 없습니다.
          </div>
        )}
      </section>

      {selectedWeather && (
        <section className="rounded-lg bg-white p-6 shadow">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">날씨 의상 게시글 작성</h2>
              <p className="mt-1 text-sm text-gray-500">선택한 AI 의상 이미지를 일반 게시글로 공유합니다.</p>
            </div>
            <button
              type="button"
              onClick={() => setSelectedWeather(null)}
              className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              닫기
            </button>
          </div>

          <form onSubmit={handleCreateWeatherPost} className="mt-5 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
            <div className="space-y-4">
              <label>
                <span className="block text-sm font-medium text-gray-700">제목</span>
                <input
                  type="text"
                  name="title"
                  required
                  value={postForm.title}
                  onChange={handlePostFormChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </label>

              <label>
                <span className="block text-sm font-medium text-gray-700">내용</span>
                <textarea
                  name="content"
                  rows={8}
                  required
                  value={postForm.content}
                  onChange={handlePostFormChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </label>

              <button
                type="submit"
                disabled={posting}
                className="rounded-md bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {posting ? '작성 중...' : '게시글 작성'}
              </button>
            </div>

            <div className="overflow-hidden rounded-md border border-gray-200 bg-gray-50">
              {selectedWeather.image ? (
                <img
                  src={getBase64ImageSrc(selectedWeather.image)}
                  alt="선택한 AI 의상"
                  className="h-full min-h-80 w-full object-cover"
                />
              ) : (
                <div className="flex min-h-80 items-center justify-center text-sm text-gray-500">
                  이미지가 없습니다
                </div>
              )}
            </div>
          </form>
        </section>
      )}
    </div>
  )
}

export default Weather
