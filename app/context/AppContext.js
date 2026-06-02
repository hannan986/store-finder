import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVORITES_KEY = '@store_finder_favorites';
const SETTINGS_KEY = '@store_finder_settings';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [favorites, setFavorites] = useState([]);
  const [settings, setSettings] = useState({ radius: 16093, distanceUnit: 'miles' });

  useEffect(() => {
    async function load() {
      try {
        const [favStr, settStr] = await Promise.all([
          AsyncStorage.getItem(FAVORITES_KEY),
          AsyncStorage.getItem(SETTINGS_KEY),
        ]);
        if (favStr) setFavorites(JSON.parse(favStr));
        if (settStr) setSettings(JSON.parse(settStr));
      } catch (_) {}
    }
    load();
  }, []);

  async function persistFavorites(next) {
    setFavorites(next);
    try {
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
    } catch (_) {}
  }

  async function persistSettings(next) {
    setSettings(next);
    try {
      await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(next));
    } catch (_) {}
  }

  function isFavorite(id) {
    return favorites.some((f) => f.id === id);
  }

  function toggleFavorite(store) {
    const next = isFavorite(store.id)
      ? favorites.filter((f) => f.id !== store.id)
      : [...favorites, store];
    persistFavorites(next);
  }

  function clearFavorites() {
    persistFavorites([]);
  }

  function updateRadius(radius) {
    persistSettings({ ...settings, radius });
  }

  function updateDistanceUnit(distanceUnit) {
    persistSettings({ ...settings, distanceUnit });
  }

  return (
    <AppContext.Provider
      value={{
        favorites,
        settings,
        isFavorite,
        toggleFavorite,
        clearFavorites,
        updateRadius,
        updateDistanceUnit,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}
