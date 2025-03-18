async function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const loginData = {
        username: username,
        password: password
    };

    try {
        const response = await fetch("http://localhost:8080/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(loginData)
        });

        if (response.ok) {
            const result = await response.json();
            console.log("Dữ liệu nhận được:", result);

            // AuthResponse chứa accessToken, refreshToken và isAdmin
            if (result.data) {
                // Lưu accessToken vào localStorage
                localStorage.setItem("accessToken", result.data.accessToken);
          
                // Kiểm tra quyền admin
                if (result.data.admin) {
                    // Người dùng là admin, chuyển hướng tới trang admin
                    window.location.href = "product.html";
                } else {
                    // Người dùng không phải admin, xóa token và hiển thị thông báo
                    localStorage.removeItem("accessToken");
                    document.getElementById('errorMessage').innerText = "Bạn không có quyền truy cập!";
                    document.getElementById('errorMessage').style.display = "block";
                }
            }
        } else {
            document.getElementById('errorMessage').style.display = "block";
        }
    } catch (error) {
        console.error("Lỗi khi gửi yêu cầu đăng nhập:", error);
        document.getElementById('errorMessage').innerText = "Lỗi kết nối đến server!";
        document.getElementById('errorMessage').style.display = "block";
    }
}
