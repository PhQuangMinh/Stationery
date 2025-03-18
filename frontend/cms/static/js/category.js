let selectedCategory = null; // Lưu danh mục đang chọn
const CATEGORY_API = {
    GET_TREE: "http://localhost:8080/admin/categories/tree",
    CREATE: "http://localhost:8080/admin/categories",
    UPDATE: "http://localhost:8080/admin/categories",
    DELETE: "http://localhost:8080/admin/categories"
};

// Thêm hàm kiểm tra response
function handleResponse(response) {
    if (response.status === 401) {
        localStorage.removeItem('accessToken');
        window.location.href = 'login.html';
    }
    return response;
}

// 🟢 Lấy danh mục từ backend
async function fetchCategories() {
    try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            window.location.href = "login.html";
            return [];
        }
        
        let response = await fetch(CATEGORY_API.GET_TREE, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        handleResponse(response);
        let data = await response.json();
        console.log(data)
        return data.data || [];
    } catch (error) {
        console.error("Lỗi khi tải danh mục:", error);
        return [];
    }
}

// 🟢 Gửi danh mục mới lên backend
async function saveCategoryToBackend(name, parentId = null) {
    console.log("save token: ", localStorage.getItem('accessToken'))
    try {
        const token = localStorage.getItem('accessToken');
        let response = await fetch(CATEGORY_API.CREATE, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ 
                name, 
                parentId: parentId ? parseInt(parentId) : null,
                deleteFlag: false 
            })
        });
        handleResponse(response);
        return response;
    } catch (error) {
        console.error("Lỗi khi lưu danh mục:", error);
    }
}

// Thêm hàm xóa danh mục
async function deleteCategory(id) {
    try {
        const token = localStorage.getItem('accessToken');
        let response = await fetch(`http://localhost:8080/admin/categories/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        handleResponse(response);

        if (!response.ok) {
            throw new Error("Lỗi khi xóa danh mục");
        }

        return await response.json();
    } catch (error) {
        console.error("Lỗi khi xóa danh mục:", error);
    }
}

// Thêm hàm cập nhật danh mục
async function updateCategory(id, name, parentId = null, deleteFlag) {
    try {
        const token = localStorage.getItem('accessToken');
        const response = await fetch(`http://localhost:8080/admin/categories/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                name: name,
                parentId: parentId ? parseInt(parentId) : null,
                deleteFlag: deleteFlag
            })
        });
        handleResponse(response);

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Lỗi khi cập nhật danh mục");
        }

        return true;
    } catch (error) {
        console.error("Lỗi khi cập nhật danh mục:", error);
        return false;
    }
}

// 🟢 Tạo HTML cho danh mục
function createCategoryHTML(category, level = 0) {
    const hasSubcategories = category.children && category.children.length > 0;
    const statusClass = category.deleteFlag ? 'text-muted' : '';
    
    let html = `
        <div class="category-container">
            <div class="category-item ${statusClass}" data-id="${category.id}" data-name="${category.name}" data-parent-id="${category.parentId || ''}" data-status="${category.deleteFlag}">
                <div class="d-flex align-items-center" style="margin-left: ${level * 20}px">
                    ${hasSubcategories ? `<span class="category-toggle">▼</span>` : `<span style="margin-left: 1rem"></span>`}
                    <span class="category-name">${category.name}</span>
                    ${category.deleteFlag ? ' <span class="badge bg-danger ms-2">Không hoạt động</span>' : ' <span class="badge bg-success ms-2">Hoạt động</span>'}
                </div>
            </div>
            ${hasSubcategories ? `
                <div class="subcategory" style="display: block;">
                    ${category.children.map(subCategory => createCategoryHTML(subCategory, level + 1)).join('')}
                </div>
            ` : ''}
        </div>
    `;

    return html;
}

// 🟢 Render danh mục từ backend
async function renderCategories() {
    const categories = await fetchCategories();
    const categoryList = document.getElementById('categoryList');

    if (categories.length === 0) {
        categoryList.innerHTML = "<p class='text-muted'>Không có danh mục nào. Hãy thêm danh mục mới!</p>";
        return;
    }

    categoryList.innerHTML = categories.map(category => createCategoryHTML(category)).join('');
    addCategoryEventListeners();
}

// 🟢 Thêm sự kiện vào danh mục
function addCategoryEventListeners() {
    // Xử lý click vào category-toggle
    document.querySelectorAll('.category-toggle').forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            const categoryContainer = e.target.closest('.category-container');
            const subcategory = categoryContainer.querySelector('.subcategory');
            if (subcategory) {
                subcategory.style.display = subcategory.style.display === 'none' ? 'block' : 'none';
                e.target.textContent = subcategory.style.display === 'none' ? '▶' : '▼';
            }
            e.stopPropagation();
        });
    });

    // Thêm sự kiện click vào category-item
    document.querySelectorAll('.category-item').forEach(item => {
        item.addEventListener('click', function(e) {
            // Nếu click vào category-toggle, không mở modal
            if (e.target.classList.contains('category-toggle')) {
                return;
            }

            const categoryData = {
                id: this.dataset.id,
                name: this.dataset.name,
                parentId: this.dataset.parentId,
                deleteFlag: this.dataset.status === 'true'
            };
            
            showCategoryModal('edit', categoryData);
        });
    });
}

