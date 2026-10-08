// screens/ProfileScreen.js
// Phase 34: User profile and logout

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useAuth } from '../utils/authContext';
import Colors from '../constants/colors';

const ROLE_PERMISSIONS = {
  Admin: ['View all dumpers', 'Manage tyres', 'View all maintenance', 'View all alerts', 'Add/edit dumpers & tyres'],
  Operator: ['View assigned dumper', 'View tyre status', 'Update tyre pressure', 'Report damage', 'View alerts'],
  Maintenance: ['View all alerts', 'Add maintenance records', 'Update tyre condition', 'Replace tyres', 'View maintenance history'],
};

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: logout }
      ]
    );
  };

  const roleColor = { Admin: '#A78BFA', Operator: Colors.primary, Maintenance: '#60A5FA' }[user?.role] || Colors.primary;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarText}>{user?.name?.[0] || '?'}</Text>
        </View>
        <Text style={styles.name}>{user?.name}</Text>
        <Text style={styles.email}>{user?.email}</Text>
        <View style={[styles.rolePill, { backgroundColor: roleColor }]}>
          <Text style={styles.roleText}>{user?.role?.toUpperCase()}</Text>
        </View>
        {user?.assignedDumper && (
          <Text style={styles.assignedText}>Assigned Dumper: {user.assignedDumper}</Text>
        )}
      </View>

      {/* Permissions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your Permissions</Text>
        {(ROLE_PERMISSIONS[user?.role] || []).map((perm, i) => (
          <View key={i} style={styles.permRow}>
            <Text style={styles.permDot}>✓</Text>
            <Text style={styles.permText}>{perm}</Text>
          </View>
        ))}
      </View>

      {/* Demo Credentials */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Demo Credentials</Text>
        <View style={styles.credRow}>
          <Text style={styles.credRole}>Admin:</Text>
          <Text style={styles.credEmail}>admin@tyrex.com / admin123</Text>
        </View>
        <View style={styles.credRow}>
          <Text style={styles.credRole}>Operator:</Text>
          <Text style={styles.credEmail}>operator@tyrex.com / op123</Text>
        </View>
        <View style={styles.credRow}>
          <Text style={styles.credRole}>Maintenance:</Text>
          <Text style={styles.credEmail}>maintenance@tyrex.com / maint123</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>🚪 LOGOUT</Text>
      </TouchableOpacity>

      <Text style={styles.version}>TYREX v1.0 | Dumper Tyre Maintenance System</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    backgroundColor: Colors.surface, alignItems: 'center',
    paddingTop: 60, paddingBottom: 28, paddingHorizontal: 24,
  },
  avatarCircle: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center', marginBottom: 12,
  },
  avatarText: { fontSize: 34, fontWeight: '900', color: Colors.black },
  name: { fontSize: 22, fontWeight: '800', color: Colors.text },
  email: { fontSize: 13, color: Colors.textSecondary, marginTop: 4, marginBottom: 10 },
  rolePill: { borderRadius: 20, paddingHorizontal: 16, paddingVertical: 4 },
  roleText: { fontSize: 12, fontWeight: '800', color: Colors.black, letterSpacing: 2 },
  assignedText: { fontSize: 13, color: Colors.textMuted, marginTop: 10 },
  section: { backgroundColor: Colors.surface, margin: 16, borderRadius: 14, padding: 16 },
  sectionTitle: { fontSize: 15, fontWeight: '800', color: Colors.text, marginBottom: 12 },
  permRow: { flexDirection: 'row', gap: 10, marginBottom: 6 },
  permDot: { color: Colors.good, fontWeight: '700' },
  permText: { fontSize: 13, color: Colors.textSecondary },
  credRow: { flexDirection: 'row', gap: 8, marginBottom: 6 },
  credRole: { fontSize: 13, fontWeight: '700', color: Colors.primary, width: 90 },
  credEmail: { fontSize: 12, color: Colors.textMuted, flex: 1 },
  logoutBtn: {
    backgroundColor: Colors.criticalBg, borderWidth: 1, borderColor: Colors.critical,
    borderRadius: 12, margin: 16, padding: 16, alignItems: 'center',
  },
  logoutText: { color: Colors.critical, fontWeight: '800', fontSize: 15, letterSpacing: 1 },
  version: { textAlign: 'center', color: Colors.textMuted, fontSize: 11, marginBottom: 20 },
});
