// screens/UpdatePressureScreen.js
// Phase 13: Update tyre pressure with automatic status calculation

import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  Alert, ActivityIndicator, KeyboardAvoidingView, Platform
} from 'react-native';
import { updateTyrePressure } from '../services/tyreService';
import Colors from '../constants/colors';

export default function UpdatePressureScreen({ route, navigation }) {
  const { tyreId, currentPressure } = route.params;
  const [pressure, setPressure] = useState(String(currentPressure || ''));
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleUpdate = async () => {
    const value = parseFloat(pressure);
    if (isNaN(value) || value < 0) {
      Alert.alert('Validation Error', 'Please enter a valid pressure (positive number).');
      return;
    }
    if (value > 300) {
      Alert.alert('Validation Error', 'Pressure value seems too high. Please check.');
      return;
    }

    setLoading(true);
    try {
      const res = await updateTyrePressure(tyreId, value);
      setResult(res.data);
    } catch (e) {
      Alert.alert('Error', 'Unable to update pressure. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const statusColor = (s) => ({ Good: Colors.good, Warning: Colors.warning, Critical: Colors.critical }[s] || Colors.textMuted);
  const statusBg = (s) => ({ Good: Colors.goodBg, Warning: Colors.warningBg, Critical: Colors.criticalBg }[s] || Colors.surfaceLight);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Header Info */}
      <View style={styles.header}>
        <Text style={styles.tyreId}>{tyreId}</Text>
        <Text style={styles.headerSub}>Enter the current tyre pressure reading</Text>
      </View>

      <View style={styles.body}>
        {/* Input */}
        <Text style={styles.label}>CURRENT PRESSURE (PSI)</Text>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={pressure}
            onChangeText={setPressure}
            keyboardType="numeric"
            placeholder="e.g. 95"
            placeholderTextColor={Colors.textMuted}
          />
          <Text style={styles.unit}>PSI</Text>
        </View>

        {/* Thresholds Guide */}
        <View style={styles.guide}>
          <Text style={styles.guideTitle}>Pressure Status Guide</Text>
          <View style={styles.guideRow}>
            <View style={[styles.guideDot, { backgroundColor: Colors.good }]} />
            <Text style={styles.guideText}>90 – 100+ PSI → GOOD</Text>
          </View>
          <View style={styles.guideRow}>
            <View style={[styles.guideDot, { backgroundColor: Colors.warning }]} />
            <Text style={styles.guideText}>75 – 89 PSI → WARNING</Text>
          </View>
          <View style={styles.guideRow}>
            <View style={[styles.guideDot, { backgroundColor: Colors.critical }]} />
            <Text style={styles.guideText}>Below 75 PSI → CRITICAL</Text>
          </View>
        </View>

        {/* Update Button */}
        <TouchableOpacity
          style={[styles.btn, loading && styles.btnDisabled]}
          onPress={handleUpdate}
          disabled={loading}
        >
          {loading
            ? <ActivityIndicator color={Colors.black} />
            : <Text style={styles.btnText}>UPDATE PRESSURE</Text>
          }
        </TouchableOpacity>

        {/* Result Card */}
        {result && (
          <View style={[styles.resultCard, { backgroundColor: statusBg(result.status), borderColor: statusColor(result.status) }]}>
            <Text style={styles.resultTitle}>✅ Pressure Updated Successfully!</Text>
            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Current Pressure:</Text>
              <Text style={styles.resultValue}>{result.pressure} PSI</Text>
            </View>
            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Status:</Text>
              <Text style={[styles.resultStatus, { color: statusColor(result.status) }]}>
                {result.status?.toUpperCase()}
              </Text>
            </View>
            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Reason:</Text>
              <Text style={styles.resultReason}>{result.reason}</Text>
            </View>
            {result.status !== 'Good' && (
              <Text style={styles.alertNote}>
                🔔 An alert has been automatically created for the maintenance team.
              </Text>
            )}
            <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
              <Text style={styles.backBtnText}>← Back to Tyre Details</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    backgroundColor: Colors.surface,
    padding: 20,
    paddingTop: 10,
  },
  tyreId: { fontSize: 24, fontWeight: '900', color: Colors.primary },
  headerSub: { fontSize: 13, color: Colors.textSecondary, marginTop: 4 },

  body: { padding: 20 },
  label: { fontSize: 11, color: Colors.textMuted, fontWeight: '600', letterSpacing: 1, marginBottom: 8 },

  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  input: { flex: 1, fontSize: 28, fontWeight: '800', color: Colors.text, paddingVertical: 16 },
  unit: { fontSize: 16, color: Colors.textSecondary, fontWeight: '600' },

  guide: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    gap: 8,
  },
  guideTitle: { fontSize: 13, fontWeight: '700', color: Colors.text, marginBottom: 4 },
  guideRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  guideDot: { width: 10, height: 10, borderRadius: 5 },
  guideText: { fontSize: 13, color: Colors.textSecondary },

  btn: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  btnDisabled: { opacity: 0.6 },
  btnText: { color: Colors.black, fontWeight: '800', fontSize: 15, letterSpacing: 2 },

  resultCard: {
    borderRadius: 12,
    padding: 20,
    borderWidth: 2,
    gap: 10,
  },
  resultTitle: { fontSize: 15, fontWeight: '700', color: Colors.text, marginBottom: 4 },
  resultRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  resultLabel: { fontSize: 13, color: Colors.textSecondary },
  resultValue: { fontSize: 14, fontWeight: '700', color: Colors.text },
  resultStatus: { fontSize: 16, fontWeight: '900', letterSpacing: 2 },
  resultReason: { fontSize: 13, color: Colors.textSecondary, flex: 1, textAlign: 'right' },
  alertNote: { fontSize: 12, color: Colors.warning, marginTop: 4, fontStyle: 'italic' },
  backBtn: { marginTop: 10, alignItems: 'center' },
  backBtnText: { color: Colors.primary, fontWeight: '700', fontSize: 14 },
});
