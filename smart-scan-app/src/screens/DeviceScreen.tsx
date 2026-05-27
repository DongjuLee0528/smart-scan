/**
 * @fileoverview Device Screen component for managing smart scan device registration.
 * Provides interface for registering NFC scanning devices, viewing device status,
 * and managing device connections. Handles device serial number validation,
 * registration processes, and device unlinking with proper error handling.
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
import { STATUS_COLORS } from '../constants/colors';
import { AuthStackParamList } from '../types/navigation';
import { TabBar } from '../components/TabBar';
import { handleApiError } from '../utils/errorHandler';

/** Navigation prop type for the Device screen */
type DeviceScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Device'>;

/**
 * Props interface for the DeviceScreen component.
 */
interface Props {
  /** React Navigation prop for screen navigation */
  navigation: DeviceScreenNavigationProp;
}

/**
 * DeviceScreen component that provides device management functionality.
 * Allows users to register new scanning devices, view current device status,
 * and unlink devices when needed. Includes comprehensive error handling
 * and user feedback for all device operations.
 *
 * @param navigation - React Navigation prop for screen transitions
 */
export const DeviceScreen: React.FC<Props> = ({ navigation }) => {
  const { colors, brandColor } = useTheme();

  // State management for device data and UI states
  const [deviceData, setDeviceData] = useState<MyDeviceResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [serial, setSerial] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [isUnlinking, setIsUnlinking] = useState(false);

  /**
   * Fetches the current user's device registration status from the server.
   * Updates component state with device information or handles errors appropriately.
   */
  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const device = await getMyDevice();
      setDeviceData(device);
    } catch (error: any) {
      const message = handleApiError(error);
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Handles device registration with the provided serial number.
   * Validates input, registers the device, and updates the UI accordingly.
   */
  const handleRegister = useCallback(async () => {
    if (!serial || serial.trim() === '') {
      Alert.alert('Error', 'Please enter a serial number.');
      return;
    }

    setIsRegistering(true);
    try {
      await registerDevice(serial.trim());
      Alert.alert('Success', 'Device has been registered successfully.');
      setSerial('');
      await fetchData(); // Refresh device data to show the new registration
    } catch (error: any) {
      const message = handleApiError(error);
      Alert.alert('Registration Failed', message);
    } finally {
      setIsRegistering(false);
    }
  }, [serial, fetchData]);

  /**
   * Handles device unlinking with user confirmation.
   * Shows a warning dialog and processes the unlinking if confirmed.
   */
  const handleUnlink = useCallback(async () => {
    Alert.alert(
      'Unlink Device',
      'Unlinking this device may affect related tag and item information. Do you want to continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Unlink',
          style: 'destructive',
          onPress: async () => {
            setIsUnlinking(true);
            try {
              await unlinkDevice();
              Alert.alert('Success', 'Device has been unlinked successfully.');
              await fetchData(); // Refresh to show no device is registered
            } catch (error: any) {
              const message = handleApiError(error);
              Alert.alert('Unlink Failed', message);
            } finally {
              setIsUnlinking(false);
            }
          },
        },
      ]
    );
  }, [fetchData]);

  /**
   * Retry handler for failed data loading attempts.
   * Provides user-initiated error recovery mechanism.
   */
  const handleRetry = useCallback(() => {
    fetchData();
  }, [fetchData]);

  const dynamicStyles = useMemo(() => StyleSheet.create({
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
  }), [colors, brandColor]);

  /**
   * Effect hook to load device data when the component mounts.
   * Includes cleanup to prevent state updates on unmounted components.
   */
  useEffect(() => {
    let cancelled = false;

    const loadData = async () => {
      if (!cancelled) {
        await fetchData();
      }
    };

    loadData();

    return () => {
      cancelled = true;
    };
  }, [fetchData]);

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={brandColor} />
        <Text style={[styles.loadingText, { color: colors.text }]}>Loading data...</Text>
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
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={dynamicStyles.container}>
      <View style={dynamicStyles.header}>
        <TouchableOpacity
          style={dynamicStyles.backButton}
          onPress={() => navigation.navigate('Dashboard')}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={dynamicStyles.headerTitle}>Device Management</Text>
      </View>

      <ScrollView style={dynamicStyles.content} showsVerticalScrollIndicator={false}>
        <View style={dynamicStyles.card}>
          <Text style={dynamicStyles.cardTitle}>RFID Reader</Text>
          <Text style={dynamicStyles.cardSubtitle}>View and manage your registered reader device.</Text>

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
                  Registered: {formatDateTime(deviceData.created_at)}
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
                  <Text style={dynamicStyles.unlinkButtonText}>Unlink</Text>
                )}
              </TouchableOpacity>
            </View>
          ) : (
            <View style={dynamicStyles.emptyState}>
              <View style={dynamicStyles.emptyIcon}>
                <Ionicons name="hardware-chip-outline" size={24} color={STATUS_COLORS.neutral.text} />
              </View>
              <Text style={dynamicStyles.emptyTitle}>No device registered.</Text>
              <Text style={dynamicStyles.emptySubtitle}>Register a device below using its serial number.</Text>
            </View>
          )}
        </View>

        {!deviceData?.device && (
          <View style={dynamicStyles.card}>
            <Text style={dynamicStyles.cardTitle}>Register New Device</Text>
            <View style={dynamicStyles.inputContainer}>
              <Text style={dynamicStyles.inputLabel}>Serial Number</Text>
              <TextInput
                style={dynamicStyles.textInput}
                value={serial}
                onChangeText={setSerial}
                placeholder="e.g.: SSH-2025-0001"
                placeholderTextColor={colors.subtext}
                autoCapitalize="none"
              />
            </View>
            <TouchableOpacity
              style={[
                dynamicStyles.registerButton,
                { opacity: isRegistering || !serial || serial.trim() === '' ? 0.7 : 1 }
              ]}
              onPress={handleRegister}
              disabled={isRegistering || !serial || serial.trim() === ''}
            >
              {isRegistering ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={dynamicStyles.registerButtonText}>Register Device</Text>
              )}
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      <TabBar navigation={navigation} activeTab="Device" />
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
});