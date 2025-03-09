// Thêm hằng số cho phương thức thanh toán và trạng thái
const PAYMENT_METHODS = {
    COD: 'Thanh toán khi nhận hàng',
    VNPAY: 'Thanh toán qua VNPAY'
};

const ORDER_STATUSES = {
    PENDING: 'Chờ thanh toán',
    CASH_ON_DELIVERY: 'Chờ xác nhận',
    PROCESSING: 'Đang xử lý',
    SHIPPED: 'Đang giao hàng',
    COMPLETED: 'Đã hoàn thành',
    FAILED: 'Thanh toán thất bại',
    CANCELED: 'Đã hủy'
};

async function loadOrders() {
    const tableBody = document.getElementById("orderTableBody");
    const token = localStorage.getItem('accessToken');
    const username = localStorage.getItem('username');
    
    try {
        let orders = [];
        
        if (token && username && !isTokenExpired()) {
            // Nếu đã đăng nhập, lấy đơn hàng từ API
            const response = await fetch(`${BASE_API_URL}/user/orders/${username}/get-order`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            const data = await response.json();
            if (data.data) {
                orders = data.data;
            } else {
                throw new Error('Không thể lấy dữ liệu đơn hàng từ server');
            }
        } else {
            // Nếu chưa đăng nhập, lấy từ localStorage
            orders = JSON.parse(localStorage.getItem('orders') || '[]');
        }

        // Xóa nội dung cũ
        tableBody.innerHTML = '';
        
        // Kiểm tra nếu không có đơn hàng
        if (orders.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="7" class="text-center">
                        Không có đơn hàng nào
                    </td>
                </tr>
            `;
            return;
        }

        // Hiển thị danh sách đơn hàng
        orders.forEach(order => {
            const canCancel = ['CASH_ON_DELIVERY', 'PENDING'].includes(order.status);
            const row = `
                <tr onclick="goToOrderDetail('${order.id}')" style="cursor: pointer">
                    <td>${order.id}</td>
                    <td>${formatDate(order.orderDate)}</td>
                    <td>${order.addressShipping}</td>
                    <td class='price'>${formatPrice(order.totalAmount)} đ</td>
                    <td>${PAYMENT_METHODS[order.paymentMethod] || order.paymentMethod}</td>
                    <td>${ORDER_STATUSES[order.status] || order.status}</td>
                    <td onclick="event.stopPropagation()">
                        ${canCancel ? 
                            `<button class="btn btn-danger btn-sm" onclick="cancelOrder('${order.id}')">Hủy đơn</button>` 
                            : ''}
                    </td>
                </tr>
            `;
            tableBody.innerHTML += row;
        });
    } catch (error) {
        console.error('Error loading orders:', error);
        tableBody.innerHTML = `
            <tr>
                <td colspan="7" class="text-center text-danger">
                    Đã xảy ra lỗi khi tải đơn hàng. Vui lòng thử lại sau.
                </td>
            </tr>
        `;
    }
}

// Hàm format ngày tháng
function formatDate(dateString) {
    const date = new Date(dateString);
    return `${date.getDate()} - ${date.getMonth() + 1} - ${date.getFullYear()}`;
}

// Hàm format giá tiền
function formatPrice(price) {
    return new Intl.NumberFormat('vi-VN').format(price);
}

// Hàm dịch trạng thái đơn hàng
function translateStatus(status) {
    const statusMap = {
        'PENDING': 'Chờ xác nhận',
        'CONFIRMED': 'Đã xác nhận',
        'SHIPPING': 'Đang giao',
        'DELIVERED': 'Đã giao',
        'CANCELLED': 'Đã hủy'
    };
    return statusMap[status] || status;
}

// Hàm kiểm tra token hết hạn
function isTokenExpired() {
    const expiration = localStorage.getItem('tokenExpiration');
    if (!expiration) return true;
    return new Date().getTime() > parseInt(expiration);
}

function goToOrderDetail(orderId) {
    window.location.href = `detailorder.html?id=${orderId}`;
}

// Cập nhật hàm hủy đơn hàng
async function cancelOrder(orderId) {
    if (!confirm('Bạn có chắc chắn muốn hủy đơn hàng này?')) {
        return;
    }

    try {
        const token = localStorage.getItem('accessToken');
        const response = await fetch(`${BASE_API_URL}/user/orders/cancel/${orderId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Không thể hủy đơn hàng');
        }

        const result = await response.json();
        if (result.data) {
            alert('Đơn hàng đã được hủy thành công');
            loadOrders(); // Tải lại danh sách đơn hàng
        } else {
            throw new Error(result.message || 'Không thể hủy đơn hàng');
        }
    } catch (error) {
        console.error('Error canceling order:', error);
        alert('Có lỗi xảy ra khi hủy đơn hàng: ' + error.message);
    }
}

// Gọi hàm loadOrders khi trang được tải
document.addEventListener("DOMContentLoaded", loadOrders);