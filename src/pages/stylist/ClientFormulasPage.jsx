import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowLeft,
  Calendar,
  Camera,
  Check,
  CheckCircle2,
  Clock,
  Copy,
  FlaskConical,
  History,
  Leaf,
  Printer,
  Sparkles,
  X,
} from 'lucide-react';

import ritualHair from '../../assets/ritual-hair.jpg';
import heroPortrait from '../../assets/hero-portrait.jpg';
import {
  fetchClientFormulas,
  saveClientFormula,
} from '../../services/salonService';

const QUICK_ADDITIVES = [
  '+ 30ml Chamomile Infusion',
  '+ Cold-Pressed Rosehip Drop',
  '+ 10 Vol Organic Activator',
  '+ Camellia Gloss Seal',
];

const INITIAL_HISTORY = [
  {
    id: 'hist-1',
    date: 'October 14, 2026',
    tag: 'FALL REFRESH',
    hairNotes:
      'Root: 6.1 Ash Blonde + Chamomile Infusion, Gloss: Pearl Toner 9P',
    skinNotes:
      'Applied calming calendula serum post-steam. Sensitive around T-zone.',
    stylist: 'Nethmi Perera',
    photos: [ritualHair, heroPortrait],
  },
  {
    id: 'hist-2',
    date: 'July 02, 2026',
    tag: 'SUMMER BALAYAGE',
    hairNotes:
      'Freehand clay lightener + Rosewater developer. Toner: Honey Beige 8NB.',
    skinNotes:
      'Green tea botanical mask for summer UV recovery. Skin hydrated well.',
    stylist: 'Nethmi Perera',
    photos: [],
  },
  {
    id: 'hist-3',
    date: 'March 19, 2026',
    tag: 'SPRING RESTORATION',
    hairNotes:
      'Full botanical gloss treatment with lavender extract and organic argan.',
    skinNotes: 'Standard hydrating facial protocol completed without incident.',
    stylist: 'Nethmi Perera',
    photos: [],
  },
];

const INITIAL_RETAIL_RECS = [
  {
    id: 'rec-elixir',
    name: 'Organic Damask Rose Hair Elixir',
    description:
      'Recommended for daily moisture locking and color preservation.',
    checked: true,
  },
  {
    id: 'rec-shampoo',
    name: 'Chamomile & Calendula Soothing Shampoo',
    description: 'Sulfate-free botanical cleanser for sensitive scalps.',
    checked: true,
  },
  {
    id: 'rec-oil',
    name: 'Botanical Scalp Renewal Oil',
    description: 'Weekly intensive treatment for hydration balance.',
    checked: false,
  },
];

