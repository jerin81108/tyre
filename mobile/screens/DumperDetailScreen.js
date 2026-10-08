// screens/DumperDetailScreen.js
// Phase 11: Tyre layout view for a single dumper

import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator
} from 'react-native';
import { getDumperById } from '../services/dumperService';
import { getTyresByDumper } from '../services/tyreService';
import Colors from '../constants/colors';

const statusColor = (s) => ({
  Good: Colors.good, Warning: Colors.warning, Critical: Colors.critical
}[s] || Colors.textMuted);

const statusBg = (s) => ({
  Good: Colors.goodBg, Warning: Colors.warningBg, Critical: Colors.criticalBg
}[s] || Colors.surfaceLight);

const TyreCard = ({ tyre, onPress }) => {
  const sc = statusColor(tyre?.status);
  const sb = statusBg(tyre?.status);
  return (
    <TouchableOpacity
      style={[styles.tyreCard, { borderColor: sc, backgroundColor: sb }]}
      onPress={onPress}
    >
      <Text style={[styles.tyreId, { color: sc }]}>{tyre?.id || '—'}</Text>
      <Text style={styles.tyrePressure}>{tyre?.pressure ?? '—'} PSI</Text>
      <View style={[styles.tyreBadge, { backgroundColor: sc }]}>
        <Text style={styles.tyreBadgeText}>{tyre?.status?.toUpperCase() || 'N/A'}</Text>
      </View>
    </TouchableOpacity>
  );
};

const EmptyTyre = ({ label }) => (
  <View style={styles.emptyTyre}>
    <Text style={styles.emptyTyreText}>{label}</Text>
  </View>
);

export default function DumperDetailScreen({ route, navigation }) {
  const { dumperId } = route.params;
  const [dumper, setDumper] = useState(null);
  const [tyres, setTyres] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dumperRes, tyreRes] = await Promise.all([
          getDumperById(dumperId),
          getTyresByDumper(dumperId)
        ]);
        setDumper(dumperRes.data);
        setTyres(tyreRes.data || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [dumperId]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading dumper details...</Text>
      </View>
    );
  }

  // Sort tyres by position order
  const positionOrder = ['Front Left', 'Front Right', 'Middle Left', 'Middle Right', 'Rear Left', 'Rear Right'];
  const sortedTyres = positionOrder.map(pos => tyres.find(t => t.position === pos) || null);
  const navigate = (tyre) => {
    if (tyre) navigation.navigate('TyreDetail', { tyreId: tyre.id });
  };

  return (
    <ScrollView style={styles.container}>
      {/* Dumper Info Card */}
      <View style={styles.infoCard}>
        <Text style={styles.dumperIdText}>{dumper?.id}</Text>
        <Text style={styles.registration}>{dumper?.registration}</Text>
        <View style={styles.infoGrid}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>MODEL</Text>
            <Text style={styles.infoValue}>{dumper?.model}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>LOCATION</Text>
            <Text style={styles.infoValue}>{dumper?.location}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>STATUS</Text>
            <Text style={[styles.infoValue, { color: Colors.good }]}>{dumper?.status}</Text>
          </View>
        </View>
      </View>

      {/* Tyre Layout */}
      <View style={styles.layoutSection}>
        <Text style={styles.sectionTitle}>🚛 Tyre Layout</Text>

        <View style={styles.layoutContainer}>
          {/* FRONT label */}
          <Text style={styles.axleLabel}>FRONT</Text>

          {/* Row 1: Front Left, Front Right */}
          <View style={styles.tyreRow}>
            {sortedTyres[0]
              ? <TyreCard tyre={sortedTyres[0]} onPress={() => navigate(sortedTyres[0])} />
              : <EmptyTyre label="Front Left" />}
            {sortedTyres[1]
              ? <TyreCard tyre={sortedTyres[1]} onPress={() => navigate(sortedTyres[1])} />
              : <EmptyTyre label="Front Right" />}
          </View>

          {/* Row 2: Middle Left, Middle Right */}
          <View style={styles.tyreRow}>
            {sortedTyres[2]
              ? <TyreCard tyre={sortedTyres[2]} onPress={() => navigate(sortedTyres[2])} />
              : <EmptyTyre label="Middle Left" />}
            {sortedTyres[3]
              ? <TyreCard tyre={sortedTyres[3]} onPress={() => navigate(sortedTyres[3])} />
              : <EmptyTyre label="Middle Right" />}
          </View>

          {/* Row 3: Rear Left, Rear Right */}
          <View style={styles.tyreRow}>
            {sortedTyres[4]
              ? <TyreCard tyre={sortedTyres[4]} onPress={() => navigate(sortedTyres[4])} />
              : <EmptyTyre label="Rear Left" />}
            {sortedTyres[5]
              ? <TyreCard tyre={sortedTyres[5]} onPress={() => navigate(sortedTyres[5])} />
              : <EmptyTyre label="Rear Right" />}
          </View>

          {/* REAR label */}
          <Text style={styles.axleLabel}>REAR</Text>
        </View>

        <Text style={styles.tapHint}>Tap a tyre card to view details</Text>
      </View>
      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background },
  loadingText: { color: Colors.textSecondary, marginTop: 12 },

  infoCard: {
    backgroundColor: Colors.surface,
    padding: 20,
    margin: 16,
    borderRadius: 14,
  },
  dumperIdText: { fontSize: 28, fontWeight: '900', color: Colors.primary },
  registration: { fontSize: 14, color: Colors.textSecondary, marginBottom: 16 },
  infoGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16 },
  infoItem: { minWidth: 80 },
  infoLabel: { fontSize: 10, color: Colors.textMuted, fontWeight: '600', letterSpacing: 1 },
  infoValue: { fontSize: 14, fontWeight: '700', color: Colors.text, marginTop: 2 },

  layoutSection: { paddingHorizontal: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: Colors.text, marginBottom: 16 },

  layoutContainer: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 20,
    alignItems: 'center',
  },
  axleLabel: {
    fontSize: 11,
    color: Colors.textMuted,
    fontWeight: '700',
    letterSpacing: 3,
    marginVertical: 8,
  },
  tyreRow: {
    flexDirection: 'row',
    gap: 16,
    marginVertical: 6,
  },

  tyreCard: {
    width: 130,
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    borderWidth: 2,
  },
  tyreId: { fontSize: 15, fontWeight: '900' },
  tyrePressure: { fontSize: 13, color: Colors.textSecondary, marginVertical: 4 },
  tyreBadge: { borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2, marginTop: 4 },
  tyreBadgeText: { fontSize: 9, fontWeight: '800', color: Colors.black, letterSpacing: 1 },

  emptyTyre: {
    width: 130,
    height: 90,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.surfaceLight,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyTyreText: { fontSize: 11, color: Colors.textMuted, textAlign: 'center' },
  tapHint: { fontSize: 12, color: Colors.textMuted, marginTop: 16, textAlign: 'center' },
});
