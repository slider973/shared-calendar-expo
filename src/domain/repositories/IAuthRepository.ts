import { User } from '../entities/User';

/**
 * Type d'authentification supporté
 */
export enum AuthProvider {
  EMAIL = 'email',
  GOOGLE = 'google',
  APPLE = 'apple'
}

/**
 * Interface définissant les opérations d'authentification
 */
export interface IAuthRepository {
  /**
   * Connexion avec email et mot de passe
   * @param email Email de l'utilisateur
   * @param password Mot de passe
   */
  signInWithEmailPassword(email: string, password: string): Promise<User>;
  
  /**
   * Inscription avec email et mot de passe
   * @param email Email de l'utilisateur
   * @param password Mot de passe
   * @param displayName Nom d'affichage
   */
  signUpWithEmailPassword(email: string, password: string, displayName: string): Promise<User>;
  
  /**
   * Connexion avec Google
   */
  signInWithGoogle(): Promise<User>;
  
  /**
   * Connexion avec Apple
   */
  signInWithApple(): Promise<User>;
  
  /**
   * Récupère l'utilisateur actuellement connecté
   */
  getCurrentUser(): Promise<User | null>;
  
  /**
   * Déconnexion
   */
  signOut(): Promise<void>;
  
  /**
   * S'abonne aux changements d'état d'authentification
   * @param callback Fonction appelée à chaque changement
   */
  onAuthStateChanged(callback: (user: User | null) => void): () => void;
}
