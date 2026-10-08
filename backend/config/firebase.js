const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const fs = require('fs');
const path = require('path');

let app;
const keyPath = path.join(__dirname, 'serviceAccountKey.json');

try {
  if (fs.existsSync(keyPath)) {
    const serviceAccount = require('./serviceAccountKey.json');
    app = initializeApp({
      credential: cert(serviceAccount)
    });
  } else {
    app = initializeApp({ projectId: 'fir-bf670' });
  }
} catch (e) {
  console.warn("Could not initialize with cert:", e.message);
  app = initializeApp({ projectId: 'fir-bf670' });
}

const db = getFirestore(app);

module.exports = { admin: app, db };
