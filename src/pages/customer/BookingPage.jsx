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
  Flower2,
  Hourglass,
  ShieldCheck,
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
import { createAppointment } from '../../services/salonService';
import { useAuth } from '../../hooks/useAuth';
import wallpaperSanctuary from '../../assets/wallpaper-sanctuary.jpg';

const WEEKDAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

function getCalendarCells(year, monthIndex) {
  const firstDay = new Date(year, monthIndex, 1);
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

  const remaining =
    35 - cells.length > 0 ? 35 - cells.length : (42 - cells.length) % 7;
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
  const { user } = useAuth();
  const [bookingRef, setBookingRef] = useState('');
  const [savingBooking, setSavingBooking] = useState(false);

  const bookedServices = useMemo(() => {
    const incoming = location.state?.selectedServices;
    if (Array.isArray(incoming) && incoming.length > 0) {
      return incoming.map((svc) => ({
        id: svc.id,
        name: svc.name,
        subtitle: svc.categoryName || svc.description?.slice(0, 44),
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

  const blossomsEarned = Math.round(estimatedTotal / 100);

  const [step, setStep] = useState(2); // 2 = Specialist & Time, 3 = Confirm
  const [selectedSpecialistId, setSelectedSpecialistId] = useState('elena');
  const [viewMonth, setViewMonth] = useState(new Date(2026, 10, 1)); // Nov 2026
  const [selectedDate, setSelectedDate] = useState(new Date(2026, 10, 24));
  const [selectedTime, setSelectedTime] = useState('01:15 PM');

  const [guestDetails, setGuestDetails] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: '',
    notes: '',
  });
  const [isConfirmed, setIsConfirmed] = useState(false);

  const selectedSpecialist = useMemo(
    () =>
      SPECIALISTS.find((s) => s.id === selectedSpecialistId) || SPECIALISTS[0],
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

  const handleConfirmSubmit = async (e) => {
    e.preventDefault();
    setSavingBooking(true);
    const isoDate = selectedDate.toISOString().split('T')[0];

    const { data } = await createAppointment(
      {
        customer_id: user?.id || null,
        customer_name: guestDetails.fullName,
        customer_email: guestDetails.email,
        customer_phone: guestDetails.phone,
        specialist_name: selectedSpecialist.name,
        appointment_date: isoDate,
        time_slot: selectedTime,
        duration_mins: totalDuration,
        total_lkr: estimatedTotal,
        notes: guestDetails.notes,
        status: 'confirmed',
      },
      bookedServices
    );

    setBookingRef(
      data?.booking_ref || `VB-${Math.floor(100000 + Math.random() * 900000)}`
    );
    setSavingBooking(false);
    setIsConfirmed(true);
  };

  return (
    <div className="bg-[#FAF8F5] pb-24">
      {/* ================= EDITORIAL DARK-SAGE RESERVATION HERO ================= */}
      <section className="relative overflow-hidden bg-[#222B23] text-[#FAF8F5]">
        <img
          src={wallpaperSanctuary}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-22"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#1D251E]/75 via-[#222B23]/85 to-[#222B23]" />

        <div className="relative z-10 mx-auto max-w-6xl px-6 py-14 text-center lg:px-10 lg:py-16">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#EFE0C6]/30 bg-[#EFE0C6]/15 px-4 py-1.5 text-[10px] font-semibold tracking-[0.24em] text-[#EFE0C6] uppercase backdrop-blur-xs">
            <Sparkles className="h-3 w-3" />
            Sanctuary Reservations &bull; Instant Confirmation
          </span>

          <h1 className="mt-4 font-serif text-4xl font-medium tracking-tight text-[#FAF8F5] sm:text-5xl">
            Reserve Your{' '}
            <span className="italic text-[#EFE0C6]">Sanctuary Ritual</span>
          </h1>

          {/* Modern Glass Progress Stepper */}
          <nav
            aria-label="Booking progress"
            className="mx-auto mt-8 inline-flex flex-wrap items-center justify-center gap-3 rounded-full border border-white/15 bg-white/8 px-5 py-2.5 text-xs backdrop-blur-md sm:gap-5"
          >
            <Link
              to="/services"
              className="flex items-center gap-2 text-[#C9D2CA] transition-colors hover:text-[#FAF8F5]"
            >
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#EFE0C6] text-[#222B23]">
                <Check className="h-3 w-3" strokeWidth={2.6} />
              </span>
              <span className="font-medium">1. Treatments</span>
            </Link>

            <span className="h-px w-6 bg-white/20 sm:w-10" />

            <button
              type="button"
              onClick={() => {
                setStep(2);
                setIsConfirmed(false);
              }}
              className={`flex cursor-pointer items-center gap-2 transition-colors ${
                step === 2 ? 'text-[#FAF8F5]' : 'text-[#C9D2CA] hover:text-white'
              }`}
            >
              <span
                className={`inline-flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-semibold ${
                  step > 2
                    ? 'bg-[#EFE0C6] text-[#222B23]'
                    : 'bg-[#FAF8F5] text-[#222B23]'
                }`}
              >
                {step > 2 ? (
                  <Check className="h-3 w-3" strokeWidth={2.6} />
                ) : (
                  '2'
                )}
              </span>
              <span className={step === 2 ? 'font-semibold' : 'font-medium'}>
                Specialist &amp; Time
              </span>
            </button>

            <span className="h-px w-6 bg-white/20 sm:w-10" />

            <div
              className={`flex items-center gap-2 ${
                step === 3 ? 'text-[#FAF8F5]' : 'text-white/45'
              }`}
            >
              <span
                className={`inline-flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-semibold ${
                  step === 3
                    ? 'bg-[#EFE0C6] text-[#222B23]'
                    : 'bg-white/15 text-white/60'
                }`}
              >
                3
              </span>
              <span className={step === 3 ? 'font-semibold' : 'font-medium'}>
                Confirm
              </span>
            </div>
          </nav>
        </div>
      </section>

      {/* ================= MAIN 2-COLUMN CONTENT ================= */}
      <div className="mx-auto max-w-7xl px-6 pt-12 lg:px-10">
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12">
          {/* LEFT COLUMN */}
          <div className="space-y-12 lg:col-span-8">
            {step === 2 ? (
              <>
                {/* -------- EXPERT GUIDANCE -------- */}
                <section>
                  <div className="flex items-end justify-between border-b border-[#ECE8E0] pb-3.5">
                    <div>
                      <p className="text-[10px] font-semibold tracking-[0.24em] text-[#6B786A] uppercase">
                        Expert Guidance
                      </p>
                      <h2 className="mt-1 font-serif text-[28px] font-semibold text-[#2A2927]">
                        Select Your Botanical Specialist
                      </h2>
                    </div>
                    <span className="rounded-full bg-[#F2EFE9] px-3 py-1 text-[11px] font-medium text-[#7A766E]">
                      Optional
                    </span>
                  </div>

                  <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {SPECIALISTS.map((specialist) => {
                      const isSelected = specialist.id === selectedSpecialistId;
                      return (
                        <button
                          key={specialist.id}
                          type="button"
                          onClick={() => setSelectedSpecialistId(specialist.id)}
                          className={`relative flex cursor-pointer items-center gap-4 rounded-2xl p-5 text-left transition-all duration-300 ${
                            isSelected
                              ? 'border-[1.5px] border-[#4A5B4B] bg-[#F2F6F2] shadow-md'
                              : 'border border-[#ECE8E0] bg-[#FAF8F5] hover:-translate-y-0.5 hover:border-[#D6D1C6] hover:shadow-sm'
                          }`}
                        >
                          {isSelected && (
                            <span className="absolute right-4 top-4 inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#4A5B4B] text-[#FAF8F5]">
                              <Check className="h-3 w-3" strokeWidth={2.5} />
                            </span>
                          )}

                          {specialist.avatar ? (
                            <img
                              src={specialist.avatar}
                              alt={specialist.name}
                              className="h-16 w-16 shrink-0 rounded-2xl border border-[#E5E1D8] object-cover shadow-2xs"
                            />
                          ) : (
                            <span className="inline-flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#DCE9DD] text-[#4A5B4B]">
                              <Sparkles className="h-6 w-6" strokeWidth={1.7} />
                            </span>
                          )}

                          <div className="min-w-0 pr-5">
                            <p className="font-serif text-[18px] font-semibold text-[#2A2927]">
                              {specialist.name}
                            </p>
                            <p className="mt-0.5 text-[12px] text-[#6C6961]">
                              {specialist.role}
                            </p>
                            <p className="mt-2 inline-flex items-center gap-1 rounded-full bg-[#EFE0C6]/70 px-2.5 py-0.5 text-[10.5px] font-semibold text-[#7A6444]">
                              <Star className="h-3 w-3 fill-[#C89F52] text-[#C89F52]" />
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
                  <div className="border-b border-[#ECE8E0] pb-3.5">
                    <p className="text-[10px] font-semibold tracking-[0.24em] text-[#6B786A] uppercase">
                      Schedule
                    </p>
                    <h2 className="mt-1 font-serif text-[28px] font-semibold text-[#2A2927]">
                      Select Date &amp; Time
                    </h2>
                  </div>

                  <div className="mt-6 rounded-[26px] border border-[#E6E2DA] bg-[#FAF8F5] p-6 shadow-xs sm:p-8">
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-10">
                      {/* Monthly Calendar */}
                      <div className="rounded-2xl border border-[#EFECE6] bg-[#F6F4EF] p-5">
                        <div className="mb-5 flex items-center justify-between">
                          <h3 className="font-serif text-[19px] font-semibold text-[#2A2927]">
                            {formatMonthYear(viewMonth)}
                          </h3>
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={handlePrevMonth}
                              aria-label="Previous month"
                              className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-[#E4E0D8] bg-[#FAF8F5] text-[#57544E] transition-colors hover:bg-[#4A5B4B] hover:text-[#FAF8F5]"
                            >
                              <ChevronLeft className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={handleNextMonth}
                              aria-label="Next month"
                              className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-[#E4E0D8] bg-[#FAF8F5] text-[#57544E] transition-colors hover:bg-[#4A5B4B] hover:text-[#FAF8F5]"
                            >
                              <ChevronRight className="h-4 w-4" />
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-semibold text-[#7A766E]">
                          {WEEKDAYS.map((day) => (
                            <div key={day} className="py-1.5">
                              {day}
                            </div>
                          ))}
                        </div>

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
                                className={`mx-auto flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl text-[12.5px] transition-all ${
                                  selected
                                    ? 'bg-[#4A5B4B] font-semibold text-[#FAF8F5] shadow-md'
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
                          <div className="flex items-center justify-between">
                            <h3 className="font-serif text-[19px] font-semibold text-[#2A2927]">
                              Available Times
                            </h3>
                            <span className="rounded-full bg-[#EFE0C6]/75 px-3 py-1 text-[11px] font-semibold text-[#7A6444]">
                              {formatShortMonthDay(selectedDate)}
                            </span>
                          </div>

                          <div className="mt-6 space-y-5">
                            {TIME_SLOT_GROUPS.map((group) => (
                              <div key={group.label}>
                                <p className="text-[10px] font-semibold tracking-[0.2em] text-[#8A867E] uppercase">
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
                                        className={`cursor-pointer rounded-xl px-4 py-2.5 text-[12px] font-medium transition-all ${
                                          active
                                            ? 'bg-[#4A5B4B] text-[#FAF8F5] shadow-md'
                                            : 'border border-[#E6E2DA] bg-[#F6F4EF] text-[#4A4741] hover:border-[#4A5B4B]/40 hover:bg-[#ECE8E0]'
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

                        <div className="mt-6 flex items-start gap-2.5 rounded-2xl border border-[#ECE8E0] bg-[#F6F4EF] px-4 py-3.5 text-[11.5px] leading-relaxed text-[#6C6961]">
                          <Clock className="mt-0.5 h-4 w-4 shrink-0 text-[#4A5B4B]" />
                          <span>
                            Times are shown in local sanctuary time (GMT+5:30).
                            Complimentary herbal tea awaits 10 minutes prior.
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              </>
            ) : (
              /* -------- STEP 3: GUEST DETAILS & CONFIRMATION -------- */
              <section className="rounded-[28px] border border-[#E6E2DA] bg-[#FAF8F5] p-8 shadow-sm sm:p-10">
                {isConfirmed ? (
                  <div className="py-6 text-center">
                    <span className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#E5ECE6] text-[#4A5B4B]">
                      <CheckCircle2 className="h-9 w-9" />
                    </span>
                    <p className="mt-5 text-[10.5px] font-semibold tracking-[0.24em] text-[#6B786A] uppercase">
                      Reservation Confirmed
                    </p>
                    <h2 className="mt-2 font-serif text-4xl font-semibold text-[#2A2927]">
                      We Look Forward to Welcoming You
                    </h2>
                    {bookingRef && (
                      <span className="mt-4 inline-block rounded-full bg-[#EFE0C6] px-4 py-1.5 text-xs font-semibold tracking-wider text-[#7A6444]">
                        Booking Ref: {bookingRef}
                      </span>
                    )}
                    <p className="mx-auto mt-4 max-w-md text-[13.5px] leading-relaxed text-[#6C6961]">
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
                    <div className="mt-8 flex flex-wrap justify-center gap-3.5">
                      <Link
                        to="/profile"
                        className="rounded-xl bg-[#4A5B4B] px-6 py-3 text-xs font-semibold text-[#FAF8F5] transition-colors hover:bg-[#3B4A3C]"
                      >
                        View in My Sanctuary
                      </Link>
                      <Link
                        to="/"
                        className="rounded-xl border border-[#DCD7CC] bg-[#F6F4EF] px-6 py-3 text-xs font-semibold text-[#2A2927] transition-colors hover:bg-[#ECE8E0]"
                      >
                        Return Home
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div>
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="inline-flex cursor-pointer items-center gap-1.5 text-xs font-semibold text-[#4A5B4B] transition-colors hover:text-[#2A2927]"
                    >
                      <ArrowLeft className="h-3.5 w-3.5" />
                      <span>Back to Specialist &amp; Time</span>
                    </button>

                    <p className="mt-6 text-[10px] font-semibold tracking-[0.24em] text-[#6B786A] uppercase">
                      Final Step
                    </p>
                    <h2 className="mt-1 font-serif text-3xl font-semibold text-[#2A2927]">
                      Your Guest Details
                    </h2>

                    <form
                      onSubmit={handleConfirmSubmit}
                      className="mt-7 space-y-5"
                    >
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                          <label className="block text-[12px] font-semibold text-[#4A4741]">
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
                            className="mt-1.5 w-full rounded-xl border border-[#E2DDD4] bg-[#F6F4EF] px-4 py-3 text-sm text-[#2A2927] focus:border-[#4A5B4B] focus:bg-[#FAF8F5] focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[12px] font-semibold text-[#4A4741]">
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
                            className="mt-1.5 w-full rounded-xl border border-[#E2DDD4] bg-[#F6F4EF] px-4 py-3 text-sm text-[#2A2927] focus:border-[#4A5B4B] focus:bg-[#FAF8F5] focus:outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[12px] font-semibold text-[#4A4741]">
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
                          className="mt-1.5 w-full rounded-xl border border-[#E2DDD4] bg-[#F6F4EF] px-4 py-3 text-sm text-[#2A2927] focus:border-[#4A5B4B] focus:bg-[#FAF8F5] focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[12px] font-semibold text-[#4A4741]">
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
                          className="mt-1.5 w-full rounded-xl border border-[#E2DDD4] bg-[#F6F4EF] px-4 py-3 text-sm text-[#2A2927] focus:border-[#4A5B4B] focus:bg-[#FAF8F5] focus:outline-none"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={savingBooking}
                        className="mt-2 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#4A5B4B] px-7 py-4 text-[13px] font-semibold tracking-wide text-[#FAF8F5] shadow-md transition-colors hover:bg-[#3B4A3C] disabled:opacity-60"
                      >
                        <span>
                          {savingBooking
                            ? 'Confirming Reservation...'
                            : 'Confirm Sanctuary Reservation'}
                        </span>
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </form>
                  </div>
                )}
              </section>
            )}
          </div>

          {/* RIGHT COLUMN: MODERN DARK-SAGE STICKY SUMMARY CARD */}
          <aside className="lg:sticky lg:top-24 lg:col-span-4">
            <div className="relative overflow-hidden rounded-[26px] bg-[#253026] p-7 text-[#FAF8F5] shadow-2xl">
              <div className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full bg-[#EFE0C6]/15 blur-2xl" />

              <div className="relative z-10">
                <div className="flex items-start justify-between border-b border-white/15 pb-4">
                  <div>
                    <p className="text-[9.5px] font-semibold tracking-[0.24em] text-[#EFE0C6] uppercase">
                      Summary
                    </p>
                    <h2 className="mt-1 font-serif text-[22px] font-medium text-[#FAF8F5]">
                      Your Sanctuary Ritual
                    </h2>
                  </div>
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-[#EFE0C6]">
                    <Flower2 className="h-4 w-4" strokeWidth={1.6} />
                  </span>
                </div>

                {/* Booked Services */}
                <div className="mt-5 space-y-3 border-b border-white/15 pb-5">
                  {bookedServices.map((svc) => (
                    <div
                      key={svc.id}
                      className="flex items-start justify-between gap-3 rounded-xl bg-white/6 px-3.5 py-3"
                    >
                      <div>
                        <p className="font-serif text-[15.5px] font-semibold text-[#FAF8F5]">
                          {svc.name}
                        </p>
                        {svc.subtitle && (
                          <p className="mt-0.5 text-[11px] text-[#A8B4A9]">
                            {svc.subtitle}
                          </p>
                        )}
                      </div>
                      <span className="shrink-0 font-serif text-[15px] font-semibold text-[#EFE0C6]">
                        {formatLKR(svc.price)}
                      </span>
                    </div>
                  ))}

                  <Link
                    to="/services"
                    className="inline-block text-[11px] font-medium text-[#EFE0C6] underline-offset-2 hover:underline"
                  >
                    + Modify or add treatments
                  </Link>
                </div>

                {/* Meta Rows */}
                <div className="space-y-3.5 border-b border-white/15 py-5 text-[12px]">
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-2 text-[#B9C2BA]">
                      <User className="h-3.5 w-3.5 text-[#EFE0C6]" />
                      Specialist
                    </span>
                    <span className="font-semibold text-[#FAF8F5]">
                      {selectedSpecialist.name}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-2 text-[#B9C2BA]">
                      <Calendar className="h-3.5 w-3.5 text-[#EFE0C6]" />
                      Date &amp; Time
                    </span>
                    <span className="font-semibold text-[#FAF8F5]">
                      {formatSummaryDate(selectedDate)} &middot; {selectedTime}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-2 text-[#B9C2BA]">
                      <Hourglass className="h-3.5 w-3.5 text-[#EFE0C6]" />
                      Duration
                    </span>
                    <span className="font-semibold text-[#FAF8F5]">
                      {totalDuration} mins
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-2 text-[#B9C2BA]">
                      <Sparkles className="h-3.5 w-3.5 text-[#EFE0C6]" />
                      Rewards
                    </span>
                    <span className="font-medium text-[#EFE0C6]">
                      +{blossomsEarned} Blossoms
                    </span>
                  </div>
                </div>

                {/* Estimated Total */}
                <div className="flex items-start justify-between pt-5">
                  <div>
                    <p className="font-serif text-[18px] font-medium text-[#FAF8F5]">
                      Estimated Total
                    </p>
                    <p className="mt-0.5 text-[10.5px] text-[#9AA59B]">
                      Inclusive of all local taxes
                    </p>
                  </div>
                  <p className="font-serif text-[24px] font-semibold text-[#EFE0C6]">
                    {formatLKR(estimatedTotal)}
                  </p>
                </div>

                {/* CTA Button */}
                {step === 2 && (
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="mt-7 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#EFE0C6] px-5 py-3.5 text-[13px] font-semibold tracking-wide text-[#222B23] shadow-lg transition-colors hover:bg-[#FAF8F5]"
                  >
                    <span>Proceed to Details</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                )}

                <p className="mt-4 flex items-center justify-center gap-1.5 text-[10.5px] text-[#9AA59B]">
                  <ShieldCheck className="h-3.5 w-3.5 text-[#EFE0C6]" />
                  <span>Free rescheduling up to 24 hours prior</span>
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
