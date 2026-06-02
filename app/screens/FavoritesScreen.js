import React from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../constants/colors';
import StoreCard from '../components/StoreCard';
import { useApp } from '../context/AppContext';

export default function FavoritesScreen({ navigation }) {
  const { favorites, settings, isFavorite, toggleFavorite } = useApp();

  function handlePress(store) {
    navigation.navigate('StoreDetail', {
      store,
      distanceUnit: settings.distanceUnit,
    });
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>❤️ Favorites</Text>
        <Text style={styles.subtitle}>
          {favorites.length === 0
            ? 'No saved stores yet'
            : `${favorites.length} saved store${favorites.length !== 1 ? 's' : ''}`}
        </Text>
      </View>

      <FlatList
        data={favorites}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={favorites.length === 0 ? styles.growList : styles.list}
        renderItem={({ item }) => (
          <StoreCard
            store={item}
            distanceUnit={settings.distanceUnit}
            onPress={() => handlePress(item)}
            onFavoritePress={toggleFavorite}
            isFavorite={isFavorite(item.id)}
          />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="heart-outline" size={80} color={COLORS.border} />
            <Text style={styles.emptyTitle}>No Favorites Yet</Text>
            <Text style={styles.emptyText}>
              Tap the ♡ heart on any store card to save it here for quick access.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  title: { fontSize: 22, fontWeight: '800', color: COLORS.text },
  subtitle: { fontSize: 13, color: COLORS.textSecondary, marginTop: 3 },
  list: { paddingTop: 8, paddingBottom: 16 },
  growList: { flexGrow: 1 },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 48,
    gap: 16,
  },
  emptyTitle: { fontSize: 20, fontWeight: '700', color: COLORS.text },
  emptyText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
});
