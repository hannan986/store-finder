import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../constants/colors';
import WebsiteBadge from './WebsiteBadge';
import { getCategoryForType } from '../constants/categories';
import { formatDistance } from '../utils/distance';
import { openPhone } from '../utils/openMaps';

export default function StoreCard({
  store,
  distance,
  distanceUnit = 'miles',
  onPress,
  onFavoritePress,
  isFavorite,
}) {
  const category = getCategoryForType(store.types);

  function handleCall(e) {
    e.stopPropagation();
    if (store.phone) openPhone(store.phone);
  }

  function handleFav(e) {
    e.stopPropagation();
    onFavoritePress && onFavoritePress(store);
  }

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.82}>
      <View style={styles.row}>
        {/* Icon */}
        <View style={styles.iconWrap}>
          <Text style={styles.emoji}>{category.emoji}</Text>
        </View>

        {/* Info */}
        <View style={styles.info}>
          <View style={styles.nameRow}>
            <Text style={styles.name} numberOfLines={1}>
              {store.name}
            </Text>
            {onFavoritePress && (
              <TouchableOpacity onPress={handleFav} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <Ionicons
                  name={isFavorite ? 'heart' : 'heart-outline'}
                  size={18}
                  color={isFavorite ? COLORS.primary : COLORS.textSecondary}
                />
              </TouchableOpacity>
            )}
          </View>

          <Text style={styles.address} numberOfLines={1}>
            {store.address}
          </Text>

          <View style={styles.footer}>
            <WebsiteBadge hasWebsite={store.hasWebsite} size="small" />
            {distance != null && (
              <Text style={styles.distance}>
                📏 {formatDistance(distance, distanceUnit)}
              </Text>
            )}
          </View>
        </View>

        {/* Call button */}
        {store.phone && (
          <TouchableOpacity style={styles.callBtn} onPress={handleCall}>
            <Ionicons name="call" size={18} color={COLORS.primary} />
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 12,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: { fontSize: 24 },
  info: { flex: 1, gap: 4 },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
    flex: 1,
  },
  address: { fontSize: 12, color: COLORS.textSecondary },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  distance: { fontSize: 11, color: COLORS.textSecondary },
  callBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
