import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';
import { StackNavigationProp } from '@react-navigation/stack';
import { STATUS_COLORS } from '../constants/colors';
import { AuthStackParamList } from '../types/navigation';
import { TabBar } from '../components/TabBar';
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  NotificationResponse,
  NotificationListResponse,
} from '../api/notifications';
import { handleApiError } from '../utils/errorHandler';
import { getRelativeTime } from '../utils/dateUtils';

type NotificationScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Notification'>;

interface Props {
  navigation: NotificationScreenNavigationProp;
}

interface NotificationItemProps {
  notification: NotificationResponse;
  onPress: (notification: NotificationResponse) => void;
  isMarking: boolean;
}

const NotificationItem: React.FC<NotificationItemProps> = React.memo(({ notification, onPress, isMarking }) => {
  const { colors, brandColor } = useTheme();

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'missing_alert':
        return { name: 'alert-circle' as const, color: STATUS_COLORS.error.text };
      case 'manual_alert':
        return { name: 'mail' as const, color: brandColor };
      default:
        return { name: 'checkmark-circle' as const, color: STATUS_COLORS.success.text };
    }
  };

  const icon = getNotificationIcon(notification.type);

  return (
    <TouchableOpacity
      style={[
        styles.notificationItem,
        {
          backgroundColor: notification.is_read ? colors.card : `${brandColor}10`,
          borderColor: colors.border,
        },
      ]}
      onPress={() => onPress(notification)}
      disabled={isMarking}
    >
      <View style={[styles.notificationIcon, { backgroundColor: `${icon.color}20` }]}>
        <Ionicons name={icon.name} size={20} color={icon.color} />
      </View>

      <View style={styles.notificationContent}>
        <View style={styles.notificationHeader}>
          <Text
            style={[
              styles.notificationTitle,
              {
                color: colors.text,
                fontWeight: notification.is_read ? '500' : 'bold',
              },
            ]}
            numberOfLines={1}
          >
            {notification.title}
          </Text>
          <Text style={[styles.notificationTime, { color: colors.subtext }]}>
            {getRelativeTime(notification.created_at)}
          </Text>
        </View>
        <Text
          style={[
            styles.notificationMessage,
            {
              color: colors.subtext,
              fontWeight: notification.is_read ? 'normal' : '500',
            },
          ]}
          numberOfLines={2}
        >
          {notification.message}
        </Text>
      </View>

      {!notification.is_read && (
        <View style={[styles.unreadIndicator, { backgroundColor: brandColor }]} />
      )}

      {isMarking && (
        <View style={styles.markingIndicator}>
          <ActivityIndicator size="small" color={brandColor} />
        </View>
      )}
    </TouchableOpacity>
  );
});

