async function renderCart() {
    const token = localStorage.getItem('accessToken');
    const username = localStorage.getItem('username');
    let cartBody = document.getElementById("cart-body");

    if (!token || !username) {
        cartBody.innerHTML = "<tr><td colspan='7'>Bạn cần đăng nhập để xem giỏ hàng!</td></tr>";
        return;
    }

    try {
        const response = await fetch(`${BASE_API_URL}/user/${username}/carts/get-cart`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Không thể tải giỏ hàng');
        }

        const data = await response.json();
        const cartItems = data.data.cartItems || [];
        console.log(cartItems);

        cartBody.innerHTML = "";
        if (cartItems.length === 0) {
            cartBody.innerHTML = "<tr><td colspan='7'>Giỏ hàng của bạn đang trống! 😢</td></tr>";
            return;
        }

        cartItems.forEach((item, index) => {
            const discountPrice = item.price * (100 - item.discount) / 100;
            const totalPrice = discountPrice * item.quantity;
            
            let row = document.createElement("tr");
            row.innerHTML = `
                <td>
                    <img src="${item.imageUrl}" alt="${item.name}" 
                         style="max-width: 100px; max-height: 100px; object-fit: contain;">
                </td>
                <td>
                    <div class="product-info">
                        <div class="product-name">${item.name}</div>
                    </div>
                </td>
                <td>
                    <div class="price-info">
                        ${formatPrice(item.price)} đ
                    </div>
                </td>
                <td class="text-center">
                    ${item.discount}%
                </td>
                <td class="text-center">
                    <input type="number" value="${item.quantity}" min="1" max="${item.stockQuantity}"
                           class="form-control quantity" data-index="${index}" 
                           style="width: 60px; text-align: center; margin: 0 auto;">
                    ${item.stockQuantity < 5 ? 
                        `<div class="stock-warning text-danger small">Chỉ còn ${item.stockQuantity} sản phẩm</div>` 
                        : ''}
                </td>
                <td>${formatPrice(totalPrice)} đ</td>
                <td>
                    <button class="btn btn-danger btn-sm delete" data-index="${index}">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            cartBody.appendChild(row);
        });

        updateTotal(cartItems);
        attachEventListeners(cartItems);
    } catch (error) {
        console.error('Error fetching cart:', error);
        cartBody.innerHTML = "<tr><td colspan='7'>Có lỗi xảy ra khi tải giỏ hàng!</td></tr>";
    }
}

function attachEventListeners(cartItems) {
    document.querySelectorAll(".quantity").forEach(input => {
        input.addEventListener("change", async function () {
            let index = this.getAttribute("data-index");
            cartItems[index].quantity = parseInt(this.value);

            // Gọi API để cập nhật giỏ hàng
            await updateCartItem(cartItems[index]);
            renderCart();
            updateCartCount();
        });
    });

    document.querySelectorAll(".delete").forEach(button => {
        button.addEventListener("click", async function () {
            let index = this.getAttribute("data-index");
            const productToRemove = cartItems[index];

            // Gọi API để xóa sản phẩm khỏi giỏ hàng
            await removeProductFromCart(productToRemove);
            renderCart();
            updateCartCount();
        });
    });

    document.getElementById("checkout-btn").addEventListener("click", function () {
        if (cartItems.length === 0) {
            alert("Giỏ hàng trống, vui lòng thêm sản phẩm trước khi thanh toán!");
            return;
        }
        window.location.href = "../payment/checkout.html";
    });

    document.querySelectorAll(".decrease-qty").forEach(button => {
        button.addEventListener("click", function() {
            const index = this.getAttribute("data-index");
            const input = document.querySelector(`.quantity[data-index="${index}"]`);
            if (input.value > 1) {
                input.value = parseInt(input.value) - 1;
                input.dispatchEvent(new Event('change'));
            }
        });
    });

    document.querySelectorAll(".increase-qty").forEach(button => {
        button.addEventListener("click", function() {
            const index = this.getAttribute("data-index");
            const input = document.querySelector(`.quantity[data-index="${index}"]`);
            const cart = JSON.parse(localStorage.getItem("cart")) || [];
            if (parseInt(input.value) < cart[index].stockQuantity) {
                input.value = parseInt(input.value) + 1;
                input.dispatchEvent(new Event('change'));
            }
        });
    });
}

// Hàm gọi API để cập nhật số lượng sản phẩm trong giỏ hàng
async function updateCartItem(cartItem) {
    const token = localStorage.getItem('accessToken');
    const username = localStorage.getItem('username');

    try {
        const response = await fetch(`${BASE_API_URL}/user/${username}/carts/update`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                cartItems: [cartItem]
            })
        });

        if (!response.ok) {
            throw new Error('Không thể cập nhật giỏ hàng');
        }
    } catch (error) {
        console.error('Error updating cart:', error);
        alert('Có lỗi xảy ra khi cập nhật giỏ hàng');
    }
}

// Hàm gọi API để xóa sản phẩm khỏi giỏ hàng
async function removeProductFromCart(product) {
    const token = localStorage.getItem('accessToken');
    const username = localStorage.getItem('username');

    try {
        const response = await fetch(`${BASE_API_URL}/user/${username}/carts/remove-products`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                id: product.id
            })
        });

        if (!response.ok) {
            throw new Error('Không thể xóa sản phẩm khỏi giỏ hàng');
        }
    } catch (error) {
        console.error('Error removing product from cart:', error);
        alert('Có lỗi xảy ra khi xóa sản phẩm khỏi giỏ hàng');
    }
}

function updateTotal(cartItems) {
    // Tính tổng tiền gốc và tổng tiền sau giảm giá
    let originalTotal = 0;
    let finalTotal = 0;
    
    cartItems.forEach(item => {
        const originalItemTotal = item.price * item.quantity;
        const discountPrice = item.price * (100 - item.discount) / 100;
        const discountedItemTotal = discountPrice * item.quantity;
        
        originalTotal += originalItemTotal;
        finalTotal += discountedItemTotal;
    });

    // Hiển thị tạm tính (tổng tiền gốc)
    document.getElementById("subtotal").innerText = formatPrice(originalTotal) + " đ";
    
    // Hiển thị tổng số tiền (sau khi áp dụng giảm giá)
    document.getElementById("total").innerText = formatPrice(finalTotal) + " đ";
}

function formatPrice(price) {
    return new Intl.NumberFormat('vi-VN').format(price);
}

document.addEventListener("DOMContentLoaded", () => {
    renderCart();
});

fetch('../component/header.html') 
    .then(response => response.text())
    .then(data => {
      document.getElementById('header-container').innerHTML = data;
});

fetch('../component/footer.html') 
    .then(response => response.text())
    .then(data => {
      if (document.getElementById('footer-container')!=null){
        document.getElementById('footer-container').innerHTML = data;
      }
});