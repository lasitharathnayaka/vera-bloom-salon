import { useMemo, useState } from 'react';
import {
  CalendarCheck,
  Check,
  ChevronLeft,
  ChevronRight,
  Mail,
  Phone,
  Plus,
  X,
} from 'lucide-react';

import specialistElena from '../../assets/specialist-elena.jpg';
import specialistAmara from '../../assets/specialist-amara.jpg';
import specialistJulian from '../../assets/specialist-julian.jpg';
import founderVera from '../../assets/founder-vera.jpg';

const CALENDAR_SPECIALISTS = [
  {
    id: 'elena',
    name: 'Elena Rostova',
    role: 'Senior Colorist',
    avatar: specialistElena,
  },
  {
    id: 'amara',
    name: 'Amara Thorne',
    role: 'Bridal & Facialist',
    avatar: specialistAmara,
  },
  {
    id: 'julian',
    name: 'Julian Vance',
    role: 'Master Stylist',
    avatar: specialistJulian,
  },
  {
    id: 'clara',
    name: 'Clara Vance',
    role: 'Nail & Spa Artist',
    avatar: founderVera,
  },
];

const TIME_SLOTS = [
  '09:00 AM',
  '09:30 AM',
  '10:00 AM',
  '10:30 AM',
  '11:00 AM',
  '11:30 AM',
  '12:00 PM',
  '12:30 PM',
  '01:00 PM',
  '01:30 PM',
  '02:00 PM',
  '02:30 PM',
  '03:00 PM',
  '03:30 PM',
  '04:00 PM',
  '04:30 PM',
  '05:00 PM',
];

const INITIAL_APPOINTMENTS = [
  {
    id: 'appt-emma',
    specialistId: 'elena',
    startSlotIndex: 1, // 09:30 AM row
    spanSlots: 2,
    status: 'CONFIRMED',
    timeRange: '10:15 - 12:30',
    client: 'Emma Vance',
    clientTier: 'VIP Client',
    phone: '+94 77 345 6789',
    email: 'emma.vance@luxury.lk',
    shortService: 'Organic Hair Care & Gloss',
    fullService: 'Organic Hair Care & Botanical Facial',
    specialistLabel: 'Elena Rostova & Amara Thorne',
    duration: '135 mins',
    totalLKR: 18500,
    depositText: 'LKR 5,000 via Visa',
    balanceText: 'LKR 13,500',
    notes:
      'Custom color gloss with signature rejuvenating herbal infusion. Sensitive scalp formulation applied with organic chamomile base.',
    tone: 'sage',
  },
  {
    id: 'appt-priya',
    specialistId: 'amara',
    startSlotIndex: 2, // 10:00 AM row
    spanSlots: 2,
    status: 'IN-CHAIR',
    timeRange: '11:30 - 01:00',
    client: 'Priya & Dilshan',
    clientTier: "Couple's Suite",
    phone: '+94 77 812 4401',
    email: 'priya.d@example.lk',
    shortService: 'Botanical Facial',
    fullService: "Couple's Cell-Renewal Botanical Facial",
    specialistLabel: 'Amara Thorne',
    duration: '90 mins',
    totalLKR: 16000,
    depositText: 'LKR 4,000 via Card',
    balanceText: 'LKR 12,000',
    notes:
      'Warm rosehip steam with lymphatic jade massage. Herbal white tea service requested post-ritual.',
    tone: 'sand',
  },
  {
    id: 'appt-natasha',
    specialistId: 'julian',
    startSlotIndex: 5, // 11:30 AM row
    spanSlots: 2,
    status: 'CONFIRMED',
    timeRange: '11:30 - 01:00',
    client: 'Natasha M.',
    clientTier: 'Bridal VIP',
    phone: '+94 71 904 2219',
    email: 'natasha.m@example.lk',
    shortService: 'Bridal Hair Trial',
    fullService: 'Classic Wedding Day Hair & Veil Trial',
    specialistLabel: 'Julian Vance',
    duration: '120 mins',
    totalLKR: 25000,
    depositText: 'LKR 10,000 via Bank',
    balanceText: 'LKR 15,000',
    notes:
      'Private bridal consultation suite #2. Testing soft organic floral updo with fresh jasmine & eucalyptus accents.',
    tone: 'sage',
  },
  {
    id: 'appt-sophia',
    specialistId: 'clara',
    startSlotIndex: 10, // 02:00 PM row
    spanSlots: 2,
    status: 'CONFIRMED',
    timeRange: '02:00 - 03:00',
    client: 'Sophia Chen',
    clientTier: 'Member',
    phone: '+94 76 551 0982',
    email: 'sophia.chen@example.lk',
    shortService: 'Botanical Manicure & Wrap',
    fullService: 'Botanical Manicure & Warm Shea Wrap',
    specialistLabel: 'Clara Vance',
    duration: '60 mins',
    totalLKR: 3500,
    depositText: 'Paid in Full',
    balanceText: 'LKR 0',
    notes:
      'Sweet almond cuticle treatment and sheer botanical leaf nail art finish.',
    tone: 'sand',
  },
];

