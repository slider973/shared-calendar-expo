import { Theme } from '../types';

/**
 * Thème par défaut de l'application
 */
export const defaultTheme: Theme = {
  colors: {
    primary: '#3498db',
    secondary: '#2ecc71',
    background: '#ffffff',
    card: '#f8f9fa',
    text: '#212529',
    border: '#e9ecef',
    notification: '#e74c3c',
    error: '#e74c3c',
    success: '#2ecc71',
    warning: '#f39c12'
  },
  spacing: {
    xs: 4,
    s: 8,
    m: 16,
    l: 24,
    xl: 32
  },
  borderRadius: {
    s: 4,
    m: 8,
    l: 16
  }
};

/**
 * Thème sombre de l'application
 */
export const darkTheme: Theme = {
  colors: {
    primary: '#3498db',
    secondary: '#2ecc71',
    background: '#121212',
    card: '#1e1e1e',
    text: '#f8f9fa',
    border: '#2d2d2d',
    notification: '#e74c3c',
    error: '#e74c3c',
    success: '#2ecc71',
    warning: '#f39c12'
  },
  spacing: {
    xs: 4,
    s: 8,
    m: 16,
    l: 24,
    xl: 32
  },
  borderRadius: {
    s: 4,
    m: 8,
    l: 16
  }
};
