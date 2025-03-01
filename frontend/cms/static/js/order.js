const orders = [
    { id: 1, name: "Nguyễn Văn A", phone: "0123456789", date: "2025-02-24", address: "Hà Nội", total: "500.000", status: "Chờ xác nhận" },
    { id: 2, name: "Trần Thị B", phone: "0987654321", date: "2025-02-23", address: "TP Hồ Chí Minh", total: "750.000", status: "Đang giao" }
];

function renderOrders() {
    const tableBody = document.getElementById('orderTableBody');
    tableBody.innerHTML = orders.map((order, index) => `
        <tr onclick="editOrder(${index})">
            <td>#${order.id}</td>
            <td>${order.name}</td>
            <td>${order.phone}</td>
            <td>${order.date}</td>
            <td>${order.address}</td>
            <td>${order.total} VND</td>
            <td>${order.status}</td>
        </tr>
    `).join('');
}

document.addEventListener('DOMContentLoaded', function() {
    renderOrders();
});

// Hàm mở modal chỉnh sửa đơn hàng
function editOrder(index) {
    const order = orders[index];

    document.getElementById('editCustomerName').value = order.name;
    document.getElementById('editPhone').value = order.phone;
    document.getElementById('editDate').value = order.date;
    document.getElementById('editAddress').value = order.address;
    document.getElementById('editTotalPrice').value = order.total;
    document.getElementById('editStatus').value = order.status;

    document.getElementById('saveOrderChanges').setAttribute('data-index', index);

    const orderModal = new bootstrap.Modal(document.getElementById('editOrderModal'));
    orderModal.show();
}

// Lưu thay đổi đơn hàng
document.getElementById('saveOrderChanges').addEventListener('click', function() {
    const index = this.getAttribute('data-index');

    orders[index] = {
        ...orders[index],
        name: document.getElementById('editCustomerName').value,
        phone: document.getElementById('editPhone').value,
        date: document.getElementById('editDate').value,
        address: document.getElementById('editAddress').value,
        total: document.getElementById('editTotalPrice').value,
        status: document.getElementById('editStatus').value
    };

    renderOrders();
    document.getElementById('editOrderModal').querySelector('.btn-close').click();
});
