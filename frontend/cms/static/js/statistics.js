// // Dữ liệu mẫu
// const mockData = {
//     summary: {
//         totalOrders: 1234,
//         totalRevenue: 1234567890,
//         todayOrders: 45,
//         totalProducts: 789
//     },
//     revenueByMonth: {
//         labels: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'],
//         data: [
//             12000000, 15000000, 18000000, 14000000, 20000000, 25000000,
//             22000000, 28000000, 30000000, 27000000, 35000000, 40000000
//         ]
//     },
//     orderStatus: {
//         labels: ['Chờ xác nhận', 'Đang xử lý', 'Đang giao hàng', 'Hoàn thành', 'Đã hủy'],
//         data: [30, 45, 25, 180, 20]
//     },
//     topProducts: [
//         { name: 'Bút bi Thiên Long', soldQuantity: 500, revenue: 5000000 },
//         { name: 'Vở Campus', soldQuantity: 450, revenue: 4500000 },
//         { name: 'Bút chì 2B', soldQuantity: 400, revenue: 2000000 },
//         { name: 'Hộp bút màu', soldQuantity: 350, revenue: 7000000 },
//         { name: 'Thước kẻ', soldQuantity: 300, revenue: 1500000 }
//     ]
// };

let mockData;

async function getStatistics() {
    fetch('http://localhost:8080/admin/statistics', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
            // Thêm Authorization nếu cần:
            // 'Authorization': 'Bearer <your-token>'
        }
    })
    .then(async response => {
        if (!response.ok) {
            throw new Error('Lỗi khi gọi API: ' + response.status);
        }
        const responseJson = await response.json();
        return responseJson.data;
    })
    .then(data => {
        console.log('Dữ liệu thống kê:', data);
        displaySummary(data);
        renderRevenueChart(data);
        renderOrderStatusChart(data);
        displayTopProducts(data);
    })
    .catch(error => {
        console.error('Lỗi:', error);
    });
}


// Format tiền tệ
function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(amount);
}



// Hiển thị thống kê tổng quan
function displaySummary(mockData) {
    document.getElementById('totalOrders').textContent = mockData.summary.totalOrders.toLocaleString();
    document.getElementById('totalRevenue').textContent = formatCurrency(mockData.summary.totalRevenue);
    document.getElementById('todayOrders').textContent = mockData.summary.todayOrders;
    document.getElementById('totalProducts').textContent = mockData.summary.totalProducts.toLocaleString();
}

// Vẽ biểu đồ doanh thu
function renderRevenueChart(mockData) {
    const ctx = document.getElementById('revenueChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: mockData.revenueByMonth.labels,
            datasets: [{
                label: 'Doanh thu',
                data: mockData.revenueByMonth.data,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1,
                fill: false
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Doanh thu theo tháng'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return formatCurrency(value);
                        }
                    }
                }
            }
        }
    });
}

// Vẽ biểu đồ trạng thái đơn hàng
function renderOrderStatusChart(mockData) {
    const ctx = document.getElementById('orderStatusChart').getContext('2d');
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: mockData.orderStatus.labels,
            datasets: [{
                data: mockData.orderStatus.data,
                backgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56',
                    '#4BC0C0',
                    '#9966FF'
                ]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

// Hiển thị top sản phẩm
function displayTopProducts(mockData) {
    const tableBody = document.getElementById('topProductsTable');
    tableBody.innerHTML = mockData.topProducts.map(product => `
        <tr>
            <td>${product.name}</td>
            <td>${product.soldQuantity.toLocaleString()}</td>
            <td>${formatCurrency(product.revenue)}</td>
        </tr>
    `).join('');
}

// Khởi tạo trang
document.addEventListener('DOMContentLoaded', function() {
    getStatistics(); 
}); 