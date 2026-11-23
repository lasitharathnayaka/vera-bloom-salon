import { useMemo, useState } from 'react';
import {
  Award,
  Banknote,
  Check,
  Download,
  HeartHandshake,
  Percent,
  Sparkles,
  TrendingUp,
} from 'lucide-react';

const COMMISSION_LEDGER = [
  {
    id: 'led-1',
    date: '23 Nov 2026',
    initials: 'A.S.',
    treatment: 'Botanical Balayage & Gloss Treatment',
    serviceValue: 45000,
    rate: '30%',
    tip: 2500,
    netEarned: 13500,
  },
  {
    id: 'led-2',
    date: '23 Nov 2026',
    initials: 'D.K.',
    treatment: 'Signature Ayurvedic Scalp Therapy',
    serviceValue: 18000,
    rate: '30%',
    tip: 1500,
    netEarned: 5400,
  },
  {
    id: 'led-3',
    date: '22 Nov 2026',
    initials: 'T.M.',
    treatment: 'Bridal Trial Hair & Makeup Styling',
    serviceValue: 35000,
    rate: '35%',
    tip: 3000,
    netEarned: 12250,
  },
  {
    id: 'led-4',
    date: '21 Nov 2026',
    initials: 'S.R.',
    treatment: 'Root Touch-Up & Organic Toning',
    serviceValue: 22000,
    rate: '30%',
    tip: 1200,
    netEarned: 6600,
  },
  {
    id: 'led-5',
    date: '20 Nov 2026',
    initials: 'H.L.',
    treatment: 'Keratin Botanical Infusion',
    serviceValue: 55000,
    rate: '30%',
    tip: 4000,
    netEarned: 16500,
  },
];

