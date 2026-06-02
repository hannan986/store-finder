function toRad(deg) {
  return deg * (Math.PI / 180);
}

export function calculateDistance(lat1, lon1, lat2, lon2, unit = 'miles') {
  const R = unit === 'miles' ? 3959 : 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

export function formatDistance(distance, unit = 'miles') {
  if (distance === null || distance === undefined) return '';
  const suffix = unit === 'miles' ? 'mi' : 'km';
  return `${distance} ${suffix}`;
}
