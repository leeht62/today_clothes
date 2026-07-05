import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { boardAPI, commentAPI } from '../lib/api'
import { useAuth } from '../contexts/AuthContext'
import useWebSocket from '../hooks/WebSocket'

const formatPrice = (value) => {
  if (value === null || value === undefined) {
    return '-'
  }

  return `${Number(value).toLocaleString()}원`
}

const getProductImage = (product) => product?.displayImage || product?.aiImage || product?.originalImage

const PostDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuth()

  const [post, setPost] = useState(null)
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)
  const [orderSubmitting, setOrderSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [orderResult, setOrderResult] = useState(null)
  const [toasts, setToasts] = useState([])

  const notifications = useWebSocket(user?.token)

  useEffect(() => {
    if (notifications.length > 0) {
      notifications.forEach((msg) => {
        if (msg.type === 'COMMENT' && msg.boardId === Number(id)) {
          const toast = {
            ...msg,
            id: Date.now() + Math.random(),
            displayMessage: msg.message,
          }

          setToasts([toast])
          setTimeout(() => setToasts([]), 5000)
        }
      })
    }
  }, [notifications, id])

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true)
        setError('')
        const res = await boardAPI.getBoard(id)
        setPost(res.data)
      } catch (err) {
        console.error('게시글 조회 실패:', err)
        setError('게시글을 불러오지 못했습니다.')
      } finally {
        setLoading(false)
      }
    }

    fetchPost()
  }, [id])

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await commentAPI.getComment(id)
        setComments(res.data || [])
      } catch (err) {
        console.error('댓글 불러오기 실패:', err)
      }
    }

    fetchComments()
  }, [id])

  const handleCommentSubmit = async () => {
    if (!newComment.trim()) return

    try {
      const res = await commentAPI.commentBoard(id, { comment: newComment })
      setComments((prev) => [...prev, res.data])
      setNewComment('')
    } catch (err) {
      console.error('댓글 작성 실패:', err)
      setError('댓글 작성에 실패했습니다.')
    }
  }

  const handleCommentDelete = async (commentId) => {
    try {
      await commentAPI.deleteComment(commentId)
      setComments((prev) => prev.filter((comment) => comment.id !== commentId))
    } catch (err) {
      console.error('댓글 삭제 실패:', err)
      setError('댓글 삭제에 실패했습니다.')
    }
  }

  const handlePostDelete = async (postId) => {
    try {
      await boardAPI.deleteBoard(postId)
      navigate('/posts')
    } catch (err) {
      console.error('게시글 삭제 실패:', err)
      setError('게시글 삭제에 실패했습니다.')
    }
  }

  const handleCreateOrder = async () => {
    if (!isAuthenticated) {
      setError('로그인이 필요합니다.')
      return
    }

    if (!post?.productId) {
      setError('주문할 상품 정보가 없습니다.')
      return
    }

    const orderQuantity = Number(quantity)

    if (!Number.isInteger(orderQuantity) || orderQuantity < 1) {
      setError('주문 수량은 1개 이상이어야 합니다.')
      return
    }

    try {
      setOrderSubmitting(true)
      setError('')
      setOrderResult(null)

      const response = await boardAPI.createOrderFromBoard(id, {
        quantity: orderQuantity,
        orderType: 'NORMAL',
      })

      setOrderResult(response.data)
    } catch (err) {
      console.error('주문 생성 실패:', err)
      setError(err.response?.data?.message || '주문 생성에 실패했습니다.')
    } finally {
      setOrderSubmitting(false)
    }
  }

  if (loading) {
    return <div className="bg-white p-10 text-center text-gray-500 shadow">게시글을 불러오는 중입니다.</div>
  }

  if (!post) {
    return <div className="bg-white p-10 text-center text-gray-500 shadow">게시글이 존재하지 않습니다.</div>
  }

  const product = post.product
  const imageUrl = getProductImage(product)

  return (
    <div className="space-y-6">
      {toasts.map((toast) => (
        <div key={toast.id} className="rounded-md border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">
          {toast.displayMessage}
        </div>
      ))}

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
        <article className="bg-white p-6 shadow">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{post.title}</h1>
              {post.date && <p className="mt-2 text-sm text-gray-500">{new Date(post.date).toLocaleString()}</p>}
            </div>
            <button
              onClick={() => handlePostDelete(post.id)}
              className="shrink-0 rounded-md border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
            >
              게시글 삭제
            </button>
          </div>

          <p className="mt-6 whitespace-pre-wrap leading-7 text-gray-700">{post.content}</p>
        </article>

        <aside className="bg-white p-6 shadow">
          <h2 className="text-lg font-semibold text-gray-900">상품 정보</h2>

          {product ? (
            <div className="mt-4 space-y-4">
              <div className="relative aspect-square overflow-hidden rounded-md bg-gray-100">
                {imageUrl ? (
                  <img src={imageUrl} alt={product.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-gray-500">이미지 없음</div>
                )}
                <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-medium text-gray-700 shadow">
                  {product.aiImage ? 'AI 이미지' : '원본 이미지'}
                </span>
              </div>

              <div>
                <p className="text-xl font-semibold text-gray-900">{product.name}</p>
                <p className="mt-1 text-sm text-gray-500">{product.category || '카테고리 없음'}</p>
              </div>

              <dl className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <dt className="text-gray-500">가격</dt>
                  <dd className="font-semibold text-gray-900">{formatPrice(product.salePrice)}</dd>
                </div>
                <div>
                  <dt className="text-gray-500">상품 번호</dt>
                  <dd className="font-semibold text-gray-900">{product.id}</dd>
                </div>
              </dl>

              <div className="border-t border-gray-200 pt-4">
                <label>
                  <span className="block text-sm font-medium text-gray-700">주문 수량</span>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(event) => setQuantity(event.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </label>

                <button
                  type="button"
                  onClick={handleCreateOrder}
                  disabled={orderSubmitting}
                  className="mt-4 w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {orderSubmitting ? '주문 생성 중...' : '주문하기'}
                </button>

                {orderResult && (
                  <div className="mt-4 rounded-md border border-green-200 bg-green-50 p-4 text-sm text-green-800">
                    <p className="font-semibold">주문이 생성되었습니다.</p>
                    <dl className="mt-3 grid grid-cols-2 gap-3">
                      <div>
                        <dt className="text-green-700">주문 번호</dt>
                        <dd className="font-semibold">{orderResult.order?.id}</dd>
                      </div>
                      <div>
                        <dt className="text-green-700">주문 상태</dt>
                        <dd className="font-semibold">{orderResult.order?.status || '-'}</dd>
                      </div>
                      <div>
                        <dt className="text-green-700">결제 번호</dt>
                        <dd className="font-semibold">{orderResult.payment?.id}</dd>
                      </div>
                      <div>
                        <dt className="text-green-700">결제 상태</dt>
                        <dd className="font-semibold">{orderResult.payment?.status || '-'}</dd>
                      </div>
                      <div className="col-span-2">
                        <dt className="text-green-700">결제 예정 금액</dt>
                        <dd className="font-semibold">
                          {formatPrice(orderResult.payment?.amount ?? orderResult.order?.totalAmount)}
                        </dd>
                      </div>
                    </dl>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="mt-4 rounded-md border border-gray-200 bg-gray-50 px-4 py-8 text-center text-sm text-gray-500">
              연결된 상품 정보가 없습니다.
            </div>
          )}
        </aside>
      </section>

      <section className="bg-white p-6 shadow">
        <h3 className="text-lg font-semibold text-gray-900">댓글</h3>

        {comments.length === 0 ? (
          <p className="mt-4 text-gray-500">댓글이 없습니다.</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {comments.map((comment) => (
              <li key={comment.id} className="flex items-start justify-between gap-4 border-b border-gray-200 pb-3">
                <div>
                  <p className="text-sm font-medium text-gray-900">{comment.user?.userCode || '익명'}</p>
                  <p className="mt-1 text-gray-700">{comment.comment || comment.content}</p>
                </div>
                <button
                  onClick={() => handleCommentDelete(comment.id)}
                  className="text-sm font-medium text-red-600 hover:text-red-700"
                >
                  삭제
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-5 flex gap-2">
          <input
            type="text"
            value={newComment}
            onChange={(event) => setNewComment(event.target.value)}
            placeholder="댓글을 입력하세요"
            className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <button
            onClick={handleCommentSubmit}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            작성
          </button>
        </div>
      </section>
    </div>
  )
}

export default PostDetail
