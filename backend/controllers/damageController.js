// backend/controllers/damageController.js

const { db } = require('../config/firebase');

// POST /api/damage-reports
exports.createDamageReport = async (req, res) => {
  try {
    const data = req.body;
    if (!data.tyreId || !data.damageType || !data.severity) {
      return res.status(400).json({ success: false, message: 'Tyre ID, damage type, and severity are required' });
    }
    data.reportedAt = data.reportedAt || new Date().toISOString();
    const docRef = await db.collection('damageReports').add(data);
    res.status(201).json({ success: true, message: 'Damage report submitted', reportId: docRef.id });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/damage-reports
exports.getAllDamageReports = async (req, res) => {
  try {
    const snapshot = await db.collection('damageReports').orderBy('reportedAt', 'desc').get();
    const reports = [];
    snapshot.forEach(doc => reports.push({ id: doc.id, ...doc.data() }));
    res.json({ success: true, data: reports });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
