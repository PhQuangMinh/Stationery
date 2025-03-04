document.addEventListener("DOMContentLoaded", () => {
    renderCategoryMenu(categories)
    renderProductGrid(products)
  })
  
  const categories = [
    {
      id: 1,
      name: "Sách giáo khoa",
      children: [
        {
          id: 11,
          name: "Lớp 1",
          children: [
            { id: 111, name: "Cánh diều" },
            { id: 112, name: "Kết nối tri thức" },
            { id: 113, name: "Chân trời sáng tạo" },
          ],
        },
        { id: 12, name: "Lớp 2" },
        { id: 13, name: "Lớp 3" },
        { id: 14, name: "Lớp 4" },
        { id: 15, name: "Lớp 5" },
      ],
    },
    { id: 2, name: "Sách tham khảo" },
    { id: 3, name: "Vở ghi" },
    { id: 4, name: "Máy tính cầm tay" },
    { id: 5, name: "Đồ dùng học tập" },
    { id: 6, name: "Khác" },
  ]
  
  const products = [
    {
      id: 1,
      title: "Toán 1 tập 1 Cánh Diều",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-ZrGVUPT1uIcTSqwYLpBSDUkjX5JeKA.png",
      rating: 5,
      price: "39.000 đ",
      categories: [1, 11, 111] // SGK -> Lớp 1 -> Cánh diều
    },
    {
      id: 2,
      title: "Tiếng Việt 1 tập 1 Kết nối tri thức",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-ZrGVUPT1uIcTSqwYLpBSDUkjX5JeKA.png",
      rating: 4,
      price: "35.000 đ",
      categories: [1, 11, 112] // SGK -> Lớp 1 -> Kết nối tri thức
    },
    {
      id: 3,
      title: "Vở ô ly 96 trang Campus",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-ZrGVUPT1uIcTSqwYLpBSDUkjX5JeKA.png",
      rating: 5,
      price: "12.000 đ",
      categories: [3] // Vở ghi
    },
    {
      id: 4,
      title: "Tự Nhiên và Xã Hội 1 Chân trời sáng tạo",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-ZrGVUPT1uIcTSqwYLpBSDUkjX5JeKA.png",
      rating: 4,
      price: "32.000 đ",
      categories: [1, 11, 113] // SGK -> Lớp 1 -> Chân trời sáng tạo
    },
    {
      id: 5,
      title: "Casio FX-580VN X",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-ZrGVUPT1uIcTSqwYLpBSDUkjX5JeKA.png",
      rating: 5,
      price: "685.000 đ",
      categories: [4] // Máy tính cầm tay
    },
    {
      id: 6,
      title: "Bộ thước kẻ 4 chi tiết",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-ZrGVUPT1uIcTSqwYLpBSDUkjX5JeKA.png",
      rating: 4,
      price: "25.000 đ",
      categories: [5] // Đồ dùng học tập
    },
    {
      id: 7,
      title: "Toán nâng cao lớp 1",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-ZrGVUPT1uIcTSqwYLpBSDUkjX5JeKA.png",
      rating: 5,
      price: "45.000 đ",
      categories: [2, 11] // Sách tham khảo -> Lớp 1
    },
    {
      id: 8,
      title: "Vở kẻ ngang 200 trang",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-ZrGVUPT1uIcTSqwYLpBSDUkjX5JeKA.png",
      rating: 3,
      price: "15.000 đ",
      categories: [3] // Vở ghi
    }
  ]
  
  function renderCategoryMenu(categories, parentElement = document.getElementById("categoryMenu")) {
    categories.forEach((category) => {
      const menuItem = document.createElement("div")
      menuItem.className = "menu-item"
  
      const menuHeader = document.createElement("div") 
      menuHeader.className = "menu-header"
  
      const nameSpan = document.createElement("span")
      nameSpan.textContent = category.name
      menuHeader.appendChild(nameSpan)
  
      menuItem.appendChild(menuHeader)
  
      if (category.children && category.children.length > 0) {
        const toggle = document.createElement("span")
        toggle.className = "menu-toggle"
        toggle.innerHTML = '<i class="bi bi-chevron-right"></i>'
        menuHeader.appendChild(toggle)
  
        const submenu = document.createElement("div")
        submenu.className = "submenu"
        menuItem.appendChild(submenu)
  
        menuHeader.addEventListener("click", (e) => {
          e.stopPropagation()
          
          const allSubmenus = document.querySelectorAll('.submenu.active')
          allSubmenus.forEach(sub => {
            if (sub !== submenu) {
              sub.classList.remove('active')
              const icon = sub.parentElement.querySelector('.menu-toggle i')
              if (icon) {
                icon.classList.remove('bi-chevron-down')
                icon.classList.add('bi-chevron-right')
              }
            }
          })
  
          submenu.classList.toggle("active")
          
          const icon = toggle.querySelector("i")
          icon.classList.toggle("bi-chevron-right")
          icon.classList.toggle("bi-chevron-down")

          filterAndRenderProducts(category.id)
        })
  
        renderCategoryMenu(category.children, submenu)
      } else {
        menuHeader.addEventListener("click", (e) => {
          e.stopPropagation()
          document.querySelectorAll(".menu-header").forEach((item) => 
            item.classList.remove("active")
          )
          menuHeader.classList.add("active")

          filterAndRenderProducts(category.id)
        })
      }
  
      parentElement.appendChild(menuItem)
    })
  }
  
  function filterAndRenderProducts(categoryId) {
    const filteredProducts = products.filter(product => 
      product.categories.includes(categoryId)
    )
    renderProductGrid(filteredProducts)
  }
  
  function renderProductGrid(products) {
    const grid = document.getElementById("productGrid")
    grid.innerHTML = products
      .map(
        (product) =>
          `<div class="product-card">
              <a href="#" class="product-title">
                  <img src="${product.image}" alt="${product.title}" class="product-image">
                  <div>${product.title}</div>
              </a>
              <div class="rating">
                  ${Array(product.rating).fill("★").join("")}
                  ${Array(5 - product.rating)
                    .fill("☆")
                    .join("")}
              </div>
              <div class="price">${product.price}</div>
          </div>`,
      )
      .join("")
  }
  
  