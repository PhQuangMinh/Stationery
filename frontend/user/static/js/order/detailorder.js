const products = [
    {
        id: 1,
        image: "/lovable-uploads/d9c4729c-6dc2-4d61-9360-d7906496a46b.png",
        name: "Hướng dẫn học và làm bài ngữ văn 7 tập 1",
        price: 39190,
        quantity: 1
    },
    {
        id: 2,
        image: "/lovable-uploads/d9c4729c-6dc2-4d61-9360-d7906496a46b.png",
        name: "Sách giáo khoa Toán lớp 7",
        price: 45000,
        quantity: 2
    },
    {
        id: 3,
        image: "/lovable-uploads/d9c4729c-6dc2-4d61-9360-d7906496a46b.png",
        name: "Sách bài tập Tiếng Anh 7",
        price: 35000,
        quantity: 1
    }
];

// Format số tiền thành dạng việt nam đồng
function formatPrice(price) {
    return price.toLocaleString('vi-VN') + ' đ';
}

// Tính tổng tiền
function calculateTotal() {
    return products.reduce((sum, product) => {
        return sum + (product.price * product.quantity);
    }, 0);
}

// Render danh sách sản phẩm
function renderProducts() {
    const productList = document.getElementById('productList');
    let html = '';

    products.forEach(product => {
        html += `
            <tr>
                <td style="width: 150px">
                    <img 
                        src="${product.image}"
                        alt="${product.name}"
                        class="img-fluid"
                    />
                </td>
                <td>${product.name}</td>
                <td class="text-danger">${formatPrice(product.price)}</td>
                <td>${product.quantity}</td>
                <td class="text-danger">${formatPrice(product.price * product.quantity)}</td>
            </tr>
        `;
    });

    productList.innerHTML = html;
    
    // Cập nhật tổng tiền
    const totalAmount = document.getElementById('totalAmount');
    totalAmount.textContent = formatPrice(calculateTotal());
}

// Khởi tạo trang
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
});