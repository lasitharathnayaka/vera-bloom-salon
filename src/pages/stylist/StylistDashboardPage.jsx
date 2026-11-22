import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  Check,
  Clock,
  FlaskConical,
  Leaf,
  Play,
  Sparkles,
  Users,
  Wallet,
  X,
  Zap,
} from 'lucide-react';

import heroPortrait from '../../assets/hero-portrait.jpg';
import bridalHero from '../../assets/bridal-hero.jpg';
import ritualHair from '../../assets/ritual-hair.jpg';
import ritualSkin from '../../assets/ritual-skin.jpg';
import ritualBridal from '../../assets/ritual-bridal.jpg';
import founderVera from '../../assets/founder-vera.jpg';

const INITIAL_RITUALS = [
  {
    id: 'rit-1',
    timeRange: '09:00 AM – 10:30 AM',
    duration: '1.5 hrs',
    startingSoon: true,
    category: 'Hair Color',
    client: 'Amara Senaratne',
    initials: 'AS',
    avatar: heroPortrait,
    membership: 'VIP Botanical Member • 14 previous visits',
    noteType: 'info',
    note: 'Sensitive Scalp • Prefers herbal infusion',
    treatment: 'Organic Root Tint & Botanical Gloss',
    treatmentDetail: 'Custom Chamomile & Rosemary Blend',
    primaryLabel: 'Start Ritual',
    status: 'ready',
    formula: {
      base: '6N Organic Botanical Base (45g) + 6G Warm Honey (15g)',
      developer: '10 Vol Plant-Derived Activator (1:1)',
      processing: '30 mins under warm botanical steam',
      aftercare: 'Cold-pressed Camellia oil gloss seal',
    },
  },
  {
    id: 'rit-2',
    timeRange: '10:45 AM – 12:15 PM',
    duration: '1.5 hrs',
    startingSoon: false,
    category: 'Bridal',
    client: 'Devmi Kularatne',
    initials: 'DK',
    avatar: bridalHero,
    membership: 'Bridal Tier 1 Client',
    noteType: 'warning',
    note: 'Allergic to synthetic sulfates',
    treatment: 'Trial Bridal Updo & Floral Placement',
    treatmentDetail: 'Includes Jasmine Garland Styling',
    primaryLabel: 'Prepare Ritual',
    status: 'upcoming',
    formula: {
      base: 'Sulfate-Free Rosewater Texturizing Mist',
      developer: 'Organic Shea & Argan Hold Balm',
      processing: 'Pin-set soft romantic chignon with fresh jasmine',
      aftercare: 'Humidity-shield botanical finishing mist',
    },
  },
  {
    id: 'rit-3',
    timeRange: '01:00 PM – 02:00 PM',
    duration: '1.0 hr',
    startingSoon: false,
    category: 'Hair Color',
    client: 'Thilinie Mendis',
    initials: 'TM',
    avatar: ritualHair,
    membership: 'Regular Client • Color Correction Specialist',
    noteType: 'neutral',
    note: 'Prefers silent appointment slot',
    treatment: 'Full Balayage & Gloss Refresh',
    treatmentDetail: 'Olaplex Step 1 & 2 Treatment Included',
    primaryLabel: 'Prepare Ritual',
    status: 'upcoming',
    formula: {
      base: 'Ammonia-Free Clay Lightener + 8NB Gloss Toner',
      developer: '20 Vol Cream Botanical Developer',
      processing: '35 mins open-air hand painting',
      aftercare: 'Bond-building botanical mask (10 mins)',
    },
  },
  {
    id: 'rit-4',
    timeRange: '02:15 PM – 03:00 PM',
    duration: '45 mins',
    startingSoon: false,
    category: 'Hair Color',
    client: 'Dr. Shanika Nalliah',
    initials: 'SN',
    avatar: ritualSkin,
    membership: 'Express Maintenance Member',
    noteType: 'neutral',
    note: 'Prefers organic peppermint scalp oil',
    treatment: 'Botanical Scalp Detox & Blowdry',
    treatmentDetail: 'Deep conditioning steam mask',
    primaryLabel: 'Prepare Ritual',
    status: 'upcoming',
    formula: {
      base: 'Volcanic Ash & Bamboo Exfoliating Paste',
      developer: 'Organic Peppermint & Rosemary Scalp Elixir',
      processing: '15 mins lymphatic massage + 10 mins steam',
      aftercare: 'Silk-smooth round brush blowout',
    },
  },
  {
    id: 'rit-5',
    timeRange: '03:30 PM – 04:45 PM',
    duration: '1.25 hrs',
    startingSoon: false,
    category: 'Hair Color',
    client: 'Roshani Perera',
    initials: 'RP',
    avatar: ritualBridal,
    membership: 'First-time Sanctuary Guest',
    noteType: 'neutral',
    note: 'No artificial fragrance preference',
    treatment: 'Haircut & Plant-Based Keratin Infusion',
    treatmentDetail: 'Signature Blowout finish',
    primaryLabel: 'Prepare Ritual',
    status: 'upcoming',
    formula: {
      base: 'Fragrance-Free Plant Keratin Amino Complex',
      developer: 'Thermal seal at 180°C',
      processing: '25 mins infusion + precision dry layering',
      aftercare: 'Pure unscented jojoba shine drops',
    },
  },
  {
    id: 'rit-6',
    timeRange: '05:00 PM – 06:00 PM',
    duration: '1.0 hr',
    startingSoon: false,
    category: 'Hair Color',
    client: 'Kavitha Wickramasinghe',
    initials: 'KW',
    avatar: founderVera,
    membership: 'VIP Botanical Member',
    noteType: 'neutral',
    note: 'Enjoys green tea ritual on arrival',
    treatment: 'Gloss Touch-Up & Blowdry',
    treatmentDetail: 'Custom ash-brown formulation',
    primaryLabel: 'Prepare Ritual',
    status: 'upcoming',
    formula: {
      base: '5A Cool Ash Botanical Gloss (40g) + Clear Shine (20g)',
      developer: '6 Vol Botanical Gloss Activator',
      processing: '20 mins bowl-to-brush application',
      aftercare: 'Cool water rinse + organic green tea leave-in',
    },
  },
];

