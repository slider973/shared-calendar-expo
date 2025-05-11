import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { Button } from '../../components/common/Button';
import { TextField } from '../../components/common/TextField';
import { defaultTheme } from '../../theme/theme';
import AuthService from '../../../services/AuthService';
import { auth } from '../../../core/config/firebase';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';

/**
 * Écran de connexion
 */
export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Configuration pour l'authentification Google avec Expo
  WebBrowser.maybeCompleteAuthSession();
  
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: '971599848990-your-web-client-id.apps.googleusercontent.com',
    iosClientId: '971599848990-your-ios-client-id.apps.googleusercontent.com',
    androidClientId: '971599848990-your-android-client-id.apps.googleusercontent.com',
  });

  // Validation du formulaire
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!email.trim()) {
      newErrors.email = 'L\'email est requis';
    }
    
    if (!password) {
      newErrors.password = 'Le mot de passe est requis';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Connexion avec email et mot de passe
  const handleLogin = async () => {
    if (!validate()) return;
    
    setIsLoading(true);
    
    try {
      await AuthService.loginWithEmailAndPassword({
        email,
        password
      });
      router.replace('/(tabs)');
    } catch (error: any) {
      let errorMessage = 'Une erreur est survenue lors de la connexion.';
      
      // Gestion des erreurs Firebase spécifiques
      if (error.code === 'auth/invalid-email') {
        errorMessage = 'L\'adresse email n\'est pas valide.';
      } else if (error.code === 'auth/user-disabled') {
        errorMessage = 'Ce compte a été désactivé.';
      } else if (error.code === 'auth/user-not-found') {
        errorMessage = 'Aucun compte n\'existe avec cet email.';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Mot de passe incorrect.';
      }
      
      Alert.alert('Erreur de connexion', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Connexion avec Google via Expo Auth Session
  const handleGoogleLogin = async () => {
    setIsLoading(true);
    
    try {
      const result = await promptAsync();
      
      if (result.type === 'success') {
        // Obtenir l'ID token pour l'authentification Firebase
        const { id_token } = result.params;
        
        // Créer un credential Firebase avec le token
        const credential = GoogleAuthProvider.credential(id_token);
        
        // Se connecter à Firebase avec le credential
        await signInWithCredential(auth, credential);
        
        router.replace('/(tabs)');
      }
    } catch (error: any) {
      console.error('Google Sign-In Error:', error);
      Alert.alert('Erreur de connexion Google', 'Une erreur est survenue lors de la connexion avec Google.');
    } finally {
      setIsLoading(false);
    }
  };

  // Connexion avec Apple
  // Note: Pour l'instant, cette fonction affiche juste un message indiquant que la fonctionnalité est en cours de développement
  // Pour une implémentation complète, il faudrait utiliser expo-auth-session/providers/apple
  const handleAppleLogin = async () => {
    setIsLoading(true);
    
    try {
      // Fonctionnalité en cours de développement
      Alert.alert(
        'Fonctionnalité en développement',
        'La connexion avec Apple sera disponible prochainement.',
        [{ text: 'OK' }]
      );
    } catch (error: any) {
      Alert.alert('Erreur', 'Une erreur est survenue.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Shard Calendar</Text>
        <Text style={styles.subtitle}>Connectez-vous pour accéder à votre calendrier partagé</Text>
      </View>
      
      <View style={styles.form}>
        <TextField
          label="Email"
          value={email}
          onChangeText={setEmail}
          placeholder="Entrez votre email"
          keyboardType="email-address"
          error={errors.email}
        />
        
        <TextField
          label="Mot de passe"
          value={password}
          onChangeText={setPassword}
          placeholder="Entrez votre mot de passe"
          secureTextEntry
          error={errors.password}
        />
        
        <Button
          title="Se connecter"
          onPress={handleLogin}
          loading={isLoading}
          style={styles.loginButton}
        />
        
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>ou</Text>
          <View style={styles.dividerLine} />
        </View>
        
        <Button
          title="Continuer avec Google"
          onPress={handleGoogleLogin}
          variant="outline"
          style={styles.socialButton}
        />
        
        <Button
          title="Continuer avec Apple"
          onPress={handleAppleLogin}
          variant="outline"
          style={styles.socialButton}
        />
      </View>
      
      <View style={styles.footer}>
        <Text style={styles.footerText}>Vous n'avez pas de compte ?</Text>
        <TouchableOpacity onPress={() => router.push('/register')}>
          <Text style={styles.footerLink}>S'inscrire</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: defaultTheme.spacing.l,
    backgroundColor: defaultTheme.colors.background,
  },
  header: {
    alignItems: 'center',
    marginBottom: defaultTheme.spacing.xl,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: defaultTheme.colors.primary,
    marginBottom: defaultTheme.spacing.s,
  },
  subtitle: {
    fontSize: 16,
    color: defaultTheme.colors.text,
    textAlign: 'center',
  },
  form: {
    marginBottom: defaultTheme.spacing.xl,
  },
  loginButton: {
    marginTop: defaultTheme.spacing.m,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: defaultTheme.spacing.l,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: defaultTheme.colors.border,
  },
  dividerText: {
    marginHorizontal: defaultTheme.spacing.m,
    color: defaultTheme.colors.text,
  },
  socialButton: {
    marginBottom: defaultTheme.spacing.m,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 'auto',
  },
  footerText: {
    color: defaultTheme.colors.text,
    marginRight: defaultTheme.spacing.xs,
  },
  footerLink: {
    color: defaultTheme.colors.primary,
    fontWeight: '600',
  },
});
