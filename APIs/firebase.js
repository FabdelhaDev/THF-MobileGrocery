import { initializeApp, getApps, getApp, } from "firebase/app";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: `${process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// 2. Initialize Auth with Persistence (Singleton Pattern)
// We only initialize once to prevent the 'Auth already initialized' crash
let authInstance;
if (getApps().length > 0) {
  // If app already exists, retrieve the existing auth instance
  authInstance = getAuth(app);
} else {
  // If this is the first load, initialize with AsyncStorage
  authInstance  = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
}

export const auth = authInstance;

// 3. Export Helper Functions using the auth instance
export const login = async (email, password) => {
  console.log("Login attempt started for:", email); // if this is not logged, then the login is not working and problem will be in the UI/AuthContent.js file
  try {
    const authInstance = auth || require('firebase/auth').getAuth(app);
    const userCredential = await signInWithEmailAndPassword(authInstance, email, password);
    return userCredential.user;
  } catch (error) {
    // CRITICAL: Log the error CODE to find the 2025 security policy causing this
    console.error("Firebase Login Error Code:", error.code); 
    console.error("Firebase Login Error Message:", String(error.message));
    throw error;
  }
};

/*  old login helper function
export const login = async (email, password) => {
  try {
    // Note: if auth is null (due to hot reload), we get it from getAuth
    const authInstance = auth || require('firebase/auth').getAuth(app);
    const userCredential = await signInWithEmailAndPassword(authInstance, email, password);
    return userCredential.user;
  } catch (error) {
    // FIX: String conversion prevents HostFunction 'boolean' crash
    console.error("Login Error:", String(error.message));
    throw error;
  }
};
*/

export const createUser = async (email, password) => {
  try {
    const authInstance = auth || require('firebase/auth').getAuth(app);
    const userCredential = await createUserWithEmailAndPassword(authInstance, email, password);
    return userCredential.user;
  } catch (error) {
    console.error("Signup Error:", String(error.message));
    throw error;
  }
};

export { app };
