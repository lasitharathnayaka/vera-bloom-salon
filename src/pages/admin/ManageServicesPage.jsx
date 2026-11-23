import { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  ListFilter,
  Pencil,
  Plus,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import {
  createService,
  deleteService,
  fetchServices,
  updateService,
} from '../../services/salonService';

import heroPortrait from '../../assets/hero-portrait.jpg';
import ritualSkin from '../../assets/ritual-skin.jpg';
import bridalHero from '../../assets/bridal-hero.jpg';

const CATEGORY_FILTERS = [
  { id: 'all', label: 'All Services' },
  { id: 'Hair & Color', label: 'Hair & Botanical Color' },
  { id: 'Facials', label: 'Holistic Facials' },
  { id: 'Nails', label: 'Nails & Hand Spa' },
  { id: 'Bridal', label: 'Bridal Packages' },
  { id: 'Waxing', label: 'Waxing & Care' },
];

const CATEGORY_BADGE_STYLES = {
  'Hair & Color': 'bg-[#DFE4DF] text-[#4A5B4B]',
  Facials: 'bg-[#EFE5D1] text-[#7A6444]',
  Bridal: 'bg-[#E7E4DD] text-[#57544E]',
  Nails: 'bg-[#EFE5D1] text-[#7A6444]',
  Waxing: 'bg-[#E7E4DD] text-[#57544E]',
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
    initials: 'EL',
    initialsClass: 'bg-[#4A5B4B] text-[#FAF8F5]',
    status: 'Active on Web',
    image: heroPortrait,
  },
  {
    id: 'lb-2',
    title: 'Botanical Hydration Ritual',
    linkedService: 'Signature Sanctuary Facial',
    specialist: 'Maya Chen',
    initials: 'MC',
    initialsClass: 'bg-[#EFE0C6] text-[#7A6444]',
    status: 'Active on Web',
    image: ritualSkin,
  },
  {
    id: 'lb-3',
    title: 'Botanical Crown Updo',
    linkedService: 'Royal Bridal Hair Suite',
    specialist: "Sophie O'Connor",
    initials: 'SO',
    initialsClass: 'bg-[#4A5B4B] text-[#FAF8F5]',
    status: 'Featured Hero',
    image: bridalHero,
  },
];

