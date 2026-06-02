const https = require('https');
const http = require('http');

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
  if (pathStr.startsWith('places/')) {
    googleUrl = `https://maps.googleapis.com/maps/api/${pathStr}?${params}`;
  } else if (pathStr.startsWith('geocode/')) {
    googleUrl = `https://maps.googleapis.com/maps/api/${pathStr}?${params}`;
  } else {
    res.status(404).json({ error: 'Unknown path' });
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
