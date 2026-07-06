import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { boardAPI } from '../lib/api'
import { useAuth } from '../contexts/AuthContext'
import useWebSocket from '../hooks/WebSocket'

const getPostType = (post) => {
  const isProductPost = Boolean(post.productId || post.product)

  return {
    isProductPost,
    label: isProductPost ? '상품 판매 게시글' : '일반 게시글',
    className: isProductPost
      ? 'bg-blue-50 text-blue-700 ring-blue-200'
      : 'bg-gray-100 text-gray-700 ring-gray-200',
  }
}

const PostList = () => {
  const { isAuthenticated, user } = useAuth()
  const navigate = useNavigate()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [toasts, setToasts] = useState([])
  const [activeType, setActiveType] = useState('general')

  const notifications = useWebSocket(user?.token)

  const loadPosts = async () => {
    try {
      setLoading(true)
      setError('')
      const response = await boardAPI.getBoards()
      const boards = response.data || []

      const boardsWithLikes = await Promise.all(
        boards.map(async (board) => {
          try {
            const res = await boardAPI.getBoardLikeCount(board.id)
            return { ...board, likeCount: res.data ?? 0 }
          } catch {
            return { ...board, likeCount: 0 }
          }
        })
      )

      setPosts(boardsWithLikes)
    } catch (err) {
      console.error('게시글 로딩 실패:', err)
      setError('게시글을 불러오지 못했습니다.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPosts()
  }, [])

  useEffect(() => {
    notifications.forEach((msg) => {
      if (msg.type === 'LIKE') {
        const toast = {
          ...msg,
          id: Date.now() + Math.random(),
          displayMessage: msg.message,
        }

        setToasts([toast])
        setTimeout(() => setToasts([]), 5000)
      }
    })
  }, [notifications])

  const handleLike = async (boardId) => {
    if (!isAuthenticated) {
      setError('로그인이 필요합니다.')
      return
    }

    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        String(post.id) === String(boardId)
          ? { ...post, likeCount: (post.likeCount ?? 0) + 1 }
          : post
      )
    )

    try {
      await boardAPI.likeBoard(boardId)
      const res = await boardAPI.getBoardLikeCount(boardId)

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          String(post.id) === String(boardId)
            ? { ...post, likeCount: res.data ?? post.likeCount }
            : post
        )
      )
    } catch (err) {
      console.error('좋아요 처리 실패:', err)
      setError('좋아요 처리에 실패했습니다.')

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          String(post.id) === String(boardId)
            ? { ...post, likeCount: Math.max((post.likeCount ?? 1) - 1, 0) }
            : post
        )
      )
    }
  }

  if (loading) {
    return <div className="py-12 text-center text-gray-500">게시글을 불러오는 중입니다.</div>
  }

  const filteredPosts = posts.filter((post) => {
    const { isProductPost } = getPostType(post)
    return activeType === 'product' ? isProductPost : !isProductPost
  })

  const generalCount = posts.filter((post) => !getPostType(post).isProductPost).length
  const productCount = posts.filter((post) => getPostType(post).isProductPost).length

  return (
    <div className="space-y-4">
      {toasts.map((toast) => (
        <div key={toast.id} className="rounded-md border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">
          {toast.displayMessage}
        </div>
      ))}

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <div className="flex items-center justify-between gap-3">
            <span>{error}</span>
            <button type="button" onClick={() => setError('')} className="font-medium underline">
              닫기
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setActiveType('general')}
          className={`rounded-md px-4 py-2 text-sm font-semibold ${
            activeType === 'general'
              ? 'bg-gray-900 text-white'
              : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          일반 게시글 {generalCount}
        </button>
        <button
          type="button"
          onClick={() => setActiveType('product')}
          className={`rounded-md px-4 py-2 text-sm font-semibold ${
            activeType === 'product'
              ? 'bg-gray-900 text-white'
              : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          상품 판매 게시글 {productCount}
        </button>
      </div>

      {filteredPosts.length === 0 ? (
        <div className="rounded-lg bg-white py-12 text-center text-gray-500 shadow">
          {activeType === 'product' ? '상품 판매 게시글이 없습니다.' : '일반 게시글이 없습니다.'}
        </div>
      ) : (
        filteredPosts.map((post) => {
          const postType = getPostType(post)

          return (
            <article key={post.id} className="rounded-lg bg-white p-6 shadow">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${postType.className}`}>
                    {postType.label}
                  </span>
                  <h3
                    className="mt-3 cursor-pointer text-xl font-semibold text-gray-900 hover:underline"
                    onClick={() => navigate(`/posts/${post.id}`)}
                  >
                    {post.title || '제목 없음'}
                  </h3>
                </div>
                <span className="text-sm text-gray-500">
                  {post.date ? new Date(post.date).toLocaleDateString() : ''}
                </span>
              </div>

              <p className="mt-3 line-clamp-2 text-gray-600">{post.content || '내용 없음'}</p>

              <div className="mt-5 flex items-center justify-between text-sm text-gray-500">
                <span>작성자: {post.userCode || post.name || '익명'}</span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleLike(post.id)}
                    className="font-medium text-red-500 transition-colors hover:text-red-700 disabled:text-gray-400"
                    disabled={!isAuthenticated}
                  >
                    좋아요
                  </button>
                  <span>좋아요 {post.likeCount ?? 0}</span>
                </div>
              </div>
            </article>
          )
        })
      )}
    </div>
  )
}

export default PostList
