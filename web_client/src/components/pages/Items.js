import React, { useState, useEffect } from 'react';
import Table from '../common/Table';
import Modal from '../common/Modal';
import Form from '../common/Form';
import { getItems, createItem, updateItem, deleteItem, getUsers } from '../../utils/api';

function Items() {
  const [items, setItems] = useState([]);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [loading, setLoading] = useState(true);
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [itemsData, usersData] = await Promise.all([
          getItems(),
          getUsers()
        ]);
        setItems(itemsData);
        setUsers(usersData);
      } catch (error) {
        alert('Lỗi khi tải dữ liệu sản phẩm hoặc người dùng!');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const userOptions = users.map(user => ({ value: user.id, label: user.username }));

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
    { header: 'Tên sản phẩm', accessor: 'name' },
    { header: 'Loại', accessor: 'category' },
    { header: 'Thương hiệu', accessor: 'brand' },
    { header: 'Màu sắc', accessor: 'color' },
    { header: 'Kích cỡ', accessor: 'size' },
    { header: 'Giá', accessor: 'price', render: (price) => price.toLocaleString('vi-VN') + '₫' },
    {
      header: 'Ảnh',
      accessor: 'image',
      render: (url) => (
        <img src={url} alt="Ảnh sản phẩm" className="w-16 h-12 object-cover rounded" />
      ),
    },
    {
      header: 'Tags',
      accessor: 'tags',
      render: (tags) => Array.isArray(tags) ? tags.join(', ') : '',
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
    { label: 'Người đăng', name: 'userId', type: 'select', options: userOptions, required: true },
    { label: 'Tên sản phẩm', name: 'name', type: 'text', required: true },
    { label: 'Loại', name: 'category', type: 'text', required: true },
    { label: 'Thương hiệu', name: 'brand', type: 'text' },
    { label: 'Màu sắc', name: 'color', type: 'text' },
    { label: 'Kích cỡ', name: 'size', type: 'text' },
    { label: 'Giá', name: 'price', type: 'number', min: 0, required: true },
    { label: 'Ảnh (URL)', name: 'image', type: 'url', required: true },
    { label: 'Tags (phân tách bởi dấu phẩy)', name: 'tags', type: 'text' },
  ];

  const filteredItems = items.filter(
    (item) =>
      (item.name && item.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.brand && item.brand.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.color && item.color.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (Array.isArray(item.tags) && item.tags.join(',').toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleEdit = (id) => {
    const item = items.find((i) => String(i.id) === String(id));
    if (item) {
      setSelectedItem(item);
      setIsModalOpen(true);
    }
  };

  const handleDelete = async (id) => {
    const item = items.find((i) => String(i.id) === String(id));
    if (!item) return;
    if (window.confirm(`Bạn có chắc chắn muốn xóa sản phẩm "${item.name}"?`)) {
      setIsDeleting(true);
      try {
        await deleteItem(id);
        setItems((prev) => prev.filter((i) => String(i.id) !== String(id)));
        alert('Đã xóa sản phẩm thành công!');
      } catch (error) {
        alert('Có lỗi xảy ra khi xóa sản phẩm. Vui lòng thử lại.');
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
      if (!data.name || !data.name.trim()) {
        alert('Vui lòng nhập tên sản phẩm');
        return;
      }
      if (!data.category || !data.category.trim()) {
        alert('Vui lòng nhập loại sản phẩm');
        return;
      }
      if (!data.price) {
        alert('Vui lòng nhập giá sản phẩm');
        return;
      }
      if (!data.image || !data.image.trim()) {
        alert('Vui lòng nhập URL ảnh');
        return;
      }
      // Xử lý tags: nhập text -> mảng
      const tagsArr = data.tags ? data.tags.split(',').map(t => t.trim()).filter(Boolean) : [];
      if (!selectedItem || !selectedItem.name) {
        // Thêm mới
        const maxId = items.length > 0 ? Math.max(...items.map(i => parseInt(i.id, 10) || 0)) : 0;
        const newItemData = {
          id: maxId + 1,
          userId: data.userId,
          name: data.name,
          category: data.category,
          brand: data.brand || '',
          color: data.color || '',
          size: data.size || '',
          price: parseInt(data.price) || 0,
          image: data.image,
          tags: tagsArr,
        };
        const newItem = await createItem(newItemData);
        setItems((prev) => [...prev, newItem]);
        alert('Thêm sản phẩm thành công!');
      } else {
        // Sửa
        const updateItemData = {
          userId: data.userId,
          name: data.name,
          category: data.category,
          brand: data.brand || '',
          color: data.color || '',
          size: data.size || '',
          price: parseInt(data.price) || 0,
          image: data.image,
          tags: tagsArr,
        };
        const updated = await updateItem(selectedItem.id, updateItemData);
        setItems((prev) => prev.map((i) => String(i.id) === String(selectedItem.id) ? updated : i));
        alert('Cập nhật sản phẩm thành công!');
      }
      setIsModalOpen(false);
      setSelectedItem(null);
    } catch (error) {
      alert('Có lỗi xảy ra khi lưu sản phẩm. Vui lòng thử lại.');
    }
  };

  const handleAddNew = () => {
    const maxId = items.length > 0 ? Math.max(...items.map(i => parseInt(i.id, 10) || 0)) : 0;
    setSelectedItem({
      id: maxId + 1,
      userId: '',
      name: '',
      category: '',
      brand: '',
      color: '',
      size: '',
      price: 0,
      image: '',
      tags: '',
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
    setSelectedItem(null);
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-pink-50 p-6 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-blue-600">
          <i className="fas fa-tshirt mr-2"></i>
          Quản lý sản phẩm
        </h2>
        <div className="text-sm text-blue-600">
          Trang {currentPage} / {totalPages} - Tổng: {filteredItems.length} sản phẩm
        </div>
      </div>
      <div className="mb-4 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Tìm kiếm theo tên, thương hiệu, màu sắc, tag..."
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
          Thêm sản phẩm
        </button>
      </div>
      {isDeleting && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800">
          <i className="fas fa-spinner fa-spin mr-2"></i>
          Đang xử lý...
        </div>
      )}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table columns={columns} data={paginatedItems} />
      </div>
      {totalPages > 1 && (
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-blue-600">
            Hiển thị {((currentPage - 1) * ITEMS_PER_PAGE) + 1} - {Math.min(currentPage * ITEMS_PER_PAGE, filteredItems.length)} trong tổng số {filteredItems.length} sản phẩm
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
      {filteredItems.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <i className="fas fa-tshirt text-4xl text-blue-300 mb-4"></i>
          <p className="text-blue-500 text-lg mb-2">
            {searchTerm ? 'Không tìm thấy sản phẩm nào' : 'Chưa có sản phẩm nào'}
          </p>
          <p className="text-blue-400 text-sm">
            {searchTerm ? 'Thử thay đổi từ khóa tìm kiếm' : 'Hãy thêm sản phẩm đầu tiên'}
          </p>
        </div>
      )}
      {isModalOpen && (
        <Modal
          title={selectedItem && selectedItem.name ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
          onClose={handleModalClose}
        >
          <Form
            fields={formFields}
            initialData={selectedItem ? {
              ...selectedItem,
              tags: Array.isArray(selectedItem.tags) ? selectedItem.tags.join(', ') : '',
            } : {}}
            onSubmit={handleSubmit}
            onCancel={handleModalClose}
            submitText={selectedItem && selectedItem.name ? 'Cập nhật' : 'Thêm mới'}
            cancelText="Hủy"
          />
        </Modal>
      )}
    </div>
  );
}

export default Items; 