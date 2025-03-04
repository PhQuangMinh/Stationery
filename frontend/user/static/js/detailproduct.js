const products = [
    {
        id: 1,
        name: "Sách khoa học tự nhiên 9 - Kết nối tri thức",
        image: "abc",
        brand: "Nhà XB giáo dục Việt Nam",
        stockStatus: "Còn hàng",
        rating: 4,
        price: 39000,
        originalPrice: 41000,
        discount: 10,
        quantity: 1,
        features: [
            "Nhiều tính năng đặc biệt, dùng được cho nhiều cấp học từ học sinh đến sinh viên.",
            "Thiết kế: Nắp trượt",
            "Màu sắc: Đen, xanh, hồng.",
            "Bảo hành 7 năm."
        ]
    },
    {
        id: 2,
        name: "Sách Tiếng Anh 12 - Chân trời sáng tạo",
        image: "abc",
        brand: "Nhà XB giáo dục Việt Nam",
        stockStatus: "Còn hàng",
        rating: 5,
        price: 45000,
        originalPrice: 50000,
        discount: 10,
        quantity: 1,
        features: [
            "Nội dung bám sát chương trình SGK mới.",
            "Bài tập thực hành phong phú, dễ hiểu.",
            "Sách màu, hình ảnh sinh động."
        ]
    },
    {
        id: 3,
        name: "Sách Toán Cao Cấp - Đại số tuyến tính",
        image: "abc",
        brand: "NXB Đại học Quốc gia",
        stockStatus: "Hết hàng",
        rating: 4.5,
        price: 75000,
        originalPrice: 80000,
        discount: 6,
        quantity: 1,
        features: [
            "Dành cho sinh viên đại học chuyên ngành kỹ thuật.",
            "Lý thuyết đầy đủ, có ví dụ minh họa.",
            "Tác giả nổi tiếng, uy tín trong ngành."
        ]
    }
];

let productData;

function getProductById(productId) {
    return products.find(product => product.id === productId);
}

function renderStars(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        stars += `<i class="fa${i <= rating ? 's' : 'r'} fa-star"></i>`;
    }
    return stars;
}

function renderProductDetails() {
    const productHTML = `
        <h1 class="h2 mb-3">${productData.name}</h1>
        <div class="mb-3">
            Thương hiệu: <a href="#" class="brand-link">${productData.brand}</a> | 
            Tình trạng: <span class="stock-status">${productData.stockStatus}</span>
        </div>
        <div class="star-rating mb-3">
            ${renderStars(productData.rating)}
        </div>
        <div class="mb-4">
            <span class="price">${productData.price.toLocaleString()} đ</span>
            <span class="original-price">${productData.originalPrice.toLocaleString()} đ</span>
            <span class="discount-badge">-${productData.discount}%</span>
        </div>
        <div class="d-flex align-items-center mb-4">
            <button class="btn btn-outline-secondary btn-sm" onclick="decreaseQuantity()">-</button>
            <input type="number" id="quantity" class="form-control mx-2 quantity-input" value="1" min="1">
            <button class="btn btn-outline-secondary btn-sm" onclick="increaseQuantity()">+</button>
        </div>
        <button class="btn btn-success add-to-cart-btn"">
            <i class="fas fa-shopping-cart"></i> Thêm vào giỏ hàng
        </button>
    `;
    document.getElementById('product-details').innerHTML = productHTML;
}

function decreaseQuantity() {
    const input = document.getElementById('quantity');
    if (input.value > 1) {
        input.value = parseInt(input.value) - 1;
    }
}

function increaseQuantity() {
    const input = document.getElementById('quantity');
    input.value = parseInt(input.value) + 1;
}

function addToCart(productData) {
    const quantity = parseInt(document.getElementById('quantity').value);
    console.log("add to cart: ", productData);
    if (!productData || Object.keys(productData).length === 0) {
        alert("Sản phẩm không tồn tại!");
        return;
    }
    console.log("Chay o day nua")
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let existingProduct = cart.find(item => item.id === productData.id);
    if (existingProduct) {
        existingProduct.quantity += quantity;
    } else {
        cart.push({ ...productData, quantity: quantity });
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    alert("Sản phẩm đã được thêm vào giỏ hàng! 🛒");
}

const reviews = [
    {
        id: 1,
        productId: 2,
        userName: "Nguyễn Văn A",
        rating: 5,
        comment: "Sách rất hay và chất lượng, nội dung dễ hiểu.",
        date: "2024-03-15"
    },
    {
        id: 2,
        productId: 2,
        userName: "Trần Thị B",
        rating: 4,
        comment: "Sách tốt, giao hàng nhanh. Tuy nhiên giá hơi cao.",
        date: "2024-03-14"
    },
    {
        id: 3,
        productId: 2,
        userName: "Lê Văn C",
        rating: 5,
        comment: "Sách tiếng Anh rất hay, phù hợp với chương trình học.",
        date: "2024-03-13"
    },
    {
        id: 3,
        productId: 2,
        userName: "Lê Văn C",
        rating: 5,
        comment: "Sách tiếng Anh rất hay, phù hợp với chương trình học.",
        date: "2024-03-13"
    },
    {
        id: 3,
        productId: 2,
        userName: "Lê Văn C",
        rating: 5,
        comment: "Sách tiếng Anh rất hay, phù hợp với chương trình học.",
        date: "2024-03-13"
    },
    {
        id: 3,
        productId: 2,
        userName: "Lê Văn C",
        rating: 5,
        comment: "Sách tiếng Anh rất hay, phù hợp với chương trình học.",
        date: "2024-03-13"
    }
];

function getReviewsByProductId(productId, page = 1, perPage = 5) {
    const productReviews = reviews.filter(review => review.productId === productId);
    const start = (page - 1) * perPage;
    const end = start + perPage;
    return {
        reviews: productReviews.slice(start, end),
        total: productReviews.length
    };
}

function renderReviews(page = 1) {
    const { reviews: productReviews, total } = getReviewsByProductId(productData.id, page);
    const totalPages = Math.ceil(total / 5);

    let reviewsHTML = '';
    productReviews.forEach(review => {
        reviewsHTML += `
            <div class="card review-card">
                <div class="card-body">
                    <div class="d-flex justify-content-between">
                        <h5 class="card-title">${review.userName}</h5>
                        <small class="text-muted">${new Date(review.date).toLocaleDateString('vi-VN')}</small>
                    </div>
                    <div class="star-rating mb-2">
                        ${renderStars(review.rating)}
                    </div>
                    <p class="card-text">${review.comment}</p>
                </div>
            </div>
        `;
    });

    let paginationHTML = '';
    for (let i = 1; i <= totalPages; i++) {
        paginationHTML += `
            <li class="page-item ${i === page ? 'active' : ''}">
                <a class="page-link" onclick="renderReviews(${i})">${i}</a>
            </li>
        `;
    }

    document.getElementById('reviews-container').innerHTML = reviewsHTML;
    document.getElementById('pagination').innerHTML = paginationHTML;
}

document.addEventListener("DOMContentLoaded", function () {
    const params = new URLSearchParams(window.location.search);
    const productId = parseInt(params.get("id"));
    if (productId === undefined || productId==null | isNaN(productId)){
        productId = 2;
    }
    console.log("productId: " + productId)
    productData = getProductById(productId);
    renderProductDetails();
    renderReviews();
    // updateCartCount();
    const addToCartBtn = document.querySelector(".add-to-cart-btn");
    if (addToCartBtn) {
        document.addEventListener("click", function (event) {
            if (event.target.classList.contains("add-to-cart-btn")) {
                addToCart(productData);  
            }
        });
    }

});
