import React, { useState, useEffect } from 'react';
import './UserManagement.css';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        username: '',
        password: '',
        confirmPassword: '',
        address: '',
        phone: '',
        role: 'ROLE_USER'
    });

    const pageSize = 10;

    useEffect(() => {
        fetchUsers(currentPage);
    }, [currentPage]);

    const fetchUsers = async (page) => {
        try {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                window.location.href = "/login";
                return;
            }

            const response = await fetch(
                `http://localhost:8080/admin/users?page=${page}&size=${pageSize}&sortBy=id`,
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
                setUsers(result.data.content);
                setTotalPages(result.data.totalPages);
            }
        } catch (error) {
            console.error('Lỗi khi lấy danh sách người dùng:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('accessToken');

        try {
            if (editingUser) {
                // Cập nhật người dùng
                const userData = {
                    name: formData.name,
                    email: formData.email,
                    address: formData.address,
                    phone: formData.phone,
                    role: formData.role
                };

                const response = await fetch(`http://localhost:8080/admin/users/update/${editingUser.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(userData)
                });

                if (response.status === 401) {
                    localStorage.removeItem('accessToken');
                    window.location.href = '/login';
                    return;
                }

                if (!response.ok) {
                    throw new Error('Lỗi khi cập nhật người dùng');
                }
            } else {
                // Thêm người dùng mới
                if (formData.password !== formData.confirmPassword) {
                    alert("Mật khẩu xác nhận không khớp!");
                    return;
                }

                const registerData = {
                    name: formData.name,
                    username: formData.username,
                    email: formData.email,
                    password: formData.password,
                    phone: formData.phone,
                    address: formData.address,
                    role: formData.role
                };

                const response = await fetch('http://localhost:8080/admin/add-user-admin', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(registerData)
                });

                if (response.status === 401) {
                    localStorage.removeItem('accessToken');
                    window.location.href = '/login';
                    return;
                }

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Lỗi khi thêm người dùng');
                }
            }

            // Refresh danh sách và đóng modal
            await fetchUsers(currentPage);
            handleCloseModal();
            alert(editingUser ? 'Cập nhật người dùng thành công!' : 'Thêm người dùng mới thành công!');
        } catch (error) {
            console.error('Lỗi:', error);
            alert(error.message);
        }
    };

    const handleEditUser = (user) => {
        setEditingUser(user);
        setFormData({
            name: user.name || '',
            email: user.email || '',
            username: user.username || '',
            address: user.address || '',
            phone: user.phone || '',
            role: user.role || 'ROLE_USER',
            password: '',
            confirmPassword: ''
        });
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingUser(null);
        setFormData({
            name: '',
            email: '',
            username: '',
            password: '',
            confirmPassword: '',
            address: '',
            phone: '',
            role: 'ROLE_USER'
        });
    };

    const handleAddNew = () => {
        setEditingUser(null);
        setShowModal(true);
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
                    <h1 className="h5 mb-0">Danh sách người dùng</h1>
                    <button className="btn btn-primary" onClick={handleAddNew}>
                        Thêm mới
                    </button>
                </div>

                <div className="table-container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Tên người dùng</th>
                                <th>Username</th>
                                <th>Email</th>
                                <th>Địa chỉ</th>
                                <th>Số điện thoại</th>
                                <th>Vai trò</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user.id} onClick={() => handleEditUser(user)} style={{ cursor: 'pointer' }}>
                                    <td>{user.id}</td>
                                    <td>{user.name || 'N/A'}</td>
                                    <td>{user.username || 'N/A'}</td>
                                    <td>{user.email || 'N/A'}</td>
                                    <td>{user.address || 'N/A'}</td>
                                    <td>{user.phone || 'N/A'}</td>
                                    <td>{user.role || 'N/A'}</td>
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

            {showModal && (
                <div className="modal show d-block" tabIndex="-1">
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    {editingUser ? 'Chỉnh sửa người dùng' : 'Thêm người dùng mới'}
                                </h5>
                                <button type="button" className="btn-close" onClick={handleCloseModal}></button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={handleSubmit}>
                                    <div className="row g-3">
                                        <div className="col-12">
                                            <div className="form-group">
                                                <label>Họ và tên:</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={formData.name}
                                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label>Email:</label>
                                                <input
                                                    type="email"
                                                    className="form-control"
                                                    value={formData.email}
                                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label>Username:</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={formData.username}
                                                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                                                    required
                                                    disabled={editingUser}
                                                />
                                            </div>
                                        </div>
                                        {!editingUser && (
                                            <>
                                                <div className="col-12">
                                                    <div className="form-group">
                                                        <label>Mật khẩu:</label>
                                                        <input
                                                            type="password"
                                                            className="form-control"
                                                            value={formData.password}
                                                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-12">
                                                    <div className="form-group">
                                                        <label>Xác nhận mật khẩu:</label>
                                                        <input
                                                            type="password"
                                                            className="form-control"
                                                            value={formData.confirmPassword}
                                                            onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                        <div className="col-12">
                                            <div className="form-group">
                                                <label>Địa chỉ:</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={formData.address}
                                                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label>Số điện thoại:</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={formData.phone}
                                                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label>Vai trò:</label>
                                                <select
                                                    className="form-select"
                                                    value={formData.role}
                                                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                                                    required
                                                >
                                                    <option value="ROLE_USER">Người dùng</option>
                                                    <option value="ROLE_ADMIN">Quản trị viên</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                                    Hủy
                                </button>
                                <button type="button" className="btn btn-success" onClick={handleSubmit}>
                                    Lưu
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {showModal && <div className="modal-backdrop show"></div>}
        </div>
    );
};

export default UserManagement; 