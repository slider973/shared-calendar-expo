import React, { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { auth } from '@/core/config/firebase';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * Composant pour protéger les routes qui nécessitent une authentification
 * Redirige vers la page de connexion si l'utilisateur n'est pas connecté
 */
export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté
    if (!auth.currentUser) {
      console.log('No user found, redirecting to login');
      router.replace('/login');
    }
  }, [router]);

  // Si l'utilisateur est connecté, afficher les enfants (contenu protégé)
  return auth.currentUser ? <>{children}</> : null;
}
