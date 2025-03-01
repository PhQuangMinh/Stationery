const CREATE_API_URL = 'http://localhost:8080/admin/brands';
const GET_ALL_API_URL = 'http://localhost:8080/brands/all';
const UPDATE_API_URL = 'http://localhost:8080/admin/brands';

const brands = [];

function fetchBrands() {
    const token = localStorage.getItem('token'); // Lấy token từ localStorage

    fetch(GET_ALL_API_URL, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}` // Thêm token vào header
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Lỗi khi tải danh sách thương hiệu');
        }
        return response.json();
    })
    .then(data => {
        console.log(data.data.content);
        brands.length = 0; // Xóa dữ liệu cũ
        brands.push(...data.data.content); // Thêm dữ liệu mới
        renderBrands(); // Hiển thị lại danh sách thương hiệu
    })
    .catch(error => console.error('Lỗi khi tải danh sách thương hiệu:', error));
}


// Hiển thị danh sách thương hiệu
function renderBrands() {
    const tableBody = document.getElementById('brandTableBody');
    tableBody.innerHTML = brands.map((brand, index) => `
        <tr onclick="editBrand(${index})">
            <td>${brand.id}</td>
            <td>${brand.name}</td>
            <td>${brand.deleteFlag ? "Không hoạt động" : "Hoạt động"}</td>
        </tr>
    `).join('');
}

// Mở modal chỉnh sửa thương hiệu
function editBrand(index) {
    const brand = brands[index];

    document.getElementById('newBrandName').value = brand.name;
    document.getElementById('newBrandStatus').value = brand.deleteFlag ? "Không hoạt động" : "Hoạt động";
    document.getElementById('btnSaveBrand').setAttribute('data-index', index);
    document.getElementById('addBrandForm').style.display = 'flex';
}

// Lưu thương hiệu (cập nhật hoặc thêm mới)
document.getElementById('btnSaveBrand').addEventListener('click', async function () {
    const index = this.getAttribute('data-index');
    const newBrand = {
        name: document.getElementById('newBrandName').value,
        deleteFlag: document.getElementById('newBrandStatus').value === "Không hoạt động"
    };
    const token = localStorage.getItem('token'); 
    console.log("token: ", token)
    if (index !== null) {
        // Chỉnh sửa thương hiệu
        const requestOptions = {
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(newBrand)
        };
        console.log(requestOptions);
        await fetch(UPDATE_API_URL, requestOptions).then(response => response.json())
        .then(() => {
            alert('Cập nhật thương hiệu thành công!');
            fetchBrands();
        })
        .catch(error => console.error('Lỗi khi cập nhật thương hiệu:', error));
    } else {
        const requestOptions = {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(newBrand)
        };
        console.log(requestOptions);
        await fetch(CREATE_API_URL, requestOptions).then(response => response.json())
        .then(() => {
            alert('Thêm thương hiệu thành công!');
            fetchBrands();
        })
        .catch(error => console.error('Lỗi khi thêm thương hiệu:', error));
    }

    document.getElementById('addBrandForm').style.display = 'none';
});

// Hiển thị popup thêm thương hiệu mới
document.getElementById('btnAddBrand').addEventListener('click', function () {
    document.getElementById('newBrandName').value = '';
    document.getElementById('newBrandStatus').value = 'Hoạt động';
    document.getElementById('btnSaveBrand').removeAttribute('data-index');
    document.getElementById('addBrandForm').style.display = 'flex';
});

// Ẩn popup
document.getElementById('btnCancelBrand').addEventListener('click', function () {
    document.getElementById('addBrandForm').style.display = 'none';
});

// Khi trang tải, lấy danh sách thương hiệu
document.addEventListener('DOMContentLoaded', fetchBrands);