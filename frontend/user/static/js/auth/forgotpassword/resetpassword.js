const form = document.getElementById('resetPasswordForm');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirmPassword');
const submitButton = document.getElementById('submitButton');
const passwordStrength = document.getElementById('passwordStrength');
let isSubmitting = false;

// Password strength checker
function checkPasswordStrength(password) {
    const hasLower = /[a-z]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const length = password.length;

    if (length < 8) {
        passwordStrength.textContent = 'Mật khẩu yếu - cần ít nhất 8 ký tự';
        passwordStrength.className = 'password-strength weak';
        return false;
    }

    const strength = [hasLower, hasUpper, hasNumber, hasSpecial].filter(Boolean).length;

    if (strength <= 2) {
        passwordStrength.textContent = 'Mật khẩu yếu - thêm chữ hoa, số hoặc ký tự đặc biệt';
        passwordStrength.className = 'password-strength weak';
    } else if (strength === 3) {
        passwordStrength.textContent = 'Mật khẩu trung bình';
        passwordStrength.className = 'password-strength medium';
    } else {
        passwordStrength.textContent = 'Mật khẩu mạnh';
        passwordStrength.className = 'password-strength strong';
    }

    return strength >= 3;
}

// Password input validation
passwordInput.addEventListener('input', function() {
    checkPasswordStrength(this.value);
    if (confirmPasswordInput.value) {
        validatePasswordMatch();
    }
});

// Confirm password validation
function validatePasswordMatch() {
    if (confirmPasswordInput.value !== passwordInput.value) {
        confirmPasswordInput.setCustomValidity('Mật khẩu xác nhận không khớp');
        return false;
    } else {
        confirmPasswordInput.setCustomValidity('');
        return true;
    }
}

confirmPasswordInput.addEventListener('input', validatePasswordMatch);

// Form submission
form.addEventListener('submit', async function(event) {
    event.preventDefault();
    
    // Remove any existing validation classes
    this.classList.remove('was-validated');
    
    // Validate password strength and match
    const isStrongPassword = checkPasswordStrength(passwordInput.value);
    const isMatchingPassword = validatePasswordMatch();
    
    if (!isStrongPassword || !isMatchingPassword) {
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
        alert('Mật khẩu đã được đặt lại thành công!');
        
        // Optional: Redirect to login page
        // window.location.href = '/login';
    } catch (error) {
        alert('Có lỗi xảy ra. Vui lòng thử lại sau!');
    } finally {
        isSubmitting = false;
        submitButton.disabled = false;
    }
});

