import 'dotenv/config';

export default ({ config }) => ({
  ...config,
  expo: {
    name: 'Store Finder',
    slug: 'store-finder',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'light',
    splash: {
      image: './assets/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#E8360D',
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.storefinder.app',
      config: {
        googleMapsApiKey: process.env.GOOGLE_PLACES_API_KEY || '',
      },
      infoPlist: {
        NSLocationWhenInUseUsageDescription:
          'Store Finder needs your location to show nearby stores.',
        NSLocationAlwaysUsageDescription:
          'Store Finder needs your location to show nearby stores.',
      },
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#E8360D',
      },
      permissions: ['ACCESS_FINE_LOCATION', 'ACCESS_COARSE_LOCATION'],
      package: 'com.storefinder.app',
      config: {
        googleMaps: {
          apiKey: process.env.GOOGLE_PLACES_API_KEY || '',
        },
      },
    },
    web: {},
    plugins: [
      [
        'expo-location',
        {
          locationWhenInUsePermission:
            'Store Finder needs your location to show nearby stores.',
        },
      ],
    ],
    extra: {
      googlePlacesApiKey: process.env.GOOGLE_PLACES_API_KEY || '',
    },
  },
});
