import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-md-4 mb-4 mb-md-0">
            <img src="/img/logo.png" alt="CooVinh Logo" className="company-logo" />
            <div className="contact-info">
              <p className="mb-1"><strong>Địa chỉ:</strong> Diên phong, Diên Châu, Nghệ An</p>
              <p className="mb-1"><strong>Điện thoại:</strong> 1234567890</p>
              <p className="mb-1"><strong>Email:</strong> phamquangminh15012004@gmail.com</p>
            </div>
          </div>

          <div className="col-md-4 mb-4 mb-md-0">
            <div className="hotline-section">
              <h3>Hotline liên hệ</h3>
              <div className="hotline-icon">
                <i className="fas fa-phone-alt fa-2x mb-2"></i>
              </div>
              <div className="hotline-number">12345678901</div>
              <div className="hotline-hours">07h00 - 21h00 (T2-CN)</div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="social-links">
              <h3>Kết nối với chúng tôi</h3>
              <div className="social-icons">
                <a href="/img/logo/logo-facebook.png" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                  <i className="fab fa-facebook"></i>
                </a>
                <a href="/img/logo/logo-instagram.png" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                  <i className="fab fa-instagram"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 