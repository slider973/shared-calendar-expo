import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { defaultTheme } from '../../theme/theme';
import { FormattedEvent } from '../../types';

interface EventCardProps {
  event: FormattedEvent;
  onPress?: (eventId: string) => void;
}

export const EventCard: React.FC<EventCardProps> = ({ event, onPress }) => {
  const formatTime = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <TouchableOpacity 
      style={[styles.card, { backgroundColor: event.color + '15' }]}
      onPress={() => onPress && onPress(event.id)}
      activeOpacity={0.7}
    > 
      <View style={styles.timeContainer}>
        <Ionicons name="time-outline" size={18} color={event.color || defaultTheme.colors.primary} />
        <Text style={[styles.time, { color: event.color || defaultTheme.colors.primary }]}> 
          {event.isAllDay ? 'Toute la journée' : `${formatTime(event.start)} - ${formatTime(event.end)}`}
        </Text>
      </View>
      <Text style={styles.title}>{event.title}</Text>
      {event.location && (
        <View style={styles.locationContainer}>
          <Ionicons name="location-outline" size={14} color={defaultTheme.colors.text} style={{ marginRight: 4 }} />
          <Text style={styles.location}>{event.location}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 22,
    padding: 18,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 10,
    elevation: 3,
    backgroundColor: '#fff',
    borderWidth: 0,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  time: {
    fontWeight: 'bold',
    fontSize: 15,
    marginLeft: 6,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: defaultTheme.colors.text,
    marginBottom: 2,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  location: {
    fontSize: 13,
    color: defaultTheme.colors.text,
    opacity: 0.7,
  },
});
