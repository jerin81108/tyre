// screens/HomeScreen.js
// Phase 10: Dashboard home screen

import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, ActivityIndicator,
  TouchableOpacity, RefreshControl
} from 'react-native';
import { useAuth } from '../utils/authContext';
import { getAllTyres } from '../services/tyreService';
import { getAllAlerts } from '../services/alertService';
import Colors from '../constants/colors';

const StatusBadge = ({ status }) => {
  const map = {
    Good: { bg: Colors.goodBg, text: Colors.good },
    Warning: { bg: Colors.warningBg, text: Colors.warning },
    Critical: { bg: Colors.criticalBg, text: Colors.critical },
  };
  const style = map[status] || map['Good'];
  return (
    <View style={[styles.badge, { backgroundColor: style.bg }]}>
      <Text style={[styles.badgeText, { color: style.text }]}>{status?.toUpperCase()}</Text>
    </View>
  );
};

export default function HomeScreen({ navigation }) {
  const { user } = useAuth();
  const [tyres, setTyres] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      const [tyreRes, alertRes] = await Promise.all([getAllTyres(), getAllAlerts()]);
      let allTyres = tyreRes.data || [];
      // Operator only sees their assigned dumper's tyres
      if (user?.role === 'Operator' && user?.assignedDumper) {
        allTyres = allTyres.filter(t => t.dumperId === user.assignedDumper);
      }
      setTyres(allTyres);
      setAlerts((alertRes.data || []).filter(a => a.status !== 'Resolved').slice(0, 5));
    } catch (e) {
      console.error('Home fetch error:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData();
  }, []);

  const goodCount = tyres.filter(t => t.status === 'Good').length;
  const warningCount = tyres.filter(t => t.status === 'Warning').length;
  const criticalCount = tyres.filter(t => t.status === 'Critical').length;

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading dashboard...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />}
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Welcome back,</Text>
          <Text style={styles.userName}>{user?.name}</Text>
          <View style={styles.rolePill}>
            <Text style={styles.roleText}>{user?.role}</Text>
          </View>
        </View>
        <Text style={styles.headerIcon}>🚛</Text>
      </View>

      {/* Assigned Dumper (Operator only) */}
      {user?.role === 'Operator' && user?.assignedDumper && (
        <TouchableOpacity
          style={styles.assignedCard}
          onPress={() => navigation.navigate('Dumpers')}
        >
          <Text style={styles.assignedLabel}>MY ASSIGNED DUMPER</Text>
          <Text style={styles.assignedDumper}>{user.assignedDumper}</Text>
          <Text style={styles.assignedHint}>Tap to view details →</Text>
        </TouchableOpacity>
      )}

      {/* Stats Section */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Tyre Overview</Text>
      </View>

      <View style={styles.statsRow}>
        <View style={[styles.statCard, { flex: 2 }]}>
          <Text style={styles.statNumber}>{tyres.length}</Text>
          <Text style={styles.statLabel}>Total Tyres</Text>
        </View>
      </View>
      <View style={styles.statsRow}>
        <View style={[styles.statCard, { borderColor: Colors.good }]}>
          <Text style={[styles.statNumber, { color: Colors.good }]}>{goodCount}</Text>
          <Text style={styles.statLabel}>✅ Good</Text>
        </View>
        <View style={[styles.statCard, { borderColor: Colors.warning }]}>
          <Text style={[styles.statNumber, { color: Colors.warning }]}>{warningCount}</Text>
          <Text style={styles.statLabel}>⚠️ Warning</Text>
        </View>
        <View style={[styles.statCard, { borderColor: Colors.critical }]}>
          <Text style={[styles.statNumber, { color: Colors.critical }]}>{criticalCount}</Text>
          <Text style={styles.statLabel}>🔴 Critical</Text>
        </View>
      </View>

      {/* Recent Alerts */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Recent Alerts</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Alerts')}>
          <Text style={styles.seeAll}>See All →</Text>
        </TouchableOpacity>
      </View>

      {alerts.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyText}>✅ No active alerts. All systems normal.</Text>
        </View>
      ) : (
        alerts.map((alert, i) => (
          <View key={alert.id || i} style={styles.alertCard}>
            <View style={styles.alertHeader}>
              <Text style={styles.alertIcon}>
                {alert.category === 'Critical' ? '🔴' : '⚠️'}
              </Text>
              <StatusBadge status={alert.category} />
            </View>
            <Text style={styles.alertMessage}>{alert.message}</Text>
            <Text style={styles.alertDetail}>{alert.details}</Text>
            {alert.tyreId && (
              <Text style={styles.alertMeta}>Tyre: {alert.tyreId}</Text>
            )}
          </View>
        ))
      )}

      <View style={{ height: 20 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background },
  loadingText: { color: Colors.textSecondary, marginTop: 12 },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    paddingTop: 52,
    backgroundColor: Colors.surface,
  },
  greeting: { fontSize: 14, color: Colors.textSecondary },
  userName: { fontSize: 22, fontWeight: '800', color: Colors.text, marginTop: 2 },
  rolePill: {
    backgroundColor: Colors.primary,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 3,
    alignSelf: 'flex-start',
    marginTop: 6,
  },
  roleText: { color: Colors.black, fontSize: 11, fontWeight: '700' },
  headerIcon: { fontSize: 40 },

  assignedCard: {
    backgroundColor: Colors.surfaceLight,
    margin: 16,
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
  },
  assignedLabel: { fontSize: 11, color: Colors.textMuted, fontWeight: '600', letterSpacing: 1 },
  assignedDumper: { fontSize: 28, fontWeight: '900', color: Colors.primary, marginVertical: 4 },
  assignedHint: { fontSize: 12, color: Colors.textSecondary },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 10,
  },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: Colors.text },
  seeAll: { fontSize: 13, color: Colors.primary, fontWeight: '600' },

  statsRow: { flexDirection: 'row', paddingHorizontal: 16, gap: 10, marginBottom: 10 },
  statCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.surfaceLight,
  },
  statNumber: { fontSize: 30, fontWeight: '900', color: Colors.text },
  statLabel: { fontSize: 12, color: Colors.textSecondary, marginTop: 4, textAlign: 'center' },

  alertCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: Colors.critical,
  },
  alertHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  alertIcon: { fontSize: 16 },
  alertMessage: { fontSize: 15, fontWeight: '700', color: Colors.text, marginBottom: 4 },
  alertDetail: { fontSize: 13, color: Colors.textSecondary },
  alertMeta: { fontSize: 12, color: Colors.textMuted, marginTop: 4 },

  emptyCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 16,
    alignItems: 'center',
  },
  emptyText: { color: Colors.good, fontSize: 14 },

  badge: { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  badgeText: { fontSize: 11, fontWeight: '800', letterSpacing: 1 },
});
