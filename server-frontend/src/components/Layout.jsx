import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const navLinkClass = 'rounded-md px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900'

const Layout = ({ children }) => {
  const { logout, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex min-h-16 flex-col gap-3 py-3 lg:flex-row lg:items-center lg:justify-between lg:py-0">
            <Link to="/" className="text-xl font-bold text-gray-900">
              Today Clothes
            </Link>

            <nav className="flex flex-wrap items-center gap-2">
              <Link to="/" className={navLinkClass}>
                홈
              </Link>
              <Link to="/posts" className={navLinkClass}>
                게시글
              </Link>
              <Link to="/weather" className={navLinkClass}>
                날씨
              </Link>
              <Link to="/ranking" className={navLinkClass}>
                랭킹
              </Link>

              {isAuthenticated ? (
                <>
                  <Link to="/seller/register" className={navLinkClass}>
                    셀러 등록
                  </Link>
                  <Link to="/seller/products" className={navLinkClass}>
                    셀러 상품
                  </Link>
                  <Link to="/orders" className={navLinkClass}>
                    내 주문
                  </Link>
                  <span className="px-3 py-2 text-sm text-gray-600">환영합니다</span>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                  >
                    로그아웃
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className={navLinkClass}>
                    로그인
                  </Link>
                  <Link
                    to="/register"
                    className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                  >
                    회원가입
                  </Link>
                </>
              )}
            </nav>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">{children}</main>

      <footer className="mt-12 border-t bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <p className="text-center text-gray-600">&copy; 2024 Today Clothes. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default Layout
