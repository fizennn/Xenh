import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate loading time
    setTimeout(() => {
      if (username === 'admin' && password === '12345') {
        localStorage.setItem('isAuthenticated', 'true');
        navigate('/');
      } else {
        setError('Tài khoản hoặc mật khẩu không chính xác!');
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="bg-gradient-to-r from-purple-600 to-pink-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-user-shield text-white text-2xl"></i>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Xenh Admin</h1>
          <p className="text-gray-600">Đăng nhập vào trang quản trị</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg flex items-center">
              <i className="fas fa-exclamation-circle mr-2"></i>
              {error}
            </div>
          )}

          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
              <i className="fas fa-user mr-2 text-purple-600"></i>
              Tài khoản
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              placeholder="Nhập tài khoản của bạn"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              <i className="fas fa-lock mr-2 text-purple-600"></i>
              Mật khẩu
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              placeholder="Nhập mật khẩu của bạn"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white py-3 px-4 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-600 focus:ring-4 focus:ring-purple-300 transition-all duration-200 flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <i className="fas fa-spinner fa-spin mr-2"></i>
                Đang đăng nhập...
              </>
            ) : (
              <>
                <i className="fas fa-sign-in-alt mr-2"></i>
                Đăng nhập
              </>
            )}
          </button>
        </form>

        
      </div>
    </div>
  );
}

export default Login;