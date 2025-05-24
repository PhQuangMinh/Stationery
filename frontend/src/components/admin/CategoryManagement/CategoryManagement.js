import React, { useState, useEffect } from 'react';
import './CategoryManagement.css';

const CategoryManagement = () => {
    const [categories, setCategories] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        parentId: '',
        status: false
    });

    const API_BASE_URL = 'http://localhost:8080';
    const CATEGORY_API = {
        GET_TREE: `${API_BASE_URL}/admin/categories/tree`,
        CREATE: `${API_BASE_URL}/admin/categories`,
        UPDATE: `${API_BASE_URL}/admin/categories`,
        DELETE: `${API_BASE_URL}/admin/categories`
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            const response = await fetch(CATEGORY_API.GET_TREE, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            const result = await response.json();
            if (result.data) {
                setCategories(result.data);
            }
        } catch (error) {
            console.error("Lỗi khi tải danh mục:", error);
        }
    };

    const handleSave = async () => {
        const token = localStorage.getItem('accessToken');
        try {
            const method = editingCategory ? "PUT" : "POST";
            const url = editingCategory 
                ? `${CATEGORY_API.UPDATE}/${editingCategory.id}`
                : CATEGORY_API.CREATE;

            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: formData.name,
                    parentId: formData.parentId ? parseInt(formData.parentId) : null,
                    deleteFlag: !formData.status
                })
            });

            if (!response.ok) {
                throw new Error('Lỗi khi lưu danh mục');
            }

            setShowModal(false);
            fetchCategories();
            alert(editingCategory ? 'Cập nhật thành công!' : 'Thêm mới thành công!');
        } catch (error) {
            console.error("Lỗi:", error);
            alert("Có lỗi xảy ra: " + error.message);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa danh mục này?')) {
            return;
        }

        const token = localStorage.getItem('accessToken');
        try {
            const response = await fetch(`${CATEGORY_API.DELETE}/${id}`, {
                method: 'DELETE',
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Lỗi khi xóa danh mục');
            }

            setShowModal(false);
            fetchCategories();
            alert('Xóa danh mục thành công!');
        } catch (error) {
            console.error('Lỗi khi xóa danh mục:', error);
            alert('Có lỗi xảy ra khi xóa danh mục!');
        }
    };

    const renderCategoryItem = (category, level = 0) => {
        const hasSubcategories = category.children && category.children.length > 0;
        const statusClass = category.deleteFlag ? 'text-muted' : '';
        
        return (
            <div key={category.id} className="category-container">
                <div 
                    className={`category-item ${statusClass}`}
                    onClick={() => {
                        setEditingCategory(category);
                        setFormData({
                            name: category.name,
                            parentId: category.parentId || '',
                            status: !category.deleteFlag
                        });
                        setShowModal(true);
                    }}
                >
                    <div className="d-flex align-items-center" style={{marginLeft: `${level * 20}px`}}>
                        {hasSubcategories && (
                            <span className="category-toggle">▼</span>
                        )}
                        <span className="category-name">{category.name}</span>
                        <span className={`badge ms-2 ${category.deleteFlag ? 'bg-danger' : 'bg-success'}`}>
                            {category.deleteFlag ? 'Không hoạt động' : 'Hoạt động'}
                        </span>
                    </div>
                </div>
                {hasSubcategories && (
                    <div className="subcategory">
                        {category.children.map(child => renderCategoryItem(child, level + 1))}
                    </div>
                )}
            </div>
        );
    };

    const populateParentSelect = (categories, excludeId = null, level = 0) => {
        return categories.reduce((options, category) => {
            if (!excludeId || category.id !== excludeId) {
                options.push(
                    <option key={category.id} value={category.id}>
                        {'\u00A0'.repeat(level * 4)}{category.name}
                    </option>
                );
                
                if (category.children && category.children.length > 0) {
                    options = options.concat(
                        populateParentSelect(category.children, excludeId, level + 1)
                    );
                }
            }
            return options;
        }, []);
    };

    return (
        <div className="main-content">
            <div className="bg-white rounded shadow-sm p-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h1 className="h5 mb-0">Danh mục</h1>
                    <button 
                        className="btn btn-success"
                        onClick={() => {
                            setEditingCategory(null);
                            setFormData({
                                name: '',
                                parentId: '',
                                status: true
                            });
                            setShowModal(true);
                        }}
                    >
                        <i className="bi bi-plus-circle"></i> Thêm danh mục
                    </button>
                </div>

                <div className="mt-4">
                    <h5>Danh sách danh mục</h5>
                    <div id="categoryList">
                        {categories.map(category => renderCategoryItem(category))}
                    </div>
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
                                {editingCategory ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới'}
                            </h5>
                            <button 
                                type="button" 
                                className="btn-close"
                                onClick={() => setShowModal(false)}
                            ></button>
                        </div>
                        <div className="modal-body">
                            <div className="mb-3">
                                <label className="form-label">Tên danh mục</label>
                                <input 
                                    type="text" 
                                    className="form-control"
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Danh mục cha</label>
                                <select 
                                    className="form-select"
                                    value={formData.parentId}
                                    onChange={(e) => setFormData({...formData, parentId: e.target.value})}
                                >
                                    <option value="">Không có danh mục cha</option>
                                    {populateParentSelect(categories, editingCategory?.id)}
                                </select>
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
                            {editingCategory && (
                                <button 
                                    type="button" 
                                    className="btn btn-danger"
                                    onClick={() => handleDelete(editingCategory.id)}
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

export default CategoryManagement; 