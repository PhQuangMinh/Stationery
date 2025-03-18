// API URLs
const PRODUCT_API = {
    GET_ALL: "http://localhost:8080/products/all",
    CREATE: "http://localhost:8080/admin/products",
    UPDATE: "http://localhost:8080/admin/products",
    DELETE: "http://localhost:8080/admin/products",
    UPLOAD_IMAGE: "http://localhost:8080/upload"
};

let currentPage = 0;
const pageSize = 10;
let totalPages = 1;
let products = [];
let brands = [];
let categories = [];
let editingProductId = null;

// Thêm biến để theo dõi trạng thái sắp xếp
let currentSort = {
    column: null,
    direction: 'asc'
};

// Thêm mapping cho tên cột và tên trường database
const columnMapping = {
    'name': 'name',
    'category': 'categories',
    'brand': 'brand',
    'price': 'price',
    'discount': 'discount',
    'quantity': 'quantity',
    'countSales': 'countSales',
    'status': 'deleteFlag'
};

// Thêm hàm kiểm tra response
function handleResponse(response) {
    if (response.status === 401) {
        localStorage.removeItem('accessToken');
        window.location.href = 'login.html';
    }
    return response;
}

// Gọi API lấy danh sách thương hiệu
async function fetchBrands() {
    try {
        const response = await fetch(`http://localhost:8080/brands/all?page=0&size=100&sortBy=id`);
        handleResponse(response);
        const result = await response.json();
        brands = result.data.content;
        console.log('Brands loaded:', brands);
        renderBrandOptions();
    } catch (error) {
        console.error('Lỗi khi lấy thương hiệu:', error);
    }
}

