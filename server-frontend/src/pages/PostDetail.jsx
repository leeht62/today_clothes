import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { boardAPI, weatherAPI, commentAPI } from '../lib/api'
import useWebSocket from '../hooks/WebSocket';
import { useAuth } from '../contexts/AuthContext';

const PostDetail = () => {
  const { id } = useParams()
  const { user } = useAuth();
  const [post, setPost] = useState(null)
  const [weatherData, setWeatherData] = useState(null)
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [toasts, setToasts] = useState([]);

  const notifications = useWebSocket(user?.token);


  useEffect(() => {
    if (notifications.length > 0) {
      notifications.forEach((msg) => {
        if (msg.type === 'COMMENT' && msg.boardId === Number(id)) {
          const toast = {
            ...msg,
            id: Date.now() + Math.random(),
            displayMessage: msg.message,
          };
          setToasts([toast]);

          setTimeout(() => {
            setToasts([]);
          }, 5000);
        }
      });
    }
  }, [notifications, id]);
  // 게시글 불러오기
  useEffect(() => {
    const fetchPost = async () => {
      const res = await boardAPI.getBoard(id)
      setPost(res.data)
    }
    fetchPost()
  }, [id])

  // 날씨 데이터 불러오기
  useEffect(() => {
    if (post?.weatherId) {
      const fetchWeather = async () => {
        const res = await weatherAPI.getWeather(post.weatherId)
        setWeatherData(res.data)
      }
      fetchWeather()
    }
  }, [post])

  // 댓글 불러오기
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await commentAPI.getComment(id)
        setComments(res.data || [])
      } catch (err) {
        console.error('댓글 불러오기 실패:', err)
      }
    }
    fetchComments()
  }, [id])

  // 댓글 작성
  const handleCommentSubmit = async () => {
    if (!newComment.trim()) return
    try {
      const res = await commentAPI.commentBoard(id, { comment: newComment })
      setComments((prev) => [...prev, res.data]) // 새 댓글 추가
      setNewComment('')
    } catch (err) {
      console.error('댓글 작성 실패:', err)
      setError('댓글 작성에 실패했습니다.')
    }
  }

  // 댓글 삭제
  const handleCommentDelete = async (commentId) => {
    try {
      await commentAPI.deleteComment(commentId)
      setComments((prev) => prev.filter((c) => c.id !== commentId))
    } catch (err) {
      console.error('댓글 삭제 실패:', err)
      setError('댓글 삭제에 실패했습니다.')
    }
  }
  //게시글 삭제
  const handlePostDelete = async (postId) => {
    try {
      await boardAPI.deleteBoard(postId)
      setPost((prev) => prev.filter((c) => c.id !== postId))
    } catch (err) {
      console.error('게시글 삭제 실패:', err)
      setError('게시글 삭제에 실패했습니다.')
    }
  }

  // Base64 이미지 src 변환
  const getBase64ImageSrc = (base64) => `data:image/png;base64,${base64}`

  if (!post) return <div>게시글이 존재하지 않습니다.</div>

  return (
  <div className="space-y-4">
    {/* 게시글 내용 */}
    <div className="bg-white p-6 rounded-lg shadow">
      <h1 className="text-2xl font-bold">{post.title}</h1>
      <p className="text-gray-600">{post.content}</p>

       <button
          onClick={() => handlePostDelete(post.id)}
          className="text-red-500 hover:text-red-700 text-sm mt-4"
        >
          게시글 삭제
       </button>
    </div>

    {/* 생성된 이미지 */}
    {weatherData && (
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">생성된 의상 이미지</h3>
        {weatherData.image && (
          <img
            src={getBase64ImageSrc(weatherData.image)}
            alt="AI 추천 의상"
            className="max-w-full h-auto rounded-lg"
          />
        )}
        {weatherData.weather_prompt && (
          <p className="text-sm text-gray-500">{weatherData.weather_prompt}</p>
        )}
      </div>
    )}

    {/* 댓글 섹션 */}
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">댓글</h3>

      {comments.length === 0 ? (
        <p className="text-gray-500">댓글이 없습니다.</p>
      ) : (
        <ul className="space-y-2">
          {comments.map((c) => (
            <li
              key={c.id}
              className="border-b border-gray-200 pb-2 flex justify-between items-start"
            >
              <div>
                <p className="text-sm font-medium">
                  {c.user?.userCode || '익명'}
                </p>
                <p className="text-gray-700">{c.comment || c.content}</p>
              </div>
              <button
                onClick={() => handleCommentDelete(c.id)}
                className="text-red-500 hover:text-red-700 text-sm"
              >
                삭제
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-4 flex space-x-2">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="댓글을 입력하세요..."
          className="flex-1 border border-gray-300 rounded px-3 py-1"
        />
        <button
          onClick={handleCommentSubmit}
          className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
        >
          작성
        </button>
      </div>

      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  </div>
);

}

export default PostDetail
