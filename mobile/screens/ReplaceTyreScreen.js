// screens/ReplaceTyreScreen.js
// Phase 18: Replace a tyre

import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  Alert, ScrollView, ActivityIndicator
} from 'react-native';
import api from '../services/api';
import Colors from '../constants/colors';

export default function ReplaceTyreScreen({ route, navigation }) {
  const { tyreId, dumperId } = route.params;
  const [newTyreId, setNewTyreId] = useState('');
  const [reason, setReason] = useState('');
  const [technician, setTechnician] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleReplace = async () => {
    if (!newTyreId.trim() || !technician.trim()) {
      Alert.alert('Validation Error', 'Please enter new tyre ID and technician name.');
      return;
    }

    Alert.alert(
      'Confirm Replacement',
      `Are you sure you want to replace ${tyreId} with ${newTyreId}?\n\nThe old tyre history will be preserved.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm Replace',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            try {
              // 1. Mark old tyre as Replaced
              await api.put(`/tyres/${tyreId}`, { status: 'Replaced', condition: 'Replaced' });

              // 2. Add maintenance record for the replacement
              await api.post('/maintenance', {
                tyreId,
                serviceType: 'Replacement',
                technician: technician.trim(),
                description: `Replaced with ${newTyreId}. Reason: ${reason}`,
                date: new Date().toISOString(),
              });

              setSubmitted(true);
            } catch (e) {
              Alert.alert('Error', 'Unable to complete replacement. Please check your connection.');
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  if (submitted) {
    return (
      <View style={styles.successContainer}>
        <Text style={styles.successIcon}>🔄</Text>
        <Text style={styles.successTitle}>Tyre Replaced Successfully!</Text>
        <Text style={styles.successText}>Old tyre history has been preserved.</Text>
        <View style={styles.successDetails}>
          <Text style={styles.detailRow}>Old Tyre: <Text style={[styles.detailValue, { color: Colors.replaced }]}>{tyreId} → REPLACED</Text></Text>
          <Text style={styles.detailRow}>New Tyre: <Text style={[styles.detailValue, { color: Colors.good }]}>{newTyreId} → GOOD</Text></Text>
          <Text style={styles.detailRow}>Technician: <Text style={styles.detailValue}>{technician}</Text></Text>
        </View>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.navigate('MainTabs')}>
          <Text style={styles.backBtnText}>← Back to Home</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.header}>
        <Text style={styles.tyreId}>{tyreId}</Text>
        <Text style={styles.headerSub}>Replace this tyre with a new one</Text>
      </View>

      <View style={styles.body}>
        <View style={styles.warningBox}>
          <Text style={styles.warningText}>
            ⚠️ The old tyre ({tyreId}) will be marked as REPLACED. Its maintenance history will NOT be deleted.
          </Text>
        </View>

        <Text style={styles.label}>NEW TYRE ID</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. T-007"
          placeholderTextColor={Colors.textMuted}
          value={newTyreId}
          onChangeText={setNewTyreId}
          autoCapitalize="characters"
        />

        <Text style={styles.label}>REASON FOR REPLACEMENT</Text>
        <TextInput
          style={styles.textArea}
          placeholder="e.g. Severe crack on sidewall"
          placeholderTextColor={Colors.textMuted}
          value={reason}
          onChangeText={setReason}
          multiline
          numberOfLines={3}
        />

        <Text style={styles.label}>TECHNICIAN NAME</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Arun Singh"
          placeholderTextColor={Colors.textMuted}
          value={technician}
          onChangeText={setTechnician}
        />

        <TouchableOpacity
          style={[styles.btn, loading && styles.btnDisabled]}
          onPress={handleReplace}
          disabled={loading}
        >
          {loading
            ? <ActivityIndicator color={Colors.white} />
            : <Text style={styles.btnText}>REPLACE TYRE</Text>
          }
        </TouchableOpacity>
      </View>
      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { backgroundColor: Colors.surface, padding: 20, paddingTop: 10 },
  tyreId: { fontSize: 24, fontWeight: '900', color: Colors.warning },
  headerSub: { fontSize: 13, color: Colors.textSecondary, marginTop: 4 },
  body: { padding: 20 },
  warningBox: {
    backgroundColor: Colors.warningBg, borderRadius: 12, padding: 14,
    borderLeftWidth: 4, borderLeftColor: Colors.warning, marginBottom: 20,
  },
  warningText: { color: Colors.warning, fontSize: 13 },
  label: { fontSize: 11, color: Colors.textMuted, fontWeight: '600', letterSpacing: 1, marginBottom: 8, marginTop: 16 },
  input: {
    backgroundColor: Colors.surface, borderRadius: 12, padding: 14,
    color: Colors.text, fontSize: 15, marginBottom: 4,
  },
  textArea: {
    backgroundColor: Colors.surface, borderRadius: 12, padding: 14,
    color: Colors.text, fontSize: 14, textAlignVertical: 'top', minHeight: 80,
  },
  btn: { backgroundColor: Colors.warning, borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 24 },
  btnDisabled: { opacity: 0.6 },
  btnText: { color: Colors.black, fontWeight: '800', fontSize: 15, letterSpacing: 1 },
  successContainer: { flex: 1, backgroundColor: Colors.background, justifyContent: 'center', alignItems: 'center', padding: 24 },
  successIcon: { fontSize: 56, marginBottom: 16 },
  successTitle: { fontSize: 22, fontWeight: '900', color: Colors.text, textAlign: 'center' },
  successText: { fontSize: 14, color: Colors.textSecondary, textAlign: 'center', marginTop: 8, marginBottom: 24 },
  successDetails: { backgroundColor: Colors.surface, borderRadius: 12, padding: 20, width: '100%', gap: 12 },
  detailRow: { fontSize: 14, color: Colors.textSecondary },
  detailValue: { fontWeight: '700', color: Colors.text },
  backBtn: { marginTop: 24 },
  backBtnText: { color: Colors.primary, fontWeight: '700', fontSize: 15 },
});
