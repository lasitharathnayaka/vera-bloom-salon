import { useState } from 'react';
import {
  ArrowLeftRight,
  Calendar,
  CalendarCheck,
  CalendarClock,
  Check,
  CheckCircle2,
  Clock,
  MapPin,
  Palmtree,
  Sparkles,
  X,
} from 'lucide-react';
import { submitShiftRequest } from '../../services/salonService';

const WEEKLY_SHIFTS = [
  {
    day: 'MON',
    dateLabel: 'Nov 23',
    hours: '09:00 – 18:00',
    duration: '9 hrs',
    station: 'Sanctuary A',
    status: 'On Duty Today',
    isToday: true,
    isOff: false,
  },
  {
    day: 'TUE',
    dateLabel: 'Nov 24',
    hours: '09:00 – 18:00',
    duration: '9 hrs',
    station: 'Sanctuary A',
    status: 'Scheduled',
    isToday: false,
    isOff: false,
  },
  {
    day: 'WED',
    dateLabel: 'Nov 25',
    hours: 'Off Day',
    duration: 'Rest',
    station: 'Weekly Off',
    status: 'Rest Day',
    isToday: false,
    isOff: true,
  },
  {
    day: 'THU',
    dateLabel: 'Nov 26',
    hours: '11:00 – 20:00',
    duration: '9 hrs',
    station: 'Bridal Suite',
    status: 'Scheduled',
    isToday: false,
    isOff: false,
  },
  {
    day: 'FRI',
    dateLabel: 'Nov 27',
    hours: '09:00 – 18:00',
    duration: '9 hrs',
    station: 'Sanctuary A',
    status: 'Scheduled',
    isToday: false,
    isOff: false,
  },
  {
    day: 'SAT',
    dateLabel: 'Nov 28',
    hours: '08:00 – 16:00',
    duration: '8 hrs',
    station: 'Main Salon',
    status: 'Scheduled',
    isToday: false,
    isOff: false,
  },
  {
    day: 'SUN',
    dateLabel: 'Nov 29',
    hours: 'Off Day',
    duration: 'Rest',
    station: 'Weekly Off',
    status: 'Rest Day',
    isToday: false,
    isOff: true,
  },
];

const INITIAL_REQUESTS = [
  {
    id: 'req-1',
    type: 'Swap Shift',
    day: 'THU (Nov 26)',
    reason: 'Requested morning swap with Elena Rostova for bridal trial prep.',
    submittedOn: 'Nov 20, 2026',
    status: 'Pending Review',
  },
  {
    id: 'req-2',
    type: 'Annual Leave',
    day: 'Dec 18 – Dec 19',
    reason: 'Family wedding ceremony in Kandy.',
    submittedOn: 'Nov 12, 2026',
    status: 'Approved',
  },
];

