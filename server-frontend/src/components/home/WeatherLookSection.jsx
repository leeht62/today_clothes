import { Link } from 'react-router-dom'
import { getAiComment, getBase64ImageSrc, getWeatherText } from './homeUtils'

const WeatherLookSkeleton = () => (
  <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
    {Array.from({ length: 4 }).map((_, index) => (
      <div key={index} className="overflow-hidden rounded-xl bg-white shadow-sm">
        <div className="h-64 animate-pulse bg-gray-100" />
        <div className="space-y-3 p-4">
          <div className="h-5 animate-pulse rounded bg-gray-100" />
          <div className="h-4 animate-pulse rounded bg-gray-100" />
          <div className="h-4 w-24 animate-pulse rounded bg-gray-100" />
        </div>
      </div>
    ))}
  </div>
)

const WeatherLookCard = ({ look }) => {
  const weather = look.weather
  const imageUrl = getBase64ImageSrc(weather?.image)
  const weatherText = getWeatherText(weather)
  const aiComment = getAiComment(weather)

  return (
    <Link
      to={`/posts/${look.id}`}
      className="group overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-100 transition hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="relative h-64 bg-gray-100">
        {imageUrl ? (
          <img src={imageUrl} alt={look.title || 'Weather 기반 추천룩'} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center px-4 text-center text-sm text-gray-500">
            Weather 이미지 없음
          </div>
        )}
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-blue-700 shadow-sm">
          Weather
        </span>
      </div>

      <div className="p-4">
        <h3 className="line-clamp-1 text-base font-bold text-gray-950 group-hover:text-blue-600">
          {look.title || '제목 없는 추천룩'}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-gray-500">
          {aiComment || weatherText || look.content || '추천 설명이 없습니다.'}
        </p>
        <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
          <span>{look.name || look.userCode || '익명'}</span>
          <span className="font-semibold text-gray-700">좋아요 {look.likeCount ?? 0}</span>
        </div>
      </div>
    </Link>
  )
}

const WeatherLookSection = ({ looks, loading }) => {
  if (loading) {
    return <WeatherLookSkeleton />
  }

  if (looks.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-gray-200 bg-white px-6 py-12 text-center text-sm text-gray-500">
        Weather가 연결된 인기 일반 게시글이 아직 없습니다.
      </div>
    )
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {looks.map((look) => (
        <WeatherLookCard key={look.id} look={look} />
      ))}
    </div>
  )
}

export default WeatherLookSection
