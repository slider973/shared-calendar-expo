/**
 * Entité User représentant un utilisateur de l'application
 */
export interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  createdAt: Date;
  lastLoginAt: Date;
}
