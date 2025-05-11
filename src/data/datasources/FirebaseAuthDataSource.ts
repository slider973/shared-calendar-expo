import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
  GoogleAuthProvider,
  OAuthProvider,
  signInWithCredential
} from 'firebase/auth';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri, useAuthRequest, ResponseType } from 'expo-auth-session';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, firestore } from '../../core/config/firebase';
import { User } from '../../domain/entities/User';

/**
 * Source de données pour l'authentification Firebase
 */
export class FirebaseAuthDataSource {
  /**
   * Convertit un utilisateur Firebase en utilisateur de domaine
   */
  private mapFirebaseUserToDomainUser(firebaseUser: FirebaseUser): User {
    return {
      id: firebaseUser.uid,
      email: firebaseUser.email || '',
      displayName: firebaseUser.displayName || '',
      photoURL: firebaseUser.photoURL || undefined,
      createdAt: new Date(firebaseUser.metadata.creationTime || Date.now()),
      lastLoginAt: new Date(firebaseUser.metadata.lastSignInTime || Date.now())
    };
  }

  /**
   * Enregistre les données utilisateur dans Firestore
   */
  private async saveUserToFirestore(user: User): Promise<void> {
    const userRef = doc(firestore, 'users', user.id);
    await setDoc(userRef, {
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      createdAt: serverTimestamp(),
      lastLoginAt: serverTimestamp()
    }, { merge: true });
  }

  /**
   * Connexion avec email et mot de passe
   */
  async signInWithEmailPassword(email: string, password: string): Promise<User> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = this.mapFirebaseUserToDomainUser(userCredential.user);
      await this.saveUserToFirestore({
        ...user,
        lastLoginAt: new Date()
      });
      return user;
    } catch (error: any) {
      throw new Error(`Authentication failed: ${error.message}`);
    }
  }

  /**
   * Inscription avec email et mot de passe
   */
  async signUpWithEmailPassword(email: string, password: string, displayName: string): Promise<User> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = this.mapFirebaseUserToDomainUser(userCredential.user);
      await this.saveUserToFirestore({
        ...user,
        displayName
      });
      return {
        ...user,
        displayName
      };
    } catch (error: any) {
      throw new Error(`Registration failed: ${error.message}`);
    }
  }

  /**
   * Connexion avec Google
   */
  async signInWithGoogle(): Promise<User> {
    try {
      WebBrowser.maybeCompleteAuthSession();
      const discovery = {
        authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
        tokenEndpoint: 'https://oauth2.googleapis.com/token',
        revocationEndpoint: 'https://oauth2.googleapis.com/revoke',
      };
      const redirectUri = makeRedirectUri();
      const clientId = process.env.WEB_GOOGLE_CLIENT_ID || '';
      const [request, response, promptAsync] = useAuthRequest({
        clientId,
        redirectUri,
        responseType: ResponseType.IdToken,
        scopes: ['openid', 'profile', 'email'],
      }, discovery);
      const result = await promptAsync();
      if (result.type === 'success' && result.params.id_token) {
        const credential = GoogleAuthProvider.credential(result.params.id_token);
        const userCredential = await signInWithCredential(auth, credential);
        const user = this.mapFirebaseUserToDomainUser(userCredential.user);
        await this.saveUserToFirestore(user);
        return user;
      } else {
        throw new Error('Google authentication was cancelled or failed');
      }
    } catch (error: any) {
      throw new Error(`Google authentication failed: ${error.message}`);
    }
  }

  /**
   * Connexion avec Apple
   */
  async signInWithApple(): Promise<User> {
    throw new Error('Apple Sign-In is not yet implemented for Expo Managed workflow.');
  }

  /**
   * Récupère l'utilisateur actuellement connecté
   */
  async getCurrentUser(): Promise<User | null> {
    const firebaseUser = auth.currentUser;
    if (!firebaseUser) return null;
    return this.mapFirebaseUserToDomainUser(firebaseUser);
  }

  /**
   * Déconnexion
   */
  async signOut(): Promise<void> {
    await firebaseSignOut(auth);
  }

  /**
   * S'abonne aux changements d'état d'authentification
   */
  onAuthStateChanged(callback: (user: User | null) => void): () => void {
    return onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        callback(this.mapFirebaseUserToDomainUser(firebaseUser));
      } else {
        callback(null);
      }
    });
  }
}
