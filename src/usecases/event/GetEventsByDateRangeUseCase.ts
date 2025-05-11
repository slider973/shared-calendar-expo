import { Event } from '../../domain/entities/Event';
import { IEventRepository } from '../../domain/repositories/IEventRepository';
import { IUserRepository } from '../../domain/repositories/IUserRepository';

/**
 * Cas d'utilisation pour récupérer les événements dans une plage de dates
 */
export class GetEventsByDateRangeUseCase {
  constructor(
    private eventRepository: IEventRepository,
    private userRepository: IUserRepository
  ) {}

  /**
   * Exécute le cas d'utilisation
   * @param startDate Date de début
   * @param endDate Date de fin
   */
  async execute(startDate: Date, endDate: Date): Promise<Event[]> {
    const currentUser = await this.userRepository.getCurrentUser();
    
    if (!currentUser) {
      throw new Error('User not authenticated');
    }

    // Récupère les événements pour l'utilisateur courant dans la plage de dates
    const events = await this.eventRepository.getEventsByDateRange(
      startDate,
      endDate,
      currentUser.id
    );

    return events;
  }
}
