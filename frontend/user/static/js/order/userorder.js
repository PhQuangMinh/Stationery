const orders = [
    { id: 12345, date: "1 - 1 - 2025", address: "Diễn Phong, Diễn Châu, Nghệ An", price: "2345.0 đ", status: "Đang giao" },
    { id: 67890, date: "5 - 2 - 2025", address: "Hà Nội, Việt Nam", price: "1500.0 đ", status: "Đã giao" }
];

function loadOrders() {
    const tableBody = document.getElementById("orderTableBody");
    orders.forEach(order => {
        const row = `<tr>
                        <td>${order.id}</td>
                        <td>${order.date}</td>
                        <td>${order.address}</td>
                        <td class='price'>${order.price}</td>
                        <td>${order.status}</td>
                    </tr>`;
        tableBody.innerHTML += row;
    });
}

document.addEventListener("DOMContentLoaded", loadOrders);