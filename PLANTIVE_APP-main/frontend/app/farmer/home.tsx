import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, Platform } from 'react-native';
import * as Location from 'expo-location';
import { COLORS } from '../../constants/colors';
import { router } from 'expo-router';
import { API_ENDPOINTS, getAuthHeaders } from '../../constants/api';

export default function FarmerHomeScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [location, setLocation] = useState<string>('Detecting...');
  const [weather, setWeather] = useState({
    temp: '--',
    condition: 'Detecting...',
    rainfall: '--',
    humidity: '--'
  });

  const fetchFarmerProfile = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.FARMERS.PROFILE, {
        headers: getAuthHeaders(),
      });
      const data = await response.json();
      if (data.success) {
        setProfile(data.data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

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

  const fetchLocationAndWeather = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocation('Permission Denied');
        setWeather(prev => ({ ...prev, condition: 'No location access' }));
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      const reverseGeocode = await Location.reverseGeocodeAsync({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude
      });

      if (reverseGeocode.length > 0) {
        const place = reverseGeocode[0];
        setLocation(place.city || place.region || place.district || 'Local Farm');
      }

      // Simulated weather fetch
      setWeather({
        temp: '28',
        condition: 'Clear Sky',
        rainfall: '0.2',
        humidity: '65'
      });
    } catch (error) {
      console.error('Error getting location/weather:', error);
      setLocation('Local Farm');
      setWeather(prev => ({ ...prev, condition: 'Error fetching' }));
    }
  };

  useEffect(() => {
    fetchRecentActivity();
    fetchFarmerProfile();
    fetchLocationAndWeather();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([
      fetchRecentActivity(), 
      fetchFarmerProfile(),
      fetchLocationAndWeather()
    ]);
    setRefreshing(false);
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Weather Card - MATCHING SCREENSHOT */}
      <View style={styles.weatherCard}>
        <View style={styles.weatherHeader}>
          <Text style={styles.weatherTitle}>Current Conditions</Text>
          <View style={styles.locationContainer}>
             <Text style={styles.weatherLocation}>📍 {location}</Text>
          </View>
        </View>
        <View style={styles.weatherContent}>
          <View style={styles.weatherMain}>
            <Text style={styles.temperature}>{weather.temp}°C</Text>
            <Text style={styles.weatherCondition}>{weather.condition}</Text>
          </View>
          <View style={styles.weatherStats}>
            <View style={styles.weatherStatItem}>
              <Text style={styles.weatherLabel}>Rainfall</Text>
              <Text style={styles.weatherValue}>{weather.rainfall} mm</Text>
            </View>
            <View style={styles.weatherStatItem}>
              <Text style={styles.weatherLabel}>Humidity</Text>
              <Text style={styles.weatherValue}>{weather.humidity}%</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Insurance Coverage - MATCHING SCREENSHOT */}
      <View style={styles.insuranceCard}>
        <Text style={styles.insuranceTitle}>Insurance Policy</Text>
        <View style={styles.insuranceDetailsRow}>
          <View style={styles.insuranceInfoGroup}>
            <Text style={styles.insuranceLabel}>Scheme</Text>
            <Text style={styles.insuranceValue}>{profile?.insurance?.scheme || 'PMFBY Integrated'}</Text>
          </View>
          <View style={styles.insuranceInfoGroup}>
            <Text style={styles.insuranceLabel}>Status</Text>
            <Text style={[styles.insuranceValue, { 
              color: profile?.insurance?.status === 'active' ? COLORS.primary : COLORS.warning 
            }]}>
              {profile?.insurance?.status || 'Active'}
            </Text>
          </View>
        </View>
        <TouchableOpacity 
          style={styles.checkStatusBtn}
          onPress={() => router.push('/farmer/status')}
        >
          <Text style={styles.checkStatusBtnText}>Check Policy Details</Text>
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
    marginHorizontal: 15,
    marginTop: 20,
    padding: 20,
    borderRadius: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  weatherHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  weatherTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.content,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  weatherLocation: {
    fontSize: 12,
    color: '#d14a61', // Adjusting to match pinpoint icon color in snapshot
    fontWeight: '500',
  },
  weatherContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  weatherMain: {
    flex: 1,
  },
  temperature: {
    fontSize: 42,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 2,
  },
  weatherCondition: {
    fontSize: 14,
    color: COLORS.gray,
    fontWeight: '400',
  },
  weatherStats: {
    flexDirection: 'row',
    gap: 30,
  },
  weatherStatItem: {
    alignItems: 'center',
  },
  weatherLabel: {
    fontSize: 10,
    color: COLORS.gray,
    marginBottom: 4,
  },
  weatherValue: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.content,
  },
  insuranceCard: {
    backgroundColor: COLORS.white,
    marginHorizontal: 15,
    marginTop: 15,
    padding: 20,
    borderRadius: 24,
    elevation: 2,
  },
  insuranceTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.content,
    marginBottom: 15,
  },
  insuranceDetailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  insuranceInfoGroup: {
    gap: 4,
  },
  insuranceLabel: {
    fontSize: 12,
    color: COLORS.gray,
  },
  insuranceValue: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.content,
  },
  checkStatusBtn: {
    backgroundColor: '#f1f5ef', // Matching the pale greenish background in snapshot
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  checkStatusBtnText: {
    color: COLORS.primary,
    fontWeight: '700',
    fontSize: 14,
  },
  actionsContainer: {
    paddingHorizontal: 15,
    marginTop: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
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
    width: '48.5%',
    padding: 18,
    borderRadius: 22,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  actionIcon: {
    backgroundColor: '#f8faf7',
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionIconText: {
    fontSize: 20,
  },
  actionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.content,
    marginBottom: 4,
  },
  actionDescription: {
    fontSize: 11,
    color: COLORS.gray,
    lineHeight: 14,
  },
  recentContainer: {
    paddingHorizontal: 15,
    marginTop: 20,
    marginBottom: 30,
  },
  recentList: {
    backgroundColor: COLORS.white,
    borderRadius: 22,
    padding: 15,
    elevation: 2,
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  recentIcon: {
    backgroundColor: '#f8faf7',
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  recentIconText: {
    fontSize: 16,
  },
  recentContent: {
    flex: 1,
  },
  recentTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.content,
  },
  recentTime: {
    fontSize: 11,
    color: COLORS.gray,
    marginTop: 2,
  },
  recentStatus: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '700',
  },
});