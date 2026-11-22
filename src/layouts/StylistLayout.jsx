import { useState } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import {
  Bell,
  Calendar,
  CalendarClock,
  FlaskConical,
  Images,
  User,
  Wallet,
} from 'lucide-react';

const STYLIST_NAV = [
  { label: 'My Schedule', to: '/stylist', icon: Calendar, end: true },
  { label: 'Client Formulas', to: '/stylist/formulas', icon: FlaskConical },
  { label: 'My Lookbook', to: '/stylist/profile', icon: Images },
  { label: 'Shift & Leave', to: '/stylist/schedule', icon: CalendarClock },
  { label: 'Earnings & Tips', to: '/stylist/earnings', icon: Wallet },
];

export default function StylistLayout() {
  const [onDuty, setOnDuty] = useState(true);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#2A2927] md:flex-row">
      {/* ================= LEFT SPECIALIST SIDEBAR ================= */}
      <aside className="flex w-full shrink-0 flex-col justify-between border-b border-[#ECE8E0] bg-[#F6F4EF] px-5 py-6 md:w-64 md:border-b-0 md:border-r">
        <div>
          {/* Brand */}
          <Link to="/" className="block px-1">
            <p className="font-serif text-[15px] font-semibold tracking-[0.16em] text-[#2A2927]">
              VERA &amp; BLOOM
            </p>
            <p className="mt-0.5 text-[9.5px] font-semibold tracking-[0.22em] text-[#7A766E] uppercase">
              Specialist Portal
            </p>
          </Link>

          {/* Specialist Profile Mini Card */}
          <div className="mt-6 flex items-center gap-3 rounded-xl border border-[#ECE8E0] bg-[#FAF8F5] px-3 py-3">
            <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#4A5B4B] text-[12px] font-semibold tracking-wider text-[#FAF8F5]">
              NP
            </span>
            <div className="min-w-0">
              <p className="truncate font-serif text-[15px] font-semibold text-[#2A2927]">
                Nethmi Perera
              </p>
              <p className="truncate text-[11px] text-[#7A766E]">
                Senior Botanical Colorist
              </p>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="mt-6 flex flex-row gap-1 overflow-x-auto md:flex-col">
            {STYLIST_NAV.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.label}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `flex shrink-0 items-center gap-3 rounded-lg px-3 py-2.5 text-[12.5px] transition-colors ${
                      isActive && !item.to.includes('#')
                        ? 'bg-[#E6E3DC] font-semibold text-[#2A2927]'
                        : 'font-medium text-[#5F5C55] hover:bg-[#ECE9E2] hover:text-[#2A2927]'
                    }`
                  }
                >
                  <Icon
                    className="h-4 w-4 shrink-0 text-[#4A5B4B]"
                    strokeWidth={1.7}
                  />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Bottom Availability Toggle */}
        <div className="mt-8 hidden border-t border-[#E6E2DA] pt-4 md:block">
          <div className="flex items-center justify-between px-1">
            <div>
              <p className="text-[11px] font-semibold text-[#2A2927]">
                Availability
              </p>
              <p className="text-[10.5px] text-[#7A766E]">
                {onDuty ? 'On Duty • Chair #2' : 'Away / Break'}
              </p>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={onDuty}
              aria-label="Toggle availability"
              onClick={() => setOnDuty((prev) => !prev)}
              className={`relative inline-flex h-5 w-9 cursor-pointer items-center rounded-full transition-colors ${
                onDuty ? 'bg-[#4A5B4B]' : 'bg-[#DCD8CF]'
              }`}
            >
              <span
                className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-xs transition-transform ${
                  onDuty ? 'translate-x-4.5' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </aside>

      {/* ================= MAIN COLUMN ================= */}
      <div className="flex flex-1 flex-col">
        {/* Top Utility Header */}
        <header className="sticky top-0 z-30 flex items-center justify-end gap-3 border-b border-[#ECE8E0] bg-[#FAF8F5]/95 px-6 py-3.5 backdrop-blur-sm lg:px-10">
          <button
            type="button"
            aria-label="Notifications"
            className="relative inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-[#ECE8E0] bg-[#F2EFE9] text-[#4A5B4B] transition-colors hover:bg-[#E7E4DD]"
          >
            <Bell className="h-4 w-4" strokeWidth={1.7} />
            <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[#C85A4E]" />
          </button>

          <Link
            to="/stylist/profile"
            aria-label="Specialist Profile"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#4A5B4B] text-[#FAF8F5] transition-colors hover:bg-[#3B4A3C]"
          >
            <User className="h-4 w-4" strokeWidth={1.8} />
          </Link>
        </header>

        {/* Page Content */}
        <main className="flex-1 px-6 py-8 lg:px-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
