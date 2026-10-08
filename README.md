# TYREX — Dumper Tyre Maintenance & Operation App

> A complete mobile application for monitoring and maintaining tyres used in mining/construction dumpers.  
> Built for college/hackathon project demonstration.

---

## Problem Statement

Mining and construction dumpers operate in extreme conditions. Tyre failures lead to:
- Vehicle breakdowns and production loss
- Safety hazards for operators
- High emergency repair costs

There is currently no easy way for operators to monitor tyre health in real time.

---

## Objective

Build a mobile application that helps operators and maintenance teams:
- Monitor tyre pressure, tread, and condition
- Automatically detect warning and critical tyre states
- Create and manage maintenance records
- Receive alerts before problems escalate

---

## Features

| Feature | Description |
|---------|-------------|
| ✅ Login with Roles | Admin, Operator, Maintenance |
| ✅ Dashboard | Tyre stats, recent alerts |
| ✅ Dumper List | Searchable list of all dumpers |
| ✅ Tyre Layout | Visual 6-tyre diagram per dumper |
| ✅ Tyre Details | Full info — pressure, tread, condition |
| ✅ Update Pressure | Auto-calculates status (Good/Warning/Critical) |
| ✅ Auto Alerts | Alert created automatically on Critical/Warning |
| ✅ Report Damage | Type, severity, description |
| ✅ Add Maintenance | Service records saved to Firebase |
| ✅ Replace Tyre | With confirmation, history preserved |
| ✅ Alerts Screen | Critical/Warning/Resolved tabs |
| ✅ Maintenance History | Full maintenance log |
| ✅ Profile Screen | Role info, permissions, logout |

---

## Technology Stack

### Mobile
- React Native
- Expo
- JavaScript
- React Navigation (Bottom Tabs + Stack)
- Axios (HTTP client)
- AsyncStorage (session persistence)

### Backend
- Node.js
- Express.js
- Firebase Admin SDK

### Database
- Firebase Firestore

---

## Architecture

```
Mobile App (Expo React Native)
        ↓  HTTP/Axios
Express.js REST API (Node.js)
        ↓  Firebase Admin SDK
Firebase Firestore (Database)
```

---

## Project Structure

```
dumper-tyre-maintenance/
│
├── mobile/
│   ├── App.js                    ← Entry point
│   ├── app.json
│   ├── package.json
│   │
│   ├── constants/
│   │   ├── colors.js             ← Color palette
│   │   └── tyreThresholds.js     ← Pressure/tread thresholds
│   │
│   ├── navigation/
│   │   └── AppNavigator.js       ← Bottom tabs + Stack
│   │
│   ├── screens/
│   │   ├── LoginScreen.js
│   │   ├── HomeScreen.js
│   │   ├── DumperListScreen.js
│   │   ├── DumperDetailScreen.js
│   │   ├── TyreDetailScreen.js
│   │   ├── UpdatePressureScreen.js
│   │   ├── ReportDamageScreen.js
│   │   ├── AddMaintenanceScreen.js
│   │   ├── MaintenanceScreen.js
│   │   ├── ReplaceTyreScreen.js
│   │   ├── AlertsScreen.js
│   │   └── ProfileScreen.js
│   │
│   ├── services/
│   │   ├── api.js                ← Axios base instance
│   │   ├── dumperService.js
│   │   ├── tyreService.js
│   │   ├── maintenanceService.js
│   │   └── alertService.js
│   │
│   └── utils/
│       └── authContext.js        ← Login/logout context
│
├── backend/
│   ├── server.js                 ← Express server
│   ├── package.json
│   ├── .env
│   │
│   ├── config/
│   │   ├── firebase.js           ← Firebase Admin init
│   │   └── serviceAccountKey.json  ← YOUR FIREBASE KEY (don't upload to GitHub)
│   │
│   ├── constants/
│   │   └── tyreThresholds.js     ← Pressure/tread thresholds
│   │
│   ├── controllers/
│   │   ├── dumperController.js
│   │   ├── tyreController.js
│   │   ├── maintenanceController.js
│   │   ├── alertController.js
│   │   └── damageController.js
│   │
│   ├── routes/
│   │   ├── dumperRoutes.js
│   │   ├── tyreRoutes.js
│   │   ├── maintenanceRoutes.js
│   │   ├── alertRoutes.js
│   │   └── damageRoutes.js
│   │
│   └── utils/
│       └── seedData.js           ← Demo data seeding script
│
└── README.md
```

