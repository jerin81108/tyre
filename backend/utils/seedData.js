// backend/utils/seedData.js
// Run this script once to populate Firebase with demo data
// Command: node utils/seedData.js

require('dotenv').config({ path: '../.env' });
const { db } = require('../config/firebase');

const dumpers = [
  { dumperId: 'D-101', registration: 'TN-38-AB-1234', model: 'HD785', location: 'Mining Site A', status: 'Active' },
  { dumperId: 'D-102', registration: 'TN-38-CD-5678', model: 'CAT 777G', location: 'Mining Site B', status: 'Active' },
  { dumperId: 'D-103', registration: 'TN-38-EF-9012', model: 'Komatsu 730E', location: 'Quarry Zone C', status: 'Maintenance' },
];

const positions = ['Front Left', 'Front Right', 'Middle Left', 'Middle Right', 'Rear Left', 'Rear Right'];

const tyres = [];
const tyreData = [
  // D-101 Tyres (mix of Good, Warning, Critical)
  { tyreId: 'T-001', dumperId: 'D-101', position: 'Front Left', pressure: 98, tread: 85, status: 'Good', condition: 'Good' },
  { tyreId: 'T-002', dumperId: 'D-101', position: 'Front Right', pressure: 92, tread: 80, status: 'Good', condition: 'Good' },
  { tyreId: 'T-003', dumperId: 'D-101', position: 'Middle Left', pressure: 85, tread: 72, status: 'Warning', condition: 'Warning' },
  { tyreId: 'T-004', dumperId: 'D-101', position: 'Middle Right', pressure: 65, tread: 35, status: 'Critical', condition: 'Critical' },
  { tyreId: 'T-005', dumperId: 'D-101', position: 'Rear Left', pressure: 95, tread: 78, status: 'Good', condition: 'Good' },
  { tyreId: 'T-006', dumperId: 'D-101', position: 'Rear Right', pressure: 88, tread: 68, status: 'Warning', condition: 'Warning' },

  // D-102 Tyres
  { tyreId: 'T-007', dumperId: 'D-102', position: 'Front Left', pressure: 100, tread: 90, status: 'Good', condition: 'Good' },
  { tyreId: 'T-008', dumperId: 'D-102', position: 'Front Right', pressure: 97, tread: 88, status: 'Good', condition: 'Good' },
  { tyreId: 'T-009', dumperId: 'D-102', position: 'Middle Left', pressure: 78, tread: 55, status: 'Warning', condition: 'Warning' },
  { tyreId: 'T-010', dumperId: 'D-102', position: 'Middle Right', pressure: 96, tread: 82, status: 'Good', condition: 'Good' },
  { tyreId: 'T-011', dumperId: 'D-102', position: 'Rear Left', pressure: 70, tread: 40, status: 'Critical', condition: 'Critical' },
  { tyreId: 'T-012', dumperId: 'D-102', position: 'Rear Right', pressure: 93, tread: 76, status: 'Good', condition: 'Good' },

  // D-103 Tyres
  { tyreId: 'T-013', dumperId: 'D-103', position: 'Front Left', pressure: 95, tread: 80, status: 'Good', condition: 'Good' },
  { tyreId: 'T-014', dumperId: 'D-103', position: 'Front Right', pressure: 80, tread: 60, status: 'Warning', condition: 'Warning' },
  { tyreId: 'T-015', dumperId: 'D-103', position: 'Middle Left', pressure: 60, tread: 30, status: 'Critical', condition: 'Critical' },
  { tyreId: 'T-016', dumperId: 'D-103', position: 'Middle Right', pressure: 98, tread: 88, status: 'Good', condition: 'Good' },
  { tyreId: 'T-017', dumperId: 'D-103', position: 'Rear Left', pressure: 91, tread: 74, status: 'Good', condition: 'Good' },
  { tyreId: 'T-018', dumperId: 'D-103', position: 'Rear Right', pressure: 84, tread: 65, status: 'Warning', condition: 'Warning' },
];

