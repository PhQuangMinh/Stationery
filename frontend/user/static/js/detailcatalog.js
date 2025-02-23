const categories = [
    {
        id: 1,
        name: 'Sách giáo khoa',
        children: [
            {
                id: 11,
                name: 'Lớp 1',
                children: [
                    { id: 111, name: 'Cánh diều', active: true },
                    { id: 112, name: 'Kết nối tri thức' },
                    { id: 113, name: 'Chân trời sáng tạo' }
                ]
            },
            { id: 12, name: 'Lớp 2' },
            { id: 13, name: 'Lớp 3' },
            { id: 14, name: 'Lớp 4' },
            { id: 15, name: 'Lớp 5' }
        ]
    },
    { id: 2, name: 'Sách tham khảo' },
    { id: 3, name: 'Vở ghi' },
    { id: 4, name: 'Máy tính cầm tay' },
    { id: 5, name: 'Đồ dùng học tập' },
    { id: 6, name: 'Khác' }
];

// Sample product data
const products = Array(12).fill(null).map((_, index) => ({
    id: index + 1,
    title: 'Toán 1 tập 1 Cánh Diều',
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-ZrGVUPT1uIcTSqwYLpBSDUkjX5JeKA.png',
    rating: 5,
    price: '39.000 đ',
    category: 111
}));

// Render category menu
function renderCategoryMenu(categories, parentElement = document.getElementById('categoryMenu')) {
    categories.forEach(category => {
        const menuItem = document.createElement('div');
        menuItem.className = `menu-item${category.active ? ' active' : ''}`;
        
        const nameSpan = document.createElement('span');
        nameSpan.textContent = category.name;
        menuItem.appendChild(nameSpan);

        if (category.children && category.children.length > 0) {
            const toggle = document.createElement('span');
            toggle.className = 'menu-toggle';
            toggle.innerHTML = '<i class="bi bi-chevron-right"></i>';
            menuItem.appendChild(toggle);

            const submenu = document.createElement('div');
            submenu.className = 'submenu';
            if (category.children.some(child => child.active || (child.children && child.children.some(c => c.active)))) {
                submenu.classList.add('active');
                toggle.querySelector('i').classList.remove('bi-chevron-right');
                toggle.querySelector('i').classList.add('bi-chevron-down');
            }
            renderCategoryMenu(category.children, submenu);

            menuItem.addEventListener('click', (e) => {
                e.stopPropagation();
                submenu.classList.toggle('active');
                toggle.querySelector('i').classList.toggle('bi-chevron-right');
                toggle.querySelector('i').classList.toggle('bi-chevron-down');
            });

            const container = document.createElement('div');
            container.appendChild(menuItem);
            container.appendChild(submenu);
            parentElement.appendChild(container);
        } else {
            menuItem.addEventListener('click', () => {
                document.querySelectorAll('.menu-item').forEach(item => item.classList.remove('active'));
                menuItem.classList.add('active');
            });
            parentElement.appendChild(menuItem);
        }
    });
}

// Render product grid
function renderProductGrid(products) {
    const grid = document.getElementById('productGrid');
    grid.innerHTML = products.map(product => `
        <div class="product-card">
            <a href="#" class="product-title">
                <img src="${product.image}" alt="${product.title}" class="product-image">
                <div>${product.title}</div>
            </a>
            <div class="rating">
                ${Array(product.rating).fill('★').join('')}
                ${Array(5 - product.rating).fill('☆').join('')}
            </div>
            <div class="price">${product.price}</div>
        </div>
    `).join('');
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    renderCategoryMenu(categories);
    renderProductGrid(products);

    // Expand active category on load
    const activeMenus = document.querySelectorAll('.menu-item.active');
    activeMenus.forEach(menu => {
        const parentSubmenu = menu.closest('.submenu');
        if (parentSubmenu) {
            parentSubmenu.classList.add('active');
            const toggle = parentSubmenu.previousElementSibling.querySelector('.menu-toggle i');
            if (toggle) {
                toggle.classList.remove('bi-chevron-right');
                toggle.classList.add('bi-chevron-down');
            }
        }
    });
});