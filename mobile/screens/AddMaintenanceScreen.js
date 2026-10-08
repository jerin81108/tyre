// screens/AddMaintenanceScreen.js
// Phase 15: Add a maintenance record

import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  Alert, ScrollView, ActivityIndicator
} from 'react-native';
import { createMaintenance } from '../services/maintenanceService';
import Colors from '../constants/colors';

const SERVICE_TYPES = ['Inspection', 'Repair', 'Rotation', 'Pressure Adjustment', 'Replacement', 'Other'];

const Selector = ({ label, options, selected, onSelect }) => (
  <View style={styles.selectorSection}>
    <Text style={styles.label}>{label}</Text>
    <View style={styles.selectorRow}>
      {options.map(opt => (
        <TouchableOpacity
          key={opt}
          style={[styles.selectorBtn, selected === opt && styles.selectorBtnActive]}
          onPress={() => onSelect(opt)}
        >
          <Text style={[styles.selectorText, selected === opt && styles.selectorTextActive]}>{opt}</Text>
        </TouchableOpacity>
      ))}
    </View>
  </View>
);

export default function AddMaintenanceScreen({ route, navigation }) {
  const { tyreId } = route.params;
  const [serviceType, setServiceType] = useState('');
  const [technician, setTechnician] = useState('');
  const [description, setDescription] = useState('');
  const [cost, setCost] = useState('');
  const [nextServiceDate, setNextServiceDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (!serviceType || !technician.trim()) {
      Alert.alert('Validation Error', 'Please select service type and enter technician name.');
      return;
    }

    setLoading(true);
    try {
      await createMaintenance({
        tyreId,
        serviceType,
        technician: technician.trim(),
        description: description.trim(),
        cost: cost ? parseFloat(cost) : 0,
        nextServiceDate: nextServiceDate.trim(),
        date: new Date().toISOString(),
      });
      setSubmitted(true);
    } catch (e) {
      Alert.alert('Error', 'Unable to save maintenance record. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <View style={styles.successContainer}>
        <Text style={styles.successIcon}>🔧</Text>
        <Text style={styles.successTitle}>Maintenance Record Added!</Text>
        <Text style={styles.successText}>The record has been saved to the database.</Text>
        <View style={styles.successDetails}>
          <Text style={styles.detailRow}>Tyre: <Text style={styles.detailValue}>{tyreId}</Text></Text>
          <Text style={styles.detailRow}>Service: <Text style={styles.detailValue}>{serviceType}</Text></Text>
          <Text style={styles.detailRow}>Technician: <Text style={styles.detailValue}>{technician}</Text></Text>
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
        <Text style={styles.headerSub}>Add a new maintenance record</Text>
      </View>

      <View style={styles.body}>
        <Selector label="SERVICE TYPE" options={SERVICE_TYPES} selected={serviceType} onSelect={setServiceType} />

        <Text style={styles.label}>TECHNICIAN NAME</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Arun Singh"
          placeholderTextColor={Colors.textMuted}
          value={technician}
          onChangeText={setTechnician}
        />

        <Text style={styles.label}>DESCRIPTION (Optional)</Text>
        <TextInput
          style={styles.textArea}
          placeholder="Describe the maintenance work done..."
          placeholderTextColor={Colors.textMuted}
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={3}
        />

        <Text style={styles.label}>COST (₹) (Optional)</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. 500"
          placeholderTextColor={Colors.textMuted}
          value={cost}
          onChangeText={setCost}
          keyboardType="numeric"
        />

        <Text style={styles.label}>NEXT SERVICE DATE (Optional)</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. 2026-12-01"
          placeholderTextColor={Colors.textMuted}
          value={nextServiceDate}
          onChangeText={setNextServiceDate}
        />

        <TouchableOpacity
          style={[styles.btn, loading && styles.btnDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading
            ? <ActivityIndicator color={Colors.black} />
            : <Text style={styles.btnText}>SAVE MAINTENANCE RECORD</Text>
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
  tyreId: { fontSize: 24, fontWeight: '900', color: Colors.primary },
  headerSub: { fontSize: 13, color: Colors.textSecondary, marginTop: 4 },
  body: { padding: 20 },
  label: { fontSize: 11, color: Colors.textMuted, fontWeight: '600', letterSpacing: 1, marginBottom: 8, marginTop: 16 },
  selectorSection: { marginBottom: 4 },
  selectorRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  selectorBtn: {
    paddingVertical: 8, paddingHorizontal: 14, borderRadius: 8,
    borderWidth: 1, borderColor: Colors.surfaceLight, backgroundColor: Colors.surface,
  },
  selectorBtnActive: { borderColor: Colors.primary, backgroundColor: Colors.primary + '22' },
  selectorText: { fontSize: 13, color: Colors.textSecondary },
  selectorTextActive: { fontWeight: '700', color: Colors.primary },
  input: {
    backgroundColor: Colors.surface, borderRadius: 12, padding: 14,
    color: Colors.text, fontSize: 15, marginBottom: 4,
  },
  textArea: {
    backgroundColor: Colors.surface, borderRadius: 12, padding: 14,
    color: Colors.text, fontSize: 14, textAlignVertical: 'top', minHeight: 80, marginBottom: 4,
  },
  btn: { backgroundColor: Colors.primary, borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 20 },
  btnDisabled: { opacity: 0.6 },
  btnText: { color: Colors.black, fontWeight: '800', fontSize: 15, letterSpacing: 1 },
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
