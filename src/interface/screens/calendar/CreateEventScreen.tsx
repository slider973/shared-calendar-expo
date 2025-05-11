import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { EventForm } from '../../components/calendar/EventForm';
import { defaultTheme } from '../../theme/theme';
import { CreateEventUseCase } from '../../../usecases/event/CreateEventUseCase';
import { FirebaseEventRepository } from '../../../data/repositories/FirebaseEventRepository';
import { FirebaseEventDataSource } from '../../../data/datasources/FirebaseEventDataSource';
import { FirebaseUserRepository } from '../../../data/repositories/FirebaseUserRepository';
import { FirebaseAuthDataSource } from '../../../data/datasources/FirebaseAuthDataSource';
import { Event } from '../../../domain/entities/Event';

/**
 * Écran de création d'un nouvel événement
 */
export default function CreateEventScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // Initialisation des dépendances
  const eventDataSource = new FirebaseEventDataSource();
  const eventRepository = new FirebaseEventRepository(eventDataSource);
  const authDataSource = new FirebaseAuthDataSource();
  const userRepository = new FirebaseUserRepository(authDataSource);
  const createEventUseCase = new CreateEventUseCase(eventRepository, userRepository);

  // Gestion de la soumission du formulaire
  const handleSubmit = async (values: Partial<Event>) => {
    if (!values.title || !values.startDate || !values.endDate) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs obligatoires');
      return;
    }

    setIsLoading(true);

    try {
      // Préparer les données de l'événement en s'assurant que les champs optionnels ne sont pas undefined
      const eventData: {
        title: string;
        startDate: Date;
        endDate: Date;
        isAllDay: boolean;
        color: string;
        participants: string[];
        description?: string;
        location?: string;
      } = {
        title: values.title!,
        startDate: values.startDate!,
        endDate: values.endDate!,
        isAllDay: values.isAllDay || false,
        color: values.color || '#3498db',
        participants: ['marina@example.com'], // Ajout de Marina comme participant par défaut
      };
      
      // Ajouter les champs optionnels seulement s'ils ont une valeur
      if (values.description && values.description.trim() !== '') {
        eventData.description = values.description;
      }
      
      if (values.location && values.location.trim() !== '') {
        eventData.location = values.location;
      }
      
      // Création de l'événement
      await createEventUseCase.execute(eventData);

      Alert.alert(
        'Succès',
        'L\'événement a été créé avec succès',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error: any) {
      Alert.alert('Erreur', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <EventForm onSubmit={handleSubmit} isLoading={isLoading} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: defaultTheme.colors.background,
  },
});
