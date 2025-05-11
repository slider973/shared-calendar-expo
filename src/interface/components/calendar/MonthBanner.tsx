import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface MonthBannerProps {
  date: Date;
  selectedMonth: number;
  onMonthSelect: (monthIdx: number) => void;
}

const months = ['Janvier', 'Février', 'Mars'];

export const MonthBanner: React.FC<MonthBannerProps> = ({ date, selectedMonth, onMonthSelect }) => {
  return (
    <LinearGradient
      colors={["#9E5CFF", "#766BFF"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.gradient}
    >
      <View style={styles.row}>
        <Text style={styles.dateText}>{date.getFullYear()}/{(date.getMonth()+1).toString().padStart(2,'0')}/{date.getDate().toString().padStart(2,'0')}</Text>
        <View style={styles.tabs}>
          {months.map((m, idx) => (
            <TouchableOpacity
              key={m}
              style={[styles.tab, idx === selectedMonth && styles.activeTab]}
              onPress={() => onMonthSelect(idx)}
              activeOpacity={0.8}
            >
              <Text style={[styles.tabText, idx === selectedMonth && styles.activeTabText]}>{m}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  dateText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 10,
    opacity: 0.93,
  },
  tabs: {
    flexDirection: 'row',
    gap: 8,
  },
  tab: {
    paddingVertical: 5,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginRight: 6,
    backgroundColor: 'transparent',
    elevation: 0,
  },
  activeTab: {
    backgroundColor: '#fff',
    elevation: 3,
    shadowColor: '#9E5CFF',
    shadowOpacity: 0.10,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 6,
  },
  tabText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '500',
  },
  activeTabText: {
    color: '#9E5CFF',
    fontWeight: '700',
  },
});
