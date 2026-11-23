import { useMemo, useState } from 'react';
import {
  ArrowUpRight,
  Award,
  BarChart3,
  Calendar,
  Check,
  Clock,
  Crown,
  Download,
  Repeat,
  Sparkles,
  Star,
  TrendingUp,
  Wallet,
} from 'lucide-react';

import specialistElena from '../../assets/specialist-elena.jpg';
import specialistAmara from '../../assets/specialist-amara.jpg';
import specialistJulian from '../../assets/specialist-julian.jpg';
import founderVera from '../../assets/founder-vera.jpg';

const PERIOD_DATA = {
  '7D': {
    label: 'Last 7 Days',
    revenue: 984500,
    revenueDelta: '+14.2%',
    avgTicket: 7420,
    avgTicketDelta: '+6.1%',
    retention: 84.6,
    retentionDelta: '+2.4%',
    bridalRetailShare: 34,
    bookingsTotal: 132,
    series: [
      { label: 'Tue', revenue: 112000, bookings: 16 },
      { label: 'Wed', revenue: 128500, bookings: 18 },
      { label: 'Thu', revenue: 148500, bookings: 21 },
      { label: 'Fri', revenue: 176000, bookings: 24 },
      { label: 'Sat', revenue: 245000, bookings: 31 },
      { label: 'Sun', revenue: 174500, bookings: 22 },
    ],
    categories: [
      { name: 'Hair & Botanical Color', pct: 46, amount: 452870, color: '#EFE0C6' },
      { name: 'Bridal Atelier', pct: 24, amount: 236280, color: '#8FA992' },
      { name: 'Holistic Facials', pct: 20, amount: 196900, color: '#C8A870' },
      { name: 'Retail Exclusives', pct: 10, amount: 98450, color: '#586E5A' },
    ],
  },
  '30D': {
    label: 'Last 30 Days',
    revenue: 4185000,
    revenueDelta: '+18.4%',
    avgTicket: 7850,
    avgTicketDelta: '+8.3%',
    retention: 86.2,
    retentionDelta: '+3.1%',
    bridalRetailShare: 38,
    bookingsTotal: 533,
    series: [
      { label: 'W1', revenue: 890000, bookings: 118 },
      { label: 'W2', revenue: 965000, bookings: 126 },
      { label: 'W3', revenue: 1140000, bookings: 142 },
      { label: 'W4', revenue: 1190000, bookings: 147 },
    ],
    categories: [
      { name: 'Hair & Botanical Color', pct: 44, amount: 1841400, color: '#EFE0C6' },
      { name: 'Bridal Atelier', pct: 27, amount: 1129950, color: '#8FA992' },
      { name: 'Holistic Facials', pct: 18, amount: 753300, color: '#C8A870' },
      { name: 'Retail Exclusives', pct: 11, amount: 460350, color: '#586E5A' },
    ],
  },
  '90D': {
    label: 'This Quarter',
    revenue: 12460000,
    revenueDelta: '+22.7%',
    avgTicket: 8190,
    avgTicketDelta: '+10.5%',
    retention: 87.9,
    retentionDelta: '+4.0%',
    bridalRetailShare: 41,
    bookingsTotal: 1521,
    series: [
      { label: 'Sep', revenue: 3780000, bookings: 472 },
      { label: 'Oct', revenue: 4195000, bookings: 511 },
      { label: 'Nov', revenue: 4485000, bookings: 538 },
    ],
    categories: [
      { name: 'Hair & Botanical Color', pct: 42, amount: 5233200, color: '#EFE0C6' },
      { name: 'Bridal Atelier', pct: 30, amount: 3738000, color: '#8FA992' },
      { name: 'Holistic Facials', pct: 17, amount: 2118200, color: '#C8A870' },
      { name: 'Retail Exclusives', pct: 11, amount: 1370600, color: '#586E5A' },
    ],
  },
  '1Y': {
    label: 'Full Year',
    revenue: 46820000,
    revenueDelta: '+29.1%',
    avgTicket: 8450,
    avgTicketDelta: '+12.8%',
    retention: 89.4,
    retentionDelta: '+5.2%',
    bridalRetailShare: 43,
    bookingsTotal: 5540,
    series: [
      { label: 'Q1', revenue: 9850000, bookings: 1190 },
      { label: 'Q2', revenue: 11240000, bookings: 1340 },
      { label: 'Q3', revenue: 12310000, bookings: 1455 },
      { label: 'Q4', revenue: 13420000, bookings: 1555 },
    ],
    categories: [
      { name: 'Hair & Botanical Color', pct: 41, amount: 19196200, color: '#EFE0C6' },
      { name: 'Bridal Atelier', pct: 31, amount: 14514200, color: '#8FA992' },
      { name: 'Holistic Facials', pct: 16, amount: 7491200, color: '#C8A870' },
      { name: 'Retail Exclusives', pct: 12, amount: 5618400, color: '#586E5A' },
    ],
  },
};

