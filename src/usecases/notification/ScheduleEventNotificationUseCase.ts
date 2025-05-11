import { INotificationRepository } from '../../domain/repositories/INotificationRepository';
import { IEventRepository } from '../../domain/repositories/IEventRepository';
import { Event } from '../../domain/entities/Event';

/**
 * Cas d'utilisation pour planifier une notification pour un événement
 */
export class ScheduleEventNotificationUseCase {
  constructor(
    private notificationRepository: INotificationRepository,
    private eventRepository: IEventRepository
  ) {}

  /**
   * Planifie une notification pour un événement
   * @param eventId ID de l'événement
   * @param minutesBefore Minutes avant l'événement pour envoyer la notification
   */
  async execute(eventId: string, minutesBefore: number = 15): Promise<string> {
    // Récupère l'événement
    const event = await this.eventRepository.getEventById(eventId);
    
    if (!event) {
      throw new Error('Event not found');
    }

    // Calcule la date de la notification
    const notificationDate = new Date(event.startDate.getTime() - minutesBefore * 60 * 1000);
    
    // Si la date est déjà passée, on ne planifie pas de notification
    if (notificationDate < new Date()) {
      throw new Error('Cannot schedule notification in the past');
    }

    // Demande la permission pour les notifications si nécessaire
    const hasPermission = await this.notificationRepository.requestPermissions();
    
    if (!hasPermission) {
      throw new Error('Notification permissions not granted');
    }

    // Planifie la notification
    const notificationId = await this.notificationRepository.scheduleLocalNotification(
      event.title,
      `Commence à ${event.startDate.toLocaleTimeString()}${event.location ? ` à ${event.location}` : ''}`,
      notificationDate,
      { eventId: event.id }
    );

    return notificationId;
  }
}
