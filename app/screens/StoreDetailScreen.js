import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../constants/colors';
import WebsiteBadge from '../components/WebsiteBadge';
import WebsiteBanner from '../components/WebsiteBanner';
import { useApp } from '../context/AppContext';
import { getCategoryForType } from '../constants/categories';
import { formatDistance } from '../utils/distance';
import { openDirections, openPhone } from '../utils/openMaps';
import { formatPhone } from '../utils/formatPhone';

export default function StoreDetailScreen({ route, navigation }) {
  const { store, distanceUnit = 'miles' } = route.params;
  const { isFavorite, toggleFavorite } = useApp();
  const category = getCategoryForType(store.types);
  const favorited = isFavorite(store.id);

  return (
    <SafeAreaView style={styles.container}>
      {/* Nav bar */}
      <View style={styles.navBar}>
        <TouchableOpacity style={styles.navBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={26} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.navTitle} numberOfLines={1}>
          Store Details
        </Text>
        <TouchableOpacity style={styles.navBtn} onPress={() => toggleFavorite(store)}>
          <Ionicons
            name={favorited ? 'heart' : 'heart-outline'}
            size={24}
            color={favorited ? COLORS.primary : COLORS.textSecondary}
          />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Store hero */}
        <View style={styles.hero}>
          <View style={styles.emojiWrap}>
            <Text style={styles.emoji}>{category.emoji}</Text>
          </View>
          <Text style={styles.name}>{store.name}</Text>
          <View style={styles.heroMeta}>
            <Text style={styles.catLabel}>{category.label}</Text>
            <WebsiteBadge hasWebsite={store.hasWebsite} size="large" />
          </View>
          {store.rating != null && (
            <Text style={styles.rating}>⭐ {store.rating.toFixed(1)} rating</Text>
          )}
        </View>

        {/* Website banner */}
        <View style={styles.section}>
          <WebsiteBanner hasWebsite={store.hasWebsite} website={store.website} />
        </View>

        {/* Info rows */}
        <View style={styles.infoCard}>
          <InfoRow icon="location" label="Address" value={store.address} />
          {store.phone && (
            <InfoRow
              icon="call"
              label="Phone"
              value={formatPhone(store.phone)}
              onPress={() => openPhone(store.phone)}
            />
          )}
          {store.isOpen != null && (
            <InfoRow
              icon="time"
              label="Status"
              value={store.isOpen ? 'Open Now' : 'Closed'}
              valueColor={store.isOpen ? COLORS.hasWebsiteText : COLORS.primary}
            />
          )}
          {store.distance != null && (
            <InfoRow
              icon="navigate"
              label="Distance"
              value={formatDistance(store.distance, distanceUnit)}
              last
            />
          )}
        </View>

        {/* Hours */}
        {store.hours && store.hours.length > 0 && (
          <View style={[styles.infoCard, styles.hoursCard]}>
            <Text style={styles.sectionTitle}>Opening Hours</Text>
            {store.hours.map((day, i) => (
              <Text key={i} style={styles.hourLine}>
                {day}
              </Text>
            ))}
          </View>
        )}

        {/* Action buttons */}
        <View style={styles.actions}>
          <ActionButton
            icon="call"
            label="Call"
            variant="primary"
            disabled={!store.phone}
            onPress={() => openPhone(store.phone)}
          />
          <ActionButton
            icon="navigate"
            label="Directions"
            variant="outline"
            onPress={() => openDirections(store.address, store.latitude, store.longitude)}
          />
          <ActionButton
            icon="globe"
            label="Website"
            variant="green"
            disabled={!store.hasWebsite}
            onPress={() => store.website && Linking.openURL(store.website)}
          />
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function InfoRow({ icon, label, value, onPress, valueColor, last }) {
  const inner = (
    <View style={[styles.infoRow, last && styles.infoRowLast]}>
      <View style={styles.infoIcon}>
        <Ionicons name={icon} size={17} color={COLORS.primary} />
      </View>
      <View style={styles.infoText}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={[styles.infoValue, valueColor ? { color: valueColor } : null]}>
          {value}
        </Text>
      </View>
      {onPress && <Ionicons name="chevron-forward" size={16} color={COLORS.border} />}
    </View>
  );
  return onPress ? (
    <TouchableOpacity onPress={onPress}>{inner}</TouchableOpacity>
  ) : (
    inner
  );
}

function ActionButton({ icon, label, variant, disabled, onPress }) {
  const bg =
    disabled
      ? COLORS.noWebsiteBackground
      : variant === 'primary'
      ? COLORS.primary
      : variant === 'green'
      ? COLORS.hasWebsiteText
      : COLORS.white;

  const textColor =
    disabled
      ? COLORS.noWebsiteText
      : variant === 'outline'
      ? COLORS.primary
      : COLORS.white;

  const border = variant === 'outline' && !disabled ? COLORS.primary : 'transparent';

  return (
    <TouchableOpacity
      style={[styles.actionBtn, { backgroundColor: bg, borderColor: border }]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <Ionicons name={icon} size={19} color={textColor} />
      <Text style={[styles.actionLabel, { color: textColor }]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  navBtn: { padding: 4, minWidth: 36 },
  navTitle: {
    flex: 1,
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.text,
    textAlign: 'center',
  },
  hero: {
    backgroundColor: COLORS.white,
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
    gap: 8,
  },
  emojiWrap: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  emoji: { fontSize: 42 },
  name: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.text,
    textAlign: 'center',
  },
  heroMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  catLabel: { fontSize: 14, color: COLORS.textSecondary, fontWeight: '500' },
  rating: { fontSize: 13, color: COLORS.textSecondary },
  section: { paddingHorizontal: 16, paddingTop: 12 },
  infoCard: {
    backgroundColor: COLORS.white,
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  hoursCard: { padding: 16 },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    gap: 14,
  },
  infoRowLast: { borderBottomWidth: 0 },
  infoIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoText: { flex: 1 },
  infoLabel: {
    fontSize: 10,
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 2,
  },
  infoValue: { fontSize: 14, color: COLORS.text, fontWeight: '500' },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 10,
  },
  hourLine: { fontSize: 13, color: COLORS.textSecondary, paddingVertical: 3 },
  actions: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 16,
    gap: 10,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 13,
    borderRadius: 12,
    gap: 6,
    borderWidth: 1.5,
  },
  actionLabel: { fontSize: 13, fontWeight: '700' },
});
