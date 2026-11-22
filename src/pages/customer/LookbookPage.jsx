import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, X } from 'lucide-react';

import heroPortrait from '../../assets/hero-portrait.jpg';
import ritualHair from '../../assets/ritual-hair.jpg';
import ritualSkin from '../../assets/ritual-skin.jpg';
import ritualBridal from '../../assets/ritual-bridal.jpg';
import bridalHero from '../../assets/bridal-hero.jpg';
import bridalKandyan from '../../assets/bridal-kandyan.jpg';
import bridalPrep from '../../assets/bridal-prep.jpg';
import founderVera from '../../assets/founder-vera.jpg';

const CATEGORIES = [
  'All Looks',
  'Balayage & Gloss',
  'Bridal Glam',
  'Glass Skin Facials',
  'Botanical Nail Art',
];

const SPOTLIGHT_GALLERY = [
  {
    id: 'emma',
    title: 'SOFT & ROMANTIC: EMMA',
    caption:
      "Intricate organic updo with baby's breath and natural, dewy makeup. Shot by @verabloomphoto.",
    image: bridalHero,
    category: 'Bridal Glam',
  },
  {
    id: 'amaya',
    title: 'HERITAGE GRACE: AMAYA',
    caption:
      'Traditional Kandyan bridal artistry paired with fresh jasmine blossoms and luminous skin prep.',
    image: bridalKandyan,
    category: 'Bridal Glam',
  },
  {
    id: 'claire',
    title: 'GARDEN RADIANCE: CLAIRE',
    caption:
      'Softly pinned botanical waves with golden-hour glass skin finish and organic lip tint.',
    image: ritualBridal,
    category: 'Bridal Glam',
  },
  {
    id: 'priya',
    title: 'MORNING SERENITY: PRIYA',
    caption:
      'Unhurried bridal suite preparation with rosehip elixir hydration and featherlight complexion.',
    image: bridalPrep,
    category: 'Bridal Glam',
  },
  {
    id: 'vera',
    title: 'EFFORTLESS GLOSS: VERA',
    caption:
      'Cold-pressed camellia oil glossing treatment for mirror-like shine and silky movement.',
    image: founderVera,
    category: 'Balayage & Gloss',
  },
];

const LOOKBOOK_ITEMS = [
  {
    id: 'sun-kissed-balayage',
    title: 'Sun-Kissed Botanical Balayage',
    category: 'Balayage & Gloss',
    subtitle: 'Ammonia-free clay lightening & camellia gloss',
    image: heroPortrait,
    column: 'left',
    aspect: 'aspect-[4/3.6]',
  },
  {
    id: 'botanical-nail-art',
    title: 'Botanical Leaf Nail Art',
    category: 'Botanical Nail Art',
    subtitle: 'Hand-painted organic olive stems on sheer almond gel',
    image: ritualHair,
    column: 'left',
    aspect: 'aspect-[4/3.2]',
  },
  {
    id: 'timeless-bridal',
    title: 'Timeless Bridal Elegance',
    category: 'Bridal Glam',
    subtitle: 'Soft romantic waves & luminous bridal complexion',
    image: ritualBridal,
    column: 'left',
    aspect: 'aspect-[4/3.6]',
  },
  {
    id: 'herbal-steam-ritual',
    title: 'Herbal Steam & Botanical Infusion',
    category: 'Glass Skin Facials',
    subtitle: 'Warm chamomile & rose-petal aromatherapy facial steam',
    image: ritualSkin,
    column: 'center',
    aspect: 'aspect-[4/3.2]',
  },
  {
    id: 'glass-skin-facial',
    title: 'Glass Skin Botanical Facial',
    category: 'Glass Skin Facials',
    subtitle: 'Papaya enzyme resurfacing & cooling lymphatic ritual',
    image: bridalPrep,
    column: 'right',
    aspect: 'aspect-[4/3.4]',
  },
  {
    id: 'luminous-brunette-couture',
    title: 'Luminous Brunette Couture',
    category: 'Balayage & Gloss',
    subtitle: 'Plant-based dimensional toning & botanical silk blowout',
    image: bridalKandyan,
    column: 'right',
    aspect: 'aspect-[3/4.6]',
  },
];

