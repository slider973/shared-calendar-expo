import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from 'firebase/app';
import { initializeAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getReactNativePersistence } from '@firebase/auth-react-native';

/**
 * Configuration Firebase
 * Note: Ces valeurs doivent être remplacées par vos propres clés Firebase
 */
const firebaseConfig = {
  apiKey: "AIzaSyDOa8wRFB2GPztc59ajymoWuJDIhgNt7gs",
  authDomain: "shared-calendar-afd2c.firebaseapp.com",
  projectId: "shared-calendar-afd2c",
  storageBucket: "shared-calendar-afd2c.firebasestorage.app",
  messagingSenderId: "971599848990",
  appId: "1:971599848990:web:46fc00b08d6c60681bf00f",
  measurementId: "G-QDY862ZL4G"
};

// Initialisation de Firebase
const app = initializeApp(firebaseConfig);

// Initialisation des services Firebase
// Utilisation de initializeAuth avec AsyncStorage pour la persistence
// Cette approche résout l'erreur "Component auth has not been registered yet"
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export const firestore = getFirestore(app);

export default app;