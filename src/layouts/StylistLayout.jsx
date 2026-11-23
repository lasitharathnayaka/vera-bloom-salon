import { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  Bell,
  Calendar,
  CalendarClock,
  ExternalLink,
  FlaskConical,
  Images,
  LogOut,
  Sparkles,
  Wallet,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import NotificationBell from '../components/common/NotificationBell';

const STYLIST_NAV = [
  { label: 'My Schedule', to: '/stylist', icon: Calendar, end: true },
  { label: 'Client Formulas', to: '/stylist/formulas', icon: FlaskConical },
  { label: 'My Lookbook', to: '/stylist/profile', icon: Images },
  { label: 'Shift & Leave', to: '/stylist/schedule', icon: CalendarClock },
  { label: 'Earnings & Tips', to: '/stylist/earnings', icon: Wallet },
];

export default function StylistLayout() {
  const [onDuty, setOnDuty] = useState(true);
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#F5F3EE] text-[#2A2927] md:flex-row">
      {/* ================= MODERN DARK-SAGE SPECIALIST SIDEBAR ================= */}
      <aside className="flex w-full shrink-0 flex-col justify-between bg-[#222B23] px-5 py-6 text-[#E6E2DA] md:w-64">
        <div>
          {/* Brand */}
          <Link to="/stylist" className="flex items-center gap-3 px-1">
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
                Specialist Portal
              </p>
            </div>
          </Link>

          {/* Specialist Profile Glass Card */}
          <div className="mt-6 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.06] px-3.5 py-3">
            <div className="relative shrink-0">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#EFE0C6] text-[12px] font-bold tracking-wider text-[#222B23]">
                NP
              </span>
              <span
                className={`absolute right-0 bottom-0 h-2.5 w-2.5 rounded-full border-2 border-[#222B23] ${
                  onDuty ? 'bg-[#57A764]' : 'bg-[#C8A870]'
                }`}
              />
            </div>
            <div className="min-w-0">
              <p className="truncate font-serif text-[15.5px] font-semibold text-[#FAF8F5]">
                Nethmi Perera
              </p>
              <p className="truncate text-[10.5px] text-[#A8B8AA]">
                Senior Botanical Colorist
              </p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="mt-6 flex flex-row gap-1.5 overflow-x-auto md:flex-col">
            {STYLIST_NAV.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.label}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `flex shrink-0 items-center gap-3 rounded-xl px-3.5 py-2.5 text-[12.5px] transition-all ${
                      isActive
                        ? 'bg-[#EFE0C6] font-semibold text-[#222B23] shadow-sm'
                        : 'font-normal text-[#C8D0C9] hover:bg-white/8 hover:text-[#FAF8F5]'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon
                        className={`h-4 w-4 shrink-0 ${
                          isActive ? 'text-[#222B23]' : 'text-[#EFE0C6]/80'
                        }`}
                        strokeWidth={1.7}
                      />
                      <span>{item.label}</span>
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Bottom Availability Toggle & Utility Links */}
        <div className="mt-8 hidden space-y-3 border-t border-white/10 pt-4 md:block">
          <div className="flex items-center justify-between rounded-xl bg-white/[0.05] px-3 py-2.5">
            <div>
              <p className="text-[11px] font-semibold text-[#FAF8F5]">
                Chair Status
              </p>
              <p className="text-[10px] text-[#A8B8AA]">
                {onDuty ? 'On Duty • Chair #2' : 'Away / Short Break'}
              </p>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={onDuty}
              aria-label="Toggle availability"
              onClick={() => setOnDuty((prev) => !prev)}
              className={`relative inline-flex h-5 w-9 cursor-pointer items-center rounded-full transition-colors ${
                onDuty ? 'bg-[#EFE0C6]' : 'bg-white/20'
              }`}
            >
              <span
                className={`inline-block h-3.5 w-3.5 transform rounded-full shadow-xs transition-transform ${
                  onDuty
                    ? 'translate-x-4.5 bg-[#222B23]'
                    : 'translate-x-1 bg-white'
                }`}
              />
            </button>
          </div>

          <div className="space-y-1">
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
          </div>
        </div>
      </aside>

      {/* ================= MAIN COLUMN ================= */}
      <div className="flex flex-1 flex-col overflow-x-hidden">
        {/* Frosted Top Utility Header */}
        <header className="sticky top-0 z-30 border-b border-[#E6E2DA] bg-[#FAF8F5]/90 backdrop-blur-md">
          <div className="flex items-center justify-between gap-4 px-6 py-3.5 lg:px-10">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full bg-[#EFECE6] px-3.5 py-1.5 text-[11.5px] font-medium text-[#4A4741]">
                <span
                  className={`h-2 w-2 rounded-full ${
                    onDuty ? 'bg-[#4E8B57]' : 'bg-[#C8A870]'
                  }`}
                />
                {onDuty ? 'On Duty • Chair #2 Active' : 'Away / Short Break'}
              </span>
              <span className="hidden text-[12px] text-[#7A766E] sm:inline">
                Monday, November 23, 2026
              </span>
            </div>

            <div className="flex items-center gap-2.5">
              <Link
                to="/stylist/formulas"
                className="hidden items-center gap-1.5 rounded-full bg-[#253026] px-4 py-2 text-[12px] font-medium tracking-wide text-[#FAF8F5] shadow-xs transition-colors hover:bg-[#344335] sm:inline-flex"
              >
                <Sparkles className="h-3.5 w-3.5 text-[#EFE0C6]" />
                <span>Log Formula</span>
              </Link>

              <NotificationBell />

              <Link
                to="/stylist/profile"
                aria-label="Specialist Profile"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#222B23] text-[11px] font-semibold tracking-wider text-[#EFE0C6] transition-opacity hover:opacity-90"
              >
                NP
              </Link>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 px-6 py-8 lg:px-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
