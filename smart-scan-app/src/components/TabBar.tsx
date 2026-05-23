import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../types/navigation';

type NavigationProp = StackNavigationProp<AuthStackParamList>;

interface TabBarProps {
  navigation: NavigationProp;
  activeTab: 'Dashboard' | 'Device' | 'Item' | 'Member';
}

interface TabButtonProps {
  iconName: keyof typeof Ionicons.glyphMap;
  label: string;
  isActive: boolean;
  onPress?: () => void;
}

const TabButton: React.FC<TabButtonProps> = ({ iconName, label, isActive, onPress }) => {
  const { colors, brandColor } = useTheme();

  return (
    <TouchableOpacity style={styles.tabButton} onPress={onPress}>
      <Ionicons
        name={iconName}
        size={24}
        color={isActive ? brandColor : colors.subtext}
      />
      <Text style={[
        styles.tabLabel,
        { color: isActive ? brandColor : colors.subtext }
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

export const TabBar: React.FC<TabBarProps> = ({ navigation, activeTab }) => {
  const { colors } = useTheme();

  const dynamicStyles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      backgroundColor: colors.card,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      paddingBottom: 20,
      paddingTop: 10,
    },
  });

  return (
    <View style={dynamicStyles.container}>
      <TabButton
        iconName="home-outline"
        label="홈"
        isActive={activeTab === 'Dashboard'}
        onPress={() => navigation.navigate('Dashboard')}
      />
      <TabButton
        iconName="hardware-chip-outline"
        label="디바이스"
        isActive={activeTab === 'Device'}
        onPress={() => navigation.navigate('Device')}
      />
      <TabButton
        iconName="cube-outline"
        label="물품"
        isActive={activeTab === 'Item'}
        onPress={() => navigation.navigate('Item')}
      />
      <TabButton
        iconName="people-outline"
        label="구성원"
        isActive={activeTab === 'Member'}
        onPress={() => navigation.navigate('Member')}
      />
      <TabButton
        iconName="notifications-outline"
        label="알림"
        isActive={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  tabLabel: {
    fontSize: 12,
    marginTop: 4,
  },
});