let cart = JSON.parse(localStorage.getItem("cart")) || [];
function formatPrice(price) {
    return new Intl.NumberFormat('vi-VN').format(price) + ' đ';
}

function calculateTotal() {
    const subtotal = cart.reduce((sum, item) => {
        const discountPrice = item.price * (100 - item.discount) / 100;
        return sum + (discountPrice * item.quantity);
    }, 0);
    
    document.getElementById('subtotal').textContent = formatPrice(subtotal);
    document.getElementById('total').textContent = formatPrice(subtotal);
    document.getElementById('totalItems').textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
}

function renderCart() {
    const orderItems = document.getElementById('orderItems');
    orderItems.innerHTML = cart.map(item => `
        <div class="order-item mb-3 border-bottom pb-3">
            <div class="d-flex">
                <img src="${item.imageUrl}" alt="${item.name}" class="product-img">
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

function updateQuantityDirect(id, newQuantity) {
    const item = cart.find(item => item.id === id);
    if (item && newQuantity > 0) {
        item.quantity = parseInt(newQuantity);
        renderCart();
    }
}

function removeItem(id) {
    cart = cart.filter(item => item.id !== id);
    renderCart();
}

document.querySelectorAll('.payment-option').forEach(option => {
    option.addEventListener('click', function() {
        document.querySelectorAll('.payment-option').forEach(opt => {
            opt.classList.remove('selected');
        });
        this.classList.add('selected');
        this.querySelector('input[type="radio"]').checked = true;
    });
});

const PROVINCE_API = 'https://provinces.open-api.vn/api/';

// Cập nhật constants cho trạng thái đơn hàng sang tiếng Việt
const ORDER_STATUSES = {
    COD: {
        CASH_ON_DELIVERY: 'Chờ xác nhận',
        PROCESSING: 'Đang xử lý',
        SHIPPED: 'Đang giao hàng',
        COMPLETED: 'Đã hoàn thành',
        CANCELED: 'Đã hủy'
    },
    VNPAY: {
        PENDING: 'Chờ thanh toán',
        PAID: 'Đã thanh toán',
        PROCESSING: 'Đang xử lý',
        SHIPPED: 'Đang giao hàng',
        COMPLETED: 'Đã hoàn thành',
        FAILED: 'Thanh toán thất bại',
        CANCELED: 'Đã hủy'
    }
};

// Thêm hằng số cho phương thức thanh toán
const PAYMENT_METHODS = {
    COD: 'Thanh toán khi nhận hàng',
    VNPAY: 'Thanh toán qua VNPAY'
};

// Hàm lấy danh sách tỉnh/thành phố
async function loadProvinces() {
    try {
        const response = await fetch(PROVINCE_API + 'p/');
        const provinces = await response.json();
        const provinceSelect = document.getElementById('province');
        
        provinces.forEach(province => {
            const option = document.createElement('option');
            option.value = province.code;
            option.textContent = province.name;
            provinceSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading provinces:', error);
    }
}

// Hàm lấy danh sách quận/huyện theo tỉnh
async function loadDistricts(provinceCode) {
    try {
        const response = await fetch(PROVINCE_API + `p/${provinceCode}?depth=2`);
        const data = await response.json();
        const districtSelect = document.getElementById('district');
        const wardSelect = document.getElementById('ward');
        
        // Reset quận/huyện và phường/xã
        districtSelect.innerHTML = '<option value="">Chọn Quận/Huyện</option>';
        wardSelect.innerHTML = '<option value="">Chọn Phường/Xã</option>';
        
        // Enable quận/huyện, disable phường/xã
        districtSelect.disabled = false;
        wardSelect.disabled = true;
        
        data.districts.forEach(district => {
            const option = document.createElement('option');
            option.value = district.code;
            option.textContent = district.name;
            districtSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading districts:', error);
    }
}

// Hàm lấy danh sách phường/xã theo quận/huyện
async function loadWards(districtCode) {
    try {
        const response = await fetch(PROVINCE_API + `d/${districtCode}?depth=2`);
        const data = await response.json();
        const wardSelect = document.getElementById('ward');
        
        // Reset phường/xã
        wardSelect.innerHTML = '<option value="">Chọn Phường/Xã</option>';
        
        // Enable phường/xã
        wardSelect.disabled = false;
        
        data.wards.forEach(ward => {
            const option = document.createElement('option');
            option.value = ward.code;
            option.textContent = ward.name;
            wardSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading wards:', error);
    }
}

// Thêm event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Load danh sách tỉnh/thành phố khi trang được tải
    loadProvinces();
    
    // Xử lý sự kiện thay đổi tỉnh/thành phố
    document.getElementById('province').addEventListener('change', function() {
        const provinceCode = this.value;
        if (provinceCode) {
            loadDistricts(provinceCode);
        } else {
            document.getElementById('district').innerHTML = '<option value="">Chọn Quận/Huyện</option>';
            document.getElementById('ward').innerHTML = '<option value="">Chọn Phường/Xã</option>';
            document.getElementById('district').disabled = true;
            document.getElementById('ward').disabled = true;
        }
    });
    
    // Xử lý sự kiện thay đổi quận/huyện
    document.getElementById('district').addEventListener('change', function() {
        const districtCode = this.value;
        if (districtCode) {
            loadWards(districtCode);
        } else {
            document.getElementById('ward').innerHTML = '<option value="">Chọn Phường/Xã</option>';
            document.getElementById('ward').disabled = true;
        }
    });

    // Kiểm tra nếu có callback từ VNPAY
    const urlParams = new URLSearchParams(window.location.search);
    console.log(urlParams);
    if (urlParams.has('vnp_ResponseCode')) {
        console.log("checkVNPayPayment");
        checkVNPayPayment();
    }
});

// Thêm event listener mới cho nút đặt hàng
document.querySelector('.btn-danger[type="submit"]').addEventListener('click', async function(e) {
    e.preventDefault();
    
    const province = document.getElementById('province');
    const district = document.getElementById('district');
    const ward = document.getElementById('ward');
    const specificAddress = document.getElementById('specificAddress');
    
    if (!province.value || !district.value || !ward.value || !specificAddress.value.trim()) {
        alert('Vui lòng nhập đầy đủ thông tin địa chỉ');
        return;
    }
    
    const provinceText = province.options[province.selectedIndex].text;
    const districtText = district.options[district.selectedIndex].text;
    const wardText = ward.options[ward.selectedIndex].text;
    const fullAddress = `${specificAddress.value}, ${wardText}, ${districtText}, ${provinceText}`;
    
    const form = document.getElementById('checkoutForm');
    const formData = new FormData(form);
    const total = cart.reduce((sum, item) => {
        const discountPrice = item.price * (100 - item.discount) / 100;
        return sum + (discountPrice * item.quantity);
    }, 0);
    
    const paymentMethod = document.getElementById('paymentMethod').value;
    const initialStatus = paymentMethod === 'VNPAY' ? 'PENDING' : 'CASH_ON_DELIVERY';
    
    // Chuẩn bị dữ liệu đơn hàng
    const orderRequest = {
        orderDate: new Date().toISOString(),
        totalAmount: total,
        status: initialStatus,
        shippingAddress: fullAddress,
        paymentMethod: paymentMethod,
        orderItemRequests: cart.map(item => ({
            quantity: item.quantity,
            productId: item.id.toString()
        }))
    };

    try {
        // Lưu đơn hàng vào database
        const username = localStorage.getItem('username');
        const orderResponse = await fetch(`${BASE_API_URL}/user/orders/${username}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            },
            body: JSON.stringify(orderRequest)
        });

        if (!orderResponse.ok) {
            throw new Error('Không thể tạo đơn hàng');
        }

        const orderResult = await orderResponse.json();

        // Xử lý theo phương thức thanh toán
        if (paymentMethod === 'VNPAY') {
            // Gọi API VNPAY
            const vnpayResponse = await fetch(`${BASE_API_URL}/api/v1/payment/vn-pay?amount=${total}&bankCode=NCB&txnRef=${orderResult.data.txnRef}`);
            const vnpayData = await vnpayResponse.json();
            
            if (vnpayData.data && vnpayData.data.paymentUrl) {
                // Lưu ID đơn hàng vào localStorage
                localStorage.setItem('pendingOrderId', orderResult.data.id);
                
                // Xóa giỏ hàng
                localStorage.removeItem('cart');
                cart = [];
                
                // Chuyển hướng đến trang thanh toán VNPAY
                window.location.href = vnpayData.data.paymentUrl;
            } else {
                throw new Error('Không thể khởi tạo thanh toán VNPAY');
            }
        } else {
            // Thanh toán COD
            alert(`Đơn hàng đã được đặt thành công!\nPhương thức thanh toán: ${PAYMENT_METHODS.COD}\nTrạng thái: ${ORDER_STATUSES.COD.CASH_ON_DELIVERY}`);
            localStorage.removeItem('cart');
            cart = [];
            renderCart();
            window.location.href = '/templates/order/userorder.html';
        }
    } catch (error) {
        console.error('Lỗi:', error);
        alert('Có lỗi xảy ra: ' + error.message);
    }
});

