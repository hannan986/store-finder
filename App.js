import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from './app/screens/HomeScreen';
import StoreDetailScreen from './app/screens/StoreDetailScreen';
import MapScreen from './app/screens/MapScreen';
import FavoritesScreen from './app/screens/FavoritesScreen';
import SettingsScreen from './app/screens/SettingsScreen';
import { AppProvider } from './app/context/AppContext';
import COLORS from './app/constants/colors';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeMain" component={HomeScreen} />
      <Stack.Screen name="StoreDetail" component={StoreDetailScreen} />
    </Stack.Navigator>
  );
}

function MapStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MapMain" component={MapScreen} />
      <Stack.Screen name="StoreDetail" component={StoreDetailScreen} />
    </Stack.Navigator>
  );
}

function FavoritesStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="FavoritesMain" component={FavoritesScreen} />
      <Stack.Screen name="StoreDetail" component={StoreDetailScreen} />
    </Stack.Navigator>
  );
}

const TAB_ICONS = {
  HomeTab: ['home', 'home-outline'],
  MapTab: ['map', 'map-outline'],
  FavoritesTab: ['heart', 'heart-outline'],
  SettingsTab: ['settings', 'settings-outline'],
};

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AppProvider>
          <NavigationContainer>
            <StatusBar style="dark" />
            <Tab.Navigator
              screenOptions={({ route }) => ({
                headerShown: false,
                tabBarActiveTintColor: COLORS.primary,
                tabBarInactiveTintColor: COLORS.textSecondary,
                tabBarStyle: {
                  backgroundColor: COLORS.white,
                  borderTopColor: COLORS.border,
                  height: 60,
                  paddingBottom: 8,
                  paddingTop: 6,
                },
                tabBarIcon: ({ focused, color, size }) => {
                  const [active, inactive] = TAB_ICONS[route.name] || ['apps', 'apps-outline'];
                  return <Ionicons name={focused ? active : inactive} size={size} color={color} />;
                },
              })}
            >
              <Tab.Screen name="HomeTab" component={HomeStack} options={{ tabBarLabel: 'Home' }} />
              <Tab.Screen name="MapTab" component={MapStack} options={{ tabBarLabel: 'Map' }} />
              <Tab.Screen
                name="FavoritesTab"
                component={FavoritesStack}
                options={{ tabBarLabel: 'Favorites' }}
              />
              <Tab.Screen
                name="SettingsTab"
                component={SettingsScreen}
                options={{ tabBarLabel: 'Settings' }}
              />
            </Tab.Navigator>
          </NavigationContainer>
        </AppProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
