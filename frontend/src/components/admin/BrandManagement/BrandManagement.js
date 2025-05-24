import React, { useState, useEffect } from 'react';
import './BrandManagement.css';

const BrandManagement = () => {
    const [brands, setBrands] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingBrand, setEditingBrand] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        status: false
    });

    const API_BASE_URL = 'http://localhost:8080';
    const BRAND_API = {
        GET_ALL: `${API_BASE_URL}/admin/brands/all-full`,
        CREATE: `${API_BASE_URL}/admin/brands`,
        UPDATE: `${API_BASE_URL}/admin/brands`,
        DELETE: `${API_BASE_URL}/admin/brands`
    };

    useEffect(() => {
        fetchBrands();
    }, []);

    const fetchBrands = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            const response = await fetch(BRAND_API.GET_ALL, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const result = await response.json();
            if (result.data) {
                setBrands(result.data);
            }
        } catch (error) {
            console.error('Lỗi khi tải danh sách thương hiệu:', error);
        }
    };

    const handleSave = async () => {
        if (!formData.name.trim()) {
            alert('Vui lòng nhập tên thương hiệu!');
            return;
        }

        const token = localStorage.getItem('accessToken');
        try {
            const method = editingBrand ? 'PUT' : 'POST';
            const url = editingBrand 
                ? `${BRAND_API.UPDATE}/${editingBrand.id}`
                : BRAND_API.CREATE;

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: formData.name,
                    deleteFlag: !formData.status
                })
            });

            if (!response.ok) {
                throw new Error('Lỗi khi lưu thương hiệu');
            }

            setShowModal(false);
            fetchBrands();
            alert(editingBrand ? 'Cập nhật thành công!' : 'Thêm mới thành công!');
        } catch (error) {
            console.error('Lỗi:', error);
            alert('Có lỗi xảy ra: ' + error.message);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa thương hiệu này?')) {
            return;
        }

        const token = localStorage.getItem('accessToken');
        try {
            const response = await fetch(`${BRAND_API.DELETE}/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Lỗi khi xóa thương hiệu');
            }

            setShowModal(false);
            fetchBrands();
            alert('Xóa thương hiệu thành công!');
        } catch (error) {
            console.error('Lỗi:', error);
            alert('Có lỗi xảy ra khi xóa thương hiệu!');
        }
    };

    return (
        <div className="main-content">
            <div className="bg-white rounded shadow-sm p-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h1 className="h5 mb-0">Danh sách thương hiệu</h1>
                    <button 
                        className="btn btn-success"
                        onClick={() => {
                            setEditingBrand(null);
                            setFormData({
                                name: '',
                                status: true
                            });
                            setShowModal(true);
                        }}
                    >
                        <i className="bi bi-plus-circle"></i> Thêm mới
                    </button>
                </div>

                <div className="table-container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Tên thương hiệu</th>
                                <th>Trạng thái</th>
                            </tr>
                        </thead>
                        <tbody>
                            {brands.map(brand => (
                                <tr 
                                    key={brand.id}
                                    onClick={() => {
                                        setEditingBrand(brand);
                                        setFormData({
                                            name: brand.name,
                                            status: !brand.deleteFlag
                                        });
                                        setShowModal(true);
                                    }}
                                >
                                    <td>{brand.id}</td>
                                    <td>{brand.name}</td>
                                    <td>
                                        <span className={`badge ${brand.deleteFlag ? 'bg-danger' : 'bg-success'}`}>
                                            {brand.deleteFlag ? 'Không hoạt động' : 'Hoạt động'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            <div className={`modal fade ${showModal ? 'show' : ''}`} 
                 style={{ display: showModal ? 'block' : 'none' }}
                 tabIndex="-1">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">
                                {editingBrand ? 'Chỉnh sửa thương hiệu' : 'Thêm thương hiệu mới'}
                            </h5>
                            <button 
                                type="button" 
                                className="btn-close"
                                onClick={() => setShowModal(false)}
                            ></button>
                        </div>
                        <div className="modal-body">
                            <div className="mb-3">
                                <label className="form-label">Tên thương hiệu</label>
                                <input 
                                    type="text" 
                                    className="form-control"
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label d-block">Trạng thái</label>
                                <div className="form-check form-check-inline">
                                    <input 
                                        type="radio"
                                        className="form-check-input"
                                        checked={formData.status}
                                        onChange={() => setFormData({...formData, status: true})}
                                    />
                                    <label className="form-check-label">Hoạt động</label>
                                </div>
                                <div className="form-check form-check-inline">
                                    <input 
                                        type="radio"
                                        className="form-check-input"
                                        checked={!formData.status}
                                        onChange={() => setFormData({...formData, status: false})}
                                    />
                                    <label className="form-check-label">Không hoạt động</label>
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
                            {editingBrand && (
                                <button 
                                    type="button" 
                                    className="btn btn-danger"
                                    onClick={() => handleDelete(editingBrand.id)}
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
    );
};

export default BrandManagement; 