// Gọi API lấy danh sách danh mục
async function fetchCategories() {
    try {
        const token = localStorage.getItem('accessToken');
        const response = await fetch(`http://localhost:8080/admin/categories/tree`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        handleResponse(response);
        const result = await response.json();
        categories = result.data;
        console.log('Categories loaded:', categories);
        renderCategoryOptions();
    } catch (error) {
        alert("Error loading categories")
        console.error('Lỗi khi lấy danh mục:', error);
    }
}

// Đổ danh sách thương hiệu vào <select>
function renderBrandOptions() {
    const selectBrand = document.getElementById('newProductBrand');
    if (selectBrand && brands.length > 0) {
        selectBrand.innerHTML = '<option value="">Chọn thương hiệu</option>' + 
            brands.map(brand => `<option value="${brand.id}">${brand.name}</option>`).join('');
    }
}

// Thêm hàm mới để lấy các danh mục tầng cuối
function getLeafCategories(categories) {
    let leafCategories = [];
    
    function traverse(category) {
        // Nếu không có children hoặc children rỗng, đây là danh mục tầng cuối
        if (!category.children || category.children.length === 0) {
            leafCategories.push(category);
        } else {
            // Nếu có children, duyệt qua từng children
            category.children.forEach(child => traverse(child));
        }
    }
    
    categories.forEach(category => traverse(category));
    return leafCategories;
}

// Sửa lại hàm renderCategoryOptions
function renderCategoryOptions() {
    const selectCategory = document.getElementById('newProductCategory');
    if (selectCategory && categories.length > 0) {
        // Lấy danh sách các danh mục tầng cuối
        const leafCategories = getLeafCategories(categories);
        
        selectCategory.innerHTML = '<option value="">Chọn danh mục</option>' + 
            leafCategories.map(category => `<option value="${category.id}">${category.name}</option>`).join('');
    }
}

// Thêm hàm render phân trang
function renderPagination() {
    const pagination = document.querySelector('.pagination');
    const prevButton = document.getElementById('prevPage').parentElement;
    const nextButton = document.getElementById('nextPage').parentElement;
    
    // Xóa các nút số trang cũ
    const pageButtons = pagination.querySelectorAll('.page-numbers');
    pageButtons.forEach(button => button.remove());
    
    // Thêm các nút số trang mới
    const maxVisiblePages = 5;
    let startPage = Math.max(0, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 1);
    
    // Điều chỉnh startPage nếu endPage đã đạt giới hạn
    startPage = Math.max(0, Math.min(startPage, totalPages - maxVisiblePages));
    
    // Thêm dấu ... ở đầu nếu cần
    if (startPage > 0) {
        const ellipsis = document.createElement('li');
        ellipsis.className = 'page-item';
        ellipsis.innerHTML = '<span class="page-link">...</span>';
        pagination.insertBefore(ellipsis, nextButton);
    }
    
    // Thêm các nút số trang
    for (let i = startPage; i <= endPage; i++) {
        const pageItem = document.createElement('li');
        pageItem.className = `page-item page-numbers ${i === currentPage ? 'active' : ''}`;
        pageItem.innerHTML = `<button class="page-link">${i + 1}</button>`;
        
        pageItem.querySelector('button').addEventListener('click', () => {
            currentPage = i;
            fetchProducts(currentPage);
        });
        
        pagination.insertBefore(pageItem, nextButton);
    }
    
    // Thêm dấu ... ở cuối nếu cần
    if (endPage < totalPages - 1) {
        const ellipsis = document.createElement('li');
        ellipsis.className = 'page-item';
        ellipsis.innerHTML = '<span class="page-link">...</span>';
        pagination.insertBefore(ellipsis, nextButton);
    }
    
    // Cập nhật trạng thái nút Previous/Next
    prevButton.classList.toggle('disabled', currentPage === 0);
    nextButton.classList.toggle('disabled', currentPage >= totalPages - 1);
}

// Cập nhật lại hàm fetchProducts
async function fetchProducts(page = 0) {
    try {
        const token = localStorage.getItem('accessToken');
        let url = `${PRODUCT_API.GET_ALL}?page=${page}&size=${pageSize}`;
        
        // Thêm tham số sắp xếp nếu có, sử dụng mapping
        if (currentSort.column) {
            const dbColumn = columnMapping[currentSort.column];
            url += `&sortBy=${dbColumn}&sortDir=${currentSort.direction}`;
        }

        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        handleResponse(response);
        const result = await response.json();
        
        if (result.data && result.data.content) {
            products = result.data.content;
            totalPages = result.data.totalPages;
            currentPage = page;
            
            renderProducts();
            renderPagination();
            updateSortIcons();
        } else {
            console.error('Invalid response format:', result);
        }
    } catch (error) {
        console.error('Lỗi khi lấy sản phẩm:', error);
    }
}

// Hiển thị danh sách sản phẩm
function renderProducts() {
    const tableBody = document.getElementById('productTableBody');
    tableBody.innerHTML = products.map(product => `
        <tr onclick="editProduct(${product.id})">
            <td>${product.name}</td>
            <td>${product.categories.length > 0 ? product.categories[0].name : 'N/A'}</td>
            <td>${product.brandResponse.name ? product.brandResponse.name : 'N/A'}</td>
            <td>${product.price.toLocaleString('vi-VN')} đ</td>
            <td>${product.discount}%</td>
            <td>${product.quantity}</td>
            <td>${product.countSales || 0}</td>
            <td><img src="${product.imageUrl}" class="product-image" alt="Sản phẩm"></td>
            <td>${product.deleteFlag ? 'Không hoạt động' : 'Hoạt động'}</td>
            <td>${product.description}</td>
        </tr>
    `).join('');
}

// Xóa sản phẩm (soft delete)
async function deleteProduct(productId) {
    if (!confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
        return;
    }

    const token = localStorage.getItem('accessToken');

    try {
        const response = await fetch(`http://localhost:8080/admin/products/${productId}`, {
            method: 'DELETE',
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        handleResponse(response);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        fetchProducts(currentPage);
    } catch (error) {
        console.error('Lỗi khi xóa sản phẩm:', error);
        alert('Có lỗi xảy ra khi xóa sản phẩm!');
    }
}

// Mở modal để chỉnh sửa sản phẩm
function editProduct(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    editingProductId = productId;

    // Hiển thị nút xóa khi chỉnh sửa
    document.getElementById('btnDeleteProduct').style.display = 'inline-block';

    // Điền thông tin sản phẩm vào form
    document.getElementById('newProductName').value = product.name || '';
    document.getElementById('newProductCategory').value = product.categories.length > 0 ? product.categories[0].id : '';
    document.getElementById('newProductBrand').value = product.brandResponse ? product.brandResponse.id : '';
    document.getElementById('newProductPrice').value = product.price || 0;
    document.getElementById('newProductDiscount').value = product.discount || 0;
    document.getElementById('newProductQuantity').value = product.quantity || 0;
    document.getElementById('newProductStatus').value = product.deleteFlag ? 'false' : 'true';
    document.getElementById('newProductDescription').value = product.description || '';
    
    const previewImage = document.getElementById('previewImage');
    if (product.imageUrl) {
        previewImage.src = product.imageUrl;
        previewImage.style.display = 'block';
    } else {
        previewImage.style.display = 'none';
    }

    // Cập nhật selected category
    if (product.categories && product.categories.length > 0) {
        const categorySelect = document.getElementById('newProductCategory');
        const categoryId = product.categories[0].id;
        
        // Đợi một chút để đảm bảo categories đã được render
        setTimeout(() => {
            if (categorySelect.querySelector(`option[value="${categoryId}"]`)) {
                categorySelect.value = categoryId;
            }
        }, 100);
    }

    // Hiển thị modal (sửa cách khởi tạo)
    const productModal = document.getElementById('addProductModal');
    const modal = new bootstrap.Modal(productModal);
    modal.show();
}

// Lưu sản phẩm (Thêm mới hoặc Cập nhật)
async function saveProduct() {
    const token = localStorage.getItem('accessToken');
    if (!token) {
        alert('Bạn cần đăng nhập để thực hiện chức năng này!');
        return;
    }

    // Validate dữ liệu
    const name = document.getElementById('newProductName').value.trim();
    if (!name) {
        alert('Vui lòng nhập tên sản phẩm!');
        return;
    }

    // Kiểm tra ảnh
    const previewImage = document.getElementById('previewImage');
    const imageUrl = previewImage.src;
    // Kiểm tra xem có phải là URL hợp lệ không và không phải là URL rỗng
    if (!imageUrl || imageUrl === '' || imageUrl === 'about:blank' || imageUrl === window.location.href) {
        alert('Vui lòng tải lên ảnh sản phẩm!');
        return;
    }

    const brandSelect = document.getElementById('newProductBrand');
    const categorySelect = document.getElementById('newProductCategory');

    // Kiểm tra đã chọn brand và category chưa
    if (!brandSelect.value) {
        alert('Vui lòng chọn thương hiệu!');
        return;
    }

    if (!categorySelect.value) {
        alert('Vui lòng chọn danh mục!');
        return;
    }
    console.log("imageUrl: ", imageUrl);

    const brandId = brandSelect.value;
    const categoryId = categorySelect.value;

    const brandName = brandSelect.options[brandSelect.selectedIndex].text;
    const categoryName = categorySelect.options[categorySelect.selectedIndex].text;

    const productData = {
        id: editingProductId,
        name: name,
        description: document.getElementById('newProductDescription').value.trim() || "",
        price: parseInt(document.getElementById('newProductPrice').value) || 0,
        quantity: parseInt(document.getElementById('newProductQuantity').value) || 0,
        countSales: editingProductId ? undefined : 0,
        discount: parseInt(document.getElementById('newProductDiscount').value) || 0,
        imageUrl: imageUrl,
        deleteFlag: document.getElementById('newProductStatus').value === 'false',
        brand: {
            name: brandName,
            deleteFlag: false
        },
        categories: [{
            name: categoryName,
            deleteFlag: false
        }]
    };

    console.log('Dữ liệu sản phẩm sẽ gửi:', productData);

    try {
        const method = editingProductId ? "PUT" : "POST";
        const url = `http://localhost:8080/admin/products`;

        const response = await fetch(url, {
            method: method,
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(productData),
        });
        handleResponse(response);

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log('Kết quả lưu:', result);
        
        // Đóng modal sau khi lưu thành công
        const modal = bootstrap.Modal.getInstance(document.getElementById('addProductModal'));
        modal.hide();
        
        // Reset form
        document.getElementById('addProductForm').reset();
        document.getElementById('previewImage').style.display = 'none';
        editingProductId = null;

        // // Thông báo thành công
        // alert(editingProductId ? 'Cập nhật sản phẩm thành công!' : 'Thêm sản phẩm thành công!');
        
        // Tải lại danh sách sản phẩm
        fetchProducts(currentPage);
    } catch (error) {
        console.error("Lỗi khi lưu sản phẩm:", error);
        alert("Lỗi khi lưu sản phẩm: " + error.message);
    }
}

// Gán sự kiện cho nút lưu
document.getElementById('btnSaveProduct').addEventListener('click', saveProduct);

// Gọi API ban đầu
fetchBrands();
fetchCategories();
fetchProducts();

document.addEventListener("DOMContentLoaded", async function () {
    const token = localStorage.getItem("accessToken");
    
    if (!token) {
        window.location.href = "login.html";
        return;
    }

    const payload = JSON.parse(atob(token.split(".")[1]));
    if (payload.exp * 1000 < Date.now()) {
        console.log("Token hết hạn, yêu cầu đăng nhập lại");
        localStorage.removeItem("accessToken");
        window.location.href = "login.html";
        return;
    }
});

// Thêm hàm upload ảnh
async function uploadImage(file) {
    const formData = new FormData();
    formData.append('file', file);
    const token = localStorage.getItem('accessToken');

    try {
        const response = await fetch('http://localhost:8080/upload', {
            method: 'POST',
            headers: {
                "Authorization": `Bearer ${token}`
            },
            body: formData
        });
        handleResponse(response);

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText);
        }

        const imageUrl = await response.text();
        if (!imageUrl) {
            throw new Error('Không nhận được URL ảnh từ server');
        }
        console.log("Image URL:", imageUrl);
        return imageUrl;
    } catch (error) {
        console.error('Error uploading image:', error);
        throw error;
    }
}

// Thêm event listener cho input file
document.getElementById('newProductImage').addEventListener('change', async function(e) {
    const file = e.target.files[0];
    if (!file) return;

    // Kiểm tra loại file
    if (!file.type.startsWith('image/')) {
        alert('Vui lòng chọn file ảnh!');
        return;
    }

    try {
        // Thêm loading indicator nếu cần
        const loadingElement = document.createElement('div');
        loadingElement.textContent = 'Đang tải ảnh lên...';
        this.parentNode.appendChild(loadingElement);

        const imageUrl = await uploadImage(file);
        
        // Hiển thị preview
        const previewImage = document.getElementById('previewImage');
        previewImage.src = imageUrl;
        previewImage.style.display = 'block';

        // Xóa loading indicator
        loadingElement.remove();
    } catch (error) {
        alert('Lỗi khi tải ảnh lên: ' + error.message);
        // Xóa file đã chọn
        this.value = '';
    }
});

// Thêm hàm reset form khi mở modal thêm mới
document.getElementById('btnAddProduct').addEventListener('click', function() {
    document.getElementById('addProductForm').reset();
    document.getElementById('previewImage').style.display = 'none';
    editingProductId = null;
    // Ẩn nút xóa khi thêm mới
    document.getElementById('btnDeleteProduct').style.display = 'none';
});

// Thêm event listener cho nút xóa
document.getElementById('btnDeleteProduct').addEventListener('click', function() {
    if (editingProductId) {
        deleteProduct(editingProductId);
        // Đóng modal sau khi xóa
        const modal = bootstrap.Modal.getInstance(document.getElementById('addProductModal'));
        modal.hide();
    }
});

// Hàm sắp xếp sản phẩm
function sortProducts(column) {
    if (currentSort.column === column) {
        // Đảo ngược hướng sắp xếp nếu click vào cùng một cột
        currentSort.direction = currentSort.direction === 'asc' ? 'desc' : 'asc';
    } else {
        // Đặt cột mới và hướng mặc định là tăng dần
        currentSort.column = column;
        currentSort.direction = 'asc';
    }

    // Sắp xếp mảng sản phẩm
    products.sort((a, b) => {
        let valueA, valueB;

        switch (column) {
            case 'name':
                valueA = a.name;
                valueB = b.name;
                break;
            case 'category':
                valueA = a.categories.length > 0 ? a.categories[0].name : '';
                valueB = b.categories.length > 0 ? b.categories[0].name : '';
                break;
            case 'brand':
                valueA = a.brandResponse ? a.brandResponse.name : '';
                valueB = b.brandResponse ? b.brandResponse.name : '';
                break;
            case 'price':
                valueA = a.price;
                valueB = b.price;
                break;
            case 'discount':
                valueA = a.discount;
                valueB = b.discount;
                break;
            case 'quantity':
                valueA = a.quantity;
                valueB = b.quantity;
                break;
            case 'countSales':
                valueA = a.countSales || 0;
                valueB = b.countSales || 0;
                break;
            case 'status':
                valueA = a.deleteFlag ? 1 : 0;
                valueB = b.deleteFlag ? 1 : 0;
                break;
            default:
                return 0;
        }

        // So sánh các giá trị
        if (valueA === valueB) return 0;
        
        const comparison = valueA > valueB ? 1 : -1;
        return currentSort.direction === 'asc' ? comparison : -comparison;
    });

    // Cập nhật giao diện
    updateSortIcons();
    renderProducts();
}

// Hàm cập nhật icons sắp xếp
function updateSortIcons() {
    document.querySelectorAll('th.sortable').forEach(th => {
        const column = th.dataset.sort;
        th.classList.remove('sort-asc', 'sort-desc');
        
        if (column === currentSort.column) {
            th.classList.add(`sort-${currentSort.direction}`);
        }
    });
}

// Thêm event listeners cho các cột có thể sắp xếp
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('th.sortable').forEach(th => {
        th.addEventListener('click', function() {
            const column = this.dataset.sort;
            sortProducts(column);
        });
    });
});

// Thêm event listeners cho nút Previous và Next
document.getElementById('prevPage').addEventListener('click', () => {
    if (currentPage > 0) {
        currentPage--;
        fetchProducts(currentPage);
    }
});

document.getElementById('nextPage').addEventListener('click', () => {
    if (currentPage < totalPages - 1) {
        currentPage++;
        fetchProducts(currentPage);
    }
});
