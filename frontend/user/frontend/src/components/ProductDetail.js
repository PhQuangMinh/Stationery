import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as faStarSolid } from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarRegular } from '@fortawesome/free-regular-svg-icons';
import Header from './Header';
import Footer from './Footer';
import './ProductDetail.css';

const BASE_API_URL = 'http://localhost:8080';

const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [reviews, setReviews] = useState({ content: [], totalPages: 0, number: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchProductDetails();
        fetchReviews();
    }, [id]);

    const fetchProductDetails = async () => {
        try {
            const response = await fetch(`${BASE_API_URL}/products/${id}`);
            const data = await response.json();
            if (data.data) {
                setProduct({
                    id: data.data.id,
                    name: data.data.name,
                    brand: data.data.brandResponse?.name || "Chưa có thương hiệu",
                    stockStatus: data.data.stockStatus || "Còn hàng",
                    rating: data.data.rating || 5,
                    price: data.data.price,
                    originalPrice: data.data.originalPrice || data.data.price,
                    discount: data.data.discount || 0,
                    imageUrl: data.data.imageUrl,
                    description: data.data.description || "Chưa có mô tả",
                    quantity: data.data.quantity
                });
            }
            setLoading(false);
        } catch (err) {
            setError('Không thể tải thông tin sản phẩm');
            setLoading(false);
        }
    };

    const fetchReviews = async (page = 0) => {
        try {
            const response = await fetch(`${BASE_API_URL}/reviews/product/${id}?page=${page}&size=5&sortBy=id`);
            const data = await response.json();
            setReviews(data.data);
        } catch (err) {
            console.error('Error fetching reviews:', err);
        }
    };

    const handleAddToCart = async () => {
        const token = localStorage.getItem('accessToken');
        const username = localStorage.getItem('username');
        
        if (!token || !username) {
            if (window.confirm('Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng. Đến trang đăng nhập ngay?')) {
                localStorage.setItem('pendingProduct', JSON.stringify({
                    id: product.id,
                    quantity: quantity
                }));
                window.location.href = "/login";
            }
            return;
        }

        try {
            const productRequest = {
                id: product.id,
                name: product.name,
                description: product.description,
                price: product.price,
                quantity: quantity,
                countSales: 0,
                discount: product.discount,
                imageUrl: product.imageUrl,
                brand: {
                    name: product.brand
                },
                categories: []
            };

            const response = await fetch(`${BASE_API_URL}/user/${username}/carts/add-products`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(productRequest)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Không thể thêm sản phẩm vào giỏ hàng');
            }

            alert(`Sản phẩm đã được thêm vào giỏ hàng với số lượng ${quantity}! 🛒`);
        } catch (err) {
            alert(err.message || 'Có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng');
        }
    };

    const renderStars = (rating) => {
        return [...Array(5)].map((_, index) => (
            <FontAwesomeIcon
                key={index}
                icon={index < rating ? faStarSolid : faStarRegular}
                className="star-icon"
            />
        ));
    };

    if (loading) return (
        <>
            <Header />
            <div>Đang tải...</div>
            <Footer />
        </>
    );
    if (error) return (
        <>
            <Header />
            <div>{error}</div>
            <Footer />
        </>
    );
    if (!product) return (
        <>
            <Header />
            <div>Không tìm thấy sản phẩm</div>
            <Footer />
        </>
    );

    const discountPrice = product.price * (100 - product.discount) / 100;

    return (
        <>
            <Header />
            <div className="product-detail-container">
                <div className="breadcrumb">
                    <Link to="/" className="text-dark text-decoration-none">Trang chủ</Link>
                    <span> / Chi tiết sản phẩm</span>
                </div>
                
                <div className="product-section">
                    <div className="product-image-section">
                        <img src={product.imageUrl} alt={product.name} className="product-image" />
                    </div>
                    
                    <div className="product-info-section">
                        <h1>{product.name}</h1>
                        <div className="brand-info">
                            Thương hiệu: <span className="brand-name">{product.brand}</span> | 
                            Số lượng còn lại: <span className="stock-quantity">{product.quantity}</span>
                        </div>
                        
                        <div className="rating-section">
                            {renderStars(product.rating)}
                        </div>
                        
                        <div className="price-section">
                            <span className="current-price">{new Intl.NumberFormat('vi-VN').format(discountPrice)}đ</span>
                            {product.discount > 0 && (
                                <>
                                    <span className="original-price">
                                        {new Intl.NumberFormat('vi-VN').format(product.price)}đ
                                    </span>
                                    <span className="discount-badge">-{product.discount}%</span>
                                </>
                            )}
                        </div>
                        
                        <div className="description-section">
                            <h4>Mô tả sản phẩm:</h4>
                            <p>{product.description}</p>
                        </div>
                        
                        <div className="quantity-section">
                            <button 
                                className="quantity-btn"
                                onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                            >
                                -
                            </button>
                            <input
                                type="number"
                                value={quantity}
                                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                className="quantity-input"
                            />
                            <button 
                                className="quantity-btn"
                                onClick={() => setQuantity(prev => prev + 1)}
                            >
                                +
                            </button>
                        </div>
                        
                        <button className="add-to-cart-btn" onClick={handleAddToCart}>
                            <i className="fas fa-shopping-cart"></i> Thêm vào giỏ hàng
                        </button>
                    </div>
                </div>

                <div className="reviews-section">
                    <h3>Đánh giá từ khách hàng</h3>
                    {reviews.content.length > 0 ? (
                        <>
                            <div className="reviews-list">
                                {reviews.content.map((review, index) => (
                                    <div key={index} className="review-card">
                                        <div className="review-header">
                                            <h5>Khách hàng</h5>
                                            <small>{new Date(review.createdAt).toLocaleDateString('vi-VN')}</small>
                                        </div>
                                        <div className="review-rating">
                                            {renderStars(review.rating)}
                                        </div>
                                        <p className="review-comment">{review.comment}</p>
                                    </div>
                                ))}
                            </div>
                            
                            {reviews.totalPages > 1 && (
                                <div className="pagination">
                                    <button
                                        className={`pagination-btn ${reviews.number === 0 ? 'disabled' : ''}`}
                                        onClick={() => fetchReviews(reviews.number - 1)}
                                        disabled={reviews.number === 0}
                                    >
                                        Trước
                                    </button>
                                    
                                    {[...Array(reviews.totalPages)].map((_, index) => (
                                        <button
                                            key={index}
                                            className={`pagination-btn ${index === reviews.number ? 'active' : ''}`}
                                            onClick={() => fetchReviews(index)}
                                        >
                                            {index + 1}
                                        </button>
                                    ))}
                                    
                                    <button
                                        className={`pagination-btn ${reviews.number === reviews.totalPages - 1 ? 'disabled' : ''}`}
                                        onClick={() => fetchReviews(reviews.number + 1)}
                                        disabled={reviews.number === reviews.totalPages - 1}
                                    >
                                        Sau
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        <p>Chưa có đánh giá nào.</p>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
};

export default ProductDetail; 