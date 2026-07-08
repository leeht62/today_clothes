import { Link } from 'react-router-dom'
import { formatPrice, getProductImage } from './homeUtils'

const ProductSkeleton = () => (
  <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
    {Array.from({ length: 4 }).map((_, index) => (
      <div key={index} className="overflow-hidden rounded-xl bg-white shadow-sm">
        <div className="h-56 animate-pulse bg-gray-100" />
        <div className="space-y-3 p-4">
          <div className="h-5 animate-pulse rounded bg-gray-100" />
          <div className="h-4 w-28 animate-pulse rounded bg-gray-100" />
          <div className="h-4 w-20 animate-pulse rounded bg-gray-100" />
        </div>
      </div>
    ))}
  </div>
)

const PopularProductCard = ({ board }) => {
  const product = board.product || {}
  const imageUrl = getProductImage(product)

  return (
    <Link
      to={`/posts/${board.id}`}
      className="group overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-100 transition hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="relative h-56 bg-gray-100">
        {imageUrl ? (
          <img src={imageUrl} alt={product.name || board.title || '인기 상품'} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center px-4 text-center text-sm text-gray-500">
            상품 이미지 없음
          </div>
        )}
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-blue-700 shadow-sm">
          판매 게시글
        </span>
      </div>

      <div className="p-4">
        <p className="line-clamp-1 text-xs font-semibold uppercase tracking-wide text-gray-400">
          {product.category || 'Market'}
        </p>
        <h3 className="mt-1 line-clamp-1 text-base font-bold text-gray-950 group-hover:text-blue-600">
          {product.name || board.title || '상품명 없음'}
        </h3>
        <p className="mt-2 text-lg font-extrabold text-gray-950">{formatPrice(product.salePrice)}</p>
        <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
          <span className="line-clamp-1">{board.title || '판매 게시글'}</span>
          <span className="shrink-0 font-semibold text-gray-700">좋아요 {board.likeCount ?? 0}</span>
        </div>
      </div>
    </Link>
  )
}

const PopularProductSection = ({ products, loading }) => {
  if (loading) {
    return <ProductSkeleton />
  }

  if (products.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-gray-200 bg-white px-6 py-12 text-center text-sm text-gray-500">
        좋아요 상위 판매 게시글이 아직 없습니다.
      </div>
    )
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {products.map((board) => (
        <PopularProductCard key={board.id} board={board} />
      ))}
    </div>
  )
}

export default PopularProductSection
