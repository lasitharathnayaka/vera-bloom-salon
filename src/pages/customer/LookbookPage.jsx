import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Bookmark,
  Heart,
  Search,
  Sparkles,
  User,
  X,
} from 'lucide-react';

import heroPortrait from '../../assets/hero-portrait.jpg';
import ritualHair from '../../assets/ritual-hair.jpg';
import ritualSkin from '../../assets/ritual-skin.jpg';
import ritualBridal from '../../assets/ritual-bridal.jpg';
import bridalHero from '../../assets/bridal-hero.jpg';
import bridalKandyan from '../../assets/bridal-kandyan.jpg';
import founderVera from '../../assets/founder-vera.jpg';
import wallpaperBotanicals from '../../assets/wallpaper-botanicals.jpg';
import wallpaperBridalAtelier from '../../assets/wallpaper-bridal-atelier.jpg';
import wallpaperSpaSuite from '../../assets/wallpaper-spa-suite.jpg';
import wallpaperSanctuary from '../../assets/wallpaper-sanctuary.jpg';

const HERO_WALLPAPERS = [
  { src: wallpaperBotanicals, label: 'Hair Couture' },
  { src: wallpaperBridalAtelier, label: 'Bridal Atelier' },
  { src: wallpaperSanctuary, label: 'Sanctuary Floor' },
  { src: wallpaperSpaSuite, label: 'Scalp Spa Suite' },
];

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
    specialist: 'Elena Rostova',
    image: bridalHero,
    category: 'Bridal Glam',
  },
  {
    id: 'amaya',
    title: 'HERITAGE GRACE: AMAYA',
    caption:
      'Traditional Kandyan bridal artistry paired with fresh jasmine blossoms and luminous skin prep.',
    specialist: 'Amara Thorne',
    image: bridalKandyan,
    category: 'Bridal Glam',
  },
  {
    id: 'claire',
    title: 'GARDEN RADIANCE: CLAIRE',
    caption:
      'Softly pinned botanical waves with golden-hour glass skin finish and organic lip tint.',
    specialist: 'Julian Vance',
    image: ritualBridal,
    category: 'Bridal Glam',
  },
  {
    id: 'couture',
    title: 'SILK COUTURE: MAYA',
    caption:
      'Voluminous chestnut waves finished with cold-pressed camellia gloss in our styling studio.',
    specialist: 'Nethmi Perera',
    image: wallpaperBotanicals,
    category: 'Balayage & Gloss',
  },
  {
    id: 'vera',
    title: 'EFFORTLESS GLOSS: VERA',
    caption:
      'Cold-pressed camellia oil glossing treatment for mirror-like shine and silky movement.',
    specialist: 'Vera Sterling',
    image: founderVera,
    category: 'Balayage & Gloss',
  },
];

const LOOKBOOK_ITEMS = [
  {
    id: 'sun-kissed-balayage',
    title: 'Sun-Kissed Botanical Balayage',
    category: 'Balayage & Gloss',
    specialist: 'Elena Rostova',
    subtitle: 'Ammonia-free clay lightening & cold-pressed camellia gloss',
    image: heroPortrait,
    column: 'left',
    aspect: 'aspect-[4/4.1]',
  },
  {
    id: 'botanical-nail-art',
    title: 'Botanical Salon Craft & Care',
    category: 'Botanical Nail Art',
    specialist: 'Clara Vance',
    subtitle: 'Organic sweet almond conditioning & botanical finish',
    image: ritualHair,
    column: 'left',
    aspect: 'aspect-[4/3.4]',
  },
  {
    id: 'timeless-bridal',
    title: 'Timeless Bridal Elegance',
    category: 'Bridal Glam',
    specialist: 'Amara Thorne',
    subtitle: 'Soft romantic waves & luminous bridal complexion',
    image: ritualBridal,
    column: 'left',
    aspect: 'aspect-[4/4]',
  },
  {
    id: 'herbal-steam-ritual',
    title: 'Herbal Steam & Botanical Infusion',
    category: 'Glass Skin Facials',
    specialist: 'Amara Thorne',
    subtitle: 'Warm chamomile & rose-petal aromatherapy facial steam',
    image: ritualSkin,
    column: 'center',
    aspect: 'aspect-[4/3.4]',
  },
  {
    id: 'bridal-vanity-glow',
    title: 'Bridal Vanity Finishing Touch',
    category: 'Bridal Glam',
    specialist: 'Julian Vance',
    subtitle: 'Luminous wedding-morning makeup & romantic textured updo',
    image: wallpaperBridalAtelier,
    column: 'right',
    aspect: 'aspect-[4/3.5]',
  },
  {
    id: 'luminous-brunette-couture',
    title: 'Luminous Brunette Couture',
    category: 'Balayage & Gloss',
    specialist: 'Nethmi Perera',
    subtitle: 'Plant-based dimensional toning & botanical silk blowout',
    image: wallpaperBotanicals,
    column: 'right',
    aspect: 'aspect-[4/4.8]',
  },
  {
    id: 'scalp-spa-lounge',
    title: 'Tranquil Scalp-Spa Ritual',
    category: 'Glass Skin Facials',
    specialist: 'Amara Thorne',
    subtitle: 'Deep botanical scalp detox & warm herbal steam therapy',
    image: wallpaperSpaSuite,
    column: 'right',
    aspect: 'aspect-[4/3.2]',
  },
];

