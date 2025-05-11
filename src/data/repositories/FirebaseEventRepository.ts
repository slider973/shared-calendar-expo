import { Event } from '../../domain/entities/Event';
import { IEventRepository } from '../../domain/repositories/IEventRepository';
import { FirebaseEventDataSource } from '../datasources/FirebaseEventDataSource';

/**
 * Implémentation Firebase du repository d'événements
 */
export class FirebaseEventRepository implements IEventRepository {
  constructor(private dataSource: FirebaseEventDataSource) {}

  /**
   * Récupère un événement par son ID
   */
  async getEventById(id: string): Promise<Event | null> {
    return this.dataSource.getEventById(id);
  }

  /**
   * Récupère tous les événements d'un utilisateur
   */
  async getEventsByUserId(userId: string): Promise<Event[]> {
    return this.dataSource.getEventsByUserId(userId);
  }

  /**
   * Récupère les événements dans une plage de dates
   */
  async getEventsByDateRange(startDate: Date, endDate: Date, userId?: string): Promise<Event[]> {
    return this.dataSource.getEventsByDateRange(startDate, endDate, userId);
  }

  /**
   * Crée un nouvel événement
   */
  async createEvent(event: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>): Promise<Event> {
    return this.dataSource.createEvent(event);
  }

  /**
   * Met à jour un événement existant
   */
  async updateEvent(
    id: string,
    event: Partial<Omit<Event, 'id' | 'createdAt' | 'updatedAt'>>
  ): Promise<Event> {
    return this.dataSource.updateEvent(id, event);
  }

  /**
   * Supprime un événement
   */
  async deleteEvent(id: string): Promise<void> {
    return this.dataSource.deleteEvent(id);
  }

  /**
   * S'abonne aux changements d'événements en temps réel
   */
  subscribeToEvents(userId: string, callback: (events: Event[]) => void): () => void {
    return this.dataSource.subscribeToEvents(userId, callback);
  }
}
