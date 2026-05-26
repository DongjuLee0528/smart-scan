/**
 * @fileoverview Main navigation stack for the Smart Scan application
 *
 * This file defines the primary navigation structure using React Navigation's
 * Stack Navigator. It manages the flow between authentication and main app screens,
 * providing type-safe navigation throughout the application.
 */

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { LoginScreen } from '../screens/LoginScreen';
import { SignupScreen } from '../screens/SignupScreen';
import { DashboardScreen } from '../screens/DashboardScreen';
import { DeviceScreen } from '../screens/DeviceScreen';
import { ItemScreen } from '../screens/ItemScreen';
import { MemberScreen } from '../screens/MemberScreen';
import { NotificationScreen } from '../screens/NotificationScreen';
import { AuthStackParamList } from '../types/navigation';

/** Create typed stack navigator instance */
const Stack = createStackNavigator<AuthStackParamList>();

/**
 * Main authentication and app navigation stack
 *
 * Provides the primary navigation structure for the Smart Scan app.
 * Includes all main screens with hidden headers for custom UI design.
 * The navigation starts with the Login screen and allows seamless
 * transitions to all other app sections.
 *
 * @returns {React.FC} Stack Navigator component with all app screens
 */
export const AuthNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        // Hide default React Navigation header for custom design
        headerShown: false,
      }}
      // Start user journey from login screen
      initialRouteName="Login"
    >
      {/* Authentication screens */}
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />

      {/* Main application screens */}
      <Stack.Screen name="Dashboard" component={DashboardScreen} />
      <Stack.Screen name="Device" component={DeviceScreen} />
      <Stack.Screen name="Item" component={ItemScreen} />
      <Stack.Screen name="Member" component={MemberScreen} />
      <Stack.Screen name="Notification" component={NotificationScreen} />
    </Stack.Navigator>
  );
};