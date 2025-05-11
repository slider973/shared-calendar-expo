import { User } from '../entities/User';

/**
 * Interface définissant les opérations possibles sur les utilisateurs
 */
export interface IUserRepository {
  /**
   * Récupère un utilisateur par son ID
   * @param id ID de l'utilisateur
   */
  getUserById(id: string): Promise<User | null>;
  
  /**
   * Récupère un utilisateur par son email
   * @param email Email de l'utilisateur
   */
  getUserByEmail(email: string): Promise<User | null>;
  
  /**
   * Crée ou met à jour un utilisateur
   * @param user Données de l'utilisateur
   */
  saveUser(user: User): Promise<User>;
  
  /**
   * Récupère l'utilisateur actuellement connecté
   */
  getCurrentUser(): Promise<User | null>;
  
  /**
   * Déconnecte l'utilisateur actuel
   */
  signOut(): Promise<void>;
}