// Thêm các event listener mới
document.getElementById('btnShowAddCategory').addEventListener('click', () => {
    showCategoryModal('add');
});

// Hàm hiển thị modal với mode thêm mới hoặc chỉnh sửa
function showCategoryModal(mode = 'add', categoryData = null) {
    const modal = new bootstrap.Modal(document.getElementById('categoryModal'));
    const modalTitle = document.getElementById('modalTitle');
    const categoryId = document.getElementById('categoryId');
    const categoryName = document.getElementById('categoryName');
    const parentCategory = document.getElementById('parentCategory');
    const statusActive = document.getElementById('statusActive');
    const statusInactive = document.getElementById('statusInactive');
    const btnDelete = document.getElementById('btnDeleteCategory');

    // Reset form
    categoryId.value = '';
    categoryName.value = '';
    statusActive.checked = true;
    btnDelete.style.display = 'none';

    if (mode === 'add') {
        modalTitle.textContent = 'Thêm danh mục mới';
        fetchCategories().then(categories => {
            populateParentSelect(categories);
        });
    } else {
        modalTitle.textContent = 'Chỉnh sửa danh mục';
        categoryId.value = categoryData.id;
        categoryName.value = categoryData.name;
        btnDelete.style.display = 'inline-block';
        
        if (categoryData.deleteFlag === true || categoryData.deleteFlag === 'true') {
            statusInactive.checked = true;
            statusActive.checked = false;
        } else {
            statusActive.checked = true;
            statusInactive.checked = false;
        }

        fetchCategories().then(categories => {
            populateParentSelect(categories, categoryData.id);
            parentCategory.value = categoryData.parentId || '';
        });
    }

    // Thêm event listener cho sự kiện hidden.bs.modal
    const categoryModal = document.getElementById('categoryModal');
    categoryModal.addEventListener('hidden.bs.modal', function () {
        // Xóa backdrop và reset các thuộc tính
        const backdrop = document.querySelector('.modal-backdrop');
        if (backdrop) {
            backdrop.remove();
        }
        document.body.classList.remove('modal-open');
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
    });

    modal.show();
}

// Cập nhật hàm populateParentSelect
function populateParentSelect(categories, excludeId = null) {
    const select = document.getElementById('parentCategory');
    select.innerHTML = '<option value="">Không có danh mục cha</option>';
    
    function addOptions(cats, level = 0) {
        cats.forEach(category => {
            if (!excludeId || category.id !== excludeId) {
                const indent = '\u00A0\u00A0\u00A0\u00A0'.repeat(level); // Sử dụng khoảng trắng để thụt lề
                const option = new Option(indent + category.name, category.id);
                select.add(option);
                
                if (category.children && category.children.length > 0) {
                    addOptions(category.children, level + 1);
                }
            }
        });
    }
    
    addOptions(categories);
}

// Xử lý sự kiện nút thêm danh mục
document.getElementById('btnShowAddCategory').addEventListener('click', () => {
    showCategoryModal('add');
});

// Xử lý sự kiện nút Lưu trong modal
document.getElementById('btnSaveCategory').addEventListener('click', async function() {
    const categoryId = document.getElementById('categoryId').value;
    const name = document.getElementById('categoryName').value.trim();
    const parentId = document.getElementById('parentCategory').value;
    const deleteFlag = document.querySelector('input[name="status"]:checked').value === 'true';
    
    if (!name) {
        return;
    }

    try {
        let result;
        if (categoryId) {
            // Chế độ chỉnh sửa
            result = await updateCategory(categoryId, name, parentId, deleteFlag);
        } else {
            // Chế độ thêm mới
            result = await saveCategoryToBackend(name, parentId);
        }

        if (result) {
            // Đóng modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('categoryModal'));
            modal.hide();
            
            // Cập nhật lại danh sách
            await renderCategories();
            
            // Thông báo thành công
            alert(categoryId ? 'Cập nhật danh mục thành công!' : 'Thêm danh mục thành công!');
        }
    } catch (error) {
        console.error("Lỗi:", error);
        alert("Có lỗi xảy ra: " + error.message);
    }
});

// Thêm event listener cho nút xóa
document.getElementById('btnDeleteCategory').addEventListener('click', async function() {
    const categoryId = document.getElementById('categoryId').value;
    if (!categoryId) return;

    if (!confirm('Bạn có chắc chắn muốn xóa danh mục này?')) {
        return;
    }

    try {
        const token = localStorage.getItem('accessToken');
        const response = await fetch(`http://localhost:8080/admin/categories/${categoryId}`, {
            method: 'DELETE',
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Đóng modal đúng cách
        const modal = bootstrap.Modal.getInstance(document.getElementById('categoryModal'));
        modal.hide();

        alert('Xóa danh mục thành công!');
        renderCategories();
    } catch (error) {
        console.error('Lỗi khi xóa danh mục:', error);
        alert('Có lỗi xảy ra khi xóa danh mục!');
    }
});

// 🟢 Khởi tạo trang
document.addEventListener('DOMContentLoaded', function() {
    renderCategories();
});
