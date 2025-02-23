const brands = [
    { id: 1, name: "Nike", image: "../static/images/nike.jpg", status: "Hoạt động" },
    { id: 2, name: "Adidas", image: "../static/images/adidas.jpg", status: "Hoạt động" },
    { id: 3, name: "Puma", image: "../static/images/puma.jpg", status: "Không hoạt động" },
    { id: 4, name: "Reebok", image: "../static/images/reebok.jpg", status: "Hoạt động" },
];

// Hiển thị danh sách thương hiệu
function renderBrands() {
    const tableBody = document.getElementById('brandTableBody');
    tableBody.innerHTML = brands.map((brand, index) => `
        <tr>
            <td>${brand.id}</td>
            <td><input type="text" class="form-control" value="${brand.name}" data-index="${index}" data-field="name"></td>
            <td><img src="${brand.image}" class="brand-image" alt="Thương hiệu"></td>
            <td>
                <select class="form-select brand-status" data-index="${index}" data-field="status">
                    <option value="Hoạt động" ${brand.status === "Hoạt động" ? "selected" : ""}>Hoạt động</option>
                    <option value="Không hoạt động" ${brand.status === "Không hoạt động" ? "selected" : ""}>Không hoạt động</option>
                </select>
            </td>
        </tr>
    `).join('');
}

// Hiển thị popup thêm thương hiệu
document.getElementById('btnAddBrand').addEventListener('click', function () {
    document.getElementById('addBrandForm').style.display = 'flex';
});

// Ẩn popup
document.getElementById('btnCancelBrand').addEventListener('click', function () {
    document.getElementById('addBrandForm').style.display = 'none';
});

// Xử lý upload ảnh
document.getElementById('newBrandImage').addEventListener('change', function (event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            document.getElementById('previewBrandImage').src = e.target.result;
            document.getElementById('previewBrandImage').style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
});

// Thêm thương hiệu mới
document.getElementById('btnSaveBrand').addEventListener('click', function () {
    const newBrand = {
        id: brands.length + 1,
        name: document.getElementById('newBrandName').value,
        image: document.getElementById('previewBrandImage').src,
        status: document.getElementById('newBrandStatus').value
    };

    brands.push(newBrand);
    renderBrands();
    document.getElementById('addBrandForm').style.display = 'none';
});

// Cập nhật dữ liệu khi chỉnh sửa
document.getElementById('brandTableBody').addEventListener('input', (event) => {
    const index = event.target.dataset.index;
    const field = event.target.dataset.field;
    brands[index][field] = event.target.value;
});

// Khởi tạo trang
document.addEventListener('DOMContentLoaded', function() {
    renderBrands();
});

document.getElementById('btnSaveChanges').addEventListener('click', function () {
    localStorage.setItem('brands', JSON.stringify(brands));
    alert("Thay đổi đã được lưu!");
});
