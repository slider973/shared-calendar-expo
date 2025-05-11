import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { defaultTheme } from '@/interface/theme/theme';
import { Button } from '@/interface/components/common/Button';
import AuthService from '@/services/AuthService';
import { User as FirebaseUser } from 'firebase/auth';

/**
 * Écran de profil utilisateur
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: defaultTheme.colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: defaultTheme.colors.background,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: defaultTheme.colors.background,
    padding: defaultTheme.spacing.l,
  },
  errorText: {
    fontSize: 18,
    color: defaultTheme.colors.text,
    marginBottom: defaultTheme.spacing.l,
  },
  header: {
    padding: defaultTheme.spacing.l,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: defaultTheme.colors.text,
  },
  profileCard: {
    alignItems: 'center',
    padding: defaultTheme.spacing.l,
    marginHorizontal: defaultTheme.spacing.l,
    backgroundColor: defaultTheme.colors.card,
    borderRadius: defaultTheme.borderRadius.l,
    marginBottom: defaultTheme.spacing.l,
  },
  avatarContainer: {
    marginBottom: defaultTheme.spacing.m,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarPlaceholder: {
    backgroundColor: defaultTheme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitial: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: defaultTheme.colors.text,
    marginBottom: defaultTheme.spacing.xs,
  },
  userEmail: {
    fontSize: 16,
    color: defaultTheme.colors.text,
    opacity: 0.7,
  },
  section: {
    padding: defaultTheme.spacing.l,
    marginBottom: defaultTheme.spacing.m,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: defaultTheme.colors.text,
    marginBottom: defaultTheme.spacing.m,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: defaultTheme.spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: defaultTheme.colors.border,
  },
  menuItemText: {
    flex: 1,
    fontSize: 16,
    color: defaultTheme.colors.text,
    marginLeft: defaultTheme.spacing.m,
  },
  footer: {
    padding: defaultTheme.spacing.l,
    marginTop: 'auto',
  },
  signOutButton: {
    borderColor: defaultTheme.colors.error,
  },
});

const ProfileScreen = () => {
  const router = useRouter();
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSigningOut, setIsSigningOut] = useState(false);

  // Utilisation du service d'authentification

  // Chargement des données utilisateur
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const currentUser = AuthService.getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Déconnexion avec le nouveau service d'authentification
  const handleSignOut = async () => {
    Alert.alert(
      'Déconnexion',
      'Êtes-vous sûr de vouloir vous déconnecter ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Déconnecter',
          onPress: async () => {
            try {
              setIsSigningOut(true);
              await AuthService.logout();
              router.replace('/login');
            } catch (error: any) {
              Alert.alert('Erreur', 'Une erreur est survenue lors de la déconnexion.');
            } finally {
              setIsSigningOut(false);
            }
          },
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={defaultTheme.colors.primary} />
      </SafeAreaView>
    );
  }

  if (!user) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Text style={styles.errorText}>Utilisateur non connecté</Text>
        <Button title="Se connecter" onPress={() => router.replace('/login')} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mon Profil</Text>
      </View>

      <View style={styles.profileCard}>
        <View style={styles.avatarContainer}>
          {user.photoURL ? (
            <Image source={{ uri: user.photoURL }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.avatarPlaceholder]}>
              <Text style={styles.avatarInitial}>
                {user.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}
              </Text>
            </View>
          )}
        </View>

        <Text style={styles.userName}>{user.displayName}</Text>
        <Text style={styles.userEmail}>{user.email}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Paramètres</Text>

        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="person-outline" size={24} color={defaultTheme.colors.text} />
          <Text style={styles.menuItemText}>Modifier le profil</Text>
          <Ionicons name="chevron-forward" size={20} color={defaultTheme.colors.text} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="notifications-outline" size={24} color={defaultTheme.colors.text} />
          <Text style={styles.menuItemText}>Notifications</Text>
          <Ionicons name="chevron-forward" size={20} color={defaultTheme.colors.text} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="calendar-outline" size={24} color={defaultTheme.colors.text} />
          <Text style={styles.menuItemText}>Préférences du calendrier</Text>
          <Ionicons name="chevron-forward" size={20} color={defaultTheme.colors.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Partage</Text>

        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="people-outline" size={24} color={defaultTheme.colors.text} />
          <Text style={styles.menuItemText}>Gérer les partages</Text>
          <Ionicons name="chevron-forward" size={20} color={defaultTheme.colors.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Button
          title="Déconnexion"
          onPress={handleSignOut}
          variant="outline"
          loading={isSigningOut}
          style={styles.signOutButton}
        />
      </View>
    </SafeAreaView>
  );
};

export default ProfileScreen;
