import { Link } from 'react-router-dom'
import { getAiComment, getBase64ImageSrc, getWeatherText } from './homeUtils'

const HeroSkeleton = () => (
  <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-center">
    <div className="space-y-6">
      <div className="h-6 w-48 animate-pulse rounded-full bg-blue-100" />
      <div className="space-y-3">
        <div className="h-12 w-full max-w-lg animate-pulse rounded bg-gray-200" />
        <div className="h-12 w-full max-w-md animate-pulse rounded bg-gray-200" />
      </div>
      <div className="h-16 w-full max-w-xl animate-pulse rounded bg-gray-100" />
    </div>
    <div className="h-96 animate-pulse rounded-2xl bg-white shadow-sm" />
  </div>
)

const HomeHero = ({ heroBoard, loading }) => {
  if (loading) {
    return (
      <section className="rounded-[2rem] bg-gradient-to-br from-blue-50 via-white to-slate-50 px-6 py-10 shadow-sm sm:px-10">
        <HeroSkeleton />
      </section>
    )
  }

  const weather = heroBoard?.weather
  const weatherImageUrl = getBase64ImageSrc(weather?.image)
  const weatherText = getWeatherText(weather)
  const aiComment = getAiComment(weather)

  return (
    <section className="overflow-hidden rounded-[2rem] bg-gradient-to-br from-blue-50 via-white to-slate-50 px-6 py-10 shadow-sm sm:px-10">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_400px] lg:items-center">
        <div>
          <span className="inline-flex rounded-full bg-white px-3 py-1 text-sm font-semibold text-blue-600 shadow-sm ring-1 ring-blue-100">
            AI가 추천하는 오늘의 스타일
          </span>

          <h1 className="mt-6 max-w-3xl text-4xl font-extrabold leading-tight text-gray-950 sm:text-5xl">
            오늘 날씨에 맞는 옷,
            <span className="block text-blue-600">AI가 추천하고 바로 구매하세요</span>
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-7 text-gray-600">
            날씨 분석 기반 AI 스타일 추천부터
            <br />
            개인 취향과 스타일 분석, 그리고 쇼핑까지
            <br />
            모두 한 곳에서 경험하세요.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              to={heroBoard?.id ? `/posts/${heroBoard.id}` : '/posts'}
              className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
            >
              AI 추천 스타일 받기
            </Link>
            <Link
              to="/posts"
              className="inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              마켓 둘러보기
            </Link>
          </div>
        </div>

        <article className="rounded-2xl border border-white bg-white/90 p-5 shadow-xl shadow-blue-100/60">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-blue-600">오늘의 AI 추천 스타일 요약</p>
              <h2 className="mt-1 line-clamp-2 text-xl font-bold text-gray-950">
                {heroBoard?.title || '아직 추천할 스타일 게시글이 없어요'}
              </h2>
            </div>
            <span className="shrink-0 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
              Weather
            </span>
          </div>

          <div className="mt-5 overflow-hidden rounded-xl bg-gray-100">
            {weatherImageUrl ? (
              <img src={weatherImageUrl} alt="AI 추천 스타일" className="h-72 w-full object-cover" />
            ) : (
              <div className="flex h-72 items-center justify-center px-6 text-center text-sm text-gray-500">
                게시글에 연결된 Weather 이미지가 없습니다.
              </div>
            )}
          </div>

          <div className="mt-5 space-y-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Weather 요약</p>
              <p className="mt-1 line-clamp-3 text-sm leading-6 text-gray-600">
                {weatherText || '게시글에 저장된 Weather 요약이 없습니다.'}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">AI 스타일 코멘트</p>
              <p className="mt-1 line-clamp-3 text-sm leading-6 text-gray-600">
                {aiComment || heroBoard?.content || '추천 코멘트가 준비되지 않았습니다.'}
              </p>
            </div>
          </div>
        </article>
      </div>
    </section>
  )
}

export default HomeHero
