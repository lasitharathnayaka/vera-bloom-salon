import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Award,
  Calendar,
  Sparkles,
  Star,
  X,
} from 'lucide-react';
import { fetchSpecialists } from '../../services/salonService';

import specialistElena from '../../assets/specialist-elena.jpg';
import specialistAmara from '../../assets/specialist-amara.jpg';
import specialistJulian from '../../assets/specialist-julian.jpg';
import founderVera from '../../assets/founder-vera.jpg';
import heroPortrait from '../../assets/hero-portrait.jpg';
import wallpaperSanctuary from '../../assets/wallpaper-sanctuary.jpg';
import wallpaperBotanicals from '../../assets/wallpaper-botanicals.jpg';
import wallpaperSpaSuite from '../../assets/wallpaper-spa-suite.jpg';
import wallpaperBridalAtelier from '../../assets/wallpaper-bridal-atelier.jpg';

const HERO_WALLPAPERS = [
  { src: wallpaperSanctuary, label: 'Sanctuary Floor' },
  { src: wallpaperBotanicals, label: 'Hair Couture' },
  { src: wallpaperSpaSuite, label: 'Scalp Spa Suite' },
  { src: wallpaperBridalAtelier, label: 'Bridal Atelier' },
];

const AVATAR_MAP = {
  elena: specialistElena,
  amara: specialistAmara,
  julian: specialistJulian,
  vera: founderVera,
};

const FILTER_CATEGORIES = [
  'All Specialists',
  'Hair & Color',
  'Holistic Skin',
  'Bridal Artistry',
  'Nail & Spa',
];

const DEFAULT_SPECIALISTS = [
  {
    id: 'elena',
    name: 'Elena Rostova',
    role: 'Senior Botanical Colorist',
    category: 'Hair & Color',
    rating: '4.98',
    reviews: 124,
    experience: '9 Years',
    available: true,
    avatar: specialistElena,
    bio: 'Renowned for ammonia-free dimensional balayage and mirror-shine camellia oil glossing tailored to sensitive scalps.',
    specialties: ['Botanical Balayage', 'Organic Glossing', 'Color Correction'],
    languages: 'English, Sinhala',
  },
  {
    id: 'amara',
    name: 'Amara Thorne',
    role: 'Holistic Skin & Bridal Expert',
    category: 'Holistic Skin',
    rating: '5.00',
    reviews: 98,
    experience: '8 Years',
    available: true,
    avatar: specialistAmara,
    bio: 'Specializes in cellular renewal botanical facials, sculptural lymphatic drainage, and luminous pre-bridal glass-skin prep.',
    specialties: ['Glass Skin Facials', 'Lymphatic Rituals', 'Bridal Skin Prep'],
    languages: 'English, Sinhala, Tamil',
  },
  {
    id: 'julian',
    name: 'Julian Vance',
    role: 'Master Stylist & Bridal Architect',
    category: 'Bridal Artistry',
    rating: '4.95',
    reviews: 210,
    experience: '11 Years',
    available: true,
    avatar: specialistJulian,
    bio: 'Editorial precision cutter and luxury bridal hair architect crafting effortless waves, structured updos, and couture blowouts.',
    specialties: ['Couture Cuts', 'Bridal Updos', 'Silk Blowouts'],
    languages: 'English',
  },
  {
    id: 'nethmi',
    name: 'Nethmi Perera',
    role: 'Senior Botanical Colorist',
    category: 'Hair & Color',
    rating: '4.96',
    reviews: 142,
    experience: '7 Years',
    available: true,
    avatar: heroPortrait,
    bio: 'Master of warm South Asian brunette toning, plant-based keratin infusions, and organic chamomile scalp restoration.',
    specialties: ['Plant Keratin', 'Root Glossing', 'Scalp Detox'],
    languages: 'English, Sinhala',
  },
  {
    id: 'clara',
    name: 'Clara Vance',
    role: 'Botanical Nail & Hand Spa Artist',
    category: 'Nail & Spa',
    rating: '4.88',
    reviews: 86,
    experience: '6 Years',
    available: false,
    avatar: founderVera,
    bio: 'Dedicated to non-toxic botanical gel artistry, warm organic shea hand wraps, and minimalist floral nail design.',
    specialties: ['Botanical Nail Art', 'Shea Hand Wraps', 'Clean Gel Care'],
    languages: 'English',
  },
];

