import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowUpRight,
  Calendar,
  CalendarCheck,
  Clock,
  Flower2,
  Gift,
  Heart,
  History,
  MapPin,
  PlusCircle,
  RotateCcw,
  Sparkles,
  User,
  UserCog,
} from 'lucide-react';

import specialistElena from '../../assets/specialist-elena.jpg';
import heroPortrait from '../../assets/hero-portrait.jpg';
import ritualBridal from '../../assets/ritual-bridal.jpg';
import ritualSkin from '../../assets/ritual-skin.jpg';

const SIDEBAR_ITEMS = [
  { id: 'upcoming', label: 'Upcoming Bookings', icon: Calendar },
  { id: 'past', label: 'Past Visits', icon: History },
  { id: 'saved', label: 'Saved Looks', icon: Heart },
  { id: 'rewards', label: 'Botanical Rewards', icon: Gift },
  { id: 'profile', label: 'Profile', icon: UserCog },
];

const PAST_VISITS = [
  {
    id: 'scalp-detox',
    date: 'Sept 14, 2024',
    price: 'LKR 4,800',
    title: 'Holistic Scalp Detox',
    specialist: 'Amara Thorne',
    summary: 'Deep clarifying botanicals & scalp massage',
    icon: Flower2,
  },
  {
    id: 'manicure-shea',
    date: 'August 02, 2024',
    price: 'LKR 3,500',
    title: 'Botanical Manicure & Shea Wrap',
    specialist: 'Clara Vance',
    summary: 'Organic nail conditioning & deep hydration',
    icon: Sparkles,
  },
];

const SAVED_LOOKS = [
  {
    id: 'look-1',
    title: 'Sun-Kissed Botanical Balayage',
    category: 'Balayage & Gloss',
    image: heroPortrait,
  },
  {
    id: 'look-2',
    title: 'Timeless Bridal Elegance',
    category: 'Bridal Glam',
    image: ritualBridal,
  },
  {
    id: 'look-3',
    title: 'Glass Skin Botanical Facial',
    category: 'Glass Skin Facials',
    image: ritualSkin,
  },
];

