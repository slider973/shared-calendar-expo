import 'dotenv/config';

export default {
  expo: {
    name: 'ShardCalendar',
    slug: 'shardcalendar',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    scheme: 'shardcalendar',
    userInterfaceStyle: 'automatic',
    splash: {
      image: './assets/images/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff'
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.shardcalendar.app',
      config: {
        googleSignIn: {
          reservedClientId: 'com.googleusercontent.apps.971599848990-your-ios-client-id'
        }
      },
      infoPlist: {
        CFBundleURLTypes: [
          {
            CFBundleURLSchemes: [
              'com.googleusercontent.apps.971599848990-your-ios-client-id'
            ]
          }
        ]
      }
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/images/adaptive-icon.png',
        backgroundColor: '#ffffff'
      },
      package: 'com.shardcalendar.app',
      googleServicesFile: './google-services.json'
    },
    web: {
      bundler: 'metro',
      output: 'static',
      favicon: './assets/images/favicon.png'
    },
    plugins: [
      'expo-router'
    ],
    extra: {
      eas: {
        projectId: process.env.EAS_PROJECT_ID
      },
      googleClientIds: {
        expo: process.env.EXPO_GOOGLE_CLIENT_ID,
        ios: process.env.IOS_GOOGLE_CLIENT_ID,
        android: process.env.ANDROID_GOOGLE_CLIENT_ID,
        web: process.env.WEB_GOOGLE_CLIENT_ID
      },
      appleClientId: process.env.APPLE_CLIENT_ID
    }
  }
};
