import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { AuthNavigator } from './src/navigation/AuthNavigator';
import {
  registerForPushNotificationsAsync,
  savePushTokenToServer,
  addNotificationReceivedListener,
  addNotificationResponseReceivedListener
} from './src/utils/pushNotifications';

export default function App() {
  useEffect(() => {
    async function setupPushNotifications() {
      try {
        const token = await registerForPushNotificationsAsync();
        if (token) {
          console.log('📱 Expo Push Token:', token);
          await savePushTokenToServer(token);
        }
      } catch (error) {
        console.error('푸시 알림 설정 실패:', error);
      }
    }

    setupPushNotifications();

    const notificationListener = addNotificationReceivedListener(notification => {
      console.log('🔔 알림 수신:', notification);
    });

    const responseListener = addNotificationResponseReceivedListener(response => {
      console.log('👆 알림 클릭:', response);
    });

    return () => {
      notificationListener.remove();
      responseListener.remove();
    };
  }, []);

  return (
    <NavigationContainer>
      <AuthNavigator />
      <StatusBar />
    </NavigationContainer>
  );
}
