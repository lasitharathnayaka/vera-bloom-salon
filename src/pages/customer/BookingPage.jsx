import { useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Hourglass,
  Sparkles,
  Star,
  User,
} from 'lucide-react';
import {
  DEFAULT_BOOKING_SERVICES,
  SPECIALISTS,
  TIME_SLOT_GROUPS,
} from '../../data/specialistsData';
import { formatLKR } from '../../data/servicesData';

const WEEKDAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

function getCalendarCells(year, monthIndex) {
  const firstDay = new Date(year, monthIndex, 1);
  // Convert Sunday=0..Saturday=6 into Monday=0..Sunday=6
  const startOffset = (firstDay.getDay() + 6) % 7;
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, monthIndex, 0).getDate();

  const cells = [];

  for (let i = startOffset - 1; i >= 0; i--) {
    cells.push({
      day: daysInPrevMonth - i,
      inCurrentMonth: false,
      date: new Date(year, monthIndex - 1, daysInPrevMonth - i),
    });
  }

  for (let day = 1; day <= daysInMonth; day++) {
    cells.push({
      day,
      inCurrentMonth: true,
      date: new Date(year, monthIndex, day),
    });
  }

  const remaining = 35 - cells.length > 0 ? 35 - cells.length : (42 - cells.length) % 7;
  for (let day = 1; day <= remaining; day++) {
    cells.push({
      day,
      inCurrentMonth: false,
      date: new Date(year, monthIndex + 1, day),
    });
  }

  return cells;
}

