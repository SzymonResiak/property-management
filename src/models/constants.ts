export const KEYWORDS = {
  high: [
    // Emergency water
    'leak',
    'flood',
    'burst',
    'sewage',
    'overflow',
    'overflowing',

    // Electrical
    'sparking',
    'power outage',
    'exposed wires',
    'electrical',
    'shock',
    'blackout',

    // Structure
    'broken window',
    'roof leak',
    'ceiling',
    'collapse',
    'crack',
    'foundation',
    'structural',

    // Safety
    'gas leak',
    'smoke detector',
    'alarm',
    'fire',
    'emergency',
    'dangerous',
    'unsafe',

    // Heating
    'no heat',
    'frozen pipes',
    'heating',
    'freezing',
    'cold',
    'furnace',
  ],

  medium: [
    // Appliances
    'broken',
    'appliance',
    'dishwasher',
    'dryer',
    'refrigerator',
    'oven',
    'stove',

    // Hardware
    'stuck',
    'jammed',
    'door',
    'window',
    'lock',
    'noisy',
    'loud',
    'rattling',

    // Minor water
    'leaking',
    'dripping',
    'clogged',
  ],

  low: [
    // Cosmetic
    'paint',
    'cosmetic',
    'scratch',
    'minor',
    'squeaky',
    'squeak',
    'touch-up',
    'bulb',
  ],
} as const;

export const PRIORITY_WEIGHTS = {
  high: 3,
  medium: 2,
  low: 1,
} as const;
