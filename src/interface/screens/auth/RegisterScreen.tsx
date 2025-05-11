import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Button } from '../../components/common/Button';
import { TextField } from '../../components/common/TextField';
import { defaultTheme } from '../../theme/theme';
import AuthService from '../../../services/AuthService';

/**
 * Écran d'inscription
 */
export default function RegisterScreen() {
  const router = useRouter();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Utilisation du service d'authentification

  // Validation du formulaire
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!displayName.trim()) {
      newErrors.displayName = 'Le nom est requis';
    }
    
    if (!email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        newErrors.email = 'Format d\'email invalide';
      }
    }
    
    if (!password) {
      newErrors.password = 'Le mot de passe est requis';
    } else if (password.length < 6) {
      newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères';
    }
    
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Inscription avec le nouveau service d'authentification
  const handleRegister = async () => {
    if (!validate()) return;
    
    setIsLoading(true);
    
    try {
      await AuthService.registerWithEmailAndPassword({
        email,
        password,
        displayName
      });
      
      Alert.alert(
        'Inscription réussie',
        'Votre compte a été créé avec succès.',
        [{ text: 'OK', onPress: () => router.replace('/(tabs)') }]
      );
    } catch (error: any) {
      let errorMessage = 'Une erreur est survenue lors de l\'inscription.';
      
      // Gestion des erreurs Firebase spécifiques
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'Cet email est déjà utilisé par un autre compte.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'L\'adresse email n\'est pas valide.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Le mot de passe est trop faible.';
      }
      
      Alert.alert('Erreur d\'inscription', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Créer un compte</Text>
        <Text style={styles.subtitle}>Inscrivez-vous pour commencer à partager votre calendrier</Text>
      </View>
      
      <View style={styles.form}>
        <TextField
          label="Nom"
          value={displayName}
          onChangeText={setDisplayName}
          placeholder="Entrez votre nom"
          autoCapitalize="words"
          error={errors.displayName}
        />
        
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
          placeholder="Créez un mot de passe"
          secureTextEntry
          error={errors.password}
        />
        
        <TextField
          label="Confirmer le mot de passe"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="Confirmez votre mot de passe"
          secureTextEntry
          error={errors.confirmPassword}
        />
        
        <Button
          title="S'inscrire"
          onPress={handleRegister}
          loading={isLoading}
          style={styles.registerButton}
        />
      </View>
      
      <View style={styles.footer}>
        <Text style={styles.footerText}>Vous avez déjà un compte ?</Text>
        <TouchableOpacity onPress={() => router.push('/login')}>
          <Text style={styles.footerLink}>Se connecter</Text>
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
  registerButton: {
    marginTop: defaultTheme.spacing.m,
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
