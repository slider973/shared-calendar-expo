# Welcome to your Expo app 👋

This is# ShardCalendar - Application de Partage de Calendrier

Application mobile multiplateforme (iOS + Android) développée avec React Native et TypeScript, suivant les principes de la Clean Architecture. Cette application permet le partage de calendrier entre deux personnes avec synchronisation en temps réel via Firebase.

## Fonctionnalités

- Authentification (Google, Apple, Email/Password)
- Ajout, modification et suppression d'événements
- Affichage des événements dans une vue calendrier
- Synchronisation en temps réel via Firebase (Firestore)
- Notifications push pour les rappels d'événements (optionnel)

## Architecture

L'application est structurée selon les principes de la Clean Architecture avec 4 couches distinctes :

### 1. Domain Layer

Contient les entités métier et les interfaces des repositories :

- Entités : `User`, `Event`
- Interfaces : `IUserRepository`, `IEventRepository`, `IAuthRepository`, `INotificationRepository`

### 2. Use Case Layer

Contient la logique métier de l'application :

- Événements : `CreateEventUseCase`, `GetEventsByDateRangeUseCase`, `UpdateEventUseCase`, `DeleteEventUseCase`
- Authentification : `SignInUseCase`, `SignUpUseCase`, `SignOutUseCase`
- Notifications : `ScheduleEventNotificationUseCase`

### 3. Data Layer

Contient les implémentations concrètes des repositories :

- Sources de données : `FirebaseAuthDataSource`, `FirebaseEventDataSource`, `ExpoNotificationDataSource`
- Repositories : `FirebaseUserRepository`, `FirebaseEventRepository`, `FirebaseAuthRepository`, `ExpoNotificationRepository`

### 4. Interface Layer

Contient les composants UI et la logique de présentation :

- Composants : `Button`, `TextField`, `EventItem`, `EventForm`
- Écrans : `LoginScreen`, `RegisterScreen`, `CalendarScreen`, `EventDetailsScreen`, `CreateEventScreen`, `EditEventScreen`
- Navigation basée sur Expo Router

## Technologies utilisées

- React Native avec TypeScript
- Expo
- Firebase (Firestore, Authentication)
- react-native-calendars
- Expo Notifications

## Installation

1. Cloner le dépôt :
   ```
   git clone <url-du-repo>
   cd ShardCalendarExpo
   ```

2. Installer les dépendances :
   ```
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
