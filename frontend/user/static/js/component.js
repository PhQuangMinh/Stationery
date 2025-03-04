const BASE_URL = window.location.origin; // Lấy domain gốc
console.log(BASE_URL)
fetch(BASE_URL + "/templates/component/header.html")
.then(response => response.text())
.then(data => {
    document.getElementById("header-container").innerHTML = data;
    updateCartCount();
    initHeaderMenu();
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

    const registerLink = document.getElementById("register-link");
    if (registerLink) registerLink.href = BASE_URL + "/templates/auth/signup.html";

    const loginLink = document.getElementById("login-link");
    if (loginLink) loginLink.href = BASE_URL + "/templates/auth/login.html";
});

function updateCartCount() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    document.getElementById("cart-link").innerText = `🛒 Giỏ hàng (${cart.length} sản phẩm)`;
}

const headerCategories = [
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

    function createMenuItems(categories, parentPath = '') {
        const ul = document.createElement("ul");
        ul.classList.add("submenu");

        categories.forEach(category => {
            const li = document.createElement("li");
            const categoryPath = parentPath ? `${parentPath}/${category.name}` : category.name;
            
            const link = document.createElement("a");
            link.textContent = category.name;
            link.href = `${BASE_URL}/templates/detailcatalog.html?category=${encodeURIComponent(categoryPath)}`;
            li.appendChild(link);

            if (category.subcategories && category.subcategories.length > 0) {
                const subMenu = createMenuItems(category.subcategories, categoryPath);
                li.appendChild(subMenu);
            }

            ul.appendChild(li);
        });

        return ul;
    }

    headerCategories.forEach(category => {
        const li = document.createElement("li");
        const link = document.createElement("a");
        link.href = `${BASE_URL}/templates/detailcatalog.html?category=${encodeURIComponent(category.name)}`;
        link.textContent = category.name;
        li.appendChild(link);

        if (category.subcategories.length > 0) {
            const subMenu = createMenuItems(category.subcategories, category.name);
            li.appendChild(subMenu);
        }

        menuContainer.appendChild(li);
    });
}