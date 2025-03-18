// API URLs
const BRAND_API = {
    GET_ALL: "http://localhost:8080/admin/brands/all-full",
    CREATE: "http://localhost:8080/admin/brands",
    UPDATE: "http://localhost:8080/admin/brands",
    DELETE: "http://localhost:8080/admin/brands"
};

let brands = [];
let editingBrandId = null;

// Thêm hàm kiểm tra response
function handleResponse(response) {
    if (response.status === 401) {
        localStorage.removeItem('accessToken');
        window.location.href = 'login.html';
    }
    return response;
}

async function fetchBrands() {
    try {
        const token = localStorage.getItem('accessToken');
        const response = await fetch(BRAND_API.GET_ALL, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        handleResponse(response);
        const data = await response.json();
        console.log(data);
        brands = data.data;
        renderBrands();
    } catch (error) {
        console.error('Lỗi khi tải danh sách thương hiệu:', error);
    }
}

function renderBrands() {
    const tableBody = document.getElementById('brandTableBody');
    tableBody.innerHTML = brands.map(brand => `
        <tr onclick="editBrand(${brand.id})">
            <td>${brand.id}</td>
            <td>${brand.name}</td>
            <td>${brand.deleteFlag ? ' <span class="badge bg-danger">Không hoạt động</span>' : ' <span class="badge bg-success">Hoạt động</span>'}</td>
        </tr>
    `).join('');
}

function editBrand(brandId) {
    const brand = brands.find(b => b.id === brandId);
    if (!brand) return;

    editingBrandId = brandId;
    document.getElementById('brandId').value = brand.id;
    document.getElementById('newBrandName').value = brand.name;
    
    // Sửa lại phần xử lý trạng thái
    const statusActive = document.getElementById('statusActive');
    const statusInactive = document.getElementById('statusInactive');
    if (brand.deleteFlag === true || brand.deleteFlag === 'true') {
        statusInactive.checked = true;
        statusActive.checked = false;
    } else {
        statusActive.checked = true;
        statusInactive.checked = false;
    }

    // Hiển thị nút xóa
    document.getElementById('btnDeleteBrand').style.display = 'inline-block';
    
    // Hiển thị modal
    const modal = new bootstrap.Modal(document.getElementById('brandModal'));
    modal.show();
}

document.addEventListener('DOMContentLoaded', function() {
    // Thêm event listener cho nút thêm mới
    const btnAddBrand = document.getElementById('btnAddBrand');
    if (btnAddBrand) {
        btnAddBrand.addEventListener('click', function() {
            editingBrandId = null;
            document.getElementById('brandId').value = '';
            document.getElementById('newBrandName').value = '';
            document.getElementById('statusActive').checked = true;
            document.getElementById('btnDeleteBrand').style.display = 'none';
            
            // Cập nhật tiêu đề modal
            document.getElementById('modalTitle').textContent = 'Thêm thương hiệu mới';
            
            // Hiển thị modal
            const modal = new bootstrap.Modal(document.getElementById('brandModal'));
            modal.show();
        });
    }

    // Gọi API ban đầu
    fetchBrands();
});

document.getElementById('btnSaveBrand').addEventListener('click', async function() {
    const name = document.getElementById('newBrandName').value.trim();
    if (!name) {
        return;
    }

    const deleteFlag = document.querySelector('input[name="status"]:checked').value === 'true';
    const token = localStorage.getItem('accessToken');

    const brandData = {
        name: name,
        deleteFlag: deleteFlag
    };

    try {
        let response;
        if (editingBrandId) {
            response = await fetch(`${BRAND_API.UPDATE}/${editingBrandId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(brandData)
            });
        } else {
            response = await fetch(BRAND_API.CREATE, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(brandData)
            });
        }
        handleResponse(response);

        // Đóng modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('brandModal'));
        modal.hide();
        fetchBrands();
    } catch (error) {
        console.error('Lỗi:', error);
        alert('Có lỗi xảy ra khi lưu thương hiệu: ' + error.message);
    }
});

document.getElementById('btnDeleteBrand').addEventListener('click', async function() {
    if (!editingBrandId) return;

    if (!confirm('Bạn có chắc chắn muốn xóa thương hiệu này?')) {
        return;
    }

    try {
        const token = localStorage.getItem('accessToken');
        const response = await fetch(`${BRAND_API.DELETE}/${editingBrandId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        handleResponse(response);

        // Đóng modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('brandModal'));
        modal.hide();

        alert('Xóa thương hiệu thành công!');
        fetchBrands();
    } catch (error) {
        console.error('Lỗi:', error);
        alert('Có lỗi xảy ra khi xóa thương hiệu!');
    }
});