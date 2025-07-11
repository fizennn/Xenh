import React, { useState, useEffect } from 'react';
import Table from '../common/Table';
import Modal from '../common/Modal';
import Form from '../common/Form';
import { getWardrobes, createWardrobe, updateWardrobe, deleteWardrobe, getUsers, getItems } from '../../utils/api';

function Wardrobes() {
  const [wardrobes, setWardrobes] = useState([]);
  const [users, setUsers] = useState([]);
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedWardrobe, setSelectedWardrobe] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [loading, setLoading] = useState(true);
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [wardrobesData, usersData, itemsData] = await Promise.all([
          getWardrobes(),
          getUsers(),
          getItems()
        ]);
        setWardrobes(wardrobesData);
        setUsers(usersData);
        setItems(itemsData);
      } catch (error) {
        alert('Lỗi khi tải dữ liệu tủ đồ, người dùng hoặc sản phẩm!');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const userOptions = users.map(user => ({ value: user.id, label: user.username }));
  const itemOptions = items.map(item => ({ value: item.id, label: item.name }));

  const columns = [
    { header: 'ID', accessor: 'id' },
    {
      header: 'Người tạo',
      accessor: 'userId',
      render: (userId) => {
        const user = users.find(u => String(u.id) === String(userId));
        return user ? user.username : userId;
      },
    },
    { header: 'Tên tủ đồ', accessor: 'name' },
    { header: 'Mô tả', accessor: 'description' },
    {
      header: 'Sản phẩm',
      accessor: 'itemIds',
      render: (itemIds) => {
        if (!Array.isArray(itemIds)) return '';
        return itemIds.map(id => {
          const item = items.find(i => String(i.id) === String(id));
          return item ? item.name : id;
        }).join(', ');
      },
    },
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

  const formFields = [
    { label: 'ID', name: 'id', type: 'number', required: true, readOnly: true },
    { label: 'Người tạo', name: 'userId', type: 'select', options: userOptions, required: true },
    { label: 'Tên tủ đồ', name: 'name', type: 'text', required: true },
    { label: 'Mô tả', name: 'description', type: 'textarea' },
    { label: 'Sản phẩm (ID, phân tách bởi dấu phẩy)', name: 'itemIds', type: 'text', required: true },
    { label: 'Ngày tạo', name: 'createdAt', type: 'datetime-local', required: true },
  ];

  const filteredWardrobes = wardrobes.filter(
    (w) =>
      (w.name && w.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (w.description && w.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (Array.isArray(w.itemIds) && w.itemIds.map(id => {
        const item = items.find(i => String(i.id) === String(id));
        return item ? item.name : '';
      }).join(', ').toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const totalPages = Math.ceil(filteredWardrobes.length / ITEMS_PER_PAGE);
  const paginatedWardrobes = filteredWardrobes.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleEdit = (id) => {
    const wardrobe = wardrobes.find((w) => String(w.id) === String(id));
    if (wardrobe) {
      setSelectedWardrobe(wardrobe);
      setIsModalOpen(true);
    }
  };

  const handleDelete = async (id) => {
    const wardrobe = wardrobes.find((w) => String(w.id) === String(id));
    if (!wardrobe) return;
    if (window.confirm(`Bạn có chắc chắn muốn xóa tủ đồ "${wardrobe.name}"?`)) {
      setIsDeleting(true);
      try {
        await deleteWardrobe(id);
        setWardrobes((prev) => prev.filter((w) => String(w.id) !== String(id)));
        alert('Đã xóa tủ đồ thành công!');
      } catch (error) {
        alert('Có lỗi xảy ra khi xóa tủ đồ. Vui lòng thử lại.');
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleSubmit = async (data) => {
    try {
      if (!data.userId) {
        alert('Vui lòng chọn người tạo');
        return;
      }
      if (!data.name || !data.name.trim()) {
        alert('Vui lòng nhập tên tủ đồ');
        return;
      }
      if (!data.itemIds) {
        alert('Vui lòng nhập danh sách sản phẩm');
        return;
      }
      if (!data.createdAt) {
        alert('Vui lòng nhập ngày tạo');
        return;
      }
      // Xử lý itemIds: nhập text -> mảng số
      const itemIdsArr = data.itemIds.split(',').map(t => t.trim()).filter(Boolean).map(Number);
      if (!selectedWardrobe || !selectedWardrobe.name) {
        // Thêm mới
        const maxId = wardrobes.length > 0 ? Math.max(...wardrobes.map(w => parseInt(w.id, 10) || 0)) : 0;
        const newWardrobeData = {
          id: maxId + 1,
          userId: data.userId,
          name: data.name,
          description: data.description || '',
          itemIds: itemIdsArr,
          createdAt: data.createdAt,
        };
        const newWardrobe = await createWardrobe(newWardrobeData);
        setWardrobes((prev) => [...prev, newWardrobe]);
        alert('Thêm tủ đồ thành công!');
      } else {
        // Sửa
        const updateWardrobeData = {
          userId: data.userId,
          name: data.name,
          description: data.description || '',
          itemIds: itemIdsArr,
          createdAt: data.createdAt,
        };
        const updated = await updateWardrobe(selectedWardrobe.id, updateWardrobeData);
        setWardrobes((prev) => prev.map((w) => String(w.id) === String(selectedWardrobe.id) ? updated : w));
        alert('Cập nhật tủ đồ thành công!');
      }
      setIsModalOpen(false);
      setSelectedWardrobe(null);
    } catch (error) {
      alert('Có lỗi xảy ra khi lưu tủ đồ. Vui lòng thử lại.');
    }
  };

  const handleAddNew = () => {
    const maxId = wardrobes.length > 0 ? Math.max(...wardrobes.map(w => parseInt(w.id, 10) || 0)) : 0;
    setSelectedWardrobe({
      id: maxId + 1,
      userId: '',
      name: '',
      description: '',
      itemIds: '',
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
    setSelectedWardrobe(null);
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-blue-900">
          <i className="fas fa-archive mr-2"></i>
          Quản lý tủ đồ
        </h2>
        <div className="text-sm text-blue-700">
          Trang {currentPage} / {totalPages} - Tổng: {filteredWardrobes.length} tủ đồ
        </div>
      </div>
      <div className="mb-4 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Tìm kiếm theo tên tủ đồ, mô tả, sản phẩm..."
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
          Thêm tủ đồ
        </button>
      </div>
      {isDeleting && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800">
          <i className="fas fa-spinner fa-spin mr-2"></i>
          Đang xử lý...
        </div>
      )}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table columns={columns} data={paginatedWardrobes} />
      </div>
      {totalPages > 1 && (
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-blue-700">
            Hiển thị {((currentPage - 1) * ITEMS_PER_PAGE) + 1} - {Math.min(currentPage * ITEMS_PER_PAGE, filteredWardrobes.length)} trong tổng số {filteredWardrobes.length} tủ đồ
          </div>
          <div className="flex items-center space-x-2">
            <button
              className={`px-3 py-2 rounded-lg flex items-center gap-1 ${currentPage === 1 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-white text-blue-900 hover:bg-blue-200 border border-blue-200'}`}
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
                    className={`px-3 py-2 rounded-lg min-w-[40px] ${currentPage === page ? 'bg-blue-600 text-white' : 'bg-white text-blue-900 hover:bg-blue-200 border border-blue-200'}`}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </button>
                </React.Fragment>
              ))}
            <button
              className={`px-3 py-2 rounded-lg flex items-center gap-1 ${currentPage === totalPages ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-white text-blue-900 hover:bg-blue-200 border border-blue-200'}`}
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Sau
              <i className="fas fa-chevron-right text-xs"></i>
            </button>
          </div>
        </div>
      )}
      {filteredWardrobes.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <i className="fas fa-archive text-4xl text-blue-300 mb-4"></i>
          <p className="text-blue-700 text-lg mb-2">
            {searchTerm ? 'Không tìm thấy tủ đồ nào' : 'Chưa có tủ đồ nào'}
          </p>
          <p className="text-blue-600 text-sm">
            {searchTerm ? 'Thử thay đổi từ khóa tìm kiếm' : 'Hãy thêm tủ đồ đầu tiên'}
          </p>
        </div>
      )}
      {isModalOpen && (
        <Modal
          title={selectedWardrobe && selectedWardrobe.name ? 'Chỉnh sửa tủ đồ' : 'Thêm tủ đồ mới'}
          onClose={handleModalClose}
        >
          <Form
            fields={formFields}
            initialData={selectedWardrobe ? {
              ...selectedWardrobe,
              itemIds: Array.isArray(selectedWardrobe.itemIds) ? selectedWardrobe.itemIds.join(', ') : '',
            } : {}}
            onSubmit={handleSubmit}
            onCancel={handleModalClose}
            submitText={selectedWardrobe && selectedWardrobe.name ? 'Cập nhật' : 'Thêm mới'}
            cancelText="Hủy"
          />
        </Modal>
      )}
    </div>
  );
}

export default Wardrobes; 