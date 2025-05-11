import { Event } from '../../domain/entities/Event';
import { IEventRepository } from '../../domain/repositories/IEventRepository';
import { IUserRepository } from '../../domain/repositories/IUserRepository';

/**
 * Cas d'utilisation pour créer un nouvel événement
 */
export class CreateEventUseCase {
  constructor(
    private eventRepository: IEventRepository,
    private userRepository: IUserRepository
  ) {}

  /**
   * Exécute le cas d'utilisation
   * @param params Paramètres pour créer l'événement
   */
  async execute(params: {
    title: string;
    description?: string;
    startDate: Date;
    endDate: Date;
    location?: string;
    color?: string;
    isAllDay: boolean;
    participants: string[];
  }): Promise<Event> {
    const currentUser = await this.userRepository.getCurrentUser();
    
    if (!currentUser) {
      throw new Error('User not authenticated');
    }

    // Vérification que la date de fin est après la date de début
    if (params.endDate < params.startDate) {
      throw new Error('End date must be after start date');
    }

    // Création de l'événement
    const event = await this.eventRepository.createEvent({
      ...params,
      createdBy: currentUser.id,
      participants: [...params.participants, currentUser.id], // Ajoute le créateur aux participants
    });

    return event;
  }
}
