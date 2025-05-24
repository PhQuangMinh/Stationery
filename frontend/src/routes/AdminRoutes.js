import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from '../components/admin/Sidebar/Sidebar';
import Statistics from '../components/admin/Statistics/Statistics';
import ProductManagement from '../components/admin/ProductManagement/ProductManagement';
import CategoryManagement from '../components/admin/CategoryManagement/CategoryManagement';
import BrandManagement from '../components/admin/BrandManagement/BrandManagement';
import OrderManagement from '../components/admin/OrderManagement/orderManagement';
import UserManagement from '../components/admin/UserManagement/UserManagement';
import ReviewManagement from '../components/admin/ReviewManagement/ReviewManagement';
import NotificationManagement from '../components/admin/NotificationManagement/NotificationManagement';
// import AdminLogin from '../components/admin/login/AdminLogin';
// import Statistic from '../components/admin/statistics/Statistic';

const AdminRoutes = () => {
  // Kiểm tra xem người dùng có phải là admin không
  const isAdmin = localStorage.getItem('isAdmin') === 'true';

  if (!isAdmin) {
    // Nếu không phải admin, chuyển hướng về trang login
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="admin-content">
        <Routes>
          {/* Chuyển hướng từ /admin sang /admin/statistics */}
          <Route path="/" element={<Navigate to="/admin/statistics" replace />} />
          <Route path="/statistics" element={<Statistics />} />
          <Route path="/products" element={<ProductManagement />} />
          <Route path="/categories" element={<CategoryManagement />} />
          <Route path="/brands" element={<BrandManagement />} />
          <Route path="/orders" element={<OrderManagement />} />
          <Route path="/users" element={<UserManagement />} />
          <Route path="/reviews" element={<ReviewManagement />} />
          <Route path="/notifications" element={<NotificationManagement />} />
          {/* <Route path="/admin/login" element={<AdminLogin />} /> */}
        </Routes>
      </div>
    </div>
  );
};

export default AdminRoutes; 