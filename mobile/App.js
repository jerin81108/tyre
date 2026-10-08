// App.js - Entry point for the mobile app
import { registerRootComponent } from 'expo';
import React from 'react';
import { AuthProvider } from './utils/authContext';
import AppNavigator from './navigation/AppNavigator';

function App() {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}

export default registerRootComponent(App);