export default function StylistSchedulePage() {
  const [requests, setRequests] = useState(INITIAL_REQUESTS);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [requestSubmitted, setRequestSubmitted] = useState(false);
  const [requestForm, setRequestForm] = useState({
    type: 'Time Off',
    day: 'THU',
    reason: '',
  });

  const openModalForDay = (day) => {
    setRequestForm((prev) => ({ ...prev, day }));
    setShowRequestModal(true);
  };

  const handleRequestSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    await submitShiftRequest({
      specialist_name: 'Nethmi Perera',
      request_type: requestForm.type,
      shift_day: requestForm.day,
      reason: requestForm.reason,
    });

    setRequests((prev) => [
      {
        id: `req-${Date.now()}`,
        type: requestForm.type,
        day: requestForm.day,
        reason: requestForm.reason,
        submittedOn: 'Just now',
        status: 'Pending Review',
      },
      ...prev,
    ]);

    setSubmitting(false);
    setRequestSubmitted(true);
    setTimeout(() => {
      setShowRequestModal(false);
      setRequestSubmitted(false);
      setRequestForm({ type: 'Time Off', day: 'THU', reason: '' });
    }, 1200);
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* ================= EXECUTIVE HEADER ================= */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-[10.5px] font-semibold tracking-[0.22em] text-[#7A766E] uppercase">
            Workforce &amp; Roster
          </p>
          <h1 className="mt-1 font-serif text-[30px] font-normal tracking-tight text-[#222B23] sm:text-[34px]">
            Shift &amp; Leave Management
          </h1>
        </div>

        <button
          type="button"
          onClick={() => setShowRequestModal(true)}
          className="inline-flex cursor-pointer items-center gap-2 self-start rounded-full bg-[#253026] px-5 py-2.5 text-[12px] font-medium tracking-wide text-[#FAF8F5] shadow-sm transition-all hover:bg-[#344335] sm:self-auto"
        >
          <ArrowLeftRight className="h-3.5 w-3.5 text-[#EFE0C6]" />
          <span>Request Time Off / Swap Shift</span>
        </button>
      </div>

      {/* ================= 3 ROSTER & LEAVE KPI CARDS ================= */}
      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* Featured Dark-Sage Weekly Hours Card */}
        <article className="rounded-[22px] border border-[#344335] bg-[#253026] p-6 text-[#FAF8F5] shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold tracking-[0.18em] text-[#A8B8AA] uppercase">
              Weekly Roster Hours
            </span>
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/10 text-[#EFE0C6]">
              <Clock className="h-4 w-4" strokeWidth={1.7} />
            </span>
          </div>
          <p className="mt-3 font-serif text-[30px] font-semibold leading-tight text-[#EFE0C6]">
            44 hrs
          </p>
          <p className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-0.5 text-[11px] font-medium text-[#D8E2DA]">
            5 Active Shifts • Next Rest: Wednesday
          </p>
        </article>

        {/* Annual Leave Balance */}
        <article className="rounded-[22px] border border-[#E6E2DA] bg-[#FAF8F5] p-6 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold tracking-[0.18em] text-[#8A867E] uppercase">
              Annual Leave Balance
            </span>
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#F3F0EA] text-[#4A5B4B]">
              <Palmtree className="h-4 w-4" strokeWidth={1.7} />
            </span>
          </div>
          <p className="mt-3 font-serif text-[30px] font-semibold leading-tight text-[#222B23]">
            11 Days
          </p>
          <div className="mt-3">
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#ECE8E0]">
              <div className="h-full w-[78%] rounded-full bg-[#253026]" />
            </div>
            <p className="mt-1.5 text-[11px] text-[#6C6961]">
              11 of 14 annual paid days remaining
            </p>
          </div>
        </article>

        {/* Primary Stations */}
        <article className="rounded-[22px] border border-[#E6E2DA] bg-[#FAF8F5] p-6 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold tracking-[0.18em] text-[#8A867E] uppercase">
              Assigned Suites
            </span>
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#F5E8D0] text-[#7A5E34]">
              <MapPin className="h-4 w-4" strokeWidth={1.7} />
            </span>
          </div>
          <p className="mt-3 font-serif text-[24px] font-semibold leading-snug text-[#222B23]">
            Sanctuary A &amp; Bridal
          </p>
          <p className="mt-2 text-[11.5px] text-[#6C6961]">
            Chair #2 primary • Bridal Suite on Thursdays
          </p>
        </article>
      </section>

      {/* ================= WEEKLY SHIFT TIMETABLE ================= */}
      <section className="rounded-[24px] border border-[#E6E2DA] bg-[#FAF8F5] p-6 shadow-2xs">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <p className="text-[10px] font-semibold tracking-[0.2em] text-[#7A766E] uppercase">
              Week of Nov 23 – Nov 29, 2026
            </p>
            <h2 className="mt-0.5 font-serif text-[22px] font-semibold text-[#222B23]">
              Weekly Shift Timetable
            </h2>
          </div>

          <span className="inline-flex items-center gap-2 self-start rounded-full bg-[#F3F0EA] px-3.5 py-1.5 text-[11px] font-medium text-[#57544E] sm:self-auto">
            <Sparkles className="h-3.5 w-3.5 text-[#B78B43]" />
            Click any active shift to request a swap
          </span>
        </div>

        {/* 7-Day Architectural Shift Grid */}
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
          {WEEKLY_SHIFTS.map((shift) => (
            <button
              key={shift.day}
              type="button"
              disabled={shift.isOff}
              onClick={() => openModalForDay(shift.day)}
              className={`flex min-h-[168px] flex-col justify-between rounded-2xl border p-4 text-left transition-all ${
                shift.isToday
                  ? 'cursor-pointer border-[#344335] bg-[#253026] text-[#FAF8F5] shadow-md'
                  : shift.isOff
                    ? 'cursor-default border-dashed border-[#E6E2DA] bg-[#F5F2EC]/65 text-[#9A958C]'
                    : 'cursor-pointer border-[#E6E2DA] bg-[#F5F2EC] text-[#222B23] hover:border-[#253026]/40 hover:bg-[#FAF8F5] hover:shadow-xs'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <p
                    className={`text-[10px] font-semibold tracking-[0.18em] uppercase ${
                      shift.isToday ? 'text-[#EFE0C6]' : 'text-[#8A867E]'
                    }`}
                  >
                    {shift.day}
                  </p>
                  <span
                    className={`text-[10px] ${
                      shift.isToday ? 'text-[#A8B8AA]' : 'text-[#9A958C]'
                    }`}
                  >
                    {shift.dateLabel}
                  </span>
                </div>

                <p
                  className={`mt-3 font-serif text-[16px] font-semibold leading-snug ${
                    shift.isToday
                      ? 'text-[#FAF8F5]'
                      : shift.isOff
                        ? 'text-[#9A958C]'
                        : 'text-[#222B23]'
                  }`}
                >
                  {shift.hours}
                </p>

                <p
                  className={`mt-1 text-[11px] ${
                    shift.isToday ? 'text-[#C8D4CA]' : 'text-[#7A766E]'
                  }`}
                >
                  {shift.station}
                </p>
              </div>

              <span
                className={`mt-4 inline-block self-start rounded-full px-2.5 py-0.5 text-[9.5px] font-semibold ${
                  shift.isToday
                    ? 'bg-[#EFE0C6] text-[#222B23]'
                    : shift.isOff
                      ? 'bg-[#EAE6DE] text-[#8A867E]'
                      : 'bg-[#E5ECE6] text-[#285431]'
                }`}
              >
                {shift.status}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* ================= LEAVE & SHIFT SWAP REQUEST TRACKER ================= */}
      <section className="rounded-[24px] border border-[#E6E2DA] bg-[#FAF8F5] p-6 shadow-2xs">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-semibold tracking-[0.2em] text-[#7A766E] uppercase">
              Request Tracker
            </p>
            <h2 className="mt-0.5 font-serif text-[21px] font-semibold text-[#222B23]">
              Recent Leave &amp; Shift Swap Requests
            </h2>
          </div>
          <CalendarClock className="h-5 w-5 text-[#4A5B4B]" />
        </div>

        <div className="mt-5 space-y-3">
          {requests.map((req) => {
            const approved = req.status === 'Approved';
            return (
              <article
                key={req.id}
                className="flex flex-col justify-between gap-3 rounded-2xl border border-[#EFECE5] bg-[#F5F2EC] p-4 sm:flex-row sm:items-center"
              >
                <div className="flex items-start gap-3.5">
                  <span
                    className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                      approved
                        ? 'bg-[#D8ECDC] text-[#285431]'
                        : 'bg-[#F5E8D0] text-[#7A5E34]'
                    }`}
                  >
                    {approved ? (
                      <CalendarCheck className="h-4.5 w-4.5" />
                    ) : (
                      <Calendar className="h-4.5 w-4.5" />
                    )}
                  </span>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-serif text-[16.5px] font-semibold text-[#222B23]">
                        {req.type} &middot; {req.day}
                      </p>
                      <span className="text-[10.5px] text-[#8A867E]">
                        Submitted {req.submittedOn}
                      </span>
                    </div>
                    <p className="mt-1 text-[12px] text-[#57544E]">
                      {req.reason}
                    </p>
                  </div>
                </div>

                <span
                  className={`inline-flex shrink-0 items-center gap-1.5 self-start rounded-full px-3 py-1 text-[11px] font-semibold sm:self-auto ${
                    approved
                      ? 'bg-[#D8ECDC] text-[#285431]'
                      : 'bg-[#F5E8D0] text-[#7A5E34]'
                  }`}
                >
                  {approved && <CheckCircle2 className="h-3.5 w-3.5" />}
                  {req.status}
                </span>
              </article>
            );
          })}
        </div>
      </section>

      {/* ================= DARK-SAGE-HEADER REQUEST MODAL ================= */}
      {showRequestModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#181E19]/60 p-4 backdrop-blur-xs"
          onClick={() => setShowRequestModal(false)}
        >
          <div
            className="w-full max-w-md overflow-hidden rounded-[24px] border border-[#E5E1D8] bg-[#FAF8F5] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between bg-[#253026] px-6 py-5 text-[#FAF8F5]">
              <div>
                <p className="text-[10px] font-semibold tracking-[0.2em] text-[#EFE0C6] uppercase">
                  Sanctuary Roster Request
                </p>
                <h3 className="mt-0.5 font-serif text-2xl font-normal">
                  Time Off / Swap Shift
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowRequestModal(false)}
                className="cursor-pointer rounded-full p-1.5 text-[#A8B8AA] hover:bg-white/10 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {requestSubmitted ? (
              <div className="p-8 text-center">
                <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#D8ECDC] text-[#285431]">
                  <Check className="h-6 w-6" strokeWidth={2.5} />
                </span>
                <p className="mt-3 font-serif text-xl font-semibold text-[#222B23]">
                  Request Sent to Sanctuary Admin
                </p>
                <p className="mt-1 text-xs text-[#7A766E]">
                  Your shift update has been logged for review.
                </p>
              </div>
            ) : (
              <form onSubmit={handleRequestSubmit} className="space-y-4 p-6">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11.5px] font-medium text-[#57544E]">
                      Request Type
                    </label>
                    <select
                      value={requestForm.type}
                      onChange={(e) =>
                        setRequestForm({ ...requestForm, type: e.target.value })
                      }
                      className="mt-1.5 w-full rounded-xl border border-[#E2DDD4] bg-[#F5F2EC] px-3 py-2.5 text-xs text-[#222B23] focus:border-[#253026] focus:outline-none"
                    >
                      <option value="Time Off">Time Off</option>
                      <option value="Swap Shift">Swap Shift</option>
                      <option value="Annual Leave">Annual Leave</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11.5px] font-medium text-[#57544E]">
                      Shift Day
                    </label>
                    <select
                      value={requestForm.day}
                      onChange={(e) =>
                        setRequestForm({ ...requestForm, day: e.target.value })
                      }
                      className="mt-1.5 w-full rounded-xl border border-[#E2DDD4] bg-[#F5F2EC] px-3 py-2.5 text-xs text-[#222B23] focus:border-[#253026] focus:outline-none"
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
                  <label className="block text-[11.5px] font-medium text-[#57544E]">
                    Notes for Sanctuary Admin *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={requestForm.reason}
                    onChange={(e) =>
                      setRequestForm({ ...requestForm, reason: e.target.value })
                    }
                    placeholder="Mention preferred replacement stylist or leave details..."
                    className="mt-1.5 w-full resize-none rounded-xl border border-[#E2DDD4] bg-[#F5F2EC] p-3 text-xs text-[#222B23] focus:border-[#253026] focus:outline-none"
                  />
                </div>

                <div className="flex justify-end gap-2.5 border-t border-[#ECE8E0] pt-4">
                  <button
                    type="button"
                    onClick={() => setShowRequestModal(false)}
                    className="cursor-pointer rounded-full border border-[#E2DDD4] px-5 py-2 text-xs font-medium text-[#57544E] hover:bg-[#EFECE6]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="cursor-pointer rounded-full bg-[#253026] px-6 py-2 text-xs font-semibold text-[#FAF8F5] hover:bg-[#344335] disabled:opacity-60"
                  >
                    {submitting ? 'Submitting...' : 'Submit Request'}
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
