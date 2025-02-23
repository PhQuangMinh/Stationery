const orders = [
    {
        id: "12345",
        customerName: "Quang Nam",
        phone: "0123456789",
        date: "1-1-2025",
        address: "Điện Phương, điện Bàn, Nghệ An",
        total: "25,635.0",
        status: "Đang giao"
    }
    // Có thể thêm nhiều đơn hàng mẫu khác
];
// Render đơn hàng
function renderOrders() {
    const tableBody = document.getElementById('orderTableBody');
    tableBody.innerHTML = orders.map(order => `
        <tr>
            <td>${order.id}</td>
            <td>${order.customerName}</td>
            <td>${order.phone}</td>
            <td>${order.date}</td>
            <td>${order.address}</td>
            <td>${order.total}</td>
            <td><span class="order-status">${order.status}</span></td>
        </tr>
    `).join('');
}
// Xử lý đăng xuất
function handleLogout() {
    if (confirm('Bạn có chắc chắn muốn đăng xuất?')) {
        alert('Đã đăng xuất thành công!');
        // Có thể chuyển hướng về trang login
        // window.location.href = 'login.html';
    }
}
// Khởi tạo trang
document.addEventListener('DOMContentLoaded', function() {
    renderOrders();
});
