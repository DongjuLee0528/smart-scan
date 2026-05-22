import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';
import { StackNavigationProp } from '@react-navigation/stack';
import { STATUS_COLORS } from '../constants/colors';
import { AuthStackParamList } from '../types/navigation';
import { TabBar } from '../components/TabBar';

type ItemScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Item'>;

interface Props {
  navigation: ItemScreenNavigationProp;
}

interface ItemData {
  id: number;
  name: string;
  label?: string;
  status: 'found' | 'lost';
  icon: keyof typeof Ionicons.glyphMap;
}


export const ItemScreen: React.FC<Props> = ({ navigation }) => {
  const { colors, brandColor } = useTheme();
  const [items, setItems] = useState<ItemData[]>([]);

  const handleAddItem = () => {
    Alert.alert('준비 중', '소지품 추가 기능을 준비 중입니다.');
  };

  const handleEditItem = (id: number) => {
    Alert.alert('준비 중', '소지품 수정 기능을 준비 중입니다.');
  };

  const handleDeleteItem = (id: number) => {
    Alert.alert('준비 중', '소지품 삭제 기능을 준비 중입니다.');
  };

  const dynamicStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
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
        <Text style={dynamicStyles.headerTitle}>소지품 관리</Text>
        <TouchableOpacity
          style={dynamicStyles.addButton}
          onPress={handleAddItem}
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

          {items.length > 0 ? (
            <View style={dynamicStyles.itemList}>
              {items.map((item) => (
                <View key={item.id} style={dynamicStyles.itemRow}>
                  <View style={dynamicStyles.itemIcon}>
                    <Ionicons
                      name={item.icon}
                      size={20}
                      color={STATUS_COLORS.neutral.text}
                    />
                  </View>
                  <View style={dynamicStyles.itemInfo}>
                    <Text style={dynamicStyles.itemName}>{item.name}</Text>
                    {item.label && (
                      <Text style={dynamicStyles.itemLabel}>라벨: {item.label}</Text>
                    )}
                  </View>
                  <View style={[
                    dynamicStyles.itemStatus,
                    {
                      backgroundColor: item.status === 'found'
                        ? STATUS_COLORS.success.background
                        : STATUS_COLORS.error.background
                    }
                  ]}>
                    <Text style={[
                      dynamicStyles.itemStatusText,
                      {
                        color: item.status === 'found'
                          ? STATUS_COLORS.success.text
                          : STATUS_COLORS.error.text
                      }
                    ]}>
                      {item.status === 'found' ? '정상' : '누락'}
                    </Text>
                  </View>
                  <View style={dynamicStyles.itemActions}>
                    <TouchableOpacity
                      style={dynamicStyles.actionButton}
                      onPress={() => handleEditItem(item.id)}
                    >
                      <Ionicons name="pencil" size={18} color={colors.subtext} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={dynamicStyles.actionButton}
                      onPress={() => handleDeleteItem(item.id)}
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
    </SafeAreaView>
  );
};

