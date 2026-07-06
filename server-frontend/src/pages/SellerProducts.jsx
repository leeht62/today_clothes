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

const toNumber = (value) => Number(value || 0)

const SellerProducts = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [generatingProductId, setGeneratingProductId] = useState(null)
  const [deletingProductId, setDeletingProductId] = useState(null)
  const [activeManageProductId, setActiveManageProductId] = useState(null)
  const [activeManageMode, setActiveManageMode] = useState('edit')
  const [savingProductId, setSavingProductId] = useState(null)
  const [editForms, setEditForms] = useState({})
  const [stockForms, setStockForms] = useState({})
  const [discountForms, setDiscountForms] = useState({})
  const [aiImageErrors, setAiImageErrors] = useState({})

  const loadProducts = async () => {
    try {
      setLoading(true)
      setError('')
      setMessage('')
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

  const openManagePanel = (product, mode) => {
    const shouldClose = activeManageProductId === product.id && activeManageMode === mode

    if (shouldClose) {
      setActiveManageProductId(null)
      return
    }

    setActiveManageProductId(product.id)
    setActiveManageMode(mode)
    setError('')
    setMessage('')

    setEditForms((prev) => ({
      ...prev,
      [product.id]: prev[product.id] || {
        name: product.name || '',
        category: product.category || '',
        salePrice: product.salePrice ?? '',
        status: product.status || 'ACTIVE',
      },
    }))

    setStockForms((prev) => ({
      ...prev,
      [product.id]: prev[product.id] || {
        quantity: '',
        note: '',
      },
    }))

    setDiscountForms((prev) => ({
      ...prev,
      [product.id]: prev[product.id] || {
        discountedStock: product.discountedStock ?? '',
        discountedPrice: product.discountedPrice ?? '',
      },
    }))
  }

  const updateFormValue = (setter, productId, name, value) => {
    setter((prev) => ({
      ...prev,
      [productId]: {
        ...(prev[productId] || {}),
        [name]: value,
      },
    }))
  }

  const handleUpdateProduct = async (productId) => {
    const form = editForms[productId]

    if (!form?.name?.trim()) {
      setError('상품명을 입력해주세요.')
      return
    }

    try {
      setSavingProductId(productId)
      setError('')
      setMessage('')

      const payload = {
        name: form.name.trim(),
        category: form.category.trim(),
        salePrice: toNumber(form.salePrice),
        status: form.status,
      }

      await sellerProductAPI.updateProduct(productId, payload)

      setProducts((prev) =>
        prev.map((product) => (product.id === productId ? { ...product, ...payload } : product))
      )
      setMessage('상품 정보가 수정되었습니다.')
      setActiveManageProductId(null)
    } catch (err) {
      console.error('상품 수정 실패:', err)
      setError(err.response?.data?.message || '상품 수정에 실패했습니다.')
    } finally {
      setSavingProductId(null)
    }
  }

  const handleStockIn = async (productId) => {
    const form = stockForms[productId]
    const quantity = toNumber(form?.quantity)

    if (quantity <= 0) {
      setError('입고 수량은 1개 이상이어야 합니다.')
      return
    }

    try {
      setSavingProductId(productId)
      setError('')
      setMessage('')

      await sellerProductAPI.stockIn(productId, {
        quantity,
        note: form.note?.trim() || '판매자 입고',
      })

      setProducts((prev) =>
        prev.map((product) =>
          product.id === productId ? { ...product, stock: (product.stock ?? 0) + quantity } : product
        )
      )
      setStockForms((prev) => ({
        ...prev,
        [productId]: {
          quantity: '',
          note: '',
        },
      }))
      setMessage('상품 재고가 입고되었습니다.')
      setActiveManageProductId(null)
    } catch (err) {
      console.error('상품 입고 실패:', err)
      setError(err.response?.data?.message || '상품 입고에 실패했습니다.')
    } finally {
      setSavingProductId(null)
    }
  }

  const handleStartDiscount = async (productId) => {
    const form = discountForms[productId]
    const discountedStock = toNumber(form?.discountedStock)
    const discountedPrice = toNumber(form?.discountedPrice)

    if (discountedStock <= 0) {
      setError('할인 재고는 1개 이상이어야 합니다.')
      return
    }

    if (discountedPrice <= 0) {
      setError('할인가는 1원 이상이어야 합니다.')
      return
    }

    try {
      setSavingProductId(productId)
      setError('')
      setMessage('')

      await sellerProductAPI.startDiscount(productId, {
        discountedStock,
        discountedPrice,
      })

      setProducts((prev) =>
        prev.map((product) =>
          product.id === productId ? { ...product, discountedStock, discountedPrice } : product
        )
      )
      setMessage('할인 판매가 설정되었습니다.')
      setActiveManageProductId(null)
    } catch (err) {
      console.error('할인 설정 실패:', err)
      setError(err.response?.data?.message || '할인 설정에 실패했습니다.')
    } finally {
      setSavingProductId(null)
    }
  }

  const handleDeleteProduct = async (product) => {
    const confirmed = window.confirm(`'${product.name}' 상품을 삭제하시겠습니까?`)

    if (!confirmed) {
      return
    }

    setDeletingProductId(product.id)
    setError('')

    try {
      await sellerProductAPI.deleteProduct(product.id)
      setProducts((prev) => prev.filter((item) => item.id !== product.id))
      setAiImageErrors((prev) => {
        const nextErrors = { ...prev }
        delete nextErrors[product.id]
        return nextErrors
      })
    } catch (err) {
      console.error('상품 삭제 실패:', err)
      setError(err.response?.data?.message || '상품 삭제에 실패했습니다.')
    } finally {
      setDeletingProductId(null)
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

      {message && (
        <div className="rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {message}
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
            const isDeleting = deletingProductId === product.id
            const isSaving = savingProductId === product.id
            const isManaging = activeManageProductId === product.id
            const editForm = editForms[product.id] || {}
            const stockForm = stockForms[product.id] || {}
            const discountForm = discountForms[product.id] || {}
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
                    <div>
                      <dt className="text-gray-500">할인가</dt>
                      <dd className="font-semibold text-gray-900">{formatPrice(product.discountedPrice)}</dd>
                    </div>
                    <div>
                      <dt className="text-gray-500">할인 재고</dt>
                      <dd className="font-semibold text-gray-900">{product.discountedStock ?? 0}개</dd>
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

                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => openManagePanel(product, 'edit')}
                      disabled={isDeleting || isGenerating || isSaving}
                      className="rounded-md border border-gray-300 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500"
                    >
                      수정
                    </button>
                    <button
                      type="button"
                      onClick={() => openManagePanel(product, 'stock')}
                      disabled={isDeleting || isGenerating || isSaving}
                      className="rounded-md border border-gray-300 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500"
                    >
                      입고
                    </button>
                    <button
                      type="button"
                      onClick={() => openManagePanel(product, 'discount')}
                      disabled={isDeleting || isGenerating || isSaving}
                      className="rounded-md border border-gray-300 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500"
                    >
                      할인
                    </button>
                  </div>

                  {isManaging && (
                    <div className="rounded-md border border-gray-200 bg-gray-50 p-4">
                      {activeManageMode === 'edit' && (
                        <div className="space-y-3">
                          <label>
                            <span className="block text-xs font-medium text-gray-600">상품명</span>
                            <input
                              type="text"
                              value={editForm.name || ''}
                              onChange={(event) =>
                                updateFormValue(setEditForms, product.id, 'name', event.target.value)
                              }
                              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                          </label>
                          <label>
                            <span className="block text-xs font-medium text-gray-600">카테고리</span>
                            <input
                              type="text"
                              value={editForm.category || ''}
                              onChange={(event) =>
                                updateFormValue(setEditForms, product.id, 'category', event.target.value)
                              }
                              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                          </label>
                          <div className="grid grid-cols-2 gap-2">
                            <label>
                              <span className="block text-xs font-medium text-gray-600">판매가</span>
                              <input
                                type="number"
                                min="0"
                                value={editForm.salePrice ?? ''}
                                onChange={(event) =>
                                  updateFormValue(setEditForms, product.id, 'salePrice', event.target.value)
                                }
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                              />
                            </label>
                            <label>
                              <span className="block text-xs font-medium text-gray-600">상태</span>
                              <select
                                value={editForm.status || 'ACTIVE'}
                                onChange={(event) =>
                                  updateFormValue(setEditForms, product.id, 'status', event.target.value)
                                }
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                              >
                                <option value="ACTIVE">ACTIVE</option>
                                <option value="INACTIVE">INACTIVE</option>
                                <option value="SOLD_OUT">SOLD_OUT</option>
                              </select>
                            </label>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleUpdateProduct(product.id)}
                            disabled={isSaving}
                            className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {isSaving ? '저장 중...' : '상품 정보 저장'}
                          </button>
                        </div>
                      )}

                      {activeManageMode === 'stock' && (
                        <div className="space-y-3">
                          <label>
                            <span className="block text-xs font-medium text-gray-600">입고 수량</span>
                            <input
                              type="number"
                              min="1"
                              value={stockForm.quantity || ''}
                              onChange={(event) =>
                                updateFormValue(setStockForms, product.id, 'quantity', event.target.value)
                              }
                              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                              placeholder="0"
                            />
                          </label>
                          <label>
                            <span className="block text-xs font-medium text-gray-600">메모</span>
                            <input
                              type="text"
                              value={stockForm.note || ''}
                              onChange={(event) =>
                                updateFormValue(setStockForms, product.id, 'note', event.target.value)
                              }
                              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                              placeholder="예: 신규 입고"
                            />
                          </label>
                          <button
                            type="button"
                            onClick={() => handleStockIn(product.id)}
                            disabled={isSaving}
                            className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {isSaving ? '입고 중...' : '재고 입고'}
                          </button>
                        </div>
                      )}

                      {activeManageMode === 'discount' && (
                        <div className="space-y-3">
                          <div className="grid grid-cols-2 gap-2">
                            <label>
                              <span className="block text-xs font-medium text-gray-600">할인 재고</span>
                              <input
                                type="number"
                                min="1"
                                value={discountForm.discountedStock ?? ''}
                                onChange={(event) =>
                                  updateFormValue(setDiscountForms, product.id, 'discountedStock', event.target.value)
                                }
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                placeholder="0"
                              />
                            </label>
                            <label>
                              <span className="block text-xs font-medium text-gray-600">할인가</span>
                              <input
                                type="number"
                                min="1"
                                value={discountForm.discountedPrice ?? ''}
                                onChange={(event) =>
                                  updateFormValue(setDiscountForms, product.id, 'discountedPrice', event.target.value)
                                }
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                placeholder="0"
                              />
                            </label>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleStartDiscount(product.id)}
                            disabled={isSaving}
                            className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {isSaving ? '설정 중...' : '할인 판매 설정'}
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => handleGenerateAiImage(product.id)}
                    disabled={isGenerating || isDeleting || !product.originalImage}
                    className="w-full rounded-md border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-100 disabled:cursor-not-allowed disabled:border-gray-200 disabled:bg-gray-100 disabled:text-gray-500"
                  >
                    {isGenerating ? 'AI 이미지 생성 중...' : product.aiImage ? 'AI 이미지 다시 생성' : 'AI 이미지 생성'}
                  </button>

                  <Link
                    to="/seller/boards/new"
                    state={{ productId: product.id }}
                    className={`block w-full rounded-md px-4 py-2 text-center text-sm font-semibold text-white ${
                      isDeleting ? 'pointer-events-none bg-gray-400' : 'bg-gray-900 hover:bg-gray-800'
                    }`}
                  >
                    이 상품으로 판매글 작성
                  </Link>

                  <button
                    type="button"
                    onClick={() => handleDeleteProduct(product)}
                    disabled={isDeleting || isGenerating}
                    className="w-full rounded-md border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:border-gray-200 disabled:bg-gray-100 disabled:text-gray-500"
                  >
                    {isDeleting ? '삭제 중...' : '상품 삭제'}
                  </button>
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
