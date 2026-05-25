import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';
import { StackNavigationProp } from '@react-navigation/stack';
import { STATUS_COLORS } from '../constants/colors';
import { AuthStackParamList } from '../types/navigation';
import { TabBar } from '../components/TabBar';
import { InputModal } from '../components/InputModal';
import {
  getItems,
  createItem,
  updateItem,
  deleteItem,
  ItemResponse,
  ItemListResponse,
} from '../api/items';
import { formatDateTime } from '../utils/dateUtils';
import { handleApiError } from '../utils/errorHandler';

type ItemScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Item'>;

interface Props {
  navigation: ItemScreenNavigationProp;
}

export const ItemScreen: React.FC<Props> = ({ navigation }) => {
  const { colors, brandColor } = useTheme();
  const [itemsData, setItemsData] = useState<ItemListResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMutating, setIsMutating] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingItem, setEditingItem] = useState<ItemResponse | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getItems();
      setItemsData(data);
    } catch (error: any) {
      const message = handleApiError(error);
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleAddItem = useCallback(() => {
    setShowAddModal(true);
  }, []);

  const handleAddConfirm = useCallback(async (name: string) => {
    if (!name?.trim()) {
      Alert.alert('오류', '소지품 이름을 입력해주세요.');
      return;
    }
    try {
      setIsMutating(true);
      setShowAddModal(false);
      await createItem(name.trim());
      Alert.alert('성공', '소지품이 추가되었습니다.');
      await fetchData();
    } catch (error: any) {
      const message = handleApiError(error);
      Alert.alert('추가 실패', message);
    } finally {
      setIsMutating(false);
    }
  }, [fetchData]);

  const handleAddCancel = useCallback(() => {
    setShowAddModal(false);
  }, []);

  const handleEditItem = useCallback((item: ItemResponse) => {
    setEditingItem(item);
    setShowEditModal(true);
  }, []);

  const handleEditConfirm = useCallback(async (name: string) => {
    if (!name?.trim()) {
      Alert.alert('오류', '소지품 이름을 입력해주세요.');
      return;
    }
    if (!editingItem) {
      Alert.alert('오류', '편집할 소지품이 선택되지 않았습니다.');
      return;
    }

    try {
      setIsMutating(true);
      setShowEditModal(false);
      await updateItem(editingItem.id, name.trim());
      Alert.alert('성공', '소지품이 수정되었습니다.');
      await fetchData();
    } catch (error: any) {
      const message = handleApiError(error);
      Alert.alert('수정 실패', message);
    } finally {
      setIsMutating(false);
      setEditingItem(null);
    }
  }, [editingItem, fetchData]);

  const handleEditCancel = useCallback(() => {
    setShowEditModal(false);
    setEditingItem(null);
  }, []);

  const handleDeleteItem = useCallback((item: ItemResponse) => {
    Alert.alert(
      '소지품 삭제',
      `"${item.name}"을(를) 삭제하시겠습니까?`,
      [
        { text: '취소', style: 'cancel' },
        {
          text: '삭제',
          style: 'destructive',
          onPress: async () => {
            try {
              setIsMutating(true);
              await deleteItem(item.id);
              Alert.alert('성공', '소지품이 삭제되었습니다.');
              await fetchData();
            } catch (error: any) {
              const message = handleApiError(error);
              Alert.alert('삭제 실패', message);
            } finally {
              setIsMutating(false);
            }
          },
        },
      ]
    );
  }, [fetchData]);

  const handleRetry = useCallback(() => {
    fetchData();
  }, [fetchData]);

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
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
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
      flex: 1,
    },
    addButton: {
      backgroundColor: brandColor,
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 8,
      flexDirection: 'row',
      alignItems: 'center',
    },
    addButtonText: {
      color: '#FFFFFF',
      fontSize: 14,
      fontWeight: '600',
      marginLeft: 4,
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
    itemList: {
      marginTop: 8,
    },
    itemRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    itemIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: STATUS_COLORS.neutral.background,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },
    itemInfo: {
      flex: 1,
    },
    itemName: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 2,
    },
    itemLabel: {
      fontSize: 14,
      color: colors.subtext,
    },
    itemStatus: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
      marginRight: 8,
    },
    itemStatusText: {
      fontSize: 12,
      fontWeight: '500',
    },
    itemActions: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    actionButton: {
      padding: 8,
      marginLeft: 4,
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
  }), [colors, brandColor]);

  if (isLoading) {
    return (
      <SafeAreaView style={[dynamicStyles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={brandColor} />
        <Text style={[dynamicStyles.loadingText, { color: colors.text }]}>데이터를 불러오는 중...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={[dynamicStyles.errorContainer, { backgroundColor: colors.background }]}>
        <View style={dynamicStyles.errorContent}>
          <Ionicons name="alert-circle-outline" size={48} color={STATUS_COLORS.error.text} />
          <Text style={[dynamicStyles.errorText, { color: colors.text }]}>{error}</Text>
          <TouchableOpacity
            style={[dynamicStyles.retryButton, { backgroundColor: brandColor }]}
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
        <TouchableOpacity
          style={dynamicStyles.backButton}
          onPress={() => navigation.navigate('Dashboard')}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={dynamicStyles.headerTitle}>소지품 관리</Text>
        <TouchableOpacity
          style={[dynamicStyles.addButton, { opacity: isMutating ? 0.7 : 1 }]}
          onPress={handleAddItem}
          disabled={isMutating}
        >
          <Ionicons name="add" size={16} color="#FFFFFF" />
          <Text style={dynamicStyles.addButtonText}>소지품 추가</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={dynamicStyles.content} showsVerticalScrollIndicator={false}>
        <View style={dynamicStyles.titleSection}>
          <Text style={dynamicStyles.title}>내 소지품</Text>
          <Text style={dynamicStyles.subtitle}>등록된 소지품을 확인하고 관리하세요.</Text>
        </View>

        <View style={dynamicStyles.card}>
          <Text style={dynamicStyles.cardTitle}>소지품 목록</Text>
          <Text style={dynamicStyles.cardSubtitle}>RFID 태그가 부착된 소지품들입니다.</Text>

          {itemsData && itemsData.items.length > 0 ? (
            <View style={dynamicStyles.itemList}>
              {itemsData.items.map((item) => (
                <View key={item.id} style={dynamicStyles.itemRow}>
                  <View style={dynamicStyles.itemIcon}>
                    <Ionicons
                      name={item.is_pending ? "clock-outline" : "cube"}
                      size={20}
                      color={item.is_pending ? STATUS_COLORS.neutral.text : STATUS_COLORS.success.text}
                    />
                  </View>
                  <View style={dynamicStyles.itemInfo}>
                    <Text style={dynamicStyles.itemName}>{item.name}</Text>
                    <Text style={dynamicStyles.itemLabel}>
                      생성일: {formatDateTime(item.created_at)}
                    </Text>
                    {item.label_id && (
                      <Text style={dynamicStyles.itemLabel}>라벨 ID: {item.label_id}</Text>
                    )}
                  </View>
                  <View style={[
                    dynamicStyles.itemStatus,
                    {
                      backgroundColor: item.is_pending
                        ? STATUS_COLORS.neutral.background
                        : item.is_active
                        ? STATUS_COLORS.success.background
                        : STATUS_COLORS.error.background
                    }
                  ]}>
                    <Text style={[
                      dynamicStyles.itemStatusText,
                      {
                        color: item.is_pending
                          ? STATUS_COLORS.neutral.text
                          : item.is_active
                          ? STATUS_COLORS.success.text
                          : STATUS_COLORS.error.text
                      }
                    ]}>
                      {item.is_pending ? '대기중' : item.is_active ? '활성' : '비활성'}
                    </Text>
                  </View>
                  <View style={dynamicStyles.itemActions}>
                    <TouchableOpacity
                      style={[dynamicStyles.actionButton, { opacity: isMutating ? 0.7 : 1 }]}
                      onPress={() => handleEditItem(item)}
                      disabled={isMutating}
                    >
                      <Ionicons name="pencil" size={18} color={colors.subtext} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[dynamicStyles.actionButton, { opacity: isMutating ? 0.7 : 1 }]}
                      onPress={() => handleDeleteItem(item)}
                      disabled={isMutating}
                    >
                      <Ionicons name="trash" size={18} color={STATUS_COLORS.error.text} />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View style={dynamicStyles.emptyState}>
              <View style={dynamicStyles.emptyIcon}>
                <Ionicons name="cube-outline" size={32} color={STATUS_COLORS.neutral.text} />
              </View>
              <Text style={dynamicStyles.emptyTitle}>등록된 소지품이 없습니다.</Text>
              <Text style={dynamicStyles.emptySubtitle}>
                상단의 "소지품 추가" 버튼을 눌러{'\n'}첫 번째 소지품을 등록해보세요.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      <TabBar navigation={navigation} activeTab="Item" />

      <InputModal
        visible={showAddModal}
        title="소지품 추가"
        placeholder="소지품 이름을 입력하세요"
        onConfirm={handleAddConfirm}
        onCancel={handleAddCancel}
      />

      {showEditModal && editingItem && (
        <InputModal
          visible={showEditModal}
          title="소지품 수정"
          placeholder="새로운 이름을 입력하세요"
          defaultValue={editingItem.name}
          onConfirm={handleEditConfirm}
          onCancel={handleEditCancel}
        />
      )}
    </SafeAreaView>
  );
};