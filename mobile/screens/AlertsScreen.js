// screens/AlertsScreen.js
// Phase 16: View and manage all alerts

import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  ActivityIndicator, RefreshControl, Alert
} from 'react-native';
import { getAllAlerts, markAlertAsRead, resolveAlert } from '../services/alertService';
import Colors from '../constants/colors';

const TABS = ['All', 'Critical', 'Warning', 'Resolved'];

export default function AlertsScreen({ navigation }) {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('All');

  const fetchAlerts = async () => {
    try {
      const res = await getAllAlerts();
      setAlerts(res.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchAlerts(); }, []);
  const onRefresh = useCallback(() => { setRefreshing(true); fetchAlerts(); }, []);

  const filteredAlerts = alerts.filter(a => {
    if (activeTab === 'All') return a.status !== 'Resolved';
    if (activeTab === 'Resolved') return a.status === 'Resolved';
    return a.category === activeTab && a.status !== 'Resolved';
  });

  const handleMarkRead = async (alertId) => {
    try {
      await markAlertAsRead(alertId);
      setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, isRead: true } : a));
    } catch (e) {
      Alert.alert('Error', 'Unable to update alert.');
    }
  };

  const handleResolve = async (alertId) => {
    Alert.alert(
      'Resolve Alert',
      'Mark this alert as resolved?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Resolve',
          onPress: async () => {
            try {
              await resolveAlert(alertId);
              setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, status: 'Resolved' } : a));
            } catch (e) {
              Alert.alert('Error', 'Unable to resolve alert.');
            }
          }
        }
      ]
    );
  };

  const activeCount = alerts.filter(a => a.status !== 'Resolved').length;

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading alerts...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>Alerts</Text>
          {activeCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{activeCount}</Text>
            </View>
          )}
        </View>
        <Text style={styles.subtitle}>{alerts.length} total alerts</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabRow}>
        {TABS.map(tab => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredAlerts}
        keyExtractor={item => item.id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.center}>
            <Text style={styles.emptyIcon}>✅</Text>
            <Text style={styles.emptyText}>
              {activeTab === 'Resolved' ? 'No resolved alerts yet.' : 'No active alerts in this category.'}
            </Text>
          </View>
        }
        renderItem={({ item }) => {
          const isCritical = item.category === 'Critical';
          const isResolved = item.status === 'Resolved';
          const borderColor = isResolved ? Colors.textMuted : isCritical ? Colors.critical : Colors.warning;

          return (
            <View style={[styles.alertCard, { borderLeftColor: borderColor }, !item.isRead && styles.unread]}>
              <View style={styles.alertHeader}>
                <Text style={styles.alertIcon}>{isCritical ? '🔴' : isResolved ? '✅' : '⚠️'}</Text>
                <View style={[styles.alertBadge, { backgroundColor: borderColor }]}>
                  <Text style={styles.alertBadgeText}>
                    {isResolved ? 'RESOLVED' : item.category?.toUpperCase()}
                  </Text>
                </View>
                {!item.isRead && !isResolved && <View style={styles.unreadDot} />}
              </View>

              <Text style={styles.alertMessage}>{item.message}</Text>
              {item.details && <Text style={styles.alertDetail}>{item.details}</Text>}
              {item.tyreId && <Text style={styles.alertMeta}>Tyre: {item.tyreId}</Text>}
              {item.createdAt && (
                <Text style={styles.alertTime}>{item.createdAt?.split('T')[0]}</Text>
              )}

              {!isResolved && (
                <View style={styles.actionRow}>
                  {!item.isRead && (
                    <TouchableOpacity style={styles.actionBtn} onPress={() => handleMarkRead(item.id)}>
                      <Text style={styles.actionBtnText}>Mark Read</Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity
                    style={[styles.actionBtn, styles.resolveBtn]}
                    onPress={() => handleResolve(item.id)}
                  >
                    <Text style={styles.resolveBtnText}>Resolve</Text>
                  </TouchableOpacity>
                  {item.tyreId && (
                    <TouchableOpacity
                      style={[styles.actionBtn, styles.viewBtn]}
                      onPress={() => navigation.navigate('TyreDetail', { tyreId: item.tyreId })}
                    >
                      <Text style={styles.viewBtnText}>View Tyre</Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background, padding: 24 },
  loadingText: { color: Colors.textSecondary, marginTop: 12 },

  header: { backgroundColor: Colors.surface, paddingHorizontal: 20, paddingTop: 52, paddingBottom: 16 },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  title: { fontSize: 26, fontWeight: '900', color: Colors.text },
  badge: { backgroundColor: Colors.critical, borderRadius: 12, paddingHorizontal: 8, paddingVertical: 2 },
  badgeText: { color: Colors.white, fontWeight: '800', fontSize: 12 },
  subtitle: { fontSize: 13, color: Colors.textSecondary, marginTop: 4 },

  tabRow: { flexDirection: 'row', backgroundColor: Colors.surface, paddingHorizontal: 16, paddingBottom: 12, gap: 8 },
  tab: { paddingVertical: 6, paddingHorizontal: 14, borderRadius: 20, backgroundColor: Colors.surfaceLight },
  tabActive: { backgroundColor: Colors.primary },
  tabText: { fontSize: 13, color: Colors.textSecondary, fontWeight: '600' },
  tabTextActive: { color: Colors.black },

  list: { padding: 16, paddingBottom: 20 },

  alertCard: {
    backgroundColor: Colors.surface, borderRadius: 14, padding: 16,
    marginBottom: 12, borderLeftWidth: 4,
  },
  unread: { borderWidth: 1, borderColor: Colors.surfaceLight },
  alertHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  alertIcon: { fontSize: 18 },
  alertBadge: { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  alertBadgeText: { fontSize: 10, fontWeight: '800', color: Colors.black, letterSpacing: 1 },
  unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.critical, marginLeft: 'auto' },
  alertMessage: { fontSize: 15, fontWeight: '700', color: Colors.text, marginBottom: 4 },
  alertDetail: { fontSize: 13, color: Colors.textSecondary, marginBottom: 4 },
  alertMeta: { fontSize: 12, color: Colors.textMuted },
  alertTime: { fontSize: 11, color: Colors.textMuted, marginTop: 4 },
  actionRow: { flexDirection: 'row', gap: 8, marginTop: 12 },
  actionBtn: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 8, backgroundColor: Colors.surfaceLight },
  actionBtnText: { fontSize: 12, color: Colors.textSecondary, fontWeight: '600' },
  resolveBtn: { backgroundColor: Colors.goodBg },
  resolveBtnText: { fontSize: 12, color: Colors.good, fontWeight: '700' },
  viewBtn: { backgroundColor: Colors.surfaceLight, borderWidth: 1, borderColor: Colors.primary },
  viewBtnText: { fontSize: 12, color: Colors.primary, fontWeight: '700' },
  emptyIcon: { fontSize: 40, marginBottom: 12 },
  emptyText: { color: Colors.textSecondary, textAlign: 'center' },
});