function formatMonthYear(date) {
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

function formatShortMonthDay(date) {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function formatSummaryDate(date) {
  const weekday = date.toLocaleDateString('en-US', { weekday: 'short' });
  const monthDay = formatShortMonthDay(date);
  return `${weekday}, ${monthDay}`;
}

function isSameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export default function BookingPage() {
  const location = useLocation();

  // Pull selected services passed from ServicesPage, or fall back to defaults
  const bookedServices = useMemo(() => {
    const incoming = location.state?.selectedServices;
    if (Array.isArray(incoming) && incoming.length > 0) {
      return incoming.map((svc) => ({
        id: svc.id,
        name: svc.name,
        subtitle: svc.categoryName || svc.description?.slice(0, 42),
        duration: svc.duration,
        price: svc.price,
      }));
    }
    return DEFAULT_BOOKING_SERVICES;
  }, [location.state]);

  const totalDuration = useMemo(
    () => bookedServices.reduce((sum, svc) => sum + svc.duration, 0),
    [bookedServices]
  );

  const estimatedTotal = useMemo(
    () => bookedServices.reduce((sum, svc) => sum + svc.price, 0),
    [bookedServices]
  );

  const [step, setStep] = useState(2); // 2 = Specialist & Time, 3 = Confirm
  const [selectedSpecialistId, setSelectedSpecialistId] = useState('elena');
  const [viewMonth, setViewMonth] = useState(new Date(2024, 9, 1)); // October 2024
  const [selectedDate, setSelectedDate] = useState(new Date(2024, 9, 17)); // Thu, Oct 17
  const [selectedTime, setSelectedTime] = useState('01:15 PM');

  // Guest confirmation form state (Step 3)
  const [guestDetails, setGuestDetails] = useState({
    fullName: '',
    email: '',
    phone: '',
    notes: '',
  });
  const [isConfirmed, setIsConfirmed] = useState(false);

  const selectedSpecialist = useMemo(
    () => SPECIALISTS.find((s) => s.id === selectedSpecialistId) || SPECIALISTS[0],
    [selectedSpecialistId]
  );

  const calendarCells = useMemo(
    () => getCalendarCells(viewMonth.getFullYear(), viewMonth.getMonth()),
    [viewMonth]
  );

  const handlePrevMonth = () => {
    setViewMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setViewMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const handleConfirmSubmit = (e) => {
    e.preventDefault();
    setIsConfirmed(true);
  };

  return (
    <div className="bg-[#FAF8F5] pb-24 pt-10">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        {/* ================= PROGRESS STEPPER ================= */}
        <nav
          aria-label="Booking progress"
          className="mb-12 flex items-center justify-center gap-3 text-xs sm:gap-6"
        >
          {/* Step 1: Treatments */}
          <Link
            to="/services"
            className="flex items-center gap-2 text-[#8A867E] transition-colors hover:text-[#2A2927]"
          >
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#8FA391] text-white">
              <Check className="h-3 w-3" strokeWidth={2.5} />
            </span>
            <span className="font-medium">1. Treatments</span>
          </Link>

          <span className="h-px w-8 bg-[#E2DDD4] sm:w-14" />

          {/* Step 2: Specialist & Time */}
          <button
            type="button"
            onClick={() => {
              setStep(2);
              setIsConfirmed(false);
            }}
            className={`flex cursor-pointer items-center gap-2 transition-colors ${
              step === 2 ? 'text-[#2A2927]' : 'text-[#8A867E] hover:text-[#2A2927]'
            }`}
          >
            <span
              className={`inline-flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-semibold ${
                step > 2
                  ? 'bg-[#8FA391] text-white'
                  : 'bg-[#4A5B4B] text-[#FAF8F5]'
              }`}
            >
              {step > 2 ? <Check className="h-3 w-3" strokeWidth={2.5} /> : '2'}
            </span>
            <span className={step === 2 ? 'font-semibold' : 'font-medium'}>
              Specialist &amp; Time
            </span>
          </button>

          <span className="h-px w-8 bg-[#E2DDD4] sm:w-14" />

          {/* Step 3: Confirm */}
          <div
            className={`flex items-center gap-2 ${
              step === 3 ? 'text-[#2A2927]' : 'text-[#A8A49B]'
            }`}
          >
            <span
              className={`inline-flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-semibold ${
                step === 3
                  ? 'bg-[#4A5B4B] text-[#FAF8F5]'
                  : 'bg-[#EAE6DE] text-[#8A867E]'
              }`}
            >
              3
            </span>
            <span className={step === 3 ? 'font-semibold' : 'font-medium'}>
              Confirm
            </span>
          </div>
        </nav>

        {/* ================= MAIN 2-COLUMN CONTENT ================= */}
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12">
          {/* LEFT COLUMN */}
          <div className="space-y-12 lg:col-span-8">
            {step === 2 ? (
              <>
                {/* -------- EXPERT GUIDANCE -------- */}
                <section>
                  <p className="text-[10px] font-semibold tracking-[0.22em] text-[#6B786A] uppercase">
                    Expert Guidance
                  </p>
                  <div className="mt-1.5 flex items-baseline justify-between">
                    <h1 className="font-serif text-[26px] font-medium text-[#2A2927]">
                      Select Your Botanical Specialist
                    </h1>
                    <span className="text-xs text-[#8A867E]">Optional</span>
                  </div>

                  <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {SPECIALISTS.map((specialist) => {
                      const isSelected = specialist.id === selectedSpecialistId;
                      return (
                        <button
                          key={specialist.id}
                          type="button"
                          onClick={() => setSelectedSpecialistId(specialist.id)}
                          className={`flex cursor-pointer items-center gap-4 rounded-xl px-5 py-4 text-left transition-all ${
                            isSelected
                              ? 'border-[1.5px] border-[#4A5B4B] bg-[#F6F4EF] shadow-xs'
                              : 'border border-[#ECE8E0] bg-[#F6F4EF] hover:border-[#CFC9BE]'
                          }`}
                        >
                          {specialist.avatar ? (
                            <img
                              src={specialist.avatar}
                              alt={specialist.name}
                              className="h-14 w-14 shrink-0 rounded-xl border border-[#E5E1D8] object-cover"
                            />
                          ) : (
                            <span className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#D4E6D6] text-[#4A5B4B]">
                              <Sparkles className="h-5 w-5" strokeWidth={1.7} />
                            </span>
                          )}

                          <div className="min-w-0">
                            <p className="font-serif text-[16px] font-semibold text-[#2A2927]">
                              {specialist.name}
                            </p>
                            <p className="mt-0.5 text-[12px] text-[#6C6961]">
                              {specialist.role}
                            </p>
                            <p className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-medium text-[#57544E]">
                              <Star className="h-3 w-3 fill-[#4A5B4B] text-[#4A5B4B]" />
                              <span>{specialist.ratingText}</span>
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </section>

                {/* -------- SCHEDULE: DATE & TIME -------- */}
                <section>
                  <p className="text-[10px] font-semibold tracking-[0.22em] text-[#6B786A] uppercase">
                    Schedule
                  </p>
                  <h2 className="mt-1.5 font-serif text-[26px] font-medium text-[#2A2927]">
                    Select Date &amp; Time
                  </h2>

                  <div className="mt-5 rounded-2xl border border-[#ECE8E0] bg-[#F4F2ED] p-6 sm:p-8">
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-10">
                      {/* Monthly Calendar */}
                      <div>
                        <div className="mb-5 flex items-center justify-between">
                          <h3 className="font-serif text-[17px] font-semibold text-[#2A2927]">
                            {formatMonthYear(viewMonth)}
                          </h3>
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={handlePrevMonth}
                              aria-label="Previous month"
                              className="inline-flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border border-[#E4E0D8] bg-[#FAF8F5] text-[#57544E] transition-colors hover:bg-[#EAE6DE]"
                            >
                              <ChevronLeft className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={handleNextMonth}
                              aria-label="Next month"
                              className="inline-flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border border-[#E4E0D8] bg-[#FAF8F5] text-[#57544E] transition-colors hover:bg-[#EAE6DE]"
                            >
                              <ChevronRight className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Weekday Headers */}
                        <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-medium text-[#7A766E]">
                          {WEEKDAYS.map((day) => (
                            <div key={day} className="py-1.5">
                              {day}
                            </div>
                          ))}
                        </div>

                        {/* Day Cells */}
                        <div className="mt-1 grid grid-cols-7 gap-1 text-center">
                          {calendarCells.map((cell, idx) => {
                            const selected = isSameDay(cell.date, selectedDate);
                            return (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => {
                                  setSelectedDate(cell.date);
                                  if (!cell.inCurrentMonth) {
                                    setViewMonth(
                                      new Date(
                                        cell.date.getFullYear(),
                                        cell.date.getMonth(),
                                        1
                                      )
                                    );
                                  }
                                }}
                                className={`mx-auto flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-[12.5px] transition-colors ${
                                  selected
                                    ? 'bg-[#4A5B4B] font-semibold text-[#FAF8F5] shadow-xs'
                                    : cell.inCurrentMonth
                                      ? 'font-medium text-[#2A2927] hover:bg-[#E6E2DA]'
                                      : 'text-[#C2BEB6] hover:bg-[#ECE8E0]'
                                }`}
                              >
                                {cell.day}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Available Time Slots */}
                      <div className="flex flex-col justify-between">
                        <div>
                          <h3 className="font-serif text-[16px] font-semibold text-[#2A2927]">
                            Available Times for {formatShortMonthDay(selectedDate)}
                          </h3>

                          <div className="mt-5 space-y-5">
                            {TIME_SLOT_GROUPS.map((group) => (
                              <div key={group.label}>
                                <p className="text-[10px] font-semibold tracking-[0.18em] text-[#8A867E] uppercase">
                                  {group.label}
                                </p>
                                <div className="mt-2.5 flex flex-wrap gap-2.5">
                                  {group.slots.map((slot) => {
                                    const active = slot === selectedTime;
                                    return (
                                      <button
                                        key={slot}
                                        type="button"
                                        onClick={() => setSelectedTime(slot)}
                                        className={`cursor-pointer rounded-lg px-4 py-2 text-[11.5px] font-medium transition-colors ${
                                          active
                                            ? 'bg-[#4A5B4B] text-[#FAF8F5] shadow-xs'
                                            : 'bg-[#E8E5DE] text-[#4A4741] hover:bg-[#DDD9D0]'
                                        }`}
                                      >
                                        {slot}
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Timezone Notice */}
                        <div className="mt-6 flex items-start gap-2.5 rounded-xl border border-[#E5E1D8] bg-[#ECEAE4]/70 px-4 py-3 text-[11.5px] leading-relaxed text-[#6C6961]">
                          <Clock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#6B786A]" />
                          <span>
                            Times are shown in local sanctuary time (GMT+5:30)
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              </>
            ) : (
              /* -------- STEP 3: GUEST DETAILS & CONFIRMATION -------- */
              <section className="rounded-2xl border border-[#ECE8E0] bg-[#F4F2ED] p-7 sm:p-9">
                {isConfirmed ? (
                  <div className="py-6 text-center">
                    <CheckCircle2 className="mx-auto h-12 w-12 text-[#4A5B4B]" />
                    <p className="mt-4 text-[10px] font-semibold tracking-[0.22em] text-[#6B786A] uppercase">
                      Reservation Confirmed
                    </p>
                    <h2 className="mt-2 font-serif text-3xl font-semibold text-[#2A2927]">
                      We Look Forward to Welcoming You
                    </h2>
                    <p className="mx-auto mt-3 max-w-md text-[13px] leading-relaxed text-[#6C6961]">
                      Your sanctuary visit with{' '}
                      <strong className="text-[#2A2927]">
                        {selectedSpecialist.name}
                      </strong>{' '}
                      on{' '}
                      <strong className="text-[#2A2927]">
                        {formatSummaryDate(selectedDate)} at {selectedTime}
                      </strong>{' '}
                      has been reserved.
                    </p>
                    <div className="mt-8 flex justify-center gap-4">
                      <Link
                        to="/"
                        className="rounded-lg bg-[#4A5B4B] px-6 py-3 text-xs font-medium text-[#FAF8F5] transition-colors hover:bg-[#3B4A3C]"
                      >
                        Return Home
                      </Link>
                      <Link
                        to="/services"
                        className="rounded-lg border border-[#DCD7CC] bg-[#FAF8F5] px-6 py-3 text-xs font-medium text-[#2A2927] transition-colors hover:bg-[#ECE8E0]"
                      >
                        Explore Menu
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div>
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="inline-flex cursor-pointer items-center gap-1.5 text-xs font-medium text-[#6B786A] transition-colors hover:text-[#2A2927]"
                    >
                      <ArrowLeft className="h-3.5 w-3.5" />
                      <span>Back to Specialist &amp; Time</span>
                    </button>

                    <p className="mt-5 text-[10px] font-semibold tracking-[0.22em] text-[#6B786A] uppercase">
                      Final Step
                    </p>
                    <h2 className="mt-1 font-serif text-[28px] font-medium text-[#2A2927]">
                      Your Guest Details
                    </h2>

                    <form
                      onSubmit={handleConfirmSubmit}
                      className="mt-6 space-y-4"
                    >
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                          <label className="block text-xs font-medium text-[#57544E]">
                            Full Name
                          </label>
                          <input
                            type="text"
                            required
                            value={guestDetails.fullName}
                            onChange={(e) =>
                              setGuestDetails({
                                ...guestDetails,
                                fullName: e.target.value,
                              })
                            }
                            placeholder="Elena Rostova"
                            className="mt-1.5 w-full rounded-lg border border-[#E2DDD4] bg-[#FAF8F5] px-3.5 py-2.5 text-sm text-[#2A2927] focus:border-[#4A5B4B] focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-[#57544E]">
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            required
                            value={guestDetails.phone}
                            onChange={(e) =>
                              setGuestDetails({
                                ...guestDetails,
                                phone: e.target.value,
                              })
                            }
                            placeholder="+94 77 123 4567"
                            className="mt-1.5 w-full rounded-lg border border-[#E2DDD4] bg-[#FAF8F5] px-3.5 py-2.5 text-sm text-[#2A2927] focus:border-[#4A5B4B] focus:outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-[#57544E]">
                          Email Address
                        </label>
                        <input
                          type="email"
                          required
                          value={guestDetails.email}
                          onChange={(e) =>
                            setGuestDetails({
                              ...guestDetails,
                              email: e.target.value,
                            })
                          }
                          placeholder="you@example.com"
                          className="mt-1.5 w-full rounded-lg border border-[#E2DDD4] bg-[#FAF8F5] px-3.5 py-2.5 text-sm text-[#2A2927] focus:border-[#4A5B4B] focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-[#57544E]">
                          Sensitivities or Ritual Preferences (Optional)
                        </label>
                        <textarea
                          rows={3}
                          value={guestDetails.notes}
                          onChange={(e) =>
                            setGuestDetails({
                              ...guestDetails,
                              notes: e.target.value,
                            })
                          }
                          placeholder="Let us know any fragrance preferences, allergies, or special occasions..."
                          className="mt-1.5 w-full rounded-lg border border-[#E2DDD4] bg-[#FAF8F5] px-3.5 py-2.5 text-sm text-[#2A2927] focus:border-[#4A5B4B] focus:outline-none"
                        />
                      </div>

                      <button
                        type="submit"
                        className="mt-2 inline-flex cursor-pointer items-center gap-2 rounded-lg bg-[#4A5B4B] px-7 py-3.5 text-xs font-medium tracking-wide text-[#FAF8F5] transition-colors hover:bg-[#3B4A3C]"
                      >
                        <span>Confirm Sanctuary Reservation</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </form>
                  </div>
                )}
              </section>
            )}
          </div>

          {/* RIGHT COLUMN: STICKY SUMMARY CARD */}
          <aside className="lg:sticky lg:top-24 lg:col-span-4">
            <div className="relative overflow-hidden rounded-2xl border border-[#E6E2DA] bg-[#F4F2ED] p-7 shadow-xs">
              {/* Subtle Botanical Watermark */}
              <svg
                aria-hidden="true"
                viewBox="0 0 120 120"
                className="pointer-events-none absolute -bottom-4 -right-4 h-36 w-36 text-[#E4E0D6]"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path d="M60 110V35" />
                <path d="M60 70C60 45 35 30 15 30C15 55 35 70 60 70Z" />
                <path d="M60 55C60 35 80 20 105 20C105 42 85 55 60 55Z" />
              </svg>

              <div className="relative z-10">
                {/* Summary Header */}
                <p className="text-[10px] font-semibold tracking-[0.22em] text-[#8A867E] uppercase">
                  Summary
                </p>
                <h2 className="mt-1 font-serif text-[21px] font-medium text-[#2A2927]">
                  Your Sanctuary Ritual
                </h2>

                {/* Services List */}
                <div className="mt-6 space-y-4 border-b border-[#E5E1D8] pb-6">
                  {bookedServices.map((svc) => (
                    <div
                      key={svc.id}
                      className="flex items-start justify-between gap-3"
                    >
                      <div>
                        <p className="font-serif text-[15px] font-semibold text-[#2A2927]">
                          {svc.name}
                        </p>
                        {svc.subtitle && (
                          <p className="mt-0.5 text-[11px] text-[#7A766E]">
                            {svc.subtitle}
                          </p>
                        )}
                      </div>
                      <span className="shrink-0 font-serif text-[15px] font-semibold text-[#2A2927]">
                        {formatLKR(svc.price)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Meta Rows */}
                <div className="space-y-3.5 border-b border-[#E5E1D8] py-5 text-[12px]">
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-2 text-[#7A766E]">
                      <User className="h-3.5 w-3.5 text-[#6B786A]" />
                      Specialist
                    </span>
                    <span className="font-semibold text-[#2A2927]">
                      {selectedSpecialist.name}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-2 text-[#7A766E]">
                      <Calendar className="h-3.5 w-3.5 text-[#6B786A]" />
                      Date &amp; Time
                    </span>
                    <span className="font-semibold text-[#2A2927]">
                      {formatSummaryDate(selectedDate)} &middot; {selectedTime}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-2 text-[#7A766E]">
                      <Hourglass className="h-3.5 w-3.5 text-[#6B786A]" />
                      Duration
                    </span>
                    <span className="font-semibold text-[#2A2927]">
                      {totalDuration} mins
                    </span>
                  </div>
                </div>

                {/* Estimated Total */}
                <div className="flex items-start justify-between pt-5">
                  <div>
                    <p className="font-serif text-[16px] font-medium text-[#2A2927]">
                      Estimated Total
                    </p>
                    <p className="mt-0.5 text-[10.5px] text-[#8A867E]">
                      Inclusive of all local taxes
                    </p>
                  </div>
                  <p className="font-serif text-[21px] font-semibold text-[#2A2927]">
                    {formatLKR(estimatedTotal)}
                  </p>
                </div>

                {/* CTA Button */}
                {step === 2 && (
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="mt-7 flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#4A5B4B] px-5 py-3.5 text-[12.5px] font-medium tracking-wide text-[#FAF8F5] shadow-xs transition-colors hover:bg-[#3B4A3C]"
                  >
                    <span>Proceed to Details</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
