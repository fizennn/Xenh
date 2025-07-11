import React from 'react';
import { NavLink } from 'react-router-dom';

function Sidebar({ isOpen, toggleSidebar }) {
  const menuItems = [
    { path: '/', icon: 'fa-home', label: 'Dashboard' },
    { path: '/users', icon: 'fa-users', label: 'Người dùng' },
    { path: '/items', icon: 'fa-tshirt', label: 'Sản phẩm' },
    { path: '/wardrobes', icon: 'fa-archive', label: 'Tủ đồ' },
    { path: '/saved-posts', icon: 'fa-bookmark', label: 'Saved Posts' },
    { path: '/favorites', icon: 'fa-heart', label: 'Yêu thích' },
    { path: '/notifications', icon: 'fa-bell', label: 'Thông báo' },
    { path: '/comments', icon: 'fa-comments', label: 'Bình luận' },
    { path: '/suggestions', icon: 'fa-lightbulb', label: 'Gợi ý' },
    { path: '/posts', icon: 'fa-newspaper', label: 'Bài đăng' },
    { path: '/settings', icon: 'fa-cog', label: 'Cài đặt' },
  ];

  return (
    <div
      className={`fixed top-0 left-0 h-full bg-gradient-to-b from-blue-400 to-blue-100 text-blue-900 transition-all duration-300 ${
        isOpen ? 'w-64' : 'w-16'
      }`}
    >
      <div className="p-4 flex justify-between text-blue-900 items-center">
        <h2 className={`text-3xl font-bold text-blue-900 ${isOpen ? '' : 'hidden'}`}>Xenh</h2>
        <button
          onClick={toggleSidebar}
          className=" text-blue-900 p-2 "
        >
          <i className="fas fa-bars"></i>
        </button>
      </div>
      <nav className="mt-4">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center p-4 hover:bg-blue-200 ${
                isActive ? 'bg-blue-300' : ''
              } ${!isOpen ? 'justify-center' : ''}`
            }
            end
          >
            <i className={`fas ${item.icon} mr-3`}></i>
            <span className={isOpen ? '' : 'hidden'}>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}

export default Sidebar;
