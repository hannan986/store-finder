import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { CATEGORIES } from '../constants/categories';
import COLORS from '../constants/colors';

export default function CategoryTabs({ activeCategory, onCategoryChange }) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {CATEGORIES.map((cat) => {
        const active = activeCategory === cat.id;
        return (
          <TouchableOpacity
            key={cat.id}
            style={[styles.tab, active ? styles.activeTab : styles.inactiveTab]}
            onPress={() => onCategoryChange(cat.id)}
          >
            <Text style={styles.emoji}>{cat.emoji}</Text>
            <Text style={[styles.label, active ? styles.activeLabel : styles.inactiveLabel]}>
              {cat.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    gap: 8,
    alignItems: 'center',
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 5,
  },
  activeTab: {
    backgroundColor: COLORS.white,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 4,
    elevation: 3,
  },
  inactiveTab: { backgroundColor: COLORS.tabInactive },
  emoji: { fontSize: 14 },
  label: { fontSize: 13, fontWeight: '600' },
  activeLabel: { color: COLORS.primary },
  inactiveLabel: { color: COLORS.textSecondary },
});
