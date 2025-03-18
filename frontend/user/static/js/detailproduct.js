let productData;

async function getProductById(productId) {
    try {
        const response = await fetch(`${BASE_API_URL}/products/${productId}`);
        const data = await response.json();
        if (data.data) {
            return {
                id: data.data.id,
                name: data.data.name,
                brand: data.data.brandResponse.name || "Chưa có thương hiệu",
                stockStatus: data.data.stockStatus || "Còn hàng",
                rating: data.data.rating || 5,
                price: data.data.price,
                originalPrice: data.data.originalPrice || data.data.price,
                discount: data.data.discount || 0,
                imageUrl: data.data.imageUrl,
                description: data.data.description || "Chưa có mô tả",
                quantity: 1
            };
        }
        return null;
    } catch (error) {
        console.error('Error fetching product:', error);
        return null;
    }
}

function renderStars(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        stars += `<i class="fa${i <= rating ? 's' : 'r'} fa-star"></i>`;
    }
    return stars;
}

async function renderProductDetails() {
    if (!productData) return;

    const discountPrice = productData.price * (100 - productData.discount) / 100;
    
    const productImage = document.getElementById('product-image');
    productImage.src = productData.imageUrl;
    productImage.alt = productData.name;
    
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
            <span class="price">${formatPrice(discountPrice)} đ</span>
            ${productData.discount > 0 ? 
                `<span class="original-price">${formatPrice(productData.price)} đ</span>
                 <span class="discount-badge">-${productData.discount}%</span>` 
                : ''}
        </div>
        <div class="product-description mb-4">
            <h4>Mô tả sản phẩm:</h4>
            <p class="text-muted">${productData.description}</p>
        </div>
        <div class="d-flex align-items-center mb-4">
            <button class="btn btn-outline-secondary btn-sm" onclick="decreaseQuantity()">-</button>
            <input type="number" id="quantity" class="form-control mx-2 quantity-input" value="1" min="1">
            <button class="btn btn-outline-secondary btn-sm" onclick="increaseQuantity()">+</button>
        </div>
        <button class="btn btn-success add-to-cart-btn">
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
    // Kiểm tra đăng nhập trước khi thêm vào giỏ hàng
    const token = localStorage.getItem('accessToken');
    const username = localStorage.getItem('username');
    
    if (!token || !username) {
        if (confirm('Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng. Đến trang đăng nhập ngay?')) {
            // Lưu sản phẩm hiện tại vào localStorage để có thể quay lại sau khi đăng nhập
            localStorage.setItem('pendingProduct', JSON.stringify({
                id: productData.id,
                quantity: parseInt(document.getElementById('quantity').value)
            }));
            
            // Chuyển hướng đến trang đăng nhập
            window.location.href = "/templates/auth/login.html";
        }
        return;
    }
    
    const quantity = parseInt(document.getElementById('quantity').value);
    if (!productData || Object.keys(productData).length === 0) {
        alert("Sản phẩm không tồn tại!");
        return;
    }
    
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let existingProduct = cart.find(item => item.id === productData.id);
    
    const cartItem = {
        id: productData.id,
        name: productData.name,
        price: productData.price,
        imageUrl: productData.imageUrl,
        discount: productData.discount,
        brand: productData.brand,
        description: productData.description,
        stockQuantity: productData.quantity,
        quantity: quantity
    };

    if (existingProduct) {
        existingProduct.quantity += quantity;
    } else {
        cart.push(cartItem);
    }
    
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    alert("Sản phẩm đã được thêm vào giỏ hàng! 🛒");
}

async function getReviewsByProductId(productId, page = 0, size = 5) {
    try {
        const response = await fetch(`${BASE_API_URL}/reviews/product/${productId}?page=${page}&size=${size}&sortBy=id`);
        if (!response.ok) {
            throw new Error('Không thể tải đánh giá');
        }
        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error('Error fetching reviews:', error);
        return null;
    }
}

