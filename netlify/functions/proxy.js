const https = require('https');

const API_KEY = process.env.GOOGLE_PLACES_API_KEY || '';

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  // Strip /.netlify/functions/proxy prefix
  const path = event.path.replace('/.netlify/functions/proxy', '').replace('/api/', '');

  if (path === 'health') {
    return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
  }

  const params = new URLSearchParams(event.queryStringParameters || {});
  params.set('key', API_KEY);

  let googleUrl;
  if (path.startsWith('places/')) {
    const sub = path.replace('places/', '');
    googleUrl = `https://maps.googleapis.com/maps/api/place/${sub}?${params}`;
  } else if (path.startsWith('geocode/')) {
    googleUrl = `https://maps.googleapis.com/maps/api/${path}?${params}`;
  } else {
    return { statusCode: 404, headers, body: JSON.stringify({ error: 'Unknown path: ' + path }) };
  }

  return new Promise((resolve) => {
    https.get(googleUrl, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => resolve({ statusCode: res.statusCode, headers, body: data }));
    }).on('error', (err) => {
      resolve({ statusCode: 500, headers, body: JSON.stringify({ error: err.message }) });
    });
  });
};
