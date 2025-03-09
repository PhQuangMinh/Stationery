// API Functions
async function loadCategories() {
    try {
        const response = await fetch(`${BASE_API_URL}/categories/tree`);
        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error('Error:', error);
        return [];
    }
}

async function loadDiscountProducts() {
    try {
        const response = await fetch(`${BASE_API_URL}/products/random-discount`);
        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error('Error:', error);
        return [];
    }
}

async function loadCategoryProducts(categoryName) {
    try {
        const response = await fetch(`${BASE_API_URL}/products/random/${categoryName}`);
        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error('Error:', error);
        return [];
    }
}


function generateRatingStars(rating) {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
}

function formatPrice(price) {
    return new Intl.NumberFormat('vi-VN').format(price);
}

function createProductCard(product) {
    const discountPrice = product.price * (100 - product.discount) / 100;
    return `
        <div class="col-12 col-sm-6 col-lg-3">
            <div class="product-card" data-id="${product.id}" style="cursor: pointer;">
                ${product.discount > 0 ? `<div class="discount-badge">${product.discount}% OFF</div>` : ''}
                <div class="product-image-container">
                    <img src="${product.imageUrl}" class="product-image" alt="${product.name}">
                </div>
                <h3 class="product-title text-truncate">${product.name}</h3>
                <div class="rating">
                    ${generateRatingStars(5)}
                </div>
                <div class="price">
                    ${formatPrice(discountPrice)} đ 
                    ${product.discount > 0 ? `<span class="original-price">${formatPrice(product.price)} đ</span>` : ''}
                </div>
            </div>
        </div>
    `;
}

function renderProductsHeader(containerId, products) {
    const container = document.getElementById(containerId);
    container.innerHTML = products.map(product => createProductCard(product)).join('');
    
    // Thêm event listener cho tất cả product cards
    container.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('click', function() {
            const productId = this.getAttribute('data-id');
            window.location.href = `/templates/detailproduct.html?id=${productId}`;
        });
    });
}

function renderSection(textHeader, imageUrl, containerId, products){
    return `
        <div class="container">
            <div class="row">
                <div class="col-12 text-center">
                    <div class="promotion text-center text-danger fw-bold fs-3">
                        <img src="${imageUrl}" alt="sale" class="img-fluid" style="max-width: 40px;">
                        ${textHeader}
                    </div>
                </div>
            </div>
            <div style="position: relative; width: 100%; text-align: center;">
                <hr style="width: 100%; border-top: 2px solid #000;">
                <div style="position: absolute; top: 0px; left: 50%; transform: translate(-50%); width: 50%; height: 2px; background-color: red;"></div>
            </div>
        </div>
        <div class="container py-5">
            <div class="row g-4" id="${containerId}"></div>
        </div>
        `;
}
            
const navItems = [
    { text: "Mẫu giáo", link: "#" },
    { text: "Lớp 1", link: "#" },
    { text: "Lớp 2", link: "#" },
    { text: "Lớp 3", link: "#" },
    { text: "Lớp 4", link: "#" },
    { text: "Lớp 5", link: "#" },
    { text: "Xem tất cả", link: "#", isHighlighted: true }
];

function renderNavigation(category, navId, productGridId) {
    const navContainer = document.getElementById(navId);
    if (!category.children || category.children.length === 0) {
        navContainer.parentElement.style.display = 'none';
        return;
    }

    const navItems = category.children.map(child => `
        <li class="nav-item" style="font-size: 19px; height:36.28px;">
            <a class="nav-link p-0" 
               href="#" 
               data-category="${child.name}"
               onclick="loadCategoryProductsAndRender('${child.name}', '${productGridId}'); return false;">
                ${child.name}
            </a>
        </li>
    `).join('');

    navContainer.innerHTML = navItems + `
        <li class="nav-item" style="font-size: 19px; height:36.28px;">
            <a class="nav-link text-danger p-0" 
               href="/templates/detailcatalog.html?category=${encodeURIComponent(category.name)}">
                Xem tất cả
            </a>
        </li>
    `;
}

async function loadCategoryProductsAndRender(categoryName, productGridId) {
    const products = await loadCategoryProducts(categoryName);
    const container = document.getElementById(productGridId);
    container.innerHTML = products.map(product => renderProduct(product)).join('');
}

