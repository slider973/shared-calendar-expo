import { User } from '../../domain/entities/User';
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { FirebaseAuthDataSource } from '../datasources/FirebaseAuthDataSource';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { firestore } from '../../core/config/firebase';

/**
 * Implémentation Firebase du repository utilisateur
 */
export class FirebaseUserRepository implements IUserRepository {
  constructor(private authDataSource: FirebaseAuthDataSource) {}

  /**
   * Récupère un utilisateur par son ID
   */
  async getUserById(id: string): Promise<User | null> {
    try {
      const userDoc = await getDoc(doc(firestore, 'users', id));
      
      if (!userDoc.exists()) {
        return null;
      }
      
      const userData = userDoc.data();
      
      return {
        id: userDoc.id,
        email: userData.email,
        displayName: userData.displayName,
        photoURL: userData.photoURL,
        createdAt: userData.createdAt.toDate(),
        lastLoginAt: userData.lastLoginAt.toDate()
      };
    } catch (error) {
      console.error('Error getting user by ID:', error);
      return null;
    }
  }

  /**
   * Récupère un utilisateur par son email
   */
  async getUserByEmail(email: string): Promise<User | null> {
    try {
      // Dans une implémentation réelle, vous utiliseriez une requête Firestore
      // pour rechercher un utilisateur par email. Pour simplifier, nous simulons cela.
      const usersCollection = await getDoc(doc(firestore, 'users', 'byEmail', email));
      
      if (!usersCollection.exists()) {
        return null;
      }
      
      const userId = usersCollection.data().userId;
      return this.getUserById(userId);
    } catch (error) {
      console.error('Error getting user by email:', error);
      return null;
    }
  }

  /**
   * Crée ou met à jour un utilisateur
   */
  async saveUser(user: User): Promise<User> {
    try {
      const userRef = doc(firestore, 'users', user.id);
      
      await setDoc(userRef, {
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        createdAt: user.createdAt,
        lastLoginAt: user.lastLoginAt
      }, { merge: true });
      
      // Créer une référence par email pour faciliter les recherches
      await setDoc(doc(firestore, 'users', 'byEmail', user.email), {
        userId: user.id
      });
      
      return user;
    } catch (error) {
      console.error('Error saving user:', error);
      throw new Error('Failed to save user');
    }
  }

  /**
   * Récupère l'utilisateur actuellement connecté
   */
  async getCurrentUser(): Promise<User | null> {
    return this.authDataSource.getCurrentUser();
  }

  /**
   * Déconnecte l'utilisateur actuel
   */
  async signOut(): Promise<void> {
    return this.authDataSource.signOut();
  }
}
