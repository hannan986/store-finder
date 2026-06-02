const https = require('https');

const API_KEY = process.env.GOOGLE_PLACES_API_KEY || '';

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') { res.status(200).end(); return; }

  const pathArr = req.query.path || [];
  const pathStr = Array.isArray(pathArr) ? pathArr.join('/') : pathArr;

  if (pathStr === 'health') { res.status(200).json({ ok: true }); return; }

  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(req.query)) {
    if (k !== 'path') params.set(k, v);
  }
  params.set('key', API_KEY);

  let googleUrl;
  // /api/places/nearbysearch/json  → maps.googleapis.com/maps/api/place/nearbysearch/json
  // /api/places/textsearch/json    → maps.googleapis.com/maps/api/place/textsearch/json
  // /api/places/autocomplete/json  → maps.googleapis.com/maps/api/place/autocomplete/json
  // /api/places/details/json       → maps.googleapis.com/maps/api/place/details/json
  // /api/geocode/json              → maps.googleapis.com/maps/api/geocode/json
  if (pathStr.startsWith('places/')) {
    const sub = pathStr.replace('places/', '');
    googleUrl = `https://maps.googleapis.com/maps/api/place/${sub}?${params}`;
  } else if (pathStr.startsWith('geocode/')) {
    googleUrl = `https://maps.googleapis.com/maps/api/${pathStr}?${params}`;
  } else {
    res.status(404).json({ error: 'Unknown path: ' + pathStr });
    return;
  }

  return new Promise((resolve) => {
    https.get(googleUrl, (googleRes) => {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.status(googleRes.statusCode);
      googleRes.pipe(res);
      googleRes.on('end', resolve);
    }).on('error', (err) => {
      res.status(500).json({ error: err.message });
      resolve();
    });
  });
};
