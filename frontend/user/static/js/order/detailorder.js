function getOrderIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

const productReviews = new Map(); 

function formatPrice(price) {
    return price.toLocaleString('vi-VN') + ' đ';
}

async function fetchOrderDetails() {
    try {
        const orderId = getOrderIdFromURL();
        const username = localStorage.getItem('username');
        
        if (!orderId || !username) {
            throw new Error('Không tìm thấy thông tin đơn hàng');
        }

        const response = await fetch(`${BASE_API_URL}/user/orders/${username}/${orderId}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            }
        });

        if (!response.ok) {
            throw new Error('Không thể tải thông tin đơn hàng');
        }

        const result = await response.json();
        if (result.data) {
            console.log(result.data);
            renderOrderDetails(result.data);
        }
    } catch (error) {
        console.error('Lỗi:', error);
        alert('Có lỗi xảy ra khi tải thông tin đơn hàng');
    }
}

function renderOrderDetails(orderData) {
    // Render thông tin đơn hàng
    document.getElementById('orderId').textContent = orderData.id;
    document.getElementById('orderDate').textContent = new Date(orderData.orderDate).toLocaleDateString('vi-VN');
    document.getElementById('orderStatus').textContent = orderData.status;
    document.getElementById('shippingAddress').textContent = orderData.addressShipping;
    document.getElementById('paymentMethod').textContent = orderData.paymentMethod;

    // Render danh sách sản phẩm
    const productList = document.getElementById('productList');
    let html = '';

    orderData.orderItemResponses.forEach(item => {
        const isReviewed = productReviews.has(item.productId);
        const canReview = orderData.status === 'COMPLETED'; // Kiểm tra trạng thái đơn hàng

        html += `
            <tr data-product-id="${item.productId}">
                <td style="width: 150px">
                    <img 
                        src="${item.imageUrl}"
                        alt="${item.name}"
                        class="img-fluid"
                    />
                </td>
                <td>${item.name}</td>
                <td class="text-danger">${formatPrice(item.price)}</td>
                <td>${item.quantity}</td>
                <td class="text-danger">${formatPrice(item.price * item.quantity)}</td>
                <td>
                    ${canReview ? `
                        <button 
                            class="review-btn ${isReviewed ? 'reviewed' : ''}"
                            onclick="openReviewModal('${item.productId}', '${item.imageUrl}', '${item.name}')"
                            data-product-id="${item.productId}"
                            ${isReviewed ? 'disabled' : ''}
                        >
                            ${isReviewed ? 'Đã đánh giá' : 'Đánh giá'}
                        </button>
                    ` : `
                        <button 
                            class="review-btn disabled" 
                            disabled 
                            title="Chỉ có thể đánh giá khi đơn hàng đã hoàn thành"
                        >
                            Chưa thể đánh giá
                        </button>
                    `}
                </td>
            </tr>
        `;
    });

    productList.innerHTML = html;
    
    // Render tổng tiền
    const totalAmount = document.getElementById('totalAmount');
    totalAmount.textContent = formatPrice(orderData.totalAmount);
}

let currentProductId = null;
let currentRating = 0;

function openReviewModal(productId, imageUrl, productName) {
    // Thêm kiểm tra trạng thái đơn hàng
    const orderStatus = document.getElementById('orderStatus').textContent;
    if (orderStatus !== 'COMPLETED') {
        alert('Chỉ có thể đánh giá khi đơn hàng đã hoàn thành!');
        return;
    }

    currentProductId = String(productId);
    
    document.getElementById('modalProductImage').src = imageUrl;
    document.getElementById('modalProductName').textContent = productName;
    
    document.querySelectorAll('.stars i').forEach(star => star.classList.remove('active'));
    document.getElementById('reviewComment').value = '';
    currentRating = 0;
    
    const modal = new bootstrap.Modal(document.getElementById('reviewModal'));
    modal.show();
}

document.querySelectorAll('.stars i').forEach(star => {
    star.addEventListener('mouseover', function() {
        const rating = this.dataset.rating;
        updateStars(rating);
    });

    star.addEventListener('click', function() {
        currentRating = this.dataset.rating;
        updateStars(currentRating);
    });
});

document.querySelector('.stars').addEventListener('mouseleave', function() {
    updateStars(currentRating);
});

function updateStars(rating) {
    document.querySelectorAll('.stars i').forEach(star => {
        star.classList.remove('active', 'bi-star-fill', 'bi-star');
        if (star.dataset.rating <= rating) {
            star.classList.add('active', 'bi-star-fill');
        } else {
            star.classList.add('bi-star');
        }
    });
}

document.getElementById('submitReview').addEventListener('click', async function() {
    if (currentRating === 0) {
        alert('Vui lòng chọn số sao đánh giá!');
        return;
    }

    const comment = document.getElementById('reviewComment').value;
    const username = localStorage.getItem('username');
    
    if (!username) {
        alert('Vui lòng đăng nhập để đánh giá sản phẩm!');
        return;
    }
    
    try {
        console.log("Sending review for product ID:", currentProductId);
        const reviewRequest = {
            rating: parseInt(currentRating),
            comment: comment
        };

        const response = await fetch(`${BASE_API_URL}/user/reviews/${currentProductId}/${username}/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            },
            body: JSON.stringify(reviewRequest)
        });

        if (!response.ok) {
            throw new Error('Không thể gửi đánh giá');
        }

        const result = await response.json();
        if (result.data) {
            alert('Đánh giá của bạn đã được gửi thành công!');
            productReviews.set(currentProductId, {
                rating: currentRating,
                comment: comment,
                date: new Date()
            });
            
            // Đóng modal
            bootstrap.Modal.getInstance(document.getElementById('reviewModal')).hide();
            
            // Cập nhật lại giao diện
            fetchOrderDetails();
        }
    } catch (error) {
        console.error('Lỗi khi gửi đánh giá:', error);
        alert('Có lỗi xảy ra khi gửi đánh giá!');
    }
});

document.addEventListener('DOMContentLoaded', () => {
    fetchOrderDetails();
});