import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { redirectByRole } from './utils/roleCheck';

// Components
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Unauthorized from './pages/Unauthorized';

// Customer Pages
import ProductList from './pages/Customer/ProductList';
import Cart from './pages/Customer/Cart';
import OrderSuccess from './pages/Customer/OrderSuccess';
import CustomerProfile from './pages/Customer/Profile';
import MyOrders from './pages/Customer/MyOrders';

// Staff Pages
import StaffDashboard from './pages/Staff/StaffDashboard';
import OrderDetails from './pages/Staff/OrderDetails';
import StaffProfile from './pages/Staff/Profile';

const Home = () => {
  const { user, isAuthenticated } = useAuth();
  

  if (isAuthenticated) {
    if (user?.role === 'staff') {
      return <Navigate to="/staff/dashboard" replace />;
    } else if (user?.role === 'customer') {
      return <Navigate to="/products" replace />;
    }
  }
  
  return <Navigate to="/products" replace />;
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            
            
            <Route path="/" element={<Home />} />
            
            {/* Public Product Route - anyone can browse */}
            <Route path="/products" element={<ProductList />} />
            
            {/* Customer Routes */}
            <Route
              path="/customer/products"
              element={
                <ProtectedRoute allowedRoles={['customer']}>
                  <ProductList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/customer/cart"
              element={
                <ProtectedRoute allowedRoles={['customer']}>
                  <Cart />
                </ProtectedRoute>
              }
            />
            <Route
              path="/customer/order-success"
              element={
                <ProtectedRoute allowedRoles={['customer']}>
                  <OrderSuccess />
                </ProtectedRoute>
              }
            />
            <Route
              path="/customer/profile"
              element={
                <ProtectedRoute allowedRoles={['customer']}>
                  <CustomerProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/customer/orders"
              element={
                <ProtectedRoute allowedRoles={['customer']}>
                  <MyOrders />
                </ProtectedRoute>
              }
            />
            
            {/* Staff Routes */}
            <Route
              path="/staff/dashboard"
              element={
                <ProtectedRoute allowedRoles={['staff']}>
                  <StaffDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/staff/orders/:id"
              element={
                <ProtectedRoute allowedRoles={['staff']}>
                  <OrderDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/staff/profile"
              element={
                <ProtectedRoute allowedRoles={['staff']}>
                  <StaffProfile />
                </ProtectedRoute>
              }
            />
            
            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;