export default function LookbookPage() {
  const [activeCategory, setActiveCategory] = useState('All Looks');
  const [searchQuery, setSearchQuery] = useState('');
  const [savedOnly, setSavedOnly] = useState(false);
  const [savedIds, setSavedIds] = useState([
    'sun-kissed-balayage',
    'timeless-bridal',
  ]);
  const [spotlightIndex, setSpotlightIndex] = useState(0);
  const [lightboxLook, setLightboxLook] = useState(null);
  const [wallpaperIdx, setWallpaperIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setWallpaperIdx((prev) => (prev + 1) % HERO_WALLPAPERS.length);
    }, 5500);
    return () => clearInterval(timer);
  }, []);

  const activeSpotlight = SPOTLIGHT_GALLERY[spotlightIndex];

  const toggleSave = (id, e) => {
    e?.stopPropagation();
    setSavedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const filteredItems = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return LOOKBOOK_ITEMS.filter((item) => {
      const matchesCategory =
        activeCategory === 'All Looks' || item.category === activeCategory;
      const matchesSaved = !savedOnly || savedIds.includes(item.id);
      const matchesQuery =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.specialist.toLowerCase().includes(q) ||
        item.subtitle.toLowerCase().includes(q);
      return matchesCategory && matchesSaved && matchesQuery;
    });
  }, [activeCategory, savedOnly, savedIds, searchQuery]);

  const showMasonry =
    activeCategory === 'All Looks' && !savedOnly && !searchQuery.trim();

  const leftItems = LOOKBOOK_ITEMS.filter((i) => i.column === 'left');
  const centerBottomItem = LOOKBOOK_ITEMS.find((i) => i.column === 'center');
  const rightItems = LOOKBOOK_ITEMS.filter((i) => i.column === 'right');

  return (
    <div className="bg-[#FAF8F5] pb-24">
      {/* ================= LIVE WALLPAPER EDITORIAL HERO BANNER ================= */}
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
            Curated Visual Archive &bull; 2026 Collection
          </span>

          <h1 className="mt-5 font-serif text-4xl font-medium tracking-tight text-[#FAF8F5] drop-shadow-xs sm:text-5xl lg:text-[56px]">
            Botanical Lookbook &amp;{' '}
            <span className="italic text-[#EFE0C6]">Portfolio</span>
          </h1>

          <p className="mx-auto mt-3.5 max-w-xl text-[14px] leading-relaxed text-[#E8EDE9]">
            Explore our curated transformations across hair couture, bridal
            artistry, and holistic glass-skin rituals.
          </p>

          {/* Search Bar */}
          <div className="mx-auto mt-8 max-w-md">
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#DCE4DD]" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search looks, stylists, or treatments..."
                className="w-full rounded-full border border-white/25 bg-[#1B231C]/55 py-3 pl-11 pr-5 text-[13px] text-[#FAF8F5] placeholder:text-[#C8D3C9] backdrop-blur-md transition-colors focus:border-[#EFE0C6] focus:bg-[#1B231C]/75 focus:outline-none"
              />
            </div>
          </div>

          {/* Subtle Live Wallpaper Indicator Pills */}
          <div className="mt-6 flex items-center justify-center gap-2">
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

      {/* ================= STICKY FROSTED FILTER PILLS ================= */}
      <div className="sticky top-[68px] z-30 border-b border-[#E6E2DA] bg-[#FAF8F5]/92 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-6 py-4 lg:px-10">
          <div className="flex flex-wrap items-center gap-2">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => {
                  setActiveCategory(category);
                  setSavedOnly(false);
                }}
                className={`cursor-pointer rounded-full px-4 py-2 text-[12px] font-medium transition-all ${
                  activeCategory === category && !savedOnly
                    ? 'bg-[#4A5B4B] text-[#FAF8F5] shadow-xs'
                    : 'border border-[#E6E2DA] bg-[#F3F0EA] text-[#57544E] hover:bg-[#EAE6DE]'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setSavedOnly((prev) => !prev)}
            className={`inline-flex cursor-pointer items-center gap-2 rounded-full px-4 py-2 text-[12px] font-medium transition-all ${
              savedOnly
                ? 'bg-[#253026] text-[#EFE0C6] shadow-xs'
                : 'border border-[#E6E2DA] bg-[#FAF8F5] text-[#4A5B4B] hover:bg-[#F3F0EA]'
            }`}
          >
            <Heart
              className={`h-3.5 w-3.5 ${savedOnly ? 'fill-[#EFE0C6]' : ''}`}
            />
            <span>Saved Looks ({savedIds.length})</span>
          </button>
        </div>
      </div>

      {/* ================= EDITORIAL MASONRY GRID ================= */}
      <section className="mx-auto max-w-7xl px-6 pt-12 lg:px-10">
        {showMasonry ? (
          <div className="grid grid-cols-1 items-start gap-7 lg:grid-cols-3">
            {/* LEFT COLUMN */}
            <div className="space-y-7">
              {leftItems.map((item) => (
                <LookCard
                  key={item.id}
                  item={item}
                  isSaved={savedIds.includes(item.id)}
                  onToggleSave={(e) => toggleSave(item.id, e)}
                  onOpen={() => setLightboxLook(item)}
                />
              ))}
            </div>

            {/* CENTER COLUMN: Dark-Sage Spotlight Card + Bottom Spa Card */}
            <div className="space-y-7">
              <article className="overflow-hidden rounded-[26px] bg-[#253026] text-[#FAF8F5] shadow-2xl">
                {/* Masthead */}
                <div className="px-6 py-5 text-center">
                  <p className="font-serif text-[20px] font-medium tracking-[0.24em] text-[#FAF8F5]">
                    VERA &amp; BLOOM
                  </p>
                  <p className="mt-0.5 text-[10px] tracking-[0.18em] text-[#EFE0C6] uppercase">
                    Editorial Spotlight Gallery
                  </p>
                </div>

                {/* Main Spotlight Photo */}
                <button
                  type="button"
                  onClick={() =>
                    setLightboxLook({
                      id: activeSpotlight.id,
                      title: activeSpotlight.title,
                      category: activeSpotlight.category,
                      specialist: activeSpotlight.specialist,
                      subtitle: activeSpotlight.caption,
                      image: activeSpotlight.image,
                    })
                  }
                  className="group relative block aspect-[4/4.3] w-full cursor-pointer overflow-hidden bg-[#1B221B]"
                >
                  <img
                    src={activeSpotlight.image}
                    alt={activeSpotlight.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </button>

                {/* Thumbnail Switcher + Caption */}
                <div className="px-6 pb-7 pt-5 text-center">
                  <div className="flex items-center justify-center gap-2">
                    {SPOTLIGHT_GALLERY.map((thumb, idx) => (
                      <button
                        key={thumb.id}
                        type="button"
                        onClick={() => setSpotlightIndex(idx)}
                        aria-label={`View ${thumb.title}`}
                        className={`h-11 w-11 cursor-pointer overflow-hidden rounded-lg border transition-all ${
                          idx === spotlightIndex
                            ? 'scale-105 border-[#EFE0C6] ring-2 ring-[#EFE0C6]/50'
                            : 'border-white/20 opacity-60 hover:opacity-100'
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

                  <h2 className="mt-5 font-serif text-[18px] font-semibold tracking-[0.08em] text-[#EFE0C6]">
                    {activeSpotlight.title}
                  </h2>
                  <p className="mx-auto mt-2 max-w-xs text-[12px] leading-relaxed text-[#C9D2CA]">
                    {activeSpotlight.caption}
                  </p>

                  <Link
                    to="/booking"
                    className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#EFE0C6] px-5 py-2.5 text-[11.5px] font-semibold text-[#222B23] transition-colors hover:bg-[#FAF8F5]"
                  >
                    <span>Book This Look</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </article>

              {centerBottomItem && (
                <LookCard
                  item={centerBottomItem}
                  isSaved={savedIds.includes(centerBottomItem.id)}
                  onToggleSave={(e) => toggleSave(centerBottomItem.id, e)}
                  onOpen={() => setLightboxLook(centerBottomItem)}
                />
              )}
            </div>

            {/* RIGHT COLUMN */}
            <div className="space-y-7">
              {rightItems.map((item) => (
                <LookCard
                  key={item.id}
                  item={item}
                  isSaved={savedIds.includes(item.id)}
                  onToggleSave={(e) => toggleSave(item.id, e)}
                  onOpen={() => setLightboxLook(item)}
                />
              ))}
            </div>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="rounded-[24px] border border-[#ECE8E0] bg-[#F6F4EF] p-14 text-center">
            <Bookmark className="mx-auto h-8 w-8 text-[#6B786A]" />
            <p className="mt-3 font-serif text-2xl font-semibold text-[#2A2927]">
              No looks found for this filter
            </p>
            <button
              type="button"
              onClick={() => {
                setActiveCategory('All Looks');
                setSavedOnly(false);
                setSearchQuery('');
              }}
              className="mt-5 cursor-pointer rounded-full bg-[#4A5B4B] px-6 py-2.5 text-xs font-semibold text-[#FAF8F5]"
            >
              Show All Looks
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {filteredItems.map((item) => (
              <LookCard
                key={item.id}
                item={{ ...item, aspect: 'aspect-[4/4.2]' }}
                isSaved={savedIds.includes(item.id)}
                onToggleSave={(e) => toggleSave(item.id, e)}
                onOpen={() => setLightboxLook(item)}
              />
            ))}
          </div>
        )}
      </section>

      {/* ================= MODERN LIGHTBOX MODAL ================= */}
      {lightboxLook && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#181D18]/75 p-4 backdrop-blur-sm"
          onClick={() => setLightboxLook(null)}
        >
          <div
            className="relative grid w-full max-w-3xl grid-cols-1 overflow-hidden rounded-3xl border border-[#E5E1D8] bg-[#FAF8F5] shadow-2xl md:grid-cols-12"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setLightboxLook(null)}
              aria-label="Close preview"
              className="absolute right-4 top-4 z-10 inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-[#FAF8F5]/90 text-[#2A2927] shadow-xs transition-colors hover:bg-[#EFECE6]"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="aspect-[4/4.3] bg-[#ECE8E0] md:col-span-7 md:aspect-auto">
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
                {lightboxLook.specialist && (
                  <p className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-[#4A5B4B]">
                    <User className="h-3.5 w-3.5" />
                    <span>Styled by {lightboxLook.specialist}</span>
                  </p>
                )}
                <p className="mt-4 text-[13px] leading-relaxed text-[#6C6961]">
                  {lightboxLook.subtitle}
                </p>
              </div>

              <div className="mt-8 space-y-2.5 border-t border-[#ECE8E0] pt-5">
                <Link
                  to="/booking"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#4A5B4B] px-5 py-3 text-xs font-semibold tracking-wide text-[#FAF8F5] transition-colors hover:bg-[#3B4A3C]"
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

function LookCard({ item, isSaved, onToggleSave, onOpen }) {
  return (
    <article
      onClick={onOpen}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onOpen();
      }}
      className={`group relative block w-full cursor-pointer overflow-hidden rounded-[24px] bg-[#ECE8E0] text-left shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-xl ${item.aspect}`}
    >
      <img
        src={item.image}
        alt={item.title}
        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#181D18]/80 via-[#181D18]/15 to-transparent" />

      {/* Top Floating Category + Save Button */}
      <span className="absolute left-4 top-4 rounded-full bg-[#FAF8F5]/90 px-3 py-1 text-[10px] font-semibold tracking-wide text-[#2A2927] backdrop-blur-xs">
        {item.category}
      </span>

      <button
        type="button"
        onClick={onToggleSave}
        aria-label={isSaved ? 'Remove from saved looks' : 'Save look'}
        className={`absolute right-4 top-4 inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full backdrop-blur-xs transition-all ${
          isSaved
            ? 'bg-[#EFE0C6] text-[#222B23]'
            : 'bg-[#181D18]/45 text-[#FAF8F5] hover:bg-[#FAF8F5] hover:text-[#2A2927]'
        }`}
      >
        <Heart className={`h-3.5 w-3.5 ${isSaved ? 'fill-current' : ''}`} />
      </button>

      {/* Bottom Editorial Caption */}
      <div className="absolute inset-x-0 bottom-0 p-5 text-[#FAF8F5]">
        <p className="font-serif text-[20px] font-semibold leading-snug">
          {item.title}
        </p>
        <p className="mt-1 text-[11.5px] text-[#EFE0C6]">
          By {item.specialist}
        </p>
      </div>
    </article>
  );
}
