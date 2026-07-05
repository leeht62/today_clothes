import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { WebSocketProvider } from './hooks/WebSocketContext' 
import Layout from './components/Layout'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Posts from './pages/Posts'
import SellerBoardForm from './pages/SellerBoardForm'
import Weather from './pages/Weather'
import Ranking from './pages/Ranking'
import PostDetail from './pages/PostDetail'
import SellerProductForm from './pages/SellerProductForm'
import SellerProducts from './pages/SellerProducts'
import SellerRegister from './pages/SellerRegister'
import ToastContainer from './components/ToastContainer' 

function App() {
  return (
    <AuthProvider>
      <WebSocketProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/posts" element={<Posts />} />
              <Route path="/posts/:id" element={<PostDetail />} />
              <Route path="/weather" element={<Weather />} />
              <Route path="/ranking" element={<Ranking />} />
              <Route path="/seller" element={<SellerProducts />} />
              <Route path="/seller/register" element={<SellerRegister />} />
              <Route path="/seller/products" element={<SellerProducts />} />
              <Route path="/seller/products/new" element={<SellerProductForm />} />
              <Route path="/seller/boards/new" element={<SellerBoardForm />} />
            </Routes>
            <ToastContainer />
          </Layout>
        </Router>
      </WebSocketProvider>
    </AuthProvider>
  )
}

export default App

