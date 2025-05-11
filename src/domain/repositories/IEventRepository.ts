import { Event } from '../entities/Event';

/**
 * Interface définissant les opérations possibles sur les événements
 */
export interface IEventRepository {
  /**
   * Récupère un événement par son ID
   * @param id ID de l'événement
   */
  getEventById(id: string): Promise<Event | null>;
  
  /**
   * Récupère tous les événements d'un utilisateur
   * @param userId ID de l'utilisateur
   */
  getEventsByUserId(userId: string): Promise<Event[]>;
  
  /**
   * Récupère les événements dans une plage de dates
   * @param startDate Date de début
   * @param endDate Date de fin
   * @param userId ID de l'utilisateur (optionnel)
   */
  getEventsByDateRange(startDate: Date, endDate: Date, userId?: string): Promise<Event[]>;
  
  /**
   * Crée un nouvel événement
   * @param event Données de l'événement
   */
  createEvent(event: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>): Promise<Event>;
  
  /**
   * Met à jour un événement existant
   * @param id ID de l'événement
   * @param event Données mises à jour
   */
  updateEvent(id: string, event: Partial<Omit<Event, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Event>;
  
  /**
   * Supprime un événement
   * @param id ID de l'événement
   */
  deleteEvent(id: string): Promise<void>;
  
  /**
   * S'abonne aux changements d'événements en temps réel
   * @param userId ID de l'utilisateur
   * @param callback Fonction appelée à chaque changement
   */
  subscribeToEvents(userId: string, callback: (events: Event[]) => void): () => void;
}
