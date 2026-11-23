import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Calendar,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Crown,
  Flower2,
  MapPin,
  MessageCircle,
  Minus,
  Plus,
  Sparkles,
  X,
} from 'lucide-react';

import bridalHero from '../../assets/bridal-hero.jpg';
import bridalKandyan from '../../assets/bridal-kandyan.jpg';
import bridalModern from '../../assets/ritual-bridal.jpg';
import bridalPrep from '../../assets/bridal-prep.jpg';
import wallpaperBridalAtelier from '../../assets/wallpaper-bridal-atelier.jpg';
import { submitBridalInquiry } from '../../services/salonService';

const BRIDAL_SLIDES = [
  {
    id: 'slide-0',
    label: 'Luxury Bridal Vanity Suite',
    image: wallpaperBridalAtelier,
    position: 'object-center',
  },
  {
    id: 'slide-1',
    label: 'Garden Couture Bridal',
    image: bridalHero,
    position: 'object-top',
  },
  {
    id: 'slide-2',
    label: 'Kandyan Heritage Artistry',
    image: bridalKandyan,
    position: 'object-center',
  },
  {
    id: 'slide-3',
    label: 'Luminous Modern Romance',
    image: bridalModern,
    position: 'object-center',
  },
];

const BRIDAL_JOURNEY = [
  {
    step: '01',
    title: 'Private Consultation',
    detail: 'Moodboard curation, attire & floral harmony planning.',
  },
  {
    step: '02',
    title: '2-Hour Bridal Trial',
    detail: 'Complete hair architecture & organic skin-match preview.',
  },
  {
    step: '03',
    title: 'Pre-Wedding Glow',
    detail: 'Botanical facial & camellia glossing 7 days prior.',
  },
  {
    step: '04',
    title: 'Wedding Morning',
    detail: 'Unhurried private suite or on-location hotel artistry.',
  },
];

const BRIDAL_PACKAGES = [
  {
    id: 'engagement-radiance',
    tier: 'TIER 01',
    name: 'Engagement Radiance',
    description:
      'Tailored for pre-wedding shoots, engagement ceremonies, and intimate celebrations.',
    price: 'LKR 35,000',
    priceNote: 'Per session • In-sanctuary',
    featured: false,
    icon: Flower2,
    features: [
      'HD Botanical Makeup Application',
      'Bespoke Hair Styling or Setting',
      'Hand-Picked Fresh Floral Accents',
      'Complimentary Lip Touch-up Kit',
    ],
  },
  {
    id: 'classic-wedding-day',
    tier: 'TIER 02',
    name: 'Classic Wedding Day',
    badge: 'MOST SOUGHT AFTER',
    description:
      'Our signature bridal artistry experience for the main ceremony and reception look.',
    price: 'LKR 85,000',
    priceNote: 'Private sanctuary suite or venue visit',
    featured: true,
    icon: Sparkles,
    features: [
      'Comprehensive 2-Hour Trial Hair & Makeup',
      'Wedding Day Luxury Botanical Skin Prep',
      'Full-Day Veil & Saree Draping Assistance',
      'Pre-ceremony Touch-up until Reception',
      'Luxury Touch-up Kit & Fragrance Vial',
    ],
  },
  {
    id: 'complete-bridal-sanctuary',
    tier: 'TIER 03',
    name: 'Complete Bridal Sanctuary',
    description:
      'The ultimate VIP bridal celebration package for multi-day ceremonies and grand receptions.',
    price: 'LKR 150,000',
    priceNote: 'Multi-day bespoke journey',
    featured: false,
    icon: Crown,
    features: [
      'Multiple Event Looks + Makeup Suites',
      'Pre-Bridal Botanical Facial & Hair Treatments',
      'Full-Day VIP Styling for 2 Separate Events',
      'Dedicated Stylist On-Site Throughout',
      'Mother of the Bride Styling Included',
    ],
  },
];

const REAL_BRIDES = [
  {
    id: 'amaya',
    category: 'KANDYAN & TRADITIONAL',
    name: 'Amaya Perera',
    packageName: 'Classic Wedding Day Package',
    image: bridalKandyan,
  },
  {
    id: 'natasha',
    category: 'TIMELESS MODERN BRIDAL',
    name: 'Natasha M.',
    packageName: 'Engagement Radiance',
    image: bridalModern,
  },
  {
    id: 'priya',
    category: 'RADIANT PREPARATION',
    name: 'Priya & Team',
    packageName: 'Complete Bridal Sanctuary',
    image: bridalPrep,
  },
];

