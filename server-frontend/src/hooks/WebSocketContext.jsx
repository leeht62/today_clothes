import { createContext, useContext, useEffect, useState } from 'react';
import useWebSocket from '../hooks/WebSocket';
import { useAuth } from '../contexts/AuthContext';

const WebSocketContext = createContext();

export const WebSocketProvider = ({ children }) => {
  const { user } = useAuth();
  const messages = useWebSocket(user?.token);
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    if (messages.length > 0) {
      messages.forEach((msg) => {
        const toast = {
          ...msg,
          id: Date.now() + Math.random(),
          displayMessage: msg.message,
        };
            setToasts([toast]);

        setTimeout(() => {
        setToasts([]);
        }, 5000);
      });
    }
  }, [messages]);

  return (
    <WebSocketContext.Provider value={{ toasts, setToasts }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocketContext = () => useContext(WebSocketContext);
