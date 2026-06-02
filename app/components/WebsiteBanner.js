import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../constants/colors';

export default function WebsiteBanner({ hasWebsite, website }) {
  function handlePress() {
    if (website) Linking.openURL(website).catch(() => {});
  }

  if (hasWebsite && website) {
    return (
      <TouchableOpacity style={[styles.banner, styles.hasBanner]} onPress={handlePress} activeOpacity={0.8}>
        <View style={[styles.iconWrap, styles.hasIconWrap]}>
          <Ionicons name="globe" size={22} color={COLORS.hasWebsiteText} />
        </View>
        <View style={styles.textWrap}>
          <Text style={[styles.label, styles.hasLabel]}>Website</Text>
          <Text style={[styles.url, styles.hasUrl]} numberOfLines={1}>
            {website}
          </Text>
        </View>
        <Ionicons name="open-outline" size={18} color={COLORS.hasWebsiteText} />
      </TouchableOpacity>
    );
  }

  return (
    <View style={[styles.banner, styles.noBanner]}>
      <View style={[styles.iconWrap, styles.noIconWrap]}>
        <Ionicons name="globe-outline" size={22} color={COLORS.noWebsiteText} style={styles.faded} />
      </View>
      <View style={styles.textWrap}>
        <Text style={[styles.label, styles.noLabel]}>No website available</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    gap: 12,
  },
  hasBanner: { backgroundColor: COLORS.hasWebsiteBackground },
  noBanner: { backgroundColor: COLORS.noWebsiteBackground },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hasIconWrap: { backgroundColor: 'rgba(59,109,17,0.12)' },
  noIconWrap: { backgroundColor: 'rgba(95,94,90,0.1)' },
  textWrap: { flex: 1 },
  label: { fontSize: 11, fontWeight: '500', marginBottom: 2 },
  url: { fontSize: 14, fontWeight: '700' },
  hasLabel: { color: COLORS.hasWebsiteText },
  hasUrl: { color: COLORS.hasWebsiteText },
  noLabel: { fontSize: 14, fontWeight: '500', color: COLORS.noWebsiteText },
  faded: { opacity: 0.5 },
});
