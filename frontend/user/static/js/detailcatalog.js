document.addEventListener("DOMContentLoaded", () => {
    // Lấy category từ URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const categoryFromUrl = urlParams.get('category');
    
    // Fetch categories và sau đó xử lý category từ URL nếu có
    fetchCategories().then(() => {
        if (categoryFromUrl) {
            // Tìm category item từ URL
            const categoryItem = document.querySelector(`.category-item[data-name="${categoryFromUrl}"]`);
            if (categoryItem) {
                const subcategory = categoryItem.nextElementSibling;
                
                // Kiểm tra xem category có children không
                if (subcategory && subcategory.classList.contains('subcategory')) {
                    // Nếu có children, lấy category con đầu tiên
                    const firstChildCategory = subcategory.querySelector('.category-item');
                    if (firstChildCategory) {
                        // Mở submenu
                        subcategory.style.display = 'block';
                        const toggle = categoryItem.querySelector('.category-toggle');
                        if (toggle) {
                            toggle.textContent = '▼';
                        }

                        // Highlight category con đầu tiên
                        const firstChildHeader = firstChildCategory.querySelector('.menu-header');
                        document.querySelectorAll('.menu-header').forEach(header => 
                            header.classList.remove('active')
                        );
                        firstChildHeader.classList.add('active');

                        // Fetch sản phẩm của category con đầu tiên
                        const firstChildName = firstChildCategory.getAttribute('data-name');
                        fetchProductsByCategory(firstChildName);
                        document.querySelector('.category-title').textContent = firstChildName;
                    }
                } else {
                    // Nếu không có children, xử lý như bình thường
                    const menuHeader = categoryItem.querySelector('.menu-header');
                    document.querySelectorAll('.menu-header').forEach(header => 
                        header.classList.remove('active')
                    );
                    menuHeader.classList.add('active');
                    
                    // Mở các submenu parent nếu category nằm trong submenu
                    let parent = categoryItem.closest('.subcategory');
                    while (parent) {
                        parent.style.display = 'block';
                        const toggle = parent.previousElementSibling.querySelector('.category-toggle');
                        if (toggle) {
                            toggle.textContent = '▼';
                        }
                        parent = parent.parentElement.closest('.subcategory');
                    }
                    
                    fetchProductsByCategory(categoryFromUrl);
                }
            }
        } else {
            // Nếu không có category trong URL, xử lý mặc định như cũ
            const firstCategory = document.querySelector('.category-item');
            if (firstCategory) {
                const subcategory = firstCategory.nextElementSibling;
                if (subcategory && subcategory.classList.contains('subcategory')) {
                    // Nếu category đầu tiên có children
                    const firstChildCategory = subcategory.querySelector('.category-item');
                    if (firstChildCategory) {
                        // Mở submenu
                        subcategory.style.display = 'block';
                        const toggle = firstCategory.querySelector('.category-toggle');
                        if (toggle) {
                            toggle.textContent = '▼';
                        }

                        // Highlight category con đầu tiên
                        const firstChildHeader = firstChildCategory.querySelector('.menu-header');
                        firstChildHeader.classList.add('active');

                        // Fetch sản phẩm của category con đầu tiên
                        const firstChildName = firstChildCategory.getAttribute('data-name');
                        fetchProductsByCategory(firstChildName);
                        document.querySelector('.category-title').textContent = firstChildName;
                    }
                } else {
                    // Nếu category đầu tiên không có children
                    const categoryName = firstCategory.getAttribute('data-name');
                    const menuHeader = firstCategory.querySelector('.menu-header');
                    menuHeader.classList.add('active');
                    fetchProductsByCategory(categoryName);
                    document.querySelector('.category-title').textContent = categoryName;
                }
            }
        }
    });
});

function fetchCategories() {
    // Return Promise từ hàm fetch
    return fetch(BASE_API_URL + '/categories/tree')
        .then(response => response.json())
        .then(response => {
            if (response.data) {
                console.log(response.data);
                const categoryMenu = document.getElementById("categoryMenu");
                categoryMenu.innerHTML = response.data.map(category => createCategoryHTML(category)).join('');
                addCategoryEventListeners();
            }
        })
        .catch(error => console.error('Error fetching categories:', error));
}

function createCategoryHTML(category, level = 0) {
    const hasChildren = category.children && category.children.length > 0;
    
    let html = `
        <div class="category-container">
            <div class="category-item" data-id="${category.id}" data-name="${category.name}">
                <div class="menu-header d-flex align-items-center">
                    ${hasChildren ? 
                        `<span class="category-toggle">▼</span>` : 
                        `<span style="margin-left: 1rem"></span>`
                    }
                    <span class="category-name">${category.name}</span>
                </div>
            </div>
            ${hasChildren ? `
                <div class="subcategory">
                    ${category.children.map(child => createCategoryHTML(child, level + 1)).join('')}
                </div>
            ` : ''}
        </div>
    `;

    return html;
}

