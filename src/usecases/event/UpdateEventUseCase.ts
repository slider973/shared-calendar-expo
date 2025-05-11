import { Event } from '../../domain/entities/Event';
import { IEventRepository } from '../../domain/repositories/IEventRepository';
import { IUserRepository } from '../../domain/repositories/IUserRepository';

/**
 * Cas d'utilisation pour mettre à jour un événement existant
 */
export class UpdateEventUseCase {
  constructor(
    private eventRepository: IEventRepository,
    private userRepository: IUserRepository
  ) {}

  /**
   * Exécute le cas d'utilisation
   * @param id ID de l'événement à mettre à jour
   * @param params Paramètres à mettre à jour
   */
  async execute(
    id: string,
    params: Partial<{
      title: string;
      description?: string;
      startDate: Date;
      endDate: Date;
      location?: string;
      color?: string;
      isAllDay: boolean;
      participants: string[];
    }>
  ): Promise<Event> {
    const currentUser = await this.userRepository.getCurrentUser();
    
    if (!currentUser) {
      throw new Error('User not authenticated');
    }

    // Récupère l'événement existant
    const existingEvent = await this.eventRepository.getEventById(id);
    
    if (!existingEvent) {
      throw new Error('Event not found');
    }

    // Vérifie que l'utilisateur actuel est le créateur de l'événement
    if (existingEvent.createdBy !== currentUser.id) {
      throw new Error('Not authorized to update this event');
    }

    // Vérifie que les dates sont cohérentes si elles sont fournies
    if (params.startDate && params.endDate && params.endDate < params.startDate) {
      throw new Error('End date must be after start date');
    }

    // Met à jour l'événement
    const updatedEvent = await this.eventRepository.updateEvent(id, params);

    return updatedEvent;
  }
}
