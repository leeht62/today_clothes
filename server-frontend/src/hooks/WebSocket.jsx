import { useEffect, useState } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const useWebSocket = (userToken) => {
  const [messages, setMessages] = useState([]);

  //  URL-safe Base64 JWT 디코딩 함수
  const decodeJWT = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (err) {
      console.error('JWT 디코딩 실패:', err);
      return null;
    }
  };

  useEffect(() => {
    if (!userToken) return;

    const decoded = decodeJWT(userToken);
    console.log(decoded);
    const userCode = decoded?.sub;
    if (!userCode) return;

    // STOMP 클라이언트 생성
    const client = new Client({
      webSocketFactory: () => new SockJS('/ws'),
      reconnectDelay: 5000, // 자동 재연결
      debug: (str) => {
        // 필요한 디버그 로그만 표시, 너무 많으면 주석 처리 가능
        if (str.includes('CONNECTED') || str.includes('SUBSCRIBE') || str.includes('MESSAGE')) {
          console.log('[STOMP DEBUG]', str);
        }
      },
      connectHeaders: {
        Authorization: `Bearer ${userToken}`,
      },
    });

    // 연결 성공
    client.onConnect = () => {
      console.log('✅ STOMP 연결 성공:', userCode);

      // 해당 유저 구독
      client.subscribe(`/topic/notifications/${userCode}`, (msg) => {
        try {
          console.log('🚀 메시지 수신:', msg.body);
          const payload = JSON.parse(msg.body);
          console.log('🟢 새로운 WebSocket 메시지:', payload);
          setMessages((prev) => [...prev, payload]);
        } catch (err) {
          console.error('WebSocket 메시지 파싱 실패:', err);
        }
      });
    };
    console.log('STOMP 구독 경로:', `/topic/notifications/${userCode}`);

    // STOMP 에러 처리
    client.onStompError = (frame) => {
      console.error('⚠️ STOMP 에러:', frame.headers['message'], frame.body);
    };

    client.onDisconnect = () => {
      console.log('❌ STOMP 연결 종료');
    };

    // 클라이언트 활성화
    client.activate();

    // 컴포넌트 언마운트 시 비활성화
    return () => client.deactivate();
  }, [userToken]);

  return messages;
};

export default useWebSocket;
