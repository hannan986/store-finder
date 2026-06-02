import React, { useState, useMemo } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, ActivityIndicator, RefreshControl, SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../constants/colors';
import GoogleSearchBar from '../components/GoogleSearchBar';
import RadiusPicker from '../components/RadiusPicker';
import CategoryTabs from '../components/CategoryTabs';
import LocationSearchBar from '../components/LocationSearchBar';
import MiniMap from '../components/MiniMap';
import StoreCard from '../components/StoreCard';
import { useApp } from '../context/AppContext';
import useLocation from '../hooks/useLocation';
import useNearbyStores from '../hooks/useNearbyStores';
import { calculateDistance } from '../utils/distance';

export default function HomeScreen({ navigation }) {
  const [activeQuery, setActiveQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [websiteFilter, setWebsiteFilter] = useState('all'); // 'all' | 'has' | 'none'

  const { settings, isFavorite, toggleFavorite, updateRadius } = useApp();
  const {
    location, cityName, permissionStatus, loading: locLoading,
    isCustomLocation, requestLocation, selectPlace,
  } = useLocation();

  const { stores, loading: storesLoading, error, refetch } = useNearbyStores(
    location,
    settings.radius,
    activeCategory,
    activeQuery,
  );

  const isDemo = error === 'demo';

  function handleSearch(query) {
    setActiveQuery(query);
    if (query) setActiveCategory('all');
  }

  function handleClearSearch() {
    setActiveQuery('');
  }

  const storesWithDistance = useMemo(() => {
    return stores
      .map((s) => ({
        ...s,
        distance: location
          ? calculateDistance(location.latitude, location.longitude, s.latitude, s.longitude, settings.distanceUnit)
          : null,
      }))
      .filter((s) => {
        if (websiteFilter === 'has') return s.hasWebsite;
        if (websiteFilter === 'none') return !s.hasWebsite;
        return true;
      })
      .sort((a, b) => (a.distance ?? 9999) - (b.distance ?? 9999));
  }, [stores, location, settings.distanceUnit, websiteFilter]);

  function handleStorePress(store) {
    navigation.navigate('StoreDetail', { store, distanceUnit: settings.distanceUnit, userLocation: location });
  }

  if (permissionStatus === 'denied' && !location) {
    return (
      <SafeAreaView style={styles.center}>
        <Ionicons name="location-off" size={68} color={COLORS.border} />
        <Text style={styles.permTitle}>Location Required</Text>
        <Text style={styles.permText}>
          Store Finder needs your location to show nearby stores.
        </Text>
        <TouchableOpacity style={styles.retryBtn} onPress={requestLocation}>
          <Text style={styles.retryText}>Try Again</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const loading = locLoading || storesLoading;

  return (
    <SafeAreaView style={styles.container}>

      {/* ── Top bar ── */}
      <View style={styles.topBar}>
        <View style={styles.topLeft}>
          <Text style={styles.appTitle}>🏪 Store Finder</Text>
          <View style={styles.locRow}>
            <Ionicons name="location" size={12} color={COLORS.primary} />
            <Text style={styles.cityName} numberOfLines={1}>{cityName}</Text>
            {isCustomLocation && (
              <TouchableOpacity onPress={requestLocation}>
                <Text style={styles.myLocBtn}>My location</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
        <RadiusPicker radius={settings.radius} onRadiusChange={updateRadius} />
      </View>

      {/* ── Google-style search bar ── */}
      <GoogleSearchBar
        location={location}
        onSearch={handleSearch}
        onClear={handleClearSearch}
        activeQuery={activeQuery}
      />

      {/* ── Location search (change city) ── */}
      <View style={styles.locSearchWrap}>
        <LocationSearchBar
          cityName={cityName}
          isCustomLocation={isCustomLocation}
          onSelectPlace={selectPlace}
          onResetLocation={requestLocation}
        />
      </View>

      {/* ── Category tabs (hidden during text search) ── */}
      {!activeQuery && (
        <View style={styles.tabsWrap}>
          <CategoryTabs
            activeCategory={activeCategory}
            onCategoryChange={(id) => { setActiveCategory(id); setActiveQuery(''); }}
          />
        </View>
      )}

      {/* ── Demo banner ── */}
      {isDemo && (
        <View style={styles.demoBanner}>
          <Ionicons name="information-circle" size={16} color="#7B5800" />
          <Text style={styles.demoText}>
            Demo mode — add a Google Places API key in .env for real results.
          </Text>
        </View>
      )}

      {/* ── Results ── */}
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>
            {locLoading ? 'Getting your location…'
              : activeQuery ? `Searching "${activeQuery}"…`
              : 'Finding nearby stores…'}
          </Text>
        </View>
      ) : error && !isDemo ? (
        <View style={styles.center}>
          <Ionicons name="cloud-offline-outline" size={60} color={COLORS.border} />
          <Text style={styles.permTitle}>Connection Error</Text>
          <Text style={styles.permText}>{error}</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={refetch}>
            <Text style={styles.retryText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={storesWithDistance}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          refreshControl={
            <RefreshControl refreshing={storesLoading} onRefresh={refetch} tintColor={COLORS.primary} colors={[COLORS.primary]} />
          }
          ListHeaderComponent={
            <>
              {location && stores.length > 0 && !activeQuery && (
                <View style={styles.mapWrap}>
                  <MiniMap userLocation={location} stores={storesWithDistance} onStorePress={handleStorePress} />
                </View>
              )}
              {/* Website filter chips */}
              <View style={styles.filterRow}>
                {[
                  { key: 'all', label: 'All' },
                  { key: 'has', label: '🌐 Has Website' },
                  { key: 'none', label: '🚫 No Website' },
                ].map((f) => (
                  <TouchableOpacity
                    key={f.key}
                    style={[styles.filterChip, websiteFilter === f.key && styles.filterChipActive]}
                    onPress={() => setWebsiteFilter(f.key)}
                  >
                    <Text style={[styles.filterChipText, websiteFilter === f.key && styles.filterChipTextActive]}>
                      {f.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              <Text style={styles.resultCount}>
                {storesWithDistance.length} result{storesWithDistance.length !== 1 ? 's' : ''}
                {activeQuery ? ` for "${activeQuery}"` : ''} near {cityName}
              </Text>
            </>
          }
          renderItem={({ item }) => (
            <StoreCard
              store={item}
              distance={item.distance}
              distanceUnit={settings.distanceUnit}
              onPress={() => handleStorePress(item)}
              onFavoritePress={toggleFavorite}
              isFavorite={isFavorite(item.id)}
            />
          )}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyEmoji}>🔍</Text>
              <Text style={styles.emptyTitle}>No results found</Text>
              <Text style={styles.emptyText}>
                {activeQuery
                  ? `No places for "${activeQuery}" within ${Math.round(settings.radius / 1609)} mi.\nTry a broader search or tap "Within X mi" to increase the radius.`
                  : 'Try a different category or increase the radius.'}
              </Text>
            </View>
          }
          contentContainerStyle={storesWithDistance.length === 0 ? styles.growList : null}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, gap: 14, backgroundColor: COLORS.background },

  topBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: COLORS.white, paddingHorizontal: 16, paddingTop: 12, paddingBottom: 10,
    borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  topLeft: { flex: 1, marginRight: 12 },
  appTitle: { fontSize: 20, fontWeight: '800', color: COLORS.text },
  locRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2, flexWrap: 'wrap' },
  cityName: { fontSize: 12, color: COLORS.primary, fontWeight: '600', flexShrink: 1 },
  myLocBtn: { fontSize: 11, color: COLORS.textSecondary, textDecorationLine: 'underline' },

  locSearchWrap: { marginTop: 6, zIndex: 100 },
  tabsWrap: { backgroundColor: COLORS.white, paddingVertical: 4, marginTop: 2 },

  demoBanner: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF8E1',
    marginHorizontal: 16, marginBottom: 4, borderRadius: 10, padding: 10, gap: 8,
    borderWidth: 1, borderColor: '#FFD54F',
  },
  demoText: { flex: 1, fontSize: 12, color: '#7B5800' },

  mapWrap: { marginTop: 8, marginBottom: 4 },
  filterRow: {
    flexDirection: 'row', gap: 8, paddingHorizontal: 16, paddingTop: 10, paddingBottom: 2,
  },
  filterChip: {
    paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20,
    borderWidth: 1, borderColor: COLORS.border, backgroundColor: COLORS.white,
  },
  filterChipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  filterChipText: { fontSize: 13, fontWeight: '600', color: COLORS.textSecondary },
  filterChipTextActive: { color: COLORS.white },
  resultCount: { fontSize: 13, color: COLORS.textSecondary, paddingHorizontal: 20, paddingVertical: 6 },
  loadingText: { fontSize: 15, color: COLORS.textSecondary },
  permTitle: { fontSize: 18, fontWeight: '700', color: COLORS.text, textAlign: 'center' },
  permText: { fontSize: 14, color: COLORS.textSecondary, textAlign: 'center', lineHeight: 20 },
  retryBtn: { backgroundColor: COLORS.primary, paddingHorizontal: 28, paddingVertical: 12, borderRadius: 12, marginTop: 6 },
  retryText: { color: COLORS.white, fontWeight: '700', fontSize: 15 },
  empty: { alignItems: 'center', padding: 40, gap: 12 },
  emptyEmoji: { fontSize: 52 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: COLORS.text },
  emptyText: { fontSize: 14, color: COLORS.textSecondary, textAlign: 'center', lineHeight: 20 },
  growList: { flexGrow: 1 },
});
