// Xử lý đăng xuất
function handleLogout() {
    if (confirm('Bạn có chắc chắn muốn đăng xuất?')) {
        alert('Đã đăng xuất thành công!');
        // Có thể chuyển hướng về trang login
        // window.location.href = 'login.html';
    }
}


document.addEventListener("DOMContentLoaded", function () {
    fetch("sidebar.html")
        .then(response => response.text())
        .then(data => {
            document.getElementById("sidebar-container").innerHTML = data;
        })
        .catch(error => console.error("Lỗi tải sidebar:", error));
});
