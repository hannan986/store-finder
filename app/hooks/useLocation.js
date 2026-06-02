import { useState, useEffect } from 'react';
import * as Location from 'expo-location';

import { PROXY_GEOCODE as GEOCODE_URL } from '../constants/api';

export default function useLocation() {
  const [location, setLocation] = useState(null);
  const [cityName, setCityName] = useState('Detecting...');
  const [permissionStatus, setPermissionStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isCustomLocation, setIsCustomLocation] = useState(false);

  useEffect(() => {
    requestLocation();
  }, []);

  async function requestLocation() {
    setLoading(true);
    setIsCustomLocation(false);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setPermissionStatus(status);
      if (status !== 'granted') {
        setLoading(false);
        return;
      }
      const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      const coords = { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
      setLocation(coords);
      try {
        const geo = await Location.reverseGeocodeAsync(coords);
        if (geo?.length > 0) {
          const { city, district, subregion } = geo[0];
          setCityName(city || district || subregion || 'Current Location');
        }
      } catch (_) {
        setCityName('Current Location');
      }
    } catch (_) {
      setCityName('Current Location');
    } finally {
      setLoading(false);
    }
  }

  async function selectPlace(placeId, description) {
    setLoading(true);
    try {
      const url = `${GEOCODE_URL}?place_id=${encodeURIComponent(placeId)}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.status === 'OK' && data.results?.length > 0) {
        const { lat, lng } = data.results[0].geometry.location;
        const name = data.results[0].address_components?.[0]?.long_name
          || description.split(',')[0]
          || description;
        setLocation({ latitude: lat, longitude: lng });
        setCityName(name);
        setIsCustomLocation(true);
      }
    } catch (_) {}
    setLoading(false);
  }

  return { location, cityName, permissionStatus, loading, isCustomLocation, requestLocation, selectPlace };
}
