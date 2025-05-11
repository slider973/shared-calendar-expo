import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, ActivityIndicator, Text } from 'react-native';
import { Button } from '../../components/common/Button';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { EventForm } from '../../components/calendar/EventForm';
import { defaultTheme } from '../../theme/theme';
import { UpdateEventUseCase } from '../../../usecases/event/UpdateEventUseCase';
import { FirebaseEventRepository } from '../../../data/repositories/FirebaseEventRepository';
import { FirebaseEventDataSource } from '../../../data/datasources/FirebaseEventDataSource';
import { FirebaseUserRepository } from '../../../data/repositories/FirebaseUserRepository';
import { FirebaseAuthDataSource } from '../../../data/datasources/FirebaseAuthDataSource';
import { Event } from '../../../domain/entities/Event';

/**
 * Écran de modification d'un événement existant
 */
export default function EditEventScreen() {
  const params = useLocalSearchParams<{ id: string }>();
  const eventId = params.id;
  
  console.log('EditEventScreen - ID reçu:', eventId);
  const router = useRouter();
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Initialisation des dépendances
  const eventDataSource = new FirebaseEventDataSource();
  const eventRepository = new FirebaseEventRepository(eventDataSource);
  const authDataSource = new FirebaseAuthDataSource();
  const userRepository = new FirebaseUserRepository(authDataSource);
  const updateEventUseCase = new UpdateEventUseCase(eventRepository, userRepository);

  // Chargement des détails de l'événement
  useEffect(() => {
    const fetchEvent = async () => {
      if (!eventId) {
        console.error('Aucun ID d\'événement fourni pour la modification');
        setIsLoading(false);
        return;
      }

      console.log('Chargement de l\'événement à modifier avec ID:', eventId);
      
      try {
        setIsLoading(true);
        
        // Récupérer directement depuis Firestore pour déboguer
        const eventDoc = await eventDataSource.getEventById(eventId);
        console.log('Événement à modifier récupéré:', eventDoc ? 'Trouvé' : 'Non trouvé');
        
        if (!eventDoc) {
          console.error('Événement à modifier non trouvé dans Firestore');
          setIsLoading(false);
          return;
        }
        
        setEvent(eventDoc);
      } catch (error) {
        console.error('Erreur lors du chargement de l\'événement à modifier:', error);
        Alert.alert('Erreur', 'Impossible de charger les détails de l\'événement');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  // Gestion de la soumission du formulaire
  const handleSubmit = async (values: Partial<Event>) => {
    if (!eventId || !values.title || !values.startDate || !values.endDate) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs obligatoires');
      return;
    }

    setIsSaving(true);

    try {
      // Préparer les données pour la mise à jour de l'événement
      const updateData: {
        title: string;
        startDate: Date;
        endDate: Date;
        description?: string;
        location?: string;
        color?: string;
        isAllDay?: boolean;
      } = {
        title: values.title!,
        startDate: values.startDate!,
        endDate: values.endDate!,
      };
      
      // Ajouter les champs optionnels seulement s'ils ont une valeur
      if (values.description !== undefined) {
        updateData.description = values.description;
      }
      
      if (values.location !== undefined) {
        updateData.location = values.location;
      }
      
      if (values.color) {
        updateData.color = values.color;
      }
      
      if (values.isAllDay !== undefined) {
        updateData.isAllDay = values.isAllDay;
      }
      
      console.log('Mise à jour de l\'événement avec les données:', updateData);
      
      // Mise à jour de l'événement
      await updateEventUseCase.execute(eventId, updateData);

      Alert.alert(
        'Succès',
        'L\'événement a été mis à jour avec succès',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error: any) {
      console.error('Erreur lors de la mise à jour:', error);
      Alert.alert('Erreur', error.message || 'Une erreur est survenue lors de la mise à jour de l\'événement');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={defaultTheme.colors.primary} />
      </View>
    );
  }

  if (!event) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Événement non trouvé</Text>
        <Button title="Retour" onPress={() => router.back()} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <EventForm
        initialValues={event}
        onSubmit={handleSubmit}
        isLoading={isSaving}
      />
    </View>
  );
}

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
});
