import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  Easing,
  TouchableOpacity,
} from 'react-native';
import { COLORS } from '../../constants/colors';
import { Feather } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');
const GUIDE_BOX_SIZE = Math.min(width, height) * 0.6;

interface CameraGuideProps {
  lightLevel: 'good' | 'low' | 'high' | 'unknown';
  distanceGuide: 'close' | 'good' | 'far' | 'unknown';
  cropDetected: boolean;
  autoCaptureReady: boolean;
  onCapturePress?: () => void;
  showManualCapture?: boolean;
  showInstructions?: boolean;
  onInstructionPress?: () => void;
}

const CameraGuide: React.FC<CameraGuideProps> = ({
  lightLevel = 'unknown',
  distanceGuide = 'unknown',
  cropDetected = false,
  autoCaptureReady = false,
  onCapturePress,
  showManualCapture = true,
  showInstructions = true,
  onInstructionPress,
}) => {
  // Animations
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const distanceAnim = useRef(new Animated.Value(0)).current;
  const lightAnim = useRef(new Animated.Value(0)).current;
  const guideBoxAnim = useRef(new Animated.Value(0)).current;
  const [showAutoCapture, setShowAutoCapture] = useState(false);

  // Auto-capture countdown
  const [countdown, setCountdown] = useState(3);
  const countdownAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Start entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(guideBoxAnim, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();

    // Continuous pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  useEffect(() => {
    // Animate distance indicator
    Animated.timing(distanceAnim, {
      toValue: distanceGuide === 'good' ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();

    // Animate light indicator
    Animated.timing(lightAnim, {
      toValue: lightLevel === 'good' ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();

    // Handle auto-capture state
    if (autoCaptureReady && lightLevel === 'good' && distanceGuide === 'good' && cropDetected) {
      setShowAutoCapture(true);
      startAutoCaptureCountdown();
    } else {
      setShowAutoCapture(false);
    }
  }, [lightLevel, distanceGuide, cropDetected, autoCaptureReady]);

  const startAutoCaptureCountdown = () => {
    setCountdown(3);
    
    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev === 1) {
          clearInterval(interval);
          // Trigger auto-capture
          if (onCapturePress) {
            setTimeout(() => onCapturePress(), 100);
          }
          return 0;
        }
        return prev - 1;
      });

      // Countdown animation
      Animated.sequence([
        Animated.timing(countdownAnim, {
          toValue: 1.2,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(countdownAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }, 1000);
  };

  // Get color based on status
  const getDistanceColor = () => {
    switch (distanceGuide) {
      case 'close': return COLORS.error;
      case 'good': return COLORS.success;
      case 'far': return COLORS.warning;
      default: return COLORS.gray;
    }
  };

  const getLightColor = () => {
    switch (lightLevel) {
      case 'good': return COLORS.success;
      case 'low': return COLORS.warning;
      case 'high': return COLORS.error;
      default: return COLORS.gray;
    }
  };

  const getCropColor = () => {
    return cropDetected ? COLORS.success : COLORS.error;
  };

  const getDistanceText = () => {
    switch (distanceGuide) {
      case 'close': return 'Move Back';
      case 'good': return 'Perfect Distance ✓';
      case 'far': return 'Move Closer';
      default: return 'Adjust Distance';
    }
  };

  const getLightText = () => {
    switch (lightLevel) {
      case 'good': return 'Good Lighting ✓';
      case 'low': return 'Too Dark';
      case 'high': return 'Too Bright';
      default: return 'Checking Light';
    }
  };

  const getCropText = () => {
    return cropDetected ? 'Crop Detected ✓' : 'No Crop Detected';
  };

  // Guide box border color
  const getGuideBoxColor = () => {
    if (lightLevel === 'good' && distanceGuide === 'good' && cropDetected) {
      return COLORS.success;
    }
    if (lightLevel === 'low' || distanceGuide === 'far') {
      return COLORS.warning;
    }
    if (lightLevel === 'high' || distanceGuide === 'close') {
      return COLORS.error;
    }
    return COLORS.lightGray;
  };

  const renderStatusIndicator = (
    icon: string,
    color: string,
    text: string,
    animation: Animated.Value,
    isActive: boolean
  ) => {
    return (
      <View style={styles.statusIndicator}>
        <Animated.View
          style={[
            styles.statusIconContainer,
            { backgroundColor: color + '30' },
            {
              transform: [
                { scale: animation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.9, 1.1],
                })},
              ],
              opacity: animation.interpolate({
                inputRange: [0, 1],
                outputRange: [0.5, 1],
              }),
            },
          ]}
        >
          <Feather name={icon as any} size={20} color={color} />
        </Animated.View>
        <Text style={[styles.statusText, { color }, isActive && styles.statusTextActive]}>
          {text}
        </Text>
      </View>
    );
  };

  const renderAutoCaptureIndicator = () => {
    if (!showAutoCapture) return null;

    return (
      <Animated.View
        style={[
          styles.autoCaptureContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: countdownAnim }],
          },
        ]}
      >
        <View style={styles.autoCaptureContent}>
          <Text style={styles.autoCaptureTitle}>Auto Capture</Text>
          <View style={styles.countdownContainer}>
            <Animated.Text style={[styles.countdownText, { transform: [{ scale: countdownAnim }] }]}>
              {countdown}
            </Animated.Text>
            <Text style={styles.countdownLabel}>seconds</Text>
          </View>
          <Text style={styles.autoCaptureSubtitle}>
            Perfect conditions detected!
          </Text>
        </View>
      </Animated.View>
    );
  };

  const renderDistanceIndicator = () => {
    const isActive = distanceGuide === 'good';
    return (
      <Animated.View
        style={[
          styles.distanceIndicator,
          {
            backgroundColor: getDistanceColor() + '40',
            transform: [
              { scale: distanceAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.8, 1.2],
              })},
            ],
            opacity: distanceAnim,
          },
        ]}
      >
        <View style={styles.distanceInner} />
      </Animated.View>
    );
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      {/* Guide Box */}
      <Animated.View
        style={[
          styles.guideBox,
          {
            width: GUIDE_BOX_SIZE,
            height: GUIDE_BOX_SIZE,
            borderColor: getGuideBoxColor(),
            transform: [
              { scale: guideBoxAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.8, 1],
              })},
            ],
          },
        ]}
      >
        {/* Distance Indicator Circle */}
        {renderDistanceIndicator()}

        {/* Center Crosshair */}
        <View style={styles.crosshair}>
          <View style={styles.crosshairLine} />
          <View style={[styles.crosshairLine, styles.crosshairVertical]} />
        </View>

        {/* Corner Guides */}
        <View style={[styles.cornerGuide, styles.topLeft]} />
        <View style={[styles.cornerGuide, styles.topRight]} />
        <View style={[styles.cornerGuide, styles.bottomLeft]} />
        <View style={[styles.cornerGuide, styles.bottomRight]} />
      </Animated.View>

      {/* Auto Capture Indicator */}
      {renderAutoCaptureIndicator()}

      {/* Status Indicators */}
      <View style={styles.statusContainer}>
        {renderStatusIndicator(
          'sun',
          getLightColor(),
          getLightText(),
          lightAnim,
          lightLevel === 'good'
        )}
        
        {renderStatusIndicator(
          'maximize',
          getDistanceColor(),
          getDistanceText(),
          distanceAnim,
          distanceGuide === 'good'
        )}
        
        {renderStatusIndicator(
          'check-circle',
          getCropColor(),
          getCropText(),
          fadeAnim,
          cropDetected
        )}
      </View>

      {/* Instructions */}
      {showInstructions && (
        <Animated.View style={[styles.instructionsContainer, { opacity: fadeAnim }]}>
          <Text style={styles.instructionsTitle}>Capture Tips:</Text>
          <View style={styles.instructionsList}>
            <View style={styles.instructionItem}>
              <Text style={styles.instructionIcon}>🎯</Text>
              <Text style={styles.instructionText}>
                Keep crop within the green box
              </Text>
            </View>
            <View style={styles.instructionItem}>
              <Text style={styles.instructionIcon}>☀️</Text>
              <Text style={styles.instructionText}>
                Ensure good lighting conditions
              </Text>
            </View>
            <View style={styles.instructionItem}>
              <Text style={styles.instructionIcon}>📏</Text>
              <Text style={styles.instructionText}>
                Maintain 1-2 meters distance
              </Text>
            </View>
            <View style={styles.instructionItem}>
              <Text style={styles.instructionIcon}>🤚</Text>
              <Text style={styles.instructionText}>
                Hold phone steady for clear image
              </Text>
            </View>
          </View>
          
          {onInstructionPress && (
            <TouchableOpacity
              style={styles.moreTipsButton}
              onPress={onInstructionPress}
            >
              <Text style={styles.moreTipsText}>View Detailed Guide →</Text>
            </TouchableOpacity>
          )}
        </Animated.View>
      )}

      {/* Manual Capture Button */}
      {showManualCapture && onCapturePress && (
        <Animated.View
          style={[
            styles.manualCaptureContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: pulseAnim }],
            },
          ]}
        >
          <TouchableOpacity
            style={styles.manualCaptureButton}
            onPress={onCapturePress}
          >
            <Text style={styles.manualCaptureText}>Capture Manually</Text>
          </TouchableOpacity>
          <Text style={styles.manualCaptureHint}>
            Tap or wait for auto-capture
          </Text>
        </Animated.View>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  guideBox: {
    borderWidth: 3,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    position: 'relative',
  },
  distanceIndicator: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  distanceInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  crosshair: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  crosshairLine: {
    position: 'absolute',
    width: '80%',
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 1,
  },
  crosshairVertical: {
    transform: [{ rotate: '90deg' }],
  },
  cornerGuide: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderColor: 'rgba(255,255,255,0.7)',
    borderWidth: 2,
  },
  topLeft: {
    top: -2,
    left: -2,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderTopLeftRadius: 8,
  },
  topRight: {
    top: -2,
    right: -2,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
    borderTopRightRadius: 8,
  },
  bottomLeft: {
    bottom: -2,
    left: -2,
    borderRightWidth: 0,
    borderTopWidth: 0,
    borderBottomLeftRadius: 8,
  },
  bottomRight: {
    bottom: -2,
    right: -2,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderBottomRightRadius: 8,
  },
  autoCaptureContainer: {
    position: 'absolute',
    top: 50,
    alignItems: 'center',
    width: '100%',
  },
  autoCaptureContent: {
    backgroundColor: 'rgba(56, 168, 86, 0.9)',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 20,
    alignItems: 'center',
    minWidth: 200,
  },
  autoCaptureTitle: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  countdownContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  countdownText: {
    color: COLORS.white,
    fontSize: 32,
    fontWeight: 'bold',
    marginRight: 5,
  },
  countdownLabel: {
    color: COLORS.white,
    fontSize: 14,
    opacity: 0.9,
  },
  autoCaptureSubtitle: {
    color: COLORS.white,
    fontSize: 12,
    opacity: 0.9,
  },
  statusContainer: {
    position: 'absolute',
    bottom: 150,
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '90%',
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 15,
    padding: 15,
  },
  statusIndicator: {
    alignItems: 'center',
    flex: 1,
  },
  statusIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 14,
  },
  statusTextActive: {
    fontWeight: 'bold',
  },
  instructionsContainer: {
    position: 'absolute',
    bottom: 240,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 15,
    padding: 15,
    marginHorizontal: 20,
    width: '90%',
  },
  instructionsTitle: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  instructionsList: {
    gap: 10,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  instructionIcon: {
    fontSize: 16,
    color: COLORS.white,
  },
  instructionText: {
    flex: 1,
    color: COLORS.white,
    fontSize: 14,
    lineHeight: 18,
  },
  moreTipsButton: {
    marginTop: 15,
    alignItems: 'center',
    paddingVertical: 8,
  },
  moreTipsText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  manualCaptureContainer: {
    position: 'absolute',
    bottom: 50,
    alignItems: 'center',
  },
  manualCaptureButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    minWidth: 200,
    alignItems: 'center',
  },
  manualCaptureText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  manualCaptureHint: {
    color: COLORS.white,
    fontSize: 12,
    marginTop: 8,
    opacity: 0.8,
  },
});

export default CameraGuide;