import React from 'react';
import { NavLink } from 'react-router-dom';

function Sidebar({ isOpen, toggleSidebar }) {
  const menuItems = [
    { path: '/', icon: 'fa-home', label: 'Dashboard' },
    { path: '/users', icon: 'fa-users', label: 'Người dùng' },
    { path: '/products', icon: 'fa-box', label: 'Sản phẩm' },
    { path: '/posts', icon: 'fa-newspaper', label: 'Bài đăng' },
    { path: '/settings', icon: 'fa-cog', label: 'Cài đặt' },
  ];

  return (
    <div
      className={`fixed top-0 left-0 h-full bg-gradient-to-b from-purple-600 to-pink-500 text-white transition-all duration-300 ${
        isOpen ? 'w-64' : 'w-16'
      }`}
    >
      <div className="p-4 flex justify-between text-white items-center">
        <h2 className={`text-3xl font-bold text-white ${isOpen ? '' : 'hidden'}`}>Xenh</h2>
        <button
          onClick={toggleSidebar}
          className=" text-white p-2 "
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
              `flex items-center p-4 hover:bg-purple-700 ${
                isActive ? 'bg-pink-600' : ''
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
