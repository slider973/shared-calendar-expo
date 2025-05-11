import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { Alert, Text as RNText, TouchableOpacity as RNTouchableOpacity, View as RNView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { DateData, Calendar as RNCalendar } from 'react-native-calendars';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FirebaseAuthDataSource } from '../../../data/datasources/FirebaseAuthDataSource';
import { FirebaseEventDataSource } from '../../../data/datasources/FirebaseEventDataSource';
import { FirebaseEventRepository } from '../../../data/repositories/FirebaseEventRepository';
import { FirebaseUserRepository } from '../../../data/repositories/FirebaseUserRepository';
import { GetEventsByDateRangeUseCase } from '../../../usecases/event/GetEventsByDateRangeUseCase';
import { UpcomingPlanCard } from '../../components/calendar/UpcomingPlanCard';
import { FloatingActionButton } from '../../components/common/FloatingActionButton';
import { defaultTheme } from '../../theme/theme';
import { formatEvent, FormattedEvent } from '../../types';

/**
 * Écran principal du calendrier
 */
export default function CalendarScreen() {
  const [selectedMonth, setSelectedMonth] = useState(selectedDate.getMonth());
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState<FormattedEvent[]>([]);
  const [markedDates, setMarkedDates] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(true);

  // Initialisation des dépendances
  const eventDataSource = new FirebaseEventDataSource();
  const eventRepository = new FirebaseEventRepository(eventDataSource);
  const authDataSource = new FirebaseAuthDataSource();
  const userRepository = new FirebaseUserRepository(authDataSource);
  const getEventsByDateRangeUseCase = new GetEventsByDateRangeUseCase(eventRepository, userRepository);

  // Formatage de la date pour l'API du calendrier
  const formatDate = (date: Date): string => {
    // Format local YYYY-MM-DD (corrige le bug de décalage)
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };


  // Chargement des événements pour un mois donné
  const loadEventsForMonth = useCallback(async (date: Date) => {
    try {
      setIsLoading(true);
      
      // Calcul du premier et dernier jour du mois
      const year = date.getFullYear();
      const month = date.getMonth();
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      
      // Récupération des événements
      const fetchedEvents = await getEventsByDateRangeUseCase.execute(firstDay, lastDay);
      
      // Formatage des événements pour l'affichage
      const formattedEvents = fetchedEvents.map(formatEvent);
      setEvents(formattedEvents);
      
      // Préparer les markedDates
      const marked: Record<string, any> = {};
      
      // Ajouter les dots pour tous les événements
      fetchedEvents.forEach(event => {
        const eventDate = formatDate(event.startDate);
        if (!marked[eventDate]) {
          marked[eventDate] = { dots: [] };
        }
        marked[eventDate].dots = [
          ...(marked[eventDate].dots || []),
          { color: event.color || '#3A7AFE' }
        ];
      });
      
      // Marquer la date sélectionnée
      const selectedDateStr = formatDate(selectedDate);
      marked[selectedDateStr] = {
        ...marked[selectedDateStr],
        selected: true,
        selectedColor: '#3A7AFE'
      };
      
      // Mettre à jour l'état
      setMarkedDates(marked);
    } catch (error: any) {
      Alert.alert('Erreur', 'Impossible de charger les événements');
      console.error('Error loading events:', error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedDate]);



  // Chargement initial des événements
  useEffect(() => {
    loadEventsForMonth(selectedDate);
  }, [loadEventsForMonth]);

  // Gestion du changement de mois
  const handleMonthChange = (monthData: any) => {
    const newDate = new Date(monthData.year, monthData.month - 1, 1);
    loadEventsForMonth(newDate);
  };

  // Gestion de la sélection d'une date
  const handleDateSelect = (date: DateData) => {
    // Créer un nouvel objet Date à partir des données de date
    const newDate = new Date(date.year, date.month - 1, date.day);
    
    // Mettre à jour la date sélectionnée (cela déclenchera un re-render et loadEventsForMonth)
    setSelectedDate(newDate);
  };

  // Gestion de la pression sur un événement
  const handleEventPress = (eventId: string) => {
    console.log('Navigation vers les détails de l\'\u00e9vénement:', eventId);
    // Utiliser directement la route avec l'ID comme paramètre
    router.push(`/event/${eventId}`);
  };

  // Filtrer les événements pour la date sélectionnée
  const eventsForSelectedDate = events.filter(event => {
    const eventDate = new Date(event.start);
    return eventDate.getFullYear() === selectedDate.getFullYear() &&
           eventDate.getMonth() === selectedDate.getMonth() &&
           eventDate.getDate() === selectedDate.getDate();
  });

  // Composant personnalisé pour chaque case du calendrier
  const CustomDay = ({ date, state, marking = {} }: any) => {
    const dateStr = date.dateString;
    const eventsForDay = events.filter(ev => formatDate(new Date(ev.start)) === dateStr);
    const isSelected = marking.selected;
    const isToday = formatDate(new Date()) === dateStr;
    const isDisabled = state === 'disabled';
    return (
      <RNTouchableOpacity
        style={[
          customDayStyles.dayContainer,
          isSelected && customDayStyles.selectedDay,
          isToday && customDayStyles.todayDay,
          isDisabled && customDayStyles.disabledDay,
        ]}
        activeOpacity={0.85}
        onPress={() => handleDateSelect({ dateString: dateStr, day: date.day, month: date.month, year: date.year })}
      >
        <RNText style={[
          customDayStyles.dayText,
          isSelected && customDayStyles.selectedDayText,
          isToday && customDayStyles.todayDayText,
          isDisabled && customDayStyles.disabledDayText,
        ]}>{date.day}</RNText>
        {eventsForDay.length > 0 && (
          <RNView style={customDayStyles.eventsPreviewContainer}>
            {eventsForDay.slice(0,2).map(ev => (
              <RNView key={ev.id} style={[customDayStyles.eventPill, {backgroundColor: ev.color || defaultTheme.colors.primary}]}> 
                <RNText style={customDayStyles.eventPillText}>
                  {new Date(ev.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </RNText>
              </RNView>
            ))}
            {eventsForDay.length > 2 && (
              <RNText style={customDayStyles.moreEvents}>+{eventsForDay.length - 2}</RNText>
            )}
          </RNView>
        )}
      </RNTouchableOpacity>
    );
  };


  return (
    <SafeAreaView style={styles.container}>
      <RNCalendar
        current={formatDate(selectedDate)}
        onDayPress={handleDateSelect}
        onMonthChange={handleMonthChange}
        markedDates={markedDates}
        markingType="multi-dot"
        dayComponent={CustomDay}
        theme={{
          calendarBackground: defaultTheme.colors.background,
          textSectionTitleColor: defaultTheme.colors.text,
          selectedDayBackgroundColor: defaultTheme.colors.primary,
          selectedDayTextColor: '#ffffff',
          todayTextColor: defaultTheme.colors.primary,
          dayTextColor: defaultTheme.colors.text,
          textDisabledColor: '#d9e1e8',
          dotColor: defaultTheme.colors.primary,
          selectedDotColor: '#ffffff',
          arrowColor: defaultTheme.colors.primary,
          monthTextColor: defaultTheme.colors.text,
        }}
      />
      {/* MINI CALENDRIER */}
      <View style={styles.calendarWrapper}>
        <RNCalendar
          current={formatDate(selectedDate)}
          onDayPress={(day) => setSelectedDate(new Date(day.dateString))}
          markedDates={markedDates}
          hideExtraDays
          theme={{
            backgroundColor: '#fff',
            calendarBackground: '#fff',
            textSectionTitleColor: '#B0B6C3',
            dayTextColor: '#1B2430',
            todayTextColor: '#9E5CFF',
            selectedDayBackgroundColor: '#9E5CFF',
            selectedDayTextColor: '#fff',
            dotColor: '#766BFF',
            selectedDotColor: '#fff',
            arrowColor: '#9E5CFF',
            disabledArrowColor: '#E1E6F0',
            monthTextColor: '#1B2430',
            indicatorColor: '#9E5CFF',
            textDayFontFamily: 'System',
            textMonthFontFamily: 'System',
            textDayHeaderFontFamily: 'System',
            textDayFontWeight: '500',
            textMonthFontWeight: '700',
            textDayHeaderFontWeight: '600',
            textDayFontSize: 16,
            textMonthFontSize: 17,
            textDayHeaderFontSize: 14,
          }}
          style={styles.calendar}
          dayComponent={({ date, state, marking }) => (
            <View style={[
              styles.dayCell,
              date.dateString === formatDate(selectedDate) && styles.selectedDayCell,
              (state === 'disabled' || state === 'inactive') && styles.disabledDayCell,
            ]}>
              <Text
                style={[
                  styles.dayCellText,
                  date.dateString === formatDate(selectedDate) && styles.selectedDayCellText,
                  (state === 'disabled' || state === 'inactive') && styles.disabledDayCellText,
                  (date.weekday === 0 || date.weekday === 6) && styles.weekendText,
                ]}
              >{date.day}</Text>
              {/* Plages custom */}
              {(date.month === 2 && date.day >= 6 && date.day <= 15) && (
                <View style={styles.violetDot} />
              )}
              {(date.month === 2 && date.day === 23) && (
                <View style={styles.pinkDot} />
              )}
            </View>
          )}
        />
      </View>
      {/* TODAY'S PLAN */}
      <View style={styles.todaysPlanCard}>
        <View style={styles.todaysPlanRow}>
          <Text style={styles.todaysPlanTitle}>Today’s plan</Text>
          <TouchableOpacity>
            <Ionicons name="ellipsis-horizontal" size={22} color="#B0B6C3" />
          </TouchableOpacity>
        </View>
        <View style={styles.todaysPlanContent}>
          <Text style={styles.todaysPlanEventTitle}>Dinner with Obama</Text>
          <Text style={styles.todaysPlanEventTime}>06:00 PM</Text>
        </View>
      </View>
      {/* UPCOMING PLAN */}
      <View style={styles.upcomingSection}>
        <Text style={styles.upcomingTitle}>Upcoming plan (2)</Text>
        <UpcomingPlanCard
          color="#E7E3FF"
          icon={<Ionicons name="airplane" size={24} color="#9E5CFF" />}
          title="biz trip to Italy"
          time="12-14 Feb"
        />
        <UpcomingPlanCard
          color="#FFEBF5"
          icon={<Ionicons name="business" size={24} color="#FF6DAE" />}
          title="Government meetings"
          time="23 Feb"
        />
      </View>
      {/* BOUTON FLOTTANT */}
      <FloatingActionButton onPress={() => router.push('/create-event/')} />
    </SafeAreaView>
  );
}

const customDayStyles = StyleSheet.create({
  dayContainer: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingVertical: 6,
    borderRadius: 20,
    margin: 3,
    backgroundColor: '#F8F9FB',
    minHeight: 54,
    minWidth: 38,
    shadowColor: '#B0B6C3',
    shadowOpacity: 0.10,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 0,
    transition: 'background-color 0.2s',
  },
  selectedDay: {
    backgroundColor: '#3A7AFE',
    borderRadius: 20,
    shadowColor: '#3A7AFE',
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 6,
  },
  todayDay: {
    borderColor: '#3A7AFE',
    borderWidth: 2,
  },
  disabledDay: {
    backgroundColor: '#F2F3F6',
  },
  dayText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1B2430',
  },
  selectedDayText: {
    color: '#fff',
  },
  todayDayText: {
    color: '#3A7AFE',
    fontWeight: '900',
  },
  disabledDayText: {
    color: '#D2D7DF',
    fontWeight: '600',
  },
  eventsPreviewContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 3,
    gap: 3,
  },
  eventPill: {
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 1,
    marginHorizontal: 1,
    marginBottom: 1,
    backgroundColor: '#3A7AFE',
    minWidth: 32,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#3A7AFE',
    shadowOpacity: 0.10,
    shadowRadius: 3,
    elevation: 1,
  },
  eventPillText: {
    fontSize: 11,
    color: '#fff',
    fontWeight: 'bold',
    letterSpacing: 0.3,
    textAlign: 'center',
  },
  moreEvents: {
    fontSize: 10,
    color: '#3A7AFE',
    marginLeft: 2,
    fontWeight: 'bold',
  },
});

const styles = StyleSheet.create({
  calendarWrapper: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 12,
    paddingVertical: 4,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
    elevation: 1,
  },
  calendar: {
    borderRadius: 8,
    overflow: 'hidden',
    padding: 0,
    margin: 0,
    backgroundColor: 'transparent',
  },
  dayCell: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    minWidth: 38,
    minHeight: 38,
    margin: 2,
    backgroundColor: 'transparent',
  },
  selectedDayCell: {
    backgroundColor: '#9E5CFF',
  },
  disabledDayCell: {
    backgroundColor: '#F8F9FC',
  },
  dayCellText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1B2430',
  },
  selectedDayCellText: {
    color: '#fff',
    fontWeight: '700',
  },
  disabledDayCellText: {
    color: '#E1E6F0',
    fontWeight: '500',
  },
  weekendText: {
    color: '#B0B6C3',
  },
  violetDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#9E5CFF',
    marginTop: 2,
  },
  pinkDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF6DAE',
    marginTop: 2,
  },
  todaysPlanCard: {
    backgroundColor: '#F8F9FC',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E1E6F0',
    marginHorizontal: 16,
    marginTop: 10,
    marginBottom: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
    elevation: 2,
  },
  todaysPlanRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  todaysPlanTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1B2430',
  },
  todaysPlanContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  todaysPlanEventTitle: {
    fontSize: 17,
    fontWeight: '500',
    color: '#1B2430',
  },
  todaysPlanEventTime: {
    fontSize: 17,
    fontWeight: '400',
    color: '#9E5CFF',
  },
  upcomingSection: {
    marginTop: 8,
    marginHorizontal: 16,
    marginBottom: 60,
  },
  upcomingTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1B2430',
    marginBottom: 8,
  },

  container: {
    flex: 1,
    backgroundColor: defaultTheme.colors.background,
  },
  eventsContainer: {
    flex: 1,
    padding: defaultTheme.spacing.m,
  },
  eventsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: defaultTheme.spacing.m,
  },
  eventsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: defaultTheme.colors.text,
  },
  addButton: {
    backgroundColor: defaultTheme.colors.primary,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eventsList: {
    paddingBottom: defaultTheme.spacing.m,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    color: defaultTheme.colors.text,
    opacity: 0.7,
    marginBottom: defaultTheme.spacing.m,
  },
  emptyStateButton: {
    paddingVertical: defaultTheme.spacing.s,
    paddingHorizontal: defaultTheme.spacing.l,
    backgroundColor: defaultTheme.colors.primary,
    borderRadius: defaultTheme.borderRadius.m,
  },
  emptyStateButtonText: {
    color: '#ffffff',
    fontWeight: '600',
  },
});
