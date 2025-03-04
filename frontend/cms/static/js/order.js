let currentPage = 0;
const pageSize = 10;
let totalPages = 1;
let orders = [];

// Hàm gọi API lấy danh sách đơn hàng
async function fetchOrders(page = 0) {
    try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            window.location.href = "login.html";
            return;
        }

        const response = await fetch(
            `http://localhost:8080/admin/orders/all?page=${page}&size=${pageSize}&sortBy=id`,
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

        const result = await response.json();
        orders = result.data.content;
        totalPages = result.data.totalPages;
        renderOrders();
        renderPagination();
    } catch (error) {
        console.error('Lỗi khi lấy danh sách đơn hàng:', error);
    }
}

// Hàm hiển thị danh sách đơn hàng
function renderOrders() {
    const tableBody = document.getElementById('orderTableBody');
    tableBody.innerHTML = orders.map((order, index) => {
        const fullName = order.userResponse ? 
            `${order.userResponse.firstName} ${order.userResponse.lastName}` : 'N/A';
        
        return `
        <tr onclick="editOrder(${index})">
            <td>#${order.id}</td>
            <td>${fullName}</td>
            <td>${order.userResponse ? order.userResponse.phone : 'N/A'}</td>
            <td>${formatDate(order.orderDate)}</td>
            <td>${order.addressShipping}</td>
            <td>${formatCurrency(order.totalAmount)} VND</td>
            <td>${order.status}</td>
        </tr>
    `}).join('');
}

// Hàm format ngày tháng
function formatDate(timestamp) {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp);
    return date.toLocaleDateString('vi-VN');
}

// Hàm format tiền tệ
function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN').format(amount);
}

// Hàm mở modal chỉnh sửa đơn hàng
function editOrder(index) {
    const order = orders[index];
    const fullName = order.userResponse ? 
        `${order.userResponse.firstName} ${order.userResponse.lastName}` : '';

    document.getElementById('editCustomerName').value = fullName;
    document.getElementById('editPhone').value = order.userResponse ? order.userResponse.phone : '';
    document.getElementById('editDate').value = order.orderDate ? new Date(order.orderDate).toISOString().split('T')[0] : '';
    document.getElementById('editAddress').value = order.addressShipping || '';
    document.getElementById('editTotalPrice').value = order.totalAmount || '';
    document.getElementById('editStatus').value = order.status || '';

    // Thêm hiển thị chi tiết đơn hàng nếu cần
    const orderItems = order.orderItemResponses || [];
    // TODO: Hiển thị danh sách orderItems trong modal nếu cần

    document.getElementById('saveOrderChanges').setAttribute('data-index', index);

    const orderModal = new bootstrap.Modal(document.getElementById('editOrderModal'));
    orderModal.show();
}

// Kiểm tra token và khởi tạo dữ liệu khi trang load
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

    await fetchOrders();
});

// Thêm hàm kiểm tra response
function handleResponse(response) {
    if (response.status === 401) {
        localStorage.removeItem('accessToken');
        window.location.href = 'login.html';
    }
    return response;
}

// Lưu thay đổi đơn hàng
document.getElementById('saveOrderChanges').addEventListener('click', async function() {
    const index = this.getAttribute('data-index');
    const order = orders[index];

    // Tạo object chứa thông tin cập nhật
    const updatedOrder = {
        orderDate: order.orderDate,
        totalAmount: order.totalAmount,
        status: document.getElementById('editStatus').value,
        shippingAddress: document.getElementById('editAddress').value,
    };

    try {
        const token = localStorage.getItem('accessToken');
        const response = await fetch(`http://localhost:8080/admin/orders/update/${order.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(updatedOrder)
        });
        handleResponse(response);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Cập nhật lại danh sách đơn hàng
        await fetchOrders(currentPage);
        document.getElementById('editOrderModal').querySelector('.btn-close').click();
    } catch (error) {
        console.error('Lỗi khi cập nhật đơn hàng:', error);
    }
});

// Cập nhật hàm render phân trang
function renderPagination() {
    const pagination = document.getElementById('pagination');
    const prevButton = document.getElementById('prevPage');
    const nextButton = document.getElementById('nextPage');
    
    // Xóa các nút số trang cũ
    const pageButtons = pagination.querySelectorAll('.page-numbers');
    pageButtons.forEach(button => button.remove());
    
    // Thêm các nút số trang mới
    const maxVisiblePages = 5; // Số lượng nút hiển thị tối đa
    let startPage = Math.max(0, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 1);
    
    // Điều chỉnh lại startPage nếu endPage đã đạt giới hạn
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
        
        // Thêm sự kiện click cho nút số trang
        pageItem.querySelector('button').addEventListener('click', async () => {
            currentPage = i;
            await fetchOrders(currentPage);
            renderPagination();
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
    
    // Cập nhật trạng thái nút Previous
    if (currentPage === 0) {
        prevButton.disabled = true;
        prevButton.parentNode.classList.add('disabled');
    } else {
        prevButton.disabled = false;
        prevButton.parentNode.classList.remove('disabled');
    }
    
    // Cập nhật trạng thái nút Next
    if (currentPage >= totalPages - 1) {
        nextButton.disabled = true;
        nextButton.parentNode.classList.add('disabled');
    } else {
        nextButton.disabled = false;
        nextButton.parentNode.classList.remove('disabled');
    }
}

