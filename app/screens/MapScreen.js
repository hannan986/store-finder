import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ActivityIndicator } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../constants/colors';
import WebsiteBadge from '../components/WebsiteBadge';
import { useApp } from '../context/AppContext';
import useLocation from '../hooks/useLocation';
import useNearbyStores from '../hooks/useNearbyStores';
import { getCategoryForType } from '../constants/categories';
import { calculateDistance, formatDistance } from '../utils/distance';

export default function MapScreen({ navigation }) {
  const { settings } = useApp();
  const { location, cityName, loading: locLoading } = useLocation();
  const { stores, loading: storesLoading } = useNearbyStores(location, settings.radius, 'all');
  const mapRef = useRef(null);

  function recenter() {
    if (location && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.04,
        longitudeDelta: 0.04,
      }, 400);
    }
  }

  if (locLoading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading map…</Text>
      </SafeAreaView>
    );
  }

  if (!location) {
    return (
      <SafeAreaView style={styles.center}>
        <Ionicons name="map-outline" size={64} color={COLORS.border} />
        <Text style={styles.loadingText}>Location unavailable</Text>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <SafeAreaView style={styles.headerSafe}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>📍 Map</Text>
          <View style={styles.cityBadge}>
            <Ionicons name="location" size={12} color={COLORS.primary} />
            <Text style={styles.cityText}>{cityName}</Text>
          </View>
        </View>
      </SafeAreaView>

      {/* Map */}
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.04,
          longitudeDelta: 0.04,
        }}
        showsUserLocation
        showsMyLocationButton={false}
      >
        {stores.map((store) => {
          if (!store.latitude || !store.longitude) return null;
          const cat = getCategoryForType(store.types);
          const dist = calculateDistance(
            location.latitude,
            location.longitude,
            store.latitude,
            store.longitude,
            settings.distanceUnit
          );

          return (
            <Marker
              key={store.id}
              coordinate={{ latitude: store.latitude, longitude: store.longitude }}
            >
              <View style={styles.marker}>
                <Text style={styles.markerEmoji}>{cat.emoji}</Text>
              </View>
              <Callout
                style={styles.callout}
                onPress={() =>
                  navigation.navigate('StoreDetail', {
                    store: { ...store, distance: dist },
                    distanceUnit: settings.distanceUnit,
                    userLocation: location,
                  })
                }
              >
                <View style={styles.calloutInner}>
                  <Text style={styles.calloutName} numberOfLines={1}>
                    {store.name}
                  </Text>
                  <Text style={styles.calloutAddr} numberOfLines={1}>
                    {store.address}
                  </Text>
                  <View style={styles.calloutMeta}>
                    <Text style={styles.calloutDist}>
                      {formatDistance(dist, settings.distanceUnit)}
                    </Text>
                    <WebsiteBadge hasWebsite={store.hasWebsite} size="small" />
                  </View>
                  <Text style={styles.calloutTap}>Tap for details →</Text>
                </View>
              </Callout>
            </Marker>
          );
        })}
      </MapView>

      {/* Recenter + loading overlay */}
      <View style={styles.fab}>
        {storesLoading && (
          <View style={styles.loadingPill}>
            <ActivityIndicator size="small" color={COLORS.primary} />
            <Text style={styles.loadingPillText}>Finding stores…</Text>
          </View>
        )}
        <TouchableOpacity style={styles.recenterBtn} onPress={recenter}>
          <Ionicons name="locate" size={22} color={COLORS.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    backgroundColor: COLORS.background,
  },
  loadingText: { fontSize: 16, color: COLORS.textSecondary },
  headerSafe: { backgroundColor: COLORS.white, zIndex: 10 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: { fontSize: 19, fontWeight: '800', color: COLORS.text },
  cityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  cityText: { fontSize: 12, color: COLORS.primary, fontWeight: '700' },
  map: { flex: 1 },
  marker: {
    backgroundColor: COLORS.white,
    borderRadius: 18,
    padding: 6,
    borderWidth: 2,
    borderColor: COLORS.primary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  markerEmoji: { fontSize: 18 },
  callout: { width: 210 },
  calloutInner: { padding: 10, gap: 5 },
  calloutName: { fontSize: 14, fontWeight: '700', color: COLORS.text },
  calloutAddr: { fontSize: 11, color: COLORS.textSecondary },
  calloutMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  calloutDist: { fontSize: 12, color: COLORS.textSecondary },
  calloutTap: { fontSize: 11, color: COLORS.primary, fontWeight: '700', marginTop: 2 },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 16,
    alignItems: 'flex-end',
    gap: 10,
  },
  loadingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.white,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },
  loadingPillText: { fontSize: 13, color: COLORS.text },
  recenterBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
  },
});
