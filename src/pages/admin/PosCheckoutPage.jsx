import { useEffect, useMemo, useState } from 'react';
import {
  Banknote,
  Check,
  CheckCircle2,
  CreditCard,
  Droplets,
  Leaf,
  Lock,
  Minus,
  Pencil,
  Phone,
  Plus,
  Printer,
  QrCode,
  Receipt,
  Scissors,
  Sparkles,
  Tag,
  X,
} from 'lucide-react';
import {
  createInvoice,
  fetchRetailProducts,
} from '../../services/salonService';

const CLIENT_SESSIONS = [
  {
    id: 'emma',
    initials: 'EV',
    name: 'Emma Vance',
    tier: 'VIP Gold Tier',
    phone: '+94 77 345 6789',
    points: 1240,
    notes:
      'Custom color gloss with signature rejuvenating herbal infusion. Sensitive scalp formulation applied with organic chamomile base. Allergic to synthetic sulfates.',
    treatments: [
      {
        id: 'tr-1',
        name: 'Organic Hair Care & Botanical Facial',
        specialist: 'Elena Rostova',
        price: 18500,
        icon: Scissors,
      },
      {
        id: 'tr-2',
        name: 'Botanical Scalp Infusion',
        specialist: 'Amara Thorne',
        price: 6500,
        icon: Droplets,
      },
    ],
  },
  {
    id: 'priya',
    initials: 'PD',
    name: 'Priya & Dilshan',
    tier: "Couple's Suite",
    phone: '+94 77 812 4401',
    points: 680,
    notes:
      'Warm rosehip steam with lymphatic jade massage. Herbal white tea service requested post-ritual.',
    treatments: [
      {
        id: 'tr-3',
        name: "Couple's Cell-Renewal Botanical Facial",
        specialist: 'Amara Thorne',
        price: 16000,
        icon: Sparkles,
      },
    ],
  },
  {
    id: 'natasha',
    initials: 'NM',
    name: 'Natasha M.',
    tier: 'Bridal VIP',
    phone: '+94 71 904 2219',
    points: 920,
    notes:
      'Private bridal consultation suite #2. Soft organic floral updo trial with fresh jasmine & eucalyptus.',
    treatments: [
      {
        id: 'tr-4',
        name: 'Classic Wedding Day Hair & Veil Trial',
        specialist: 'Julian Vance',
        price: 25000,
        icon: Scissors,
      },
    ],
  },
];

const FALLBACK_RETAIL = [
  {
    id: 'ret-rose',
    name: 'Organic Damask Rose Hair Elixir',
    subtitle: '100ml Pure Botanical Extract',
    price: 4500,
    stock: 8,
  },
  {
    id: 'ret-clay',
    name: 'Botanical Clay Radiance Mask',
    subtitle: '150ml Clean Kaolin & Chamomile',
    price: 3800,
    stock: 12,
  },
  {
    id: 'ret-mist',
    name: 'White Tea & Neroli Hydro-Mist',
    subtitle: '120ml Organic Facial Toner',
    price: 3200,
    stock: 15,
  },
];

const PAYMENT_METHODS = [
  { id: 'card', label: 'Card', icon: CreditCard },
  { id: 'cash', label: 'Cash', icon: Banknote },
  { id: 'qr', label: 'QR / Transfer', icon: QrCode },
];

const TIP_OPTIONS = [
  { id: 'none', label: 'No Tip', calc: () => 0 },
  { id: '5', label: '5%', calc: (base) => Math.round(base * 0.05) },
  { id: '10', label: '10%', calc: (base) => Math.round(base * 0.1) },
  { id: '1000', label: 'LKR 1,000', calc: () => 1000 },
];

