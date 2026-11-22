import { useMemo, useState } from 'react';
import {
  AlignLeft,
  Calendar,
  Check,
  Leaf,
  ListFilter,
  Mail,
  MapPin,
  Phone,
  Send,
  SlidersHorizontal,
  Users,
} from 'lucide-react';

import bridalHero from '../../assets/bridal-hero.jpg';
import bridalKandyan from '../../assets/bridal-kandyan.jpg';
import ritualBridal from '../../assets/ritual-bridal.jpg';
import bridalPrep from '../../assets/bridal-prep.jpg';

const FILTER_TABS = [
  { id: 'all', label: 'All Inquiries', count: 12 },
  { id: 'new', label: 'New Requests', badgeCount: 4 },
  { id: 'trial', label: 'Trial Scheduled' },
  { id: 'confirmed', label: 'Confirmed Weddings' },
  { id: 'completed', label: 'Completed' },
];

const INITIAL_INQUIRIES = [
  {
    id: 'inq-natasha',
    refCode: '#VB-2024-892',
    name: 'Natasha Senaratne',
    email: 'natasha.s@gmail.com',
    phone: '+94 77 345 6789',
    avatar: bridalHero,
    statusKey: 'new',
    statusBadge: 'New Request',
    headerBadge: 'New Inquiry',
    badgeClass: 'bg-[#DFE4DF] text-[#4A5B4B]',
    date: 'December 14, 2024',
    venue: 'Shangri-La Hotel, Colombo',
    packageLabel: 'COMPLETE BRIDAL SANCTUARY',
    styleNotes:
      '"Want an ethereal bohemian braid with fresh white jasmine accents, dewy glass-skin makeup for outdoor sunset ceremony at Shangri-La Colombo."',
    organicRequested: true,
    bridalParty: '8 Bridesmaids',
    mothersFamily: '2 Mothers',
    addons: [
      { id: 'trial', label: 'Bridal Trial Session', checked: true, price: 0 },
      {
        id: 'airbrush',
        label: 'Airbrush Makeup Upgrade',
        checked: true,
        price: 0,
      },
      {
        id: 'florals',
        label: 'Fresh Floral Accents (Jasmine)',
        checked: true,
        price: 0,
      },
      {
        id: 'draping',
        label: 'On-Location Draping (Colombo)',
        checked: true,
        price: 0,
      },
      {
        id: 'fragrance',
        label: 'Luxury Bridal Fragrance Kit',
        checked: false,
        price: 12000,
      },
      { id: 'groom', label: 'Groom Touch-Up Bar', checked: true, price: 0 },
    ],
    breakdown: [
      {
        label: 'Complete Bridal Sanctuary Package (Base)',
        amount: 240000,
      },
      {
        label: 'Additional Bridesmaids (8 pax x LKR 6,500)',
        amount: 52000,
      },
      {
        label: 'Travel & On-Location Fee (Shangri-La Colombo)',
        amount: 15000,
      },
      {
        label: 'Seasonal Sanctuary Courtesy Discount',
        amount: -22000,
      },
    ],
  },
  {
    id: 'inq-maya',
    refCode: '#VB-2025-104',
    name: 'Maya Alwis',
    email: 'maya.alwis@example.lk',
    phone: '+94 77 889 2314',
    avatar: bridalKandyan,
    statusKey: 'trial',
    statusBadge: 'Trial Booked',
    headerBadge: 'Trial Scheduled',
    badgeClass: 'bg-[#EFE0C6] text-[#7A6444]',
    date: 'January 22, 2025',
    venue: 'Cinnamon Grand, Colombo',
    packageLabel: 'CLASSIC WEDDING DAY',
    styleNotes:
      '"Classic Kandyan osariya draping with traditional gold jewelry, luminous soft matte skin finish, and fresh jasmine garlands."',
    organicRequested: true,
    bridalParty: '5 Bridesmaids',
    mothersFamily: '2 Mothers',
    addons: [
      { id: 'trial', label: 'Bridal Trial Session', checked: true, price: 0 },
      {
        id: 'airbrush',
        label: 'Airbrush Makeup Upgrade',
        checked: true,
        price: 0,
      },
      {
        id: 'florals',
        label: 'Fresh Floral Accents (Jasmine)',
        checked: true,
        price: 0,
      },
      {
        id: 'draping',
        label: 'On-Location Draping (Colombo)',
        checked: true,
        price: 0,
      },
      {
        id: 'fragrance',
        label: 'Luxury Bridal Fragrance Kit',
        checked: false,
        price: 12000,
      },
      { id: 'groom', label: 'Groom Touch-Up Bar', checked: false, price: 8000 },
    ],
    breakdown: [
      { label: 'Classic Wedding Day Package (Base)', amount: 155000 },
      { label: 'Additional Bridesmaids (5 pax x LKR 6,500)', amount: 32500 },
      { label: 'Travel & On-Location Fee (Cinnamon Grand)', amount: 12500 },
      { label: 'Early Booking Courtesy Discount', amount: -5000 },
    ],
  },
  {
    id: 'inq-aanya',
    refCode: '#VB-2025-119',
    name: 'Aanya & Rohan',
    email: 'aanya.rohan@example.lk',
    phone: '+94 76 543 9810',
    avatar: ritualBridal,
    statusKey: 'confirmed',
    statusBadge: 'Confirmed',
    headerBadge: 'Confirmed Wedding',
    badgeClass: 'bg-[#D5E8D7] text-[#355A3A]',
    date: 'February 10, 2025',
    venue: 'The Galle Face Hotel',
    packageLabel: 'ENGAGEMENT RADIANCE',
    styleNotes:
      '"Soft coastal waves with pearl hair pins, effortless dewy complexion for oceanfront golden hour portraits."',
    organicRequested: true,
    bridalParty: '3 Bridesmaids',
    mothersFamily: '1 Mother',
    addons: [
      { id: 'trial', label: 'Bridal Trial Session', checked: true, price: 0 },
      {
        id: 'airbrush',
        label: 'Airbrush Makeup Upgrade',
        checked: false,
        price: 10000,
      },
      {
        id: 'florals',
        label: 'Fresh Floral Accents (Jasmine)',
        checked: true,
        price: 0,
      },
      {
        id: 'draping',
        label: 'On-Location Draping (Colombo)',
        checked: true,
        price: 0,
      },
      {
        id: 'fragrance',
        label: 'Luxury Bridal Fragrance Kit',
        checked: false,
        price: 12000,
      },
      { id: 'groom', label: 'Groom Touch-Up Bar', checked: true, price: 0 },
    ],
    breakdown: [
      { label: 'Engagement Radiance Package (Base)', amount: 115000 },
      { label: 'Additional Bridesmaids (3 pax x LKR 6,500)', amount: 19500 },
      { label: 'Travel & On-Location Fee (Galle Face Hotel)', amount: 10500 },
    ],
  },
  {
    id: 'inq-priya',
    refCode: '#VB-2025-142',
    name: 'Priya Dilshan',
    email: 'priya.dilshan@example.lk',
    phone: '+94 71 229 4560',
    avatar: bridalPrep,
    statusKey: 'new',
    statusBadge: 'New Request',
    headerBadge: 'New Inquiry',
    badgeClass: 'bg-[#DFE4DF] text-[#4A5B4B]',
    date: 'March 05, 2025',
    venue: "Water's Edge, Battaramulla",
    packageLabel: 'COMPLETE BRIDAL SANCTUARY',
    styleNotes:
      '"Two-day Poruwa and reception styling with pre-bridal organic glow facials and dedicated touch-up artist on site."',
    organicRequested: true,
    bridalParty: '8 Bridesmaids',
    mothersFamily: '2 Mothers',
    addons: [
      { id: 'trial', label: 'Bridal Trial Session', checked: true, price: 0 },
      {
        id: 'airbrush',
        label: 'Airbrush Makeup Upgrade',
        checked: true,
        price: 0,
      },
      {
        id: 'florals',
        label: 'Fresh Floral Accents (Jasmine)',
        checked: true,
        price: 0,
      },
      {
        id: 'draping',
        label: 'On-Location Draping (Colombo)',
        checked: true,
        price: 0,
      },
      {
        id: 'fragrance',
        label: 'Luxury Bridal Fragrance Kit',
        checked: false,
        price: 12000,
      },
      { id: 'groom', label: 'Groom Touch-Up Bar', checked: true, price: 0 },
    ],
    breakdown: [
      { label: 'Complete Bridal Sanctuary Package (Base)', amount: 240000 },
      { label: 'Additional Bridesmaids (8 pax x LKR 6,500)', amount: 52000 },
      { label: "Travel & On-Location Fee (Water's Edge)", amount: 15000 },
      { label: 'Seasonal Sanctuary Courtesy Discount', amount: -22000 },
    ],
  },
];

