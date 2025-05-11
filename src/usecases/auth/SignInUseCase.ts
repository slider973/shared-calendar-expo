import { User } from '../../domain/entities/User';
import { AuthProvider, IAuthRepository } from '../../domain/repositories/IAuthRepository';

/**
 * Cas d'utilisation pour la connexion d'un utilisateur
 */
export class SignInUseCase {
  constructor(private authRepository: IAuthRepository) {}

  /**
   * Connexion avec email et mot de passe
   * @param email Email de l'utilisateur
   * @param password Mot de passe
   */
  async executeWithEmailPassword(email: string, password: string): Promise<User> {
    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    return this.authRepository.signInWithEmailPassword(email, password);
  }

  /**
   * Connexion avec Google
   */
  async executeWithGoogle(): Promise<User> {
    return this.authRepository.signInWithGoogle();
  }

  /**
   * Connexion avec Apple
   */
  async executeWithApple(): Promise<User> {
    return this.authRepository.signInWithApple();
  }
}
