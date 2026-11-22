import { useMemo, useState } from 'react';
import {
  ArrowLeftRight,
  Banknote,
  Check,
  Download,
  HeartHandshake,
  ListFilter,
  Percent,
  TrendingUp,
  X,
} from 'lucide-react';

const WEEKLY_SHIFTS = [
  {
    day: 'MON',
    hours: '09:00 - 18:00',
    station: 'Sanctuary A',
    status: 'Scheduled',
    isOff: false,
  },
  {
    day: 'TUE',
    hours: '09:00 - 18:00',
    station: 'Sanctuary A',
    status: 'Scheduled',
    isOff: false,
  },
  {
    day: 'WED',
    hours: 'Off Day',
    station: '-',
    status: 'Rest',
    isOff: true,
  },
  {
    day: 'THU',
    hours: '11:00 - 20:00',
    station: 'Bridal Suite',
    status: 'Scheduled',
    isOff: false,
  },
  {
    day: 'FRI',
    hours: '09:00 - 18:00',
    station: 'Sanctuary A',
    status: 'Scheduled',
    isOff: false,
  },
  {
    day: 'SAT',
    hours: '08:00 - 16:00',
    station: 'Main Salon',
    status: 'Scheduled',
    isOff: false,
  },
  {
    day: 'SUN',
    hours: 'Off Day',
    station: '-',
    status: 'Rest',
    isOff: true,
  },
];

const COMMISSION_LEDGER = [
  {
    id: 'led-1',
    date: '24 Oct 2023',
    initials: 'A.S.',
    treatment: 'Botanical Balayage & Gloss Treatment',
    serviceValue: 'LKR 45,000',
    rate: '30%',
    netEarned: 'LKR 13,500',
  },
  {
    id: 'led-2',
    date: '24 Oct 2023',
    initials: 'D.K.',
    treatment: 'Signature Ayurvedic Scalp Therapy',
    serviceValue: 'LKR 18,000',
    rate: '30%',
    netEarned: 'LKR 5,400',
  },
  {
    id: 'led-3',
    date: '23 Oct 2023',
    initials: 'T.M.',
    treatment: 'Bridal Trial Hair & Makeup Styling',
    serviceValue: 'LKR 35,000',
    rate: '35%',
    netEarned: 'LKR 12,250',
  },
  {
    id: 'led-4',
    date: '22 Oct 2023',
    initials: 'S.R.',
    treatment: 'Root Touch-Up & Organic Toning',
    serviceValue: 'LKR 22,000',
    rate: '30%',
    netEarned: 'LKR 6,600',
  },
  {
    id: 'led-5',
    date: '21 Oct 2023',
    initials: 'H.L.',
    treatment: 'Keratin Botanical Infusion',
    serviceValue: 'LKR 55,000',
    rate: '30%',
    netEarned: 'LKR 16,500',
  },
];

