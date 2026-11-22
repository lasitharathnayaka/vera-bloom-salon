export const SERVICE_CATEGORIES = [
  {
    id: 'hair',
    number: '01',
    name: 'Hair & Botanical Color',
    items: [
      {
        id: 'organic-botanical-hair-glossing',
        name: 'Organic Botanical Hair Glossing',
        badge: 'Signature',
        description:
          'Infused with cold-pressed camellia oil, hibiscus extract, and raw honey to restore mirror-like shine and strengthen strands.',
        duration: 60,
        price: 6500,
      },
      {
        id: 'plant-based-dimensional-balayage',
        name: 'Plant-Based Dimensional Balayage',
        badge: null,
        description:
          'Ammonia-free clay lighteners combined with organic indigo and henna root toners for seamless, sun-kissed dimension.',
        duration: 150,
        price: 18500,
      },
      {
        id: 'scalp-detox-rosemary-infusion',
        name: 'Scalp Detox & Rosemary Infusion',
        badge: null,
        description:
          'Deep exfoliation using volcanic ash and organic bamboo, followed by a warm rosemary-infused lymphatic drainage massage.',
        duration: 45,
        price: 4800,
      },
    ],
  },
  {
    id: 'facials',
    number: '02',
    name: 'Holistic Facials',
    items: [
      {
        id: 'cell-renewal-botanical-facial',
        name: 'Cell-Renewal Botanical Facial',
        badge: 'Bestseller',
        description:
          'Resurfacing with papaya enzymes and rosehip seed oil, finished with a cooling jade roller massage to stimulate microcirculation.',
        duration: 75,
        price: 8000,
      },
      {
        id: 'calming-chamomile-blue-tansy-mask',
        name: 'Calming Chamomile & Blue Tansy Mask',
        badge: null,
        description:
          'Designed for sensitive or reactive skin, featuring blue tansy essential oil to reduce redness and restore lipid barrier health.',
        duration: 60,
        price: 7200,
      },
    ],
  },
  {
    id: 'nails',
    number: '03',
    name: 'Nails & Hand Spa',
    items: [
      {
        id: 'botanical-manicure-shea-wrap',
        name: 'Botanical Manicure & Shea Wrap',
        badge: null,
        description:
          'Nail shaping, cuticle care with sweet almond oil, and an intensive warm shea butter hand mask wrap.',
        duration: 45,
        price: 3500,
      },
    ],
  },
  {
    id: 'bridal',
    number: '04',
    name: 'Bridal Packages',
    items: [
      {
        id: 'serene-bride-complete-journey',
        name: 'The Serene Bride Complete Journey',
        badge: 'All-Inclusive',
        description:
          'Includes trial styling, wedding day hair design, radiance facial, botanical manicure, and aromatherapy body polish.',
        duration: 240,
        price: 45000,
      },
    ],
  },
  {
    id: 'waxing',
    number: '05',
    name: 'Waxing & Threading',
    items: [
      {
        id: 'organic-chamomile-sugar-wax',
        name: 'Organic Chamomile Sugar Wax (Full Legs)',
        badge: null,
        description:
          'Gentle hypoallergenic sugar paste infused with chamomile to soothe skin during hair removal.',
        duration: 45,
        price: 4000,
      },
    ],
  },
];

export const ALL_SERVICES = SERVICE_CATEGORIES.flatMap((cat) =>
  cat.items.map((item) => ({ ...item, categoryId: cat.id, categoryName: cat.name }))
);

export function formatLKR(amount) {
  return `LKR ${amount.toLocaleString('en-US')}`;
}
