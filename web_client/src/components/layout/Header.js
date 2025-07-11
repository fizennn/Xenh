import React from 'react';
import { useNavigate } from 'react-router-dom';

function Header({ isSidebarOpen, toggleSidebar }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/login');
  };

  return (
    <header className="bg-gradient-to-r from-blue-400 to-blue-100 text-blue-900 p-4">
      <div className="flex items-center relative">
        {/* Chỉ hiển thị tiêu đề khi sidebar đóng */}
        {!isSidebarOpen && (
          <h1 className="text-2xl font-bold">Xenh - Trang Quản Trị</h1>
        )}
        <div className="flex-grow"></div>
        <button
          onClick={handleLogout}
          className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-all duration-200 flex items-center ml-auto text-blue-900"
        >
          <i className="fas fa-sign-out-alt mr-2"></i>
          Đăng xuất
        </button>
      </div>
    </header>
  );
}

export default Header;