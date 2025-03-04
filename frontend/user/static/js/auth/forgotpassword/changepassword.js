const form = document.getElementById('changePasswordForm');
const currentPasswordInput = document.getElementById('currentPassword');
const newPasswordInput = document.getElementById('newPassword');
const confirmPasswordInput = document.getElementById('confirmPassword');
const submitButton = document.getElementById('submitButton');
const passwordStrength = document.getElementById('passwordStrength');
let isSubmitting = false;

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

newPasswordInput.addEventListener('input', function() {
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

form.addEventListener('submit', async function(event) {
    event.preventDefault();
    
    this.classList.remove('was-validated');
    
    if (!currentPasswordInput.value) {
        currentPasswordInput.setCustomValidity('Vui lòng nhập mật khẩu hiện tại');
        this.classList.add('was-validated');
        return;
    }
    
    const isStrongPassword = checkPasswordStrength(newPasswordInput.value);
    const isMatchingPassword = validatePasswordMatch();
    
    if (!isStrongPassword || !isMatchingPassword) {
        this.classList.add('was-validated');
        return;
    }
    
    if (newPasswordInput.value === currentPasswordInput.value) {
        newPasswordInput.setCustomValidity('Mật khẩu mới phải khác mật khẩu hiện tại');
        this.classList.add('was-validated');
        return;
    }
    
    if (isSubmitting) return;
    isSubmitting = true;
    submitButton.disabled = true;
    
    try {
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        alert('Mật khẩu đã được thay đổi thành công!');
        
        window.location.href = '/profile';
    } catch (error) {
        alert('Có lỗi xảy ra. Vui lòng thử lại sau!');
    } finally {
        isSubmitting = false;
        submitButton.disabled = false;
    }
});