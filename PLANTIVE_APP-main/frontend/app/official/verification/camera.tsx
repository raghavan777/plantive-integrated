// /home/ashith/Plantive/app/official/verification/camera.tsx

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
  Image,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

// Import colors
import { COLORS } from '../../../constants/colors';

const { width, height } = Dimensions.get('window');

// Photo types for official verification
const PHOTO_TYPES = [
  {
    id: 'wide-field',
    title: 'Wide Field Photo',
    description: 'Capture entire field from a distance',
    icon: 'scan',
    required: true,
    completed: false,
  },
  {
    id: 'close-crop',
    title: 'Closer Crop Photo',
    description: 'Focus on specific crop area',
    icon: 'leaf',
    required: true,
    completed: false,
  },
  {
    id: 'damage-specific',
    title: 'Damage Specific Photo',
    description: 'Close-up of affected areas',
    icon: 'warning',
    required: false,
    completed: false,
  },
];

export default function OfficialCameraScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const farmId = params.farmId as string;
  const latitude = params.latitude as string;
  const longitude = params.longitude as string;
  
  const [currentPhotoType, setCurrentPhotoType] = useState(PHOTO_TYPES[0]);
  const [photos, setPhotos] = useState<{[key: string]: string}>({});
  const [capturedPhotos, setCapturedPhotos] = useState<string[]>([]);
  const [isCapturing, setIsCapturing] = useState(false);
  const [distanceStatus, setDistanceStatus] = useState<'too-close' | 'good' | 'too-far'>('too-far');
  const [lightStatus, setLightStatus] = useState<'too-dark' | 'good' | 'too-bright'>('too-dark');
  const [cropDetected, setCropDetected] = useState(false);
  const [cameraType, setCameraType] = useState<'back' | 'front'>('back');
  const [flashMode, setFlashMode] = useState<'off' | 'on' | 'auto'>('off');
  const [autoCaptureCountdown, setAutoCaptureCountdown] = useState<number | null>(null);
  const autoCaptureTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  // Clean up timer
  useEffect(() => {
    return () => {
      if (autoCaptureTimer.current) {
        clearInterval(autoCaptureTimer.current);
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

    return () => clearInterval(interval);
  }, [distanceStatus, lightStatus, cropDetected, autoCaptureCountdown, isCapturing]);

  const triggerAutoCapture = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    setAutoCaptureCountdown(3);
    
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
      
      // Demo image URLs based on photo type
      const demoImages = {
        'wide-field': 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&auto=format&fit=crop',
        'close-crop': 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=800&auto=format&fit=crop',
        'damage-specific': 'https://images.unsplash.com/photo-1586771107445-d3ca888129fc?w=800&auto=format&fit=crop',
      };
      
      const demoImageUri = demoImages[currentPhotoType.id as keyof typeof demoImages] || demoImages['wide-field'];
      
      // Add to captured photos
      setPhotos(prev => ({
        ...prev,
        [currentPhotoType.id]: demoImageUri,
      }));
      
      setCapturedPhotos(prev => [...prev, currentPhotoType.id]);
      
      // Mark as completed
      const updatedTypes = PHOTO_TYPES.map(type => 
        type.id === currentPhotoType.id ? { ...type, completed: true } : type
      );
      // In real app, you'd update PHOTO_TYPES state
      
      // Show success message
      Alert.alert(
        'Photo Captured',
        `${currentPhotoType.title} saved successfully`,
        [
          {
            text: 'OK',
            onPress: () => {
              // Move to next photo type if available
              const currentIndex = PHOTO_TYPES.findIndex(type => type.id === currentPhotoType.id);
              if (currentIndex < PHOTO_TYPES.length - 1) {
                setCurrentPhotoType(PHOTO_TYPES[currentIndex + 1]);
              }
            }
          }
        ]
      );
      
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
        return COLORS.warning;
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
        return COLORS.warning;
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

  const getCompletedCount = () => {
    return capturedPhotos.length;
  };

  const navigateToAssessment = () => {
    const requiredPhotos = PHOTO_TYPES.filter(type => type.required);
    const completedRequired = requiredPhotos.filter(type => capturedPhotos.includes(type.id));
    
    if (completedRequired.length < requiredPhotos.length) {
      Alert.alert(
        'Required Photos Missing',
        `Please capture all required photos before proceeding. You need ${requiredPhotos.length - completedRequired.length} more.`,
        [{ text: 'OK' }]
      );
      return;
    }
    
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.push({
      pathname: '/official/verification/assessment',
      params: {
        farmId,
        latitude,
        longitude,
        photos: JSON.stringify(photos),
        capturedPhotos: JSON.stringify(capturedPhotos),
      }
    });
  };

  const renderPhotoTypeProgress = () => {
    return (
      <View style={styles.progressContainer}>
        <Text style={styles.progressTitle}>Verification Photos ({getCompletedCount()}/{PHOTO_TYPES.filter(p => p.required).length})</Text>
        
        <View style={styles.photoTypesList}>
          {PHOTO_TYPES.map((type, index) => (
            <TouchableOpacity
              key={type.id}
              style={[
                styles.photoTypeItem,
                currentPhotoType.id === type.id && styles.photoTypeItemActive,
                capturedPhotos.includes(type.id) && styles.photoTypeItemCompleted,
              ]}
              onPress={() => setCurrentPhotoType(type)}
            >
              <View style={styles.photoTypeIconContainer}>
                <Ionicons 
                  name={type.icon as any} 
                  size={20} 
                  color={
                    capturedPhotos.includes(type.id) 
                      ? COLORS.white 
                      : currentPhotoType.id === type.id 
                      ? COLORS.primary 
                      : COLORS.gray
                  } 
                />
              </View>
              <View style={styles.photoTypeInfo}>
                <Text style={[
                  styles.photoTypeTitle,
                  currentPhotoType.id === type.id && styles.photoTypeTitleActive,
                  capturedPhotos.includes(type.id) && styles.photoTypeTitleCompleted,
                ]}>
                  {type.title}
                  {!type.required && ' (Optional)'}
                </Text>
                <Text style={styles.photoTypeDescription}>{type.description}</Text>
              </View>
              {capturedPhotos.includes(type.id) ? (
                <View style={styles.completedBadge}>
                  <Ionicons name="checkmark" size={16} color={COLORS.white} />
                </View>
              ) : (
                <View style={styles.pendingBadge}>
                  <Text style={styles.pendingText}>{index + 1}</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

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
          <Text style={styles.title}>Capture Photos</Text>
          <TouchableOpacity
            style={styles.infoButton}
            onPress={() => {
              Alert.alert(
                'Photo Guidelines',
                '1. Wide Field: Show entire farm boundary\n2. Close Crop: Focus on crop health\n3. Damage Specific: Document affected areas\n\nEnsure good lighting and clear focus.'
              );
            }}
          >
            <Ionicons name="information-circle" size={24} color={COLORS.info} />
          </TouchableOpacity>
        </View>

        {/* Photo Progress */}
        {renderPhotoTypeProgress()}

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
                      { backgroundColor: cropDetected ? COLORS.success : COLORS.warning },
                    ]}
                  />
                  <Text style={styles.statusText}>
                    {cropDetected ? 'Crop Detected' : 'No Crop'}
                  </Text>
                </View>
              </View>

              {/* Current Photo Type */}
              <View style={styles.currentTypeContainer}>
                <LinearGradient
                  colors={[COLORS.primary + '80', COLORS.secondary + '80']}
                  style={styles.currentTypeBadge}
                >
                  <Ionicons name={currentPhotoType.icon as any} size={20} color={COLORS.white} />
                  <Text style={styles.currentTypeText}>{currentPhotoType.title}</Text>
                </LinearGradient>
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

              {/* Captured Thumbnails */}
              {capturedPhotos.length > 0 && (
                <View style={styles.thumbnailsContainer}>
                  <Text style={styles.thumbnailsTitle}>Captured Photos</Text>
                  <ScrollView 
                    horizontal 
                    showsHorizontalScrollIndicator={false}
                    style={styles.thumbnailsScroll}
                  >
                    {capturedPhotos.map((photoId, index) => {
                      const photoType = PHOTO_TYPES.find(type => type.id === photoId);
                      return (
                        <TouchableOpacity
                          key={index}
                          style={styles.thumbnailItem}
                          onPress={() => {
                            Alert.alert(
                              'Photo Preview',
                              `Type: ${photoType?.title}`,
                              [
                                { text: 'View', onPress: () => {
                                  // In real app, show full screen preview
                                }},
                                { text: 'Retake', onPress: () => {
                                  // Remove photo and allow retake
                                  setCapturedPhotos(prev => prev.filter(id => id !== photoId));
                                  const updatedPhotos = { ...photos };
                                  delete updatedPhotos[photoId];
                                  setPhotos(updatedPhotos);
                                }},
                                { text: 'Cancel', style: 'cancel' }
                              ]
                            );
                          }}
                        >
                          <Image
                            source={{ uri: photos[photoId] }}
                            style={styles.thumbnailImage}
                            resizeMode="cover"
                          />
                          <View style={styles.thumbnailBadge}>
                            <Ionicons name={photoType?.icon as any} size={12} color={COLORS.white} />
                          </View>
                        </TouchableOpacity>
                      );
                    })}
                  </ScrollView>
                </View>
              )}
            </View>
          </LinearGradient>
        </View>

        {/* Bottom Controls */}
        <View style={styles.bottomControls}>
          <View style={styles.instructionsContainer}>
            <Text style={styles.currentInstruction}>
              {currentPhotoType.description}
            </Text>
            <Text style={styles.autoCaptureText}>
              {autoCaptureCountdown 
                ? `Auto-capture in ${autoCaptureCountdown}s` 
                : 'Camera will auto-capture when conditions are optimal'
              }
            </Text>
          </View>

          <View style={styles.captureActions}>
            <TouchableOpacity
              style={[styles.captureButton, styles.manualButton]}
              onPress={handleManualCapture}
              disabled={isCapturing}
            >
              <LinearGradient
                colors={[COLORS.secondary, COLORS.tertiary]}
                style={styles.manualButtonGradient}
              >
                {isCapturing ? (
                  <ActivityIndicator color={COLORS.white} />
                ) : (
                  <>
                    <MaterialIcons name="camera" size={28} color={COLORS.white} />
                    <Text style={styles.manualButtonText}>Capture Manually</Text>
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.captureButton, styles.nextButton]}
              onPress={navigateToAssessment}
              disabled={capturedPhotos.length < PHOTO_TYPES.filter(p => p.required).length}
            >
              <LinearGradient
                colors={[COLORS.primary, COLORS.secondary]}
                style={styles.nextButtonGradient}
              >
                <Text style={styles.nextButtonText}>Next: Assessment</Text>
                <Ionicons name="arrow-forward" size={20} color={COLORS.white} />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

// Add ScrollView import at the top
import { ScrollView } from 'react-native';

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
  infoButton: {
    padding: 8,
  },
  progressContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: COLORS.white,
    marginTop: 10,
    marginHorizontal: 20,
    borderRadius: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.content,
    marginBottom: 15,
  },
  photoTypesList: {
    gap: 10,
  },
  photoTypeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
  },
  photoTypeItemActive: {
    borderColor: COLORS.primary,
    backgroundColor: 'rgba(56, 168, 86, 0.1)',
  },
  photoTypeItemCompleted: {
    borderColor: COLORS.success,
    backgroundColor: 'rgba(0, 170, 0, 0.1)',
  },
  photoTypeIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(56, 168, 86, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  photoTypeInfo: {
    flex: 1,
  },
  photoTypeTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.content,
    marginBottom: 2,
  },
  photoTypeTitleActive: {
    color: COLORS.primary,
  },
  photoTypeTitleCompleted: {
    color: COLORS.success,
  },
  photoTypeDescription: {
    fontSize: 12,
    color: COLORS.gray,
  },
  completedBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.success,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pendingBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pendingText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  cameraPlaceholder: {
    flex: 1,
    backgroundColor: '#000',
    marginTop: 15,
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
  currentTypeContainer: {
    position: 'absolute',
    top: '40%',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  currentTypeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: 'rgba(56, 168, 86, 0.8)',
  },
  currentTypeText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  countdownContainer: {
    position: 'absolute',
    top: '50%',
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
  thumbnailsContainer: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 10,
    padding: 10,
  },
  thumbnailsTitle: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  thumbnailsScroll: {
    flexDirection: 'row',
  },
  thumbnailItem: {
    marginRight: 10,
    position: 'relative',
  },
  thumbnailImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: COLORS.lightGray,
  },
  thumbnailBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomControls: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
  },
  instructionsContainer: {
    alignItems: 'center',
    marginBottom: 15,
  },
  currentInstruction: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
    textAlign: 'center',
  },
  autoCaptureText: {
    color: COLORS.white,
    fontSize: 14,
    opacity: 0.8,
    textAlign: 'center',
  },
  captureActions: {
    flexDirection: 'row',
    gap: 10,
  },
  captureButton: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  manualButton: {
    elevation: 2,
    shadowColor: COLORS.secondary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  manualButtonGradient: {
    paddingVertical: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  manualButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  nextButton: {
    elevation: 3,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  nextButtonGradient: {
    paddingVertical: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
});