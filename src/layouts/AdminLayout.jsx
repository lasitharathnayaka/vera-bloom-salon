import { Link, Outlet } from 'react-router-dom';

export default function AdminLayout() {
  return (
    <div className="min-h-screen flex">
      <aside className="w-60 border-r p-4 flex flex-col gap-2">
        <div className="font-semibold text-lg mb-4">Salon — Admin</div>
        <Link to="/admin" className="py-1">Dashboard</Link>
        <Link to="/admin/appointments" className="py-1">Appointments</Link>
        <Link to="/admin/services" className="py-1">Services</Link>
        <Link to="/admin/stylists" className="py-1">Stylists</Link>
        <Link to="/admin/customers" className="py-1">Customers</Link>
        <hr className="my-4" />
        <Link to="/" className="text-sm text-gray-500">Customer View</Link>
        <Link to="/stylist" className="text-sm text-gray-500">Stylist View</Link>
      </aside>

      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}
