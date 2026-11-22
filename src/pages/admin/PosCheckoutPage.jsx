import { useMemo, useState } from 'react';
import {
  Banknote,
  CheckCircle2,
  CreditCard,
  Droplets,
  Leaf,
  Lock,
  Pencil,
  Phone,
  Plus,
  QrCode,
  Scissors,
  Sparkles,
  Tag,
  X,
} from 'lucide-react';

const TREATMENTS = [
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
    specialist: 'Maya Lin',
    price: 6500,
    icon: Droplets,
  },
];

const RETAIL_CATALOG = [
  {
    id: 'ret-rose',
    name: 'Organic Damask Rose Hair Elixir',
    subtitle: '100ml Pure Botanical Extract',
    price: 4500,
  },
  {
    id: 'ret-clay',
    name: 'Botanical Clay Radiance Mask',
    subtitle: '150ml Clean Kaolin & Chamomile',
    price: 3800,
  },
  {
    id: 'ret-mist',
    name: 'White Tea & Neroli Hydro-Mist',
    subtitle: '120ml Organic Facial Toner',
    price: 3200,
  },
];

const PAYMENT_METHODS = [
  { id: 'card', label: 'Card', icon: CreditCard },
  { id: 'cash', label: 'Cash', icon: Banknote },
  { id: 'qr', label: 'QR / Transfer', icon: QrCode },
];