export default function StylistSchedulePage() {
  const [rateFilter, setRateFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [exported, setExported] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestForm, setRequestForm] = useState({
    type: 'Time Off',
    day: 'THU',
    reason: '',
  });
  const [requestSubmitted, setRequestSubmitted] = useState(false);

  const visibleLedger = useMemo(() => {
    if (rateFilter === 'all') return COMMISSION_LEDGER;
    return COMMISSION_LEDGER.filter((row) => row.rate === rateFilter);
  }, [rateFilter]);

  const handleExportCsv = () => {
    setExported(true);
    setTimeout(() => setExported(false), 2400);
  };

  const handleRequestSubmit = (e) => {
    e.preventDefault();
    setRequestSubmitted(true);
    setTimeout(() => {
      setShowRequestModal(false);
      setRequestSubmitted(false);
      setRequestForm({ type: 'Time Off', day: 'THU', reason: '' });
    }, 1200);
  };

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      {/* ================= 3 EARNINGS KPI CARDS ================= */}
      <section className="grid grid-cols-1 gap-5 md:grid-cols-3">
        <article className="rounded-2xl border border-[#ECE8E0] bg-[#FAF8F5] p-6 shadow-2xs">
          <div className="flex items-center justify-between text-[10.5px] font-semibold tracking-[0.18em] text-[#7A766E] uppercase">
            <span>Service Revenue</span>
            <Banknote className="h-4 w-4 text-[#4A5B4B]" strokeWidth={1.7} />
          </div>
          <p className="mt-3 font-serif text-[28px] font-semibold text-[#2A2927]">
            LKR 485,000
          </p>
          <p className="mt-1.5 inline-flex items-center gap-1 text-[11.5px] font-medium text-[#4A5B4B]">
            <TrendingUp className="h-3.5 w-3.5" />
            <span>+12.4% vs last month</span>
          </p>
        </article>

        <article className="rounded-2xl border border-[#ECE8E0] bg-[#FAF8F5] p-6 shadow-2xs">
          <div className="flex items-center justify-between text-[10.5px] font-semibold tracking-[0.18em] text-[#7A766E] uppercase">
            <span>Earned Commission</span>
            <Percent className="h-4 w-4 text-[#4A5B4B]" strokeWidth={1.7} />
          </div>
          <p className="mt-3 font-serif text-[28px] font-semibold text-[#2A2927]">
            LKR 145,500
          </p>
          <p className="mt-1.5 text-[11.5px] text-[#7A766E]">
            Tier 2 Rate (30% Split)
          </p>
        </article>

        <article className="rounded-2xl border border-[#ECE8E0] bg-[#FAF8F5] p-6 shadow-2xs">
          <div className="flex items-center justify-between text-[10.5px] font-semibold tracking-[0.18em] text-[#7A766E] uppercase">
            <span>Client Tips Total</span>
            <HeartHandshake
              className="h-4 w-4 text-[#4A5B4B]"
              strokeWidth={1.7}
            />
          </div>
          <p className="mt-3 font-serif text-[28px] font-semibold text-[#2A2927]">
            LKR 32,400
          </p>
          <p className="mt-1.5 text-[11.5px] font-medium text-[#6B786A]">
            100% direct payout
          </p>
        </article>
      </section>

      {/* ================= WEEKLY SHIFT TIMETABLE ================= */}
      <section
        id="shift-timetable"
        className="rounded-2xl border border-[#ECE8E0] bg-[#FAF8F5] p-6 shadow-2xs"
      >
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="font-serif text-[21px] font-semibold text-[#2A2927]">
              Weekly Shift Timetable
            </h1>
            <p className="mt-0.5 text-[12px] text-[#7A766E]">
              Assigned working hours for Nethmi Perera
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowRequestModal(true)}
            className="inline-flex cursor-pointer items-center gap-2 self-start rounded-lg border border-[#E4E0D8] bg-[#F6F4EF] px-4 py-2 text-[12px] font-medium text-[#2A2927] transition-colors hover:bg-[#EAE6DE] sm:self-auto"
          >
            <ArrowLeftRight className="h-3.5 w-3.5 text-[#4A5B4B]" />
            <span>Request Time Off / Swap Shift</span>
          </button>
        </div>

        {/* 7-Day Grid */}
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
          {WEEKLY_SHIFTS.map((shift) => (
            <article
              key={shift.day}
              className={`flex flex-col justify-between rounded-xl border p-4 ${
                shift.isOff
                  ? 'border-[#EFECE6] bg-[#F6F4EF]/70 text-[#8A867E]'
                  : 'border-[#E6E2DA] bg-[#F6F4EF] text-[#2A2927]'
              }`}
            >
              <div>
                <p className="text-[10px] font-semibold tracking-[0.18em] text-[#7A766E] uppercase">
                  {shift.day}
                </p>
                <p
                  className={`mt-2.5 font-serif text-[15px] font-semibold leading-snug ${
                    shift.isOff ? 'text-[#8A867E]' : 'text-[#2A2927]'
                  }`}
                >
                  {shift.hours}
                </p>
                <p className="mt-1 text-[11px] text-[#7A766E]">
                  {shift.station}
                </p>
              </div>

              <span
                className={`mt-4 inline-block self-start rounded-md px-2 py-0.5 text-[9.5px] font-semibold ${
                  shift.isOff
                    ? 'bg-[#ECE9E2] text-[#8A867E]'
                    : 'bg-[#E5ECE6] text-[#355A3A]'
                }`}
              >
                {shift.status}
              </span>
            </article>
          ))}
        </div>
      </section>

      {/* ================= COMPLETED SERVICES & COMMISSION LEDGER ================= */}
      <section className="rounded-2xl border border-[#ECE8E0] bg-[#FAF8F5] p-6 shadow-2xs">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="font-serif text-[21px] font-semibold text-[#2A2927]">
              Recent Completed Services &amp; Commission Breakdown
            </h2>
            <p className="mt-0.5 text-[12px] text-[#7A766E]">
              Detailed ledger of performed treatments and calculated commissions
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() =>
                setRateFilter((prev) =>
                  prev === 'all' ? '30%' : prev === '30%' ? '35%' : 'all'
                )
              }
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-[#E4E0D8] bg-[#F6F4EF] px-3.5 py-2 text-[12px] font-medium text-[#2A2927] transition-colors hover:bg-[#EAE6DE]"
            >
              <ListFilter className="h-3.5 w-3.5 text-[#4A5B4B]" />
              <span>
                {rateFilter === 'all' ? 'Filter' : `Rate: ${rateFilter}`}
              </span>
            </button>

            <button
              type="button"
              onClick={handleExportCsv}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-[#E4E0D8] bg-[#FAF8F5] px-3.5 py-2 text-[12px] font-medium text-[#2A2927] transition-colors hover:bg-[#EFECE6]"
            >
              {exported ? (
                <Check className="h-3.5 w-3.5 text-[#4A5B4B]" />
              ) : (
                <Download className="h-3.5 w-3.5 text-[#4A5B4B]" />
              )}
              <span>{exported ? 'CSV Exported' : 'Export CSV'}</span>
            </button>
          </div>
        </div>

        {/* Ledger Table */}
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[680px] border-collapse text-left">
            <thead>
              <tr className="border-b border-[#E5E1D8] text-[9.5px] font-semibold tracking-[0.16em] text-[#8A867E] uppercase">
                <th className="pb-3 pr-4">Date</th>
                <th className="px-4 pb-3">Client Initials</th>
                <th className="px-4 pb-3">Treatment Performed</th>
                <th className="px-4 pb-3 text-right">Service Value</th>
                <th className="px-4 pb-3 text-center">Commission Rate</th>
                <th className="pb-3 pl-4 text-right">Net Earned</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EFECE6] text-[12.5px]">
              {visibleLedger.map((row) => (
                <tr key={row.id} className="hover:bg-[#F6F4EF]/70">
                  <td className="py-4 pr-4 text-[#57544E]">{row.date}</td>
                  <td className="px-4 py-4 font-semibold text-[#2A2927]">
                    {row.initials}
                  </td>
                  <td className="px-4 py-4 font-serif text-[15px] font-medium text-[#2A2927]">
                    {row.treatment}
                  </td>
                  <td className="px-4 py-4 text-right font-medium text-[#4A4741]">
                    {row.serviceValue}
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className="rounded-md bg-[#F2EFE9] px-2.5 py-1 text-[11px] font-semibold text-[#4A5B4B]">
                      {row.rate}
                    </span>
                  </td>
                  <td className="py-4 pl-4 text-right font-serif text-[15.5px] font-semibold text-[#2A2927]">
                    {row.netEarned}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-[#EFECE6] pt-4 text-[11.5px]">
          <span className="text-[#7A766E]">
            Showing 1-{visibleLedger.length} of 42 entries
          </span>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="cursor-pointer rounded-md px-2.5 py-1 text-[#7A766E] transition-colors hover:bg-[#EFECE6] disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous
            </button>

            {[1, 2, 3].map((page) => (
              <button
                key={page}
                type="button"
                onClick={() => setCurrentPage(page)}
                className={`h-7 w-7 cursor-pointer rounded-md font-medium transition-colors ${
                  currentPage === page
                    ? 'bg-[#4A5B4B] text-[#FAF8F5]'
                    : 'text-[#57544E] hover:bg-[#EFECE6]'
                }`}
              >
                {page}
              </button>
            ))}

            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.min(3, p + 1))}
              disabled={currentPage === 3}
              className="cursor-pointer rounded-md px-2.5 py-1 text-[#57544E] transition-colors hover:bg-[#EFECE6] disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      </section>

      {/* ================= REQUEST TIME OFF / SWAP SHIFT MODAL ================= */}
      {showRequestModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#1F1E1C]/50 p-4 backdrop-blur-xs"
          onClick={() => setShowRequestModal(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-[#E5E1D8] bg-[#FAF8F5] p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#ECE8E0] pb-3">
              <h3 className="font-serif text-xl font-semibold text-[#2A2927]">
                Request Time Off / Swap Shift
              </h3>
              <button
                type="button"
                onClick={() => setShowRequestModal(false)}
                className="cursor-pointer rounded p-1 text-[#7A766E] hover:bg-[#EFECE6]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {requestSubmitted ? (
              <div className="py-8 text-center">
                <Check className="mx-auto h-9 w-9 text-[#4A5B4B]" />
                <p className="mt-3 font-serif text-lg font-semibold text-[#2A2927]">
                  Request Sent to Sanctuary Admin
                </p>
              </div>
            ) : (
              <form onSubmit={handleRequestSubmit} className="mt-5 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-[#57544E]">
                      Request Type
                    </label>
                    <select
                      value={requestForm.type}
                      onChange={(e) =>
                        setRequestForm({ ...requestForm, type: e.target.value })
                      }
                      className="mt-1.5 w-full rounded-lg border border-[#E2DDD4] bg-[#F6F4EF] px-3 py-2 text-xs text-[#2A2927] focus:border-[#4A5B4B] focus:outline-none"
                    >
                      <option value="Time Off">Time Off</option>
                      <option value="Swap Shift">Swap Shift</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#57544E]">
                      Shift Day
                    </label>
                    <select
                      value={requestForm.day}
                      onChange={(e) =>
                        setRequestForm({ ...requestForm, day: e.target.value })
                      }
                      className="mt-1.5 w-full rounded-lg border border-[#E2DDD4] bg-[#F6F4EF] px-3 py-2 text-xs text-[#2A2927] focus:border-[#4A5B4B] focus:outline-none"
                    >
                      {WEEKLY_SHIFTS.map((s) => (
                        <option key={s.day} value={s.day}>
                          {s.day} ({s.hours})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#57544E]">
                    Notes for Admin
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={requestForm.reason}
                    onChange={(e) =>
                      setRequestForm({ ...requestForm, reason: e.target.value })
                    }
                    placeholder="Mention preferred replacement stylist or leave details..."
                    className="mt-1.5 w-full rounded-lg border border-[#E2DDD4] bg-[#F6F4EF] p-3 text-xs text-[#2A2927] focus:border-[#4A5B4B] focus:outline-none"
                  />
                </div>

                <div className="flex justify-end gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowRequestModal(false)}
                    className="cursor-pointer rounded-lg border border-[#E2DDD4] px-4 py-2 text-xs font-medium text-[#57544E] hover:bg-[#EFECE6]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="cursor-pointer rounded-lg bg-[#4A5B4B] px-5 py-2 text-xs font-medium text-[#FAF8F5] hover:bg-[#3B4A3C]"
                  >
                    Submit Request
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
