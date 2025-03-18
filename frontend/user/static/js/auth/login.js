document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    
    this.classList.remove('was-validated');
    
    const username = document.getElementById('username');
    const password = document.getElementById('password');
    
    let isValid = true;
    
    if (!username.value.trim()) {
        isValid = false;
        username.setCustomValidity('Tên đăng nhập không được để trống');
    } else {
        username.setCustomValidity('');
    }
    
    if (!password.value) {
        isValid = false;
        password.setCustomValidity('Mật khẩu không được để trống');
    } else {
        password.setCustomValidity('');
    }
    
    this.classList.add('was-validated');
    
    if (isValid) {
        try {
            const loginData = {
                username: username.value.trim(),
                password: password.value
            };

            const response = await fetch(`${BASE_API_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(loginData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Đăng nhập thất bại');
            }

            // Xử lý response mới với cấu trúc accessToken, refreshToken, admin
            if (data.data) {
                // Lưu các token vào localStorage
                localStorage.setItem('accessToken', data.data.accessToken);
                localStorage.setItem('refreshToken', data.data.refreshToken);
                localStorage.setItem('username', loginData.username);
                localStorage.setItem('isAdmin', data.data.admin);
                
                // Luôn chuyển hướng đến trang chủ, không quan tâm vai trò
                window.location.href = '/templates/landingpage/landingpage.html';
            }
        } catch (error) {
            console.error('Error:', error);
            alert(error.message || 'Tên đăng nhập hoặc mật khẩu không đúng');
        }
    }
});

// Thêm hàm kiểm tra URL để xử lý callback từ Google
function handleGoogleCallback() {
    console.log('handleGoogleCallback');
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const username = urlParams.get('username');
    const isAdmin = urlParams.get('isAdmin');
    
    if (token && username) {
        // Lưu thông tin đăng nhập
        localStorage.setItem('accessToken', token);
        localStorage.setItem('username', username);
        
        // Lưu trạng thái admin nếu có
        if (isAdmin) {
            localStorage.setItem('isAdmin', isAdmin);
        }
        
        // Luôn chuyển hướng đến trang chủ, không quan tâm vai trò
        window.location.href = '/templates/landingpage/landingpage.html';
    }
}

// Gọi hàm kiểm tra khi trang được load
document.addEventListener('DOMContentLoaded', function() {
    handleGoogleCallback();
});