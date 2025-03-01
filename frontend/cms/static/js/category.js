let selectedCategory = null; // Lưu danh mục đang chọn

// 🟢 Lấy danh mục từ backend
async function fetchCategories() {
    try {
        let response = await fetch("http://localhost:8080/api/categories/tree");
        let data = await response.json();
        return data.data || [];
    } catch (error) {
        console.error("Lỗi khi tải danh mục:", error);
        return [];
    }
}

// 🟢 Gửi danh mục mới lên backend
async function saveCategoryToBackend(name, parentId = null) {
    try {
        const token = localStorage.getItem('token');
        let response = await fetch("http://localhost:8080/api/admin/categories", {
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

        if (!response.ok) {
            throw new Error("Lỗi khi lưu danh mục");
        }

        return await response.json();
    } catch (error) {
        console.error("Lỗi khi lưu danh mục:", error);
        alert("Có lỗi xảy ra khi lưu danh mục");
    }
}

// Thêm hàm xóa danh mục
async function deleteCategory(id) {
    try {
        const token = localStorage.getItem('token');
        let response = await fetch(`http://localhost:8080/api/admin/categories/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error("Lỗi khi xóa danh mục");
        }

        return await response.json();
    } catch (error) {
        console.error("Lỗi khi xóa danh mục:", error);
        alert("Có lỗi xảy ra khi xóa danh mục");
    }
}

// Thêm hàm cập nhật danh mục
async function updateCategory(id, name, parentId = null) {
    try {
        const token = localStorage.getItem('token');
        let response = await fetch(`http://localhost:8080/api/admin/categories/${id}`, {
            method: "PUT",
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

        if (!response.ok) {
            throw new Error("Lỗi khi cập nhật danh mục");
        }

        return await response.json();
    } catch (error) {
        console.error("Lỗi khi cập nhật danh mục:", error);
        alert("Có lỗi xảy ra khi cập nhật danh mục");
    }
}

// 🟢 Tạo HTML cho danh mục
function createCategoryHTML(category, level = 0) {
    const hasSubcategories = category.children && category.children.length > 0;
    
    let html = `
        <div class="category-item" data-id="${category.id}" data-name="${category.name}">
            <div class="d-flex align-items-center justify-content-between">
                <div class="d-flex align-items-center">
                    ${hasSubcategories ? `<span class="category-toggle">▼</span>` : `<span style="margin-left: 1rem"></span>`}
                    <span class="category-name">${category.name}</span>
                </div>
                <div class="category-actions">
                    <button class="btn btn-sm btn-primary edit-category">Sửa</button>
                    <button class="btn btn-sm btn-danger delete-category">Xóa</button>
                </div>
            </div>
    `;

    if (hasSubcategories) {
        html += '<div class="subcategory">';
        category.children.forEach(subCategory => {
            html += createCategoryHTML(subCategory, level + 1);
        });
        html += '</div>';
    }

    html += '</div>';
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
    document.querySelectorAll('.category-toggle').forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            const categoryItem = e.target.closest('.category-item');
            const subcategory = categoryItem.querySelector('.subcategory');
            if (subcategory) {
                subcategory.style.display = subcategory.style.display === 'none' ? 'block' : 'none';
                e.target.textContent = subcategory.style.display === 'none' ? '▶' : '▼';
            }
            e.stopPropagation();
        });
    });

    // Chọn danh mục để thêm danh mục con
    document.querySelectorAll('.category-name').forEach(item => {
        item.addEventListener('click', function () {
            const categoryId = this.closest('.category-item').dataset.id;
            const categoryName = this.textContent;
            
            selectedCategory = { id: categoryId, name: categoryName };
            
            document.getElementById('selectedCategoryName').textContent = categoryName;
            document.getElementById('addSubcategoryContainer').style.display = 'block';
        });
    });

    // Thêm sự kiện cho nút xóa
    document.querySelectorAll('.delete-category').forEach(button => {
        button.addEventListener('click', async function(e) {
            e.stopPropagation();
            const categoryItem = this.closest('.category-item');
            const categoryId = categoryItem.dataset.id;
            
            if (confirm('Bạn có chắc chắn muốn xóa danh mục này?')) {
                const result = await deleteCategory(categoryId);
                if (result) {
                    renderCategories();
                }
            }
        });
    });

    // Thêm sự kiện cho nút sửa
    document.querySelectorAll('.edit-category').forEach(button => {
        button.addEventListener('click', async function(e) {
            e.stopPropagation();
            const categoryItem = this.closest('.category-item');
            const categoryId = categoryItem.dataset.id;
            const categoryName = categoryItem.dataset.name;
            
            const newName = prompt('Nhập tên mới cho danh mục:', categoryName);
            if (newName && newName !== categoryName) {
                const result = await updateCategory(categoryId, newName);
                if (result) {
                    renderCategories();
                }
            }
        });
    });
}

// 🟢 Thêm danh mục cha mới
document.getElementById('btnAddParentCategory').addEventListener('click', async function () {
    const parentCategoryName = document.getElementById('parentCategoryInput').value.trim();
    
    if (parentCategoryName) {
        const savedCategory = await saveCategoryToBackend(parentCategoryName, null); // Không có parent
        
        if (savedCategory) {
            document.getElementById('parentCategoryInput').value = '';
            renderCategories(); // Cập nhật danh sách
        }
    }
});

// 🟢 Gửi danh mục con lên server khi thêm
document.getElementById('btnAddSubcategory').addEventListener('click', async function () {
    const subcategoryName = document.getElementById('subcategoryInput').value.trim();
    
    if (subcategoryName && selectedCategory) {
        const savedCategory = await saveCategoryToBackend(subcategoryName, selectedCategory.id);
        
        if (savedCategory) {
            document.getElementById('subcategoryInput').value = '';
            renderCategories(); // Cập nhật UI
        }
    }
});

// 🟢 Khởi tạo trang
document.addEventListener('DOMContentLoaded', function() {
    renderCategories();
});
