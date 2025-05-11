import { IEventRepository } from '../../domain/repositories/IEventRepository';
import { IUserRepository } from '../../domain/repositories/IUserRepository';

/**
 * Cas d'utilisation pour supprimer un événement
 */
export class DeleteEventUseCase {
  constructor(
    private eventRepository: IEventRepository,
    private userRepository: IUserRepository
  ) {}

  /**
   * Exécute le cas d'utilisation
   * @param id ID de l'événement à supprimer
   */
  async execute(id: string): Promise<void> {
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
      throw new Error('Not authorized to delete this event');
    }

    // Supprime l'événement
    await this.eventRepository.deleteEvent(id);
  }
}
