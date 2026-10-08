// utils/authContext.js
// Manages login state across the whole app
// Uses in-memory fallback if AsyncStorage native module is unavailable

import React, { createContext, useContext, useState, useEffect } from 'react';

// Safe AsyncStorage wrapper - falls back to in-memory if native module not available
let storage = {};
let AsyncStorageSafe;
try {
  AsyncStorageSafe = require('@react-native-async-storage/async-storage').default;
} catch (e) {
  AsyncStorageSafe = null;
}

const safeGet = async (key) => {
  try {
    if (AsyncStorageSafe) return await AsyncStorageSafe.getItem(key);
    return storage[key] || null;
  } catch {
    return storage[key] || null;
  }
};

const safeSet = async (key, value) => {
  try {
    if (AsyncStorageSafe) await AsyncStorageSafe.setItem(key, value);
    else storage[key] = value;
  } catch {
    storage[key] = value;
  }
};

const safeRemove = async (key) => {
  try {
    if (AsyncStorageSafe) await AsyncStorageSafe.removeItem(key);
    else delete storage[key];
  } catch {
    delete storage[key];
  }
};

const AuthContext = createContext(null);

// Demo users for development/hackathon demo
const DEMO_USERS = {
  'admin@tyrex.com': {
    password: 'admin123',
    name: 'Admin User',
    role: 'Admin',
    assignedDumper: null,
  },
  'operator@tyrex.com': {
    password: 'op123',
    name: 'Ravi Kumar',
    role: 'Operator',
    assignedDumper: 'D-101',
  },
  'maintenance@tyrex.com': {
    password: 'maint123',
    name: 'Arun Singh',
    role: 'Maintenance',
    assignedDumper: null,
  },
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session on app start
  useEffect(() => {
    const restore = async () => {
      try {
        const stored = await safeGet('user');
        if (stored) setUser(JSON.parse(stored));
      } catch (e) {
        console.log('Could not restore session:', e.message);
      } finally {
        setLoading(false);
      }
    };
    restore();
  }, []);

  const login = async (email, password) => {
    const found = DEMO_USERS[email.toLowerCase().trim()];
    if (!found || found.password !== password) {
      throw new Error('Invalid email or password');
    }
    const loggedInUser = {
      email,
      name: found.name,
      role: found.role,
      assignedDumper: found.assignedDumper,
    };
    setUser(loggedInUser);
    await safeSet('user', JSON.stringify(loggedInUser));
    return loggedInUser;
  };

  const logout = async () => {
    setUser(null);
    await safeRemove('user');
  };

  const restoreUser = async () => {
    const stored = await safeGet('user');
    if (stored) setUser(JSON.parse(stored));
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, restoreUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
