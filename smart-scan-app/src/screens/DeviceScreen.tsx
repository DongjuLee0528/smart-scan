import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  getMyDevice,
  registerDevice,
  unlinkDevice,
  MyDeviceResponse,
} from '../api/device';
import { formatDateTime } from '../utils/dateUtils';

const STATUS_COLORS = {
  success: {
    text: '#10B981',
    background: '#D1FAE5',
  },
  neutral: {
    text: '#6B7280',
    background: '#F3F4F6',
  },
  error: {
    text: '#EF4444',
    background: '#FEE2E2',
  },
};

type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
  Dashboard: undefined;
  Device: undefined;
};

type DeviceScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Device'>;

interface Props {
  navigation: DeviceScreenNavigationProp;
}

const TabButton: React.FC<{
  iconName: keyof typeof Ionicons.glyphMap;
  label: string;
  isActive?: boolean;
  onPress?: () => void;
}> = ({ iconName, label, isActive = false, onPress }) => {
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

export const DeviceScreen: React.FC<Props> = ({ navigation }) => {
  const { colors, brandColor } = useTheme();
  const [deviceData, setDeviceData] = useState<MyDeviceResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [serial, setSerial] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [isUnlinking, setIsUnlinking] = useState(false);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const device = await getMyDevice();
      setDeviceData(device);
    } catch (error: any) {
      let message = '데이터를 불러오는데 실패했습니다.';

      if (error.code === 'NETWORK_ERROR') {
        message = '네트워크 연결을 확인해주세요.';
      } else if (error.response?.status === 401) {
        message = '로그인이 필요합니다.';
      } else if (error.response?.status >= 500) {
        message = '서버에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.';
      } else if (error.response?.data?.detail) {
        message = error.response.data.detail;
      }

      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!serial.trim()) {
      Alert.alert('오류', '시리얼 번호를 입력해주세요.');
      return;
    }

    setIsRegistering(true);
    try {
      await registerDevice(serial.trim());
      Alert.alert('성공', '기기가 등록되었습니다.');
      setSerial('');
      await fetchData();
    } catch (error: any) {
      let message = '기기 등록에 실패했습니다.';

      if (error.code === 'NETWORK_ERROR') {
        message = '네트워크 연결을 확인해주세요.';
      } else if (error.response?.status === 400) {
        message = '잘못된 시리얼 번호입니다.';
      } else if (error.response?.status === 409) {
        message = '이미 등록된 기기입니다.';
      } else if (error.response?.status >= 500) {
        message = '서버에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.';
      } else if (error.response?.data?.detail) {
        message = error.response.data.detail;
      }

      Alert.alert('등록 실패', message);
    } finally {
      setIsRegistering(false);
    }
  };

  const handleUnlink = async () => {
    Alert.alert(
      '기기 연결 해제',
      '기기 연결을 해제하면 관련 태그/소지품 정보도 영향을 받을 수 있습니다. 계속하시겠습니까?',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '해제',
          style: 'destructive',
          onPress: async () => {
            setIsUnlinking(true);
            try {
              await unlinkDevice();
              Alert.alert('성공', '기기 연결이 해제되었습니다.');
              await fetchData();
            } catch (error: any) {
              let message = '기기 연결 해제에 실패했습니다.';

              if (error.code === 'NETWORK_ERROR') {
                message = '네트워크 연결을 확인해주세요.';
              } else if (error.response?.status >= 500) {
                message = '서버에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.';
              } else if (error.response?.data?.detail) {
                message = error.response.data.detail;
              }

              Alert.alert('해제 실패', message);
            } finally {
              setIsUnlinking(false);
            }
          },
        },
      ]
    );
  };

  const handleRetry = () => {
    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={brandColor} />
        <Text style={[styles.loadingText, { color: colors.text }]}>데이터를 불러오는 중...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={[styles.errorContainer, { backgroundColor: colors.background }]}>
        <View style={styles.errorContent}>
          <Ionicons name="alert-circle-outline" size={48} color={STATUS_COLORS.error.text} />
          <Text style={[styles.errorText, { color: colors.text }]}>{error}</Text>
          <TouchableOpacity
            style={[styles.retryButton, { backgroundColor: brandColor }]}
            onPress={handleRetry}
          >
            <Text style={styles.retryButtonText}>다시 시도</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const dynamicStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 24,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    backButton: {
      marginRight: 16,
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.text,
    },
    content: {
      flex: 1,
      paddingHorizontal: 24,
      paddingTop: 24,
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
    deviceInfo: {
      flexDirection: 'row',
      alignItems: 'flex-start',
    },
    deviceDetails: {
      flex: 1,
    },
    deviceIcon: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: STATUS_COLORS.success.background,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 16,
    },
    serialText: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      fontFamily: 'monospace',
    },
    dateText: {
      fontSize: 14,
      color: colors.subtext,
      marginTop: 4,
    },
    unlinkButton: {
      backgroundColor: STATUS_COLORS.error.background,
      borderColor: STATUS_COLORS.error.text,
      borderWidth: 1,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 8,
      marginLeft: 12,
    },
    unlinkButtonText: {
      color: STATUS_COLORS.error.text,
      fontSize: 14,
      fontWeight: '600',
    },
    emptyState: {
      alignItems: 'center',
      paddingVertical: 24,
    },
    emptyIcon: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: STATUS_COLORS.neutral.background,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 12,
    },
    emptyTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 4,
    },
    emptySubtitle: {
      fontSize: 14,
      color: colors.subtext,
    },
    inputContainer: {
      marginBottom: 16,
    },
    inputLabel: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 8,
    },
    textInput: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 12,
      fontSize: 16,
      color: colors.text,
      backgroundColor: colors.background,
    },
    registerButton: {
      backgroundColor: brandColor,
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderRadius: 8,
      alignItems: 'center',
    },
    registerButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '600',
    },
    bottomTabs: {
      flexDirection: 'row',
      backgroundColor: colors.card,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      paddingBottom: 20,
      paddingTop: 10,
    },
  });

  return (
    <SafeAreaView style={dynamicStyles.container}>
      <View style={dynamicStyles.header}>
        <TouchableOpacity
          style={dynamicStyles.backButton}
          onPress={() => navigation.navigate('Dashboard')}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={dynamicStyles.headerTitle}>디바이스 관리</Text>
      </View>

      <ScrollView style={dynamicStyles.content} showsVerticalScrollIndicator={false}>
        <View style={dynamicStyles.card}>
          <Text style={dynamicStyles.cardTitle}>RFID 리더기</Text>
          <Text style={dynamicStyles.cardSubtitle}>등록된 리더기를 확인하고 관리하세요.</Text>

          {deviceData?.device ? (
            <View style={dynamicStyles.deviceInfo}>
              <View style={dynamicStyles.deviceIcon}>
                <Ionicons name="hardware-chip" size={24} color={STATUS_COLORS.success.text} />
              </View>
              <View style={dynamicStyles.deviceDetails}>
                <Text style={dynamicStyles.serialText}>
                  {deviceData.device.serial_number}
                </Text>
                <Text style={dynamicStyles.dateText}>
                  등록일: {formatDateTime(deviceData.created_at)}
                </Text>
              </View>
              <TouchableOpacity
                style={[
                  dynamicStyles.unlinkButton,
                  { opacity: isUnlinking ? 0.7 : 1 }
                ]}
                onPress={handleUnlink}
                disabled={isUnlinking}
              >
                {isUnlinking ? (
                  <ActivityIndicator size="small" color={STATUS_COLORS.error.text} />
                ) : (
                  <Text style={dynamicStyles.unlinkButtonText}>연결 해제</Text>
                )}
              </TouchableOpacity>
            </View>
          ) : (
            <View style={dynamicStyles.emptyState}>
              <View style={dynamicStyles.emptyIcon}>
                <Ionicons name="hardware-chip-outline" size={24} color={STATUS_COLORS.neutral.text} />
              </View>
              <Text style={dynamicStyles.emptyTitle}>등록된 기기가 없습니다.</Text>
              <Text style={dynamicStyles.emptySubtitle}>아래에서 시리얼 번호로 기기를 등록하세요.</Text>
            </View>
          )}
        </View>

        {!deviceData?.device && (
          <View style={dynamicStyles.card}>
            <Text style={dynamicStyles.cardTitle}>새 기기 등록</Text>
            <View style={dynamicStyles.inputContainer}>
              <Text style={dynamicStyles.inputLabel}>시리얼 번호</Text>
              <TextInput
                style={dynamicStyles.textInput}
                value={serial}
                onChangeText={setSerial}
                placeholder="예: SSH-2025-0001"
                placeholderTextColor={colors.subtext}
                autoCapitalize="none"
              />
            </View>
            <TouchableOpacity
              style={[
                dynamicStyles.registerButton,
                { opacity: isRegistering || !serial.trim() ? 0.7 : 1 }
              ]}
              onPress={handleRegister}
              disabled={isRegistering || !serial.trim()}
            >
              {isRegistering ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={dynamicStyles.registerButtonText}>기기 등록</Text>
              )}
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      <View style={dynamicStyles.bottomTabs}>
        <TabButton
          iconName="home-outline"
          label="홈"
          onPress={() => navigation.navigate('Dashboard')}
        />
        <TabButton iconName="hardware-chip-outline" label="디바이스" isActive={true} />
        <TabButton iconName="cube-outline" label="물품" />
        <TabButton iconName="people-outline" label="구성원" />
        <TabButton iconName="notifications-outline" label="알림" />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
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
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
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