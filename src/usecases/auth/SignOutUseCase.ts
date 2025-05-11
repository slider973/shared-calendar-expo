import { IAuthRepository } from '../../domain/repositories/IAuthRepository';

/**
 * Cas d'utilisation pour la déconnexion d'un utilisateur
 */
export class SignOutUseCase {
  constructor(private authRepository: IAuthRepository) {}

  /**
   * Exécute la déconnexion
   */
  async execute(): Promise<void> {
    await this.authRepository.signOut();
  }
}
