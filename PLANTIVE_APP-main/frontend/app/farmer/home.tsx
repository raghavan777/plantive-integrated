import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { COLORS } from '../../constants/colors';
import { router } from 'expo-router';
import { API_ENDPOINTS, getAuthHeaders } from '../../constants/api';

export default function FarmerHomeScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  const fetchRecentActivity = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.SUBMISSIONS.HISTORY, {
        headers: getAuthHeaders(),
      });
      const data = await response.json();
      if (data.success) {
        const mapped = data.data.slice(0, 3).map((sub: any) => ({
          id: sub._id,
          title: sub.submissionType === 'damage_report' ? 'Damage Reported' : 'Image Submitted',
          time: new Date(sub.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: sub.status,
          icon: sub.submissionType === 'damage_report' ? '⚠️' : '✅'
        }));
        setRecentActivity(mapped);
      }
    } catch (error) {
      console.error('Error fetching home data:', error);
    }
  };

  useEffect(() => {
    fetchRecentActivity();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchRecentActivity();
    setRefreshing(false);
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Weather Card - MOCK BUT CLEANER */}
      <View style={styles.weatherCard}>
        <View style={styles.weatherHeader}>
          <Text style={styles.weatherTitle}>Current Conditions</Text>
          <Text style={styles.weatherLocation}>📍 Local Farm</Text>
        </View>
        <View style={styles.weatherContent}>
          <View style={styles.weatherMain}>
            <Text style={styles.temperature}>--°C</Text>
            <Text style={styles.weatherCondition}>Syncing...</Text>
          </View>
          <View style={styles.weatherDetails}>
            <View style={styles.weatherItem}>
              <Text style={styles.weatherLabel}>Rainfall</Text>
              <Text style={styles.weatherValue}>-- mm</Text>
            </View>
            <View style={styles.weatherItem}>
              <Text style={styles.weatherLabel}>Humidity</Text>
              <Text style={styles.weatherValue}>--%</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Insurance Coverage - REMOVED DUMMY NUMBERS */}
      <View style={styles.insuranceCard}>
        <Text style={styles.insuranceTitle}>Insurance Policy</Text>
        <View style={styles.insuranceDetails}>
          <View style={styles.insuranceItem}>
            <Text style={styles.insuranceLabel}>Scheme</Text>
            <Text style={styles.insuranceValue}>PMFBY Integrated</Text>
          </View>
          <View style={styles.insuranceItem}>
            <Text style={styles.insuranceLabel}>Status</Text>
            <Text style={[styles.insuranceValue, { color: COLORS.primary }]}>Active</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.coverageButton}>
          <Text style={styles.coverageButtonText}>Check Status</Text>
        </TouchableOpacity>
      </View>

      {/* Quick Actions */}
      <View style={styles.actionsContainer}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => router.push('/farmer/capture')}
          >
            <View style={styles.actionIcon}>
              <Text style={styles.actionIconText}>📸</Text>
            </View>
            <Text style={styles.actionTitle}>Capture Crop</Text>
            <Text style={styles.actionDescription}>Upload crop image for AI analysis</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => router.push('/farmer/status')}
          >
            <View style={styles.actionIcon}>
              <Text style={styles.actionIconText}>📊</Text>
            </View>
            <Text style={styles.actionTitle}>Track Status</Text>
            <Text style={styles.actionDescription}>Check claim progress</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard}>
            <View style={styles.actionIcon}>
              <Text style={styles.actionIconText}>📞</Text>
            </View>
            <Text style={styles.actionTitle}>Call Support</Text>
            <Text style={styles.actionDescription}>Contact agriculture officer</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => router.push('/farmer/history')}
          >
            <View style={styles.actionIcon}>
              <Text style={styles.actionIconText}>📋</Text>
            </View>
            <Text style={styles.actionTitle}>History</Text>
            <Text style={styles.actionDescription}>View past submissions</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Recent Activity */}
      <View style={styles.recentContainer}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <View style={styles.recentList}>
          {recentActivity.length > 0 ? (
            recentActivity.map((activity) => (
              <View key={activity.id} style={styles.recentItem}>
                <View style={styles.recentIcon}>
                  <Text style={styles.recentIconText}>{activity.icon}</Text>
                </View>
                <View style={styles.recentContent}>
                  <Text style={styles.recentTitle}>{activity.title}</Text>
                  <Text style={styles.recentTime}>{activity.time}</Text>
                </View>
                <Text style={styles.recentStatus}>{activity.status}</Text>
              </View>
            ))
          ) : (
            <Text style={{ color: COLORS.gray, textAlign: 'center', padding: 20 }}>
              No recent activity found.
            </Text>
          )}
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
  weatherCard: {
    backgroundColor: COLORS.white,
    margin: 20,
    padding: 20,
    borderRadius: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  weatherHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  weatherTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.content,
  },
  weatherLocation: {
    color: COLORS.gray,
  },
  weatherContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  weatherMain: {
    flex: 1,
  },
  temperature: {
    fontSize: 36,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  weatherCondition: {
    fontSize: 16,
    color: COLORS.gray,
  },
  weatherDetails: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  weatherItem: {
    alignItems: 'center',
  },
  weatherLabel: {
    fontSize: 12,
    color: COLORS.gray,
  },
  weatherValue: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.content,
  },
  insuranceCard: {
    backgroundColor: COLORS.white,
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 20,
    elevation: 2,
  },
  insuranceTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.content,
    marginBottom: 15,
  },
  insuranceDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  insuranceItem: {
    flex: 1,
  },
  insuranceLabel: {
    fontSize: 14,
    color: COLORS.gray,
  },
  insuranceValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.content,
  },
  coverageButton: {
    backgroundColor: COLORS.background,
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.lightGray,
  },
  coverageButtonText: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  actionsContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.content,
    marginBottom: 15,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    backgroundColor: COLORS.white,
    width: '48%',
    padding: 15,
    borderRadius: 20,
    marginBottom: 15,
    elevation: 2,
  },
  actionIcon: {
    backgroundColor: COLORS.background,
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  actionIconText: {
    fontSize: 20,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.content,
    marginBottom: 5,
  },
  actionDescription: {
    fontSize: 12,
    color: COLORS.gray,
  },
  recentContainer: {
    padding: 20,
    paddingTop: 0,
  },
  recentList: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 15,
    elevation: 2,
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  recentIcon: {
    backgroundColor: COLORS.background,
    width: 35,
    height: 35,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  recentIconText: {
    fontSize: 16,
  },
  recentContent: {
    flex: 1,
  },
  recentTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.content,
  },
  recentTime: {
    fontSize: 12,
    color: COLORS.gray,
  },
  recentStatus: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
});