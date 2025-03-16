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

            // Lưu token và username vào localStorage
            if (data.data) {
                localStorage.setItem('accessToken', data.data);
                localStorage.setItem('username', loginData.username);
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
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const username = urlParams.get('username');
    
    if (token && username) {
        // Lưu thông tin đăng nhập
        localStorage.setItem('accessToken', token);
        localStorage.setItem('username', username);
        
        // Chuyển hướng về trang chủ
        window.location.href = '/templates/landingpage/landingpage.html';
    }
}

// Gọi hàm kiểm tra khi trang được load
document.addEventListener('DOMContentLoaded', function() {
    handleGoogleCallback();
});