const SPECIALIST_PERFORMANCE = [
  {
    id: 'elena',
    name: 'Elena Rostova',
    role: 'Senior Botanical Colorist',
    avatar: specialistElena,
    revenue: 1425000,
    bookings: 148,
    utilization: 94,
    rebookRate: 91,
    rating: 4.98,
  },
  {
    id: 'julian',
    name: 'Julian Vance',
    role: 'Master Stylist & Bridal Lead',
    avatar: specialistJulian,
    revenue: 1280000,
    bookings: 112,
    utilization: 89,
    rebookRate: 88,
    rating: 4.96,
  },
  {
    id: 'amara',
    name: 'Amara Thorne',
    role: 'Holistic Skin & Bridal Expert',
    avatar: specialistAmara,
    revenue: 965000,
    bookings: 134,
    utilization: 86,
    rebookRate: 85,
    rating: 5.0,
  },
  {
    id: 'clara',
    name: 'Clara Vance',
    role: 'Botanical Nail & Spa Artist',
    avatar: founderVera,
    revenue: 515000,
    bookings: 139,
    utilization: 78,
    rebookRate: 82,
    rating: 4.92,
  },
];

const TOP_RITUALS = [
  {
    name: 'Organic Botanical Balayage',
    category: 'Hair & Color',
    bookings: 64,
    revenue: 1184000,
    growth: '+19%',
  },
  {
    name: 'Complete Bridal Sanctuary Suite',
    category: 'Bridal',
    bookings: 12,
    revenue: 1020000,
    growth: '+28%',
  },
  {
    name: 'Cell-Renewal Botanical Facial',
    category: 'Facials',
    bookings: 98,
    revenue: 784000,
    growth: '+14%',
  },
  {
    name: 'Organic Botanical Hair Glossing',
    category: 'Hair & Color',
    bookings: 86,
    revenue: 559000,
    growth: '+11%',
  },
];

const PEAK_DEMAND = [
  { day: 'Tue', slots: [42, 68, 55] },
  { day: 'Wed', slots: [48, 72, 60] },
  { day: 'Thu', slots: [58, 82, 74] },
  { day: 'Fri', slots: [70, 92, 86] },
  { day: 'Sat', slots: [94, 100, 88] },
  { day: 'Sun', slots: [78, 86, 62] },
];

function formatCompactLKR(val) {
  if (val >= 1000000) return `LKR ${(val / 1000000).toFixed(2)}M`;
  if (val >= 1000) return `LKR ${(val / 1000).toFixed(0)}k`;
  return `LKR ${val}`;
}

