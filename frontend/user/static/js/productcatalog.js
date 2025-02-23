const categories = [
    {
        id: 1,
        name: 'Sách giáo khoa',
        children: [
            {
                id: 11,
                name: 'Lớp 1',
                children: [
                    { id: 111, name: 'Toán' },
                    { id: 112, name: 'Tiếng Việt' },
                    { id: 113, name: 'Tự nhiên và Xã hội' }
                ]
            },
            {
                id: 12,
                name: 'Lớp 2',
                children: [
                    { id: 121, name: 'Toán' },
                    { id: 122, name: 'Tiếng Việt' },
                    { id: 123, name: 'Tự nhiên và Xã hội' }
                ]
            },
            {
                id: 13,
                name: 'Lớp 3',
                children: [
                    { id: 131, name: 'Toán' },
                    { id: 132, name: 'Tiếng Việt' },
                    { id: 133, name: 'Tự nhiên và Xã hội' }
                ]
            },
            {
                id: 14,
                name: 'Lớp 4',
                children: [
                    { id: 141, name: 'Toán' },
                    { id: 142, name: 'Tiếng Việt' },
                    { id: 143, name: 'Khoa học' }
                ]
            },
            {
                id: 15,
                name: 'Lớp 5',
                children: [
                    { id: 151, name: 'Toán' },
                    { id: 152, name: 'Tiếng Việt' },
                    { id: 153, name: 'Khoa học' }
                ]
            }
        ]
    },
    { id: 2, name: 'Sách tham khảo' },
    { id: 3, name: 'Vở ghi' },
    { id: 4, name: 'Máy tính cầm tay' },
    { id: 5, name: 'Đồ dùng học tập' },
    { id: 6, name: 'Khác' }
];

// Sample product data
const products = [
    {
        id: 1,
        title: 'Sách giáo khoa lớp 1',
        image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-gm0toWzn7RAVqrZK7AEG393i0v0Ij2.png',
        category: 11
    },
    {
        id: 2,
        title: 'Sách giáo khoa lớp 2',
        image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-gm0toWzn7RAVqrZK7AEG393i0v0Ij2.png',
        category: 12
    },
    {
        id: 3,
        title: 'Sách giáo khoa lớp 3',
        image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-gm0toWzn7RAVqrZK7AEG393i0v0Ij2.png',
        category: 13
    },
    {
        id: 4,
        title: 'Sách giáo khoa lớp 4',
        image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-gm0toWzn7RAVqrZK7AEG393i0v0Ij2.png',
        category: 14
    },
    {
        id: 5,
        title: 'Sách giáo khoa lớp 5',
        image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-gm0toWzn7RAVqrZK7AEG393i0v0Ij2.png',
        category: 15
    },
    {
        id: 6,
        title: 'Sách giáo khoa lớp 6',
        image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-gm0toWzn7RAVqrZK7AEG393i0v0Ij2.png',
        category: 16
    }
];

// Render category menu
function renderCategoryMenu(categories, parentElement = document.getElementById('categoryMenu')) {
    categories.forEach(category => {
        const menuItem = document.createElement('div');
        menuItem.className = 'menu-item';
        
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
        </div>
    `).join('');
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    renderCategoryMenu(categories);
    renderProductGrid(products);
});