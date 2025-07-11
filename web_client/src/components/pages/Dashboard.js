import React, { useEffect, useState } from 'react';
import Table from '../common/Table';
import {
  getUsers,
  getPosts,
  getItems,
  getFavorites,
  getComments,
  getNotifications,
  getWardrobes,
  getSuggestions,
  getSavedPosts
} from '../../utils/api';

function Dashboard() {
  const [stats, setStats] = useState({
    users: 0,
    posts: 0,
    items: 0,
    favorites: 0,
    comments: 0,
    notifications: 0,
    wardrobes: 0,
    suggestions: 0,
    savedPosts: 0,
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      setLoading(true);
      try {
        const [users, posts, items, favorites, comments, notifications, wardrobes, suggestions, savedPosts] = await Promise.all([
          getUsers(),
          getPosts(),
          getItems(),
          getFavorites(),
          getComments(),
          getNotifications(),
          getWardrobes(),
          getSuggestions(),
          getSavedPosts(),
        ]);
        setStats({
          users: users.length,
          posts: posts.length,
          items: items.length,
          favorites: favorites.length,
          comments: comments.length,
          notifications: notifications.length,
          wardrobes: wardrobes.length,
          suggestions: suggestions.length,
          savedPosts: savedPosts.length,
        });
        // Recent activities: lấy 5 hoạt động mới nhất từ các bảng
        const activities = [];
        posts.slice(-2).reverse().forEach(p => activities.push({
          time: p.createdAt ? new Date(p.createdAt).toLocaleString() : '',
          activity: 'Bài đăng mới',
          user: users.find(u => String(u.id) === String(p.userId))?.username || '',
          status: 'success',
        }));
        comments.slice(-2).reverse().forEach(c => activities.push({
          time: c.createdAt ? new Date(c.createdAt).toLocaleString() : '',
          activity: 'Bình luận mới',
          user: users.find(u => String(u.id) === String(c.userId))?.username || '',
          status: 'info',
        }));
        favorites.slice(-1).reverse().forEach(f => activities.push({
          time: f.createdAt ? new Date(f.createdAt).toLocaleString() : '',
          activity: 'Yêu thích bài đăng',
          user: users.find(u => String(u.id) === String(f.userId))?.username || '',
          status: 'success',
        }));
        notifications.slice(-1).reverse().forEach(n => activities.push({
          time: n.createdAt ? new Date(n.createdAt).toLocaleString() : '',
          activity: 'Thông báo mới',
          user: users.find(u => String(u.id) === String(n.userId))?.username || '',
          status: n.read ? 'success' : 'warning',
        }));
        setRecentActivities(activities.slice(0, 5));
      } catch (error) {
        alert('Lỗi khi tải dữ liệu tổng hợp!');
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  const statList = [
    { id: 'users', label: 'Người dùng', value: stats.users, icon: 'fa-users', color: 'text-purple-600' },
    { id: 'posts', label: 'Bài đăng', value: stats.posts, icon: 'fa-newspaper', color: 'text-pink-500' },
    { id: 'items', label: 'Sản phẩm', value: stats.items, icon: 'fa-tshirt', color: 'text-purple-600' },
    { id: 'favorites', label: 'Yêu thích', value: stats.favorites, icon: 'fa-heart', color: 'text-pink-500' },
    { id: 'comments', label: 'Bình luận', value: stats.comments, icon: 'fa-comments', color: 'text-purple-600' },
    { id: 'notifications', label: 'Thông báo', value: stats.notifications, icon: 'fa-bell', color: 'text-pink-500' },
    { id: 'wardrobes', label: 'Tủ đồ', value: stats.wardrobes, icon: 'fa-archive', color: 'text-purple-600' },
    { id: 'suggestions', label: 'Gợi ý', value: stats.suggestions, icon: 'fa-lightbulb', color: 'text-pink-500' },
    { id: 'savedPosts', label: 'Saved Posts', value: stats.savedPosts, icon: 'fa-bookmark', color: 'text-purple-600' },
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
            status === 'success' ? 'bg-purple-100 text-purple-800' : status === 'info' ? 'bg-blue-100 text-blue-800' : 'bg-pink-100 text-pink-800'
          }`}
        >
          {status === 'success' ? 'Thành công' : status === 'warning' ? 'Cảnh báo' : status === 'info' ? 'Thông tin' : 'Lỗi'}
        </span>
      ),
    },
  ];

  return (
    <div className="bg-gradient-to-br from-blue-100 to-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-blue-700 mb-6">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {statList.map((stat) => (
          <div key={stat.id} className="bg-white p-4 rounded shadow flex items-center justify-between hover:bg-blue-50">
            <div>
              <h3 className="text-xl font-semibold text-blue-900">{stat.value}</h3>
              <p className="text-blue-700">{stat.label}</p>
            </div>
            <i className={`fas ${stat.icon} text-3xl text-blue-400`}></i>
          </div>
        ))}
      </div>
      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-lg font-semibold text-blue-700 mb-4">Hoạt động gần đây</h3>
        <Table columns={activityColumns} data={recentActivities} />
      </div>
    </div>
  );
}

export default Dashboard;