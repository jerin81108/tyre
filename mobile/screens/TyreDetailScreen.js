// screens/TyreDetailScreen.js
// Phase 12: Full tyre detail with all actions

import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  ActivityIndicator, Alert
} from 'react-native';
import { getTyreById } from '../services/tyreService';
import { getAllMaintenance } from '../services/maintenanceService';
import Colors from '../constants/colors';

const statusColor = (s) => ({ Good: Colors.good, Warning: Colors.warning, Critical: Colors.critical }[s] || Colors.textMuted);
const statusBg = (s) => ({ Good: Colors.goodBg, Warning: Colors.warningBg, Critical: Colors.criticalBg }[s] || Colors.surfaceLight);

const InfoRow = ({ label, value, valueColor }) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={[styles.infoValue, valueColor ? { color: valueColor } : {}]}>{value ?? '—'}</Text>
  </View>
);

const ActionButton = ({ emoji, label, color, onPress }) => (
  <TouchableOpacity style={[styles.actionBtn, { borderColor: color || Colors.primary }]} onPress={onPress}>
    <Text style={styles.actionEmoji}>{emoji}</Text>
    <Text style={[styles.actionLabel, { color: color || Colors.primary }]}>{label}</Text>
  </TouchableOpacity>
);

export default function TyreDetailScreen({ route, navigation }) {
  const { tyreId } = route.params;
  const [tyre, setTyre] = useState(null);
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState([]);

  const fetchData = async () => {
    try {
      const [tyreRes, maintRes] = await Promise.all([
        getTyreById(tyreId),
        getAllMaintenance()
      ]);
      setTyre(tyreRes.data);
      const all = maintRes.data || [];
      setHistory(all.filter(r => r.tyreId === tyreId).slice(0, 3));
    } catch (e) {
      Alert.alert('Error', 'Tyre not found.');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [tyreId]);

  // Focus listener to re-fetch when returning from sub-screens
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', fetchData);
    return unsubscribe;
  }, [navigation]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading tyre details...</Text>
      </View>
    );
  }

  const sc = statusColor(tyre?.status);
  const sb = statusBg(tyre?.status);

  // Calculate status reason for display
  const getStatusReason = () => {
    if (!tyre) return '';
    const p = tyre.pressure;
    const tr = tyre.tread;
    if (tyre.condition === 'Damaged') return 'Tyre has reported damage';
    if (p < 75) return `Low tyre pressure (${p} PSI vs ${tyre.recommendedPressure} PSI recommended)`;
    if (tr < 50) return `Critical tread wear (${tr}%)`;
    if (p < 90) return `Pressure below recommended (${p} PSI vs ${tyre.recommendedPressure} PSI)`;
    if (tr < 70) return `Tread wear at warning level (${tr}%)`;
    return 'All parameters within acceptable range';
  };

  return (
    <ScrollView style={styles.container}>
      {/* Status Banner */}
      <View style={[styles.statusBanner, { backgroundColor: sb, borderColor: sc }]}>
        <Text style={styles.tyreIdText}>{tyre?.id}</Text>
        <View style={[styles.statusPill, { backgroundColor: sc }]}>
          <Text style={styles.statusPillText}>{tyre?.status?.toUpperCase()}</Text>
        </View>
        <Text style={styles.positionText}>{tyre?.position}</Text>
        <Text style={[styles.reasonText, { color: sc }]}>⚠ {getStatusReason()}</Text>
      </View>

      {/* Pressure & Tread */}
      <View style={styles.metricsRow}>
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>CURRENT PRESSURE</Text>
          <Text style={[styles.metricValue, { color: statusColor(tyre?.status) }]}>
            {tyre?.pressure} <Text style={styles.metricUnit}>PSI</Text>
          </Text>
          <Text style={styles.metricSub}>Recommended: {tyre?.recommendedPressure} PSI</Text>
        </View>
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>TREAD DEPTH</Text>
          <Text style={[styles.metricValue, { color: tyre?.tread < 50 ? Colors.critical : tyre?.tread < 70 ? Colors.warning : Colors.good }]}>
            {tyre?.tread}<Text style={styles.metricUnit}>%</Text>
          </Text>
          <Text style={styles.metricSub}>Min: 50% (Warning)</Text>
        </View>
      </View>

      {/* Tyre Details */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Tyre Information</Text>
        <InfoRow label="Dumper" value={tyre?.dumperId} />
        <InfoRow label="Brand" value={tyre?.brand} />
        <InfoRow label="Size" value={tyre?.size} />
        <InfoRow label="Condition" value={tyre?.condition} valueColor={statusColor(tyre?.status)} />
        <InfoRow label="Installation Date" value={tyre?.installationDate} />
        <InfoRow label="Usage Hours" value={tyre?.totalUsageHours ? `${tyre.totalUsageHours} hrs` : null} />
        <InfoRow label="Last Service" value={tyre?.lastServiceDate} />
        <InfoRow label="Next Service" value={tyre?.nextServiceDate} />
      </View>

      {/* Actions */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Actions</Text>
        <View style={styles.actionsGrid}>
          <ActionButton emoji="💨" label="Update Pressure"
            onPress={() => navigation.navigate('UpdatePressure', { tyreId: tyre.id, currentPressure: tyre.pressure })} />
          <ActionButton emoji="🔴" label="Report Damage" color={Colors.critical}
            onPress={() => navigation.navigate('ReportDamage', { tyreId: tyre.id })} />
          <ActionButton emoji="🔧" label="Add Maintenance"
            onPress={() => navigation.navigate('AddMaintenance', { tyreId: tyre.id })} />
          <ActionButton emoji="🔄" label="Replace Tyre" color={Colors.warning}
            onPress={() => navigation.navigate('ReplaceTyre', { tyreId: tyre.id, dumperId: tyre.dumperId })} />
        </View>
      </View>

      {/* Recent Maintenance */}
      {history.length > 0 && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Recent Maintenance</Text>
          {history.map((record, i) => (
            <View key={record.id || i} style={styles.historyItem}>
              <View style={styles.historyDot} />
              <View style={styles.historyContent}>
                <Text style={styles.historyType}>{record.serviceType}</Text>
                <Text style={styles.historyDate}>{record.date?.split('T')[0]}</Text>
                <Text style={styles.historyTech}>Technician: {record.technician}</Text>
              </View>
            </View>
          ))}
        </View>
      )}
      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background },
  loadingText: { color: Colors.textSecondary, marginTop: 12 },

  statusBanner: {
    margin: 16,
    borderRadius: 14,
    padding: 20,
    borderWidth: 2,
    alignItems: 'center',
  },
  tyreIdText: { fontSize: 28, fontWeight: '900', color: Colors.text, marginBottom: 8 },
  statusPill: { borderRadius: 8, paddingHorizontal: 14, paddingVertical: 4, marginBottom: 8 },
  statusPillText: { color: Colors.black, fontWeight: '900', fontSize: 14, letterSpacing: 2 },
  positionText: { fontSize: 15, color: Colors.textSecondary, marginBottom: 8 },
  reasonText: { fontSize: 13, fontStyle: 'italic', textAlign: 'center' },

  metricsRow: { flexDirection: 'row', paddingHorizontal: 16, gap: 10, marginBottom: 10 },
  metricCard: {
    flex: 1, backgroundColor: Colors.surface, borderRadius: 12, padding: 16,
  },
  metricLabel: { fontSize: 10, color: Colors.textMuted, fontWeight: '600', letterSpacing: 1 },
  metricValue: { fontSize: 30, fontWeight: '900', marginTop: 4 },
  metricUnit: { fontSize: 14, fontWeight: '400' },
  metricSub: { fontSize: 11, color: Colors.textMuted, marginTop: 4 },

  card: { backgroundColor: Colors.surface, borderRadius: 14, padding: 16, margin: 16, marginTop: 0, marginBottom: 10 },
  cardTitle: { fontSize: 16, fontWeight: '800', color: Colors.text, marginBottom: 14 },

  infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: Colors.surfaceLight },
  infoLabel: { fontSize: 13, color: Colors.textSecondary },
  infoValue: { fontSize: 13, fontWeight: '600', color: Colors.text },

  actionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.surfaceLight,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderWidth: 1,
  },
  actionEmoji: { fontSize: 16 },
  actionLabel: { fontSize: 13, fontWeight: '700' },

  historyItem: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  historyDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.primary, marginTop: 5 },
  historyContent: { flex: 1 },
  historyType: { fontSize: 14, fontWeight: '700', color: Colors.text },
  historyDate: { fontSize: 12, color: Colors.textMuted },
  historyTech: { fontSize: 12, color: Colors.textSecondary },
});
