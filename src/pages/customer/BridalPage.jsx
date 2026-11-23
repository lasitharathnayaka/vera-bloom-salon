import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  CheckCircle2,
  Crown,
  Flower2,
  Heart,
  Sparkles,
} from 'lucide-react';

import bridalHero from '../../assets/bridal-hero.jpg';
import bridalKandyan from '../../assets/bridal-kandyan.jpg';
import bridalModern from '../../assets/ritual-bridal.jpg';
import bridalPrep from '../../assets/bridal-prep.jpg';
import { submitBridalInquiry } from '../../services/salonService';

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
];

export default function BridalPage() {
  const [formState, setFormState] = useState({
    fullName: '',
    email: '',
    eventDate: '',
    venue: '',
    guestCount: 'Just the Bride',
    notes: '',
  });
  const [submitted, setSubmitted] = useState(false);

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
      {/* ================= HERO BANNER ================= */}
      <section className="relative overflow-hidden border-b border-[#E6E2DA]">
        <div className="relative min-h-[480px] w-full lg:min-h-[540px]">
          <img
            src={bridalHero}
            alt="Vera & Bloom luminous botanical bride in sunlit floral garden"
            className="absolute inset-0 h-full w-full object-cover object-top"
          />
          {/* Soft ivory readability veil */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#FAF8F5]/35 via-[#FAF8F5]/45 to-[#FAF8F5]/95" />

          {/* Centered Hero Content */}
          <div className="relative z-10 mx-auto flex min-h-[480px] max-w-4xl flex-col items-center justify-center px-6 pb-20 pt-16 text-center lg:min-h-[540px]">
            <p className="text-[10px] font-semibold tracking-[0.28em] text-[#4F4D47] uppercase">
              Bespoke Bridal Sanctuary
            </p>
            <h1 className="mt-4 font-serif text-4xl font-semibold leading-[1.15] text-[#2A2927] sm:text-5xl">
              Timeless Elegance for Your Most Cherished Moments
            </h1>
            <p className="mt-4 max-w-xl text-[13.5px] leading-relaxed text-[#4F4D47]">
              Elevate your wedding morning with serene, organic botanical
              artistry tailored to celebrate your luminous natural radiance on
              your wedding day.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
              <a
                href="#bridal-packages"
                className="rounded-lg bg-[#4A5B4B] px-6 py-3 text-[12.5px] font-medium tracking-wide text-[#FAF8F5] shadow-xs transition-colors hover:bg-[#3B4A3C]"
              >
                Explore Packages
              </a>
              <a
                href="#bridal-quote"
                className="rounded-lg border border-[#D8D3C8] bg-[#FAF8F5]/90 px-6 py-3 text-[12.5px] font-medium tracking-wide text-[#2A2927] backdrop-blur-xs transition-colors hover:bg-[#FAF8F5]"
              >
                Book Bridal Consultation
              </a>
            </div>
          </div>

          {/* Bottom-Left Floating Suite Badge */}
          <div className="absolute bottom-5 left-6 z-10 hidden items-center gap-3 rounded-xl border border-[#E6E2DA] bg-[#FAF8F5]/95 px-4 py-3 shadow-sm backdrop-blur-xs sm:flex lg:left-10">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#EFECE6] text-[#4A5B4B]">
              <Sparkles className="h-4 w-4" strokeWidth={1.7} />
            </span>
            <div>
              <p className="text-[11.5px] font-semibold text-[#2A2927]">
                Private Bridal Suite
              </p>
              <p className="text-[10px] text-[#7A766E]">
                On-site hotel &amp; venue artistry available
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= EDITORIAL QUOTE STRIP ================= */}
      <section className="mx-auto max-w-3xl px-6 py-16 text-center lg:py-20">
        <Flower2
          className="mx-auto h-5 w-5 text-[#6B786A]"
          strokeWidth={1.5}
        />
        <blockquote className="mt-5 font-serif text-xl font-medium italic leading-relaxed text-[#2A2927] sm:text-[24px]">
          &ldquo;We believe bridal beauty should never feel like a
          transformation into someone else, but rather the most radiant,
          effortless expression of who you truly are.&rdquo;
        </blockquote>
        <p className="mt-4 text-[10px] font-semibold tracking-[0.24em] text-[#8A867E] uppercase">
          &mdash; Vera &amp; Bloom Bridal Collective
        </p>
      </section>

      {/* ================= BRIDAL SANCTUARY PACKAGES ================= */}
      <section
        id="bridal-packages"
        className="mx-auto max-w-7xl px-6 pb-24 pt-4 lg:px-10"
      >
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-[10px] font-semibold tracking-[0.24em] text-[#6B786A] uppercase">
            Curated Collections
          </p>
          <h2 className="mt-2.5 font-serif text-3xl font-semibold text-[#2A2927] sm:text-4xl">
            Bridal Sanctuary Packages
          </h2>
          <p className="mt-3 text-[13.5px] text-[#6C6961]">
            Designed for serene, unhurried artistry from pre-wedding
            celebrations to reception.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 items-stretch gap-7 lg:grid-cols-3">
          {BRIDAL_PACKAGES.map((pkg) => {
            const Icon = pkg.icon;
            return (
              <article
                key={pkg.id}
                className={`relative flex flex-col justify-between rounded-2xl p-7 transition-all ${
                  pkg.featured
                    ? 'border-[1.5px] border-[#8FA08F] bg-[#F2EFE9] shadow-md lg:-my-3 lg:py-10'
                    : 'border border-[#E6E2DA] bg-[#F7F5F0]'
                }`}
              >
                {pkg.badge && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-[#4A5B4B] px-4 py-1 text-[9.5px] font-semibold tracking-[0.18em] text-[#FAF8F5] uppercase shadow-xs">
                    {pkg.badge}
                  </span>
                )}

                <div>
                  {/* Tier + Icon */}
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-semibold tracking-[0.2em] text-[#8A867E] uppercase">
                      {pkg.tier}
                    </span>
                    <Icon
                      className="h-4 w-4 text-[#6B786A]"
                      strokeWidth={1.6}
                    />
                  </div>

                  {/* Name & Description */}
                  <h3 className="mt-2 font-serif text-[23px] font-semibold text-[#2A2927]">
                    {pkg.name}
                  </h3>
                  <p className="mt-2 text-[12.5px] leading-relaxed text-[#6C6961]">
                    {pkg.description}
                  </p>

                  {/* Price */}
                  <div className="mt-6 border-b border-[#E5E1D8] pb-5">
                    <p className="font-serif text-[26px] font-semibold text-[#2A2927]">
                      {pkg.price}
                    </p>
                    <p className="mt-0.5 text-[11px] text-[#8A867E]">
                      {pkg.priceNote}
                    </p>
                  </div>

                  {/* Features */}
                  <ul className="mt-6 space-y-3">
                    {pkg.features.map((feat) => (
                      <li
                        key={feat}
                        className="flex items-start gap-2.5 text-[12.5px] leading-snug text-[#4A4741]"
                      >
                        <Heart
                          className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#6B786A]"
                          strokeWidth={1.8}
                        />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA */}
                <button
                  type="button"
                  onClick={() => handleSelectPackage(pkg.name)}
                  className={`mt-8 w-full cursor-pointer rounded-lg py-3 text-[12.5px] font-medium tracking-wide transition-colors ${
                    pkg.featured
                      ? 'bg-[#4A5B4B] text-[#FAF8F5] shadow-xs hover:bg-[#3B4A3C]'
                      : 'border border-[#D8D3C8] bg-[#FAF8F5] text-[#2A2927] hover:bg-[#ECE8E0]'
                  }`}
                >
                  Select Package
                </button>
              </article>
            );
          })}
        </div>
      </section>

      {/* ================= BRIDAL ARCHIVES: REAL VERA BRIDES ================= */}
      <section className="border-y border-[#ECE8E0] bg-[#F3F0EA] py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-[10px] font-semibold tracking-[0.22em] text-[#6B786A] uppercase">
                Bridal Archives
              </p>
              <h2 className="mt-1.5 font-serif text-3xl font-semibold text-[#2A2927]">
                Real Vera Brides
              </h2>
            </div>

            <Link
              to="/lookbook"
              className="inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-[0.16em] text-[#4A5B4B] uppercase transition-colors hover:text-[#2A2927]"
            >
              <span>View Full Lookbook</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
            {REAL_BRIDES.map((bride) => (
              <article
                key={bride.id}
                className="group relative aspect-[4/3.6] overflow-hidden rounded-2xl bg-[#E6E2DA] shadow-xs"
              >
                <img
                  src={bride.image}
                  alt={`${bride.name} — ${bride.packageName}`}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1F1E1C]/80 via-[#1F1E1C]/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 text-[#FAF8F5]">
                  <p className="text-[9.5px] font-semibold tracking-[0.2em] text-[#E6DFD1] uppercase">
                    {bride.category}
                  </p>
                  <h3 className="mt-1 font-serif text-xl font-semibold">
                    {bride.name}
                  </h3>
                  <p className="mt-0.5 text-[11.5px] text-[#E6E2DA]">
                    {bride.packageName}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CUSTOM BRIDAL QUOTE FORM ================= */}
      <section id="bridal-quote" className="mx-auto max-w-4xl px-6 py-20 lg:py-24">
        <div className="rounded-3xl border border-[#E5E1D8] bg-gradient-to-b from-[#F2EFE9] to-[#EDEAE3] p-8 shadow-xs sm:p-12">
          <div className="mx-auto max-w-xl text-center">
            <p className="text-[10px] font-semibold tracking-[0.24em] text-[#6B786A] uppercase">
              Begin Your Journey
            </p>
            <h2 className="mt-2 font-serif text-3xl font-semibold text-[#2A2927]">
              Request a Custom Bridal Quote
            </h2>
            <p className="mt-2.5 text-[13px] leading-relaxed text-[#6C6961]">
              Share your event details and our Bridal Concierge will craft a
              bespoke itinerary within 24 hours.
            </p>
          </div>

          {submitted ? (
            <div className="mt-10 rounded-2xl border border-[#DCE3DC] bg-[#FAF8F5] p-8 text-center">
              <CheckCircle2 className="mx-auto h-10 w-10 text-[#4A5B4B]" />
              <h3 className="mt-3 font-serif text-2xl font-semibold text-[#2A2927]">
                Thank You, {formState.fullName || 'Lovely Bride'}
              </h3>
              <p className="mx-auto mt-2 max-w-md text-[13px] text-[#6C6961]">
                Your bridal inquiry has been received. Our Bridal Concierge will
                reach out within 24 hours with your personalized quote.
              </p>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="mt-6 cursor-pointer rounded-lg border border-[#D8D3C8] px-5 py-2.5 text-xs font-medium text-[#2A2927] transition-colors hover:bg-[#EFECE6]"
              >
                Send Another Inquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-9 space-y-5">
              {/* Row 1 */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-[11.5px] font-medium text-[#4A4741]">
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
                    className="mt-1.5 w-full rounded-lg border border-[#E2DDD4] bg-[#FAF8F5] px-3.5 py-2.5 text-[13px] text-[#2A2927] placeholder:text-[#A8A49B] focus:border-[#4A5B4B] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11.5px] font-medium text-[#4A4741]">
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
                    className="mt-1.5 w-full rounded-lg border border-[#E2DDD4] bg-[#FAF8F5] px-3.5 py-2.5 text-[13px] text-[#2A2927] placeholder:text-[#A8A49B] focus:border-[#4A5B4B] focus:outline-none"
                  />
                </div>
              </div>

              {/* Row 2 */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label className="block text-[11.5px] font-medium text-[#4A4741]">
                    Event Date
                  </label>
                  <input
                    type="date"
                    required
                    value={formState.eventDate}
                    onChange={(e) =>
                      setFormState({ ...formState, eventDate: e.target.value })
                    }
                    className="mt-1.5 w-full rounded-lg border border-[#E2DDD4] bg-[#FAF8F5] px-3.5 py-2.5 text-[13px] text-[#2A2927] focus:border-[#4A5B4B] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11.5px] font-medium text-[#4A4741]">
                    Venue Location / City
                  </label>
                  <input
                    type="text"
                    required
                    value={formState.venue}
                    onChange={(e) =>
                      setFormState({ ...formState, venue: e.target.value })
                    }
                    placeholder="e.g. Shangri-La Colombo"
                    className="mt-1.5 w-full rounded-lg border border-[#E2DDD4] bg-[#FAF8F5] px-3.5 py-2.5 text-[13px] text-[#2A2927] placeholder:text-[#A8A49B] focus:border-[#4A5B4B] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11.5px] font-medium text-[#4A4741]">
                    Bridal Party Guest Count
                  </label>
                  <select
                    value={formState.guestCount}
                    onChange={(e) =>
                      setFormState({ ...formState, guestCount: e.target.value })
                    }
                    className="mt-1.5 w-full rounded-lg border border-[#E2DDD4] bg-[#FAF8F5] px-3.5 py-2.5 text-[13px] text-[#2A2927] focus:border-[#4A5B4B] focus:outline-none"
                  >
                    <option value="Just the Bride">Just the Bride</option>
                    <option value="Bride + 1–2 Guests">
                      Bride + 1&ndash;2 Guests
                    </option>
                    <option value="Bride + 3–5 Guests">
                      Bride + 3&ndash;5 Guests
                    </option>
                    <option value="Bride + 6+ Guests">Bride + 6+ Guests</option>
                  </select>
                </div>
              </div>

              {/* Row 3 */}
              <div>
                <label className="block text-[11.5px] font-medium text-[#4A4741]">
                  Preferred Package or Style Notes
                </label>
                <textarea
                  rows={4}
                  value={formState.notes}
                  onChange={(e) =>
                    setFormState({ ...formState, notes: e.target.value })
                  }
                  placeholder="Tell us about your aesthetic, saree/gown, floral preferences, or any special timeline needs..."
                  className="mt-1.5 w-full rounded-lg border border-[#E2DDD4] bg-[#FAF8F5] px-3.5 py-2.5 text-[13px] text-[#2A2927] placeholder:text-[#A8A49B] focus:border-[#4A5B4B] focus:outline-none"
                />
              </div>

              {/* Submit */}
              <div className="pt-2 text-center">
                <button
                  type="submit"
                  className="cursor-pointer rounded-lg bg-[#4A5B4B] px-9 py-3.5 text-[12.5px] font-medium tracking-wide text-[#FAF8F5] shadow-xs transition-colors hover:bg-[#3B4A3C]"
                >
                  Submit Inquiry Request
                </button>
              </div>
            </form>
          )}
        </div>
      </section>

      {/* ================= FREQUENTLY ASKED QUESTIONS ================= */}
      <section className="mx-auto max-w-3xl px-6 pb-24">
        <div className="text-center">
          <p className="text-[10px] font-semibold tracking-[0.24em] text-[#6B786A] uppercase">
            Bridal Guidance
          </p>
          <h2 className="mt-2 font-serif text-3xl font-semibold text-[#2A2927]">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="mt-10 space-y-4">
          {BRIDAL_FAQS.map((faq) => (
            <article
              key={faq.question}
              className="rounded-xl border border-[#ECE8E0] bg-[#F6F4EF] px-6 py-5"
            >
              <h3 className="font-serif text-[17px] font-semibold text-[#2A2927]">
                {faq.question}
              </h3>
              <p className="mt-2 text-[12.5px] leading-relaxed text-[#6C6961]">
                {faq.answer}
              </p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
