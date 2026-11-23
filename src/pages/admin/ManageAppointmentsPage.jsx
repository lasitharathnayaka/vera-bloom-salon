import { useEffect, useMemo, useState } from 'react';
import {
  Calendar as CalendarIcon,
  CalendarCheck,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  CreditCard,
  Mail,
  Phone,
  Plus,
  Sparkles,
  UserCheck,
  X,
} from 'lucide-react';
import {
  createAppointment,
  fetchAppointments,
  updateAppointmentStatus,
} from '../../services/salonService';

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
    status: 'Available',
  },
  {
    id: 'amara',
    name: 'Amara Thorne',
    role: 'Bridal & Facialist',
    avatar: specialistAmara,
    status: 'In Session',
  },
  {
    id: 'julian',
    name: 'Julian Vance',
    role: 'Master Stylist',
    avatar: specialistJulian,
    status: 'Available',
  },
  {
    id: 'clara',
    name: 'Clara Vance',
    role: 'Nail & Spa Artist',
    avatar: founderVera,
    status: 'Available',
  },
];

const QUICK_RITUALS = [
  { name: 'Organic Botanical Hair Glossing', duration: 90, price: 9500 },
  { name: 'Cell-Renewal Botanical Facial', duration: 60, price: 5000 },
  { name: 'Classic Wedding Day Hair Trial', duration: 120, price: 25000 },
  { name: 'Botanical Manicure & Warm Shea Wrap', duration: 60, price: 3500 },
  { name: 'Organic Scalp Detox & Head Spa', duration: 60, price: 6500 },
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
    bookingRef: 'VB-842190',
    specialistId: 'elena',
    startSlotIndex: 1, // 09:30 AM
    spanSlots: 3,
    status: 'CONFIRMED',
    timeRange: '09:30 - 11:00',
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
  },
  {
    id: 'appt-priya',
    bookingRef: 'VB-842204',
    specialistId: 'amara',
    startSlotIndex: 2, // 10:00 AM
    spanSlots: 3,
    status: 'IN-CHAIR',
    timeRange: '10:00 - 11:30',
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
  },
  {
    id: 'appt-natasha',
    bookingRef: 'VB-842218',
    specialistId: 'julian',
    startSlotIndex: 5, // 11:30 AM
    spanSlots: 3,
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
  },
  {
    id: 'appt-sophia',
    bookingRef: 'VB-842231',
    specialistId: 'clara',
    startSlotIndex: 10, // 02:00 PM
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
  },
  {
    id: 'appt-kavindi',
    bookingRef: 'VB-842245',
    specialistId: 'elena',
    startSlotIndex: 8, // 01:00 PM
    spanSlots: 2,
    status: 'COMPLETED',
    timeRange: '01:00 - 02:00',
    client: 'Kavindi Perera',
    clientTier: 'Regular',
    phone: '+94 77 610 9932',
    email: 'kavindi.p@example.lk',
    shortService: 'Organic Scalp Detox',
    fullService: 'Organic Scalp Detox & Steam Infusion',
    specialistLabel: 'Elena Rostova',
    duration: '60 mins',
    totalLKR: 6500,
    depositText: 'Paid in Full',
    balanceText: 'LKR 0 (Paid)',
    notes:
      'Rosemary & hibiscus botanical oil scalp therapy with micro-mist hydration.',
  },
];

const ROW_HEIGHT = 56;
const TODAY_DEFAULT = new Date(2026, 10, 23); // Nov 23, 2026

function mapSpecialistId(name = '') {
  const lower = name.toLowerCase();
  if (lower.includes('amara')) return 'amara';
  if (lower.includes('julian')) return 'julian';
  if (lower.includes('clara') || lower.includes('vera')) return 'clara';
  return 'elena';
}

function mapTimeToSlotIndex(timeStr = '') {
  const idx = TIME_SLOTS.findIndex(
    (s) => s.toLowerCase() === timeStr.trim().toLowerCase()
  );
  if (idx >= 0) return idx;
  if (timeStr.includes('09:')) return 0;
  if (timeStr.includes('10:')) return 2;
  if (timeStr.includes('11:')) return 4;
  if (timeStr.includes('12:')) return 6;
  if (timeStr.includes('01:') || timeStr.includes('13:')) return 8;
  if (timeStr.includes('02:') || timeStr.includes('14:')) return 10;
  if (timeStr.includes('03:') || timeStr.includes('15:')) return 12;
  if (timeStr.includes('04:') || timeStr.includes('16:')) return 14;
  return 4;
}

function normalizeStatus(status = 'CONFIRMED') {
  const upper = String(status).toUpperCase();
  if (upper === 'IN_CHAIR' || upper === 'IN-CHAIR' || upper === 'IN PROGRESS') {
    return 'IN-CHAIR';
  }
  if (upper === 'COMPLETED') return 'COMPLETED';
  return 'CONFIRMED';
}

function formatTimeRange(startSlotIndex, spanSlots) {
  const start = TIME_SLOTS[startSlotIndex] || '10:00 AM';
  const end =
    TIME_SLOTS[Math.min(startSlotIndex + spanSlots, TIME_SLOTS.length - 1)] ||
    '05:00 PM';
  const strip = (s) => s.replace(' AM', '').replace(' PM', '');
  return `${strip(start)} - ${strip(end)}`;
}

