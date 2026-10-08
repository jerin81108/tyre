// screens/ReportDamageScreen.js
// Phase 14: Damage reporting screen

import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  Alert, ScrollView, ActivityIndicator
} from 'react-native';
import api from '../services/api';
import Colors from '../constants/colors';

const DAMAGE_TYPES = ['Cut', 'Puncture', 'Crack', 'Bulge', 'Uneven Wear', 'Other'];
const SEVERITY_LEVELS = ['Low', 'Medium', 'High', 'Critical'];
const SEVERITY_COLORS = { Low: Colors.good, Medium: Colors.warning, High: Colors.warning, Critical: Colors.critical };

const Selector = ({ label, options, selected, onSelect, colorMap }) => (
  <View style={styles.selectorSection}>
    <Text style={styles.label}>{label}</Text>
    <View style={styles.selectorRow}>
      {options.map(opt => (
        <TouchableOpacity
          key={opt}
          style={[
            styles.selectorBtn,
            selected === opt && styles.selectorBtnActive,
            colorMap && selected === opt && { borderColor: colorMap[opt], backgroundColor: colorMap[opt] + '22' }
          ]}
          onPress={() => onSelect(opt)}
        >
          <Text style={[
            styles.selectorText,
            selected === opt && styles.selectorTextActive,
            colorMap && selected === opt && { color: colorMap[opt] }
          ]}>
            {opt}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  </View>
);

export default function ReportDamageScreen({ route, navigation }) {
  const { tyreId } = route.params;
  const [damageType, setDamageType] = useState('');
  const [severity, setSeverity] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (!damageType || !severity) {
      Alert.alert('Validation Error', 'Please select damage type and severity.');
      return;
    }
    if (!description.trim()) {
      Alert.alert('Validation Error', 'Please enter a description of the damage.');
      return;
    }

    setLoading(true);
    try {
      await api.post('/damage-reports', {
        tyreId,
        damageType,
        severity,
        description,
        reportedAt: new Date().toISOString(),
      });

      // Also update tyre condition to Damaged if severity is High/Critical
      if (severity === 'High' || severity === 'Critical') {
        await api.put(`/tyres/${tyreId}`, { condition: 'Damaged', status: 'Critical' });
      }

      setSubmitted(true);
    } catch (e) {
      Alert.alert('Error', 'Unable to submit report. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <View style={styles.successContainer}>
        <Text style={styles.successIcon}>✅</Text>
        <Text style={styles.successTitle}>Damage Report Submitted!</Text>
        <Text style={styles.successText}>The maintenance team has been notified.</Text>
        <View style={styles.successDetails}>
          <Text style={styles.detailRow}>Tyre: <Text style={styles.detailValue}>{tyreId}</Text></Text>
          <Text style={styles.detailRow}>Type: <Text style={styles.detailValue}>{damageType}</Text></Text>
          <Text style={styles.detailRow}>Severity: <Text style={[styles.detailValue, { color: SEVERITY_COLORS[severity] }]}>{severity}</Text></Text>
        </View>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backBtnText}>← Back to Tyre Details</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.header}>
        <Text style={styles.tyreId}>{tyreId}</Text>
        <Text style={styles.headerSub}>Report a tyre damage or defect</Text>
      </View>

      <View style={styles.body}>
        <Selector label="DAMAGE TYPE" options={DAMAGE_TYPES} selected={damageType} onSelect={setDamageType} />
        <Selector label="SEVERITY" options={SEVERITY_LEVELS} selected={severity} onSelect={setSeverity} colorMap={SEVERITY_COLORS} />

        <Text style={styles.label}>DESCRIPTION</Text>
        <TextInput
          style={styles.textArea}
          placeholder="Describe the damage in detail..."
          placeholderTextColor={Colors.textMuted}
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
        />

        <TouchableOpacity
          style={[styles.btn, loading && styles.btnDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading
            ? <ActivityIndicator color={Colors.black} />
            : <Text style={styles.btnText}>SUBMIT DAMAGE REPORT</Text>
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
  tyreId: { fontSize: 24, fontWeight: '900', color: Colors.critical },
  headerSub: { fontSize: 13, color: Colors.textSecondary, marginTop: 4 },
  body: { padding: 20 },
  label: { fontSize: 11, color: Colors.textMuted, fontWeight: '600', letterSpacing: 1, marginBottom: 8, marginTop: 16 },
  selectorSection: { marginBottom: 4 },
  selectorRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  selectorBtn: {
    paddingVertical: 8, paddingHorizontal: 14, borderRadius: 8,
    borderWidth: 1, borderColor: Colors.surfaceLight, backgroundColor: Colors.surface,
  },
  selectorBtnActive: { borderColor: Colors.primary },
  selectorText: { fontSize: 13, color: Colors.textSecondary },
  selectorTextActive: { fontWeight: '700', color: Colors.primary },
  textArea: {
    backgroundColor: Colors.surface, borderRadius: 12, padding: 14,
    color: Colors.text, fontSize: 14, textAlignVertical: 'top', minHeight: 100, marginBottom: 20,
  },
  btn: { backgroundColor: Colors.critical, borderRadius: 12, padding: 16, alignItems: 'center' },
  btnDisabled: { opacity: 0.6 },
  btnText: { color: Colors.white, fontWeight: '800', fontSize: 15, letterSpacing: 1 },
  successContainer: { flex: 1, backgroundColor: Colors.background, justifyContent: 'center', alignItems: 'center', padding: 24 },
  successIcon: { fontSize: 56, marginBottom: 16 },
  successTitle: { fontSize: 22, fontWeight: '900', color: Colors.text, textAlign: 'center' },
  successText: { fontSize: 14, color: Colors.textSecondary, textAlign: 'center', marginTop: 8, marginBottom: 24 },
  successDetails: { backgroundColor: Colors.surface, borderRadius: 12, padding: 20, width: '100%', gap: 10 },
  detailRow: { fontSize: 14, color: Colors.textSecondary },
  detailValue: { fontWeight: '700', color: Colors.text },
  backBtn: { marginTop: 24 },
  backBtnText: { color: Colors.primary, fontWeight: '700', fontSize: 15 },
});
