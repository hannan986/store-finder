import React, { useState, useRef, useCallback } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  FlatList, ActivityIndicator, StyleSheet, Keyboard,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../constants/colors';

import { buildProxyUrl } from '../constants/api';

const QUICK_SUGGESTIONS = [
  { label: 'Restaurants', icon: '🍔', query: 'restaurants' },
  { label: 'Grocery', icon: '🛒', query: 'grocery store' },
  { label: 'Gas Station', icon: '⛽', query: 'gas station' },
  { label: 'Pharmacy', icon: '💊', query: 'pharmacy' },
  { label: 'Coffee', icon: '☕', query: 'coffee shop' },
  { label: 'ATM', icon: '🏧', query: 'ATM' },
];

export default function GoogleSearchBar({ location, onSearch, onClear, activeQuery }) {
  const [text, setText] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const debounceRef = useRef(null);

  const fetchSuggestions = useCallback(async (input) => {
    if (input.length < 2) { setSuggestions([]); return; }
    setLoading(true);
    try {
      const params = { input, types: 'establishment' };
      if (location) { params.location = `${location.latitude},${location.longitude}`; params.radius = 50000; }
      const url = buildProxyUrl('place/autocomplete/json', params);
      const res = await fetch(url);
      const data = await res.json();
      setSuggestions(data.status === 'OK' ? (data.predictions ?? []).slice(0, 6) : []);
    } catch (_) {
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  }, [location]);

  function handleChange(val) {
    setText(val);
    setOpen(true);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchSuggestions(val), 280);
  }

  function submit(query) {
    const q = (query || text).trim();
    if (!q) return;
    setText(q);
    setSuggestions([]);
    setOpen(false);
    Keyboard.dismiss();
    onSearch(q);
  }

  function handleSelect(prediction) {
    const name = prediction.structured_formatting?.main_text ?? prediction.description;
    submit(name);
  }

  function handleClear() {
    setText('');
    setSuggestions([]);
    setOpen(false);
    onClear();
  }

  const showDropdown = open && (suggestions.length > 0 || text.length === 0);

  return (
    <View style={styles.wrapper}>
      {/* Search input */}
      <View style={[styles.bar, open && styles.barOpen]}>
        <Ionicons name="search" size={20} color={activeQuery ? COLORS.primary : '#5F6368'} />
        <TextInput
          style={styles.input}
          placeholder="Search stores, restaurants, gas..."
          placeholderTextColor="#9AA0A6"
          value={text}
          onChangeText={handleChange}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 180)}
          onSubmitEditing={() => submit()}
          returnKeyType="search"
          autoCorrect={false}
        />
        {loading && <ActivityIndicator size="small" color={COLORS.primary} style={{ marginRight: 4 }} />}
        {text.length > 0 && !loading && (
          <TouchableOpacity onPress={handleClear} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Ionicons name="close-circle" size={20} color="#9AA0A6" />
          </TouchableOpacity>
        )}
        {text.length > 0 && (
          <View style={styles.divider} />
        )}
        <TouchableOpacity onPress={() => submit()} style={styles.searchBtn}>
          <Text style={styles.searchBtnText}>Search</Text>
        </TouchableOpacity>
      </View>

      {/* Active query chip */}
      {activeQuery && !open ? (
        <View style={styles.chipRow}>
          <Ionicons name="checkmark-circle" size={14} color={COLORS.primary} />
          <Text style={styles.chipText}>"{activeQuery}"</Text>
          <TouchableOpacity onPress={handleClear}>
            <Ionicons name="close" size={14} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
      ) : null}

      {/* Dropdown */}
      {showDropdown && (
        <View style={styles.dropdown}>
          {/* Quick suggestions when empty */}
          {text.length === 0 && (
            <>
              <Text style={styles.dropdownLabel}>Popular searches near you</Text>
              <View style={styles.quickRow}>
                {QUICK_SUGGESTIONS.map((s) => (
                  <TouchableOpacity key={s.query} style={styles.quickChip} onPress={() => submit(s.query)}>
                    <Text style={styles.quickIcon}>{s.icon}</Text>
                    <Text style={styles.quickLabel}>{s.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </>
          )}

          {/* Autocomplete suggestions */}
          {suggestions.length > 0 && (
            <FlatList
              data={suggestions}
              keyExtractor={(item) => item.place_id}
              keyboardShouldPersistTaps="always"
              scrollEnabled={false}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.suggestion} onPress={() => handleSelect(item)}>
                  <View style={styles.suggestionIcon}>
                    <Ionicons name="storefront-outline" size={16} color={COLORS.primary} />
                  </View>
                  <View style={styles.suggestionText}>
                    <Text style={styles.mainText} numberOfLines={1}>
                      {item.structured_formatting?.main_text ?? item.description}
                    </Text>
                    {item.structured_formatting?.secondary_text ? (
                      <Text style={styles.secondaryText} numberOfLines={1}>
                        {item.structured_formatting.secondary_text}
                      </Text>
                    ) : null}
                  </View>
                  <Ionicons name="arrow-up-back-outline" size={14} color="#9AA0A6" />
                </TouchableOpacity>
              )}
              ItemSeparatorComponent={() => <View style={styles.sep} />}
            />
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginHorizontal: 12, marginTop: 10, zIndex: 999 },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 11,
    gap: 10,
    borderWidth: 1,
    borderColor: '#DFE1E5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  barOpen: { borderBottomLeftRadius: 0, borderBottomRightRadius: 0, borderColor: COLORS.primary, borderBottomColor: '#DFE1E5' },
  input: { flex: 1, fontSize: 16, color: COLORS.text, padding: 0 },
  divider: { width: 1, height: 20, backgroundColor: '#DFE1E5' },
  searchBtn: { backgroundColor: COLORS.primary, paddingHorizontal: 14, paddingVertical: 6, borderRadius: 18 },
  searchBtnText: { color: COLORS.white, fontWeight: '700', fontSize: 13 },
  chipRow: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    marginTop: 6, marginHorizontal: 4,
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20, alignSelf: 'flex-start',
  },
  chipText: { fontSize: 13, color: COLORS.primary, fontWeight: '600' },
  dropdown: {
    backgroundColor: COLORS.white,
    borderWidth: 1, borderTopWidth: 0,
    borderColor: COLORS.primary,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
  dropdownLabel: { fontSize: 11, fontWeight: '700', color: COLORS.textSecondary, textTransform: 'uppercase', letterSpacing: 0.5, paddingHorizontal: 16, paddingTop: 12, paddingBottom: 6 },
  quickRow: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 12, paddingBottom: 12, gap: 8 },
  quickChip: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: COLORS.background, borderRadius: 20,
    paddingHorizontal: 12, paddingVertical: 7,
    borderWidth: 1, borderColor: COLORS.border,
  },
  quickIcon: { fontSize: 14 },
  quickLabel: { fontSize: 13, color: COLORS.text, fontWeight: '500' },
  suggestion: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 11 },
  suggestionIcon: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center', justifyContent: 'center', marginRight: 12,
  },
  suggestionText: { flex: 1 },
  mainText: { fontSize: 14, fontWeight: '600', color: COLORS.text },
  secondaryText: { fontSize: 12, color: COLORS.textSecondary, marginTop: 1 },
  sep: { height: 1, backgroundColor: '#F1F3F4', marginHorizontal: 14 },
});
