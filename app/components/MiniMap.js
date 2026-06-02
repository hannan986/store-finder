import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import COLORS from '../constants/colors';
import { getCategoryForType } from '../constants/categories';

export default function MiniMap({ userLocation, stores = [], onStorePress }) {
  if (!userLocation) return null;

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
          latitudeDelta: 0.025,
          longitudeDelta: 0.025,
        }}
        scrollEnabled={false}
        zoomEnabled={false}
        pitchEnabled={false}
        rotateEnabled={false}
        showsUserLocation
        showsMyLocationButton={false}
      >
        {stores.slice(0, 15).map((store) => {
          if (!store.latitude || !store.longitude) return null;
          const cat = getCategoryForType(store.types);
          return (
            <Marker
              key={store.id}
              coordinate={{ latitude: store.latitude, longitude: store.longitude }}
              title={store.name}
              onPress={() => onStorePress && onStorePress(store)}
            >
              <View style={styles.pin}>
                <Text style={styles.pinEmoji}>{cat.emoji}</Text>
              </View>
            </Marker>
          );
        })}
      </MapView>
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
  },
  map: { flex: 1 },
  pin: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 4,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  pinEmoji: { fontSize: 13 },
});
