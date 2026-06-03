import { useState, useEffect, useCallback, useRef } from 'react';
import Constants from 'expo-constants';
import { CATEGORIES } from '../constants/categories';

// Proxy handles the API key server-side; no key needed from the client on web.
import { buildProxyUrl } from '../constants/api';
const API_KEY = Constants.expoConfig?.extra?.googlePlacesApiKey || '';

// Mock data shown when API key is not configured
const MOCK_STORES = [
  {
    id: 'mock_1',
    name: 'Fresh Market Grocery',
    address: '123 Main Street, Downtown',
    phone: '(555) 234-5678',
    website: 'https://example.com',
    hasWebsite: true,
    hours: ['Monday: 8:00 AM – 10:00 PM', 'Tuesday: 8:00 AM – 10:00 PM'],
    isOpen: true,
    rating: 4.3,
    latitude: 0,
    longitude: 0,
    types: ['supermarket', 'grocery_or_supermarket'],
  },
  {
    id: 'mock_2',
    name: 'City Pharmacy',
    address: '456 Oak Avenue, Midtown',
    phone: '(555) 345-6789',
    website: null,
    hasWebsite: false,
    hours: ['Monday: 9:00 AM – 9:00 PM'],
    isOpen: true,
    rating: 4.1,
    latitude: 0,
    longitude: 0,
    types: ['pharmacy'],
  },
  {
    id: 'mock_3',
    name: 'Burger Palace',
    address: '789 Elm Street, Uptown',
    phone: '(555) 456-7890',
    website: 'https://burgerpalace.example.com',
    hasWebsite: true,
    hours: ['Monday: 10:00 AM – 11:00 PM'],
    isOpen: false,
    rating: 4.6,
    latitude: 0,
    longitude: 0,
    types: ['restaurant', 'food'],
  },
  {
    id: 'mock_4',
    name: 'Tech World Electronics',
    address: '321 Pine Road, Tech District',
    phone: null,
    website: 'https://techworld.example.com',
    hasWebsite: true,
    hours: ['Monday: 10:00 AM – 8:00 PM'],
    isOpen: true,
    rating: 4.0,
    latitude: 0,
    longitude: 0,
    types: ['electronics_store'],
  },
  {
    id: 'mock_5',
    name: 'QuickStop Gas & Go',
    address: '654 Maple Drive, West Side',
    phone: '(555) 567-8901',
    website: null,
    hasWebsite: false,
    hours: ['Open 24 hours'],
    isOpen: true,
    rating: 3.8,
    latitude: 0,
    longitude: 0,
    types: ['gas_station'],
  },
  {
    id: 'mock_6',
    name: 'Fashion Forward',
    address: '987 Cedar Blvd, Fashion Row',
    phone: '(555) 678-9012',
    website: 'https://fashionforward.example.com',
    hasWebsite: true,
    hours: ['Monday: 11:00 AM – 9:00 PM'],
    isOpen: true,
    rating: 4.4,
    latitude: 0,
    longitude: 0,
    types: ['clothing_store'],
  },
];

async function probeProxy() {
  try {
    const isDev = typeof __DEV__ !== 'undefined' && __DEV__;
    if (!isDev) return true; // Vercel functions always available in production
    await fetch('http://localhost:3001/api/health', { signal: AbortSignal.timeout(1500) });
    return true;
  } catch (_) {
    return false;
  }
}

async function googleFetch(endpoint, params, usingProxy) {
  let url;
  if (usingProxy) {
    url = buildProxyUrl(endpoint, params);
  } else {
    const q = new URLSearchParams({ ...params, key: API_KEY }).toString();
    url = `https://maps.googleapis.com/maps/api/${endpoint}?${q}`;
  }
  const res = await fetch(url);
  return res.json();
}

