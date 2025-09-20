import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { boardAPI } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import useWebSocket from '../hooks/WebSocket';

const PostList = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toasts, setToasts] = useState([]);

  // WebSocket 알림 (토스트용)
  const notifications = useWebSocket(user?.token);

  // 게시글 목록 불러오기
  const loadPosts = async () => {
    try {
      setLoading(true);
      const response = await boardAPI.getBoards();
      setPosts(response.data || []);
    } catch (err) {
      console.error('게시글 로딩 실패:', err);
      setError('게시글을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  // WebSocket 메시지 처리 (토스트 알림용, loadPosts() 제거)
  useEffect(() => {
    if (notifications.length > 0) {
      notifications.forEach((msg) => {
        if (msg.type === 'LIKE') {
          const toast = {
            ...msg,
            id: Date.now() + Math.random(),
            displayMessage: msg.message
          };
          setToasts([toast]); 

          setTimeout(() => {
            setToasts([]);
          }, 5000);
        }
      });
    }
  }, [notifications]);

  // 좋아요 버튼 클릭
  const handleLike = async (boardId) => {
    if (!isAuthenticated) {
      setError('로그인이 필요합니다.');
      return;
    }

    // 즉시 UI 반영
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id.toString() === boardId.toString()
          ? { ...post, likeCount: (post.likeCount ?? 0) + 1 }
          : post
      )
    );

    try {
      await boardAPI.likeBoard(boardId);
      // 성공: UI 이미 반영, WebSocket은 토스트만 사용
    } catch (err) {
      console.error('좋아요 처리 실패:', err);
      setError('좋아요 처리에 실패했습니다.');

      // 실패 시 롤백
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id.toString() === boardId.toString()
            ? { ...post, likeCount: Math.max((post.likeCount ?? 1) - 1, 0) }
            : post
        )
      );
    }
  };

  if (loading) return <div className="text-center py-12">로딩 중...</div>;

  return (
    <>
      <div className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
            <button onClick={() => setError('')} className="ml-2 text-red-500 hover:text-red-700">
              ✕
            </button>
          </div>
        )}

        {posts.length === 0 ? (
          <div className="text-center py-12 text-gray-500">게시글이 없습니다.</div>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="bg-white p-6 rounded-lg shadow">
              <h3
                className="text-xl font-semibold mb-2 cursor-pointer hover:underline"
                onClick={() => navigate(`/posts/${post.id}`)}
              >
                {post.title || '제목 없음'}
              </h3>
              <p className="text-gray-600 mb-4">{post.content || '내용 없음'}</p>
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>작성자: {post.user?.userCode || '익명'}</span>
                <div className="flex space-x-4">
                  <button
                    onClick={() => handleLike(post.id)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                    disabled={!isAuthenticated}
                  >
                    ❤️ 좋아요
                  </button>
                  <span>좋아요: {post.likeCount ?? 0}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 알림 토스트 */}
      <div className="fixed top-5 right-5 space-y-2 z-50">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="flex items-start space-x-2 bg-white border-l-4 border-green-500 shadow-lg rounded p-3 w-80 animate-slide-in"
          >
            <div className="flex-1">
              <p className="text-sm font-medium text-green-700">좋아요 알림</p>
              <p className="text-sm text-gray-700">{toast.displayMessage}</p>
              {toast.boardId && (
                <button
                  onClick={() => navigate(`/posts/${toast.boardId}`)}
                  className="text-xs text-blue-500 hover:text-blue-700 mt-1"
                >
                  게시글 보기 →
                </button>
              )}
            </div>
            <button
              onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <style>
        {`
          @keyframes slide-in {
            0% { transform: translateX(100%); opacity: 0; }
            100% { transform: translateX(0); opacity: 1; }
          }
          .animate-slide-in {
            animation: slide-in 0.3s ease-out;
          }
        `}
      </style>
    </>
  );
};

export default PostList;
