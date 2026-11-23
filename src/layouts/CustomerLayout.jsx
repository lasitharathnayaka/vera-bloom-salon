import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  ArrowUpRight,
  Check,
  Clock,
  Instagram,
  LogOut,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  Sparkles,
  User,
  X,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { ROLES } from '../utils/constants';
import NotificationBell from '../components/common/NotificationBell';

function BrandMark({ dark = false }) {
  return (
    <span
      className={`inline-flex h-9 w-9 items-center justify-center rounded-xl border transition-transform duration-300 group-hover:scale-105 ${
        dark
          ? 'border-[#EFE0C6]/25 bg-[#2E3A2F] text-[#EFE0C6]'
          : 'border-[#E5E1D8] bg-[#EFECE6] text-[#4A5B4B]'
      }`}
    >
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
  );
}

const NAV_LINKS = [
  { label: 'Home', to: '/', end: true },
  { label: 'Services', to: '/services' },
  { label: 'Bridal', to: '/bridal' },
  { label: 'Lookbook', to: '/lookbook' },
  { label: 'Specialists', to: '/specialists' },
];

export default function CustomerLayout() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    setMobileMenuOpen(false);
    navigate('/');
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 18);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const portalLink =
    user?.role === ROLES.ADMIN
      ? '/admin'
      : user?.role === ROLES.STYLIST
        ? '/stylist'
        : '/booking';

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    setSubscribed(true);
    setNewsletterEmail('');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#2A2927]">
      {/* ================= MODERN GLASS NAVBAR ================= */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'border-b border-[#E5E1D8]/80 bg-[#FAF8F5]/88 shadow-[0_8px_30px_rgba(34,43,35,0.06)] backdrop-blur-xl'
            : 'border-b border-[#ECE8E0] bg-[#FAF8F5]/95 backdrop-blur-md'
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-3.5 lg:px-10">
          {/* Brand Logo */}
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="group flex items-center gap-3"
          >
            <BrandMark />
            <div className="leading-none">
              <span className="block font-serif text-[15.5px] font-semibold tracking-[0.22em] text-[#2A2927]">
                VERA &amp; BLOOM
              </span>
              <span className="mt-1 block text-[8.5px] font-semibold tracking-[0.3em] text-[#7A766E] uppercase">
                Botanical Sanctuary
              </span>
            </div>
          </Link>

          {/* Center Pill Navigation */}
          <nav
            className="hidden items-center gap-1 rounded-full border border-[#E8E4DC] bg-[#F3F0EA]/80 p-1 md:flex"
            aria-label="Primary"
          >
            {NAV_LINKS.map((item) => (
              <NavLink
                key={item.label}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `rounded-full px-4 py-1.5 text-[12.5px] transition-all ${
                    isActive && !item.to.includes('#')
                      ? 'bg-[#4A5B4B] font-medium text-[#FAF8F5] shadow-2xs'
                      : 'font-normal text-[#57544E] hover:bg-[#FAF8F5] hover:text-[#2A2927]'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2.5">
            {user ? (
              <div className="hidden items-center gap-2 sm:flex">
                <NotificationBell />
                <Link
                  to={portalLink}
                  className="inline-flex items-center gap-2 rounded-full border border-[#E2DDD4] bg-[#F3F0EA] py-1.5 pr-3.5 pl-1.5 text-[12px] font-medium text-[#222B23] transition-colors hover:bg-[#EAE5DC]"
                >
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#253026] text-[10px] font-semibold text-[#EFE0C6]">
                    {(user.name || 'U').slice(0, 1).toUpperCase()}
                  </span>
                  <span className="max-w-[110px] truncate">
                    {user.name?.split(' ')[0] || 'Account'}
                  </span>
                </Link>
                <button
                  type="button"
                  onClick={handleSignOut}
                  title="Sign Out"
                  aria-label="Sign Out"
                  className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-[#E2DDD4] bg-[#FAF8F5] text-[#6C6961] transition-colors hover:border-[#D4B4AE] hover:bg-[#FDF2F0] hover:text-[#A44A3F]"
                >
                  <LogOut className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden px-3 py-2 text-[12.5px] font-medium text-[#57544E] transition-colors hover:text-[#2A2927] sm:inline"
              >
                Sign In
              </Link>
            )}

            <Link
              to="/booking"
              className="inline-flex items-center gap-1.5 rounded-full bg-[#4A5B4B] px-5 py-2.5 text-[12px] font-medium tracking-wide text-[#FAF8F5] shadow-xs transition-all hover:bg-[#3B4A3C]"
            >
              <span>Book Now</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>

            {!user && (
              <Link
                to="/login"
                aria-label="Sign In"
                className="hidden h-9 w-9 items-center justify-center rounded-full border border-[#E2DDD4] bg-[#F3F0EA] text-[#4A5B4B] transition-colors hover:bg-[#4A5B4B] hover:text-[#FAF8F5] sm:inline-flex"
              >
                <User className="h-4 w-4" strokeWidth={1.8} />
              </Link>
            )}

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((o) => !o)}
              aria-label="Toggle navigation menu"
              className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-[#E2DDD4] bg-[#F3F0EA] text-[#2A2927] md:hidden"
            >
              {mobileMenuOpen ? (
                <X className="h-4 w-4" />
              ) : (
                <Menu className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Slide-Down Menu */}
        {mobileMenuOpen && (
          <div className="border-t border-[#ECE8E0] bg-[#FAF8F5] px-6 py-5 md:hidden">
            <nav className="flex flex-col gap-1.5">
              {NAV_LINKS.map((item) => (
                <NavLink
                  key={item.label}
                  to={item.to}
                  end={item.end}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `rounded-xl px-4 py-2.5 text-sm font-medium ${
                      isActive && !item.to.includes('#')
                        ? 'bg-[#4A5B4B] text-[#FAF8F5]'
                        : 'text-[#4A4741] hover:bg-[#F3F0EA]'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>

            <div className="mt-4 flex items-center gap-2.5 border-t border-[#ECE8E0] pt-4">
              {user ? (
                <>
                  <Link
                    to={portalLink}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 rounded-xl border border-[#DCD7CC] py-2.5 text-center text-xs font-semibold text-[#2A2927]"
                  >
                    {user.name?.split(' ')[0] || 'My Account'}
                  </Link>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="flex-1 cursor-pointer rounded-xl bg-[#FDF2F0] py-2.5 text-center text-xs font-semibold text-[#A44A3F]"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 rounded-xl border border-[#DCD7CC] py-2.5 text-center text-xs font-semibold text-[#2A2927]"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/booking"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 rounded-xl bg-[#4A5B4B] py-2.5 text-center text-xs font-semibold text-[#FAF8F5]"
                  >
                    Book Visit
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* ================= MAIN PAGE CONTENT ================= */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* ================= MODERN EDITORIAL DARK-SAGE FOOTER ================= */}
      <footer className="relative z-20 bg-[#222B23] text-[#E6E2DA]">
        <div className="mx-auto max-w-7xl px-6 pb-10 pt-16 lg:px-10">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-12">
            {/* Column 1: Brand Story */}
            <div className="lg:col-span-4">
              <Link to="/" className="group inline-flex items-center gap-3">
                <BrandMark dark />
                <div className="leading-none">
                  <span className="block font-serif text-[16px] font-semibold tracking-[0.22em] text-[#FAF8F5]">
                    VERA &amp; BLOOM
                  </span>
                  <span className="mt-1 block text-[8.5px] font-semibold tracking-[0.3em] text-[#A8B4A9] uppercase">
                    Organic Luxury Sanctuary
                  </span>
                </div>
              </Link>

              <p className="mt-5 max-w-sm text-[13px] leading-[1.8] text-[#B9C2BA]">
                An organic beauty sanctuary where cold-pressed botanical rituals
                meet bespoke hair couture, restorative skin therapy, and
                timeless bridal artistry.
              </p>

              <div className="mt-6 flex items-center gap-3">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/5 text-[#EFE0C6] transition-colors hover:bg-[#4A5B4B] hover:text-[#FAF8F5]"
                >
                  <Instagram className="h-4 w-4" />
                </a>
                <a
                  href="mailto:concierge@verabloom.lk"
                  aria-label="Email Concierge"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/5 text-[#EFE0C6] transition-colors hover:bg-[#4A5B4B] hover:text-[#FAF8F5]"
                >
                  <Mail className="h-4 w-4" />
                </a>
                <a
                  href="https://wa.me/15550199"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="WhatsApp"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/5 text-[#EFE0C6] transition-colors hover:bg-[#4A5B4B] hover:text-[#FAF8F5]"
                >
                  <MessageCircle className="h-4 w-4" />
                </a>
              </div>
            </div>

            {/* Column 2: Explore Links */}
            <div className="lg:col-span-2">
              <h3 className="text-[10.5px] font-semibold tracking-[0.22em] text-[#EFE0C6] uppercase">
                Explore
              </h3>
              <ul className="mt-4 space-y-2.5 text-[13px] text-[#C8D0C9]">
                <li>
                  <Link to="/" className="transition-colors hover:text-[#FAF8F5]">
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    to="/services"
                    className="transition-colors hover:text-[#FAF8F5]"
                  >
                    Botanical Menu
                  </Link>
                </li>
                <li>
                  <Link
                    to="/bridal"
                    className="transition-colors hover:text-[#FAF8F5]"
                  >
                    Bridal Sanctuary
                  </Link>
                </li>
                <li>
                  <Link
                    to="/lookbook"
                    className="transition-colors hover:text-[#FAF8F5]"
                  >
                    Lookbook &amp; Portfolio
                  </Link>
                </li>
                <li>
                  <Link
                    to="/booking"
                    className="transition-colors hover:text-[#FAF8F5]"
                  >
                    Book Appointment
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Sanctuary Hours & Address */}
            <div className="lg:col-span-3">
              <h3 className="text-[10.5px] font-semibold tracking-[0.22em] text-[#EFE0C6] uppercase">
                Visit Us
              </h3>
              <div className="mt-4 space-y-4 text-[12.5px] text-[#C8D0C9]">
                <div className="flex items-start gap-2.5">
                  <Clock className="mt-0.5 h-4 w-4 shrink-0 text-[#EFE0C6]" />
                  <div>
                    <p className="font-medium text-[#FAF8F5]">Salon Hours</p>
                    <p className="mt-0.5 text-[#B9C2BA]">
                      Tue &ndash; Sat: 9:00 AM &ndash; 8:00 PM
                      <br />
                      Sunday: 10:00 AM &ndash; 6:00 PM
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#EFE0C6]" />
                  <div>
                    <p className="font-medium text-[#FAF8F5]">
                      Sanctuary Address
                    </p>
                    <p className="mt-0.5 text-[#B9C2BA]">
                      No. 42, Horton Place, Cinnamon Gardens
                      <br />
                      Colombo 07, Sri Lanka
                    </p>
                    <a
                      href="/#visit-us"
                      className="mt-1.5 inline-block text-[11px] font-semibold text-[#EFE0C6] underline-offset-4 hover:underline"
                    >
                      View Salon Map &rarr;
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Column 4: Newsletter & Instant Concierge */}
            <div className="lg:col-span-3">
              <h3 className="text-[10.5px] font-semibold tracking-[0.22em] text-[#EFE0C6] uppercase">
                Sanctuary Journal
              </h3>
              <p className="mt-4 text-[12.5px] leading-relaxed text-[#B9C2BA]">
                Receive seasonal botanical rituals, private bridal previews, and
                member invitations.
              </p>

              <form onSubmit={handleSubscribe} className="mt-4 flex gap-2">
                <input
                  type="email"
                  required
                  value={newsletterEmail}
                  onChange={(e) => {
                    setSubscribed(false);
                    setNewsletterEmail(e.target.value);
                  }}
                  placeholder="Your email address"
                  className="w-full rounded-xl border border-white/15 bg-white/8 px-3.5 py-2.5 text-xs text-[#FAF8F5] placeholder:text-[#9AA59B] focus:border-[#EFE0C6] focus:outline-none"
                />
                <button
                  type="submit"
                  className="shrink-0 cursor-pointer rounded-xl bg-[#EFE0C6] px-4 py-2.5 text-xs font-semibold text-[#222B23] transition-colors hover:bg-[#FAF8F5]"
                >
                  {subscribed ? <Check className="h-4 w-4" /> : 'Join'}
                </button>
              </form>
              {subscribed && (
                <p className="mt-2 inline-flex items-center gap-1 text-[11px] text-[#EFE0C6]">
                  <Sparkles className="h-3 w-3" />
                  Welcome to the Vera &amp; Bloom Journal.
                </p>
              )}

              <a
                href="https://wa.me/15550199"
                target="_blank"
                rel="noreferrer"
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#4A5B4B] px-5 py-3 text-xs font-medium tracking-wide text-[#FAF8F5] transition-colors hover:bg-[#5B705D]"
              >
                <MessageCircle className="h-4 w-4" strokeWidth={1.8} />
                <span>WhatsApp Instant Concierge</span>
              </a>
            </div>
          </div>

          {/* Bottom Copyright Bar */}
          <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-7 text-[11.5px] text-[#9AA59B] sm:flex-row">
            <p>
              &copy; {new Date().getFullYear()} Vera &amp; Bloom Sanctuary. All
              rights reserved.
            </p>
            <div className="flex flex-wrap items-center gap-6">
              <Link to="/services" className="hover:text-[#FAF8F5]">
                Cancellation Policy
              </Link>
              <Link to="/profile" className="hover:text-[#FAF8F5]">
                Client Sanctuary
              </Link>
              <Link to="/login" className="hover:text-[#FAF8F5]">
                Team Sign In
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
