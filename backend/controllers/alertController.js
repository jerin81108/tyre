const { db } = require('../config/firebase');

// GET /api/alerts - Get all alerts
exports.getAllAlerts = async (req, res) => {
  try {
    const alertsSnapshot = await db.collection('alerts').orderBy('createdAt', 'desc').get();
    const alerts = [];
    alertsSnapshot.forEach((doc) => {
      alerts.push({ id: doc.id, ...doc.data() });
    });
    res.json({ success: true, data: alerts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/alerts/:id/read - Mark alert as read
exports.markAsRead = async (req, res) => {
  try {
    const alertId = req.params.id;
    await db.collection('alerts').doc(alertId).update({
      isRead: true
    });
    res.json({ success: true, message: 'Alert marked as read' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/alerts/:id/resolve - Resolve an alert
exports.resolveAlert = async (req, res) => {
  try {
    const alertId = req.params.id;
    await db.collection('alerts').doc(alertId).update({
      status: 'Resolved',
      resolvedAt: new Date().toISOString()
    });
    res.json({ success: true, message: 'Alert resolved successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Helper function to create alert internally
exports.createAlertInternal = async (alertData) => {
  try {
    const data = {
      ...alertData,
      isRead: false,
      status: 'Active',
      createdAt: new Date().toISOString()
    };
    await db.collection('alerts').add(data);
  } catch (error) {
    console.error('Error creating internal alert:', error);
  }
};
