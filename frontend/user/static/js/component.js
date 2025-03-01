const BASE_URL = window.location.origin; // Lấy domain gốc
console.log(BASE_URL)
fetch(BASE_URL + "/templates/component/header.html")
.then(response => response.text())
.then(data => {
    document.getElementById("header-container").innerHTML = data;
    updateCartCount();
    initHeaderMenu();
    // Sau khi header được load, cập nhật các đường dẫn
    document.querySelectorAll("#header-container a").forEach(link => {
        if (link.getAttribute("href") && !link.getAttribute("href").startsWith("http")) {
            link.href = BASE_URL + "/" + link.getAttribute("href").replace(/^\/+/, "");
        }
    });
});

fetch(BASE_URL + "/templates/component/footer.html")
.then(response => response.text())
.then(data => {
    if (document.getElementById("footer-container")!=null) {
        document.getElementById("footer-container").innerHTML = data;
    }

    // Sau khi header được load, cập nhật các đường dẫn
    document.querySelectorAll("#footer-container a").forEach(link => {
        if (link.getAttribute("href") && !link.getAttribute("href").startsWith("http")) {
            link.href = BASE_URL + "/" + link.getAttribute("href").replace(/^\/+/, "");
        }
    });

    const cartLink = document.querySelector("#header-container .cart a");
    if (cartLink) {
        cartLink.href = BASE_URL + "/templates/payment/shoppingcart.html"; 
    }

    const homeLink = document.getElementById("home-link");
    if (homeLink) homeLink.href = BASE_URL + "/templates/landingpage/landingpage.html";

    // Cập nhật đường dẫn Đăng ký
    const registerLink = document.getElementById("register-link");
    if (registerLink) registerLink.href = BASE_URL + "/templates/auth/signup.html";

    // Cập nhật đường dẫn Đăng nhập
    const loginLink = document.getElementById("login-link");
    if (loginLink) loginLink.href = BASE_URL + "/templates/auth/login.html";
});

function updateCartCount() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    document.getElementById("cart-link").innerText = `🛒 Giỏ hàng (${cart.length} sản phẩm)`;
}

const categories = [
    {
        name: "Sách giáo khoa",
        subcategories: [
            {
                name: "Lớp 1",
                subcategories: [
                    { name: "Cánh diều", subcategories: [] },
                    { name: "Kết nối tri thức", subcategories: [] },
                    { name: "Chân trời sáng tạo", subcategories: [] }
                ]
            },
            { name: "Lớp 2", subcategories: [] },
            { name: "Lớp 3", subcategories: [] }
        ]
    },
    { name: "Sách tham khảo", subcategories: [] },
    { name: "Vở ghi", subcategories: [] },
    { name: "Máy tính cầm tay", subcategories: [] },
    { name: "Đồ dùng học tập", subcategories: [] },
    { name: "Khác", subcategories: [] }
];

function initHeaderMenu() {
    const menuContainer = document.getElementById("menu");

    function createMenuItems(categories) {
        const ul = document.createElement("ul");
        ul.classList.add("submenu");

        categories.forEach(category => {
            const li = document.createElement("li");
            li.textContent = category.name;

            if (category.subcategories.length > 0) {
                const subMenu = createMenuItems(category.subcategories);
                li.appendChild(subMenu);
            }

            ul.appendChild(li);
        });

        return ul;
    }

    categories.forEach(category => {
        const li = document.createElement("li");
        li.innerHTML = `<a href="#">${category.name}</a>`;

        if (category.subcategories.length > 0) {
            const subMenu = createMenuItems(category.subcategories);
            li.appendChild(subMenu);
        }

        menuContainer.appendChild(li);
    });
};