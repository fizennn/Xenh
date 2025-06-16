import React from 'react';
import Table from '../common/Table';
import { users, posts, favorites, products } from '../../utils/data';

function Dashboard() {
  const stats = [
    { id: 'users', label: 'Tổng người dùng', value: users.length, icon: 'fa-users' },
    { id: 'posts', label: 'Tổng bài đăng', value: posts.length, icon: 'fa-newspaper' },
    { id: 'products', label: 'Tổng sản phẩm', value: products.length, icon: 'fa-box' },
    { id: 'likes', label: 'Tổng lượt thích', value: favorites.length, icon: 'fa-heart' },
  ];

  const activities = [
    { time: '10 phút trước', activity: 'Thêm bài đăng mới', user: 'Nguyễn Văn A', status: 'success' },
    { time: '30 phút trước', activity: 'Cập nhật sản phẩm', user: 'Trần Thị B', status: 'warning' },
    { time: '1 giờ trước', activity: 'Đăng ký tài khoản', user: 'Lê Văn C', status: 'info' },
    { time: '2 giờ trước', activity: 'Xóa bài đăng', user: 'Admin', status: 'danger' },
    { time: '3 giờ trước', activity: 'Cập nhật thông tin', user: 'Phạm Thị D', status: 'success' },
  ];

  const activityColumns = [
    { header: 'Thời gian', accessor: 'time' },
    { header: 'Hoạt động', accessor: 'activity' },
    { header: 'Người dùng', accessor: 'user' },
    {
      header: 'Trạng thái',
      accessor: 'status',
      render: (status) => (
        <span
          className={`px-2 py-1 rounded ${
            status === 'success' ? 'bg-purple-100 text-purple-800' : 'bg-pink-100 text-pink-800'
          }`}
        >
          {status === 'success' ? 'Thành công' : status === 'warning' ? 'Cảnh báo' : status === 'info' ? 'Thông tin' : 'Lỗi'}
        </span>
      ),
    },
  ];

  return (
    <div className="bg-gradient-to-br from-f3e7f9 to-fce7f3 p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-purple-600 mb-6">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {stats.map((stat) => (
          <div key={stat.id} className="bg-white p-4 rounded shadow flex items-center justify-between hover:bg-purple-50">
            <div>
              <h3 className="text-xl font-semibold">{stat.value}</h3>
              <p className="text-gray-600">{stat.label}</p>
            </div>
            <i className={`fas ${stat.icon} text-3xl ${stat.id === 'users' || stat.id === 'products' ? 'text-purple-600' : 'text-pink-500'}`}></i>
          </div>
        ))}
      </div>
      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-lg font-semibold text-purple-600 mb-4">Hoạt động gần đây</h3>
        <Table columns={activityColumns} data={activities} />
      </div>
    </div>
  );
}

export default Dashboard;