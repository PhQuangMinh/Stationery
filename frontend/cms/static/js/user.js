// API URLs
const USER_API = {
    GET_ALL: "http://localhost:8080/admin/users",
    CREATE: "http://localhost:8080/admin/add-user-admin",
    UPDATE: "http://localhost:8080/admin/users/update",
    DELETE: "http://localhost:8080/admin/users"
};

let currentPage = 0;
const pageSize = 10;
let totalPages = 1;
let users = [];

// Hàm gọi API lấy danh sách người dùng
async function fetchUsers(page = 0) {
    try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            window.location.href = "login.html";
            return;
        }

        const response = await fetch(
            `http://localhost:8080/admin/users?page=${page}&size=${pageSize}&sortBy=id`,
            {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        );
        handleResponse(response);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const text = await response.text(); // Đọc response dưới dạng text
        try {
            const result = JSON.parse(text); // Parse text thành JSON
            console.log('Response data:', result);
            
            if (result.data && result.data.content) {
                users = result.data.content;
                totalPages = result.data.totalPages;
                renderUsers();
                renderPagination();
            } else {
                throw new Error('Invalid data format');
            }
        } catch (parseError) {
            console.error('JSON Parse Error:', parseError);
            console.error('Raw response:', text);
            throw new Error('Invalid JSON response from server');
        }
    } catch (error) {
        console.error('Lỗi khi lấy danh sách người dùng:', error);
    }
}

// Hàm hiển thị danh sách người dùng
function renderUsers() {
    console.log("Users: ", users);
    const tableBody = document.getElementById('userTableBody');
    tableBody.innerHTML = users.map((user, index) => `
        <tr onclick="editUser(${index})">
            <td>${user.id}</td>
            <td>${user.name || 'N/A'}</td>
            <td>${user.username || 'N/A'}</td>
            <td>${user.email || 'N/A'}</td>
            <td>${user.address || 'N/A'}</td>
            <td>${user.phone || 'N/A'}</td>
            <td>${user.role || 'N/A'}</td>
        </tr>
    `).join('');
}

function renderPagination() {
    const pagination = document.getElementById('pagination');
    const prevButton = document.getElementById('prevPage');
    const nextButton = document.getElementById('nextPage');
    
    // Xóa các nút số trang cũ
    const pageButtons = pagination.querySelectorAll('.page-numbers');
    pageButtons.forEach(button => button.remove());
    
    // Thêm các nút số trang mới
    const maxVisiblePages = 5;
    let startPage = Math.max(0, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 1);
    startPage = Math.max(0, Math.min(startPage, totalPages - maxVisiblePages));
    
    // Thêm dấu ... ở đầu nếu cần
    if (startPage > 0) {
        const ellipsis = document.createElement('li');
        ellipsis.className = 'page-item';
        ellipsis.innerHTML = '<span class="page-link">...</span>';
        pagination.insertBefore(ellipsis, nextButton.parentNode);
    }
    
    // Thêm các nút số trang
    for (let i = startPage; i <= endPage; i++) {
        const pageItem = document.createElement('li');
        pageItem.className = `page-item page-numbers ${i === currentPage ? 'active' : ''}`;
        pageItem.innerHTML = `<button class="page-link">${i + 1}</button>`;
        
        pageItem.querySelector('button').addEventListener('click', async () => {
            currentPage = i;
            await fetchUsers(currentPage);
        });
        
        pagination.insertBefore(pageItem, nextButton.parentNode);
    }
    
    // Thêm dấu ... ở cuối nếu cần
    if (endPage < totalPages - 1) {
        const ellipsis = document.createElement('li');
        ellipsis.className = 'page-item';
        ellipsis.innerHTML = '<span class="page-link">...</span>';
        pagination.insertBefore(ellipsis, nextButton.parentNode);
    }
    
    // Cập nhật trạng thái nút Previous/Next
    prevButton.parentNode.classList.toggle('disabled', currentPage === 0);
    nextButton.parentNode.classList.toggle('disabled', currentPage >= totalPages - 1);
}

// Thêm sự kiện cho nút Previous
document.getElementById('prevPage').addEventListener('click', async function() {
    if (currentPage > 0) {
        currentPage--;
        await fetchUsers(currentPage);
    }
});

// Thêm sự kiện cho nút Next
document.getElementById('nextPage').addEventListener('click', async function() {
    if (currentPage < totalPages - 1) {
        currentPage++;
        await fetchUsers(currentPage);
    }
});