function addCategoryEventListeners() {
    // Xử lý click vào category-toggle
    document.querySelectorAll('.category-toggle').forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            e.stopPropagation();
            const categoryContainer = e.target.closest('.category-container');
            const subcategory = categoryContainer.querySelector('.subcategory');
            if (subcategory) {
                subcategory.style.display = subcategory.style.display === 'none' ? 'block' : 'none';
                e.target.textContent = subcategory.style.display === 'none' ? '▶' : '▼';
            }
        });
    });

    // Xử lý click vào category-item
    document.querySelectorAll('.category-item').forEach(item => {
        const menuHeader = item.querySelector('.menu-header');
        const categoryName = item.getAttribute('data-name');
        const categoryContainer = item.closest('.category-container');
        const subcategory = categoryContainer.querySelector('.subcategory');

        menuHeader.addEventListener('click', (e) => {
            e.stopPropagation();

            // Nếu click vào toggle button, không xử lý
            if (e.target.classList.contains('category-toggle')) {
                return;
            }

            // Nếu category có children
            if (subcategory) {
                const firstChildCategory = subcategory.querySelector('.category-item');
                if (firstChildCategory) {
                    const firstChildName = firstChildCategory.getAttribute('data-name');
                    fetchProductsByCategory(firstChildName);
                    document.querySelector('.category-title').textContent = firstChildName;

                    // Highlight category được chọn
                    document.querySelectorAll('.menu-header').forEach(header => 
                        header.classList.remove('active')
                    );
                    firstChildCategory.querySelector('.menu-header').classList.add('active');
                }
      } else {
                // Nếu category không có children
                fetchProductsByCategory(categoryName);
                document.querySelector('.category-title').textContent = categoryName;

                // Highlight category được chọn
                document.querySelectorAll('.menu-header').forEach(header => 
                    header.classList.remove('active')
                );
                menuHeader.classList.add('active');
            }
        });
    });
}

// Thêm biến để quản lý state phân trang
let currentPage = 0;
let totalPages = 0;
let currentCategory = '';
const PAGE_SIZE = 12; // Số sản phẩm mỗi trang

function fetchProductsByCategory(categoryName, page = 0) {
    currentCategory = categoryName;
    const url = new URL(`${BASE_API_URL}/products/category`);
    url.searchParams.append('categoryName', categoryName);
    url.searchParams.append('page', page);
    url.searchParams.append('size', PAGE_SIZE);
    url.searchParams.append('sortBy', 'id');

    fetch(url)
        .then(response => response.json())
        .then(response => {
            if (response.data) {
                const { content, totalPages: total, number } = response.data;
                currentPage = number;
                totalPages = total;
                renderProductGrid(content);
                renderPagination(total, number);
                document.querySelector('.category-title').textContent = categoryName;
            }
        })
        .catch(error => {
            console.error('Error fetching products:', error);
        });
}

function renderPagination(totalPages, currentPage) {
    const paginationContainer = document.getElementById('pagination');
    let html = '<nav aria-label="Product pagination"><ul class="pagination justify-content-center">';

    // Nút Previous
    html += `
        <li class="page-item ${currentPage === 0 ? 'disabled' : ''}">
            <a class="page-link" href="#" data-page="${currentPage - 1}">Previous</a>
        </li>
    `;

    // Các nút số trang
    for (let i = 0; i < totalPages; i++) {
        html += `
            <li class="page-item ${currentPage === i ? 'active' : ''}">
                <a class="page-link" href="#" data-page="${i}">${i + 1}</a>
            </li>
        `;
    }

    // Nút Next
    html += `
        <li class="page-item ${currentPage === totalPages - 1 ? 'disabled' : ''}">
            <a class="page-link" href="#" data-page="${currentPage + 1}">Next</a>
        </li>
    `;

    html += '</ul></nav>';
    paginationContainer.innerHTML = html;

    // Thêm event listeners cho các nút phân trang
    paginationContainer.querySelectorAll('.page-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = parseInt(e.target.dataset.page);
            if (page >= 0 && page < totalPages) {
                fetchProductsByCategory(currentCategory, page);
            }
        });
    });
  }
  
  function renderProductGrid(products) {
    const grid = document.getElementById("productGrid");
    if (products.length === 0) {
        grid.innerHTML = '<p class="text-center w-100">Không có sản phẩm nào trong danh mục này</p>';
        return;
    }

    grid.innerHTML = products
      .map(
        (product) =>
                `<div class="product-card" data-id="${product.id}">
                    <a href="/templates/detailproduct.html?id=${product.id}" class="product-title text-decoration-none">
                        <img src="${product.imageUrl}" alt="${product.name}" class="product-image">
                        <div class="product-name text-dark">${product.name}</div>
                        <div class="price">${formatPrice(product.price)}đ</div>
                        ${product.discount > 0 ? 
                            `<div class="discount">Giảm ${product.discount}%</div>` : 
                            ''
                        }
                    </a>
                </div>`
        )
        .join("");

    // Thêm event listener cho các product cards
    document.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('click', function(e) {
            e.preventDefault(); // Ngăn chặn hành vi mặc định của thẻ a
            const productId = this.getAttribute('data-id');
            window.location.href = `/templates/detailproduct.html?id=${productId}`;
        });
    });
}

function formatPrice(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }
  
  