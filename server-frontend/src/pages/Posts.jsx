import { Link } from 'react-router-dom'
import PostList from './PostList'

const Posts = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">게시글</h1>
          <p className="mt-2 text-sm text-gray-500">
            버튼을 눌러 일반 게시글과 상품 판매 게시글을 따로 확인할 수 있습니다.
          </p>
        </div>
        <Link
          to="/seller/boards/new"
          className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
        >
          상품 판매 게시글 작성
        </Link>
      </div>

      <PostList />
    </div>
  )
}

export default Posts
