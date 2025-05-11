import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../core/config/firebase';

// Clé pour stocker les informations d'utilisateur dans AsyncStorage
const USER_STORAGE_KEY = '@ShardCalendar:user';

/**
 * Service pour gérer la persistance de l'état d'authentification
 */
class AuthPersistenceService {
  /**
   * Initialise l'écoute des changements d'état d'authentification
   * et sauvegarde l'utilisateur dans AsyncStorage
   */
  initAuthStateListener() {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        // L'utilisateur est connecté, sauvegarder dans AsyncStorage
        await this.saveUserToStorage(user);
      } else {
        // L'utilisateur est déconnecté, supprimer de AsyncStorage
        await this.removeUserFromStorage();
      }
    });
  }

  /**
   * Sauvegarde les informations utilisateur dans AsyncStorage
   */
  async saveUserToStorage(user: User) {
    try {
      // Ne stocker que les informations nécessaires
      const userData = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
      };
      
      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des données utilisateur:', error);
    }
  }

  /**
   * Récupère les informations utilisateur depuis AsyncStorage
   */
  async getUserFromStorage() {
    try {
      const userData = await AsyncStorage.getItem(USER_STORAGE_KEY);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Erreur lors de la récupération des données utilisateur:', error);
      return null;
    }
  }

  /**
   * Supprime les informations utilisateur d'AsyncStorage
   */
  async removeUserFromStorage() {
    try {
      await AsyncStorage.removeItem(USER_STORAGE_KEY);
    } catch (error) {
      console.error('Erreur lors de la suppression des données utilisateur:', error);
    }
  }
}

export default new AuthPersistenceService();
