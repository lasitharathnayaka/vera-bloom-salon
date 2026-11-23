import { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  Clock,
  Eye,
  EyeOff,
  Image as ImageIcon,
  Pencil,
  Plus,
  Search,
  Sparkles,
  Tag,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import {
  createLookbookItem,
  createService,
  deleteService,
  fetchServices,
  updateService,
  uploadLookbookImage,
} from '../../services/salonService';

import heroPortrait from '../../assets/hero-portrait.jpg';
import ritualSkin from '../../assets/ritual-skin.jpg';
import bridalHero from '../../assets/bridal-hero.jpg';
import wallpaperSanctuary from '../../assets/wallpaper-sanctuary.jpg';

const CATEGORY_FILTERS = [
  { id: 'all', label: 'All Services' },
  { id: 'Hair & Color', label: 'Hair & Botanical Color' },
  { id: 'Facials', label: 'Holistic Facials' },
  { id: 'Nails', label: 'Nails & Hand Spa' },
  { id: 'Bridal', label: 'Bridal Packages' },
  { id: 'Waxing', label: 'Waxing & Care' },
];

const CATEGORY_BADGE_STYLES = {
  'Hair & Color': 'bg-[#E5ECE6] text-[#2F4733]',
  Facials: 'bg-[#F5E8D0] text-[#7A5E34]',
  Bridal: 'bg-[#253026] text-[#EFE0C6]',
  Nails: 'bg-[#F2E9DC] text-[#6E5634]',
  Waxing: 'bg-[#ECEAE4] text-[#57544E]',
};

const INITIAL_TREATMENTS = [
  {
    id: 'tr-balayage',
    name: 'Organic Botanical Balayage',
    description: 'Custom freehand lightening with plant-derived oils',
    category: 'Hair & Color',
    duration: 180,
    price: 24500,
    onlineBooking: true,
  },
  {
    id: 'tr-facial',
    name: 'Signature Sanctuary Facial',
    description: 'Deep cleansing, lymphatic drainage & herbal infusion',
    category: 'Facials',
    duration: 75,
    price: 14800,
    onlineBooking: true,
  },
  {
    id: 'tr-bridal',
    name: 'Royal Bridal Hair & Glow Suite',
    description: 'Complete trial, wedding day styling, airbrush makeup',
    category: 'Bridal',
    duration: 240,
    price: 65000,
    onlineBooking: true,
  },
  {
    id: 'tr-nails',
    name: 'Botanical Hand Spa & Gel Polish',
    description: 'Exfoliation, warm almond oil massage & clean polish',
    category: 'Nails',
    duration: 45,
    price: 6500,
    onlineBooking: false,
  },
];

const INITIAL_LOOKBOOK_UPLOADS = [
  {
    id: 'lb-1',
    title: 'Caramel Glow Balayage',
    linkedService: 'Organic Botanical Balayage',
    specialist: 'Elena Rostova',
    initials: 'ER',
    initialsClass: 'bg-[#253026] text-[#EFE0C6]',
    status: 'Active on Web',
    image: heroPortrait,
  },
  {
    id: 'lb-2',
    title: 'Botanical Hydration Ritual',
    linkedService: 'Signature Sanctuary Facial',
    specialist: 'Amara Thorne',
    initials: 'AT',
    initialsClass: 'bg-[#EFE0C6] text-[#222B23]',
    status: 'Active on Web',
    image: ritualSkin,
  },
  {
    id: 'lb-3',
    title: 'Botanical Crown Updo',
    linkedService: 'Royal Bridal Hair & Glow Suite',
    specialist: 'Julian Vance',
    initials: 'JV',
    initialsClass: 'bg-[#253026] text-[#EFE0C6]',
    status: 'Featured Hero',
    image: bridalHero,
  },
];

export default function ManageServicesPage() {
  const [activeMainTab, setActiveMainTab] = useState('menu');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filterText, setFilterText] = useState('');
  const [onlyLiveOnline, setOnlyLiveOnline] = useState(false);
  const [treatments, setTreatments] = useState(INITIAL_TREATMENTS);
  const [uploads, setUploads] = useState(INITIAL_LOOKBOOK_UPLOADS);

  // Add / Edit Treatment Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [savingTreatment, setSavingTreatment] = useState(false);
  const [formState, setFormState] = useState({
    name: '',
    description: '',
    category: 'Hair & Color',
    duration: 60,
    price: 8500,
    onlineBooking: true,
  });

  // Upload Lookbook Photo Modal
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    title: '',
    linkedService: 'Organic Botanical Balayage',
    specialist: 'Elena Rostova',
    status: 'Active on Web',
    file: null,
    previewUrl: '',
  });

  useEffect(() => {
    let active = true;
    fetchServices().then(({ data }) => {
      if (!active || !Array.isArray(data) || data.length === 0) return;
      setTreatments(
        data.map((s) => ({
          id: s.id,
          name: s.name,
          description: s.description,
          category:
            s.category_id === 'hair'
              ? 'Hair & Color'
              : s.category_id === 'facials'
                ? 'Facials'
                : s.category_id === 'nails'
                  ? 'Nails'
                  : s.category_id === 'bridal'
                    ? 'Bridal'
                    : 'Waxing',
          duration: s.duration_mins,
          price: s.price_lkr,
          onlineBooking: s.online_booking,
        }))
      );
    });
    return () => {
      active = false;
    };
  }, []);

  const categoryCounts = useMemo(() => {
    const counts = { all: treatments.length };
    CATEGORY_FILTERS.forEach((c) => {
      if (c.id !== 'all') {
        counts[c.id] = treatments.filter((t) => t.category === c.id).length;
      }
    });
    return counts;
  }, [treatments]);

  const metrics = useMemo(() => {
    const liveCount = treatments.filter((t) => t.onlineBooking).length;
    const avgPrice =
      treatments.length > 0
        ? Math.round(
            treatments.reduce((sum, t) => sum + Number(t.price || 0), 0) /
              treatments.length
          )
        : 0;
    return {
      total: treatments.length,
      liveCount,
      avgPrice,
    };
  }, [treatments]);

  const filteredTreatments = useMemo(() => {
    return treatments.filter((t) => {
      const matchesCat =
        selectedCategory === 'all' || t.category === selectedCategory;
      const matchesOnline = !onlyLiveOnline || t.onlineBooking;
      const q = filterText.trim().toLowerCase();
      const matchesText =
        !q ||
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q);
      return matchesCat && matchesOnline && matchesText;
    });
  }, [treatments, selectedCategory, onlyLiveOnline, filterText]);

  const toggleOnlineBooking = async (id) => {
    const target = treatments.find((t) => t.id === id);
    const nextVal = target ? !target.onlineBooking : true;
    setTreatments((prev) =>
      prev.map((t) => (t.id === id ? { ...t, onlineBooking: nextVal } : t))
    );
    await updateService(id, { online_booking: nextVal });
  };

  const handleDelete = async (id) => {
    setTreatments((prev) => prev.filter((t) => t.id !== id));
    await deleteService(id);
  };

  const openAddModal = () => {
    setEditingId(null);
    setFormState({
      name: '',
      description: '',
      category: 'Hair & Color',
      duration: 60,
      price: 8500,
      onlineBooking: true,
    });
    setModalOpen(true);
  };

  const openEditModal = (treatment) => {
    setEditingId(treatment.id);
    setFormState({
      name: treatment.name,
      description: treatment.description,
      category: treatment.category,
      duration: treatment.duration,
      price: treatment.price,
      onlineBooking: treatment.onlineBooking,
    });
    setModalOpen(true);
  };

  const handleSaveTreatment = async (e) => {
    e.preventDefault();
    if (!formState.name.trim()) return;
    setSavingTreatment(true);

    const catMap = {
      'Hair & Color': { id: 'hair', name: 'Hair & Botanical Color' },
      Facials: { id: 'facials', name: 'Holistic Facials' },
      Nails: { id: 'nails', name: 'Nails & Hand Spa' },
      Bridal: { id: 'bridal', name: 'Bridal Packages' },
      Waxing: { id: 'waxing', name: 'Waxing & Threading' },
    };
    const mappedCat = catMap[formState.category] || catMap['Hair & Color'];

    if (editingId) {
      await updateService(editingId, {
        name: formState.name.trim(),
        description: formState.description.trim(),
        category_id: mappedCat.id,
        category_name: mappedCat.name,
        duration_mins: Number(formState.duration),
        price_lkr: Number(formState.price),
        online_booking: formState.onlineBooking,
      });
      setTreatments((prev) =>
        prev.map((t) =>
          t.id === editingId
            ? {
                ...t,
                ...formState,
                duration: Number(formState.duration),
                price: Number(formState.price),
              }
            : t
        )
      );
    } else {
      const slug = `${formState.name
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')}-${Date.now().toString().slice(-4)}`;
      const { data } = await createService({
        slug,
        name: formState.name.trim(),
        description: formState.description.trim(),
        category_id: mappedCat.id,
        category_name: mappedCat.name,
        duration_mins: Number(formState.duration),
        price_lkr: Number(formState.price),
        online_booking: formState.onlineBooking,
      });
      setTreatments((prev) => [
        {
          id: data?.id || `tr-${Date.now()}`,
          ...formState,
          duration: Number(formState.duration),
          price: Number(formState.price),
        },
        ...prev,
      ]);
    }
    setSavingTreatment(false);
    setModalOpen(false);
  };

  const cycleUploadStatus = (id) => {
    setUploads((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              status:
                item.status === 'Active on Web'
                  ? 'Featured Hero'
                  : 'Active on Web',
            }
          : item
      )
    );
  };

  const handleLookbookFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const previewUrl = URL.createObjectURL(file);
    setUploadForm((prev) => ({ ...prev, file, previewUrl }));
  };

  const handleSaveLookbookUpload = async (e) => {
    e.preventDefault();
    if (!uploadForm.title.trim()) return;
    setUploadingPhoto(true);

    let imageUrl = uploadForm.previewUrl || wallpaperSanctuary;
    if (uploadForm.file) {
      const { url } = await uploadLookbookImage(uploadForm.file, 'lookbook');
      if (url) {
        imageUrl = url;
        await createLookbookItem({
          title: uploadForm.title.trim(),
          category: 'Hair & Color',
          specialist_name: uploadForm.specialist,
          image_url: url,
          featured: uploadForm.status === 'Featured Hero',
        });
      }
    }

    const initials = uploadForm.specialist
      .split(' ')
      .map((w) => w[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();

    setUploads((prev) => [
      {
        id: `lb-${Date.now()}`,
        title: uploadForm.title.trim(),
        linkedService: uploadForm.linkedService,
        specialist: uploadForm.specialist,
        initials,
        initialsClass: 'bg-[#253026] text-[#EFE0C6]',
        status: uploadForm.status,
        image: imageUrl,
      },
      ...prev,
    ]);

    setUploadForm({
      title: '',
      linkedService: treatments[0]?.name || 'Organic Botanical Balayage',
      specialist: 'Elena Rostova',
      status: 'Active on Web',
      file: null,
      previewUrl: '',
    });
    setUploadingPhoto(false);
    setUploadModalOpen(false);
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* ================= EXECUTIVE HEADER + MENU METRICS ================= */}
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <p className="text-[10.5px] font-semibold tracking-[0.22em] text-[#7A766E] uppercase">
            Treatment Atelier &amp; Menu
          </p>
          <h1 className="mt-1 font-serif text-[30px] font-normal tracking-tight text-[#222B23] sm:text-[34px]">
            Services &amp; Pricing
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Compact KPI Strip */}
          <div className="flex flex-wrap items-center gap-2.5 rounded-full border border-[#E6E2DA] bg-[#FAF8F5] px-4 py-2 text-[11.5px] shadow-2xs">
            <span className="inline-flex items-center gap-1.5 font-medium text-[#222B23]">
              <Sparkles className="h-3.5 w-3.5 text-[#B78B43]" />
              {metrics.total} Rituals
            </span>
            <span className="text-[#DCD7CE]">•</span>
            <span className="inline-flex items-center gap-1.5 font-medium text-[#285431]">
              <span className="h-2 w-2 rounded-full bg-[#4E8B57]" />
              {metrics.liveCount} Live Online
            </span>
            <span className="text-[#DCD7CE]">•</span>
            <span className="inline-flex items-center gap-1 font-medium text-[#6C6961]">
              Avg.{' '}
              <strong className="font-serif text-[13.5px] font-semibold text-[#222B23]">
                LKR {metrics.avgPrice.toLocaleString('en-US')}
              </strong>
            </span>
          </div>

          <button
            type="button"
            onClick={openAddModal}
            className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-[#253026] px-5 py-2.5 text-[12px] font-medium tracking-wide text-[#FAF8F5] shadow-sm transition-all hover:bg-[#344335]"
          >
            <Plus className="h-3.5 w-3.5 text-[#EFE0C6]" strokeWidth={2.4} />
            <span>Add New Treatment</span>
          </button>
        </div>
      </div>

      {/* ================= ELEVATED MODE & FILTER TOOLBAR ================= */}
      <div className="flex flex-col gap-3.5 rounded-[22px] border border-[#E6E2DA] bg-[#FAF8F5] p-3.5 shadow-2xs">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Mode Switcher */}
          <div className="inline-flex rounded-full border border-[#E6E2DA] bg-[#F3F0EA] p-1 text-[12px]">
            <button
              type="button"
              onClick={() => setActiveMainTab('menu')}
              className={`cursor-pointer rounded-full px-5 py-1.5 font-medium transition-all ${
                activeMainTab === 'menu'
                  ? 'bg-[#253026] text-[#FAF8F5] shadow-xs'
                  : 'text-[#57544E] hover:text-[#222B23]'
              }`}
            >
              Service Menu &amp; Pricing
            </button>
            <button
              type="button"
              onClick={() => setActiveMainTab('lookbook')}
              className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full px-5 py-1.5 font-medium transition-all ${
                activeMainTab === 'lookbook'
                  ? 'bg-[#253026] text-[#FAF8F5] shadow-xs'
                  : 'text-[#57544E] hover:text-[#222B23]'
              }`}
            >
              <ImageIcon className="h-3.5 w-3.5" />
              <span>Lookbook Gallery</span>
              <span
                className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${
                  activeMainTab === 'lookbook'
                    ? 'bg-[#EFE0C6] text-[#222B23]'
                    : 'bg-[#FAF8F5] text-[#6C6961]'
                }`}
              >
                {uploads.length}
              </span>
            </button>
          </div>

          {/* Search + Live-Only Filter (Menu mode) */}
          {activeMainTab === 'menu' ? (
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setOnlyLiveOnline((v) => !v)}
                className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-3.5 py-2 text-[11.5px] font-medium transition-colors ${
                  onlyLiveOnline
                    ? 'border-[#253026] bg-[#253026] text-[#FAF8F5]'
                    : 'border-[#E6E2DA] bg-[#F3F0EA] text-[#57544E] hover:bg-[#E8E4DC]'
                }`}
              >
                {onlyLiveOnline ? (
                  <Eye className="h-3.5 w-3.5 text-[#EFE0C6]" />
                ) : (
                  <EyeOff className="h-3.5 w-3.5 text-[#7A766E]" />
                )}
                <span>Online Only</span>
              </button>

              <div className="relative w-full sm:w-64">
                <Search className="pointer-events-none absolute top-1/2 left-3.5 h-3.5 w-3.5 -translate-y-1/2 text-[#8A867E]" />
                <input
                  type="text"
                  value={filterText}
                  onChange={(e) => setFilterText(e.target.value)}
                  placeholder="Search treatments or botanicals..."
                  className="w-full rounded-full border border-[#E6E2DA] bg-[#F3F0EA] py-2 pr-4 pl-9 text-[12px] text-[#222B23] placeholder:text-[#928D84] focus:border-[#253026] focus:bg-[#FAF8F5] focus:outline-none"
                />
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setUploadModalOpen(true)}
              className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-[#E6E2DA] bg-[#F3F0EA] px-4 py-2 text-[12px] font-medium text-[#222B23] transition-colors hover:bg-[#E8E4DC]"
            >
              <Upload className="h-3.5 w-3.5 text-[#4A5B4B]" />
              <span>Upload Lookbook Photo</span>
            </button>
          )}
        </div>

        {/* Category Filter Pills (Menu mode) */}
        {activeMainTab === 'menu' && (
          <div className="flex flex-wrap items-center gap-2 border-t border-[#EFECE5] pt-3">
            {CATEGORY_FILTERS.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              const count = categoryCounts[cat.id] ?? 0;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`inline-flex cursor-pointer items-center gap-2 rounded-full px-4 py-1.5 text-[12px] font-medium transition-all ${
                    isSelected
                      ? 'bg-[#253026] text-[#FAF8F5] shadow-xs'
                      : 'bg-[#F3F0EA] text-[#57544E] hover:bg-[#E8E4DC]'
                  }`}
                >
                  <span>{cat.label}</span>
                  <span
                    className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${
                      isSelected
                        ? 'bg-[#EFE0C6] text-[#222B23]'
                        : 'bg-[#FAF8F5] text-[#6C6961]'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* ================= ACTIVE TREATMENT CATALOG TABLE ================= */}
      {activeMainTab === 'menu' && (
        <section className="overflow-hidden rounded-[24px] border border-[#E6E2DA] bg-[#FAF8F5] shadow-xs">
          {/* Catalog Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#EAE6DE] bg-[#F5F2EC] px-6 py-4">
            <div>
              <h2 className="font-serif text-[21px] font-semibold text-[#222B23]">
                Active Treatment Catalog
              </h2>
              <p className="mt-0.5 text-[11.5px] text-[#7A766E]">
                Manage luxury sanctuary offerings, LKR pricing, and live website
                booking availability.
              </p>
            </div>
            <span className="rounded-full bg-[#EAE5DC] px-3 py-1 text-[11px] font-semibold text-[#57544E]">
              Showing {filteredTreatments.length} of {treatments.length}
            </span>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[740px] border-collapse text-left">
              <thead>
                <tr className="border-b border-[#EFECE5] bg-[#FAF8F5] text-[10px] font-semibold tracking-[0.16em] text-[#8A867E] uppercase">
                  <th className="py-3.5 pr-4 pl-6">Treatment Name</th>
                  <th className="px-4 py-3.5">Category</th>
                  <th className="px-4 py-3.5">Duration</th>
                  <th className="px-4 py-3.5">Price (LKR)</th>
                  <th className="px-4 py-3.5 text-center">Online Booking</th>
                  <th className="py-3.5 pr-6 pl-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EFECE5]">
                {filteredTreatments.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="py-12 text-center text-xs text-[#7A766E]"
                    >
                      <Tag className="mx-auto mb-2 h-5 w-5 text-[#C8A870]" />
                      No treatments match your current filter.
                    </td>
                  </tr>
                ) : (
                  filteredTreatments.map((item) => (
                    <tr
                      key={item.id}
                      className="group transition-colors hover:bg-[#F5F2EC]/70"
                    >
                      <td className="py-4 pr-4 pl-6">
                        <p className="font-serif text-[16.5px] font-semibold text-[#222B23]">
                          {item.name}
                        </p>
                        <p className="mt-0.5 max-w-md text-[11.5px] leading-relaxed text-[#7A766E]">
                          {item.description}
                        </p>
                      </td>

                      <td className="px-4 py-4">
                        <span
                          className={`inline-block rounded-full px-3 py-1 text-[10.5px] font-semibold ${
                            CATEGORY_BADGE_STYLES[item.category] ||
                            'bg-[#ECEAE4] text-[#57544E]'
                          }`}
                        >
                          {item.category}
                        </span>
                      </td>

                      <td className="px-4 py-4">
                        <span className="inline-flex items-center gap-1.5 text-[12px] font-medium text-[#57544E]">
                          <Clock className="h-3.5 w-3.5 text-[#8A867E]" />
                          {item.duration} mins
                        </span>
                      </td>

                      <td className="px-4 py-4 font-serif text-[17px] font-semibold text-[#222B23]">
                        LKR {Number(item.price).toLocaleString('en-US')}
                      </td>

                      <td className="px-4 py-4 text-center">
                        <div className="inline-flex items-center gap-2">
                          <button
                            type="button"
                            role="switch"
                            aria-checked={item.onlineBooking}
                            onClick={() => toggleOnlineBooking(item.id)}
                            className={`relative inline-flex h-5.5 w-10 cursor-pointer items-center rounded-full transition-colors ${
                              item.onlineBooking
                                ? 'bg-[#253026]'
                                : 'bg-[#DDD8CE]'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full shadow-xs transition-transform ${
                                item.onlineBooking
                                  ? 'translate-x-5 bg-[#EFE0C6]'
                                  : 'translate-x-1 bg-white'
                              }`}
                            />
                          </button>
                          <span
                            className={`w-10 text-left text-[10.5px] font-semibold ${
                              item.onlineBooking
                                ? 'text-[#285431]'
                                : 'text-[#9A958C]'
                            }`}
                          >
                            {item.onlineBooking ? 'Live' : 'Hidden'}
                          </span>
                        </div>
                      </td>

                      <td className="py-4 pr-6 pl-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => openEditModal(item)}
                            aria-label={`Edit ${item.name}`}
                            className="cursor-pointer rounded-full p-2 text-[#5F5C55] transition-colors hover:bg-[#EAE5DC] hover:text-[#222B23]"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(item.id)}
                            aria-label={`Delete ${item.name}`}
                            className="cursor-pointer rounded-full p-2 text-[#7A766E] transition-colors hover:bg-[#F4E1DE] hover:text-[#B64B42]"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* ================= FEATURED LOOKBOOK UPLOADS ================= */}
      <section className="space-y-4">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p className="text-[10px] font-semibold tracking-[0.2em] text-[#7A766E] uppercase">
              Visual Portfolio Sync
            </p>
            <h2 className="mt-0.5 font-serif text-[23px] font-normal text-[#222B23]">
              Featured Lookbook Uploads
            </h2>
          </div>

          <button
            type="button"
            onClick={() => setUploadModalOpen(true)}
            className="inline-flex cursor-pointer items-center gap-2 self-start rounded-full border border-[#E6E2DA] bg-[#FAF8F5] px-4 py-2 text-[12px] font-medium text-[#222B23] shadow-2xs transition-colors hover:bg-[#F3F0EA] sm:self-auto"
          >
            <Upload className="h-3.5 w-3.5 text-[#4A5B4B]" />
            <span>Upload New Photo</span>
          </button>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {uploads.map((item) => {
            const isHero = item.status === 'Featured Hero';
            return (
              <article
                key={item.id}
                className="group overflow-hidden rounded-[22px] border border-[#E6E2DA] bg-[#FAF8F5] shadow-2xs transition-all hover:shadow-md"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#E6E2DA]">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span
                    className={`absolute top-3 right-3 rounded-full px-3 py-1 text-[10px] font-semibold shadow-xs backdrop-blur-xs ${
                      isHero
                        ? 'bg-[#253026]/90 text-[#EFE0C6]'
                        : 'bg-[#FAF8F5]/95 text-[#222B23]'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>

                <div className="p-5">
                  <h3 className="font-serif text-[18px] font-semibold text-[#222B23]">
                    {item.title}
                  </h3>
                  <p className="mt-1 truncate text-[11.5px] text-[#7A766E]">
                    Linked Service: {item.linkedService}
                  </p>

                  <div className="mt-4 flex items-center justify-between border-t border-[#EFECE5] pt-3.5">
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-semibold ${item.initialsClass}`}
                      >
                        {item.initials}
                      </span>
                      <span className="text-[11.5px] font-medium text-[#57544E]">
                        {item.specialist}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => cycleUploadStatus(item.id)}
                      className="inline-flex cursor-pointer items-center gap-1 rounded-full bg-[#F3F0EA] px-3 py-1 text-[11px] font-semibold text-[#253026] transition-colors hover:bg-[#253026] hover:text-[#EFE0C6]"
                    >
                      <span>{isHero ? 'Set Active' : 'Feature'}</span>
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* ================= ADD / EDIT TREATMENT MODAL ================= */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#181E19]/60 p-4 backdrop-blur-xs"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="w-full max-w-lg overflow-hidden rounded-[24px] border border-[#E5E1D8] bg-[#FAF8F5] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between bg-[#253026] px-6 py-5 text-[#FAF8F5]">
              <div>
                <p className="text-[10px] font-semibold tracking-[0.2em] text-[#EFE0C6] uppercase">
                  Sanctuary Service Menu
                </p>
                <h3 className="mt-0.5 font-serif text-2xl font-normal">
                  {editingId ? 'Edit Treatment' : 'Add New Treatment'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="cursor-pointer rounded-full p-1.5 text-[#A8B8AA] transition-colors hover:bg-white/10 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveTreatment} className="space-y-4 p-6">
              <div>
                <label className="block text-[11.5px] font-medium text-[#57544E]">
                  Treatment Name *
                </label>
                <input
                  type="text"
                  required
                  value={formState.name}
                  onChange={(e) =>
                    setFormState({ ...formState, name: e.target.value })
                  }
                  placeholder="e.g. Organic Botanical Hair Glossing"
                  className="mt-1.5 w-full rounded-xl border border-[#E2DDD4] bg-[#F6F4EF] px-3.5 py-2.5 text-sm text-[#222B23] focus:border-[#253026] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11.5px] font-medium text-[#57544E]">
                  Short Description *
                </label>
                <textarea
                  rows={2}
                  required
                  value={formState.description}
                  onChange={(e) =>
                    setFormState({ ...formState, description: e.target.value })
                  }
                  placeholder="Key botanical ingredients & restorative benefits"
                  className="mt-1.5 w-full resize-none rounded-xl border border-[#E2DDD4] bg-[#F6F4EF] px-3.5 py-2 text-sm text-[#222B23] focus:border-[#253026] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11.5px] font-medium text-[#57544E]">
                    Category
                  </label>
                  <select
                    value={formState.category}
                    onChange={(e) =>
                      setFormState({ ...formState, category: e.target.value })
                    }
                    className="mt-1.5 w-full rounded-xl border border-[#E2DDD4] bg-[#F6F4EF] px-2.5 py-2.5 text-xs text-[#222B23] focus:border-[#253026] focus:outline-none"
                  >
                    <option value="Hair & Color">Hair &amp; Color</option>
                    <option value="Facials">Facials</option>
                    <option value="Nails">Nails</option>
                    <option value="Bridal">Bridal</option>
                    <option value="Waxing">Waxing</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11.5px] font-medium text-[#57544E]">
                    Duration (mins)
                  </label>
                  <input
                    type="number"
                    min={15}
                    step={15}
                    required
                    value={formState.duration}
                    onChange={(e) =>
                      setFormState({ ...formState, duration: e.target.value })
                    }
                    className="mt-1.5 w-full rounded-xl border border-[#E2DDD4] bg-[#F6F4EF] px-3 py-2.5 text-xs text-[#222B23] focus:border-[#253026] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11.5px] font-medium text-[#57544E]">
                    Price (LKR)
                  </label>
                  <input
                    type="number"
                    min={500}
                    step={500}
                    required
                    value={formState.price}
                    onChange={(e) =>
                      setFormState({ ...formState, price: e.target.value })
                    }
                    className="mt-1.5 w-full rounded-xl border border-[#E2DDD4] bg-[#F6F4EF] px-3 py-2.5 text-xs text-[#222B23] focus:border-[#253026] focus:outline-none"
                  />
                </div>
              </div>

              <label className="flex cursor-pointer items-center justify-between rounded-xl border border-[#EAE6DE] bg-[#F5F2EC] px-4 py-3 text-xs font-medium text-[#222B23]">
                <span>Visible for Online Website Booking</span>
                <input
                  type="checkbox"
                  checked={formState.onlineBooking}
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      onlineBooking: e.target.checked,
                    })
                  }
                  className="h-4 w-4 accent-[#253026]"
                />
              </label>

              <div className="flex justify-end gap-2.5 border-t border-[#ECE8E0] pt-4">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="cursor-pointer rounded-full border border-[#E2DDD4] px-5 py-2 text-xs font-medium text-[#57544E] hover:bg-[#EFECE6]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingTreatment}
                  className="cursor-pointer rounded-full bg-[#253026] px-6 py-2 text-xs font-medium text-[#FAF8F5] shadow-xs hover:bg-[#344335] disabled:opacity-60"
                >
                  {savingTreatment
                    ? 'Saving...'
                    : editingId
                      ? 'Save Changes'
                      : 'Create Treatment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= UPLOAD LOOKBOOK PHOTO MODAL ================= */}
      {uploadModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#181E19]/60 p-4 backdrop-blur-xs"
          onClick={() => setUploadModalOpen(false)}
        >
          <div
            className="w-full max-w-md overflow-hidden rounded-[24px] border border-[#E5E1D8] bg-[#FAF8F5] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between bg-[#253026] px-6 py-5 text-[#FAF8F5]">
              <div>
                <p className="text-[10px] font-semibold tracking-[0.2em] text-[#EFE0C6] uppercase">
                  Lookbook Archive
                </p>
                <h3 className="mt-0.5 font-serif text-2xl font-normal">
                  Upload Portfolio Photo
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setUploadModalOpen(false)}
                className="cursor-pointer rounded-full p-1.5 text-[#A8B8AA] hover:bg-white/10 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveLookbookUpload} className="space-y-4 p-6">
              <div>
                <label className="block text-[11.5px] font-medium text-[#57544E]">
                  Look Title *
                </label>
                <input
                  type="text"
                  required
                  value={uploadForm.title}
                  onChange={(e) =>
                    setUploadForm({ ...uploadForm, title: e.target.value })
                  }
                  placeholder="e.g. Sun-Kissed Botanical Waves"
                  className="mt-1.5 w-full rounded-xl border border-[#E2DDD4] bg-[#F6F4EF] px-3.5 py-2.5 text-sm text-[#222B23] focus:border-[#253026] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11.5px] font-medium text-[#57544E]">
                    Linked Service
                  </label>
                  <select
                    value={uploadForm.linkedService}
                    onChange={(e) =>
                      setUploadForm({
                        ...uploadForm,
                        linkedService: e.target.value,
                      })
                    }
                    className="mt-1.5 w-full rounded-xl border border-[#E2DDD4] bg-[#F6F4EF] px-2.5 py-2.5 text-xs text-[#222B23] focus:border-[#253026] focus:outline-none"
                  >
                    {treatments.map((t) => (
                      <option key={t.id} value={t.name}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11.5px] font-medium text-[#57544E]">
                    Lead Specialist
                  </label>
                  <select
                    value={uploadForm.specialist}
                    onChange={(e) =>
                      setUploadForm({
                        ...uploadForm,
                        specialist: e.target.value,
                      })
                    }
                    className="mt-1.5 w-full rounded-xl border border-[#E2DDD4] bg-[#F6F4EF] px-2.5 py-2.5 text-xs text-[#222B23] focus:border-[#253026] focus:outline-none"
                  >
                    <option value="Elena Rostova">Elena Rostova</option>
                    <option value="Amara Thorne">Amara Thorne</option>
                    <option value="Julian Vance">Julian Vance</option>
                    <option value="Clara Vance">Clara Vance</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11.5px] font-medium text-[#57544E]">
                  Photograph (Optional — uploads to Supabase Storage)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLookbookFileChange}
                  className="mt-1.5 block w-full cursor-pointer rounded-xl border border-dashed border-[#CFC9BE] bg-[#F6F4EF] p-3 text-xs text-[#57544E] file:mr-3 file:rounded-full file:border-0 file:bg-[#253026] file:px-3 file:py-1 file:text-xs file:font-medium file:text-[#FAF8F5]"
                />
              </div>

              <div className="flex justify-end gap-2.5 border-t border-[#ECE8E0] pt-4">
                <button
                  type="button"
                  onClick={() => setUploadModalOpen(false)}
                  className="cursor-pointer rounded-full border border-[#E2DDD4] px-5 py-2 text-xs font-medium text-[#57544E] hover:bg-[#EFECE6]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploadingPhoto}
                  className="cursor-pointer rounded-full bg-[#253026] px-6 py-2 text-xs font-medium text-[#FAF8F5] shadow-xs hover:bg-[#344335] disabled:opacity-60"
                >
                  {uploadingPhoto ? 'Uploading...' : 'Publish to Lookbook'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
