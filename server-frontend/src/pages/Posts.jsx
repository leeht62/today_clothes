import { Link } from 'react-router-dom'
import PostList from './PostList'

const Posts = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold">게시글</h1>
        <Link
          to="/seller/boards/new"
          className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
        >
          판매글 작성
        </Link>
      </div>

      <PostList />
    </div>
  )
}

export default Posts

