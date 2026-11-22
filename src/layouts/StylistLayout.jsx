import { Link, Outlet } from 'react-router-dom';

export default function StylistLayout() {
  return (
    <div className="min-h-screen flex">
      <aside className="w-60 border-r p-4 flex flex-col gap-2">
        <div className="font-semibold text-lg mb-4">Salon — Stylist</div>
        <Link to="/stylist" className="py-1">Dashboard</Link>
        <Link to="/stylist/schedule" className="py-1">My Schedule</Link>
        <Link to="/stylist/appointments" className="py-1">Appointments</Link>
        <Link to="/stylist/profile" className="py-1">Profile</Link>
        <hr className="my-4" />
        <Link to="/" className="text-sm text-gray-500">Customer View</Link>
        <Link to="/admin" className="text-sm text-gray-500">Admin View</Link>
      </aside>

      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}
