import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import CustomerLogin from './components/pages/customer/CustomerLogin';
import RestaurantList from './components/pages/customer/RestaurantList';
import RestaurantMenu from './components/pages/customer/RestaurantMenu';
import Checkout from './components/pages/customer/Checkout';
import OrderConfirmation from './components/pages/customer/OrderConfirmation';
import OrdersHistory from './components/pages/customer/OrdersHistory';
import CustomerProfile from './components/pages/customer/CustomerProfile';
import AdminLogin from './components/pages/admin/AdminLogin';
import AdminRegistration from './components/pages/admin/AdminRegistration';
import AdminDashboard from './components/pages/admin/AdminDashboard';
import MenuManagement from './components/pages/admin/MenuManagement';
import ProtectedRoute from './components/ProtectedRoute';
import OrderManagement from './components/pages/admin/OrderManagement';
import TableManagement from './components/pages/admin/TableManagement';
import AdminProfile from './components/pages/admin/AdminProfile';

function App() {
  return (
    <Router>
      <Routes>
        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/home" replace />} />
        
        {/* Customer routes */}
        <Route path="/home" element={<LandingPage />} />
        <Route path="/customer" element={<CustomerLogin />} />
        <Route path='/restaurants' element={<RestaurantList />} />
        <Route path='/restaurant/:id' element={<RestaurantMenu />} />
        <Route path='/checkout/:id' element={
          <ProtectedRoute allowedRoles={['customer']}>
            <Checkout />
          </ProtectedRoute>
        } />
        <Route path='/order-confirmation/:orderId' element={
          <ProtectedRoute allowedRoles={['customer']}>
            <OrderConfirmation />
          </ProtectedRoute>
        } />
        <Route path='/orders-history' element={
          <ProtectedRoute allowedRoles={['customer']}>
            <OrdersHistory />
          </ProtectedRoute>
        } />
        <Route path='/customer-profile' element={
          <ProtectedRoute allowedRoles={['customer']}>
            <CustomerProfile />
          </ProtectedRoute>
        } />

        {/* Admin routes */}
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/register" element={<AdminRegistration />} />
        <Route path="/dashboard" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/menu-management" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <MenuManagement />
          </ProtectedRoute>
        } />
        <Route path="/order-management" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <OrderManagement />
          </ProtectedRoute>
        } />
        <Route path="/table-management" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <TableManagement />
          </ProtectedRoute>
        } />
        <Route path="/admin-profile" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminProfile />
          </ProtectedRoute>
        } />

        {/* 404 fallback */}
        <Route path="*" element={<div>404 Page Not Found</div>} />
      </Routes>
    </Router>
  );
}

export default App;