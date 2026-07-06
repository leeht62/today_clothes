import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { paymentAPI } from '../lib/api'

const PaymentFail = () => {
  const [searchParams] = useSearchParams()
  const [message, setMessage] = useState(searchParams.get('message') || '결제가 취소되었거나 실패했습니다.')

  useEffect(() => {
    const orderId = searchParams.get('orderId')

    if (!orderId) {
      return
    }

    const markPaymentFailed = async () => {
      try {
        await paymentAPI.paymentFail(orderId)
      } catch (err) {
        console.error('결제 실패 처리 실패:', err)
        setMessage(err.response?.data?.message || err.response?.data || '결제 실패 처리에 실패했습니다.')
      }
    }

    markPaymentFailed()
  }, [searchParams])

  return (
    <div className="mx-auto max-w-lg bg-white p-8 text-center shadow">
      <p className="text-sm font-medium text-red-600">Payment</p>
      <h1 className="mt-2 text-3xl font-bold text-gray-900">결제 실패</h1>
      <p className="mt-4 text-sm text-gray-600">{message}</p>

      <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
        <Link
          to="/orders"
          className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
        >
          내 주문 보기
        </Link>
        <Link
          to="/posts"
          className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          게시글로 이동
        </Link>
      </div>
    </div>
  )
}

export default PaymentFail