export default function StylistEarningsPage() {
  const [rateFilter, setRateFilter] = useState('all');
  const [exported, setExported] = useState(false);

  const visibleLedger = useMemo(() => {
    if (rateFilter === 'all') return COMMISSION_LEDGER;
    return COMMISSION_LEDGER.filter((row) => row.rate === rateFilter);
  }, [rateFilter]);

  const handleExportCsv = () => {
    const rows = [
      ['Date', 'Client', 'Treatment', 'Service Value (LKR)', 'Rate', 'Tip (LKR)', 'Net Earned (LKR)'],
      ...visibleLedger.map((r) => [
        r.date,
        r.initials,
        `"${r.treatment}"`,
        r.serviceValue,
        r.rate,
        r.tip,
        r.netEarned,
      ]),
    ];
    const csv = rows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'nethmi-earnings-ledger.csv';
    a.click();
    URL.revokeObjectURL(url);
    setExported(true);
    setTimeout(() => setExported(false), 2400);
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* ================= EXECUTIVE HEADER ================= */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-[10.5px] font-semibold tracking-[0.22em] text-[#7A766E] uppercase">
            Compensation &amp; Payouts
          </p>
          <h1 className="mt-1 font-serif text-[30px] font-normal tracking-tight text-[#222B23] sm:text-[34px]">
            Earnings &amp; Tips
          </h1>
        </div>

        <button
          type="button"
          onClick={handleExportCsv}
          className="inline-flex cursor-pointer items-center gap-2 self-start rounded-full bg-[#253026] px-5 py-2.5 text-[12px] font-medium tracking-wide text-[#FAF8F5] shadow-sm transition-all hover:bg-[#344335] sm:self-auto"
        >
          {exported ? (
            <>
              <Check className="h-3.5 w-3.5 text-[#EFE0C6]" />
              <span>CSV Exported</span>
            </>
          ) : (
            <>
              <Download className="h-3.5 w-3.5 text-[#EFE0C6]" />
              <span>Export Ledger CSV</span>
            </>
          )}
        </button>
      </div>

      {/* ================= 3 EARNINGS KPI CARDS ================= */}
      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* Featured Dark-Sage Total Take-Home Payout */}
        <article className="rounded-[22px] border border-[#344335] bg-[#253026] p-6 text-[#FAF8F5] shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold tracking-[0.18em] text-[#A8B8AA] uppercase">
              Earned Commission
            </span>
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/10 text-[#EFE0C6]">
              <Percent className="h-4 w-4" strokeWidth={1.7} />
            </span>
          </div>
          <p className="mt-3 font-serif text-[30px] font-semibold leading-tight text-[#EFE0C6]">
            LKR 145,500
          </p>
          <p className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-0.5 text-[11px] font-medium text-[#D8E2DA]">
            Tier 2 Rate (30% Split) • Next Payout Nov 30
          </p>
        </article>

        {/* Service Revenue */}
        <article className="rounded-[22px] border border-[#E6E2DA] bg-[#FAF8F5] p-6 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold tracking-[0.18em] text-[#8A867E] uppercase">
              Service Revenue
            </span>
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#F3F0EA] text-[#4A5B4B]">
              <Banknote className="h-4 w-4" strokeWidth={1.7} />
            </span>
          </div>
          <p className="mt-3 font-serif text-[30px] font-semibold leading-tight text-[#222B23]">
            LKR 485,000
          </p>
          <p className="mt-2 inline-flex items-center gap-1 text-[11.5px] font-medium text-[#285431]">
            <TrendingUp className="h-3.5 w-3.5" />
            <span>+12.4% vs last month</span>
          </p>
        </article>

        {/* Client Tips Total */}
        <article className="rounded-[22px] border border-[#E6E2DA] bg-[#FAF8F5] p-6 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold tracking-[0.18em] text-[#8A867E] uppercase">
              Client Tips Total
            </span>
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#F5E8D0] text-[#7A5E34]">
              <HeartHandshake className="h-4 w-4" strokeWidth={1.7} />
            </span>
          </div>
          <p className="mt-3 font-serif text-[30px] font-semibold leading-tight text-[#222B23]">
            LKR 32,400
          </p>
          <p className="mt-2 inline-flex items-center gap-1.5 text-[11.5px] font-medium text-[#7A5E34]">
            <Sparkles className="h-3.5 w-3.5" />
            <span>100% direct stylist payout</span>
          </p>
        </article>
      </section>

      {/* ================= TIER PROGRESSION BANNER ================= */}
      <section className="rounded-[22px] border border-[#E6E2DA] bg-[#FAF8F5] p-5 shadow-2xs">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F5E8D0] text-[#7A5E34]">
              <Award className="h-5 w-5" />
            </span>
            <div>
              <p className="font-serif text-[17px] font-semibold text-[#222B23]">
                Tier 3 Commission Unlock Progress
              </p>
              <p className="text-[11.5px] text-[#7A766E]">
                LKR 65,000 more in monthly service revenue to unlock the{' '}
                <strong className="text-[#222B23]">35% Master Split</strong>
              </p>
            </div>
          </div>

          <span className="rounded-full bg-[#253026] px-3.5 py-1 text-[11px] font-semibold text-[#EFE0C6]">
            88% Achieved
          </span>
        </div>

        <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-[#ECE8E0]">
          <div className="h-full w-[88%] rounded-full bg-gradient-to-r from-[#253026] to-[#C8A870]" />
        </div>
      </section>

      {/* ================= COMPLETED SERVICES & COMMISSION LEDGER ================= */}
      <section className="overflow-hidden rounded-[24px] border border-[#E6E2DA] bg-[#FAF8F5] shadow-2xs">
        <div className="flex flex-col justify-between gap-3 border-b border-[#EAE6DE] bg-[#F5F2EC] px-6 py-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="font-serif text-[21px] font-semibold text-[#222B23]">
              Completed Services &amp; Commission Breakdown
            </h2>
            <p className="mt-0.5 text-[11.5px] text-[#7A766E]">
              Detailed ledger of performed treatments, tips, and net commission
            </p>
          </div>

          <div className="inline-flex rounded-full border border-[#E6E2DA] bg-[#FAF8F5] p-1 text-[11.5px]">
            {[
              { id: 'all', label: 'All Rates' },
              { id: '30%', label: '30% Standard' },
              { id: '35%', label: '35% Bridal' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setRateFilter(tab.id)}
                className={`cursor-pointer rounded-full px-3.5 py-1 font-medium transition-all ${
                  rateFilter === tab.id
                    ? 'bg-[#253026] text-[#FAF8F5]'
                    : 'text-[#6C6961] hover:text-[#222B23]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] border-collapse text-left">
            <thead>
              <tr className="border-b border-[#EFECE5] text-[10px] font-semibold tracking-[0.16em] text-[#8A867E] uppercase">
                <th className="py-3.5 pr-4 pl-6">Date</th>
                <th className="px-4 py-3.5">Client</th>
                <th className="px-4 py-3.5">Treatment Performed</th>
                <th className="px-4 py-3.5 text-right">Service Value</th>
                <th className="px-4 py-3.5 text-center">Rate</th>
                <th className="px-4 py-3.5 text-right">Client Tip</th>
                <th className="py-3.5 pr-6 pl-4 text-right">Net Earned</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EFECE5] text-[12.5px]">
              {visibleLedger.map((row) => (
                <tr
                  key={row.id}
                  className="transition-colors hover:bg-[#F5F2EC]/70"
                >
                  <td className="py-4 pr-4 pl-6 text-[#6C6961]">{row.date}</td>
                  <td className="px-4 py-4">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#253026] text-[10.5px] font-semibold text-[#EFE0C6]">
                      {row.initials}
                    </span>
                  </td>
                  <td className="px-4 py-4 font-serif text-[16px] font-semibold text-[#222B23]">
                    {row.treatment}
                  </td>
                  <td className="px-4 py-4 text-right font-medium text-[#57544E]">
                    LKR {row.serviceValue.toLocaleString('en-US')}
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className="rounded-full bg-[#E5ECE6] px-2.5 py-0.5 text-[11px] font-semibold text-[#285431]">
                      {row.rate}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-right font-medium text-[#7A5E34]">
                    + LKR {row.tip.toLocaleString('en-US')}
                  </td>
                  <td className="py-4 pr-6 pl-4 text-right font-serif text-[16.5px] font-semibold text-[#222B23]">
                    LKR {row.netEarned.toLocaleString('en-US')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
