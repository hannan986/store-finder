export const CATEGORIES = [
  {
    id: 'all',
    label: 'All',
    emoji: '🏪',
    googleType: 'store',
  },
  {
    id: 'grocery',
    label: 'Grocery',
    emoji: '🛒',
    googleType: 'supermarket',
    matchTypes: ['supermarket', 'grocery_or_supermarket'],
  },
  {
    id: 'pharmacy',
    label: 'Pharmacy',
    emoji: '💊',
    googleType: 'pharmacy',
    matchTypes: ['pharmacy'],
  },
  {
    id: 'food',
    label: 'Food',
    emoji: '🍔',
    googleType: 'restaurant',
    matchTypes: ['restaurant', 'food', 'cafe', 'bakery', 'meal_takeaway'],
  },
  {
    id: 'retail',
    label: 'Retail',
    emoji: '🛍️',
    googleType: 'shopping_mall',
    matchTypes: ['shopping_mall', 'store', 'department_store'],
  },
  {
    id: 'electronics',
    label: 'Electronics',
    emoji: '💻',
    googleType: 'electronics_store',
    matchTypes: ['electronics_store'],
  },
  {
    id: 'gas',
    label: 'Gas',
    emoji: '⛽',
    googleType: 'gas_station',
    matchTypes: ['gas_station'],
  },
  {
    id: 'clothing',
    label: 'Clothing',
    emoji: '👗',
    googleType: 'clothing_store',
    matchTypes: ['clothing_store'],
  },
];

export function getCategoryForType(types) {
  if (!types || types.length === 0) return CATEGORIES[0];
  for (const category of CATEGORIES.slice(1)) {
    if (category.matchTypes && types.some((t) => category.matchTypes.includes(t))) {
      return category;
    }
  }
  return CATEGORIES[0];
}

export const SEARCH_RADIUS_OPTIONS = [
  { label: '1 mi', value: 1609 },
  { label: '5 mi', value: 8047 },
  { label: '10 mi', value: 16093 },
  { label: '20 mi', value: 32187 },
  { label: '30 mi', value: 48280 },
];
