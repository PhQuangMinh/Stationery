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
            if (result.data) {
                localStorage.setItem("accessToken", result.data);
                // Kiểm tra role sau khi đăng nhập
                const payload = JSON.parse(atob(result.data.split(".")[1]));
                console.log(payload.roles)
                if (payload.roles && payload.roles[0].authority.includes('ROLE_ADMIN')) {
                    window.location.href = "product.html";
                } else {
                    localStorage.removeItem("accessToken");
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
