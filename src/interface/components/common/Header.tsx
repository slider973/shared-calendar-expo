import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface HeaderProps {
  title?: string;
  onMenuPress?: () => void;
  onSettingsPress?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ title, onMenuPress, onSettingsPress }) => (
  <View style={styles.container}>
    <TouchableOpacity onPress={onMenuPress} style={styles.iconBtn}>
      <Ionicons name="menu" size={26} color="#1B2430" />
    </TouchableOpacity>
    <Text style={styles.title}>{title}</Text>
    <TouchableOpacity onPress={onSettingsPress} style={styles.iconBtn}>
      <Ionicons name="settings-outline" size={24} color="#1B2430" />
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    height: Platform.OS === 'ios' ? 56 : 48,
    paddingHorizontal: 16,
    borderBottomWidth: 0,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
    elevation: 2,
    zIndex: 10,
  },
  title: {
    fontSize: 17,
    fontWeight: '500',
    color: '#1B2430',
    fontFamily: Platform.OS === 'ios' ? 'System' : undefined,
  },
  iconBtn: {
    padding: 6,
  },
});
