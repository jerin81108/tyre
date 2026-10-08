// screens/MaintenanceScreen.js
// Phase 15: View all maintenance history

import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, ActivityIndicator,
  TouchableOpacity, RefreshControl
} from 'react-native';
import { getAllMaintenance } from '../services/maintenanceService';
import Colors from '../constants/colors';

const SERVICE_ICONS = {
  Inspection: '🔍', Repair: '🔩', Rotation: '🔄',
  'Pressure Adjustment': '💨', Replacement: '🔄', Other: '🔧'
};

export default function MaintenanceScreen() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const fetchRecords = async () => {
    try {
      const res = await getAllMaintenance();
      setRecords(res.data || []);
      setError(null);
    } catch (e) {
      setError('Unable to connect to server.\nPlease check your internet connection.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchRecords(); }, []);
  const onRefresh = useCallback(() => { setRefreshing(true); fetchRecords(); }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading maintenance records...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Maintenance History</Text>
        <Text style={styles.subtitle}>{records.length} records total</Text>
      </View>

      {error ? (
        <View style={styles.center}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={fetchRecords}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={records}
          keyExtractor={item => item.id}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.center}>
              <Text style={styles.emptyText}>No maintenance records found.</Text>
            </View>
          }
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.iconCircle}>
                  <Text style={styles.iconText}>{SERVICE_ICONS[item.serviceType] || '🔧'}</Text>
                </View>
                <View style={styles.cardMain}>
                  <Text style={styles.tyreId}>{item.tyreId}</Text>
                  <Text style={styles.serviceType}>{item.serviceType}</Text>
                </View>
                <Text style={styles.date}>{item.date?.split('T')[0]}</Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.cardFooter}>
                <Text style={styles.infoText}>👨‍🔧 {item.technician}</Text>
                {item.cost > 0 && <Text style={styles.costText}>₹{item.cost}</Text>}
              </View>
              {item.description ? (
                <Text style={styles.description}>{item.description}</Text>
              ) : null}
              {item.nextServiceDate ? (
                <Text style={styles.nextService}>📅 Next Service: {item.nextServiceDate}</Text>
              ) : null}
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background, padding: 24 },
  loadingText: { color: Colors.textSecondary, marginTop: 12 },
  errorText: { color: Colors.textSecondary, textAlign: 'center', marginBottom: 16 },
  retryBtn: { backgroundColor: Colors.primary, borderRadius: 8, paddingHorizontal: 24, paddingVertical: 10 },
  retryText: { color: Colors.black, fontWeight: '700' },
  header: {
    backgroundColor: Colors.surface, paddingHorizontal: 20, paddingTop: 52, paddingBottom: 16,
  },
  title: { fontSize: 26, fontWeight: '900', color: Colors.text },
  subtitle: { fontSize: 13, color: Colors.textSecondary, marginTop: 2 },
  list: { padding: 16, paddingBottom: 20 },
  card: {
    backgroundColor: Colors.surface, borderRadius: 14, padding: 16, marginBottom: 12,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconCircle: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: Colors.surfaceLight, justifyContent: 'center', alignItems: 'center',
  },
  iconText: { fontSize: 20 },
  cardMain: { flex: 1 },
  tyreId: { fontSize: 16, fontWeight: '800', color: Colors.primary },
  serviceType: { fontSize: 13, color: Colors.text, marginTop: 2 },
  date: { fontSize: 12, color: Colors.textMuted },
  divider: { height: 1, backgroundColor: Colors.surfaceLight, marginVertical: 10 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  infoText: { fontSize: 13, color: Colors.textSecondary },
  costText: { fontSize: 13, fontWeight: '700', color: Colors.good },
  description: { fontSize: 13, color: Colors.textMuted, marginTop: 6, fontStyle: 'italic' },
  nextService: { fontSize: 12, color: Colors.warning, marginTop: 6 },
  emptyText: { color: Colors.textSecondary },
});
