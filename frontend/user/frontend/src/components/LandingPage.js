import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import './LandingPage.css';
import { BASE_API_URL } from '../utils/constants';

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
        <div className="product-card" 
          onClick={() => window.location.href = `/product/${product.id}`}
          style={{
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            overflow: 'hidden',
            backgroundColor: 'white',
            transition: 'all 0.3s ease',
            cursor: 'pointer',
            position: 'relative',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            ':hover': {
              transform: 'translateY(-5px)',
              boxShadow: '0 5px 15px rgba(0,0,0,0.2)'
            }
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-5px)';
            e.currentTarget.style.boxShadow = '0 5px 15px rgba(0,0,0,0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
          }}
        >
          {product.discount > 0 && (
            <div className="discount-badge" style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              backgroundColor: '#ff4444',
              color: 'white',
              padding: '4px 8px',
              borderRadius: '4px',
              fontSize: '14px',
              zIndex: 1
            }}>
              {product.discount}% OFF
            </div>
          )}
          <div className="product-image-container" style={{
            width: '100%',
            height: '200px',
            overflow: 'hidden',
            marginBottom: '10px',
            padding: '10px',
            backgroundColor: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <img 
              src={product.imageUrl} 
              alt={product.name} 
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                transition: 'transform 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'scale(1.1)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'scale(1)';
              }}
            />
          </div>
          <div className="product-info" style={{ 
            padding: '15px',
            backgroundColor: '#fff',
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div>
              <h3 className="product-title text-truncate" style={{
                fontSize: '16px',
                marginBottom: '8px',
                fontWeight: '500',
                color: '#333',
                lineHeight: '1.4'
              }}>
                {product.name}
              </h3>
              <div className="rating" style={{ 
                color: '#ffd700', 
                marginBottom: '8px',
                fontSize: '14px'
              }}>
                {generateRatingStars(5)}
              </div>
            </div>
            <div className="price" style={{
              marginTop: 'auto'
            }}>
              <span style={{ 
                color: '#ff4444', 
                fontWeight: 'bold', 
                fontSize: '18px',
                display: 'block'
              }}>
                {formatPrice(discountPrice)} đ
              </span>
              {product.discount > 0 && (
                <span className="original-price" style={{
                  textDecoration: 'line-through',
                  color: '#999',
                  fontSize: '14px',
                  display: 'block',
                  marginTop: '4px'
                }}>
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
    <div className="container" style={{ marginTop: '80px' }}>
      <div className="row">
        <div className="col-12 text-center">
          <div className="promotion text-center text-danger fw-bold fs-3" style={{ marginBottom: '15px' }}>
            {title}
          </div>
        </div>
      </div>
      <div style={{ position: 'relative', width: '100%', textAlign: 'center', marginBottom: '30px' }}>
        <hr style={{ width: '100%', borderTop: '2px solid #000', margin: '0' }} />
        <div style={{ position: 'absolute', top: '0px', left: '50%', transform: 'translate(-50%)', width: '50%', height: '2px', backgroundColor: 'red' }}></div>
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
          <div className="d-flex justify-content-between align-items-center border-bottom pb-2">
            <div className="col-lg-4">
              <div className="sectionbelow fw-bold fs-5">
                {category.name}
              </div>
            </div>
            <div className="col-lg-8">
              <nav className="navbar navbar-expand-lg p-0">
                <ul className="navbar-nav" id={navId} style={{ gap: '20px' }}>
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
      <div className="banner-container" style={{ marginBottom: '30px' }}>
        <img 
          src="../img/wonderline-banner.png"
          alt="Cùng sáng tạo với Wonderline" 
          className="banner" 
          style={{ 
            width: '100%', 
            height: 'auto', 
            display: 'block',
            backgroundColor: '#f8f9fa'
          }} 
        />
      </div>
      
      {discountProducts && discountProducts.length > 0 ? (
        renderSection(
          'Sản phẩm khuyến mãi',
          'frontend/src/img/landingpage/sale.png',
          discountProducts
        )
      ) : (
        <div className="container text-center py-5">
          <div className="text-muted">
            <i className="fas fa-percentage me-2" style={{ fontSize: '48px' }}></i>
            <h4 className="mt-3">Không có sản phẩm khuyến mãi</h4>
            <p>Vui lòng quay lại sau để xem các sản phẩm khuyến mãi mới.</p>
          </div>
        </div>
      )}

      {categories.map(category => (
        <div key={category.id} id={`section${category.id}`}>
          {renderSectionBelow(category, `section${category.id}`)}
        </div>
      ))}

      <img src="/img/image.png" alt="VP Logo" className="banner" style={{ width: '100%', height: 'auto', display: 'block' }} />
      <Footer />
    </div>
  );
};

export default LandingPage;