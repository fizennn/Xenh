import React, { useState } from 'react';
import Table from '../common/Table';
import Modal from '../common/Modal';
import Form from '../common/Form';
import { users, updateUsers } from '../../utils/data';

function Users() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const ITEMS_PER_PAGE = 10;

  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase())
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
      accessor: 'avatar_url',
      render: (url) => <img src={url} alt="Avatar" className="w-10 h-10 rounded-full" />,
    },
    { header: 'Tên đăng nhập', accessor: 'username' },
    { header: 'Email', accessor: 'email' },
    { header: 'Họ tên', accessor: 'full_name' },
    { header: 'Vai trò', accessor: 'role' },
    {
      header: 'Trạng thái',
      accessor: 'status',
      render: (status) => (
        <span
          className={`px-2 py-1 rounded ${
            status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}
        >
          {status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
        </span>
      ),
    },
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
    { label: 'Tên đăng nhập', name: 'username', type: 'text', required: true },
    { label: 'Email', name: 'email', type: 'email', required: true },
    { label: 'Mật khẩu', name: 'password', type: 'password' },
    { label: 'Họ tên đầy đủ', name: 'full_name', type: 'text', required: true },
    {
      label: 'Vai trò',
      name: 'role',
      type: 'select',
      options: [
        { value: 'user', label: 'Người dùng' },
        { value: 'admin', label: 'Quản trị viên' },
        { value: 'moderator', label: 'Điều hành viên' },
      ],
      required: true
    },
    {
      label: 'Trạng thái',
      name: 'status',
      type: 'select',
      options: [
        { value: 'active', label: 'Hoạt động' },
        { value: 'inactive', label: 'Không hoạt động' },
      ],
      required: true
    },
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
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const updatedUsers = users.filter((user) => user.id !== id);
        updateUsers(updatedUsers);
        
        // Kiểm tra nếu trang hiện tại không còn dữ liệu sau khi xóa
        const newFilteredUsers = updatedUsers.filter(
          (user) =>
            user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.role.toLowerCase().includes(searchTerm.toLowerCase())
        );
        
        const newTotalPages = Math.ceil(newFilteredUsers.length / ITEMS_PER_PAGE);
        
        // Nếu trang hiện tại lớn hơn tổng số trang mới, chuyển về trang cuối
        if (currentPage > newTotalPages && newTotalPages > 0) {
          setCurrentPage(newTotalPages);
        } else if (newFilteredUsers.length === 0) {
          setCurrentPage(1);
        }
        
        // Hiển thị thông báo thành công
        alert(`Đã xóa người dùng "${user.username}" thành công!`);
        
      } catch (error) {
        console.error('Error deleting user:', error);
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

      if (!data.full_name || !data.full_name.trim()) {
        alert('Vui lòng nhập họ tên đầy đủ');
        return;
      }

      if (!data.role || !data.role.trim()) {
        alert('Vui lòng chọn vai trò');
        return;
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) {
        alert('Vui lòng nhập email hợp lệ');
        return;
      }

      // Check duplicate username/email when adding new user
      if (!selectedUser) {
        const existingUser = users.find(u => 
          u.username.toLowerCase() === data.username.toLowerCase() || 
          u.email.toLowerCase() === data.email.toLowerCase()
        );
        if (existingUser) {
          alert('Tên đăng nhập hoặc email đã tồn tại');
          return;
        }
      } else {
        // Check duplicate when editing (exclude current user)
        const existingUser = users.find(u => 
          u.id !== selectedUser.id && (
            u.username.toLowerCase() === data.username.toLowerCase() || 
            u.email.toLowerCase() === data.email.toLowerCase()
          )
        );
        if (existingUser) {
          alert('Tên đăng nhập hoặc email đã tồn tại');
          return;
        }
      }

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));

      if (selectedUser) {
        // Cập nhật người dùng
        const updatedUsers = users.map((user) =>
          user.id === selectedUser.id 
            ? { 
                ...user, 
                ...data, 
                username: data.username.trim(),
                email: data.email.trim().toLowerCase(),
                full_name: data.full_name.trim(),
                password: data.password && data.password.trim() ? data.password : user.password
              }
            : user
        );
        updateUsers(updatedUsers);
        alert(`Đã cập nhật người dùng "${data.username}" thành công!`);
      } else {
        // Thêm người dùng mới
        const newUser = {
          id: Math.max(...users.map((u) => u.id)) + 1,
          avatar_url: 'https://via.placeholder.com/40',
          gender: 'male',
          height: 170,
          weight: 65,
          ...data,
          username: data.username.trim(),
          email: data.email.trim().toLowerCase(),
          full_name: data.full_name.trim(),
          status: data.status || 'active'
        };
        updateUsers([...users, newUser]);
        alert(`Đã thêm người dùng "${data.username}" thành công!`);
      }
      
      // Đóng modal và reset state
      setIsModalOpen(false);
      setSelectedUser(null);
      
    } catch (error) {
      console.error('Error saving user:', error);
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
    setSelectedUser(null);
    setIsModalOpen(true);
    // Không thay đổi currentPage khi thêm mới
  };

  return (
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-purple-600">
          <i className="fas fa-users mr-2"></i>
          Quản lý người dùng
        </h2>
        <div className="text-sm text-gray-600">
          Trang {currentPage} / {totalPages} - Tổng: {filteredUsers.length} người dùng
        </div>
      </div>

      <div className="mb-4 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Tìm kiếm theo tên đăng nhập, email, họ tên, vai trò..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <i className="fas fa-search absolute left-3 top-3 text-gray-400"></i>
          {searchTerm && (
            <button
              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
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
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
          <div className="text-sm text-gray-600">
            Hiển thị {((currentPage - 1) * ITEMS_PER_PAGE) + 1} - {Math.min(currentPage * ITEMS_PER_PAGE, filteredUsers.length)} trong tổng số {filteredUsers.length} người dùng
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Nút Previous */}
            <button
              className={`px-3 py-2 rounded-lg flex items-center gap-1 ${
                currentPage === 1 
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                  : 'bg-white text-purple-600 hover:bg-purple-50 border border-purple-200'
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
                    <span className="px-2 py-2 text-gray-400">...</span>
                  )}
                  <button
                    className={`px-3 py-2 rounded-lg min-w-[40px] ${
                      currentPage === page 
                        ? 'bg-purple-600 text-white' 
                        : 'bg-white text-purple-600 hover:bg-purple-50 border border-purple-200'
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
                  : 'bg-white text-purple-600 hover:bg-purple-50 border border-purple-200'
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
          <i className="fas fa-users text-4xl text-gray-300 mb-4"></i>
          <p className="text-gray-500 text-lg mb-2">
            {searchTerm ? 'Không tìm thấy người dùng nào' : 'Chưa có người dùng nào'}
          </p>
          <p className="text-gray-400 text-sm">
            {searchTerm ? 'Thử thay đổi từ khóa tìm kiếm' : 'Hãy thêm người dùng đầu tiên'}
          </p>
        </div>
      )}

      {/* Modal thêm/sửa */}
      {isModalOpen && (
        <Modal
          title={selectedUser ? 'Chỉnh sửa người dùng' : 'Thêm người dùng mới'}
          onClose={handleModalClose}
        >
          <Form
            fields={formFields}
            initialData={selectedUser || {}}
            onSubmit={handleSubmit}
            onCancel={handleModalClose}
            submitText={selectedUser ? 'Cập nhật' : 'Thêm mới'}
            cancelText="Hủy"
          />
        </Modal>
      )}
    </div>
  );
}

export default Users;