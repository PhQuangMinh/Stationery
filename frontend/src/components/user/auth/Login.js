import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import { BASE_API_URL } from '../../../utils/constants';
import Header from '../header/Header';
import Footer from '../footer/Footer';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
    // Xóa lỗi khi user bắt đầu gõ
    if (errors[id]) {
      setErrors(prev => ({
        ...prev,
        [id]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username.trim()) {
      newErrors.username = 'Tên đăng nhập không được để trống';
    }
    if (!formData.password) {
      newErrors.password = 'Mật khẩu không được để trống';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      const response = await fetch(`${BASE_API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Đăng nhập thất bại');
      }

      if (data.data) {
        // Lưu thông tin đăng nhập
        localStorage.setItem('accessToken', data.data.accessToken);
        localStorage.setItem('refreshToken', data.data.refreshToken);
        localStorage.setItem('username', formData.username);
        localStorage.setItem('isAdmin', data.data.admin);
        
        // Điều hướng dựa vào role
        if (data.data.admin) {
          // Nếu là admin, chuyển đến trang thống kê admin
          navigate('/admin/statistics');
        } else {
          // Nếu là user thường, chuyển đến trang chủ
          navigate('/');
        }
      }
    } catch (error) {
      console.error('Error:', error);
      alert(error.message || 'Tên đăng nhập hoặc mật khẩu không đúng');
    }
  };

  return (
    
    <div className="container">
      <div className="navigation">
        <a href="/" className="text-dark text-decoration-none">Trang chủ</a>
      </div>
      <hr />
      
      <div className="form-container">
        <h1 className="login-title">Đăng nhập tài khoản</h1>
        <p className="register-text">
          Nếu chưa có có tài khoản, xin vui lòng <a href="/signup">đăng ký</a>
        </p>

        <a href={`${BASE_API_URL}/oauth2/authorization/google`} className="btn btn-google">
          <img src="google_logo.png" alt="Google icon" />
          Đăng nhập bằng Google
        </a>

        <div className="divider">
          <span className="divider-text">hoặc</span>
        </div>

        <form onSubmit={handleSubmit} noValidate>
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

          <div className="mb-4">
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

          <div className="d-flex align-items-center">
            <button type="submit" className="btn btn-primary btn-login">
              Đăng nhập
            </button>
            <a href="/forgot-password" className="forgot-password">
              Quên mật khẩu
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login; 