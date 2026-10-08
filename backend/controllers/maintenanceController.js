const { db } = require('../config/firebase');

// GET /api/maintenance - Get all maintenance records
exports.getAllMaintenance = async (req, res) => {
  try {
    const recordsSnapshot = await db.collection('maintenanceRecords').orderBy('date', 'desc').get();
    const records = [];
    recordsSnapshot.forEach((doc) => {
      records.push({ id: doc.id, ...doc.data() });
    });
    res.json({ success: true, data: records });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/maintenance - Add a maintenance record
exports.createMaintenance = async (req, res) => {
  try {
    const recordData = req.body;
    
    // Basic validation
    if (!recordData.tyreId || !recordData.serviceType || !recordData.technician) {
      return res.status(400).json({ success: false, message: 'Tyre ID, Service Type, and Technician are required' });
    }

    // Ensure date is set
    if (!recordData.date) {
      recordData.date = new Date().toISOString();
    }

    const docRef = await db.collection('maintenanceRecords').add(recordData);

    // Optionally update the tyre's lastServiceDate
    await db.collection('tyres').doc(recordData.tyreId).update({
      lastServiceDate: recordData.date
    });

    res.status(201).json({ success: true, message: 'Maintenance record added successfully', recordId: docRef.id });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/maintenance/:id - Update a maintenance record
exports.updateMaintenance = async (req, res) => {
  try {
    const recordId = req.params.id;
    const updateData = req.body;
    
    await db.collection('maintenanceRecords').doc(recordId).update(updateData);
    res.json({ success: true, message: 'Maintenance record updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