export default function ManageServicesPage() {
  const [activeMainTab, setActiveMainTab] = useState('menu');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filterText, setFilterText] = useState('');
  const [treatments, setTreatments] = useState(INITIAL_TREATMENTS);
  const [uploads, setUploads] = useState(INITIAL_LOOKBOOK_UPLOADS);

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

  // Modal state for Add / Edit Treatment
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formState, setFormState] = useState({
    name: '',
    description: '',
    category: 'Hair & Color',
    duration: 60,
    price: 8500,
    onlineBooking: true,
  });

  const filteredTreatments = useMemo(() => {
    return treatments.filter((t) => {
      const matchesCat =
        selectedCategory === 'all' || t.category === selectedCategory;
      const q = filterText.trim().toLowerCase();
      const matchesText =
        !q ||
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q);
      return matchesCat && matchesText;
    });
  }, [treatments, selectedCategory, filterText]);

  const toggleOnlineBooking = async (id) => {
    const target = treatments.find((t) => t.id === id);
    const nextVal = target ? !target.onlineBooking : true;
    setTreatments((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, onlineBooking: nextVal } : t
      )
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

  return (
    <div className="mx-auto max-w-6xl space-y-7">
      {/* ================= TOP MODE TABS + ADD CTA ================= */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="inline-flex rounded-xl border border-[#E6E2DA] bg-[#EFECE6] p-1">
          <button
            type="button"
            onClick={() => setActiveMainTab('menu')}
            className={`cursor-pointer rounded-lg px-5 py-2 text-[12.5px] font-medium transition-colors ${
              activeMainTab === 'menu'
                ? 'bg-[#4A5B4B] text-[#FAF8F5] shadow-xs'
                : 'text-[#4A4741] hover:text-[#2A2927]'
            }`}
          >
            Service Menu &amp; Pricing
          </button>
          <button
            type="button"
            onClick={() => setActiveMainTab('lookbook')}
            className={`cursor-pointer rounded-lg px-5 py-2 text-[12.5px] font-medium transition-colors ${
              activeMainTab === 'lookbook'
                ? 'bg-[#4A5B4B] text-[#FAF8F5] shadow-xs'
                : 'text-[#4A4741] hover:text-[#2A2927]'
            }`}
          >
            Lookbook Gallery Manager
          </button>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-[#4A5B4B] px-5 py-2.5 text-[12px] font-medium tracking-wide text-[#FAF8F5] shadow-xs transition-colors hover:bg-[#3B4A3C]"
        >
          <Plus className="h-3.5 w-3.5" strokeWidth={2.2} />
          <span>Add New Treatment</span>
        </button>
      </div>

      {/* ================= CATEGORY FILTER PILLS ================= */}
      {activeMainTab === 'menu' && (
        <>
          <div className="flex flex-wrap items-center gap-2.5">
            {CATEGORY_FILTERS.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`cursor-pointer rounded-lg px-4 py-2 text-[12px] font-medium transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-[#4A5B4B] text-[#FAF8F5] shadow-2xs'
                    : 'bg-[#F1EFEA] text-[#4A4741] hover:bg-[#E5E1D8]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* ================= ACTIVE TREATMENT CATALOG TABLE ================= */}
          <section className="rounded-2xl border border-[#ECE8E0] bg-[#F2F0EB] p-6">
            {/* Table Header Row */}
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h1 className="font-serif text-[21px] font-semibold text-[#2A2927]">
                  Active Treatment Catalog
                </h1>
                <p className="mt-0.5 text-[11.5px] text-[#7A766E]">
                  Manage your luxury service offerings, pricing, and live
                  website visibility.
                </p>
              </div>

              <div className="relative w-full sm:w-56">
                <ListFilter className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#8A867E]" />
                <input
                  type="text"
                  value={filterText}
                  onChange={(e) => setFilterText(e.target.value)}
                  placeholder="Filter treatments..."
                  className="w-full rounded-lg border border-[#E5E1D8] bg-[#FAF8F5] py-2 pl-9 pr-3 text-[12px] text-[#2A2927] placeholder:text-[#9A958C] focus:border-[#4A5B4B] focus:outline-none"
                />
              </div>
            </div>

            {/* Table */}
            <div className="mt-6 overflow-x-auto">
              <table className="w-full min-w-[700px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-[#E5E1D8] text-[9.5px] font-semibold tracking-[0.16em] text-[#8A867E] uppercase">
                    <th className="pb-3 pr-4">Treatment Name</th>
                    <th className="pb-3 px-4">Category</th>
                    <th className="pb-3 px-4">Duration</th>
                    <th className="pb-3 px-4">Price (LKR)</th>
                    <th className="pb-3 px-4 text-center">Online Booking</th>
                    <th className="pb-3 pl-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8E4DC]">
                  {filteredTreatments.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="py-8 text-center text-xs text-[#7A766E]"
                      >
                        No treatments match your filter.
                      </td>
                    </tr>
                  ) : (
                    filteredTreatments.map((item) => (
                      <tr
                        key={item.id}
                        className="transition-colors hover:bg-[#FAF8F5]/60"
                      >
                        <td className="py-4 pr-4">
                          <p className="font-serif text-[15.5px] font-semibold text-[#2A2927]">
                            {item.name}
                          </p>
                          <p className="mt-0.5 text-[11px] text-[#7A766E]">
                            {item.description}
                          </p>
                        </td>

                        <td className="px-4 py-4">
                          <span
                            className={`inline-block rounded-md px-2.5 py-1 text-[10.5px] font-semibold ${
                              CATEGORY_BADGE_STYLES[item.category] ||
                              'bg-[#E7E4DD] text-[#57544E]'
                            }`}
                          >
                            {item.category}
                          </span>
                        </td>

                        <td className="px-4 py-4 text-[12px] text-[#4A4741]">
                          {item.duration} mins
                        </td>

                        <td className="px-4 py-4 font-serif text-[15px] font-semibold text-[#2A2927]">
                          Rs. {item.price.toLocaleString('en-US')}
                        </td>

                        <td className="px-4 py-4 text-center">
                          <button
                            type="button"
                            role="switch"
                            aria-checked={item.onlineBooking}
                            onClick={() => toggleOnlineBooking(item.id)}
                            className={`relative inline-flex h-5 w-9 cursor-pointer items-center rounded-full transition-colors ${
                              item.onlineBooking
                                ? 'bg-[#4A5B4B]'
                                : 'bg-[#DCD8CF]'
                            }`}
                          >
                            <span
                              className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-xs transition-transform ${
                                item.onlineBooking
                                  ? 'translate-x-4.5'
                                  : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </td>

                        <td className="py-4 pl-4 text-right">
                          <div className="inline-flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => openEditModal(item)}
                              aria-label={`Edit ${item.name}`}
                              className="cursor-pointer rounded-md p-1.5 text-[#5F5C55] transition-colors hover:bg-[#E7E4DD] hover:text-[#2A2927]"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(item.id)}
                              aria-label={`Delete ${item.name}`}
                              className="cursor-pointer rounded-md p-1.5 text-[#7A766E] transition-colors hover:bg-[#F4E1DE] hover:text-[#B64B42]"
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
        </>
      )}

      {/* ================= FEATURED LOOKBOOK UPLOADS ================= */}
      <section className="space-y-5">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h2 className="font-serif text-[21px] font-semibold text-[#2A2927]">
              Featured Lookbook Uploads
            </h2>
            <p className="mt-0.5 text-[11.5px] text-[#7A766E]">
              Sync portfolio photographs directly with bookable services and
              assign lead specialists.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setActiveMainTab('lookbook')}
            className="inline-flex cursor-pointer items-center gap-2 self-start rounded-lg border border-[#E4E0D8] bg-[#F2EFE9] px-4 py-2 text-[12px] font-medium text-[#2A2927] transition-colors hover:bg-[#E7E4DD] sm:self-auto"
          >
            <Upload className="h-3.5 w-3.5 text-[#4A5B4B]" />
            <span>Upload New Photo</span>
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {uploads.map((item) => (
            <article
              key={item.id}
              className="overflow-hidden rounded-2xl border border-[#ECE8E0] bg-[#F2F0EB] shadow-2xs transition-all hover:shadow-md"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#E6E2DA]">
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-full w-full object-cover"
                />
                <span className="absolute right-3 top-3 rounded-md bg-[#FAF8F5]/95 px-2.5 py-1 text-[10px] font-medium text-[#2A2927] shadow-2xs backdrop-blur-xs">
                  {item.status}
                </span>
              </div>

              <div className="p-5">
                <h3 className="font-serif text-[17px] font-semibold text-[#2A2927]">
                  {item.title}
                </h3>
                <p className="mt-0.5 text-[11px] text-[#7A766E]">
                  Linked Service: {item.linkedService}
                </p>

                <div className="mt-4 flex items-center justify-between border-t border-[#E5E1D8] pt-3.5">
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-[9.5px] font-semibold ${item.initialsClass}`}
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
                    className="inline-flex cursor-pointer items-center gap-1 text-[11.5px] font-semibold text-[#4A5B4B] transition-colors hover:text-[#2A2927]"
                  >
                    <span>Edit Tag</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ================= ADD / EDIT TREATMENT MODAL ================= */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#1F1E1C]/50 p-4 backdrop-blur-xs"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-[#E5E1D8] bg-[#FAF8F5] p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#ECE8E0] pb-3">
              <h3 className="font-serif text-xl font-semibold text-[#2A2927]">
                {editingId ? 'Edit Treatment' : 'Add New Treatment'}
              </h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="cursor-pointer rounded p-1 text-[#7A766E] hover:bg-[#EFECE6]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveTreatment} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#57544E]">
                  Treatment Name
                </label>
                <input
                  type="text"
                  required
                  value={formState.name}
                  onChange={(e) =>
                    setFormState({ ...formState, name: e.target.value })
                  }
                  placeholder="e.g. Organic Botanical Hair Glossing"
                  className="mt-1.5 w-full rounded-lg border border-[#E2DDD4] bg-[#F6F4EF] px-3.5 py-2 text-sm text-[#2A2927] focus:border-[#4A5B4B] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#57544E]">
                  Short Description
                </label>
                <input
                  type="text"
                  required
                  value={formState.description}
                  onChange={(e) =>
                    setFormState({ ...formState, description: e.target.value })
                  }
                  placeholder="Key botanical ingredients & benefits"
                  className="mt-1.5 w-full rounded-lg border border-[#E2DDD4] bg-[#F6F4EF] px-3.5 py-2 text-sm text-[#2A2927] focus:border-[#4A5B4B] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#57544E]">
                    Category
                  </label>
                  <select
                    value={formState.category}
                    onChange={(e) =>
                      setFormState({ ...formState, category: e.target.value })
                    }
                    className="mt-1.5 w-full rounded-lg border border-[#E2DDD4] bg-[#F6F4EF] px-2.5 py-2 text-xs text-[#2A2927] focus:border-[#4A5B4B] focus:outline-none"
                  >
                    <option value="Hair & Color">Hair &amp; Color</option>
                    <option value="Facials">Facials</option>
                    <option value="Nails">Nails</option>
                    <option value="Bridal">Bridal</option>
                    <option value="Waxing">Waxing</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#57544E]">
                    Duration (m)
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
                    className="mt-1.5 w-full rounded-lg border border-[#E2DDD4] bg-[#F6F4EF] px-3 py-2 text-xs text-[#2A2927] focus:border-[#4A5B4B] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#57544E]">
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
                    className="mt-1.5 w-full rounded-lg border border-[#E2DDD4] bg-[#F6F4EF] px-3 py-2 text-xs text-[#2A2927] focus:border-[#4A5B4B] focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="cursor-pointer rounded-lg border border-[#E2DDD4] px-4 py-2 text-xs font-medium text-[#57544E] hover:bg-[#EFECE6]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="cursor-pointer rounded-lg bg-[#4A5B4B] px-5 py-2 text-xs font-medium text-[#FAF8F5] hover:bg-[#3B4A3C]"
                >
                  {editingId ? 'Save Changes' : 'Create Treatment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
