import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../header/Header';
import Footer from '../footer/Footer';
import './UserOrders.css';
import { BASE_API_URL } from '../../../utils/constants';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const PAYMENT_METHODS = {
    COD: 'Thanh toán khi nhận hàng',
    VNPAY: 'Thanh toán qua VNPAY'
};


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

const UserOrders = () => {
    const [orders, setOrders] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        loadOrders();
    }, []);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return `${date.getDate()} - ${date.getMonth() + 1} - ${date.getFullYear()}`;
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN').format(price);
    };

    const loadOrders = async () => {
        const token = localStorage.getItem('accessToken');
        const username = localStorage.getItem('username');

        try {
            if (token && username) {
                const response = await fetch(`${BASE_API_URL}/user/orders/${username}/get-order`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                const data = await response.json();
                if (data.data) {
                    setOrders(data.data);
                }
            }
        } catch (error) {
            console.error('Error loading orders:', error);
        }
    };

    const cancelOrder = async (orderId) => {
        if (!window.confirm('Bạn có chắc chắn muốn hủy đơn hàng này?')) {
            return;
        }

        try {
            const token = localStorage.getItem('accessToken');
            const response = await fetch(`${BASE_API_URL}/user/orders/cancel/${orderId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Không thể hủy đơn hàng');
            }

            const result = await response.json();
            if (result.data) {
                alert('Đơn hàng đã được hủy thành công');
                loadOrders();
            }
        } catch (error) {
            console.error('Error canceling order:', error);
            alert('Có lỗi xảy ra khi hủy đơn hàng: ' + error.message);
        }
    };

    const goToOrderDetail = (orderId) => {
        navigate(`/order/${orderId}`);
    };

    return (
        <>
            <Header />
            <div className="userorder-container container">
                <div className="breadcrumb mt-3">
                    <a href="/" className="text-dark text-decoration-none">Trang chủ</a>
                    <span className="text-dark"> / Trang đơn hàng</span>
                </div>
                <hr />
                
                <div className="mt-4">
                    <h4><b>Các đơn hàng mà bạn đã đặt</b></h4>
                    <table className="table table-bordered mt-3">
                        <thead>
                            <tr>
                                <th>Đơn hàng</th>
                                <th>Ngày</th>
                                <th>Địa chỉ</th>
                                <th>Giá trị đơn hàng</th>
                                <th>Phương thức thanh toán</th>
                                <th>Trạng thái đơn hàng</th>
                                <th>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="text-center">
                                        Không có đơn hàng nào
                                    </td>
                                </tr>
                            ) : (
                                orders.map(order => {
                                    const canCancel = ['CASH_ON_DELIVERY', 'WAITING_PAYMENT'].includes(order.status);
                                    return (
                                        <tr key={order.id} onClick={() => goToOrderDetail(order.id)} style={{ cursor: 'pointer' }}>
                                            <td>{order.id}</td>
                                            <td>{formatDate(order.orderDate)}</td>
                                            <td>{order.addressShipping}</td>
                                            <td className="price">{formatPrice(order.totalAmount)} đ</td>
                                            <td>{PAYMENT_METHODS[order.paymentMethod] || order.paymentMethod}</td>
                                            <td>{order.paymentMethod === 'COD' ? 
                                                ORDER_STATUSES.COD[order.status] || order.status :
                                                ORDER_STATUSES.VNPAY[order.status] || order.status}
                                            </td>
                                            <td onClick={(e) => e.stopPropagation()}>
                                                {(order.status === 'CASH_ON_DELIVERY' || order.status === 'WAITING_PAYMENT') && (
                                                    <button 
                                                        className="btn btn-danger btn-sm"
                                                        onClick={() => cancelOrder(order.id)}
                                                    >
                                                        Hủy đơn
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default UserOrders; 