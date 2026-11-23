import { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  BarChart3,
  Bell,
  Calendar,
  CreditCard,
  ExternalLink,
  Heart,
  LayoutDashboard,
  LogOut,
  Plus,
  Search,
  Sparkles,
  UserCheck,
  Users,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import NotificationBell from '../components/common/NotificationBell';

const ADMIN_NAV_LINKS = [
  { label: 'Overview', to: '/admin', icon: LayoutDashboard, end: true },
  { label: 'Appointment Calendar', to: '/admin/appointments', icon: Calendar },
  { label: 'Bridal Inquiries', to: '/admin/bridal', icon: Heart, badge: '4' },
  { label: 'Services & Pricing', to: '/admin/services', icon: Sparkles },
  { label: 'Specialists', to: '/admin/stylists', icon: UserCheck },
  { label: 'Client CRM', to: '/admin/customers', icon: Users },
  { label: 'POS Checkout', to: '/admin/pos', icon: CreditCard },
  { label: 'Analytics', to: '/admin/analytics', icon: BarChart3 },
];

export default function AdminLayout() {
  const [searchQuery, setSearchQuery] = useState('');
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F3EE] text-[#2A2927] md:flex-row">
      {/* ================= MODERN DARK-SAGE EXECUTIVE SIDEBAR ================= */}
      <aside className="flex w-full shrink-0 flex-col justify-between bg-[#222B23] px-5 py-6 text-[#E6E2DA] md:w-64">
        <div>
          {/* Brand */}
          <Link to="/admin" className="flex items-center gap-3 px-1">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[#EFE0C6]/25 bg-[#2D392E] text-[#EFE0C6]">
              <svg
                width="17"
                height="17"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M12 21V9" />
                <path d="M12 13C12 8.5 8.5 5.5 4 5.5C4 10 7 13 12 13Z" />
                <path d="M12 10.5C12 6.5 15 4 19.5 4C19.5 8 16.5 10.5 12 10.5Z" />
              </svg>
            </span>
            <div>
              <p className="font-serif text-[15px] font-semibold tracking-[0.18em] text-[#FAF8F5]">
                VERA &amp; BLOOM
              </p>
              <p className="text-[9px] font-semibold tracking-[0.26em] text-[#EFE0C6] uppercase">
                Owner Console
              </p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="mt-8 flex flex-row gap-1.5 overflow-x-auto md:flex-col">
            {ADMIN_NAV_LINKS.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.label}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `flex shrink-0 items-center justify-between gap-3 rounded-xl px-3.5 py-2.5 text-[12.5px] transition-all ${
                      isActive && !item.to.includes('#')
                        ? 'bg-[#EFE0C6] font-semibold text-[#222B23] shadow-sm'
                        : 'font-normal text-[#C8D0C9] hover:bg-white/8 hover:text-[#FAF8F5]'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span className="flex items-center gap-3">
                        <Icon
                          className={`h-4 w-4 shrink-0 ${
                            isActive && !item.to.includes('#')
                              ? 'text-[#222B23]'
                              : 'text-[#EFE0C6]/80'
                          }`}
                          strokeWidth={1.7}
                        />
                        <span>{item.label}</span>
                      </span>
                      {item.badge && (
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                            isActive && !item.to.includes('#')
                              ? 'bg-[#222B23] text-[#EFE0C6]'
                              : 'bg-[#4A5B4B] text-[#FAF8F5]'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Bottom Utility Links */}
        <div className="mt-8 hidden space-y-2 border-t border-white/10 pt-4 md:block">
          <Link
            to="/"
            className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-[12px] text-[#B9C2BA] transition-colors hover:bg-white/8 hover:text-[#FAF8F5]"
          >
            <ExternalLink className="h-3.5 w-3.5 text-[#EFE0C6]" />
            <span>View Live Website</span>
          </Link>
          <button
            type="button"
            onClick={handleSignOut}
            className="flex w-full cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2 text-[12px] text-[#B9C2BA] transition-colors hover:bg-white/8 hover:text-[#FAF8F5]"
          >
            <LogOut className="h-3.5 w-3.5 text-[#EFE0C6]" />
            <span>Sign Out</span>
          </button>
          <p className="px-3 pt-1 text-[10px] text-[#7D8A7E]">
            Owner Portal v3.0
          </p>
        </div>
      </aside>

      {/* ================= MAIN COLUMN ================= */}
      <div className="flex flex-1 flex-col overflow-x-hidden">
        {/* Frosted Top Utility Header */}
        <header className="sticky top-0 z-30 border-b border-[#E6E2DA] bg-[#FAF8F5]/90 backdrop-blur-md">
          <div className="flex items-center justify-between gap-4 px-6 py-3.5 lg:px-10">
            <div className="flex items-center gap-5">
              <div className="relative w-56 sm:w-72">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#8A867E]" />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Quick client, booking, or invoice search..."
                  className="w-full rounded-full border border-[#E5E1D8] bg-[#F3F0EA] py-2 pl-9 pr-4 text-[12px] text-[#2A2927] placeholder:text-[#8A867E] focus:border-[#4A5B4B] focus:bg-[#FAF8F5] focus:outline-none"
                />
              </div>

              <span className="hidden items-center gap-2 rounded-full bg-[#EFECE6] px-3 py-1 text-[11px] font-medium text-[#5F5C55] lg:inline-flex">
                <span className="h-1.5 w-1.5 rounded-full bg-[#4A5B4B]" />
                Sanctuary Open &middot; 8 of 9 Active
              </span>
            </div>

            <div className="flex items-center gap-2.5">
              <Link
                to="/booking"
                className="inline-flex items-center gap-1.5 rounded-full bg-[#4A5B4B] px-4 py-2 text-[12px] font-medium tracking-wide text-[#FAF8F5] shadow-xs transition-colors hover:bg-[#3B4A3C]"
              >
                <Plus className="h-3.5 w-3.5" strokeWidth={2.2} />
                <span>Walk-in Booking</span>
              </Link>

              <NotificationBell />

              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#222B23] text-[11px] font-semibold tracking-wider text-[#EFE0C6]">
                VB
              </span>
            </div>
          </div>
        </header>

        {/* Main Workspace */}
        <main className="flex-1 px-6 py-8 lg:px-10">
          <Outlet context={{ searchQuery }} />
        </main>
      </div>
    </div>
  );
}
