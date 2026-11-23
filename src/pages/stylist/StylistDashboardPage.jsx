import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  Check,
  CheckCircle2,
  Clock,
  Eye,
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

  const completedCount = useMemo(
    () => rituals.filter((r) => r.status === 'completed').length,
    [rituals]
  );

  const inProgressCount = useMemo(
    () => rituals.filter((r) => r.status === 'in-progress').length,
    [rituals]
  );

  const hairCount = rituals.filter((r) => r.category === 'Hair Color').length;
  const bridalCount = rituals.filter((r) => r.category === 'Bridal').length;

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
    <div className="mx-auto max-w-5xl space-y-7">
      {/* ================= EXECUTIVE WELCOME HEADER ================= */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-[10.5px] font-semibold tracking-[0.22em] text-[#7A766E] uppercase">
            Specialist Workbench
          </p>
          <h1 className="mt-1 font-serif text-[30px] font-normal tracking-tight text-[#222B23] sm:text-[34px]">
            Good Morning, Nethmi
          </h1>
        </div>

        <div className="inline-flex items-center gap-2.5 self-start rounded-full border border-[#E6E2DA] bg-[#FAF8F5] px-4 py-2 text-[11.5px] shadow-2xs sm:self-auto">
          <CheckCircle2 className="h-3.5 w-3.5 text-[#4E8B57]" />
          <span className="font-medium text-[#222B23]">
            {completedCount} of {rituals.length} Rituals Completed
          </span>
          {inProgressCount > 0 && (
            <>
              <span className="text-[#DCD7CE]">•</span>
              <span className="inline-flex items-center gap-1.5 font-semibold text-[#7A5E34]">
                <span className="h-2 w-2 animate-pulse rounded-full bg-[#C8A870]" />
                {inProgressCount} In-Chair
              </span>
            </>
          )}
        </div>
      </div>

      {/* ================= 4 MODERN KPI STAT CARDS ================= */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {/* Featured Dark-Sage Commission Card */}
        <article
          id="earnings"
          className="rounded-[22px] border border-[#344335] bg-[#253026] p-5 text-[#FAF8F5] shadow-md"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold tracking-[0.18em] text-[#A8B8AA] uppercase">
              Est. Commission
            </span>
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/10 text-[#EFE0C6]">
              <Wallet className="h-4 w-4" strokeWidth={1.7} />
            </span>
          </div>
          <p className="mt-3 font-serif text-[27px] font-semibold leading-tight text-[#EFE0C6]">
            LKR 24,500
          </p>
          <p className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-0.5 text-[10.5px] font-medium text-[#D8E2DA]">
            + Tips pending checkout
          </p>
        </article>

        {/* Today's Clients */}
        <article className="rounded-[22px] border border-[#E6E2DA] bg-[#FAF8F5] p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold tracking-[0.18em] text-[#8A867E] uppercase">
              Today&rsquo;s Clients
            </span>
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#F3F0EA] text-[#4A5B4B]">
              <Users className="h-4 w-4" strokeWidth={1.7} />
            </span>
          </div>
          <p className="mt-3 font-serif text-[30px] font-semibold leading-tight text-[#222B23]">
            {rituals.length}
          </p>
          <div className="mt-2.5">
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#ECE8E0]">
              <div className="h-full w-full rounded-full bg-[#253026]" />
            </div>
            <p className="mt-1.5 text-[11px] font-medium text-[#355A3A]">
              100% capacity booked
            </p>
          </div>
        </article>

        {/* Hours Booked */}
        <article className="rounded-[22px] border border-[#E6E2DA] bg-[#FAF8F5] p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold tracking-[0.18em] text-[#8A867E] uppercase">
              Hours Booked
            </span>
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#F3F0EA] text-[#4A5B4B]">
              <Clock className="h-4 w-4" strokeWidth={1.7} />
            </span>
          </div>
          <p className="mt-3 font-serif text-[30px] font-semibold leading-tight text-[#222B23]">
            5.5 hrs
          </p>
          <p className="mt-2.5 text-[11px] text-[#7A766E]">
            Active sanctuary treatment time
          </p>
        </article>

        {/* Next Client */}
        <article className="rounded-[22px] border border-[#E6E2DA] bg-[#FAF8F5] p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold tracking-[0.18em] text-[#8A867E] uppercase">
              Next Client
            </span>
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#F5E8D0] text-[#7A5E34]">
              <Zap className="h-4 w-4" strokeWidth={1.7} />
            </span>
          </div>
          <p className="mt-3 font-serif text-[30px] font-semibold leading-tight text-[#222B23]">
            15 mins
          </p>
          <p className="mt-2.5 inline-flex items-center gap-1.5 text-[11px] font-medium text-[#7A5E34]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#C8A870]" />
            Amara Senaratne • 9:00 AM
          </p>
        </article>
      </section>

      {/* ================= SANCTUARY SCHEDULE HEADER & FILTERS ================= */}
      <section>
        <div className="flex flex-col justify-between gap-4 rounded-[22px] border border-[#E6E2DA] bg-[#FAF8F5] p-4 shadow-2xs sm:flex-row sm:items-center">
          <div>
            <p className="text-[10px] font-semibold tracking-[0.2em] text-[#7A766E] uppercase">
              Sanctuary Schedule
            </p>
            <h2 className="mt-0.5 font-serif text-[22px] font-semibold text-[#222B23]">
              Today&rsquo;s Assigned Rituals
            </h2>
          </div>

          {/* Rounded-Full Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 text-[12px]">
            {[
              { id: 'All', label: 'All Appointments', count: rituals.length },
              { id: 'Hair Color', label: 'Hair Color', count: hairCount },
              { id: 'Bridal', label: 'Bridal', count: bridalCount },
            ].map((tab) => {
              const active = filter === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setFilter(tab.id)}
                  className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full px-4 py-1.5 font-medium transition-all ${
                    active
                      ? 'bg-[#253026] text-[#FAF8F5] shadow-xs'
                      : 'bg-[#F3F0EA] text-[#57544E] hover:bg-[#E8E4DC]'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${
                      active
                        ? 'bg-[#EFE0C6] text-[#222B23]'
                        : 'bg-[#FAF8F5] text-[#6C6961]'
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ================= TIMELINE OF RITUAL CARDS ================= */}
        <div className="relative mt-6 space-y-4 pl-7">
          {/* Vertical subtle timeline spine */}
          <div className="pointer-events-none absolute top-6 bottom-6 left-[7px] w-[1.5px] bg-[#E2DDD3]" />

          {visibleRituals.map((ritual) => {
            const isInProgress = ritual.status === 'in-progress';
            const isCompleted = ritual.status === 'completed';

            return (
              <div key={ritual.id} className="relative">
                {/* Timeline Status Dot */}
                <span
                  className={`absolute top-7 -left-7 flex h-4 w-4 items-center justify-center rounded-full border-2 ${
                    isCompleted
                      ? 'border-[#253026] bg-[#253026] text-[#EFE0C6]'
                      : isInProgress
                        ? 'border-[#C8A870] bg-[#EFE0C6]'
                        : ritual.startingSoon
                          ? 'border-[#253026] bg-[#D5E8D7]'
                          : 'border-[#B8B2A6] bg-[#FAF8F5]'
                  }`}
                >
                  {isCompleted && <Check className="h-2.5 w-2.5" strokeWidth={3} />}
                </span>

                {/* Ritual Card */}
                <article
                  className={`rounded-[22px] border bg-[#FAF8F5] p-5 transition-all sm:p-6 ${
                    isInProgress
                      ? 'border-[#C8A870] shadow-md ring-1 ring-[#C8A870]/30'
                      : ritual.startingSoon && !isCompleted
                        ? 'border-[#253026]/35 shadow-sm'
                        : isCompleted
                          ? 'border-[#E6E2DA] opacity-85'
                          : 'border-[#E6E2DA] shadow-2xs hover:border-[#D4CFC4]'
                  }`}
                >
                  <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
                    {/* Left: Time + Client + Notes */}
                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center gap-2.5 text-[11.5px]">
                        <span className="inline-flex items-center gap-1.5 font-semibold text-[#222B23]">
                          <Clock className="h-3.5 w-3.5 text-[#6A7B6B]" />
                          {ritual.timeRange}
                        </span>
                        <span className="rounded-full bg-[#F3F0EA] px-2.5 py-0.5 text-[10.5px] font-semibold text-[#6C6961]">
                          {ritual.duration}
                        </span>
                        <span className="rounded-full bg-[#EAE5DC] px-2.5 py-0.5 text-[10px] font-semibold text-[#4A5B4B]">
                          {ritual.category}
                        </span>
                      </div>

                      <div className="flex items-center gap-3.5">
                        <img
                          src={ritual.avatar}
                          alt={ritual.client}
                          className="h-12 w-12 shrink-0 rounded-full border-2 border-[#EFECE5] object-cover shadow-2xs"
                        />
                        <div>
                          <h3 className="font-serif text-[19px] font-semibold text-[#222B23]">
                            {ritual.client}
                          </h3>
                          <p className="text-[11.5px] text-[#7A766E]">
                            {ritual.membership}
                          </p>
                        </div>
                      </div>

                      <div>
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-medium ${
                            ritual.noteType === 'warning'
                              ? 'border border-[#F0D1CB] bg-[#FDF2F0] text-[#A44A3F]'
                              : ritual.noteType === 'info'
                                ? 'bg-[#EDF3EE] text-[#2F4F34]'
                                : 'bg-[#F5F2EC] text-[#6C6961]'
                          }`}
                        >
                          {ritual.noteType === 'warning' && (
                            <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                          )}
                          {ritual.noteType === 'info' && (
                            <Sparkles className="h-3.5 w-3.5 shrink-0 text-[#4E8B57]" />
                          )}
                          <span>{ritual.note}</span>
                        </span>
                      </div>
                    </div>

                    {/* Right: Assigned Treatments + Actions */}
                    <div className="flex flex-col items-start gap-4 border-t border-[#EFECE5] pt-4 lg:items-end lg:border-t-0 lg:pt-0 lg:text-right">
                      <div>
                        {isInProgress ? (
                          <span className="mb-1.5 inline-flex items-center gap-1.5 rounded-full bg-[#F5E8D0] px-2.5 py-0.5 text-[10px] font-semibold tracking-wider text-[#7A5E34] uppercase">
                            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#B78B43]" />
                            In-Chair Session
                          </span>
                        ) : ritual.startingSoon && !isCompleted ? (
                          <span className="mb-1.5 inline-flex items-center gap-1 rounded-full bg-[#253026] px-2.5 py-0.5 text-[9.5px] font-semibold tracking-[0.14em] text-[#EFE0C6] uppercase">
                            <Zap className="h-3 w-3" />
                            Starting Soon
                          </span>
                        ) : null}

                        <p className="text-[9.5px] font-semibold tracking-[0.18em] text-[#8A867E] uppercase">
                          Assigned Treatment
                        </p>
                        <h4 className="mt-0.5 font-serif text-[18px] font-semibold text-[#222B23]">
                          {ritual.treatment}
                        </h4>
                        <p className="text-[11.5px] text-[#6C6961]">
                          {ritual.treatmentDetail}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setFormulaModalRitual(ritual)}
                          className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-[#E6E2DA] bg-[#F5F2EC] px-3.5 py-2 text-[11.5px] font-medium text-[#222B23] transition-colors hover:bg-[#EAE5DC]"
                        >
                          <Eye className="h-3.5 w-3.5 text-[#4A5B4B]" />
                          <span>Quick Sheet</span>
                        </button>

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
                          className="inline-flex items-center gap-1.5 rounded-full border border-[#E6E2DA] bg-[#FAF8F5] px-3.5 py-2 text-[11.5px] font-medium text-[#222B23] transition-colors hover:bg-[#F3F0EA]"
                        >
                          <FlaskConical className="h-3.5 w-3.5 text-[#4A5B4B]" />
                          <span>Client Formula</span>
                        </Link>

                        <button
                          type="button"
                          onClick={() => advanceRitualStatus(ritual.id)}
                          className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full px-4 py-2 text-[11.5px] font-semibold transition-all ${
                            isCompleted
                              ? 'bg-[#D8ECDC] text-[#285431]'
                              : isInProgress
                                ? 'bg-[#EFE0C6] text-[#222B23] shadow-xs hover:bg-[#E7D3B0]'
                                : ritual.startingSoon
                                  ? 'bg-[#253026] text-[#FAF8F5] shadow-xs hover:bg-[#344335]'
                                  : 'border border-[#DCD7CC] bg-[#FAF8F5] text-[#222B23] hover:bg-[#253026] hover:text-[#FAF8F5]'
                          }`}
                        >
                          {isCompleted ? (
                            <>
                              <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
                              <span>Completed</span>
                            </>
                          ) : isInProgress ? (
                            <span>In Progress &bull; Finish</span>
                          ) : (
                            <>
                              {ritual.startingSoon && (
                                <Play className="h-3 w-3 fill-current text-[#EFE0C6]" />
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

      {/* ================= SIGNATURE DARK-SAGE SANCTUARY NOTE ================= */}
      <section className="flex flex-col justify-between gap-4 rounded-[24px] border border-[#344335] bg-[#253026] p-6 text-[#FAF8F5] shadow-md sm:flex-row sm:items-center">
        <div className="flex items-start gap-3.5">
          <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-[#EFE0C6]">
            <Leaf className="h-4.5 w-4.5" strokeWidth={1.8} />
          </span>
          <div>
            <p className="font-serif text-[18px] font-medium text-[#FAF8F5]">
              Sanctuary Note for Nethmi
            </p>
            <p className="mt-0.5 text-[12px] text-[#C5D1C7]">
              All stations are fully restocked with organic botanicals,
              chamomile infusions, and freshly laundered linens.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setDaySubmitted(true)}
          className={`shrink-0 cursor-pointer rounded-full px-5 py-2.5 text-[12px] font-semibold transition-all ${
            daySubmitted
              ? 'bg-[#4E8B57] text-[#FAF8F5]'
              : 'bg-[#EFE0C6] text-[#222B23] shadow-xs hover:bg-[#F7EEDC]'
          }`}
        >
          {daySubmitted
            ? '✓ Day Logs Submitted'
            : 'Mark Day Complete & Submit Logs'}
        </button>
      </section>

      {/* ================= MODERN CLIENT FORMULA QUICK MODAL ================= */}
      {formulaModalRitual && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#181E19]/60 p-4 backdrop-blur-xs"
          onClick={() => setFormulaModalRitual(null)}
        >
          <div
            className="w-full max-w-md overflow-hidden rounded-[24px] border border-[#E5E1D8] bg-[#FAF8F5] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between bg-[#253026] px-6 py-5 text-[#FAF8F5]">
              <div>
                <p className="text-[10px] font-semibold tracking-[0.2em] text-[#EFE0C6] uppercase">
                  Client Formula Sheet
                </p>
                <h3 className="mt-1 font-serif text-2xl font-normal">
                  {formulaModalRitual.client}
                </h3>
                <p className="mt-0.5 text-xs text-[#B8C6BA]">
                  {formulaModalRitual.treatment}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setFormulaModalRitual(null)}
                className="cursor-pointer rounded-full p-1.5 text-[#A8B8AA] hover:bg-white/10 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3 p-6 text-xs">
              <div className="rounded-2xl border border-[#EFECE5] bg-[#F5F2EC] p-3.5">
                <p className="font-semibold text-[#253026]">Primary Formula</p>
                <p className="mt-1 leading-relaxed text-[#4A4741]">
                  {formulaModalRitual.formula.base}
                </p>
              </div>
              <div className="rounded-2xl border border-[#EFECE5] bg-[#F5F2EC] p-3.5">
                <p className="font-semibold text-[#253026]">
                  Activator / Preparation
                </p>
                <p className="mt-1 leading-relaxed text-[#4A4741]">
                  {formulaModalRitual.formula.developer}
                </p>
              </div>
              <div className="rounded-2xl border border-[#EFECE5] bg-[#F5F2EC] p-3.5">
                <p className="font-semibold text-[#253026]">
                  Processing &amp; Aftercare
                </p>
                <p className="mt-1 leading-relaxed text-[#4A4741]">
                  {formulaModalRitual.formula.processing} &middot;{' '}
                  {formulaModalRitual.formula.aftercare}
                </p>
              </div>

              <div className="flex justify-end gap-2.5 pt-2">
                <Link
                  to="/stylist/formulas"
                  state={{
                    client: {
                      name: formulaModalRitual.client,
                      membership: formulaModalRitual.membership,
                      alert: formulaModalRitual.note,
                      formulaBase: formulaModalRitual.formula.base,
                    },
                  }}
                  className="rounded-full border border-[#E2DDD4] px-4 py-2 text-xs font-medium text-[#222B23] hover:bg-[#EFECE6]"
                >
                  Open Full Editor
                </Link>
                <button
                  type="button"
                  onClick={() => setFormulaModalRitual(null)}
                  className="cursor-pointer rounded-full bg-[#253026] px-5 py-2 text-xs font-medium text-[#FAF8F5] hover:bg-[#344335]"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
