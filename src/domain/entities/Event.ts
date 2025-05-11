/**
 * Entité Event représentant un événement dans le calendrier
 */
export interface Event {
  id: string;
  title: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  location?: string;
  color?: string;
  createdBy: string; // ID de l'utilisateur qui a créé l'événement
  createdAt: Date;
  updatedAt: Date;
  isAllDay: boolean;
  participants: string[]; // IDs des utilisateurs participants
}
