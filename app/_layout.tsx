import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';
import { configureGoogleSignIn } from '../src/core/config/google-signin';
import { onAuthStateChanged } from 'firebase/auth';

import { auth } from '@/core/config/firebase';
import AuthPersistenceService from '@/services/AuthPersistenceService';
import { useColorScheme } from '@/hooks/useColorScheme';

const RootLayout = () => {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../src/assets/fonts/SpaceMono-Regular.ttf'),
  });
  const [user, setUser] = useState<any>(null);
  const [initializing, setInitializing] = useState(true);

  // Vérifier l'état de l'authentification au chargement et initialiser la persistance
  useEffect(() => {
    // Configurer Google Sign-In
    configureGoogleSignIn();
    
    // Initialiser le service de persistance d'authentification
    AuthPersistenceService.initAuthStateListener();
    
    // S'abonner aux changements d'état d'authentification Firebase
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log('Auth state changed:', currentUser ? 'User logged in' : 'No user');
      setUser(currentUser);
      if (initializing) setInitializing(false);
    });
    
    // Vérifier s'il y a un utilisateur stocké dans AsyncStorage seulement si Firebase n'a pas déjà détecté un utilisateur
    const checkStoredUser = async () => {
      // Si l'utilisateur est déjà défini par Firebase, ne pas vérifier le stockage
      if (auth.currentUser) {
        console.log('Firebase already has a user, skipping storage check');
        return;
      }
      
      const storedUser = await AuthPersistenceService.getUserFromStorage();
      if (storedUser) {
        console.log('Found user in storage, setting user state');
        setUser(storedUser);
      } else {
        console.log('No user found in storage');
        // Forcer l'état à null pour s'assurer que l'utilisateur est redirigé vers la page de connexion
        setUser(null);
      }
      
      if (initializing) setInitializing(false);
    };
    
    // Exécuter la vérification du stockage après un court délai pour laisser Firebase vérifier d'abord
    setTimeout(checkStoredUser, 500);

    return unsubscribe;
  }, []);

  if (!loaded || initializing) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        {user ? (
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        ) : (
          <Stack.Screen name="login" options={{ headerShown: false }} />
        )}
        <Stack.Screen name="register" options={{ title: 'Inscription' }} />
        <Stack.Screen name="create-event" options={{ title: 'Nouvel événement' }} />
        <Stack.Screen 
          name="event/[id]" 
          options={{ title: 'Détails de l\'événement' }} 
        />
        <Stack.Screen 
          name="edit-event/[id]" 
          options={{ title: 'Modifier l\'événement' }} 
        />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

export default RootLayout;
