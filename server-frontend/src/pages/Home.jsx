import { useEffect, useMemo, useState } from 'react'
import { boardAPI } from '../lib/api'
import HomeHero from '../components/home/HomeHero'
import HomeSectionHeader from '../components/home/HomeSectionHeader'
import PopularProductSection from '../components/home/PopularProductSection'
import WeatherLookSection from '../components/home/WeatherLookSection'

const TOP_BOARD_COUNT = 4

const getBoardId = (board) => board?.id || board?.boardId

const normalizeBoard = (board, detail, likeCount = 0) => ({
  ...board,
  ...detail,
  id: getBoardId(detail) || getBoardId(board),
  likeCount,
})

const Home = () => {
  const [generalLooks, setGeneralLooks] = useState([])
  const [popularProducts, setPopularProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadHomeBoards = async () => {
      try {
        setLoading(true)
        setError('')

        const [generalResponse, productResponse] = await Promise.all([
          boardAPI.getTopBoards({ count: TOP_BOARD_COUNT, type: 'GENERAL' }),
          boardAPI.getTopBoards({ count: TOP_BOARD_COUNT, type: 'PRODUCT' }),
        ])

        const enrichBoards = async (boards) => {
          const topBoards = (boards || []).slice(0, TOP_BOARD_COUNT)

          return Promise.all(
            topBoards.map(async (board) => {
              const boardId = getBoardId(board)

              if (!boardId) {
                return normalizeBoard(board, {}, board.likeCount ?? 0)
              }

              const [detailResult, likeResult] = await Promise.allSettled([
                boardAPI.getBoard(boardId),
                boardAPI.getBoardLikeCount(boardId),
              ])

              const detail = detailResult.status === 'fulfilled' ? detailResult.value.data : {}
              const likeCount =
                likeResult.status === 'fulfilled' ? likeResult.value.data ?? board.likeCount ?? 0 : board.likeCount ?? 0

              return normalizeBoard(board, detail, likeCount)
            })
          )
        }

        const [generalBoards, productBoards] = await Promise.all([
          enrichBoards(generalResponse.data || []),
          enrichBoards(productResponse.data || []),
        ])

        setGeneralLooks(generalBoards.filter((board) => board.weather && !board.productId && !board.product))
        setPopularProducts(productBoards.filter((board) => board.productId || board.product))
      } catch (err) {
        console.error('홈 데이터 로딩 실패:', err)
        setError('홈 화면 데이터를 불러오지 못했습니다.')
      } finally {
        setLoading(false)
      }
    }

    loadHomeBoards()
  }, [])

  const heroBoard = useMemo(
    () => generalLooks.find((board) => board.weather) || generalLooks[0] || null,
    [generalLooks]
  )

  return (
    <div className="space-y-14">
      <HomeHero heroBoard={heroBoard} loading={loading} />

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <section className="space-y-5">
        <HomeSectionHeader
          eyebrow="Style Board"
          title="Weather 기반 추천룩"
          description="스타일 게시판에 공유된 일반 게시글 중 좋아요가 높은 추천룩을 보여드려요."
          actionLabel="스타일 게시판 보기"
          actionTo="/posts"
        />
        <WeatherLookSection looks={generalLooks} loading={loading} />
      </section>

      <section className="space-y-5">
        <HomeSectionHeader
          eyebrow="Market"
          title="판매 게시글 기반 인기 상품"
          description="판매 게시글에서 관심을 많이 받은 상품을 상위 4개만 골라 보여드려요."
          actionLabel="마켓 둘러보기"
          actionTo="/posts"
        />
        <PopularProductSection products={popularProducts} loading={loading} />
      </section>
    </div>
  )
}

export default Home
