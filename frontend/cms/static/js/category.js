const categories = [
    {
        name: "Sách giáo khoa",
        subcategories: [
            {
                name: "Lớp 1",
                subcategories: [
                    { name: "Cánh diều", subcategories: [] },
                    { name: "Kết nối tri thức", subcategories: [] },
                    { name: "Chân trời sáng tạo", subcategories: [] }
                ]
            },
            { name: "Lớp 2", subcategories: [] },
            { name: "Lớp 3", subcategories: [] },
            { name: "Lớp 4", subcategories: [] },
            { name: "Lớp 5", subcategories: [] }
        ]
    },
    { name: "Sách tham khảo", subcategories: [] },
    { name: "Vở ghi", subcategories: [] },
    { name: "Máy tính cầm tay", subcategories: [] },
    { name: "Đồ dùng học tập", subcategories: [] },
    { name: "Khác", subcategories: [] }
];

let selectedCategory = null; // Lưu danh mục đang chọn

// Hàm tạo HTML cho danh mục
function createCategoryHTML(category, level = 0) {
    const hasSubcategories = category.subcategories && category.subcategories.length > 0;
    
    let html = `
        <div class="category-item" data-name="${category.name}">
            <div class="d-flex align-items-center">
                ${hasSubcategories ? `<span class="category-toggle">▼</span>` : `<span style="margin-left: 1rem"></span>`}
                <span class="category-name">${category.name}</span>
            </div>
        `;

    if (hasSubcategories) {
        html += '<div class="subcategory">';
        category.subcategories.forEach(subCategory => {
            html += createCategoryHTML(subCategory, level + 1);
        });
        html += '</div>';
    }

    html += '</div>';
    return html;
}

// Render danh mục
function renderCategories() {
    const categoryList = document.getElementById('categoryList');
    categoryList.innerHTML = categories.map(category => createCategoryHTML(category)).join('');

    // Thêm sự kiện toggle hiển thị danh mục con
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

    // Thêm sự kiện click vào danh mục để chọn thêm danh mục con
    document.querySelectorAll('.category-name').forEach(item => {
        item.addEventListener('click', function () {
            const categoryName = this.textContent;
            selectedCategory = findCategoryByName(categories, categoryName);
            
            if (selectedCategory) {
                document.getElementById('selectedCategoryName').textContent = categoryName;
                document.getElementById('addSubcategoryContainer').style.display = 'block';
            }
        });
    });
}

// Tìm danh mục theo tên
function findCategoryByName(categories, name) {
    for (const category of categories) {
        if (category.name === name) {
            return category;
        }
        if (category.subcategories) {
            const found = findCategoryByName(category.subcategories, name);
            if (found) return found;
        }
    }
    return null;
}

// Xử lý thêm danh mục con
document.getElementById('btnAddSubcategory').addEventListener('click', function () {
    const subcategoryName = document.getElementById('subcategoryInput').value.trim();
    if (subcategoryName && selectedCategory) {
        if (!selectedCategory.subcategories) {
            selectedCategory.subcategories = [];
        }
        selectedCategory.subcategories.push({ name: subcategoryName, subcategories: [] });
        document.getElementById('subcategoryInput').value = ''; // Xóa input
        renderCategories(); // Cập nhật danh sách
    }
});

// Khởi tạo trang
document.addEventListener('DOMContentLoaded', function() {
    renderCategories();
});
