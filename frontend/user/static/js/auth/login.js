document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    this.classList.remove('was-validated');
    
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    
    let isValid = true;
    
    if (!email.value || !email.value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        isValid = false;
        email.setCustomValidity('Email không hợp lệ');
    } else {
        email.setCustomValidity('');
    }
    
    if (!password.value) {
        isValid = false;
        password.setCustomValidity('Mật khẩu không được để trống');
    } else {
        password.setCustomValidity('');
    }
    
    this.classList.add('was-validated');
    
    if (isValid) {
        console.log('Form submitted', {
            email: email.value,
            password: password.value
        });
        
        alert('Đăng nhập thành công!');
    }
});