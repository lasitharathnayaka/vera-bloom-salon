import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Award,
  Car,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  Copy,
  ExternalLink,
  Leaf,
  MapPin,
  Navigation,
  Pause,
  Phone,
  Play,
  ShieldCheck,
  Sparkles,
  Star,
} from 'lucide-react';

import heroPortrait from '../../assets/hero-portrait.jpg';
import ritualHair from '../../assets/ritual-hair.jpg';
import ritualSkin from '../../assets/ritual-skin.jpg';
import ritualBridal from '../../assets/ritual-bridal.jpg';
import founderVera from '../../assets/founder-vera.jpg';
import wallpaperSanctuary from '../../assets/wallpaper-sanctuary.jpg';
import wallpaperBotanicals from '../../assets/wallpaper-botanicals.jpg';
import wallpaperSpaSuite from '../../assets/wallpaper-spa-suite.jpg';
import wallpaperBridalAtelier from '../../assets/wallpaper-bridal-atelier.jpg';

const HERO_WALLPAPERS = [
  {
    id: 'wp-1',
    index: '01',
    label: 'Designer Styling Floor',
    tagline: 'Illuminated brass mirrors & bespoke hair stations',
    image: wallpaperSanctuary,
    position: 'object-center',
  },
  {
    id: 'wp-2',
    index: '02',
    label: 'Master Hair Couture',
    tagline: 'Silky botanical blowouts & luminous dimensional color',
    image: wallpaperBotanicals,
    position: 'object-center',
  },
  {
    id: 'wp-3',
    index: '03',
    label: 'Scalp-Spa Wash Lounge',
    tagline: 'Reclining botanical hair wash & aromatherapy ritual',
    image: wallpaperSpaSuite,
    position: 'object-center',
  },
  {
    id: 'wp-4',
    index: '04',
    label: 'Bridal Vanity Suite',
    tagline: 'Luminous wedding hair & makeup artistry',
    image: wallpaperBridalAtelier,
    position: 'object-center',
  },
];

const SIGNATURE_RITUALS = [
  {
    id: 'organic-hair-couture',
    number: '01',
    title: 'Organic Hair Couture',
    priceTag: 'From LKR 4,800',
    duration: '60 – 150 mins',
    description:
      'Tailored cuts, ammonia-free botanical glossing, and deep restorative plant-based infusions for luminous, healthy locks.',
    image: ritualHair,
    alt: 'Stylist tending to glossy wavy hair in an organic sunlit salon',
  },
  {
    id: 'botanical-skin-therapy',
    number: '02',
    title: 'Botanical Skin Therapy',
    priceTag: 'From LKR 7,200',
    duration: '60 – 75 mins',
    description:
      "Customized facials, bespoke lymphatic drainage, and potent clean organic extracts designed to restore skin's natural radiance.",
    image: ritualSkin,
    alt: 'Relaxing botanical spa facial therapy session',
  },
  {
    id: 'bridal-artistry',
    number: '03',
    title: 'Bridal Artistry',
    priceTag: 'From LKR 35,000',
    duration: 'Private Suite',
    description:
      'Exquisite hair design and luminous makeup artistry for your most cherished moments, complete with private trial sessions.',
    image: ritualBridal,
    alt: 'Radiant bride with natural luminous makeup and romantic floral bouquet',
  },
];

const SANCTUARY_PILLARS = [
  {
    icon: Leaf,
    value: '100%',
    label: 'Organic Formulations',
    detail: 'Ammonia-free, cold-pressed botanicals',
  },
  {
    icon: Star,
    value: '4.98★',
    label: 'Guest Satisfaction',
    detail: 'Across 500+ verified sanctuary visits',
  },
  {
    icon: Award,
    value: '12+',
    label: 'Master Specialists',
    detail: 'Colorists, facialists & bridal artists',
  },
  {
    icon: ShieldCheck,
    value: 'Private',
    label: 'Unhurried Suites',
    detail: 'Calm sensory rooms for total serenity',
  },
];

