let cartItems = [
    {
        "image": "../../static/img/logo.png",
        "name": "Sản phẩm 1",
        "price": 10000,
        "quantity": 5
    },
    {
        "image": "../../static/img/logo.png",
        "name": "Sản phẩm 2",
        "price": 20000,
        "quantity": 3
    },
    {
        "image": "../../static/img/logo.png",
        "name": "Sản phẩm 2",
        "price": 20000,
        "quantity": 3
    }
    ,
    {
        "image": "../../static/img/logo.png",
        "name": "Sản phẩm 2",
        "price": 20000,
        "quantity": 3
    },
    {
        "image": "../../static/img/logo.png",
        "name": "Sản phẩm 2",
        "price": 20000,
        "quantity": 3
    }
];
function renderCart(){
    let cartBody = document.getElementById('cart-body');
    cartBody.innerHTML = "";
    cartItems.forEach((item, index) => {
        let row = document.createElement("tr")
        row.innerHTML = `
            <td><img src="${item.image}" alt="Sản phẩm" width = "150px" height: auto></td>
            <td>${item.name}</td>
            <td>${item.price.toLocaleString('vi-VN', {style: 'currency', currency: 'VND'})}</td>
            <td class="text-center">
                <div class="d-flex justify-content-center align-items-center">
                    <input type="number" value="${item.quantity}" min="1" class="form-control quantity" data-index="${index}" style="width: 80px; text-align: center;">
                </div>
            </td>
            <td>${(item.price * item.quantity).toLocaleString()} đ</td>
            <td><button class="btn btn-danger btn-sm delete" data-index="${index}">Xóa</button></td>
        `;
        cartBody.appendChild(row);
    });
    updateTotal();
    attachEventListeners()

}

function attachEventListeners(){
    document.querySelectorAll(".quantity").forEach(input =>{
        input.addEventListener("change", function(){
            let index = this.getAttribute("data-index");
            cartItems[index].quantity = parseInt(this.value);
            renderCart();
        })
    })
    
    document.querySelectorAll(".delete").forEach(button =>{
        input.addEventListener("click", function(){
            let index = this.getAttribute("data-index");
            cartItems.splice(index, 1)
            renderCart();
        })
    })
    document.getElementById("checkout-btn").addEventListener("click", function() {
        if (cartItems.length === 0) {
            alert("Giỏ hàng trống, vui lòng thêm sản phẩm trước khi thanh toán!");
            return;
        }
        window.location.href = "../payment/checkout.html";
    });
}

function updateTotal(){
    let subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    let total = subtotal
    document.getElementById("subtotal").innerText = subtotal.toLocaleString() + " đ";
    document.getElementById("total").innerText = total.toLocaleString() + " đ";
}


document.addEventListener("DOMContentLoaded", () =>{
    renderCart();
});