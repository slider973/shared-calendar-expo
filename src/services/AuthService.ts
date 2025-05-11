import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  User,
  UserCredential,
} from 'firebase/auth';
import { auth } from '../core/config/firebase';

export interface RegisterUserData {
  email: string;
  password: string;
  displayName: string;
}

export interface LoginUserData {
  email: string;
  password: string;
}

class AuthService {
  /**
   * Créer un nouvel utilisateur avec email et mot de passe
   */
  async registerWithEmailAndPassword(userData: RegisterUserData): Promise<UserCredential> {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        userData.email,
        userData.password
      );
      
      // Mettre à jour le profil avec le nom d'affichage
      if (userCredential.user) {
        await updateProfile(userCredential.user, {
          displayName: userData.displayName,
        });
      }
      
      return userCredential;
    } catch (error) {
      console.error('Erreur lors de la création du compte:', error);
      throw error;
    }
  }

  /**
   * Connecter un utilisateur avec email et mot de passe
   */
  async loginWithEmailAndPassword(userData: LoginUserData): Promise<UserCredential> {
    try {
      return await signInWithEmailAndPassword(auth, userData.email, userData.password);
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      throw error;
    }
  }

  /**
   * Déconnecter l'utilisateur courant
   */
  async logout(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      throw error;
    }
  }

  /**
   * Envoyer un email de réinitialisation de mot de passe
   */
  async resetPassword(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      console.error('Erreur lors de l\'envoi de l\'email de réinitialisation:', error);
      throw error;
    }
  }

  /**
   * Obtenir l'utilisateur actuellement connecté
   */
  getCurrentUser(): User | null {
    return auth.currentUser;
  }
}

export default new AuthService();
