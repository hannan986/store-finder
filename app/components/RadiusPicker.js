import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../constants/colors';
import { SEARCH_RADIUS_OPTIONS } from '../constants/categories';

export default function RadiusPicker({ radius, onRadiusChange }) {
  const [open, setOpen] = useState(false);
  const current = SEARCH_RADIUS_OPTIONS.find((o) => o.value === radius) ?? SEARCH_RADIUS_OPTIONS[2];

  return (
    <>
      <TouchableOpacity style={styles.trigger} onPress={() => setOpen(true)}>
        <Ionicons name="navigate-circle-outline" size={16} color={COLORS.primary} />
        <Text style={styles.triggerText}>Within {current.label}</Text>
        <Ionicons name="chevron-down" size={14} color={COLORS.primary} />
      </TouchableOpacity>

      <Modal transparent visible={open} animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
          <View style={styles.sheet}>
            <Text style={styles.title}>Search radius</Text>
            <Text style={styles.subtitle}>Choose how far you want to search</Text>
            {SEARCH_RADIUS_OPTIONS.map((opt) => {
              const active = opt.value === radius;
              return (
                <TouchableOpacity
                  key={opt.value}
                  style={[styles.option, active && styles.optionActive]}
                  onPress={() => { onRadiusChange(opt.value); setOpen(false); }}
                >
                  <View style={styles.optionLeft}>
                    <View style={[styles.radio, active && styles.radioActive]}>
                      {active && <View style={styles.radioDot} />}
                    </View>
                    <Text style={[styles.optionLabel, active && styles.optionLabelActive]}>
                      {opt.label}
                    </Text>
                  </View>
                  <Text style={styles.optionSub}>
                    {opt.value < 3000 ? 'Neighborhood' : opt.value < 10000 ? 'Local area' : opt.value < 25000 ? 'City-wide' : 'Regional'}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.primary + '50',
  },
  triggerText: { fontSize: 13, color: COLORS.primary, fontWeight: '700' },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    gap: 4,
  },
  title: { fontSize: 18, fontWeight: '800', color: COLORS.text, marginBottom: 2 },
  subtitle: { fontSize: 13, color: COLORS.textSecondary, marginBottom: 16 },
  option: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingVertical: 14, paddingHorizontal: 12, borderRadius: 12,
    marginBottom: 4,
  },
  optionActive: { backgroundColor: COLORS.primaryLight },
  optionLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  radio: {
    width: 20, height: 20, borderRadius: 10,
    borderWidth: 2, borderColor: COLORS.border,
    alignItems: 'center', justifyContent: 'center',
  },
  radioActive: { borderColor: COLORS.primary },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: COLORS.primary },
  optionLabel: { fontSize: 16, fontWeight: '600', color: COLORS.text },
  optionLabelActive: { color: COLORS.primary },
  optionSub: { fontSize: 12, color: COLORS.textSecondary },
});
