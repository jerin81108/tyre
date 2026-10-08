const { db } = require('../config/firebase');

// GET /api/dumpers - Get all dumpers
exports.getAllDumpers = async (req, res) => {
  try {
    const dumpersSnapshot = await db.collection('dumpers').get();
    const dumpers = [];
    dumpersSnapshot.forEach((doc) => {
      dumpers.push({ id: doc.id, ...doc.data() });
    });
    res.json({ success: true, data: dumpers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/dumpers/:id - Get a single dumper
exports.getDumperById = async (req, res) => {
  try {
    const dumperId = req.params.id;
    const doc = await db.collection('dumpers').doc(dumperId).get();
    if (!doc.exists) {
      return res.status(404).json({ success: false, message: 'Dumper not found' });
    }
    res.json({ success: true, data: { id: doc.id, ...doc.data() } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/dumpers - Create a new dumper
exports.createDumper = async (req, res) => {
  try {
    const dumperData = req.body;
    // Basic validation
    if (!dumperData.registration || !dumperData.model) {
      return res.status(400).json({ success: false, message: 'Registration and model are required' });
    }
    
    // Add default status if not provided
    if (!dumperData.status) dumperData.status = 'Active';

    const dumperId = dumperData.dumperId; 
    let docRef;

    if (dumperId) {
      docRef = db.collection('dumpers').doc(dumperId);
      await docRef.set(dumperData);
    } else {
      docRef = await db.collection('dumpers').add(dumperData);
    }

    res.status(201).json({ success: true, message: 'Dumper created successfully', dumperId: dumperId || docRef.id });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/dumpers/:id - Update a dumper
exports.updateDumper = async (req, res) => {
  try {
    const dumperId = req.params.id;
    const updateData = req.body;
    
    await db.collection('dumpers').doc(dumperId).update(updateData);
    res.json({ success: true, message: 'Dumper updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/dumpers/:id - Delete a dumper
exports.deleteDumper = async (req, res) => {
  try {
    const dumperId = req.params.id;
    await db.collection('dumpers').doc(dumperId).delete();
    res.json({ success: true, message: 'Dumper deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
