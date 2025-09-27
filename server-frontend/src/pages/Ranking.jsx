import { useEffect, useState } from 'react'
import { boardAPI } from '../lib/api'

const Ranking = () => {
  const [topBoards, setTopBoards] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [count, setCount] = useState(10)

  useEffect(() => {
    loadTopBoards()
  }, [count])

  const loadTopBoards = async () => {
    try {
      setLoading(true)
      const response = await boardAPI.getTopBoards(count)
      const boards = response.data || []

      // 각 게시글 좋아요 수 Redis에서 가져오기
      const boardsWithLikes = await Promise.all(
        boards.map(async (board) => {
          try {
            const res = await boardAPI.getBoardLikeCount(board.id || board.boardId)
            return { ...board, likeCount: res.data ?? 0 }
          } catch (err) {
            console.error('좋아요 수 가져오기 실패:', err)
            return { ...board, likeCount: board.likeCount ?? 0 }
          }
        })
      )

      setTopBoards(boardsWithLikes)
    } catch (err) {
      console.error(err)
      setError('순위 데이터를 불러오는데 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">로딩 중...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">실시간 순위</h1>
        <div className="flex items-center space-x-2">
          <label htmlFor="count" className="text-sm font-medium text-gray-700">
            표시 개수:
          </label>
          <select
            id="count"
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="border border-gray-300 rounded-md px-3 py-1 text-sm"
          >
            <option value={5}>5개</option>
            <option value={10}>10개</option>
            <option value={20}>20개</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {topBoards.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            순위 데이터가 없습니다.
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {topBoards.map((board, index) => (
              <div key={board.id || board.boardId} className="p-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                        {index + 1}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">
                        {board.title || board.boardTitle || '제목 없음'}
                      </h3>
                      <p className="text-sm text-gray-600 truncate">
                        {board.content || board.boardContent || '내용 없음'}
                      </p>
                      <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                        <span>작성자: {board.userCode || board.author || '익명'}</span>
                        <span>좋아요: {board.likeCount ?? 0}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">
                      {board.createdAt ? new Date(board.createdAt).toLocaleDateString() : ''}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">순위 기준</h3>
        <p className="text-blue-800">
          게시글의 좋아요 수와 최근 활동을 종합하여 실시간으로 순위가 결정됩니다.
        </p>
      </div>
    </div>
  )
}

export default Ranking

