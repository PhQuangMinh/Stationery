import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        fetchUnreadCount();
        // Cập nhật số lượng thông báo chưa đọc mỗi 30 giây
        const interval = setInterval(fetchUnreadCount, 30000);

        // Thêm event listener cho sự kiện đánh dấu đã đọc
        const handleNotificationRead = () => {
            fetchUnreadCount();
        };
        window.addEventListener('notificationRead', handleNotificationRead);

        return () => {
            clearInterval(interval);
            window.removeEventListener('notificationRead', handleNotificationRead);
        };
    }, []);

    const fetchUnreadCount = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                navigate('/login');
                return;
            }

            const response = await fetch('http://localhost:8080/admin/notifications/unread', {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (response.status === 401) {
                localStorage.removeItem('accessToken');
                navigate('/login');
                return;
            }

            if (response.ok) {
                const result = await response.json();
                console.log('Unread count response:', result);
                if (result && typeof result.data === 'number') {
                    setUnreadCount(result.data);
                } else {
                    console.error('Invalid unread count data:', result);
                }
            }
        } catch (error) {
            console.error('Lỗi khi lấy số thông báo chưa đọc:', error);
        }
    };

    const handleLogout = () => {
        if (window.confirm('Bạn có chắc chắn muốn đăng xuất?')) {
            localStorage.removeItem('accessToken');
            navigate('/login');
        }
    };

    // Kiểm tra xem menu item có đang active không
    const isActive = (path) => {
        return location.pathname === path;
    };

    return (
        <div className="admin-sidebar">
            <div className="sidebar-header">
                Dashboard
            </div>
            <nav id = "sidebar-nav">
                <Link 
                    to="/admin/statistics" 
                    className={`sidebar-item ${isActive('/admin/statistics') ? 'active' : ''}`}
                >
                    <i className="bi bi-graph-up"></i>
                    Thống kê
                </Link>
                <Link 
                    to="/admin/products" 
                    className={`sidebar-item ${isActive('/admin/products') ? 'active' : ''}`}
                >
                    <i className="bi bi-box"></i>
                    Sản phẩm
                </Link>
                <Link 
                    to="/admin/categories" 
                    className={`sidebar-item ${isActive('/admin/categories') ? 'active' : ''}`}
                >
                    <i className="bi bi-list"></i>
                    Danh mục
                </Link>
                <Link 
                    to="/admin/brands" 
                    className={`sidebar-item ${isActive('/admin/brands') ? 'active' : ''}`}
                >
                    <i className="bi bi-tag"></i>
                    Các thương hiệu
                </Link>
                <Link 
                    to="/admin/orders" 
                    className={`sidebar-item ${isActive('/admin/orders') ? 'active' : ''}`}
                >
                    <i className="bi bi-cart"></i>
                    Các đơn hàng
                </Link>
                <Link 
                    to="/admin/users" 
                    className={`sidebar-item ${isActive('/admin/users') ? 'active' : ''}`}
                >
                    <i className="bi bi-people"></i>
                    Người dùng
                </Link>
                <Link 
                    to="/admin/reviews" 
                    className={`sidebar-item ${isActive('/admin/reviews') ? 'active' : ''}`}
                >
                    <i className="bi bi-star"></i>
                    Đánh giá sản phẩm
                </Link>
                <Link 
                    to="/admin/notifications" 
                    className={`sidebar-item ${isActive('/admin/notifications') ? 'active' : ''}`}
                >
                    <i className="bi bi-bell"></i>
                    Thông báo
                    {unreadCount > 0 && (
                        <span className="notification-badge">{unreadCount}</span>
                    )}
                </Link>
            </nav>
            <button className="logout-btn" onClick={handleLogout}>
                <i className="bi bi-box-arrow-right"></i>
                Đăng xuất
            </button>
        </div>
    );
};

export default Sidebar; 