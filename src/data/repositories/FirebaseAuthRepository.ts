import { User } from '../../domain/entities/User';
import { AuthProvider, IAuthRepository } from '../../domain/repositories/IAuthRepository';
import { FirebaseAuthDataSource } from '../datasources/FirebaseAuthDataSource';

/**
 * Implémentation Firebase du repository d'authentification
 */
export class FirebaseAuthRepository implements IAuthRepository {
  constructor(private dataSource: FirebaseAuthDataSource) {}

  /**
   * Connexion avec email et mot de passe
   */
  async signInWithEmailPassword(email: string, password: string): Promise<User> {
    return this.dataSource.signInWithEmailPassword(email, password);
  }

  /**
   * Inscription avec email et mot de passe
   */
  async signUpWithEmailPassword(email: string, password: string, displayName: string): Promise<User> {
    return this.dataSource.signUpWithEmailPassword(email, password, displayName);
  }

  /**
   * Connexion avec Google
   */
  async signInWithGoogle(): Promise<User> {
    return this.dataSource.signInWithGoogle();
  }

  /**
   * Connexion avec Apple
   */
  async signInWithApple(): Promise<User> {
    return this.dataSource.signInWithApple();
  }

  /**
   * Récupère l'utilisateur actuellement connecté
   */
  async getCurrentUser(): Promise<User | null> {
    return this.dataSource.getCurrentUser();
  }

  /**
   * Déconnexion
   */
  async signOut(): Promise<void> {
    return this.dataSource.signOut();
  }

  /**
   * S'abonne aux changements d'état d'authentification
   */
  onAuthStateChanged(callback: (user: User | null) => void): () => void {
    return this.dataSource.onAuthStateChanged(callback);
  }
}
