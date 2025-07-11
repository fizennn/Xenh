import React, { useState, useEffect } from 'react';
import Table from '../common/Table';
import Modal from '../common/Modal';
import Form from '../common/Form';
import { getSuggestions, createSuggestion, updateSuggestion, deleteSuggestion } from '../../utils/api';

function Suggestions() {
  const [suggestions, setSuggestions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [loading, setLoading] = useState(true);
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const suggestionsData = await getSuggestions();
        setSuggestions(suggestionsData);
      } catch (error) {
        alert('Lỗi khi tải dữ liệu Suggestions!');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const columns = [
    { header: 'ID', accessor: 'id' },
    { header: 'Tiêu đề', accessor: 'title' },
    { header: 'Mô tả', accessor: 'desc' },
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
    { label: 'Tiêu đề', name: 'title', type: 'text', required: true },
    { label: 'Mô tả', name: 'desc', type: 'textarea', required: true },
  ];

  const filteredSuggestions = suggestions.filter(
    (s) =>
      (s.title && s.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (s.desc && s.desc.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const totalPages = Math.ceil(filteredSuggestions.length / ITEMS_PER_PAGE);
  const paginatedSuggestions = filteredSuggestions.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleEdit = (id) => {
    const suggestion = suggestions.find((s) => String(s.id) === String(id));
    if (suggestion) {
      setSelectedSuggestion(suggestion);
      setIsModalOpen(true);
    }
  };

  const handleDelete = async (id) => {
    const suggestion = suggestions.find((s) => String(s.id) === String(id));
    if (!suggestion) return;
    if (window.confirm(`Bạn có chắc chắn muốn xóa Suggestion ID "${suggestion.id}"?`)) {
      setIsDeleting(true);
      try {
        await deleteSuggestion(id);
        setSuggestions((prev) => prev.filter((s) => String(s.id) !== String(id)));
        alert('Đã xóa Suggestion thành công!');
      } catch (error) {
        alert('Có lỗi xảy ra khi xóa Suggestion. Vui lòng thử lại.');
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleSubmit = async (data) => {
    try {
      if (!data.title || !data.title.trim()) {
        alert('Vui lòng nhập tiêu đề');
        return;
      }
      if (!data.desc || !data.desc.trim()) {
        alert('Vui lòng nhập mô tả');
        return;
      }
      if (!selectedSuggestion || !selectedSuggestion.title) {
        // Thêm mới
        const maxId = suggestions.length > 0 ? Math.max(...suggestions.map(s => parseInt(s.id, 10) || 0)) : 0;
        const newSuggestionData = {
          id: maxId + 1,
          title: data.title,
          desc: data.desc,
        };
        const newSuggestion = await createSuggestion(newSuggestionData);
        setSuggestions((prev) => [...prev, newSuggestion]);
        alert('Thêm Suggestion thành công!');
      } else {
        // Sửa
        const updateSuggestionData = {
          title: data.title,
          desc: data.desc,
        };
        const updated = await updateSuggestion(selectedSuggestion.id, updateSuggestionData);
        setSuggestions((prev) => prev.map((s) => String(s.id) === String(selectedSuggestion.id) ? updated : s));
        alert('Cập nhật Suggestion thành công!');
      }
      setIsModalOpen(false);
      setSelectedSuggestion(null);
    } catch (error) {
      alert('Có lỗi xảy ra khi lưu Suggestion. Vui lòng thử lại.');
    }
  };

  const handleAddNew = () => {
    const maxId = suggestions.length > 0 ? Math.max(...suggestions.map(s => parseInt(s.id, 10) || 0)) : 0;
    setSelectedSuggestion({
      id: maxId + 1,
      title: '',
      desc: '',
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
    setSelectedSuggestion(null);
  };

  return (
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-blue-600">
          <i className="fas fa-lightbulb mr-2"></i>
          Quản lý Gợi ý
        </h2>
        <div className="text-sm text-gray-600">
          Trang {currentPage} / {totalPages} - Tổng: {filteredSuggestions.length} Gợi ý
        </div>
      </div>
      <div className="mb-4 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Tìm kiếm theo tiêu đề, mô tả..."
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
          className="bg-blue-400 text-white px-4 py-2 rounded-lg hover:bg-blue-500 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleAddNew}
          disabled={isDeleting}
        >
          <i className="fas fa-plus"></i>
          Thêm Gợi ý
        </button>
      </div>
      {isDeleting && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800">
          <i className="fas fa-spinner fa-spin mr-2"></i>
          Đang xử lý...
        </div>
      )}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table columns={columns} data={paginatedSuggestions} />
      </div>
      {totalPages > 1 && (
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-gray-600">
            Hiển thị {((currentPage - 1) * ITEMS_PER_PAGE) + 1} - {Math.min(currentPage * ITEMS_PER_PAGE, filteredSuggestions.length)} trong tổng số {filteredSuggestions.length} Gợi ý
          </div>
          <div className="flex items-center space-x-2">
            <button
              className={`px-3 py-2 rounded-lg flex items-center gap-1 ${currentPage === 1 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-white text-blue-600 hover:bg-blue-100 border border-blue-200'}`}
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
                    <span className="px-2 py-2 text-gray-400">...</span>
                  )}
                  <button
                    className={`px-3 py-2 rounded-lg min-w-[40px] ${currentPage === page ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 hover:bg-blue-100 border border-blue-200'}`}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </button>
                </React.Fragment>
              ))}
            <button
              className={`px-3 py-2 rounded-lg flex items-center gap-1 ${currentPage === totalPages ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-white text-blue-600 hover:bg-blue-100 border border-blue-200'}`}
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Sau
              <i className="fas fa-chevron-right text-xs"></i>
            </button>
          </div>
        </div>
      )}
      {filteredSuggestions.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <i className="fas fa-lightbulb text-4xl text-gray-300 mb-4"></i>
          <p className="text-gray-500 text-lg mb-2">
            {searchTerm ? 'Không tìm thấy gợi ý nào' : 'Chưa có gợi ý nào'}
          </p>
          <p className="text-gray-400 text-sm">
            {searchTerm ? 'Thử thay đổi từ khóa tìm kiếm' : 'Hãy thêm gợi ý đầu tiên'}
          </p>
        </div>
      )}
      {isModalOpen && (
        <Modal
          title={selectedSuggestion && selectedSuggestion.title ? 'Chỉnh sửa Gợi ý' : 'Thêm Gợi ý mới'}
          onClose={handleModalClose}
        >
          <Form
            fields={formFields}
            initialData={selectedSuggestion || {}}
            onSubmit={handleSubmit}
            onCancel={handleModalClose}
            submitText={selectedSuggestion && selectedSuggestion.title ? 'Cập nhật' : 'Thêm mới'}
            cancelText="Hủy"
          />
        </Modal>
      )}
    </div>
  );
}

export default Suggestions; 