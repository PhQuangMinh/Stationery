function renderCart() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let cartBody = document.getElementById("cart-body");

    cartBody.innerHTML = "";
    if (cart.length === 0) {
        cartBody.innerHTML = "<tr><td colspan='6'>Giỏ hàng của bạn đang trống! 😢</td></tr>";
    }
    console.log("cart: " + cart)

    cart.forEach((item, index) => {
        console.log(item)
        let row = document.createElement("tr");
        row.innerHTML = `
            <td><img src="${item.image}" alt="Sản phẩm" width="150px"></td>
            <td>${item.name}</td>
            <td>${item.price.toLocaleString('vi-VN')} đ</td>
            <td class="text-center">
                <input type="number" value="${item.quantity}" min="1" class="form-control quantity" data-index="${index}" style="width: 80px; text-align: center;">
            </td>
            <td>${(item.price * item.quantity).toLocaleString('vi-VN')} đ</td>
            <td><button class="btn btn-danger btn-sm delete" data-index="${index}">Xóa</button></td>
        `;
        cartBody.appendChild(row);
    });

    updateTotal();
    attachEventListeners();
}

function attachEventListeners() {
    document.querySelectorAll(".quantity").forEach(input => {
        input.addEventListener("change", function () {
            let index = this.getAttribute("data-index");
            let cart = JSON.parse(localStorage.getItem("cart")) || [];
            cart[index].quantity = parseInt(this.value);
            localStorage.setItem("cart", JSON.stringify(cart));
            renderCart();
            updateCartCount();
        });
    });

    document.querySelectorAll(".delete").forEach(button => {
        button.addEventListener("click", function () {
            let index = this.getAttribute("data-index");
            let cart = JSON.parse(localStorage.getItem("cart")) || [];
            cart.splice(index, 1);
            localStorage.setItem("cart", JSON.stringify(cart));
            renderCart();
            updateCartCount();
        });
    });

    document.getElementById("checkout-btn").addEventListener("click", function () {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        if (cart.length === 0) {
            alert("Giỏ hàng trống, vui lòng thêm sản phẩm trước khi thanh toán!");
            return;
        }
        window.location.href = "../payment/checkout.html";
    });
}

function updateTotal() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    document.getElementById("subtotal").innerText = subtotal.toLocaleString('vi-VN') + " đ";
    document.getElementById("total").innerText = subtotal.toLocaleString('vi-VN') + " đ";
}


document.addEventListener("DOMContentLoaded", () =>{
    renderCart();
});

fetch('../component/header.html') 
    .then(response => response.text())
    .then(data => {
      document.getElementById('header-container').innerHTML = data;
});

fetch('../component/footer.html') 
    .then(response => response.text())
    .then(data => {
      if (document.getElementById('footer-container')!=null){
        document.getElementById('footer-container').innerHTML = data;
      }
});