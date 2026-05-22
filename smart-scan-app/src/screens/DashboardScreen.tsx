import React, { useState, useEffect } from 'react';
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
import {
  getDashboard,
  getMyTags,
  MonitoringDashboardResponse,
  MyTagStatusListResponse,
  MemberSummaryResponse,
  TagStatus,
} from '../api/dashboard';
import { formatDateTime } from '../utils/dateUtils';
import { STATUS_COLORS } from '../constants/colors';
import { AuthStackParamList } from '../types/navigation';
import { TabBar } from '../components/TabBar';

type DashboardScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Dashboard'>;

interface StatCardProps {
  title: string;
  value: number;
  iconName: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  backgroundColor: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, iconName, iconColor, backgroundColor }) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={[styles.statIcon, { backgroundColor }]}>
        <Ionicons name={iconName} size={24} color={iconColor} />
      </View>
      <Text style={[styles.statValue, { color: colors.text }]}>{value}</Text>
      <Text style={[styles.statTitle, { color: colors.subtext }]}>{title}</Text>
    </View>
  );
};

interface FamilyMemberProps {
  member: MemberSummaryResponse;
}

const FamilyMember: React.FC<FamilyMemberProps> = ({ member }) => {
  const { colors } = useTheme();

  const hasActiveTags = member.tag_count > 0;
  const statusText = hasActiveTags ? 'Normal' : 'No tags';
  const statusColor = hasActiveTags ? STATUS_COLORS.success.text : STATUS_COLORS.neutral.text;
  const statusBg = hasActiveTags ? STATUS_COLORS.success.background : STATUS_COLORS.neutral.background;
  const initial = member.name ? member.name.charAt(0).toUpperCase() : '?';

  return (
    <View style={styles.memberItem}>
      <View style={[styles.avatar, { backgroundColor: '#034EA21A' }]}>
        <Text style={[styles.avatarText, { color: colors.text }]}>{initial}</Text>
      </View>
      <View style={styles.memberInfo}>
        <View style={styles.memberHeader}>
          <Text style={[styles.memberName, { color: colors.text }]}>{member.name || 'Unknown'}</Text>
          <View style={[styles.statusBadge, { backgroundColor: statusBg }]}>
            <Text style={[styles.statusText, { color: statusColor }]}>{statusText}</Text>
          </View>
        </View>
        <Text style={[styles.memberRole, { color: colors.subtext }]}>{member.role}</Text>
      </View>
    </View>
  );
};


interface Props {
  navigation: DashboardScreenNavigationProp;
}

