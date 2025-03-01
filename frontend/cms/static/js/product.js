let currentPage = 0;
const pageSize = 10;
let totalPages = 1;
let products = [];
let brands = [];
let categories = [];
let editingProductId = null;

// Gọi API lấy danh sách thương hiệu
async function fetchBrands() {
    try {
        const response = await fetch(`http://localhost:8080/brands/all?page=0&size=100&sortBy=id`);
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
        const response = await fetch(`http://localhost:8080/categories/all?page=0&size=100&sortBy=id`);
        const result = await response.json();
        categories = result.data.content;
        console.log('Categories loaded:', categories);
        renderCategoryOptions();
    } catch (error) {
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

// Đổ danh sách danh mục vào <select>
function renderCategoryOptions() {
    const selectCategory = document.getElementById('newProductCategory');
    if (selectCategory && categories.length > 0) {
        selectCategory.innerHTML = '<option value="">Chọn danh mục</option>' + 
            categories.map(category => `<option value="${category.id}">${category.name}</option>`).join('');
    }
}

// Gọi danh sách sản phẩm
async function fetchProducts(page = 0) {
    try {
        const response = await fetch(`http://localhost:8080/products/all?page=${page}&size=${pageSize}&sortBy=id`);
        const result = await response.json();
        products = result.data.content;
        totalPages = result.data.totalPages;
        renderProducts();
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
            <td>${product.brand ? product.brand.name : 'N/A'}</td>
            <td>${product.price}</td>
            <td>${product.discount}</td>
            <td>${product.quantity}</td>
            <td>${product.countSales}</td>
            <td><img src="${product.imageUrl}" class="product-image" alt="Sản phẩm"></td>
            <td>${product.deleteFlag ? 'Không hoạt động' : 'Hoạt động'}</td>
            <td>${product.description}</td>
            <td>
                <button class="btn btn-danger btn-sm" onclick="deleteProduct(${product.id}); event.stopPropagation();">Xóa</button>
            </td>
        </tr>
    `).join('');
}

// Xóa sản phẩm (soft delete)
async function deleteProduct(productId) {
    if (!confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
        return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
        alert('Bạn cần đăng nhập để thực hiện chức năng này!');
        return;
    }

    try {
        const response = await fetch(`http://localhost:8080/admin/products/${productId}`, {
            method: 'PUT',  // Thay đổi từ DELETE sang PUT
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ deleteFlag: true })  // Cập nhật deleteFlag
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        await response.json();
        alert('Xóa sản phẩm thành công!');
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


    // Điền thông tin sản phẩm vào form
    document.getElementById('newProductName').value = product.name || '';
    document.getElementById('newProductCategory').value = product.categories.length > 0 ? product.categories[0].id : '';
    document.getElementById('newProductBrand').value = product.brand ? product.brand.id : '';
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

    // Hiển thị modal (sửa cách khởi tạo)
    const productModal = document.getElementById('addProductModal');
    const modal = new bootstrap.Modal(productModal);
    modal.show();
}

// Lưu sản phẩm (Thêm mới hoặc Cập nhật)
async function saveProduct() {
    console.log(editingProductId)
    const token = localStorage.getItem('token');
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

    const brandName = document.getElementById('newProductBrand').options[document.getElementById('newProductBrand').selectedIndex].text;
    const categoryName = document.getElementById('newProductCategory').options[document.getElementById('newProductCategory').selectedIndex].text;

    const productData = {
        id: editingProductId,
        name: name,
        description: document.getElementById('newProductDescription').value.trim(),
        price: parseInt(document.getElementById('newProductPrice').value) || 0,
        quantity: parseInt(document.getElementById('newProductQuantity').value) || 0,
        countSales: editingProductId ? undefined : 0, // Chỉ gửi khi tạo mới
        discount: parseInt(document.getElementById('newProductDiscount').value) || 0,
        imageUrl: document.getElementById('previewImage').src || "",
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

    try {
        const method = editingProductId ? "PUT" : "POST";
        const url = editingProductId
            ? `http://localhost:8080/admin/products`
            : `http://localhost:8080/admin/products`;

        const response = await fetch(url, {
            method: method,
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(productData),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
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

        // Thông báo thành công
        alert(editingProductId ? 'Cập nhật sản phẩm thành công!' : 'Thêm sản phẩm thành công!');
        
        // Tải lại danh sách sản phẩm
        fetchProducts(currentPage);
    } catch (error) {
        console.error("Lỗi khi lưu sản phẩm:", error);
        alert("Lỗi khi lưu sản phẩm, vui lòng thử lại!");
    }
}

// Gán sự kiện cho nút lưu
document.getElementById('btnSaveProduct').addEventListener('click', saveProduct);

// Gọi API ban đầu
fetchBrands();
fetchCategories();
fetchProducts();
