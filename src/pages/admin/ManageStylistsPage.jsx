import { useState } from 'react';
import {
  ArrowRight,
  Calendar,
  CalendarCog,
  Check,
  Download,
  Plus,
  Star,
  X,
} from 'lucide-react';

import specialistElena from '../../assets/specialist-elena.jpg';
import specialistAmara from '../../assets/specialist-amara.jpg';
import specialistJulian from '../../assets/specialist-julian.jpg';
import founderVera from '../../assets/founder-vera.jpg';

const WEEK_DAYS = [
  'MON 18',
  'TUE 19',
  'WED 20',
  'THU 21',
  'FRI 22',
  'SAT 23',
  'SUN 24',
];

const INITIAL_SPECIALISTS = [
  {
    id: 'elena',
    name: 'Elena Rostova',
    role: 'Senior Colorist',
    rating: '4.98',
    monthlyRev: 'LKR 1.42M',
    commissionRate: '22%',
    commissionEarned: 'LKR 312,400',
    completedSessions: 64,
    active: true,
    avatar: specialistElena,
    shifts: [
      '09:00 - 18:00',
      '09:00 - 18:00',
      'Off Day',
      '11:00 - 20:00',
      '09:00 - 18:00',
      '08:00 - 16:00',
      'Off Day',
    ],
  },
  {
    id: 'amara',
    name: 'Amara Thorne',
    role: 'Bridal & Facialist',
    rating: '4.95',
    monthlyRev: 'LKR 1.68M',
    commissionRate: '25%',
    commissionEarned: 'LKR 420,000',
    completedSessions: 58,
    active: true,
    avatar: specialistAmara,
    shifts: [
      'Off Day',
      '09:00 - 18:00',
      '09:00 - 18:00',
      '09:00 - 18:00',
      '12:00 - 21:00',
      '08:00 - 17:00',
      'Off Day',
    ],
  },
  {
    id: 'julian',
    name: 'Julian Vance',
    role: 'Master Stylist',
    rating: '4.91',
    monthlyRev: 'LKR 1.29M',
    commissionRate: '20%',
    commissionEarned: 'LKR 258,000',
    completedSessions: 71,
    active: true,
    avatar: specialistJulian,
    shifts: [
      '10:00 - 19:00',
      '10:00 - 19:00',
      '10:00 - 19:00',
      'Off Day',
      '10:00 - 19:00',
      '09:00 - 18:00',
      'Off Day',
    ],
  },
  {
    id: 'clara',
    name: 'Clara Vance',
    role: 'Nail Specialist',
    rating: '4.88',
    monthlyRev: 'LKR 980K',
    commissionRate: '18%',
    commissionEarned: 'LKR 176,400',
    completedSessions: 82,
    active: false,
    avatar: founderVera,
    shifts: [
      '09:00 - 17:00',
      'Off Day',
      'Off Day',
      '09:00 - 17:00',
      '09:00 - 17:00',
      'Off Day',
      'Off Day',
    ],
  },
];

