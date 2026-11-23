import { useEffect, useMemo, useState } from 'react';
import {
  AlignLeft,
  ArrowUpDown,
  Calendar,
  CalendarCheck,
  Check,
  CheckCircle2,
  Crown,
  Leaf,
  Mail,
  MapPin,
  Phone,
  Send,
  SlidersHorizontal,
  Sparkles,
  Users,
} from 'lucide-react';
import {
  fetchBridalInquiries,
  updateBridalInquiry,
} from '../../services/salonService';

import bridalHero from '../../assets/bridal-hero.jpg';
import bridalKandyan from '../../assets/bridal-kandyan.jpg';
import ritualBridal from '../../assets/ritual-bridal.jpg';
import wallpaperBridalAtelier from '../../assets/wallpaper-bridal-atelier.jpg';

const STAGE_META = {
  new: {
    label: 'New Request',
    headerBadge: 'New Inquiry',
    pillClass: 'bg-[#E9EFEA] text-[#354B38]',
    darkPillClass: 'bg-white/12 text-[#EFE0C6]',
  },
  trial: {
    label: 'Trial Booked',
    headerBadge: 'Trial Scheduled',
    pillClass: 'bg-[#F5E6CB] text-[#7A5E34]',
    darkPillClass: 'bg-[#EFE0C6]/20 text-[#EFE0C6]',
  },
  confirmed: {
    label: 'Confirmed',
    headerBadge: 'Confirmed Wedding',
    pillClass: 'bg-[#D8ECDC] text-[#285431]',
    darkPillClass: 'bg-[#4E8B57]/30 text-[#D8F3DC]',
  },
  completed: {
    label: 'Completed',
    headerBadge: 'Completed Wedding',
    pillClass: 'bg-[#ECEAE4] text-[#57544E]',
    darkPillClass: 'bg-white/10 text-[#C9D3CA]',
  },
};

const FILTER_TABS = [
  { id: 'all', label: 'All Inquiries' },
  { id: 'new', label: 'New Requests' },
  { id: 'trial', label: 'Trial Scheduled' },
  { id: 'confirmed', label: 'Confirmed Weddings' },
  { id: 'completed', label: 'Completed' },
];

const INITIAL_INQUIRIES = [
  {
    id: 'inq-natasha',
    refCode: '#VB-2026-892',
    name: 'Natasha Senaratne',
    email: 'natasha.s@gmail.com',
    phone: '+94 77 345 6789',
    avatar: bridalHero,
    statusKey: 'new',
    date: 'December 14, 2026',
    sortDate: '2026-12-14',
    venue: 'Shangri-La Hotel, Colombo',
    packageLabel: 'COMPLETE BRIDAL SANCTUARY',
    leadArtist: 'Julian Vance & Amara Thorne',
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
        label: 'Additional Bridesmaids (8 pax × LKR 6,500)',
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
    refCode: '#VB-2027-104',
    name: 'Maya Alwis',
    email: 'maya.alwis@example.lk',
    phone: '+94 77 889 2314',
    avatar: bridalKandyan,
    statusKey: 'trial',
    date: 'January 22, 2027',
    sortDate: '2027-01-22',
    venue: 'Cinnamon Grand, Colombo',
    packageLabel: 'CLASSIC WEDDING DAY',
    leadArtist: 'Amara Thorne',
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
      { label: 'Additional Bridesmaids (5 pax × LKR 6,500)', amount: 32500 },
      { label: 'Travel & On-Location Fee (Cinnamon Grand)', amount: 12500 },
      { label: 'Early Booking Courtesy Discount', amount: -5000 },
    ],
  },
  {
    id: 'inq-aanya',
    refCode: '#VB-2027-119',
    name: 'Aanya & Rohan',
    email: 'aanya.rohan@example.lk',
    phone: '+94 76 543 9810',
    avatar: ritualBridal,
    statusKey: 'confirmed',
    date: 'February 10, 2027',
    sortDate: '2027-02-10',
    venue: 'The Galle Face Hotel',
    packageLabel: 'ENGAGEMENT RADIANCE',
    leadArtist: 'Elena Rostova',
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
      { label: 'Additional Bridesmaids (3 pax × LKR 6,500)', amount: 19500 },
      { label: 'Travel & On-Location Fee (Galle Face Hotel)', amount: 10500 },
    ],
  },
  {
    id: 'inq-priya',
    refCode: '#VB-2027-142',
    name: 'Priya Dilshan',
    email: 'priya.dilshan@example.lk',
    phone: '+94 71 229 4560',
    avatar: wallpaperBridalAtelier,
    statusKey: 'new',
    date: 'March 05, 2027',
    sortDate: '2027-03-05',
    venue: "Water's Edge, Battaramulla",
    packageLabel: 'COMPLETE BRIDAL SANCTUARY',
    leadArtist: 'Julian Vance',
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
      { label: 'Additional Bridesmaids (8 pax × LKR 6,500)', amount: 52000 },
      { label: "Travel & On-Location Fee (Water's Edge)", amount: 15000 },
      { label: 'Seasonal Sanctuary Courtesy Discount', amount: -22000 },
    ],
  },
];

