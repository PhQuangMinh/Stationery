import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import './DetailCatalog.css';
import { BASE_API_URL } from '../utils/constants';

const DetailCatalog = () => {
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [currentCategory, setCurrentCategory] = useState('');
    const [expandedCategories, setExpandedCategories] = useState(new Set());
    const [activeCategory, setActiveCategory] = useState('');
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const PAGE_SIZE = 12;

    useEffect(() => {
        fetchCategories().then(() => {
            const categoryFromUrl = searchParams.get('category');
            if (categoryFromUrl) {
                handleCategorySelect(categoryFromUrl);
            } else {
                // Nếu không có category trong URL, chọn category đầu tiên
                if (categories.length > 0) {
                    const firstCategory = categories[0];
                    handleCategorySelect(firstCategory.name);
                }
            }
        });
    }, [searchParams]);

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN').format(price);
    };

    const fetchCategories = async () => {
        try {
            const response = await fetch(`${BASE_API_URL}/categories/tree`);
            const data = await response.json();
            if (data.data) {
                setCategories(data.data);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const fetchProductsByCategory = async (categoryName, page = 0) => {
        try {
            const url = new URL(`${BASE_API_URL}/products/category`);
            url.searchParams.append('categoryName', categoryName);
            url.searchParams.append('page', page);
            url.searchParams.append('size', PAGE_SIZE);
            url.searchParams.append('sortBy', 'id');

            const response = await fetch(url);
            const data = await response.json();
            if (data.data) {
                const { content, totalPages: total, number } = data.data;
                setProducts(content);
                setCurrentPage(number);
                setTotalPages(total);
                setCurrentCategory(categoryName);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const handleCategorySelect = (categoryName) => {
        setActiveCategory(categoryName);
        fetchProductsByCategory(categoryName);
        navigate(`/catalog?category=${categoryName}`);
    };

    const handleCategoryToggle = (categoryId) => {
        setExpandedCategories(prev => {
            const newSet = new Set(prev);
            if (newSet.has(categoryId)) {
                newSet.delete(categoryId);
            } else {
                newSet.add(categoryId);
            }
            return newSet;
        });
    };

    const renderCategory = (category, level = 0) => {
        const hasChildren = category.children && category.children.length > 0;
        const isExpanded = expandedCategories.has(category.id);
        const isActive = activeCategory === category.name;

        return (
            <div key={category.id} className="category-container">
                <div 
                    className={`category-item ${isActive ? 'active' : ''}`}
                    data-id={category.id}
                    data-name={category.name}
                >
                    <div 
                        className="menu-header d-flex align-items-center"
                        onClick={() => handleCategorySelect(category.name)}
                    >
                        {hasChildren ? (
                            <span 
                                className="category-toggle"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleCategoryToggle(category.id);
                                }}
                            >
                                {isExpanded ? '▼' : '▶'}
                            </span>
                        ) : (
                            <span style={{ marginLeft: '1rem' }}></span>
                        )}
                        <span className="category-name">{category.name}</span>
                    </div>
                </div>
                {hasChildren && (
                    <div className={`subcategory ${isExpanded ? 'active' : ''}`}>
                        {category.children.map(child => renderCategory(child, level + 1))}
                    </div>
                )}
            </div>
        );
    };

    const handlePageChange = (page) => {
        if (page >= 0 && page < totalPages) {
            fetchProductsByCategory(currentCategory, page);
        }
    };

    return (
        <>
            <Header />
            <div className="detailcatalog-container container">
                <div className="breadcrumb">
                    <Link to="/">Trang chủ</Link>
                    <span> / Danh mục sản phẩm</span>
                </div>
                <hr />
                
                <div className="main-container">
                    {/* Sidebar */}
                    <div className="sidebar">
                        <div className="fw-bold p-3">DANH MỤC SẢN PHẨM</div>
                        <div id="categoryMenu">
                            {categories.map(category => renderCategory(category))}
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="content-wrapper">
                        <h2 className="category-title">{currentCategory || 'Tất cả sản phẩm'}</h2>
                        <div className="product-grid-container">
                            <div className="product-grid">
                                {products.length === 0 ? (
                                    <p className="text-center w-100">Không có sản phẩm nào trong danh mục này</p>
                                ) : (
                                    products.map(product => (
                                        <div key={product.id} className="product-card">
                                            <Link 
                                                to={`/product/${product.id}`}
                                                className="product-title"
                                            >
                                                <img 
                                                    src={product.imageUrl} 
                                                    alt={product.name} 
                                                    className="product-image"
                                                />
                                                <div className="product-name">{product.name}</div>
                                                <div className="price">{formatPrice(product.price)}đ</div>
                                                {product.discount > 0 && (
                                                    <div className="discount">Giảm {product.discount}%</div>
                                                )}
                                            </Link>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                        
                        {/* Pagination */}
                        {totalPages > 1 && (
                            <nav aria-label="Product pagination" className="pagination">
                                <ul className="pagination justify-content-center">
                                    <li className={`page-item ${currentPage === 0 ? 'disabled' : ''}`}>
                                        <button 
                                            className="page-link" 
                                            onClick={() => handlePageChange(currentPage - 1)}
                                        >
                                            Previous
                                        </button>
                                    </li>
                                    {[...Array(totalPages)].map((_, i) => (
                                        <li 
                                            key={i} 
                                            className={`page-item ${currentPage === i ? 'active' : ''}`}
                                        >
                                            <button 
                                                className="page-link" 
                                                onClick={() => handlePageChange(i)}
                                            >
                                                {i + 1}
                                            </button>
                                        </li>
                                    ))}
                                    <li className={`page-item ${currentPage === totalPages - 1 ? 'disabled' : ''}`}>
                                        <button 
                                            className="page-link" 
                                            onClick={() => handlePageChange(currentPage + 1)}
                                        >
                                            Next
                                        </button>
                                    </li>
                                </ul>
                            </nav>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default DetailCatalog; 