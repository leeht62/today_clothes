import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { orderAPI, paymentAPI } from '../lib/api'
import { useAuth } from '../contexts/AuthContext'

const formatPrice = (value) => {
  if (value === null || value === undefined) {
    return '-'
  }

  return `${Number(value).toLocaleString()}원`
}

const formatDateTime = (value) => {
  if (!value) {
    return '-'
  }

  return new Date(value).toLocaleString()
}

const orderStatusLabel = {
  PENDING: '결제 대기',
  PAID: '결제 완료',
  FAILED: '결제 실패',
  CANCELED: '주문 취소',
  EXPIRED: '주문 만료',
}

const paymentStatusLabel = {
  PENDING: '결제 대기',
  SUCCESS: '결제 완료',
  FAILED: '결제 실패',
  CANCELED: '결제 취소',
  REFUNDED: '환불 완료',
}

const getStatusClassName = (status) => {
  if (status === 'PAID' || status === 'SUCCESS') {
    return 'bg-green-50 text-green-700 ring-green-200'
  }

  if (status === 'FAILED' || status === 'CANCELED' || status === 'EXPIRED') {
    return 'bg-red-50 text-red-700 ring-red-200'
  }

  return 'bg-yellow-50 text-yellow-700 ring-yellow-200'
}

const MyOrders = () => {
  const { isAuthenticated } = useAuth()
  const [orders, setOrders] = useState([])
  const [paymentsByOrderId, setPaymentsByOrderId] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [cancelingOrderId, setCancelingOrderId] = useState(null)

  const loadOrders = async () => {
    if (!isAuthenticated) {
      return
    }

    try {
      setLoading(true)
      setError('')

      const orderResponse = await orderAPI.getMyOrders()
      const nextOrders = orderResponse.data || []
      setOrders(nextOrders)

      const paymentEntries = await Promise.all(
        nextOrders.map(async (order) => {
          try {
            const paymentResponse = await paymentAPI.getPaymentByOrderId(order.id)
            return [order.id, paymentResponse.data]
          } catch (err) {
            console.error('결제 조회 실패:', err)
            return [order.id, null]
          }
        })
      )

      setPaymentsByOrderId(Object.fromEntries(paymentEntries))
    } catch (err) {
      console.error('주문 목록 조회 실패:', err)
      setError(err.response?.data?.message || '주문 목록을 불러오지 못했습니다.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      loadOrders()
    }
  }, [isAuthenticated])

  const handleCancelOrder = async (orderId) => {
    const confirmed = window.confirm('이 주문을 취소하시겠습니까?')

    if (!confirmed) {
      return
    }

    try {
      setCancelingOrderId(orderId)
      setError('')
      await orderAPI.cancelOrder(orderId)

      setOrders((prev) =>
        prev.map((order) => (order.id === orderId ? { ...order, status: 'CANCELED' } : order))
      )
    } catch (err) {
      console.error('주문 취소 실패:', err)
      setError(err.response?.data?.message || '주문 취소에 실패했습니다.')
    } finally {
      setCancelingOrderId(null)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="bg-white p-10 text-center shadow">
        <p className="text-lg font-semibold text-gray-900">로그인이 필요합니다.</p>
        <Link
          to="/login"
          className="mt-5 inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
        >
          로그인
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-medium text-blue-600">Orders</p>
          <h1 className="text-3xl font-bold text-gray-900">내 주문 목록</h1>
        </div>
      </div>

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <span>{error}</span>
            <button type="button" onClick={loadOrders} className="text-left font-medium text-red-700 underline">
              다시 시도
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="bg-white p-10 text-center text-gray-500 shadow">주문 목록을 불러오는 중입니다.</div>
      ) : orders.length === 0 ? (
        <div className="bg-white p-10 text-center shadow">
          <p className="text-lg font-semibold text-gray-900">주문 내역이 없습니다.</p>
          <p className="mt-2 text-sm text-gray-500">상품 판매 게시글에서 주문하면 이곳에 표시됩니다.</p>
        </div>
      ) : (
        <div className="overflow-hidden bg-white shadow">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                <tr>
                  <th className="px-4 py-3">주문</th>
                  <th className="px-4 py-3">상품</th>
                  <th className="px-4 py-3">수량</th>
                  <th className="px-4 py-3">금액</th>
                  <th className="px-4 py-3">주문 상태</th>
                  <th className="px-4 py-3">결제 상태</th>
                  <th className="px-4 py-3">생성일</th>
                  <th className="px-4 py-3 text-right">관리</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {orders.map((order) => {
                  const payment = paymentsByOrderId[order.id]
                  const canCancel = order.status === 'PENDING'
                  const isCanceling = cancelingOrderId === order.id

                  return (
                    <tr key={order.id} className="align-top">
                      <td className="px-4 py-4 font-semibold text-gray-900">#{order.id}</td>
                      <td className="px-4 py-4 text-gray-700">상품 #{order.productId}</td>
                      <td className="px-4 py-4 text-gray-700">{order.quantity}</td>
                      <td className="px-4 py-4">
                        <div className="font-semibold text-gray-900">{formatPrice(order.totalAmount)}</div>
                        <div className="mt-1 text-xs text-gray-500">단가 {formatPrice(order.unitPrice)}</div>
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${getStatusClassName(
                            order.status
                          )}`}
                        >
                          {orderStatusLabel[order.status] || order.status}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        {payment ? (
                          <div className="space-y-1">
                            <span
                              className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${getStatusClassName(
                                payment.status
                              )}`}
                            >
                              {paymentStatusLabel[payment.status] || payment.status}
                            </span>
                            <div className="text-xs text-gray-500">결제 #{payment.id}</div>
                          </div>
                        ) : (
                          <span className="text-gray-500">-</span>
                        )}
                      </td>
                      <td className="px-4 py-4 text-gray-700">{formatDateTime(order.createdAt)}</td>
                      <td className="px-4 py-4 text-right">
                        <button
                          type="button"
                          onClick={() => handleCancelOrder(order.id)}
                          disabled={!canCancel || isCanceling}
                          className="rounded-md border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:border-gray-200 disabled:bg-gray-100 disabled:text-gray-500"
                        >
                          {isCanceling ? '취소 중...' : '주문 취소'}
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

export default MyOrders