export default function ManageStylistsPage() {
  const [specialists, setSpecialists] = useState(INITIAL_SPECIALISTS);
  const [editingRoster, setEditingRoster] = useState(false);
  const [exported, setExported] = useState(false);
  const [detailSpecialist, setDetailSpecialist] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSpec, setNewSpec] = useState({
    name: '',
    role: 'Botanical Stylist',
    commissionRate: '20%',
  });

  const toggleActive = (id) => {
    setSpecialists((prev) =>
      prev.map((s) => (s.id === id ? { ...s, active: !s.active } : s))
    );
  };

  const toggleShiftCell = (specId, dayIdx) => {
    if (!editingRoster) return;
    setSpecialists((prev) =>
      prev.map((s) => {
        if (s.id !== specId) return s;
        const updated = [...s.shifts];
        updated[dayIdx] =
          updated[dayIdx] === 'Off Day' ? '09:00 - 18:00' : 'Off Day';
        return { ...s, shifts: updated };
      })
    );
  };

  const handleExportSchedule = () => {
    setExported(true);
    setTimeout(() => setExported(false), 2400);
  };

  const handleAddSpecialist = (e) => {
    e.preventDefault();
    if (!newSpec.name.trim()) return;
    setSpecialists((prev) => [
      ...prev,
      {
        id: `spec-${Date.now()}`,
        name: newSpec.name.trim(),
        role: newSpec.role.trim() || 'Botanical Stylist',
        rating: '5.00',
        monthlyRev: 'LKR 0',
        commissionRate: newSpec.commissionRate,
        commissionEarned: 'LKR 0',
        completedSessions: 0,
        active: true,
        avatar: specialistElena,
        shifts: [
          '09:00 - 18:00',
          '09:00 - 18:00',
          '09:00 - 18:00',
          '09:00 - 18:00',
          '09:00 - 18:00',
          'Off Day',
          'Off Day',
        ],
      },
    ]);
    setNewSpec({ name: '', role: 'Botanical Stylist', commissionRate: '20%' });
    setShowAddModal(false);
  };

  return (
    <div className="mx-auto max-w-6xl space-y-7">
      {/* ================= PAGE HEADER ================= */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="font-serif text-[26px] font-medium text-[#2A2927]">
            Specialists &amp; Shift Roster
          </h1>
          <p className="mt-1 text-[12px] text-[#7A766E]">
            Manage sanctuary team members, commission metrics, and weekly
            operating shifts
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="inline-flex cursor-pointer items-center gap-1.5 self-start rounded-lg bg-[#4A5B4B] px-5 py-2.5 text-[12px] font-medium tracking-wide text-[#FAF8F5] shadow-xs transition-colors hover:bg-[#3B4A3C] sm:self-auto"
        >
          <Plus className="h-3.5 w-3.5" strokeWidth={2.2} />
          <span>Add New Specialist</span>
        </button>
      </div>

      {/* ================= 4-COLUMN SPECIALIST CARDS ================= */}
      <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {specialists.map((spec) => (
          <article
            key={spec.id}
            className="flex flex-col justify-between rounded-2xl border border-[#ECE8E0] bg-[#F2F0EB] p-5 shadow-2xs"
          >
            <div>
              {/* Avatar + Rating */}
              <div className="flex items-start justify-between">
                <div className="relative">
                  <img
                    src={spec.avatar}
                    alt={spec.name}
                    className="h-14 w-14 rounded-xl border border-[#E5E1D8] object-cover"
                  />
                  <span
                    className={`absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-[#F2F0EB] ${
                      spec.active ? 'bg-[#4A5B4B]' : 'bg-[#C4C0B7]'
                    }`}
                  />
                </div>

                <span className="inline-flex items-center gap-1 rounded-md bg-[#EFE5D1] px-2.5 py-1 text-[11px] font-semibold text-[#7A6444]">
                  <Star className="h-3 w-3" strokeWidth={1.8} />
                  <span>{spec.rating}</span>
                </span>
              </div>

              {/* Name & Role */}
              <h2 className="mt-4 font-serif text-[18px] font-semibold text-[#2A2927]">
                {spec.name}
              </h2>
              <p className="mt-0.5 text-[11.5px] text-[#7A766E]">{spec.role}</p>

              {/* Monthly Revenue + Active Toggle */}
              <div className="mt-5 flex items-center justify-between gap-2">
                <div>
                  <p className="text-[9.5px] font-semibold tracking-[0.14em] text-[#8A867E] uppercase">
                    Monthly Rev
                  </p>
                  <p className="mt-0.5 font-serif text-[16px] font-semibold text-[#2A2927]">
                    {spec.monthlyRev}
                  </p>
                </div>

                <button
                  type="button"
                  role="switch"
                  aria-checked={spec.active}
                  aria-label={`Toggle ${spec.name} active status`}
                  onClick={() => toggleActive(spec.id)}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition-colors ${
                    spec.active ? 'bg-[#4A5B4B]' : 'bg-[#DCD8CF]'
                  }`}
                >
                  <span
                    className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-xs transition-transform ${
                      spec.active ? 'translate-x-4.5' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* View Schedule & Commission CTA */}
            <button
              type="button"
              onClick={() => setDetailSpecialist(spec)}
              className="mt-5 flex w-full cursor-pointer items-center justify-between rounded-xl border border-[#ECE8E0] bg-[#FAF8F5] px-4 py-2.5 text-left text-[11.5px] font-medium text-[#2A2927] transition-colors hover:bg-[#EAE7E0]"
            >
              <span className="leading-snug">
                View Schedule &amp;
                <br />
                Commission
              </span>
              <ArrowRight className="h-3.5 w-3.5 shrink-0 text-[#4A5B4B]" />
            </button>
          </article>
        ))}
      </section>

      {/* ================= WEEKLY SHIFT ROSTER TABLE ================= */}
      <section className="rounded-2xl border border-[#ECE8E0] bg-[#F2F0EB] p-6">
        {/* Roster Header */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2.5 text-[#2A2927]">
            <Calendar className="h-4 w-4 text-[#4A5B4B]" />
            <h2 className="font-serif text-[18px] font-semibold">
              Current Week: Nov 18 - Nov 24
            </h2>
            {editingRoster && (
              <span className="rounded-full bg-[#EFE0C6] px-2.5 py-0.5 text-[10px] font-semibold text-[#7A6444]">
                Click any shift to toggle Off Day
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={handleExportSchedule}
              className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-[#E4E0D8] bg-[#FAF8F5] px-4 py-2 text-[12px] font-medium text-[#2A2927] transition-colors hover:bg-[#EAE7E0]"
            >
              {exported ? (
                <Check className="h-3.5 w-3.5 text-[#4A5B4B]" />
              ) : (
                <Download className="h-3.5 w-3.5 text-[#4A5B4B]" />
              )}
              <span>{exported ? 'Schedule Exported' : 'Export Schedule'}</span>
            </button>

            <button
              type="button"
              onClick={() => setEditingRoster((prev) => !prev)}
              className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-[#4A5B4B] px-4 py-2 text-[12px] font-medium text-[#FAF8F5] shadow-xs transition-colors hover:bg-[#3B4A3C]"
            >
              <CalendarCog className="h-3.5 w-3.5" />
              <span>{editingRoster ? 'Done Editing' : 'Edit Roster & Shifts'}</span>
            </button>
          </div>
        </div>

        {/* Roster Grid Table */}
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[780px] border-collapse text-left">
            <thead>
              <tr className="border-b border-[#E5E1D8] text-[9.5px] font-semibold tracking-[0.16em] text-[#8A867E] uppercase">
                <th className="pb-3 pr-4">Specialist</th>
                {WEEK_DAYS.map((day) => (
                  <th key={day} className="px-2 pb-3 text-center">
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E4DC]">
              {specialists.map((spec) => (
                <tr key={spec.id} className="hover:bg-[#FAF8F5]/50">
                  <td className="py-4 pr-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={spec.avatar}
                        alt={spec.name}
                        className="h-8 w-8 rounded-full border border-[#E2DDD4] object-cover"
                      />
                      <span className="font-serif text-[14.5px] font-semibold text-[#2A2927]">
                        {spec.name}
                      </span>
                    </div>
                  </td>

                  {spec.shifts.map((shift, idx) => {
                    const isOff = shift === 'Off Day';
                    return (
                      <td key={idx} className="px-1.5 py-4 text-center">
                        <button
                          type="button"
                          onClick={() => toggleShiftCell(spec.id, idx)}
                          className={`inline-block min-w-[82px] rounded-md px-2.5 py-1.5 text-[10.5px] font-medium transition-all ${
                            isOff
                              ? 'bg-[#E7E4DD] text-[#7A766E]'
                              : 'bg-[#E5ECE6] text-[#355A3A]'
                          } ${
                            editingRoster
                              ? 'cursor-pointer ring-1 ring-[#4A5B4B]/40 hover:scale-105'
                              : 'cursor-default'
                          }`}
                        >
                          {shift}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ================= SCHEDULE & COMMISSION MODAL ================= */}
      {detailSpecialist && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#1F1E1C]/50 p-4 backdrop-blur-xs"
          onClick={() => setDetailSpecialist(null)}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-[#E5E1D8] bg-[#FAF8F5] p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-[#ECE8E0] pb-4">
              <div className="flex items-center gap-3.5">
                <img
                  src={detailSpecialist.avatar}
                  alt={detailSpecialist.name}
                  className="h-12 w-12 rounded-xl object-cover"
                />
                <div>
                  <h3 className="font-serif text-xl font-semibold text-[#2A2927]">
                    {detailSpecialist.name}
                  </h3>
                  <p className="text-xs text-[#7A766E]">
                    {detailSpecialist.role}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setDetailSpecialist(null)}
                className="cursor-pointer rounded p-1 text-[#7A766E] hover:bg-[#EFECE6]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3.5">
              <div className="rounded-xl bg-[#F2F0EB] p-4">
                <p className="text-[10px] font-semibold tracking-wider text-[#8A867E] uppercase">
                  Monthly Revenue
                </p>
                <p className="mt-1 font-serif text-xl font-semibold text-[#2A2927]">
                  {detailSpecialist.monthlyRev}
                </p>
              </div>
              <div className="rounded-xl bg-[#F2F0EB] p-4">
                <p className="text-[10px] font-semibold tracking-wider text-[#8A867E] uppercase">
                  Commission ({detailSpecialist.commissionRate})
                </p>
                <p className="mt-1 font-serif text-xl font-semibold text-[#4A5B4B]">
                  {detailSpecialist.commissionEarned}
                </p>
              </div>
            </div>

            <div className="mt-4 rounded-xl border border-[#ECE8E0] bg-[#F6F4EF] p-4 text-xs text-[#57544E]">
              <p>
                Completed rituals this month:{' '}
                <strong className="text-[#2A2927]">
                  {detailSpecialist.completedSessions} sessions
                </strong>
              </p>
              <p className="mt-1">
                Guest rating:{' '}
                <strong className="text-[#2A2927]">
                  ★ {detailSpecialist.rating}
                </strong>
              </p>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={() => setDetailSpecialist(null)}
                className="cursor-pointer rounded-lg bg-[#4A5B4B] px-5 py-2 text-xs font-medium text-[#FAF8F5] hover:bg-[#3B4A3C]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= ADD NEW SPECIALIST MODAL ================= */}
      {showAddModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#1F1E1C]/50 p-4 backdrop-blur-xs"
          onClick={() => setShowAddModal(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-[#E5E1D8] bg-[#FAF8F5] p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#ECE8E0] pb-3">
              <h3 className="font-serif text-xl font-semibold text-[#2A2927]">
                Add Sanctuary Specialist
              </h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="cursor-pointer rounded p-1 text-[#7A766E] hover:bg-[#EFECE6]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleAddSpecialist} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#57544E]">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={newSpec.name}
                  onChange={(e) =>
                    setNewSpec({ ...newSpec, name: e.target.value })
                  }
                  placeholder="e.g. Dilini Perera"
                  className="mt-1.5 w-full rounded-lg border border-[#E2DDD4] bg-[#F6F4EF] px-3.5 py-2 text-sm text-[#2A2927] focus:border-[#4A5B4B] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#57544E]">
                    Specialty Role
                  </label>
                  <input
                    type="text"
                    required
                    value={newSpec.role}
                    onChange={(e) =>
                      setNewSpec({ ...newSpec, role: e.target.value })
                    }
                    className="mt-1.5 w-full rounded-lg border border-[#E2DDD4] bg-[#F6F4EF] px-3 py-2 text-xs text-[#2A2927] focus:border-[#4A5B4B] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#57544E]">
                    Commission Tier
                  </label>
                  <select
                    value={newSpec.commissionRate}
                    onChange={(e) =>
                      setNewSpec({ ...newSpec, commissionRate: e.target.value })
                    }
                    className="mt-1.5 w-full rounded-lg border border-[#E2DDD4] bg-[#F6F4EF] px-3 py-2 text-xs text-[#2A2927] focus:border-[#4A5B4B] focus:outline-none"
                  >
                    <option value="18%">18%</option>
                    <option value="20%">20%</option>
                    <option value="22%">22%</option>
                    <option value="25%">25%</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="cursor-pointer rounded-lg border border-[#E2DDD4] px-4 py-2 text-xs font-medium text-[#57544E] hover:bg-[#EFECE6]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="cursor-pointer rounded-lg bg-[#4A5B4B] px-5 py-2 text-xs font-medium text-[#FAF8F5] hover:bg-[#3B4A3C]"
                >
                  Add to Roster
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
