import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../constants/colors';

export default function MapScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Ionicons name="map-outline" size={64} color={COLORS.border} />
      <Text style={styles.title}>Map Unavailable on Web</Text>
      <Text style={styles.text}>The interactive map is only available on the mobile app.</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.background,
    gap: 16,
    padding: 32,
  },
  title: { fontSize: 18, fontWeight: '700', color: COLORS.text },
  text: { fontSize: 14, color: COLORS.textSecondary, textAlign: 'center' },
});
