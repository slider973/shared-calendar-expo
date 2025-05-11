import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { defaultTheme } from '../../theme/theme';
import { FormattedEvent } from '../../types';

interface EventItemProps {
  event: FormattedEvent;
  onPress: (eventId: string) => void;
}

/**
 * Composant pour afficher un événement dans le calendrier
 */
export const EventItem: React.FC<EventItemProps> = ({ event, onPress }) => {
  // Formatage de l'heure pour l'affichage
  const formatTime = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: event.color + '20' }]} // Ajout d'une transparence
      onPress={() => onPress(event.id)}
      activeOpacity={0.7}
    >
      <View style={[styles.colorIndicator, { backgroundColor: event.color }]} />
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {event.title}
        </Text>
        {!event.isAllDay && (
          <Text style={styles.time}>
            {formatTime(event.start)} - {formatTime(event.end)}
          </Text>
        )}
        {event.location && (
          <Text style={styles.location} numberOfLines={1}>
            📍 {event.location}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: defaultTheme.borderRadius.m,
    marginVertical: defaultTheme.spacing.xs,
    overflow: 'hidden',
  },
  colorIndicator: {
    width: 4,
  },
  content: {
    flex: 1,
    padding: defaultTheme.spacing.s,
  },
  title: {
    fontWeight: '600',
    fontSize: 14,
    color: defaultTheme.colors.text,
  },
  time: {
    fontSize: 12,
    color: defaultTheme.colors.text,
    opacity: 0.7,
    marginTop: 2,
  },
  location: {
    fontSize: 12,
    color: defaultTheme.colors.text,
    opacity: 0.7,
    marginTop: 2,
  },
});
