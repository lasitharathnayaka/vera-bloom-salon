import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  Gift,
  Lock,
  Mail,
  Phone,
  User,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { ROLES } from '../../utils/constants';
import bridalHero from '../../assets/bridal-hero.jpg';

const INTEREST_TAGS = [
  'Organic Hair Care',
  'Holistic Facials',
  'Bridal Artistry',
  'Nail & Hand Spa',
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

export default function RegisterPage() {
  const { signUp, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleGoogleSignUp = async () => {
    setError('');
    setGoogleLoading(true);
    const { error: gErr } = await signInWithGoogle('/');
    if (gErr) {
      setGoogleLoading(false);
      setError(gErr.message || 'Google sign-in is not enabled yet.');
    }
  };

  const [role, setRole] = useState(ROLES.CUSTOMER);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [selectedInterests, setSelectedInterests] = useState([
    'Organic Hair Care',
  ]);
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [verifyNotice, setVerifyNotice] = useState('');

  const toggleInterest = (tag) => {
    setSelectedInterests((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match. Please check and try again.');
      return;
    }
    setError('');
    setVerifyNotice('');
    setSubmitting(true);

    const { data, error: signUpError } = await signUp({
      email: form.email,
      password: form.password,
      fullName: `${form.firstName} ${form.lastName}`.trim(),
      phone: form.phone,
      role,
    });

    setSubmitting(false);

    if (signUpError) {
      setError(signUpError.message || 'Could not create account.');
      return;
    }

    if (data?.session) {
      navigate(role === ROLES.STYLIST ? '/stylist' : '/');
    } else {
      setVerifyNotice(
        'Account created! Please check your email to confirm your address before signing in.'
      );
    }
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
            src={bridalHero}
            alt="Vera & Bloom botanical sanctuary experience"
            className="h-full w-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1F1E1C]/60 via-transparent to-transparent" />

          {/* Welcome Perk Card */}
          <div className="absolute bottom-6 left-6 right-6 rounded-2xl border border-[#FAF8F5]/40 bg-[#FAF8F5]/95 p-5 shadow-md backdrop-blur-xs">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#EFE0C6] px-3 py-1 text-[9.5px] font-semibold tracking-[0.16em] text-[#7A6444] uppercase">
              <Gift className="h-3 w-3" />
              Welcome Gift &bull; 100 Blossoms
            </span>
            <p className="mt-3 font-serif text-[18px] italic leading-snug text-[#2A2927]">
              &ldquo;Begin your personalized journey of organic hair &amp; skin
              care.&rdquo;
            </p>
            <p className="mt-2 text-[11px] text-[#6C6961]">
              Receive complimentary loyalty points, saved formulas, and priority
              weekend booking.
            </p>
          </div>
        </div>

        <p className="text-[11px] text-[#7A766E]">
          &copy; {new Date().getFullYear()} Vera &amp; Bloom Sanctuary. All
          rights reserved.
        </p>
      </aside>

      {/* ================= RIGHT SIGN UP FORM PANEL ================= */}
      <main className="flex flex-col justify-center px-6 py-10 sm:px-12 lg:col-span-7 lg:px-16 xl:px-24">
        <div className="mx-auto w-full max-w-lg">
          {/* Mobile Brand + Back Link */}
          <div className="mb-7 flex items-center justify-between">
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
            Join the Sanctuary
          </p>
          <h1 className="mt-1.5 font-serif text-4xl font-semibold text-[#2A2927]">
            Create Your Account
          </h1>
          <p className="mt-2 text-[13px] leading-relaxed text-[#6C6961]">
            Enjoy priority booking, saved botanical formulas, and exclusive
            loyalty rewards.
          </p>

          {/* Account Type */}
          <div className="mt-6 grid grid-cols-2 gap-2 rounded-xl border border-[#E6E2DA] bg-[#F2EFE9] p-1">
            {[
              { id: ROLES.CUSTOMER, label: 'Sanctuary Guest (Customer)' },
              { id: ROLES.STYLIST, label: 'Botanical Specialist (Stylist)' },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setRole(item.id)}
                className={`cursor-pointer rounded-lg py-2 text-[12px] font-medium transition-colors ${
                  role === item.id
                    ? 'bg-[#4A5B4B] text-[#FAF8F5] shadow-2xs'
                    : 'text-[#5F5C55] hover:text-[#2A2927]'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {/* Name Row */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-[12px] font-medium text-[#4A4741]">
                  First Name
                </label>
                <div className="relative mt-1.5">
                  <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8A867E]" />
                  <input
                    type="text"
                    required
                    value={form.firstName}
                    onChange={(e) =>
                      setForm({ ...form, firstName: e.target.value })
                    }
                    placeholder="Amaya"
                    className="w-full rounded-xl border border-[#E2DDD4] bg-[#F6F4EF] py-2.5 pl-10 pr-3.5 text-[13px] text-[#2A2927] placeholder:text-[#A8A49B] focus:border-[#4A5B4B] focus:bg-[#FAF8F5] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[12px] font-medium text-[#4A4741]">
                  Last Name
                </label>
                <input
                  type="text"
                  required
                  value={form.lastName}
                  onChange={(e) =>
                    setForm({ ...form, lastName: e.target.value })
                  }
                  placeholder="Perera"
                  className="mt-1.5 w-full rounded-xl border border-[#E2DDD4] bg-[#F6F4EF] px-3.5 py-2.5 text-[13px] text-[#2A2927] placeholder:text-[#A8A49B] focus:border-[#4A5B4B] focus:bg-[#FAF8F5] focus:outline-none"
                />
              </div>
            </div>

            {/* Email & Phone */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-[12px] font-medium text-[#4A4741]">
                  Email Address
                </label>
                <div className="relative mt-1.5">
                  <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8A867E]" />
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    placeholder="amaya@example.lk"
                    className="w-full rounded-xl border border-[#E2DDD4] bg-[#F6F4EF] py-2.5 pl-10 pr-3.5 text-[13px] text-[#2A2927] placeholder:text-[#A8A49B] focus:border-[#4A5B4B] focus:bg-[#FAF8F5] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[12px] font-medium text-[#4A4741]">
                  Phone Number
                </label>
                <div className="relative mt-1.5">
                  <Phone className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8A867E]" />
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) =>
                      setForm({ ...form, phone: e.target.value })
                    }
                    placeholder="+94 77 345 6789"
                    className="w-full rounded-xl border border-[#E2DDD4] bg-[#F6F4EF] py-2.5 pl-10 pr-3.5 text-[13px] text-[#2A2927] placeholder:text-[#A8A49B] focus:border-[#4A5B4B] focus:bg-[#FAF8F5] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Password & Confirm */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-[12px] font-medium text-[#4A4741]">
                  Password
                </label>
                <div className="relative mt-1.5">
                  <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8A867E]" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={form.password}
                    onChange={(e) => {
                      setError('');
                      setForm({ ...form, password: e.target.value });
                    }}
                    placeholder="Min. 6 characters"
                    className="w-full rounded-xl border border-[#E2DDD4] bg-[#F6F4EF] py-2.5 pl-10 pr-9 text-[13px] text-[#2A2927] placeholder:text-[#A8A49B] focus:border-[#4A5B4B] focus:bg-[#FAF8F5] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-[#8A867E] hover:text-[#2A2927]"
                  >
                    {showPassword ? (
                      <EyeOff className="h-3.5 w-3.5" />
                    ) : (
                      <Eye className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[12px] font-medium text-[#4A4741]">
                  Confirm Password
                </label>
                <div className="relative mt-1.5">
                  <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8A867E]" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={form.confirmPassword}
                    onChange={(e) => {
                      setError('');
                      setForm({ ...form, confirmPassword: e.target.value });
                    }}
                    placeholder="Re-enter password"
                    className="w-full rounded-xl border border-[#E2DDD4] bg-[#F6F4EF] py-2.5 pl-10 pr-3.5 text-[13px] text-[#2A2927] placeholder:text-[#A8A49B] focus:border-[#4A5B4B] focus:bg-[#FAF8F5] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {error && (
              <p className="rounded-lg bg-[#F4E1DE] px-3.5 py-2 text-[12px] font-medium text-[#B64B42]">
                {error}
              </p>
            )}

            {verifyNotice && (
              <p className="rounded-lg bg-[#D5E8D7] px-3.5 py-2.5 text-[12px] font-medium text-[#355A3A]">
                {verifyNotice}
              </p>
            )}

            {/* Ritual Interests */}
            <div>
              <p className="text-[12px] font-medium text-[#4A4741]">
                Preferred Sanctuary Rituals{' '}
                <span className="font-normal text-[#8A867E]">(Optional)</span>
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {INTEREST_TAGS.map((tag) => {
                  const active = selectedInterests.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleInterest(tag)}
                      className={`cursor-pointer rounded-full px-3.5 py-1.5 text-[11.5px] font-medium transition-colors ${
                        active
                          ? 'bg-[#EFE0C6] text-[#7A6444]'
                          : 'border border-[#E5E1D8] bg-[#F6F4EF] text-[#5F5C55] hover:bg-[#ECE8E0]'
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Terms */}
            <label className="flex cursor-pointer items-start gap-2.5 pt-1 text-[11.5px] text-[#6C6961]">
              <input
                type="checkbox"
                required
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-0.5 h-4 w-4 accent-[#4A5B4B]"
              />
              <span>
                I agree to Vera &amp; Bloom&rsquo;s Sanctuary Terms of Service
                and Privacy Policy.
              </span>
            </label>

            <button
              type="submit"
              disabled={submitting}
              className="mt-2 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#4A5B4B] py-3.5 text-[13px] font-medium tracking-wide text-[#FAF8F5] shadow-xs transition-colors hover:bg-[#3B4A3C] disabled:opacity-60"
            >
              <span>
                {submitting ? 'Creating Account...' : 'Create Sanctuary Account'}
              </span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <div className="my-5 flex items-center gap-3 text-[11px] text-[#9A958C]">
            <span className="h-px flex-1 bg-[#E6E2DA]" />
            <span>or</span>
            <span className="h-px flex-1 bg-[#E6E2DA]" />
          </div>

          <button
            type="button"
            disabled={googleLoading}
            onClick={handleGoogleSignUp}
            className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-xl border border-[#DFDBD2] bg-[#FAF8F5] py-3 text-[13px] font-medium text-[#2A2927] shadow-2xs transition-colors hover:bg-[#F3F0EA] disabled:opacity-60"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="#4285F4"
                d="M23.49 12.27c0-.79-.07-1.54-.2-2.27H12v4.51h6.47a5.53 5.53 0 0 1-2.4 3.63v3.02h3.88c2.27-2.09 3.54-5.17 3.54-8.89Z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.07 7.94-2.91l-3.88-3.02c-1.07.72-2.45 1.15-4.06 1.15-3.12 0-5.77-2.11-6.72-4.96H1.27v3.12A12 12 0 0 0 12 24Z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.26A7.2 7.2 0 0 1 4.9 12c0-.78.14-1.54.38-2.26V6.62H1.27A12 12 0 0 0 0 12c0 1.94.46 3.77 1.27 5.38l4.01-3.12Z"
              />
              <path
                fill="#EA4335"
                d="M12 4.77c1.76 0 3.34.61 4.58 1.8l3.44-3.44C17.95 1.19 15.24 0 12 0A12 12 0 0 0 1.27 6.62l4.01 3.12C6.23 6.88 8.88 4.77 12 4.77Z"
              />
            </svg>
            <span>
              {googleLoading ? 'Connecting to Google...' : 'Continue with Google'}
            </span>
          </button>

          <p className="mt-6 text-center text-[13px] text-[#6C6961]">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-semibold text-[#4A5B4B] underline-offset-2 hover:underline"
            >
              Sign In
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
