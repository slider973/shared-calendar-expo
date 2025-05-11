import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

interface UpcomingPlanCardProps {
  color: string;
  icon: any;
  title: string;
  time: string;
}

export const UpcomingPlanCard: React.FC<UpcomingPlanCardProps> = ({ color, icon, title, time }) => (
  <View style={[styles.card, { backgroundColor: color }]}> 
    <View style={styles.iconContainer}>{icon}</View>
    <View style={styles.textContainer}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.time}>{time}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1B2430',
    marginBottom: 2,
  },
  time: {
    fontSize: 13,
    color: '#1B2430',
    opacity: 0.7,
  },
});
