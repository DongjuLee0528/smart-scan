import React, { useState, useEffect, useMemo, useCallback } from 'react';
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
import {
  getMembers,
  deleteMember,
  inviteMember,
  FamilyMemberResponse,
  FamilyMemberListResponse,
  InviteMemberRequest,
} from '../api/members';
import { handleApiError } from '../utils/errorHandler';
import { InputModal } from '../components/InputModal';
import { getUserId } from '../storage/tokenStorage';
import { validateEmail, validatePhone } from '../utils/validation';

type MemberScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Member'>;

interface Props {
  navigation: MemberScreenNavigationProp;
}

interface MemberItemProps {
  member: FamilyMemberResponse;
  onDelete: (member: FamilyMemberResponse) => void;
  isDeleting: boolean;
}

const MemberItem: React.FC<MemberItemProps> = React.memo(({ member, onDelete, isDeleting }) => {
  const { colors, brandColor } = useTheme();

  const isOwner = member.role === 'owner';
  const initial = member.name ? member.name.charAt(0).toUpperCase() : '?';

  return (
    <View style={[styles.memberRow, { borderBottomColor: colors.border }]}>
      <View style={[styles.memberAvatar, { backgroundColor: `${brandColor}1A` }]}>
        <Text style={[styles.memberAvatarText, { color: brandColor }]}>{initial}</Text>
      </View>

      <View style={styles.memberInfo}>
        <Text style={[styles.memberName, { color: colors.text }]}>{member.name || 'Unknown'}</Text>
        <Text style={[styles.memberEmail, { color: colors.subtext }]}>{member.email || 'No email'}</Text>
        {(member.phone_number || member.age) && (
          <Text style={[styles.memberDetails, { color: colors.subtext }]}>
            {member.phone_number && member.age
              ? `${member.phone_number} • ${member.age}세`
              : member.phone_number || `${member.age}세`}
          </Text>
        )}
      </View>

      <View style={[
        styles.roleBadge,
        {
          backgroundColor: isOwner ? brandColor : STATUS_COLORS.neutral.background
        }
      ]}>
        <Text style={[
          styles.roleBadgeText,
          {
            color: isOwner ? colors.background : STATUS_COLORS.neutral.text
          }
        ]}>
          {isOwner ? 'Owner' : 'Member'}
        </Text>
      </View>

      {!isOwner && (
        <TouchableOpacity
          style={[
            styles.deleteButton,
            { opacity: isDeleting ? 0.7 : 1 }
          ]}
          onPress={() => onDelete(member)}
          disabled={isDeleting}
        >
          {isDeleting ? (
            <ActivityIndicator size="small" color={STATUS_COLORS.error.text} />
          ) : (
            <Ionicons name="trash" size={18} color={STATUS_COLORS.error.text} />
          )}
        </TouchableOpacity>
      )}
    </View>
  );
});

