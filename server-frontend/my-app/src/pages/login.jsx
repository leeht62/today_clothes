import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signIn } from '../api/auth';
import { useAuthStore } from '../store/authStore';

export default function Login() {
  const [userCode, setUserCode] = useState('');
  const [password, setPassword] = useState('');
  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await signIn({ userCode, password });
      setAuth(res.accessToken, userCode);
      navigate('/');
    } catch (err) {
      alert('로그인 실패');
    }
  };

  return (
    <div className="container vh-100 d-flex justify-content-center align-items-center">
      <div className="card p-4 shadow" style={{ width: '350px' }}>
        <h2 className="text-center mb-4">로그인</h2>
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="아이디"
            value={userCode}
            onChange={(e) => setUserCode(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <input
            type="password"
            className="form-control"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button className="btn btn-primary w-100" onClick={handleLogin}>
          로그인
        </button>
      </div>
    </div>
  );
}
