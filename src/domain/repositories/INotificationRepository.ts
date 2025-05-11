/**
 * Interface définissant les opérations liées aux notifications
 */
export interface INotificationRepository {
  /**
   * Demande la permission d'envoyer des notifications
   */
  requestPermissions(): Promise<boolean>;
  
  /**
   * Enregistre le token de l'appareil pour les notifications push
   * @param userId ID de l'utilisateur
   * @param token Token de l'appareil
   */
  registerDeviceToken(userId: string, token: string): Promise<void>;
  
  /**
   * Planifie une notification locale
   * @param title Titre de la notification
   * @param body Corps de la notification
   * @param date Date d'envoi
   * @param data Données additionnelles
   */
  scheduleLocalNotification(
    title: string,
    body: string,
    date: Date,
    data?: Record<string, any>
  ): Promise<string>;
  
  /**
   * Annule une notification planifiée
   * @param notificationId ID de la notification
   */
  cancelNotification(notificationId: string): Promise<void>;
}
