import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  onSnapshot,
  Timestamp,
  serverTimestamp
} from 'firebase/firestore';
import { firestore } from '../../core/config/firebase';
import { Event } from '../../domain/entities/Event';

/**
 * Source de données pour les événements Firebase
 */
export class FirebaseEventDataSource {
  private eventsCollection = collection(firestore, 'events');

  /**
   * Convertit un document Firestore en événement du domaine
   */
  private mapFirestoreDocToEvent(id: string, data: any): Event {
    return {
      id,
      title: data.title,
      description: data.description || undefined,
      startDate: data.startDate.toDate(),
      endDate: data.endDate.toDate(),
      location: data.location || undefined,
      color: data.color || undefined,
      createdBy: data.createdBy,
      createdAt: data.createdAt.toDate(),
      updatedAt: data.updatedAt.toDate(),
      isAllDay: data.isAllDay || false,
      participants: data.participants || []
    };
  }

  /**
   * Récupère un événement par son ID
   */
  async getEventById(id: string): Promise<Event | null> {
    const eventDoc = await getDoc(doc(this.eventsCollection, id));
    
    if (!eventDoc.exists()) {
      return null;
    }
    
    return this.mapFirestoreDocToEvent(eventDoc.id, eventDoc.data());
  }

  /**
   * Récupère tous les événements d'un utilisateur
   */
  async getEventsByUserId(userId: string): Promise<Event[]> {
    const q = query(
      this.eventsCollection,
      where('participants', 'array-contains', userId),
      orderBy('startDate', 'asc')
    );
    
    const querySnapshot = await getDocs(q);
    const events: Event[] = [];
    
    querySnapshot.forEach(doc => {
      events.push(this.mapFirestoreDocToEvent(doc.id, doc.data()));
    });
    
    return events;
  }

  /**
   * Récupère les événements dans une plage de dates
   */
  async getEventsByDateRange(startDate: Date, endDate: Date, userId?: string): Promise<Event[]> {
    try {
      // Solution temporaire en attendant que l'index soit créé
      // Récupérer tous les événements et filtrer côté client
      let q;
      
      if (userId) {
        // Utiliser une requête plus simple qui n'a pas besoin d'index composite
        q = query(
          this.eventsCollection,
          where('participants', 'array-contains', userId)
        );
      } else {
        // Récupérer tous les événements (attention à la performance)
        q = query(this.eventsCollection);
      }
      
      const querySnapshot = await getDocs(q);
      const events: Event[] = [];
      
      // Filtrer les événements côté client
      querySnapshot.forEach(doc => {
        const event = this.mapFirestoreDocToEvent(doc.id, doc.data());
        // Vérifier si l'événement est dans la plage de dates
        if (event.startDate >= startDate && event.startDate <= endDate) {
          events.push(event);
        }
      });
      
      // Trier les événements par date de début
      return events.sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
    } catch (error) {
      console.error('Error fetching events by date range:', error);
      return [];
    }
  }

  /**
   * Crée un nouvel événement
   */
  async createEvent(event: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>): Promise<Event> {
    try {
      // Créer un objet de base avec les champs obligatoires
      const eventData: any = {
        title: event.title,
        startDate: Timestamp.fromDate(event.startDate),
        endDate: Timestamp.fromDate(event.endDate),
        createdBy: event.createdBy,
        isAllDay: event.isAllDay || false,
        participants: event.participants || [],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      // Ajouter les champs optionnels seulement s'ils sont définis
      if (event.description !== undefined && event.description !== null) {
        eventData.description = event.description;
      }
      
      if (event.location !== undefined && event.location !== null) {
        eventData.location = event.location;
      }
      
      if (event.color !== undefined && event.color !== null) {
        eventData.color = event.color;
      }
      
      const docRef = await addDoc(this.eventsCollection, eventData);
      const newEventDoc = await getDoc(docRef);
      
      if (!newEventDoc.exists()) {
        throw new Error('Failed to create event');
      }
      
      return this.mapFirestoreDocToEvent(docRef.id, newEventDoc.data());
    } catch (error) {
      console.error('Error creating event:', error);
      throw new Error('Une erreur est survenue lors de la création de l\'\u00e9vénement');
    }
  }

  /**
   * Met à jour un événement existant
   */
  async updateEvent(
    id: string,
    event: Partial<Omit<Event, 'id' | 'createdAt' | 'updatedAt'>>
  ): Promise<Event> {
    try {
      const eventRef = doc(this.eventsCollection, id);
      const eventDoc = await getDoc(eventRef);
      
      if (!eventDoc.exists()) {
        throw new Error('Event not found');
      }
      
      // Créer un objet de mise à jour vide avec uniquement updatedAt
      const updateData: any = {
        updatedAt: serverTimestamp()
      };
      
      // Ajouter les champs à mettre à jour seulement s'ils sont définis
      // Champs obligatoires
      if (event.title !== undefined && event.title !== null) {
        updateData.title = event.title;
      }
      
      // Dates - convertir en Timestamp si présentes
      if (event.startDate) {
        updateData.startDate = Timestamp.fromDate(event.startDate);
      }
      
      if (event.endDate) {
        updateData.endDate = Timestamp.fromDate(event.endDate);
      }
      
      // Champs optionnels
      if (event.description !== undefined) {
        // Si la description est une chaîne vide ou une valeur, l'utiliser
        // Si elle est null, la définir comme une chaîne vide pour éviter undefined
        updateData.description = event.description === null ? '' : event.description;
      }
      
      if (event.location !== undefined) {
        updateData.location = event.location === null ? '' : event.location;
      }
      
      if (event.color !== undefined && event.color !== null) {
        updateData.color = event.color;
      }
      
      if (event.isAllDay !== undefined) {
        updateData.isAllDay = event.isAllDay;
      }
      
      if (event.participants !== undefined && event.participants !== null) {
        updateData.participants = event.participants;
      }
      
      console.log('Mise à jour de l\'\u00e9vénement avec les données:', updateData);
      
      await updateDoc(eventRef, updateData);
      
      const updatedEventDoc = await getDoc(eventRef);
      return this.mapFirestoreDocToEvent(id, updatedEventDoc.data());
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'\u00e9vénement:', error);
      throw new Error('Une erreur est survenue lors de la mise à jour de l\'\u00e9vénement');
    }
  }

  /**
   * Supprime un événement
   */
  async deleteEvent(id: string): Promise<void> {
    await deleteDoc(doc(this.eventsCollection, id));
  }

  /**
   * S'abonne aux changements d'événements en temps réel
   */
  subscribeToEvents(userId: string, callback: (events: Event[]) => void): () => void {
    const q = query(
      this.eventsCollection,
      where('participants', 'array-contains', userId),
      orderBy('startDate', 'asc')
    );
    
    return onSnapshot(q, (querySnapshot) => {
      const events: Event[] = [];
      
      querySnapshot.forEach(doc => {
        events.push(this.mapFirestoreDocToEvent(doc.id, doc.data()));
      });
      
      callback(events);
    });
  }
}
