import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { sellerProductAPI } from '../lib/api'

const formatPrice = (value) => {
  if (value === null || value === undefined) {
    return '-'
  }

  return `${Number(value).toLocaleString()}원`
}

const getDisplayImage = (product) => product.aiImage || product.originalImage

const SellerProducts = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [generatingProductId, setGeneratingProductId] = useState(null)
  const [aiImageErrors, setAiImageErrors] = useState({})

  const loadProducts = async () => {
    try {
      setLoading(true)
      setError('')
      const response = await sellerProductAPI.getMyProducts()
      setProducts(response.data || [])
    } catch (err) {
      console.error('내 상품 목록 조회 실패:', err)
      setError(err.response?.data?.message || '내 상품 목록을 불러오지 못했습니다.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProducts()
  }, [])

  const handleGenerateAiImage = async (productId) => {
    setGeneratingProductId(productId)
    setAiImageErrors((prev) => ({
      ...prev,
      [productId]: '',
    }))

    try {
      const response = await sellerProductAPI.generateAiImage(productId)
      const updatedProduct = response.data

      setProducts((prev) =>
        prev.map((product) => (product.id === productId ? { ...product, ...updatedProduct } : product))
      )
    } catch (err) {
      console.error('AI 이미지 생성 실패:', err)
      setAiImageErrors((prev) => ({
        ...prev,
        [productId]: err.response?.data?.message || 'AI 이미지 생성에 실패했습니다.',
      }))
    } finally {
      setGeneratingProductId(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-blue-600">Seller</p>
          <h1 className="text-3xl font-bold text-gray-900">내 상품 목록</h1>
        </div>
        <Link
          to="/seller/products/new"
          className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
        >
          상품 등록
        </Link>
      </div>

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <span>{error}</span>
            <button type="button" onClick={loadProducts} className="text-left font-medium text-red-700 underline">
              다시 시도
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="bg-white p-10 text-center text-gray-500 shadow">상품을 불러오는 중입니다.</div>
      ) : products.length === 0 ? (
        <div className="bg-white p-10 text-center shadow">
          <p className="text-lg font-semibold text-gray-900">등록된 상품이 없습니다.</p>
          <p className="mt-2 text-sm text-gray-500">첫 상품을 등록하고 판매글 작성 흐름을 시작하세요.</p>
          <Link
            to="/seller/products/new"
            className="mt-5 inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            상품 등록
          </Link>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => {
            const imageUrl = getDisplayImage(product)
            const isGenerating = generatingProductId === product.id
            const aiImageError = aiImageErrors[product.id]

            return (
              <article key={product.id} className="overflow-hidden bg-white shadow">
                <div className="relative aspect-square bg-gray-100">
                  {imageUrl ? (
                    <img src={imageUrl} alt={product.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-gray-500">
                      이미지 없음
                    </div>
                  )}
                  <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-medium text-gray-700 shadow">
                    {product.aiImage ? 'AI 이미지' : '원본 이미지'}
                  </span>
                </div>

                <div className="space-y-3 p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">{product.name}</h2>
                      <p className="mt-1 text-sm text-gray-500">{product.category || '카테고리 없음'}</p>
                    </div>
                    <span className="shrink-0 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">
                      {product.status || 'ACTIVE'}
                    </span>
                  </div>

                  <dl className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <dt className="text-gray-500">판매가</dt>
                      <dd className="font-semibold text-gray-900">{formatPrice(product.salePrice)}</dd>
                    </div>
                    <div>
                      <dt className="text-gray-500">재고</dt>
                      <dd className="font-semibold text-gray-900">{product.stock ?? 0}개</dd>
                    </div>
                  </dl>

                  <div className="flex items-center gap-2 text-xs">
                    <span className="rounded-full bg-green-50 px-2.5 py-1 font-medium text-green-700">
                      원본 이미지 등록됨
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-1 font-medium ${
                        product.aiImage ? 'bg-blue-50 text-blue-700' : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {product.aiImage ? 'AI 이미지 있음' : 'AI 이미지 없음'}
                    </span>
                  </div>

                  {aiImageError && (
                    <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
                      {aiImageError}
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => handleGenerateAiImage(product.id)}
                    disabled={isGenerating || !product.originalImage}
                    className="w-full rounded-md border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-100 disabled:cursor-not-allowed disabled:border-gray-200 disabled:bg-gray-100 disabled:text-gray-500"
                  >
                    {isGenerating ? 'AI 이미지 생성 중...' : product.aiImage ? 'AI 이미지 다시 생성' : 'AI 이미지 생성'}
                  </button>

                  <Link
                    to="/seller/boards/new"
                    state={{ productId: product.id }}
                    className="block w-full rounded-md bg-gray-900 px-4 py-2 text-center text-sm font-semibold text-white hover:bg-gray-800"
                  >
                    이 상품으로 판매글 작성
                  </Link>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default SellerProducts
