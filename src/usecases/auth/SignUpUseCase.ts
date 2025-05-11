import { User } from '../../domain/entities/User';
import { IAuthRepository } from '../../domain/repositories/IAuthRepository';

/**
 * Cas d'utilisation pour l'inscription d'un nouvel utilisateur
 */
export class SignUpUseCase {
  constructor(private authRepository: IAuthRepository) {}

  /**
   * Inscription avec email et mot de passe
   * @param email Email de l'utilisateur
   * @param password Mot de passe
   * @param displayName Nom d'affichage
   */
  async execute(email: string, password: string, displayName: string): Promise<User> {
    if (!email || !password || !displayName) {
      throw new Error('Email, password and display name are required');
    }

    // Validation basique de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Invalid email format');
    }

    // Validation basique du mot de passe
    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters long');
    }

    return this.authRepository.signUpWithEmailPassword(email, password, displayName);
  }
}
