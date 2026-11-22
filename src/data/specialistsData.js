import specialistElena from '../assets/specialist-elena.jpg';
import specialistAmara from '../assets/specialist-amara.jpg';
import specialistJulian from '../assets/specialist-julian.jpg';

export const SPECIALISTS = [
  {
    id: 'any',
    name: 'Any Available',
    role: 'Earliest slot match',
    ratingText: 'Top Rated Team',
    avatar: null,
  },
  {
    id: 'elena',
    name: 'Elena Rostova',
    role: 'Senior Botanical Colorist',
    ratingText: '4.98 (124 reviews)',
    avatar: specialistElena,
  },
  {
    id: 'amara',
    name: 'Amara Thorne',
    role: 'Holistic Skin Expert',
    ratingText: '5.0 (98 reviews)',
    avatar: specialistAmara,
  },
  {
    id: 'julian',
    name: 'Julian Vance',
    role: 'Master Stylist',
    ratingText: '4.95 (210 reviews)',
    avatar: specialistJulian,
  },
];

export const DEFAULT_BOOKING_SERVICES = [
  {
    id: 'organic-hair-couture',
    name: 'Organic Hair Couture',
    subtitle: 'Custom color & botanical gloss',
    duration: 60,
    price: 9500,
  },
  {
    id: 'cell-renewal-facial',
    name: 'Cell-Renewal Facial',
    subtitle: 'Rejuvenating herbal infusion',
    duration: 75,
    price: 5000,
  },
];

export const TIME_SLOT_GROUPS = [
  {
    label: 'MORNING',
    slots: ['09:30 AM', '11:00 AM'],
  },
  {
    label: 'AFTERNOON',
    slots: ['01:15 PM', '03:45 PM'],
  },
  {
    label: 'EVENING',
    slots: ['05:30 PM'],
  },
];
