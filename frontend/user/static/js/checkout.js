let cart = JSON.parse(localStorage.getItem("cart")) || [];
// Format price to VND
function formatPrice(price) {
    return new Intl.NumberFormat('vi-VN').format(price) + ' đ';
}

// Calculate total price
function calculateTotal() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    document.getElementById('subtotal').textContent = formatPrice(subtotal);
    document.getElementById('total').textContent = formatPrice(subtotal);
    document.getElementById('totalItems').textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
}

// Render cart items
function renderCart() {
    const orderItems = document.getElementById('orderItems');
    orderItems.innerHTML = cart.map(item => `
        <div class="order-item mb-3 border-bottom pb-3">
            <div class="d-flex">
                <img src="${item.image}" alt="${item.name}" class="product-img">
                <div class="ms-3 flex-grow-1">
                    <h6>${item.name}</h6>
                    <div class="d-flex justify-content-between align-items-center">
                        <div class="quantity-controls">
                            <button class="btn btn-sm btn-outline-secondary" onclick="updateQuantity(${item.id}, -1)">-</button>
                            <input type="number" class="quantity-input mx-2" value="${item.quantity}" 
                                   onchange="updateQuantityDirect(${item.id}, this.value)">
                            <button class="btn btn-sm btn-outline-secondary" onclick="updateQuantity(${item.id}, 1)">+</button>
                        </div>
                        <span class="text-danger">${formatPrice(item.price * item.quantity)}</span>
                    </div>
                </div>
            </div>
            <button class="btn btn-sm btn-link text-danger" onclick="removeItem(${item.id})">Xóa</button>
        </div>
    `).join('');
    calculateTotal();
}

// Update quantity
function updateQuantity(id, change) {
    const item = cart.find(item => item.id === id);
    if (item) {
        const newQuantity = item.quantity + change;
        if (newQuantity > 0) {
            item.quantity = newQuantity;
            renderCart();
        }
    }
}

// Update quantity directly
function updateQuantityDirect(id, newQuantity) {
    const item = cart.find(item => item.id === id);
    if (item && newQuantity > 0) {
        item.quantity = parseInt(newQuantity);
        renderCart();
    }
}

// Remove item from cart
function removeItem(id) {
    cart = cart.filter(item => item.id !== id);
    renderCart();
}

// Handle payment method selection
document.querySelectorAll('.payment-option').forEach(option => {
    option.addEventListener('click', function() {
        document.querySelectorAll('.payment-option').forEach(opt => {
            opt.classList.remove('selected');
        });
        this.classList.add('selected');
        this.querySelector('input[type="radio"]').checked = true;
    });
});

// Handle form submission
document.getElementById('checkoutForm').addEventListener('submit', function(e) {
    e.preventDefault();
    // Add your form submission logic here
    const formData = new FormData(this);
    const orderData = {
        customerInfo: Object.fromEntries(formData),
        items: cart,
        total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    };
    console.log('Order Data:', orderData);
    alert('Đơn hàng đã được đặt thành công!');
});

// Initial render
renderCart();