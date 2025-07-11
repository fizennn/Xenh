import React, { useState } from 'react';
import Table from '../common/Table';
import Modal from '../common/Modal';
import Form from '../common/Form';
import { getUsers, createUser, updateUser, deleteUser } from '../../utils/api';

function Users() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const ITEMS_PER_PAGE = 10;
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    async function fetchUsers() {
      setLoading(true);
      try {
        const data = await getUsers();
        setUsers(data);
      } catch (error) {
        alert('Lỗi khi tải danh sách người dùng!');
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(
    (user) =>
      (user.username && user.username.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.bio && user.bio.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const columns = [
    { header: 'ID', accessor: 'id' },
    {
      header: 'Avatar',
      accessor: 'avatar',
      render: (url) => <img src={url} alt="Avatar" className="w-10 h-10 rounded-full" />,
    },
    { header: 'Tên đăng nhập', accessor: 'username' },
    { header: 'Email', accessor: 'email' },
    { header: 'Mật khẩu', accessor: 'password' },
    { header: 'Bio', accessor: 'bio' },
    {
      header: 'Thao tác',
      accessor: 'id',
      render: (id) => (
        <div className="flex space-x-2">
          <button
            className="text-yellow-600 hover:text-yellow-800 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => handleEdit(id)}
            disabled={isDeleting}
            title="Chỉnh sửa"
          >
            <i className="fas fa-edit"></i>
          </button>
          <button
            className="text-red-600 hover:text-red-800 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => handleDelete(id)}
            disabled={isDeleting}
            title="Xóa"
          >
            <i className="fas fa-trash"></i>
          </button>
        </div>
      ),
    },
  ];

  const formFields = [
    { label: 'ID', name: 'id', type: 'number', required: true, readOnly: true },
    { label: 'Tên đăng nhập', name: 'username', type: 'text', required: true },
    { label: 'Email', name: 'email', type: 'email', required: true },
    { label: 'Mật khẩu', name: 'password', type: 'password', required: true },
    { label: 'Avatar (URL)', name: 'avatar', type: 'text', required: true },
    { label: 'Bio', name: 'bio', type: 'textarea' },
  ];

  const handleEdit = (id) => {
    const user = users.find((u) => u.id === id);
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    const user = users.find((u) => u.id === id);
    if (!user) return;
    const confirmMessage = `Bạn có chắc chắn muốn xóa người dùng "${user.username}"?\nHành động này không thể hoàn tác.`;
    if (window.confirm(confirmMessage)) {
      setIsDeleting(true);
      try {
        await deleteUser(id);
        setUsers((prev) => prev.filter((u) => u.id !== id));
        alert(`Đã xóa người dùng "${user.username}" thành công!`);
      } catch (error) {
        alert('Có lỗi xảy ra khi xóa người dùng. Vui lòng thử lại.');
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleSubmit = async (data) => {
    try {
      // Validate required fields
      if (!data.username || !data.username.trim()) {
        alert('Vui lòng nhập tên đăng nhập');
        return;
      }
      if (!data.email || !data.email.trim()) {
        alert('Vui lòng nhập email');
        return;
      }
      if (!data.password || !data.password.trim()) {
        alert('Vui lòng nhập mật khẩu');
        return;
      }
      if (!data.avatar || !data.avatar.trim()) {
        alert('Vui lòng nhập avatar');
        return;
      }
      // Nếu thêm mới
      if (!selectedUser || !selectedUser.username) {
        const newUserData = {
          id: data.id,
          username: data.username,
          email: data.email,
          password: data.password,
          avatar: data.avatar,
          bio: data.bio || '',
        };
        const newUser = await createUser(newUserData);
        setUsers((prev) => [...prev, newUser]);
        alert('Thêm người dùng thành công!');
      } else {
        // Sửa
        const updateUserData = {
          username: data.username,
          email: data.email,
          password: data.password,
          avatar: data.avatar,
          bio: data.bio || '',
        };
        const updated = await updateUser(selectedUser.id, updateUserData);
        setUsers((prev) => prev.map((u) => (u.id === selectedUser.id ? updated : u)));
        alert('Cập nhật người dùng thành công!');
      }
      setIsModalOpen(false);
      setSelectedUser(null);
    } catch (error) {
      alert('Có lỗi xảy ra khi lưu người dùng. Vui lòng thử lại.');
    }
  };

  const handleModalClose = () => {
    // Khi đóng modal (bao gồm cả nút Hủy), giữ nguyên trang hiện tại
    setIsModalOpen(false);
    setSelectedUser(null);
    // Không thay đổi currentPage ở đây
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    // Reset về trang 1 khi tìm kiếm
    setCurrentPage(1);
  };

  const handleAddNew = () => {
    // Tìm id lớn nhất hiện có
    const maxId = users.length > 0 ? Math.max(...users.map(u => parseInt(u.id, 10) || 0)) : 0;
    setSelectedUser({
      id: maxId + 1,
      username: '',
      email: '',
      password: '',
      avatar: '',
      bio: '',
    });
    setIsModalOpen(true);
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-blue-900">
          <i className="fas fa-users mr-2"></i>
          Quản lý người dùng
        </h2>
        <div className="text-sm text-blue-700">
          Trang {currentPage} / {totalPages} - Tổng: {filteredUsers.length} người dùng
        </div>
      </div>

      <div className="mb-4 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Tìm kiếm theo tên đăng nhập, email, họ tên, vai trò..."
            className="w-full pl-10 pr-4 py-2 border border-blue-200 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
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
          Thêm người dùng
        </button>
      </div>

      {/* Hiển thị loading khi đang xóa */}
      {isDeleting && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800">
          <i className="fas fa-spinner fa-spin mr-2"></i>
          Đang xử lý...
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table columns={columns} data={paginatedUsers} />
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-blue-700">
            Hiển thị {((currentPage - 1) * ITEMS_PER_PAGE) + 1} - {Math.min(currentPage * ITEMS_PER_PAGE, filteredUsers.length)} trong tổng số {filteredUsers.length} người dùng
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Nút Previous */}
            <button
              className={`px-3 py-2 rounded-lg flex items-center gap-1 ${
                currentPage === 1 
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                  : 'bg-white text-blue-900 hover:bg-blue-200 border border-blue-200'
              }`}
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <i className="fas fa-chevron-left text-xs"></i>
              Trước
            </button>

            {/* Các nút số trang */}
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(page => {
                // Hiển thị các trang gần trang hiện tại
                return page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1);
              })
              .map((page, index, filteredPages) => (
                <React.Fragment key={page}>
                  {/* Hiển thị dấu ... nếu có khoảng cách */}
                  {index > 0 && filteredPages[index - 1] < page - 1 && (
                    <span className="px-2 py-2 text-blue-400">...</span>
                  )}
                  <button
                    className={`px-3 py-2 rounded-lg min-w-[40px] ${
                      currentPage === page 
                        ? 'bg-blue-900 text-white' 
                        : 'bg-white text-blue-900 hover:bg-blue-200 border border-blue-200'
                    }`}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </button>
                </React.Fragment>
              ))
            }

            {/* Nút Next */}
            <button
              className={`px-3 py-2 rounded-lg flex items-center gap-1 ${
                currentPage === totalPages 
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                  : 'bg-white text-blue-900 hover:bg-blue-200 border border-blue-200'
              }`}
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Sau
              <i className="fas fa-chevron-right text-xs"></i>
            </button>
          </div>
        </div>
      )}

      {/* Hiển thị thông báo khi không có dữ liệu */}
      {filteredUsers.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <i className="fas fa-users text-4xl text-blue-300 mb-4"></i>
          <p className="text-blue-700 text-lg mb-2">
            {searchTerm ? 'Không tìm thấy người dùng nào' : 'Chưa có người dùng nào'}
          </p>
          <p className="text-blue-400 text-sm">
            {searchTerm ? 'Thử thay đổi từ khóa tìm kiếm' : 'Hãy thêm người dùng đầu tiên'}
          </p>
        </div>
      )}

      {/* Modal thêm/sửa */}
      {isModalOpen && (
        <Modal
          title={selectedUser && selectedUser.username ? 'Chỉnh sửa người dùng' : 'Thêm người dùng mới'}
          onClose={handleModalClose}
        >
          <Form
            fields={formFields}
            initialData={selectedUser || {}}
            onSubmit={handleSubmit}
            onCancel={handleModalClose}
            submitText={selectedUser && selectedUser.username ? 'Cập nhật' : 'Thêm mới'}
            cancelText="Hủy"
          />
        </Modal>
      )}
    </div>
  );
}

export default Users;