export const NotificationScreen: React.FC<Props> = ({ navigation }) => {
  const { colors, brandColor } = useTheme();
  const [notificationsData, setNotificationsData] = useState<NotificationListResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [markingId, setMarkingId] = useState<number | null>(null);
  const [isMarkingAll, setIsMarkingAll] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getNotifications();
      setNotificationsData(data);
    } catch (error: any) {
      const message = handleApiError(error);
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleMarkAsRead = useCallback(async (notification: NotificationResponse) => {
    if (notification.is_read) return;

    try {
      setMarkingId(notification.id);
      await markAsRead(notification.id);
      await fetchData();
    } catch (error: any) {
      const message = handleApiError(error);
      setError(message);
    } finally {
      setMarkingId(null);
    }
  }, [fetchData]);

  const handleMarkAllAsRead = useCallback(async () => {
    if (!hasUnreadNotifications) return;

    try {
      setIsMarkingAll(true);
      setError(null);
      await markAllAsRead();
      await fetchData();
    } catch (error: any) {
      const message = handleApiError(error);
      setError(message);
    } finally {
      setIsMarkingAll(false);
    }
  }, [fetchData]);

  const handleRetry = useCallback(() => {
    fetchData();
  }, [fetchData]);

  const hasUnreadNotifications = useMemo(() => {
    return notificationsData?.notifications.some(n => !n.is_read) ?? false;
  }, [notificationsData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const dynamicStyles = useMemo(() => StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 24,
    },
    loadingText: {
      marginTop: 16,
      fontSize: 16,
      color: colors.text,
    },
    errorContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 24,
    },
    errorContent: {
      alignItems: 'center',
    },
    errorText: {
      marginTop: 16,
      marginBottom: 24,
      fontSize: 16,
      textAlign: 'center',
      color: colors.text,
    },
    retryButton: {
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 8,
      backgroundColor: brandColor,
    },
    retryButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: 'bold',
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 24,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    headerLeft: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    backButton: {
      marginRight: 16,
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.text,
    },
    markAllButton: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 6,
      backgroundColor: brandColor,
      opacity: hasUnreadNotifications && !isMarkingAll ? 1 : 0.5,
    },
    markAllButtonText: {
      color: '#FFFFFF',
      fontSize: 14,
      fontWeight: '600',
    },
    content: {
      flex: 1,
      paddingHorizontal: 24,
      paddingTop: 24,
    },
    titleSection: {
      marginBottom: 24,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 4,
    },
    subtitle: {
      fontSize: 16,
      color: colors.subtext,
    },
    card: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 20,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: colors.border,
    },
    cardTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 4,
    },
    cardSubtitle: {
      fontSize: 14,
      color: colors.subtext,
      marginBottom: 20,
    },
    notificationsList: {
      marginTop: 8,
    },
    emptyState: {
      alignItems: 'center',
      paddingVertical: 40,
    },
    emptyIcon: {
      width: 64,
      height: 64,
      borderRadius: 32,
      backgroundColor: STATUS_COLORS.neutral.background,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 16,
    },
    emptyTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 8,
    },
    emptySubtitle: {
      fontSize: 14,
      color: colors.subtext,
      textAlign: 'center',
      lineHeight: 20,
    },
  }), [colors, brandColor, hasUnreadNotifications, isMarkingAll]);

  if (isLoading) {
    return (
      <SafeAreaView style={[dynamicStyles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={brandColor} />
        <Text style={dynamicStyles.loadingText}>알림을 불러오는 중...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={[dynamicStyles.errorContainer, { backgroundColor: colors.background }]}>
        <View style={dynamicStyles.errorContent}>
          <Ionicons name="alert-circle-outline" size={48} color={STATUS_COLORS.error.text} />
          <Text style={dynamicStyles.errorText}>{error}</Text>
          <TouchableOpacity
            style={dynamicStyles.retryButton}
            onPress={handleRetry}
          >
            <Text style={dynamicStyles.retryButtonText}>다시 시도</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={dynamicStyles.container}>
      <View style={dynamicStyles.header}>
        <View style={dynamicStyles.headerLeft}>
          <TouchableOpacity
            style={dynamicStyles.backButton}
            onPress={() => navigation.navigate('Dashboard')}
          >
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={dynamicStyles.headerTitle}>알림</Text>
        </View>
        <TouchableOpacity
          style={dynamicStyles.markAllButton}
          onPress={handleMarkAllAsRead}
          disabled={!hasUnreadNotifications || isMarkingAll}
        >
          {isMarkingAll ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={dynamicStyles.markAllButtonText}>모두 읽음</Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView style={dynamicStyles.content} showsVerticalScrollIndicator={false}>
        <View style={dynamicStyles.titleSection}>
          <Text style={dynamicStyles.title}>내 알림</Text>
          <Text style={dynamicStyles.subtitle}>수신한 알림을 확인하고 읽음 처리합니다.</Text>
        </View>

        <View style={dynamicStyles.card}>
          <Text style={dynamicStyles.cardTitle}>알림 목록</Text>
          <Text style={dynamicStyles.cardSubtitle}>받은 알림을 확인하세요.</Text>

          {notificationsData && notificationsData.notifications.length > 0 ? (
            <View style={dynamicStyles.notificationsList}>
              {notificationsData.notifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onPress={handleMarkAsRead}
                  isMarking={markingId === notification.id}
                />
              ))}
            </View>
          ) : (
            <View style={dynamicStyles.emptyState}>
              <View style={dynamicStyles.emptyIcon}>
                <Ionicons name="notifications-outline" size={32} color={STATUS_COLORS.neutral.text} />
              </View>
              <Text style={dynamicStyles.emptyTitle}>받은 알림이 없습니다.</Text>
              <Text style={dynamicStyles.emptySubtitle}>
                새로운 알림이 도착하면 여기에 표시됩니다.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      <TabBar navigation={navigation} activeTab="Notification" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 1,
    position: 'relative',
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  notificationTitle: {
    fontSize: 16,
    flex: 1,
    marginRight: 8,
  },
  notificationTime: {
    fontSize: 12,
  },
  notificationMessage: {
    fontSize: 14,
    lineHeight: 20,
  },
  unreadIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    position: 'absolute',
    top: 12,
    right: 12,
  },
  markingIndicator: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
});