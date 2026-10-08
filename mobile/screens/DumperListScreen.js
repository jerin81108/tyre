// screens/DumperListScreen.js
// Phase 11: List of all dumpers

import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  ActivityIndicator, TextInput, RefreshControl
} from 'react-native';
import { getAllDumpers } from '../services/dumperService';
import Colors from '../constants/colors';

const StatusDot = ({ status }) => {
  const color = status === 'Active' ? Colors.good : Colors.critical;
  return <View style={[styles.dot, { backgroundColor: color }]} />;
};

export default function DumperListScreen({ navigation }) {
  const [dumpers, setDumpers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const fetchDumpers = async () => {
    try {
      const res = await getAllDumpers();
      setDumpers(res.data || []);
      setFiltered(res.data || []);
      setError(null);
    } catch (e) {
      setError('Unable to connect to server.\nPlease check your internet connection.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchDumpers(); }, []);

  const onRefresh = useCallback(() => { setRefreshing(true); fetchDumpers(); }, []);

  useEffect(() => {
    if (!search) { setFiltered(dumpers); return; }
    const q = search.toLowerCase();
    setFiltered(dumpers.filter(d =>
      d.id?.toLowerCase().includes(q) ||
      d.registration?.toLowerCase().includes(q) ||
      d.model?.toLowerCase().includes(q) ||
      d.location?.toLowerCase().includes(q)
    ));
  }, [search, dumpers]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading dumpers...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorIcon}>⚠️</Text>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryBtn} onPress={fetchDumpers}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Dumpers</Text>
        <Text style={styles.subtitle}>{dumpers.length} vehicles registered</Text>
      </View>

      {/* Search */}
      <View style={styles.searchBox}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by ID, registration, location..."
          placeholderTextColor={Colors.textMuted}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.center}>
            <Text style={styles.emptyText}>No dumpers found.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('DumperDetail', { dumperId: item.id })}
          >
            <View style={styles.cardHeader}>
              <View>
                <Text style={styles.dumperId}>{item.id}</Text>
                <Text style={styles.registration}>{item.registration}</Text>
              </View>
              <View style={styles.statusPill}>
                <StatusDot status={item.status} />
                <Text style={styles.statusText}>{item.status}</Text>
              </View>
            </View>
            <View style={styles.divider} />
            <View style={styles.cardFooter}>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>MODEL</Text>
                <Text style={styles.infoValue}>{item.model}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>LOCATION</Text>
                <Text style={styles.infoValue}>{item.location}</Text>
              </View>
            </View>
            <Text style={styles.tapHint}>Tap to view tyres →</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background, padding: 24 },
  loadingText: { color: Colors.textSecondary, marginTop: 12 },
  errorIcon: { fontSize: 36, marginBottom: 12 },
  errorText: { color: Colors.textSecondary, textAlign: 'center', marginBottom: 16 },
  retryBtn: { backgroundColor: Colors.primary, borderRadius: 8, paddingHorizontal: 24, paddingVertical: 10 },
  retryText: { color: Colors.black, fontWeight: '700' },

  header: {
    backgroundColor: Colors.surface,
    paddingHorizontal: 20,
    paddingTop: 52,
    paddingBottom: 16,
  },
  title: { fontSize: 26, fontWeight: '900', color: Colors.text },
  subtitle: { fontSize: 13, color: Colors.textSecondary, marginTop: 2 },

  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    margin: 16,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  searchIcon: { fontSize: 16, marginRight: 8 },
  searchInput: { flex: 1, color: Colors.text, fontSize: 14 },

  list: { paddingHorizontal: 16, paddingBottom: 20 },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  dumperId: { fontSize: 22, fontWeight: '900', color: Colors.primary },
  registration: { fontSize: 13, color: Colors.textSecondary, marginTop: 2 },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceLight,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    gap: 6,
  },
  dot: { width: 8, height: 8, borderRadius: 4 },
  statusText: { fontSize: 12, fontWeight: '700', color: Colors.text },
  divider: { height: 1, backgroundColor: Colors.surfaceLight, marginVertical: 12 },
  cardFooter: { flexDirection: 'row', gap: 24 },
  infoItem: {},
  infoLabel: { fontSize: 10, color: Colors.textMuted, fontWeight: '600', letterSpacing: 1 },
  infoValue: { fontSize: 14, color: Colors.text, fontWeight: '600', marginTop: 2 },
  tapHint: { fontSize: 11, color: Colors.primary, marginTop: 12, textAlign: 'right' },
  emptyText: { color: Colors.textSecondary },
});
