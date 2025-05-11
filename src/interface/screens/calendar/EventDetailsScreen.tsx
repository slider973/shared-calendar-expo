import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { defaultTheme } from '../../theme/theme';
import { Button } from '../../components/common/Button';
import { FirebaseEventDataSource } from '../../../data/datasources/FirebaseEventDataSource';
import { FirebaseEventRepository } from '../../../data/repositories/FirebaseEventRepository';
import { FirebaseAuthDataSource } from '../../../data/datasources/FirebaseAuthDataSource';
import { FirebaseUserRepository } from '../../../data/repositories/FirebaseUserRepository';
import { DeleteEventUseCase } from '../../../usecases/event/DeleteEventUseCase';
import { Event } from '../../../domain/entities/Event';

/**
 * Écran de détails d'un événement
 */
export default function EventDetailsScreen() {
  const params = useLocalSearchParams<{ id: string }>();
  const eventId = params.id;
  
  console.log('EventDetailsScreen - ID reçu:', eventId);
  const router = useRouter();
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  // Initialisation des dépendances
  const eventDataSource = new FirebaseEventDataSource();
  const eventRepository = new FirebaseEventRepository(eventDataSource);
  const authDataSource = new FirebaseAuthDataSource();
  const userRepository = new FirebaseUserRepository(authDataSource);
  const deleteEventUseCase = new DeleteEventUseCase(eventRepository, userRepository);

  // Chargement des détails de l'événement
  useEffect(() => {
    const fetchEvent = async () => {
      if (!eventId) {
        console.error('Aucun ID d\'événement fourni');
        setIsLoading(false);
        return;
      }

      console.log('Chargement de l\'événement avec ID:', eventId);
      
      try {
        setIsLoading(true);
        
        // Récupérer directement depuis Firestore pour déboguer
        const eventDoc = await eventDataSource.getEventById(eventId);
        console.log('Événement récupéré directement:', eventDoc);
        
        if (!eventDoc) {
          console.error('Événement non trouvé dans Firestore');
          setIsLoading(false);
          return;
        }
        
        setEvent(eventDoc);
      } catch (error) {
        console.error('Erreur lors du chargement de l\'événement:', error);
        Alert.alert('Erreur', 'Impossible de charger les détails de l\'événement');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  // Formatage de la date pour l'affichage
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  // Formatage de l'heure pour l'affichage
  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Suppression de l'événement
  const handleDelete = () => {
    Alert.alert(
      'Supprimer l\'événement',
      'Êtes-vous sûr de vouloir supprimer cet événement ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            if (!eventId) return;

            try {
              setIsDeleting(true);
              await deleteEventUseCase.execute(eventId);
              router.back();
            } catch (error: any) {
              Alert.alert('Erreur', error.message);
            } finally {
              setIsDeleting(false);
            }
          },
        },
      ]
    );
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
        <Button title="Retour" onPress={() => router.back()} style={styles.backButton} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={[styles.header, { backgroundColor: event.color || defaultTheme.colors.primary }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.title}>{event.title}</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="calendar-outline" size={20} color={defaultTheme.colors.text} />
            <Text style={styles.sectionTitle}>Date et heure</Text>
          </View>
          <Text style={styles.sectionText}>
            {formatDate(event.startDate)}
          </Text>
          {!event.isAllDay && (
            <Text style={styles.sectionText}>
              {formatTime(event.startDate)} - {formatTime(event.endDate)}
            </Text>
          )}
          {event.isAllDay && <Text style={styles.sectionText}>Toute la journée</Text>}
        </View>

        {event.location && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="location-outline" size={20} color={defaultTheme.colors.text} />
              <Text style={styles.sectionTitle}>Lieu</Text>
            </View>
            <Text style={styles.sectionText}>{event.location}</Text>
          </View>
        )}

        {event.description && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="document-text-outline" size={20} color={defaultTheme.colors.text} />
              <Text style={styles.sectionTitle}>Description</Text>
            </View>
            <Text style={styles.sectionText}>{event.description}</Text>
          </View>
        )}

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="people-outline" size={20} color={defaultTheme.colors.text} />
            <Text style={styles.sectionTitle}>Participants</Text>
          </View>
          <Text style={styles.sectionText}>
            {event.participants.length > 0 ? `${event.participants.length} participants` : 'Aucun participant'}
          </Text>
        </View>

        <View style={styles.actions}>
          <Button
            title="Modifier"
            onPress={() => {
              console.log('Navigation vers modification avec ID:', eventId);
              router.push(`/edit-event/${eventId}`);
            }}
            style={styles.editButton}
          />
          <Button
            title="Supprimer"
            onPress={handleDelete}
            variant="outline"
            loading={isDeleting}
            style={styles.deleteButton}
            textStyle={{ color: defaultTheme.colors.error }}
          />
        </View>
      </View>
    </ScrollView>
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
  header: {
    padding: defaultTheme.spacing.l,
    paddingTop: defaultTheme.spacing.xl + defaultTheme.spacing.m,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginBottom: defaultTheme.spacing.m,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  content: {
    padding: defaultTheme.spacing.l,
  },
  section: {
    marginBottom: defaultTheme.spacing.l,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: defaultTheme.spacing.xs,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: defaultTheme.colors.text,
    marginLeft: defaultTheme.spacing.xs,
  },
  sectionText: {
    fontSize: 16,
    color: defaultTheme.colors.text,
    marginLeft: defaultTheme.spacing.l,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: defaultTheme.spacing.l,
  },
  editButton: {
    flex: 1,
    marginRight: defaultTheme.spacing.s,
  },
  deleteButton: {
    flex: 1,
    marginLeft: defaultTheme.spacing.s,
    borderColor: defaultTheme.colors.error,
  },
});
