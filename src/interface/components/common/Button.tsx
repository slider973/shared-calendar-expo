import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { defaultTheme } from '../../theme/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'text';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

/**
 * Composant Button réutilisable
 */
export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  style,
  textStyle,
}) => {
  // Styles basés sur la variante
  const getVariantStyle = (): ViewStyle => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: defaultTheme.colors.primary,
          borderColor: defaultTheme.colors.primary,
        };
      case 'secondary':
        return {
          backgroundColor: defaultTheme.colors.secondary,
          borderColor: defaultTheme.colors.secondary,
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderColor: defaultTheme.colors.primary,
          borderWidth: 1,
        };
      case 'text':
        return {
          backgroundColor: 'transparent',
          borderWidth: 0,
        };
      default:
        return {
          backgroundColor: defaultTheme.colors.primary,
          borderColor: defaultTheme.colors.primary,
        };
    }
  };

  // Styles basés sur la taille
  const getSizeStyle = (): ViewStyle => {
    switch (size) {
      case 'small':
        return {
          paddingVertical: defaultTheme.spacing.xs,
          paddingHorizontal: defaultTheme.spacing.m,
        };
      case 'medium':
        return {
          paddingVertical: defaultTheme.spacing.s,
          paddingHorizontal: defaultTheme.spacing.l,
        };
      case 'large':
        return {
          paddingVertical: defaultTheme.spacing.m,
          paddingHorizontal: defaultTheme.spacing.xl,
        };
      default:
        return {
          paddingVertical: defaultTheme.spacing.s,
          paddingHorizontal: defaultTheme.spacing.l,
        };
    }
  };

  // Style du texte basé sur la variante
  const getTextStyle = (): TextStyle => {
    switch (variant) {
      case 'outline':
      case 'text':
        return {
          color: defaultTheme.colors.primary,
        };
      default:
        return {
          color: '#ffffff',
        };
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        getVariantStyle(),
        getSizeStyle(),
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' || variant === 'text' ? defaultTheme.colors.primary : '#ffffff'} />
      ) : (
        <Text style={[styles.text, getTextStyle(), textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: defaultTheme.borderRadius.m,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
  disabled: {
    opacity: 0.5,
  },
});
