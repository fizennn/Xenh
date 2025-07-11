import React, { useState, useEffect } from 'react';
import Table from '../common/Table';
import Modal from '../common/Modal';
import Form from '../common/Form';
import { getNotifications, createNotification, updateNotification, deleteNotification, getUsers, getPosts } from '../../utils/api';

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [loading, setLoading] = useState(true);
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [notificationsData, usersData, postsData] = await Promise.all([
          getNotifications(),
          getUsers(),
          getPosts()
        ]);
        setNotifications(notificationsData);
        setUsers(usersData);
        setPosts(postsData);
      } catch (error) {
        alert('Lỗi khi tải dữ liệu Notifications, người dùng hoặc bài đăng!');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const userOptions = users.map(user => ({ value: user.id, label: user.username }));
  const postOptions = posts.map(post => ({ value: post.id, label: post.caption ? post.caption : post.title }));
  const typeOptions = [
    { value: 'like', label: 'Like' },
    { value: 'comment', label: 'Comment' },
    { value: 'follow', label: 'Follow' },
    { value: 'mention', label: 'Mention' },
    { value: 'other', label: 'Other' },
  ];

  const columns = [
    { header: 'ID', accessor: 'id' },
    {
      header: 'Người nhận',
      accessor: 'userId',
      render: (userId) => {
        const user = users.find(u => String(u.id) === String(userId));
        return user ? user.username : userId;
      },
    },
    { header: 'Loại', accessor: 'type' },
    { header: 'Nội dung', accessor: 'message' },
    {
      header: 'Bài liên quan',
      accessor: 'relatedPostId',
      render: (postId) => {
        if (!postId) return '';
        const post = posts.find(p => String(p.id) === String(postId));
        return post ? (post.caption ? post.caption : post.title) : postId;
      },
    },
    { header: 'Ngày tạo', accessor: 'createdAt', render: (date) => new Date(date).toLocaleString() },
    {
      header: 'Đã đọc',
      accessor: 'read',
      render: (read) => read ? <span className="text-green-600 font-semibold">Đã đọc</span> : <span className="text-gray-400">Chưa đọc</span>,
    },
    {
      header: 'Thao tác',
      accessor: 'id',
      render: (id) => (
        <div className="flex space-x-2">
          <button className="text-yellow-600 hover:text-yellow-800 disabled:opacity-50 disabled:cursor-not-allowed" onClick={() => handleEdit(id)} disabled={isDeleting} title="Chỉnh sửa"><i className="fas fa-edit"></i></button>
          <button className="text-red-600 hover:text-red-800 disabled:opacity-50 disabled:cursor-not-allowed" onClick={() => handleDelete(id)} disabled={isDeleting} title="Xóa"><i className="fas fa-trash"></i></button>
        </div>
      ),
    },
  ];

  const formFields = [
    { label: 'ID', name: 'id', type: 'number', required: true, readOnly: true },
    { label: 'Người nhận', name: 'userId', type: 'select', options: userOptions, required: true },
    { label: 'Loại', name: 'type', type: 'select', options: typeOptions, required: true },
    { label: 'Nội dung', name: 'message', type: 'text', required: true },
    { label: 'Bài liên quan', name: 'relatedPostId', type: 'select', options: [{ value: '', label: 'Không có' }, ...postOptions] },
    { label: 'Ngày tạo', name: 'createdAt', type: 'datetime-local', required: true },
    { label: 'Đã đọc', name: 'read', type: 'checkbox' },
  ];

  const filteredNotifications = notifications.filter(
    (n) => {
      const user = users.find(u => String(u.id) === String(n.userId));
      const post = posts.find(p => String(p.id) === String(n.relatedPostId));
      return (
        (user && user.username && user.username.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (n.message && n.message.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (post && ((post.caption && post.caption.toLowerCase().includes(searchTerm.toLowerCase())) || (post.title && post.title.toLowerCase().includes(searchTerm.toLowerCase()))))
      );
    }
  );

  const totalPages = Math.ceil(filteredNotifications.length / ITEMS_PER_PAGE);
  const paginatedNotifications = filteredNotifications.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleEdit = (id) => {
    const notification = notifications.find((n) => String(n.id) === String(id));
    if (notification) {
      setSelectedNotification(notification);
      setIsModalOpen(true);
    }
  };

  const handleDelete = async (id) => {
    const notification = notifications.find((n) => String(n.id) === String(id));
    if (!notification) return;
    if (window.confirm(`Bạn có chắc chắn muốn xóa thông báo ID "${notification.id}"?`)) {
      setIsDeleting(true);
      try {
        await deleteNotification(id);
        setNotifications((prev) => prev.filter((n) => String(n.id) !== String(id)));
        alert('Đã xóa thông báo thành công!');
      } catch (error) {
        alert('Có lỗi xảy ra khi xóa thông báo. Vui lòng thử lại.');
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleSubmit = async (data) => {
    try {
      if (!data.userId) {
        alert('Vui lòng chọn người nhận');
        return;
      }
      if (!data.type) {
        alert('Vui lòng chọn loại thông báo');
        return;
      }
      if (!data.message || !data.message.trim()) {
        alert('Vui lòng nhập nội dung');
        return;
      }
      if (!data.createdAt) {
        alert('Vui lòng nhập ngày tạo');
        return;
      }
      if (!selectedNotification || !selectedNotification.userId) {
        // Thêm mới
        const maxId = notifications.length > 0 ? Math.max(...notifications.map(n => parseInt(n.id, 10) || 0)) : 0;
        const newNotificationData = {
          id: maxId + 1,
          userId: data.userId,
          type: data.type,
          message: data.message,
          relatedPostId: data.relatedPostId || '',
          createdAt: data.createdAt,
          read: !!data.read,
        };
        const newNotification = await createNotification(newNotificationData);
        setNotifications((prev) => [...prev, newNotification]);
        alert('Thêm thông báo thành công!');
      } else {
        // Sửa
        const updateNotificationData = {
          userId: data.userId,
          type: data.type,
          message: data.message,
          relatedPostId: data.relatedPostId || '',
          createdAt: data.createdAt,
          read: !!data.read,
        };
        const updated = await updateNotification(selectedNotification.id, updateNotificationData);
        setNotifications((prev) => prev.map((n) => String(n.id) === String(selectedNotification.id) ? updated : n));
        alert('Cập nhật thông báo thành công!');
      }
      setIsModalOpen(false);
      setSelectedNotification(null);
    } catch (error) {
      alert('Có lỗi xảy ra khi lưu thông báo. Vui lòng thử lại.');
    }
  };

  const handleAddNew = () => {
    const maxId = notifications.length > 0 ? Math.max(...notifications.map(n => parseInt(n.id, 10) || 0)) : 0;
    setSelectedNotification({
      id: maxId + 1,
      userId: '',
      type: '',
      message: '',
      relatedPostId: '',
      createdAt: new Date().toISOString().slice(0, 16),
      read: false,
    });
    setIsModalOpen(true);
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedNotification(null);
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-pink-50 p-6 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-blue-600">
          <i className="fas fa-bell mr-2"></i>
          Quản lý Thông báo
        </h2>
        <div className="text-sm text-blue-600">
          Trang {currentPage} / {totalPages} - Tổng: {filteredNotifications.length} Thông báo
        </div>
      </div>
      <div className="mb-4 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Tìm kiếm theo người nhận, nội dung, bài đăng..."
            className="w-full pl-10 pr-4 py-2 border border-blue-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <i className="fas fa-search absolute left-3 top-3 text-blue-400"></i>
          {searchTerm && (
            <button
              className="absolute right-3 top-3 text-blue-400 hover:text-blue-600"
              onClick={() => {
                setSearchTerm('');
                setCurrentPage(1);
              }}
              title="Xóa tìm kiếm"
            >
              <i className="fas fa-times"></i>
            </button>
          )}
        </div>
        <button
          className="bg-gradient-to-r from-blue-400 to-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleAddNew}
          disabled={isDeleting}
        >
          <i className="fas fa-plus"></i>
          Thêm Thông báo
        </button>
      </div>
      {isDeleting && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800">
          <i className="fas fa-spinner fa-spin mr-2"></i>
          Đang xử lý...
        </div>
      )}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table columns={columns} data={paginatedNotifications} />
      </div>
      {totalPages > 1 && (
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-blue-600">
            Hiển thị {((currentPage - 1) * ITEMS_PER_PAGE) + 1} - {Math.min(currentPage * ITEMS_PER_PAGE, filteredNotifications.length)} trong tổng số {filteredNotifications.length} Thông báo
          </div>
          <div className="flex items-center space-x-2">
            <button
              className={`px-3 py-2 rounded-lg flex items-center gap-1 ${currentPage === 1 ? 'bg-blue-200 text-blue-400 cursor-not-allowed' : 'bg-white text-blue-600 hover:bg-blue-50 border border-blue-200'}`}
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <i className="fas fa-chevron-left text-xs"></i>
              Trước
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(page => page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1))
              .map((page, index, filteredPages) => (
                <React.Fragment key={page}>
                  {index > 0 && filteredPages[index - 1] < page - 1 && (
                    <span className="px-2 py-2 text-blue-400">...</span>
                  )}
                  <button
                    className={`px-3 py-2 rounded-lg min-w-[40px] ${currentPage === page ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 hover:bg-blue-50 border border-blue-200'}`}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </button>
                </React.Fragment>
              ))}
            <button
              className={`px-3 py-2 rounded-lg flex items-center gap-1 ${currentPage === totalPages ? 'bg-blue-200 text-blue-400 cursor-not-allowed' : 'bg-white text-blue-600 hover:bg-blue-50 border border-blue-200'}`}
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Sau
              <i className="fas fa-chevron-right text-xs"></i>
            </button>
          </div>
        </div>
      )}
      {filteredNotifications.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <i className="fas fa-bell text-4xl text-blue-300 mb-4"></i>
          <p className="text-blue-500 text-lg mb-2">
            {searchTerm ? 'Không tìm thấy thông báo nào' : 'Chưa có thông báo nào'}
          </p>
          <p className="text-blue-400 text-sm">
            {searchTerm ? 'Thử thay đổi từ khóa tìm kiếm' : 'Hãy thêm thông báo đầu tiên'}
          </p>
        </div>
      )}
      {isModalOpen && (
        <Modal
          title={selectedNotification && selectedNotification.userId ? 'Chỉnh sửa Thông báo' : 'Thêm Thông báo mới'}
          onClose={handleModalClose}
        >
          <Form
            fields={formFields}
            initialData={selectedNotification || {}}
            onSubmit={handleSubmit}
            onCancel={handleModalClose}
            submitText={selectedNotification && selectedNotification.userId ? 'Cập nhật' : 'Thêm mới'}
            cancelText="Hủy"
          />
        </Modal>
      )}
    </div>
  );
}

export default Notifications; 