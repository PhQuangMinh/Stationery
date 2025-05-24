import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Header from '../header/Header';
import Footer from '../footer/Footer';
import './LandingPage.css';
import { BASE_API_URL } from '../../../utils/constants';
import ChatBox from '../chat/ChatBox';

const LandingPage = () => {
  const [categories, setCategories] = useState([]);
  const [discountProducts, setDiscountProducts] = useState([]);
  const [categoryProducts, setCategoryProducts] = useState({});
  const [selectedCategories, setSelectedCategories] = useState({});

  const loadCategoryProducts = async (categoryName) => {
    try {
      const response = await fetch(`${BASE_API_URL}/products/random/${categoryName}`);
      const data = await response.json();
      console.log("product: ", categoryName, data);
      return data.data || [];
    } catch (error) {
      console.error('Error loading category products:', error);
      return [];
    }
  };

  const loadCategoryProductsAndRender = useCallback(async (categoryName, productGridId, categoryId) => {
    try {
      const products = await loadCategoryProducts(categoryName);
      setCategoryProducts(prev => ({
        ...prev,
        [categoryName]: products
      }));
      setSelectedCategories(prev => ({
        ...prev,
        [categoryId]: categoryName
      }));
    } catch (error) {
      console.error('Error loading category products:', error);
    }
  }, []);

  const loadCategories = async () => {
    try {
      const response = await fetch(`${BASE_API_URL}/categories/tree`);
      const data = await response.json();
      setCategories(data.data || []);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const loadDiscountProducts = async () => {
    try {
      const response = await fetch(`${BASE_API_URL}/products/random-discount`);
      const data = await response.json();
      setDiscountProducts(data.data || []);
    } catch (error) {
      console.error('Error loading discount products:', error);
    }
  };

  useEffect(() => {
    loadCategories();
    loadDiscountProducts();
  }, []);

  useEffect(() => {
    const loadInitialProducts = async () => {
      if (categories.length > 0) {
        for (const category of categories) {
          if (category.children && category.children.length > 0) {
            const firstChild = category.children[0];
            await loadCategoryProductsAndRender(firstChild.name, `productGrid${category.id}`, category.id);
          } else {
            await loadCategoryProductsAndRender(category.name, `productGrid${category.id}`, category.id);
          }
        }
      }
    };
    loadInitialProducts();
  }, [categories, loadCategoryProductsAndRender]);

  useEffect(() => {
    // Get URL parameters
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const username = params.get('username');

    // If token and username are present in URL
    if (token && username) {
      // Store in localStorage
      localStorage.setItem('accessToken', token);
      localStorage.setItem('username', username);
      
      // Clean up URL parameters by replacing current URL without parameters
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []); // Empty dependency array means this runs once when component mounts

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price) + ' đ';
  };

  const generateRatingStars = (rating) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  const renderProductCard = (product) => {
    const discountPrice = product.price * (100 - product.discount) / 100;
    return (
      <div className="col-12 col-sm-6 col-lg-3" key={product.id}>
        <div className="product-card" onClick={() => window.location.href = `/product/${product.id}`}>
          {product.discount > 0 && (
            <div className="discount-badge">
              {product.discount}% OFF
            </div>
          )}
          <div className="product-image-container">
            <img 
              src={product.imageUrl} 
              alt={product.name} 
              className="product-image"
            />
          </div>
          <div className="product-info">
            <div>
              <h3 className="product-title text-truncate">
                {product.name}
              </h3>
              <div className="rating">
                {generateRatingStars(5)}
              </div>
            </div>
            <div className="price">
              <span className="price-value">
                {formatPrice(discountPrice)} đ
              </span>
              {product.discount > 0 && (
                <span className="original-price">
                  {formatPrice(product.price)} đ
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderSection = (title, imageUrl, products) => (
    <div className="container section-container">
      <div className="row">
        <div className="col-12 text-center">
          <div className="promotion text-center text-danger fw-bold fs-3 section-title">
            {title}
          </div>
        </div>
      </div>
      <div className="section-divider">
        <hr />
      </div>
      <div className="container py-4">
        <div className="row g-4">
          {products.map(product => renderProductCard(product))}
        </div>
      </div>
    </div>
  );

  const renderSectionBelow = (category, sectionId) => {
    const navIdNum = sectionId.slice(-1);
    const productGridId = `productGrid${navIdNum}`;
    const navId = `navId${navIdNum}`;
    
    const selectedCategoryName = selectedCategories[category.id] || 
      (category.children && category.children.length > 0 ? category.children[0].name : category.name);
    
    const currentProducts = categoryProducts[selectedCategoryName];

    return (
      <>
        <div className="container">
          <div className="category-header-container">
            <div className="sectionbelow">
              {category.name}
            </div>
            <div className="category-nav-container">
              <nav className="navbar navbar-expand-lg p-0">
                <ul className="navbar-nav" id={navId}>
                  {category.children && category.children.map(child => (
                    <li key={child.id} className="nav-item">
                      <button 
                        className={`nav-link border-0 bg-transparent ${selectedCategoryName === child.name ? 'text-danger' : ''}`}
                        onClick={() => loadCategoryProductsAndRender(child.name, productGridId, category.id)}
                      >
                        {child.name}
                      </button>
                    </li>
                  ))}
                  <li className="nav-item">
                    <Link 
                      className="nav-link text-danger"
                      to={`/catalog?category=${encodeURIComponent(category.name)}`}
                    >
                      Xem tất cả
                    </Link>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
        <div className="container mt-3">
          <div className="row">
            <div className="col-lg-12">
              <div className="row g-4" id={productGridId}>
                {currentProducts && currentProducts.length > 0 ? (
                  currentProducts.map(product => renderProductCard(product))
                ) : (
                  <div className="col-12 text-center py-5">
                    <div className="text-muted">
                      <i className="fas fa-box-open me-2" style={{ fontSize: '48px' }}></i>
                      <h4 className="mt-3">Không có sản phẩm nào trong danh mục này</h4>
                      <p>Vui lòng thử danh mục khác hoặc quay lại sau.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

  return (
    <div>
      <Header />
      <div className="banner-container">
        <img 
          src="wonderline-banner.png"
          alt="Cùng sáng tạo với Wonderline" 
          className="banner"
        />
      </div>
      
      {discountProducts && discountProducts.length > 0 ? (
        renderSection(
          'Sản phẩm khuyến mãi',
          './frontend/src/img/landingpage/sale.png',
          discountProducts
        )
      ) : (
        <div className="container text-center py-5">
          <div className="text-muted empty-state">
            <i className="fas fa-percentage empty-state-icon"></i>
            <h4 className="empty-state-title">Không có sản phẩm khuyến mãi</h4>
            <p>Vui lòng quay lại sau để xem các sản phẩm khuyến mãi mới.</p>
          </div>
        </div>
      )}

      {categories.map(category => (
        <div key={category.id} id={`section${category.id}`} className="category-section">
          {renderSectionBelow(category, `section${category.id}`)}
        </div>
      ))}
      <Footer />
      <ChatBox />
    </div>
  );
};

export default LandingPage;