export default function LookbookPage() {
  const [activeCategory, setActiveCategory] = useState('All Looks');
  const [spotlightIndex, setSpotlightIndex] = useState(0);
  const [lightboxLook, setLightboxLook] = useState(null);

  const activeSpotlight = SPOTLIGHT_GALLERY[spotlightIndex];

  const filteredItems = useMemo(() => {
    if (activeCategory === 'All Looks') return LOOKBOOK_ITEMS;
    return LOOKBOOK_ITEMS.filter((item) => item.category === activeCategory);
  }, [activeCategory]);

  const leftItems = LOOKBOOK_ITEMS.filter((i) => i.column === 'left');
  const centerBottomItem = LOOKBOOK_ITEMS.find((i) => i.column === 'center');
  const rightItems = LOOKBOOK_ITEMS.filter((i) => i.column === 'right');

  return (
    <div className="bg-[#FAF8F5] pb-24">
      {/* ================= PAGE HEADER ================= */}
      <section className="mx-auto max-w-7xl px-6 pb-8 pt-12 text-center lg:px-10 lg:pt-16">
        <p className="text-[10px] font-semibold tracking-[0.24em] text-[#6B786A] uppercase">
          Curated Visual Archive
        </p>
        <h1 className="mt-3 font-serif text-4xl font-semibold text-[#2A2927] sm:text-[44px]">
          Botanical Lookbook &amp; Portfolio
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-[13.5px] leading-relaxed text-[#6C6961]">
          Explore our curated transformations across hair couture, bridal
          styling, and holistic skin rituals.
        </p>

        {/* Category Filter Tabs */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2.5">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
              className={`cursor-pointer rounded-lg px-4 py-2 text-[12px] font-medium transition-colors ${
                activeCategory === category
                  ? 'bg-[#4A5B4B] text-[#FAF8F5] shadow-2xs'
                  : 'bg-[#EFECE6] text-[#57544E] hover:bg-[#E5E1D8]'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      {/* ================= EDITORIAL MASONRY GRID ================= */}
      <section className="mx-auto max-w-7xl px-6 pt-4 lg:px-10">
        {activeCategory === 'All Looks' ? (
          <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
            {/* LEFT COLUMN */}
            <div className="space-y-6">
              {leftItems.map((item) => (
                <LookCard
                  key={item.id}
                  item={item}
                  onOpen={() => setLightboxLook(item)}
                />
              ))}
            </div>

            {/* CENTER COLUMN: Editorial Feature Card + Bottom Spa Card */}
            <div className="space-y-6">
              {/* Featured Vera & Bloom Editorial Spotlight */}
              <article className="overflow-hidden rounded-2xl border border-[#E6E2DA] bg-[#FAF8F5] shadow-xs">
                {/* Card Masthead */}
                <div className="py-5 text-center">
                  <p className="font-serif text-[20px] font-medium tracking-[0.22em] text-[#4A4741]">
                    VERA &amp; BLOOM
                  </p>
                  <p className="mt-0.5 text-[10px] tracking-[0.14em] text-[#8A867E]">
                    Lookbook &amp; Portfolio Gallery
                  </p>
                </div>

                {/* Main Spotlight Photo */}
                <button
                  type="button"
                  onClick={() =>
                    setLightboxLook({
                      title: activeSpotlight.title,
                      category: activeSpotlight.category,
                      subtitle: activeSpotlight.caption,
                      image: activeSpotlight.image,
                    })
                  }
                  className="group relative block aspect-[4/4.3] w-full cursor-pointer overflow-hidden bg-[#ECE8E0]"
                >
                  <img
                    src={activeSpotlight.image}
                    alt={activeSpotlight.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </button>

                {/* Mini Thumbnail Strip */}
                <div className="px-6 pb-6 pt-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    {SPOTLIGHT_GALLERY.map((thumb, idx) => (
                      <button
                        key={thumb.id}
                        type="button"
                        onClick={() => setSpotlightIndex(idx)}
                        aria-label={`View ${thumb.title}`}
                        className={`h-10 w-10 cursor-pointer overflow-hidden rounded-md border transition-all ${
                          idx === spotlightIndex
                            ? 'scale-105 border-[#4A5B4B] ring-1 ring-[#4A5B4B]'
                            : 'border-[#E2DDD4] opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img
                          src={thumb.image}
                          alt={thumb.title}
                          className="h-full w-full object-cover"
                        />
                      </button>
                    ))}
                  </div>

                  {/* Caption */}
                  <h2 className="mt-4 font-serif text-[16px] font-semibold tracking-[0.08em] text-[#2A2927]">
                    {activeSpotlight.title}
                  </h2>
                  <p className="mx-auto mt-1.5 max-w-xs text-[11.5px] leading-relaxed text-[#6C6961]">
                    {activeSpotlight.caption}
                  </p>
                  <p className="mt-4 font-serif text-[10px] tracking-[0.24em] text-[#8A867E] uppercase">
                    Vera &amp; Bloom
                  </p>
                </div>
              </article>

              {/* Bottom Center Card */}
              {centerBottomItem && (
                <LookCard
                  item={centerBottomItem}
                  onOpen={() => setLightboxLook(centerBottomItem)}
                />
              )}
            </div>

            {/* RIGHT COLUMN */}
            <div className="space-y-6">
              {rightItems.map((item) => (
                <LookCard
                  key={item.id}
                  item={item}
                  onOpen={() => setLightboxLook(item)}
                />
              ))}
            </div>
          </div>
        ) : (
          /* Filtered Category Grid */
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredItems.map((item) => (
              <LookCard
                key={item.id}
                item={{ ...item, aspect: 'aspect-[4/4.2]' }}
                onOpen={() => setLightboxLook(item)}
              />
            ))}
          </div>
        )}
      </section>

      {/* ================= LIGHTBOX MODAL ================= */}
      {lightboxLook && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#1F1E1C]/70 p-4 backdrop-blur-xs"
          onClick={() => setLightboxLook(null)}
        >
          <div
            className="relative grid w-full max-w-3xl grid-cols-1 overflow-hidden rounded-2xl border border-[#E5E1D8] bg-[#FAF8F5] shadow-2xl md:grid-cols-12"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setLightboxLook(null)}
              aria-label="Close preview"
              className="absolute right-3.5 top-3.5 z-10 inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-[#FAF8F5]/90 text-[#2A2927] shadow-xs transition-colors hover:bg-[#EFECE6]"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="aspect-[4/4.2] bg-[#ECE8E0] md:col-span-7 md:aspect-auto">
              <img
                src={lightboxLook.image}
                alt={lightboxLook.title}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="flex flex-col justify-between p-7 md:col-span-5">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#EFE0C6] px-3 py-1 text-[10px] font-semibold tracking-wider text-[#7A6444] uppercase">
                  <Sparkles className="h-3 w-3" />
                  {lightboxLook.category}
                </span>
                <h3 className="mt-4 font-serif text-2xl font-semibold text-[#2A2927]">
                  {lightboxLook.title}
                </h3>
                <p className="mt-3 text-[13px] leading-relaxed text-[#6C6961]">
                  {lightboxLook.subtitle}
                </p>
              </div>

              <div className="mt-8 border-t border-[#ECE8E0] pt-5">
                <Link
                  to="/booking"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#4A5B4B] px-5 py-3 text-xs font-medium tracking-wide text-[#FAF8F5] transition-colors hover:bg-[#3B4A3C]"
                >
                  <span>Book This Look</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function LookCard({ item, onOpen }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className={`group relative block w-full cursor-pointer overflow-hidden rounded-2xl bg-[#ECE8E0] text-left shadow-xs ${item.aspect}`}
    >
      <img
        src={item.image}
        alt={item.title}
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#1F1E1C]/70 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="absolute inset-x-0 bottom-0 translate-y-2 p-5 text-[#FAF8F5] opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
        <p className="text-[9.5px] font-semibold tracking-[0.2em] text-[#EFE0C6] uppercase">
          {item.category}
        </p>
        <p className="mt-1 font-serif text-lg font-semibold">{item.title}</p>
      </div>
    </button>
  );
}
