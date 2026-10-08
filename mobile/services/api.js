// services/api.js
// Central Axios API instance - all HTTP calls go through this

import axios from 'axios';

// Change this to your computer's local IP address when testing on a real device
// For emulator: use http://10.0.2.2:5000
// For physical device: use http://YOUR_COMPUTER_IP:5000 (e.g., http://192.168.1.5:5000)
const BASE_URL = 'http://10.197.163.77:5000/api';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
