import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import COLORS from '../constants/colors';

export default function StorePin({ emoji = '🏪', selected = false }) {
  return (
    <View style={[styles.container, selected && styles.selected]}>
      <Text style={styles.emoji}>{emoji}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 6,
    borderWidth: 2,
    borderColor: COLORS.primary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  selected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.white,
  },
  emoji: { fontSize: 16 },
});