---

## Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a project (or use existing: `expo-2d360`)
3. Go to **Firestore Database** → Create database
4. Go to **Project Settings** → **Service Accounts**
5. Click **Generate new private key** → Download JSON
6. Rename the file to `serviceAccountKey.json`
7. Place it in: `backend/config/serviceAccountKey.json`

**Firestore Collections Created Automatically:**
- `dumpers`
- `tyres`
- `maintenanceRecords`
- `alerts`
- `damageReports`

---

## Backend Setup

```powershell
# Navigate to backend folder
cd backend

# Install packages
npm install

# Start development server
npm run dev
```

**Expected output:**
```
Server is running on port 5000
```

**Test in browser:** `http://localhost:5000`

---

## Seed Demo Data

After the server is running:

```powershell
cd backend
node utils/seedData.js
```

**This will create:**
- 3 Dumpers: D-101, D-102, D-103
- 18 Tyres (6 per dumper, mix of Good/Warning/Critical)
- 5 Maintenance records
- 5 Alerts

---

## Mobile Setup

```powershell
cd mobile

# Install packages
npm install

# Start Expo
npx expo start
```

**Important:** In `mobile/services/api.js`, update the `BASE_URL`:
- **Android Emulator:** `http://10.0.2.2:5000/api`
- **Physical Android Device:** `http://YOUR_COMPUTER_IP:5000/api`
  - To find your IP: run `ipconfig` in PowerShell
  - Look for "IPv4 Address" (e.g., `192.168.1.10`)
  - Use: `http://192.168.1.10:5000/api`

---

## API Documentation

### Dumpers
| Method | URL | Description |
|--------|-----|-------------|
| GET | `/api/dumpers` | Get all dumpers |
| GET | `/api/dumpers/:id` | Get single dumper |
| POST | `/api/dumpers` | Create dumper |
| PUT | `/api/dumpers/:id` | Update dumper |
| DELETE | `/api/dumpers/:id` | Delete dumper |

### Tyres
| Method | URL | Description |
|--------|-----|-------------|
| GET | `/api/tyres` | Get all tyres |
| GET | `/api/tyres/:id` | Get single tyre |
| POST | `/api/tyres` | Add tyre |
| PUT | `/api/tyres/:id` | Update tyre |
| PUT | `/api/tyres/:id/pressure` | Update pressure (auto-calculates status + creates alert) |

### Maintenance
| Method | URL | Description |
|--------|-----|-------------|
| GET | `/api/maintenance` | Get all records |
| POST | `/api/maintenance` | Add record |
| PUT | `/api/maintenance/:id` | Update record |

### Alerts
| Method | URL | Description |
|--------|-----|-------------|
| GET | `/api/alerts` | Get all alerts |
| PUT | `/api/alerts/:id/read` | Mark as read |
| PUT | `/api/alerts/:id/resolve` | Resolve alert |

### Damage Reports
| Method | URL | Description |
|--------|-----|-------------|
| POST | `/api/damage-reports` | Submit damage report |
| GET | `/api/damage-reports` | Get all reports |

---

## API Response Format

**Success:**
```json
{
  "success": true,
  "message": "Tyre updated successfully",
  "data": {}
}
```

**Error:**
```json
{
  "success": false,
  "message": "Tyre not found"
}
```

---

## Postman Testing

Import and test these requests in Postman:

1. **GET all dumpers**
   - `GET http://localhost:5000/api/dumpers`

2. **GET all tyres**
   - `GET http://localhost:5000/api/tyres`