async function renderReviews(page = 0) {
    try {
        const reviewData = await getReviewsByProductId(productData.id, page);
        if (!reviewData) {
            document.getElementById('reviews-container').innerHTML = '<p>Chưa có đánh giá nào.</p>';
            return;
        }

        const { content, totalPages, number } = reviewData;

        let reviewsHTML = '';
        content.forEach(review => {
            const reviewDate = new Date(review.createdAt).toLocaleDateString('vi-VN');
            reviewsHTML += `
                <div class="card review-card">
                    <div class="card-body">
                        <div class="d-flex justify-content-between">
                            <h5 class="card-title">Khách hàng</h5>
                            <small class="text-muted">${reviewDate}</small>
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
        if (totalPages > 1) {
            paginationHTML += `
                <li class="page-item ${number === 0 ? 'disabled' : ''}">
                    <a class="page-link" onclick="renderReviews(${number - 1})" ${number === 0 ? 'tabindex="-1"' : ''}>Trước</a>
                </li>
            `;

            for (let i = 0; i < totalPages; i++) {
                paginationHTML += `
                    <li class="page-item ${i === number ? 'active' : ''}">
                        <a class="page-link" onclick="renderReviews(${i})">${i + 1}</a>
                    </li>
                `;
            }

            paginationHTML += `
                <li class="page-item ${number === totalPages - 1 ? 'disabled' : ''}">
                    <a class="page-link" onclick="renderReviews(${number + 1})" ${number === totalPages - 1 ? 'tabindex="-1"' : ''}>Sau</a>
                </li>
            `;
        }

        document.getElementById('reviews-container').innerHTML = reviewsHTML;
        document.getElementById('pagination').innerHTML = paginationHTML;
    } catch (error) {
        console.error('Error rendering reviews:', error);
        document.getElementById('reviews-container').innerHTML = '<p>Có lỗi xảy ra khi tải đánh giá.</p>';
    }
}

async function initializeProductDetails() {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get("id");

    if (!productId) {
        console.error("Invalid product ID:", productId);
        alert("Không tìm thấy sản phẩm!");
        window.location.href = "/templates/landingpage/landingpage.html";
        return;
    }

    try {
        productData = await getProductById(productId);
        if (!productData) {
            alert("Không tìm thấy sản phẩm!");
            window.location.href = "/templates/landingpage/landingpage.html";
            return;
        }
        
        await renderProductDetails();
        await renderReviews();
    } catch (error) {
        console.error('Error:', error);
        alert("Có lỗi xảy ra khi tải thông tin sản phẩm!");
    }
}

// Thêm chức năng kiểm tra sản phẩm đang chờ thêm vào giỏ hàng sau khi đăng nhập
function checkPendingProduct() {
    const pendingProduct = localStorage.getItem('pendingProduct');
    const token = localStorage.getItem('accessToken');
    const username = localStorage.getItem('username');
    
    if (pendingProduct && token && username) {
        const product = JSON.parse(pendingProduct);
        
        // Kiểm tra xem có phải đang ở trang chi tiết sản phẩm đó không
        const params = new URLSearchParams(window.location.search);
        const currentProductId = params.get("id");
        
        if (product.id === currentProductId) {
            // Cập nhật số lượng
            document.getElementById('quantity').value = product.quantity;
            
            // Xóa sản phẩm đang chờ
            localStorage.removeItem('pendingProduct');
            
            // Tự động thêm vào giỏ hàng sau 1 giây
            setTimeout(() => {
                if (confirm('Bạn muốn thêm sản phẩm này vào giỏ hàng?')) {
                    addToCart(productData);
                }
            }, 1000);
        }
    }
}

document.addEventListener("DOMContentLoaded", function () {
    initializeProductDetails().then(() => {
        // Kiểm tra sản phẩm đang chờ sau khi tải trang
        checkPendingProduct();
    });
    
    document.addEventListener("click", function (event) {
        if (event.target.classList.contains("add-to-cart-btn")) {
            addToCart(productData);  
        }
    });
});

function formatPrice(price) {
    return new Intl.NumberFormat('vi-VN').format(price);
}

const style = document.createElement('style');
style.textContent = `
    .product-image {
        max-width: 100%;
        height: auto;
        object-fit: contain;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    .product-description {
        background-color: #f8f9fa;
        padding: 15px;
        border-radius: 8px;
        margin-top: 20px;
    }
    
    .product-description h4 {
        font-size: 18px;
        margin-bottom: 10px;
        color: #333;
    }
    
    .product-description p {
        font-size: 14px;
        line-height: 1.6;
        margin-bottom: 0;
    }
`;
document.head.appendChild(style);
