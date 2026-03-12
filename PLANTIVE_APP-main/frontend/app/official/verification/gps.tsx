// /home/ashith/Plantive/app/official/verification/gps.tsx

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import * as Location from 'expo-location';

// Import colors
import { COLORS } from '../../../constants/colors';

export default function GPSCheckScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const farmId = params.farmId as string;
  const targetLatitude = params.latitude ? parseFloat(params.latitude as string) : 13.0827;
  const targetLongitude = params.longitude ? parseFloat(params.longitude as string) : 80.2707;
  
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [loading, setLoading] = useState(true);
  const [distance, setDistance] = useState<number | null>(null);
  const [isWithinRange, setIsWithinRange] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);

  // Request location permission
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setPermissionGranted(status === 'granted');
      
      if (status === 'granted') {
        await getCurrentLocation();
      }
    })();
  }, []);

  // Get current location
  const getCurrentLocation = async () => {
    try {
      setLoading(true);
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.BestForNavigation,
      });
      setLocation(location);
      
      // Calculate distance from target location
      const calculatedDistance = calculateDistance(
        location.coords.latitude,
        location.coords.longitude,
        targetLatitude,
        targetLongitude
      );
      
      setDistance(calculatedDistance);
      setIsWithinRange(calculatedDistance <= 100); // Within 100 meters
      
      if (calculatedDistance <= 100) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } catch (error) {
      console.error('Error getting location:', error);
      Alert.alert('Error', 'Failed to get your location. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Calculate distance between two coordinates (in meters)
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c; // Distance in meters
  };

  const handleRetry = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    getCurrentLocation();
  };

  const handleContinue = () => {
    if (isWithinRange) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.push({
        pathname: '/official/verification',
        params: { 
          farmId,
          latitude: location?.coords.latitude.toString(),
          longitude: location?.coords.longitude.toString()
        }
      });
    } else {
      Alert.alert('Out of Range', 'You must be within 100 meters of the farm to continue.');
    }
  };

  const getStatusColor = () => {
    if (!distance) return COLORS.gray;
    if (distance <= 50) return COLORS.success; // Within 50m - Excellent
    if (distance <= 100) return COLORS.warning; // Within 100m - Acceptable
    return COLORS.error; // Too far
  };

  const getStatusMessage = () => {
    if (!distance) return 'Checking location...';
    if (distance <= 50) return 'Excellent! You\'re within 50 meters';
    if (distance <= 100) return 'Good! You\'re within 100 meters';
    return `Too far! You're ${Math.round(distance)} meters away`;
  };

  const getStatusIcon = () => {
    if (!distance) return 'location';
    if (distance <= 100) return 'checkmark-circle';
    return 'close-circle';
  };

  if (!permissionGranted) {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient
          colors={[COLORS.background, COLORS.white]}
          style={styles.gradient}
        >
          <View style={styles.permissionContainer}>
            <Ionicons name="location-outline" size={64} color={COLORS.warning} />
            <Text style={styles.permissionTitle}>Location Access Required</Text>
            <Text style={styles.permissionText}>
              This verification requires location access to ensure you're at the farm site.
            </Text>
            <Text style={styles.permissionSubtext}>
              Please enable location permissions in your device settings.
            </Text>
            <TouchableOpacity
              style={styles.permissionButton}
              onPress={() => router.back()}
            >
              <LinearGradient
                colors={[COLORS.primary, COLORS.secondary]}
                style={styles.permissionButtonGradient}
              >
                <Text style={styles.permissionButtonText}>Go Back</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[COLORS.background, COLORS.white]}
        style={styles.gradient}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color={COLORS.content} />
          </TouchableOpacity>
          <Text style={styles.title}>GPS Verification</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Main Content */}
        <View style={styles.content}>
          {/* GPS Status Card */}
          <View style={styles.statusCard}>
            <View style={styles.statusIconContainer}>
              <LinearGradient
                colors={[getStatusColor(), getStatusColor() + '80']}
                style={styles.statusIcon}
              >
                <Ionicons 
                  name={getStatusIcon() as any} 
                  size={48} 
                  color={COLORS.white} 
                />
              </LinearGradient>
            </View>

            <Text style={styles.statusTitle}>
              {loading ? 'Checking Location...' : 'Location Status'}
            </Text>
            
            <Text style={[styles.statusMessage, { color: getStatusColor() }]}>
              {getStatusMessage()}
            </Text>

            {distance && (
              <View style={styles.distanceContainer}>
                <Text style={styles.distanceLabel}>Distance from Farm:</Text>
                <Text style={[styles.distanceValue, { color: getStatusColor() }]}>
                  {Math.round(distance)} meters
                </Text>
              </View>
            )}

            {/* Target Location */}
            <View style={styles.locationInfo}>
              <View style={styles.locationRow}>
                <Ionicons name="navigate" size={20} color={COLORS.gray} />
                <Text style={styles.locationLabel}>Target Coordinates:</Text>
              </View>
              <Text style={styles.locationValue}>
                {targetLatitude.toFixed(6)}, {targetLongitude.toFixed(6)}
              </Text>
            </View>

            {/* Current Location */}
            {location && (
              <View style={styles.locationInfo}>
                <View style={styles.locationRow}>
                  <Ionicons name="locate" size={20} color={COLORS.gray} />
                  <Text style={styles.locationLabel}>Your Location:</Text>
                </View>
                <Text style={styles.locationValue}>
                  {location.coords.latitude.toFixed(6)}, {location.coords.longitude.toFixed(6)}
                </Text>
              </View>
            )}

            {/* Requirements */}
            <View style={styles.requirementsContainer}>
              <Text style={styles.requirementsTitle}>Verification Requirements:</Text>
              <View style={styles.requirementItem}>
                <Ionicons 
                  name={distance && distance <= 100 ? "checkmark-circle" : "ellipse"} 
                  size={20} 
                  color={distance && distance <= 100 ? COLORS.success : COLORS.gray} 
                />
                <Text style={styles.requirementText}>
                  Must be within 100 meters of the farm
                </Text>
              </View>
              <View style={styles.requirementItem}>
                <Ionicons 
                  name={location ? "checkmark-circle" : "ellipse"} 
                  size={20} 
                  color={location ? COLORS.success : COLORS.gray} 
                />
                <Text style={styles.requirementText}>
                  GPS location must be accurate
                </Text>
              </View>
              <View style={styles.requirementItem}>
                <Ionicons 
                  name="checkmark-circle" 
                  size={20} 
                  color={COLORS.success} 
                />
                <Text style={styles.requirementText}>
                  Timestamp will be recorded automatically
                </Text>
              </View>
            </View>
          </View>

          {/* Loading Indicator */}
          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={COLORS.primary} />
              <Text style={styles.loadingText}>Getting your location...</Text>
            </View>
          )}

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.actionButton, styles.retryButton]}
              onPress={handleRetry}
              disabled={loading}
            >
              <LinearGradient
                colors={[COLORS.secondary, COLORS.tertiary]}
                style={styles.retryButtonGradient}
              >
                <Ionicons name="refresh" size={20} color={COLORS.white} />
                <Text style={styles.retryButtonText}>Retry GPS</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.continueButton]}
              onPress={handleContinue}
              disabled={loading || !isWithinRange}
            >
              <LinearGradient
                colors={[COLORS.primary, COLORS.secondary]}
                style={styles.continueButtonGradient}
              >
                <Ionicons name="arrow-forward" size={20} color={COLORS.white} />
                <Text style={styles.continueButtonText}>Continue</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Instructions */}
          <View style={styles.instructionsContainer}>
            <Ionicons name="information-circle" size={20} color={COLORS.info} />
            <Text style={styles.instructionsText}>
              Move closer to the farm location if you're too far. GPS accuracy is crucial for verification.
            </Text>
          </View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  gradient: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: COLORS.white,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.content,
    textAlign: 'center',
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  statusCard: {
    backgroundColor: COLORS.white,
    borderRadius: 15,
    padding: 25, // FIXED: Added padding value
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    alignItems: 'center',
  },
  statusIconContainer: {
    marginBottom: 20,
  },
  statusIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  statusTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.content,
    marginBottom: 10,
    textAlign: 'center',
  },
  statusMessage: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 20,
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 25,
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: COLORS.background,
    borderRadius: 10,
    width: '100%',
  },
  distanceLabel: {
    fontSize: 16,
    color: COLORS.gray,
    marginRight: 8,
  },
  distanceValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  locationInfo: {
    width: '100%',
    backgroundColor: COLORS.background,
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationLabel: {
    fontSize: 14,
    color: COLORS.gray,
    marginLeft: 8,
    fontWeight: '500',
  },
  locationValue: {
    fontSize: 16,
    color: COLORS.content,
    fontWeight: '600',
    fontFamily: 'monospace',
  },
  requirementsContainer: {
    width: '100%',
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
  },
  requirementsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.content,
    marginBottom: 15,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  requirementText: {
    fontSize: 14,
    color: COLORS.gray,
    marginLeft: 12,
    flex: 1,
  },
  loadingContainer: {
    alignItems: 'center',
    marginVertical: 30,
  },
  loadingText: {
    fontSize: 16,
    color: COLORS.gray,
    marginTop: 15,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 15,
    marginTop: 30,
  },
  actionButton: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  retryButton: {
    elevation: 2,
    shadowColor: COLORS.secondary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  retryButtonGradient: {
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  retryButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  continueButton: {
    elevation: 3,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  continueButtonGradient: {
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  continueButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  instructionsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 25,
    padding: 15,
    backgroundColor: 'rgba(33, 150, 243, 0.1)',
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.info,
  },
  instructionsText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.content,
    marginLeft: 10,
    lineHeight: 20,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  permissionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.content,
    marginTop: 20,
    marginBottom: 15,
    textAlign: 'center',
  },
  permissionText: {
    fontSize: 16,
    color: COLORS.gray,
    textAlign: 'center',
    marginBottom: 10,
    lineHeight: 24,
  },
  permissionSubtext: {
    fontSize: 14,
    color: COLORS.gray,
    textAlign: 'center',
    marginBottom: 30,
    fontStyle: 'italic',
  },
  permissionButton: {
    borderRadius: 12,
    overflow: 'hidden',
    width: '100%',
  },
  permissionButtonGradient: {
    paddingVertical: 16,
    paddingHorizontal: 30,
  },
  permissionButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});