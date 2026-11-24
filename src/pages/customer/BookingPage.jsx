import { useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Banknote,
  Building2,
  Calendar,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  CreditCard,
  Flower2,
  Hourglass,
  Lock,
  QrCode,
  ShieldCheck,
  Sparkles,
  Star,
  User,
  Wallet,
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

const CUSTOMER_PAYMENT_METHODS = [
  {
    id: 'credit_card',
    label: 'Credit Card',
    subtitle: 'Visa, Mastercard or Amex',
    badge: 'Instant',
    icon: CreditCard,
  },
  {
    id: 'debit_card',
    label: 'Debit Card',
    subtitle: 'Visa Debit or Mastercard Debit',
    badge: 'Direct Bank',
    icon: CreditCard,
  },
  {
    id: 'qr',
    label: 'LankaQR / Bank Transfer',
    subtitle: 'FriMi, Genie, or instant bank',
    badge: 'Zero Fee',
    icon: QrCode,
  },
  {
    id: 'bnpl',
    label: 'Koko / Mintpay',
    subtitle: '3 interest-free installments',
    badge: '3× Split',
    icon: Wallet,
  },
  {
    id: 'salon',
    label: 'Pay at Sanctuary',
    subtitle: 'Card or cash upon arrival',
    badge: 'LKR 0 Today',
    icon: Banknote,
  },
];

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
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [paymentPlan, setPaymentPlan] = useState('deposit'); // 'deposit' | 'full'
  const [cardDetails, setCardDetails] = useState({
    holder: user?.name || '',
    number: '',
    expiry: '',
    cvc: '',
  });
  const [transferRef, setTransferRef] = useState('');
  const [isConfirmed, setIsConfirmed] = useState(false);

  const selectedPaymentMeta = useMemo(
    () =>
      CUSTOMER_PAYMENT_METHODS.find((m) => m.id === paymentMethod) ||
      CUSTOMER_PAYMENT_METHODS[0],
    [paymentMethod]
  );

  const depositAmount = Math.round(estimatedTotal * 0.25);
  const installmentAmount = Math.round(estimatedTotal / 3);
  const dueToday = useMemo(() => {
    if (paymentMethod === 'salon') return 0;
    if (paymentMethod === 'bnpl') return installmentAmount;
    return paymentPlan === 'full' ? estimatedTotal : depositAmount;
  }, [paymentMethod, paymentPlan, estimatedTotal, depositAmount, installmentAmount]);

  const balanceAtSalon = Math.max(0, estimatedTotal - dueToday);

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

    const paymentNote = `Payment: ${selectedPaymentMeta.label}${
      dueToday > 0 ? ` (${formatLKR(dueToday)} paid online)` : ' (Pay at Sanctuary)'
    }${transferRef.trim() ? ` • Ref: ${transferRef.trim()}` : ''}`;

    const combinedNotes = [guestDetails.notes.trim(), paymentNote]
      .filter(Boolean)
      .join(' | ');

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
        deposit_lkr: dueToday,
        notes: combinedNotes,
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

                    {/* Confirmed Payment Pass */}
                    <div className="mx-auto mt-6 grid max-w-md grid-cols-2 gap-3 rounded-2xl border border-[#E6E2DA] bg-[#F5F2EC] p-4 text-left text-xs">
                      <div>
                        <p className="text-[10px] font-semibold tracking-wider text-[#8A867E] uppercase">
                          Payment Method
                        </p>
                        <p className="mt-0.5 font-semibold text-[#222B23]">
                          {selectedPaymentMeta.label}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-semibold tracking-wider text-[#8A867E] uppercase">
                          {dueToday > 0 ? 'Paid Today' : 'Due at Sanctuary'}
                        </p>
                        <p className="mt-0.5 font-serif text-base font-semibold text-[#253026]">
                          {dueToday > 0
                            ? formatLKR(dueToday)
                            : formatLKR(estimatedTotal)}
                        </p>
                      </div>
                    </div>

                    <div className="mt-8 flex flex-wrap justify-center gap-3.5">
                      <button
                        type="button"
                        onClick={() => {
                          setIsConfirmed(false);
                          setStep(2);
                        }}
                        className="cursor-pointer rounded-full bg-[#253026] px-6 py-3 text-xs font-semibold text-[#FAF8F5] transition-colors hover:bg-[#344335]"
                      >
                        Book Another Ritual
                      </button>
                      <Link
                        to="/"
                        className="rounded-full border border-[#DCD7CC] bg-[#F6F4EF] px-6 py-3 text-xs font-semibold text-[#2A2927] transition-colors hover:bg-[#ECE8E0]"
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
                          rows={2}
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

                      {/* ================= PAYMENT METHOD SELECTION ================= */}
                      <div className="border-t border-[#ECE8E0] pt-6">
                        <div className="flex flex-wrap items-baseline justify-between gap-2">
                          <div>
                            <p className="text-[10px] font-semibold tracking-[0.22em] text-[#6B786A] uppercase">
                              Secure Sanctuary Checkout
                            </p>
                            <h3 className="mt-0.5 font-serif text-2xl font-semibold text-[#222B23]">
                              Select Payment Method
                            </h3>
                          </div>
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#6C6961]">
                            <Lock className="h-3 w-3 text-[#4A5B4B]" />
                            256-Bit Encrypted
                          </span>
                        </div>

                        {/* 4 Modern Payment Method Cards */}
                        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                          {CUSTOMER_PAYMENT_METHODS.map((method) => {
                            const Icon = method.icon;
                            const active = paymentMethod === method.id;
                            return (
                              <button
                                key={method.id}
                                type="button"
                                onClick={() => setPaymentMethod(method.id)}
                                className={`flex cursor-pointer items-start justify-between gap-3 rounded-2xl border p-4 text-left transition-all ${
                                  active
                                    ? 'border-[#253026] bg-[#253026] text-[#FAF8F5] shadow-md'
                                    : 'border-[#E5E1D8] bg-[#F6F4EF] text-[#2A2927] hover:border-[#CFC9BE] hover:bg-[#FAF8F5]'
                                }`}
                              >
                                <div className="flex items-start gap-3">
                                  <span
                                    className={`mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                                      active
                                        ? 'bg-white/12 text-[#EFE0C6]'
                                        : 'bg-[#FAF8F5] text-[#4A5B4B]'
                                    }`}
                                  >
                                    <Icon className="h-4 w-4" strokeWidth={1.8} />
                                  </span>
                                  <div>
                                    <p className="text-[13px] font-semibold leading-tight">
                                      {method.label}
                                    </p>
                                    <p
                                      className={`mt-1 text-[11px] ${
                                        active
                                          ? 'text-[#C5D1C7]'
                                          : 'text-[#7A766E]'
                                      }`}
                                    >
                                      {method.subtitle}
                                    </p>
                                  </div>
                                </div>

                                <span
                                  className={`shrink-0 rounded-full px-2 py-0.5 text-[9.5px] font-semibold ${
                                    active
                                      ? 'bg-[#EFE0C6] text-[#222B23]'
                                      : 'bg-[#EAE5DC] text-[#57544E]'
                                  }`}
                                >
                                  {method.badge}
                                </span>
                              </button>
                            );
                          })}
                        </div>

                        {/* Deposit vs Full Toggle (for Credit Card, Debit Card & LankaQR) */}
                        {(paymentMethod === 'credit_card' ||
                          paymentMethod === 'debit_card' ||
                          paymentMethod === 'qr') && (
                          <div className="mt-4 grid grid-cols-2 gap-2.5 rounded-2xl border border-[#E6E2DA] bg-[#F5F2EC] p-1.5 text-xs">
                            <button
                              type="button"
                              onClick={() => setPaymentPlan('deposit')}
                              className={`cursor-pointer rounded-xl px-3.5 py-2.5 text-left transition-all ${
                                paymentPlan === 'deposit'
                                  ? 'bg-[#FAF8F5] font-semibold text-[#222B23] shadow-2xs'
                                  : 'text-[#6C6961] hover:text-[#222B23]'
                              }`}
                            >
                              <span className="block text-[11.5px]">
                                25% Booking Deposit
                              </span>
                              <span className="mt-0.5 block font-serif text-[14px] text-[#4A5B4B]">
                                {formatLKR(depositAmount)} today
                              </span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setPaymentPlan('full')}
                              className={`cursor-pointer rounded-xl px-3.5 py-2.5 text-left transition-all ${
                                paymentPlan === 'full'
                                  ? 'bg-[#FAF8F5] font-semibold text-[#222B23] shadow-2xs'
                                  : 'text-[#6C6961] hover:text-[#222B23]'
                              }`}
                            >
                              <span className="block text-[11.5px]">
                                Pay Full Amount
                              </span>
                              <span className="mt-0.5 block font-serif text-[14px] text-[#4A5B4B]">
                                {formatLKR(estimatedTotal)} today
                              </span>
                            </button>
                          </div>
                        )}

                        {/* Contextual Panel: Credit Card / Debit Card */}
                        {(paymentMethod === 'credit_card' ||
                          paymentMethod === 'debit_card') && (
                          <div className="mt-4 space-y-3 rounded-2xl border border-[#E6E2DA] bg-[#F6F4EF] p-4">
                            <div className="flex items-center justify-between border-b border-[#E6E2DA] pb-2.5 text-[11px]">
                              <span className="font-semibold text-[#222B23]">
                                {paymentMethod === 'credit_card'
                                  ? 'Credit Card Details'
                                  : 'Debit Card Details'}
                              </span>
                              <span className="text-[#7A766E]">
                                {paymentMethod === 'credit_card'
                                  ? 'Visa • Mastercard • Amex'
                                  : 'Visa Debit • Mastercard Debit'}
                              </span>
                            </div>
                            <div>
                              <label className="block text-[11px] font-semibold text-[#57544E]">
                                Cardholder Name
                              </label>
                              <input
                                type="text"
                                required
                                value={cardDetails.holder}
                                onChange={(e) =>
                                  setCardDetails({
                                    ...cardDetails,
                                    holder: e.target.value,
                                  })
                                }
                                placeholder="Name on card"
                                className="mt-1 w-full rounded-xl border border-[#E2DDD4] bg-[#FAF8F5] px-3.5 py-2.5 text-sm text-[#2A2927] focus:border-[#253026] focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-semibold text-[#57544E]">
                                Card Number
                              </label>
                              <input
                                type="text"
                                required
                                inputMode="numeric"
                                maxLength={19}
                                value={cardDetails.number}
                                onChange={(e) => {
                                  const digits = e.target.value
                                    .replace(/\D/g, '')
                                    .slice(0, 16);
                                  const formatted = digits.replace(
                                    /(\d{4})(?=\d)/g,
                                    '$1 '
                                  );
                                  setCardDetails({
                                    ...cardDetails,
                                    number: formatted,
                                  });
                                }}
                                placeholder="4532 •••• •••• 8910"
                                className="mt-1 w-full rounded-xl border border-[#E2DDD4] bg-[#FAF8F5] px-3.5 py-2.5 font-mono text-sm text-[#2A2927] focus:border-[#253026] focus:outline-none"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="block text-[11px] font-semibold text-[#57544E]">
                                  Expiry Date
                                </label>
                                <input
                                  type="text"
                                  required
                                  maxLength={5}
                                  value={cardDetails.expiry}
                                  onChange={(e) =>
                                    setCardDetails({
                                      ...cardDetails,
                                      expiry: e.target.value,
                                    })
                                  }
                                  placeholder="MM/YY"
                                  className="mt-1 w-full rounded-xl border border-[#E2DDD4] bg-[#FAF8F5] px-3.5 py-2.5 text-sm text-[#2A2927] focus:border-[#253026] focus:outline-none"
                                />
                              </div>
                              <div>
                                <label className="block text-[11px] font-semibold text-[#57544E]">
                                  CVC / CVV
                                </label>
                                <input
                                  type="password"
                                  required
                                  maxLength={4}
                                  value={cardDetails.cvc}
                                  onChange={(e) =>
                                    setCardDetails({
                                      ...cardDetails,
                                      cvc: e.target.value,
                                    })
                                  }
                                  placeholder="•••"
                                  className="mt-1 w-full rounded-xl border border-[#E2DDD4] bg-[#FAF8F5] px-3.5 py-2.5 text-sm text-[#2A2927] focus:border-[#253026] focus:outline-none"
                                />
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Contextual Panel: LankaQR / Bank Transfer */}
                        {paymentMethod === 'qr' && (
                          <div className="mt-4 space-y-3 rounded-2xl border border-[#E6E2DA] bg-[#F6F4EF] p-4 text-xs text-[#4A4741]">
                            <div className="flex items-start gap-3">
                              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#253026] text-[#EFE0C6]">
                                <Building2 className="h-4.5 w-4.5" />
                              </span>
                              <div>
                                <p className="font-semibold text-[#222B23]">
                                  Commercial Bank &middot; Cinnamon Gardens
                                </p>
                                <p className="mt-0.5 text-[#6C6961]">
                                  Account: <strong>Vera &amp; Bloom (Pvt) Ltd</strong>{' '}
                                  &bull; No: <strong>1004 8821 90</strong>
                                </p>
                              </div>
                            </div>
                            <div>
                              <label className="block text-[11px] font-semibold text-[#57544E]">
                                Transfer / LankaQR Reference (Optional)
                              </label>
                              <input
                                type="text"
                                value={transferRef}
                                onChange={(e) => setTransferRef(e.target.value)}
                                placeholder="e.g. LQR-908412"
                                className="mt-1 w-full rounded-xl border border-[#E2DDD4] bg-[#FAF8F5] px-3.5 py-2 text-xs text-[#2A2927] focus:border-[#253026] focus:outline-none"
                              />
                            </div>
                          </div>
                        )}

                        {/* Contextual Panel: Koko / Mintpay */}
                        {paymentMethod === 'bnpl' && (
                          <div className="mt-4 rounded-2xl border border-[#E6E2DA] bg-[#F6F4EF] p-4 text-xs text-[#4A4741]">
                            <p className="font-semibold text-[#222B23]">
                              Split into 3 × {formatLKR(installmentAmount)}{' '}
                              interest-free installments
                            </p>
                            <p className="mt-1 text-[#6C6961]">
                              Pay {formatLKR(installmentAmount)} today and the
                              remaining 2 payments automatically over the next 2
                              months with 0% interest.
                            </p>
                          </div>
                        )}

                        {/* Contextual Panel: Pay at Sanctuary */}
                        {paymentMethod === 'salon' && (
                          <div className="mt-4 rounded-2xl border border-[#E6E2DA] bg-[#F6F4EF] p-4 text-xs text-[#4A4741]">
                            <p className="font-semibold text-[#222B23]">
                              No upfront payment required today
                            </p>
                            <p className="mt-1 text-[#6C6961]">
                              Settle your ritual at our Colombo 07 reception desk
                              via Card, Cash, or LankaQR after your session.
                            </p>
                          </div>
                        )}
                      </div>

                      <button
                        type="submit"
                        disabled={savingBooking}
                        className="mt-2 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-[#253026] px-7 py-4 text-[13px] font-semibold tracking-wide text-[#FAF8F5] shadow-md transition-colors hover:bg-[#344335] disabled:opacity-60"
                      >
                        <span>
                          {savingBooking
                            ? 'Confirming Reservation...'
                            : dueToday > 0
                              ? `Pay ${formatLKR(dueToday)} & Confirm Reservation`
                              : 'Confirm Sanctuary Reservation'}
                        </span>
                        <ArrowRight className="h-4 w-4 text-[#EFE0C6]" />
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

                {/* Estimated Total & Payment Breakdown */}
                <div className="space-y-2.5 pt-5">
                  <div className="flex items-start justify-between">
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

                  {step === 3 && (
                    <div className="space-y-1.5 rounded-2xl border border-white/10 bg-white/[0.06] p-3.5 text-[11.5px]">
                      <div className="flex items-center justify-between">
                        <span className="text-[#B9C2BA]">Payment Method</span>
                        <span className="font-semibold text-[#FAF8F5]">
                          {selectedPaymentMeta.label}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[#B9C2BA]">Due Today</span>
                        <span className="font-semibold text-[#EFE0C6]">
                          {formatLKR(dueToday)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[#B9C2BA]">
                          Balance at Sanctuary
                        </span>
                        <span className="font-medium text-[#FAF8F5]">
                          {formatLKR(balanceAtSalon)}
                        </span>
                      </div>
                    </div>
                  )}
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