export default function PosCheckoutPage() {
  const [retailItems, setRetailItems] = useState([RETAIL_CATALOG[0]]);
  const [showProductPicker, setShowProductPicker] = useState(false);
  const [redeemRewards, setRedeemRewards] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [editingNotes, setEditingNotes] = useState(false);
  const [formulaNotes, setFormulaNotes] = useState(
    'Custom color gloss with signature rejuvenating herbal infusion. Sensitive scalp formulation applied with organic chamomile base. Allergic to synthetic sulfates.'
  );

  const subtotal = useMemo(() => {
    const treatmentsSum = TREATMENTS.reduce((sum, item) => sum + item.price, 0);
    const retailSum = retailItems.reduce((sum, item) => sum + item.price, 0);
    return treatmentsSum + retailSum;
  }, [retailItems]);

  const discount = redeemRewards ? 2500 : 0;
  const discountedBase = Math.max(0, subtotal - discount);
  const serviceCharge = Math.round(discountedBase * 0.1);
  const totalPayable = discountedBase + serviceCharge;

  const handleRemoveRetail = (id) => {
    setRetailItems((prev) => prev.filter((item) => item.id !== id));
    setPaymentCompleted(false);
  };

  const handleAddRetail = (product) => {
    setRetailItems((prev) => {
      if (prev.some((p) => p.id === product.id)) return prev;
      return [...prev, product];
    });
    setShowProductPicker(false);
    setPaymentCompleted(false);
  };

  const availableToAdd = RETAIL_CATALOG.filter(
    (p) => !retailItems.some((r) => r.id === p.id)
  );

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* ================= PAGE HEADER ================= */}
      <div>
        <p className="text-[10px] font-semibold tracking-[0.22em] text-[#7A766E] uppercase">
          POS &amp; Client CRM / Checkout Portal
        </p>
        <h1 className="mt-1 font-serif text-[26px] font-medium text-[#2A2927]">
          POS Checkout &amp; Client Profile
        </h1>
      </div>

      {/* ================= 2-COLUMN CHECKOUT WORKSPACE ================= */}
      <div className="grid grid-cols-1 items-start gap-7 xl:grid-cols-12">
        {/* LEFT COLUMN */}
        <div className="space-y-6 xl:col-span-7">
          {/* 1. Client Profile & Formula Notes Card */}
          <section className="rounded-2xl border border-[#ECE8E0] bg-gradient-to-br from-[#F2F0EB] to-[#EDE9E1] p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                <span className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#4A5B4B] font-serif text-lg font-semibold tracking-wider text-[#FAF8F5]">
                  EV
                </span>
                <div>
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h2 className="font-serif text-[19px] font-semibold text-[#2A2927]">
                      Emma Vance
                    </h2>
                    <span className="rounded-md bg-[#E7E2D7] px-2.5 py-0.5 text-[10px] font-semibold text-[#6B5A42]">
                      VIP Gold Tier
                    </span>
                  </div>
                  <p className="mt-1 inline-flex items-center gap-1.5 text-[12px] text-[#57544E]">
                    <Phone className="h-3.5 w-3.5 text-[#6B786A]" />
                    <span>+94 77 345 6789</span>
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setEditingNotes((prev) => !prev)}
                aria-label="Edit client notes"
                className="cursor-pointer rounded-lg p-2 text-[#5F5C55] transition-colors hover:bg-[#E5E1D8] hover:text-[#2A2927]"
              >
                <Pencil className="h-4 w-4" />
              </button>
            </div>

            {/* Allergy & Hair Formula Notes */}
            <div className="mt-5 rounded-xl border border-[#ECE8E0] bg-[#FAF8F5] p-4">
              <div className="flex items-center gap-2 text-[#2A2927]">
                <Leaf className="h-3.5 w-3.5 text-[#4A5B4B]" />
                <h3 className="font-serif text-[15px] font-semibold">
                  Allergy &amp; Hair Formula Notes
                </h3>
              </div>

              {editingNotes ? (
                <div className="mt-2.5 space-y-2.5">
                  <textarea
                    rows={3}
                    value={formulaNotes}
                    onChange={(e) => setFormulaNotes(e.target.value)}
                    className="w-full rounded-lg border border-[#DCD7CC] bg-[#F6F4EF] p-2.5 text-[12px] text-[#2A2927] focus:border-[#4A5B4B] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setEditingNotes(false)}
                    className="cursor-pointer rounded-lg bg-[#4A5B4B] px-3.5 py-1.5 text-[11px] font-medium text-[#FAF8F5]"
                  >
                    Save Notes
                  </button>
                </div>
              ) : (
                <p className="mt-2 text-[12px] leading-relaxed text-[#6C6961]">
                  {formulaNotes}
                </p>
              )}
            </div>
          </section>

          {/* 2. Itemized Treatments & Services */}
          <section className="rounded-2xl border border-[#ECE8E0] bg-[#F2F0EB] p-6">
            <div className="flex items-baseline justify-between">
              <h2 className="font-serif text-[18px] font-semibold text-[#2A2927]">
                Itemized Treatments &amp; Services
              </h2>
              <span className="text-[11px] text-[#8A867E]">
                {TREATMENTS.length} Items Selected
              </span>
            </div>

            <div className="mt-4 space-y-3">
              {TREATMENTS.map((item) => {
                const Icon = item.icon;
                return (
                  <article
                    key={item.id}
                    className="flex items-center justify-between gap-4 rounded-xl border border-[#ECE8E0] bg-[#FAF8F5] px-4 py-3.5"
                  >
                    <div className="flex items-center gap-3.5">
                      <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#E7EBE7] text-[#4A5B4B]">
                        <Icon className="h-4 w-4" strokeWidth={1.7} />
                      </span>
                      <div>
                        <p className="font-serif text-[15.5px] font-semibold text-[#2A2927]">
                          {item.name}
                        </p>
                        <p className="text-[11px] text-[#7A766E]">
                          Specialist: {item.specialist}
                        </p>
                      </div>
                    </div>

                    <p className="shrink-0 font-serif text-[15.5px] font-semibold text-[#2A2927]">
                      LKR {item.price.toLocaleString('en-US')}
                    </p>
                  </article>
                );
              })}
            </div>
          </section>

          {/* 3. Retail Add-ons */}
          <section className="rounded-2xl border border-[#ECE8E0] bg-[#F2F0EB] p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="font-serif text-[18px] font-semibold text-[#2A2927]">
                Retail Add-ons
              </h2>
              <button
                type="button"
                onClick={() => setShowProductPicker((prev) => !prev)}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-[#677A68] px-4 py-2 text-[11.5px] font-medium text-[#FAF8F5] transition-colors hover:bg-[#4A5B4B]"
              >
                <Plus className="h-3.5 w-3.5" strokeWidth={2.2} />
                <span>Add Retail Product</span>
              </button>
            </div>

            {/* Quick Retail Picker */}
            {showProductPicker && (
              <div className="mt-4 rounded-xl border border-[#DCD7CC] bg-[#FAF8F5] p-3.5">
                {availableToAdd.length === 0 ? (
                  <p className="text-center text-xs text-[#7A766E]">
                    All retail exclusives are already added to this invoice.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {availableToAdd.map((prod) => (
                      <button
                        key={prod.id}
                        type="button"
                        onClick={() => handleAddRetail(prod)}
                        className="flex w-full cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-left text-xs transition-colors hover:bg-[#F2EFE9]"
                      >
                        <span>
                          <strong className="text-[#2A2927]">
                            {prod.name}
                          </strong>{' '}
                          <span className="text-[#7A766E]">
                            ({prod.subtitle})
                          </span>
                        </span>
                        <span className="font-semibold text-[#4A5B4B]">
                          + LKR {prod.price.toLocaleString('en-US')}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="mt-4 space-y-3">
              {retailItems.length === 0 ? (
                <p className="rounded-xl border border-dashed border-[#DCD7CC] py-5 text-center text-xs text-[#8A867E]">
                  No retail add-ons selected.
                </p>
              ) : (
                retailItems.map((item) => (
                  <article
                    key={item.id}
                    className="flex items-center justify-between gap-4 rounded-xl border border-[#ECE8E0] bg-[#FAF8F5] px-4 py-3.5"
                  >
                    <div className="flex items-center gap-3.5">
                      <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#EFE7DA] text-[#7A6444]">
                        <Sparkles className="h-4 w-4" strokeWidth={1.7} />
                      </span>
                      <div>
                        <p className="font-serif text-[15.5px] font-semibold text-[#2A2927]">
                          {item.name}
                        </p>
                        <p className="text-[11px] text-[#7A766E]">
                          {item.subtitle}
                        </p>
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-3">
                      <p className="font-serif text-[15.5px] font-semibold text-[#2A2927]">
                        LKR {item.price.toLocaleString('en-US')}
                      </p>
                      <button
                        type="button"
                        onClick={() => handleRemoveRetail(item.id)}
                        aria-label={`Remove ${item.name}`}
                        className="cursor-pointer rounded p-1 text-[#B64B42] transition-colors hover:bg-[#F4E1DE]"
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
          <section className="flex items-center justify-between gap-4 rounded-2xl border border-[#ECE8E0] bg-[#F2F0EB] px-6 py-4">
            <div className="flex items-center gap-3.5">
              <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#E7E4DD] text-[#5F5C55]">
                <Tag className="h-4 w-4" strokeWidth={1.7} />
              </span>
              <div>
                <p className="font-serif text-[16px] font-semibold text-[#2A2927]">
                  Botanical Rewards Points
                </p>
                <p className="text-[11px] text-[#7A766E]">
                  Redeem 500 points &mdash; Save LKR 2,500 on this invoice
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
                redeemRewards ? 'bg-[#677A68]' : 'bg-[#DCD8CF]'
              }`}
            >
              <span
                className={`inline-block h-4.5 w-4.5 transform rounded-full bg-white shadow-xs transition-transform ${
                  redeemRewards ? 'translate-x-5.5' : 'translate-x-1'
                }`}
              />
            </button>
          </section>
        </div>

        {/* RIGHT COLUMN: STICKY PAYMENT SUMMARY */}
        <aside className="xl:sticky xl:top-24 xl:col-span-5">
          <div className="rounded-2xl border border-[#E6E2DA] bg-[#F4F2ED] p-7 shadow-sm">
            {/* Header */}
            <div className="flex items-baseline justify-between gap-2 border-b border-[#E5E1D8] pb-4">
              <h2 className="font-serif text-[20px] font-semibold text-[#2A2927]">
                Payment Summary
              </h2>
              <span className="text-[10px] font-semibold tracking-[0.12em] text-[#8A867E] uppercase">
                Invoice #VB-2024-8841
              </span>
            </div>

            {/* Line Items */}
            <div className="space-y-3.5 border-b border-[#E5E1D8] py-5 text-[13px]">
              <div className="flex items-center justify-between">
                <span className="text-[#57544E]">Subtotal</span>
                <span className="font-serif text-[15px] font-semibold text-[#2A2927]">
                  LKR {subtotal.toLocaleString('en-US')}
                </span>
              </div>

              {redeemRewards && (
                <div className="flex items-center justify-between text-[#5E7360]">
                  <span>Botanical Rewards Discount</span>
                  <span className="font-serif text-[15px] font-semibold">
                    - LKR {discount.toLocaleString('en-US')}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between">
                <span className="text-[#57544E]">Service Charge (10%)</span>
                <span className="font-serif text-[15px] font-semibold text-[#2A2927]">
                  LKR {serviceCharge.toLocaleString('en-US')}
                </span>
              </div>
            </div>

            {/* Total Payable */}
            <div className="flex items-baseline justify-between py-5">
              <span className="font-serif text-[18px] font-semibold text-[#2A2927]">
                Total Payable
              </span>
              <span className="font-serif text-[23px] font-semibold text-[#2A2927]">
                LKR {totalPayable.toLocaleString('en-US')}
              </span>
            </div>

            {/* Select Payment Method */}
            <div className="mt-2">
              <p className="text-[11.5px] font-medium text-[#7A766E]">
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
                      className={`flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl px-3 py-3.5 text-[11.5px] font-medium transition-all ${
                        active
                          ? 'bg-[#6B7E6C] text-[#FAF8F5] shadow-xs'
                          : 'border border-[#E5E1D8] bg-[#FAF8F5] text-[#4A4741] hover:bg-[#ECE8E0]'
                      }`}
                    >
                      <Icon className="h-4 w-4" strokeWidth={1.7} />
                      <span>{method.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Complete Payment Button */}
            <button
              type="button"
              onClick={() => setPaymentCompleted(true)}
              className="mt-6 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#6B7E6C] px-5 py-4 text-[13px] font-medium tracking-wide text-[#FAF8F5] shadow-sm transition-colors hover:bg-[#4A5B4B]"
            >
              <CheckCircle2 className="h-4 w-4" strokeWidth={1.9} />
              <span>
                {paymentCompleted
                  ? 'Payment Completed & Receipt Sent!'
                  : 'Complete Payment & Send Receipt'}
              </span>
            </button>

            <p className="mt-4 flex items-center justify-center gap-1.5 text-[10.5px] text-[#8A867E]">
              <Lock className="h-3 w-3" />
              <span>Secure 256-Bit Encrypted Sanctuary POS</span>
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
