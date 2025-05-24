import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './NotificationManagement.css';

const NotificationManagement = () => {
    const [notifications, setNotifications] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const pageSize = 10;

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('accessToken');
            const response = await fetch(`http://localhost:8080/admin/notifications/${pageSize}`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (response.status === 401) {
                localStorage.removeItem('accessToken');
                navigate('/login');
                return;
            }

            const result = await response.json();
            if (result.data && result.data.content) {
                setNotifications(result.data.content);
                setTotalPages(result.data.totalPages);
            }
        } catch (error) {
            console.error('Lỗi khi lấy danh sách thông báo:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAsRead = async (notificationId) => {
        try {
            const token = localStorage.getItem('accessToken');
            const response = await fetch(`http://localhost:8080/admin/notifications/mark-read?notificationId=${notificationId}`, {
                method: 'PUT',
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (response.ok) {
                // Cập nhật trạng thái trong state
                setNotifications(notifications.map(notification => 
                    notification.id === notificationId 
                        ? { ...notification, status: 'READ' }
                        : notification
                ));
            }
        } catch (error) {
            console.error('Lỗi khi đánh dấu đã đọc:', error);
        }
    };

    const handleDelete = async (notificationId) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa thông báo này?')) {
            try {
                const token = localStorage.getItem('accessToken');
                const response = await fetch(`http://localhost:8080/admin/notifications/delete?notificationId=${notificationId}`, {
                    method: 'PUT',
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    // Xóa thông báo khỏi state
                    setNotifications(notifications.filter(notification => notification.id !== notificationId));
                    alert('Xóa thông báo thành công!');
                }
            } catch (error) {
                console.error('Lỗi khi xóa thông báo:', error);
                alert('Có lỗi xảy ra khi xóa thông báo!');
            }
        }
    };

    const handleNotificationClick = async (notification) => {
        try {
            // Đánh dấu là đã đọc nếu chưa đọc
            if (notification.status === 'UNREAD') {
                const token = localStorage.getItem('accessToken');
                const response = await fetch(`http://localhost:8080/admin/notifications/mark-read?notificationId=${notification.id}`, {
                    method: 'PUT',
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    // Cập nhật trạng thái trong state
                    setNotifications(notifications.map(notif => 
                        notif.id === notification.id 
                            ? { ...notif, status: 'READ' }
                            : notif
                    ));

                    // Đợi một chút để đảm bảo API đã xử lý xong
                    await new Promise(resolve => setTimeout(resolve, 100));

                    // Trigger event để cập nhật Sidebar
                    const event = new CustomEvent('notificationRead');
                    window.dispatchEvent(event);
                }
            }

            // Chuyển hướng đến link sau khi đã xử lý mark-read
            if (notification.link) {
                const path = notification.link.replace('http://localhost:3000', '');
                navigate(path);
            }
        } catch (error) {
            console.error('Lỗi khi đánh dấu đã đọc:', error);
        }
    };

    return (
        <div className="main-content">
            <div className="bg-white rounded shadow-sm p-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h1 className="h5 mb-0">Thông báo</h1>
                </div>

                {loading ? (
                    <div className="text-center py-4">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Đang tải...</span>
                        </div>
                    </div>
                ) : (
                    <div className="notification-list">
                        {notifications.length === 0 ? (
                            <div className="text-center py-4">
                                <p>Không có thông báo nào</p>
                            </div>
                        ) : (
                            notifications.map(notification => (
                                <div 
                                    key={notification.id} 
                                    className={`notification-item ${notification.status === 'UNREAD' ? 'unread' : ''}`}
                                >
                                    <div 
                                        className="notification-content"
                                        onClick={() => handleNotificationClick(notification)}
                                    >
                                        <div className="notification-icon">
                                            <i className={`bi bi-${notification.type === 'REVIEW' ? 'star' : 'bell'}`}></i>
                                        </div>
                                        <div className="notification-message">
                                            {notification.message}
                                        </div>
                                    </div>
                                    <div className="notification-actions">
                                        {notification.status === 'UNREAD' && (
                                            <button 
                                                className="btn btn-sm btn-outline-primary me-2"
                                                onClick={() => handleMarkAsRead(notification.id)}
                                            >
                                                <i className="bi bi-check2"></i>
                                            </button>
                                        )}
                                        <button 
                                            className="btn btn-sm btn-outline-danger"
                                            onClick={() => handleDelete(notification.id)}
                                        >
                                            <i className="bi bi-trash"></i>
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default NotificationManagement; 