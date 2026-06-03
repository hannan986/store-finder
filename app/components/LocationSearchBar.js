import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../constants/colors';

import { buildProxyUrl } from '../constants/api';

export default function LocationSearchBar({ onSelectPlace, cityName, isCustomLocation, onResetLocation }) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);
  const debounceRef = useRef(null);

  const fetchSuggestions = useCallback(async (text) => {
    if (text.length < 2) { setSuggestions([]); return; }
    setLoading(true);
    try {
      const url = buildProxyUrl('place/autocomplete/json', { input: text, types: '(cities)' });
      const res = await fetch(url);
      const data = await res.json();
      if (data.status === 'OK') {
        setSuggestions(data.predictions?.slice(0, 6) ?? []);
      } else {
        setSuggestions([]);
      }
    } catch (_) {
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  function handleChangeText(text) {
    setQuery(text);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchSuggestions(text), 300);
  }

  function handleSelect(prediction) {
    setQuery('');
    setSuggestions([]);
    setFocused(false);
    onSelectPlace(prediction.place_id, prediction.description);
  }

  function handleClear() {
    setQuery('');
    setSuggestions([]);
  }

  return (
    <View style={styles.wrapper}>
      <View style={[styles.inputRow, focused && styles.inputRowFocused]}>
        <Ionicons name="earth-outline" size={18} color={focused ? COLORS.primary : COLORS.textSecondary} />
        <TextInput
          style={styles.input}
          placeholder="Search stores in any city or location..."
          placeholderTextColor={COLORS.textSecondary}
          value={query}
          onChangeText={handleChangeText}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 200)}
          returnKeyType="search"
        />
        {loading ? (
          <ActivityIndicator size="small" color={COLORS.primary} />
        ) : query.length > 0 ? (
          <TouchableOpacity onPress={handleClear}>
            <Ionicons name="close-circle" size={18} color={COLORS.textSecondary} />
          </TouchableOpacity>
        ) : null}
      </View>

      {isCustomLocation && !focused && (
        <TouchableOpacity style={styles.resetRow} onPress={onResetLocation}>
          <Ionicons name="navigate" size={12} color={COLORS.primary} />
          <Text style={styles.resetText}>Showing stores near "{cityName}" — tap to use my location</Text>
        </TouchableOpacity>
      )}

      {focused && suggestions.length > 0 && (
        <View style={styles.dropdown}>
          <FlatList
            data={suggestions}
            keyExtractor={(item) => item.place_id}
            keyboardShouldPersistTaps="always"
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.suggestion} onPress={() => handleSelect(item)}>
                <Ionicons name="location-outline" size={16} color={COLORS.primary} style={styles.suggestionIcon} />
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
              </TouchableOpacity>
            )}
            ItemSeparatorComponent={() => <View style={styles.sep} />}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginHorizontal: 16, marginTop: 8, zIndex: 100 },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 11,
    gap: 10,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  inputRowFocused: { borderColor: COLORS.primary },
  input: { flex: 1, fontSize: 14, color: COLORS.text, padding: 0 },
  resetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 5,
    paddingHorizontal: 4,
  },
  resetText: { fontSize: 12, color: COLORS.primary, flex: 1 },
  dropdown: {
    position: 'absolute',
    top: 52,
    left: 0,
    right: 0,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 200,
    overflow: 'hidden',
  },
  suggestion: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  suggestionIcon: { marginRight: 10 },
  suggestionText: { flex: 1 },
  mainText: { fontSize: 14, fontWeight: '600', color: COLORS.text },
  secondaryText: { fontSize: 12, color: COLORS.textSecondary, marginTop: 1 },
  sep: { height: 1, backgroundColor: COLORS.border, marginHorizontal: 14 },
});