document.addEventListener('DOMContentLoaded', async () => {
    // Load categories first
    const categories = await loadCategories();

    // Load discount products
    const discountProducts = await loadDiscountProducts();
    document.getElementById('section1').innerHTML = renderSection(
        'Sản phẩm khuyến mãi', 
        '../../static/img/landingpage/sale.png', 
        'promotion-product'
    );
    renderProductsHeader('promotion-product', discountProducts);

    // Tìm category "Sách tham khảo"
    const referenceBookCategory = categories.find(cat => cat.name === 'Sách tham khảo');
    const referenceBooks = await loadCategoryProducts('Sách tham khảo');
    document.getElementById('section2').innerHTML = renderSection(
        'Sách tham khảo', 
        '../../static/img/landingpage/sachthamkhao.png', 
        'reference-book'
    );
    renderProductsHeader('reference-book', referenceBooks);

    // Load category products for each section
    const categoryMapping = {
        'Sách giáo khoa': 'sectionbelow1',
        'Vở ghi': 'sectionbelow2',
        'Máy tính': 'sectionbelow3',
        'Cặp sách': 'sectionbelow4'
    };

    for (const [categoryName, sectionId] of Object.entries(categoryMapping)) {
        const category = categories.find(cat => cat.name === categoryName);
        if (!category) continue;

        const navIdNum = sectionId.slice(-1);
        const productGridId = `productGrid${navIdNum}`;

        document.getElementById(sectionId).innerHTML = renderSectionBelow(
            category.name,
            "../../static/img/landingpage/sachgiaokhoaicon.png",
            "../../static/img/landingpage/sachgiaokhoa.png",
            "Hiệu sách cô Minh đã phát triển nền tảng giáo dục với mục tiêu nâng cao chất lượng giáo dục và đào tạo...",
            `navId${navIdNum}`,
            productGridId
        );

        // Render navigation với category children
        renderNavigation(category, `navId${navIdNum}`, productGridId);

        // Load sản phẩm của category cha nếu không có children
        if (!category.children || category.children.length === 0) {
            const products = await loadCategoryProducts(category.name);
            renderProducts(products, productGridId);
        } else {
            // Load sản phẩm của category con đầu tiên nếu có children
            const firstChild = category.children[0];
            const products = await loadCategoryProducts(firstChild.name);
            renderProducts(products, productGridId);
        }
    }
});

function renderProduct(product) {
    const discountPrice = product.price * (100 - product.discount) / 100;
    return `
        <div class="col-6">
            <div class="product-card-category" data-id="${product.id}" style="cursor: pointer;">
                ${product.discount > 0 ? `<div class="discount-badge">${product.discount}% OFF</div>` : ''}
                <div class="product-image-wrapper">
                    <img src="${product.imageUrl}" alt="${product.name}">
                </div>
                <div class="product-info">
                    <h3 class="product-name">${product.name}</h3>
                    <div class="rating">
                        ${generateRatingStars(5)}
                    </div>
                    <div class="price">
                        ${formatPrice(discountPrice)} đ 
                        ${product.discount > 0 ? `<span class="original-price">${formatPrice(product.price)} đ</span>` : ''}
                    </div>
                </div>
            </div>
        </div>
    `;
}

function renderProducts(products, productGrid) {
    const productContainer = document.getElementById(productGrid);
    productContainer.innerHTML = products.map(product => renderProduct(product)).join('');
    
    // Thêm event listener cho tất cả product cards
    productContainer.querySelectorAll('.product-card-category').forEach(card => {
        card.addEventListener('click', function() {
            const productId = this.getAttribute('data-id');
            window.location.href = `/templates/detailproduct.html?id=${productId}`;
        });
    });
}

function renderSectionBelow(textHeader, imageUrlHeader, imageUrlDemo, intro, navId, productGrid){
    return `
    <div class="container">
        <hr style="width: 100%; border-top: 3px solid red; margin: 0px;">
        <div class="d-flex justify-content-between align-items-center-y" style="max-height: 40px;">
            <div class="col-lg-4">
                <div class="sectionbelow">
                    <img src="${imageUrlHeader}" alt="${textHeader}" class="sectionbelow" style="max-height: 30px; padding-right: 10px; padding-left: 10px;">${textHeader}
                </div>
            </div>
            <div class="col-lg-8 d-flex justify-content-between align-items-center">
                <nav class="navbar navbar-expand-lg gx-3 p-0" style="height:36.28px;">
                    <ul class="navbar-nav d-flex align-items-center" id="${navId}" >
                    </ul>
                </nav>
            </div>
        </div>
    </div>
    <div class="container">
        <div class="row">
            <div class="col-lg-4">
                <img src="${imageUrlDemo}" alt="${textHeader}" style="max-width: 372px; height: 600px;">
            </div>
            <div class="col-lg-8">
                <p>
                    ${intro}
                </p>
                <div class="row" id=${productGrid}>

                </div>
            </div>
        </div>
    </div>
    `
}

