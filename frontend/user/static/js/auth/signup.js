document.getElementById('registerForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    
    this.classList.remove('was-validated');
    
    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    const phone = document.getElementById('phone');
    const address = document.getElementById('address');
    
    let isValid = true;
    
    // Validate name
    if (!name.value.trim()) {
        isValid = false;
        name.setCustomValidity('Họ tên không được để trống');
    } else {
        name.setCustomValidity('');
    }
    
    // Validate email
    if (!email.value || !email.value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        isValid = false;
        email.setCustomValidity('Email không hợp lệ');
    } else {
        email.setCustomValidity('');
    }
    
    // Validate password
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    if (!password.value || !passwordRegex.test(password.value)) {
        isValid = false;
        password.setCustomValidity('Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ, số và ký tự đặc biệt');
    } else {
        password.setCustomValidity('');
    }

    // Validate phone
    const phoneRegex = /^(0|\+84)[3|5|7|8|9][0-9]{8}$/;
    if (!phone.value || !phoneRegex.test(phone.value)) {
        isValid = false;
        phone.setCustomValidity('Số điện thoại không hợp lệ (VD: 0912345678)');
    } else {
        phone.setCustomValidity('');
    }

    // Validate address
    if (!address.value.trim()) {
        isValid = false;
        address.setCustomValidity('Địa chỉ không được để trống');
    } else {
        address.setCustomValidity('');
    }
    
    this.classList.add('was-validated');
    
    if (isValid) {
        try {
            const registerData = {
                name: name.value.trim(),
                username: email.value.trim(), // Đặt username bằng email
                email: email.value.trim(),
                password: password.value,
                address: address.value.trim(),
                phone: phone.value.trim()
            };

            const response = await fetch(`${BASE_API_URL}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(registerData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Đăng ký thất bại');
            }

            alert('Đăng ký thành công! Vui lòng đăng nhập.');
            window.location.href = '/templates/auth/login.html';

        } catch (error) {
            console.error('Error:', error);
            alert(error.message || 'Có lỗi xảy ra khi đăng ký. Vui lòng thử lại.');
        }
    }
});