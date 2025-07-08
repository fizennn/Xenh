import React from 'react';
import { useNavigate } from 'react-router-dom';

function Header() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/login');
  };

  return (
    <header className="bg-gradient-to-r from-purple-600 to-pink-500 text-white p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Xenh - Trang Quản Trị</h1>
        <button
          onClick={handleLogout}
          className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-all duration-200 flex items-center"
        >
          <i className="fas fa-sign-out-alt mr-2"></i>
          Đăng xuất
        </button>
      </div>
    </header>
  );
}

export default Header;