import React, { useState, useEffect } from 'react';
import Table from '../common/Table';
import Modal from '../common/Modal';
import Form from '../common/Form';
import { getComments, createComment, updateComment, deleteComment, getUsers, getPosts } from '../../utils/api';

function Comments() {
  const [comments, setComments] = useState([]);
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedComment, setSelectedComment] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [loading, setLoading] = useState(true);
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [commentsData, usersData, postsData] = await Promise.all([
          getComments(),
          getUsers(),
          getPosts()
        ]);
        setComments(commentsData);
        setUsers(usersData);
        setPosts(postsData);
      } catch (error) {
        alert('Lỗi khi tải dữ liệu Comments, người dùng hoặc bài đăng!');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const userOptions = users.map(user => ({ value: user.id, label: user.username }));
  const postOptions = posts.map(post => ({ value: post.id, label: post.caption ? post.caption : post.title }));

  const columns = [
    { header: 'ID', accessor: 'id' },
    {
      header: 'Bài đăng',
      accessor: 'postId',
      render: (postId) => {
        const post = posts.find(p => String(p.id) === String(postId));
        return post ? (post.caption ? post.caption : post.title) : postId;
      },
    },
    {
      header: 'Người bình luận',
      accessor: 'userId',
      render: (userId) => {
        const user = users.find(u => String(u.id) === String(userId));
        return user ? user.username : userId;
      },
    },
    { header: 'Nội dung', accessor: 'content' },
    { header: 'Ngày bình luận', accessor: 'createdAt', render: (date) => new Date(date).toLocaleString() },
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
    { label: 'Bài đăng', name: 'postId', type: 'select', options: postOptions, required: true },
    { label: 'Người bình luận', name: 'userId', type: 'select', options: userOptions, required: true },
    { label: 'Nội dung', name: 'content', type: 'textarea', required: true },
    { label: 'Ngày bình luận', name: 'createdAt', type: 'datetime-local', required: true },
  ];

  const filteredComments = comments.filter(
    (c) => {
      const user = users.find(u => String(u.id) === String(c.userId));
      const post = posts.find(p => String(p.id) === String(c.postId));
      return (
        (user && user.username && user.username.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (post && ((post.caption && post.caption.toLowerCase().includes(searchTerm.toLowerCase())) || (post.title && post.title.toLowerCase().includes(searchTerm.toLowerCase())))) ||
        (c.content && c.content.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
  );

  const totalPages = Math.ceil(filteredComments.length / ITEMS_PER_PAGE);
  const paginatedComments = filteredComments.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleEdit = (id) => {
    const comment = comments.find((c) => String(c.id) === String(id));
    if (comment) {
      setSelectedComment(comment);
      setIsModalOpen(true);
    }
  };

  const handleDelete = async (id) => {
    const comment = comments.find((c) => String(c.id) === String(id));
    if (!comment) return;
    if (window.confirm(`Bạn có chắc chắn muốn xóa bình luận ID "${comment.id}"?`)) {
      setIsDeleting(true);
      try {
        await deleteComment(id);
        setComments((prev) => prev.filter((c) => String(c.id) !== String(id)));
        alert('Đã xóa bình luận thành công!');
      } catch (error) {
        alert('Có lỗi xảy ra khi xóa bình luận. Vui lòng thử lại.');
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleSubmit = async (data) => {
    try {
      if (!data.postId) {
        alert('Vui lòng chọn bài đăng');
        return;
      }
      if (!data.userId) {
        alert('Vui lòng chọn người bình luận');
        return;
      }
      if (!data.content || !data.content.trim()) {
        alert('Vui lòng nhập nội dung');
        return;
      }
      if (!data.createdAt) {
        alert('Vui lòng nhập ngày bình luận');
        return;
      }
      if (!selectedComment || !selectedComment.userId) {
        // Thêm mới
        const maxId = comments.length > 0 ? Math.max(...comments.map(c => parseInt(c.id, 10) || 0)) : 0;
        const newCommentData = {
          id: maxId + 1,
          postId: data.postId,
          userId: data.userId,
          content: data.content,
          createdAt: data.createdAt,
        };
        const newComment = await createComment(newCommentData);
        setComments((prev) => [...prev, newComment]);
        alert('Thêm bình luận thành công!');
      } else {
        // Sửa
        const updateCommentData = {
          postId: data.postId,
          userId: data.userId,
          content: data.content,
          createdAt: data.createdAt,
        };
        const updated = await updateComment(selectedComment.id, updateCommentData);
        setComments((prev) => prev.map((c) => String(c.id) === String(selectedComment.id) ? updated : c));
        alert('Cập nhật bình luận thành công!');
      }
      setIsModalOpen(false);
      setSelectedComment(null);
    } catch (error) {
      alert('Có lỗi xảy ra khi lưu bình luận. Vui lòng thử lại.');
    }
  };

  const handleAddNew = () => {
    const maxId = comments.length > 0 ? Math.max(...comments.map(c => parseInt(c.id, 10) || 0)) : 0;
    setSelectedComment({
      id: maxId + 1,
      postId: '',
      userId: '',
      content: '',
      createdAt: new Date().toISOString().slice(0, 16),
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
    setSelectedComment(null);
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-pink-50 p-6 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-blue-600">
          <i className="fas fa-comments mr-2"></i>
          Quản lý Bình luận
        </h2>
        <div className="text-sm text-blue-600">
          Trang {currentPage} / {totalPages} - Tổng: {filteredComments.length} Bình luận
        </div>
      </div>
      <div className="mb-4 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Tìm kiếm theo người dùng, bài đăng, nội dung..."
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
          Thêm Bình luận
        </button>
      </div>
      {isDeleting && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800">
          <i className="fas fa-spinner fa-spin mr-2"></i>
          Đang xử lý...
        </div>
      )}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table columns={columns} data={paginatedComments} />
      </div>
      {totalPages > 1 && (
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-blue-600">
            Hiển thị {((currentPage - 1) * ITEMS_PER_PAGE) + 1} - {Math.min(currentPage * ITEMS_PER_PAGE, filteredComments.length)} trong tổng số {filteredComments.length} Bình luận
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
      {filteredComments.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <i className="fas fa-comments text-4xl text-blue-300 mb-4"></i>
          <p className="text-blue-500 text-lg mb-2">
            {searchTerm ? 'Không tìm thấy bình luận nào' : 'Chưa có bình luận nào'}
          </p>
          <p className="text-blue-400 text-sm">
            {searchTerm ? 'Thử thay đổi từ khóa tìm kiếm' : 'Hãy thêm bình luận đầu tiên'}
          </p>
        </div>
      )}
      {isModalOpen && (
        <Modal
          title={selectedComment && selectedComment.userId ? 'Chỉnh sửa Bình luận' : 'Thêm Bình luận mới'}
          onClose={handleModalClose}
        >
          <Form
            fields={formFields}
            initialData={selectedComment || {}}
            onSubmit={handleSubmit}
            onCancel={handleModalClose}
            submitText={selectedComment && selectedComment.userId ? 'Cập nhật' : 'Thêm mới'}
            cancelText="Hủy"
          />
        </Modal>
      )}
    </div>
  );
}

export default Comments; 