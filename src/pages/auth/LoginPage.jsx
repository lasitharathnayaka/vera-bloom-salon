import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { ROLES } from '../../utils/constants';
import heroPortrait from '../../assets/hero-portrait.jpg';

const ROLE_OPTIONS = [
  { id: ROLES.CUSTOMER, label: 'Customer', redirect: '/profile' },
  { id: ROLES.STYLIST, label: 'Stylist', redirect: '/stylist' },
  { id: ROLES.ADMIN, label: 'Admin', redirect: '/admin' },
];

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

export default function LoginPage() {
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const [selectedRole, setSelectedRole] = useState(ROLES.CUSTOMER);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [resetSent, setResetSent] = useState(false);
  const [authError, setAuthError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    setSubmitting(true);

    const { profile, error } = await signIn({ email, password });
    setSubmitting(false);

    if (error) {
      setAuthError(error.message || 'Unable to sign in. Check your credentials.');
      return;
    }

    const resolvedRole = profile?.role || selectedRole;
    const roleConfig =
      ROLE_OPTIONS.find((r) => r.id === resolvedRole) || ROLE_OPTIONS[0];

    navigate(roleConfig.redirect);
  };

  return (
    <div className="min-h-screen grid grid-cols-1 bg-[#FAF8F5] text-[#2A2927] lg:grid-cols-12">
      {/* ================= LEFT EDITORIAL VISUAL PANEL ================= */}
      <aside className="relative hidden flex-col justify-between overflow-hidden bg-[#F3F0EA] p-10 lg:col-span-5 lg:flex xl:p-12">
        <Link to="/" className="relative z-10 flex items-center gap-3">
          <BrandMark />
          <span className="font-serif text-[15px] font-semibold tracking-[0.22em] text-[#2A2927]">
            VERA &amp; BLOOM
          </span>
        </Link>

        {/* Framed Editorial Portrait */}
        <div className="relative my-8 flex-1 overflow-hidden rounded-[24px] border border-[#E6E2DA] bg-[#EAE6DE] shadow-lg">
          <img
            src={heroPortrait}
            alt="Vera & Bloom organic luxury salon"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1F1E1C]/55 via-transparent to-transparent" />

          {/* Floating Quote Card */}
          <div className="absolute bottom-6 left-6 right-6 rounded-2xl border border-[#FAF8F5]/40 bg-[#FAF8F5]/95 p-5 shadow-md backdrop-blur-xs">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#EFE0C6] px-3 py-1 text-[9.5px] font-semibold tracking-[0.18em] text-[#7A6444] uppercase">
              <Sparkles className="h-3 w-3" />
              Organic Luxury Sanctuary
            </span>
            <p className="mt-3 font-serif text-[18px] italic leading-snug text-[#2A2927]">
              &ldquo;Unhurried rituals tailored to your natural essence.&rdquo;
            </p>
            <p className="mt-2 text-[10px] font-semibold tracking-[0.18em] text-[#7A766E] uppercase">
              Vera &amp; Bloom &bull; Sanctuary Collective
            </p>
          </div>
        </div>

        <p className="text-[11px] text-[#7A766E]">
          &copy; {new Date().getFullYear()} Vera &amp; Bloom Sanctuary. All
          rights reserved.
        </p>
      </aside>

      {/* ================= RIGHT SIGN IN FORM PANEL ================= */}
      <main className="flex flex-col justify-center px-6 py-12 sm:px-12 lg:col-span-7 lg:px-16 xl:px-24">
        <div className="mx-auto w-full max-w-md">
          {/* Mobile Brand + Back Link */}
          <div className="mb-8 flex items-center justify-between">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-[#6B786A] transition-colors hover:text-[#2A2927]"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Home</span>
            </Link>

            <Link to="/" className="flex items-center gap-2 lg:hidden">
              <BrandMark />
              <span className="font-serif text-xs font-semibold tracking-[0.2em]">
                VERA &amp; BLOOM
              </span>
            </Link>
          </div>

          <p className="text-[10px] font-semibold tracking-[0.24em] text-[#6B786A] uppercase">
            Welcome Back
          </p>
          <h1 className="mt-2 font-serif text-4xl font-semibold text-[#2A2927]">
            Sign In to Your Sanctuary
          </h1>
          <p className="mt-2 text-[13px] leading-relaxed text-[#6C6961]">
            Access your scheduled rituals, personalized botanical formulas, or
            team workspace.
          </p>

          {/* Portal Role Selector */}
          <div className="mt-7">
            <p className="text-[11px] font-medium text-[#57544E]">
              Continue as
            </p>
            <div className="mt-2 grid grid-cols-3 gap-1.5 rounded-xl border border-[#E6E2DA] bg-[#F2EFE9] p-1">
              {ROLE_OPTIONS.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setSelectedRole(option.id)}
                  className={`cursor-pointer rounded-lg py-2 text-[12px] font-medium transition-colors ${
                    selectedRole === option.id
                      ? 'bg-[#4A5B4B] text-[#FAF8F5] shadow-2xs'
                      : 'text-[#5F5C55] hover:text-[#2A2927]'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="block text-[12px] font-medium text-[#4A4741]">
                Email Address
              </label>
              <div className="relative mt-1.5">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8A867E]" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="emma@verabloom.lk"
                  className="w-full rounded-xl border border-[#E2DDD4] bg-[#F6F4EF] py-3 pl-10 pr-4 text-[13px] text-[#2A2927] placeholder:text-[#A8A49B] focus:border-[#4A5B4B] focus:bg-[#FAF8F5] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="block text-[12px] font-medium text-[#4A4741]">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setResetSent(true)}
                  className="cursor-pointer text-[11.5px] font-medium text-[#4A5B4B] hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative mt-1.5">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8A867E]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full rounded-xl border border-[#E2DDD4] bg-[#F6F4EF] py-3 pl-10 pr-10 text-[13px] text-[#2A2927] placeholder:text-[#A8A49B] focus:border-[#4A5B4B] focus:bg-[#FAF8F5] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 cursor-pointer text-[#8A867E] hover:text-[#2A2927]"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {resetSent && (
                <p className="mt-1.5 text-[11px] font-medium text-[#4A5B4B]">
                  Password reset instructions sent if an account exists for this
                  email.
                </p>
              )}
            </div>

            <label className="flex cursor-pointer items-center gap-2.5 pt-1 text-[12px] text-[#5F5C55]">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 accent-[#4A5B4B]"
              />
              <span>Keep me signed in on this device</span>
            </label>

            {authError && (
              <p className="rounded-lg bg-[#F4E1DE] px-3.5 py-2 text-[12px] font-medium text-[#A44A3F]">
                {authError}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="mt-2 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#4A5B4B] py-3.5 text-[13px] font-medium tracking-wide text-[#FAF8F5] shadow-xs transition-colors hover:bg-[#3B4A3C] disabled:opacity-60"
            >
              <span>{submitting ? 'Signing In...' : 'Sign In'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3 text-[11px] text-[#9A958C]">
            <span className="h-px flex-1 bg-[#E6E2DA]" />
            <span>or</span>
            <span className="h-px flex-1 bg-[#E6E2DA]" />
          </div>

          <p className="text-center text-[13px] text-[#6C6961]">
            New to Vera &amp; Bloom?{' '}
            <Link
              to="/register"
              className="font-semibold text-[#4A5B4B] underline-offset-2 hover:underline"
            >
              Create an account
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
