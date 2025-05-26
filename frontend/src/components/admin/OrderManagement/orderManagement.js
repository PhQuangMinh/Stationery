import React, { useState, useEffect } from 'react';
import './orderManagement.css';

const OrderManagement = () => {
    const [orders, setOrders] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [editingOrder, setEditingOrder] = useState(null);
    const pageSize = 10;

    const ORDER_STATUSES = {
        COD: {
            "CASH_ON_DELIVERY": 'Chờ xác nhận',
            "PROCESSING": 'Đang xử lý',
            "SHIPPING": 'Đang giao hàng',
            "COMPLETED": 'Đã hoàn thành',
            "CANCELLED": 'Đã hủy'
        },
        VNPAY: {
            "WAITING_PAYMENT": 'Chờ thanh toán',
            "PAID": 'Đã thanh toán',
            "PROCESSING": 'Đang xử lý',
            "SHIPPING": 'Đang giao hàng',
            "COMPLETED": 'Đã hoàn thành',
            "PAYMENT_FAILED": 'Thanh toán thất bại',
            "CANCELLED": 'Đã hủy'
        }
    };

    const API_BASE_URL = 'http://localhost:8080';
    const ORDER_API = {
        GET_ALL: `${API_BASE_URL}/admin/orders/all`,
        UPDATE: `${API_BASE_URL}/admin/orders/update`,
        DELETE: `${API_BASE_URL}/admin/orders`
    };

    useEffect(() => {
        fetchOrders(currentPage);
    }, [currentPage]);

    const fetchOrders = async (page) => {
        try {
            const token = localStorage.getItem('accessToken');
            const response = await fetch(
                `${ORDER_API.GET_ALL}?page=${page}&size=${pageSize}&sortBy=id`,
                {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                }
            );

            const result = await response.json();
            if (result.data) {
                setOrders(result.data.content);
                setTotalPages(result.data.totalPages);
            }
        } catch (error) {
            console.error('Lỗi khi lấy danh sách đơn hàng:', error);
        }
    };

    const formatDate = (timestamp) => {
        if (!timestamp) return 'N/A';
        const date = new Date(timestamp);
        return date.toLocaleDateString('vi-VN');
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN').format(amount);
    };

    const handleSave = async (formData) => {
        const token = localStorage.getItem('accessToken');
        try {
            const orderItemRequests = editingOrder.orderItemResponses.map(item => ({
                id: item.id,
                quantity: item.quantity
            }));

            const updatedOrder = {
                totalAmount: editingOrder.totalAmount,
                status: formData.status,
                paymentMethod: formData.paymentMethod,
                shippingAddress: formData.addressShipping,
                orderItemRequests: orderItemRequests
            };
            console.log(updatedOrder);
            console.log(editingOrder);
            console.log(formData)

            const response = await fetch(`${ORDER_API.UPDATE}/${editingOrder.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(updatedOrder)
            });

            if (!response.ok) {
                throw new Error('Lỗi khi cập nhật đơn hàng');
            }

            setShowModal(false);
            fetchOrders(currentPage);
        } catch (error) {
            console.error('Lỗi khi cập nhật đơn hàng:', error);
            alert('Có lỗi xảy ra khi cập nhật đơn hàng!');
        }
    };

    const getStatusOptions = (paymentMethod) => {
        return Object.entries(ORDER_STATUSES[paymentMethod] || ORDER_STATUSES.COD);
    };
    console.log(orders);

    return (
        <div className="main-content">
            <div className="bg-white rounded shadow-sm p-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h1 className="h5 mb-0">Danh sách đơn hàng</h1>
                </div>

                <div className="table-container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Đơn hàng</th>
                                <th>Họ và tên</th>
                                <th>Số điện thoại</th>
                                <th>Ngày</th>
                                <th>Địa chỉ giao hàng</th>
                                <th>Giá trị đơn hàng</th>
                                <th>Hình thức thanh toán</th>
                                <th>Trạng thái đơn hàng</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(order => (
                                <tr key={order.id} onClick={() => {
                                    setEditingOrder(order);
                                    setShowModal(true);
                                }}>
                                    <td>#{order.id}</td>
                                    <td>{order.userResponse?.name || 'N/A'}</td>
                                    <td>{order.userResponse?.phone || 'N/A'}</td>
                                    <td>{formatDate(order.orderDate)}</td>
                                    <td>{order.addressShipping || ''}</td>
                                    <td>{formatCurrency(order.totalAmount)} VND</td>
                                    <td>
                                        {order.paymentMethod === 'COD' ? 
                                            'Thanh toán khi nhận hàng' : 
                                            'Thanh toán VNPay'}
                                    </td>
                                    <td>
                                        {order.paymentMethod === 'COD' ? 
                                            ORDER_STATUSES.COD[order.status] || 'N/A' : 
                                            ORDER_STATUSES.VNPAY[order.status] || 'N/A'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Phân trang */}
                    <div className="d-flex justify-content-center mt-4">
                        <nav>
                            <ul className="pagination">
                                <li className={`page-item ${currentPage === 0 ? 'disabled' : ''}`}>
                                    <button 
                                        className="page-link" 
                                        onClick={() => setCurrentPage(prev => prev - 1)}
                                        disabled={currentPage === 0}
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
                                        disabled={currentPage === totalPages - 1}
                                    >
                                        &raquo;
                                    </button>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>
            </div>

            {/* Modal chỉnh sửa */}
            <div className={`modal fade ${showModal ? 'show' : ''}`} 
                 style={{ display: showModal ? 'block' : 'none' }}
                 tabIndex="-1">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Chi tiết đơn hàng #{editingOrder?.id}</h5>
                            <button 
                                type="button" 
                                className="btn-close"
                                onClick={() => setShowModal(false)}
                            ></button>
                        </div>
                        <div className="modal-body">
                            <div className="mb-3">
                                <label className="form-label">Họ và tên:</label>
                                <input 
                                    type="text" 
                                    className="form-control"
                                    value={editingOrder?.userResponse?.name || ''}
                                    disabled
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Số điện thoại:</label>
                                <input 
                                    type="text" 
                                    className="form-control"
                                    value={editingOrder?.userResponse?.phone || ''}
                                    disabled
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Địa chỉ giao hàng:</label>
                                <input 
                                    type="text" 
                                    className="form-control"
                                    value={editingOrder?.addressShipping || ''}
                                    onChange={(e) => setEditingOrder({
                                        ...editingOrder,
                                        addressShipping: e.target.value
                                    })}
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Trạng thái đơn hàng:</label>
                                <select 
                                    className="form-select"
                                    value={editingOrder?.status || ''}
                                    onChange={(e) => setEditingOrder({
                                        ...editingOrder,
                                        status: e.target.value
                                    })}
                                >
                                    {editingOrder && Object.entries(ORDER_STATUSES[editingOrder.paymentMethod] || {})
                                        .map(([value, label]) => (
                                            <option key={value} value={value}>
                                                {label}
                                            </option>
                                        ))
                                    }
                                </select>
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Chi tiết sản phẩm:</label>
                                <div className="table-responsive">
                                    <table className="table table-sm">
                                        <thead>
                                            <tr>
                                                <th>Sản phẩm</th>
                                                <th>Số lượng</th>
                                                <th>Đơn giá</th>
                                                <th>Thành tiền</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {editingOrder?.orderItemResponses?.map(item => (
                                                <tr key={item.id}>
                                                    <td>{item.name}</td>
                                                    <td>{item.quantity}</td>
                                                    <td>{formatCurrency(item.price)} VND</td>
                                                    <td>{formatCurrency(item.price * item.quantity)} VND</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button 
                                type="button" 
                                className="btn btn-secondary"
                                onClick={() => setShowModal(false)}
                            >
                                Đóng
                            </button>
                            <button 
                                type="button" 
                                className="btn btn-primary"
                                onClick={() => handleSave(editingOrder)}
                            >
                                Lưu thay đổi
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {showModal && <div className="modal-backdrop fade show"></div>}
        </div>
    );
};

export default OrderManagement; 