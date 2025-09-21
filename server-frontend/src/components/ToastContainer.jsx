import { useWebSocketContext } from '../hooks/WebSocketContext';
import { useNavigate } from 'react-router-dom';

const ToastContainer = () => {
  const { toasts } = useWebSocketContext();
  const navigate = useNavigate();

  return (
    <div className="fixed top-5 right-5 space-y-2 z-50">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="flex items-start space-x-2 bg-white border-l-4 border-blue-500 shadow-lg rounded p-3 w-80 animate-slide-in"
        >
          <div className="flex-1">
            <p className="text-sm font-medium text-blue-700">
              {toast.type} 알림
            </p>
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
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