const BRIDAL_FAQS = [
  {
    question: 'When should I book my bridal trial?',
    answer:
      'We recommend scheduling your trial session 4 to 8 weeks prior to your wedding day, ideally coinciding with your final dress fitting or pre-wedding photography consultation.',
  },
  {
    question: 'Do you travel on-location for wedding preparations?',
    answer:
      'Yes. Our senior bridal artists and stylists are available for on-site travel to your hotel, residence, or venue across the island, with travel arrangements tailored to your itinerary.',
  },
  {
    question: 'What skincare prep is included?',
    answer:
      'Every bridal package begins with organic botanical skin prep using hydro-mist toners, rosehip elixirs, and soothing facial massage to create a deeply luminous canvas before makeup application.',
  },
  {
    question: 'Can you style bridesmaids and mothers on the same morning?',
    answer:
      'Absolutely. We assign additional senior artists based on your bridal party headcount so everyone is serene, camera-ready, and ahead of schedule.',
  },
];

export default function BridalPage() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [openFaqIdx, setOpenFaqIdx] = useState(0);
  const [selectedBrideModal, setSelectedBrideModal] = useState(null);
  const [estimatorPkg, setEstimatorPkg] = useState('classic-wedding-day');
  const [bridesmaidsCount, setBridesmaidsCount] = useState(3);
  const [mothersCount, setMothersCount] = useState(2);
  const [includeTravel, setIncludeTravel] = useState(true);
  const [formState, setFormState] = useState({
    fullName: '',
    email: '',
    eventDate: '',
    venue: '',
    guestCount: 'Just the Bride',
    notes: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const packagePrices = {
    'engagement-radiance': 35000,
    'classic-wedding-day': 85000,
    'complete-bridal-sanctuary': 150000,
  };
  const estimatedTotal =
    (packagePrices[estimatorPkg] || 85000) +
    bridesmaidsCount * 6500 +
    mothersCount * 7500 +
    (includeTravel ? 15000 : 0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % BRIDAL_SLIDES.length);
    }, 5500);
    return () => clearInterval(timer);
  }, []);

  const handleSelectPackage = (pkgName) => {
    setFormState((prev) => ({
      ...prev,
      notes: prev.notes
        ? prev.notes
        : `Interested in the ${pkgName} package. `,
    }));
    setSubmitted(false);
    document
      .getElementById('bridal-quote')
      ?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await submitBridalInquiry({
      bride_name: formState.fullName,
      email: formState.email,
      event_date: formState.eventDate || null,
      venue: formState.venue,
      guest_count: formState.guestCount,
      style_notes: formState.notes,
    });
    setSubmitted(true);
  };

  return (
    <div className="bg-[#FAF8F5]">
      {/* ================= CINEMATIC LIVE BRIDAL HERO ================= */}
      <section className="relative min-h-[78vh] w-full overflow-hidden bg-[#1D241E]">
        {BRIDAL_SLIDES.map((slide, idx) => {
          const isActive = idx === activeSlide;
          return (
            <div
              key={slide.id}
              aria-hidden={!isActive}
              className={`absolute inset-0 transition-opacity duration-[1400ms] ease-in-out ${
                isActive ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img
                key={isActive ? `${slide.id}-${activeSlide}` : slide.id}
                src={slide.image}
                alt={slide.label}
                className={`h-full w-full object-cover ${slide.position} ${
                  isActive ? 'animate-ken-burns' : 'scale-105'
                }`}
              />
            </div>
          );
        })}

        {/* Atmospheric Readability Gradient */}
        <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-b from-[#1A211B]/70 via-[#1A211B]/48 to-[#1A211B]/82" />

        {/* Hero Foreground */}
        <div className="relative z-20 mx-auto flex min-h-[78vh] max-w-7xl flex-col justify-between px-6 pb-10 pt-20 lg:px-10">
          <div className="mx-auto my-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#EFE0C6]/35 bg-[#EFE0C6]/15 px-4 py-1.5 text-[10px] font-semibold tracking-[0.26em] text-[#F5E6CB] uppercase backdrop-blur-md">
              <Sparkles className="h-3 w-3" />
              Bespoke Bridal Sanctuary
            </span>

            <h1 className="mt-6 font-serif text-4xl font-medium leading-[1.1] text-[#FAF8F5] sm:text-6xl lg:text-[64px]">
              Timeless Elegance for Your{' '}
              <span className="italic text-[#EFE0C6]">
                Most Cherished Moments
              </span>
            </h1>

            <p className="mx-auto mt-5 max-w-xl text-[14.5px] leading-relaxed text-[#E6E2DA]">
              Elevate your wedding morning with serene, organic botanical
              artistry tailored to celebrate your luminous natural radiance.
            </p>

            <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
              <a
                href="#bridal-packages"
                className="inline-flex items-center gap-2 rounded-xl bg-[#FAF8F5] px-7 py-3.5 text-[13px] font-semibold tracking-wide text-[#222B23] shadow-lg transition-all hover:-translate-y-0.5 hover:bg-[#EFE0C6]"
              >
                <span>Explore Packages</span>
                <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="#bridal-quote"
                className="rounded-xl border border-white/35 bg-white/10 px-7 py-3.5 text-[13px] font-medium tracking-wide text-[#FAF8F5] backdrop-blur-md transition-colors hover:bg-white/20"
              >
                Book Bridal Consultation
              </a>
            </div>
          </div>

          {/* Bottom Bar: Private Suite Pill + Slide Indicators */}
          <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-white/15 pt-5">
            <div className="inline-flex items-center gap-3 rounded-2xl border border-white/20 bg-[#1B221B]/60 px-4 py-2.5 text-[#FAF8F5] backdrop-blur-md">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#EFE0C6]/20 text-[#EFE0C6]">
                <Crown className="h-4 w-4" />
              </span>
              <div>
                <p className="text-[11.5px] font-semibold">
                  Private Bridal Suite
                </p>
                <p className="text-[10px] text-[#C9D2CA]">
                  On-site hotel &amp; venue artistry island-wide
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  setActiveSlide(
                    (prev) =>
                      (prev - 1 + BRIDAL_SLIDES.length) % BRIDAL_SLIDES.length
                  )
                }
                aria-label="Previous bridal slide"
                className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-white/25 bg-white/10 text-[#FAF8F5] backdrop-blur-md hover:bg-white/20"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              {BRIDAL_SLIDES.map((s, idx) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setActiveSlide(idx)}
                  aria-label={`Show ${s.label}`}
                  className={`h-2 cursor-pointer rounded-full transition-all ${
                    idx === activeSlide
                      ? 'w-8 bg-[#EFE0C6]'
                      : 'w-2 bg-white/35 hover:bg-white/60'
                  }`}
                />
              ))}
              <button
                type="button"
                onClick={() =>
                  setActiveSlide((prev) => (prev + 1) % BRIDAL_SLIDES.length)
                }
                aria-label="Next bridal slide"
                className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-white/25 bg-white/10 text-[#FAF8F5] backdrop-blur-md hover:bg-white/20"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 4-STEP BRIDAL JOURNEY STRIP ================= */}
      <section className="border-b border-[#E6E2DA] bg-[#F3F0EA]">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-6 py-12 sm:grid-cols-2 lg:grid-cols-4 lg:px-10">
          {BRIDAL_JOURNEY.map((item) => (
            <div
              key={item.step}
              className="rounded-2xl border border-[#E6E2DA] bg-[#FAF8F5] p-5"
            >
              <span className="font-serif text-xl font-semibold text-[#6B786A]">
                {item.step}
              </span>
              <h3 className="mt-2 font-serif text-lg font-semibold text-[#2A2927]">
                {item.title}
              </h3>
              <p className="mt-1 text-[12px] leading-relaxed text-[#6C6961]">
                {item.detail}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= EDITORIAL QUOTE STRIP ================= */}
      <section className="mx-auto max-w-3xl px-6 py-16 text-center lg:py-20">
        <Flower2
          className="mx-auto h-5 w-5 text-[#6B786A]"
          strokeWidth={1.5}
        />
        <blockquote className="mt-5 font-serif text-2xl font-medium italic leading-relaxed text-[#2A2927] sm:text-[28px]">
          &ldquo;We believe bridal beauty should never feel like a
          transformation into someone else, but rather the most radiant,
          effortless expression of who you truly are.&rdquo;
        </blockquote>
        <p className="mt-4 text-[10px] font-semibold tracking-[0.24em] text-[#8A867E] uppercase">
          &mdash; Vera &amp; Bloom Bridal Collective
        </p>
      </section>

      {/* ================= MODERN BRIDAL SANCTUARY PACKAGES ================= */}
      <section
        id="bridal-packages"
        className="mx-auto max-w-7xl px-6 pb-24 pt-2 lg:px-10"
      >
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-[10.5px] font-semibold tracking-[0.24em] text-[#6B786A] uppercase">
            Curated Collections
          </p>
          <h2 className="mt-2.5 font-serif text-4xl font-semibold text-[#2A2927] sm:text-5xl">
            Bridal Sanctuary Packages
          </h2>
          <p className="mt-3 text-[14px] text-[#6C6961]">
            Designed for serene, unhurried artistry from pre-wedding
            celebrations to grand reception.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 items-stretch gap-7 lg:grid-cols-3">
          {BRIDAL_PACKAGES.map((pkg) => {
            const Icon = pkg.icon;
            return (
              <article
                key={pkg.id}
                className={`relative flex flex-col justify-between rounded-[26px] p-8 transition-all duration-300 ${
                  pkg.featured
                    ? 'bg-[#253026] text-[#FAF8F5] shadow-2xl lg:-my-4 lg:py-11'
                    : 'border border-[#E6E2DA] bg-[#FAF8F5] text-[#2A2927] shadow-2xs hover:-translate-y-1 hover:shadow-lg'
                }`}
              >
                {pkg.badge && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-[#EFE0C6] px-4 py-1 text-[9.5px] font-semibold tracking-[0.2em] text-[#222B23] uppercase shadow-md">
                    {pkg.badge}
                  </span>
                )}

                <div>
                  {/* Tier + Icon */}
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[10px] font-semibold tracking-[0.22em] uppercase ${
                        pkg.featured ? 'text-[#EFE0C6]' : 'text-[#8A867E]'
                      }`}
                    >
                      {pkg.tier}
                    </span>
                    <span
                      className={`inline-flex h-9 w-9 items-center justify-center rounded-xl ${
                        pkg.featured
                          ? 'bg-white/10 text-[#EFE0C6]'
                          : 'bg-[#EFECE6] text-[#4A5B4B]'
                      }`}
                    >
                      <Icon className="h-4 w-4" strokeWidth={1.7} />
                    </span>
                  </div>

                  {/* Name & Description */}
                  <h3 className="mt-4 font-serif text-[26px] font-semibold">
                    {pkg.name}
                  </h3>
                  <p
                    className={`mt-2 text-[13px] leading-relaxed ${
                      pkg.featured ? 'text-[#C9D2CA]' : 'text-[#6C6961]'
                    }`}
                  >
                    {pkg.description}
                  </p>

                  {/* Price */}
                  <div
                    className={`mt-6 border-b pb-5 ${
                      pkg.featured ? 'border-white/15' : 'border-[#ECE8E0]'
                    }`}
                  >
                    <p
                      className={`font-serif text-[30px] font-semibold ${
                        pkg.featured ? 'text-[#EFE0C6]' : 'text-[#2A2927]'
                      }`}
                    >
                      {pkg.price}
                    </p>
                    <p
                      className={`mt-0.5 text-[11px] ${
                        pkg.featured ? 'text-[#A8B4A9]' : 'text-[#8A867E]'
                      }`}
                    >
                      {pkg.priceNote}
                    </p>
                  </div>

                  {/* Features */}
                  <ul className="mt-6 space-y-3.5">
                    {pkg.features.map((feat) => (
                      <li
                        key={feat}
                        className={`flex items-start gap-2.5 text-[13px] leading-snug ${
                          pkg.featured ? 'text-[#E6E2DA]' : 'text-[#4A4741]'
                        }`}
                      >
                        <span
                          className={`mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full ${
                            pkg.featured
                              ? 'bg-[#EFE0C6]/20 text-[#EFE0C6]'
                              : 'bg-[#E7ECE7] text-[#4A5B4B]'
                          }`}
                        >
                          <Check className="h-2.5 w-2.5" strokeWidth={2.6} />
                        </span>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA */}
                <button
                  type="button"
                  onClick={() => handleSelectPackage(pkg.name)}
                  className={`mt-9 w-full cursor-pointer rounded-xl py-3.5 text-[12.5px] font-semibold tracking-wide transition-all ${
                    pkg.featured
                      ? 'bg-[#EFE0C6] text-[#222B23] shadow-md hover:bg-[#FAF8F5]'
                      : 'border border-[#4A5B4B] bg-transparent text-[#4A5B4B] hover:bg-[#4A5B4B] hover:text-[#FAF8F5]'
                  }`}
                >
                  Select Package
                </button>
              </article>
            );
          })}
        </div>

        {/* Interactive Bridal Package Estimator Bar */}
        <div className="mt-14 rounded-[26px] border border-[#E5E1D8] bg-[#F3F0EA] p-6 sm:p-8">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
            <div>
              <p className="text-[10px] font-semibold tracking-[0.22em] text-[#6B786A] uppercase">
                Instant Bridal Estimator
              </p>
              <h3 className="mt-1 font-serif text-2xl font-semibold text-[#2A2927]">
                Customize Your Bridal Party Estimate
              </h3>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              {/* Package selector */}
              <select
                value={estimatorPkg}
                onChange={(e) => setEstimatorPkg(e.target.value)}
                aria-label="Select bridal package"
                className="rounded-xl border border-[#DCD7CC] bg-[#FAF8F5] px-4 py-2.5 text-xs font-medium text-[#2A2927] focus:border-[#4A5B4B] focus:outline-none"
              >
                <option value="engagement-radiance">
                  Engagement Radiance (LKR 35k)
                </option>
                <option value="classic-wedding-day">
                  Classic Wedding Day (LKR 85k)
                </option>
                <option value="complete-bridal-sanctuary">
                  Complete Sanctuary (LKR 150k)
                </option>
              </select>

              {/* Bridesmaids counter */}
              <div className="flex items-center gap-2.5 rounded-xl border border-[#DCD7CC] bg-[#FAF8F5] px-3 py-1.5 text-xs">
                <span className="text-[#6C6961]">Bridesmaids</span>
                <button
                  type="button"
                  onClick={() =>
                    setBridesmaidsCount((c) => Math.max(0, c - 1))
                  }
                  className="inline-flex h-6 w-6 cursor-pointer items-center justify-center rounded-md bg-[#EFECE6] text-[#2A2927] hover:bg-[#E2DDD4]"
                >
                  <Minus className="h-3 w-3" />
                </button>
                <span className="w-4 text-center font-semibold">
                  {bridesmaidsCount}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setBridesmaidsCount((c) => Math.min(10, c + 1))
                  }
                  className="inline-flex h-6 w-6 cursor-pointer items-center justify-center rounded-md bg-[#EFECE6] text-[#2A2927] hover:bg-[#E2DDD4]"
                >
                  <Plus className="h-3 w-3" />
                </button>
              </div>

              {/* Mothers counter */}
              <div className="flex items-center gap-2.5 rounded-xl border border-[#DCD7CC] bg-[#FAF8F5] px-3 py-1.5 text-xs">
                <span className="text-[#6C6961]">Mothers</span>
                <button
                  type="button"
                  onClick={() => setMothersCount((c) => Math.max(0, c - 1))}
                  className="inline-flex h-6 w-6 cursor-pointer items-center justify-center rounded-md bg-[#EFECE6] text-[#2A2927] hover:bg-[#E2DDD4]"
                >
                  <Minus className="h-3 w-3" />
                </button>
                <span className="w-4 text-center font-semibold">
                  {mothersCount}
                </span>
                <button
                  type="button"
                  onClick={() => setMothersCount((c) => Math.min(4, c + 1))}
                  className="inline-flex h-6 w-6 cursor-pointer items-center justify-center rounded-md bg-[#EFECE6] text-[#2A2927] hover:bg-[#E2DDD4]"
                >
                  <Plus className="h-3 w-3" />
                </button>
              </div>

              {/* On-location toggle */}
              <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-[#DCD7CC] bg-[#FAF8F5] px-3.5 py-2 text-xs font-medium text-[#2A2927]">
                <input
                  type="checkbox"
                  checked={includeTravel}
                  onChange={(e) => setIncludeTravel(e.target.checked)}
                  className="h-3.5 w-3.5 accent-[#4A5B4B]"
                />
                <span>On-Site Venue</span>
              </label>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-[#E2DDD4] pt-5">
            <div>
              <span className="text-xs text-[#7A766E]">
                Estimated Custom Quote:{' '}
              </span>
              <span className="ml-2 font-serif text-2xl font-semibold text-[#2A2927]">
                LKR {estimatedTotal.toLocaleString('en-US')}
              </span>
            </div>

            <button
              type="button"
              onClick={() => {
                setFormState((prev) => ({
                  ...prev,
                  guestCount:
                    bridesmaidsCount + mothersCount === 0
                      ? 'Just the Bride'
                      : bridesmaidsCount + mothersCount <= 2
                        ? 'Bride + 1–2 Guests'
                        : bridesmaidsCount + mothersCount <= 5
                          ? 'Bride + 3–5 Guests'
                          : 'Bride + 6+ Guests',
                  notes: `Custom Estimate: ${estimatorPkg.replace(/-/g, ' ')} + ${bridesmaidsCount} Bridesmaids + ${mothersCount} Mothers${includeTravel ? ' + On-Site Venue Travel' : ''} (Est. LKR ${estimatedTotal.toLocaleString('en-US')}).`,
                }));
                document
                  .getElementById('bridal-quote')
                  ?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-[#4A5B4B] px-5 py-2.5 text-xs font-semibold text-[#FAF8F5] transition-colors hover:bg-[#3B4A3C]"
            >
              <span>Lock In Estimate</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* ================= BRIDAL ARCHIVES: REAL VERA BRIDES ================= */}
      <section className="border-y border-[#E6E2DA] bg-[#F3F0EA] py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-[10.5px] font-semibold tracking-[0.24em] text-[#6B786A] uppercase">
                Bridal Archives
              </p>
              <h2 className="mt-2 font-serif text-4xl font-semibold text-[#2A2927]">
                Real Vera Brides
              </h2>
            </div>

            <Link
              to="/lookbook"
              className="inline-flex items-center gap-2 rounded-full border border-[#DCD7CC] bg-[#FAF8F5] px-5 py-2.5 text-[11px] font-semibold tracking-[0.14em] text-[#2A2927] uppercase transition-colors hover:bg-[#EAE6DE]"
            >
              <span>View Full Lookbook</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-7 md:grid-cols-3">
            {REAL_BRIDES.map((bride) => (
              <button
                key={bride.id}
                type="button"
                onClick={() => setSelectedBrideModal(bride)}
                className="group relative aspect-[4/4.3] w-full cursor-pointer overflow-hidden rounded-[24px] bg-[#E6E2DA] text-left shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-xl"
              >
                <img
                  src={bride.image}
                  alt={`${bride.name} — ${bride.packageName}`}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A211B]/85 via-[#1A211B]/20 to-transparent" />
                <span className="absolute left-4 top-4 rounded-full bg-[#FAF8F5]/90 px-3 py-1 text-[9.5px] font-semibold tracking-[0.16em] text-[#2A2927] uppercase backdrop-blur-xs">
                  {bride.category}
                </span>
                <div className="absolute inset-x-0 bottom-0 p-6 text-[#FAF8F5]">
                  <h3 className="font-serif text-2xl font-semibold">
                    {bride.name}
                  </h3>
                  <p className="mt-1 text-[12px] text-[#EFE0C6]">
                    {bride.packageName}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ================= SPLIT ARCHITECTURAL QUOTE FORM ================= */}
      <section
        id="bridal-quote"
        className="mx-auto max-w-6xl px-6 py-24 lg:px-10"
      >
        <div className="grid grid-cols-1 overflow-hidden rounded-[30px] border border-[#E5E1D8] bg-[#FAF8F5] shadow-xl lg:grid-cols-12">
          {/* Left Dark-Sage Concierge Info Panel */}
          <div className="flex flex-col justify-between bg-[#253026] p-8 text-[#FAF8F5] sm:p-10 lg:col-span-5">
            <div>
              <p className="text-[10px] font-semibold tracking-[0.24em] text-[#EFE0C6] uppercase">
                Begin Your Journey
              </p>
              <h2 className="mt-3 font-serif text-3xl font-semibold leading-tight sm:text-4xl">
                Request a Custom Bridal Quote
              </h2>
              <p className="mt-4 text-[13px] leading-relaxed text-[#C9D2CA]">
                Share your wedding dates and aesthetic vision. Our dedicated
                Bridal Concierge will craft a bespoke itinerary within 24 hours.
              </p>

              <div className="mt-8 space-y-4 border-t border-white/15 pt-7 text-[12.5px] text-[#E6E2DA]">
                <div className="flex items-start gap-3">
                  <Calendar className="mt-0.5 h-4 w-4 shrink-0 text-[#EFE0C6]" />
                  <span>Priority 2026 &amp; 2027 wedding date reservations</span>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#EFE0C6]" />
                  <span>
                    In-sanctuary private bridal suite or island-wide venue
                    travel
                  </span>
                </div>
              </div>
            </div>

            <a
              href="https://wa.me/15550199"
              target="_blank"
              rel="noreferrer"
              className="mt-10 inline-flex items-center justify-center gap-2 rounded-xl border border-[#EFE0C6]/35 bg-white/10 px-5 py-3 text-xs font-medium text-[#FAF8F5] transition-colors hover:bg-[#EFE0C6] hover:text-[#222B23]"
            >
              <MessageCircle className="h-4 w-4" />
              <span>Chat with Bridal Concierge</span>
            </a>
          </div>

          {/* Right Form Panel */}
          <div className="p-8 sm:p-10 lg:col-span-7">
            {submitted ? (
              <div className="flex h-full flex-col items-center justify-center py-10 text-center">
                <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#E5ECE6] text-[#4A5B4B]">
                  <CheckCircle2 className="h-8 w-8" />
                </span>
                <h3 className="mt-4 font-serif text-3xl font-semibold text-[#2A2927]">
                  Thank You, {formState.fullName || 'Lovely Bride'}
                </h3>
                <p className="mx-auto mt-2.5 max-w-md text-[13.5px] leading-relaxed text-[#6C6961]">
                  Your bespoke bridal inquiry has been saved. Our Bridal
                  Concierge will reach out within 24 hours with your curated
                  quote.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="mt-7 cursor-pointer rounded-full border border-[#D8D3C8] px-6 py-2.5 text-xs font-semibold text-[#2A2927] transition-colors hover:bg-[#EFECE6]"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-[11.5px] font-semibold text-[#4A4741]">
                      Bride&rsquo;s Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formState.fullName}
                      onChange={(e) =>
                        setFormState({ ...formState, fullName: e.target.value })
                      }
                      placeholder="e.g. Amaya Perera"
                      className="mt-1.5 w-full rounded-xl border border-[#E2DDD4] bg-[#F6F4EF] px-4 py-3 text-[13px] text-[#2A2927] placeholder:text-[#A8A49B] focus:border-[#4A5B4B] focus:bg-[#FAF8F5] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11.5px] font-semibold text-[#4A4741]">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={formState.email}
                      onChange={(e) =>
                        setFormState({ ...formState, email: e.target.value })
                      }
                      placeholder="amaya@example.com"
                      className="mt-1.5 w-full rounded-xl border border-[#E2DDD4] bg-[#F6F4EF] px-4 py-3 text-[13px] text-[#2A2927] placeholder:text-[#A8A49B] focus:border-[#4A5B4B] focus:bg-[#FAF8F5] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div>
                    <label className="block text-[11.5px] font-semibold text-[#4A4741]">
                      Event Date
                    </label>
                    <input
                      type="date"
                      required
                      value={formState.eventDate}
                      onChange={(e) =>
                        setFormState({
                          ...formState,
                          eventDate: e.target.value,
                        })
                      }
                      className="mt-1.5 w-full rounded-xl border border-[#E2DDD4] bg-[#F6F4EF] px-3.5 py-3 text-[13px] text-[#2A2927] focus:border-[#4A5B4B] focus:bg-[#FAF8F5] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11.5px] font-semibold text-[#4A4741]">
                      Venue / City
                    </label>
                    <input
                      type="text"
                      required
                      value={formState.venue}
                      onChange={(e) =>
                        setFormState({ ...formState, venue: e.target.value })
                      }
                      placeholder="e.g. Shangri-La Colombo"
                      className="mt-1.5 w-full rounded-xl border border-[#E2DDD4] bg-[#F6F4EF] px-3.5 py-3 text-[13px] text-[#2A2927] placeholder:text-[#A8A49B] focus:border-[#4A5B4B] focus:bg-[#FAF8F5] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11.5px] font-semibold text-[#4A4741]">
                      Bridal Party
                    </label>
                    <select
                      value={formState.guestCount}
                      onChange={(e) =>
                        setFormState({
                          ...formState,
                          guestCount: e.target.value,
                        })
                      }
                      className="mt-1.5 w-full rounded-xl border border-[#E2DDD4] bg-[#F6F4EF] px-3.5 py-3 text-[13px] text-[#2A2927] focus:border-[#4A5B4B] focus:bg-[#FAF8F5] focus:outline-none"
                    >
                      <option value="Just the Bride">Just the Bride</option>
                      <option value="Bride + 1–2 Guests">
                        Bride + 1&ndash;2 Guests
                      </option>
                      <option value="Bride + 3–5 Guests">
                        Bride + 3&ndash;5 Guests
                      </option>
                      <option value="Bride + 6+ Guests">
                        Bride + 6+ Guests
                      </option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11.5px] font-semibold text-[#4A4741]">
                    Preferred Package or Style Notes
                  </label>
                  <textarea
                    rows={4}
                    value={formState.notes}
                    onChange={(e) =>
                      setFormState({ ...formState, notes: e.target.value })
                    }
                    placeholder="Tell us about your aesthetic, saree/gown, floral preferences, or any special timeline needs..."
                    className="mt-1.5 w-full rounded-xl border border-[#E2DDD4] bg-[#F6F4EF] px-4 py-3 text-[13px] text-[#2A2927] placeholder:text-[#A8A49B] focus:border-[#4A5B4B] focus:bg-[#FAF8F5] focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#4A5B4B] px-8 py-4 text-[13px] font-semibold tracking-wide text-[#FAF8F5] shadow-sm transition-colors hover:bg-[#3B4A3C]"
                >
                  <span>Submit Inquiry Request</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ================= INTERACTIVE ACCORDION FAQS ================= */}
      <section className="mx-auto max-w-3xl px-6 pb-24">
        <div className="text-center">
          <p className="text-[10.5px] font-semibold tracking-[0.24em] text-[#6B786A] uppercase">
            Bridal Guidance
          </p>
          <h2 className="mt-2 font-serif text-4xl font-semibold text-[#2A2927]">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="mt-10 space-y-3.5">
          {BRIDAL_FAQS.map((faq, idx) => {
            const isOpen = openFaqIdx === idx;
            return (
              <article
                key={faq.question}
                className={`overflow-hidden rounded-2xl border transition-colors ${
                  isOpen
                    ? 'border-[#4A5B4B]/40 bg-[#FAF8F5] shadow-xs'
                    : 'border-[#ECE8E0] bg-[#F6F4EF]'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIdx(isOpen ? -1 : idx)}
                  className="flex w-full cursor-pointer items-center justify-between gap-4 px-6 py-5 text-left"
                >
                  <h3 className="font-serif text-[19px] font-semibold text-[#2A2927]">
                    {faq.question}
                  </h3>
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 text-[#4A5B4B] transition-transform duration-300 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="border-t border-[#F0EDE7] px-6 pb-5 pt-3 text-[13px] leading-relaxed text-[#6C6961]">
                    {faq.answer}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </section>

      {/* ================= REAL BRIDE LIGHTBOX MODAL ================= */}
      {selectedBrideModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#181D18]/75 p-4 backdrop-blur-sm"
          onClick={() => setSelectedBrideModal(null)}
        >
          <div
            className="relative grid w-full max-w-3xl grid-cols-1 overflow-hidden rounded-3xl border border-[#E5E1D8] bg-[#FAF8F5] shadow-2xl md:grid-cols-12"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedBrideModal(null)}
              aria-label="Close bride preview"
              className="absolute right-4 top-4 z-10 inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-[#FAF8F5]/90 text-[#2A2927] hover:bg-[#EFECE6]"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="aspect-[4/4.3] md:col-span-7 md:aspect-auto">
              <img
                src={selectedBrideModal.image}
                alt={selectedBrideModal.name}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="flex flex-col justify-between p-7 md:col-span-5">
              <div>
                <span className="rounded-full bg-[#EFE0C6] px-3 py-1 text-[10px] font-semibold tracking-wider text-[#7A6444] uppercase">
                  {selectedBrideModal.category}
                </span>
                <h3 className="mt-4 font-serif text-3xl font-semibold text-[#2A2927]">
                  {selectedBrideModal.name}
                </h3>
                <p className="mt-2 text-xs font-medium text-[#4A5B4B]">
                  {selectedBrideModal.packageName}
                </p>
                <p className="mt-4 text-[13px] leading-relaxed text-[#6C6961]">
                  Crafted with organic botanical skin prep, featherlight HD
                  complexion finish, and fresh hand-selected floral accents.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  const pkg = selectedBrideModal.packageName;
                  setSelectedBrideModal(null);
                  handleSelectPackage(pkg);
                }}
                className="mt-7 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#4A5B4B] px-5 py-3 text-xs font-semibold text-[#FAF8F5] hover:bg-[#3B4A3C]"
              >
                <span>Request This Look</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
