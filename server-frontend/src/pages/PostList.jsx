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
      const boards = response.data || [];

      // 각 게시글의 Redis likeCount 가져오기
      const boardsWithLikes = await Promise.all(
        boards.map(async (board) => {
          try {
            const res = await boardAPI.getBoardLikeCount(board.id);
            return { ...board, likeCount: res.data ?? 0 };
          } catch {
            return { ...board, likeCount: 0 };
          }
        })
      );

      setPosts(boardsWithLikes);
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

  // WebSocket 메시지 → 토스트만
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
      // 서버 반영 (Redis 업데이트)
      await boardAPI.likeBoard(boardId);

      // 최신 Redis 값 가져와서 동기화
      const res = await boardAPI.getBoardLikeCount(boardId);
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id.toString() === boardId.toString()
            ? { ...post, likeCount: res.data ?? post.likeCount }
            : post
        )
      );
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
            <button
              onClick={() => setError('')}
              className="ml-2 text-red-500 hover:text-red-700"
            >
              ✕
            </button>
          </div>
        )}

        {posts.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            게시글이 없습니다.
          </div>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="bg-white p-6 rounded-lg shadow">
              <h3
                className="text-xl font-semibold mb-2 cursor-pointer hover:underline"
                onClick={() => navigate(`/posts/${post.id}`)}
              >
                {post.title || '제목 없음'}
              </h3>
              <p className="text-gray-600 mb-4">
                {post.content || '내용 없음'}
              </p>
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
    </>
  );
};

export default PostList;
