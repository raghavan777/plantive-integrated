import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { COLORS } from '../../constants/colors';
import { router } from 'expo-router';

export default function OfficialHomeScreen() {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header with Stats */}
      <View style={styles.header}>
        <View style={styles.profileContainer}>
          <View style={styles.profileIcon}>
            <Text style={styles.profileIconText}>👨‍💼</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>Rajesh Kumar</Text>
            <Text style={styles.profileRole}>Field Officer | Zone 5</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.notificationButton}>
          <Text style={styles.notificationIcon}>🔔</Text>
          <View style={styles.notificationBadge}>
            <Text style={styles.notificationCount}>3</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <TouchableOpacity 
          style={styles.statCard}
          onPress={() => router.push('/official/assignments')}
        >
          <Text style={styles.statNumber}>12</Text>
          <Text style={styles.statLabel}>Assigned</Text>
          <Text style={styles.statSubLabel}>Farms</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.statCard, styles.statCardUrgent]}
          onPress={() => router.push('/official/assignments')}
        >
          <Text style={[styles.statNumber, styles.statNumberUrgent]}>5</Text>
          <Text style={styles.statLabel}>Pending</Text>
          <Text style={styles.statSubLabel}>Verifications</Text>
          <View style={styles.urgentBadge}>
            <Text style={styles.urgentText}>URGENT</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.statCard}
          onPress={() => router.push('/official/history')}
        >
          <Text style={styles.statNumber}>47</Text>
          <Text style={styles.statLabel}>Completed</Text>
          <Text style={styles.statSubLabel}>Reports</Text>
        </TouchableOpacity>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => router.push('/official/verification')}
          >
            <View style={styles.actionIcon}>
              <Text style={styles.actionIconText}>📍</Text>
            </View>
            <Text style={styles.actionTitle}>Start Visit</Text>
            <Text style={styles.actionDesc}>Begin farm verification</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard}>
            <View style={styles.actionIcon}>
              <Text style={styles.actionIconText}>📱</Text>
            </View>
            <Text style={styles.actionTitle}>Sync Data</Text>
            <Text style={styles.actionDesc}>Upload offline reports</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => router.push('/official/assignments')}
          >
            <View style={styles.actionIcon}>
              <Text style={styles.actionIconText}>📋</Text>
            </View>
            <Text style={styles.actionTitle}>Assignments</Text>
            <Text style={styles.actionDesc}>View assigned farms</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => router.push('/official/history')}
          >
            <View style={styles.actionIcon}>
              <Text style={styles.actionIconText}>📊</Text>
            </View>
            <Text style={styles.actionTitle}>Reports</Text>
            <Text style={styles.actionDesc}>View past visits</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Today's Tasks */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Today's Tasks</Text>
          <TouchableOpacity>
            <Text style={styles.viewAll}>View All</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.tasksList}>
          <TouchableOpacity style={styles.taskItem}>
            <View style={styles.taskIcon}>
              <Text style={styles.taskIconText}>🌾</Text>
            </View>
            <View style={styles.taskContent}>
              <Text style={styles.taskTitle}>Farm #A123 - Rice Crop</Text>
              <Text style={styles.taskLocation}>Village: Ramgarh</Text>
              <Text style={styles.taskTime}>Due: Today 4 PM</Text>
            </View>
            <View style={styles.taskStatus}>
              <Text style={styles.taskStatusText}>Pending</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.taskItem}>
            <View style={styles.taskIcon}>
              <Text style={styles.taskIconText}>⚠️</Text>
            </View>
            <View style={styles.taskContent}>
              <Text style={styles.taskTitle}>Farm #B456 - Damage Report</Text>
              <Text style={styles.taskLocation}>Village: Sohna</Text>
              <Text style={styles.taskTime}>Priority: High</Text>
            </View>
            <View style={[styles.taskStatus, styles.taskStatusUrgent]}>
              <Text style={styles.taskStatusText}>Urgent</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.taskItem}>
            <View style={styles.taskIcon}>
              <Text style={styles.taskIconText}>✅</Text>
            </View>
            <View style={styles.taskContent}>
              <Text style={styles.taskTitle}>Farm #C789 - Wheat</Text>
              <Text style={styles.taskLocation}>Village: Badshahpur</Text>
              <Text style={styles.taskTime}>Completed: 10 AM</Text>
            </View>
            <View style={[styles.taskStatus, styles.taskStatusCompleted]}>
              <Text style={styles.taskStatusText}>Done</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Notifications */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          <TouchableOpacity>
            <Text style={styles.viewAll}>Clear All</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.notificationsList}>
          <View style={styles.notificationItem}>
            <View style={styles.notificationDot} />
            <View style={styles.notificationContent}>
              <Text style={styles.notificationTitle}>New Assignment</Text>
              <Text style={styles.notificationText}>Farm #D101 assigned to you</Text>
              <Text style={styles.notificationTime}>10 minutes ago</Text>
            </View>
          </View>

          <View style={styles.notificationItem}>
            <View style={[styles.notificationDot, styles.notificationDotUrgent]} />
            <View style={styles.notificationContent}>
              <Text style={styles.notificationTitle}>AI Mismatch Alert</Text>
              <Text style={styles.notificationText}>Farm #B456 needs re-check</Text>
              <Text style={styles.notificationTime}>1 hour ago</Text>
            </View>
          </View>

          <View style={styles.notificationItem}>
            <View style={styles.notificationDot} />
            <View style={styles.notificationContent}>
              <Text style={styles.notificationTitle}>Sync Successful</Text>
              <Text style={styles.notificationText}>3 reports uploaded</Text>
              <Text style={styles.notificationTime}>2 hours ago</Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  profileIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileIconText: {
    fontSize: 28,
  },
  profileInfo: {
    gap: 2,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.content,
  },
  profileRole: {
    fontSize: 14,
    color: COLORS.gray,
  },
  notificationButton: {
    position: 'relative',
    padding: 10,
  },
  notificationIcon: {
    fontSize: 24,
  },
  notificationBadge: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: COLORS.error,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationCount: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 20,
    gap: 15,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: 'relative',
  },
  statCardUrgent: {
    borderWidth: 2,
    borderColor: COLORS.error,
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 5,
  },
  statNumberUrgent: {
    color: COLORS.error,
  },
  statLabel: {
    fontSize: 14,
    color: COLORS.gray,
    marginBottom: 2,
  },
  statSubLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.content,
  },
  urgentBadge: {
    position: 'absolute',
    top: -10,
    backgroundColor: COLORS.error,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
  },
  urgentText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.content,
  },
  viewAll: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
  },
  actionCard: {
    width: '48%',
    backgroundColor: COLORS.white,
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.tertiary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  actionIconText: {
    fontSize: 22,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.content,
    marginBottom: 5,
    textAlign: 'center',
  },
  actionDesc: {
    fontSize: 12,
    color: COLORS.gray,
    textAlign: 'center',
    lineHeight: 16,
  },
  tasksList: {
    gap: 10,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 15,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  taskIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  taskIconText: {
    fontSize: 18,
  },
  taskContent: {
    flex: 1,
    gap: 2,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.content,
  },
  taskLocation: {
    fontSize: 12,
    color: COLORS.gray,
  },
  taskTime: {
    fontSize: 12,
    color: COLORS.gray,
  },
  taskStatus: {
    backgroundColor: COLORS.warning + '20',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  taskStatusUrgent: {
    backgroundColor: COLORS.error + '20',
  },
  taskStatusCompleted: {
    backgroundColor: COLORS.success + '20',
  },
  taskStatusText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.content,
  },
  notificationsList: {
    gap: 15,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 15,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  notificationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.primary,
    marginTop: 6,
    marginRight: 15,
  },
  notificationDotUrgent: {
    backgroundColor: COLORS.error,
  },
  notificationContent: {
    flex: 1,
    gap: 3,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.content,
  },
  notificationText: {
    fontSize: 14,
    color: COLORS.gray,
    lineHeight: 20,
  },
  notificationTime: {
    fontSize: 12,
    color: COLORS.gray,
  },
});