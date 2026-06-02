// Dev: requests go to local proxy on port 3001
// Production (Vercel): requests go to serverless functions at /api/*
const BASE = typeof __DEV__ !== 'undefined' && __DEV__ ? 'http://localhost:3001' : '';
export const PROXY_PLACES = `${BASE}/api/places`;
export const PROXY_GEOCODE = `${BASE}/api/geocode/json`;
export const PROXY_AUTOCOMPLETE = `${BASE}/api/places/autocomplete/json`;
