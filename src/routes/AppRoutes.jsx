import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import CustomerLayout from '../layouts/CustomerLayout';
import AdminLayout from '../layouts/AdminLayout';
import StylistLayout from '../layouts/StylistLayout';

// Auth Pages
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';

// Customer Pages
import HomePage from '../pages/customer/HomePage';
import ServicesPage from '../pages/customer/ServicesPage';
import BridalPage from '../pages/customer/BridalPage';
import LookbookPage from '../pages/customer/LookbookPage';
import BookingPage from '../pages/customer/BookingPage';
import CustomerProfilePage from '../pages/customer/ProfilePage';

// Admin Pages
import AdminDashboardPage from '../pages/admin/AdminDashboardPage';
import ManageAppointmentsPage from '../pages/admin/ManageAppointmentsPage';
import ManageServicesPage from '../pages/admin/ManageServicesPage';
import ManageStylistsPage from '../pages/admin/ManageStylistsPage';
import ManageCustomersPage from '../pages/admin/ManageCustomersPage';

// Stylist Pages
import StylistDashboardPage from '../pages/stylist/StylistDashboardPage';
import StylistSchedulePage from '../pages/stylist/StylistSchedulePage';
import StylistAppointmentsPage from '../pages/stylist/StylistAppointmentsPage';
import StylistProfilePage from '../pages/stylist/StylistProfilePage';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Auth Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Customer Routes */}
      <Route path="/" element={<CustomerLayout />}>
        <Route index element={<HomePage />} />
        <Route path="services" element={<ServicesPage />} />
        <Route path="bridal" element={<BridalPage />} />
        <Route path="lookbook" element={<LookbookPage />} />
        <Route path="booking" element={<BookingPage />} />
      </Route>

      {/* Customer Sanctuary Portal (dedicated sidebar layout) */}
      <Route path="/profile" element={<CustomerProfilePage />} />
      <Route path="/appointments" element={<Navigate to="/profile" replace />} />

      {/* Admin Routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboardPage />} />
        <Route path="appointments" element={<ManageAppointmentsPage />} />
        <Route path="services" element={<ManageServicesPage />} />
        <Route path="stylists" element={<ManageStylistsPage />} />
        <Route path="customers" element={<ManageCustomersPage />} />
      </Route>

      {/* Stylist Routes */}
      <Route path="/stylist" element={<StylistLayout />}>
        <Route index element={<StylistDashboardPage />} />
        <Route path="schedule" element={<StylistSchedulePage />} />
        <Route path="appointments" element={<StylistAppointmentsPage />} />
        <Route path="profile" element={<StylistProfilePage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