export default function ClientFormulasPage() {
  const location = useLocation();
  const incomingClient = location.state?.client;

  const clientName = incomingClient?.name || 'Kavindi Silva';
  const clientTier = incomingClient?.membership || 'VIP Botanical Member';
  const clientAlert =
    incomingClient?.alert ||
    'Allergic to synthetic sulfates • Prefers 100% organic botanicals';

  const initials = clientName
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const [history, setHistory] = useState(INITIAL_HISTORY);
  const [formulaText, setFormulaText] = useState(
    incomingClient?.formulaBase ||
      'Root: 6.1 Ash Blonde (Organic Base) + 30ml Chamomile Infusion. Gloss: Pearl Toner 9P with Rosehip Oil drop.'
  );
  const [processingTime, setProcessingTime] = useState('35 minutes');
  const [heatApplication, setHeatApplication] = useState(
    'Infrared Warmth (Low)'
  );
  const [scalpNotes, setScalpNotes] = useState(
    'Scalp calm, no irritation noted from botanical developer.'
  );
  const [beforePreview, setBeforePreview] = useState(null);
  const [afterPreview, setAfterPreview] = useState(null);
  const [recommendations, setRecommendations] = useState(INITIAL_RETAIL_RECS);
  const [saving, setSaving] = useState(false);
  const [savedBanner, setSavedBanner] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [lightboxPhoto, setLightboxPhoto] = useState(null);

  useEffect(() => {
    let active = true;
    fetchClientFormulas(clientName).then(({ data }) => {
      if (!active || !Array.isArray(data) || data.length === 0) return;
      const mapped = data.map((row) => ({
        id: row.id,
        date: new Date(row.created_at).toLocaleDateString('en-US', {
          month: 'long',
          day: '2-digit',
          year: 'numeric',
        }),
        tag: row.visit_tag || 'SAVED FORMULA',
        hairNotes: row.hair_formula,
        skinNotes: row.skin_scalp_notes || 'No skin/scalp issues recorded.',
        stylist: row.stylist_name || 'Nethmi Perera',
        photos: [],
      }));
      setHistory((prev) => {
        const ids = new Set(prev.map((h) => h.id));
        const fresh = mapped.filter((m) => !ids.has(m.id));
        return fresh.length > 0 ? [...fresh, ...prev] : prev;
      });
    });
    return () => {
      active = false;
    };
  }, [clientName]);

  const toggleRec = (id) => {
    setRecommendations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, checked: !r.checked } : r))
    );
  };

  const handlePhotoUpload = (e, setter) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setter(URL.createObjectURL(file));
  };

  const handleAppendAdditive = (chip) => {
    setFormulaText((prev) =>
      prev.trim().endsWith('.') ? `${prev.trim()} ${chip}` : `${prev.trim()} ${chip}`
    );
  };

  const handleReuseFormula = (visit) => {
    setFormulaText(visit.hairNotes);
    setCopiedId(visit.id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const handleSaveSession = async (e) => {
    e.preventDefault();
    setSaving(true);
    const todayLabel = new Date().toLocaleDateString('en-US', {
      month: 'long',
      day: '2-digit',
      year: 'numeric',
    });

    await saveClientFormula({
      customer_name: clientName,
      stylist_name: 'Nethmi Perera',
      visit_tag: 'LIVE SESSION SAVED',
      hair_formula: formulaText,
      processing_time: processingTime,
      heat_application: heatApplication,
      skin_scalp_notes: scalpNotes,
      retail_recommendations: recommendations
        .filter((r) => r.checked)
        .map((r) => r.name),
    });

    setHistory((prev) => [
      {
        id: `hist-${Date.now()}`,
        date: todayLabel,
        tag: 'LIVE SESSION SAVED',
        hairNotes: formulaText,
        skinNotes: scalpNotes,
        stylist: 'Nethmi Perera',
        photos: [beforePreview, afterPreview].filter(Boolean),
      },
      ...prev,
    ]);
    setSaving(false);
    setSavedBanner(true);
    setTimeout(() => setSavedBanner(false), 3000);
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* ================= SIGNATURE DARK-SAGE CLIENT DOSSIER HEADER ================= */}
      <section className="overflow-hidden rounded-[24px] border border-[#344335] bg-[#253026] p-6 text-[#FAF8F5] shadow-md">
        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2.5 text-[11.5px]">
              <Link
                to="/stylist"
                className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.06] px-3 py-1 font-medium text-[#EFE0C6] transition-colors hover:bg-white/12"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Back to Schedule</span>
              </Link>
              <span className="rounded-full bg-[#EFE0C6]/15 px-3 py-1 text-[10.5px] font-semibold text-[#EFE0C6]">
                {clientTier}
              </span>
            </div>

            <div className="flex items-center gap-4">
              <span className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#EFE0C6] font-serif text-lg font-bold tracking-wider text-[#222B23] shadow-xs">
                {initials}
              </span>
              <div>
                <h1 className="font-serif text-[28px] font-normal leading-tight text-[#FAF8F5] sm:text-[32px]">
                  {clientName}
                </h1>
                <p className="mt-0.5 text-[11.5px] text-[#A8B8AA]">
                  Botanical Formulation Record &amp; Sensitivity Profile
                </p>
              </div>
            </div>

            <div className="inline-flex items-center gap-2 rounded-full border border-[#EFE0C6]/30 bg-[#EFE0C6]/12 px-3.5 py-1.5 text-[11.5px] font-medium text-[#EFE0C6]">
              <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
              <span>{clientAlert}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.07] px-4 py-2.5 text-[12px] font-medium text-[#FAF8F5] transition-colors hover:bg-white/12"
            >
              <Printer className="h-3.5 w-3.5 text-[#EFE0C6]" />
              <span>Print Formula Sheet</span>
            </button>

            <a
              href="#formula-history"
              className="inline-flex items-center gap-1.5 rounded-full bg-[#EFE0C6] px-4 py-2.5 text-[12px] font-semibold text-[#222B23] shadow-xs transition-colors hover:bg-[#F7EEDC]"
            >
              <History className="h-3.5 w-3.5" />
              <span>{history.length} Past Visits</span>
            </a>
          </div>
        </div>
      </section>

      {/* ================= 2-COLUMN WORKSPACE ================= */}
      <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-12">
        {/* LEFT COLUMN: Past Treatment & Formula History */}
        <section id="formula-history" className="space-y-4 xl:col-span-6">
          <div className="flex items-baseline justify-between px-1">
            <div>
              <p className="text-[10px] font-semibold tracking-[0.2em] text-[#7A766E] uppercase">
                Formulation Archive
              </p>
              <h2 className="mt-0.5 font-serif text-[21px] font-semibold text-[#222B23]">
                Past Treatment &amp; Formula History
              </h2>
            </div>
            <span className="rounded-full bg-[#EAE5DC] px-2.5 py-0.5 text-[10.5px] font-semibold text-[#57544E]">
              {history.length} Visits
            </span>
          </div>

          <div className="space-y-4">
            {history.map((visit) => {
              const isJustCopied = copiedId === visit.id;
              return (
                <article
                  key={visit.id}
                  className="rounded-[22px] border border-[#E6E2DA] bg-[#FAF8F5] p-5 shadow-2xs transition-all hover:border-[#D4CFC4]"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#EFECE5] pb-3">
                    <span className="inline-flex items-center gap-2 text-[12.5px] font-semibold text-[#222B23]">
                      <Calendar className="h-3.5 w-3.5 text-[#4A5B4B]" />
                      {visit.date}
                    </span>
                    <span className="rounded-full bg-[#253026] px-2.5 py-0.5 text-[9.5px] font-semibold tracking-[0.14em] text-[#EFE0C6] uppercase">
                      {visit.tag}
                    </span>
                  </div>

                  <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl bg-[#F5F2EC] p-3.5">
                      <p className="flex items-center gap-1.5 text-[9.5px] font-semibold tracking-[0.16em] text-[#4A5B4B] uppercase">
                        <FlaskConical className="h-3 w-3" />
                        Hair Color &amp; Toner
                      </p>
                      <p className="mt-1.5 text-[12.5px] leading-relaxed text-[#222B23]">
                        {visit.hairNotes}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-[#F5F2EC] p-3.5">
                      <p className="flex items-center gap-1.5 text-[9.5px] font-semibold tracking-[0.16em] text-[#7A5E34] uppercase">
                        <Leaf className="h-3 w-3" />
                        Facial &amp; Skin Notes
                      </p>
                      <p className="mt-1.5 text-[12.5px] leading-relaxed text-[#4A4741]">
                        {visit.skinNotes}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[#EFECE5] pt-3.5">
                    <div className="flex items-center gap-2">
                      {visit.photos.map((src, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setLightboxPhoto(src)}
                          className="group relative h-11 w-11 cursor-pointer overflow-hidden rounded-xl border border-[#E5E1D8]"
                        >
                          <img
                            src={src}
                            alt={`Visit photo ${idx + 1}`}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                          />
                        </button>
                      ))}
                      <span className="text-[11px] text-[#7A766E]">
                        Stylist: <strong className="text-[#4A4741]">{visit.stylist}</strong>
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleReuseFormula(visit)}
                      className="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-[#F3F0EA] px-3 py-1 text-[11px] font-semibold text-[#253026] transition-colors hover:bg-[#253026] hover:text-[#EFE0C6]"
                    >
                      {isJustCopied ? (
                        <>
                          <Check className="h-3 w-3" />
                          <span>Loaded to Editor</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3" />
                          <span>Reuse Formula</span>
                        </>
                      )}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* RIGHT COLUMN: Today's Live Session Formula Workbench */}
        <section className="space-y-4 xl:col-span-6">
          <div className="flex items-baseline justify-between px-1">
            <div>
              <p className="text-[10px] font-semibold tracking-[0.2em] text-[#7A766E] uppercase">
                Active Chair Log
              </p>
              <h2 className="mt-0.5 font-serif text-[21px] font-semibold text-[#222B23]">
                Today&rsquo;s Service Notes &amp; Formula
              </h2>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#EDF3EE] px-3 py-1 text-[11px] font-semibold text-[#285431]">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#4E8B57] opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#4E8B57]" />
              </span>
              Live Session
            </span>
          </div>

          <form
            onSubmit={handleSaveSession}
            className="overflow-hidden rounded-[24px] border border-[#E6E2DA] bg-[#FAF8F5] shadow-sm"
          >
            {/* Subtle Dark-Sage Workbench Strip */}
            <div className="flex items-center justify-between bg-[#253026] px-6 py-3.5 text-[11.5px] text-[#EFE0C6]">
              <span className="inline-flex items-center gap-2 font-medium">
                <Sparkles className="h-3.5 w-3.5" />
                Botanical Formulation Lab
              </span>
              <span className="text-[10.5px] text-[#B8C6BA]">
                Sulfate-free ingredients only
              </span>
            </div>

            <div className="space-y-5 p-6">
              {/* Color / Product Formula Used */}
              <div>
                <label className="block text-[12px] font-semibold text-[#222B23]">
                  Color / Product Formula Used
                </label>
                <textarea
                  rows={3}
                  value={formulaText}
                  onChange={(e) => setFormulaText(e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-[#E5E1D8] bg-[#F5F2EC] p-3.5 text-[12.5px] leading-relaxed text-[#222B23] focus:border-[#253026] focus:bg-[#FAF8F5] focus:outline-none"
                />

                {/* Quick Botanical Additive Chips */}
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {QUICK_ADDITIVES.map((chip) => (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => handleAppendAdditive(chip)}
                      className="cursor-pointer rounded-full border border-[#E5E1D8] bg-[#F5F2EC] px-2.5 py-1 text-[10.5px] font-medium text-[#4A5B4B] transition-colors hover:border-[#253026] hover:bg-[#253026] hover:text-[#EFE0C6]"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </div>

              {/* Processing Time + Heat Application */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-[12px] font-semibold text-[#222B23]">
                    Processing Time
                  </label>
                  <div className="relative mt-2">
                    <input
                      type="text"
                      value={processingTime}
                      onChange={(e) => setProcessingTime(e.target.value)}
                      className="w-full rounded-xl border border-[#E5E1D8] bg-[#F5F2EC] py-2.5 pr-9 pl-3.5 text-[12.5px] text-[#222B23] focus:border-[#253026] focus:bg-[#FAF8F5] focus:outline-none"
                    />
                    <Clock className="pointer-events-none absolute top-1/2 right-3 h-3.5 w-3.5 -translate-y-1/2 text-[#8A867E]" />
                  </div>
                </div>

                <div>
                  <label className="block text-[12px] font-semibold text-[#222B23]">
                    Heat Application
                  </label>
                  <select
                    value={heatApplication}
                    onChange={(e) => setHeatApplication(e.target.value)}
                    className="mt-2 w-full rounded-xl border border-[#E5E1D8] bg-[#F5F2EC] px-3.5 py-2.5 text-[12.5px] text-[#222B23] focus:border-[#253026] focus:bg-[#FAF8F5] focus:outline-none"
                  >
                    <option value="Infrared Warmth (Low)">
                      Infrared Warmth (Low)
                    </option>
                    <option value="Botanical Steam (Gentle)">
                      Botanical Steam (Gentle)
                    </option>
                    <option value="Room Temperature (No Heat)">
                      Room Temperature (No Heat)
                    </option>
                  </select>
                </div>
              </div>

              {/* Skin & Scalp Observations */}
              <div>
                <label className="block text-[12px] font-semibold text-[#222B23]">
                  Skin &amp; Scalp Observations
                </label>
                <input
                  type="text"
                  value={scalpNotes}
                  onChange={(e) => setScalpNotes(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-[#E5E1D8] bg-[#F5F2EC] px-3.5 py-2.5 text-[12.5px] text-[#222B23] focus:border-[#253026] focus:bg-[#FAF8F5] focus:outline-none"
                />
              </div>

              {/* Before / After Photo Capture */}
              <div>
                <p className="text-[12px] font-semibold text-[#222B23]">
                  Before / After Photo Capture
                </p>
                <div className="mt-2 grid grid-cols-2 gap-3.5">
                  {[
                    {
                      label: 'Upload Before Shot',
                      preview: beforePreview,
                      setter: setBeforePreview,
                    },
                    {
                      label: 'Upload After Shot',
                      preview: afterPreview,
                      setter: setAfterPreview,
                    },
                  ].map((slot) => (
                    <div key={slot.label} className="relative">
                      <label className="flex h-28 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border border-dashed border-[#CFC9BE] bg-[#F5F2EC] p-3 text-center transition-colors hover:border-[#253026] hover:bg-[#EFECE5]">
                        {slot.preview ? (
                          <img
                            src={slot.preview}
                            alt={slot.label}
                            className="h-full w-full rounded-xl object-cover"
                          />
                        ) : (
                          <>
                            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FAF8F5] text-[#4A5B4B] shadow-2xs">
                              <Camera className="h-4 w-4" strokeWidth={1.7} />
                            </span>
                            <span className="mt-2 text-[11px] font-medium text-[#4A4741]">
                              {slot.label}
                            </span>
                          </>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handlePhotoUpload(e, slot.setter)}
                          className="hidden"
                        />
                      </label>
                      {slot.preview && (
                        <button
                          type="button"
                          onClick={() => slot.setter(null)}
                          aria-label={`Remove ${slot.label}`}
                          className="absolute top-2 right-2 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-[#253026]/85 text-white hover:bg-[#253026]"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Retail Product Recommendations */}
              <div>
                <p className="text-[12px] font-semibold text-[#222B23]">
                  Retail Product Recommendations
                </p>
                <div className="mt-2.5 space-y-2.5">
                  {recommendations.map((rec) => (
                    <button
                      key={rec.id}
                      type="button"
                      onClick={() => toggleRec(rec.id)}
                      className={`flex w-full cursor-pointer items-start gap-3 rounded-2xl border p-3.5 text-left transition-all ${
                        rec.checked
                          ? 'border-[#253026] bg-[#F3F0EA]'
                          : 'border-[#EFECE5] bg-[#FAF8F5] hover:border-[#D6D1C6]'
                      }`}
                    >
                      <span
                        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md transition-colors ${
                          rec.checked
                            ? 'bg-[#253026] text-[#EFE0C6]'
                            : 'border border-[#CFCAC0] bg-white'
                        }`}
                      >
                        {rec.checked && (
                          <Check className="h-3.5 w-3.5" strokeWidth={2.6} />
                        )}
                      </span>
                      <div>
                        <p className="text-[12.5px] font-semibold text-[#222B23]">
                          {rec.name}
                        </p>
                        <p className="mt-0.5 text-[11px] text-[#7A766E]">
                          {rec.description}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={saving}
                className={`flex w-full cursor-pointer items-center justify-center gap-2 rounded-full px-5 py-3.5 text-[12.5px] font-semibold tracking-wide shadow-sm transition-all disabled:opacity-60 ${
                  savedBanner
                    ? 'bg-[#4E8B57] text-[#FAF8F5]'
                    : 'bg-[#253026] text-[#FAF8F5] hover:bg-[#344335]'
                }`}
              >
                <CheckCircle2 className="h-4 w-4 text-[#EFE0C6]" />
                <span>
                  {saving
                    ? 'Saving Formula...'
                    : savedBanner
                      ? 'Formula Saved to Client History!'
                      : 'Save Formula & Complete Session'}
                </span>
              </button>
            </div>
          </form>
        </section>
      </div>

      {/* ================= PHOTO LIGHTBOX MODAL ================= */}
      {lightboxPhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#181E19]/75 p-4 backdrop-blur-xs"
          onClick={() => setLightboxPhoto(null)}
        >
          <div
            className="relative max-w-lg overflow-hidden rounded-[24px] border border-white/15 bg-[#253026] p-2 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={lightboxPhoto}
              alt="Client visit transformation"
              className="max-h-[75vh] w-full rounded-[18px] object-cover"
            />
            <button
              type="button"
              onClick={() => setLightboxPhoto(null)}
              aria-label="Close preview"
              className="absolute top-4 right-4 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-[#222B23]/80 text-white hover:bg-[#222B23]"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