export default function ManageAppointmentsPage() {
  const [currentDate, setCurrentDate] = useState(TODAY_DEFAULT);
  const [viewMode, setViewMode] = useState('Day');
  const [selectedSpecialistFilter, setSelectedSpecialistFilter] =
    useState('all');
  const [appointments, setAppointments] = useState(INITIAL_APPOINTMENTS);
  const [activeApptId, setActiveApptId] = useState('appt-emma');
  const [showNewModal, setShowNewModal] = useState(false);
  const [rescheduleMode, setRescheduleMode] = useState(false);
  const [rescheduleDraft, setRescheduleDraft] = useState({
    specialistId: 'elena',
    startSlotIndex: 1,
  });
  const [savingBooking, setSavingBooking] = useState(false);
  const [newBooking, setNewBooking] = useState({
    client: '',
    phone: '',
    email: '',
    specialistId: 'elena',
    startSlotIndex: 4,
    spanSlots: 2,
    service: QUICK_RITUALS[0].name,
    priceLKR: QUICK_RITUALS[0].price,
    notes: '',
  });

  // Load any live Supabase appointments and merge smoothly
  useEffect(() => {
    let active = true;
    fetchAppointments().then(({ data }) => {
      if (!active || !data || data.length === 0) return;
      const mapped = data.map((row) => {
        const specId = mapSpecialistId(row.specialist_name || '');
        const startSlotIndex = mapTimeToSlotIndex(row.time_slot || '');
        const mins = Number(row.duration_mins) || 60;
        const spanSlots = Math.max(2, Math.min(4, Math.round(mins / 30)));
        const firstService =
          row.appointment_services?.[0]?.service_name ||
          'Sanctuary Botanical Ritual';
        const allServices =
          row.appointment_services?.map((s) => s.service_name).join(' & ') ||
          firstService;
        const total = Number(row.total_lkr) || 8500;
        const normalized = normalizeStatus(row.status);
        return {
          id: row.id,
          isRemote: true,
          bookingRef: row.booking_ref || 'VB-LIVE',
          specialistId: specId,
          startSlotIndex,
          spanSlots,
          status: normalized,
          timeRange: formatTimeRange(startSlotIndex, spanSlots),
          client: row.customer_name || 'Sanctuary Guest',
          clientTier: 'Online Booking',
          phone: row.customer_phone || '+94 77 000 0000',
          email: row.customer_email || 'guest@verabloom.lk',
          shortService: firstService,
          fullService: allServices,
          specialistLabel: row.specialist_name || 'Elena Rostova',
          duration: `${mins} mins`,
          totalLKR: total,
          depositText: normalized === 'COMPLETED' ? 'Paid in Full' : 'Pay at Sanctuary',
          balanceText:
            normalized === 'COMPLETED'
              ? 'LKR 0 (Paid)'
              : `LKR ${total.toLocaleString('en-US')}`,
          notes: row.notes || 'Booked online via Vera & Bloom Sanctuary.',
        };
      });

      setAppointments((prev) => {
        const existingIds = new Set(prev.map((a) => a.id));
        const fresh = mapped.filter((m) => !existingIds.has(m.id));
        return fresh.length > 0 ? [...fresh, ...prev] : prev;
      });
    });
    return () => {
      active = false;
    };
  }, []);

  const visibleSpecialists = useMemo(() => {
    if (selectedSpecialistFilter === 'all') return CALENDAR_SPECIALISTS;
    return CALENDAR_SPECIALISTS.filter((s) => s.id === selectedSpecialistFilter);
  }, [selectedSpecialistFilter]);

  const activeAppointment = useMemo(
    () => appointments.find((a) => a.id === activeApptId) || null,
    [appointments, activeApptId]
  );

  // Sync reschedule draft when switching active appointment
  useEffect(() => {
    if (activeAppointment) {
      setRescheduleDraft({
        specialistId: activeAppointment.specialistId,
        startSlotIndex: activeAppointment.startSlotIndex,
      });
      setRescheduleMode(false);
    }
  }, [activeAppointment?.id]);

  const stats = useMemo(() => {
    const confirmed = appointments.filter((a) => a.status === 'CONFIRMED').length;
    const inChair = appointments.filter((a) => a.status === 'IN-CHAIR').length;
    const completed = appointments.filter((a) => a.status === 'COMPLETED').length;
    return {
      total: appointments.length,
      confirmed,
      inChair,
      completed,
    };
  }, [appointments]);

  const isToday =
    currentDate.getFullYear() === TODAY_DEFAULT.getFullYear() &&
    currentDate.getMonth() === TODAY_DEFAULT.getMonth() &&
    currentDate.getDate() === TODAY_DEFAULT.getDate();

  const formattedDate = useMemo(() => {
    const label = currentDate.toLocaleDateString('en-US', {
      weekday: isToday ? undefined : 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
    return isToday ? `Today, ${label}` : label;
  }, [currentDate, isToday]);

  const weekDays = useMemo(() => {
    const start = new Date(currentDate);
    const day = start.getDay();
    const diff = day === 0 ? -6 : 1 - day; // Monday start
    start.setDate(start.getDate() + diff);
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return d;
    });
  }, [currentDate]);

  const monthDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startOffset = (firstDay.getDay() + 6) % 7; // Mon=0
    const cells = [];
    for (let i = 0; i < startOffset; i += 1) cells.push(null);
    for (let d = 1; d <= lastDay.getDate(); d += 1) {
      cells.push(new Date(year, month, d));
    }
    return cells;
  }, [currentDate]);

  const shiftPeriod = (delta) => {
    setCurrentDate((prev) => {
      if (viewMode === 'Month') {
        return new Date(prev.getFullYear(), prev.getMonth() + delta, 1);
      }
      const step = viewMode === 'Week' ? delta * 7 : delta;
      return new Date(prev.getFullYear(), prev.getMonth(), prev.getDate() + step);
    });
  };

  const handleStatusChange = async (id, nextStatus) => {
    const target = appointments.find((a) => a.id === id);
    setAppointments((prev) =>
      prev.map((a) => {
        if (a.id !== id) return a;
        return {
          ...a,
          status: nextStatus,
          balanceText:
            nextStatus === 'COMPLETED'
              ? 'LKR 0 (Paid)'
              : a.balanceText === 'LKR 0 (Paid)'
                ? `LKR ${a.totalLKR.toLocaleString('en-US')}`
                : a.balanceText,
        };
      })
    );

    if (target?.isRemote) {
      const dbStatus =
        nextStatus === 'IN-CHAIR'
          ? 'in_chair'
          : nextStatus === 'COMPLETED'
            ? 'completed'
            : 'confirmed';
      await updateAppointmentStatus(id, dbStatus);
    }
  };

  const handleApplyReschedule = () => {
    if (!activeAppointment) return;
    const spec =
      CALENDAR_SPECIALISTS.find((s) => s.id === rescheduleDraft.specialistId) ||
      CALENDAR_SPECIALISTS[0];
    setAppointments((prev) =>
      prev.map((a) =>
        a.id === activeAppointment.id
          ? {
              ...a,
              specialistId: rescheduleDraft.specialistId,
              specialistLabel: spec.name,
              startSlotIndex: Number(rescheduleDraft.startSlotIndex),
              timeRange: formatTimeRange(
                Number(rescheduleDraft.startSlotIndex),
                a.spanSlots
              ),
            }
          : a
      )
    );
    setRescheduleMode(false);
  };

  const openModalForSlot = (specialistId, slotIndex) => {
    setNewBooking((prev) => ({
      ...prev,
      specialistId,
      startSlotIndex: slotIndex,
    }));
    setShowNewModal(true);
  };

  const handleRitualPresetChange = (ritualName) => {
    const found = QUICK_RITUALS.find((r) => r.name === ritualName);
    if (found) {
      setNewBooking((prev) => ({
        ...prev,
        service: found.name,
        spanSlots: Math.max(2, Math.round(found.duration / 30)),
        priceLKR: found.price,
      }));
    } else {
      setNewBooking((prev) => ({ ...prev, service: ritualName }));
    }
  };

  const handleCreateAppointment = async (e) => {
    e.preventDefault();
    if (!newBooking.client.trim()) return;
    setSavingBooking(true);

    const spec =
      CALENDAR_SPECIALISTS.find((s) => s.id === newBooking.specialistId) ||
      CALENDAR_SPECIALISTS[0];
    const startSlot = Number(newBooking.startSlotIndex);
    const span = Number(newBooking.spanSlots) || 2;
    const durationMins = span * 30;
    const startLabel = TIME_SLOTS[startSlot] || '11:00 AM';
    const price = Number(newBooking.priceLKR) || 6500;

    let createdId = `appt-${Date.now()}`;
    let bookingRef = `VB-${Math.floor(100000 + Math.random() * 900000)}`;
    let isRemote = false;

    const { data } = await createAppointment(
      {
        customer_name: newBooking.client.trim(),
        customer_phone: newBooking.phone.trim() || '+94 77 000 1234',
        customer_email: newBooking.email.trim() || 'guest@verabloom.lk',
        specialist_name: spec.name,
        appointment_date: currentDate.toISOString().split('T')[0],
        time_slot: startLabel,
        duration_mins: durationMins,
        total_lkr: price,
        status: 'confirmed',
        notes: newBooking.notes.trim() || 'Added via Admin Appointment Calendar.',
      },
      [{ name: newBooking.service, duration: durationMins, price }]
    );

    if (data?.id) {
      createdId = data.id;
      bookingRef = data.booking_ref || bookingRef;
      isRemote = true;
    }

    const created = {
      id: createdId,
      isRemote,
      bookingRef,
      specialistId: newBooking.specialistId,
      startSlotIndex: startSlot,
      spanSlots: span,
      status: 'CONFIRMED',
      timeRange: formatTimeRange(startSlot, span),
      client: newBooking.client.trim(),
      clientTier: 'Walk-in Guest',
      phone: newBooking.phone.trim() || '+94 77 000 1234',
      email: newBooking.email.trim() || 'guest@verabloom.lk',
      shortService: newBooking.service,
      fullService: newBooking.service,
      specialistLabel: spec.name,
      duration: `${durationMins} mins`,
      totalLKR: price,
      depositText: 'Pending',
      balanceText: `LKR ${price.toLocaleString('en-US')}`,
      notes:
        newBooking.notes.trim() || 'Added via Admin Appointment Calendar.',
    };

    setAppointments((prev) => [...prev, created]);
    setActiveApptId(created.id);
    setNewBooking({
      client: '',
      phone: '',
      email: '',
      specialistId: 'elena',
      startSlotIndex: 4,
      spanSlots: 2,
      service: QUICK_RITUALS[0].name,
      priceLKR: QUICK_RITUALS[0].price,
      notes: '',
    });
    setSavingBooking(false);
    setShowNewModal(false);
  };

  // Current time indicator position (~10:45 AM = slot index 3.5)
  const liveLineTopPx = 3.5 * ROW_HEIGHT;

  return (
    <div className="relative flex flex-col gap-6">
      {/* ================= EXECUTIVE HEADER + QUICK STATUS PILLS ================= */}
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <p className="text-[10.5px] font-semibold tracking-[0.22em] text-[#7A766E] uppercase">
            Sanctuary Schedule
          </p>
          <h1 className="mt-1 font-serif text-[30px] font-normal tracking-tight text-[#222B23] sm:text-[34px]">
            Appointment Calendar
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Live Status Summary Strip */}
          <div className="flex flex-wrap items-center gap-2 rounded-full border border-[#E6E2DA] bg-[#FAF8F5] px-3.5 py-2 text-[11.5px] shadow-2xs">
            <span className="inline-flex items-center gap-1.5 font-medium text-[#2A2927]">
              <span className="h-2 w-2 rounded-full bg-[#253026]" />
              {stats.confirmed} Confirmed
            </span>
            <span className="text-[#DCD7CE]">•</span>
            <span className="inline-flex items-center gap-1.5 font-medium text-[#7A5E34]">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#C8A870] opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#C8A870]" />
              </span>
              {stats.inChair} In-Chair
            </span>
            <span className="text-[#DCD7CE]">•</span>
            <span className="inline-flex items-center gap-1.5 font-medium text-[#355A3A]">
              <CheckCircle2 className="h-3.5 w-3.5 text-[#4A7C52]" />
              {stats.completed} Done
            </span>
          </div>

          <button
            type="button"
            onClick={() => setShowNewModal(true)}
            className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-[#253026] px-5 py-2.5 text-[12px] font-medium tracking-wide text-[#FAF8F5] shadow-sm transition-all hover:bg-[#344335]"
          >
            <Plus className="h-3.5 w-3.5 text-[#EFE0C6]" strokeWidth={2.4} />
            <span>New Appointment</span>
          </button>
        </div>
      </div>

      {/* ================= ELEVATED CONTROLS TOOLBAR ================= */}
      <div className="flex flex-col gap-3.5 rounded-[22px] border border-[#E6E2DA] bg-[#FAF8F5] p-3.5 shadow-2xs">
        {/* Top Row: Date Navigator + View Mode Switcher */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#E6E2DA] bg-[#F3F0EA] px-2.5 py-1.5 text-[#2A2927]">
              <button
                type="button"
                onClick={() => shiftPeriod(-1)}
                aria-label="Previous"
                className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full text-[#6C6961] transition-colors hover:bg-[#FAF8F5] hover:text-[#222B23]"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="inline-flex min-w-[162px] items-center justify-center gap-2 px-1 font-serif text-[15px] font-semibold text-[#222B23]">
                <CalendarIcon className="h-3.5 w-3.5 text-[#6A7B6B]" />
                {formattedDate}
              </span>
              <button
                type="button"
                onClick={() => shiftPeriod(1)}
                aria-label="Next"
                className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full text-[#6C6961] transition-colors hover:bg-[#FAF8F5] hover:text-[#222B23]"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            {!isToday && (
              <button
                type="button"
                onClick={() => setCurrentDate(TODAY_DEFAULT)}
                className="cursor-pointer rounded-full border border-[#E2DDD4] bg-[#FAF8F5] px-3.5 py-1.5 text-[11.5px] font-medium text-[#4A5B4B] transition-colors hover:bg-[#EFECE6]"
              >
                Back to Today
              </button>
            )}
          </div>

          {/* Segmented View Mode Switcher */}
          <div className="inline-flex rounded-full border border-[#E6E2DA] bg-[#F3F0EA] p-1 text-[11.5px]">
            {['Day', 'Week', 'Month'].map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setViewMode(mode)}
                className={`cursor-pointer rounded-full px-4 py-1.5 font-medium transition-all ${
                  viewMode === mode
                    ? 'bg-[#253026] text-[#FAF8F5] shadow-xs'
                    : 'text-[#6C6961] hover:text-[#222B23]'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        {/* Bottom Row: Specialist Filter Pills with Avatar & Counts */}
        <div className="flex flex-wrap items-center gap-2 border-t border-[#EFECE5] pt-3">
          <button
            type="button"
            onClick={() => setSelectedSpecialistFilter('all')}
            className={`inline-flex cursor-pointer items-center gap-2 rounded-full px-4 py-1.5 text-[12px] font-medium transition-all ${
              selectedSpecialistFilter === 'all'
                ? 'bg-[#253026] text-[#FAF8F5] shadow-xs'
                : 'bg-[#F3F0EA] text-[#57544E] hover:bg-[#E8E4DC]'
            }`}
          >
            <span>All Specialists</span>
            <span
              className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${
                selectedSpecialistFilter === 'all'
                  ? 'bg-white/15 text-[#EFE0C6]'
                  : 'bg-[#FAF8F5] text-[#6C6961]'
              }`}
            >
              {appointments.length}
            </span>
          </button>

          {CALENDAR_SPECIALISTS.map((spec) => {
            const count = appointments.filter(
              (a) => a.specialistId === spec.id
            ).length;
            const isSelected = selectedSpecialistFilter === spec.id;
            return (
              <button
                key={spec.id}
                type="button"
                onClick={() => setSelectedSpecialistFilter(spec.id)}
                className={`inline-flex cursor-pointer items-center gap-2 rounded-full py-1 pr-3.5 pl-1.5 text-[12px] font-medium transition-all ${
                  isSelected
                    ? 'bg-[#253026] text-[#FAF8F5] shadow-xs'
                    : 'bg-[#F3F0EA] text-[#57544E] hover:bg-[#E8E4DC]'
                }`}
              >
                <img
                  src={spec.avatar}
                  alt={spec.name}
                  className="h-6 w-6 rounded-full border border-white/60 object-cover"
                />
                <span>{spec.name}</span>
                <span
                  className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${
                    isSelected
                      ? 'bg-white/15 text-[#EFE0C6]'
                      : 'bg-[#FAF8F5] text-[#6C6961]'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ================= CALENDAR BODY + DARK-SAGE INSPECTOR ================= */}
      <div className="relative flex flex-col gap-6 xl:flex-row xl:items-start">
        {/* MAIN CALENDAR SURFACE */}
        <div className="flex-1 overflow-hidden rounded-[24px] border border-[#E6E2DA] bg-[#FAF8F5] shadow-xs">
          {/* ---------- DAY VIEW: MULTI-SPECIALIST TIMELINE ---------- */}
          {viewMode === 'Day' && (
            <div className="overflow-x-auto">
              <div className="min-w-[680px]">
                {/* Specialist Column Headers */}
                <div
                  className="grid border-b border-[#E8E4DC] bg-[#F5F2EC] px-4 py-4"
                  style={{
                    gridTemplateColumns: `84px repeat(${visibleSpecialists.length}, minmax(168px, 1fr))`,
                  }}
                >
                  <div className="flex items-center text-[10px] font-semibold tracking-[0.18em] text-[#8A867E] uppercase">
                    Time
                  </div>

                  {visibleSpecialists.map((spec) => {
                    const count = appointments.filter(
                      (a) => a.specialistId === spec.id
                    ).length;
                    return (
                      <div
                        key={spec.id}
                        className="flex items-center justify-between gap-2 px-2.5"
                      >
                        <div className="flex min-w-0 items-center gap-2.5">
                          <div className="relative shrink-0">
                            <img
                              src={spec.avatar}
                              alt={spec.name}
                              className="h-10 w-10 rounded-full border-2 border-[#FAF8F5] object-cover shadow-2xs"
                            />
                            <span
                              className={`absolute right-0 bottom-0 h-2.5 w-2.5 rounded-full border-2 border-[#F5F2EC] ${
                                spec.status === 'In Session'
                                  ? 'bg-[#C8A870]'
                                  : 'bg-[#4E8B57]'
                              }`}
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="truncate font-serif text-[15px] font-semibold text-[#222B23]">
                              {spec.name}
                            </p>
                            <p className="truncate text-[10.5px] text-[#7A766E]">
                              {spec.role}
                            </p>
                          </div>
                        </div>
                        <span className="hidden shrink-0 rounded-full bg-[#EAE5DC] px-2 py-0.5 text-[10px] font-semibold text-[#57544E] sm:inline-block">
                          {count}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Time Rows + Overlay Blocks */}
                <div
                  className="relative grid px-4"
                  style={{
                    gridTemplateColumns: `84px repeat(${visibleSpecialists.length}, minmax(168px, 1fr))`,
                  }}
                >
                  {/* Live Current-Time Line */}
                  <div
                    style={{ top: `${liveLineTopPx}px` }}
                    className="pointer-events-none absolute right-4 left-4 z-20 flex items-center"
                  >
                    <span className="mr-2 rounded-full bg-[#C8A870] px-1.5 py-0.5 text-[8.5px] font-bold tracking-wider text-[#222B23] uppercase shadow-2xs">
                      10:45
                    </span>
                    <div className="h-[1.5px] flex-1 bg-gradient-to-r from-[#C8A870] via-[#C8A870]/70 to-transparent" />
                  </div>

                  {/* Left Time Gutter */}
                  <div>
                    {TIME_SLOTS.map((slot, idx) => (
                      <div
                        key={slot}
                        style={{ height: `${ROW_HEIGHT}px` }}
                        className={`flex items-start pt-2 text-[10.5px] ${
                          idx % 2 === 0
                            ? 'font-semibold text-[#6C6961]'
                            : 'font-normal text-[#A39E95]'
                        }`}
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
                        className="relative border-l border-[#ECE8E0]"
                      >
                        {/* Interactive Background Time Slots */}
                        {TIME_SLOTS.map((slot, slotIdx) => (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => openModalForSlot(spec.id, slotIdx)}
                            style={{ height: `${ROW_HEIGHT}px` }}
                            className={`group flex w-full cursor-pointer items-center justify-center border-b transition-colors hover:bg-[#F3F0EA]/80 ${
                              slotIdx % 2 === 0
                                ? 'border-[#EFECE5]'
                                : 'border-dashed border-[#EFECE5]/80'
                            }`}
                          >
                            <span className="rounded-full bg-[#253026]/8 px-2.5 py-0.5 text-[10px] font-medium text-[#4A5B4B] opacity-0 transition-opacity group-hover:opacity-100">
                              + Book {slot}
                            </span>
                          </button>
                        ))}

                        {/* Positioned Appointment Cards */}
                        {specAppts.map((appt) => {
                          const isSelected = appt.id === activeApptId;
                          const topPx = appt.startSlotIndex * ROW_HEIGHT + 4;
                          const heightPx = appt.spanSlots * ROW_HEIGHT - 8;

                          const isInChair = appt.status === 'IN-CHAIR';
                          const isCompleted = appt.status === 'COMPLETED';

                          const cardStyle = isInChair
                            ? 'border border-[#E0C89E] bg-[#F5E6CB] text-[#222B23] hover:bg-[#EFE0C2]'
                            : isCompleted
                              ? 'border border-[#C9DFCC] bg-[#EAF3EB] text-[#234329] hover:bg-[#E0EDE2]'
                              : 'border border-[#364738] bg-[#253026] text-[#FAF8F5] hover:bg-[#2E3C30]';

                          const badgeStyle = isInChair
                            ? 'bg-[#222B23]/10 text-[#6B5028]'
                            : isCompleted
                              ? 'bg-[#355A3A]/15 text-[#234329]'
                              : 'bg-white/12 text-[#EFE0C6]';

                          const subTextStyle = isInChair
                            ? 'text-[#6B5028]'
                            : isCompleted
                              ? 'text-[#3C6643]'
                              : 'text-[#C9D3CA]';

                          return (
                            <button
                              key={appt.id}
                              type="button"
                              onClick={() => setActiveApptId(appt.id)}
                              style={{
                                top: `${topPx}px`,
                                height: `${heightPx}px`,
                              }}
                              className={`absolute inset-x-2 z-10 flex cursor-pointer flex-col justify-between overflow-hidden rounded-2xl p-3 text-left shadow-sm transition-all ${cardStyle} ${
                                isSelected
                                  ? 'ring-2 ring-[#C8A870] ring-offset-2 ring-offset-[#FAF8F5] shadow-md'
                                  : ''
                              }`}
                            >
                              <div className="flex items-center justify-between gap-2">
                                <span
                                  className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[8.5px] font-semibold tracking-wider uppercase ${badgeStyle}`}
                                >
                                  {isInChair && (
                                    <span className="h-1.5 w-1.5 rounded-full bg-[#B78B43]" />
                                  )}
                                  {isCompleted && (
                                    <Check className="h-2.5 w-2.5" />
                                  )}
                                  {appt.status}
                                </span>
                                <span
                                  className={`text-[9.5px] font-medium ${subTextStyle}`}
                                >
                                  {appt.timeRange}
                                </span>
                              </div>

                              <div className="min-w-0">
                                <p className="truncate font-serif text-[16px] font-semibold leading-tight">
                                  {appt.client}
                                </p>
                                <p
                                  className={`mt-0.5 truncate text-[10.5px] ${subTextStyle}`}
                                >
                                  {appt.shortService}
                                </p>
                              </div>

                              {appt.spanSlots >= 3 && (
                                <div className="flex items-center justify-between border-t border-current/10 pt-1.5 text-[10px]">
                                  <span className={subTextStyle}>
                                    {appt.clientTier}
                                  </span>
                                  <span className="font-semibold">
                                    LKR {appt.totalLKR.toLocaleString('en-US')}
                                  </span>
                                </div>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ---------- WEEK VIEW: 7-DAY AGENDA OVERVIEW ---------- */}
          {viewMode === 'Week' && (
            <div className="p-5">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-7">
                {weekDays.map((day, idx) => {
                  const isSelectedDay =
                    day.toDateString() === currentDate.toDateString();
                  const dayAppts =
                    idx === 0 || isSelectedDay
                      ? appointments.slice(0, isSelectedDay ? appointments.length : 2)
                      : idx % 2 === 0
                        ? appointments.slice(1, 3)
                        : appointments.slice(0, 1);

                  return (
                    <div
                      key={day.toISOString()}
                      onClick={() => {
                        setCurrentDate(day);
                        setViewMode('Day');
                      }}
                      className={`flex min-h-[260px] cursor-pointer flex-col rounded-2xl border p-3 transition-all ${
                        isSelectedDay
                          ? 'border-[#253026] bg-[#F5F2EC] shadow-xs'
                          : 'border-[#ECE8E0] bg-[#FAF8F5] hover:border-[#D5CFC3]'
                      }`}
                    >
                      <div className="flex items-center justify-between border-b border-[#ECE8E0] pb-2.5">
                        <div>
                          <p className="text-[10px] font-semibold tracking-wider text-[#8A867E] uppercase">
                            {day.toLocaleDateString('en-US', {
                              weekday: 'short',
                            })}
                          </p>
                          <p className="font-serif text-xl font-semibold text-[#222B23]">
                            {day.getDate()}
                          </p>
                        </div>
                        <span className="rounded-full bg-[#EAE5DC] px-2 py-0.5 text-[10px] font-semibold text-[#57544E]">
                          {dayAppts.length}
                        </span>
                      </div>

                      <div className="mt-3 space-y-2">
                        {dayAppts.map((appt) => (
                          <div
                            key={`${day.getDate()}-${appt.id}`}
                            className={`rounded-xl p-2 text-[10.5px] ${
                              appt.status === 'IN-CHAIR'
                                ? 'bg-[#F5E6CB] text-[#222B23]'
                                : appt.status === 'COMPLETED'
                                  ? 'bg-[#EAF3EB] text-[#234329]'
                                  : 'bg-[#253026] text-[#FAF8F5]'
                            }`}
                          >
                            <p className="truncate font-semibold">
                              {appt.client}
                            </p>
                            <p className="mt-0.5 truncate opacity-80">
                              {appt.timeRange}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ---------- MONTH VIEW: SANCTUARY CALENDAR ---------- */}
          {viewMode === 'Month' && (
            <div className="p-5">
              <div className="mb-3 grid grid-cols-7 gap-2 text-center text-[10.5px] font-semibold tracking-wider text-[#8A867E] uppercase">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
                  <div key={d}>{d}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-2">
                {monthDays.map((day, idx) => {
                  if (!day) {
                    return <div key={`empty-${idx}`} className="h-24 rounded-xl bg-[#F5F2EC]/50" />;
                  }
                  const isSelected =
                    day.toDateString() === currentDate.toDateString();
                  const mockCount = isSelected
                    ? appointments.length
                    : ((day.getDate() * 3) % 5) + 1;
                  return (
                    <button
                      key={day.toISOString()}
                      type="button"
                      onClick={() => {
                        setCurrentDate(day);
                        setViewMode('Day');
                      }}
                      className={`flex h-24 cursor-pointer flex-col justify-between rounded-xl border p-2.5 text-left transition-all ${
                        isSelected
                          ? 'border-[#253026] bg-[#253026] text-[#FAF8F5] shadow-sm'
                          : 'border-[#ECE8E0] bg-[#FAF8F5] text-[#222B23] hover:border-[#C8A870] hover:bg-[#F5F2EC]'
                      }`}
                    >
                      <span className="font-serif text-base font-semibold">
                        {day.getDate()}
                      </span>
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-[10px] font-medium ${
                            isSelected ? 'text-[#EFE0C6]' : 'text-[#6C6961]'
                          }`}
                        >
                          {mockCount} appts
                        </span>
                        <div className="flex gap-1">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#C8A870]" />
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              isSelected ? 'bg-[#FAF8F5]' : 'bg-[#4A5B4B]'
                            }`}
                          />
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* ================= RIGHT DARK-SAGE EXECUTIVE INSPECTOR ================= */}
        {activeAppointment && (
          <aside className="flex w-full shrink-0 flex-col justify-between overflow-hidden rounded-[24px] border border-[#344335] bg-[#253026] text-[#FAF8F5] shadow-xl xl:sticky xl:top-6 xl:w-[360px]">
            <div>
              {/* Inspector Header */}
              <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/10 text-[#EFE0C6]">
                    <CalendarCheck className="h-4 w-4" strokeWidth={1.8} />
                  </div>
                  <div>
                    <p className="text-[9.5px] font-semibold tracking-[0.2em] text-[#A8B8AA] uppercase">
                      {activeAppointment.bookingRef || 'SANCTUARY PASS'}
                    </p>
                    <h2 className="font-serif text-[18px] font-medium text-[#FAF8F5]">
                      Appointment Details
                    </h2>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveApptId(null)}
                  aria-label="Close appointment details"
                  className="cursor-pointer rounded-full p-1.5 text-[#A8B8AA] transition-colors hover:bg-white/10 hover:text-[#FAF8F5]"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Inspector Body */}
              <div className="space-y-3.5 p-5">
                {/* Live Status Quick-Switcher */}
                <div className="grid grid-cols-3 gap-1.5 rounded-full border border-white/10 bg-black/20 p-1 text-[10.5px]">
                  {['CONFIRMED', 'IN-CHAIR', 'COMPLETED'].map((st) => {
                    const active = activeAppointment.status === st;
                    return (
                      <button
                        key={st}
                        type="button"
                        onClick={() =>
                          handleStatusChange(activeAppointment.id, st)
                        }
                        className={`cursor-pointer rounded-full py-1.5 font-semibold tracking-wide transition-all ${
                          active
                            ? 'bg-[#EFE0C6] text-[#222B23] shadow-xs'
                            : 'text-[#B8C6BA] hover:text-[#FAF8F5]'
                        }`}
                      >
                        {st === 'IN-CHAIR'
                          ? 'In-Chair'
                          : st === 'COMPLETED'
                            ? 'Done'
                            : 'Confirmed'}
                      </button>
                    );
                  })}
                </div>

                {/* Client Glass Card */}
                <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-4">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-serif text-[20px] font-medium text-[#FAF8F5]">
                      {activeAppointment.client}
                    </h3>
                    <span className="shrink-0 rounded-full bg-[#EFE0C6]/15 px-2.5 py-0.5 text-[10px] font-semibold text-[#EFE0C6]">
                      {activeAppointment.clientTier}
                    </span>
                  </div>

                  <div className="mt-3 space-y-1.5 text-[11.5px] text-[#C5D1C7]">
                    <p className="flex items-center gap-2">
                      <Phone className="h-3.5 w-3.5 text-[#EFE0C6]/80" />
                      <span>{activeAppointment.phone}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <Mail className="h-3.5 w-3.5 text-[#EFE0C6]/80" />
                      <span className="truncate">{activeAppointment.email}</span>
                    </p>
                  </div>
                </div>

                {/* Ritual & Specialist Glass Card */}
                <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-4">
                  <div className="flex items-center justify-between text-[11px] text-[#A8B8AA]">
                    <span className="inline-flex items-center gap-1.5 font-medium">
                      <Sparkles className="h-3 w-3 text-[#EFE0C6]" />
                      Selected Ritual
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2 py-0.5 font-semibold text-[#FAF8F5]">
                      <Clock className="h-3 w-3 text-[#EFE0C6]" />
                      {activeAppointment.duration}
                    </span>
                  </div>

                  <p className="mt-2.5 font-serif text-[16.5px] font-medium text-[#FAF8F5]">
                    {activeAppointment.fullService}
                  </p>
                  <p className="mt-1 flex items-center gap-1.5 text-[11px] text-[#B8C6BA]">
                    <UserCheck className="h-3.5 w-3.5 text-[#EFE0C6]/80" />
                    {activeAppointment.specialistLabel} •{' '}
                    {activeAppointment.timeRange}
                  </p>

                  <div className="mt-3.5 flex items-baseline justify-between border-t border-white/10 pt-3">
                    <span className="text-[11px] text-[#A8B8AA]">
                      Estimated Total
                    </span>
                    <p className="font-serif text-[21px] font-semibold text-[#EFE0C6]">
                      LKR {activeAppointment.totalLKR.toLocaleString('en-US')}
                    </p>
                  </div>
                </div>

                {/* Inline Reschedule Panel (when toggled) */}
                {rescheduleMode && (
                  <div className="rounded-2xl border border-[#EFE0C6]/35 bg-[#1D261E] p-4">
                    <p className="text-[11px] font-semibold tracking-wider text-[#EFE0C6] uppercase">
                      Quick Reschedule
                    </p>
                    <div className="mt-3 grid grid-cols-2 gap-2.5">
                      <div>
                        <label className="text-[10px] text-[#A8B8AA]">
                          Specialist
                        </label>
                        <select
                          value={rescheduleDraft.specialistId}
                          onChange={(e) =>
                            setRescheduleDraft((prev) => ({
                              ...prev,
                              specialistId: e.target.value,
                            }))
                          }
                          className="mt-1 w-full rounded-xl border border-white/15 bg-[#253026] px-2.5 py-2 text-[11.5px] text-[#FAF8F5] focus:border-[#EFE0C6] focus:outline-none"
                        >
                          {CALENDAR_SPECIALISTS.map((s) => (
                            <option key={s.id} value={s.id}>
                              {s.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] text-[#A8B8AA]">
                          Start Time
                        </label>
                        <select
                          value={rescheduleDraft.startSlotIndex}
                          onChange={(e) =>
                            setRescheduleDraft((prev) => ({
                              ...prev,
                              startSlotIndex: Number(e.target.value),
                            }))
                          }
                          className="mt-1 w-full rounded-xl border border-white/15 bg-[#253026] px-2.5 py-2 text-[11.5px] text-[#FAF8F5] focus:border-[#EFE0C6] focus:outline-none"
                        >
                          {TIME_SLOTS.slice(0, -1).map((slot, idx) => (
                            <option key={slot} value={idx}>
                              {slot}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="mt-3 flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setRescheduleMode(false)}
                        className="cursor-pointer rounded-full px-3 py-1 text-[11px] text-[#B8C6BA] hover:text-white"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleApplyReschedule}
                        className="cursor-pointer rounded-full bg-[#EFE0C6] px-3.5 py-1 text-[11px] font-semibold text-[#222B23]"
                      >
                        Apply Move
                      </button>
                    </div>
                  </div>
                )}

                {/* Formula & Notes */}
                <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-4">
                  <p className="text-[11px] font-semibold tracking-wide text-[#EFE0C6]">
                    Service Notes &amp; Formula
                  </p>
                  <p className="mt-2 text-[11.5px] leading-relaxed text-[#D0DBD2]">
                    {activeAppointment.notes}
                  </p>
                </div>

                {/* Payment Summary */}
                <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-4">
                  <p className="flex items-center gap-1.5 text-[11px] font-semibold text-[#EFE0C6]">
                    <CreditCard className="h-3.5 w-3.5" />
                    Payment Status
                  </p>
                  <div className="mt-2.5 space-y-1.5 text-[12px]">
                    <div className="flex items-center justify-between">
                      <span className="text-[#A8B8AA]">Deposit Paid</span>
                      <span className="font-medium text-[#FAF8F5]">
                        {activeAppointment.depositText}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#A8B8AA]">Balance Due</span>
                      <span className="font-semibold text-[#EFE0C6]">
                        {activeAppointment.balanceText}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sticky Bottom Actions */}
            <div className="flex items-center gap-2.5 border-t border-white/10 bg-[#1F2920] p-4">
              <button
                type="button"
                onClick={() =>
                  handleStatusChange(activeAppointment.id, 'COMPLETED')
                }
                className="inline-flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-full bg-[#EFE0C6] px-4 py-2.5 text-[12px] font-semibold text-[#222B23] shadow-xs transition-all hover:bg-[#F5EAD5]"
              >
                {activeAppointment.status === 'COMPLETED' && (
                  <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
                )}
                <span>
                  {activeAppointment.status === 'COMPLETED'
                    ? 'Checked Out'
                    : 'Complete & Checkout'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setRescheduleMode((v) => !v)}
                className="cursor-pointer rounded-full border border-white/15 bg-white/[0.06] px-4 py-2.5 text-[12px] font-medium text-[#FAF8F5] transition-colors hover:bg-white/12"
              >
                Reschedule
              </button>
            </div>
          </aside>
        )}
      </div>

      {/* ================= MODERN NEW APPOINTMENT MODAL ================= */}
      {showNewModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#181E19]/60 p-4 backdrop-blur-xs"
          onClick={() => setShowNewModal(false)}
        >
          <div
            className="w-full max-w-lg overflow-hidden rounded-[24px] border border-[#E5E1D8] bg-[#FAF8F5] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Dark-Sage Header */}
            <div className="flex items-center justify-between bg-[#253026] px-6 py-5 text-[#FAF8F5]">
              <div>
                <p className="text-[10px] font-semibold tracking-[0.2em] text-[#EFE0C6] uppercase">
                  Direct Sanctuary Booking
                </p>
                <h3 className="mt-0.5 font-serif text-2xl font-normal">
                  New Appointment
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowNewModal(false)}
                className="cursor-pointer rounded-full p-1.5 text-[#A8B8AA] transition-colors hover:bg-white/10 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateAppointment} className="space-y-4 p-6">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-[11.5px] font-medium text-[#57544E]">
                    Client Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newBooking.client}
                    onChange={(e) =>
                      setNewBooking({ ...newBooking, client: e.target.value })
                    }
                    placeholder="e.g. Maya Fernando"
                    className="mt-1.5 w-full rounded-xl border border-[#E2DDD4] bg-[#F6F4EF] px-3.5 py-2.5 text-sm text-[#2A2927] focus:border-[#253026] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11.5px] font-medium text-[#57544E]">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={newBooking.phone}
                    onChange={(e) =>
                      setNewBooking({ ...newBooking, phone: e.target.value })
                    }
                    placeholder="+94 77 123 4567"
                    className="mt-1.5 w-full rounded-xl border border-[#E2DDD4] bg-[#F6F4EF] px-3.5 py-2.5 text-sm text-[#2A2927] focus:border-[#253026] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11.5px] font-medium text-[#57544E]">
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
                    className="mt-1.5 w-full rounded-xl border border-[#E2DDD4] bg-[#F6F4EF] px-3 py-2.5 text-xs text-[#2A2927] focus:border-[#253026] focus:outline-none"
                  >
                    {CALENDAR_SPECIALISTS.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11.5px] font-medium text-[#57544E]">
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
                    className="mt-1.5 w-full rounded-xl border border-[#E2DDD4] bg-[#F6F4EF] px-3 py-2.5 text-xs text-[#2A2927] focus:border-[#253026] focus:outline-none"
                  >
                    {TIME_SLOTS.slice(0, -1).map((slot, idx) => (
                      <option key={slot} value={idx}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11.5px] font-medium text-[#57544E]">
                    Duration
                  </label>
                  <select
                    value={newBooking.spanSlots}
                    onChange={(e) =>
                      setNewBooking({
                        ...newBooking,
                        spanSlots: Number(e.target.value),
                      })
                    }
                    className="mt-1.5 w-full rounded-xl border border-[#E2DDD4] bg-[#F6F4EF] px-3 py-2.5 text-xs text-[#2A2927] focus:border-[#253026] focus:outline-none"
                  >
                    <option value={2}>60 mins</option>
                    <option value={3}>90 mins</option>
                    <option value={4}>120 mins</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11.5px] font-medium text-[#57544E]">
                  Ritual / Service
                </label>
                <select
                  value={newBooking.service}
                  onChange={(e) => handleRitualPresetChange(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-[#E2DDD4] bg-[#F6F4EF] px-3.5 py-2.5 text-sm text-[#2A2927] focus:border-[#253026] focus:outline-none"
                >
                  {QUICK_RITUALS.map((r) => (
                    <option key={r.name} value={r.name}>
                      {r.name} — LKR {r.price.toLocaleString('en-US')}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11.5px] font-medium text-[#57544E]">
                  Formula / Concierge Notes
                </label>
                <textarea
                  rows={2}
                  value={newBooking.notes}
                  onChange={(e) =>
                    setNewBooking({ ...newBooking, notes: e.target.value })
                  }
                  placeholder="Optional scalp preferences, refreshments, or suite request..."
                  className="mt-1.5 w-full resize-none rounded-xl border border-[#E2DDD4] bg-[#F6F4EF] px-3.5 py-2 text-sm text-[#2A2927] focus:border-[#253026] focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2.5 border-t border-[#ECE8E0] pt-4">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="cursor-pointer rounded-full border border-[#E2DDD4] px-5 py-2 text-xs font-medium text-[#57544E] transition-colors hover:bg-[#EFECE6]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingBooking}
                  className="cursor-pointer rounded-full bg-[#253026] px-6 py-2 text-xs font-medium text-[#FAF8F5] shadow-xs transition-colors hover:bg-[#344335] disabled:opacity-60"
                >
                  {savingBooking ? 'Saving...' : 'Confirm & Add to Calendar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
