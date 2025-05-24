import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import 'bootstrap-icons/font/bootstrap-icons.css';
import UserRoutes from './routes/UserRoutes';
import AdminRoutes from './routes/AdminRoutes';
import './App.css';
import { SSRProvider } from 'react-bootstrap';

function App() {
  return (
    <SSRProvider>
      <BrowserRouter>
        <Routes>
          {/* Admin Routes */}
          <Route path="/admin/*" element={<AdminRoutes />} />
          
          {/* User Routes */}
          <Route path="/*" element={<UserRoutes />} />
        </Routes>
      </BrowserRouter>
    </SSRProvider>
  );
}

export default App;
