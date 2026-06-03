const https = require('https');

const API_KEY = process.env.GOOGLE_PLACES_API_KEY || '';

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') { res.status(200).end(); return; }

  const { endpoint, ...rest } = req.query;

  if (!endpoint || endpoint === 'health') {
    res.status(200).json({ ok: true });
    return;
  }

  const params = new URLSearchParams(rest);
  params.set('key', API_KEY);

  let googleUrl;
  if (endpoint.startsWith('place/')) {
    googleUrl = `https://maps.googleapis.com/maps/api/${endpoint}?${params}`;
  } else if (endpoint.startsWith('geocode/')) {
    googleUrl = `https://maps.googleapis.com/maps/api/${endpoint}?${params}`;
  } else {
    res.status(400).json({ error: 'Invalid endpoint' });
    return;
  }

  return new Promise((resolve) => {
    https.get(googleUrl, (googleRes) => {
      let data = '';
      googleRes.on('data', (chunk) => data += chunk);
      googleRes.on('end', () => {
        res.setHeader('Content-Type', 'application/json');
        res.status(googleRes.statusCode).send(data);
        resolve();
      });
    }).on('error', (err) => {
      res.status(500).json({ error: err.message });
      resolve();
    });
  });
};
