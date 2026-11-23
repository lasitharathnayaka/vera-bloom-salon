import { useMemo, useState } from 'react';
import {
  Bookmark,
  Camera,
  Eye,
  Flower2,
  Images,
  Pencil,
  Search,
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
  const [searchText, setSearchText] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [newLook, setNewLook] = useState({
    title: '',
    category: 'Balayage & Gloss',
    serviceTag: 'Signature Botanical Balayage',
    previewUrl: '',
    file: null,
  });

  const filteredLooks = useMemo(() => {
    return looks.filter((item) => {
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'live' && item.status === 'Live on Website') ||
        (statusFilter === 'pending' && item.status === 'Pending Admin Review');

      const q = searchText.trim().toLowerCase();
      const matchesQuery =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.serviceTag.toLowerCase().includes(q);

      return matchesStatus && matchesQuery;
    });
  }, [looks, statusFilter, searchText]);

  const handleDeleteLook = (id) => {
    setLooks((prev) => prev.filter((item) => item.id !== id));
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
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!newLook.title.trim()) return;

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
    setShowUploadModal(false);
  };

  return (
    <div className="mx-auto max-w-6xl space-y-7">
      {/* ================= TOP HEADER & METRICS ================= */}
      <section className="flex flex-col justify-between gap-6 lg:flex-row lg:items-start">
        <div>
          <p className="text-[10px] font-semibold tracking-[0.22em] text-[#6B786A] uppercase">
            Portfolio &amp; Editorial Showcase
          </p>
          <h1 className="mt-1 font-serif text-[28px] font-semibold text-[#2A2927]">
            My Lookbook
          </h1>
        </div>

        <div className="flex flex-col items-start gap-3 sm:items-end">
          {/* 3 Compact Metric Cards */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-3 rounded-xl border border-[#ECE8E0] bg-[#FAF8F5] px-4 py-3 shadow-2xs">
              <Images className="h-4 w-4 text-[#4A5B4B]" strokeWidth={1.7} />
              <div>
                <p className="text-[10.5px] text-[#7A766E]">Published</p>
                <p className="font-serif text-[18px] font-semibold leading-none text-[#2A2927]">
                  {22 + looks.length}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-[#ECE8E0] bg-[#FAF8F5] px-4 py-3 shadow-2xs">
              <Bookmark className="h-4 w-4 text-[#4A5B4B]" strokeWidth={1.7} />
              <div>
                <p className="text-[10.5px] text-[#7A766E]">Client Saves</p>
                <p className="font-serif text-[18px] font-semibold leading-none text-[#2A2927]">
                  340
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-[#ECE8E0] bg-[#FAF8F5] px-4 py-3 shadow-2xs">
              <TrendingUp
                className="h-4 w-4 text-[#4A5B4B]"
                strokeWidth={1.7}
              />
              <div>
                <p className="text-[10.5px] text-[#7A766E]">
                  Lookbook Bookings
                </p>
                <p className="font-serif text-[18px] font-semibold leading-none text-[#2A2927]">
                  19
                </p>
              </div>
            </div>
          </div>

          {/* Upload CTA */}
          <button
            type="button"
            onClick={() => setShowUploadModal(true)}
            className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-[#E4E0D8] bg-[#FAF8F5] px-4 py-2.5 text-[12px] font-medium text-[#2A2927] shadow-2xs transition-colors hover:bg-[#EFECE6]"
          >
            <Camera className="h-3.5 w-3.5 text-[#4A5B4B]" />
            <span>+ Upload New Transformation</span>
          </button>
        </div>
      </section>

      {/* ================= FILTER TABS + SEARCH ================= */}
      <section className="flex flex-col justify-between gap-4 border-b border-[#ECE8E0] pb-4 sm:flex-row sm:items-center">
        <div className="flex flex-wrap items-center gap-2 text-[12px]">
          {[
            { id: 'all', label: `All Looks (${22 + looks.length})` },
            { id: 'live', label: 'Live on Website (24)' },
            { id: 'pending', label: 'Pending Review (4)' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setStatusFilter(tab.id)}
              className={`cursor-pointer rounded-lg px-3.5 py-1.5 transition-colors ${
                statusFilter === tab.id
                  ? 'bg-[#4A5B4B] font-semibold text-[#FAF8F5]'
                  : 'text-[#5F5C55] hover:bg-[#EFECE6] hover:text-[#2A2927]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-60">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#8A867E]" />
          <input
            type="search"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search look title or tag..."
            className="w-full rounded-lg border border-[#E5E1D8] bg-[#FAF8F5] py-2 pl-9 pr-3 text-[12px] text-[#2A2927] placeholder:text-[#9A958C] focus:border-[#4A5B4B] focus:outline-none"
          />
        </div>
      </section>

      {/* ================= 3-COLUMN PORTFOLIO GRID ================= */}
      <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredLooks.map((look) => {
          const isLive = look.status === 'Live on Website';
          return (
            <article
              key={look.id}
              className="flex flex-col justify-between overflow-hidden rounded-2xl border border-[#ECE8E0] bg-[#FAF8F5] shadow-2xs transition-all hover:shadow-md"
            >
              <div>
                {/* Image + Top Floating Badges */}
                <div className="relative aspect-[4/3.5] w-full overflow-hidden bg-[#ECE8E0]">
                  <img
                    src={look.image}
                    alt={look.title}
                    className="h-full w-full object-cover"
                  />

                  <span className="absolute left-3 top-3 rounded-full bg-[#FAF8F5]/90 px-2.5 py-1 text-[10px] font-medium text-[#2A2927] shadow-2xs backdrop-blur-xs">
                    {look.category}
                  </span>

                  <span
                    className={`absolute right-3 top-3 rounded-full px-2.5 py-1 text-[10px] font-semibold shadow-2xs backdrop-blur-xs ${
                      isLive
                        ? 'bg-[#5B705D]/95 text-[#FAF8F5]'
                        : 'bg-[#DFD2B8]/95 text-[#5C492C]'
                    }`}
                  >
                    {look.status}
                  </span>
                </div>

                {/* Title & Linked Service Tag */}
                <div className="p-5">
                  <h2 className="font-serif text-[17px] font-semibold leading-snug text-[#2A2927]">
                    {look.title}
                  </h2>

                  <div className="mt-2.5 inline-flex items-center gap-1.5 rounded-md bg-[#F4F2ED] px-2.5 py-1 text-[11px] text-[#5F5C55]">
                    <Flower2 className="h-3 w-3 text-[#6B786A]" />
                    <span>{look.serviceTag}</span>
                  </div>
                </div>
              </div>

              {/* Footer Stats + Edit/Delete */}
              <div className="flex items-center justify-between border-t border-[#F0EDE7] px-5 py-3.5 text-[11.5px] text-[#6C6961]">
                <div className="flex items-center gap-4">
                  <span className="inline-flex items-center gap-1.5">
                    <Eye className="h-3.5 w-3.5 text-[#8A867E]" />
                    <span>{look.views}</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Bookmark className="h-3.5 w-3.5 text-[#8A867E]" />
                    <span>{look.saves}</span>
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleToggleStatus(look.id)}
                    title="Toggle Live / Pending status"
                    aria-label={`Edit ${look.title}`}
                    className="cursor-pointer rounded-md p-1.5 text-[#5F5C55] transition-colors hover:bg-[#EFECE6] hover:text-[#2A2927]"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteLook(look.id)}
                    aria-label={`Delete ${look.title}`}
                    className="cursor-pointer rounded-md p-1.5 text-[#7A766E] transition-colors hover:bg-[#F4E1DE] hover:text-[#B64B42]"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </section>

      {/* ================= UPLOAD NEW TRANSFORMATION MODAL ================= */}
      {showUploadModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#1F1E1C]/50 p-4 backdrop-blur-xs"
          onClick={() => setShowUploadModal(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-[#E5E1D8] bg-[#FAF8F5] p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#ECE8E0] pb-3">
              <h3 className="font-serif text-xl font-semibold text-[#2A2927]">
                Upload New Transformation
              </h3>
              <button
                type="button"
                onClick={() => setShowUploadModal(false)}
                className="cursor-pointer rounded p-1 text-[#7A766E] hover:bg-[#EFECE6]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#57544E]">
                  Look Title
                </label>
                <input
                  type="text"
                  required
                  value={newLook.title}
                  onChange={(e) =>
                    setNewLook({ ...newLook, title: e.target.value })
                  }
                  placeholder="e.g. Sunlit Botanical Gloss Waves"
                  className="mt-1.5 w-full rounded-lg border border-[#E2DDD4] bg-[#F6F4EF] px-3.5 py-2 text-sm text-[#2A2927] focus:border-[#4A5B4B] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#57544E]">
                    Category
                  </label>
                  <select
                    value={newLook.category}
                    onChange={(e) =>
                      setNewLook({ ...newLook, category: e.target.value })
                    }
                    className="mt-1.5 w-full rounded-lg border border-[#E2DDD4] bg-[#F6F4EF] px-3 py-2 text-xs text-[#2A2927] focus:border-[#4A5B4B] focus:outline-none"
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
                  <label className="block text-xs font-medium text-[#57544E]">
                    Linked Service
                  </label>
                  <input
                    type="text"
                    required
                    value={newLook.serviceTag}
                    onChange={(e) =>
                      setNewLook({ ...newLook, serviceTag: e.target.value })
                    }
                    className="mt-1.5 w-full rounded-lg border border-[#E2DDD4] bg-[#F6F4EF] px-3 py-2 text-xs text-[#2A2927] focus:border-[#4A5B4B] focus:outline-none"
                  />
                </div>
              </div>

              <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-[#D8D3C8] bg-[#F6F4EF] p-5 text-center hover:bg-[#EFECE6]">
                {newLook.previewUrl ? (
                  <img
                    src={newLook.previewUrl}
                    alt="Upload preview"
                    className="h-28 w-full rounded-lg object-cover"
                  />
                ) : (
                  <>
                    <Camera className="h-5 w-5 text-[#6B786A]" />
                    <span className="mt-1.5 text-xs text-[#57544E]">
                      Choose Transformation Photo
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

              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="cursor-pointer rounded-lg border border-[#E2DDD4] px-4 py-2 text-xs font-medium text-[#57544E] hover:bg-[#EFECE6]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="cursor-pointer rounded-lg bg-[#4A5B4B] px-5 py-2 text-xs font-medium text-[#FAF8F5] hover:bg-[#3B4A3C]"
                >
                  Submit for Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
