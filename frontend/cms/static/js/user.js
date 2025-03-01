const users = [];

function renderUsers() {
    const tableBody = document.getElementById('userTableBody');
    tableBody.innerHTML = users.map((user, index) => `
        <tr onclick="editUser(${index})">
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.username}</td>
            <td>${user.address}</td>
            <td>${user.phone}</td>
        </tr>
    `).join('');
}

// Gọi hàm render khi trang load
document.addEventListener('DOMContentLoaded', function() {
    renderUsers();
});

// Thêm người dùng mới vào danh sách
document.getElementById('btnSaveUser').addEventListener('click', function() {
    const index = this.getAttribute('data-index');

    const newUser = {
        name: document.getElementById('newUserName').value,
        email: document.getElementById('newUserEmail').value,
        username: document.getElementById('newUserUsername').value,
        address: document.getElementById('newUserAddress').value,
        phone: document.getElementById('newUserPhone').value
    };

    if (index !== null) {
        users[index] = newUser;
    } else {
        users.push(newUser);
    }

    renderUsers();

    // Đóng modal
    document.getElementById('addUserModal').querySelector('.btn-close').click();
});

function editUser(index) {
    const user = users[index];

    document.getElementById('newUserName').value = user.name;
    document.getElementById('newUserEmail').value = user.email;
    document.getElementById('newUserUsername').value = user.username;
    document.getElementById('newUserAddress').value = user.address;
    document.getElementById('newUserPhone').value = user.phone;

    document.getElementById('btnSaveUser').setAttribute('data-index', index);

    const userModal = new bootstrap.Modal(document.getElementById('addUserModal'));
    userModal.show();
}
