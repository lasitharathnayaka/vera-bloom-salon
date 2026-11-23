import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowLeft,
  Calendar,
  Camera,
  CheckCircle2,
  Clock,
  History,
  Printer,
} from 'lucide-react';

import ritualHair from '../../assets/ritual-hair.jpg';
import heroPortrait from '../../assets/hero-portrait.jpg';
import { saveClientFormula } from '../../services/salonService';

const INITIAL_HISTORY = [
  {
    id: 'hist-1',
    date: 'October 14, 2023',
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
    date: 'July 02, 2023',
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
    date: 'March 19, 2023',
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
  const [savedBanner, setSavedBanner] = useState(false);

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

  const handleSaveSession = async (e) => {
    e.preventDefault();
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
    setSavedBanner(true);
    setTimeout(() => setSavedBanner(false), 3000);
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* ================= TOP CLIENT HEADER CARD ================= */}
      <section className="flex flex-col justify-between gap-4 rounded-2xl border border-[#ECE8E0] bg-[#FAF8F5] p-5 shadow-2xs sm:flex-row sm:items-center">
        <div>
          <div className="flex flex-wrap items-center gap-2.5 text-[11.5px]">
            <Link
              to="/stylist"
              className="inline-flex items-center gap-1.5 font-medium text-[#4A5B4B] transition-colors hover:text-[#2A2927]"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Schedule</span>
            </Link>
            <span className="text-[#C8C3B9]">&bull;</span>
            <span className="font-medium text-[#6C6961]">{clientTier}</span>
          </div>

          <h1 className="mt-1.5 font-serif text-[26px] font-semibold text-[#2A2927]">
            {clientName}
          </h1>

          <div className="mt-2.5 inline-flex items-center gap-2 rounded-lg bg-[#F7EBCB] px-3 py-1.5 text-[11.5px] font-medium text-[#7A5E2A]">
            <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
            <span>{clientAlert}</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-[#E4E0D8] bg-[#F6F4EF] px-3.5 py-2 text-[11.5px] font-medium text-[#2A2927] transition-colors hover:bg-[#EAE6DE]"
          >
            <Printer className="h-3.5 w-3.5 text-[#4A5B4B]" />
            <span>Print Formula Sheet</span>
          </button>

          <a
            href="#formula-history"
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#E4E0D8] bg-[#FAF8F5] px-3.5 py-2 text-[11.5px] font-medium text-[#2A2927] transition-colors hover:bg-[#EFECE6]"
          >
            <History className="h-3.5 w-3.5 text-[#4A5B4B]" />
            <span>View Full History</span>
          </a>
        </div>
      </section>

      {/* ================= 2-COLUMN WORKSPACE ================= */}
      <div className="grid grid-cols-1 items-start gap-7 xl:grid-cols-12">
        {/* LEFT COLUMN: Past Treatment & Formula History */}
        <section id="formula-history" className="space-y-4 xl:col-span-6">
          <div className="flex items-baseline justify-between">
            <h2 className="font-serif text-[18px] font-semibold text-[#2A2927]">
              Past Treatment &amp; Formula History
            </h2>
            <span className="text-[11px] text-[#7A766E]">
              Showing last {history.length} visits
            </span>
          </div>

          <div className="space-y-4">
            {history.map((visit) => (
              <article
                key={visit.id}
                className="rounded-2xl border border-[#ECE8E0] bg-[#FAF8F5] p-5 shadow-2xs"
              >
                <div className="flex items-center justify-between gap-2 border-b border-[#EFECE6] pb-3">
                  <span className="inline-flex items-center gap-2 text-[12px] font-semibold text-[#2A2927]">
                    <Calendar className="h-3.5 w-3.5 text-[#4A5B4B]" />
                    {visit.date}
                  </span>
                  <span className="text-[10px] font-semibold tracking-[0.16em] text-[#6B786A] uppercase">
                    {visit.tag}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <p className="text-[9.5px] font-semibold tracking-[0.16em] text-[#8A867E] uppercase">
                      Hair Color &amp; Toner
                    </p>
                    <p className="mt-1.5 text-[12.5px] leading-relaxed text-[#2A2927]">
                      {visit.hairNotes}
                    </p>
                  </div>

                  <div>
                    <p className="text-[9.5px] font-semibold tracking-[0.16em] text-[#8A867E] uppercase">
                      Facial &amp; Skin Notes
                    </p>
                    <p className="mt-1.5 text-[12.5px] leading-relaxed text-[#4A4741]">
                      {visit.skinNotes}
                    </p>
                  </div>
                </div>

                {(visit.photos.length > 0 || visit.stylist) && (
                  <div className="mt-4 flex items-center justify-between border-t border-[#F1EFEA] pt-3.5">
                    <div className="flex items-center gap-2">
                      {visit.photos.map((src, idx) => (
                        <img
                          key={idx}
                          src={src}
                          alt={`Visit photo ${idx + 1}`}
                          className="h-10 w-10 rounded-lg border border-[#E5E1D8] object-cover"
                        />
                      ))}
                    </div>
                    <span className="text-[11px] text-[#7A766E]">
                      Stylist: {visit.stylist}
                    </span>
                  </div>
                )}
              </article>
            ))}
          </div>
        </section>

        {/* RIGHT COLUMN: Today's Service Notes & Formula (Live Session) */}
        <section className="space-y-4 xl:col-span-6">
          <div className="flex items-baseline justify-between">
            <h2 className="font-serif text-[18px] font-semibold text-[#2A2927]">
              Today&rsquo;s Service Notes &amp; Formula
            </h2>
            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#4A5B4B]">
              <span className="h-2 w-2 rounded-full bg-[#4A5B4B]" />
              Live Session
            </span>
          </div>

          <form
            onSubmit={handleSaveSession}
            className="space-y-5 rounded-2xl border border-[#ECE8E0] bg-[#FAF8F5] p-6 shadow-xs"
          >
            {/* Color / Product Formula Used */}
            <div>
              <div className="flex items-baseline justify-between gap-2">
                <label className="text-[12px] font-semibold text-[#2A2927]">
                  Color / Product Formula Used
                </label>
                <span className="text-[10.5px] text-[#8A867E]">
                  Sulfate-free ingredients only
                </span>
              </div>
              <textarea
                rows={3}
                value={formulaText}
                onChange={(e) => setFormulaText(e.target.value)}
                className="mt-2 w-full rounded-xl border border-[#E5E1D8] bg-[#F7F5F0] p-3.5 text-[12.5px] leading-relaxed text-[#2A2927] focus:border-[#4A5B4B] focus:bg-[#FAF8F5] focus:outline-none"
              />
            </div>

            {/* Processing Time + Heat Application */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-[12px] font-semibold text-[#2A2927]">
                  Processing Time
                </label>
                <div className="relative mt-2">
                  <input
                    type="text"
                    value={processingTime}
                    onChange={(e) => setProcessingTime(e.target.value)}
                    className="w-full rounded-xl border border-[#E5E1D8] bg-[#F7F5F0] py-2.5 pl-3.5 pr-9 text-[12.5px] text-[#2A2927] focus:border-[#4A5B4B] focus:bg-[#FAF8F5] focus:outline-none"
                  />
                  <Clock className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#8A867E]" />
                </div>
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-[#2A2927]">
                  Heat Application
                </label>
                <select
                  value={heatApplication}
                  onChange={(e) => setHeatApplication(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-[#E5E1D8] bg-[#F7F5F0] px-3.5 py-2.5 text-[12.5px] text-[#2A2927] focus:border-[#4A5B4B] focus:bg-[#FAF8F5] focus:outline-none"
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
              <label className="block text-[12px] font-semibold text-[#2A2927]">
                Skin &amp; Scalp Observations
              </label>
              <input
                type="text"
                value={scalpNotes}
                onChange={(e) => setScalpNotes(e.target.value)}
                className="mt-2 w-full rounded-xl border border-[#E5E1D8] bg-[#F7F5F0] px-3.5 py-2.5 text-[12.5px] text-[#2A2927] focus:border-[#4A5B4B] focus:bg-[#FAF8F5] focus:outline-none"
              />
            </div>

            {/* Before / After Photo Capture */}
            <div>
              <p className="text-[12px] font-semibold text-[#2A2927]">
                Before / After Photo Capture
              </p>
              <div className="mt-2 grid grid-cols-2 gap-3.5">
                <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-[#D8D3C8] bg-[#F7F5F0] p-5 text-center transition-colors hover:bg-[#EFECE6]">
                  {beforePreview ? (
                    <img
                      src={beforePreview}
                      alt="Before shot preview"
                      className="h-20 w-full rounded-lg object-cover"
                    />
                  ) : (
                    <>
                      <Camera
                        className="h-5 w-5 text-[#6B786A]"
                        strokeWidth={1.6}
                      />
                      <span className="mt-2 text-[11.5px] font-medium text-[#4A4741]">
                        Upload Before Shot
                      </span>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handlePhotoUpload(e, setBeforePreview)}
                    className="hidden"
                  />
                </label>

                <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-[#D8D3C8] bg-[#F7F5F0] p-5 text-center transition-colors hover:bg-[#EFECE6]">
                  {afterPreview ? (
                    <img
                      src={afterPreview}
                      alt="After shot preview"
                      className="h-20 w-full rounded-lg object-cover"
                    />
                  ) : (
                    <>
                      <Camera
                        className="h-5 w-5 text-[#6B786A]"
                        strokeWidth={1.6}
                      />
                      <span className="mt-2 text-[11.5px] font-medium text-[#4A4741]">
                        Upload After Shot
                      </span>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handlePhotoUpload(e, setAfterPreview)}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Retail Product Recommendations */}
            <div>
              <p className="text-[12px] font-semibold text-[#2A2927]">
                Retail Product Recommendations
              </p>
              <div className="mt-2.5 space-y-2.5">
                {recommendations.map((rec) => (
                  <label
                    key={rec.id}
                    className="flex cursor-pointer items-start gap-3 rounded-xl border border-[#EFECE6] bg-[#F7F5F0] p-3 transition-colors hover:bg-[#EFECE6]"
                  >
                    <input
                      type="checkbox"
                      checked={rec.checked}
                      onChange={() => toggleRec(rec.id)}
                      className="mt-0.5 h-4 w-4 accent-[#4A5B4B]"
                    />
                    <div>
                      <p className="text-[12.5px] font-semibold text-[#2A2927]">
                        {rec.name}
                      </p>
                      <p className="mt-0.5 text-[11px] text-[#7A766E]">
                        {rec.description}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#4A5B4B] px-5 py-3.5 text-[12.5px] font-medium tracking-wide text-[#FAF8F5] shadow-xs transition-colors hover:bg-[#3B4A3C]"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>
                {savedBanner
                  ? 'Formula Saved to Client History!'
                  : 'Save Formula & Complete Session'}
              </span>
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