export const DashboardScreen: React.FC<Props> = ({ navigation }) => {
  const { colors, brandColor } = useTheme();
  const [dashboardData, setDashboardData] = useState<MonitoringDashboardResponse | null>(null);
  const [myTagsData, setMyTagsData] = useState<MyTagStatusListResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [dashboard, myTags] = await Promise.all([
        getDashboard(),
        getMyTags(),
      ]);

      setDashboardData(dashboard);
      setMyTagsData(myTags);
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

  useEffect(() => {
    fetchData();
  }, []);

  const handleRetry = () => {
    fetchData();
  };

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

  if (!dashboardData) {
    return null;
  }

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
    },
    familyName: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.text,
    },
    statusBadge: {
      backgroundColor: STATUS_COLORS.success.background,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
    },
    statusText: {
      color: STATUS_COLORS.success.text,
      fontSize: 12,
      fontWeight: '500',
    },
    content: {
      flex: 1,
      paddingHorizontal: 24,
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
    statsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      marginBottom: 24,
    },
    sectionCard: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 20,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: colors.border,
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.text,
    },
    changeGroupText: {
      fontSize: 14,
      color: colors.subtext,
    },
    emptyStateText: {
      fontSize: 16,
      color: colors.subtext,
      textAlign: 'center',
      paddingVertical: 20,
    },
  });

  return (
    <SafeAreaView style={dynamicStyles.container}>
      <View style={dynamicStyles.header}>
        <Text style={dynamicStyles.familyName}>{dashboardData.family_name}</Text>
        <View style={dynamicStyles.statusBadge}>
          <Text style={dynamicStyles.statusText}>시스템 정상</Text>
        </View>
      </View>

      <ScrollView style={dynamicStyles.content} showsVerticalScrollIndicator={false}>
        <View style={dynamicStyles.titleSection}>
          <Text style={dynamicStyles.title}>대시보드</Text>
          <Text style={dynamicStyles.subtitle}>가족 소지품 현황을 한눈에 확인하세요.</Text>
        </View>

        <View style={dynamicStyles.statsGrid}>
          <StatCard
            title="전체 태그"
            value={dashboardData.summary.total_tags}
            iconName="pricetag-outline"
            iconColor={brandColor}
            backgroundColor={`${brandColor}1A`}
          />
          <StatCard
            title="정상 감지"
            value={dashboardData.summary.found_count}
            iconName="checkmark-circle-outline"
            iconColor={STATUS_COLORS.success.text}
            backgroundColor={STATUS_COLORS.success.background}
          />
          <StatCard
            title="누락 물품"
            value={dashboardData.summary.lost_count}
            iconName="alert-circle-outline"
            iconColor={STATUS_COLORS.error.text}
            backgroundColor={STATUS_COLORS.error.background}
          />
          <StatCard
            title="구성원"
            value={dashboardData.summary.total_members}
            iconName="people-outline"
            iconColor={STATUS_COLORS.neutral.text}
            backgroundColor={STATUS_COLORS.neutral.background}
          />
        </View>

        <View style={dynamicStyles.sectionCard}>
          <View style={dynamicStyles.sectionHeader}>
            <Text style={dynamicStyles.sectionTitle}>가족 상태 현황</Text>
            <Text style={dynamicStyles.changeGroupText}>그룹 변경</Text>
          </View>
          {dashboardData.members.map((member) => (
            <FamilyMember
              key={member.member_id}
              member={member}
            />
          ))}
        </View>

        <View style={dynamicStyles.sectionCard}>
          <Text style={dynamicStyles.sectionTitle}>내 태그 현황</Text>
          {myTagsData && myTagsData.tags.length > 0 ? (
            myTagsData.tags.map((tag) => (
              <View key={tag.tag_id} style={[styles.tagItem, { borderBottomColor: colors.border }]}>
                <View style={styles.tagInfo}>
                  <Text style={[styles.tagName, { color: colors.text }]}>{tag.item_name || tag.name}</Text>
                  <Text style={[styles.tagDetail, { color: colors.subtext }]}>마지막 감지: {tag.last_seen_at ? formatDateTime(tag.last_seen_at) : '감지되지 않음'}</Text>
                </View>
                <View style={[
                  styles.tagStatusBadge,
                  {
                    backgroundColor: tag.status === TagStatus.FOUND ? STATUS_COLORS.success.background :
                                   tag.status === TagStatus.LOST ? STATUS_COLORS.error.background : STATUS_COLORS.neutral.background
                  }
                ]}>
                  <Text style={[
                    styles.tagStatusText,
                    {
                      color: tag.status === TagStatus.FOUND ? STATUS_COLORS.success.text :
                             tag.status === TagStatus.LOST ? STATUS_COLORS.error.text : STATUS_COLORS.neutral.text
                    }
                  ]}>
                    {tag.status === TagStatus.FOUND ? '정상' :
                     tag.status === TagStatus.LOST ? '분실' : '등록됨'}
                  </Text>
                </View>
              </View>
            ))
          ) : (
            <Text style={dynamicStyles.emptyStateText}>등록된 태그가 없습니다.</Text>
          )}
        </View>
      </ScrollView>

      <TabBar navigation={navigation} activeTab="Dashboard" />
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
  tagItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'transparent',
  },
  tagInfo: {
    flex: 1,
  },
  tagName: {
    fontSize: 16,
    fontWeight: '500',
  },
  tagDetail: {
    fontSize: 14,
    marginTop: 2,
  },
  tagStatusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagStatusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  statCard: {
    width: '48%',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 14,
    textAlign: 'center',
  },
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  memberInfo: {
    flex: 1,
  },
  memberHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  memberName: {
    fontSize: 16,
    fontWeight: '500',
  },
  memberRole: {
    fontSize: 14,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
});

