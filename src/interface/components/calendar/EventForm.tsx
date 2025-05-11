import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Switch, Text, TouchableOpacity, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Button } from '../common/Button';
import { TextField } from '../common/TextField';
import { defaultTheme } from '../../theme/theme';
import { Event } from '../../../domain/entities/Event';

interface EventFormProps {
  initialValues?: Partial<Event>;
  onSubmit: (values: Partial<Event>) => void;
  isLoading?: boolean;
}

/**
 * Composant formulaire pour la création et modification d'événements
 */
export const EventForm: React.FC<EventFormProps> = ({
  initialValues = {},
  onSubmit,
  isLoading = false,
}) => {
  // État du formulaire
  const [title, setTitle] = useState(initialValues.title || '');
  const [description, setDescription] = useState(initialValues.description || '');
  const [location, setLocation] = useState(initialValues.location || '');
  const [startDate, setStartDate] = useState(initialValues.startDate || new Date());
  const [endDate, setEndDate] = useState(initialValues.endDate || new Date(Date.now() + 60 * 60 * 1000)); // +1 heure par défaut
  const [isAllDay, setIsAllDay] = useState(initialValues.isAllDay || false);
  const [color, setColor] = useState(initialValues.color || '#3498db');
  
  // État pour les pickers de date
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  
  // Gestion des erreurs
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Couleurs disponibles
  const colors = ['#3498db', '#2ecc71', '#e74c3c', '#f39c12', '#9b59b6', '#1abc9c'];
  
  // Validation du formulaire
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!title.trim()) {
      newErrors.title = 'Le titre est requis';
    }
    
    if (endDate < startDate) {
      newErrors.endDate = 'La date de fin doit être après la date de début';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Soumission du formulaire
  const handleSubmit = () => {
    if (validate()) {
      onSubmit({
        title,
        description: description || undefined,
        location: location || undefined,
        startDate,
        endDate,
        isAllDay,
        color,
      });
    }
  };
  
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <TextField
        label="Titre"
        value={title}
        onChangeText={setTitle}
        placeholder="Ajouter un titre"
        error={errors.title}
        autoCapitalize="sentences"
      />
      
      <TextField
        label="Description"
        value={description}
        onChangeText={setDescription}
        placeholder="Ajouter une description (optionnel)"
        multiline
        numberOfLines={3}
        autoCapitalize="sentences"
      />
      
      <TextField
        label="Lieu"
        value={location}
        onChangeText={setLocation}
        placeholder="Ajouter un lieu (optionnel)"
        autoCapitalize="sentences"
      />
      
      <View style={styles.switchContainer}>
        <Text style={styles.switchLabel}>Toute la journée</Text>
        <Switch
          value={isAllDay}
          onValueChange={setIsAllDay}
          trackColor={{ false: '#767577', true: defaultTheme.colors.primary }}
          thumbColor="#f4f3f4"
        />
      </View>
      
      <Text style={styles.label}>Date de début</Text>
      <TouchableOpacity 
        style={styles.datePickerButton} 
        onPress={() => setShowStartDatePicker(true)}
      >
        <Text style={styles.dateText}>
          {startDate.toLocaleDateString('fr-FR')} 
          {!isAllDay && startDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </TouchableOpacity>
      
      {showStartDatePicker && (
        <DateTimePicker
          value={startDate}
          mode={isAllDay ? 'date' : 'datetime'}
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(event, selectedDate) => {
            setShowStartDatePicker(false);
            if (selectedDate) {
              setStartDate(selectedDate);
              // Si la date de début est après la date de fin, mettre à jour la date de fin
              if (selectedDate > endDate) {
                const newEndDate = new Date(selectedDate);
                newEndDate.setHours(selectedDate.getHours() + 1);
                setEndDate(newEndDate);
              }
            }
          }}
        />
      )}
      
      <Text style={styles.label}>Date de fin</Text>
      <TouchableOpacity 
        style={styles.datePickerButton} 
        onPress={() => setShowEndDatePicker(true)}
      >
        <Text style={styles.dateText}>
          {endDate.toLocaleDateString('fr-FR')} 
          {!isAllDay && endDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </TouchableOpacity>
      {errors.endDate && <Text style={styles.errorText}>{errors.endDate}</Text>}
      
      {showEndDatePicker && (
        <DateTimePicker
          value={endDate}
          mode={isAllDay ? 'date' : 'datetime'}
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          minimumDate={startDate}
          onChange={(event, selectedDate) => {
            setShowEndDatePicker(false);
            if (selectedDate) {
              setEndDate(selectedDate);
            }
          }}
        />
      )}
      
      <Text style={styles.label}>Couleur</Text>
      <View style={styles.colorContainer}>
        {colors.map((c) => (
          <TouchableOpacity
            key={c}
            style={[
              styles.colorOption,
              { backgroundColor: c },
              color === c && styles.selectedColor,
            ]}
            onPress={() => setColor(c)}
          />
        ))}
      </View>
      
      <Button
        title="Enregistrer"
        onPress={handleSubmit}
        loading={isLoading}
        style={styles.submitButton}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: defaultTheme.spacing.m,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: defaultTheme.spacing.m,
  },
  switchLabel: {
    fontSize: 16,
    color: defaultTheme.colors.text,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: defaultTheme.spacing.xs,
    color: defaultTheme.colors.text,
  },
  datePickerButton: {
    padding: defaultTheme.spacing.m,
    backgroundColor: defaultTheme.colors.card,
    borderRadius: defaultTheme.borderRadius.m,
    marginBottom: defaultTheme.spacing.m,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: defaultTheme.colors.border,
  },
  dateText: {
    fontSize: 16,
    color: defaultTheme.colors.text,
  },
  colorContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: defaultTheme.spacing.l,
  },
  colorOption: {
    width: 30,
    height: 30,
    borderRadius: 15,
    margin: defaultTheme.spacing.xs,
  },
  selectedColor: {
    borderWidth: 2,
    borderColor: defaultTheme.colors.text,
  },
  submitButton: {
    marginVertical: defaultTheme.spacing.m,
  },
  errorText: {
    color: defaultTheme.colors.error,
    fontSize: 12,
    marginTop: -defaultTheme.spacing.s,
    marginBottom: defaultTheme.spacing.m,
  },
});
