import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowRight, Check, Clock, Flower2, Plus, X } from 'lucide-react';
import {
  ALL_SERVICES,
  SERVICE_CATEGORIES,
  formatLKR,
} from '../../data/servicesData';

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

  const [activeCategory, setActiveCategory] = useState(initialCategory);

  // Pre-select the two rituals shown in the design so the summary card is immediately populated
  const [selectedIds, setSelectedIds] = useState([
    'organic-botanical-hair-glossing',
    'cell-renewal-botanical-facial',
  ]);

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
    if (activeCategory === 'all') return SERVICE_CATEGORIES;
    return SERVICE_CATEGORIES.filter((cat) => cat.id === activeCategory);
  }, [activeCategory]);

  const selectedServices = useMemo(
    () => ALL_SERVICES.filter((svc) => selectedIds.includes(svc.id)),
    [selectedIds]
  );

  const totalDuration = useMemo(
    () => selectedServices.reduce((sum, svc) => sum + svc.duration, 0),
    [selectedServices]
  );

  const estimatedTotal = useMemo(
    () => selectedServices.reduce((sum, svc) => sum + svc.price, 0),
    [selectedServices]
  );

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
      {/* ================= PAGE HEADER ================= */}
      <section className="mx-auto max-w-7xl px-6 pb-8 pt-12 text-center lg:px-10 lg:pt-16">
        <p className="text-[10px] font-semibold tracking-[0.24em] text-[#6B786A] uppercase">
          Botanical Sanctuary
        </p>
        <h1 className="mt-3 font-serif text-4xl font-semibold text-[#2A2927] sm:text-[44px]">
          Our Botanical Menu
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-[13.5px] leading-relaxed text-[#6C6961]">
          Curated hair, skin, and body rituals tailored to your natural essence.
        </p>
      </section>

      {/* ================= CATEGORY FILTER TABS ================= */}
      <div className="border-b border-[#ECE8E0] bg-[#FAF8F5]">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-2.5 px-6 pb-6 pt-2 lg:px-10">
          <button
            type="button"
            onClick={() => handleCategoryChange('all')}
            className={`cursor-pointer rounded-lg px-4 py-2 text-[12px] font-medium transition-colors ${
              activeCategory === 'all'
                ? 'bg-[#4A5B4B] text-[#FAF8F5] shadow-2xs'
                : 'bg-[#EFECE6] text-[#57544E] hover:bg-[#E5E1D8]'
            }`}
          >
            All Treatments
          </button>

          {SERVICE_CATEGORIES.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => handleCategoryChange(category.id)}
              className={`cursor-pointer rounded-lg px-4 py-2 text-[12px] font-medium transition-colors ${
                activeCategory === category.id
                  ? 'bg-[#4A5B4B] text-[#FAF8F5] shadow-2xs'
                  : 'bg-[#EFECE6] text-[#57544E] hover:bg-[#E5E1D8]'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* ================= MENU + STICKY SUMMARY ================= */}
      <section className="mx-auto max-w-7xl px-6 pt-12 lg:px-10">
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12">
          {/* Left Column: Service Categories */}
          <div className="space-y-12 lg:col-span-8">
            {visibleCategories.map((category) => (
              <div key={category.id}>
                {/* Category Heading Row */}
                <div className="mb-5 flex items-baseline justify-between">
                  <h2 className="font-serif text-[26px] font-medium text-[#2A2927]">
                    {category.name}
                  </h2>
                  <span className="text-[10px] font-medium tracking-[0.2em] text-[#8A867E] uppercase">
                    {category.number} / RITUALS
                  </span>
                </div>

                {/* Ritual Cards */}
                <div className="space-y-4">
                  {category.items.map((service) => {
                    const isAdded = selectedIds.includes(service.id);

                    return (
                      <article
                        key={service.id}
                        className="flex flex-col justify-between gap-5 rounded-xl border border-[#ECE8E0] bg-[#F6F4EF] px-6 py-5 transition-colors hover:border-[#DCD7CC] sm:flex-row sm:items-center"
                      >
                        {/* Service Details */}
                        <div className="max-w-xl">
                          <div className="flex flex-wrap items-center gap-2.5">
                            <h3 className="font-serif text-[18px] font-semibold text-[#2A2927]">
                              {service.name}
                            </h3>
                            {service.badge && (
                              <span className="rounded-full bg-[#EFE0C6] px-2.5 py-0.5 text-[10px] font-semibold tracking-wide text-[#7A6444]">
                                {service.badge}
                              </span>
                            )}
                          </div>

                          <p className="mt-1.5 text-[12.5px] leading-[1.65] text-[#6C6961]">
                            {service.description}
                          </p>

                          <div className="mt-3 inline-flex items-center gap-1.5 text-[11px] text-[#8A867E]">
                            <Clock className="h-3.5 w-3.5" strokeWidth={1.6} />
                            <span>{service.duration} mins</span>
                          </div>
                        </div>

                        {/* Price + Add/Added Button */}
                        <div className="flex shrink-0 items-center justify-between gap-4 sm:flex-col sm:items-end sm:justify-center sm:gap-2.5">
                          <p className="font-serif text-[19px] font-semibold text-[#2A2927]">
                            {formatLKR(service.price)}
                          </p>

                          <button
                            type="button"
                            onClick={() => toggleService(service.id)}
                            className={`inline-flex min-w-[96px] cursor-pointer items-center justify-center gap-1.5 rounded-lg px-4 py-2 text-[12px] font-medium transition-colors ${
                              isAdded
                                ? 'bg-[#4A5B4B] text-[#FAF8F5] hover:bg-[#3B4A3C]'
                                : 'bg-[#4A5B4B] text-[#FAF8F5] hover:bg-[#3B4A3C]'
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
                                <span>Add</span>
                              </>
                            )}
                          </button>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Right Column: Sticky Ritual Summary */}
          <aside className="lg:sticky lg:top-24 lg:col-span-4">
            <div className="rounded-2xl border border-[#E5E1D8] bg-gradient-to-b from-[#F2EFE9] to-[#EEEBE4] p-7 shadow-xs">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-[#E3DFD6] pb-4">
                <h2 className="font-serif text-[21px] font-medium text-[#2A2927]">
                  Your Ritual Summary
                </h2>
                <Flower2
                  className="h-4 w-4 text-[#6B786A]"
                  strokeWidth={1.6}
                />
              </div>

              {/* Selected Items List */}
              <div className="min-h-[120px] py-5">
                {selectedServices.length === 0 ? (
                  <p className="py-6 text-center text-[12.5px] leading-relaxed text-[#8A867E]">
                    Select rituals from our botanical menu to begin crafting
                    your visit.
                  </p>
                ) : (
                  <ul className="space-y-4">
                    {selectedServices.map((svc) => (
                      <li
                        key={svc.id}
                        className="flex items-start justify-between gap-3"
                      >
                        <div>
                          <p className="text-[13px] font-semibold leading-snug text-[#2A2927]">
                            {svc.name}
                          </p>
                          <p className="mt-0.5 text-[11px] text-[#8A867E]">
                            {svc.duration} mins
                          </p>
                        </div>

                        <div className="flex shrink-0 items-center gap-2">
                          <span className="text-[12.5px] font-medium text-[#4A4741]">
                            {formatLKR(svc.price)}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeService(svc.id)}
                            aria-label={`Remove ${svc.name}`}
                            className="cursor-pointer rounded p-0.5 text-[#9A958C] transition-colors hover:bg-[#E5E1D8] hover:text-[#2A2927]"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Duration & Estimated Total */}
              <div className="space-y-3 border-t border-[#E3DFD6] pt-5">
                <div className="flex items-center justify-between text-[12.5px]">
                  <span className="text-[#6C6961]">Total Duration</span>
                  <span className="font-semibold text-[#2A2927]">
                    {totalDuration} mins
                  </span>
                </div>

                <div className="flex items-baseline justify-between">
                  <span className="font-serif text-[17px] font-medium text-[#2A2927]">
                    Estimated Total
                  </span>
                  <span className="font-serif text-[21px] font-semibold text-[#2A2927]">
                    {formatLKR(estimatedTotal)}
                  </span>
                </div>
              </div>

              {/* Proceed Button */}
              <button
                type="button"
                onClick={handleProceedToBooking}
                disabled={selectedServices.length === 0}
                className="mt-6 flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#4A5B4B] px-5 py-3.5 text-[12.5px] font-medium tracking-wide text-[#FAF8F5] shadow-xs transition-colors hover:bg-[#3B4A3C] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <span>Select Specialist &amp; Time</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>

              <p className="mt-3 text-center text-[10.5px] text-[#8A867E]">
                Free cancellation up to 24 hours prior
              </p>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
