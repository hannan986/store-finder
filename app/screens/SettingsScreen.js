import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  Switch,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../constants/colors';
import { SEARCH_RADIUS_OPTIONS } from '../constants/categories';
import { useApp } from '../context/AppContext';

export default function SettingsScreen() {
  const { favorites, settings, clearFavorites, updateRadius, updateDistanceUnit } = useApp();

  function confirmClear() {
    if (favorites.length === 0) return;
    Alert.alert(
      'Clear Favorites',
      `Remove all ${favorites.length} saved store${favorites.length !== 1 ? 's' : ''}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: () => {
            clearFavorites();
            Alert.alert('Done', 'All favorites cleared.');
          },
        },
      ]
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>⚙️ Settings</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Search Radius */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Search Radius</Text>
          <View style={styles.radiusRow}>
            {SEARCH_RADIUS_OPTIONS.map((opt) => {
              const active = settings.radius === opt.value;
              return (
                <TouchableOpacity
                  key={opt.value}
                  style={[styles.radiusBtn, active && styles.radiusBtnActive]}
                  onPress={() => updateRadius(opt.value)}
                >
                  <Text style={[styles.radiusBtnText, active && styles.radiusBtnTextActive]}>
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Distance unit */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Distance Unit</Text>
          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <Ionicons name="navigate-outline" size={20} color={COLORS.primary} />
              <Text style={styles.rowLabel}>Use Kilometers</Text>
            </View>
            <Switch
              value={settings.distanceUnit === 'km'}
              onValueChange={(val) => updateDistanceUnit(val ? 'km' : 'miles')}
              trackColor={{ false: COLORS.border, true: COLORS.primary }}
              thumbColor={COLORS.white}
            />
          </View>
          <Text style={styles.hint}>
            Currently: {settings.distanceUnit === 'miles' ? 'Miles (mi)' : 'Kilometers (km)'}
          </Text>
        </View>

        {/* Favorites */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Data</Text>
          <TouchableOpacity
            style={[styles.row, styles.dangerRow]}
            onPress={confirmClear}
            disabled={favorites.length === 0}
          >
            <View style={styles.rowLeft}>
              <Ionicons
                name="trash-outline"
                size={20}
                color={favorites.length > 0 ? '#D32F2F' : COLORS.border}
              />
              <Text
                style={[
                  styles.rowLabel,
                  favorites.length > 0 ? styles.dangerText : styles.disabledText,
                ]}
              >
                Clear All Favorites
              </Text>
            </View>
            <View
              style={[
                styles.countBadge,
                favorites.length === 0 && styles.countBadgeEmpty,
              ]}
            >
              <Text style={styles.countText}>{favorites.length}</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* About */}
        <View style={[styles.card, styles.aboutCard]}>
          <Text style={styles.aboutAppName}>🏪 Store Finder</Text>
          <Text style={styles.aboutVersion}>Version 1.0.0</Text>
          <Text style={styles.aboutDesc}>
            Find nearby food, shopping & grocery stores using GPS + Google Places API.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  title: { fontSize: 22, fontWeight: '800', color: COLORS.text },
  scroll: { padding: 16, gap: 14 },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 12,
  },
  cardTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  radiusRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  radiusBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  radiusBtnActive: {
    backgroundColor: COLORS.primaryLight,
    borderColor: COLORS.primary,
  },
  radiusBtnText: { fontSize: 13, fontWeight: '600', color: COLORS.textSecondary },
  radiusBtnTextActive: { color: COLORS.primary },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  rowLabel: { fontSize: 15, color: COLORS.text, fontWeight: '500' },
  dangerRow: {},
  dangerText: { color: '#D32F2F' },
  disabledText: { color: COLORS.border },
  hint: { fontSize: 12, color: COLORS.textSecondary, fontStyle: 'italic' },
  countBadge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 12,
  },
  countBadgeEmpty: { backgroundColor: COLORS.border },
  countText: { fontSize: 13, fontWeight: '700', color: COLORS.white },
  aboutCard: { alignItems: 'center', gap: 8 },
  aboutAppName: { fontSize: 20, fontWeight: '800', color: COLORS.text },
  aboutVersion: { fontSize: 12, color: COLORS.textSecondary },
  aboutDesc: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 19,
  },
});
