// screens/LoginScreen.js
// Phase 9: Professional Login Screen

import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  Alert, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView
} from 'react-native';
import { useAuth } from '../utils/authContext';
import Colors from '../constants/colors';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please enter email and password.');
      return;
    }
    setLoading(true);
    try {
      await login(email.trim(), password.trim());
      // Navigation is handled automatically by AppNavigator based on auth state
    } catch (err) {
      Alert.alert('Login Failed', err.message);
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (role) => {
    const creds = {
      Admin: { email: 'admin@tyrex.com', password: 'admin123' },
      Operator: { email: 'operator@tyrex.com', password: 'op123' },
      Maintenance: { email: 'maintenance@tyrex.com', password: 'maint123' },
    };
    setEmail(creds[role].email);
    setPassword(creds[role].password);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        {/* Logo Section */}
        <View style={styles.logoSection}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoIcon}>⚙️</Text>
          </View>
          <Text style={styles.appName}>TYREX</Text>
          <Text style={styles.appSubtitle}>DUMPER TYRE{'\n'}MAINTENANCE SYSTEM</Text>
        </View>

        {/* Login Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Sign In</Text>

          <Text style={styles.label}>Email Address</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            placeholderTextColor={Colors.textMuted}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            placeholderTextColor={Colors.textMuted}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity
            style={[styles.loginBtn, loading && styles.loginBtnDisabled]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={Colors.black} />
            ) : (
              <Text style={styles.loginBtnText}>LOGIN</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Demo Quick Login Buttons */}
        <View style={styles.demoSection}>
          <Text style={styles.demoTitle}>— Demo Quick Login —</Text>
          <View style={styles.demoRow}>
            {['Admin', 'Operator', 'Maintenance'].map((role) => (
              <TouchableOpacity
                key={role}
                style={styles.demoBtn}
                onPress={() => fillDemo(role)}
              >
                <Text style={styles.demoBtnText}>{role}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: 36,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  logoIcon: { fontSize: 36 },
  appName: {
    fontSize: 34,
    fontWeight: '900',
    color: Colors.primary,
    letterSpacing: 8,
  },
  appSubtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'center',
    letterSpacing: 2,
    marginTop: 4,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 20,
  },
  label: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 6,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  input: {
    backgroundColor: Colors.surfaceLight,
    borderRadius: 10,
    padding: 14,
    color: Colors.text,
    fontSize: 15,
    marginBottom: 16,
  },
  loginBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  loginBtnDisabled: { opacity: 0.6 },
  loginBtnText: {
    color: Colors.black,
    fontWeight: '800',
    fontSize: 16,
    letterSpacing: 2,
  },
  demoSection: {
    alignItems: 'center',
  },
  demoTitle: {
    color: Colors.textMuted,
    fontSize: 12,
    marginBottom: 12,
  },
  demoRow: {
    flexDirection: 'row',
    gap: 10,
  },
  demoBtn: {
    backgroundColor: Colors.surfaceLight,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  demoBtnText: {
    color: Colors.primary,
    fontWeight: '700',
    fontSize: 12,
  },
});
