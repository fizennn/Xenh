import React, { useState } from 'react';
import Table from '../common/Table';
import Modal from '../common/Modal';
import Form from '../common/Form';
import { posts, updatePosts, users } from '../../utils/data';

function Posts() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [sortBy, setSortBy] = useState('id');
  const [sortOrder, setSortOrder] = useState('desc');
  const ITEMS_PER_PAGE = 10;

  // Hình ảnh avatar cố định
  const getFixedAvatar = (userId) => {
    const avatars = [
      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40&h=40&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1494790108755-2616b612b547?w=40&h=40&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=40&h=40&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=40&h=40&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=40&h=40&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=40&h=40&fit=crop&crop=face',
    ];
    return avatars[(userId - 1) % avatars.length];
  };

  // Hình ảnh bài đăng cố định
  const getFixedPostImage = (postId) => {
    const postImages = [
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=64&h=48&fit=crop',
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=64&h=48&fit=crop',
      'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=64&h=48&fit=crop',
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=64&h=48&fit=crop',
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=64&h=48&fit=crop',
      'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=64&h=48&fit=crop',
      'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=64&h=48&fit=crop',
      'https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=64&h=48&fit=crop',
      'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=64&h=48&fit=crop',
      'https://images.unsplash.com/photo-1574180045827-681f8a1a9622?w=64&h=48&fit=crop',
    ];
    return postImages[(postId - 1) % postImages.length];
  };

  // Lọc và sắp xếp bài đăng
  const filteredAndSortedPosts = posts
    .filter(
      (post) =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.full_name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const totalPages = Math.ceil(filteredAndSortedPosts.length / ITEMS_PER_PAGE);
  const paginatedPosts = filteredAndSortedPosts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const columns = [
    { 
      header: 'ID', 
      accessor: 'id',
      sortable: true
    },
    {
      header: 'Avatar',
      accessor: 'user_id',
      render: (userId, post) => (
        <div className="flex items-center space-x-2">
          <img 
            src={getFixedAvatar(userId)} 
            alt={`Avatar của ${post.full_name}`} 
            className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
            onError={(e) => {
              e.target.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(post.full_name) + '&background=6366f1&color=ffffff&size=40';
            }}
          />
        </div>
      ),
    },
    {
      header: 'Hình ảnh',
      accessor: 'id',
      render: (postId, post) => (
        <div className="w-16 h-12 bg-gray-100 rounded overflow-hidden">
          <img 
            src={getFixedPostImage(postId)} 
            alt="Hình bài đăng" 
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/64x48/6366f1/ffffff?text=Post';
            }}
          />
        </div>
      ),
    },
    { 
      header: 'Tiêu đề', 
      accessor: 'title',
      sortable: true,
      render: (title) => (
        <div className="max-w-xs truncate" title={title}>
          {title}
        </div>
      )
    },
    { 
      header: 'Mô tả', 
      accessor: 'description',
      render: (description) => (
        <div className="max-w-xs truncate" title={description}>
          {description}
        </div>
      )
    },
    { 
      header: 'Người đăng', 
      accessor: 'full_name',
      sortable: true
    },
    { 
      header: 'Lượt thích', 
      accessor: 'favs',
      sortable: true,
      render: (favs) => (
        <div className="flex items-center space-x-1">
          <i className="fas fa-heart text-red-500 text-sm"></i>
          <span className="font-medium">{favs}</span>
        </div>
      )
    },
    { 
      header: 'Số mục', 
      accessor: 'items',
      sortable: true,
      render: (items) => (
        <div className="flex items-center space-x-1">
          <i className="fas fa-list text-blue-500 text-sm"></i>
          <span>{items}</span>
        </div>
      )
    },
    {
      header: 'Thao tác',
      accessor: 'id',
      render: (id) => (
        <div className="flex space-x-2">
          <button
            className="text-blue-600 hover:text-blue-800 disabled:opacity-50 disabled:cursor-not-allowed p-1"
            onClick={() => handleView(id)}
            disabled={isDeleting}
            title="Xem chi tiết"
          >
            <i className="fas fa-eye"></i>
          </button>
          <button
            className="text-yellow-600 hover:text-yellow-800 disabled:opacity-50 disabled:cursor-not-allowed p-1"
            onClick={() => handleEdit(id)}
            disabled={isDeleting}
            title="Chỉnh sửa"
          >
            <i className="fas fa-edit"></i>
          </button>
          <button
            className="text-red-600 hover:text-red-800 disabled:opacity-50 disabled:cursor-not-allowed p-1"
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

  // Tạo options cho dropdown người đăng
  const userOptions = users.map(user => ({
    value: user.id,
    label: user.full_name
  }));

  const formFields = [
    { label: 'Tiêu đề', name: 'title', type: 'text', required: true },
    { label: 'Mô tả', name: 'description', type: 'textarea', rows: 4, required: true },
    { label: 'URL ảnh', name: 'image_url', type: 'url', placeholder: 'https://example.com/image.jpg' },
    { 
      label: 'Người đăng', 
      name: 'user_id', 
      type: 'select',
      options: userOptions,
      required: true
    },
    { 
      label: 'Lượt thích', 
      name: 'favs', 
      type: 'number', 
      min: 0,
      defaultValue: 0
    },
    { 
      label: 'Số mục', 
      name: 'items', 
      type: 'number', 
      min: 0,
      defaultValue: 0
    },
  ];

  const handleView = (id) => {
    const post = posts.find((p) => p.id === id);
    if (post) {
      alert(`Thông tin bài đăng:\n\nTiêu đề: ${post.title}\nMô tả: ${post.description}\nNgười đăng: ${post.full_name}\nLượt thích: ${post.favs}\nSố mục: ${post.items}`);
    }
  };

  const handleEdit = (id) => {
    const post = posts.find((p) => p.id === id);
    if (post) {
      setSelectedPost(post);
      setIsModalOpen(true);
    }
  };

  const handleDelete = async (id) => {
    const post = posts.find((p) => p.id === id);
    if (!post) return;

    const confirmMessage = `Bạn có chắc chắn muốn xóa bài đăng "${post.title}"?\n\nThông tin bài đăng:\n- Người đăng: ${post.full_name}\n- Lượt thích: ${post.favs}\n- Số mục: ${post.items}\n\nHành động này không thể hoàn tác.`;
    
    if (window.confirm(confirmMessage)) {
      setIsDeleting(true);
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const updatedPosts = posts.filter((post) => post.id !== id);
        updatePosts(updatedPosts);
        
        // Kiểm tra và điều chỉnh trang hiện tại nếu cần
        const newFilteredPosts = updatedPosts.filter(
          (post) =>
            post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.full_name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        
        const newTotalPages = Math.ceil(newFilteredPosts.length / ITEMS_PER_PAGE);
        
        if (currentPage > newTotalPages && newTotalPages > 0) {
          setCurrentPage(newTotalPages);
        } else if (newFilteredPosts.length === 0) {
          setCurrentPage(1);
        }
        
        alert(`Đã xóa bài đăng "${post.title}" thành công!`);
        
      } catch (error) {
        console.error('Error deleting post:', error);
        alert('Có lỗi xảy ra khi xóa bài đăng. Vui lòng thử lại.');
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleSubmit = async (data) => {
    try {
      // Validate required fields
      if (!data.title || !data.title.trim()) {
        alert('Vui lòng nhập tiêu đề bài đăng');
        return;
      }
      
      if (!data.description || !data.description.trim()) {
        alert('Vui lòng nhập mô tả bài đăng');
        return;
      }

      if (!data.user_id) {
        alert('Vui lòng chọn người đăng');
        return;
      }

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 600));

      // Tìm thông tin người đăng
      const selectedUser = users.find(user => user.id === parseInt(data.user_id));
      
      if (selectedPost) {
        // Cập nhật bài đăng
        const updatedPosts = posts.map((post) =>
          post.id === selectedPost.id 
            ? { 
                ...post, 
                ...data,
                title: data.title.trim(),
                description: data.description.trim(),
                full_name: selectedUser ? selectedUser.full_name : post.full_name,
                avatar_url: selectedUser ? getFixedAvatar(selectedUser.id) : post.avatar_url,
                favs: parseInt(data.favs) || 0,
                items: parseInt(data.items) || 0
              }
            : post
        );
        updatePosts(updatedPosts);
        alert(`Đã cập nhật bài đăng "${data.title}" thành công!`);
      } else {
        // Thêm bài đăng mới
        const newId = Math.max(...posts.map((p) => p.id)) + 1;
        const newPost = {
          id: newId,
          user_id: parseInt(data.user_id),
          title: data.title.trim(),
          description: data.description.trim(),
          image_url: data.image_url || getFixedPostImage(newId),
          favs: parseInt(data.favs) || 0,
          items: parseInt(data.items) || 0,
          full_name: selectedUser ? selectedUser.full_name : 'Unknown User',
          avatar_url: selectedUser ? getFixedAvatar(selectedUser.id) : 'https://ui-avatars.com/api/?name=Unknown&background=6366f1&color=ffffff&size=40',
        };
        updatePosts([...posts, newPost]);
        alert(`Đã thêm bài đăng "${data.title}" thành công!`);
      }
      
      // Đóng modal và reset state
      setIsModalOpen(false);
      setSelectedPost(null);
      
    } catch (error) {
      console.error('Error saving post:', error);
      alert('Có lỗi xảy ra khi lưu bài đăng. Vui lòng thử lại.');
    }
  };

  // ✅ SỬA ĐỔI: Hàm xử lý khi đóng modal hoặc nhấn Hủy
  const handleModalClose = () => {
    // Đóng modal ngay lập tức mà không hiện thông báo xác nhận
    setIsModalOpen(false);
    setSelectedPost(null);
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

  const handleAddNew = () => {
    setSelectedPost(null);
    setIsModalOpen(true);
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
    setCurrentPage(1);
  };

  return (
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-purple-600">
          <i className="fas fa-newspaper mr-2"></i>
          Quản lý bài đăng
        </h2>
        <div className="text-sm text-gray-600">
          Trang {currentPage} / {totalPages} - Tổng: {filteredAndSortedPosts.length} bài đăng
        </div>
      </div>

      <div className="mb-4 flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Tìm kiếm theo tiêu đề, mô tả, người đăng..."
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

          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-600">Sắp xếp:</label>
            <select
              className="px-3 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split('-');
                setSortBy(field);
                setSortOrder(order);
                setCurrentPage(1);
              }}
            >
              <option value="id-desc">ID (Mới nhất)</option>
              <option value="id-asc">ID (Cũ nhất)</option>
              <option value="title-asc">Tiêu đề (A-Z)</option>
              <option value="title-desc">Tiêu đề (Z-A)</option>
              <option value="full_name-asc">Người đăng (A-Z)</option>
              <option value="full_name-desc">Người đăng (Z-A)</option>
              <option value="favs-desc">Lượt thích (Cao-Thấp)</option>
              <option value="favs-asc">Lượt thích (Thấp-Cao)</option>
              <option value="items-desc">Số mục (Nhiều-Ít)</option>
              <option value="items-asc">Số mục (Ít-Nhiều)</option>
            </select>
          </div>
        </div>
        
        <button
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleAddNew}
          disabled={isDeleting}
        >
          <i className="fas fa-plus"></i>
          Thêm bài đăng
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
        <div className="overflow-x-auto">
          <Table columns={columns} data={paginatedPosts} />
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-gray-600">
            Hiển thị {((currentPage - 1) * ITEMS_PER_PAGE) + 1} - {Math.min(currentPage * ITEMS_PER_PAGE, filteredAndSortedPosts.length)} trong tổng số {filteredAndSortedPosts.length} bài đăng
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
                return page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1);
              })
              .map((page, index, filteredPages) => (
                <React.Fragment key={page}>
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
      {filteredAndSortedPosts.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <i className="fas fa-newspaper text-4xl text-gray-300 mb-4"></i>
          <p className="text-gray-500 text-lg mb-2">
            {searchTerm ? 'Không tìm thấy bài đăng nào' : 'Chưa có bài đăng nào'}
          </p>
          <p className="text-gray-400 text-sm">
            {searchTerm ? 'Thử thay đổi từ khóa tìm kiếm' : 'Hãy thêm bài đăng đầu tiên'}
          </p>
        </div>
      )}

      {/* Modal thêm/sửa */}
      {isModalOpen && (
        <Modal
          title={selectedPost ? 'Chỉnh sửa bài đăng' : 'Thêm bài đăng mới'}
          onClose={handleModalClose}
        >
          <Form
            fields={formFields}
            initialData={selectedPost ? {
              ...selectedPost,
              user_id: selectedPost.user_id
            } : {}}
            onSubmit={handleSubmit}
            onCancel={handleModalClose}
            submitText={selectedPost ? 'Cập nhật' : 'Thêm mới'}
            cancelText="Hủy"
          />
        </Modal>
      )}
    </div>
  );
}

export default Posts;