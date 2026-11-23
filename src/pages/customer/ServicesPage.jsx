import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  ArrowRight,
  Check,
  Clock,
  Flower2,
  Plus,
  Search,
  Sparkles,
  X,
} from 'lucide-react';
import {
  ALL_SERVICES,
  SERVICE_CATEGORIES,
  formatLKR,
} from '../../data/servicesData';
import { fetchServices } from '../../services/salonService';

import ritualHair from '../../assets/ritual-hair.jpg';
import ritualSkin from '../../assets/ritual-skin.jpg';
import ritualBridal from '../../assets/ritual-bridal.jpg';
import heroPortrait from '../../assets/hero-portrait.jpg';
import bridalPrep from '../../assets/bridal-prep.jpg';

const CATEGORY_IMAGES = {
  hair: ritualHair,
  facials: ritualSkin,
  nails: heroPortrait,
  bridal: ritualBridal,
  waxing: bridalPrep,
};

const RITUAL_TO_CATEGORY = {
  'organic-hair-couture': 'hair',
  'botanical-skin-therapy': 'facials',
  'bridal-artistry': 'bridal',
};

export default function ServicesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const initialCategory = useMemo(() => {
    const cat = searchParams.get('category');
    if (cat && SERVICE_CATEGORIES.some((c) => c.id === cat)) return cat;
    const ritual = searchParams.get('ritual');
    if (ritual && RITUAL_TO_CATEGORY[ritual]) return RITUAL_TO_CATEGORY[ritual];
    return 'all';
  }, [searchParams]);

  const [categories, setCategories] = useState(SERVICE_CATEGORIES);
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');

  // Pre-select the two signature rituals so the summary card is immediately populated
  const [selectedIds, setSelectedIds] = useState([
    'organic-botanical-hair-glossing',
    'cell-renewal-botanical-facial',
  ]);

  useEffect(() => {
    let active = true;
    fetchServices().then(({ data }) => {
      if (!active || !Array.isArray(data) || data.length === 0) return;
      const online = data.filter((s) => s.online_booking !== false);
      if (online.length === 0) return;
      const grouped = SERVICE_CATEGORIES.map((cat) => ({
        ...cat,
        items: online
          .filter((s) => s.category_id === cat.id)
          .map((s) => ({
            id: s.slug || s.id,
            name: s.name,
            badge: s.badge,
            description: s.description,
            duration: s.duration_mins,
            price: s.price_lkr,
          })),
      })).filter((cat) => cat.items.length > 0);
      if (grouped.length > 0) setCategories(grouped);
    });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    setActiveCategory(initialCategory);
  }, [initialCategory]);

  const handleCategoryChange = (categoryId) => {
    setActiveCategory(categoryId);
    if (categoryId === 'all') {
      setSearchParams({});
    } else {
      setSearchParams({ category: categoryId });
    }
  };

  const toggleService = (serviceId) => {
    setSelectedIds((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const removeService = (serviceId) => {
    setSelectedIds((prev) => prev.filter((id) => id !== serviceId));
  };

  const visibleCategories = useMemo(() => {
    const base =
      activeCategory === 'all'
        ? categories
        : categories.filter((cat) => cat.id === activeCategory);

    const q = searchQuery.trim().toLowerCase();
    if (!q) return base;

    return base
      .map((cat) => ({
        ...cat,
        items: cat.items.filter(
          (item) =>
            item.name.toLowerCase().includes(q) ||
            item.description.toLowerCase().includes(q) ||
            cat.name.toLowerCase().includes(q)
        ),
      }))
      .filter((cat) => cat.items.length > 0);
  }, [activeCategory, categories, searchQuery]);

  const flatServices = useMemo(
    () =>
      categories.flatMap((cat) =>
        cat.items.map((item) => ({
          ...item,
          categoryId: cat.id,
          categoryName: cat.name,
        }))
      ),
    [categories]
  );

  const selectedServices = useMemo(
    () =>
      (flatServices.length ? flatServices : ALL_SERVICES).filter((svc) =>
        selectedIds.includes(svc.id)
      ),
    [selectedIds, flatServices]
  );

  const totalDuration = useMemo(
    () => selectedServices.reduce((sum, svc) => sum + svc.duration, 0),
    [selectedServices]
  );

  const estimatedTotal = useMemo(
    () => selectedServices.reduce((sum, svc) => sum + svc.price, 0),
    [selectedServices]
  );

  const blossomsEarned = Math.round(estimatedTotal / 100);

  const handleProceedToBooking = () => {
    navigate('/booking', {
      state: {
        selectedServices,
        totalDuration,
        estimatedTotal,
      },
    });
  };

  return (
    <div className="bg-[#FAF8F5] pb-24">
      {/* ================= EDITORIAL DARK-SAGE HERO BANNER ================= */}
      <section className="relative overflow-hidden bg-[#222B23] text-[#FAF8F5]">
        <img
          src={ritualHair}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-22"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#1D251E]/80 via-[#222B23]/88 to-[#222B23]" />

        <div className="relative z-10 mx-auto max-w-5xl px-6 py-16 text-center lg:px-10 lg:py-20">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#EFE0C6]/30 bg-[#EFE0C6]/15 px-4 py-1.5 text-[10px] font-semibold tracking-[0.24em] text-[#EFE0C6] uppercase backdrop-blur-xs">
            <Sparkles className="h-3 w-3" />
            Botanical Sanctuary &bull; Curated Menu
          </span>

          <h1 className="mt-5 font-serif text-4xl font-medium tracking-tight text-[#FAF8F5] sm:text-5xl lg:text-[56px]">
            Our Botanical <span className="italic text-[#EFE0C6]">Menu</span>
          </h1>

          <p className="mx-auto mt-3.5 max-w-xl text-[14px] leading-relaxed text-[#C9D2CA]">
            Curated hair, skin, and body rituals formulated with cold-pressed
            organic botanicals and tailored to your natural essence.
          </p>

          {/* Search Input Bar */}
          <div className="mx-auto mt-8 max-w-md">
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#A8B4A9]" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search rituals, botanicals, or treatments..."
                className="w-full rounded-full border border-white/20 bg-white/10 py-3 pl-11 pr-5 text-[13px] text-[#FAF8F5] placeholder:text-[#A8B4A9] backdrop-blur-md transition-colors focus:border-[#EFE0C6] focus:bg-white/15 focus:outline-none"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ================= STICKY CATEGORY FILTER PILLS ================= */}
      <div className="sticky top-[68px] z-30 border-b border-[#E6E2DA] bg-[#FAF8F5]/92 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center gap-2 overflow-x-auto px-6 py-4 lg:px-10">
          <button
            type="button"
            onClick={() => handleCategoryChange('all')}
            className={`inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-full px-4 py-2 text-[12px] font-medium transition-all ${
              activeCategory === 'all'
                ? 'bg-[#4A5B4B] text-[#FAF8F5] shadow-xs'
                : 'border border-[#E6E2DA] bg-[#F3F0EA] text-[#57544E] hover:bg-[#EAE6DE]'
            }`}
          >
            <span>All Treatments</span>
            <span
              className={`rounded-full px-1.5 py-0.5 text-[10px] ${
                activeCategory === 'all'
                  ? 'bg-white/20 text-[#FAF8F5]'
                  : 'bg-[#E5E1D8] text-[#6C6961]'
              }`}
            >
              {flatServices.length}
            </span>
          </button>

          {categories.map((category) => {
            const active = activeCategory === category.id;
            return (
              <button
                key={category.id}
                type="button"
                onClick={() => handleCategoryChange(category.id)}
                className={`inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-full px-4 py-2 text-[12px] font-medium transition-all ${
                  active
                    ? 'bg-[#4A5B4B] text-[#FAF8F5] shadow-xs'
                    : 'border border-[#E6E2DA] bg-[#F3F0EA] text-[#57544E] hover:bg-[#EAE6DE]'
                }`}
              >
                <span>{category.name}</span>
                <span
                  className={`rounded-full px-1.5 py-0.5 text-[10px] ${
                    active
                      ? 'bg-white/20 text-[#FAF8F5]'
                      : 'bg-[#E5E1D8] text-[#6C6961]'
                  }`}
                >
                  {category.items.length}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ================= MENU + STICKY DARK-SAGE SUMMARY ================= */}
      <section className="mx-auto max-w-7xl px-6 pt-12 lg:px-10">
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12">
          {/* Left Column: Service Categories */}
          <div className="space-y-14 lg:col-span-8">
            {visibleCategories.length === 0 ? (
              <div className="rounded-2xl border border-[#ECE8E0] bg-[#F6F4EF] p-12 text-center">
                <p className="font-serif text-xl font-semibold text-[#2A2927]">
                  No rituals matched &ldquo;{searchQuery}&rdquo;
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    handleCategoryChange('all');
                  }}
                  className="mt-4 cursor-pointer rounded-full bg-[#4A5B4B] px-5 py-2 text-xs font-medium text-[#FAF8F5]"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              visibleCategories.map((category) => (
                <div key={category.id}>
                  {/* Category Heading Row */}
                  <div className="mb-5 flex items-end justify-between border-b border-[#ECE8E0] pb-3.5">
                    <div>
                      <span className="text-[10px] font-semibold tracking-[0.22em] text-[#6B786A] uppercase">
                        {category.number} / Rituals
                      </span>
                      <h2 className="mt-0.5 font-serif text-[28px] font-semibold text-[#2A2927]">
                        {category.name}
                      </h2>
                    </div>
                    <span className="text-xs text-[#8A867E]">
                      {category.items.length}{' '}
                      {category.items.length === 1 ? 'treatment' : 'treatments'}
                    </span>
                  </div>

                  {/* Modern Ritual Cards */}
                  <div className="space-y-4">
                    {category.items.map((service) => {
                      const isAdded = selectedIds.includes(service.id);
                      const thumb =
                        CATEGORY_IMAGES[category.id] || ritualHair;

                      return (
                        <article
                          key={service.id}
                          className={`group flex flex-col justify-between gap-5 rounded-2xl border p-5 transition-all duration-300 sm:flex-row sm:items-center ${
                            isAdded
                              ? 'border-[#4A5B4B] bg-[#F2F6F2] shadow-sm'
                              : 'border-[#ECE8E0] bg-[#FAF8F5] hover:-translate-y-0.5 hover:border-[#D6D1C6] hover:shadow-md'
                          }`}
                        >
                          {/* Left: Thumbnail + Details */}
                          <div className="flex items-start gap-4">
                            <div className="hidden h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-[#E5E1D8] bg-[#EAE6DE] sm:block">
                              <img
                                src={thumb}
                                alt={service.name}
                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                              />
                            </div>

                            <div className="max-w-lg">
                              <div className="flex flex-wrap items-center gap-2">
                                <h3 className="font-serif text-[19px] font-semibold text-[#2A2927]">
                                  {service.name}
                                </h3>
                                {service.badge && (
                                  <span className="rounded-full bg-[#EFE0C6] px-2.5 py-0.5 text-[10px] font-semibold tracking-wide text-[#7A6444]">
                                    {service.badge}
                                  </span>
                                )}
                              </div>

                              <p className="mt-1.5 text-[12.5px] leading-[1.7] text-[#6C6961]">
                                {service.description}
                              </p>

                              <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-[#F2EFE9] px-2.5 py-1 text-[11px] font-medium text-[#5F5C55]">
                                <Clock
                                  className="h-3 w-3 text-[#4A5B4B]"
                                  strokeWidth={1.8}
                                />
                                <span>{service.duration} mins</span>
                              </div>
                            </div>
                          </div>

                          {/* Right: Price + Pill Toggle */}
                          <div className="flex shrink-0 items-center justify-between gap-4 border-t border-[#ECE8E0] pt-4 sm:flex-col sm:items-end sm:justify-center sm:gap-2.5 sm:border-t-0 sm:pt-0">
                            <p className="font-serif text-[21px] font-semibold text-[#2A2927]">
                              {formatLKR(service.price)}
                            </p>

                            <button
                              type="button"
                              onClick={() => toggleService(service.id)}
                              className={`inline-flex min-w-[104px] cursor-pointer items-center justify-center gap-1.5 rounded-full px-4 py-2 text-[12px] font-medium transition-all ${
                                isAdded
                                  ? 'bg-[#4A5B4B] text-[#FAF8F5] shadow-xs hover:bg-[#3B4A3C]'
                                  : 'border border-[#4A5B4B] bg-transparent text-[#4A5B4B] hover:bg-[#4A5B4B] hover:text-[#FAF8F5]'
                              }`}
                            >
                              {isAdded ? (
                                <>
                                  <Check className="h-3.5 w-3.5" strokeWidth={2.2} />
                                  <span>Added</span>
                                </>
                              ) : (
                                <>
                                  <Plus className="h-3.5 w-3.5" strokeWidth={2.2} />
                                  <span>Add Ritual</span>
                                </>
                              )}
                            </button>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Right Column: Modern Dark-Sage Sticky Ritual Summary */}
          <aside className="lg:sticky lg:top-36 lg:col-span-4">
            <div className="relative overflow-hidden rounded-[26px] bg-[#253026] p-7 text-[#FAF8F5] shadow-2xl">
              {/* Subtle Warm Ambient Glow */}
              <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-[#EFE0C6]/15 blur-2xl" />

              <div className="relative z-10">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-white/15 pb-4">
                  <div>
                    <p className="text-[9.5px] font-semibold tracking-[0.22em] text-[#EFE0C6] uppercase">
                      Bespoke Selection
                    </p>
                    <h2 className="mt-1 font-serif text-[22px] font-medium text-[#FAF8F5]">
                      Your Ritual Summary
                    </h2>
                  </div>
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-[#EFE0C6]">
                    <Flower2 className="h-4 w-4" strokeWidth={1.6} />
                  </span>
                </div>

                {/* Selected Items List */}
                <div className="min-h-[120px] py-5">
                  {selectedServices.length === 0 ? (
                    <p className="py-6 text-center text-[12.5px] leading-relaxed text-[#A8B4A9]">
                      Select rituals from our botanical menu to begin crafting
                      your visit.
                    </p>
                  ) : (
                    <ul className="space-y-4">
                      {selectedServices.map((svc) => (
                        <li
                          key={svc.id}
                          className="flex items-start justify-between gap-3 rounded-xl bg-white/6 px-3.5 py-3"
                        >
                          <div>
                            <p className="text-[13px] font-medium leading-snug text-[#FAF8F5]">
                              {svc.name}
                            </p>
                            <p className="mt-0.5 text-[11px] text-[#A8B4A9]">
                              {svc.duration} mins
                            </p>
                          </div>

                          <div className="flex shrink-0 items-center gap-2">
                            <span className="text-[12.5px] font-semibold text-[#EFE0C6]">
                              {formatLKR(svc.price)}
                            </span>
                            <button
                              type="button"
                              onClick={() => removeService(svc.id)}
                              aria-label={`Remove ${svc.name}`}
                              className="cursor-pointer rounded-full p-1 text-[#A8B4A9] transition-colors hover:bg-white/15 hover:text-[#FAF8F5]"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Duration, Rewards & Total */}
                <div className="space-y-3 border-t border-white/15 pt-5">
                  <div className="flex items-center justify-between text-[12.5px]">
                    <span className="text-[#B9C2BA]">Total Duration</span>
                    <span className="font-semibold text-[#FAF8F5]">
                      {totalDuration} mins
                    </span>
                  </div>

                  {blossomsEarned > 0 && (
                    <div className="flex items-center justify-between text-[12px]">
                      <span className="text-[#B9C2BA]">Botanical Rewards</span>
                      <span className="font-medium text-[#EFE0C6]">
                        +{blossomsEarned} Blossoms
                      </span>
                    </div>
                  )}

                  <div className="flex items-baseline justify-between pt-2">
                    <span className="font-serif text-[18px] font-medium text-[#FAF8F5]">
                      Estimated Total
                    </span>
                    <span className="font-serif text-[24px] font-semibold text-[#EFE0C6]">
                      {formatLKR(estimatedTotal)}
                    </span>
                  </div>
                </div>

                {/* Proceed Button */}
                <button
                  type="button"
                  onClick={handleProceedToBooking}
                  disabled={selectedServices.length === 0}
                  className="mt-6 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#EFE0C6] px-5 py-3.5 text-[12.5px] font-semibold tracking-wide text-[#222B23] shadow-lg transition-all hover:bg-[#FAF8F5] disabled:cursor-not-allowed disabled:opacity-45"
                >
                  <span>Select Specialist &amp; Time</span>
                  <ArrowRight className="h-4 w-4" />
                </button>

                <p className="mt-3 text-center text-[10.5px] text-[#9AA59B]">
                  Free cancellation up to 24 hours prior
                </p>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
