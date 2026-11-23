import { useMemo, useState } from 'react';
import {
  Bookmark,
  Camera,
  CheckCircle2,
  Clock,
  Eye,
  Flower2,
  Images,
  Maximize2,
  Plus,
  RefreshCw,
  Search,
  Sparkles,
  Trash2,
  TrendingUp,
  X,
} from 'lucide-react';

import heroPortrait from '../../assets/hero-portrait.jpg';
import bridalHero from '../../assets/bridal-hero.jpg';
import ritualSkin from '../../assets/ritual-skin.jpg';
import ritualHair from '../../assets/ritual-hair.jpg';
import bridalKandyan from '../../assets/bridal-kandyan.jpg';
import ritualBridal from '../../assets/ritual-bridal.jpg';
import {
  createLookbookItem,
  uploadLookbookImage,
} from '../../services/salonService';

const CATEGORIES = [
  'All Categories',
  'Balayage & Gloss',
  'Bridal Glam',
  'Glass Skin Facials',
  'Botanical Nail Art',
];

const INITIAL_LOOKS = [
  {
    id: 'sl-1',
    title: 'Cashmere Honey Balayage & Silk Gloss',
    category: 'Balayage & Gloss',
    status: 'Live on Website',
    serviceTag: 'Signature Botanical Balayage',
    views: '1.4k',
    saves: 84,
    image: heroPortrait,
  },
  {
    id: 'sl-2',
    title: 'Ethereal Botanical Bridal Updo',
    category: 'Bridal Glam',
    status: 'Pending Admin Review',
    serviceTag: 'Bridal Trial Hair & Makeup',
    views: '0',
    saves: 0,
    image: bridalHero,
  },
  {
    id: 'sl-3',
    title: 'Jasmine Glow & Lymphatic Drainage',
    category: 'Glass Skin Facials',
    status: 'Live on Website',
    serviceTag: 'Jasmine Glow Facial',
    views: '920',
    saves: 62,
    image: ritualSkin,
  },
  {
    id: 'sl-4',
    title: 'Pressed Botanical Almond Manicure',
    category: 'Botanical Nail Art',
    status: 'Live on Website',
    serviceTag: 'Organic Gel Manicure',
    views: '650',
    saves: 41,
    image: ritualHair,
  },
  {
    id: 'sl-5',
    title: 'Autumn Copper Melt & Gloss',
    category: 'Balayage & Gloss',
    status: 'Pending Admin Review',
    serviceTag: 'Signature Botanical Balayage',
    views: '0',
    saves: 0,
    image: ritualBridal,
  },
  {
    id: 'sl-6',
    title: 'Midnight Gloss Hollywood Waves',
    category: 'Bridal Glam',
    status: 'Live on Website',
    serviceTag: 'Bridal Trial Hair & Makeup',
    views: '1.1k',
    saves: 73,
    image: bridalKandyan,
  },
];

