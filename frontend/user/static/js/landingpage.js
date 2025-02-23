const products = [
    {
        id: 1,
        title: "Hướng dẫn học và làm bài ngữ văn 7 tập 1",
        image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-CEC7D5wflC3Gs5rwr3hqDoqIIjfCDn.png",
        rating: 5,
        description: "đẹp",
        price: 39190,
        originalPrice: 48355,
        discount: 10
    },
    {
        id: 2,
        title: "Sách tham khảo toán 10 quyển 1",
        image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-CEC7D5wflC3Gs5rwr3hqDoqIIjfCDn.png",
        rating: 5,
        description: "đẹp",
        price: 39190,
        originalPrice: 48355,
        discount: 10
    },
    {
        id: 2,
        title: "Sách tham khảo toán 10 quyển 1",
        image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-CEC7D5wflC3Gs5rwr3hqDoqIIjfCDn.png",
        rating: 5,
        description: "đẹp",
        price: 39190,
        originalPrice: 48355,
        discount: 10
    },
    {
        id: 2,
        title: "Sách tham khảo toán 10 quyển 1",
        image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-CEC7D5wflC3Gs5rwr3hqDoqIIjfCDn.png",
        rating: 5,
        description: "đẹp",
        price: 39190,
        originalPrice: 48355,
        discount: 10
    }
];


function generateRatingStars(rating) {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
}

function formatPrice(price) {
    return new Intl.NumberFormat('vi-VN').format(price);
}

function createProductCard(product) {
    return `
        <div class="col-12 col-sm-6 col-lg-3">
            <div class="product-card">
                <div class="discount-badge">${product.discount}% OFF</div>
                <img src="${product.image}" class="product-image" alt="${product.title}">
                <h3 class="product-title">${product.title}</h3>
                <div class="rating">
                    ${generateRatingStars(product.rating)}
                </div>
                <div class="price">
                    ${formatPrice(product.price)} đ 
                    <span class="original-price">${formatPrice(product.originalPrice)} đ</span>
                </div>
            </div>
        </div>
    `;
}

function renderProductsHeader(containerId, products){
    const container = document.getElementById(containerId);
    container.innerHTML = products.map(product => createProductCard(product)).join('');
}

async function loadProducts(){
    try {
        const response = await fetch('https://api.example.com/products');
        const data = await response.json();
        products.push(...data);
        renderProducts();
    } catch (error) {
        console.error('Error:', error);
        renderProducts();
    }
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

function renderNavigation(navItems, navId){
    const navContainer = document.getElementById(navId)
    navContainer.innerHTML = navItems.map(item => `
        <li class="nav-item" style="font-size: 19px; height:36.28px;">
        <a class="nav-link ${item.isHighlighted ? 'text-danger' : ''} p-0" href="${item.link}" style="">
            ${item.text}
        </a>
        </li>
        `).join('');
    }
document.addEventListener('DOMContentLoaded', () =>{
    document.getElementById('section1').innerHTML = renderSection(
        'Sản phẩm khuyến mãi', 
        '../../static/img/landingpage/sale.png', 
        'promotion-product', products
    );
    renderProductsHeader('promotion-product', products)
    document.getElementById('section2').innerHTML = renderSection(
        'Sách tham khảo', 
        '../../static/img/landingpage/sachthamkhao.png', 
        'reference-book', products
    );
    renderProductsHeader('reference-book', products)
    document.getElementById('sectionbelow1').innerHTML = renderSectionBelow("Sách giáo khoa", "../../static/img/landingpage/sachgiaokhoaicon.png", "../../static/img/landingpage/sachgiaokhoa.png", "Hiệu sách cô Minh đã phát triển nền tảng giáo dục với mục tiêu nâng cao chất lượng giáo dục và đào tạo, bao gồm các chương trình giáo dục tiểu học, trung học phổ thông và tiểu học đại học.", "navId1", "productGrid1")
    renderProducts(products, "productGrid1");
    renderNavigation(navItems, "navId1");
    document.getElementById('sectionbelow2').innerHTML = renderSectionBelow("Vở ghi", "../../static/img/landingpage/sachgiaokhoaicon.png", "../../static/img/landingpage/sachgiaokhoa.png", "Hiệu sách cô Minh đã phát triển nền tảng giáo dục với mục tiêu nâng cao chất lượng giáo dục và đào tạo, bao gồm các chương trình giáo dục tiểu học, trung học phổ thông và tiểu học đại học.", "navId2", "productGrid2")
    renderProducts(products, "productGrid2");
    renderNavigation(navItems, "navId2");
    document.getElementById('sectionbelow3').innerHTML = renderSectionBelow("Máy tính cầm tay", "../../static/img/landingpage/sachgiaokhoaicon.png", "../../static/img/landingpage/sachgiaokhoa.png", "Hiệu sách cô Minh đã phát triển nền tảng giáo dục với mục tiêu nâng cao chất lượng giáo dục và đào tạo, bao gồm các chương trình giáo dục tiểu học, trung học phổ thông và tiểu học đại học.", "navId3", "productGrid3")
    renderProducts(products, "productGrid3");
    renderNavigation(navItems, "navId3");
    document.getElementById('sectionbelow4').innerHTML = renderSectionBelow("Đồ dùng học tập", "../../static/img/landingpage/sachgiaokhoaicon.png", "../../static/img/landingpage/sachgiaokhoa.png", "Hiệu sách cô Minh đã phát triển nền tảng giáo dục với mục tiêu nâng cao chất lượng giáo dục và đào tạo, bao gồm các chương trình giáo dục tiểu học, trung học phổ thông và tiểu học đại học.", "navId4", "productGrid4")
    renderProducts(products, "productGrid4");
    renderNavigation(navItems, "navId4");
});

function renderProduct(product){
    return `
    <div class="col-md-6 mb-4">
        <div class="product-card-below">
            <img src="${product.image}" alt="${product.title}" class="product-image">
            <h3 class="product-title">${product.title}</h3>
            <div class="rating">
                ${generateRatingStars(product.rating)}
            </div>
            <div class="product-description">
                Miêu tả: ${product.description}
            </div>
            <div class="product-price">${formatPrice(product.price)}</div>
        </div>
    </div>
    `;
}
function renderProducts(products, productGrid){
    const productContainer = document.getElementById(productGrid);
    productContainer.innerHTML = products.map(product => renderProduct(product)).join('');
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