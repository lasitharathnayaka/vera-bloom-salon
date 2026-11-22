import { useState } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { Bell, Plus, Search } from 'lucide-react';

const ADMIN_NAV_LINKS = [
  { label: 'Overview', to: '/admin', end: true },
  { label: 'Appointment Calendar', to: '/admin/appointments' },
  { label: 'Bridal Inquiries', to: '/admin/bridal' },
  { label: 'Services & Pricing', to: '/admin/services' },
  { label: 'Specialists', to: '/admin/stylists' },
  { label: 'Client CRM', to: '/admin/customers' },
  { label: 'POS Checkout', to: '/admin/pos' },
  { label: 'Analytics', to: '/admin#analytics' },
];

export default function AdminLayout() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#2A2927]">
      {/* ================= TOP ADMIN HEADER ================= */}
      <header className="sticky top-0 z-40 border-b border-[#ECE8E0] bg-[#FAF8F5]/95 backdrop-blur-sm">
        <div className="flex items-center justify-between gap-4 px-5 py-3.5 lg:px-8">
          {/* Left: Quick Search + Date */}
          <div className="flex items-center gap-6">
            <div className="relative w-56 sm:w-64">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#8A867E]" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Quick client search..."
                className="w-full rounded-lg border border-[#ECE8E0] bg-[#EFECE6] py-2 pl-9 pr-3 text-[12px] text-[#2A2927] placeholder:text-[#8A867E] focus:border-[#4A5B4B] focus:bg-[#FAF8F5] focus:outline-none"
              />
            </div>

            <span className="hidden text-[12px] text-[#7A766E] md:inline">
              Thursday, October 24, 2024
            </span>
          </div>

          {/* Right: Walk-in Booking + Notifications + VB Avatar */}
          <div className="flex items-center gap-3">
            <Link
              to="/booking"
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#4A5B4B] px-4 py-2 text-[12px] font-medium tracking-wide text-[#FAF8F5] shadow-xs transition-colors hover:bg-[#3B4A3C]"
            >
              <Plus className="h-3.5 w-3.5" strokeWidth={2.2} />
              <span>Walk-in Booking</span>
            </Link>

            <button
              type="button"
              aria-label="Notifications"
              className="relative inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-[#ECE8E0] bg-[#F2EFE9] text-[#4A5B4B] transition-colors hover:bg-[#E7E4DD]"
            >
              <Bell className="h-4 w-4" strokeWidth={1.7} />
              <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[#C85A4E]" />
            </button>

            <Link
              to="/"
              title="Back to Vera & Bloom Customer Site"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#4A5B4B] text-[11px] font-semibold tracking-wider text-[#FAF8F5] transition-colors hover:bg-[#3B4A3C]"
            >
              VB
            </Link>
          </div>
        </div>
      </header>

      {/* ================= SIDEBAR + WORKSPACE ================= */}
      <div className="flex flex-1 flex-col md:flex-row">
        {/* Left Sidebar */}
        <aside className="flex w-full shrink-0 flex-col justify-between border-b border-[#ECE8E0] bg-[#F4F2ED] px-5 py-6 md:w-56 md:border-b-0 md:border-r">
          <div>
            {/* Brand Title */}
            <Link to="/admin" className="block px-2">
              <p className="font-serif text-[14px] font-semibold tracking-[0.14em] text-[#2A2927]">
                VERA &amp; BLOOM
              </p>
              <p className="mt-0.5 text-[10px] font-semibold tracking-[0.22em] text-[#7A766E] uppercase">
                Admin
              </p>
            </Link>

            {/* Navigation */}
            <nav className="mt-7 flex flex-row gap-1 overflow-x-auto md:flex-col">
              {ADMIN_NAV_LINKS.map((item) => (
                <NavLink
                  key={item.label}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `shrink-0 rounded-lg px-3 py-2 text-[12.5px] transition-colors ${
                      isActive && !item.to.includes('?') && !item.to.includes('#')
                        ? 'bg-[#E5E2DA] font-semibold text-[#2A2927]'
                        : 'font-normal text-[#5F5C55] hover:bg-[#EAE7E0] hover:text-[#2A2927]'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>

          <div className="mt-8 hidden border-t border-[#E6E2DA] pt-4 md:block">
            <p className="px-2 text-[10.5px] text-[#8A867E]">Owner Portal v3.0</p>
          </div>
        </aside>

        {/* Main Workspace */}
        <main className="flex-1 overflow-x-hidden px-6 py-8 lg:px-10">
          <Outlet context={{ searchQuery }} />
        </main>
      </div>
    </div>
  );
}
