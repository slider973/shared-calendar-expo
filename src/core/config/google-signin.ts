// Utilisation de expo-auth-session au lieu de @react-native-google-signin/google-signin
// pour la compatibilité avec Expo Managed Workflow
import * as Google from 'expo-auth-session/providers/google';

// Cette fonction est maintenant un placeholder
// L'authentification Google sera configurée directement dans les composants qui l'utilisent
export const configureGoogleSignIn = () => {
  // Aucune configuration globale n'est nécessaire avec expo-auth-session
  // La configuration se fait lors de l'utilisation du hook useAuthRequest
  console.log('Google Sign-In with Expo is ready to be used in components');
};