export const MemberScreen: React.FC<Props> = ({ navigation }) => {
  const { colors, brandColor } = useTheme();
  const [membersData, setMembersData] = useState<FamilyMemberListResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingMemberId, setDeletingMemberId] = useState<number | null>(null);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [isInviting, setIsInviting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getMembers();
      setMembersData(data);
    } catch (error: any) {
      const message = handleApiError(error);
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleDeleteMember = useCallback((member: FamilyMemberResponse) => {
    Alert.alert(
      '구성원 삭제',
      `"${member.name}"님을 가족에서 제거하시겠습니까?`,
      [
        { text: '취소', style: 'cancel' },
        {
          text: '삭제',
          style: 'destructive',
          onPress: async () => {
            try {
              setDeletingMemberId(member.id);
              setDeleteError(null);
              await deleteMember(member.id);
              await fetchData();
            } catch (error: any) {
              const message = handleApiError(error);
              setDeleteError(message);
            } finally {
              setDeletingMemberId(null);
            }
          },
        },
      ]
    );
  }, [fetchData]);

  const handleRetry = useCallback(() => {
    fetchData();
  }, [fetchData]);

  const handleInviteMember = useCallback(async (input: string) => {
    if (!input.trim()) return;

    const lines = input.trim().split('\n').filter(line => line.trim());
    if (lines.length < 3) {
      setError('이름, 이메일, 전화번호를 모두 입력해주세요. (각각 줄바꿈으로 구분)');
      return;
    }

    const [name, email, phone_number, ageStr] = lines;

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedPhone = phone_number.trim();

    if (!trimmedName || !trimmedEmail || !trimmedPhone) {
      setError('이름, 이메일, 전화번호를 모두 입력해주세요.');
      return;
    }

    if (!validateEmail(trimmedEmail)) {
      setError('올바른 이메일 형식을 입력해주세요.');
      return;
    }

    if (!validatePhone(trimmedPhone)) {
      setError('올바른 전화번호 형식을 입력해주세요. (01012345678)');
      return;
    }

    let age: number | undefined;
    if (ageStr) {
      const parsedAge = parseInt(ageStr.trim(), 10);
      if (!isNaN(parsedAge) && parsedAge >= 1 && parsedAge <= 150) {
        age = parsedAge;
      }
    }

    const invitation: InviteMemberRequest = {
      name: trimmedName,
      email: trimmedEmail,
      phone_number: trimmedPhone,
      age,
    };

    try {
      setIsInviting(true);
      setError(null);
      setDeleteError(null);
      await inviteMember(invitation);
      setShowInviteModal(false);
      await fetchData();
    } catch (error: any) {
      const message = handleApiError(error);
      setError(message);
    } finally {
      setIsInviting(false);
    }
  }, [fetchData]);

  const currentUserMember = useMemo(() => {
    if (!membersData || !currentUserId) return null;
    return membersData.members.find(m => m.user_id === currentUserId);
  }, [membersData, currentUserId]);

  const isOwner = currentUserMember?.role === 'owner';

  const loadCurrentUserId = async () => {
    try {
      const userId = await getUserId();
      setCurrentUserId(userId);
    } catch (error) {
      console.error('Failed to load current user ID');
      setError('사용자 정보를 불러오는 데 실패했습니다.');
    }
  };

  useEffect(() => {
    const initializeData = async () => {
      await loadCurrentUserId();
      await fetchData();
    };
    initializeData();
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
    membersList: {
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
        <Text style={dynamicStyles.headerTitle}>구성원 관리</Text>
        <View style={{ flex: 1 }} />
        {isOwner && (
          <TouchableOpacity
            style={[styles.inviteButton, { backgroundColor: brandColor }]}
            onPress={() => setShowInviteModal(true)}
          >
            <Text style={styles.inviteButtonText}>초대</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView style={dynamicStyles.content} showsVerticalScrollIndicator={false}>
        {(deleteError || error) && (
          <View style={[styles.errorBanner, { backgroundColor: STATUS_COLORS.error.background }]}>
            <Ionicons name="alert-circle" size={20} color={STATUS_COLORS.error.text} />
            <Text style={[styles.errorBannerText, { color: STATUS_COLORS.error.text }]}>
              {deleteError ? `삭제 실패: ${deleteError}` : error}
            </Text>
            <TouchableOpacity
              style={styles.errorBannerClose}
              onPress={() => {
                setDeleteError(null);
                setError(null);
              }}
            >
              <Ionicons name="close" size={20} color={STATUS_COLORS.error.text} />
            </TouchableOpacity>
          </View>
        )}
        <View style={dynamicStyles.titleSection}>
          <Text style={dynamicStyles.title}>가족 구성원</Text>
          <Text style={dynamicStyles.subtitle}>구성원 추가는 Owner 권한이 필요합니다.</Text>
        </View>

        <View style={dynamicStyles.card}>
          <Text style={dynamicStyles.cardTitle}>구성원 목록</Text>
          <Text style={dynamicStyles.cardSubtitle}>현재 가족에 등록된 구성원들입니다.</Text>

          {membersData && membersData.members.length > 0 ? (
            <View style={dynamicStyles.membersList}>
              {membersData.members.map((member) => (
                <MemberItem
                  key={member.id}
                  member={member}
                  onDelete={handleDeleteMember}
                  isDeleting={deletingMemberId === member.id}
                />
              ))}
            </View>
          ) : (
            <View style={dynamicStyles.emptyState}>
              <View style={dynamicStyles.emptyIcon}>
                <Ionicons name="people-outline" size={32} color={STATUS_COLORS.neutral.text} />
              </View>
              <Text style={dynamicStyles.emptyTitle}>등록된 구성원이 없습니다.</Text>
              <Text style={dynamicStyles.emptySubtitle}>
                가족 구성원을 초대하려면 Owner 권한이 필요합니다.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      <TabBar navigation={navigation} activeTab="Member" />

      <InputModal
        visible={showInviteModal}
        title="구성원 초대"
        placeholder="이름을 입력하세요&#10;이메일을 입력하세요&#10;전화번호를 입력하세요&#10;나이 (선택사항)"
        onConfirm={handleInviteMember}
        onCancel={() => setShowInviteModal(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  memberAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  memberAvatarText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  memberEmail: {
    fontSize: 14,
    marginBottom: 2,
  },
  memberDetails: {
    fontSize: 12,
  },
  roleBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  roleBadgeText: {
    fontSize: 12,
    fontWeight: '500',
  },
  deleteButton: {
    padding: 8,
  },
  inviteButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  inviteButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginBottom: 16,
    borderRadius: 8,
  },
  errorBannerText: {
    marginLeft: 8,
    fontSize: 14,
    flex: 1,
  },
  errorBannerClose: {
    padding: 4,
  },
});