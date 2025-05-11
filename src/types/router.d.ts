/**
 * Déclaration des types pour Expo Router
 * Cela permet de définir les routes et les paramètres pour la navigation
 */

import { ParamListBase } from '@react-navigation/native';

declare global {
  namespace ReactNavigation {
    interface RootParamList extends ParamListBase {
      // Routes principales
      '(tabs)': undefined;
      'login': undefined;
      'register': undefined;
      'create-event': undefined;
      
      // Routes dynamiques
      'event/[id]': { id: string };
      'edit-event/[id]': { id: string };
    }
  }
}
