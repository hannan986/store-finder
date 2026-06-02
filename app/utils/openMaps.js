import { Platform, Linking } from 'react-native';

export function openDirections(address, lat, lng) {
  const encoded = encodeURIComponent(address);
  if (Platform.OS === 'ios') {
    const apple = `maps://app?daddr=${encoded}`;
    Linking.canOpenURL(apple).then((ok) => {
      Linking.openURL(ok ? apple : `https://maps.google.com/maps?daddr=${encoded}`);
    });
  } else {
    const geo = `geo:${lat},${lng}?q=${encoded}`;
    Linking.canOpenURL(geo).then((ok) => {
      Linking.openURL(ok ? geo : `https://maps.google.com/maps?daddr=${encoded}`);
    });
  }
}

export function openWebsite(url) {
  if (!url) return;
  Linking.openURL(url).catch((err) => console.error('Cannot open URL:', err));
}

export function openPhone(phone) {
  if (!phone) return;
  const dialUrl = `tel:${phone.replace(/\D/g, '')}`;
  Linking.openURL(dialUrl).catch((err) => console.error('Cannot open dialer:', err));
}
