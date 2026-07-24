import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { boardAPI, commentAPI, productAPI } from '../lib/api'
import { useAuth } from '../contexts/AuthContext'
import useWebSocket from '../hooks/WebSocket'
import useDiscountStockSocket from '../hooks/useDiscountStockSocket'

const formatPrice = (value) => {
  if (value === null || value === undefined) {
    return '-'
  }

  return `${Number(value).toLocaleString()}원`
}

const ProductImagePanel = ({ product }) => {
  const images = [
    product.aiImage
      ? {
          label: 'AI 이미지',
          src: product.aiImage,
          alt: `${product.name} AI 이미지`,
        }
      : null,
    product.originalImage
      ? {
          label: '원본 이미지',
          src: product.originalImage,
          alt: `${product.name} 원본 이미지`,
        }
      : null,
  ].filter(Boolean)

  if (images.length === 0) {
    return (
      <div className="flex aspect-square items-center justify-center rounded-md bg-gray-100 text-sm text-gray-500">
        이미지 없음
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {images.map((image) => (
        <div key={image.label} className="space-y-2">
          <p className="text-sm font-medium text-gray-700">{image.label}</p>
          <div className="relative aspect-square overflow-hidden rounded-md bg-gray-100">
            <img src={image.src} alt={image.alt} className="h-full w-full object-cover" />
            <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-medium text-gray-700 shadow">
              {image.label}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}

const getBase64ImageSrc = (base64String, format = 'jpeg') => {
  if (!base64String) return ''
  return `data:image/${format};base64,${base64String.replace(/\s/g, '')}`
}

const normalizeWeather = (weather) => {
  if (!weather) return null

  return {
    ...weather,
    weatherPrompt: weather.weatherPrompt || weather.weather_prompt || '',
    gptAnswer: weather.gptAnswer || weather.gpt_answer || '',
    image: weather.image || '',
  }
}

const PostDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { user, isAuthenticated } = useAuth()

  const [post, setPost] = useState(null)
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')
  const [editingCommentId, setEditingCommentId] = useState(null)
  const [editingCommentValue, setEditingCommentValue] = useState('')
  const [updatingCommentId, setUpdatingCommentId] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [orderType, setOrderType] = useState('NORMAL')
  const [loading, setLoading] = useState(true)
  const [orderSubmitting, setOrderSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [orderResult, setOrderResult] = useState(null)
  const [toasts, setToasts] = useState([])

  const notifications = useWebSocket(user?.token)
  const discountStockProductId = post?.product?.id || post?.productId
  const discountSocketEnabled = Boolean(post?.product?.discountedPrice)
  const { remainingStock: liveDiscountStock, connected: discountStockConnected } =
    useDiscountStockSocket(discountStockProductId, discountSocketEnabled)

  useEffect(() => {
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
  }, [notifications, id])

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true)
        setError('')
        const res = await boardAPI.getBoard(id)
        const nextPost = res.data

        if (nextPost?.productId) {
          try {
            const productResponse = await productAPI.getProduct(nextPost.productId)
            nextPost.product = {
              ...(nextPost.product || {}),
              ...productResponse.data,
            }
          } catch (productErr) {
            console.error('상품 상세 조회 실패:', productErr)
          }
        }

        setPost(nextPost)
        setOrderType('NORMAL')
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

  useEffect(() => {
    if (liveDiscountStock === null || liveDiscountStock === undefined) {
      return
    }

    setPost((prev) => {
      if (!prev?.product) {
        return prev
      }

      return {
        ...prev,
        product: {
          ...prev.product,
          discountedStock: liveDiscountStock,
        },
      }
    })
  }, [liveDiscountStock])

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

  const startEditComment = (comment) => {
    setEditingCommentId(comment.id)
    setEditingCommentValue(comment.comment || comment.content || '')
    setError('')
  }

  const cancelEditComment = () => {
    setEditingCommentId(null)
    setEditingCommentValue('')
  }

  const handleCommentUpdate = async (comment) => {
    if (!editingCommentValue.trim()) {
      setError('수정할 댓글 내용을 입력해주세요.')
      return
    }

    try {
      setUpdatingCommentId(comment.id)
      setError('')

      await commentAPI.updateBoardComment(id, comment.id, {
        ...comment,
        id: comment.id,
        comment: editingCommentValue.trim(),
        board: comment.board || { id: Number(id) },
      })

      setComments((prev) =>
        prev.map((item) =>
          item.id === comment.id ? { ...item, comment: editingCommentValue.trim() } : item
        )
      )
      cancelEditComment()
    } catch (err) {
      console.error('댓글 수정 실패:', err)
      setError(err.response?.data?.message || '댓글 수정에 실패했습니다.')
    } finally {
      setUpdatingCommentId(null)
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
    const hasDiscount = Number(product?.discountedPrice || 0) > 0

    if (!Number.isInteger(orderQuantity) || orderQuantity < 1) {
      setError('주문 수량은 1개 이상이어야 합니다.')
      return
    }

    if (orderType === 'DISCOUNT' && !hasDiscount) {
      setError('할인 구매가 가능한 상품이 아닙니다.')
      return
    }

    const currentDiscountStock = Number(liveDiscountStock ?? product?.discountedStock ?? 0)

    if (orderType === 'DISCOUNT' && currentDiscountStock < orderQuantity) {
      setError('남은 할인 재고보다 주문 수량이 많습니다.')
      return
    }

    try {
      setOrderSubmitting(true)
      setError('')
      setOrderResult(null)

      const clientKey = import.meta.env.VITE_TOSS_CLIENT_KEY

      if (!clientKey) {
        throw new Error('Toss Payments 클라이언트 키가 설정되지 않았습니다.')
      }

      if (!window.TossPayments) {
        throw new Error('Toss Payments SDK를 불러오지 못했습니다.')
      }

      const response = await boardAPI.createOrderFromBoard(id, {
        quantity: orderQuantity,
        orderType,
      })

      setOrderResult(response.data)

      const { payment } = response.data
      const tossPayments = window.TossPayments(clientKey)

      await tossPayments.requestPayment('카드', {
        amount: payment.amount,
        orderId: payment.tossOrderId,
        orderName: product?.name || post.title,
        customerName: user?.userName || user?.userCode || '고객',
        successUrl: `${window.location.origin}/payments/success`,
        failUrl: `${window.location.origin}/payments/fail`,
      })
    } catch (err) {
      console.error('주문 생성 실패:', err)
      setError(err.response?.data?.message || err.message || '주문 생성에 실패했습니다.')
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
  const weather = normalizeWeather(post.weather || location.state?.weather)
  const weatherImageUrl = weather?.image ? getBase64ImageSrc(weather.image) : ''
  const isProductPost = Boolean(post.productId || product)
  const postTypeLabel = isProductPost ? '상품 판매 게시글' : '일반 게시글'
  const hasDiscount = Number(product?.discountedPrice || 0) > 0
  const displayedDiscountStock = Number(liveDiscountStock ?? product?.discountedStock ?? 0)
  const isDiscountSoldOut = hasDiscount && displayedDiscountStock <= 0
  const selectedUnitPrice = orderType === 'DISCOUNT' && hasDiscount ? product.discountedPrice : product?.salePrice
  const orderTotalAmount = Number(selectedUnitPrice || 0) * Number(quantity || 0)

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
              <span
                className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${
                  isProductPost
                    ? 'bg-blue-50 text-blue-700 ring-blue-200'
                    : 'bg-gray-100 text-gray-700 ring-gray-200'
                }`}
              >
                {postTypeLabel}
              </span>
              <h1 className="mt-3 text-3xl font-bold text-gray-900">{post.title}</h1>
              {post.date && <p className="mt-2 text-sm text-gray-500">{new Date(post.date).toLocaleString()}</p>}
            </div>
            <button
              type="button"
              onClick={() => handlePostDelete(post.id)}
              className="shrink-0 rounded-md border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
            >
              게시글 삭제
            </button>
          </div>

          <p className="mt-6 whitespace-pre-wrap leading-7 text-gray-700">{post.content}</p>
        </article>

        <aside className="bg-white p-6 shadow">
          {isProductPost ? (
            <>
              <h2 className="text-lg font-semibold text-gray-900">상품 정보</h2>

              {product ? (
                <div className="mt-4 space-y-4">
                  <ProductImagePanel product={product} />

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
                    {hasDiscount && (
                      <>
                        <div>
                          <dt className="text-gray-500">할인가</dt>
                          <dd className="font-semibold text-red-600">{formatPrice(product.discountedPrice)}</dd>
                        </div>
                        <div>
                          <dt className="text-gray-500">할인 상태</dt>
                          <dd className="font-semibold text-red-600">할인 구매 가능</dd>
                        </div>
                      </>
                    )}
                  </dl>

                  {hasDiscount && (
                    <div
                      className={`rounded-md border px-3 py-2 text-sm ${
                        isDiscountSoldOut
                          ? 'border-red-200 bg-red-50 text-red-700'
                          : 'border-emerald-200 bg-emerald-50 text-emerald-700'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="font-medium">실시간 할인 재고</span>
                        <span className="text-base font-bold">{displayedDiscountStock}개</span>
                      </div>
                      <p className="mt-1 text-xs opacity-80">
                        {discountStockConnected ? 'WebSocket 연결 중' : '초기 재고 표시 중'}
                      </p>
                    </div>
                  )}

                  <div className="border-t border-gray-200 pt-4">
                    {hasDiscount && (
                      <div className="mb-4">
                        <span className="block text-sm font-medium text-gray-700">구매 방식</span>
                        <div className="mt-2 grid grid-cols-2 gap-2">
                          <label
                            className={`cursor-pointer rounded-md border px-3 py-2 text-sm ${
                              orderType === 'NORMAL'
                                ? 'border-blue-500 bg-blue-50 text-blue-700'
                                : 'border-gray-300 bg-white text-gray-700'
                            }`}
                          >
                            <input
                              type="radio"
                              name="orderType"
                              value="NORMAL"
                              checked={orderType === 'NORMAL'}
                              onChange={(event) => setOrderType(event.target.value)}
                              className="sr-only"
                            />
                            <span className="block font-semibold">일반 구매</span>
                            <span className="mt-1 block text-xs">{formatPrice(product.salePrice)}</span>
                          </label>

                          <label
                            className={`cursor-pointer rounded-md border px-3 py-2 text-sm ${
                              orderType === 'DISCOUNT'
                                ? 'border-red-500 bg-red-50 text-red-700'
                                : 'border-gray-300 bg-white text-gray-700'
                            }`}
                          >
                            <input
                              type="radio"
                              name="orderType"
                              value="DISCOUNT"
                              checked={orderType === 'DISCOUNT'}
                              disabled={isDiscountSoldOut}
                              onChange={(event) => setOrderType(event.target.value)}
                              className="sr-only"
                            />
                            <span className="block font-semibold">할인 구매</span>
                            <span className="mt-1 block text-xs">{formatPrice(product.discountedPrice)}</span>
                          </label>
                        </div>
                      </div>
                    )}

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

                    <div className="mt-3 rounded-md bg-gray-50 px-3 py-2 text-sm">
                      <div className="flex items-center justify-between text-gray-600">
                        <span>적용 단가</span>
                        <span>{formatPrice(selectedUnitPrice)}</span>
                      </div>
                      <div className="mt-1 flex items-center justify-between font-semibold text-gray-900">
                        <span>결제 예정 금액</span>
                        <span>{formatPrice(orderTotalAmount)}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleCreateOrder}
                      disabled={orderSubmitting || (orderType === 'DISCOUNT' && isDiscountSoldOut)}
                      className="mt-4 w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {orderSubmitting ? '주문 생성 중...' : orderType === 'DISCOUNT' ? '할인 주문하기' : '주문하기'}
                    </button>

                    {orderResult && (
                      <div className="mt-4 rounded-md border border-green-200 bg-green-50 p-4 text-sm text-green-800">
                        <p className="font-semibold">결제 대기 주문이 생성되었습니다.</p>
                        <p className="mt-1">결제를 완료해야 주문이 확정됩니다.</p>
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
                <div className="mt-4 rounded-md border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-800">
                  상품 번호는 있지만 상품 상세 정보를 불러오지 못했습니다.
                </div>
              )}
            </>
          ) : (
            <>
              <h2 className="text-lg font-semibold text-gray-900">AI 날씨 의상</h2>

              <div className="mt-4 space-y-4">
                <div className="overflow-hidden rounded-md bg-gray-100">
                  {weatherImageUrl ? (
                    <img src={weatherImageUrl} alt="AI 날씨 의상" className="w-full object-cover" />
                  ) : (
                    <div className="flex aspect-square items-center justify-center px-6 text-center text-sm text-gray-500">
                      연결된 날씨 이미지가 없습니다.
                    </div>
                  )}
                </div>

                {weather?.weatherPrompt && (
                  <div>
                    <p className="text-sm font-medium text-gray-700">날씨 정보</p>
                    <p className="mt-1 whitespace-pre-wrap text-sm text-gray-600">{weather.weatherPrompt}</p>
                  </div>
                )}

                {weather?.gptAnswer && (
                  <div>
                    <p className="text-sm font-medium text-gray-700">AI 추천</p>
                    <p className="mt-1 whitespace-pre-wrap text-sm text-gray-600">{weather.gptAnswer}</p>
                  </div>
                )}
              </div>
            </>
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
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900">{comment.user?.userCode || '익명'}</p>

                  {editingCommentId === comment.id ? (
                    <div className="mt-2 space-y-2">
                      <input
                        type="text"
                        value={editingCommentValue}
                        onChange={(event) => setEditingCommentValue(event.target.value)}
                        className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleCommentUpdate(comment)}
                          disabled={updatingCommentId === comment.id}
                          className="rounded-md bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {updatingCommentId === comment.id ? '저장 중...' : '저장'}
                        </button>
                        <button
                          type="button"
                          onClick={cancelEditComment}
                          disabled={updatingCommentId === comment.id}
                          className="rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          취소
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="mt-1 break-words text-gray-700">{comment.comment || comment.content}</p>
                  )}
                </div>
                {editingCommentId !== comment.id && (
                  <div className="flex shrink-0 items-center gap-2">
                    <button
                      type="button"
                      onClick={() => startEditComment(comment)}
                      className="text-sm font-medium text-blue-600 hover:text-blue-700"
                    >
                      수정
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCommentDelete(comment.id)}
                      className="text-sm font-medium text-red-600 hover:text-red-700"
                    >
                      삭제
                    </button>
                  </div>
                )}
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
            type="button"
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
