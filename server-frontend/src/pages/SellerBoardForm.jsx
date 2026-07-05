import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { boardAPI, sellerProductAPI } from '../lib/api'

const initialForm = {
  title: '',
  content: '',
  productId: '',
}

const getDisplayImage = (product) => product?.aiImage || product?.originalImage

const formatPrice = (value) => {
  if (value === null || value === undefined) {
    return '-'
  }

  return `${Number(value).toLocaleString()}원`
}

const SellerBoardForm = ({ onSubmitSuccess }) => {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const initialProductId = location.state?.productId ? String(location.state.productId) : ''

  const [formData, setFormData] = useState({
    ...initialForm,
    productId: initialProductId,
  })
  const [products, setProducts] = useState([])
  const [loadingProducts, setLoadingProducts] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoadingProducts(true)
        setError('')
        const response = await sellerProductAPI.getMyProducts()
        const myProducts = response.data || []
        setProducts(myProducts)

        if (!initialProductId && myProducts.length > 0) {
          setFormData((prev) => ({
            ...prev,
            productId: String(myProducts[0].id),
          }))
        }
      } catch (err) {
        console.error('상품 목록 조회 실패:', err)
        setError(err.response?.data?.message || '내 상품 목록을 불러오지 못했습니다.')
      } finally {
        setLoadingProducts(false)
      }
    }

    loadProducts()
  }, [])

  const selectedProduct = useMemo(
    () => products.find((product) => String(product.id) === String(formData.productId)),
    [products, formData.productId]
  )

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
      setError('로그인이 필요합니다.')
      return
    }

    if (!formData.productId) {
      setError('판매글에 연결할 상품을 선택해주세요.')
      return
    }

    setSubmitting(true)
    setError('')

    try {
      const response = await boardAPI.createSellerProductBoard({
        title: formData.title.trim(),
        content: formData.content.trim(),
        productId: Number(formData.productId),
      })

      navigate(`/posts/${response.data.id}`)

      if (onSubmitSuccess) {
        onSubmitSuccess()
      }
    } catch (err) {
      console.error('판매글 작성 실패:', err)
      setError(err.response?.data?.message || '판매글 작성에 실패했습니다.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-blue-600">Seller</p>
          <h1 className="text-3xl font-bold text-gray-900">판매글 작성</h1>
        </div>
        <Link
          to="/seller/products"
          className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          내 상품 목록
        </Link>
      </div>

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <section className="bg-white p-6 shadow">
          <div className="space-y-5">
            <label>
              <span className="block text-sm font-medium text-gray-700">연결 상품</span>
              <select
                name="productId"
                required
                value={formData.productId}
                onChange={handleChange}
                disabled={loadingProducts || products.length === 0}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100"
              >
                {loadingProducts ? (
                  <option value="">상품을 불러오는 중입니다</option>
                ) : products.length === 0 ? (
                  <option value="">등록된 상품이 없습니다</option>
                ) : (
                  products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name} - {formatPrice(product.salePrice)}
                    </option>
                  ))
                )}
              </select>
            </label>

            <label>
              <span className="block text-sm font-medium text-gray-700">제목</span>
              <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="판매글 제목을 입력하세요"
              />
            </label>

            <label>
              <span className="block text-sm font-medium text-gray-700">내용</span>
              <textarea
                name="content"
                rows={8}
                required
                value={formData.content}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="상품 설명, 착용감, 배송 안내 등을 작성하세요"
              />
            </label>
          </div>
        </section>

        <aside className="bg-white p-6 shadow">
          <h2 className="text-lg font-semibold text-gray-900">선택한 상품</h2>

          {selectedProduct ? (
            <div className="mt-4 space-y-4">
              <div className="relative aspect-square overflow-hidden rounded-md bg-gray-100">
                {getDisplayImage(selectedProduct) ? (
                  <img
                    src={getDisplayImage(selectedProduct)}
                    alt={selectedProduct.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-gray-500">
                    이미지 없음
                  </div>
                )}
                <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-medium text-gray-700 shadow">
                  {selectedProduct.aiImage ? 'AI 이미지' : '원본 이미지'}
                </span>
              </div>

              <div>
                <p className="text-base font-semibold text-gray-900">{selectedProduct.name}</p>
                <p className="mt-1 text-sm text-gray-500">{selectedProduct.category || '카테고리 없음'}</p>
              </div>

              <dl className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <dt className="text-gray-500">판매가</dt>
                  <dd className="font-semibold text-gray-900">{formatPrice(selectedProduct.salePrice)}</dd>
                </div>
                <div>
                  <dt className="text-gray-500">재고</dt>
                  <dd className="font-semibold text-gray-900">{selectedProduct.stock ?? 0}개</dd>
                </div>
              </dl>
            </div>
          ) : (
            <div className="mt-4 rounded-md border border-gray-200 bg-gray-50 px-4 py-8 text-center text-sm text-gray-500">
              판매글에 연결할 상품을 먼저 등록하거나 선택해주세요.
            </div>
          )}

          <button
            type="submit"
            disabled={submitting || loadingProducts || products.length === 0}
            className="mt-6 w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? '작성 중...' : '판매글 작성'}
          </button>
        </aside>
      </div>
    </form>
  )
}

export default SellerBoardForm
