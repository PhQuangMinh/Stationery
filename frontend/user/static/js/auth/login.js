document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    // Remove any existing validation classes
    this.classList.remove('was-validated');
    
    // Get form fields
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    
    // Basic validation
    let isValid = true;
    
    // Email validation
    if (!email.value || !email.value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        isValid = false;
        email.setCustomValidity('Email không hợp lệ');
    } else {
        email.setCustomValidity('');
    }
    
    // Password validation
    if (!password.value) {
        isValid = false;
        password.setCustomValidity('Mật khẩu không được để trống');
    } else {
        password.setCustomValidity('');
    }
    
    // Add validation classes
    this.classList.add('was-validated');
    
    // If form is valid, submit it
    if (isValid) {
        // Here you would typically send the data to your server
        console.log('Form submitted', {
            email: email.value,
            password: password.value
        });
        
        // For demo purposes, show success message
        alert('Đăng nhập thành công!');
    }
});