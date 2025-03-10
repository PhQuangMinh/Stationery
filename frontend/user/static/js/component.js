const BASE_URL = window.location.origin;
const BASE_API_URL = 'http://localhost:8080';

// Thêm hàm kiểm tra token hết hạn
function isTokenExpired() {
    const expiration = localStorage.getItem('tokenExpiration');
    if (!expiration) return true;
    return new Date().getTime() > parseInt(expiration);
}

// Hàm logout
function logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('username');
    localStorage.removeItem('tokenExpiration');
    window.location.href = '/templates/auth/login.html';
}

// Cập nhật hàm kiểm tra trạng thái đăng nhập
function checkLoginStatus() {
    const token = localStorage.getItem('accessToken');
    const username = localStorage.getItem('username');
    const userOptions = document.querySelector('.user-options');
    const cartContainer = document.querySelector('.cart-order-container');
    
    console.log('Checking login status:', { token, username }); // Debug log

    if (token && username && !isTokenExpired()) {
        console.log('User is logged in'); // Debug log
        userOptions.innerHTML = `
            <span style="color: white;">${username}</span> | 
            <a href="#" id="logout-link" style="color: white; text-decoration: none;">Đăng xuất</a>
        `;
        
        // Cập nhật container giỏ hàng và đơn hàng
        cartContainer.innerHTML = `
            <div class="cart">
                <a id="cart-link" class="text-danger text-decoration-none" target="_self">
                    🛒 Giỏ hàng (0 sản phẩm)
                </a>
            </div>
            <div class="order">
                <a id="order-link" class="text-danger text-decoration-none" target="_self">
                    📦 Đơn hàng
                </a>
            </div>
        `;

        // Thêm sự kiện cho link đơn hàng
        const orderLink = document.getElementById('order-link');
        if (orderLink) {
            orderLink.href = BASE_URL + "/templates/order/userorder.html";
        }
        
        // Thêm sự kiện đăng xuất
        const logoutLink = document.getElementById('logout-link');
        if (logoutLink) {
            logoutLink.addEventListener('click', (e) => {
                e.preventDefault();
                logout();
            });
        }
    } else {
        console.log('User is not logged in'); // Debug log
        if (token) {
            logout();
        }
        userOptions.innerHTML = `
            <a id="register-link" style="color: white; text-decoration: none;">Đăng ký</a> | 
            <a id="login-link" style="color: white; text-decoration: none;">Đăng nhập</a>
        `;
        
        // Chỉ hiển thị giỏ hàng khi chưa đăng nhập
        cartContainer.innerHTML = `
            <div class="cart">
                <a id="cart-link" class="text-danger text-decoration-none" target="_self">
                    🛒 Giỏ hàng (0 sản phẩm)
                </a>
            </div>
        `;
    }
}

// Thêm hàm kiểm tra authentication cho các request API
function getAuthHeader() {
    const token = localStorage.getItem('accessToken');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
}

// Cập nhật fetch header
fetch(BASE_URL + "/templates/component/header.html")
.then(response => response.text())
.then(data => {
    document.getElementById("header-container").innerHTML = data;
    
    // Đợi một chút để đảm bảo DOM đã được cập nhật
    setTimeout(() => {
        checkLoginStatus(); // Kiểm tra trạng thái đăng nhập
        updateCartCount();
        fetchCategories();
        
        // Cập nhật các link
        document.querySelectorAll("#header-container a").forEach(link => {
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
    }, 100);
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

function fetchCategories() {
    fetch(BASE_API_URL + '/categories/tree', {
        headers: {
            ...getAuthHeader()
        }
    })
    .then(response => response.json())
    .then(response => {
        if (response.data) {
            initHeaderMenu(response.data);
        }
    })
    .catch(error => console.error('Error fetching categories:', error));
}

function initHeaderMenu(categories) {
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

            if (category.children && category.children.length > 0) {
                const subMenu = createMenuItems(category.children, categoryPath);
                li.appendChild(subMenu);
            }

            ul.appendChild(li);
        });

        return ul;
    }

    categories.forEach(category => {
        const li = document.createElement("li");
        const link = document.createElement("a");
        link.href = `${BASE_URL}/templates/detailcatalog.html?category=${encodeURIComponent(category.name)}`;
        link.textContent = category.name;
        li.appendChild(link);

        if (category.children && category.children.length > 0) {
            const subMenu = createMenuItems(category.children, category.name);
            li.appendChild(subMenu);
        }

        menuContainer.appendChild(li);
    });
}

// Thêm hàm tìm kiếm sản phẩm
async function searchProducts(query) {
    try {
        const response = await fetch(`${BASE_API_URL}/products/all-name?name=${encodeURIComponent(query)}`);
        const data = await response.json();
        return data.data || [];
    } catch (error) {
        console.error('Error searching products:', error);
        return [];
    }
}

// Thêm debounce function để tránh gọi API quá nhiều
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Thêm hàm xử lý hiển thị kết quả tìm kiếm
function displaySearchResults(products) {
    const searchResults = document.getElementById('searchResults');
    if (!products.length) {
        searchResults.style.display = 'none';
        return;
    }

    searchResults.innerHTML = products
        .map(product => `
            <div class="search-item" data-id="${product.id}">
                ${product.name}
            </div>
        `)
        .join('');
    searchResults.style.display = 'block';
}

// Thêm event listeners cho tìm kiếm
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');

    if (searchInput) {
        // Xử lý input với debounce
        const debouncedSearch = debounce(async (query) => {
            if (query.length >= 2) {
                const products = await searchProducts(query);
                displaySearchResults(products);
            } else {
                searchResults.style.display = 'none';
            }
        }, 300);

        searchInput.addEventListener('input', (e) => {
            debouncedSearch(e.target.value);
        });

        // Xử lý click vào kết quả tìm kiếm
        searchResults.addEventListener('click', (e) => {
            const searchItem = e.target.closest('.search-item');
            if (searchItem) {
                const productId = searchItem.dataset.id;
                window.location.href = `${BASE_URL}/templates/detailproduct.html?id=${productId}`;
            }
        });

        // Ẩn kết quả khi click ra ngoài
        document.addEventListener('click', (e) => {
            if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
                searchResults.style.display = 'none';
            }
        });
    }
});