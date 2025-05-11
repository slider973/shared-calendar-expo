import { INotificationRepository } from '../../domain/repositories/INotificationRepository';
import { ExpoNotificationDataSource } from '../datasources/ExpoNotificationDataSource';

/**
 * Implémentation Expo du repository de notifications
 */
export class ExpoNotificationRepository implements INotificationRepository {
  constructor(private dataSource: ExpoNotificationDataSource) {}

  /**
   * Demande la permission d'envoyer des notifications
   */
  async requestPermissions(): Promise<boolean> {
    return this.dataSource.requestPermissions();
  }

  /**
   * Enregistre le token de l'appareil pour les notifications push
   */
  async registerDeviceToken(userId: string, token: string): Promise<void> {
    return this.dataSource.registerDeviceToken(userId, token);
  }

  /**
   * Planifie une notification locale
   */
  async scheduleLocalNotification(
    title: string,
    body: string,
    date: Date,
    data?: Record<string, any>
  ): Promise<string> {
    return this.dataSource.scheduleLocalNotification(title, body, date, data);
  }

  /**
   * Annule une notification planifiée
   */
  async cancelNotification(notificationId: string): Promise<void> {
    return this.dataSource.cancelNotification(notificationId);
  }
}
