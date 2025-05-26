import React, { useState, useEffect } from 'react';
import './ProductManagement.css';

const ProductManagement = () => {
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [brands, setBrands] = useState([]);
    const [categories, setCategories] = useState([]);
    const [currentSort, setCurrentSort] = useState({
        column: null,
        direction: 'asc'
    });
    const [formData, setFormData] = useState({
        name: '',
        categoryId: '',
        brandId: '',
        price: 0,
        discount: 0,
        quantity: 0,
        status: true,
        description: '',
        imageUrl: ''
    });
    const [searchTerm, setSearchTerm] = useState('');

    // API URLs
    const API_BASE_URL = 'http://localhost:8080';
    const PRODUCT_API = {
        GET_ALL: `${API_BASE_URL}/products/all`,
        CREATE: `${API_BASE_URL}/admin/products`,
        UPDATE: `${API_BASE_URL}/admin/products`,
        DELETE: `${API_BASE_URL}/admin/products`,
        UPLOAD_IMAGE: `${API_BASE_URL}/admin/upload`,
        SEARCH: `${API_BASE_URL}/admin/products/search-jpa`
    };

    useEffect(() => {
        if (searchTerm) {
            searchProducts();
        } else {
            fetchProducts();
        }
        fetchBrands();
        fetchCategories();
    }, [currentPage, currentSort, searchTerm]);

    useEffect(() => {
        if (editingProduct) {
            setFormData({
                name: editingProduct.name || '',
                categoryId: editingProduct.category?.id || '',
                brandId: editingProduct.brandResponse?.id || '',
                price: editingProduct.price || 0,
                discount: editingProduct.discount || 0,
                quantity: editingProduct.quantity || 0,
                status: !editingProduct.deleteFlag,
                description: editingProduct.description || '',
                imageUrl: editingProduct.imageUrl || ''
            });
        } else {
            setFormData({
                name: '',
                categoryId: '',
                brandId: '',
                price: 0,
                discount: 0,
                quantity: 0,
                status: true,
                description: '',
                imageUrl: ''
            });
        }
    }, [editingProduct]);

    const fetchProducts = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            let url = `${PRODUCT_API.GET_ALL}?page=${currentPage}&size=10`;
            
            if (currentSort.column) {
                url += `&sortBy=${currentSort.column}&sortDir=${currentSort.direction}`;
            }

            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const result = await response.json();
            
            if (result.data && result.data.content) {
                // Ensure each product has the required properties
                const processedProducts = result.data.content.map(product => ({
                    ...product,
                    categories: product.categories || [],
                    brandResponse: product.brandResponse || {},
                    price: product.price || 0,
                    discount: product.discount || 0,
                    quantity: product.quantity || 0,
                    countSales: product.countSales || 0,
                    imageUrl: product.imageUrl || '',
                    description: product.description || '',
                    deleteFlag: product.deleteFlag || false
                }));
                setProducts(processedProducts);
                setTotalPages(result.data.totalPages);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
            setProducts([]); // Set empty array on error
        }
    };

    const fetchBrands = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/brands/all?page=0&size=100&sortBy=id`);
            const result = await response.json();
            setBrands(result.data.content);
        } catch (error) {
            console.error('Error fetching brands:', error);
        }
    };

    const fetchCategories = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            const response = await fetch(`${API_BASE_URL}/admin/categories/full`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const result = await response.json();
            setCategories(result.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const handleSort = (column) => {
        setCurrentSort(prev => ({
            column,
            direction: prev.column === column && prev.direction === 'asc' ? 'desc' : 'asc'
        }));
    };

    const handleImageUpload = async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        const token = localStorage.getItem('accessToken');

        try {
            const response = await fetch(PRODUCT_API.UPLOAD_IMAGE, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });
            return await response.text();
        } catch (error) {
            console.error('Error uploading image:', error);
            throw error;
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? Number(value) : value
        }));
    };

    const handleSave = async () => {
        const token = localStorage.getItem('accessToken');
        try {
            const selectedCategory = categories.find(c => c.id === Number(formData.categoryId));
            const selectedBrand = brands.find(b => b.id === Number(formData.brandId));

            const productData = {
                id: editingProduct?.id,
                name: formData.name,
                description: formData.description,
                price: formData.price,
                quantity: formData.quantity,
                discount: formData.discount,
                imageUrl: formData.imageUrl,
                deleteFlag: !formData.status,
                brand: {
                    name: selectedBrand?.name || '',
                },
                category: {
                    name: selectedCategory?.name || '',
                }
            };

            const method = editingProduct ? 'PUT' : 'POST';
            const response = await fetch(PRODUCT_API.CREATE, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(productData),
            });

            if (!response.ok) {
                throw new Error('Lỗi khi lưu sản phẩm');
            }

            setShowModal(false);
            fetchProducts();
        } catch (error) {
            console.error('Lỗi khi lưu sản phẩm:', error);
            alert('Có lỗi xảy ra khi lưu sản phẩm!');
        }
    };

    const handleDelete = async (productId) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;

        const token = localStorage.getItem('accessToken');
        try {
            const response = await fetch(`${PRODUCT_API.DELETE}/${productId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                fetchProducts();
            }
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    };

    const searchProducts = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            let url = `${PRODUCT_API.SEARCH}?keyword=${encodeURIComponent(searchTerm)}&page=${currentPage}&size=10`;
            
            if (currentSort.column) {
                url += `&sortBy=${currentSort.column}`;
            }

            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const result = await response.json();
            
            if (result.data && result.data.content) {
                const processedProducts = result.data.content.map(product => ({
                    ...product,
                    categories: product.categories || [],
                    brandResponse: product.brandResponse || {},
                    price: product.price || 0,
                    discount: product.discount || 0,
                    quantity: product.quantity || 0,
                    countSales: product.countSales || 0,
                    imageUrl: product.imageUrl || '',
                    description: product.description || '',
                    deleteFlag: product.deleteFlag || false
                }));
                setProducts(processedProducts);
                setTotalPages(result.data.totalPages);
            }
        } catch (error) {
            console.error('Error searching products:', error);
            setProducts([]);
        }
    };

    return (
        <div className="main-content">
            <div className="bg-white rounded shadow-sm p-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h1 className="h5 mb-0">Danh sách sản phẩm</h1>
                    <div className="d-flex gap-2">
                        <div className="search-container">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Tìm kiếm sản phẩm..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <button 
                            className="btn btn-primary" 
                            onClick={() => {
                                setEditingProduct(null);
                                setShowModal(true);
                            }}
                        >
                            Thêm mới
                        </button>
                    </div>
                </div>

                <div className="table-container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th onClick={() => handleSort('name')} className="sortable">
                                    Tên <i className="bi bi-arrow-down-up"></i>
                                </th>
                                <th onClick={() => handleSort('category')} className="sortable">
                                    Danh mục <i className="bi bi-arrow-down-up"></i>
                                </th>
                                <th onClick={() => handleSort('brand')} className="sortable">
                                    Thương hiệu <i className="bi bi-arrow-down-up"></i>
                                </th>
                                <th onClick={() => handleSort('price')} className="sortable">
                                    Giá <i className="bi bi-arrow-down-up"></i>
                                </th>
                                <th onClick={() => handleSort('discount')} className="sortable">
                                    Giảm giá <i className="bi bi-arrow-down-up"></i>
                                </th>
                                <th onClick={() => handleSort('quantity')} className="sortable">
                                    Số lượng <i className="bi bi-arrow-down-up"></i>
                                </th>
                                <th onClick={() => handleSort('countSales')} className="sortable">
                                    Số lượt mua <i className="bi bi-arrow-down-up"></i>
                                </th>
                                <th>Ảnh</th>
                                <th onClick={() => handleSort('status')} className="sortable">
                                    Trạng thái <i className="bi bi-arrow-down-up"></i>
                                </th>
                                <th>Miêu tả</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map(product => (
                                <tr key={product.id || Math.random()} onClick={() => {
                                    setEditingProduct(product);
                                    setShowModal(true);
                                }}>
                                    <td>{product.name || 'N/A'}</td>
                                    <td>{product.category.name|| 'N/A'}</td>
                                    <td>{product.brandResponse?.name || 'N/A'}</td>
                                    <td>{(product.price || 0).toLocaleString('vi-VN')} đ</td>
                                    <td>{product.discount || 0}%</td>
                                    <td>{product.quantity || 0}</td>
                                    <td>{product.countSales || 0}</td>
                                    <td>
                                        {product.imageUrl ? (
                                            <img 
                                                src={product.imageUrl} 
                                                className="product-image" 
                                                alt="Product"
                                            />
                                        ) : (
                                            <span>No image</span>
                                        )}
                                    </td>
                                    <td>{product.deleteFlag ? 'Không hoạt động' : 'Hoạt động'}</td>
                                    <td>{product.description || ''}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="d-flex justify-content-center mt-3">
                    <nav>
                        <ul className="pagination">
                            <li className={`page-item ${currentPage === 0 ? 'disabled' : ''}`}>
                                <button 
                                    className="page-link" 
                                    onClick={() => setCurrentPage(prev => prev - 1)}
                                >
                                    &laquo;
                                </button>
                            </li>
                            {[...Array(totalPages)].map((_, idx) => (
                                <li 
                                    key={idx} 
                                    className={`page-item ${currentPage === idx ? 'active' : ''}`}
                                >
                                    <button 
                                        className="page-link"
                                        onClick={() => setCurrentPage(idx)}
                                    >
                                        {idx + 1}
                                    </button>
                                </li>
                            ))}
                            <li className={`page-item ${currentPage === totalPages - 1 ? 'disabled' : ''}`}>
                                <button 
                                    className="page-link"
                                    onClick={() => setCurrentPage(prev => prev + 1)}
                                >
                                    &raquo;
                                </button>
                            </li>
                        </ul>
                    </nav>
                </div>

                {/* Replace Modal components with regular Bootstrap modal */}
                <div className={`modal fade ${showModal ? 'show' : ''}`} 
                     style={{ display: showModal ? 'block' : 'none' }}
                     tabIndex="-1"
                     role="dialog"
                >
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    {editingProduct ? 'Sửa sản phẩm' : 'Thêm sản phẩm mới'}
                                </h5>
                                <button 
                                    type="button" 
                                    className="btn-close" 
                                    onClick={() => setShowModal(false)}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <form id="productForm">
                                    <div className="mb-3">
                                        <label className="form-label">Tên sản phẩm</label>
                                        <input 
                                            type="text" 
                                            className="form-control"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Danh mục</label>
                                        <select 
                                            className="form-select"
                                            name="categoryId"
                                            value={formData.categoryId}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            <option value="">Chọn danh mục</option>
                                            {categories.map(category => (
                                                <option key={category.id} value={category.id}>
                                                    {category.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Thương hiệu</label>
                                        <select 
                                            className="form-select"
                                            name="brandId"
                                            value={formData.brandId}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            <option value="">Chọn thương hiệu</option>
                                            {brands.map(brand => (
                                                <option key={brand.id} value={brand.id}>
                                                    {brand.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Giá</label>
                                        <input 
                                            type="number" 
                                            className="form-control"
                                            name="price"
                                            value={formData.price}
                                            onChange={handleInputChange}
                                            min="0"
                                            required
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Giảm giá (%)</label>
                                        <input 
                                            type="number" 
                                            className="form-control"
                                            name="discount"
                                            value={formData.discount}
                                            onChange={handleInputChange}
                                            min="0"
                                            max="100"
                                            required
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Số lượng</label>
                                        <input 
                                            type="number" 
                                            className="form-control"
                                            name="quantity"
                                            value={formData.quantity}
                                            onChange={handleInputChange}
                                            min="0"
                                            required
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Trạng thái</label>
                                        <select 
                                            className="form-select"
                                            name="status"
                                            value={formData.status}
                                            onChange={handleInputChange}
                                        >
                                            <option value={true}>Hoạt động</option>
                                            <option value={false}>Không hoạt động</option>
                                        </select>
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Mô tả</label>
                                        <textarea 
                                            className="form-control"
                                            name="description"
                                            value={formData.description}
                                            onChange={handleInputChange}
                                            rows="3"
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Ảnh sản phẩm</label>
                                        <input 
                                            type="file" 
                                            className="form-control"
                                            onChange={async (e) => {
                                                const file = e.target.files[0];
                                                if (file) {
                                                    try {
                                                        const imageUrl = await handleImageUpload(file);
                                                        setFormData(prev => ({
                                                            ...prev,
                                                            imageUrl
                                                        }));
                                                    } catch (error) {
                                                        console.error('Lỗi khi tải ảnh:', error);
                                                        alert('Lỗi khi tải ảnh lên!');
                                                    }
                                                }
                                            }}
                                            accept="image/*"
                                        />
                                        {formData.imageUrl && (
                                            <img 
                                                src={formData.imageUrl} 
                                                alt="Preview" 
                                                className="mt-2"
                                                style={{ maxWidth: '200px' }}
                                            />
                                        )}
                                    </div>
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button 
                                    type="button" 
                                    className="btn btn-secondary" 
                                    onClick={() => setShowModal(false)}
                                >
                                    Hủy
                                </button>
                                {editingProduct && (
                                    <button 
                                        type="button" 
                                        className="btn btn-danger"
                                        onClick={() => {
                                            if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
                                                handleDelete(editingProduct.id);
                                                setShowModal(false);
                                            }
                                        }}
                                    >
                                        Xóa
                                    </button>
                                )}
                                <button 
                                    type="button" 
                                    className="btn btn-primary"
                                    onClick={handleSave}
                                >
                                    Lưu
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                {showModal && <div className="modal-backdrop fade show"></div>}
            </div>
        </div>
    );
};

export default ProductManagement; 
 