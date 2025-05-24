import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from '../components/user/landingpage/LandingPage';
import Login from '../components/user/auth/Login';
import SignUp from '../components/user/auth/SignUp';
import ProductDetail from '../components/user/detailproduct/ProductDetail';
import Cart from '../components/user/cart/Cart';
import Checkout from '../components/user/checkout/Checkout';
import DetailCatalog from '../components/user/detailcatalog/DetailCatalog';
import UserOrders from '../components/user/order/UserOrders';
import OrderDetail from '../components/user/order/OrderDetail';

const UserRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/product/:id" element={<ProductDetail />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/catalog/:categoryName" element={<DetailCatalog />} />
      <Route path="/orders" element={<UserOrders />} />
      <Route path="/order/:id" element={<OrderDetail />} />
    </Routes>
  );
};

export default UserRoutes; 