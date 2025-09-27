import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import PostForm from './PostForm'
import PostList from './PostList'

const Posts = () => {
  const location = useLocation()
  const weatherData = location.state?.weatherData
  const [showForm, setShowForm] = useState(!!weatherData)

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">게시글</h1>

      {showForm && weatherData && (
        <PostForm 
          weather={weatherData} 
          onSubmitSuccess={() => setShowForm(false)} 
        />
      )}

      <PostList />
    </div>
  )
}

export default Posts
