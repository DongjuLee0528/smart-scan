import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';

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
  name: string;
  role: string;
  status: 'Normal' | 'No tags';
  initial: string;
}

const FamilyMember: React.FC<FamilyMemberProps> = ({ name, role, status, initial }) => {
  const { colors } = useTheme();

  const statusColor = status === 'Normal' ? '#10B981' : '#6B7280';
  const statusBg = status === 'Normal' ? '#D1FAE5' : '#F3F4F6';

  return (
    <View style={styles.memberItem}>
      <View style={[styles.avatar, { backgroundColor: '#034EA21A' }]}>
        <Text style={[styles.avatarText, { color: colors.text }]}>{initial}</Text>
      </View>
      <View style={styles.memberInfo}>
        <View style={styles.memberHeader}>
          <Text style={[styles.memberName, { color: colors.text }]}>{name}</Text>
          <View style={[styles.statusBadge, { backgroundColor: statusBg }]}>
            <Text style={[styles.statusText, { color: statusColor }]}>{status}</Text>
          </View>
        </View>
        <Text style={[styles.memberRole, { color: colors.subtext }]}>{role}</Text>
      </View>
    </View>
  );
};

const TabButton: React.FC<{
  iconName: keyof typeof Ionicons.glyphMap;
  label: string;
  isActive?: boolean;
}> = ({ iconName, label, isActive = false }) => {
  const { colors, brandColor } = useTheme();

  return (
    <TouchableOpacity style={styles.tabButton}>
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

export const DashboardScreen: React.FC = () => {
  const { colors, brandColor } = useTheme();

  const familyMembers = [
    { name: '황찬영', role: 'owner', status: 'No tags' as const, initial: '황' },
    { name: '테스트', role: 'member', status: 'Normal' as const, initial: '테' },
    { name: 'Test User', role: 'member', status: 'No tags' as const, initial: 'T' },
  ];

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
      backgroundColor: '#D1FAE5',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
    },
    statusText: {
      color: '#10B981',
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
        <Text style={dynamicStyles.familyName}>우리 가족</Text>
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
            value={2}
            iconName="pricetag-outline"
            iconColor={brandColor}
            backgroundColor={`${brandColor}1A`}
          />
          <StatCard
            title="정상 감지"
            value={2}
            iconName="checkmark-circle-outline"
            iconColor="#10B981"
            backgroundColor="#D1FAE5"
          />
          <StatCard
            title="누락 물품"
            value={0}
            iconName="alert-circle-outline"
            iconColor="#EF4444"
            backgroundColor="#FEE2E2"
          />
          <StatCard
            title="구성원"
            value={4}
            iconName="people-outline"
            iconColor="#6B7280"
            backgroundColor="#F3F4F6"
          />
        </View>

        <View style={dynamicStyles.sectionCard}>
          <View style={dynamicStyles.sectionHeader}>
            <Text style={dynamicStyles.sectionTitle}>가족 상태 현황</Text>
            <Text style={dynamicStyles.changeGroupText}>그룹 변경</Text>
          </View>
          {familyMembers.map((member, index) => (
            <FamilyMember
              key={index}
              name={member.name}
              role={member.role}
              status={member.status}
              initial={member.initial}
            />
          ))}
        </View>

        <View style={dynamicStyles.sectionCard}>
          <Text style={dynamicStyles.sectionTitle}>내 태그 현황</Text>
          <Text style={dynamicStyles.emptyStateText}>등록된 태그가 없습니다.</Text>
        </View>
      </ScrollView>

      <View style={dynamicStyles.bottomTabs}>
        <TabButton iconName="home-outline" label="홈" isActive={true} />
        <TabButton iconName="hardware-chip-outline" label="디바이스" />
        <TabButton iconName="cube-outline" label="물품" />
        <TabButton iconName="people-outline" label="구성원" />
        <TabButton iconName="notifications-outline" label="알림" />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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

