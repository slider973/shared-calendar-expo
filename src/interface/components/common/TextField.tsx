import React from 'react';
import { View, TextInput, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { defaultTheme } from '../../theme/theme';

interface TextFieldProps {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  error?: string;
  multiline?: boolean;
  numberOfLines?: number;
  style?: ViewStyle;
  inputStyle?: TextStyle;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
}

/**
 * Composant TextField réutilisable
 */
export const TextField: React.FC<TextFieldProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  error,
  multiline = false,
  numberOfLines = 1,
  style,
  inputStyle,
  autoCapitalize = 'none',
  keyboardType = 'default',
}) => {
  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[
          styles.input,
          multiline && { height: 24 * numberOfLines, textAlignVertical: 'top' },
          error && styles.inputError,
          inputStyle,
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        secureTextEntry={secureTextEntry}
        multiline={multiline}
        numberOfLines={multiline ? numberOfLines : undefined}
        autoCapitalize={autoCapitalize}
        keyboardType={keyboardType}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: defaultTheme.spacing.m,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: defaultTheme.spacing.xs,
    color: defaultTheme.colors.text,
  },
  input: {
    borderWidth: 1,
    borderColor: defaultTheme.colors.border,
    borderRadius: defaultTheme.borderRadius.s,
    paddingHorizontal: defaultTheme.spacing.m,
    paddingVertical: defaultTheme.spacing.s,
    fontSize: 16,
    color: defaultTheme.colors.text,
    backgroundColor: defaultTheme.colors.background,
  },
  inputError: {
    borderColor: defaultTheme.colors.error,
  },
  errorText: {
    color: defaultTheme.colors.error,
    fontSize: 12,
    marginTop: defaultTheme.spacing.xs,
  },
});
