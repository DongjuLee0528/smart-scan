/**
 * @fileoverview Bottom TabBar component for main app navigation.
 * Provides a consistent navigation interface across all main screens
 * with visual indicators for the active tab and icon-based navigation.
 * Supports theming and responsive design for different screen sizes.
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../types/navigation';

/** Navigation prop type for the TabBar component */
type NavigationProp = StackNavigationProp<AuthStackParamList>;

/**
 * Props interface for the TabBar component.
 * Defines navigation prop and active tab state for proper tab highlighting.
 */
interface TabBarProps {
  /** React Navigation prop for handling tab navigation */
  navigation: NavigationProp;
  /** Currently active tab identifier for visual highlighting */
  activeTab: 'Dashboard' | 'Device' | 'Item' | 'Member' | 'Notification';
}

/**
 * Props interface for individual tab button components.
 * Used to render each tab with appropriate styling and interaction.
 */
interface TabButtonProps {
  /** Ionicons icon name to display for this tab */
  iconName: keyof typeof Ionicons.glyphMap;
  /** Text label displayed below the icon */
  label: string;
  /** Whether this tab is currently active (highlighted) */
  isActive: boolean;
  /** Optional press handler for tab interaction */
  onPress?: () => void;
}

/**
 * Individual tab button component that renders an icon and label.
 * Applies appropriate styling based on active state and theme colors.
 *
 * @param iconName - Ionicons icon to display
 * @param label - Text label for the tab
 * @param isActive - Whether this tab is currently selected
 * @param onPress - Handler for tab press events
 */
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

/**
 * TabBar component that provides bottom navigation for the app.
 * Renders tab buttons for all main sections with proper active state handling.
 * Integrates with React Navigation for seamless screen transitions.
 *
 * @param navigation - React Navigation prop for screen navigation
 * @param activeTab - Currently active tab for proper highlighting
 */
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
        isActive={activeTab === 'Notification'}
        onPress={() => navigation.navigate('Notification')}
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