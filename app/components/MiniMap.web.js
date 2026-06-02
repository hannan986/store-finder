import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import COLORS from '../constants/colors';

export default function MiniMap() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Map view available on mobile</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 165,
    marginHorizontal: 16,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.background,
  },
  text: { fontSize: 14, color: COLORS.textSecondary },
});