3. **Create a dumper**
   - `POST http://localhost:5000/api/dumpers`
   - Body: `{"dumperId":"D-104","registration":"TN-01-ZZ-0001","model":"HD785","location":"Site D"}`

4. **Update tyre pressure (triggers auto-alert)**
   - `PUT http://localhost:5000/api/tyres/T-004/pressure`
   - Body: `{"pressure": 65}`

5. **Get all alerts**
   - `GET http://localhost:5000/api/alerts`

6. **Resolve an alert**
   - `PUT http://localhost:5000/api/alerts/ALERT_ID/resolve`

7. **Add maintenance record**
   - `POST http://localhost:5000/api/maintenance`
   - Body: `{"tyreId":"T-004","serviceType":"Pressure Adjustment","technician":"Arun","cost":500}`

---

## Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@tyrex.com | admin123 |
| Operator | operator@tyrex.com | op123 |
| Maintenance | maintenance@tyrex.com | maint123 |

---

## Demo Scenario (Hackathon Presentation)

Follow this sequence to demonstrate all features:

1. ▶ **Login as Operator** (`operator@tyrex.com / op123`)
2. ▶ **Home Screen** — shows tyre stats for D-101 (4 Good, 1 Warning, 1 Critical)
3. ▶ **Tap Dumpers tab** — see D-101, D-102, D-103
4. ▶ **Tap D-101** — see visual tyre layout with color-coded status
5. ▶ **Tap T-004 (Critical)** — see full tyre details
6. ▶ **Tap "Update Pressure"** — enter `65` PSI
7. ▶ App shows: **Status = CRITICAL**, reason = "Low tyre pressure"
8. ▶ Alert is automatically created in Firebase
9. ▶ **Tap Alerts tab** — see the new Critical alert
10. ▶ **Tap "View Tyre"** — navigate to tyre details
11. ▶ **Tap "Add Maintenance"** — fill form, save record
12. ▶ **Go back to Alerts** — tap **Resolve** on the alert
13. ▶ Alert moves to "Resolved" tab — demo complete ✅

---

## Pressure Status Logic

```
Recommended Pressure = 100 PSI

90 – 100+ PSI  →  GOOD
75 – 89 PSI    →  WARNING
Below 75 PSI   →  CRITICAL
```

## Tread Status Logic

```
70 – 100%  →  GOOD
50 – 69%   →  WARNING
Below 50%  →  CRITICAL
```

*All thresholds are configurable in:*
- `backend/constants/tyreThresholds.js`
- `mobile/constants/tyreThresholds.js`

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| `Cannot find module firebase-admin` | Run `npm install` inside `backend/` |
| `Network Error` on mobile | Check that backend is running and IP in `api.js` is correct |
| `serviceAccountKey.json not found` | Place the Firebase key file in `backend/config/` |
| Expo not scanning QR | Make sure phone and computer are on the same WiFi |
| `expo-router` error | The `main` in `package.json` is now set to `App.js` — this is correct |
| Data not showing | Run `node utils/seedData.js` in the backend folder |

---

## Android Testing

1. Install **Expo Go** app on your Android phone
2. Run `npx expo start` in the `mobile/` folder
3. Scan the QR code shown in the terminal with Expo Go
4. The app will load on your device

---

## GitHub Instructions

```bash
# Initialize git (from project root)
git init
git add .
git commit -m "Initial commit: TYREX Dumper Tyre Maintenance App"

# Create a new repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/tyrex-app.git
git push -u origin main
```

> ⚠️ IMPORTANT: `serviceAccountKey.json` is in `.gitignore` and will NOT be uploaded. Keep it safe.

---

## Future Scope

- Push notifications via Expo Notifications
- GPS tracking of dumper locations
- Photo capture for damage reports
- Offline mode with local SQLite sync
- Tyre lifecycle analytics and prediction
- QR code scanning to identify tyres

---

## Team / Credits

**Project:** TYREX — Dumper Tyre Maintenance System  
**Category:** Mining/Construction IoT & Safety  
**Built With:** React Native, Expo, Node.js, Firebase Firestore
