import React, { useState, useEffect } from 'react';
import './ReviewManagement.css';
import moment from 'moment';
import 'moment/locale/vi';

const ReviewManagement = () => {
    const [reviews, setReviews] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const pageSize = 10;

    useEffect(() => {
        fetchReviews(currentPage);
    }, [currentPage]);

    const fetchReviews = async (page) => {
        try {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                window.location.href = "/login";
                return;
            }

            const response = await fetch(
                `http://localhost:8080/admin/reviews/get-all?page=${page}&size=${pageSize}&sortBy=id`,
                {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                }
            );

            if (response.status === 401) {
                localStorage.removeItem('accessToken');
                window.location.href = '/login';
                return;
            }

            const result = await response.json();
            if (result.data && result.data.content) {
                setReviews(result.data.content);
                setTotalPages(result.data.totalPages);
            }
        } catch (error) {
            console.error('Lỗi khi lấy danh sách đánh giá:', error);
        }
    };

    const handleDeleteReview = async (reviewId) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa đánh giá này?')) {
            try {
                const token = localStorage.getItem('accessToken');
                const response = await fetch(`http://localhost:8080/admin/reviews/delete/${reviewId}`, {
                    method: 'DELETE',
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });

                if (response.status === 401) {
                    localStorage.removeItem('accessToken');
                    window.location.href = '/login';
                    return;
                }

                if (response.ok) {
                    // Nếu xóa thành công, cập nhật lại danh sách
                    await fetchReviews(currentPage);
                    alert('Xóa đánh giá thành công!');
                } else {
                    alert('Có lỗi xảy ra khi xóa đánh giá!');
                }
            } catch (error) {
                console.error('Lỗi khi xóa đánh giá:', error);
                alert('Có lỗi xảy ra khi xóa đánh giá!');
            }
        }
    };

    const renderStars = (rating) => {
        return [...Array(5)].map((_, index) => (
            <i 
                key={index}
                className={`bi ${index < rating ? 'bi-star-fill' : 'bi-star'}`}
                style={{ color: index < rating ? '#ffc107' : '#ccc' }}
            ></i>
        ));
    };

    const formatDate = (timestamp) => {
        return moment(timestamp).locale('vi').format('DD/MM/YYYY HH:mm');
    };

    const renderPagination = () => {
        const maxVisiblePages = 5;
        let startPage = Math.max(0, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 1);
        startPage = Math.max(0, Math.min(startPage, totalPages - maxVisiblePages));

        const pages = [];

        if (startPage > 0) {
            pages.push(
                <li key="ellipsis-start" className="page-item">
                    <span className="page-link">...</span>
                </li>
            );
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(
                <li key={i} className={`page-item ${i === currentPage ? 'active' : ''}`}>
                    <button className="page-link" onClick={() => setCurrentPage(i)}>
                        {i + 1}
                    </button>
                </li>
            );
        }

        if (endPage < totalPages - 1) {
            pages.push(
                <li key="ellipsis-end" className="page-item">
                    <span className="page-link">...</span>
                </li>
            );
        }

        return pages;
    };

    return (
        <div className="main-content">
            <div className="bg-white rounded shadow-sm p-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h1 className="h5 mb-0">Danh sách đánh giá sản phẩm</h1>
                </div>

                <div className="table-container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Đánh giá</th>
                                <th>Bình luận</th>
                                <th>Thời gian</th>
                                <th>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reviews.map(review => (
                                <tr key={review.id}>
                                    <td>{review.id}</td>
                                    <td>
                                        <div className="rating-stars">
                                            {renderStars(review.rating)}
                                            <span className="ms-2">({review.rating}/5)</span>
                                        </div>
                                    </td>
                                    <td>{review.comment}</td>
                                    <td>{formatDate(review.createdAt)}</td>
                                    <td>
                                        <button 
                                            className="btn btn-danger btn-sm"
                                            onClick={() => handleDeleteReview(review.id)}
                                        >
                                            <i className="bi bi-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

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
                            {renderPagination()}
                            <li className={`page-item ${currentPage >= totalPages - 1 ? 'disabled' : ''}`}>
                                <button
                                    className="page-link"
                                    onClick={() => setCurrentPage(prev => prev + 1)}
                                    disabled={currentPage >= totalPages - 1}
                                >
                                    &raquo;
                                </button>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
        </div>
    );
};

export default ReviewManagement; 