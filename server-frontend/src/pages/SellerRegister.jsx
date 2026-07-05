import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { sellerAPI } from '../lib/api'
import { useAuth } from '../contexts/AuthContext'

const initialForm = {
  shopName: '',
  address: '',
  phone: '',
}

const SellerRegister = () => {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [formData, setFormData] = useState(initialForm)
  const [checking, setChecking] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isAuthenticated) {
      setChecking(false)
      return
    }

    const checkSeller = async () => {
      try {
        await sellerAPI.getMe()
        navigate('/seller/products', { replace: true })
      } catch (err) {
        if (err.response?.status === 401) {
          navigate('/login', { replace: true })
          return
        }

        setChecking(false)
      }
    }

    checkSeller()
  }, [isAuthenticated, navigate])

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!isAuthenticated) {
      navigate('/login')
      return
    }

    setSubmitting(true)
    setError('')

    try {
      await sellerAPI.register({
        shopName: formData.shopName.trim(),
        address: formData.address.trim(),
        phone: formData.phone.trim(),
      })

      navigate('/seller/products', { replace: true })
    } catch (err) {
      console.error('셀러 등록 실패:', err)
      setError(err.response?.data?.message || err.response?.data || '셀러 등록에 실패했습니다.')
    } finally {
      setSubmitting(false)
    }
  }

  if (checking) {
    return (
      <div className="bg-white p-10 text-center text-gray-500 shadow">
        셀러 정보를 확인하는 중입니다.
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="mx-auto max-w-md bg-white p-8 text-center shadow">
        <h1 className="text-2xl font-bold text-gray-900">로그인이 필요합니다</h1>
        <p className="mt-3 text-sm text-gray-600">셀러 등록은 로그인 후 진행할 수 있습니다.</p>
        <Link
          to="/login"
          className="mt-6 inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
        >
          로그인하기
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <p className="text-sm font-medium text-blue-600">Seller</p>
        <h1 className="text-3xl font-bold text-gray-900">셀러 등록</h1>
        <p className="mt-2 text-sm text-gray-600">
          상품을 등록하려면 먼저 판매자 정보를 등록해야 합니다.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 shadow">
        {error && (
          <div className="mb-5 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="space-y-5">
          <label>
            <span className="block text-sm font-medium text-gray-700">상점명</span>
            <input
              type="text"
              name="shopName"
              required
              value={formData.shopName}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="예: 오늘의 옷가게"
            />
          </label>

          <label>
            <span className="block text-sm font-medium text-gray-700">주소</span>
            <input
              type="text"
              name="address"
              required
              value={formData.address}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="예: 서울특별시 강남구"
            />
          </label>

          <label>
            <span className="block text-sm font-medium text-gray-700">연락처</span>
            <input
              type="tel"
              name="phone"
              required
              value={formData.phone}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="예: 010-1234-5678"
            />
          </label>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Link
            to="/seller/products"
            className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            취소
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? '등록 중...' : '셀러 등록'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default SellerRegister