const AVATAR_POOL = [
  bridalHero,
  bridalKandyan,
  ritualBridal,
  wallpaperBridalAtelier,
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
  const [sortBy, setSortBy] = useState('date'); // 'date' | 'value'
  const [inquiries, setInquiries] = useState(INITIAL_INQUIRIES);
  const [selectedId, setSelectedId] = useState('inq-natasha');
  const [quoteSentId, setQuoteSentId] = useState(null);

  useEffect(() => {
    let active = true;
    fetchBridalInquiries().then(({ data }) => {
      if (!active || !Array.isArray(data) || data.length === 0) return;
      const mapped = data.map((row, idx) => {
        const statusKey = STAGE_META[row.status] ? row.status : 'new';
        return {
          id: row.id,
          isRemote: true,
          refCode: row.ref_code || `#VB-2026-${100 + idx}`,
          name: row.bride_name,
          email: row.email,
          phone: row.phone || '+94 77 000 0000',
          avatar: AVATAR_POOL[idx % AVATAR_POOL.length],
          statusKey,
          date: row.event_date || 'Date TBD',
          sortDate: row.event_date || '2027-01-01',
          venue: row.venue || 'Colombo',
          packageLabel: (
            row.package_name || 'COMPLETE BRIDAL SANCTUARY'
          ).toUpperCase(),
          leadArtist: 'Julian Vance & Bridal Team',
          styleNotes: row.style_notes || '"Bespoke organic bridal styling."',
          organicRequested: true,
          bridalParty: row.guest_count || 'Just the Bride',
          mothersFamily: '2 Mothers',
          addons: INITIAL_INQUIRIES[0].addons.map((a) => ({ ...a })),
          breakdown: [
            {
              label: `${row.package_name || 'Bridal Sanctuary'} (Estimated)`,
              amount: Number(row.quoted_total_lkr) || 85000,
            },
          ],
        };
      });
      setInquiries(mapped);
      setSelectedId(mapped[0].id);
    });
    return () => {
      active = false;
    };
  }, []);

  const stageCounts = useMemo(() => {
    const counts = { all: inquiries.length, new: 0, trial: 0, confirmed: 0, completed: 0 };
    inquiries.forEach((i) => {
      if (counts[i.statusKey] !== undefined) counts[i.statusKey] += 1;
    });
    return counts;
  }, [inquiries]);

  const pipelineValue = useMemo(
    () => inquiries.reduce((sum, i) => sum + computeTotal(i), 0),
    [inquiries]
  );

  const filteredInquiries = useMemo(() => {
    const list =
      activeFilter === 'all'
        ? [...inquiries]
        : inquiries.filter((inq) => inq.statusKey === activeFilter);

    return list.sort((a, b) => {
      if (sortBy === 'value') return computeTotal(b) - computeTotal(a);
      return String(a.sortDate || a.date).localeCompare(
        String(b.sortDate || b.date)
      );
    });
  }, [activeFilter, inquiries, sortBy]);

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

  const handleStageChange = async (inquiryId, nextStage) => {
    const target = inquiries.find((i) => i.id === inquiryId);
    setInquiries((prev) =>
      prev.map((inq) =>
        inq.id === inquiryId ? { ...inq, statusKey: nextStage } : inq
      )
    );
    if (target?.isRemote) {
      await updateBridalInquiry(inquiryId, {
        status: nextStage,
        quoted_total_lkr: computeTotal(target),
      });
    }
  };

  const handleSendQuote = async (inquiryId) => {
    const target = inquiries.find((i) => i.id === inquiryId);
    setQuoteSentId(inquiryId);
    if (target?.isRemote) {
      await updateBridalInquiry(inquiryId, {
        quoted_total_lkr: computeTotal(target),
      });
    }
    setTimeout(() => setQuoteSentId(null), 2600);
  };

  const activeTotal = computeTotal(activeInquiry);
  const activeStage = STAGE_META[activeInquiry.statusKey] || STAGE_META.new;

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* ================= EXECUTIVE HEADER + PIPELINE METRICS ================= */}
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <p className="text-[10.5px] font-semibold tracking-[0.22em] text-[#7A766E] uppercase">
            Bridal Atelier Concierge
          </p>
          <h1 className="mt-1 font-serif text-[30px] font-normal tracking-tight text-[#222B23] sm:text-[34px]">
            Bridal Inquiries &amp; Quotes
          </h1>
        </div>

        {/* Pipeline Summary Strip */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="inline-flex items-center gap-2.5 rounded-full border border-[#E6E2DA] bg-[#FAF8F5] px-4 py-2 text-[12px] shadow-2xs">
            <Crown className="h-3.5 w-3.5 text-[#B78B43]" />
            <span className="text-[#6C6961]">Active Pipeline</span>
            <span className="font-serif text-[15px] font-semibold text-[#222B23]">
              LKR {pipelineValue.toLocaleString('en-US')}
            </span>
          </div>

          <div className="inline-flex items-center gap-2 rounded-full border border-[#E6E2DA] bg-[#FAF8F5] px-3.5 py-2 text-[11.5px] shadow-2xs">
            <span className="inline-flex items-center gap-1.5 font-medium text-[#7A5E34]">
              <span className="h-2 w-2 rounded-full bg-[#C8A870]" />
              {stageCounts.new} New
            </span>
            <span className="text-[#DCD7CE]">•</span>
            <span className="inline-flex items-center gap-1.5 font-medium text-[#285431]">
              <CheckCircle2 className="h-3.5 w-3.5 text-[#4E8B57]" />
              {stageCounts.confirmed} Confirmed
            </span>
          </div>
        </div>
      </div>

      {/* ================= ELEVATED FILTER & SORT TOOLBAR ================= */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-[22px] border border-[#E6E2DA] bg-[#FAF8F5] p-3 shadow-2xs">
        <div className="flex flex-wrap items-center gap-1.5">
          {FILTER_TABS.map((tab) => {
            const isActive = activeFilter === tab.id;
            const count = stageCounts[tab.id] ?? 0;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveFilter(tab.id)}
                className={`inline-flex cursor-pointer items-center gap-2 rounded-full px-4 py-2 text-[12px] font-medium transition-all ${
                  isActive
                    ? 'bg-[#253026] text-[#FAF8F5] shadow-xs'
                    : 'bg-[#F3F0EA] text-[#57544E] hover:bg-[#E8E4DC]'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`inline-flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-[10px] font-semibold ${
                    isActive
                      ? 'bg-[#EFE0C6] text-[#222B23]'
                      : tab.id === 'new' && count > 0
                        ? 'bg-[#C8A870]/25 text-[#7A5E34]'
                        : 'bg-[#FAF8F5] text-[#6C6961]'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => setSortBy((s) => (s === 'date' ? 'value' : 'date'))}
          className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-[#E6E2DA] bg-[#F3F0EA] px-3.5 py-2 text-[11.5px] font-medium text-[#4A4741] transition-colors hover:bg-[#E8E4DC]"
        >
          <ArrowUpDown className="h-3.5 w-3.5 text-[#6A7B6B]" />
          <span>
            Sort: {sortBy === 'date' ? 'Wedding Date' : 'Highest Quote'}
          </span>
        </button>
      </div>

      {/* ================= 2-COLUMN EDITORIAL WORKSPACE ================= */}
      <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-12">
        {/* LEFT COLUMN: Active Inquiries Queue */}
        <section className="space-y-3.5 xl:col-span-4">
          <div className="flex items-baseline justify-between px-1">
            <h2 className="font-serif text-[19px] font-medium text-[#222B23]">
              Inquiry Queue
            </h2>
            <span className="text-[10px] font-semibold tracking-[0.18em] text-[#8A867E] uppercase">
              {filteredInquiries.length} Shown
            </span>
          </div>

          {filteredInquiries.length === 0 ? (
            <div className="rounded-[22px] border border-[#E6E2DA] bg-[#FAF8F5] p-8 text-center">
              <Sparkles className="mx-auto h-6 w-6 text-[#C8A870]" />
              <p className="mt-2 font-serif text-base text-[#222B23]">
                No inquiries in this stage
              </p>
              <p className="mt-1 text-xs text-[#7A766E]">
                Switch filters or advance an inquiry from the dossier panel.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredInquiries.map((inq) => {
                const isSelected = inq.id === activeInquiry.id;
                const total = computeTotal(inq);
                const stage = STAGE_META[inq.statusKey] || STAGE_META.new;

                return (
                  <button
                    key={inq.id}
                    type="button"
                    onClick={() => setSelectedId(inq.id)}
                    className={`block w-full cursor-pointer rounded-[22px] border p-4 text-left transition-all ${
                      isSelected
                        ? 'border-[#344335] bg-[#253026] text-[#FAF8F5] shadow-lg'
                        : 'border-[#E6E2DA] bg-[#FAF8F5] text-[#222B23] shadow-2xs hover:border-[#CFC8BA] hover:shadow-xs'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2.5">
                      <div className="flex min-w-0 items-center gap-3">
                        <img
                          src={inq.avatar}
                          alt={inq.name}
                          className={`h-11 w-11 shrink-0 rounded-full object-cover ${
                            isSelected
                              ? 'border-2 border-[#EFE0C6]/70'
                              : 'border border-[#E5E1D8]'
                          }`}
                        />
                        <div className="min-w-0">
                          <h3 className="truncate font-serif text-[17px] font-semibold">
                            {inq.name}
                          </h3>
                          <p
                            className={`text-[10.5px] ${
                              isSelected ? 'text-[#A8B8AA]' : 'text-[#8A867E]'
                            }`}
                          >
                            {inq.refCode}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
                          isSelected ? stage.darkPillClass : stage.pillClass
                        }`}
                      >
                        {stage.label}
                      </span>
                    </div>

                    <div
                      className={`mt-3 space-y-1 text-[11.5px] ${
                        isSelected ? 'text-[#C8D4CA]' : 'text-[#6C6961]'
                      }`}
                    >
                      <p className="flex items-center gap-2">
                        <Calendar
                          className={`h-3.5 w-3.5 shrink-0 ${
                            isSelected ? 'text-[#EFE0C6]' : 'text-[#6B786A]'
                          }`}
                        />
                        <span>{inq.date}</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <MapPin
                          className={`h-3.5 w-3.5 shrink-0 ${
                            isSelected ? 'text-[#EFE0C6]' : 'text-[#6B786A]'
                          }`}
                        />
                        <span className="truncate">{inq.venue}</span>
                      </p>
                    </div>

                    <div
                      className={`mt-3.5 flex items-baseline justify-between gap-2 border-t pt-3 ${
                        isSelected ? 'border-white/10' : 'border-[#EFECE5]'
                      }`}
                    >
                      <span
                        className={`truncate text-[9.5px] font-semibold tracking-[0.14em] uppercase ${
                          isSelected ? 'text-[#A8B8AA]' : 'text-[#7A766E]'
                        }`}
                      >
                        {inq.packageLabel}
                      </span>
                      <span
                        className={`shrink-0 font-serif text-[16px] font-semibold ${
                          isSelected ? 'text-[#EFE0C6]' : 'text-[#222B23]'
                        }`}
                      >
                        LKR {total.toLocaleString('en-US')}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </section>

        {/* RIGHT COLUMN: Bridal Dossier & Live Quote Atelier */}
        <section className="space-y-5 xl:col-span-8">
          {/* 1. Featured Dark-Sage Bride Dossier Header */}
          <div className="overflow-hidden rounded-[24px] border border-[#344335] bg-[#253026] p-6 text-[#FAF8F5] shadow-md">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                <img
                  src={activeInquiry.avatar}
                  alt={activeInquiry.name}
                  className="h-16 w-16 rounded-2xl border-2 border-[#EFE0C6]/50 object-cover shadow-sm"
                />
                <div>
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h2 className="font-serif text-[24px] font-normal text-[#FAF8F5]">
                      {activeInquiry.name}
                    </h2>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${activeStage.darkPillClass}`}
                    >
                      {activeStage.headerBadge}
                    </span>
                  </div>
                  <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11.5px] text-[#C5D1C7]">
                    <span className="inline-flex items-center gap-1.5">
                      <Mail className="h-3.5 w-3.5 text-[#EFE0C6]/80" />
                      {activeInquiry.email}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Phone className="h-3.5 w-3.5 text-[#EFE0C6]/80" />
                      {activeInquiry.phone}
                    </span>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/[0.06] px-3.5 py-2 text-left sm:text-right">
                <p className="text-[9px] font-semibold tracking-[0.2em] text-[#A8B8AA] uppercase">
                  Inquiry Ref
                </p>
                <p className="mt-0.5 font-serif text-[16px] font-semibold text-[#EFE0C6]">
                  {activeInquiry.refCode}
                </p>
              </div>
            </div>

            {/* Event Meta + Interactive Stage Switcher */}
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4">
              <div className="flex flex-wrap items-center gap-2 text-[11.5px] text-[#D8E2DA]">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/[0.07] px-3 py-1">
                  <Calendar className="h-3.5 w-3.5 text-[#EFE0C6]" />
                  {activeInquiry.date}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/[0.07] px-3 py-1">
                  <MapPin className="h-3.5 w-3.5 text-[#EFE0C6]" />
                  {activeInquiry.venue}
                </span>
              </div>

              {/* 1-Click Pipeline Stage Switcher */}
              <div className="inline-flex rounded-full border border-white/10 bg-black/20 p-1 text-[10.5px]">
                {['new', 'trial', 'confirmed', 'completed'].map((st) => {
                  const isCurrent = activeInquiry.statusKey === st;
                  return (
                    <button
                      key={st}
                      type="button"
                      onClick={() => handleStageChange(activeInquiry.id, st)}
                      className={`cursor-pointer rounded-full px-3 py-1 font-semibold transition-all ${
                        isCurrent
                          ? 'bg-[#EFE0C6] text-[#222B23] shadow-2xs'
                          : 'text-[#B8C6BA] hover:text-white'
                      }`}
                    >
                      {st === 'new'
                        ? 'New'
                        : st === 'trial'
                          ? 'Trial'
                          : st === 'confirmed'
                            ? 'Confirmed'
                            : 'Done'}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 2. Style Notes + Party Headcount */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {/* Submitted Style Notes */}
            <article className="flex flex-col justify-between rounded-[22px] border border-[#E6E2DA] bg-[#FAF8F5] p-5 shadow-2xs">
              <div>
                <div className="flex items-center gap-2 text-[#222B23]">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#F2EFE9] text-[#4A5B4B]">
                    <AlignLeft className="h-4 w-4" />
                  </div>
                  <h3 className="font-serif text-[17px] font-semibold">
                    Submitted Style Notes
                  </h3>
                </div>
                <p className="mt-3.5 rounded-2xl bg-[#F5F2EC] p-4 font-serif text-[14.5px] italic leading-relaxed text-[#423F39]">
                  {activeInquiry.styleNotes}
                </p>
              </div>

              {activeInquiry.organicRequested && (
                <p className="mt-4 inline-flex items-center gap-1.5 text-[11px] font-medium text-[#4A5B4B]">
                  <Leaf className="h-3.5 w-3.5 text-[#4E8B57]" />
                  <span>100% Organic Botanical Formulations Requested</span>
                </p>
              )}
            </article>

            {/* Party Headcount & Lead Artist */}
            <article className="rounded-[22px] border border-[#E6E2DA] bg-[#FAF8F5] p-5 shadow-2xs">
              <div className="flex items-center gap-2 text-[#222B23]">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#F2EFE9] text-[#4A5B4B]">
                  <Users className="h-4 w-4" />
                </div>
                <h3 className="font-serif text-[17px] font-semibold">
                  Party &amp; Atelier Details
                </h3>
              </div>

              <div className="mt-4 space-y-3 text-[12.5px]">
                <div className="flex items-center justify-between rounded-xl bg-[#F5F2EC] px-3.5 py-2.5">
                  <span className="text-[#6C6961]">Bridal Party</span>
                  <span className="font-semibold text-[#222B23]">
                    {activeInquiry.bridalParty}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-[#F5F2EC] px-3.5 py-2.5">
                  <span className="text-[#6C6961]">Mothers / Family</span>
                  <span className="font-semibold text-[#222B23]">
                    {activeInquiry.mothersFamily}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-[#F5F2EC] px-3.5 py-2.5">
                  <span className="text-[#6C6961]">Assigned Lead</span>
                  <span className="font-semibold text-[#222B23]">
                    {activeInquiry.leadArtist || 'Julian Vance'}
                  </span>
                </div>
              </div>
            </article>
          </div>

          {/* 3. Service & Trial Customization */}
          <article className="rounded-[22px] border border-[#E6E2DA] bg-[#FAF8F5] p-5 shadow-2xs">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-[#222B23]">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#F2EFE9] text-[#4A5B4B]">
                  <SlidersHorizontal className="h-4 w-4" />
                </div>
                <h3 className="font-serif text-[17px] font-semibold">
                  Service &amp; Trial Customization
                </h3>
              </div>
              <span className="text-[11px] text-[#7A766E]">
                Toggle inclusions to recalculate live quote
              </span>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {activeInquiry.addons.map((addon) => (
                <button
                  key={addon.id}
                  type="button"
                  onClick={() => toggleAddon(activeInquiry.id, addon.id)}
                  className={`flex cursor-pointer items-center gap-3 rounded-2xl border px-4 py-3 text-left text-[12.5px] font-medium transition-all ${
                    addon.checked
                      ? 'border-[#253026] bg-[#F3F0EA] text-[#222B23] shadow-2xs'
                      : 'border-[#EAE6DE] bg-[#FAF8F5] text-[#6C6961] hover:border-[#D6D1C6]'
                  }`}
                >
                  <span
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md transition-colors ${
                      addon.checked
                        ? 'bg-[#253026] text-[#EFE0C6]'
                        : 'border border-[#CFCAC0] bg-white'
                    }`}
                  >
                    {addon.checked && <Check className="h-3.5 w-3.5" strokeWidth={2.6} />}
                  </span>
                  <span className="flex-1">{addon.label}</span>
                  {addon.price > 0 ? (
                    <span className="rounded-full bg-[#EFE0C6]/60 px-2 py-0.5 text-[10px] font-semibold text-[#6E5634]">
                      +LKR {addon.price.toLocaleString('en-US')}
                    </span>
                  ) : (
                    <span className="text-[10px] font-medium text-[#7A766E]">
                      Included
                    </span>
                  )}
                </button>
              ))}
            </div>
          </article>

          {/* 4. Signature Dark-Sage Quote Calculation & Dispatch Card */}
          <article className="overflow-hidden rounded-[24px] border border-[#344335] bg-[#253026] p-6 text-[#FAF8F5] shadow-lg">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-semibold tracking-[0.2em] text-[#A8B8AA] uppercase">
                  Bespoke Bridal Proposal
                </p>
                <h3 className="mt-0.5 font-serif text-[20px] font-normal text-[#FAF8F5]">
                  Quote Calculation Breakdown
                </h3>
              </div>
              <span className="rounded-full bg-white/10 px-3 py-1 text-[10.5px] font-medium text-[#EFE0C6]">
                {activeInquiry.packageLabel}
              </span>
            </div>

            <div className="mt-5 space-y-2.5 rounded-2xl border border-white/10 bg-white/[0.05] p-4 text-[12.5px]">
              {activeInquiry.breakdown.map((line) => (
                <div
                  key={line.label}
                  className="flex items-center justify-between gap-4"
                >
                  <span className="text-[#C9D4CB]">{line.label}</span>
                  <span
                    className={`shrink-0 font-semibold ${
                      line.amount < 0 ? 'text-[#EFE0C6]' : 'text-[#FAF8F5]'
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
                    className="flex items-center justify-between gap-4 border-t border-white/10 pt-2.5"
                  >
                    <span className="text-[#EFE0C6]">+ {addon.label}</span>
                    <span className="shrink-0 font-semibold text-[#EFE0C6]">
                      LKR {addon.price.toLocaleString('en-US')}
                    </span>
                  </div>
                ))}
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-5">
              <div>
                <p className="text-[10px] font-semibold tracking-[0.18em] text-[#A8B8AA] uppercase">
                  Estimated Quote Total
                </p>
                <p className="mt-0.5 font-serif text-[28px] font-semibold text-[#EFE0C6]">
                  LKR {activeTotal.toLocaleString('en-US')}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                {activeInquiry.statusKey === 'new' && (
                  <button
                    type="button"
                    onClick={() => handleStageChange(activeInquiry.id, 'trial')}
                    className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.07] px-4 py-2.5 text-[12px] font-medium text-[#FAF8F5] transition-colors hover:bg-white/12"
                  >
                    <CalendarCheck className="h-3.5 w-3.5 text-[#EFE0C6]" />
                    <span>Schedule Trial</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => handleSendQuote(activeInquiry.id)}
                  className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-[#EFE0C6] px-5 py-2.5 text-[12px] font-semibold tracking-wide text-[#222B23] shadow-xs transition-all hover:bg-[#F6ECDA]"
                >
                  {quoteSentId === activeInquiry.id ? (
                    <>
                      <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
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
            </div>
          </article>
        </section>
      </div>
    </div>
  );
}
