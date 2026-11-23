import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  Calendar,
  Check,
  CheckCircle2,
  ClipboardList,
  Download,
  Heart,
  Package,
  TrendingUp,
  Users,
  Wallet,
} from 'lucide-react';
import { createStaffNote } from '../../services/salonService';

const FLOW_DATASETS = {
  Today: {
    peakHour: '2:00 PM - 3:00 PM',
    avgTicket: 'LKR 6,187',
    labels: [
      '09:00 AM',
      '11:00 AM',
      '01:00 PM',
      '03:00 PM',
      '05:00 PM',
      '07:00 PM',
    ],
    values: [32, 54, 62, 74, 90, 84],
    amounts: [
      'LKR 18,400',
      'LKR 24,800',
      'LKR 29,200',
      'LKR 34,500',
      'LKR 23,600',
      'LKR 18,000',
    ],
  },
  Week: {
    peakHour: 'Sat • 1:00 PM',
    avgTicket: 'LKR 7,420',
    labels: ['Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    values: [44, 58, 68, 82, 95, 76],
    amounts: [
      'LKR 112k',
      'LKR 134k',
      'LKR 148k',
      'LKR 189k',
      'LKR 245k',
      'LKR 168k',
    ],
  },
  Month: {
    peakHour: 'Week 3 • Bridal',
    avgTicket: 'LKR 8,150',
    labels: ['W1', 'W2', 'W3', 'W4', 'W5', 'Now'],
    values: [54, 64, 88, 78, 84, 92],
    amounts: [
      'LKR 610k',
      'LKR 720k',
      'LKR 980k',
      'LKR 845k',
      'LKR 910k',
      'LKR 995k',
    ],
  },
};

const SERVICE_MIX = [
  { label: 'Hair & Color', percent: 54, color: 'bg-[#4A5B4B]' },
  { label: 'Holistic Facials', percent: 26, color: 'bg-[#8FA391]' },
  { label: 'Bridal Suites', percent: 20, color: 'bg-[#D6B985]' },
];

const INITIAL_QUEUE = [
  {
    id: 'emma',
    time: '10:45 AM',
    badge: 'Confirmed',
    badgeClass: 'bg-[#D5E8D7] text-[#355A3A]',
    client: 'Emma Vance',
    service: 'Organic Hair Couture',
    specialist: 'Elena Rostova',
    checkedIn: false,
  },
  {
    id: 'priya',
    time: '11:15 AM',
    badge: "Couple's Suite",
    badgeClass: 'bg-[#EFE0C6] text-[#7A6444]',
    client: 'Priya & Dilshan',
    service: 'Botanical Facial',
    specialist: 'Amara Thorne',
    checkedIn: false,
  },
  {
    id: 'natasha',
    time: '01:00 PM',
    badge: 'VIP Tier',
    badgeClass: 'bg-[#E6E3DC] text-[#57544E]',
    client: 'Natasha M.',
    service: 'Bridal Trial',
    specialist: 'Julian Vance',
    checkedIn: false,
  },
];

const INITIAL_NOTES = [
  {
    id: 'note-1',
    area: 'Front Desk',
    time: '10:15 AM',
    author: 'By Sarah L.',
    accent: 'border-l-[#4A5B4B]',
    body: 'Aromatherapy diffusers switched to Sandalwood & White Tea blend for the afternoon wellness sessions.',
  },
  {
    id: 'note-2',
    area: 'Bridal Suite',
    time: '09:40 AM',
    author: 'By Julian V.',
    accent: 'border-l-[#C89F52]',
    body: 'VIP consultation room #2 reserved for Natasha M. bridal trial. Ensure champagne service is prepared by 12:45 PM.',
  },
];

const INITIAL_STOCK = [
  {
    id: 'rose-elixir',
    name: 'Organic Damask Rose Hair Elixir',
    statusText: 'Only 3 bottles remaining in dispensary',
    severity: 'critical',
    ordered: false,
  },
  {
    id: 'clay-mask',
    name: 'Botanical Clay Face Mask (Pro Size)',
    statusText: 'Reorder suggested by Friday',
    severity: 'warning',
    ordered: false,
  },
  {
    id: 'lavender-towels',
    name: 'Signature Lavender Towels (Batch #4)',
    statusText: 'Stock levels optimal (18 units)',
    severity: 'ok',
    ordered: true,
  },
];

function buildSmoothPath(points) {
  if (points.length === 0) return '';
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const curr = points[i];
    const next = points[i + 1];
    const cx = (curr.x + next.x) / 2;
    d += ` C ${cx} ${curr.y}, ${cx} ${next.y}, ${next.x} ${next.y}`;
  }
  return d;
}

