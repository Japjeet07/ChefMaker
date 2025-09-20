import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Check if Firebase environment variables are set
const requiredEnvVars = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'NEXT_PUBLIC_FIREBASE_APP_ID'
];

// Move environment variable check inside the function
const getFirebaseConfig = () => {
  // Check each variable individually and log the actual values
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  const authDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN;
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
  const messagingSenderId = process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID;
  const appId = process.env.NEXT_PUBLIC_FIREBASE_APP_ID;

  // Environment variables checked silently

  const missingVars = [];
  if (!apiKey) missingVars.push('NEXT_PUBLIC_FIREBASE_API_KEY');
  if (!authDomain) missingVars.push('NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN');
  if (!projectId) missingVars.push('NEXT_PUBLIC_FIREBASE_PROJECT_ID');
  if (!storageBucket) missingVars.push('NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET');
  if (!messagingSenderId) missingVars.push('NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID');
  if (!appId) missingVars.push('NEXT_PUBLIC_FIREBASE_APP_ID');

  const firebaseConfig = {
    apiKey: apiKey || 'demo-api-key',
    authDomain: authDomain || 'demo-project.firebaseapp.com',
    projectId: projectId || 'demo-project',
    storageBucket: storageBucket || 'demo-project.appspot.com',
    messagingSenderId: messagingSenderId || '123456789',
    appId: appId || '1:123456789:web:abcdef'
  };

  return { missingVars, firebaseConfig };
};

// Initialize Firebase with proper error handling
let app: any = null;
let db: any = null;
let auth: any = null;
let isInitialized = false;

const initializeFirebase = () => {
  if (isInitialized) {
    return { app, db, auth, isInitialized };
  }
  
  // Get config at runtime
  const { missingVars, firebaseConfig } = getFirebaseConfig();
  
  if (missingVars.length > 0) {
    console.warn('Firebase environment variables missing:', missingVars);
    console.warn('Chat functionality will be disabled. Please set up Firebase environment variables.');
    return { app: null, db: null, auth: null, isInitialized: false };
  }

  try {
    // Check if Firebase is already initialized
    const existingApps = getApps();
    
    if (existingApps.length > 0) {
      app = getApp();
    } else {
      app = initializeApp(firebaseConfig);
    }
    
    db = getFirestore(app);
    auth = getAuth(app);
    isInitialized = true;
    
    return { app, db, auth, isInitialized };
  } catch (error) {
    console.error('Firebase initialization failed:', error);
    isInitialized = false;
    return { app: null, db: null, auth: null, isInitialized: false };
  }
};

// Initialize Firebase immediately (only on client side)
if (typeof window !== 'undefined') {
  const firebaseInit = initializeFirebase();
  app = firebaseInit.app;
  db = firebaseInit.db;
  auth = firebaseInit.auth;
  isInitialized = firebaseInit.isInitialized;
}

// Export a function to check if Firebase is ready
export const isFirebaseReady = () => {
  // On client side, try to initialize if not already done
  if (typeof window !== 'undefined' && !isInitialized) {
    const result = initializeFirebase();
    app = result.app;
    db = result.db;
    auth = result.auth;
    isInitialized = result.isInitialized;
  }
  return isInitialized;
};

// Export a function to get Firebase services (with lazy initialization)
export const getFirebaseServices = () => {
  // Always try to initialize on client side
  if (typeof window !== 'undefined' && !isInitialized) {
    const result = initializeFirebase();
    app = result.app;
    db = result.db;
    auth = result.auth;
    isInitialized = result.isInitialized;
    return result;
  }
  return { app, db, auth, isInitialized };
};

export { db, auth };
export default app;