// Cập nhật hàm kiểm tra kết quả thanh toán VNPAY
async function checkVNPayPayment() {
    const urlParams = new URLSearchParams(window.location.search);
    const responseCode = urlParams.get('vnp_ResponseCode');
    const transactionStatus = urlParams.get('vnp_TransactionStatus');
    const orderId = urlParams.get('vnp_TxnRef');

    if (responseCode) {
        try {
            // Gọi API callback để xử lý kết quả thanh toán
            const response = await fetch(`${BASE_API_URL}/api/v1/payment/vn-pay-callback${window.location.search}`);
            const result = await response.json();

            if (responseCode === '00' && transactionStatus === '00' && result.message === 'success') {
                alert('Thanh toán thành công! Đơn hàng của bạn đang được xử lý.');
                localStorage.removeItem('cart'); // Xóa giỏ hàng sau khi thanh toán thành công
            } else {
                alert('Thanh toán không thành công! Vui lòng thử lại sau.');
            }

            // Chuyển hướng về trang đơn hàng trong mọi trường hợp
            window.location.href = '/templates/order/userorder.html';
        } catch (error) {
            console.error('Lỗi khi kiểm tra thanh toán:', error);
            alert('Có lỗi xảy ra khi kiểm tra thanh toán!');
            window.location.href = '/templates/order/userorder.html';
        }
    }
}

renderCart();