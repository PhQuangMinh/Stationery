import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SignUp.css';
import { BASE_API_URL } from '../../../utils/constants';

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    address: '',
    phone: ''
  });
  const [errors, setErrors] = useState({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
    // Clear errors when user starts typing
    if (errors[id]) {
      setErrors(prev => ({
        ...prev,
        [id]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Họ tên không được để trống';
    }
    if (!formData.username.trim()) {
      newErrors.username = 'Tên đăng nhập không được để trống';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email không được để trống';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }
    if (!formData.password) {
      newErrors.password = 'Mật khẩu không được để trống';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Số điện thoại không được để trống';
    }
    if (!formData.address.trim()) {
      newErrors.address = 'Địa chỉ không được để trống';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      const response = await fetch(`${BASE_API_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Đăng ký thất bại');
      }

      setShowSuccessModal(true);
      setTimeout(() => {
        setShowSuccessModal(false);
        navigate('/login');
      }, 2000);
    } catch (error) {
      console.error('Error:', error);
      alert(error.message || 'Đã có lỗi xảy ra khi đăng ký');
    }
  };

  return (
    <div className="container">
      <div className="navigation">
        <a href="/" className="text-dark text-decoration-none">Trang chủ</a>
      </div>
      <hr />
      
      <div className="form-container">
        <h1 className="signup-title">Đăng ký tài khoản</h1>
        <p className="login-text">
          Đã có tài khoản? <a href="/login">Đăng nhập</a>
        </p>

        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">
              Họ tên<span className="required">*</span>
            </label>
            <input
              type="text"
              className={`form-control ${errors.name ? 'is-invalid' : ''}`}
              id="name"
              value={formData.name}
              onChange={handleChange}
            />
            {errors.name && (
              <div className="invalid-feedback">
                {errors.name}
              </div>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="username" className="form-label">
              Tên đăng nhập<span className="required">*</span>
            </label>
            <input
              type="text"
              className={`form-control ${errors.username ? 'is-invalid' : ''}`}
              id="username"
              value={formData.username}
              onChange={handleChange}
            />
            {errors.username && (
              <div className="invalid-feedback">
                {errors.username}
              </div>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email<span className="required">*</span>
            </label>
            <input
              type="email"
              className={`form-control ${errors.email ? 'is-invalid' : ''}`}
              id="email"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && (
              <div className="invalid-feedback">
                {errors.email}
              </div>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Mật khẩu<span className="required">*</span>
            </label>
            <input
              type="password"
              className={`form-control ${errors.password ? 'is-invalid' : ''}`}
              id="password"
              value={formData.password}
              onChange={handleChange}
            />
            {errors.password && (
              <div className="invalid-feedback">
                {errors.password}
              </div>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="phone" className="form-label">
              Số điện thoại<span className="required">*</span>
            </label>
            <input
              type="tel"
              className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
              id="phone"
              value={formData.phone}
              onChange={handleChange}
            />
            {errors.phone && (
              <div className="invalid-feedback">
                {errors.phone}
              </div>
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="address" className="form-label">
              Địa chỉ<span className="required">*</span>
            </label>
            <input
              type="text"
              className={`form-control ${errors.address ? 'is-invalid' : ''}`}
              id="address"
              value={formData.address}
              onChange={handleChange}
            />
            {errors.address && (
              <div className="invalid-feedback">
                {errors.address}
              </div>
            )}
          </div>

          <div className="d-flex justify-content-center">
            <button type="submit" className="btn btn-primary btn-signup">
              Đăng ký
            </button>
          </div>
        </form>
      </div>

      {/* Success Modal */}
      <div className={`modal-backdrop fade ${showSuccessModal ? 'show' : 'd-none'}`} style={{ display: showSuccessModal ? 'block' : 'none' }}></div>
      <div className={`modal fade ${showSuccessModal ? 'show' : ''}`} style={{ display: showSuccessModal ? 'block' : 'none' }}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body text-center py-4">
              <i className="fas fa-check-circle text-success mb-3" style={{ fontSize: '3rem' }}></i>
              <h5 className="modal-title">Đăng ký thành công!</h5>
              <p className="mb-0">Bạn sẽ được chuyển đến trang đăng nhập...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp; 