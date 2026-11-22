import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, ChevronDown, Sparkles, Star } from 'lucide-react';

import heroPortrait from '../../assets/hero-portrait.jpg';
import ritualHair from '../../assets/ritual-hair.jpg';
import ritualSkin from '../../assets/ritual-skin.jpg';
import ritualBridal from '../../assets/ritual-bridal.jpg';
import founderVera from '../../assets/founder-vera.jpg';

const SIGNATURE_RITUALS = [
  {
    id: 'organic-hair-couture',
    title: 'Organic Hair Couture',
    description:
      'Tailored cuts, ammonia-free botanical glossing, and deep restorative plant-based infusions for luminous, healthy locks.',
    image: ritualHair,
    alt: 'Stylist tending to glossy wavy hair in an organic sunlit salon',
  },
  {
    id: 'botanical-skin-therapy',
    title: 'Botanical Skin Therapy',
    description:
      "Customized facials, bespoke lymphatic drainage, and potent clean organic extracts designed to restore skin's natural radiance.",
    image: ritualSkin,
    alt: 'Relaxing botanical spa facial therapy session',
  },
  {
    id: 'bridal-artistry',
    title: 'Bridal Artistry',
    description:
      'Exquisite hair design and luminous makeup artistry for your most cherished moments, complete with private trial sessions.',
    image: ritualBridal,
    alt: 'Radiant bride with natural luminous makeup and romantic floral bouquet',
  },
];

const TESTIMONIALS = [
  {
    id: 'elena',
    quote:
      '"An absolute haven of peace. The organic hair glossing left my hair silkier than I ever thought possible, and the atmosphere completely melts away the city stress."',
    name: 'Elena Rostova',
    role: 'Regular Guest since 2021',
    avatar: heroPortrait,
  },
  {
    id: 'claire',
    quote:
      '"Vera & Bloom handled my bridal party\'s hair and makeup. The trial was so thorough, and on the wedding day they brought such a calm, peaceful energy."',
    name: 'Claire Montgomery',
    role: 'Bridal Client',
    avatar: ritualBridal,
  },
  {
    id: 'sophia',
    quote:
      '"The botanical skin therapy facial is transformative. My skin has never looked so luminous and healthy. The attention to detail is unmatched anywhere in the city."',
    name: 'Sophia Chen',
    role: 'Skin Therapy Member',
    avatar: founderVera,
  },
];

