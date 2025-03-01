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
            console.log(result.data)
            // Lưu token nếu API trả về token
            if (result.data) {
                localStorage.setItem("token", result.data);
            }
            // Chuyển hướng sau khi đăng nhập thành công
            window.location.href = "http://127.0.0.1:5500/templates/product.html";
        } else {
            document.getElementById('errorMessage').style.display = "block";
        }
    } catch (error) {
        console.error("Lỗi khi gửi yêu cầu đăng nhập:", error);
        document.getElementById('errorMessage').innerText = "Lỗi kết nối đến server!";
        document.getElementById('errorMessage').style.display = "block";
    }
}