const REWARD_PERKS = [
  {
    id: 'aromatherapy',
    name: 'Complimentary Aromatherapy Infusion',
    points: 150,
    description: 'Custom essential oil scalp & temple ritual added to any visit.',
  },
  {
    id: 'deep-conditioning',
    name: 'Camellia Deep Conditioning Upgrade',
    points: 250,
    description: 'Intensive cold-pressed botanical shine & repair mask.',
  },
  {
    id: 'mini-facial',
    name: 'Express Botanical Glow Facial',
    points: 400,
    description: '30-minute rosehip elixir & jade roller radiance boost.',
  },
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

export default function CustomerProfilePage() {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [bookingStatus, setBookingStatus] = useState('Confirmed');
  const [points, setPoints] = useState(420);
  const [redeemedId, setRedeemedId] = useState(null);
  const [profileForm, setProfileForm] = useState({
    name: 'Emma Sterling',
    email: 'emma.sterling@example.com',
    phone: '+94 77 458 9210',
    preferences: 'Prefer lavender & chamomile botanicals; sensitive scalp.',
  });
  const [profileSaved, setProfileSaved] = useState(false);

  const handleCancelAppointment = () => {
    setBookingStatus('Cancelled');
  };

  const handleRestoreAppointment = () => {
    setBookingStatus('Confirmed');
  };

  const handleRedeem = (perk) => {
    if (points >= perk.points) {
      setPoints((p) => p - perk.points);
      setRedeemedId(perk.id);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#2A2927]">
      {/* ================= PORTAL TOP HEADER ================= */}
      <header className="sticky top-0 z-40 border-b border-[#ECE8E0] bg-[#FAF8F5]/95 backdrop-blur-sm">
        <div className="flex items-center justify-between px-6 py-4 lg:px-8">
          <Link to="/" className="flex items-center gap-3">
            <BrandMark />
            <span className="font-serif text-[15px] font-semibold tracking-[0.22em] text-[#2A2927]">
              VERA &amp; BLOOM
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              to="/booking"
              className="rounded-lg bg-[#4A5B4B] px-5 py-2.5 text-[12px] font-medium tracking-wide text-[#FAF8F5] shadow-xs transition-colors hover:bg-[#3B4A3C]"
            >
              New Appointment
            </Link>
            <button
              type="button"
              onClick={() => setActiveTab('profile')}
              aria-label="Client Profile"
              className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-[#4A5B4B] text-[#FAF8F5] transition-colors hover:bg-[#3B4A3C]"
            >
              <User className="h-4 w-4" strokeWidth={1.8} />
            </button>
          </div>
        </div>
      </header>

      {/* ================= SIDEBAR + MAIN PORTAL ================= */}
      <div className="flex flex-1 flex-col md:flex-row">
        {/* Left Sidebar */}
        <aside className="flex w-full shrink-0 flex-col justify-between border-b border-[#ECE8E0] bg-[#F7F5F0] p-4 md:w-60 md:border-b-0 md:border-r">
          <nav className="flex flex-row gap-1.5 overflow-x-auto md:flex-col">
            {SIDEBAR_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id)}
                  className={`flex shrink-0 cursor-pointer items-center gap-3 rounded-lg px-3.5 py-2.5 text-left text-[12.5px] transition-colors ${
                    isActive
                      ? 'bg-[#DCDBD5] font-semibold text-[#2A2927]'
                      : 'font-medium text-[#5F5C55] hover:bg-[#ECEAE3] hover:text-[#2A2927]'
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0 text-[#4A5B4B]" strokeWidth={1.7} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="mt-8 hidden border-t border-[#E6E2DA] pt-4 md:block">
            <p className="px-2 text-[10.5px] text-[#8A867E]">Client Portal v2.4</p>
          </div>
        </aside>

        {/* Main Content Column */}
        <div className="flex flex-1 flex-col justify-between">
          <main className="mx-auto w-full max-w-5xl px-6 py-10 lg:px-12">
            {/* Portal Heading Row */}
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <p className="text-[10px] font-semibold tracking-[0.22em] text-[#6B786A] uppercase">
                  Client Sanctuary
                </p>
                <h1 className="mt-1 font-serif text-3xl font-semibold text-[#2A2927]">
                  My Sanctuary Portal
                </h1>
                <p className="mt-1 text-[12.5px] text-[#6C6961]">
                  Welcome back, Emma. Your personal haven of organic beauty
                  awaits.
                </p>
              </div>

              <Link
                to="/booking"
                className="inline-flex items-center justify-center gap-2 self-start rounded-lg bg-[#4A5B4B] px-5 py-2.5 text-[12px] font-medium tracking-wide text-[#FAF8F5] shadow-xs transition-colors hover:bg-[#3B4A3C] sm:self-auto"
              >
                <PlusCircle className="h-3.5 w-3.5" strokeWidth={1.8} />
                <span>Book New Ritual</span>
              </Link>
            </div>

            {/* ================= TAB 1: UPCOMING BOOKINGS ================= */}
            {activeTab === 'upcoming' && (
              <div className="mt-10 space-y-10">
                {/* Next Scheduled Experience */}
                <section>
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[#2A2927]">
                      <CalendarCheck
                        className="h-4 w-4 text-[#4A5B4B]"
                        strokeWidth={1.8}
                      />
                      <h2 className="font-serif text-[18px] font-semibold">
                        Next Scheduled Experience
                      </h2>
                    </div>

                    <span
                      className={`rounded-full px-3.5 py-1 text-[11px] font-semibold ${
                        bookingStatus === 'Confirmed'
                          ? 'bg-[#D5E8D7] text-[#355A3A]'
                          : 'bg-[#F3DDD9] text-[#9E3E35]'
                      }`}
                    >
                      {bookingStatus}
                    </span>
                  </div>

                  {/* Main Booking Card */}
                  <div className="grid grid-cols-1 gap-6 rounded-2xl border border-[#ECE8E0] bg-gradient-to-r from-[#F6F4EF] to-[#EFEDE8] p-7 shadow-2xs md:grid-cols-12">
                    {/* Left Details */}
                    <div className="md:col-span-7">
                      <div className="flex flex-wrap items-center gap-4 text-[12px]">
                        <span className="inline-flex items-center gap-1.5 font-semibold text-[#2A2927]">
                          <Calendar className="h-3.5 w-3.5 text-[#4A5B4B]" />
                          Thursday, Oct 17 &middot; 01:15 PM
                        </span>
                        <span className="inline-flex items-center gap-1.5 text-[#7A766E]">
                          <Clock className="h-3.5 w-3.5 text-[#6B786A]" />
                          Duration: 135 mins
                        </span>
                      </div>

                      <h3 className="mt-4 font-serif text-[21px] font-semibold text-[#2A2927]">
                        Organic Hair Couture &amp; Botanical Facial
                      </h3>

                      <p className="mt-2 max-w-md text-[12.5px] leading-relaxed text-[#6C6961]">
                        Custom color &amp; botanical gloss paired with our
                        signature rejuvenating herbal infusion cell-renewal
                        facial treatment.
                      </p>

                      {/* Specialist */}
                      <div className="mt-6 flex items-center gap-3.5">
                        <img
                          src={specialistElena}
                          alt="Elena Rostova"
                          className="h-11 w-11 rounded-xl border border-[#E5E1D8] object-cover"
                        />
                        <div>
                          <p className="text-[13px] font-semibold text-[#2A2927]">
                            Elena Rostova
                          </p>
                          <p className="text-[11px] text-[#7A766E]">
                            Senior Botanical Colorist
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Right Location & Actions */}
                    <div className="flex flex-col justify-between border-t border-[#E5E1D8] pt-5 md:col-span-5 md:border-l md:border-t-0 md:pl-7 md:pt-0">
                      <div>
                        <div className="flex items-start gap-2">
                          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#4A5B4B]" />
                          <div>
                            <p className="text-[13px] font-semibold text-[#2A2927]">
                              Vera &amp; Bloom Sanctuary
                            </p>
                            <p className="mt-0.5 text-[11.5px] leading-relaxed text-[#6C6961]">
                              742 Evergreen Terrace, Suite 400
                              <br />
                              New York, NY 10021
                            </p>
                          </div>
                        </div>

                        <a
                          href="https://maps.google.com"
                          target="_blank"
                          rel="noreferrer"
                          className="mt-3 inline-flex items-center gap-1 text-[11.5px] font-medium text-[#57544E] underline-offset-2 hover:text-[#2A2927] hover:underline"
                        >
                          <span>View Map &amp; Directions</span>
                          <ArrowUpRight className="h-3 w-3" />
                        </a>
                      </div>

                      <div className="mt-6 space-y-2.5">
                        <Link
                          to="/booking"
                          className="block w-full rounded-lg bg-[#E6E3DC] py-2.5 text-center text-[12px] font-medium text-[#2A2927] transition-colors hover:bg-[#DBD7CE]"
                        >
                          Reschedule
                        </Link>

                        {bookingStatus === 'Confirmed' ? (
                          <button
                            type="button"
                            onClick={handleCancelAppointment}
                            className="block w-full cursor-pointer py-1 text-center text-[11.5px] font-medium text-[#B64B42] transition-colors hover:text-[#8E322A]"
                          >
                            Cancel Appointment
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={handleRestoreAppointment}
                            className="block w-full cursor-pointer py-1 text-center text-[11.5px] font-medium text-[#4A5B4B] transition-colors hover:text-[#2A2927]"
                          >
                            Restore Appointment
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </section>

                {/* Recent Past Visits */}
                <section>
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[#2A2927]">
                      <History
                        className="h-4 w-4 text-[#4A5B4B]"
                        strokeWidth={1.8}
                      />
                      <h2 className="font-serif text-[18px] font-semibold">
                        Recent Past Visits
                      </h2>
                    </div>

                    <button
                      type="button"
                      onClick={() => setActiveTab('past')}
                      className="cursor-pointer text-[11.5px] font-medium text-[#6B786A] transition-colors hover:text-[#2A2927]"
                    >
                      View All History
                    </button>
                  </div>

                  <div className="space-y-4">
                    {PAST_VISITS.map((visit) => {
                      const Icon = visit.icon;
                      return (
                        <article
                          key={visit.id}
                          className="flex flex-col justify-between gap-4 rounded-xl border border-[#ECE8E0] bg-[#F5F3EE] px-6 py-5 sm:flex-row sm:items-center"
                        >
                          <div className="flex items-start gap-4">
                            <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#E7EFE8] text-[#4A5B4B]">
                              <Icon className="h-5 w-5" strokeWidth={1.6} />
                            </span>
                            <div>
                              <p className="text-[11.5px] text-[#7A766E]">
                                {visit.date} &bull;{' '}
                                <span className="font-semibold text-[#2A2927]">
                                  {visit.price}
                                </span>
                              </p>
                              <h3 className="mt-0.5 font-serif text-[17px] font-semibold text-[#2A2927]">
                                {visit.title}
                              </h3>
                              <p className="mt-0.5 text-[11.5px] text-[#6C6961]">
                                Specialist: {visit.specialist} &middot;{' '}
                                {visit.summary}
                              </p>
                            </div>
                          </div>

                          <Link
                            to="/booking"
                            className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-lg bg-[#4A5B4B] px-5 py-2.5 text-[11.5px] font-medium text-[#FAF8F5] transition-colors hover:bg-[#3B4A3C]"
                          >
                            <RotateCcw className="h-3.5 w-3.5" />
                            <span>Rebook Ritual</span>
                          </Link>
                        </article>
                      );
                    })}
                  </div>
                </section>

                {/* Loyalty Sanctuary Banner */}
                <section className="flex flex-col justify-between gap-5 rounded-2xl border border-[#E1E8E1] bg-[#F1F5F1] px-7 py-6 sm:flex-row sm:items-center">
                  <div>
                    <p className="text-[10px] font-semibold tracking-[0.2em] text-[#6B786A] uppercase">
                      Loyalty Sanctuary
                    </p>
                    <h2 className="mt-1 font-serif text-[21px] font-semibold text-[#2A2927]">
                      You have {points} Botanical Blossoms
                    </h2>
                    <p className="mt-1 max-w-lg text-[12px] leading-relaxed text-[#6C6961]">
                      Redeem your accumulated points for complimentary
                      aromatherapy infusions or deep conditioning upgrades.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveTab('rewards')}
                    className="shrink-0 cursor-pointer rounded-lg border border-[#D8E0D8] bg-[#FAF8F5] px-5 py-2.5 text-[12px] font-medium text-[#2A2927] shadow-2xs transition-colors hover:bg-[#E7EFE8]"
                  >
                    Explore Rewards
                  </button>
                </section>
              </div>
            )}

            {/* ================= TAB 2: PAST VISITS ================= */}
            {activeTab === 'past' && (
              <section className="mt-10 space-y-4">
                <h2 className="font-serif text-2xl font-semibold text-[#2A2927]">
                  Visit History
                </h2>
                {PAST_VISITS.map((visit) => {
                  const Icon = visit.icon;
                  return (
                    <article
                      key={visit.id}
                      className="flex flex-col justify-between gap-4 rounded-xl border border-[#ECE8E0] bg-[#F5F3EE] px-6 py-5 sm:flex-row sm:items-center"
                    >
                      <div className="flex items-start gap-4">
                        <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#E7EFE8] text-[#4A5B4B]">
                          <Icon className="h-5 w-5" strokeWidth={1.6} />
                        </span>
                        <div>
                          <p className="text-[11.5px] text-[#7A766E]">
                            {visit.date} &bull;{' '}
                            <span className="font-semibold text-[#2A2927]">
                              {visit.price}
                            </span>
                          </p>
                          <h3 className="mt-0.5 font-serif text-[17px] font-semibold text-[#2A2927]">
                            {visit.title}
                          </h3>
                          <p className="mt-0.5 text-[11.5px] text-[#6C6961]">
                            Specialist: {visit.specialist} &middot;{' '}
                            {visit.summary}
                          </p>
                        </div>
                      </div>

                      <Link
                        to="/booking"
                        className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-lg bg-[#4A5B4B] px-5 py-2.5 text-[11.5px] font-medium text-[#FAF8F5] transition-colors hover:bg-[#3B4A3C]"
                      >
                        <RotateCcw className="h-3.5 w-3.5" />
                        <span>Rebook Ritual</span>
                      </Link>
                    </article>
                  );
                })}
              </section>
            )}

            {/* ================= TAB 3: SAVED LOOKS ================= */}
            {activeTab === 'saved' && (
              <section className="mt-10">
                <div className="flex items-center justify-between">
                  <h2 className="font-serif text-2xl font-semibold text-[#2A2927]">
                    Saved Inspiration Looks
                  </h2>
                  <Link
                    to="/lookbook"
                    className="text-xs font-medium text-[#4A5B4B] hover:underline"
                  >
                    Browse Lookbook &rarr;
                  </Link>
                </div>

                <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
                  {SAVED_LOOKS.map((look) => (
                    <article
                      key={look.id}
                      className="overflow-hidden rounded-2xl border border-[#ECE8E0] bg-[#F6F4EF]"
                    >
                      <div className="aspect-[4/3.6] overflow-hidden">
                        <img
                          src={look.image}
                          alt={look.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="p-4">
                        <p className="text-[10px] font-semibold tracking-wider text-[#6B786A] uppercase">
                          {look.category}
                        </p>
                        <h3 className="mt-1 font-serif text-[16px] font-semibold text-[#2A2927]">
                          {look.title}
                        </h3>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            )}

            {/* ================= TAB 4: BOTANICAL REWARDS ================= */}
            {activeTab === 'rewards' && (
              <section className="mt-10 space-y-6">
                <div className="rounded-2xl border border-[#E1E8E1] bg-[#F1F5F1] p-6">
                  <p className="text-[10px] font-semibold tracking-[0.2em] text-[#6B786A] uppercase">
                    Available Balance
                  </p>
                  <p className="mt-1 font-serif text-3xl font-semibold text-[#2A2927]">
                    {points} Botanical Blossoms
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  {REWARD_PERKS.map((perk) => (
                    <article
                      key={perk.id}
                      className="flex flex-col justify-between rounded-xl border border-[#ECE8E0] bg-[#F6F4EF] p-5"
                    >
                      <div>
                        <span className="rounded-full bg-[#EFE0C6] px-2.5 py-0.5 text-[10px] font-semibold text-[#7A6444]">
                          {perk.points} Blossoms
                        </span>
                        <h3 className="mt-3 font-serif text-[17px] font-semibold text-[#2A2927]">
                          {perk.name}
                        </h3>
                        <p className="mt-1.5 text-[12px] text-[#6C6961]">
                          {perk.description}
                        </p>
                      </div>

                      <button
                        type="button"
                        disabled={points < perk.points}
                        onClick={() => handleRedeem(perk)}
                        className="mt-5 w-full cursor-pointer rounded-lg bg-[#4A5B4B] py-2 text-xs font-medium text-[#FAF8F5] transition-colors hover:bg-[#3B4A3C] disabled:cursor-not-allowed disabled:opacity-45"
                      >
                        {redeemedId === perk.id ? 'Redeemed!' : 'Redeem Perk'}
                      </button>
                    </article>
                  ))}
                </div>
              </section>
            )}

            {/* ================= TAB 5: PROFILE SETTINGS ================= */}
            {activeTab === 'profile' && (
              <section className="mt-10 max-w-2xl rounded-2xl border border-[#ECE8E0] bg-[#F6F4EF] p-7">
                <h2 className="font-serif text-2xl font-semibold text-[#2A2927]">
                  Personal Sanctuary Profile
                </h2>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setProfileSaved(true);
                  }}
                  className="mt-6 space-y-4"
                >
                  <div>
                    <label className="block text-xs font-medium text-[#57544E]">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={profileForm.name}
                      onChange={(e) => {
                        setProfileSaved(false);
                        setProfileForm({ ...profileForm, name: e.target.value });
                      }}
                      className="mt-1.5 w-full rounded-lg border border-[#E2DDD4] bg-[#FAF8F5] px-3.5 py-2.5 text-sm text-[#2A2927] focus:border-[#4A5B4B] focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-medium text-[#57544E]">
                        Email
                      </label>
                      <input
                        type="email"
                        value={profileForm.email}
                        onChange={(e) => {
                          setProfileSaved(false);
                          setProfileForm({
                            ...profileForm,
                            email: e.target.value,
                          });
                        }}
                        className="mt-1.5 w-full rounded-lg border border-[#E2DDD4] bg-[#FAF8F5] px-3.5 py-2.5 text-sm text-[#2A2927] focus:border-[#4A5B4B] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#57544E]">
                        Phone
                      </label>
                      <input
                        type="tel"
                        value={profileForm.phone}
                        onChange={(e) => {
                          setProfileSaved(false);
                          setProfileForm({
                            ...profileForm,
                            phone: e.target.value,
                          });
                        }}
                        className="mt-1.5 w-full rounded-lg border border-[#E2DDD4] bg-[#FAF8F5] px-3.5 py-2.5 text-sm text-[#2A2927] focus:border-[#4A5B4B] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#57544E]">
                      Botanical &amp; Care Preferences
                    </label>
                    <textarea
                      rows={3}
                      value={profileForm.preferences}
                      onChange={(e) => {
                        setProfileSaved(false);
                        setProfileForm({
                          ...profileForm,
                          preferences: e.target.value,
                        });
                      }}
                      className="mt-1.5 w-full rounded-lg border border-[#E2DDD4] bg-[#FAF8F5] px-3.5 py-2.5 text-sm text-[#2A2927] focus:border-[#4A5B4B] focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center gap-4 pt-2">
                    <button
                      type="submit"
                      className="cursor-pointer rounded-lg bg-[#4A5B4B] px-6 py-2.5 text-xs font-medium text-[#FAF8F5] transition-colors hover:bg-[#3B4A3C]"
                    >
                      Save Preferences
                    </button>
                    {profileSaved && (
                      <span className="text-xs font-medium text-[#4A5B4B]">
                        Preferences updated.
                      </span>
                    )}
                  </div>
                </form>
              </section>
            )}
          </main>

          {/* Portal Footer */}
          <footer className="border-t border-[#E6E2DA] bg-[#F3F0EA]">
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 px-6 py-10 sm:grid-cols-2 lg:px-12">
              <div>
                <h3 className="font-serif text-[14px] font-semibold text-[#2A2927]">
                  Salon Hours
                </h3>
                <p className="mt-1.5 text-[11.5px] leading-relaxed text-[#6C6961]">
                  Tuesday &ndash; Saturday: 9am &ndash; 7pm
                  <br />
                  Sunday: 10am &ndash; 5pm
                </p>
              </div>
              <div>
                <h3 className="font-serif text-[14px] font-semibold text-[#2A2927]">
                  Sanctuary Address
                </h3>
                <p className="mt-1.5 text-[11.5px] leading-relaxed text-[#6C6961]">
                  742 Evergreen Terrace, Suite 400
                  <br />
                  New York, NY 10021
                </p>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
