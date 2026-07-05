import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { sellerProductAPI } from '../lib/api'
import { uploadProductOriginalImage } from '../lib/s3Upload'

const initialForm = {
  name: '',
  category: '',
  purchasePrice: '',
  salePrice: '',
  stock: '',
}

const SellerProductForm = () => {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [formData, setFormData] = useState(initialForm)
  const [imageFile, setImageFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [uploadProgress, setUploadProgress] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!imageFile) {
      setPreviewUrl('')
      return undefined
    }

    const nextPreviewUrl = URL.createObjectURL(imageFile)
    setPreviewUrl(nextPreviewUrl)

    return () => URL.revokeObjectURL(nextPreviewUrl)
  }, [imageFile])

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleImageChange = (event) => {
    const file = event.target.files?.[0]
    setError('')
    setUploadProgress(0)
    setImageFile(file || null)
  }

  const toNumber = (value) => Number(value || 0)

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!isAuthenticated) {
      setError('로그인이 필요합니다.')
      return
    }

    if (!imageFile) {
      setError('상품 기본 이미지를 등록해주세요.')
      return
    }

    setSubmitting(true)
    setError('')

    try {
      const uploadedImage = await uploadProductOriginalImage(imageFile, {
        onProgress: ({ percent }) => setUploadProgress(percent),
      })

      await sellerProductAPI.createProduct({
        name: formData.name.trim(),
        category: formData.category.trim(),
        purchasePrice: toNumber(formData.purchasePrice),
        salePrice: toNumber(formData.salePrice),
        stock: toNumber(formData.stock),
        originalImageKey: uploadedImage.originalImageKey,
      })

      navigate('/seller/products')
    } catch (err) {
      console.error('상품 등록 실패:', err)
      setError(err.response?.data?.message || err.message || '상품 등록에 실패했습니다.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-blue-600">Seller</p>
          <h1 className="text-3xl font-bold text-gray-900">상품 등록</h1>
        </div>
        <Link
          to="/seller/products"
          className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          내 상품 목록
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <section className="bg-white p-6 shadow">
          {error && (
            <div className="mb-5 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="grid gap-5 sm:grid-cols-2">
            <label className="sm:col-span-2">
              <span className="block text-sm font-medium text-gray-700">상품명</span>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="예: 린넨 셔츠"
              />
            </label>

            <label>
              <span className="block text-sm font-medium text-gray-700">카테고리</span>
              <input
                type="text"
                name="category"
                required
                value={formData.category}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="예: TOP"
              />
            </label>

            <label>
              <span className="block text-sm font-medium text-gray-700">재고</span>
              <input
                type="number"
                name="stock"
                min="0"
                required
                value={formData.stock}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="0"
              />
            </label>

            <label>
              <span className="block text-sm font-medium text-gray-700">매입가</span>
              <input
                type="number"
                name="purchasePrice"
                min="0"
                required
                value={formData.purchasePrice}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="0"
              />
            </label>

            <label>
              <span className="block text-sm font-medium text-gray-700">판매가</span>
              <input
                type="number"
                name="salePrice"
                min="0"
                required
                value={formData.salePrice}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="0"
              />
            </label>
          </div>
        </section>

        <aside className="bg-white p-6 shadow">
          <label>
            <span className="block text-sm font-medium text-gray-700">기본 이미지</span>
            <input
              type="file"
              accept="image/*"
              required
              onChange={handleImageChange}
              className="mt-2 block w-full text-sm text-gray-700 file:mr-4 file:rounded-md file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-blue-700 hover:file:bg-blue-100"
            />
          </label>

          <div className="mt-4 aspect-square overflow-hidden rounded-md border border-gray-200 bg-gray-50">
            {previewUrl ? (
              <img src={previewUrl} alt="상품 이미지 미리보기" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center px-6 text-center text-sm text-gray-500">
                이미지를 선택하면 미리보기가 표시됩니다.
              </div>
            )}
          </div>

          {submitting && (
            <div className="mt-4">
              <div className="flex justify-between text-xs text-gray-600">
                <span>이미지 업로드</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-200">
                <div className="h-full bg-blue-600 transition-all" style={{ width: `${uploadProgress}%` }} />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="mt-6 w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? '등록 중...' : '상품 등록'}
          </button>
        </aside>
      </form>
    </div>
  )
}

export default SellerProductForm