// Add common fields
tyreData.forEach(t => {
  t.brand = 'Bridgestone';
  t.size = '27.00R49';
  t.recommendedPressure = 100;
  t.installationDate = '2026-01-15';
  t.totalUsageHours = Math.floor(Math.random() * 5000) + 500;
  t.lastServiceDate = '2026-09-01';
  t.nextServiceDate = '2026-12-01';
});

const maintenanceRecords = [
  { tyreId: 'T-004', serviceType: 'Pressure Adjustment', technician: 'Arun Singh', description: 'Adjusted pressure from 60 to 90 PSI', cost: 500, date: '2026-09-15T10:00:00.000Z', nextServiceDate: '2026-12-15' },
  { tyreId: 'T-001', serviceType: 'Inspection', technician: 'Ravi Kumar', description: 'Routine tread depth inspection - satisfactory', cost: 0, date: '2026-09-10T09:00:00.000Z', nextServiceDate: '2026-12-10' },
  { tyreId: 'T-011', serviceType: 'Repair', technician: 'Suresh Babu', description: 'Repaired minor puncture on inner sidewall', cost: 1200, date: '2026-09-05T14:00:00.000Z', nextServiceDate: '2026-11-05' },
  { tyreId: 'T-009', serviceType: 'Rotation', technician: 'Arun Singh', description: 'Rotated front to rear as preventive measure', cost: 300, date: '2026-08-20T11:00:00.000Z', nextServiceDate: '2026-11-20' },
  { tyreId: 'T-015', serviceType: 'Inspection', technician: 'Ravi Kumar', description: 'Tread wear critical - replacement recommended', cost: 0, date: '2026-09-20T16:00:00.000Z', nextServiceDate: '2026-10-20' },
];

const alerts = [
  { tyreId: 'T-004', category: 'Critical', message: 'Critical tyre pressure detected', details: 'Pressure: 65 PSI (Recommended: 100 PSI)', status: 'Active', isRead: false, createdAt: '2026-10-01T08:30:00.000Z' },
  { tyreId: 'T-011', category: 'Critical', message: 'Critical tyre pressure detected', details: 'Pressure: 70 PSI (Recommended: 100 PSI)', status: 'Active', isRead: false, createdAt: '2026-10-02T09:00:00.000Z' },
  { tyreId: 'T-015', category: 'Critical', message: 'Critical tread wear detected', details: 'Tread: 30% (Below safe minimum 50%)', status: 'Active', isRead: true, createdAt: '2026-10-03T10:00:00.000Z' },
  { tyreId: 'T-003', category: 'Warning', message: 'Tyre pressure below recommended level', details: 'Pressure: 85 PSI (Recommended: 100 PSI)', status: 'Active', isRead: false, createdAt: '2026-10-04T11:00:00.000Z' },
  { tyreId: 'T-006', category: 'Warning', message: 'Maintenance due soon', details: 'Next service date approaching: 2026-12-01', status: 'Active', isRead: true, createdAt: '2026-10-05T12:00:00.000Z' },
];

async function seedData() {
  console.log('🌱 Starting data seeding...');

  // Seed Dumpers
  for (const dumper of dumpers) {
    const { dumperId, ...data } = dumper;
    await db.collection('dumpers').doc(dumperId).set(data);
    console.log(`✅ Dumper ${dumperId} created`);
  }

  // Seed Tyres
  for (const tyre of tyreData) {
    const { tyreId, ...data } = tyre;
    await db.collection('tyres').doc(tyreId).set(data);
    console.log(`✅ Tyre ${tyreId} created`);
  }

  // Seed Maintenance Records
  for (const record of maintenanceRecords) {
    await db.collection('maintenanceRecords').add(record);
    console.log(`✅ Maintenance record for ${record.tyreId} created`);
  }

  // Seed Alerts
  for (const alert of alerts) {
    await db.collection('alerts').add(alert);
    console.log(`✅ Alert for ${alert.tyreId} created`);
  }

  console.log('\n🎉 All demo data seeded successfully!');
  console.log('\nDemo Credentials:');
  console.log('  Admin:       admin@tyrex.com     / admin123');
  console.log('  Operator:    operator@tyrex.com  / op123');
  console.log('  Maintenance: maintenance@tyrex.com / maint123');
  process.exit(0);
}

seedData().catch(err => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});