export default function PosCheckoutPage() {
  const [activeClientId, setActiveClientId] = useState('emma');
  const [retailCatalog, setRetailCatalog] = useState(FALLBACK_RETAIL);
  const [retailItems, setRetailItems] = useState([
    { ...FALLBACK_RETAIL[0], qty: 1 },
  ]);
  const [showProductPicker, setShowProductPicker] = useState(false);
  const [redeemRewards, setRedeemRewards] = useState(true);
  const [tipOption, setTipOption] = useState('none');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [processing, setProcessing] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [invoiceRef, setInvoiceRef] = useState('VB-2026-8841');
  const [editingNotes, setEditingNotes] = useState(false);
  const [notesByClient, setNotesByClient] = useState(() =>
    Object.fromEntries(CLIENT_SESSIONS.map((c) => [c.id, c.notes]))
  );

  // Sync live retail products from Supabase if available
  useEffect(() => {
    let active = true;
    fetchRetailProducts().then(({ data }) => {
      if (!active || !Array.isArray(data) || data.length === 0) return;
      const mapped = data.map((p) => ({
        id: p.id,
        name: p.name,
        subtitle: p.subtitle || p.category || 'Botanical Retail Exclusive',
        price: Number(p.price_lkr) || 3500,
        stock: Number(p.stock_qty) || 10,
      }));
      setRetailCatalog(mapped);
    });
    return () => {
      active = false;
    };
  }, []);

  const activeClient = useMemo(
    () =>
      CLIENT_SESSIONS.find((c) => c.id === activeClientId) ||
      CLIENT_SESSIONS[0],
    [activeClientId]
  );

  const formulaNotes = notesByClient[activeClient.id] || activeClient.notes;

  const subtotal = useMemo(() => {
    const treatmentsSum = activeClient.treatments.reduce(
      (sum, item) => sum + item.price,
      0
    );
    const retailSum = retailItems.reduce(
      (sum, item) => sum + item.price * item.qty,
      0
    );
    return treatmentsSum + retailSum;
  }, [activeClient, retailItems]);

  const discount = redeemRewards ? 2500 : 0;
  const discountedBase = Math.max(0, subtotal - discount);
  const serviceCharge = Math.round(discountedBase * 0.1);
  const tipAmount = useMemo(() => {
    const found = TIP_OPTIONS.find((t) => t.id === tipOption);
    return found ? found.calc(discountedBase) : 0;
  }, [tipOption, discountedBase]);
  const totalPayable = discountedBase + serviceCharge + tipAmount;

  const handleSwitchClient = (id) => {
    setActiveClientId(id);
    setEditingNotes(false);
    setPaymentCompleted(false);
  };

  const handleAddRetail = (product) => {
    setRetailItems((prev) => {
      const existing = prev.find((p) => p.id === product.id);
      if (existing) {
        return prev.map((p) =>
          p.id === product.id ? { ...p, qty: p.qty + 1 } : p
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
    setShowProductPicker(false);
    setPaymentCompleted(false);
  };

  const handleUpdateQty = (id, delta) => {
    setRetailItems((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, qty: item.qty + delta } : item
        )
        .filter((item) => item.qty > 0)
    );
    setPaymentCompleted(false);
  };

  const handleCompletePayment = async () => {
    setProcessing(true);
    const { data } = await createInvoice({
      customer_name: activeClient.name,
      subtotal_lkr: subtotal,
      discount_lkr: discount,
      service_charge_lkr: serviceCharge + tipAmount,
      total_lkr: totalPayable,
      payment_method: paymentMethod,
      status: 'paid',
      items_json: [
        ...activeClient.treatments.map((t) => ({
          name: t.name,
          price: t.price,
        })),
        ...retailItems.map((r) => ({
          name: `${r.name} (x${r.qty})`,
          price: r.price * r.qty,
        })),
      ],
    });
    if (data?.invoice_number) {
      setInvoiceRef(data.invoice_number);
    }
    setProcessing(false);
    setPaymentCompleted(true);
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* ================= EXECUTIVE HEADER + CLIENT QUEUE SWITCHER ================= */}
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <p className="text-[10.5px] font-semibold tracking-[0.22em] text-[#7A766E] uppercase">
            Sanctuary POS &amp; Billing
          </p>
          <h1 className="mt-1 font-serif text-[30px] font-normal tracking-tight text-[#222B23] sm:text-[34px]">
            POS Checkout &amp; Client Profile
          </h1>
        </div>

        {/* Active Desk Checkout Queue */}
        <div className="flex flex-wrap items-center gap-2 rounded-full border border-[#E6E2DA] bg-[#FAF8F5] p-1.5 shadow-2xs">
          <span className="px-2.5 text-[10.5px] font-semibold tracking-wider text-[#8A867E] uppercase">
            Ready to Pay:
          </span>
          {CLIENT_SESSIONS.map((client) => {
            const active = client.id === activeClient.id;
            return (
              <button
                key={client.id}
                type="button"
                onClick={() => handleSwitchClient(client.id)}
                className={`inline-flex cursor-pointer items-center gap-2 rounded-full px-3.5 py-1.5 text-[12px] font-medium transition-all ${
                  active
                    ? 'bg-[#253026] text-[#FAF8F5] shadow-xs'
                    : 'text-[#57544E] hover:bg-[#F3F0EA] hover:text-[#222B23]'
                }`}
              >
                <span
                  className={`inline-flex h-5 w-5 items-center justify-center rounded-full text-[9.5px] font-bold ${
                    active
                      ? 'bg-[#EFE0C6] text-[#222B23]'
                      : 'bg-[#EAE5DC] text-[#57544E]'
                  }`}
                >
                  {client.initials}
                </span>
                <span>{client.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ================= 2-COLUMN CHECKOUT WORKSPACE ================= */}
      <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-12">
        {/* LEFT COLUMN */}
        <div className="space-y-5 xl:col-span-7">
          {/* 1. Client Profile & Formula Notes Card */}
          <section className="rounded-[24px] border border-[#E6E2DA] bg-[#FAF8F5] p-6 shadow-2xs">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                <span className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#253026] font-serif text-lg font-semibold tracking-wider text-[#EFE0C6] shadow-xs">
                  {activeClient.initials}
                </span>
                <div>
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h2 className="font-serif text-[21px] font-semibold text-[#222B23]">
                      {activeClient.name}
                    </h2>
                    <span className="rounded-full bg-[#F5E8D0] px-2.5 py-0.5 text-[10px] font-semibold text-[#7A5E34]">
                      {activeClient.tier}
                    </span>
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-3 text-[12px] text-[#6C6961]">
                    <span className="inline-flex items-center gap-1.5">
                      <Phone className="h-3.5 w-3.5 text-[#6B786A]" />
                      {activeClient.phone}
                    </span>
                    <span className="text-[#DCD7CE]">•</span>
                    <span className="inline-flex items-center gap-1 font-medium text-[#355A3A]">
                      <Sparkles className="h-3 w-3 text-[#B78B43]" />
                      {activeClient.points.toLocaleString('en-US')} Botanical Pts
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setEditingNotes((prev) => !prev)}
                aria-label="Edit client notes"
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-[#E6E2DA] bg-[#F3F0EA] px-3 py-1.5 text-[11px] font-medium text-[#57544E] transition-colors hover:bg-[#EAE5DC] hover:text-[#222B23]"
              >
                <Pencil className="h-3 w-3" />
                <span>{editingNotes ? 'Done' : 'Edit Notes'}</span>
              </button>
            </div>

            {/* Allergy & Hair Formula Notes */}
            <div className="mt-5 rounded-2xl border border-[#EFECE5] bg-[#F5F2EC] p-4">
              <div className="flex items-center gap-2 text-[#222B23]">
                <Leaf className="h-3.5 w-3.5 text-[#4E8B57]" />
                <h3 className="font-serif text-[15px] font-semibold">
                  Allergy &amp; Hair Formula Notes
                </h3>
              </div>

              {editingNotes ? (
                <div className="mt-2.5 space-y-2.5">
                  <textarea
                    rows={3}
                    value={formulaNotes}
                    onChange={(e) =>
                      setNotesByClient((prev) => ({
                        ...prev,
                        [activeClient.id]: e.target.value,
                      }))
                    }
                    className="w-full rounded-xl border border-[#DCD7CC] bg-[#FAF8F5] p-3 text-[12px] text-[#222B23] focus:border-[#253026] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setEditingNotes(false)}
                    className="cursor-pointer rounded-full bg-[#253026] px-4 py-1.5 text-[11px] font-medium text-[#FAF8F5]"
                  >
                    Save Formula Notes
                  </button>
                </div>
              ) : (
                <p className="mt-2 text-[12px] leading-relaxed text-[#57544E]">
                  {formulaNotes}
                </p>
              )}
            </div>
          </section>

          {/* 2. Itemized Treatments & Services */}
          <section className="rounded-[24px] border border-[#E6E2DA] bg-[#FAF8F5] p-6 shadow-2xs">
            <div className="flex items-baseline justify-between">
              <h2 className="font-serif text-[19px] font-semibold text-[#222B23]">
                Itemized Treatments &amp; Services
              </h2>
              <span className="rounded-full bg-[#F3F0EA] px-2.5 py-0.5 text-[10.5px] font-semibold text-[#6C6961]">
                {activeClient.treatments.length}{' '}
                {activeClient.treatments.length === 1 ? 'Item' : 'Items'}
              </span>
            </div>

            <div className="mt-4 space-y-3">
              {activeClient.treatments.map((item) => {
                const Icon = item.icon;
                return (
                  <article
                    key={item.id}
                    className="flex items-center justify-between gap-4 rounded-2xl border border-[#EFECE5] bg-[#F5F2EC] px-4 py-3.5"
                  >
                    <div className="flex items-center gap-3.5">
                      <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#253026] text-[#EFE0C6]">
                        <Icon className="h-4 w-4" strokeWidth={1.7} />
                      </span>
                      <div>
                        <p className="font-serif text-[16px] font-semibold text-[#222B23]">
                          {item.name}
                        </p>
                        <p className="text-[11px] text-[#7A766E]">
                          Specialist: {item.specialist}
                        </p>
                      </div>
                    </div>

                    <p className="shrink-0 font-serif text-[16.5px] font-semibold text-[#222B23]">
                      LKR {item.price.toLocaleString('en-US')}
                    </p>
                  </article>
                );
              })}
            </div>
          </section>

          {/* 3. Retail Add-ons */}
          <section className="rounded-[24px] border border-[#E6E2DA] bg-[#FAF8F5] p-6 shadow-2xs">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-serif text-[19px] font-semibold text-[#222B23]">
                  Retail Add-ons
                </h2>
                <p className="text-[11px] text-[#7A766E]">
                  Attach home-care botanical elixirs to this checkout
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowProductPicker((prev) => !prev)}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-[#253026] px-4 py-2 text-[11.5px] font-medium text-[#FAF8F5] shadow-2xs transition-colors hover:bg-[#344335]"
              >
                <Plus className="h-3.5 w-3.5 text-[#EFE0C6]" strokeWidth={2.3} />
                <span>Add Retail Product</span>
              </button>
            </div>

            {/* Quick Retail Picker */}
            {showProductPicker && (
              <div className="mt-4 rounded-2xl border border-[#DFDBD2] bg-[#F5F2EC] p-3">
                <div className="space-y-1.5">
                  {retailCatalog.map((prod) => (
                    <button
                      key={prod.id}
                      type="button"
                      onClick={() => handleAddRetail(prod)}
                      className="flex w-full cursor-pointer items-center justify-between rounded-xl px-3.5 py-2.5 text-left text-xs transition-colors hover:bg-[#FAF8F5]"
                    >
                      <div>
                        <p className="font-semibold text-[#222B23]">
                          {prod.name}
                        </p>
                        <p className="text-[10.5px] text-[#7A766E]">
                          {prod.subtitle} • {prod.stock} in stock
                        </p>
                      </div>
                      <span className="rounded-full bg-[#253026] px-2.5 py-1 text-[10.5px] font-semibold text-[#EFE0C6]">
                        + LKR {prod.price.toLocaleString('en-US')}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-4 space-y-3">
              {retailItems.length === 0 ? (
                <p className="rounded-2xl border border-dashed border-[#DCD7CC] py-6 text-center text-xs text-[#8A867E]">
                  No retail products added yet.
                </p>
              ) : (
                retailItems.map((item) => (
                  <article
                    key={item.id}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#EFECE5] bg-[#F5F2EC] px-4 py-3.5"
                  >
                    <div className="flex items-center gap-3.5">
                      <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F5E8D0] text-[#7A5E34]">
                        <Sparkles className="h-4 w-4" strokeWidth={1.7} />
                      </span>
                      <div>
                        <p className="font-serif text-[16px] font-semibold text-[#222B23]">
                          {item.name}
                        </p>
                        <p className="text-[11px] text-[#7A766E]">
                          {item.subtitle}
                        </p>
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-3">
                      {/* Quantity Stepper */}
                      <div className="inline-flex items-center gap-1 rounded-full border border-[#E2DDD4] bg-[#FAF8F5] px-1.5 py-1">
                        <button
                          type="button"
                          onClick={() => handleUpdateQty(item.id, -1)}
                          aria-label="Decrease quantity"
                          className="flex h-5 w-5 cursor-pointer items-center justify-center rounded-full text-[#57544E] hover:bg-[#EFECE6]"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="min-w-[18px] text-center text-[11.5px] font-semibold text-[#222B23]">
                          {item.qty}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleUpdateQty(item.id, 1)}
                          aria-label="Increase quantity"
                          className="flex h-5 w-5 cursor-pointer items-center justify-center rounded-full text-[#57544E] hover:bg-[#EFECE6]"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>

                      <p className="min-w-[84px] text-right font-serif text-[16px] font-semibold text-[#222B23]">
                        LKR {(item.price * item.qty).toLocaleString('en-US')}
                      </p>

                      <button
                        type="button"
                        onClick={() => handleUpdateQty(item.id, -item.qty)}
                        aria-label={`Remove ${item.name}`}
                        className="cursor-pointer rounded-full p-1.5 text-[#8A867E] transition-colors hover:bg-[#F4E1DE] hover:text-[#B64B42]"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </article>
                ))
              )}
            </div>
          </section>

          {/* 4. Botanical Rewards Points Toggle */}
          <section className="flex items-center justify-between gap-4 rounded-[22px] border border-[#E6E2DA] bg-[#FAF8F5] px-6 py-4 shadow-2xs">
            <div className="flex items-center gap-3.5">
              <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F5E8D0] text-[#7A5E34]">
                <Tag className="h-4 w-4" strokeWidth={1.7} />
              </span>
              <div>
                <p className="font-serif text-[16.5px] font-semibold text-[#222B23]">
                  Botanical Rewards Points
                </p>
                <p className="text-[11.5px] text-[#7A766E]">
                  Redeem 500 points &mdash; Save{' '}
                  <strong className="text-[#285431]">LKR 2,500</strong> on this
                  invoice
                </p>
              </div>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={redeemRewards}
              aria-label="Redeem Botanical Rewards Points"
              onClick={() => {
                setRedeemRewards((prev) => !prev);
                setPaymentCompleted(false);
              }}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors ${
                redeemRewards ? 'bg-[#253026]' : 'bg-[#DDD8CE]'
              }`}
            >
              <span
                className={`inline-block h-4.5 w-4.5 transform rounded-full shadow-xs transition-transform ${
                  redeemRewards
                    ? 'translate-x-5.5 bg-[#EFE0C6]'
                    : 'translate-x-1 bg-white'
                }`}
              />
            </button>
          </section>
        </div>

        {/* RIGHT COLUMN: SIGNATURE DARK-SAGE PAYMENT TERMINAL */}
        <aside className="xl:sticky xl:top-6 xl:col-span-5">
          <div className="overflow-hidden rounded-[26px] border border-[#344335] bg-[#253026] p-7 text-[#FAF8F5] shadow-xl">
            {/* Terminal Header */}
            <div className="flex items-start justify-between gap-2 border-b border-white/10 pb-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-[#EFE0C6]">
                  <Receipt className="h-5 w-5" strokeWidth={1.7} />
                </div>
                <div>
                  <p className="text-[9.5px] font-semibold tracking-[0.2em] text-[#A8B8AA] uppercase">
                    Invoice #{invoiceRef}
                  </p>
                  <h2 className="font-serif text-[22px] font-normal text-[#FAF8F5]">
                    Payment Summary
                  </h2>
                </div>
              </div>

              <button
                type="button"
                onClick={() => window.print()}
                aria-label="Print receipt"
                className="cursor-pointer rounded-full border border-white/12 bg-white/[0.06] p-2 text-[#C8D4CA] transition-colors hover:bg-white/12 hover:text-white"
              >
                <Printer className="h-4 w-4" />
              </button>
            </div>

            {/* Translucent Breakdown Box */}
            <div className="mt-5 space-y-3 rounded-2xl border border-white/10 bg-white/[0.05] p-4 text-[13px]">
              <div className="flex items-center justify-between">
                <span className="text-[#C5D1C7]">Subtotal</span>
                <span className="font-serif text-[16px] font-semibold text-[#FAF8F5]">
                  LKR {subtotal.toLocaleString('en-US')}
                </span>
              </div>

              {redeemRewards && (
                <div className="flex items-center justify-between text-[#EFE0C6]">
                  <span>Botanical Rewards Discount</span>
                  <span className="font-serif text-[16px] font-semibold">
                    - LKR {discount.toLocaleString('en-US')}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between">
                <span className="text-[#C5D1C7]">Service Charge (10%)</span>
                <span className="font-serif text-[16px] font-semibold text-[#FAF8F5]">
                  LKR {serviceCharge.toLocaleString('en-US')}
                </span>
              </div>

              {tipAmount > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-[#C5D1C7]">Stylist Gratuity</span>
                  <span className="font-serif text-[16px] font-semibold text-[#FAF8F5]">
                    LKR {tipAmount.toLocaleString('en-US')}
                  </span>
                </div>
              )}
            </div>

            {/* Optional Gratuity Selector */}
            <div className="mt-4">
              <p className="text-[11px] font-medium text-[#A8B8AA]">
                Optional Stylist Gratuity
              </p>
              <div className="mt-2 grid grid-cols-4 gap-1.5">
                {TIP_OPTIONS.map((t) => {
                  const active = tipOption === t.id;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => {
                        setTipOption(t.id);
                        setPaymentCompleted(false);
                      }}
                      className={`cursor-pointer rounded-full py-1.5 text-[11px] font-medium transition-all ${
                        active
                          ? 'bg-[#EFE0C6] text-[#222B23] font-semibold'
                          : 'border border-white/12 bg-white/[0.05] text-[#C5D1C7] hover:bg-white/10'
                      }`}
                    >
                      {t.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Total Payable */}
            <div className="mt-5 flex items-baseline justify-between border-y border-white/10 py-5">
              <div>
                <p className="text-[10px] font-semibold tracking-[0.18em] text-[#A8B8AA] uppercase">
                  Total Payable
                </p>
                <p className="text-[11px] text-[#95A798]">
                  Inclusive of all sanctuary taxes
                </p>
              </div>
              <span className="font-serif text-[30px] font-semibold text-[#EFE0C6]">
                LKR {totalPayable.toLocaleString('en-US')}
              </span>
            </div>

            {/* Select Payment Method */}
            <div className="mt-5">
              <p className="text-[11px] font-medium text-[#A8B8AA]">
                Select Payment Method
              </p>
              <div className="mt-2.5 grid grid-cols-3 gap-2.5">
                {PAYMENT_METHODS.map((method) => {
                  const Icon = method.icon;
                  const active = paymentMethod === method.id;
                  return (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => {
                        setPaymentMethod(method.id);
                        setPaymentCompleted(false);
                      }}
                      className={`flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-2xl px-3 py-3.5 text-[11.5px] font-semibold transition-all ${
                        active
                          ? 'bg-[#EFE0C6] text-[#222B23] shadow-sm'
                          : 'border border-white/12 bg-white/[0.06] text-[#D4DFD6] hover:bg-white/12'
                      }`}
                    >
                      <Icon className="h-4 w-4" strokeWidth={1.8} />
                      <span>{method.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Complete Payment CTA */}
            <button
              type="button"
              disabled={processing}
              onClick={handleCompletePayment}
              className={`mt-6 flex w-full cursor-pointer items-center justify-center gap-2 rounded-full px-5 py-4 text-[13px] font-semibold tracking-wide shadow-md transition-all disabled:opacity-60 ${
                paymentCompleted
                  ? 'bg-[#4E8B57] text-[#FAF8F5]'
                  : 'bg-[#EFE0C6] text-[#222B23] hover:bg-[#F7EEDC]'
              }`}
            >
              {paymentCompleted ? (
                <>
                  <Check className="h-4 w-4" strokeWidth={2.5} />
                  <span>Payment Recorded &amp; Receipt Sent</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4" strokeWidth={2} />
                  <span>
                    {processing
                      ? 'Processing Invoice...'
                      : 'Complete Payment & Send Receipt'}
                  </span>
                </>
              )}
            </button>

            <p className="mt-4 flex items-center justify-center gap-1.5 text-[10.5px] text-[#95A798]">
              <Lock className="h-3 w-3 text-[#EFE0C6]/70" />
              <span>Secure 256-Bit Encrypted Sanctuary POS</span>
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
