// Hàm kiểm tra token
function checkAuth() {
    const token = localStorage.getItem('accessToken');
    if (!token) {
        window.location.href = "login.html";
        return false;
    }

    try {
        // Giải mã token để kiểm tra
        const payload = JSON.parse(atob(token.split(".")[1]));
        
        // Kiểm tra token hết hạn
        if (payload.exp * 1000 < Date.now()) {
            localStorage.removeItem("accessToken");
            window.location.href = "login.html";
            return false;
        }

        // Kiểm tra role nếu cần
        if (payload.role && !payload.role.includes('ROLE_ADMIN')) {
            alert('Bạn không có quyền truy cập trang này!');
            window.location.href = "login.html";
            return false;
        }

        return true;
    } catch (error) {
        console.error('Lỗi khi kiểm tra token:', error);
        localStorage.removeItem("accessToken");
        window.location.href = "login.html";
        return false;
    }
}

// Hàm kiểm tra token cho trang login
function checkLoginPage() {
    const token = localStorage.getItem('accessToken');
    if (token) {
        try {
            const payload = JSON.parse(atob(token.split(".")[1]));
            if (payload.exp * 1000 > Date.now()) {
                window.location.href = "product.html";
            }
        } catch (error) {
            console.error('Lỗi khi kiểm tra token:', error);
        }
    }
} 