export default function HomePage() {
  const [selectedRitual, setSelectedRitual] = useState('');
  const navigate = useNavigate();

  const handleExploreRitual = () => {
    if (selectedRitual) {
      navigate(`/services?ritual=${selectedRitual}`);
    } else {
      navigate('/services');
    }
  };

  return (
    <div className="bg-[#FAF8F5]">
      {/* ================= HERO SECTION ================= */}
      <section className="mx-auto max-w-7xl px-6 pb-20 pt-10 lg:px-10 lg:pb-28 lg:pt-14">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Left Content */}
          <div className="lg:col-span-6">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 rounded-full bg-[#EFE0C6] px-4 py-1.5 text-[10px] font-semibold tracking-[0.18em] text-[#7A6444] uppercase">
              <Sparkles className="h-3 w-3" strokeWidth={2} />
              <span>Organic Luxury Sanctuary</span>
            </div>

            {/* Headline */}
            <h1 className="mt-7 font-serif text-4xl font-semibold leading-[1.12] tracking-tight text-[#2A2927] sm:text-5xl lg:text-[54px]">
              Botanic Beauty, Tailored to You.
            </h1>

            {/* Subtitle */}
            <p className="mt-6 max-w-lg text-[14px] leading-[1.75] text-[#6C6961]">
              Immerse yourself in bespoke hair couture and restorative skin
              therapies designed around your natural essence. Experience
              unhurried luxury where holistic wellness meets high-fashion
              artistry.
            </p>

            {/* Action Buttons */}
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Link
                to="/booking"
                className="rounded-lg bg-[#4A5B4B] px-7 py-3.5 text-[13px] font-medium tracking-wide text-[#FAF8F5] shadow-xs transition-colors hover:bg-[#3B4A3C]"
              >
                Book Your Visit
              </Link>
              <Link
                to="/lookbook"
                className="rounded-lg border border-[#E4E0D8] bg-[#FAF8F5] px-7 py-3.5 text-[13px] font-medium tracking-wide text-[#2A2927] transition-colors hover:border-[#CFC9BE] hover:bg-[#F3F0EA]"
              >
                View Lookbook
              </Link>
            </div>

            {/* Quick Ritual Selector */}
            <div className="mt-10 flex max-w-lg items-center gap-2 rounded-xl border border-[#E6E2DA] bg-[#F2EFE9] p-2 pl-4">
              <Sparkles
                className="h-4 w-4 shrink-0 text-[#6E786B]"
                strokeWidth={1.6}
              />
              <div className="relative flex-1">
                <select
                  aria-label="Select a Signature Ritual"
                  value={selectedRitual}
                  onChange={(e) => setSelectedRitual(e.target.value)}
                  className="w-full cursor-pointer appearance-none bg-transparent py-2 pr-8 text-[13px] text-[#5C5952] focus:outline-none"
                >
                  <option value="">Select a Signature Ritual...</option>
                  {SIGNATURE_RITUALS.map((ritual) => (
                    <option key={ritual.id} value={ritual.id}>
                      {ritual.title}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7A766E]" />
              </div>
              <button
                type="button"
                onClick={handleExploreRitual}
                className="shrink-0 cursor-pointer rounded-lg bg-[#6E6350] px-5 py-2.5 text-[12px] font-medium text-[#FAF8F5] transition-colors hover:bg-[#5A5040]"
              >
                Explore
              </button>
            </div>
          </div>

          {/* Right Editorial Portrait Card */}
          <div className="lg:col-span-6">
            <div className="mx-auto max-w-[490px] overflow-hidden rounded-[22px] border border-[#E8E4DC] bg-[#F7F5F0] shadow-[0_24px_60px_-20px_rgba(42,41,39,0.18)]">
              {/* Top Brand Strip */}
              <div className="border-b border-[#EAE6DE] bg-[#FAF8F5] py-3.5 text-center">
                <span className="font-serif text-[13px] font-medium tracking-[0.26em] text-[#4F4D47]">
                  VERA &amp; BLOOM
                </span>
              </div>

              {/* Portrait & Floating Quote */}
              <div className="relative aspect-[4/4.6] w-full overflow-hidden">
                <img
                  src={heroPortrait}
                  alt="Vera & Bloom sunlit botanical editorial portrait"
                  className="h-full w-full object-cover object-center"
                />

                {/* Floating Quote Card */}
                <div className="absolute bottom-5 left-5 right-14 max-w-[270px] rounded-xl bg-[#FAF8F5]/95 p-5 shadow-lg backdrop-blur-xs">
                  <p className="font-serif text-[15px] italic leading-snug text-[#2A2927]">
                    &ldquo;The ultimate sanctuary for hair and skin.&rdquo;
                  </p>
                  <p className="mt-2.5 text-[9px] font-semibold tracking-[0.18em] text-[#7A766E] uppercase">
                    Vogue Wellness Edition
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= SIGNATURE RITUALS ================= */}
      <section
        id="signature-rituals"
        className="border-t border-[#ECE8E0] bg-[#F3F0EA] py-20 lg:py-28"
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          {/* Section Header */}
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-[11px] font-semibold tracking-[0.22em] text-[#6B786A] uppercase">
              Curated Treatments
            </p>
            <h2 className="mt-3 font-serif text-3xl font-semibold text-[#2A2927] sm:text-4xl">
              Signature Rituals
            </h2>
            <p className="mt-4 text-[13.5px] leading-relaxed text-[#6C6961]">
              Each service is a restorative journey utilizing organic botanicals,
              high-performance formulations, and masterful precision.
            </p>
          </div>

          {/* 3-Column Ritual Cards */}
          <div className="mt-14 grid grid-cols-1 gap-7 md:grid-cols-3">
            {SIGNATURE_RITUALS.map((ritual) => (
              <article
                key={ritual.id}
                className="group flex flex-col rounded-2xl border border-[#E5E1D8] bg-[#F6F4EF] p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
              >
                <div className="aspect-[4/3] w-full overflow-hidden rounded-xl bg-[#EAE6DE]">
                  <img
                    src={ritual.image}
                    alt={ritual.alt}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                <h3 className="mt-6 font-serif text-xl font-semibold text-[#2A2927]">
                  {ritual.title}
                </h3>

                <p className="mt-3 flex-1 text-[13px] leading-[1.7] text-[#6C6961]">
                  {ritual.description}
                </p>

                <Link
                  to={`/services?ritual=${ritual.id}`}
                  className="mt-6 inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#4A5B4B] transition-colors hover:text-[#2A2927]"
                >
                  <span>Explore Ritual</span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ================= FOUNDER'S MANIFESTO ================= */}
      <section id="manifesto" className="bg-[#FAF8F5] py-20 lg:py-28">
        <div className="mx-auto max-w-5xl px-6 lg:px-10">
          <div className="rounded-[26px] border border-[#E4E0D8] bg-gradient-to-br from-[#EAEAE5] via-[#EFECE6] to-[#EAE5DC] px-8 py-16 text-center shadow-xs sm:px-14 lg:px-20 lg:py-20">
            <p className="text-[11px] font-semibold tracking-[0.22em] text-[#6B786A] uppercase">
              Founder&rsquo;s Manifesto
            </p>

            <blockquote className="mx-auto mt-7 max-w-3xl font-serif text-2xl font-medium leading-[1.45] text-[#2A2927] sm:text-[28px]">
              &ldquo;We believe true luxury is unhurried, deeply personal, and
              entirely in harmony with nature. Every formulation we choose and
              every ritual we perform honors your natural beauty.&rdquo;
            </blockquote>

            <div className="mt-10 flex flex-col items-center">
              <img
                src={founderVera}
                alt="Vera Sterling, Founder & Creative Director"
                className="h-14 w-14 rounded-xl border border-[#DCD8CF] object-cover shadow-xs"
              />
              <p className="mt-3.5 font-serif text-[16px] font-semibold text-[#2A2927]">
                Vera Sterling
              </p>
              <p className="mt-0.5 text-[11px] text-[#7A766E]">
                Founder &amp; Creative Director
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= SANCTUARY STORIES ================= */}
      <section className="border-t border-[#ECE8E0] bg-[#F3F0EA] py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          {/* Header */}
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-[11px] font-semibold tracking-[0.22em] text-[#6B786A] uppercase">
              Sanctuary Stories
            </p>
            <h2 className="mt-3 font-serif text-3xl font-semibold text-[#2A2927] sm:text-4xl">
              Words from Our Guests
            </h2>
            <p className="mt-4 text-[13.5px] leading-relaxed text-[#6C6961]">
              Read authentic reflections from those who have made Vera &amp;
              Bloom part of their self-care ritual.
            </p>
          </div>

          {/* 3-Column Testimonial Cards */}
          <div className="mt-14 grid grid-cols-1 gap-7 md:grid-cols-3">
            {TESTIMONIALS.map((item) => (
              <article
                key={item.id}
                className="flex flex-col justify-between rounded-2xl border border-[#E6E2DA] bg-[#FAF8F5] p-7 shadow-2xs"
              >
                <div>
                  {/* 5 Stars */}
                  <div
                    className="flex items-center gap-1 text-[#D4AF6A]"
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

                  {/* Quote */}
                  <p className="mt-5 font-serif text-[16px] italic leading-[1.65] text-[#2A2927]">
                    {item.quote}
                  </p>
                </div>

                {/* Author */}
                <div className="mt-7 flex items-center gap-3.5 pt-2">
                  <img
                    src={item.avatar}
                    alt={item.name}
                    className="h-10 w-10 rounded-full border border-[#E5E1D8] object-cover"
                  />
                  <div>
                    <p className="font-serif text-[15px] font-semibold text-[#2A2927]">
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
    </div>
  );
}