function computeTotal(inquiry) {
  const baseSum = inquiry.breakdown.reduce((sum, line) => sum + line.amount, 0);
  const extraAddons = inquiry.addons.reduce(
    (sum, addon) => sum + (addon.checked ? addon.price : 0),
    0
  );
  return baseSum + extraAddons;
}

export default function BridalInquiriesPage() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [inquiries, setInquiries] = useState(INITIAL_INQUIRIES);
  const [selectedId, setSelectedId] = useState('inq-natasha');
  const [quoteSentId, setQuoteSentId] = useState(null);

  const filteredInquiries = useMemo(() => {
    if (activeFilter === 'all') return inquiries;
    return inquiries.filter((inq) => inq.statusKey === activeFilter);
  }, [activeFilter, inquiries]);

  const activeInquiry = useMemo(() => {
    return (
      inquiries.find((i) => i.id === selectedId) ||
      filteredInquiries[0] ||
      inquiries[0]
    );
  }, [inquiries, selectedId, filteredInquiries]);

  const toggleAddon = (inquiryId, addonId) => {
    setInquiries((prev) =>
      prev.map((inq) =>
        inq.id === inquiryId
          ? {
              ...inq,
              addons: inq.addons.map((a) =>
                a.id === addonId ? { ...a, checked: !a.checked } : a
              ),
            }
          : inq
      )
    );
  };

  const handleSendQuote = (inquiryId) => {
    setQuoteSentId(inquiryId);
    setTimeout(() => setQuoteSentId(null), 2600);
  };

  const activeTotal = computeTotal(activeInquiry);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* ================= TOP FILTER BAR ================= */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#ECE8E0] pb-5">
        <div className="flex flex-wrap items-center gap-2.5">
          {FILTER_TABS.map((tab) => {
            const isActive = activeFilter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveFilter(tab.id)}
                className={`inline-flex cursor-pointer items-center gap-2 rounded-lg px-4 py-2 text-[12px] font-medium transition-colors ${
                  isActive
                    ? 'bg-[#4A5B4B] text-[#FAF8F5] shadow-xs'
                    : 'bg-[#F2EFE9] text-[#4A4741] hover:bg-[#E7E4DD]'
                }`}
              >
                <span>{tab.label}</span>
                {tab.count && (
                  <span
                    className={`text-[11px] ${
                      isActive ? 'text-[#DCE5DD]' : 'text-[#8A867E]'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
                {tab.badgeCount && (
                  <span className="inline-flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#C82333] px-1 text-[10px] font-semibold text-white">
                    {tab.badgeCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="inline-flex items-center gap-1.5 text-[11.5px] text-[#7A766E]">
          <ListFilter className="h-3.5 w-3.5" />
          <span>Sorting by Wedding Date</span>
        </div>
      </div>

      {/* ================= 2-COLUMN INQUIRY WORKSPACE ================= */}
      <div className="grid grid-cols-1 items-start gap-7 xl:grid-cols-12">
        {/* LEFT COLUMN: Active Inquiries Queue */}
        <section className="space-y-4 xl:col-span-4">
          <div className="flex items-baseline justify-between">
            <h1 className="font-serif text-[18px] font-semibold text-[#2A2927]">
              Active Inquiries
            </h1>
            <span className="text-[10px] font-semibold tracking-[0.18em] text-[#8A867E] uppercase">
              {filteredInquiries.length} Queued
            </span>
          </div>

          {filteredInquiries.length === 0 ? (
            <div className="rounded-2xl border border-[#ECE8E0] bg-[#F5F3EE] p-6 text-center text-xs text-[#7A766E]">
              No inquiries in this stage yet.
            </div>
          ) : (
            <div className="space-y-3.5">
              {filteredInquiries.map((inq) => {
                const isSelected = inq.id === activeInquiry.id;
                const total = computeTotal(inq);

                return (
                  <button
                    key={inq.id}
                    type="button"
                    onClick={() => setSelectedId(inq.id)}
                    className={`block w-full cursor-pointer rounded-2xl border p-5 text-left transition-all ${
                      isSelected
                        ? 'border-[#DCD7CC] border-l-[3.5px] border-l-[#4A5B4B] bg-[#F2EFE9] shadow-md'
                        : 'border-[#ECE8E0] bg-[#F4F2ED] hover:border-[#D8D3C8]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <h2 className="font-serif text-[17px] font-semibold text-[#2A2927]">
                        {inq.name}
                      </h2>
                      <span
                        className={`shrink-0 rounded-md px-2.5 py-0.5 text-[10px] font-semibold ${inq.badgeClass}`}
                      >
                        {inq.statusBadge}
                      </span>
                    </div>

                    <div className="mt-2.5 space-y-1 text-[11.5px] text-[#6C6961]">
                      <p className="flex items-center gap-2">
                        <Calendar className="h-3.5 w-3.5 text-[#6B786A]" />
                        <span>{inq.date}</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <MapPin className="h-3.5 w-3.5 text-[#6B786A]" />
                        <span>{inq.venue}</span>
                      </p>
                    </div>

                    <div className="mt-4 flex items-baseline justify-between gap-2 border-t border-[#E6E2DA] pt-3">
                      <span className="truncate text-[9.5px] font-semibold tracking-[0.14em] text-[#7A766E] uppercase">
                        {inq.packageLabel}
                      </span>
                      <span className="shrink-0 font-serif text-[15px] font-semibold text-[#2A2927]">
                        LKR {total.toLocaleString('en-US')}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </section>

        {/* RIGHT COLUMN: Selected Inquiry Detail & Quote Builder */}
        <section className="space-y-5 xl:col-span-8">
          {/* 1. Client Header Card */}
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#ECE8E0] bg-[#FAF8F5] p-5 shadow-2xs">
            <div className="flex items-center gap-4">
              <img
                src={activeInquiry.avatar}
                alt={activeInquiry.name}
                className="h-14 w-14 rounded-xl border border-[#E5E1D8] object-cover"
              />
              <div>
                <div className="flex flex-wrap items-center gap-2.5">
                  <h2 className="font-serif text-[20px] font-semibold text-[#2A2927]">
                    {activeInquiry.name}
                  </h2>
                  <span className="rounded-full bg-[#4A5B4B] px-2.5 py-0.5 text-[10px] font-medium text-[#FAF8F5]">
                    {activeInquiry.headerBadge}
                  </span>
                </div>
                <div className="mt-1.5 flex flex-wrap items-center gap-4 text-[11.5px] text-[#6C6961]">
                  <span className="inline-flex items-center gap-1.5">
                    <Mail className="h-3 w-3 text-[#6B786A]" />
                    {activeInquiry.email}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Phone className="h-3 w-3 text-[#6B786A]" />
                    {activeInquiry.phone}
                  </span>
                </div>
              </div>
            </div>

            <div className="text-left sm:text-right">
              <p className="text-[9.5px] font-semibold tracking-[0.18em] text-[#8A867E] uppercase">
                Inquiry Ref
              </p>
              <p className="mt-0.5 font-serif text-[15px] font-semibold text-[#2A2927]">
                {activeInquiry.refCode}
              </p>
            </div>
          </div>

          {/* 2. Style Notes + Party Headcount */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {/* Submitted Style Notes */}
            <article className="flex flex-col justify-between rounded-2xl border border-[#ECE8E0] bg-[#FAF8F5] p-5 shadow-2xs">
              <div>
                <div className="flex items-center gap-2 text-[#2A2927]">
                  <AlignLeft className="h-4 w-4 text-[#4A5B4B]" />
                  <h3 className="font-serif text-[16px] font-semibold">
                    Submitted Style Notes
                  </h3>
                </div>
                <p className="mt-3 font-serif text-[14.5px] italic leading-relaxed text-[#4A4741]">
                  {activeInquiry.styleNotes}
                </p>
              </div>

              {activeInquiry.organicRequested && (
                <p className="mt-4 inline-flex items-center gap-1.5 text-[11px] font-medium text-[#6B786A]">
                  <Leaf className="h-3.5 w-3.5" />
                  <span>Organic products requested</span>
                </p>
              )}
            </article>

            {/* Party Headcount */}
            <article className="rounded-2xl border border-[#ECE8E0] bg-[#FAF8F5] p-5 shadow-2xs">
              <div className="flex items-center gap-2 text-[#2A2927]">
                <Users className="h-4 w-4 text-[#4A5B4B]" />
                <h3 className="font-serif text-[16px] font-semibold">
                  Party Headcount
                </h3>
              </div>

              <div className="mt-4 space-y-3.5 text-[12.5px]">
                <div className="flex items-center justify-between">
                  <span className="text-[#6C6961]">Bridal Party</span>
                  <span className="rounded-lg bg-[#F2EFE9] px-3 py-1 font-semibold text-[#2A2927]">
                    {activeInquiry.bridalParty}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#6C6961]">Mothers / Family</span>
                  <span className="rounded-lg bg-[#F2EFE9] px-3 py-1 font-semibold text-[#2A2927]">
                    {activeInquiry.mothersFamily}
                  </span>
                </div>
              </div>
            </article>
          </div>

          {/* 3. Service & Trial Customization */}
          <article className="rounded-2xl border border-[#ECE8E0] bg-[#FAF8F5] p-5 shadow-2xs">
            <div className="flex items-center gap-2 text-[#2A2927]">
              <SlidersHorizontal className="h-4 w-4 text-[#4A5B4B]" />
              <h3 className="font-serif text-[16px] font-semibold">
                Service &amp; Trial Customization
              </h3>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {activeInquiry.addons.map((addon) => (
                <label
                  key={addon.id}
                  className="flex cursor-pointer items-center gap-3 rounded-xl bg-[#F2EFE9] px-4 py-3 text-[12.5px] font-medium text-[#2A2927] transition-colors hover:bg-[#EAE6DE]"
                >
                  <input
                    type="checkbox"
                    checked={addon.checked}
                    onChange={() => toggleAddon(activeInquiry.id, addon.id)}
                    className="h-4 w-4 accent-[#4A5B4B]"
                  />
                  <span className="flex-1">{addon.label}</span>
                  {addon.price > 0 && (
                    <span className="text-[10.5px] text-[#7A766E]">
                      +LKR {addon.price.toLocaleString('en-US')}
                    </span>
                  )}
                </label>
              ))}
            </div>
          </article>

          {/* 4. Quote Calculation Breakdown */}
          <article className="rounded-2xl border border-[#ECE8E0] bg-[#FAF8F5] p-6 shadow-2xs">
            <h3 className="font-serif text-[17px] font-semibold text-[#2A2927]">
              Quote Calculation Breakdown
            </h3>

            <div className="mt-4 space-y-2.5 text-[12.5px]">
              {activeInquiry.breakdown.map((line) => (
                <div
                  key={line.label}
                  className="flex items-center justify-between gap-4"
                >
                  <span className="text-[#57544E]">{line.label}</span>
                  <span
                    className={`shrink-0 font-semibold ${
                      line.amount < 0 ? 'text-[#B64B42]' : 'text-[#2A2927]'
                    }`}
                  >
                    {line.amount < 0
                      ? `- LKR ${Math.abs(line.amount).toLocaleString('en-US')}`
                      : `LKR ${line.amount.toLocaleString('en-US')}`}
                  </span>
                </div>
              ))}

              {activeInquiry.addons
                .filter((a) => a.checked && a.price > 0)
                .map((addon) => (
                  <div
                    key={addon.id}
                    className="flex items-center justify-between gap-4"
                  >
                    <span className="text-[#57544E]">{addon.label}</span>
                    <span className="shrink-0 font-semibold text-[#2A2927]">
                      LKR {addon.price.toLocaleString('en-US')}
                    </span>
                  </div>
                ))}
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-[#ECE8E0] pt-4">
              <div>
                <p className="text-[10.5px] font-semibold tracking-[0.16em] text-[#8A867E] uppercase">
                  Estimated Quote Total
                </p>
                <p className="font-serif text-2xl font-semibold text-[#2A2927]">
                  LKR {activeTotal.toLocaleString('en-US')}
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleSendQuote(activeInquiry.id)}
                className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-[#4A5B4B] px-5 py-2.5 text-[12px] font-medium tracking-wide text-[#FAF8F5] shadow-xs transition-colors hover:bg-[#3B4A3C]"
              >
                {quoteSentId === activeInquiry.id ? (
                  <>
                    <Check className="h-3.5 w-3.5" />
                    <span>Quote Sent to Bride</span>
                  </>
                ) : (
                  <>
                    <Send className="h-3.5 w-3.5" />
                    <span>Send Official Quote</span>
                  </>
                )}
              </button>
            </div>
          </article>
        </section>
      </div>
    </div>
  );
}
