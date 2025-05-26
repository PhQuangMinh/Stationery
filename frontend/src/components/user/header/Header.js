import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';
import { BASE_API_URL } from '../../../utils/constants';

const Header = () => {
  const [username, setUsername] = useState('');
  const [cartCount, setCartCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    checkLoginStatus();
    fetchCategories();
  }, []);

  const checkLoginStatus = () => {
    const token = localStorage.getItem('accessToken');
    const storedUsername = localStorage.getItem('username');
    if (token && storedUsername) {
      setUsername(storedUsername);
      updateCartCount();
    }
  };

  const updateCartCount = async () => {
    const token = localStorage.getItem('accessToken');
    const username = localStorage.getItem('username');
    if (!token || !username) return;

    try {
      const response = await fetch(`${BASE_API_URL}/user/${username}/carts/get-cart`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setCartCount(data.data.cartItems?.length || 0);
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${BASE_API_URL}/categories/tree`);
      const data = await response.json();
      setCategories(data.data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleSearch = async (query) => {
    if (query.length < 1) {
      setSearchResults([]);
      return;
    }

    try {
      const response = await fetch(
        `${BASE_API_URL}/products/search?name=${encodeURIComponent(query)}`
      );
      const data = await response.json();
      console.log(data);
      setSearchResults(data.data?.content || []);
    } catch (error) {
      console.error('Error searching products:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('username');
    setUsername('');
    navigate('/login');
  };

  return (
    <header>
      <div className="top-bar">
        <Link to="/" id="home-link">Trang chủ</Link>
        <p>Chào mừng bạn đến Tri Thức Vàng | Email: info@trithucvang.vn</p>
        <div className="user-options">
          {username ? (
            <>
              <span style={{ color: 'white' }}>{username}</span> | 
              <a href="#" onClick={handleLogout} style={{ color: 'white', textDecoration: 'none' }}>
                Đăng xuất
              </a>
            </>
          ) : (
            <>
              <Link to="/signup" id="register-link">Đăng ký</Link> | 
              <Link to="/login" id="login-link">Đăng nhập</Link>
            </>
          )}
        </div>
      </div>
      <div className="container">
        <div className="main-header">
          <div className="col-lg-2">
            <img src="image.png" alt="VP Logo" className="logo" />
          </div>
          <div className="col-lg-7">
            <div className="search-container">
              <div className="search-bar d-flex">
                <input
                  type="text"
                  id="searchInput"
                  className="form-control me-2"
                  placeholder="Tìm kiếm sản phẩm..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    handleSearch(e.target.value);
                  }}
                />
                <button className="btn btn-primary">🔍</button>
              </div>
              {searchResults.length > 0 && (
                <div className="search-results">
                  {searchResults.map(product => (
                    <Link
                      key={product.id}
                      to={`/product/${product.id}`}
                      className="search-item"
                      style={{ textDecoration: 'none', color: 'inherit' }}
                    >
                      <div className="search-item-content">
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="search-thumbnail"
                        />
                        <div className="search-item-details">
                          <div className="search-item-name">{product.name}</div>
                          <div className="search-item-price">
                            {new Intl.NumberFormat('vi-VN').format(product.price)} đ
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="col-lg-3">
            <div className="d-flex justify-content-between align-items-center">
              <div className="contact">
                <p className="mb-0">📞 Gọi đặt hàng</p>
                <strong>06677028</strong>
              </div>
              <div className="cart-order-container d-flex gap-3">
                <Link to="/cart" className="text-danger text-decoration-none">
                  🛒 Giỏ hàng ({cartCount} sản phẩm)
                </Link>
                {username && (
                  <Link to="/orders" className="text-danger text-decoration-none">
                    📦 Đơn hàng
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <nav>
        <ul id="menu">
          {categories.map(category => (
            <li key={category.id}>
              <Link to={`/catalog/${category.name}`}>{category.name}</Link>
              {category.children && category.children.length > 0 && (
                <ul className="submenu">
                  {category.children.map(child => (
                    <li key={child.id}>
                      <Link to={`/category/${child.name}`}>{child.name}</Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
};

export default Header; 