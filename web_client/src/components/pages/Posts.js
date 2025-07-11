import React, { useState } from 'react';
import Table from '../common/Table';
import Modal from '../common/Modal';
import Form from '../common/Form';
import { getPosts, createPost, updatePost, deletePost, getUsers } from '../../utils/api';

function Posts() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [sortBy, setSortBy] = useState('id');
  const [sortOrder, setSortOrder] = useState('desc');
  const ITEMS_PER_PAGE = 10;
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [postsData, usersData] = await Promise.all([
          getPosts(),
          getUsers()
        ]);
        setPosts(postsData);
        setUsers(usersData);
      } catch (error) {
        alert('Lỗi khi tải dữ liệu bài đăng hoặc người dùng!');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

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
        (post.caption && post.caption.toLowerCase().includes(searchTerm.toLowerCase()))
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
    { header: 'ID', accessor: 'id' },
    {
      header: 'Người đăng',
      accessor: 'userId',
      render: (userId) => {
        const user = users.find(u => String(u.id) === String(userId));
        return user ? user.username : userId;
      },
    },
    {
      header: 'Ảnh',
      accessor: 'image',
      render: (url) => (
        <img src={url} alt="Ảnh bài đăng" className="w-16 h-12 object-cover rounded" />
      ),
    },
    { header: 'Chú thích', accessor: 'caption', render: (caption) => <div className="max-w-xs truncate" title={caption}>{caption}</div> },
    { header: 'Lượt thích', accessor: 'likes' },
    { header: 'Ngày tạo', accessor: 'createdAt', render: (date) => new Date(date).toLocaleString() },
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

  const userOptions = users.map(user => ({ value: user.id, label: user.username }));

  const formFields = [
    { label: 'ID', name: 'id', type: 'number', required: true, readOnly: true },
    { label: 'Người đăng', name: 'userId', type: 'select', options: userOptions, required: true },
    { label: 'Ảnh (URL)', name: 'image', type: 'url', required: true },
    { label: 'Chú thích', name: 'caption', type: 'textarea', required: true },
    { label: 'Lượt thích', name: 'likes', type: 'number', min: 0, defaultValue: 0 },
    { label: 'Ngày tạo', name: 'createdAt', type: 'datetime-local', required: true },
  ];

  const handleView = (id) => {
    const post = posts.find((p) => p.id === id);
    if (post) {
      alert(`Thông tin bài đăng:\n\nTiêu đề: ${post.title}\nMô tả: ${post.description}\nNgười đăng: ${post.full_name}\nLượt thích: ${post.favs}\nSố mục: ${post.items}`);
    }
  };

  const handleEdit = (id) => {
    const post = posts.find((p) => String(p.id) === String(id));
    if (post) {
      setSelectedPost(post);
      setIsModalOpen(true);
    }
  };

  const handleDelete = async (id) => {
    const post = posts.find((p) => String(p.id) === String(id));
    if (!post) return;
    const confirmMessage = `Bạn có chắc chắn muốn xóa bài đăng "${post.caption}"?`;
    if (window.confirm(confirmMessage)) {
      setIsDeleting(true);
      try {
        await deletePost(id);
        setPosts((prev) => prev.filter((p) => String(p.id) !== String(id)));
        alert(`Đã xóa bài đăng thành công!`);
      } catch (error) {
        alert('Có lỗi xảy ra khi xóa bài đăng. Vui lòng thử lại.');
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleSubmit = async (data) => {
    try {
      if (!data.userId) {
        alert('Vui lòng chọn người đăng');
        return;
      }
      if (!data.image || !data.image.trim()) {
        alert('Vui lòng nhập URL ảnh');
        return;
      }
      if (!data.caption || !data.caption.trim()) {
        alert('Vui lòng nhập chú thích');
        return;
      }
      if (!data.createdAt) {
        alert('Vui lòng nhập ngày tạo');
        return;
      }
      if (!selectedPost || !selectedPost.caption) {
        // Thêm mới
        const maxId = posts.length > 0 ? Math.max(...posts.map(p => parseInt(p.id, 10) || 0)) : 0;
        const newPostData = {
          id: maxId + 1,
          userId: data.userId,
          image: data.image,
          caption: data.caption,
          likes: parseInt(data.likes) || 0,
          createdAt: data.createdAt,
        };
        const newPost = await createPost(newPostData);
        setPosts((prev) => [...prev, newPost]);
        alert('Thêm bài đăng thành công!');
      } else {
        // Sửa
        const updatePostData = {
          userId: data.userId,
          image: data.image,
          caption: data.caption,
          likes: parseInt(data.likes) || 0,
          createdAt: data.createdAt,
        };
        const updated = await updatePost(selectedPost.id, updatePostData);
        setPosts((prev) => prev.map((p) => String(p.id) === String(selectedPost.id) ? updated : p));
        alert('Cập nhật bài đăng thành công!');
      }
      setIsModalOpen(false);
      setSelectedPost(null);
    } catch (error) {
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
    const maxId = posts.length > 0 ? Math.max(...posts.map(p => parseInt(p.id, 10) || 0)) : 0;
    setSelectedPost({
      id: maxId + 1,
      userId: '',
      image: '',
      caption: '',
      likes: 0,
      createdAt: new Date().toISOString().slice(0, 16),
    });
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
    <div className="bg-gradient-to-br from-blue-50 to-pink-50 p-6 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-blue-600">
          <i className="fas fa-newspaper mr-2"></i>
          Quản lý bài đăng
        </h2>
        <div className="text-sm text-blue-600">
          Trang {currentPage} / {totalPages} - Tổng: {filteredAndSortedPosts.length} bài đăng
        </div>
      </div>

      <div className="mb-4 flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Tìm kiếm theo tiêu đề, mô tả, người đăng..."
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

          <div className="flex items-center space-x-2">
            <label className="text-sm text-blue-600">Sắp xếp:</label>
            <select
              className="px-3 py-2 border border-blue-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
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
          className="bg-gradient-to-r from-blue-400 to-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
          <div className="text-sm text-blue-600">
            Hiển thị {((currentPage - 1) * ITEMS_PER_PAGE) + 1} - {Math.min(currentPage * ITEMS_PER_PAGE, filteredAndSortedPosts.length)} trong tổng số {filteredAndSortedPosts.length} bài đăng
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Nút Previous */}
            <button
              className={`px-3 py-2 rounded-lg flex items-center gap-1 ${
                currentPage === 1 
                  ? 'bg-blue-200 text-blue-400 cursor-not-allowed' 
                  : 'bg-white text-blue-600 hover:bg-blue-50 border border-blue-200'
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
                    <span className="px-2 py-2 text-blue-400">...</span>
                  )}
                  <button
                    className={`px-3 py-2 rounded-lg min-w-[40px] ${
                      currentPage === page 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-white text-blue-600 hover:bg-blue-50 border border-blue-200'
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
                  ? 'bg-blue-200 text-blue-400 cursor-not-allowed' 
                  : 'bg-white text-blue-600 hover:bg-blue-50 border border-blue-200'
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
          <i className="fas fa-newspaper text-4xl text-blue-300 mb-4"></i>
          <p className="text-blue-500 text-lg mb-2">
            {searchTerm ? 'Không tìm thấy bài đăng nào' : 'Chưa có bài đăng nào'}
          </p>
          <p className="text-blue-400 text-sm">
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
              userId: selectedPost.userId
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