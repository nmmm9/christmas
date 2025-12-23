import React, { useState } from 'react';
import '../styles/password.css';

const PasswordScreen = ({ onSuccess }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  const correctPassword = '고마워요 맥스';

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password === correctPassword) {
      setError(false);
      setSuccess(true);
      // 잠시 후 메인 화면으로
      setTimeout(() => {
        onSuccess();
      }, 2000);
    } else {
      setError(true);
      setPassword('');
      // 잠시 후 에러 메시지 숨기고 다시 입력 가능
      setTimeout(() => {
        setError(false);
      }, 2500);
    }
  };

  return (
    <div className="password-screen">
      <div className="snow-overlay"></div>

      <div className="password-container">
        {success ? (
          <div className="success-message">
            <div className="success-icon">🎄</div>
            <h2>별말씀을요</h2>
            <p className="loading-text">입장 중...</p>
          </div>
        ) : error ? (
          <div className="error-message">
            <div className="error-icon">🚫</div>
            <h2>소프가 아니시군요</h2>
            <p>돌아가주세요.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="password-form">
            <div className="lock-icon">🔒</div>
            <h1>암호를 입력하세요</h1>
            <input
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="암호 입력..."
              autoFocus
              className="password-input"
            />
            <button type="submit" className="submit-btn">
              확인
            </button>
          </form>
        )}
      </div>

      {/* Decorative snowflakes */}
      <div className="snowflakes">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="snowflake"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 5}s`
            }}
          >
            ❄
          </div>
        ))}
      </div>
    </div>
  );
};

export default PasswordScreen;
