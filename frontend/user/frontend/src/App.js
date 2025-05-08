import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './components/auth/Login';
import LandingPage from './components/LandingPage';
import ProductDetail from './components/ProductDetail';
import Cart from './components/Cart';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import Checkout from './components/Checkout';
import DetailCatalog from './components/DetailCatalog';
import UserOrders from './components/order/UserOrders';
import OrderDetail from './components/order/OrderDetail';
// Import các component khác ở đây

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/catalog/:categoryName" element={<DetailCatalog />} />
        <Route path="/orders" element={<UserOrders />} />
        <Route path="/order/:id" element={<OrderDetail />} />
        {/* Thêm các route khác ở đây */}
      </Routes>
    </Router>
  );
}

export default App;
