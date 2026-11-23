import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ROLES } from '../utils/constants';

export default function ProtectedRoute({ allowedRoles, redirectMessage }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FAF8F5] text-[#222B23]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#253026]/20 border-t-[#253026]" />
          <p className="text-xs font-medium tracking-[0.2em] text-[#7A766E] uppercase">
            Verifying Sanctuary Session
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    const defaultMsg = location.pathname.startsWith('/admin')
      ? 'Please sign in with an Admin account to access the Owner Console.'
      : location.pathname.startsWith('/stylist')
        ? 'Please sign in with a Specialist account to access the Stylist Portal.'
        : location.pathname.startsWith('/booking')
          ? 'Please sign in or create an account to reserve your sanctuary ritual.'
          : 'Please sign in to access your Sanctuary profile.';

    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location,
          message: redirectMessage || defaultMsg,
        }}
      />
    );
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    const fallbackRoute =
      user.role === ROLES.ADMIN
        ? '/admin'
        : user.role === ROLES.STYLIST
          ? '/stylist'
          : '/';
    return <Navigate to={fallbackRoute} replace />;
  }

  return <Outlet />;
}