export default function AdminAnalyticsPage() {
  const [period, setPeriod] = useState('30D');
  const [chartMetric, setChartMetric] = useState('revenue'); // 'revenue' | 'bookings'
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const [exported, setExported] = useState(false);

  const current = PERIOD_DATA[period];

  const chartGeometry = useMemo(() => {
    const width = 620;
    const height = 220;
    const padX = 34;
    const padTop = 24;
    const padBottom = 30;
    const usableW = width - padX * 2;
    const usableH = height - padTop - padBottom;

    const values = current.series.map((s) =>
      chartMetric === 'revenue' ? s.revenue : s.bookings
    );
    const maxVal = Math.max(...values) * 1.15;

    const pts = current.series.map((s, idx) => {
      const x =
        current.series.length === 1
          ? width / 2
          : padX + (idx / (current.series.length - 1)) * usableW;
      const val = chartMetric === 'revenue' ? s.revenue : s.bookings;
      const y = padTop + usableH - (val / maxVal) * usableH;
      return { x, y, ...s };
    });

    const linePath = pts
      .map((p, i) => {
        if (i === 0) return `M ${p.x} ${p.y}`;
        const prev = pts[i - 1];
        const cx = (prev.x + p.x) / 2;
        return `C ${cx} ${prev.y}, ${cx} ${p.y}, ${p.x} ${p.y}`;
      })
      .join(' ');

    const areaPath = `${linePath} L ${pts[pts.length - 1].x} ${height - padBottom} L ${pts[0].x} ${height - padBottom} Z`;

    return { width, height, padBottom, pts, linePath, areaPath };
  }, [current, chartMetric]);

  // Donut segments (circumference for r=54 is ~339.29)
  const donutSegments = useMemo(() => {
    const radius = 54;
    const circ = 2 * Math.PI * radius;
    let offset = 0;
    return current.categories.map((cat) => {
      const dash = (cat.pct / 100) * circ;
      const seg = {
        ...cat,
        dashArray: `${dash} ${circ - dash}`,
        dashOffset: -offset,
      };
      offset += dash;
      return seg;
    });
  }, [current]);

  const handleExportCsv = () => {
    const rows = [
      ['Period', 'Revenue (LKR)', 'Bookings'],
      ...current.series.map((s) => [s.label, s.revenue, s.bookings]),
    ];
    const csv = rows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vera-bloom-analytics-${period.toLowerCase()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    setExported(true);
    setTimeout(() => setExported(false), 2400);
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* ================= EXECUTIVE HEADER + PERIOD CONTROLS ================= */}
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <p className="text-[10.5px] font-semibold tracking-[0.22em] text-[#7A766E] uppercase">
            Sanctuary Intelligence
          </p>
          <h1 className="mt-1 font-serif text-[30px] font-normal tracking-tight text-[#222B23] sm:text-[34px]">
            Business Analytics &amp; Growth
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Period Segmented Switcher */}
          <div className="inline-flex rounded-full border border-[#E6E2DA] bg-[#FAF8F5] p-1 text-[11.5px] shadow-2xs">
            {['7D', '30D', '90D', '1Y'].map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => {
                  setPeriod(key);
                  setHoveredIdx(null);
                }}
                className={`cursor-pointer rounded-full px-3.5 py-1.5 font-medium transition-all ${
                  period === key
                    ? 'bg-[#253026] text-[#FAF8F5] shadow-xs'
                    : 'text-[#6C6961] hover:text-[#222B23]'
                }`}
              >
                {key}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleExportCsv}
            className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-[#253026] px-5 py-2.5 text-[12px] font-medium tracking-wide text-[#FAF8F5] shadow-sm transition-all hover:bg-[#344335]"
          >
            {exported ? (
              <>
                <Check className="h-3.5 w-3.5 text-[#EFE0C6]" />
                <span>Report Exported</span>
              </>
            ) : (
              <>
                <Download className="h-3.5 w-3.5 text-[#EFE0C6]" />
                <span>Export CSV</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* ================= 4 EXECUTIVE KPI CARDS ================= */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {/* Featured Dark-Sage Revenue Card */}
        <article className="relative overflow-hidden rounded-[22px] border border-[#344335] bg-[#253026] p-5 text-[#FAF8F5] shadow-md">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-semibold tracking-[0.18em] text-[#A8B8AA] uppercase">
              Gross Revenue ({current.label})
            </p>
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/10 text-[#EFE0C6]">
              <Wallet className="h-4 w-4" />
            </span>
          </div>
          <p className="mt-3 font-serif text-[28px] font-semibold leading-tight text-[#FAF8F5]">
            {formatCompactLKR(current.revenue)}
          </p>
          <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-semibold text-[#EFE0C6]">
            <TrendingUp className="h-3 w-3" />
            <span>{current.revenueDelta} vs prior period</span>
          </div>
        </article>

        {/* Avg Ticket Value */}
        <article className="rounded-[22px] border border-[#E6E2DA] bg-[#FAF8F5] p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-semibold tracking-[0.18em] text-[#8A867E] uppercase">
              Avg. Client Ticket
            </p>
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#F3F0EA] text-[#4A5B4B]">
              <Sparkles className="h-4 w-4" />
            </span>
          </div>
          <p className="mt-3 font-serif text-[28px] font-semibold leading-tight text-[#222B23]">
            LKR {current.avgTicket.toLocaleString('en-US')}
          </p>
          <p className="mt-3 inline-flex items-center gap-1 text-[11.5px] font-medium text-[#285431]">
            <ArrowUpRight className="h-3.5 w-3.5" />
            <span>{current.avgTicketDelta} across {current.bookingsTotal} visits</span>
          </p>
        </article>

        {/* Client Retention */}
        <article className="rounded-[22px] border border-[#E6E2DA] bg-[#FAF8F5] p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-semibold tracking-[0.18em] text-[#8A867E] uppercase">
              Client Retention
            </p>
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#F3F0EA] text-[#4A5B4B]">
              <Repeat className="h-4 w-4" />
            </span>
          </div>
          <p className="mt-3 font-serif text-[28px] font-semibold leading-tight text-[#222B23]">
            {current.retention}%
          </p>
          <div className="mt-3">
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#ECE8E0]">
              <div
                className="h-full rounded-full bg-[#4A5B4B]"
                style={{ width: `${current.retention}%` }}
              />
            </div>
            <p className="mt-1.5 text-[11px] text-[#6C6961]">
              {current.retentionDelta} repeat sanctuary guests
            </p>
          </div>
        </article>

        {/* Bridal & Retail Share */}
        <article className="rounded-[22px] border border-[#E6E2DA] bg-[#FAF8F5] p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-semibold tracking-[0.18em] text-[#8A867E] uppercase">
              Bridal &amp; Retail Share
            </p>
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#F5E8D0] text-[#7A5E34]">
              <Crown className="h-4 w-4" />
            </span>
          </div>
          <p className="mt-3 font-serif text-[28px] font-semibold leading-tight text-[#222B23]">
            {current.bridalRetailShare}%
          </p>
          <p className="mt-3 text-[11.5px] text-[#6C6961]">
            High-margin suites &amp; botanical retail
          </p>
        </article>
      </section>

      {/* ================= REVENUE TREND CHART + CATEGORY MIX DONUT ================= */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        {/* Left: Smooth Area Revenue & Bookings Chart */}
        <section className="rounded-[24px] border border-[#E6E2DA] bg-[#FAF8F5] p-6 shadow-2xs xl:col-span-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-serif text-[21px] font-semibold text-[#222B23]">
                Revenue &amp; Booking Velocity
              </h2>
              <p className="mt-0.5 text-[11.5px] text-[#7A766E]">
                Interactive performance curve for {current.label.toLowerCase()}
              </p>
            </div>

            <div className="inline-flex rounded-full border border-[#E6E2DA] bg-[#F3F0EA] p-1 text-[11px]">
              <button
                type="button"
                onClick={() => setChartMetric('revenue')}
                className={`cursor-pointer rounded-full px-3.5 py-1 font-medium transition-all ${
                  chartMetric === 'revenue'
                    ? 'bg-[#253026] text-[#FAF8F5]'
                    : 'text-[#6C6961] hover:text-[#222B23]'
                }`}
              >
                Revenue (LKR)
              </button>
              <button
                type="button"
                onClick={() => setChartMetric('bookings')}
                className={`cursor-pointer rounded-full px-3.5 py-1 font-medium transition-all ${
                  chartMetric === 'bookings'
                    ? 'bg-[#253026] text-[#FAF8F5]'
                    : 'text-[#6C6961] hover:text-[#222B23]'
                }`}
              >
                Bookings
              </button>
            </div>
          </div>

          {/* Interactive Highlight Banner */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-[#F5F2EC] px-4 py-2.5 text-[12px]">
            <span className="inline-flex items-center gap-2 text-[#57544E]">
              <BarChart3 className="h-3.5 w-3.5 text-[#4A5B4B]" />
              {hoveredIdx !== null ? (
                <>
                  <strong className="text-[#222B23]">
                    {current.series[hoveredIdx].label}:
                  </strong>{' '}
                  LKR{' '}
                  {current.series[hoveredIdx].revenue.toLocaleString('en-US')} •{' '}
                  {current.series[hoveredIdx].bookings} appointments
                </>
              ) : (
                <span>Hover any point on the curve to inspect period details</span>
              )}
            </span>
            <span className="font-serif text-[13.5px] font-semibold text-[#222B23]">
              Total: LKR {current.revenue.toLocaleString('en-US')}
            </span>
          </div>

          {/* SVG Area Chart */}
          <div className="mt-4 w-full overflow-x-auto">
            <svg
              viewBox={`0 0 ${chartGeometry.width} ${chartGeometry.height}`}
              className="h-[230px] w-full min-w-[440px]"
            >
              <defs>
                <linearGradient id="analyticsAreaFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#253026" stopOpacity="0.24" />
                  <stop offset="100%" stopColor="#253026" stopOpacity="0.01" />
                </linearGradient>
              </defs>

              {/* Dashed Gridlines */}
              {[0.25, 0.5, 0.75, 1].map((frac) => {
                const y = 24 + frac * (chartGeometry.height - 54);
                return (
                  <line
                    key={frac}
                    x1="28"
                    y1={y}
                    x2={chartGeometry.width - 28}
                    y2={y}
                    stroke="#E8E4DC"
                    strokeDasharray="4 4"
                    strokeWidth="1"
                  />
                );
              })}

              {/* Area + Smooth Line */}
              <path d={chartGeometry.areaPath} fill="url(#analyticsAreaFill)" />
              <path
                d={chartGeometry.linePath}
                fill="none"
                stroke="#253026"
                strokeWidth="2.6"
                strokeLinecap="round"
              />

              {/* Interactive Data Points */}
              {chartGeometry.pts.map((pt, idx) => {
                const isHover = hoveredIdx === idx;
                return (
                  <g
                    key={pt.label}
                    onMouseEnter={() => setHoveredIdx(idx)}
                    onMouseLeave={() => setHoveredIdx(null)}
                    className="cursor-pointer"
                  >
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r={isHover ? 14 : 10}
                      fill="transparent"
                    />
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r={isHover ? 6 : 4.5}
                      fill={isHover ? '#EFE0C6' : '#FAF8F5'}
                      stroke="#253026"
                      strokeWidth="2.5"
                    />
                    <text
                      x={pt.x}
                      y={chartGeometry.height - 8}
                      textAnchor="middle"
                      className="fill-[#7A766E] text-[11px] font-medium"
                    >
                      {pt.label}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </section>

        {/* Right: Signature Dark-Sage Category Revenue Mix */}
        <section className="flex flex-col justify-between rounded-[24px] border border-[#344335] bg-[#253026] p-6 text-[#FAF8F5] shadow-lg xl:col-span-4">
          <div>
            <p className="text-[10px] font-semibold tracking-[0.2em] text-[#A8B8AA] uppercase">
              Revenue Breakdown
            </p>
            <h2 className="mt-0.5 font-serif text-[21px] font-normal text-[#FAF8F5]">
              Category Contribution
            </h2>

            {/* SVG Donut Chart */}
            <div className="relative mx-auto my-5 flex h-40 w-40 items-center justify-center">
              <svg viewBox="0 0 140 140" className="h-full w-full -rotate-90">
                <circle
                  cx="70"
                  cy="70"
                  r="54"
                  fill="none"
                  stroke="rgba(255,255,255,0.08)"
                  strokeWidth="14"
                />
                {donutSegments.map((seg) => (
                  <circle
                    key={seg.name}
                    cx="70"
                    cy="70"
                    r="54"
                    fill="none"
                    stroke={seg.color}
                    strokeWidth="14"
                    strokeDasharray={seg.dashArray}
                    strokeDashoffset={seg.dashOffset}
                  />
                ))}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-[9.5px] font-semibold tracking-wider text-[#A8B8AA] uppercase">
                  Total
                </span>
                <span className="font-serif text-[17px] font-semibold text-[#EFE0C6]">
                  {formatCompactLKR(current.revenue)}
                </span>
              </div>
            </div>
          </div>

          {/* Legend Rows */}
          <div className="space-y-2.5 border-t border-white/10 pt-4 text-[12px]">
            {current.categories.map((cat) => (
              <div
                key={cat.name}
                className="flex items-center justify-between gap-2"
              >
                <div className="flex min-w-0 items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: cat.color }}
                  />
                  <span className="truncate text-[#D0DBD2]">{cat.name}</span>
                </div>
                <div className="flex shrink-0 items-baseline gap-2">
                  <span className="font-semibold text-[#EFE0C6]">
                    {cat.pct}%
                  </span>
                  <span className="text-[10.5px] text-[#9EB0A0]">
                    {formatCompactLKR(cat.amount)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* ================= BOTTOM INSIGHTS: SPECIALISTS + PEAK HOURS & TOP RITUALS ================= */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        {/* Specialist Performance Leaderboard */}
        <section className="rounded-[24px] border border-[#E6E2DA] bg-[#FAF8F5] p-6 shadow-2xs xl:col-span-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif text-[20px] font-semibold text-[#222B23]">
                Specialist Performance
              </h2>
              <p className="mt-0.5 text-[11.5px] text-[#7A766E]">
                Chair utilization, revenue contribution &amp; client rebooking
              </p>
            </div>
            <Award className="h-5 w-5 text-[#B78B43]" />
          </div>

          <div className="mt-5 space-y-4">
            {SPECIALIST_PERFORMANCE.map((spec) => (
              <div
                key={spec.id}
                className="rounded-2xl border border-[#EFECE5] bg-[#F5F2EC] p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <img
                      src={spec.avatar}
                      alt={spec.name}
                      className="h-11 w-11 shrink-0 rounded-full border-2 border-[#FAF8F5] object-cover"
                    />
                    <div className="min-w-0">
                      <p className="truncate font-serif text-[16px] font-semibold text-[#222B23]">
                        {spec.name}
                      </p>
                      <p className="truncate text-[11px] text-[#7A766E]">
                        {spec.role}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="font-serif text-[16px] font-semibold text-[#222B23]">
                      {formatCompactLKR(spec.revenue)}
                    </p>
                    <p className="inline-flex items-center gap-1 text-[10.5px] font-medium text-[#7A5E34]">
                      <Star className="h-3 w-3 fill-[#C8A870] text-[#C8A870]" />
                      {spec.rating.toFixed(2)} • {spec.bookings} appts
                    </p>
                  </div>
                </div>

                <div className="mt-3 flex items-center gap-3">
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#E5E0D7]">
                    <div
                      className="h-full rounded-full bg-[#253026]"
                      style={{ width: `${spec.utilization}%` }}
                    />
                  </div>
                  <span className="text-[10.5px] font-semibold text-[#4A5B4B]">
                    {spec.utilization}% Utilized • {spec.rebookRate}% Rebook
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Right Column: Peak Hours Heatmap + Top Rituals */}
        <div className="space-y-6 xl:col-span-6">
          {/* Peak Sanctuary Hours Matrix */}
          <section className="rounded-[24px] border border-[#E6E2DA] bg-[#FAF8F5] p-6 shadow-2xs">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-serif text-[20px] font-semibold text-[#222B23]">
                  Peak Sanctuary Demand
                </h2>
                <p className="mt-0.5 text-[11.5px] text-[#7A766E]">
                  Chair occupancy intensity by day and session window
                </p>
              </div>
              <Clock className="h-4.5 w-4.5 text-[#4A5B4B]" />
            </div>

            <div className="mt-4">
              <div className="mb-2 grid grid-cols-4 gap-2 text-[10px] font-semibold tracking-wider text-[#8A867E] uppercase">
                <div>Day</div>
                <div className="text-center">Morning</div>
                <div className="text-center">Afternoon</div>
                <div className="text-center">Evening</div>
              </div>

              <div className="space-y-2">
                {PEAK_DEMAND.map((row) => (
                  <div
                    key={row.day}
                    className="grid grid-cols-4 items-center gap-2 text-[11.5px]"
                  >
                    <span className="font-semibold text-[#222B23]">
                      {row.day}
                    </span>
                    {row.slots.map((val, i) => {
                      const tileClass =
                        val >= 90
                          ? 'bg-[#253026] text-[#EFE0C6]'
                          : val >= 75
                            ? 'bg-[#4A5B4B] text-[#FAF8F5]'
                            : val >= 60
                              ? 'bg-[#C9D4CA] text-[#222B23]'
                              : 'bg-[#F0ECE4] text-[#6C6961]';
                      return (
                        <div
                          key={`${row.day}-${i}`}
                          className={`rounded-xl py-1.5 text-center text-[11px] font-semibold ${tileClass}`}
                        >
                          {val}%
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Top Revenue Rituals */}
          <section className="rounded-[24px] border border-[#E6E2DA] bg-[#FAF8F5] p-6 shadow-2xs">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-serif text-[20px] font-semibold text-[#222B23]">
                  Top Revenue Rituals
                </h2>
                <p className="mt-0.5 text-[11.5px] text-[#7A766E]">
                  Highest performing treatments this period
                </p>
              </div>
              <Calendar className="h-4.5 w-4.5 text-[#4A5B4B]" />
            </div>

            <div className="mt-4 divide-y divide-[#EFECE5]">
              {TOP_RITUALS.map((r, idx) => (
                <div
                  key={r.name}
                  className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#F3F0EA] font-serif text-xs font-semibold text-[#222B23]">
                      0{idx + 1}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate font-serif text-[15px] font-semibold text-[#222B23]">
                        {r.name}
                      </p>
                      <p className="text-[11px] text-[#7A766E]">
                        {r.category} • {r.bookings} bookings
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 text-right">
                    <p className="font-serif text-[15px] font-semibold text-[#222B23]">
                      {formatCompactLKR(r.revenue)}
                    </p>
                    <span className="text-[10.5px] font-semibold text-[#285431]">
                      {r.growth}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
