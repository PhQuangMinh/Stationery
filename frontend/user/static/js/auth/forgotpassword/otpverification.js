const form = document.getElementById('otpForm');
const otpInput = document.getElementById('otp');
const submitButton = document.getElementById('submitButton');
const timerDisplay = document.getElementById('timer');
let isSubmitting = false;

let timeLeft = 5 * 60; 

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

otpInput.addEventListener('input', function(e) {
    this.value = this.value.replace(/\D/g, '');
    
    if (this.value.length === 6) {
        this.setCustomValidity('');
    } else {
        this.setCustomValidity('Mã OTP phải có 6 chữ số');
    }
});

form.addEventListener('submit', async function(event) {
    event.preventDefault();
    
    this.classList.remove('was-validated');
    
    if (!otpInput.value || otpInput.value.length !== 6 || !/^\d+$/.test(otpInput.value)) {
        otpInput.setCustomValidity('Mã OTP không hợp lệ');
        this.classList.add('was-validated');
        return;
    }
    
    if (timeLeft <= 0) {
        alert('Mã OTP đã hết hạn. Vui lòng yêu cầu mã mới.');
        return;
    }
    
    if (isSubmitting) return;
    isSubmitting = true;
    submitButton.disabled = true;
    
    try {
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        alert('Xác nhận OTP thành công!');
        
        window.location.href = '/reset-password';
    } catch (error) {
        alert('Có lỗi xảy ra. Vui lòng thử lại sau!');
    } finally {
        isSubmitting = false;
        submitButton.disabled = false;
    }
});

window.addEventListener('unload', function() {
    clearInterval(timerInterval);
});