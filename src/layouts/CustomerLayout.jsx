import { Link, NavLink, Outlet } from 'react-router-dom';
import { User, MessageCircle } from 'lucide-react';

function BrandMark() {
  return (
    <span className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-[#E5E1D8] bg-[#EFECE6] text-[#4A5B4B]">
      <svg
        width="16"
        height="16"
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
  );
}

const NAV_LINKS = [
  { label: 'Services', to: '/services' },
  { label: 'Bridal', to: '/bridal' },
  { label: 'Lookbook', to: '/lookbook' },
  { label: 'Specialists', to: '/#manifesto' },
  { label: 'Gift Vouchers', to: '/booking' },
];

export default function CustomerLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#2A2927]">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-[#ECE8E0] bg-[#FAF8F5]/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <BrandMark />
            <span className="font-serif text-[15px] font-semibold tracking-[0.22em] text-[#2A2927]">
              VERA &amp; BLOOM
            </span>
          </Link>

          {/* Center Navigation */}
          <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
            {NAV_LINKS.map((item) => (
              <NavLink
                key={item.label}
                to={item.to}
                className={({ isActive }) =>
                  `text-[13px] transition-colors ${
                    isActive &&
                    (item.to === '/services' ||
                      item.to === '/bridal' ||
                      item.to === '/lookbook')
                      ? 'font-semibold text-[#2A2927]'
                      : 'font-normal text-[#5F5C55] hover:text-[#2A2927]'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="hidden text-[12.5px] font-medium text-[#5F5C55] transition-colors hover:text-[#2A2927] sm:inline"
            >
              Sign In
            </Link>
            <Link
              to="/booking"
              className="rounded-lg bg-[#4A5B4B] px-5 py-2.5 text-[12px] font-medium tracking-wide text-[#FAF8F5] shadow-xs transition-colors hover:bg-[#3B4A3C]"
            >
              Book Appointment
            </Link>
            <Link
              to="/profile"
              aria-label="Customer Profile"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#4A5B4B] text-[#FAF8F5] transition-colors hover:bg-[#3B4A3C]"
            >
              <User className="h-4 w-4" strokeWidth={1.8} />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Page Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-[#E6E2DA] bg-[#F3F0EA]">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-6 py-12 md:grid-cols-3 md:items-center lg:px-10">
          {/* Salon Hours */}
          <div>
            <h3 className="font-serif text-[15px] font-semibold text-[#2A2927]">
              Salon Hours
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-[#6C6961]">
              Tuesday &ndash; Saturday: 9am &ndash; 8pm
              <br />
              Sunday: 10am &ndash; 6pm
            </p>
          </div>

          {/* Sanctuary Address */}
          <div>
            <h3 className="font-serif text-[15px] font-semibold text-[#2A2927]">
              Sanctuary Address
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-[#6C6961]">
              742 Evergreen Terrace, Suite 400
              <br />
              New York, NY 10012
            </p>
          </div>

          {/* Instant Concierge */}
          <div className="flex flex-col md:items-end">
            <span className="text-[11px] font-medium tracking-wide text-[#6C6961]">
              Instant Concierge
            </span>
            <a
              href="https://wa.me/15550199"
              target="_blank"
              rel="noreferrer"
              className="mt-2.5 inline-flex items-center gap-2 rounded-lg bg-[#4A5B4B] px-5 py-2.5 text-xs font-medium text-[#FAF8F5] shadow-xs transition-colors hover:bg-[#3B4A3C]"
            >
              <MessageCircle className="h-3.5 w-3.5" strokeWidth={1.8} />
              WhatsApp Concierge
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