const TESTIMONIALS = [
  {
    id: 'elena',
    quote:
      '"An absolute haven of peace. The organic hair glossing left my hair silkier than I ever thought possible, and the atmosphere completely melts away the city stress."',
    name: 'Elena Rostova',
    role: 'Regular Guest since 2021',
    ritual: 'Organic Hair Glossing',
    avatar: heroPortrait,
  },
  {
    id: 'claire',
    quote:
      '"Vera & Bloom handled my bridal party\'s hair and makeup. The trial was so thorough, and on the wedding day they brought such a calm, peaceful energy."',
    name: 'Claire Montgomery',
    role: 'Bridal Client',
    ritual: 'Classic Wedding Day',
    avatar: ritualBridal,
  },
  {
    id: 'sophia',
    quote:
      '"The botanical skin therapy facial is transformative. My skin has never looked so luminous and healthy. The attention to detail is unmatched anywhere in the city."',
    name: 'Sophia Chen',
    role: 'Skin Therapy Member',
    ritual: 'Cell-Renewal Facial',
    avatar: founderVera,
  },
];

export default function HomePage() {
  const [selectedRitual, setSelectedRitual] = useState('');
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [mapStyle, setMapStyle] = useState('botanical'); // 'botanical' | 'satellite'
  const [copiedAddr, setCopiedAddr] = useState(false);
  const navigate = useNavigate();

  const handleCopyAddress = () => {
    navigator.clipboard?.writeText(
      'No. 42, Horton Place, Cinnamon Gardens, Colombo 07, Sri Lanka'
    );
    setCopiedAddr(true);
    setTimeout(() => setCopiedAddr(false), 2200);
  };

  // Live changing full-page wallpaper rotation every 5.5s
  useEffect(() => {
    if (!isPlaying) return undefined;
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % HERO_WALLPAPERS.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [isPlaying]);

  const currentWallpaper = HERO_WALLPAPERS[activeSlide];

  const handlePrevSlide = () => {
    setActiveSlide(
      (prev) => (prev - 1 + HERO_WALLPAPERS.length) % HERO_WALLPAPERS.length
    );
  };

  const handleNextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % HERO_WALLPAPERS.length);
  };

  const handleExploreRitual = () => {
    if (selectedRitual) {
      navigate(`/services?ritual=${selectedRitual}`);
    } else {
      navigate('/services');
    }
  };

  return (
    <div className="relative min-h-screen">
      {/* ================= FULL-PAGE FIXED LIVE WALLPAPER BACKGROUND ================= */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#1B221B]"
      >
        {HERO_WALLPAPERS.map((wp, idx) => {
          const isActive = idx === activeSlide;
          return (
            <div
              key={wp.id}
              className={`absolute inset-0 transition-opacity duration-[1400ms] ease-in-out ${
                isActive ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img
                key={isActive ? `${wp.id}-active-${activeSlide}` : wp.id}
                src={wp.image}
                alt=""
                className={`h-full w-full object-cover ${wp.position} ${
                  isActive && isPlaying ? 'animate-ken-burns' : 'scale-105'
                }`}
              />
            </div>
          );
        })}

        {/* Atmospheric Botanical Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#161C16]/80 via-[#161C16]/52 to-[#161C16]/30" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#161C16]/40 via-transparent to-[#161C16]/65" />
      </div>

      {/* ================= FOREGROUND CONTENT OVER LIVE WALLPAPER ================= */}
      <div className="relative z-10">
        {/* -------- HERO SECTION -------- */}
        <section className="mx-auto flex min-h-[86vh] max-w-7xl flex-col justify-between px-6 pb-12 pt-16 lg:px-10 lg:pb-14 lg:pt-24">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
            {/* Left Copy & Glassmorphic Quick Selector */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#EFE0C6]/35 bg-[#EFE0C6]/20 px-4 py-1.5 text-[10px] font-semibold tracking-[0.22em] text-[#F5E6CB] uppercase backdrop-blur-md">
                <Sparkles className="h-3 w-3" strokeWidth={2} />
                <span>Organic Luxury Sanctuary</span>
              </div>

              <h1 className="mt-7 font-serif text-5xl font-medium leading-[1.06] tracking-tight text-[#FAF8F5] sm:text-6xl lg:text-[68px]">
                Botanic Beauty,
                <br />
                <span className="italic text-[#EFE0C6]">Tailored to You.</span>
              </h1>

              <p className="mt-6 max-w-xl text-[14.5px] leading-[1.8] text-[#E6E2DA]">
                Immerse yourself in bespoke hair couture and restorative skin
                therapies designed around your natural essence. Experience
                unhurried luxury where holistic wellness meets high-fashion
                artistry.
              </p>

              {/* Primary & Secondary CTAs */}
              <div className="mt-9 flex flex-wrap items-center gap-4">
                <Link
                  to="/booking"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#FAF8F5] px-7 py-3.5 text-[13px] font-semibold tracking-wide text-[#242B24] shadow-lg transition-all hover:-translate-y-0.5 hover:bg-[#EFE0C6]"
                >
                  <span>Book Your Visit</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/lookbook"
                  className="rounded-xl border border-[#FAF8F5]/35 bg-[#FAF8F5]/10 px-7 py-3.5 text-[13px] font-medium tracking-wide text-[#FAF8F5] backdrop-blur-md transition-all hover:bg-[#FAF8F5]/20"
                >
                  View Lookbook
                </Link>
              </div>

              {/* Glassmorphic Quick Ritual Bar */}
              <div className="mt-10 flex max-w-xl items-center gap-2 rounded-2xl border border-white/25 bg-[#FAF8F5]/92 p-2 pl-4 shadow-2xl backdrop-blur-md">
                <Sparkles
                  className="h-4 w-4 shrink-0 text-[#4A5B4B]"
                  strokeWidth={1.8}
                />
                <div className="relative flex-1">
                  <select
                    aria-label="Select a Signature Ritual"
                    value={selectedRitual}
                    onChange={(e) => setSelectedRitual(e.target.value)}
                    className="w-full cursor-pointer appearance-none bg-transparent py-2.5 pr-8 text-[13px] font-medium text-[#2A2927] focus:outline-none"
                  >
                    <option value="">Select a Signature Ritual...</option>
                    {SIGNATURE_RITUALS.map((ritual) => (
                      <option key={ritual.id} value={ritual.id}>
                        {ritual.title}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6C6961]" />
                </div>
                <button
                  type="button"
                  onClick={handleExploreRitual}
                  className="shrink-0 cursor-pointer rounded-xl bg-[#4A5B4B] px-6 py-2.5 text-[12px] font-semibold tracking-wide text-[#FAF8F5] transition-colors hover:bg-[#3B4A3C]"
                >
                  Explore
                </button>
              </div>
            </div>

            {/* Right Floating Glass Editorial Card */}
            <div className="hidden lg:col-span-5 lg:flex lg:flex-col lg:items-end lg:gap-5">
              <div className="w-full max-w-[330px] rounded-3xl border border-white/20 bg-[#1B221B]/55 p-6 text-[#FAF8F5] shadow-2xl backdrop-blur-md">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#4A5B4B]/80 px-3 py-1 text-[10px] font-semibold tracking-[0.14em] text-[#E5ECE6] uppercase">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#9EE3A6]" />
                    Open Today &middot; 9AM &ndash; 8PM
                  </span>
                  <span className="text-xs font-semibold text-[#EFE0C6]">
                    ★ 4.98
                  </span>
                </div>

                <p className="mt-5 font-serif text-[22px] italic leading-snug text-[#FAF8F5]">
                  &ldquo;The ultimate sanctuary for hair and skin.&rdquo;
                </p>
                <p className="mt-2.5 text-[10px] font-semibold tracking-[0.2em] text-[#D7D2C8] uppercase">
                  Vogue Wellness Edition
                </p>

                <div className="mt-6 flex items-center justify-between border-t border-white/15 pt-4 text-xs">
                  <div>
                    <p className="text-[10px] tracking-[0.16em] text-[#C8C3B9] uppercase">
                      Live Wallpaper
                    </p>
                    <p className="mt-0.5 font-serif text-[16px] font-medium text-[#EFE0C6]">
                      {currentWallpaper.label}
                    </p>
                  </div>
                  <span className="font-serif text-xl text-white/60">
                    {currentWallpaper.index}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Live Wallpaper Controls Strip */}
          <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-white/15 pt-6">
            <div className="flex max-w-md flex-1 items-center gap-3">
              {HERO_WALLPAPERS.map((wp, idx) => {
                const isActive = idx === activeSlide;
                return (
                  <button
                    key={wp.id}
                    type="button"
                    onClick={() => setActiveSlide(idx)}
                    aria-label={`Switch wallpaper to ${wp.label}`}
                    className="group flex-1 cursor-pointer py-2 text-left"
                  >
                    <div className="h-[2.5px] w-full overflow-hidden rounded-full bg-white/25">
                      {isActive && (
                        <div
                          key={`prog-${activeSlide}-${isPlaying}`}
                          className={`h-full w-full bg-[#EFE0C6] ${
                            isPlaying ? 'animate-slide-progress' : ''
                          }`}
                        />
                      )}
                    </div>
                    <p
                      className={`mt-2 hidden text-[10px] tracking-[0.14em] uppercase transition-colors sm:block ${
                        isActive
                          ? 'font-semibold text-[#FAF8F5]'
                          : 'text-white/50 group-hover:text-white/80'
                      }`}
                    >
                      {wp.index} &middot; {wp.label.split(' ')[0]}
                    </p>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsPlaying((p) => !p)}
                aria-label={
                  isPlaying ? 'Pause live wallpaper' : 'Play live wallpaper'
                }
                className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-white/25 bg-white/10 text-[#FAF8F5] backdrop-blur-md transition-colors hover:bg-white/20"
              >
                {isPlaying ? (
                  <Pause className="h-3.5 w-3.5" />
                ) : (
                  <Play className="h-3.5 w-3.5" />
                )}
              </button>
              <button
                type="button"
                onClick={handlePrevSlide}
                aria-label="Previous wallpaper"
                className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-white/25 bg-white/10 text-[#FAF8F5] backdrop-blur-md transition-colors hover:bg-white/20"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={handleNextSlide}
                aria-label="Next wallpaper"
                className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-white/25 bg-white/10 text-[#FAF8F5] backdrop-blur-md transition-colors hover:bg-white/20"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </section>

        {/* -------- FROSTED GLASS LUXURY PILLARS STRIP -------- */}
        <section className="border-y border-white/25 bg-[#FAF8F5]/82 backdrop-blur-xl">
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-6 py-10 lg:grid-cols-4 lg:px-10">
            {SANCTUARY_PILLARS.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="flex items-start gap-3.5">
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#4A5B4B]/12 text-[#4A5B4B]">
                    <Icon className="h-4 w-4" strokeWidth={1.7} />
                  </span>
                  <div>
                    <p className="font-serif text-2xl font-semibold leading-none text-[#2A2927]">
                      {item.value}
                    </p>
                    <p className="mt-1 text-xs font-semibold text-[#2A2927]">
                      {item.label}
                    </p>
                    <p className="mt-0.5 text-[11px] text-[#5F5C55]">
                      {item.detail}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* -------- SIGNATURE RITUALS OVER LIVE WALLPAPER -------- */}
        <section
          id="signature-rituals"
          className="bg-[#FAF8F5]/72 py-24 backdrop-blur-md lg:py-28"
        >
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div className="max-w-xl">
                <p className="text-[11px] font-semibold tracking-[0.24em] text-[#4A5B4B] uppercase">
                  Curated Treatments
                </p>
                <h2 className="mt-3 font-serif text-4xl font-semibold text-[#1F241F] sm:text-5xl">
                  Signature Rituals
                </h2>
                <p className="mt-4 text-[14px] leading-relaxed text-[#4A4741]">
                  Each service is a restorative journey utilizing organic
                  botanicals, high-performance formulations, and masterful
                  precision.
                </p>
              </div>

              <Link
                to="/services"
                className="inline-flex items-center gap-2 self-start rounded-xl border border-[#2A2927]/15 bg-[#FAF8F5]/90 px-5 py-3 text-xs font-semibold tracking-wide text-[#2A2927] shadow-xs backdrop-blur-sm transition-colors hover:bg-[#FAF8F5] md:self-auto"
              >
                <span>View Full Botanical Menu</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-3">
              {SIGNATURE_RITUALS.map((ritual) => (
                <article
                  key={ritual.id}
                  className="group flex flex-col overflow-hidden rounded-[24px] border border-white/60 bg-[#FAF8F5]/92 shadow-lg backdrop-blur-md transition-all duration-500 hover:-translate-y-1.5 hover:bg-[#FAF8F5] hover:shadow-2xl"
                >
                  <div className="relative aspect-[4/4.1] w-full overflow-hidden bg-[#EAE6DE]">
                    <img
                      src={ritual.image}
                      alt={ritual.alt}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#181D18]/60 via-transparent to-transparent" />

                    <span className="absolute left-4 top-4 rounded-full bg-[#FAF8F5]/90 px-3 py-1 font-serif text-xs font-semibold text-[#2A2927] backdrop-blur-xs">
                      {ritual.number}
                    </span>
                    <span className="absolute right-4 top-4 rounded-full bg-[#1E251E]/75 px-3 py-1 text-[10.5px] font-medium text-[#FAF8F5] backdrop-blur-xs">
                      {ritual.priceTag}
                    </span>

                    <div className="absolute bottom-4 left-4 inline-flex items-center gap-1.5 text-[11px] font-medium text-[#FAF8F5]">
                      <Clock className="h-3.5 w-3.5 text-[#EFE0C6]" />
                      <span>{ritual.duration}</span>
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col p-7">
                    <h3 className="font-serif text-2xl font-semibold text-[#2A2927]">
                      {ritual.title}
                    </h3>

                    <p className="mt-3 flex-1 text-[13px] leading-[1.75] text-[#5F5C55]">
                      {ritual.description}
                    </p>

                    <Link
                      to={`/services?ritual=${ritual.id}`}
                      className="mt-6 inline-flex items-center justify-between border-t border-[#ECE8E0] pt-4 text-[12.5px] font-semibold text-[#4A5B4B] transition-colors hover:text-[#2A2927]"
                    >
                      <span>Explore Ritual</span>
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* -------- FLOATING DARK-GLASS FOUNDER'S MANIFESTO -------- */}
        <section id="manifesto" className="px-6 py-20 lg:px-10 lg:py-24">
          <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[32px] border border-white/20 bg-[#222B23]/80 px-8 py-16 text-center text-[#FAF8F5] shadow-2xl backdrop-blur-xl sm:px-14 lg:px-24 lg:py-24">
            <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-[#EFE0C6]/15 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-[#8FA391]/20 blur-3xl" />

            <div className="relative z-10">
              <p className="text-[11px] font-semibold tracking-[0.26em] text-[#EFE0C6] uppercase">
                Founder&rsquo;s Manifesto
              </p>

              <blockquote className="mx-auto mt-7 max-w-3xl font-serif text-2xl font-normal italic leading-[1.45] text-[#FAF8F5] sm:text-[34px]">
                &ldquo;We believe true luxury is unhurried, deeply personal, and
                entirely in harmony with nature. Every formulation we choose and
                every ritual we perform honors your natural beauty.&rdquo;
              </blockquote>

              <div className="mt-10 flex flex-col items-center">
                <img
                  src={founderVera}
                  alt="Vera Sterling, Founder & Creative Director"
                  className="h-16 w-16 rounded-2xl border-2 border-[#EFE0C6]/50 object-cover shadow-lg"
                />
                <p className="mt-4 font-serif text-[19px] font-semibold text-[#FAF8F5]">
                  Vera Sterling
                </p>
                <p className="mt-0.5 text-[11.5px] tracking-wide text-[#C9D2CA]">
                  Founder &amp; Creative Director
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* -------- SANCTUARY STORIES OVER LIVE WALLPAPER -------- */}
        <section className="bg-[#FAF8F5]/75 py-24 backdrop-blur-md lg:py-28">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-[11px] font-semibold tracking-[0.24em] text-[#4A5B4B] uppercase">
                Sanctuary Stories
              </p>
              <h2 className="mt-3 font-serif text-4xl font-semibold text-[#1F241F] sm:text-5xl">
                Words from Our Guests
              </h2>
              <p className="mt-4 text-[14px] leading-relaxed text-[#4A4741]">
                Read authentic reflections from those who have made Vera &amp;
                Bloom part of their self-care ritual.
              </p>
            </div>

            <div className="mt-14 grid grid-cols-1 gap-7 md:grid-cols-3">
              {TESTIMONIALS.map((item) => (
                <article
                  key={item.id}
                  className="flex flex-col justify-between rounded-[24px] border border-white/60 bg-[#FAF8F5]/92 p-8 shadow-md backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:bg-[#FAF8F5] hover:shadow-xl"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <div
                        className="flex items-center gap-1 text-[#C89F52]"
                        aria-label="5 out of 5 stars"
                      >
                        {Array.from({ length: 5 }).map((_, idx) => (
                          <Star
                            key={idx}
                            className="h-3.5 w-3.5 fill-current"
                            strokeWidth={1.5}
                          />
                        ))}
                      </div>
                      <span className="rounded-full bg-[#EFE0C6]/80 px-2.5 py-0.5 text-[10px] font-semibold text-[#7A6444]">
                        {item.ritual}
                      </span>
                    </div>

                    <p className="mt-6 font-serif text-[17.5px] italic leading-[1.65] text-[#2A2927]">
                      {item.quote}
                    </p>
                  </div>

                  <div className="mt-8 flex items-center gap-3.5 border-t border-[#E8E4DC] pt-5">
                    <img
                      src={item.avatar}
                      alt={item.name}
                      className="h-11 w-11 rounded-full border border-[#DCD7CC] object-cover"
                    />
                    <div>
                      <p className="font-serif text-[16px] font-semibold text-[#2A2927]">
                        {item.name}
                      </p>
                      <p className="text-[11px] text-[#7A766E]">{item.role}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* -------- MODERN FLOATING-GLASS SALON LOCATION & MAP -------- */}
        <section
          id="visit-us"
          className="scroll-mt-24 bg-[#F5F3EE]/88 py-20 backdrop-blur-md lg:py-24"
        >
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div>
                <p className="text-[10.5px] font-semibold tracking-[0.26em] text-[#4A5B4B] uppercase">
                  Visit Our Sanctuary
                </p>
                <h2 className="mt-2 font-serif text-4xl font-semibold text-[#2A2927] sm:text-5xl">
                  Find Us in{' '}
                  <span className="italic text-[#4A5B4B]">Colombo 07</span>
                </h2>
              </div>
              <p className="max-w-md text-[13.5px] leading-relaxed text-[#5F5C55]">
                Nestled in the leafy quiet of Cinnamon Gardens, our flagship
                botanical house welcomes you with private valet parking and
                herbal tea upon arrival.
              </p>
            </div>

            {/* Full-Bleed Architectural Map Canvas with Floating Glass Cards */}
            <div className="relative overflow-hidden rounded-[32px] border border-[#DFDBD2] bg-[#E8E4DC] shadow-[0_24px_60px_rgba(34,43,35,0.14)]">
              {/* Interactive Map Layer */}
              <div className="relative h-[620px] w-full sm:h-[580px] lg:h-[600px]">
                <iframe
                  title="Vera & Bloom Sanctuary Location Map — Horton Place, Colombo 07"
                  src={
                    mapStyle === 'satellite'
                      ? 'https://www.google.com/maps?q=Horton+Place,+Colombo+07,+Sri+Lanka&t=k&z=17&output=embed'
                      : 'https://www.google.com/maps?q=Horton+Place,+Colombo+07,+Sri+Lanka&z=16&output=embed'
                  }
                  className={`h-full w-full border-0 transition-all duration-500 ${
                    mapStyle === 'botanical'
                      ? 'grayscale-[38%] sepia-[22%] contrast-[0.94] brightness-[0.98] saturate-[0.72]'
                      : 'contrast-[1.02] saturate-[0.9]'
                  }`}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />

                {/* Subtle Architectural Vignette Frame */}
                <div className="pointer-events-none absolute inset-0 rounded-[32px] ring-1 ring-inset ring-black/10" />
              </div>

              {/* TOP-RIGHT: Floating Map Style Switcher & Fullscreen Map Link */}
              <div className="absolute top-4 right-4 z-20 flex items-center gap-2 sm:top-6 sm:right-6">
                <div className="inline-flex rounded-full border border-white/40 bg-[#FAF8F5]/90 p-1 text-[11px] font-semibold shadow-lg backdrop-blur-xl">
                  <button
                    type="button"
                    onClick={() => setMapStyle('botanical')}
                    className={`cursor-pointer rounded-full px-3.5 py-1.5 transition-all ${
                      mapStyle === 'botanical'
                        ? 'bg-[#253026] text-[#EFE0C6] shadow-xs'
                        : 'text-[#57544E] hover:text-[#222B23]'
                    }`}
                  >
                    Botanical
                  </button>
                  <button
                    type="button"
                    onClick={() => setMapStyle('satellite')}
                    className={`cursor-pointer rounded-full px-3.5 py-1.5 transition-all ${
                      mapStyle === 'satellite'
                        ? 'bg-[#253026] text-[#EFE0C6] shadow-xs'
                        : 'text-[#57544E] hover:text-[#222B23]'
                    }`}
                  >
                    Satellite
                  </button>
                </div>

                <a
                  href="https://www.google.com/maps/search/?api=1&query=Horton+Place,+Colombo+07,+Sri+Lanka"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Open in Google Maps"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/40 bg-[#FAF8F5]/90 text-[#222B23] shadow-lg backdrop-blur-xl transition-colors hover:bg-[#253026] hover:text-[#EFE0C6]"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>

              {/* LEFT: Floating Frosted Dark-Sage Concierge Card */}
              <div className="relative z-20 m-4 rounded-[26px] border border-white/15 bg-[#1F2820]/94 p-6 text-[#FAF8F5] shadow-2xl backdrop-blur-xl sm:p-7 lg:absolute lg:top-6 lg:bottom-6 lg:left-6 lg:m-0 lg:flex lg:w-[410px] lg:flex-col lg:justify-between">
                <div>
                  {/* Mini Sanctuary Photo Header */}
                  <div className="relative mb-5 h-28 overflow-hidden rounded-2xl border border-white/10">
                    <img
                      src={wallpaperSanctuary}
                      alt="Vera & Bloom Colombo 07 Interior"
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1A221B]/85 via-[#1A221B]/25 to-transparent" />
                    <div className="absolute right-3 bottom-3 left-3 flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-[#222B23]/80 px-2.5 py-1 text-[9.5px] font-semibold tracking-[0.16em] text-[#EFE0C6] uppercase backdrop-blur-md">
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#57A764]" />
                        Open Today &bull; Until 8 PM
                      </span>
                      <span className="rounded-full bg-[#EFE0C6] px-2.5 py-0.5 text-[10px] font-bold text-[#222B23]">
                        ★ 4.98
                      </span>
                    </div>
                  </div>

                  <h3 className="font-serif text-[26px] font-normal leading-tight text-[#FAF8F5]">
                    Vera &amp; Bloom{' '}
                    <span className="italic text-[#EFE0C6]">Sanctuary</span>
                  </h3>

                  {/* Address + Copy Button */}
                  <div className="mt-4 flex items-start justify-between gap-2 rounded-2xl border border-white/10 bg-white/[0.06] p-3.5">
                    <div className="flex items-start gap-2.5 text-[12.5px]">
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#EFE0C6]" />
                      <p className="leading-snug text-[#E6ECE7]">
                        No. 42, Horton Place, Cinnamon Gardens
                        <br />
                        <span className="text-[#A8B8AA]">
                          Colombo 07, Sri Lanka
                        </span>
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleCopyAddress}
                      title="Copy address"
                      className="inline-flex shrink-0 cursor-pointer items-center gap-1 rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-semibold text-[#EFE0C6] transition-colors hover:bg-white/20"
                    >
                      {copiedAddr ? (
                        <>
                          <Check className="h-3 w-3" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Hours & Concierge Compact Grid */}
                  <div className="mt-3 grid grid-cols-2 gap-2.5 text-[11.5px]">
                    <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-3">
                      <p className="flex items-center gap-1.5 text-[9.5px] font-semibold tracking-[0.16em] text-[#A8B8AA] uppercase">
                        <Clock className="h-3 w-3 text-[#EFE0C6]" />
                        Hours
                      </p>
                      <p className="mt-1 font-medium text-[#FAF8F5]">
                        Tue–Sat: 9–8 PM
                      </p>
                      <p className="text-[10.5px] text-[#A8B8AA]">
                        Sun: 10–6 PM
                      </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-3">
                      <p className="flex items-center gap-1.5 text-[9.5px] font-semibold tracking-[0.16em] text-[#A8B8AA] uppercase">
                        <Car className="h-3 w-3 text-[#EFE0C6]" />
                        Arrival
                      </p>
                      <p className="mt-1 font-medium text-[#FAF8F5]">
                        Private Valet
                      </p>
                      <p className="text-[10.5px] text-[#A8B8AA]">
                        Herbal Tea Bar
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Pills */}
                <div className="mt-5 flex items-center gap-2.5 border-t border-white/10 pt-4">
                  <a
                    href="https://www.google.com/maps/dir/?api=1&destination=Horton+Place,+Colombo+07,+Sri+Lanka"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-[#EFE0C6] px-5 py-3 text-xs font-semibold tracking-wide text-[#222B23] shadow-sm transition-all hover:bg-[#F7EEDC]"
                  >
                    <Navigation className="h-3.5 w-3.5" />
                    <span>Get Directions</span>
                  </a>

                  <a
                    href="tel:+94112694488"
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/[0.07] px-4 py-3 text-xs font-medium text-[#FAF8F5] transition-colors hover:bg-white/14"
                  >
                    <Phone className="h-3.5 w-3.5 text-[#EFE0C6]" />
                    <span>Call</span>
                  </a>
                </div>
              </div>

              {/* BOTTOM-RIGHT: Floating Landmark Distance Chips */}
              <div className="pointer-events-none absolute right-6 bottom-6 z-20 hidden flex-wrap items-center gap-2 xl:flex">
                {[
                  { place: 'Viharamahadevi Park', time: '3 min drive' },
                  { place: 'Cinnamon Grand', time: '7 min drive' },
                  { place: 'Galle Face', time: '9 min drive' },
                ].map((lm) => (
                  <span
                    key={lm.place}
                    className="rounded-full border border-white/50 bg-[#FAF8F5]/92 px-3.5 py-1.5 text-[11px] font-medium text-[#222B23] shadow-md backdrop-blur-md"
                  >
                    <strong>{lm.place}</strong> &middot;{' '}
                    <span className="text-[#6C6961]">{lm.time}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* -------- FINAL FROSTED CTA BANNER OVER LIVE WALLPAPER -------- */}
        <section className="px-6 py-20 lg:px-10">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 rounded-[28px] border border-white/35 bg-[#FAF8F5]/88 p-8 text-center shadow-2xl backdrop-blur-xl sm:p-12 md:flex-row md:text-left">
            <div>
              <p className="text-[10.5px] font-semibold tracking-[0.24em] text-[#4A5B4B] uppercase">
                Reserve Your Moment
              </p>
              <h2 className="mt-2 font-serif text-3xl font-semibold text-[#2A2927] sm:text-4xl">
                Ready for Your Sanctuary Experience?
              </h2>
              <p className="mt-2 text-[13.5px] text-[#5F5C55]">
                Choose your bespoke rituals and preferred specialist in under a
                minute.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3.5">
              <Link
                to="/booking"
                className="inline-flex items-center gap-2 rounded-xl bg-[#4A5B4B] px-7 py-3.5 text-xs font-semibold tracking-wide text-[#FAF8F5] shadow-sm transition-colors hover:bg-[#3B4A3C]"
              >
                <span>Book Appointment</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <Link
                to="/bridal"
                className="rounded-xl border border-[#D8D3C8] bg-[#FAF8F5] px-6 py-3.5 text-xs font-semibold tracking-wide text-[#2A2927] transition-colors hover:bg-[#EFECE6]"
              >
                Explore Bridal
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
