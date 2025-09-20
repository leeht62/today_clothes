import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Layout from './components/Layout'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Posts from './pages/Posts'
import Weather from './pages/Weather'
import Ranking from './pages/Ranking'
import PostDetail from './pages/PostDetail'

function App() {
  return (
    <AuthProvider>
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
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  )
}

export default App
