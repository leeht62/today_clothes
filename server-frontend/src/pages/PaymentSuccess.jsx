import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { paymentAPI } from '../lib/api'

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams()
  const [status, setStatus] = useState('loading')
  const [message, setMessage] = useState('결제를 승인하는 중입니다.')

  useEffect(() => {
    const confirmPayment = async () => {
      const orderId = searchParams.get('orderId')
      const paymentKey = searchParams.get('paymentKey')
      const amount = searchParams.get('amount')

      if (!orderId || !paymentKey || !amount) {
        setStatus('error')
        setMessage('결제 승인에 필요한 정보가 없습니다.')
        return
      }

      try {
        await paymentAPI.paymentSuccess({
          orderId,
          paymentKey,
          amount,
        })

        setStatus('success')
        setMessage('결제가 완료되었습니다.')
      } catch (err) {
        console.error('결제 승인 실패:', err)
        setStatus('error')
        setMessage(err.response?.data?.message || err.response?.data || '결제 승인에 실패했습니다.')
      }
    }

    confirmPayment()
  }, [searchParams])

  return (
    <div className="mx-auto max-w-lg bg-white p-8 text-center shadow">
      <p className={`text-sm font-medium ${status === 'error' ? 'text-red-600' : 'text-blue-600'}`}>
        Payment
      </p>
      <h1 className="mt-2 text-3xl font-bold text-gray-900">
        {status === 'loading' ? '결제 처리 중' : status === 'success' ? '결제 완료' : '결제 확인 실패'}
      </h1>
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

export default PaymentSuccess
