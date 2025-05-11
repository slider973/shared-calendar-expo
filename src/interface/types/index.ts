import { Event } from '../../domain/entities/Event';
import { User } from '../../domain/entities/User';

/**
 * Types pour le thème de l'application
 */
export interface Theme {
  colors: {
    primary: string;
    secondary: string;
    background: string;
    card: string;
    text: string;
    border: string;
    notification: string;
    error: string;
    success: string;
    warning: string;
  };
  spacing: {
    xs: number;
    s: number;
    m: number;
    l: number;
    xl: number;
  };
  borderRadius: {
    s: number;
    m: number;
    l: number;
  };
}

/**
 * Types pour les écrans de l'application
 */
export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  EventDetails: { eventId: string };
  CreateEvent: undefined;
  EditEvent: { eventId: string };
};

/**
 * Types pour les onglets de l'application
 */
export type MainTabParamList = {
  Calendar: undefined;
  Profile: undefined;
};

/**
 * Type pour les données d'un événement formaté pour l'affichage
 */
export interface FormattedEvent {
  id: string;
  title: string;
  description?: string;
  start: string; // ISO string
  end: string; // ISO string
  color: string;
  location?: string;
  isAllDay: boolean;
}

/**
 * Convertit un événement du domaine en événement formaté pour l'affichage
 */
export const formatEvent = (event: Event): FormattedEvent => {
  return {
    id: event.id,
    title: event.title,
    description: event.description,
    start: event.startDate.toISOString(),
    end: event.endDate.toISOString(),
    color: event.color || '#3498db',
    location: event.location,
    isAllDay: event.isAllDay
  };
};
