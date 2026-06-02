import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../constants/colors';

export default function WebsiteBadge({ hasWebsite, size = 'small' }) {
  const small = size === 'small';
  return (
    <View
      style={[
        styles.badge,
        hasWebsite ? styles.hasBg : styles.noBg,
        small ? styles.sm : styles.lg,
      ]}
    >
      <Ionicons
        name={hasWebsite ? 'globe-outline' : 'globe-outline'}
        size={small ? 10 : 12}
        color={hasWebsite ? COLORS.hasWebsiteText : COLORS.noWebsiteText}
        style={hasWebsite ? null : styles.faded}
      />
      <Text
        style={[
          styles.text,
          hasWebsite ? styles.hasText : styles.noText,
          small ? styles.smText : styles.lgText,
        ]}
      >
        {hasWebsite ? 'Has Website' : 'No Website'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
  },
  sm: { paddingHorizontal: 7, paddingVertical: 3, gap: 3 },
  lg: { paddingHorizontal: 10, paddingVertical: 5, gap: 5 },
  hasBg: { backgroundColor: COLORS.hasWebsiteBackground },
  noBg: { backgroundColor: COLORS.noWebsiteBackground },
  text: { fontWeight: '600' },
  smText: { fontSize: 10 },
  lgText: { fontSize: 12 },
  hasText: { color: COLORS.hasWebsiteText },
  noText: { color: COLORS.noWebsiteText },
  faded: { opacity: 0.5 },
});
