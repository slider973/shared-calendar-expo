import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { doc, setDoc } from 'firebase/firestore';
import { firestore } from '../../core/config/firebase';

/**
 * Source de données pour les notifications avec Expo
 */
export class ExpoNotificationDataSource {
  /**
   * Configure les notifications
   */
  constructor() {
    // Configuration des notifications
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
      }),
    });
  }

  /**
   * Demande la permission d'envoyer des notifications
   */
  async requestPermissions(): Promise<boolean> {
    if (!Device.isDevice) {
      console.log('Les notifications ne fonctionnent pas sur l\'émulateur');
      return false;
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.log('Permission non accordée pour les notifications');
      return false;
    }

    return true;
  }

  /**
   * Enregistre le token de l'appareil pour les notifications push
   */
  async registerDeviceToken(userId: string, token: string): Promise<void> {
    const tokenRef = doc(firestore, 'userTokens', userId);
    await setDoc(tokenRef, {
      token,
      device: Device.modelName || 'Unknown',
      platform: Platform.OS,
      updatedAt: new Date()
    }, { merge: true });
  }

  /**
   * Obtient le token de l'appareil pour les notifications push
   */
  async getDeviceToken(): Promise<string> {
    try {
      const token = (await Notifications.getExpoPushTokenAsync({
        projectId: 'your-project-id', // Remplacer par votre ID de projet Expo
      })).data;
      return token;
    } catch (error) {
      console.error('Erreur lors de la récupération du token:', error);
      throw new Error('Failed to get push token');
    }
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
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data: data || {},
        sound: true,
      },
      trigger: date,
    });

    return id;
  }

  /**
   * Annule une notification planifiée
   */
  async cancelNotification(notificationId: string): Promise<void> {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  }
}