export default function StylistProfilePage() {
  const [looks, setLooks] = useState(INITIAL_LOOKS);
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const [searchText, setSearchText] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [lightboxLook, setLightboxLook] = useState(null);
  const [newLook, setNewLook] = useState({
    title: '',
    category: 'Balayage & Gloss',
    serviceTag: 'Signature Botanical Balayage',
    previewUrl: '',
    file: null,
  });

  const liveCount = useMemo(
    () => looks.filter((l) => l.status === 'Live on Website').length,
    [looks]
  );
  const pendingCount = useMemo(
    () => looks.filter((l) => l.status === 'Pending Admin Review').length,
    [looks]
  );
  const totalSaves = useMemo(
    () => looks.reduce((sum, l) => sum + (Number(l.saves) || 0), 80),
    [looks]
  );

  const filteredLooks = useMemo(() => {
    return looks.filter((item) => {
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'live' && item.status === 'Live on Website') ||
        (statusFilter === 'pending' && item.status === 'Pending Admin Review');

      const matchesCategory =
        categoryFilter === 'All Categories' || item.category === categoryFilter;

      const q = searchText.trim().toLowerCase();
      const matchesQuery =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.serviceTag.toLowerCase().includes(q);

      return matchesStatus && matchesCategory && matchesQuery;
    });
  }, [looks, statusFilter, categoryFilter, searchText]);

  const handleDeleteLook = (id) => {
    setLooks((prev) => prev.filter((item) => item.id !== id));
    if (lightboxLook?.id === id) setLightboxLook(null);
  };

  const handleToggleStatus = (id) => {
    setLooks((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              status:
                item.status === 'Live on Website'
                  ? 'Pending Admin Review'
                  : 'Live on Website',
            }
          : item
      )
    );
    setLightboxLook((prev) =>
      prev && prev.id === id
        ? {
            ...prev,
            status:
              prev.status === 'Live on Website'
                ? 'Pending Admin Review'
                : 'Live on Website',
          }
        : prev
    );
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!newLook.title.trim()) return;
    setUploading(true);

    let uploadedUrl = '';
    if (newLook.file) {
      const { url } = await uploadLookbookImage(newLook.file, 'lookbook');
      if (url) uploadedUrl = url;
    }

    const { data } = await createLookbookItem({
      title: newLook.title.trim(),
      category: newLook.category,
      linked_service: newLook.serviceTag,
      specialist_name: 'Nethmi Perera',
      status: 'Pending Admin Review',
      image_url: uploadedUrl,
    });

    setLooks((prev) => [
      {
        id: data?.id || `sl-${Date.now()}`,
        title: newLook.title.trim(),
        category: newLook.category,
        status: 'Pending Admin Review',
        serviceTag: newLook.serviceTag,
        views: '0',
        saves: 0,
        image: uploadedUrl || newLook.previewUrl || heroPortrait,
      },
      ...prev,
    ]);
    setNewLook({
      title: '',
      category: 'Balayage & Gloss',
      serviceTag: 'Signature Botanical Balayage',
      previewUrl: '',
      file: null,
    });
    setUploading(false);
    setShowUploadModal(false);
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* ================= SIGNATURE DARK-SAGE EDITORIAL HERO ================= */}
      <section className="overflow-hidden rounded-[26px] border border-[#344335] bg-[#253026] p-6 text-[#FAF8F5] shadow-md sm:p-7">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
          <div className="max-w-lg">
            <p className="inline-flex items-center gap-1.5 text-[10px] font-semibold tracking-[0.22em] text-[#EFE0C6] uppercase">
              <Sparkles className="h-3.5 w-3.5" />
              Portfolio &amp; Editorial Showcase
            </p>
            <h1 className="mt-1.5 font-serif text-[32px] font-normal leading-tight text-[#FAF8F5] sm:text-[36px]">
              My Lookbook
            </h1>
            <p className="mt-1.5 text-[12.5px] leading-relaxed text-[#B8C6BA]">
              Curate your signature botanical transformations to inspire direct
              client bookings on the Vera &amp; Bloom website.
            </p>

            <button
              type="button"
              onClick={() => setShowUploadModal(true)}
              className="mt-5 inline-flex cursor-pointer items-center gap-2 rounded-full bg-[#EFE0C6] px-5 py-2.5 text-[12px] font-semibold tracking-wide text-[#222B23] shadow-xs transition-all hover:bg-[#F7EEDC]"
            >
              <Plus className="h-3.5 w-3.5" strokeWidth={2.5} />
              <span>Upload New Transformation</span>
            </button>
          </div>

          {/* 3 Translucent Glass Metric Tiles */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4">
            <div className="rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/10 text-[#EFE0C6]">
                <Images className="h-4 w-4" strokeWidth={1.7} />
              </div>
              <p className="mt-3 font-serif text-[26px] font-semibold leading-none text-[#FAF8F5]">
                {looks.length}
              </p>
              <p className="mt-1 text-[10.5px] text-[#A8B8AA]">Published Looks</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/10 text-[#EFE0C6]">
                <Bookmark className="h-4 w-4" strokeWidth={1.7} />
              </div>
              <p className="mt-3 font-serif text-[26px] font-semibold leading-none text-[#EFE0C6]">
                {totalSaves}
              </p>
              <p className="mt-1 text-[10.5px] text-[#A8B8AA]">Client Saves</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/10 text-[#EFE0C6]">
                <TrendingUp className="h-4 w-4" strokeWidth={1.7} />
              </div>
              <p className="mt-3 font-serif text-[26px] font-semibold leading-none text-[#FAF8F5]">
                19
              </p>
              <p className="mt-1 text-[10.5px] text-[#A8B8AA]">Direct Bookings</p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= ELEVATED FILTER & SEARCH TOOLBAR ================= */}
      <section className="flex flex-col gap-3.5 rounded-[22px] border border-[#E6E2DA] bg-[#FAF8F5] p-3.5 shadow-2xs">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Status Pills */}
          <div className="flex flex-wrap items-center gap-1.5 text-[12px]">
            {[
              { id: 'all', label: 'All Looks', count: looks.length },
              { id: 'live', label: 'Live on Website', count: liveCount },
              { id: 'pending', label: 'Pending Review', count: pendingCount },
            ].map((tab) => {
              const active = statusFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setStatusFilter(tab.id)}
                  className={`inline-flex cursor-pointer items-center gap-2 rounded-full px-4 py-1.5 font-medium transition-all ${
                    active
                      ? 'bg-[#253026] text-[#FAF8F5] shadow-xs'
                      : 'bg-[#F3F0EA] text-[#57544E] hover:bg-[#E8E4DC]'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${
                      active
                        ? 'bg-[#EFE0C6] text-[#222B23]'
                        : 'bg-[#FAF8F5] text-[#6C6961]'
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Pill Search */}
          <div className="relative w-full sm:w-64">
            <Search className="pointer-events-none absolute top-1/2 left-3.5 h-3.5 w-3.5 -translate-y-1/2 text-[#8A867E]" />
            <input
              type="search"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Search look title or ritual..."
              className="w-full rounded-full border border-[#E6E2DA] bg-[#F3F0EA] py-2 pr-4 pl-9 text-[12px] text-[#222B23] placeholder:text-[#928D84] focus:border-[#253026] focus:bg-[#FAF8F5] focus:outline-none"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5 border-t border-[#EFECE5] pt-3">
          {CATEGORIES.map((cat) => {
            const active = categoryFilter === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setCategoryFilter(cat)}
                className={`cursor-pointer rounded-full px-3.5 py-1 text-[11.5px] font-medium transition-all ${
                  active
                    ? 'bg-[#EFE0C6] font-semibold text-[#222B23]'
                    : 'text-[#6C6961] hover:bg-[#F3F0EA] hover:text-[#222B23]'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </section>

      {/* ================= 3-COLUMN EDITORIAL PORTFOLIO GRID ================= */}
      {filteredLooks.length === 0 ? (
        <div className="rounded-[24px] border border-[#E6E2DA] bg-[#FAF8F5] p-12 text-center shadow-2xs">
          <Images className="mx-auto h-7 w-7 text-[#C8A870]" />
          <p className="mt-2 font-serif text-xl text-[#222B23]">
            No portfolio looks match your filter
          </p>
          <p className="mt-1 text-xs text-[#7A766E]">
            Try clearing your search or upload a new transformation.
          </p>
        </div>
      ) : (
        <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredLooks.map((look) => {
            const isLive = look.status === 'Live on Website';
            return (
              <article
                key={look.id}
                className="group flex flex-col justify-between overflow-hidden rounded-[24px] border border-[#E6E2DA] bg-[#FAF8F5] shadow-2xs transition-all hover:-translate-y-0.5 hover:shadow-lg"
              >
                <div>
                  {/* Image + Floating Glass Badges */}
                  <div
                    onClick={() => setLightboxLook(look)}
                    className="relative aspect-[4/3.8] w-full cursor-pointer overflow-hidden bg-[#ECE8E0]"
                  >
                    <img
                      src={look.image}
                      alt={look.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#181E19]/45 to-transparent" />

                    <span className="absolute top-3 left-3 rounded-full bg-[#FAF8F5]/92 px-3 py-1 text-[10px] font-semibold text-[#222B23] shadow-xs backdrop-blur-xs">
                      {look.category}
                    </span>

                    <span
                      className={`absolute top-3 right-3 inline-flex items-center gap-1 rounded-full px-3 py-1 text-[10px] font-semibold shadow-xs backdrop-blur-xs ${
                        isLive
                          ? 'bg-[#253026]/92 text-[#EFE0C6]'
                          : 'bg-[#F5E6CB]/95 text-[#6B5028]'
                      }`}
                    >
                      {isLive ? (
                        <CheckCircle2 className="h-3 w-3" />
                      ) : (
                        <Clock className="h-3 w-3" />
                      )}
                      {isLive ? 'Live on Web' : 'Pending Review'}
                    </span>

                    <span className="absolute right-3 bottom-3 flex h-8 w-8 items-center justify-center rounded-full bg-[#FAF8F5]/90 text-[#222B23] opacity-0 shadow-xs transition-opacity group-hover:opacity-100">
                      <Maximize2 className="h-3.5 w-3.5" />
                    </span>
                  </div>

                  {/* Title & Linked Service Tag */}
                  <div className="p-5">
                    <h2 className="font-serif text-[18.5px] font-semibold leading-snug text-[#222B23]">
                      {look.title}
                    </h2>

                    <div className="mt-2.5 inline-flex items-center gap-1.5 rounded-full bg-[#F3F0EA] px-3 py-1 text-[11px] font-medium text-[#57544E]">
                      <Flower2 className="h-3 w-3 text-[#4A5B4B]" />
                      <span>{look.serviceTag}</span>
                    </div>
                  </div>
                </div>

                {/* Footer Stats + Actions */}
                <div className="flex items-center justify-between border-t border-[#EFECE5] px-5 py-3.5 text-[11.5px] text-[#6C6961]">
                  <div className="flex items-center gap-4">
                    <span className="inline-flex items-center gap-1.5 font-medium">
                      <Eye className="h-3.5 w-3.5 text-[#8A867E]" />
                      <span>{look.views}</span>
                    </span>
                    <span className="inline-flex items-center gap-1.5 font-medium">
                      <Bookmark className="h-3.5 w-3.5 text-[#B78B43]" />
                      <span>{look.saves}</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(look.id)}
                      title="Toggle Live / Pending status"
                      aria-label={`Toggle status for ${look.title}`}
                      className="cursor-pointer rounded-full p-2 text-[#5F5C55] transition-colors hover:bg-[#EFECE6] hover:text-[#222B23]"
                    >
                      <RefreshCw className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteLook(look.id)}
                      aria-label={`Delete ${look.title}`}
                      className="cursor-pointer rounded-full p-2 text-[#7A766E] transition-colors hover:bg-[#F4E1DE] hover:text-[#B64B42]"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </section>
      )}

      {/* ================= LIGHTBOX PREVIEW MODAL ================= */}
      {lightboxLook && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#181E19]/75 p-4 backdrop-blur-xs"
          onClick={() => setLightboxLook(null)}
        >
          <div
            className="grid w-full max-w-2xl grid-cols-1 overflow-hidden rounded-[26px] border border-white/15 bg-[#253026] text-[#FAF8F5] shadow-2xl sm:grid-cols-12"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sm:col-span-7">
              <img
                src={lightboxLook.image}
                alt={lightboxLook.title}
                className="h-72 w-full object-cover sm:h-full"
              />
            </div>

            <div className="flex flex-col justify-between p-6 sm:col-span-5">
              <div>
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-[#EFE0C6]/15 px-2.5 py-0.5 text-[10px] font-semibold text-[#EFE0C6]">
                    {lightboxLook.category}
                  </span>
                  <button
                    type="button"
                    onClick={() => setLightboxLook(null)}
                    className="cursor-pointer rounded-full p-1 text-[#A8B8AA] hover:bg-white/10 hover:text-white"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <h3 className="mt-4 font-serif text-2xl font-normal leading-snug text-[#FAF8F5]">
                  {lightboxLook.title}
                </h3>
                <p className="mt-2 text-xs text-[#B8C6BA]">
                  Linked Ritual: {lightboxLook.serviceTag}
                </p>

                <div className="mt-5 grid grid-cols-2 gap-2.5 rounded-2xl border border-white/10 bg-white/[0.06] p-3.5 text-xs">
                  <div>
                    <p className="text-[10px] text-[#A8B8AA]">Views</p>
                    <p className="mt-0.5 font-serif text-lg font-semibold text-[#FAF8F5]">
                      {lightboxLook.views}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-[#A8B8AA]">Saves</p>
                    <p className="mt-0.5 font-serif text-lg font-semibold text-[#EFE0C6]">
                      {lightboxLook.saves}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-2">
                <button
                  type="button"
                  onClick={() => handleToggleStatus(lightboxLook.id)}
                  className="w-full cursor-pointer rounded-full bg-[#EFE0C6] py-2.5 text-xs font-semibold text-[#222B23] transition-colors hover:bg-[#F7EEDC]"
                >
                  {lightboxLook.status === 'Live on Website'
                    ? 'Move to Pending Review'
                    : 'Publish Live on Website'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= UPLOAD NEW TRANSFORMATION MODAL ================= */}
      {showUploadModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#181E19]/60 p-4 backdrop-blur-xs"
          onClick={() => setShowUploadModal(false)}
        >
          <div
            className="w-full max-w-md overflow-hidden rounded-[24px] border border-[#E5E1D8] bg-[#FAF8F5] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between bg-[#253026] px-6 py-5 text-[#FAF8F5]">
              <div>
                <p className="text-[10px] font-semibold tracking-[0.2em] text-[#EFE0C6] uppercase">
                  Editorial Submission
                </p>
                <h3 className="mt-0.5 font-serif text-2xl font-normal">
                  Upload Transformation
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowUploadModal(false)}
                className="cursor-pointer rounded-full p-1.5 text-[#A8B8AA] hover:bg-white/10 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4 p-6">
              <div>
                <label className="block text-[11.5px] font-medium text-[#57544E]">
                  Look Title *
                </label>
                <input
                  type="text"
                  required
                  value={newLook.title}
                  onChange={(e) =>
                    setNewLook({ ...newLook, title: e.target.value })
                  }
                  placeholder="e.g. Sunlit Botanical Gloss Waves"
                  className="mt-1.5 w-full rounded-xl border border-[#E2DDD4] bg-[#F5F2EC] px-3.5 py-2.5 text-sm text-[#222B23] focus:border-[#253026] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11.5px] font-medium text-[#57544E]">
                    Category
                  </label>
                  <select
                    value={newLook.category}
                    onChange={(e) =>
                      setNewLook({ ...newLook, category: e.target.value })
                    }
                    className="mt-1.5 w-full rounded-xl border border-[#E2DDD4] bg-[#F5F2EC] px-3 py-2.5 text-xs text-[#222B23] focus:border-[#253026] focus:outline-none"
                  >
                    <option value="Balayage & Gloss">Balayage &amp; Gloss</option>
                    <option value="Bridal Glam">Bridal Glam</option>
                    <option value="Glass Skin Facials">
                      Glass Skin Facials
                    </option>
                    <option value="Botanical Nail Art">
                      Botanical Nail Art
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11.5px] font-medium text-[#57544E]">
                    Linked Service
                  </label>
                  <input
                    type="text"
                    required
                    value={newLook.serviceTag}
                    onChange={(e) =>
                      setNewLook({ ...newLook, serviceTag: e.target.value })
                    }
                    className="mt-1.5 w-full rounded-xl border border-[#E2DDD4] bg-[#F5F2EC] px-3 py-2.5 text-xs text-[#222B23] focus:border-[#253026] focus:outline-none"
                  />
                </div>
              </div>

              <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-[#CFC9BE] bg-[#F5F2EC] p-5 text-center transition-colors hover:border-[#253026] hover:bg-[#EFECE5]">
                {newLook.previewUrl ? (
                  <img
                    src={newLook.previewUrl}
                    alt="Upload preview"
                    className="h-32 w-full rounded-xl object-cover"
                  />
                ) : (
                  <>
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FAF8F5] text-[#4A5B4B] shadow-2xs">
                      <Camera className="h-4.5 w-4.5" />
                    </span>
                    <span className="mt-2 text-xs font-medium text-[#4A4741]">
                      Choose Transformation Photo
                    </span>
                    <span className="mt-0.5 text-[10.5px] text-[#8A867E]">
                      Uploads directly to Vera &amp; Bloom Lookbook Storage
                    </span>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setNewLook({
                        ...newLook,
                        file,
                        previewUrl: URL.createObjectURL(file),
                      });
                    }
                  }}
                  className="hidden"
                />
              </label>

              <div className="flex justify-end gap-2.5 border-t border-[#ECE8E0] pt-4">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="cursor-pointer rounded-full border border-[#E2DDD4] px-5 py-2 text-xs font-medium text-[#57544E] hover:bg-[#EFECE6]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="cursor-pointer rounded-full bg-[#253026] px-6 py-2 text-xs font-semibold text-[#FAF8F5] shadow-xs hover:bg-[#344335] disabled:opacity-60"
                >
                  {uploading ? 'Uploading...' : 'Submit for Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