const ROW_HEIGHT = 54;

export default function ManageAppointmentsPage() {
  const [currentDate, setCurrentDate] = useState(new Date(2024, 10, 22)); // Nov 22, 2024
  const [viewMode, setViewMode] = useState('Day');
  const [selectedSpecialistFilter, setSelectedSpecialistFilter] =
    useState('all');
  const [appointments, setAppointments] = useState(INITIAL_APPOINTMENTS);
  const [activeApptId, setActiveApptId] = useState('appt-emma');
  const [showNewModal, setShowNewModal] = useState(false);
  const [newBooking, setNewBooking] = useState({
    client: '',
    specialistId: 'elena',
    startSlotIndex: 4,
    service: 'Organic Botanical Hair Glossing',
  });

  const visibleSpecialists = useMemo(() => {
    if (selectedSpecialistFilter === 'all') return CALENDAR_SPECIALISTS;
    return CALENDAR_SPECIALISTS.filter((s) => s.id === selectedSpecialistFilter);
  }, [selectedSpecialistFilter]);

  const activeAppointment = useMemo(
    () => appointments.find((a) => a.id === activeApptId) || null,
    [appointments, activeApptId]
  );

  const formattedDate = useMemo(() => {
    const label = currentDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
    return `Today, ${label}`;
  }, [currentDate]);

  const shiftDay = (delta) => {
    setCurrentDate(
      (prev) =>
        new Date(prev.getFullYear(), prev.getMonth(), prev.getDate() + delta)
    );
  };

  const handleCompleteCheckout = (id) => {
    setAppointments((prev) =>
      prev.map((a) =>
        a.id === id
          ? { ...a, status: 'COMPLETED', balanceText: 'LKR 0 (Paid)' }
          : a
      )
    );
  };

  const handleCreateAppointment = (e) => {
    e.preventDefault();
    if (!newBooking.client.trim()) return;
    const spec =
      CALENDAR_SPECIALISTS.find((s) => s.id === newBooking.specialistId) ||
      CALENDAR_SPECIALISTS[0];
    const startLabel = TIME_SLOTS[Number(newBooking.startSlotIndex)] || '11:00 AM';
    const created = {
      id: `appt-${Date.now()}`,
      specialistId: newBooking.specialistId,
      startSlotIndex: Number(newBooking.startSlotIndex),
      spanSlots: 2,
      status: 'CONFIRMED',
      timeRange: `${startLabel.replace(' AM', '').replace(' PM', '')} • 60m`,
      client: newBooking.client.trim(),
      clientTier: 'Walk-in Guest',
      phone: '+94 77 000 1234',
      email: 'guest@verabloom.lk',
      shortService: newBooking.service,
      fullService: newBooking.service,
      specialistLabel: spec.name,
      duration: '60 mins',
      totalLKR: 6500,
      depositText: 'Pending',
      balanceText: 'LKR 6,500',
      notes: 'Added via Admin Appointment Calendar.',
      tone: 'sage',
    };
    setAppointments((prev) => [...prev, created]);
    setActiveApptId(created.id);
    setNewBooking({
      client: '',
      specialistId: 'elena',
      startSlotIndex: 4,
      service: 'Organic Botanical Hair Glossing',
    });
    setShowNewModal(false);
  };

  return (
    <div className="relative flex flex-col gap-6">
      {/* ================= TOP CALENDAR CONTROLS ================= */}
      <div className="space-y-4">
        {/* Row 1: Date Picker + Day/Week/Month Toggle */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="inline-flex items-center gap-3 rounded-lg border border-[#E5E1D8] bg-[#F2EFE9] px-3 py-2 text-[12.5px] font-medium text-[#2A2927]">
            <button
              type="button"
              onClick={() => shiftDay(-1)}
              aria-label="Previous day"
              className="cursor-pointer rounded p-0.5 text-[#6C6961] transition-colors hover:bg-[#E5E1D8] hover:text-[#2A2927]"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="min-w-[140px] text-center font-serif text-[14.5px] font-semibold">
              {formattedDate}
            </span>
            <button
              type="button"
              onClick={() => shiftDay(1)}
              aria-label="Next day"
              className="cursor-pointer rounded p-0.5 text-[#6C6961] transition-colors hover:bg-[#E5E1D8] hover:text-[#2A2927]"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div className="inline-flex rounded-lg border border-[#E5E1D8] bg-[#EFECE6] p-1 text-[11.5px]">
            {['Day', 'Week', 'Month'].map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setViewMode(mode)}
                className={`cursor-pointer rounded-md px-4 py-1.5 font-medium transition-colors ${
                  viewMode === mode
                    ? 'bg-[#FAF8F5] text-[#2A2927] shadow-2xs'
                    : 'text-[#6C6961] hover:text-[#2A2927]'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        {/* Row 2: Specialist Filter Pills + New Appointment CTA */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#ECE8E0] pb-5">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setSelectedSpecialistFilter('all')}
              className={`cursor-pointer rounded-lg px-4 py-2 text-[12px] font-medium transition-colors ${
                selectedSpecialistFilter === 'all'
                  ? 'bg-[#4A5B4B] text-[#FAF8F5] shadow-2xs'
                  : 'bg-[#EFECE6] text-[#57544E] hover:bg-[#E5E1D8]'
              }`}
            >
              All Specialists
            </button>

            {CALENDAR_SPECIALISTS.map((spec) => (
              <button
                key={spec.id}
                type="button"
                onClick={() => setSelectedSpecialistFilter(spec.id)}
                className={`cursor-pointer rounded-lg px-4 py-2 text-[12px] font-medium transition-colors ${
                  selectedSpecialistFilter === spec.id
                    ? 'bg-[#4A5B4B] text-[#FAF8F5] shadow-2xs'
                    : 'bg-[#EFECE6] text-[#57544E] hover:bg-[#E5E1D8]'
                }`}
              >
                {spec.name}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setShowNewModal(true)}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-[#4A5B4B] px-5 py-2.5 text-[12px] font-medium tracking-wide text-[#FAF8F5] shadow-xs transition-colors hover:bg-[#3B4A3C]"
          >
            <Plus className="h-3.5 w-3.5" strokeWidth={2.2} />
            <span>New Appointment</span>
          </button>
        </div>
      </div>

      {/* ================= CALENDAR GRID + DETAILS DRAWER ================= */}
      <div className="relative flex flex-col gap-6 xl:flex-row">
        {/* Multi-Specialist Time Grid */}
        <div className="flex-1 overflow-x-auto rounded-2xl border border-[#ECE8E0] bg-[#F5F3EE]">
          <div className="min-w-[680px]">
            {/* Specialist Column Headers */}
            <div
              className="grid border-b border-[#E7E3DB] bg-[#F2EFE9] px-4 py-4"
              style={{
                gridTemplateColumns: `88px repeat(${visibleSpecialists.length}, minmax(160px, 1fr))`,
              }}
            >
              <div className="flex items-center text-[10px] font-semibold tracking-[0.16em] text-[#8A867E] uppercase">
                Time:
              </div>

              {visibleSpecialists.map((spec) => (
                <div key={spec.id} className="flex items-center gap-3 px-2">
                  <img
                    src={spec.avatar}
                    alt={spec.name}
                    className="h-9 w-9 shrink-0 rounded-full border border-[#E2DDD4] object-cover"
                  />
                  <div className="min-w-0">
                    <p className="truncate font-serif text-[14.5px] font-semibold text-[#2A2927]">
                      {spec.name}
                    </p>
                    <p className="truncate text-[10.5px] text-[#7A766E]">
                      {spec.role}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Time Rows + Overlay Blocks */}
            <div
              className="relative grid px-4"
              style={{
                gridTemplateColumns: `88px repeat(${visibleSpecialists.length}, minmax(160px, 1fr))`,
              }}
            >
              {/* Left Time Gutter */}
              <div>
                {TIME_SLOTS.map((slot) => (
                  <div
                    key={slot}
                    style={{ height: `${ROW_HEIGHT}px` }}
                    className="flex items-start pt-2 text-[10.5px] font-medium text-[#8A867E]"
                  >
                    {slot}
                  </div>
                ))}
              </div>

              {/* Specialist Columns */}
              {visibleSpecialists.map((spec) => {
                const specAppts = appointments.filter(
                  (a) => a.specialistId === spec.id
                );

                return (
                  <div
                    key={spec.id}
                    className="relative border-l border-[#ECE8E0]/80"
                  >
                    {/* Background Hour Lines */}
                    {TIME_SLOTS.map((slot) => (
                      <div
                        key={slot}
                        style={{ height: `${ROW_HEIGHT}px` }}
                        className="border-b border-[#ECE8E0]/70"
                      />
                    ))}

                    {/* Positioned Appointment Cards */}
                    {specAppts.map((appt) => {
                      const isSelected = appt.id === activeApptId;
                      const topPx = appt.startSlotIndex * ROW_HEIGHT + 4;
                      const heightPx = appt.spanSlots * ROW_HEIGHT - 8;

                      const isSand = appt.tone === 'sand';

                      return (
                        <button
                          key={appt.id}
                          type="button"
                          onClick={() => setActiveApptId(appt.id)}
                          style={{ top: `${topPx}px`, height: `${heightPx}px` }}
                          className={`absolute inset-x-2 z-10 flex cursor-pointer flex-col justify-between rounded-xl p-3 text-left transition-all ${
                            isSand
                              ? 'border border-[#E3CFAF] bg-[#EFE0C6] text-[#2A2927] shadow-sm hover:bg-[#E9D7B7]'
                              : 'bg-[#4A5B4B] text-[#FAF8F5] shadow-md hover:bg-[#3F4F40]'
                          } ${isSelected ? 'ring-2 ring-[#2A2927]/35 ring-offset-1' : ''}`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span
                              className={`rounded px-1.5 py-0.5 text-[8.5px] font-semibold tracking-wider uppercase ${
                                isSand
                                  ? 'bg-[#E3CFAF]/70 text-[#6E5634]'
                                  : 'bg-[#5F7361] text-[#FAF8F5]'
                              }`}
                            >
                              {appt.status}
                            </span>
                            <span
                              className={`text-[9.5px] font-medium ${
                                isSand ? 'text-[#6E5634]' : 'text-[#DCE5DD]'
                              }`}
                            >
                              {appt.timeRange}
                            </span>
                          </div>

                          <div>
                            <p className="truncate font-serif text-[15px] font-semibold leading-tight">
                              {appt.client}
                            </p>
                            <p
                              className={`mt-0.5 truncate text-[10.5px] ${
                                isSand ? 'text-[#6E5634]' : 'text-[#DCE5DD]'
                              }`}
                            >
                              {appt.shortService}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ================= RIGHT APPOINTMENT DETAILS DRAWER ================= */}
        {activeAppointment && (
          <aside className="flex w-full shrink-0 flex-col justify-between overflow-hidden rounded-2xl border border-[#E5E1D8] bg-[#F1EFEA] shadow-lg xl:w-[350px]">
            <div>
              {/* Drawer Header */}
              <div className="flex items-center justify-between border-b border-[#E5E1D8] px-5 py-4">
                <div className="flex items-center gap-2 text-[#2A2927]">
                  <CalendarCheck
                    className="h-4 w-4 text-[#4A5B4B]"
                    strokeWidth={1.8}
                  />
                  <h2 className="font-serif text-[17px] font-semibold">
                    Appointment Details
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveApptId(null)}
                  aria-label="Close appointment details"
                  className="cursor-pointer rounded-md p-1 text-[#7A766E] transition-colors hover:bg-[#E5E1D8] hover:text-[#2A2927]"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Drawer Cards */}
              <div className="space-y-4 p-5">
                {/* Client Card */}
                <div className="rounded-xl border border-[#ECE8E0] bg-[#FAF8F5] p-4">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-serif text-[18px] font-semibold text-[#2A2927]">
                      {activeAppointment.client}
                    </h3>
                    <span className="rounded-full bg-[#D5E8D7] px-2.5 py-0.5 text-[10px] font-semibold text-[#355A3A]">
                      {activeAppointment.clientTier}
                    </span>
                  </div>

                  <div className="mt-2.5 space-y-1 text-[11.5px] text-[#6C6961]">
                    <p className="flex items-center gap-2">
                      <Phone className="h-3 w-3 text-[#6B786A]" />
                      <span>{activeAppointment.phone}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <Mail className="h-3 w-3 text-[#6B786A]" />
                      <span>{activeAppointment.email}</span>
                    </p>
                  </div>
                </div>

                {/* Selected Services Card */}
                <div className="rounded-xl border border-[#ECE8E0] bg-[#FAF8F5] p-4">
                  <div className="flex items-center justify-between text-[11.5px]">
                    <span className="font-semibold text-[#57544E]">
                      Selected Services
                    </span>
                    <span className="font-semibold text-[#2A2927]">
                      {activeAppointment.duration}
                    </span>
                  </div>

                  <p className="mt-2.5 font-serif text-[15.5px] font-semibold text-[#2A2927]">
                    {activeAppointment.fullService}
                  </p>
                  <p className="mt-0.5 text-[11px] text-[#7A766E]">
                    Specialist: {activeAppointment.specialistLabel}
                  </p>
                  <p className="mt-3 font-serif text-[19px] font-semibold text-[#2A2927]">
                    LKR {activeAppointment.totalLKR.toLocaleString('en-US')}
                  </p>
                </div>

                {/* Service Notes & Formula Card */}
                <div className="rounded-xl border border-[#ECE8E0] bg-[#FAF8F5] p-4">
                  <p className="text-[11.5px] font-semibold text-[#57544E]">
                    Service Notes &amp; Formula
                  </p>
                  <div className="mt-2.5 rounded-lg bg-[#F3F1EC] p-3 text-[11.5px] leading-relaxed text-[#57544E]">
                    {activeAppointment.notes}
                  </div>
                </div>

                {/* Payment Status Card */}
                <div className="rounded-xl border border-[#ECE8E0] bg-[#FAF8F5] p-4">
                  <p className="text-[11.5px] font-semibold text-[#57544E]">
                    Payment Status
                  </p>
                  <div className="mt-2.5 space-y-1.5 text-[12px]">
                    <div className="flex items-center justify-between">
                      <span className="text-[#7A766E]">Deposit Paid</span>
                      <span className="font-semibold text-[#2A2927]">
                        {activeAppointment.depositText}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#7A766E]">Balance Due</span>
                      <span className="font-semibold text-[#2A2927]">
                        {activeAppointment.balanceText}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sticky Drawer Actions */}
            <div className="flex items-center gap-2.5 border-t border-[#E5E1D8] bg-[#FAF8F5] p-4">
              <button
                type="button"
                onClick={() => handleCompleteCheckout(activeAppointment.id)}
                className="inline-flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-[#4A5B4B] px-4 py-2.5 text-[12px] font-medium text-[#FAF8F5] shadow-xs transition-colors hover:bg-[#3B4A3C]"
              >
                {activeAppointment.status === 'COMPLETED' && (
                  <Check className="h-3.5 w-3.5" />
                )}
                <span>
                  {activeAppointment.status === 'COMPLETED'
                    ? 'Completed'
                    : 'Complete & Checkout'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => shiftDay(1)}
                className="cursor-pointer rounded-lg border border-[#E2DDD4] bg-[#F2EFE9] px-4 py-2.5 text-[12px] font-medium text-[#2A2927] transition-colors hover:bg-[#E6E2DA]"
              >
                Reschedule
              </button>
            </div>
          </aside>
        )}
      </div>

      {/* ================= QUICK NEW APPOINTMENT MODAL ================= */}
      {showNewModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#1F1E1C]/50 p-4 backdrop-blur-xs"
          onClick={() => setShowNewModal(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-[#E5E1D8] bg-[#FAF8F5] p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#ECE8E0] pb-3">
              <h3 className="font-serif text-xl font-semibold text-[#2A2927]">
                New Sanctuary Appointment
              </h3>
              <button
                type="button"
                onClick={() => setShowNewModal(false)}
                className="cursor-pointer rounded p-1 text-[#7A766E] hover:bg-[#EFECE6]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateAppointment} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#57544E]">
                  Client Name
                </label>
                <input
                  type="text"
                  required
                  value={newBooking.client}
                  onChange={(e) =>
                    setNewBooking({ ...newBooking, client: e.target.value })
                  }
                  placeholder="e.g. Maya Fernando"
                  className="mt-1.5 w-full rounded-lg border border-[#E2DDD4] bg-[#F6F4EF] px-3.5 py-2 text-sm text-[#2A2927] focus:border-[#4A5B4B] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#57544E]">
                    Specialist
                  </label>
                  <select
                    value={newBooking.specialistId}
                    onChange={(e) =>
                      setNewBooking({
                        ...newBooking,
                        specialistId: e.target.value,
                      })
                    }
                    className="mt-1.5 w-full rounded-lg border border-[#E2DDD4] bg-[#F6F4EF] px-3 py-2 text-xs text-[#2A2927] focus:border-[#4A5B4B] focus:outline-none"
                  >
                    {CALENDAR_SPECIALISTS.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#57544E]">
                    Start Time
                  </label>
                  <select
                    value={newBooking.startSlotIndex}
                    onChange={(e) =>
                      setNewBooking({
                        ...newBooking,
                        startSlotIndex: Number(e.target.value),
                      })
                    }
                    className="mt-1.5 w-full rounded-lg border border-[#E2DDD4] bg-[#F6F4EF] px-3 py-2 text-xs text-[#2A2927] focus:border-[#4A5B4B] focus:outline-none"
                  >
                    {TIME_SLOTS.slice(0, -1).map((slot, idx) => (
                      <option key={slot} value={idx}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#57544E]">
                  Ritual / Service
                </label>
                <input
                  type="text"
                  required
                  value={newBooking.service}
                  onChange={(e) =>
                    setNewBooking({ ...newBooking, service: e.target.value })
                  }
                  className="mt-1.5 w-full rounded-lg border border-[#E2DDD4] bg-[#F6F4EF] px-3.5 py-2 text-sm text-[#2A2927] focus:border-[#4A5B4B] focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="cursor-pointer rounded-lg border border-[#E2DDD4] px-4 py-2 text-xs font-medium text-[#57544E] hover:bg-[#EFECE6]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="cursor-pointer rounded-lg bg-[#4A5B4B] px-5 py-2 text-xs font-medium text-[#FAF8F5] hover:bg-[#3B4A3C]"
                >
                  Add to Calendar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
