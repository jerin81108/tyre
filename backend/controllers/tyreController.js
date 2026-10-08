const { db } = require('../config/firebase');
const thresholds = require('../constants/tyreThresholds');
const { createAlertInternal } = require('./alertController');

// GET /api/tyres - Get all tyres
exports.getAllTyres = async (req, res) => {
  try {
    const tyresSnapshot = await db.collection('tyres').get();
    const tyres = [];
    tyresSnapshot.forEach((doc) => {
      tyres.push({ id: doc.id, ...doc.data() });
    });
    res.json({ success: true, data: tyres });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/tyres/:id - Get a single tyre
exports.getTyreById = async (req, res) => {
  try {
    const tyreId = req.params.id;
    const doc = await db.collection('tyres').doc(tyreId).get();
    if (!doc.exists) {
      return res.status(404).json({ success: false, message: 'Tyre not found' });
    }
    res.json({ success: true, data: { id: doc.id, ...doc.data() } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/tyres - Add a new tyre
exports.createTyre = async (req, res) => {
  try {
    const tyreData = req.body;
    
    // Set default initial status if not provided
    if (!tyreData.status) tyreData.status = 'Good';
    if (!tyreData.condition) tyreData.condition = 'Good';
    
    const tyreId = tyreData.tyreId;
    let docRef;

    if (tyreId) {
      docRef = db.collection('tyres').doc(tyreId);
      await docRef.set(tyreData);
    } else {
      docRef = await db.collection('tyres').add(tyreData);
    }

    res.status(201).json({ success: true, message: 'Tyre added successfully', tyreId: tyreId || docRef.id });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/tyres/:id - Update tyre details
exports.updateTyre = async (req, res) => {
  try {
    const tyreId = req.params.id;
    const updateData = req.body;
    
    await db.collection('tyres').doc(tyreId).update(updateData);
    res.json({ success: true, message: 'Tyre updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/tyres/:id/pressure - Update pressure & auto-calculate status
exports.updatePressure = async (req, res) => {
  try {
    const tyreId = req.params.id;
    const { pressure } = req.body;

    if (pressure < 0) {
      return res.status(400).json({ success: false, message: 'Please enter a valid pressure' });
    }

    let status = 'Good';
    let reason = 'Pressure is optimal';

    if (pressure < thresholds.PRESSURE_STATUS.WARNING_MIN) {
      status = 'Critical';
      reason = 'Low tyre pressure';
    } else if (pressure < thresholds.PRESSURE_STATUS.GOOD_MIN) {
      status = 'Warning';
      reason = 'Pressure below recommended level';
    }

    const updateData = {
      pressure: pressure,
      status: status,
      condition: status // Syncing condition with status for now
    };

    await db.collection('tyres').doc(tyreId).update(updateData);
    
    // Automatically create an alert if status is not Good
    if (status !== 'Good') {
      await createAlertInternal({
        tyreId: tyreId,
        category: status,
        message: `${status} tyre pressure detected`,
        details: `Pressure: ${pressure} PSI`
      });
    }
    
    res.json({ 
      success: true, 
      message: 'Pressure updated successfully',
      data: {
        pressure,
        status,
        reason
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