export default function StylistDashboardPage() {
  const [filter, setFilter] = useState('All');
  const [rituals, setRituals] = useState(INITIAL_RITUALS);
  const [formulaModalRitual, setFormulaModalRitual] = useState(null);
  const [daySubmitted, setDaySubmitted] = useState(false);

  const visibleRituals = useMemo(() => {
    if (filter === 'All') return rituals;
    return rituals.filter((r) => r.category === filter);
  }, [filter, rituals]);

  const advanceRitualStatus = (id) => {
    setRituals((prev) =>
      prev.map((r) => {
        if (r.id !== id) return r;
        if (r.status === 'completed') return { ...r, status: 'ready' };
        if (r.status === 'in-progress') return { ...r, status: 'completed' };
        return { ...r, status: 'in-progress' };
      })
    );
  };

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      {/* ================= 4 KPI STAT CARDS ================= */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-2xl border border-[#ECE8E0] bg-[#FAF8F5] p-5 shadow-2xs">
          <div className="flex items-center justify-between text-[10px] font-semibold tracking-[0.16em] text-[#7A766E] uppercase">
            <span>Today&rsquo;s Clients</span>
            <Users className="h-4 w-4 text-[#4A5B4B]" strokeWidth={1.7} />
          </div>
          <p className="mt-3 font-serif text-3xl font-semibold text-[#2A2927]">
            6
          </p>
          <p className="mt-1.5 text-[11px] font-medium text-[#4A5B4B]">
            100% capacity booked
          </p>
        </article>

        <article className="rounded-2xl border border-[#ECE8E0] bg-[#FAF8F5] p-5 shadow-2xs">
          <div className="flex items-center justify-between text-[10px] font-semibold tracking-[0.16em] text-[#7A766E] uppercase">
            <span>Hours Booked</span>
            <Clock className="h-4 w-4 text-[#4A5B4B]" strokeWidth={1.7} />
          </div>
          <p className="mt-3 font-serif text-3xl font-semibold text-[#2A2927]">
            5.5 hrs
          </p>
          <p className="mt-1.5 text-[11px] text-[#7A766E]">
            Active treatment time
          </p>
        </article>

        <article className="rounded-2xl border border-[#ECE8E0] bg-[#FAF8F5] p-5 shadow-2xs">
          <div className="flex items-center justify-between text-[10px] font-semibold tracking-[0.16em] text-[#7A766E] uppercase">
            <span>Next Client</span>
            <Clock className="h-4 w-4 text-[#4A5B4B]" strokeWidth={1.7} />
          </div>
          <p className="mt-3 font-serif text-3xl font-semibold text-[#2A2927]">
            15 mins
          </p>
          <p className="mt-1.5 text-[11px] text-[#7A766E]">Starts at 9:00 AM</p>
        </article>

        <article
          id="earnings"
          className="rounded-2xl border border-[#ECE8E0] bg-[#FAF8F5] p-5 shadow-2xs"
        >
          <div className="flex items-center justify-between text-[10px] font-semibold tracking-[0.16em] text-[#7A766E] uppercase">
            <span>Est. Commission</span>
            <Wallet className="h-4 w-4 text-[#4A5B4B]" strokeWidth={1.7} />
          </div>
          <p className="mt-3 font-serif text-[26px] font-semibold leading-tight text-[#2A2927]">
            24,500 LKR
          </p>
          <p className="mt-1.5 text-[11px] font-medium text-[#6B786A]">
            + Tips pending
          </p>
        </article>
      </section>

      {/* ================= SANCTUARY SCHEDULE HEADER ================= */}
      <section>
        <div className="flex flex-col justify-between gap-4 border-b border-[#ECE8E0] pb-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-[10px] font-semibold tracking-[0.22em] text-[#6B786A] uppercase">
              Sanctuary Schedule
            </p>
            <h1 className="mt-1 font-serif text-[24px] font-semibold text-[#2A2927]">
              Today&rsquo;s Assigned Rituals
            </h1>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 text-[12px]">
            <span className="mr-1 text-[#8A867E]">Filter:</span>
            {[
              { id: 'All', label: `All Appointments (${rituals.length})` },
              { id: 'Hair Color', label: 'Hair Color' },
              { id: 'Bridal', label: 'Bridal' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilter(tab.id)}
                className={`cursor-pointer rounded-lg px-3 py-1.5 transition-colors ${
                  filter === tab.id
                    ? 'bg-[#4A5B4B] font-semibold text-[#FAF8F5]'
                    : 'text-[#5F5C55] hover:bg-[#EFECE6] hover:text-[#2A2927]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* ================= TIMELINE OF RITUAL CARDS ================= */}
        <div className="relative mt-6 space-y-5 pl-6">
          {/* Vertical subtle timeline spine */}
          <div className="pointer-events-none absolute bottom-6 left-[5px] top-4 w-px bg-[#E5E1D8]" />

          {visibleRituals.map((ritual) => {
            const isInProgress = ritual.status === 'in-progress';
            const isCompleted = ritual.status === 'completed';

            return (
              <div key={ritual.id} className="relative">
                {/* Timeline Dot */}
                <span
                  className={`absolute -left-6 top-6 h-3 w-3 rounded-full border-2 ${
                    isCompleted
                      ? 'border-[#4A5B4B] bg-[#4A5B4B]'
                      : isInProgress || ritual.startingSoon
                        ? 'border-[#4A5B4B] bg-[#D5E8D7]'
                        : 'border-[#8FA08F] bg-[#FAF8F5]'
                  }`}
                />

                {/* Ritual Card */}
                <article
                  className={`rounded-2xl border bg-[#FAF8F5] p-5 transition-all sm:p-6 ${
                    ritual.startingSoon
                      ? 'border-[#DCD7CC] shadow-sm'
                      : 'border-[#ECE8E0] shadow-2xs'
                  }`}
                >
                  <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
                    {/* Left: Time + Client + Notes */}
                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center gap-3 text-[11.5px]">
                        <span className="font-semibold text-[#2A2927]">
                          {ritual.timeRange}
                        </span>
                        <span className="rounded-md bg-[#F2EFE9] px-2 py-0.5 text-[10.5px] font-medium text-[#6C6961]">
                          {ritual.duration}
                        </span>
                      </div>

                      <div className="flex items-center gap-3.5">
                        <img
                          src={ritual.avatar}
                          alt={ritual.client}
                          className="h-11 w-11 shrink-0 rounded-full border border-[#E5E1D8] object-cover"
                        />
                        <div>
                          <h2 className="font-serif text-[18px] font-semibold text-[#2A2927]">
                            {ritual.client}
                          </h2>
                          <p className="text-[11.5px] text-[#7A766E]">
                            {ritual.membership}
                          </p>
                        </div>
                      </div>

                      <p
                        className={`inline-flex items-center gap-1.5 text-[11.5px] ${
                          ritual.noteType === 'warning'
                            ? 'font-medium text-[#A44A3F]'
                            : 'text-[#6C6961]'
                        }`}
                      >
                        {ritual.noteType === 'warning' && (
                          <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                        )}
                        {ritual.noteType === 'info' && (
                          <Sparkles className="h-3.5 w-3.5 shrink-0 text-[#6B786A]" />
                        )}
                        <span>{ritual.note}</span>
                      </p>
                    </div>

                    {/* Right: Assigned Treatments + Actions */}
                    <div className="flex flex-col items-start gap-4 border-t border-[#ECE8E0] pt-4 lg:items-end lg:border-t-0 lg:pt-0 lg:text-right">
                      <div>
                        {ritual.startingSoon && !isCompleted && (
                          <p className="mb-1 inline-flex items-center gap-1 text-[10px] font-semibold tracking-[0.16em] text-[#4A5B4B] uppercase">
                            <Zap className="h-3 w-3" />
                            <span>Starting Soon</span>
                          </p>
                        )}
                        <p className="text-[9.5px] font-semibold tracking-[0.18em] text-[#8A867E] uppercase">
                          Assigned Treatments
                        </p>
                        <h3 className="mt-0.5 font-serif text-[17px] font-semibold text-[#2A2927]">
                          {ritual.treatment}
                        </h3>
                        <p className="text-[11.5px] text-[#6C6961]">
                          {ritual.treatmentDetail}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-2.5">
                        <Link
                          to="/stylist/formulas"
                          state={{
                            client: {
                              name: ritual.client,
                              membership: ritual.membership,
                              alert: ritual.note,
                              formulaBase: ritual.formula.base,
                            },
                          }}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-[#E2DDD4] bg-[#F6F4EF] px-3.5 py-2 text-[11.5px] font-medium text-[#2A2927] transition-colors hover:bg-[#EAE6DE]"
                        >
                          <FlaskConical className="h-3.5 w-3.5 text-[#4A5B4B]" />
                          <span>Client Formula</span>
                        </Link>

                        <button
                          type="button"
                          onClick={() => advanceRitualStatus(ritual.id)}
                          className={`inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-4 py-2 text-[11.5px] font-medium transition-colors ${
                            isCompleted
                              ? 'bg-[#D5E8D7] text-[#355A3A]'
                              : isInProgress
                                ? 'bg-[#EFE0C6] text-[#7A6444]'
                                : ritual.startingSoon
                                  ? 'bg-[#4A5B4B] text-[#FAF8F5] hover:bg-[#3B4A3C]'
                                  : 'border border-[#E2DDD4] bg-[#FAF8F5] text-[#2A2927] hover:bg-[#EFECE6]'
                          }`}
                        >
                          {isCompleted ? (
                            <>
                              <Check className="h-3.5 w-3.5" />
                              <span>Completed</span>
                            </>
                          ) : isInProgress ? (
                            <span>In Progress &bull; Finish</span>
                          ) : (
                            <>
                              {ritual.startingSoon && (
                                <Play className="h-3 w-3 fill-current" />
                              )}
                              <span>{ritual.primaryLabel}</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              </div>
            );
          })}
        </div>
      </section>

      {/* ================= BOTTOM SANCTUARY NOTE ================= */}
      <section className="flex flex-col justify-between gap-4 rounded-2xl border border-[#ECE8E0] bg-[#F4F2ED] p-5 sm:flex-row sm:items-center">
        <div className="flex items-start gap-3.5">
          <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#E5ECE6] text-[#4A5B4B]">
            <Leaf className="h-4 w-4" strokeWidth={1.8} />
          </span>
          <div>
            <p className="font-serif text-[16px] font-semibold text-[#2A2927]">
              Sanctuary Note for Nethmi
            </p>
            <p className="mt-0.5 text-[12px] text-[#6C6961]">
              All stations are fully restocked with organic botanicals and
              freshly laundered linens.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setDaySubmitted(true)}
          className={`shrink-0 cursor-pointer rounded-lg px-5 py-2.5 text-[12px] font-medium transition-colors ${
            daySubmitted
              ? 'bg-[#4A5B4B] text-[#FAF8F5]'
              : 'border border-[#DCD7CC] bg-[#FAF8F5] text-[#2A2927] hover:bg-[#EAE6DE]'
          }`}
        >
          {daySubmitted
            ? '✓ Day Logs Submitted'
            : 'Mark Day Complete & Submit Logs'}
        </button>
      </section>

      {/* ================= CLIENT FORMULA MODAL ================= */}
      {formulaModalRitual && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#1F1E1C]/50 p-4 backdrop-blur-xs"
          onClick={() => setFormulaModalRitual(null)}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-[#E5E1D8] bg-[#FAF8F5] p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-[#ECE8E0] pb-4">
              <div>
                <p className="text-[10px] font-semibold tracking-[0.18em] text-[#6B786A] uppercase">
                  Client Formula Sheet
                </p>
                <h3 className="mt-1 font-serif text-xl font-semibold text-[#2A2927]">
                  {formulaModalRitual.client}
                </h3>
                <p className="text-xs text-[#7A766E]">
                  {formulaModalRitual.treatment}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setFormulaModalRitual(null)}
                className="cursor-pointer rounded p-1 text-[#7A766E] hover:bg-[#EFECE6]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-5 space-y-3 text-xs">
              <div className="rounded-xl bg-[#F4F2ED] p-3.5">
                <p className="font-semibold text-[#4A5B4B]">Primary Formula</p>
                <p className="mt-1 text-[#2A2927]">
                  {formulaModalRitual.formula.base}
                </p>
              </div>
              <div className="rounded-xl bg-[#F4F2ED] p-3.5">
                <p className="font-semibold text-[#4A5B4B]">
                  Activator / Preparation
                </p>
                <p className="mt-1 text-[#2A2927]">
                  {formulaModalRitual.formula.developer}
                </p>
              </div>
              <div className="rounded-xl bg-[#F4F2ED] p-3.5">
                <p className="font-semibold text-[#4A5B4B]">
                  Processing &amp; Aftercare
                </p>
                <p className="mt-1 text-[#2A2927]">
                  {formulaModalRitual.formula.processing} &middot;{' '}
                  {formulaModalRitual.formula.aftercare}
                </p>
              </div>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={() => setFormulaModalRitual(null)}
                className="cursor-pointer rounded-lg bg-[#4A5B4B] px-5 py-2 text-xs font-medium text-[#FAF8F5] hover:bg-[#3B4A3C]"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
