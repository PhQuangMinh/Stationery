const categories = ["Sách giáo khoa", "Sách tham khảo", "Vở ghi", "Máy tính cầm tay", "Đồ dùng học tập", "Khác"];
const brands = ["Thương hiệu A", "Thương hiệu B", "Thương hiệu C"];

const products = [];

function renderProducts() {
    const tableBody = document.getElementById('productTableBody');
    tableBody.innerHTML = products.map((product, index) => `
        <tr>
            <td>${product.name}</td>
            <td>${product.category}</td>
            <td>${product.brand}</td>
            <td>${product.price}</td>
            <td>${product.discount}</td>
            <td>${product.quantity}</td>
            <td>${product.sold}</td>
            <td>${product.date}</td>
            <td><img src="${product.image}" class="product-image" alt="Sản phẩm"></td>
            <td>${product.status}</td>
        </tr>
    `).join('');
}

// Đổ dữ liệu danh mục và thương hiệu vào dropdown
function populateSelectOptions(selectElement, options) {
    selectElement.innerHTML = options.map(option => `<option value="${option}">${option}</option>`).join('');
}

// Gọi hàm để đổ dữ liệu vào dropdown khi trang load
document.addEventListener('DOMContentLoaded', function() {
    populateSelectOptions(document.getElementById('newProductCategory'), categories);
    populateSelectOptions(document.getElementById('newProductBrand'), brands);
    renderProducts();
});

// Xử lý xem trước ảnh khi chọn file
document.getElementById('newProductImage').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('previewImage').src = e.target.result;
            document.getElementById('previewImage').style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
});

// Thêm sản phẩm mới vào danh sách
document.getElementById('btnSaveProduct').addEventListener('click', function() {
    const newProduct = {
        name: document.getElementById('newProductName').value,
        category: document.getElementById('newProductCategory').value,
        brand: document.getElementById('newProductBrand').value,
        price: document.getElementById('newProductPrice').value,
        discount: document.getElementById('newProductDiscount').value,
        quantity: document.getElementById('newProductQuantity').value,
        sold: document.getElementById('newProductSold').value,
        date: document.getElementById('newProductDate').value,
        image: document.getElementById('previewImage').src,
        status: document.getElementById('newProductStatus').value
    };

    products.push(newProduct);
    renderProducts();
    document.getElementById('addProductModal').querySelector('.btn-close').click(); // Đóng modal
});
