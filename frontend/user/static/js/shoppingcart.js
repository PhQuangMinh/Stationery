function renderCart() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let cartBody = document.getElementById("cart-body");

    cartBody.innerHTML = "";
    if (cart.length === 0) {
        cartBody.innerHTML = "<tr><td colspan='7'>Giỏ hàng của bạn đang trống! 😢</td></tr>";
        return;
    }

    cart.forEach((item, index) => {
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
                    <div class="product-brand text-muted small">Thương hiệu: ${item.brand}</div>
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

    updateTotal();
    attachEventListeners();
}

function attachEventListeners() {
    document.querySelectorAll(".quantity").forEach(input => {
        input.addEventListener("change", function () {
            let index = this.getAttribute("data-index");
            let cart = JSON.parse(localStorage.getItem("cart")) || [];
            cart[index].quantity = parseInt(this.value);
            localStorage.setItem("cart", JSON.stringify(cart));
            renderCart();
            updateCartCount();
        });
    });

    document.querySelectorAll(".delete").forEach(button => {
        button.addEventListener("click", function () {
            let index = this.getAttribute("data-index");
            let cart = JSON.parse(localStorage.getItem("cart")) || [];
            cart.splice(index, 1);
            localStorage.setItem("cart", JSON.stringify(cart));
            renderCart();
            updateCartCount();
        });
    });

    document.getElementById("checkout-btn").addEventListener("click", function () {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        if (cart.length === 0) {
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

function updateTotal() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    
    // Tính tổng tiền gốc và tổng tiền sau giảm giá
    let originalTotal = 0;
    let finalTotal = 0;
    
    cart.forEach(item => {
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

document.addEventListener("DOMContentLoaded", () =>{
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