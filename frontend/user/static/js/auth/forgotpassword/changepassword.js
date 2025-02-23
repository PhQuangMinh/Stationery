const form = document.getElementById('changePasswordForm');
const currentPasswordInput = document.getElementById('currentPassword');
const newPasswordInput = document.getElementById('newPassword');
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

// New password input validation
newPasswordInput.addEventListener('input', function() {
    // Check if new password is same as current password
    if (this.value === currentPasswordInput.value) {
        this.setCustomValidity('Mật khẩu mới phải khác mật khẩu hiện tại');
    } else {
        this.setCustomValidity('');
        checkPasswordStrength(this.value);
    }
    
    if (confirmPasswordInput.value) {
        validatePasswordMatch();
    }
});

// Confirm password validation
function validatePasswordMatch() {
    if (confirmPasswordInput.value !== newPasswordInput.value) {
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
    
    // Basic validation
    if (!currentPasswordInput.value) {
        currentPasswordInput.setCustomValidity('Vui lòng nhập mật khẩu hiện tại');
        this.classList.add('was-validated');
        return;
    }
    
    // Validate password strength and match
    const isStrongPassword = checkPasswordStrength(newPasswordInput.value);
    const isMatchingPassword = validatePasswordMatch();
    
    if (!isStrongPassword || !isMatchingPassword) {
        this.classList.add('was-validated');
        return;
    }
    
    // Check if new password is different from current
    if (newPasswordInput.value === currentPasswordInput.value) {
        newPasswordInput.setCustomValidity('Mật khẩu mới phải khác mật khẩu hiện tại');
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
        alert('Mật khẩu đã được thay đổi thành công!');
        
        // Optional: Redirect to profile page or sidebar
        // window.location.href = '/profile';
    } catch (error) {
        alert('Có lỗi xảy ra. Vui lòng thử lại sau!');
    } finally {
        isSubmitting = false;
        submitButton.disabled = false;
    }
});