// Khởi tạo dữ liệu khi trang load
document.addEventListener('DOMContentLoaded', async function() {
    const token = localStorage.getItem('accessToken');
    if (!token) {
        window.location.href = "login.html";
        return;
    }

    // Kiểm tra token hết hạn
    const payload = JSON.parse(atob(token.split(".")[1]));
    if (payload.exp * 1000 < Date.now()) {
        localStorage.removeItem("accessToken");
        window.location.href = "login.html";
        return;
    }

    await fetchUsers();
});

// Thêm người dùng mới vào danh sách
document.getElementById('btnAddUser').addEventListener('click', function() {
    // Reset form
    document.getElementById('userModalLabel').textContent = 'Thêm người dùng mới';
    document.getElementById('passwordField').style.display = 'block';
    document.getElementById('confirmPasswordField').style.display = 'block';
    document.getElementById('btnSaveUser').removeAttribute('data-index');
    
    // Reset các trường input
    document.getElementById('userName').value = '';
    document.getElementById('userEmail').value = '';
    document.getElementById('userUsername').value = '';
    document.getElementById('userPassword').value = '';
    document.getElementById('userConfirmPassword').value = '';
    document.getElementById('userAddress').value = '';
    document.getElementById('userPhone').value = '';
    document.getElementById('userRole').value = 'ROLE_USER';
});

function editUser(index) {
    const user = users[index];
    
    // Cập nhật tiêu đề modal
    document.getElementById('userModalLabel').textContent = 'Chỉnh sửa người dùng';
    
    // Điền thông tin user vào form
    document.getElementById('userName').value = user.name || '';
    document.getElementById('userEmail').value = user.email || '';
    document.getElementById('userUsername').value = user.username || '';
    document.getElementById('userAddress').value = user.address || '';
    document.getElementById('userPhone').value = user.phone || '';
    document.getElementById('userRole').value = user.role || 'ROLE_USER';
    
    // Ẩn các trường mật khẩu khi chỉnh sửa
    document.getElementById('passwordField').style.display = 'none';
    document.getElementById('confirmPasswordField').style.display = 'none';
    
    // Lưu index của user đang được chỉnh sửa
    document.getElementById('btnSaveUser').setAttribute('data-index', index);
    
    const userModal = new bootstrap.Modal(document.getElementById('addUserModal'));
    userModal.show();
}

// Thêm hàm kiểm tra response
function handleResponse(response) {
    if (response.status === 401) {
        localStorage.removeItem('accessToken');
        window.location.href = 'login.html';
    }
    return response;
}

// Cập nhật sự kiện lưu user
document.getElementById('btnSaveUser').addEventListener('click', async function() {
    const index = this.getAttribute('data-index');
    const isEditing = index !== null;

    try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            window.location.href = "login.html";
            return;
        }

        if (isEditing) {
            const userData = {
                name: document.getElementById('userName').value,
                email: document.getElementById('userEmail').value,
                address: document.getElementById('userAddress').value,
                phone: document.getElementById('userPhone').value,
                role: document.getElementById('userRole').value
            };
            console.log("User data: ", userData);

            const response = await fetch(`http://localhost:8080/admin/users/update/${users[index].id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(userData)
            });
            handleResponse(response);

            let responseJson = await response.json();
            console.log(responseJson);
        } else {
            if (document.getElementById('userConfirmPassword').value != document.getElementById('userPassword').value){
                alert("Mật khẩu xác nhận không khớp!");
                return;
            }
            const registerData = {
                name: document.getElementById('userName').value,
                username: document.getElementById('userUsername').value,
                email: document.getElementById('userEmail').value,
                password: document.getElementById('userPassword').value,
                phone: document.getElementById('userPhone').value,
                address: document.getElementById('userAddress').value,
                role: document.getElementById('userRole').value
            };
            console.log("Register data: ", registerData);
            const response = await fetch('http://localhost:8080/admin/add-user-admin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(registerData)
            });
            handleResponse(response);

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Lỗi khi thêm người dùng');
            }
        }

        // Cập nhật lại danh sách
        await fetchUsers(currentPage);
        
        // Đóng modal
        document.getElementById('addUserModal').querySelector('.btn-close').click();
        
        // Thông báo thành công
        alert(isEditing ? 'Cập nhật người dùng thành công!' : 'Thêm người dùng mới thành công!');
    } catch (error) {
        console.error('Lỗi khi lưu người dùng:', error);
    }
});
