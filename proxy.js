const https = require('https');
const http = require('http');

require('dotenv').config();

const PORT = 3001;
const API_KEY = process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY || process.env.GOOGLE_PLACES_API_KEY || '';

if (!API_KEY) {
  console.warn('No API key — proxy will return demo mode responses');
}

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS' || req.url === '/health') {
    res.writeHead(200);
    res.end('ok');
    return;
  }

  const url = new URL(req.url, `http://localhost:${PORT}`);
  url.searchParams.set('key', API_KEY);

  let googleUrl;
  if (url.pathname.startsWith('/api/geocode')) {
    const pathname = url.pathname.replace('/api/geocode', '');
    googleUrl = `https://maps.googleapis.com/maps/api/geocode${pathname}?${url.searchParams.toString()}`;
  } else {
    const pathname = url.pathname.replace('/api/places', '');
    googleUrl = `https://maps.googleapis.com/maps/api/place${pathname}?${url.searchParams.toString()}`;
  }

  https.get(googleUrl, (googleRes) => {
    res.writeHead(googleRes.statusCode, {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    });
    googleRes.pipe(res);
  }).on('error', (err) => {
    res.writeHead(500);
    res.end(JSON.stringify({ error: err.message }));
  });
});

server.listen(PORT, () => {
  console.log(`Places proxy running on http://localhost:${PORT}`);
});