export default function SpecialistsPage() {
  const [specialists, setSpecialists] = useState(DEFAULT_SPECIALISTS);
  const [activeCategory, setActiveCategory] = useState('All Specialists');
  const [selectedBio, setSelectedBio] = useState(null);
  const [wallpaperIdx, setWallpaperIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setWallpaperIdx((prev) => (prev + 1) % HERO_WALLPAPERS.length);
    }, 5500);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let active = true;
    fetchSpecialists().then(({ data }) => {
      if (!active || !Array.isArray(data) || data.length === 0) return;
      const merged = data.map((row) => {
        const fallback = DEFAULT_SPECIALISTS.find(
          (d) => d.name.toLowerCase() === row.name.toLowerCase()
        );
        return {
          id: row.id,
          name: row.name,
          role: row.role_title,
          category:
            fallback?.category ||
            (row.role_title.toLowerCase().includes('bridal')
              ? 'Bridal Artistry'
              : row.role_title.toLowerCase().includes('nail')
                ? 'Nail & Spa'
                : row.role_title.toLowerCase().includes('skin') ||
                    row.role_title.toLowerCase().includes('facial')
                  ? 'Holistic Skin'
                  : 'Hair & Color'),
          rating: Number(row.rating || 4.95).toFixed(2),
          reviews: row.review_count || fallback?.reviews || 95,
          experience: fallback?.experience || '7+ Years',
          available: row.is_active !== false,
          avatar: AVATAR_MAP[row.avatar_key] || fallback?.avatar || specialistElena,
          bio:
            fallback?.bio ||
            'Certified Vera & Bloom master specialist dedicated to organic botanical beauty rituals.',
          specialties: fallback?.specialties || [
            'Organic Rituals',
            'Bespoke Consultation',
          ],
          languages: fallback?.languages || 'English, Sinhala',
        };
      });
      setSpecialists(merged);
    });
    return () => {
      active = false;
    };
  }, []);

  const matchesCategory = (spec, category) => {
    if (category === 'All Specialists') return true;
    const text = `${spec.category} ${spec.role} ${(spec.specialties || []).join(' ')}`.toLowerCase();
    if (category === 'Hair & Color') {
      return (
        spec.category === 'Hair & Color' ||
        text.includes('color') ||
        text.includes('stylist') ||
        text.includes('hair')
      );
    }
    if (category === 'Holistic Skin') {
      return (
        spec.category === 'Holistic Skin' ||
        text.includes('skin') ||
        text.includes('facial')
      );
    }
    if (category === 'Bridal Artistry') {
      return (
        spec.category === 'Bridal Artistry' || text.includes('bridal')
      );
    }
    if (category === 'Nail & Spa') {
      return (
        spec.category === 'Nail & Spa' ||
        text.includes('nail') ||
        text.includes('spa')
      );
    }
    return spec.category === category;
  };

  const filteredSpecialists = useMemo(() => {
    return specialists.filter((s) => matchesCategory(s, activeCategory));
  }, [specialists, activeCategory]);

  return (
    <div className="bg-[#FAF8F5] pb-24">
      {/* ================= LIVE WALLPAPER EDITORIAL HERO ================= */}
      <section className="relative overflow-hidden bg-[#222B23] text-[#FAF8F5]">
        {HERO_WALLPAPERS.map((wp, idx) => (
          <img
            key={wp.label}
            src={wp.src}
            alt=""
            aria-hidden="true"
            className={`pointer-events-none absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
              idx === wallpaperIdx
                ? 'opacity-100 animate-[kenBurnsSlow_14s_ease-in-out_infinite_alternate]'
                : 'opacity-0'
            }`}
          />
        ))}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#171E18]/55 via-[#1E2720]/55 to-[#1E2720]/80" />

        <div className="relative z-10 mx-auto max-w-5xl px-6 py-16 text-center lg:px-10 lg:py-22">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#EFE0C6]/35 bg-[#1D251E]/50 px-4 py-1.5 text-[10px] font-semibold tracking-[0.24em] text-[#EFE0C6] uppercase backdrop-blur-md">
            <Sparkles className="h-3 w-3" />
            Master Artisans &bull; Sanctuary Collective
          </span>

          <h1 className="mt-5 font-serif text-4xl font-medium tracking-tight text-[#FAF8F5] drop-shadow-xs sm:text-5xl lg:text-[56px]">
            Meet Our{' '}
            <span className="italic text-[#EFE0C6]">Botanical Specialists</span>
          </h1>

          <p className="mx-auto mt-3.5 max-w-xl text-[14px] leading-relaxed text-[#E8EDE9]">
            Each Vera &amp; Bloom artist blends certified organic formulation
            mastery with unhurried, deeply personal luxury care.
          </p>

          {/* Subtle Live Wallpaper Indicator Pills */}
          <div className="mt-7 flex items-center justify-center gap-2">
            {HERO_WALLPAPERS.map((wp, idx) => (
              <button
                key={wp.label}
                type="button"
                aria-label={`Show ${wp.label} wallpaper`}
                onClick={() => setWallpaperIdx(idx)}
                className={`h-1.5 cursor-pointer rounded-full transition-all ${
                  idx === wallpaperIdx
                    ? 'w-8 bg-[#EFE0C6]'
                    : 'w-2.5 bg-white/40 hover:bg-white/70'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ================= STICKY FILTER PILLS ================= */}
      <div className="sticky top-[68px] z-30 border-b border-[#E6E2DA] bg-[#FAF8F5]/92 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-2 px-6 py-4 lg:px-10">
          {FILTER_CATEGORIES.map((cat) => {
            const count = specialists.filter((s) => matchesCategory(s, cat)).length;
            const active = activeCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`inline-flex cursor-pointer items-center gap-2 rounded-full px-4 py-2 text-[12px] font-medium transition-all ${
                  active
                    ? 'bg-[#4A5B4B] text-[#FAF8F5] shadow-xs'
                    : 'border border-[#E6E2DA] bg-[#F3F0EA] text-[#57544E] hover:bg-[#EAE6DE]'
                }`}
              >
                <span>{cat}</span>
                <span
                  className={`rounded-full px-1.5 py-0.5 text-[10px] ${
                    active
                      ? 'bg-white/20 text-[#FAF8F5]'
                      : 'bg-[#E5E1D8] text-[#6C6961]'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ================= FOUNDER EDITORIAL FEATURE (All view only) ================= */}
      {activeCategory === 'All Specialists' && (
        <section className="mx-auto max-w-7xl px-6 pt-12 lg:px-10">
        <div className="grid grid-cols-1 overflow-hidden rounded-[28px] border border-[#E6E2DA] bg-[#F3F0EA] shadow-sm lg:grid-cols-12">
          <div className="aspect-[4/3.5] overflow-hidden lg:col-span-5 lg:aspect-auto">
            <img
              src={founderVera}
              alt="Vera Sterling — Founder & Creative Director"
              className="h-full w-full object-cover"
            />
          </div>

          <div className="flex flex-col justify-center p-8 sm:p-12 lg:col-span-7">
            <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-[#EFE0C6] px-3.5 py-1 text-[10px] font-semibold tracking-[0.18em] text-[#7A6444] uppercase">
              <Award className="h-3 w-3" />
              Founder &amp; Creative Director
            </span>

            <h2 className="mt-4 font-serif text-3xl font-semibold text-[#2A2927] sm:text-4xl">
              Vera Sterling
            </h2>

            <p className="mt-4 font-serif text-xl italic leading-relaxed text-[#4A4741]">
              &ldquo;Every specialist in our sanctuary is chosen not only for
              technical artistry, but for the calm, restorative energy they
              bring to every chair.&rdquo;
            </p>

            <p className="mt-4 text-[13px] leading-relaxed text-[#6C6961]">
              With over 14 years leading organic hair &amp; botanical skin
              ateliers in London and Colombo, Vera personally trains every
              specialist in our ammonia-free glossing and holistic scalp
              protocols.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-4">
              <Link
                to="/booking"
                className="inline-flex items-center gap-2 rounded-xl bg-[#4A5B4B] px-6 py-3 text-xs font-semibold tracking-wide text-[#FAF8F5] transition-colors hover:bg-[#3B4A3C]"
              >
                <span>Reserve a Consultation</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <Link
                to="/services"
                className="rounded-xl border border-[#D8D3C8] bg-[#FAF8F5] px-5 py-3 text-xs font-semibold text-[#2A2927] transition-colors hover:bg-[#EAE6DE]"
              >
                Explore Signature Rituals
              </Link>
            </div>
          </div>
        </div>
        </section>
      )}

      {/* ================= SPECIALISTS GRID ================= */}
      <section className="mx-auto max-w-7xl px-6 pt-12 lg:px-10">
        <div className="mb-8 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p className="text-[10.5px] font-semibold tracking-[0.22em] text-[#6B786A] uppercase">
              Our Artists
            </p>
            <h2 className="mt-1 font-serif text-3xl font-semibold text-[#2A2927]">
              Sanctuary Specialists
            </h2>
          </div>
          <p className="text-xs text-[#7A766E]">
            Showing {filteredSpecialists.length} certified specialists
          </p>
        </div>

        <div className="grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3">
          {filteredSpecialists.map((spec) => (
            <article
              key={spec.id}
              className="group flex flex-col justify-between overflow-hidden rounded-[24px] border border-[#E6E2DA] bg-[#FAF8F5] shadow-xs transition-all duration-500 hover:-translate-y-1 hover:shadow-xl"
            >
              <div>
                {/* Portrait */}
                <div className="relative aspect-[4/3.8] w-full overflow-hidden bg-[#EAE6DE]">
                  <img
                    src={spec.avatar}
                    alt={spec.name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#181D18]/65 via-transparent to-transparent" />

                  {/* Availability Pill */}
                  <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-[#1B221B]/75 px-3 py-1 text-[10px] font-semibold text-[#FAF8F5] backdrop-blur-xs">
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        spec.available ? 'bg-[#9EE3A6]' : 'bg-[#D4C7B0]'
                      }`}
                    />
                    {spec.available ? 'Available Today' : 'By Appointment'}
                  </span>

                  {/* Rating Pill */}
                  <span className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-[#FAF8F5]/92 px-3 py-1 text-[11px] font-semibold text-[#2A2927] backdrop-blur-xs">
                    <Star className="h-3 w-3 fill-[#C89F52] text-[#C89F52]" />
                    <span>{spec.rating}</span>
                  </span>

                  {/* Name Overlay */}
                  <div className="absolute inset-x-0 bottom-0 p-5 text-[#FAF8F5]">
                    <p className="text-[10px] font-semibold tracking-[0.18em] text-[#EFE0C6] uppercase">
                      {spec.category}
                    </p>
                    <h3 className="mt-0.5 font-serif text-2xl font-semibold">
                      {spec.name}
                    </h3>
                    <p className="text-xs text-[#E6E2DA]">{spec.role}</p>
                  </div>
                </div>

                {/* Details */}
                <div className="p-6">
                  <p className="text-[12.5px] leading-relaxed text-[#6C6961]">
                    {spec.bio}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {spec.specialties.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-[#F3F0EA] px-2.5 py-1 text-[10.5px] font-medium text-[#4A5B4B]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="flex items-center justify-between gap-3 border-t border-[#ECE8E0] px-6 py-4">
                <button
                  type="button"
                  onClick={() => setSelectedBio(spec)}
                  className="cursor-pointer text-[12px] font-medium text-[#6C6961] transition-colors hover:text-[#2A2927]"
                >
                  View Profile ({spec.reviews} reviews)
                </button>

                <Link
                  to="/booking"
                  className="inline-flex items-center gap-1.5 rounded-full bg-[#4A5B4B] px-4 py-2 text-[11.5px] font-semibold text-[#FAF8F5] transition-colors hover:bg-[#3B4A3C]"
                >
                  <span>Book</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ================= BOTTOM DARK-SAGE CTA ================= */}
      <section className="mx-auto max-w-7xl px-6 pt-20 lg:px-10">
        <div className="flex flex-col items-center justify-between gap-6 rounded-[28px] bg-[#253026] p-8 text-center text-[#FAF8F5] shadow-xl sm:p-12 md:flex-row md:text-left">
          <div>
            <p className="text-[10px] font-semibold tracking-[0.24em] text-[#EFE0C6] uppercase">
              Personalized Matching
            </p>
            <h2 className="mt-2 font-serif text-3xl font-semibold sm:text-4xl">
              Not Sure Which Specialist Fits Your Ritual?
            </h2>
            <p className="mt-2 max-w-xl text-[13.5px] text-[#C9D2CA]">
              Select &ldquo;Any Available&rdquo; during booking and we will
              match you with the highest-rated specialist for your chosen
              treatment.
            </p>
          </div>

          <Link
            to="/booking"
            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-[#EFE0C6] px-7 py-3.5 text-xs font-semibold tracking-wide text-[#222B23] transition-colors hover:bg-[#FAF8F5]"
          >
            <Calendar className="h-4 w-4" />
            <span>Book an Appointment</span>
          </Link>
        </div>
      </section>

      {/* ================= SPECIALIST BIO MODAL ================= */}
      {selectedBio && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#181D18]/75 p-4 backdrop-blur-sm"
          onClick={() => setSelectedBio(null)}
        >
          <div
            className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-[#E5E1D8] bg-[#FAF8F5] p-7 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedBio(null)}
              aria-label="Close specialist bio"
              className="absolute right-4 top-4 inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-[#F3F0EA] text-[#2A2927] hover:bg-[#E5E1D8]"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-4">
              <img
                src={selectedBio.avatar}
                alt={selectedBio.name}
                className="h-16 w-16 rounded-2xl border border-[#E5E1D8] object-cover"
              />
              <div>
                <h3 className="font-serif text-2xl font-semibold text-[#2A2927]">
                  {selectedBio.name}
                </h3>
                <p className="text-xs text-[#6C6961]">{selectedBio.role}</p>
                <p className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-[#7A6444]">
                  <Star className="h-3.5 w-3.5 fill-[#C89F52] text-[#C89F52]" />
                  {selectedBio.rating} ({selectedBio.reviews} reviews) &bull;{' '}
                  {selectedBio.experience}
                </p>
              </div>
            </div>

            <p className="mt-5 text-[13px] leading-relaxed text-[#57544E]">
              {selectedBio.bio}
            </p>

            <div className="mt-5 rounded-xl bg-[#F3F0EA] p-4 text-xs text-[#57544E]">
              <p>
                <strong className="text-[#2A2927]">Languages:</strong>{' '}
                {selectedBio.languages}
              </p>
              <p className="mt-1.5">
                <strong className="text-[#2A2927]">Specialties:</strong>{' '}
                {selectedBio.specialties.join(' • ')}
              </p>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setSelectedBio(null)}
                className="cursor-pointer rounded-xl border border-[#DCD7CC] px-5 py-2.5 text-xs font-semibold text-[#57544E] hover:bg-[#F3F0EA]"
              >
                Close
              </button>
              <Link
                to="/booking"
                className="inline-flex items-center gap-2 rounded-xl bg-[#4A5B4B] px-6 py-2.5 text-xs font-semibold text-[#FAF8F5] hover:bg-[#3B4A3C]"
              >
                <span>Book with {selectedBio.name.split(' ')[0]}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
