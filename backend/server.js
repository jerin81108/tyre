const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Initialize Firebase
const { db } = require('./config/firebase');

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); 

// Import Routes
const dumperRoutes = require('./routes/dumperRoutes');
const tyreRoutes = require('./routes/tyreRoutes');
const maintenanceRoutes = require('./routes/maintenanceRoutes');
const alertRoutes = require('./routes/alertRoutes');
const damageRoutes = require('./routes/damageRoutes');

// Use Routes
app.use('/api/dumpers', dumperRoutes);
app.use('/api/tyres', tyreRoutes);
app.use('/api/maintenance', maintenanceRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/damage-reports', damageRoutes);

// Basic Route for testing
app.get('/', (req, res) => {
  res.json({ message: 'Dumper Tyre Maintenance API is running!' });
});

// Test Firebase connection route
app.get('/api/test-db', async (req, res) => {
  try {
    const docRef = await db.collection('test').add({
      message: 'Hello Firebase!',
      timestamp: new Date()
    });
    res.json({ success: true, message: 'Connected to Firebase!', docId: docRef.id });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Firebase connection failed', error: error.message });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
