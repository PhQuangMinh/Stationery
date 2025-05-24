import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Header from '../header/Header';
import Footer from '../footer/Footer';
import { BASE_API_URL } from '../../../utils/constants';
import './OrderDetail.css';

const OrderDetail = () => {
    const [orderData, setOrderData] = useState(null);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [showNotificationModal, setShowNotificationModal] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState('');
    const [currentProduct, setCurrentProduct] = useState(null);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [productReviews, setProductReviews] = useState(new Map());
    const { id } = useParams();

    useEffect(() => {
        fetchOrderDetails();
    }, [id]);

    const fetchOrderDetails = async () => {
        try {
            const username = localStorage.getItem('username');
            if (!id || !username) {
                throw new Error('Không tìm thấy thông tin đơn hàng');
            }

            const response = await fetch(`${BASE_API_URL}/user/orders/${username}/${id}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                }
            });

            if (!response.ok) {
                throw new Error('Không thể tải thông tin đơn hàng');
            }

            const result = await response.json();
            if (result.data) {
                setOrderData(result.data);
            }
        } catch (error) {
            console.error('Lỗi:', error);
            alert('Có lỗi xảy ra khi tải thông tin đơn hàng');
        }
    };

    const handleOpenReviewModal = (product) => {
        if (orderData?.status !== 'COMPLETED') {
            setNotificationMessage('Chỉ có thể đánh giá khi đơn hàng đã hoàn thành!');
            setShowNotificationModal(true);
            return;
        }
        setCurrentProduct(product);
        setRating(0);
        setComment('');
        setShowReviewModal(true);
    };

    const handleSubmitReview = async () => {
        if (rating === 0) {
            alert('Vui lòng chọn số sao đánh giá!');
            return;
        }

        try {
            const username = localStorage.getItem('username');
            const reviewRequest = {
                rating: rating,
                comment: comment
            };

            const response = await fetch(`${BASE_API_URL}/user/reviews/${currentProduct.productId}/${username}/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                },
                body: JSON.stringify(reviewRequest)
            });

            if (!response.ok) {
                throw new Error('Không thể gửi đánh giá');
            }

            const result = await response.json();
            if (result.data) {
                alert('Đánh giá của bạn đã được gửi thành công!');
                setProductReviews(new Map(productReviews.set(currentProduct.productId, {
                    rating,
                    comment,
                    date: new Date()
                })));
                setShowReviewModal(false);
                fetchOrderDetails();
            }
        } catch (error) {
            console.error('Lỗi khi gửi đánh giá:', error);
            alert('Có lỗi xảy ra khi gửi đánh giá!');
        }
    };

    const formatPrice = (price) => {
        return price.toLocaleString('vi-VN') + ' đ';
    };

    return (
        <>
            <Header />
            <div className="orderdetail-container container">
                <div className="breadcrumb">
                    <Link to="/" className="text-dark text-decoration-none">Trang chủ</Link>
                    <span className="mx-2">/</span>
                    <span>Chi tiết đơn hàng</span>
                </div>
                <hr />

                {orderData && (
                    <div className="order-detail-container">
                        <h1 className="mb-4">Đơn hàng của bạn</h1>
                        
                        <div className="order-info">
                            <div className="row">
                                <div className="col-md-6">
                                    <p><strong>Mã đơn hàng:</strong> {orderData.id}</p>
                                    <p><strong>Ngày đặt:</strong> {new Date(orderData.orderDate).toLocaleDateString('vi-VN')}</p>
                                    <p><strong>Trạng thái:</strong> {orderData.status}</p>
                                </div>
                                <div className="col-md-6">
                                    <p><strong>Địa chỉ giao hàng:</strong> {orderData.addressShipping}</p>
                                    <p><strong>Phương thức thanh toán:</strong> {orderData.paymentMethod}</p>
                                </div>
                            </div>
                        </div>

                        <div className="table-responsive">
                            <table className="product-table">
                                <thead>
                                    <tr>
                                        <th>Ảnh sản phẩm</th>
                                        <th>Tên sản phẩm</th>
                                        <th>Đơn giá</th>
                                        <th>Số lượng</th>
                                        <th>Thành tiền</th>
                                        <th>Đánh giá</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orderData.orderItemResponses.map((item) => (
                                        <tr key={item.productId}>
                                            <td>
                                                <img src={item.imageUrl} alt={item.name} className="product-image" />
                                            </td>
                                            <td>{item.name}</td>
                                            <td className="text-danger">{formatPrice(item.price)}</td>
                                            <td>{item.quantity}</td>
                                            <td className="text-danger">{formatPrice(item.price * item.quantity)}</td>
                                            <td>
                                                <button
                                                    className={`review-btn ${productReviews.has(item.productId) ? 'reviewed' : ''}`}
                                                    onClick={() => handleOpenReviewModal(item)}
                                                    disabled={productReviews.has(item.productId)}
                                                >
                                                    {productReviews.has(item.productId) ? 'Đã đánh giá' : 'Đánh giá'}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="text-end mt-4">
                            <h5>
                                Tổng tiền thanh toán: 
                                <span className="text-danger ms-2">{formatPrice(orderData.totalAmount)}</span>
                            </h5>
                        </div>
                    </div>
                )}

                {showReviewModal && (
                    <div className="modal show" style={{ display: 'block' }}>
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Đánh giá sản phẩm</h5>
                                    <button type="button" className="btn-close" onClick={() => setShowReviewModal(false)}></button>
                                </div>
                                <div className="modal-body">
                                    {currentProduct && (
                                        <div className="product-info mb-3">
                                            <img src={currentProduct.imageUrl} alt={currentProduct.name} className="modal-product-image" />
                                            <h6>{currentProduct.name}</h6>
                                        </div>
                                    )}
                                    <div className="rating-input mb-3">
                                        <label>Đánh giá của bạn:</label>
                                        <div className="stars">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <i
                                                    key={star}
                                                    className={`bi ${star <= rating ? 'bi-star-fill active' : 'bi-star'}`}
                                                    onClick={() => setRating(star)}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label>Nhận xét:</label>
                                        <textarea
                                            className="form-control"
                                            rows="3"
                                            value={comment}
                                            onChange={(e) => setComment(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button className="btn btn-secondary" onClick={() => setShowReviewModal(false)}>
                                        Đóng
                                    </button>
                                    <button className="btn btn-primary" onClick={handleSubmitReview}>
                                        Gửi đánh giá
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Notification Modal */}
                {showNotificationModal && (
                    <div className="modal show" style={{ display: 'block' }}>
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content">
                                <div className="modal-header bg-warning text-white">
                                    <h5 className="modal-title">Thông báo</h5>
                                    <button type="button" className="btn-close" onClick={() => setShowNotificationModal(false)}></button>
                                </div>
                                <div className="modal-body text-center py-4">
                                    <i className="bi bi-exclamation-circle text-warning" style={{ fontSize: '3rem' }}></i>
                                    <p className="mt-3 mb-0">{notificationMessage}</p>
                                </div>
                                <div className="modal-footer justify-content-center">
                                    <button className="btn btn-secondary" onClick={() => setShowNotificationModal(false)}>
                                        Đóng
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <Footer />
        </>
    );
};

export default OrderDetail; 