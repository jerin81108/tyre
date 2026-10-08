// navigation/AppNavigator.js
// Main navigation structure using React Navigation

import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View } from 'react-native';

import { useAuth } from '../utils/authContext';

// Auth Screens
import LoginScreen from '../screens/LoginScreen';

// Main Screens
import HomeScreen from '../screens/HomeScreen';
import DumperListScreen from '../screens/DumperListScreen';
import DumperDetailScreen from '../screens/DumperDetailScreen';
import TyreDetailScreen from '../screens/TyreDetailScreen';
import UpdatePressureScreen from '../screens/UpdatePressureScreen';
import ReportDamageScreen from '../screens/ReportDamageScreen';
import AddMaintenanceScreen from '../screens/AddMaintenanceScreen';
import ReplaceTyreScreen from '../screens/ReplaceTyreScreen';
import MaintenanceScreen from '../screens/MaintenanceScreen';
import AlertsScreen from '../screens/AlertsScreen';
import ProfileScreen from '../screens/ProfileScreen';

import Colors from '../constants/colors';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Tab icon component
const TabIcon = ({ label, emoji, focused }) => (
  <View style={{ alignItems: 'center', justifyContent: 'center' }}>
    <Text style={{ fontSize: 20 }}>{emoji}</Text>
    <Text style={{ fontSize: 10, color: focused ? Colors.primary : Colors.textMuted, marginTop: 2 }}>
      {label}
    </Text>
  </View>
);

// Bottom Tab Navigator (shown after login)
const MainTabs = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarStyle: {
        backgroundColor: Colors.surface,
        borderTopColor: Colors.surfaceLight,
        height: 65,
        paddingBottom: 8,
      },
      tabBarShowLabel: false,
    }}
  >
    <Tab.Screen
      name="Home"
      component={HomeScreen}
      options={{ tabBarIcon: ({ focused }) => <TabIcon label="Home" emoji="🏠" focused={focused} /> }}
    />
    <Tab.Screen
      name="Dumpers"
      component={DumperListScreen}
      options={{ tabBarIcon: ({ focused }) => <TabIcon label="Dumpers" emoji="🚛" focused={focused} /> }}
    />
    <Tab.Screen
      name="Alerts"
      component={AlertsScreen}
      options={{ tabBarIcon: ({ focused }) => <TabIcon label="Alerts" emoji="🔔" focused={focused} /> }}
    />
    <Tab.Screen
      name="Maintenance"
      component={MaintenanceScreen}
      options={{ tabBarIcon: ({ focused }) => <TabIcon label="Maintain" emoji="🔧" focused={focused} /> }}
    />
    <Tab.Screen
      name="Profile"
      component={ProfileScreen}
      options={{ tabBarIcon: ({ focused }) => <TabIcon label="Profile" emoji="👤" focused={focused} /> }}
    />
  </Tab.Navigator>
);

// Root Stack Navigator
const AppNavigator = () => {
  const { user, restoreUser } = useAuth();

  useEffect(() => {
    restoreUser();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!user ? (
          <Stack.Screen name="Login" component={LoginScreen} />
        ) : (
          <>
            <Stack.Screen name="MainTabs" component={MainTabs} />
            <Stack.Screen name="DumperDetail" component={DumperDetailScreen}
              options={{ headerShown: true, title: 'Dumper Details',
                headerStyle: { backgroundColor: Colors.surface },
                headerTintColor: Colors.text }} />
            <Stack.Screen name="TyreDetail" component={TyreDetailScreen}
              options={{ headerShown: true, title: 'Tyre Details',
                headerStyle: { backgroundColor: Colors.surface },
                headerTintColor: Colors.text }} />
            <Stack.Screen name="UpdatePressure" component={UpdatePressureScreen}
              options={{ headerShown: true, title: 'Update Pressure',
                headerStyle: { backgroundColor: Colors.surface },
                headerTintColor: Colors.text }} />
            <Stack.Screen name="ReportDamage" component={ReportDamageScreen}
              options={{ headerShown: true, title: 'Report Damage',
                headerStyle: { backgroundColor: Colors.surface },
                headerTintColor: Colors.text }} />
            <Stack.Screen name="AddMaintenance" component={AddMaintenanceScreen}
              options={{ headerShown: true, title: 'Add Maintenance',
                headerStyle: { backgroundColor: Colors.surface },
                headerTintColor: Colors.text }} />
            <Stack.Screen name="ReplaceTyre" component={ReplaceTyreScreen}
              options={{ headerShown: true, title: 'Replace Tyre',
                headerStyle: { backgroundColor: Colors.surface },
                headerTintColor: Colors.text }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
