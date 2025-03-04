document.getElementById('registerForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    this.classList.remove('was-validated');
    
    const firstName = document.getElementById('firstName');
    const lastName = document.getElementById('lastName');
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    
    let isValid = true;
    
    if (!firstName.value.trim()) {
        isValid = false;
        firstName.setCustomValidity('Tên không được để trống');
    } else {
        firstName.setCustomValidity('');
    }
    
    if (!lastName.value.trim()) {
        isValid = false;
        lastName.setCustomValidity('Họ và tên đệm không được để trống');
    } else {
        lastName.setCustomValidity('');
    }
    
    if (!email.value || !email.value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        isValid = false;
        email.setCustomValidity('Email không hợp lệ');
    } else {
        email.setCustomValidity('');
    }
    
    if (!password.value || password.value.length < 6) {
        isValid = false;
        password.setCustomValidity('Mật khẩu phải có ít nhất 6 ký tự');
    } else {
        password.setCustomValidity('');
    }
    
    this.classList.add('was-validated');
    
    if (isValid) {
        console.log('Form submitted', {
            firstName: firstName.value,
            lastName: lastName.value,
            email: email.value,
            password: password.value
        });
        
        alert('Đăng ký thành công!');
    }
});