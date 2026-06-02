# Store Finder — Find Nearby Food, Shopping & Grocery

A full-stack React Native + Expo mobile app that uses GPS and the Google Places API to surface nearby stores with rich detail including website detection, hours, phone, and directions.

---

## Features

- **GPS-based store discovery** — auto-detects your city and finds stores nearby
- **Category filtering** — All, Grocery, Pharmacy, Food, Retail, Electronics, Gas, Clothing
- **Website badge** — green "Has Website" / gray "No Website" on every card
- **Full detail screen** — address, phone (tap to call), hours, distance, website banner
- **Interactive map** — full-screen map with emoji pins and tap-to-detail callouts
- **Mini map strip** — embedded map in the home list header
- **Favorites** — heart any store; persisted in AsyncStorage
- **Settings** — search radius (0.5 / 1 / 2 / 5 mi) + miles/km toggle
- **Demo mode** — ships with mock stores so you can explore the UI before adding an API key

---

## Prerequisites

- Node.js 18+
- Expo CLI: `npm install -g expo-cli`
- Expo Go app on your iOS or Android device (for quick testing)
- A Google Places API key (see below)

---

## Setup

### 1. Clone / navigate to the project

```bash
cd StoreFinder
```

### 2. Install dependencies

```bash
npm install
```

### 3. Get a Google Places API key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select an existing one)
3. Navigate to **APIs & Services → Library**
4. Enable **Places API (New)** and **Maps SDK for iOS** / **Maps SDK for Android**
5. Go to **APIs & Services → Credentials → Create Credentials → API Key**
6. (Recommended) Restrict the key to your app's bundle ID / SHA-1

### 4. Add your API key

Open `.env` in the project root and replace the placeholder:

```env
GOOGLE_PLACES_API_KEY=AIzaSy...your_real_key_here
```

### 5. Start the app

```bash
npx expo start
```

Scan the QR code with Expo Go, or press `i` for iOS simulator / `a` for Android emulator.

---

## Project Structure

```
StoreFinder/
├── App.js                     # Navigation root + AppProvider
├── app.config.js              # Expo config (reads .env)
├── babel.config.js
├── package.json
├── .env                       # GOOGLE_PLACES_API_KEY (git-ignored)
│
└── app/
    ├── context/
    │   └── AppContext.js      # Global state: favorites + settings
    │
    ├── screens/
    │   ├── HomeScreen.js      # Store list with search, tabs, mini map
    │   ├── StoreDetailScreen.js
    │   ├── MapScreen.js       # Full-screen map with pins + callouts
    │   ├── FavoritesScreen.js
    │   └── SettingsScreen.js
    │
    ├── components/
    │   ├── StoreCard.js       # Card with website badge + call button
    │   ├── WebsiteBadge.js    # Green/gray badge component
    │   ├── WebsiteBanner.js   # Detail-screen banner (tappable URL)
    │   ├── CategoryTabs.js    # Horizontal pill tabs
    │   ├── MiniMap.js         # Embedded map strip
    │   └── StorePin.js        # Custom map pin
    │
    ├── hooks/
    │   ├── useLocation.js     # GPS + reverse-geocoding
    │   └── useNearbyStores.js # Google Places fetch + caching
    │
    ├── utils/
    │   ├── distance.js        # Haversine calculation + formatting
    │   ├── formatPhone.js     # US phone number formatter
    │   └── openMaps.js        # Apple Maps / Google Maps deep links
    │
    └── constants/
        ├── colors.js
        └── categories.js
```

---

## Website Detection

The `hasWebsite` flag is set in `useNearbyStores.js` when fetching Place Details:

```js
hasWebsite: !!d.website,   // true if the Places API returns a website field
website: d.website || null,
```

This flag drives:
- **WebsiteBadge** — shown on every StoreCard and Map callout
- **WebsiteBanner** — shown in StoreDetailScreen (tappable green banner or gray "No website" banner)
- **Website action button** — disabled + grayed out when `hasWebsite === false`

---

## Environment Variables

| Variable | Description |
|---|---|
| `GOOGLE_PLACES_API_KEY` | Used for Nearby Search, Place Details, and Maps SDK |

The key is loaded via `app.config.js` → `expo-constants` at runtime. It is also passed to the native Maps SDK through `app.config.js` `ios.config.googleMapsApiKey` and `android.config.googleMaps.apiKey`.

---

## Demo Mode

If `GOOGLE_PLACES_API_KEY` is empty, the app displays 6 mock stores (a mix of grocery, pharmacy, food, electronics, gas, and clothing) centered on your real GPS location. A yellow banner on the home screen alerts you to demo mode.

---

## Building for Production

```bash
# Install EAS CLI
npm install -g eas-cli
eas login

# Configure
eas build:configure

# Build
eas build --platform ios
eas build --platform android
```

Make sure your API key has no HTTP referrer restrictions when building — use iOS bundle ID / Android SHA-1 restrictions instead.

---

## Tech Stack

| Library | Purpose |
|---|---|
| Expo SDK 51 | Build toolchain |
| React Native 0.74 | UI framework |
| expo-location | GPS + reverse geocoding |
| react-native-maps | Map views + markers |
| Google Places API | Nearby Search + Place Details |
| @react-navigation | Stack + Bottom Tab navigation |
| @react-native-async-storage | Favorites + settings persistence |
| expo-constants | Safe API key access |
