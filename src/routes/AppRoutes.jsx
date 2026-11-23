import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import { ROLES } from '../utils/constants';

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
import SpecialistsPage from '../pages/customer/SpecialistsPage';
import BookingPage from '../pages/customer/BookingPage';

// Admin Pages
import AdminDashboardPage from '../pages/admin/AdminDashboardPage';
import ManageAppointmentsPage from '../pages/admin/ManageAppointmentsPage';
import BridalInquiriesPage from '../pages/admin/BridalInquiriesPage';
import ManageServicesPage from '../pages/admin/ManageServicesPage';
import ManageStylistsPage from '../pages/admin/ManageStylistsPage';
import ManageCustomersPage from '../pages/admin/ManageCustomersPage';
import PosCheckoutPage from '../pages/admin/PosCheckoutPage';
import AdminAnalyticsPage from '../pages/admin/AdminAnalyticsPage';

// Stylist Pages
import StylistDashboardPage from '../pages/stylist/StylistDashboardPage';
import ClientFormulasPage from '../pages/stylist/ClientFormulasPage';
import StylistSchedulePage from '../pages/stylist/StylistSchedulePage';
import StylistEarningsPage from '../pages/stylist/StylistEarningsPage';
import StylistAppointmentsPage from '../pages/stylist/StylistAppointmentsPage';
import StylistProfilePage from '../pages/stylist/StylistProfilePage';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Auth Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Public Browsing + Authenticated Booking */}
      <Route path="/" element={<CustomerLayout />}>
        <Route index element={<HomePage />} />
        <Route path="services" element={<ServicesPage />} />
        <Route path="bridal" element={<BridalPage />} />
        <Route path="lookbook" element={<LookbookPage />} />
        <Route path="specialists" element={<SpecialistsPage />} />

        {/* Booking requires Sign In */}
        <Route element={<ProtectedRoute />}>
          <Route path="booking" element={<BookingPage />} />
        </Route>
      </Route>

      {/* Redirect legacy profile/appointments paths directly to Booking */}
      <Route path="/profile" element={<Navigate to="/booking" replace />} />
      <Route path="/appointments" element={<Navigate to="/booking" replace />} />

      {/* Role-Protected Admin Routes */}
      <Route element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]} />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboardPage />} />
          <Route path="appointments" element={<ManageAppointmentsPage />} />
          <Route path="bridal" element={<BridalInquiriesPage />} />
          <Route path="services" element={<ManageServicesPage />} />
          <Route path="stylists" element={<ManageStylistsPage />} />
          <Route path="customers" element={<ManageCustomersPage />} />
          <Route path="pos" element={<PosCheckoutPage />} />
          <Route path="analytics" element={<AdminAnalyticsPage />} />
        </Route>
      </Route>

      {/* Role-Protected Stylist Routes */}
      <Route
        element={
          <ProtectedRoute allowedRoles={[ROLES.STYLIST, ROLES.ADMIN]} />
        }
      >
        <Route path="/stylist" element={<StylistLayout />}>
          <Route index element={<StylistDashboardPage />} />
          <Route path="formulas" element={<ClientFormulasPage />} />
          <Route path="schedule" element={<StylistSchedulePage />} />
          <Route path="earnings" element={<StylistEarningsPage />} />
          <Route path="appointments" element={<StylistAppointmentsPage />} />
          <Route path="profile" element={<StylistProfilePage />} />
        </Route>
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
