document.getElementById('registerForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    // Remove any existing validation classes
    this.classList.remove('was-validated');
    
    // Get form fields
    const firstName = document.getElementById('firstName');
    const lastName = document.getElementById('lastName');
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    
    // Basic validation
    let isValid = true;
    
    // First name validation
    if (!firstName.value.trim()) {
        isValid = false;
        firstName.setCustomValidity('Tên không được để trống');
    } else {
        firstName.setCustomValidity('');
    }
    
    // Last name validation
    if (!lastName.value.trim()) {
        isValid = false;
        lastName.setCustomValidity('Họ và tên đệm không được để trống');
    } else {
        lastName.setCustomValidity('');
    }
    
    // Email validation
    if (!email.value || !email.value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        isValid = false;
        email.setCustomValidity('Email không hợp lệ');
    } else {
        email.setCustomValidity('');
    }
    
    // Password validation
    if (!password.value || password.value.length < 6) {
        isValid = false;
        password.setCustomValidity('Mật khẩu phải có ít nhất 6 ký tự');
    } else {
        password.setCustomValidity('');
    }
    
    // Add validation classes
    this.classList.add('was-validated');
    
    // If form is valid, submit it
    if (isValid) {
        // Here you would typically send the data to your server
        console.log('Form submitted', {
            firstName: firstName.value,
            lastName: lastName.value,
            email: email.value,
            password: password.value
        });
        
        // For demo purposes, show success message
        alert('Đăng ký thành công!');
    }
});