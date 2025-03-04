const form = document.getElementById('forgotPasswordForm');
const emailInput = document.getElementById('email');
const submitButton = document.getElementById('submitButton');
let isSubmitting = false;

form.addEventListener('submit', async function(event) {
    event.preventDefault();

    this.classList.remove('was-validated');
    
    if (!emailInput.value || !emailInput.value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        emailInput.setCustomValidity('Email không hợp lệ');
        this.classList.add('was-validated');
        return;
    }
    
    if (isSubmitting) return;
    isSubmitting = true;
    submitButton.disabled = true;
    
    try {
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        alert('Mã OTP đã được gửi đến email của bạn!');
        
        window.location.href = '/verify-otp';
    } catch (error) {
        alert('Có lỗi xảy ra. Vui lòng thử lại sau!');
    } finally {
        isSubmitting = false;
        submitButton.disabled = false;
    }
});
    
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