// textQuery: free-text search like "pizza", "Walmart", "nail salon"
// categoryId: used when no textQuery (browse by type)
export default function useNearbyStores(location, radius = 16093, categoryId = 'all', textQuery = '') {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const cache = useRef({});

  const fetchStores = useCallback(async () => {
    // Allow text search even without location
    if (!location && !textQuery.trim()) return;

    const cacheKey = `${location.latitude.toFixed(3)},${location.longitude.toFixed(3)}_${radius}_${categoryId}_${textQuery}`;
    if (cache.current[cacheKey]) {
      setStores(cache.current[cacheKey]);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    const usingProxy = await probeProxy();

    if (!usingProxy && !API_KEY) {
      const withCoords = MOCK_STORES.map((s, i) => ({
        ...s,
        latitude: location.latitude + (i * 0.003 - 0.008),
        longitude: location.longitude + (i * 0.003 - 0.008),
      }));
      setStores(withCoords);
      setError('demo');
      setLoading(false);
      return;
    }

    try {
      let data;

      if (textQuery.trim()) {
        const params = { query: textQuery };
        if (location) { params.location = `${location.latitude},${location.longitude}`; params.radius = radius; }
        data = await googleFetch('place/textsearch/json', params, usingProxy);
      } else if (location) {
        const category = CATEGORIES.find((c) => c.id === categoryId) || CATEGORIES[0];
        const params = { location: `${location.latitude},${location.longitude}`, radius, type: category.googleType };
        data = await googleFetch('place/nearbysearch/json', params, usingProxy);
      } else {
        setLoading(false);
        return;
      }

      if (data.status === 'REQUEST_DENIED') {
        setError(data.error_message || 'API key is invalid or restricted.');
        setLoading(false);
        return;
      }
      if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
        setError(`API error: ${data.status}`);
        setLoading(false);
        return;
      }

      const places = (data.results || []).slice(0, 20);
      const detailed = await Promise.all(places.map((p) => fetchDetails(p, usingProxy)));
      const valid = detailed.filter(Boolean);

      cache.current[cacheKey] = valid;
      setStores(valid);
    } catch (err) {
      console.error('Store fetch error:', err);
      setError('Failed to fetch. Check your internet connection.');
    } finally {
      setLoading(false);
    }
  }, [location, radius, categoryId, textQuery]);

  useEffect(() => {
    fetchStores();
  }, [fetchStores]);

  return { stores, loading, error, refetch: fetchStores };
}

async function fetchDetails(place, usingProxy = true) {
  try {
    const fields = 'name,formatted_address,formatted_phone_number,opening_hours,website,rating,geometry,types,photos';
    const params = { place_id: place.place_id, fields };
    const url = usingProxy
      ? buildProxyUrl('place/details/json', params)
      : `https://maps.googleapis.com/maps/api/place/details/json?${new URLSearchParams({ ...params, key: API_KEY })}`;
    const res = await fetch(url);
    const data = await res.json();

    if (data.status === 'OK' && data.result) {
      const d = data.result;
      return {
        id: place.place_id,
        name: d.name || place.name,
        address: d.formatted_address || place.vicinity || '',
        phone: d.formatted_phone_number || null,
        website: d.website || null,
        hasWebsite: !!d.website,
        hours: d.opening_hours?.weekday_text || null,
        isOpen: d.opening_hours?.open_now ?? null,
        rating: d.rating || place.rating || null,
        latitude: d.geometry?.location?.lat ?? place.geometry?.location?.lat,
        longitude: d.geometry?.location?.lng ?? place.geometry?.location?.lng,
        types: d.types || place.types || [],
        photoRef: d.photos?.[0]?.photo_reference || null,
      };
    }

    // Fallback: basic data without details
    return {
      id: place.place_id,
      name: place.name,
      address: place.vicinity || '',
      phone: null,
      website: null,
      hasWebsite: false,
      hours: null,
      isOpen: place.opening_hours?.open_now ?? null,
      rating: place.rating || null,
      latitude: place.geometry?.location?.lat,
      longitude: place.geometry?.location?.lng,
      types: place.types || [],
      photoRef: null,
    };
  } catch (_) {
    return null;
  }
}
