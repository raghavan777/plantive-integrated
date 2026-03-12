import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

// Colors
const COLORS = {
  primary: '#38a856',
  secondary: '#76a06a',
  tertiary: '#98be91',
  background: '#eff3ec',
  content: '#062905',
  white: '#ffffff',
  gray: '#888888',
  lightGray: '#e0e0e0',
  error: '#ff4444',
  warning: '#ffaa00',
  success: '#38a856',
};

const { width, height } = Dimensions.get('window');

export default function SmartCameraScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const cropStage = params.cropStage as string;
  
  // FIXED: Use number or ReturnType<typeof setInterval> instead of NodeJS.Timeout
  const autoCaptureTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  
  const [isCapturing, setIsCapturing] = useState(false);
  const [autoCaptureCountdown, setAutoCaptureCountdown] = useState<number | null>(null);
  const [distanceStatus, setDistanceStatus] = useState<'too-close' | 'good' | 'too-far'>('too-far');
  const [lightStatus, setLightStatus] = useState<'too-dark' | 'good' | 'too-bright'>('too-dark');
  const [cropDetected, setCropDetected] = useState(false);
  const [cameraType, setCameraType] = useState<'back' | 'front'>('back');
  const [flashMode, setFlashMode] = useState<'off' | 'on' | 'auto'>('off');

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (autoCaptureTimer.current) {
        clearInterval(autoCaptureTimer.current);
        autoCaptureTimer.current = null;
      }
    };
  }, []);

  // Simulate camera analysis
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate distance detection
      const randomDistance = Math.random();
      if (randomDistance < 0.3) {
        setDistanceStatus('too-close');
      } else if (randomDistance < 0.7) {
        setDistanceStatus('too-far');
      } else {
        setDistanceStatus('good');
      }

      // Simulate light detection
      const randomLight = Math.random();
      if (randomLight < 0.3) {
        setLightStatus('too-dark');
      } else if (randomLight < 0.7) {
        setLightStatus('too-bright');
      } else {
        setLightStatus('good');
      }

      // Simulate crop detection
      setCropDetected(Math.random() > 0.2);

      // Trigger auto-capture when conditions are perfect
      if (
        distanceStatus === 'good' &&
        lightStatus === 'good' &&
        cropDetected &&
        !autoCaptureCountdown &&
        !isCapturing
      ) {
        triggerAutoCapture();
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [distanceStatus, lightStatus, cropDetected, autoCaptureCountdown, isCapturing]);

  const triggerAutoCapture = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    setAutoCaptureCountdown(3);
    
    // FIXED: setInterval returns a number in React Native, not NodeJS.Timeout
    autoCaptureTimer.current = setInterval(() => {
      setAutoCaptureCountdown(prev => {
        if (prev === null) return null;
        if (prev === 1) {
          if (autoCaptureTimer.current) {
            clearInterval(autoCaptureTimer.current);
            autoCaptureTimer.current = null;
          }
          handleCapture();
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleCapture = async () => {
    if (isCapturing) return;
    
    try {
      setIsCapturing(true);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      
      // Simulate image capture delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo, use a placeholder image
      const demoImageUri = 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&auto=format&fit=crop';
      
      // Navigate to preview screen
      router.push({
        pathname: '/farmer/capture/preview',
        params: {
          imageUri: demoImageUri,
          cropStage: cropStage,
          latitude: '13.0827', // Demo coordinates (Chennai)
          longitude: '80.2707',
        },
      });
    } catch (error) {
      console.error('Error capturing photo:', error);
      Alert.alert('Error', 'Failed to capture image. Please try again.');
    } finally {
      setIsCapturing(false);
    }
  };

  const handleManualCapture = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    handleCapture();
  };

  const toggleCameraType = () => {
    setCameraType(current => current === 'back' ? 'front' : 'back');
  };

  const toggleFlashMode = () => {
    setFlashMode(current => {
      switch (current) {
        case 'off':
          return 'on';
        case 'on':
          return 'auto';
        case 'auto':
          return 'off';
        default:
          return 'off';
      }
    });
  };

  const getDistanceColor = () => {
    switch (distanceStatus) {
      case 'too-close':
        return COLORS.error;
      case 'good':
        return COLORS.success;
      case 'too-far':
        return COLORS.warning;
      default:
        return COLORS.gray;
    }
  };

  const getLightColor = () => {
    switch (lightStatus) {
      case 'too-dark':
        return COLORS.error;
      case 'good':
        return COLORS.success;
      case 'too-bright':
        return COLORS.warning;
      default:
        return COLORS.gray;
    }
  };

  const getDistanceText = () => {
    switch (distanceStatus) {
      case 'too-close':
        return 'Move Back';
      case 'good':
        return 'Perfect Distance';
      case 'too-far':
        return 'Move Closer';
      default:
        return 'Adjust Distance';
    }
  };

  const getLightText = () => {
    switch (lightStatus) {
      case 'too-dark':
        return 'Too Dark';
      case 'good':
        return 'Good Light';
      case 'too-bright':
        return 'Too Bright';
      default:
        return 'Check Lighting';
    }
  };

  const getFlashIcon = () => {
    switch (flashMode) {
      case 'on':
        return 'flash';
      case 'auto':
        return 'flash-outline';
      case 'off':
      default:
        return 'flash-off';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Camera Preview Placeholder */}
      <View style={styles.cameraPlaceholder}>
        <LinearGradient
          colors={['#2c3e50', '#4a6491']}
          style={styles.cameraGradient}
        >
          {/* Overlay Grid */}
          <View style={styles.overlay}>
            {/* Crop Boundary Guide */}
            <View style={styles.cropBoundary}>
              <View style={styles.boundaryLine} />
            </View>

            {/* Distance Indicator */}
            <View style={styles.distanceIndicator}>
              <View
                style={[
                  styles.distanceCircle,
                  { borderColor: getDistanceColor() },
                ]}
              >
                <Text style={[styles.distanceText, { color: getDistanceColor() }]}>
                  {getDistanceText()}
                </Text>
              </View>
            </View>

            {/* Top Controls */}
            <View style={styles.topControls}>
              <TouchableOpacity
                style={styles.controlButton}
                onPress={toggleFlashMode}
              >
                <Ionicons
                  name={getFlashIcon()}
                  size={24}
                  color={COLORS.white}
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.controlButton}
                onPress={toggleCameraType}
              >
                <Ionicons name="camera-reverse" size={24} color={COLORS.white} />
                <Text style={styles.cameraTypeText}>
                  {cameraType === 'back' ? 'Back' : 'Front'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Status Indicators */}
            <View style={styles.statusContainer}>
              <View style={styles.statusItem}>
                <View
                  style={[
                    styles.statusDot,
                    { backgroundColor: getLightColor() },
                  ]}
                />
                <Text style={styles.statusText}>{getLightText()}</Text>
              </View>

              <View style={styles.statusItem}>
                <View
                  style={[
                    styles.statusDot,
                    { backgroundColor: cropDetected ? COLORS.success : COLORS.error },
                  ]}
                />
                <Text style={styles.statusText}>
                  {cropDetected ? 'Crop Detected' : 'No Crop'}
                </Text>
              </View>
            </View>

            {/* Auto-capture Countdown */}
            {autoCaptureCountdown && (
              <View style={styles.countdownContainer}>
                <LinearGradient
                  colors={[COLORS.primary, COLORS.secondary]}
                  style={styles.countdownCircle}
                >
                  <Text style={styles.countdownText}>{autoCaptureCountdown}</Text>
                </LinearGradient>
                <Text style={styles.countdownMessage}>Auto-capturing in...</Text>
              </View>
            )}

            {/* Instructions */}
            <View style={styles.instructionsContainer}>
              <Text style={styles.instructionsTitle}>Smart Camera Guide</Text>
              <View style={styles.instructionItem}>
                <View style={[styles.instructionDot, { backgroundColor: getDistanceColor() }]} />
                <Text style={styles.instructionText}>{getDistanceText()}</Text>
              </View>
              <View style={styles.instructionItem}>
                <View style={[styles.instructionDot, { backgroundColor: getLightColor() }]} />
                <Text style={styles.instructionText}>{getLightText()}</Text>
              </View>
            </View>
          </View>
        </LinearGradient>
      </View>

      {/* Bottom Controls */}
      <View style={styles.bottomControls}>
        <View style={styles.captureInfo}>
          <Text style={styles.cropStageText}>
            Crop Stage: {cropStage || 'Not Selected'}
          </Text>
          <Text style={styles.instructions}>
            {autoCaptureCountdown 
              ? `Auto-capture in ${autoCaptureCountdown}s` 
              : 'Position crop within the frame'
            }
          </Text>
        </View>

        <TouchableOpacity
          style={styles.captureButton}
          onPress={handleManualCapture}
          disabled={isCapturing}
        >
          <LinearGradient
            colors={[COLORS.primary, COLORS.secondary]}
            style={styles.captureButtonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            {isCapturing ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <>
                <MaterialIcons name="camera" size={32} color={COLORS.white} />
                <Text style={styles.captureButtonText}>Capture Anyway</Text>
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.content,
  },
  cameraPlaceholder: {
    flex: 1,
    backgroundColor: '#000',
  },
  cameraGradient: {
    flex: 1,
    justifyContent: 'space-between',
  },
  overlay: {
    flex: 1,
    justifyContent: 'space-between',
  },
  cropBoundary: {
    position: 'absolute',
    top: '25%',
    left: '10%',
    right: '10%',
    bottom: '25%',
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderRadius: 10,
    borderStyle: 'dashed',
  },
  boundaryLine: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: COLORS.primary,
    opacity: 0.5,
  },
  distanceIndicator: {
    position: 'absolute',
    top: '15%',
    left: '50%',
    transform: [{ translateX: -75 }],
  },
  distanceCircle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  distanceText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    color: COLORS.white,
  },
  topControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  controlButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 25,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  cameraTypeText: {
    color: COLORS.white,
    fontSize: 12,
    marginLeft: 5,
  },
  statusContainer: {
    position: 'absolute',
    top: 120,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statusItem: {
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    flexDirection: 'row',
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  statusText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '500',
  },
  countdownContainer: {
    position: 'absolute',
    top: '40%',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  countdownCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  countdownText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  countdownMessage: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '500',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  instructionsContainer: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 15,
    padding: 15,
  },
  instructionsTitle: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  instructionDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 10,
  },
  instructionText: {
    color: COLORS.white,
    fontSize: 14,
  },
  bottomControls: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
  },
  captureInfo: {
    alignItems: 'center',
    marginBottom: 15,
  },
  cropStageText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  instructions: {
    color: COLORS.white,
    fontSize: 14,
    opacity: 0.8,
    textAlign: 'center',
  },
  captureButton: {
    borderRadius: 15,
    overflow: 'hidden',
  },
  captureButtonGradient: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});