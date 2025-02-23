const form = document.getElementById('forgotPasswordForm');
const emailInput = document.getElementById('email');
const submitButton = document.getElementById('submitButton');
let isSubmitting = false;

form.addEventListener('submit', async function(event) {
    event.preventDefault();
    
    // Remove any existing validation classes
    this.classList.remove('was-validated');
    
    // Email validation
    if (!emailInput.value || !emailInput.value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        emailInput.setCustomValidity('Email không hợp lệ');
        this.classList.add('was-validated');
        return;
    }
    
    // Prevent double submission
    if (isSubmitting) return;
    isSubmitting = true;
    submitButton.disabled = true;
    
    try {
        // Here you would typically send the request to your server
        // Simulating API call with setTimeout
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // For demo purposes, show success message
        alert('Mã OTP đã được gửi đến email của bạn!');
        
        // Optional: Redirect to OTP verification page
        // window.location.href = '/verify-otp';
    } catch (error) {
        alert('Có lỗi xảy ra. Vui lòng thử lại sau!');
    } finally {
        isSubmitting = false;
        submitButton.disabled = false;
    }
});

// Real-time email validation
emailInput.addEventListener('input', function() {
    if (this.value && this.value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        this.setCustomValidity('');
    } else {
        this.setCustomValidity('Email không hợp lệ');
    }
});

fetch('../../../templates/component/header.html') 
    .then(response => response.text())
    .then(data => {
      document.getElementById('header-container').innerHTML = data;
});

fetch('../../../templates/component/footer.html') 
    .then(response => response.text())
    .then(data => {
      if (document.getElementById('footer-container')!=null){
        document.getElementById('footer-container').innerHTML = data;
      }
});