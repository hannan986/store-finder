// Dev: uses local proxy.js on port 3001
// Production (Vercel): uses /api/proxy serverless function
const isDev = typeof __DEV__ !== 'undefined' && __DEV__;
const BASE = isDev ? 'http://localhost:3001' : '';

// Build a proxy URL: /api/proxy?endpoint=place/nearbysearch/json&...params
export function buildProxyUrl(endpoint, params = {}) {
  if (isDev) {
    // Local proxy uses path-based routing
    const q = new URLSearchParams(params).toString();
    return `${BASE}/api/${endpoint}${q ? '?' + q : ''}`;
  }
  // Vercel uses query-param-based routing
  const q = new URLSearchParams({ endpoint, ...params }).toString();
  return `${BASE}/api/proxy?${q}`;
}

export const PROXY_BASE = BASE;
