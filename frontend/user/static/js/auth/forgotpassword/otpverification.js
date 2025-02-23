const form = document.getElementById('otpForm');
const otpInput = document.getElementById('otp');
const submitButton = document.getElementById('submitButton');
const timerDisplay = document.getElementById('timer');
let isSubmitting = false;

// Timer functionality
let timeLeft = 5 * 60; // 5 minutes in seconds

function updateTimer() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    
    if (timeLeft <= 0) {
        clearInterval(timerInterval);
        submitButton.disabled = true;
        alert('Mã OTP đã hết hạn. Vui lòng yêu cầu mã mới.');
    }
    timeLeft--;
}

const timerInterval = setInterval(updateTimer, 1000);

// OTP input formatting and validation
otpInput.addEventListener('input', function(e) {
    // Remove non-digit characters
    this.value = this.value.replace(/\D/g, '');
    
    // Validate length
    if (this.value.length === 6) {
        this.setCustomValidity('');
    } else {
        this.setCustomValidity('Mã OTP phải có 6 chữ số');
    }
});

// Form submission
form.addEventListener('submit', async function(event) {
    event.preventDefault();
    
    // Remove any existing validation classes
    this.classList.remove('was-validated');
    
    // Validate OTP
    if (!otpInput.value || otpInput.value.length !== 6 || !/^\d+$/.test(otpInput.value)) {
        otpInput.setCustomValidity('Mã OTP không hợp lệ');
        this.classList.add('was-validated');
        return;
    }
    
    // Check if OTP has expired
    if (timeLeft <= 0) {
        alert('Mã OTP đã hết hạn. Vui lòng yêu cầu mã mới.');
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
        alert('Xác nhận OTP thành công!');
        
        // Optional: Redirect to reset password page
        // window.location.href = '/reset-password';
    } catch (error) {
        alert('Có lỗi xảy ra. Vui lòng thử lại sau!');
    } finally {
        isSubmitting = false;
        submitButton.disabled = false;
    }
});

// Cleanup timer on page unload
window.addEventListener('unload', function() {
    clearInterval(timerInterval);
});