export default function AdminDashboardPage() {
  const [timeframe, setTimeframe] = useState('Today');
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const [queue, setQueue] = useState(INITIAL_QUEUE);
  const [notes, setNotes] = useState(INITIAL_NOTES);
  const [newNote, setNewNote] = useState('');
  const [stock, setStock] = useState(INITIAL_STOCK);
  const [exportNotice, setExportNotice] = useState(false);

  const flow = FLOW_DATASETS[timeframe];

  const svgW = 540;
  const svgH = 220;
  const padX = 24;
  const padTop = 26;
  const padBottom = 18;
  const plotW = svgW - padX * 2;
  const plotH = svgH - padTop - padBottom;

  const chartPoints = flow.values.map((val, idx) => ({
    x: padX + (idx / (flow.values.length - 1)) * plotW,
    y: padTop + plotH - (val / 100) * plotH,
    label: flow.labels[idx],
    amount: flow.amounts[idx],
  }));

  const linePath = buildSmoothPath(chartPoints);
  const areaPath = `${linePath} L ${chartPoints[chartPoints.length - 1].x} ${svgH - padBottom} L ${chartPoints[0].x} ${svgH - padBottom} Z`;

  const handleToggleCheckIn = (id) => {
    setQueue((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, checkedIn: !item.checkedIn } : item
      )
    );
  };

  const handlePostNote = async (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    const text = newNote.trim();
    await createStaffNote({
      area: 'Owner Desk',
      author_name: 'By Admin',
      body: text,
      accent_color: 'sage',
    });
    setNotes((prev) => [
      {
        id: `note-${Date.now()}`,
        area: 'Owner Desk',
        time: 'Just now',
        author: 'By Admin',
        accent: 'border-l-[#4A5B4B]',
        body: text,
      },
      ...prev,
    ]);
    setNewNote('');
  };

  const handleReorder = (id) => {
    setStock((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ordered: true } : item))
    );
  };

  const handleExport = () => {
    setExportNotice(true);
    setTimeout(() => setExportNotice(false), 2500);
  };

  return (
    <div className="mx-auto max-w-6xl space-y-7">
      {/* ================= PAGE HEADER ================= */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-[10px] font-semibold tracking-[0.24em] text-[#6B786A] uppercase">
            Sanctuary Operations
          </p>
          <h1 className="mt-1 font-serif text-3xl font-semibold text-[#2A2927] sm:text-[38px]">
            Daily Overview &amp; Control
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-xl border border-[#E5E1D8] bg-[#FAF8F5] px-4 py-2.5 text-[12px] font-medium text-[#2A2927] shadow-2xs"
          >
            <Calendar className="h-3.5 w-3.5 text-[#4A5B4B]" />
            <span>Today, Nov 23</span>
          </button>

          <button
            type="button"
            onClick={handleExport}
            className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-[#253026] px-4 py-2.5 text-[12px] font-medium tracking-wide text-[#FAF8F5] shadow-sm transition-colors hover:bg-[#3B4A3C]"
          >
            <Download className="h-3.5 w-3.5 text-[#EFE0C6]" />
            <span>
              {exportNotice ? 'Report Exported!' : 'Export Daily Report'}
            </span>
          </button>
        </div>
      </div>

      {/* ================= 4 EXECUTIVE KPI CARDS ================= */}
      <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {/* Featured Dark-Sage Revenue KPI */}
        <article className="relative overflow-hidden rounded-[22px] bg-[#253026] p-6 text-[#FAF8F5] shadow-lg">
          <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-[#EFE0C6]/15 blur-xl" />
          <div className="relative z-10 flex items-start justify-between">
            <p className="text-[10px] font-semibold tracking-[0.18em] text-[#C9D2CA] uppercase">
              Today&rsquo;s Revenue
            </p>
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-[#EFE0C6]">
              <Wallet className="h-4 w-4" strokeWidth={1.7} />
            </span>
          </div>
          <p className="relative z-10 mt-3 font-serif text-[28px] font-semibold leading-tight text-[#FAF8F5]">
            LKR 148,500
          </p>
          <p className="relative z-10 mt-3 inline-flex items-center gap-1 rounded-full bg-[#EFE0C6]/15 px-2.5 py-0.5 text-[11px] font-semibold text-[#EFE0C6]">
            <TrendingUp className="h-3 w-3" />
            <span>+12.4% vs yesterday</span>
          </p>
        </article>

        {/* KPI 2: Confirmed Appts */}
        <article className="rounded-[22px] border border-[#E6E2DA] bg-[#FAF8F5] p-6 shadow-2xs transition-all hover:-translate-y-0.5 hover:shadow-md">
          <div className="flex items-start justify-between">
            <p className="text-[10px] font-semibold tracking-[0.18em] text-[#7A766E] uppercase">
              Confirmed Appts
            </p>
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[#EEF2EE] text-[#4A5B4B]">
              <Calendar className="h-4 w-4" strokeWidth={1.7} />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <p className="font-serif text-[30px] font-semibold leading-tight text-[#2A2927]">
              24
            </p>
            <span className="text-[11px] text-[#7A766E]">Total</span>
          </div>
          <p className="mt-3 text-[11.5px] text-[#6C6961]">
            <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-[#4A5B4B]" />
            4 walk-ins registered
          </p>
        </article>

        {/* KPI 3: Specialist Utilization */}
        <article className="rounded-[22px] border border-[#E6E2DA] bg-[#FAF8F5] p-6 shadow-2xs transition-all hover:-translate-y-0.5 hover:shadow-md">
          <div className="flex items-start justify-between">
            <p className="text-[10px] font-semibold tracking-[0.18em] text-[#7A766E] uppercase">
              Specialist Utilization
            </p>
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[#EEF2EE] text-[#4A5B4B]">
              <Users className="h-4 w-4" strokeWidth={1.7} />
            </span>
          </div>
          <p className="mt-3 font-serif text-[30px] font-semibold leading-tight text-[#2A2927]">
            86%
          </p>
          <div className="mt-3">
            <div className="h-2 w-full overflow-hidden rounded-full bg-[#ECE8E0]">
              <div className="h-full w-[86%] rounded-full bg-gradient-to-r from-[#4A5B4B] to-[#7D947F]" />
            </div>
            <p className="mt-1.5 text-[11px] text-[#7A766E]">
              8 of 9 active today
            </p>
          </div>
        </article>

        {/* KPI 4: Bridal Quotes */}
        <article className="rounded-[22px] border border-[#E6E2DA] bg-[#FAF8F5] p-6 shadow-2xs transition-all hover:-translate-y-0.5 hover:shadow-md">
          <div className="flex items-start justify-between">
            <p className="text-[10px] font-semibold tracking-[0.18em] text-[#7A766E] uppercase">
              Bridal Quotes
            </p>
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[#F5EBDC] text-[#8E6F3E]">
              <Heart className="h-4 w-4" strokeWidth={1.7} />
            </span>
          </div>
          <p className="mt-3 font-serif text-[28px] font-semibold leading-tight text-[#2A2927]">
            4 Pending
          </p>
          <Link
            to="/admin/bridal"
            className="mt-3 inline-flex items-center gap-1 text-[11.5px] font-semibold text-[#8E6F3E] hover:underline"
          >
            <AlertCircle className="h-3.5 w-3.5" />
            <span>Review inquiries &rarr;</span>
          </Link>
        </article>
      </section>

      {/* ================= MIDDLE: REVENUE CHART + ARRIVING NEXT ================= */}
      <section
        id="analytics"
        className="grid grid-cols-1 gap-6 xl:grid-cols-12"
      >
        {/* Left: Hourly Revenue & Flow */}
        <div className="flex flex-col justify-between rounded-[24px] border border-[#E6E2DA] bg-[#FAF8F5] p-6 shadow-2xs xl:col-span-7">
          <div>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 className="font-serif text-[23px] font-semibold text-[#2A2927]">
                  Hourly Revenue &amp; Flow
                </h2>
                <p className="mt-0.5 text-[12px] text-[#7A766E]">
                  Real-time tracking of sanctuary transactional volume
                </p>
              </div>

              <div className="inline-flex rounded-full border border-[#E5E1D8] bg-[#F3F0EA] p-1 text-[11px]">
                {Object.keys(FLOW_DATASETS).map((key) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setTimeframe(key)}
                    className={`cursor-pointer rounded-full px-3.5 py-1 font-medium transition-colors ${
                      timeframe === key
                        ? 'bg-[#4A5B4B] text-[#FAF8F5] shadow-2xs'
                        : 'text-[#6C6961] hover:text-[#2A2927]'
                    }`}
                  >
                    {key}
                  </button>
                ))}
              </div>
            </div>

            {/* Peak, Average & Service Mix */}
            <div className="mt-6 grid grid-cols-2 gap-4 rounded-2xl border border-[#EFECE6] bg-[#F6F4EF] p-4 sm:grid-cols-3">
              <div>
                <p className="text-[10.5px] font-medium text-[#7A766E]">
                  Peak Hour
                </p>
                <p className="mt-0.5 font-serif text-[17px] font-semibold text-[#2A2927]">
                  {flow.peakHour}
                </p>
              </div>
              <div>
                <p className="text-[10.5px] font-medium text-[#7A766E]">
                  Average Ticket
                </p>
                <p className="mt-0.5 font-serif text-[17px] font-semibold text-[#2A2927]">
                  {flow.avgTicket}
                </p>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <p className="text-[10.5px] font-medium text-[#7A766E]">
                  Revenue Mix
                </p>
                <div className="mt-2 flex h-2 overflow-hidden rounded-full bg-[#E5E1D8]">
                  {SERVICE_MIX.map((m) => (
                    <span
                      key={m.label}
                      style={{ width: `${m.percent}%` }}
                      className={m.color}
                      title={`${m.label}: ${m.percent}%`}
                    />
                  ))}
                </div>
                <p className="mt-1 text-[10px] text-[#7A766E]">
                  Hair 54% &bull; Skin 26% &bull; Bridal 20%
                </p>
              </div>
            </div>
          </div>

          {/* Smooth SVG Area Chart */}
          <div className="mt-6">
            <svg
              viewBox={`0 0 ${svgW} ${svgH}`}
              className="h-56 w-full overflow-visible"
              role="img"
              aria-label="Hourly revenue trend chart"
            >
              <defs>
                <linearGradient id="sageAreaFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4A5B4B" stopOpacity="0.32" />
                  <stop offset="100%" stopColor="#4A5B4B" stopOpacity="0.02" />
                </linearGradient>
              </defs>

              {/* Subtle Horizontal Grid Lines */}
              {[0.25, 0.5, 0.75, 1].map((ratio) => (
                <line
                  key={ratio}
                  x1={padX}
                  x2={svgW - padX}
                  y1={padTop + plotH * ratio}
                  y2={padTop + plotH * ratio}
                  stroke="#ECE8E0"
                  strokeDasharray="4 4"
                />
              ))}

              <path d={areaPath} fill="url(#sageAreaFill)" />
              <path
                d={linePath}
                fill="none"
                stroke="#4A5B4B"
                strokeWidth="2.5"
                strokeLinecap="round"
              />

              {chartPoints.map((pt, idx) => (
                <g
                  key={pt.label}
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                  className="cursor-pointer"
                >
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={hoveredIdx === idx ? 6 : 4.5}
                    fill="#FAF8F5"
                    stroke="#4A5B4B"
                    strokeWidth="2.2"
                  />
                  {hoveredIdx === idx && (
                    <g transform={`translate(${pt.x}, ${pt.y - 16})`}>
                      <rect
                        x="-44"
                        y="-22"
                        width="88"
                        height="24"
                        rx="8"
                        fill="#222B23"
                      />
                      <text
                        x="0"
                        y="-7"
                        textAnchor="middle"
                        fill="#EFE0C6"
                        fontSize="10.5"
                        fontWeight="600"
                      >
                        {pt.amount}
                      </text>
                    </g>
                  )}
                </g>
              ))}
            </svg>

            <div className="mt-2 flex items-center justify-between px-2 text-[10.5px] font-medium text-[#7A766E]">
              {flow.labels.map((label) => (
                <span key={label}>{label}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Arriving Next Live Queue */}
        <div className="flex flex-col justify-between rounded-[24px] border border-[#E6E2DA] bg-[#FAF8F5] p-6 shadow-2xs xl:col-span-5">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#4A5B4B] opacity-60" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#4A5B4B]" />
                </span>
                <h2 className="font-serif text-[22px] font-semibold text-[#2A2927]">
                  Arriving Next
                </h2>
              </div>
              <span className="rounded-full bg-[#EEF2EE] px-3 py-1 text-[9.5px] font-semibold tracking-[0.16em] text-[#4A5B4B] uppercase">
                Live Queue
              </span>
            </div>

            <p className="mt-1.5 text-[12px] leading-relaxed text-[#7A766E]">
              Upcoming appointments requiring desk attention or immediate
              coordination.
            </p>

            <div className="mt-5 space-y-3.5">
              {queue.map((item) => (
                <article
                  key={item.id}
                  className="rounded-2xl border border-[#ECE8E0] bg-[#F6F4EF] p-4 transition-colors hover:border-[#DCD7CC]"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-[#4A5B4B]">
                      {item.time}
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${item.badgeClass}`}
                    >
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="mt-1.5 font-serif text-[18px] font-semibold text-[#2A2927]">
                    {item.client}
                  </h3>
                  <p className="text-[11.5px] text-[#6C6961]">
                    {item.service} &bull; {item.specialist}
                  </p>

                  <div className="mt-3.5 flex items-center justify-end gap-2">
                    <Link
                      to="/admin/appointments"
                      className="rounded-full border border-[#DCD7CC] bg-[#FAF8F5] px-3.5 py-1.5 text-[11px] font-medium text-[#4A4741] transition-colors hover:bg-[#EFECE6]"
                    >
                      View Details
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleToggleCheckIn(item.id)}
                      className={`inline-flex cursor-pointer items-center gap-1 rounded-full px-4 py-1.5 text-[11px] font-semibold transition-colors ${
                        item.checkedIn
                          ? 'bg-[#D5E8D7] text-[#355A3A]'
                          : 'bg-[#4A5B4B] text-[#FAF8F5] hover:bg-[#3B4A3C]'
                      }`}
                    >
                      {item.checkedIn && <Check className="h-3 w-3" />}
                      <span>{item.checkedIn ? 'Checked In' : 'Check In'}</span>
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="mt-5 border-t border-[#ECE8E0] pt-4 text-center">
            <Link
              to="/admin/appointments"
              className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#4A5B4B] transition-colors hover:text-[#2A2927]"
            >
              <span>View complete daily schedule</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ================= BOTTOM: STAFF NOTES + INVENTORY ================= */}
      <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* Staff Notes */}
        <div className="flex flex-col justify-between rounded-[24px] border border-[#E6E2DA] bg-[#FAF8F5] p-6 shadow-2xs">
          <div>
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-[22px] font-semibold text-[#2A2927]">
                Staff Notes &amp; Directives
              </h2>
              <ClipboardList
                className="h-4 w-4 text-[#4A5B4B]"
                strokeWidth={1.7}
              />
            </div>
            <p className="mt-1 text-[12px] text-[#7A766E]">
              Internal handover notes for the afternoon and evening shift
              rotation.
            </p>

            <div className="mt-5 space-y-3.5">
              {notes.map((note) => (
                <article
                  key={note.id}
                  className={`rounded-2xl border border-[#ECE8E0] border-l-[3.5px] bg-[#F6F4EF] p-4 ${note.accent}`}
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-[#2A2927]">
                      {note.area} &bull; {note.time}
                    </span>
                    <span className="text-[#8A867E]">{note.author}</span>
                  </div>
                  <p className="mt-1.5 text-[12.5px] leading-relaxed text-[#57544E]">
                    {note.body}
                  </p>
                </article>
              ))}
            </div>
          </div>

          <form onSubmit={handlePostNote} className="mt-5 flex gap-2.5">
            <input
              type="text"
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Add quick shift note..."
              className="flex-1 rounded-xl border border-[#E4E0D8] bg-[#F6F4EF] px-4 py-2.5 text-[12px] text-[#2A2927] placeholder:text-[#9A958C] focus:border-[#4A5B4B] focus:bg-[#FAF8F5] focus:outline-none"
            />
            <button
              type="submit"
              className="cursor-pointer rounded-xl bg-[#4A5B4B] px-5 py-2.5 text-[12px] font-semibold text-[#FAF8F5] transition-colors hover:bg-[#3B4A3C]"
            >
              Post
            </button>
          </form>
        </div>

        {/* Inventory & Botanical Stock */}
        <div className="flex flex-col justify-between rounded-[24px] border border-[#E6E2DA] bg-[#FAF8F5] p-6 shadow-2xs">
          <div>
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-[22px] font-semibold text-[#2A2927]">
                Inventory &amp; Botanical Stock
              </h2>
              <Package className="h-4 w-4 text-[#4A5B4B]" strokeWidth={1.7} />
            </div>
            <p className="mt-1 text-[12px] text-[#7A766E]">
              Low stock warnings and automatic restock suggestions for salon
              exclusives.
            </p>

            <div className="mt-5 space-y-3.5">
              {stock.map((item) => (
                <article
                  key={item.id}
                  className="flex items-center justify-between gap-4 rounded-2xl border border-[#ECE8E0] bg-[#F6F4EF] px-4 py-3.5"
                >
                  <div className="flex items-center gap-3.5">
                    {item.severity === 'critical' && (
                      <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F4E1DE] text-[#B64B42]">
                        <AlertTriangle className="h-4 w-4" />
                      </span>
                    )}
                    {item.severity === 'warning' && (
                      <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F2E9D8] text-[#8E6F3E]">
                        <AlertCircle className="h-4 w-4" />
                      </span>
                    )}
                    {item.severity === 'ok' && (
                      <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#E5ECE6] text-[#4A5B4B]">
                        <CheckCircle2 className="h-4 w-4" />
                      </span>
                    )}

                    <div>
                      <p className="text-[13px] font-semibold text-[#2A2927]">
                        {item.name}
                      </p>
                      <p className="mt-0.5 text-[11px] text-[#7A766E]">
                        {item.statusText}
                      </p>
                    </div>
                  </div>

                  {item.severity === 'ok' ? (
                    <span className="shrink-0 rounded-full bg-[#E5ECE6] px-3 py-1 text-[10.5px] font-semibold text-[#355A3A]">
                      Optimal
                    </span>
                  ) : item.ordered ? (
                    <span className="shrink-0 rounded-full bg-[#E5ECE6] px-3.5 py-1.5 text-[11px] font-semibold text-[#4A5B4B]">
                      Ordered
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleReorder(item.id)}
                      className="shrink-0 cursor-pointer rounded-full border border-[#DCD7CC] bg-[#FAF8F5] px-4 py-1.5 text-[11px] font-semibold text-[#2A2927] transition-colors hover:bg-[#4A5B4B] hover:text-[#FAF8F5]"
                    >
                      Reorder
                    </button>
                  )}
                </article>
              ))}
            </div>
          </div>

          <div className="mt-5 flex items-center justify-between border-t border-[#ECE8E0] pt-4 text-[11.5px]">
            <span className="text-[#8A867E]">All dispensary sensors active</span>
            <Link
              to="/admin/services"
              className="inline-flex items-center gap-1 font-semibold text-[#4A5B4B] transition-colors hover:text-[#2A2927]"
            >
              <span>Manage inventory catalog</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
