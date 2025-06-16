import React, { useState } from 'react';
import Table from '../common/Table';
import Modal from '../common/Modal';
import Form from '../common/Form';
import { products, updateProducts } from '../../utils/data';

function Products() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const ITEMS_PER_PAGE = 10;

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.color.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.style.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const columns = [
    { header: 'ID', accessor: 'id' },
    { header: 'Tên sản phẩm', accessor: 'name' },
    { header: 'Loại', accessor: 'type' },
    { header: 'Màu sắc', accessor: 'color' },
    { header: 'Họa tiết', accessor: 'pattern' },
    { header: 'Phong cách', accessor: 'style' },
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
    { label: 'Tên sản phẩm', name: 'name', type: 'text', required: true },
    { 
      label: 'Loại', 
      name: 'type', 
      type: 'select',
      options: [
        { value: 'Quần áo', label: 'Quần áo' },
        { value: 'Phụ kiện', label: 'Phụ kiện' },
        { value: 'Giày dép', label: 'Giày dép' }
      ],
      required: true 
    },
    { 
      label: 'Màu sắc', 
      name: 'color', 
      type: 'select',
      options: [
        { value: 'Trắng', label: 'Trắng' },
        { value: 'Đen', label: 'Đen' },
        { value: 'Xanh', label: 'Xanh' },
        { value: 'Đỏ', label: 'Đỏ' },
        { value: 'Vàng', label: 'Vàng' },
        { value: 'Xám', label: 'Xám' },
        { value: 'Nâu', label: 'Nâu' },
        { value: 'Hồng', label: 'Hồng' },
        { value: 'Xanh lá', label: 'Xanh lá' },
        { value: 'Be', label: 'Be' }
      ]
    },
    { 
      label: 'Họa tiết', 
      name: 'pattern', 
      type: 'select',
      options: [
        { value: 'Trơn', label: 'Trơn' },
        { value: 'Hoa', label: 'Hoa' },
        { value: 'Chấm bi', label: 'Chấm bi' },
        { value: 'Cà vạt', label: 'Cà vạt' },
        { value: 'In hình', label: 'In hình' },
        { value: 'Hoa nhí', label: 'Hoa nhí' },
        { value: 'In chữ', label: 'In chữ' }
      ]
    },
    { 
      label: 'Phong cách', 
      name: 'style', 
      type: 'select',
      options: [
        { value: 'Cơ bản', label: 'Cơ bản' },
        { value: 'Hiện đại', label: 'Hiện đại' },
        { value: 'Bohemian', label: 'Bohemian' },
        { value: 'Công sở', label: 'Công sở' },
        { value: 'Thể thao', label: 'Thể thao' },
        { value: 'Dạo phố', label: 'Dạo phố' },
        { value: 'Thanh niên', label: 'Thanh niên' },
        { value: 'Cổ điển', label: 'Cổ điển' },
        { value: 'Nữ tính', label: 'Nữ tính' },
        { value: 'Đông', label: 'Đông' },
        { value: 'Dạ hội', label: 'Dạ hội' }
      ]
    },
  ];

  const handleEdit = (id) => {
    const product = products.find((p) => p.id === id);
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    const product = products.find((p) => p.id === id);
    if (!product) return;

    const confirmMessage = `Bạn có chắc chắn muốn xóa sản phẩm "${product.name}"?\nHành động này không thể hoàn tác.`;
    
    if (window.confirm(confirmMessage)) {
      setIsDeleting(true);
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const updatedProducts = products.filter((product) => product.id !== id);
        updateProducts(updatedProducts);
        
        // Kiểm tra nếu trang hiện tại không còn dữ liệu sau khi xóa
        const newFilteredProducts = updatedProducts.filter(
          (product) =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.color.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.style.toLowerCase().includes(searchTerm.toLowerCase())
        );
        
        const newTotalPages = Math.ceil(newFilteredProducts.length / ITEMS_PER_PAGE);
        
        // Nếu trang hiện tại lớn hơn tổng số trang mới, chuyển về trang cuối
        if (currentPage > newTotalPages && newTotalPages > 0) {
          setCurrentPage(newTotalPages);
        } else if (newFilteredProducts.length === 0) {
          setCurrentPage(1);
        }
        
        // Hiển thị thông báo thành công
        alert(`Đã xóa sản phẩm "${product.name}" thành công!`);
        
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Có lỗi xảy ra khi xóa sản phẩm. Vui lòng thử lại.');
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleSubmit = async (data) => {
    try {
      // Validate required fields
      if (!data.name || !data.name.trim()) {
        alert('Vui lòng nhập tên sản phẩm');
        return;
      }
      
      if (!data.type || !data.type.trim()) {
        alert('Vui lòng chọn loại sản phẩm');
        return;
      }

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));

      if (selectedProduct) {
        // Cập nhật sản phẩm
        const updatedProducts = products.map((product) =>
          product.id === selectedProduct.id 
            ? { ...product, ...data, name: data.name.trim(), type: data.type.trim() }
            : product
        );
        updateProducts(updatedProducts);
        alert(`Đã cập nhật sản phẩm "${data.name}" thành công!`);
      } else {
        // Thêm sản phẩm mới
        const newProduct = {
          id: Math.max(...products.map((p) => p.id)) + 1,
          shop_id: 1,
          ...data,
          name: data.name.trim(),
          type: data.type.trim(),
        };
        updateProducts([...products, newProduct]);
        alert(`Đã thêm sản phẩm "${data.name}" thành công!`);
      }
      
      // Đóng modal và reset state
      setIsModalOpen(false);
      setSelectedProduct(null);
      
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Có lỗi xảy ra khi lưu sản phẩm. Vui lòng thử lại.');
    }
  };

  const handleModalClose = () => {
    // Khi đóng modal (bao gồm cả nút Hủy), giữ nguyên trang hiện tại
    setIsModalOpen(false);
    setSelectedProduct(null);
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
    setSelectedProduct(null);
    setIsModalOpen(true);
    // Không thay đổi currentPage khi thêm mới
  };

  return (
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-purple-600">
          <i className="fas fa-box mr-2"></i>
          Quản lý sản phẩm
        </h2>
        <div className="text-sm text-gray-600">
          Trang {currentPage} / {totalPages} - Tổng: {filteredProducts.length} sản phẩm
        </div>
      </div>

      <div className="mb-4 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Tìm kiếm theo tên, loại, màu sắc, phong cách..."
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
          Thêm sản phẩm
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
        <Table columns={columns} data={paginatedProducts} />
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-gray-600">
            Hiển thị {((currentPage - 1) * ITEMS_PER_PAGE) + 1} - {Math.min(currentPage * ITEMS_PER_PAGE, filteredProducts.length)} trong tổng số {filteredProducts.length} sản phẩm
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
      {filteredProducts.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <i className="fas fa-search text-4xl text-gray-300 mb-4"></i>
          <p className="text-gray-500 text-lg mb-2">
            {searchTerm ? 'Không tìm thấy sản phẩm nào' : 'Chưa có sản phẩm nào'}
          </p>
          <p className="text-gray-400 text-sm">
            {searchTerm ? 'Thử thay đổi từ khóa tìm kiếm' : 'Hãy thêm sản phẩm đầu tiên'}
          </p>
        </div>
      )}

      {/* Modal thêm/sửa */}
      {isModalOpen && (
        <Modal
          title={selectedProduct ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
          onClose={handleModalClose}
        >
          <Form
            fields={formFields}
            initialData={selectedProduct || {}}
            onSubmit={handleSubmit}
            onCancel={handleModalClose}
            submitText={selectedProduct ? 'Cập nhật' : 'Thêm mới'}
            cancelText="Hủy"
          />
        </Modal>
      )}
    </div>
  );
}

export default Products;