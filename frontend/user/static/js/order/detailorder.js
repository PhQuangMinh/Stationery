function getOrderIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

const products = [
    {
        id: 1,
        orderId: 12345,
        image: "/lovable-uploads/d9c4729c-6dc2-4d61-9360-d7906496a46b.png",
        name: "Hướng dẫn học và làm bài ngữ văn 7 tập 1",
        price: 39190,
        quantity: 1
    },
    {
        id: 2,
        orderId: 12345,
        image: "/lovable-uploads/d9c4729c-6dc2-4d61-9360-d7906496a46b.png",
        name: "Sách giáo khoa Toán lớp 7",
        price: 45000,
        quantity: 2
    },
    {
        id: 3,
        orderId: 67890,
        image: "/lovable-uploads/d9c4729c-6dc2-4d61-9360-d7906496a46b.png",
        name: "Sách bài tập Tiếng Anh 7",
        price: 35000,
        quantity: 1
    }
];

const productReviews = new Map(); 

function formatPrice(price) {
    return price.toLocaleString('vi-VN') + ' đ';
}

function calculateTotal() {
    return products.reduce((sum, product) => {
        return sum + (product.price * product.quantity);
    }, 0);
}

function renderProducts() {
    const orderId = getOrderIdFromURL();
    const orderProducts = products.filter(product => product.orderId === parseInt(orderId));
    
    const productList = document.getElementById('productList');
    let html = '';

    orderProducts.forEach(product => {
        const isReviewed = productReviews.has(product.id);
        html += `
            <tr>
                <td style="width: 150px">
                    <img 
                        src="${product.image}"
                        alt="${product.name}"
                        class="img-fluid"
                    />
                </td>
                <td>${product.name}</td>
                <td class="text-danger">${formatPrice(product.price)}</td>
                <td>${product.quantity}</td>
                <td class="text-danger">${formatPrice(product.price * product.quantity)}</td>
                <td>
                    <button 
                        class="review-btn ${isReviewed ? 'reviewed' : ''}"
                        onclick="openReviewModal(${product.id})"
                    >
                        ${isReviewed ? 'Đã đánh giá' : 'Đánh giá'}
                    </button>
                </td>
            </tr>
        `;
    });

    productList.innerHTML = html;
    
    const totalAmount = document.getElementById('totalAmount');
    const total = orderProducts.reduce((sum, product) => sum + (product.price * product.quantity), 0);
    totalAmount.textContent = formatPrice(total);
}

let currentProductId = null;
let currentRating = 0;

function openReviewModal(productId) {
    currentProductId = productId;
    const product = products.find(p => p.id === productId);
    
    document.getElementById('modalProductImage').src = product.image;
    document.getElementById('modalProductName').textContent = product.name;
    
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

document.getElementById('submitReview').addEventListener('click', function() {
    if (currentRating === 0) {
        alert('Vui lòng chọn số sao đánh giá!');
        return;
    }

    const comment = document.getElementById('reviewComment').value;
    
    productReviews.set(currentProductId, {
        rating: currentRating,
        comment: comment,
        date: new Date()
    });

    bootstrap.Modal.getInstance(document.getElementById('reviewModal')).hide();
    
    renderProducts();
});

document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
});