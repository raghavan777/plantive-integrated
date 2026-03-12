import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Image,
  Animated,
  SafeAreaView,
  Alert,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { COLORS } from '../../../constants/colors';

const { width } = Dimensions.get('window');

export default function CaptureGuidanceScreen() {
  const { cropStage } = useLocalSearchParams();
  const [currentTip, setCurrentTip] = useState(0);
  const [progressAnim] = useState(new Animated.Value(0));
  const [pulseAnim] = useState(new Animated.Value(1));

  // Tips for capturing crop images
  const tips = [
    {
      id: 1,
      title: 'Lighting is Key',
      description: 'Capture in daylight with even lighting. Avoid harsh shadows on the crop.',
      icon: '☀️',
      image: 'lighting',
    },
    {
      id: 2,
      title: 'Proper Distance',
      description: 'Hold phone 1-2 meters from crop. Ensure crop fills the frame.',
      icon: '📏',
      image: 'distance',
    },
    {
      id: 3,
      title: 'Angle Matters',
      description: 'Hold phone parallel to ground. Capture from 45° angle for best results.',
      icon: '📐',
      image: 'angle',
    },
    {
      id: 4,
      title: 'Focus on Crop',
      description: 'Tap to focus on the main crop area. Avoid including unnecessary background.',
      icon: '🎯',
      image: 'focus',
    },
    {
      id: 5,
      title: 'Multiple Shots',
      description: 'Take 2-3 photos from different angles for better AI analysis.',
      icon: '📸',
      image: 'multiple',
    },
  ];

  // Stage-specific guidance
  const stageGuidance: Record<string, { focus: string; examples: string[] }> = {
    sowing: {
      focus: 'Focus on seed distribution and soil preparation',
      examples: ['Seed rows spacing', 'Soil moisture level', 'Seed depth'],
    },
    vegetative: {
      focus: 'Capture leaf development and plant height',
      examples: ['Leaf color and size', 'Plant spacing', 'Weed presence'],
    },
    flowering: {
      focus: 'Document flower development and pollination',
      examples: ['Flower density', 'Flower health', 'Pollinator activity'],
    },
    maturity: {
      focus: 'Show crop maturity and grain development',
      examples: ['Grain filling', 'Plant color change', 'Harvest readiness'],
    },
    harvest: {
      focus: 'Record yield and post-harvest condition',
      examples: ['Harvested quantity', 'Crop quality', 'Storage condition'],
    },
  };

  useEffect(() => {
    // Pulse animation for continue button
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Progress animation
    Animated.timing(progressAnim, {
      toValue: (currentTip + 1) / tips.length,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [currentTip]);

  const handleNextTip = () => {
    if (currentTip < tips.length - 1) {
      setCurrentTip(currentTip + 1);
    }
  };

  const handlePrevTip = () => {
    if (currentTip > 0) {
      setCurrentTip(currentTip - 1);
    }
  };

  const handleStartCamera = () => {
    Alert.alert(
      'Ready to Capture',
      `You're about to capture ${cropStage} stage images.\n\nEnsure you have:\n• Good lighting\n• Steady hands\n• Crop in frame`,
      [
        { text: 'Not Yet', style: 'cancel' },
        { text: 'Start Camera', onPress: () => router.push('/farmer/capture/camera') },
      ]
    );
  };

  const renderImagePlaceholder = (type: string) => {
    const images = {
      lighting: '☀️',
      distance: '📏',
      angle: '📐',
      focus: '🎯',
      multiple: '📸',
    };
    return (
      <View style={styles.imagePlaceholder}>
        <Text style={styles.placeholderIcon}>{images[type as keyof typeof images] || '📷'}</Text>
        <Text style={styles.placeholderText}>Example Image</Text>
      </View>
    );
  };

  const getStageColor = () => {
    switch (cropStage) {
      case 'sowing': return '#8B4513'; // Brown
      case 'vegetative': return '#228B22'; // Green
      case 'flowering': return '#FF69B4'; // Pink
      case 'maturity': return '#DAA520'; // Golden
      case 'harvest': return '#A0522D'; // Sienna
      default: return COLORS.primary;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Capture Guidance</Text>
          <View style={styles.stageBadge}>
            <Text style={[styles.stageBadgeText, { color: getStageColor() }]}>
              {cropStage ? String(cropStage).charAt(0).toUpperCase() + String(cropStage).slice(1) : 'Crop'}
            </Text>
          </View>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBackground}>
            <Animated.View
              style={[
                styles.progressFill,
                {
                  width: progressAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0%', '100%'],
                  }),
                },
              ]}
            />
          </View>
          <Text style={styles.progressText}>
            Tip {currentTip + 1} of {tips.length}
          </Text>
        </View>

        {/* Current Tip */}
        <View style={styles.tipCard}>
          <View style={styles.tipHeader}>
            <Text style={styles.tipIcon}>{tips[currentTip].icon}</Text>
            <Text style={styles.tipTitle}>{tips[currentTip].title}</Text>
          </View>
          <Text style={styles.tipDescription}>{tips[currentTip].description}</Text>
          
          {/* Image Placeholder */}
          {renderImagePlaceholder(tips[currentTip].image)}
          
          {/* Tip Navigation */}
          <View style={styles.tipNavigation}>
            <TouchableOpacity
              style={[styles.navButton, currentTip === 0 && styles.navButtonDisabled]}
              onPress={handlePrevTip}
              disabled={currentTip === 0}
            >
              <Text style={styles.navButtonText}>← Previous</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.navButton, currentTip === tips.length - 1 && styles.navButtonDisabled]}
              onPress={handleNextTip}
              disabled={currentTip === tips.length - 1}
            >
              <Text style={styles.navButtonText}>Next →</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Stage-Specific Guidance */}
        <View style={styles.stageGuidanceCard}>
          <Text style={styles.sectionTitle}>
            📋 {cropStage ? String(cropStage).charAt(0).toUpperCase() + String(cropStage).slice(1) : 'Crop'} Stage Guidelines
          </Text>
          <View style={styles.guidanceContent}>
            <View style={styles.guidanceItem}>
              <Text style={styles.guidanceLabel}>Focus On:</Text>
              <Text style={styles.guidanceValue}>
                {cropStage && stageGuidance[cropStage as string]?.focus || 'General crop health'}
              </Text>
            </View>
            
            <View style={styles.guidanceItem}>
              <Text style={styles.guidanceLabel}>Capture Examples:</Text>
              {cropStage && stageGuidance[cropStage as string]?.examples.map((example, index) => (
                <View key={index} style={styles.exampleItem}>
                  <Text style={styles.exampleBullet}>•</Text>
                  <Text style={styles.exampleText}>{example}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Common Mistakes to Avoid */}
        <View style={styles.mistakesCard}>
          <Text style={styles.sectionTitle}>⚠️ Avoid These Common Mistakes</Text>
          <View style={styles.mistakesList}>
            <View style={styles.mistakeItem}>
              <Text style={styles.mistakeIcon}>❌</Text>
              <Text style={styles.mistakeText}>Blurry or out-of-focus images</Text>
            </View>
            <View style={styles.mistakeItem}>
              <Text style={styles.mistakeIcon}>❌</Text>
              <Text style={styles.mistakeText}>Capturing in low light or at night</Text>
            </View>
            <View style={styles.mistakeItem}>
              <Text style={styles.mistakeIcon}>❌</Text>
              <Text style={styles.mistakeText}>Including too much background</Text>
            </View>
            <View style={styles.mistakeItem}>
              <Text style={styles.mistakeIcon}>❌</Text>
              <Text style={styles.mistakeText}>Camera too close or too far</Text>
            </View>
            <View style={styles.mistakeItem}>
              <Text style={styles.mistakeIcon}>❌</Text>
              <Text style={styles.mistakeText}>Shadows covering the crop</Text>
            </View>
          </View>
        </View>

        {/* Best Practices */}
        <View style={styles.bestPracticesCard}>
          <Text style={styles.sectionTitle}>✅ Best Practices</Text>
          <View style={styles.practicesGrid}>
            <View style={styles.practiceItem}>
              <Text style={styles.practiceIcon}>⏰</Text>
              <Text style={styles.practiceTitle}>Best Time</Text>
              <Text style={styles.practiceText}>Morning (8-10 AM) or Evening (4-6 PM)</Text>
            </View>
            <View style={styles.practiceItem}>
              <Text style={styles.practiceIcon}>📱</Text>
              <Text style={styles.practiceTitle}>Phone Position</Text>
              <Text style={styles.practiceText}>Hold steady at waist height</Text>
            </View>
            <View style={styles.practiceItem}>
              <Text style={styles.practiceIcon}>🌧️</Text>
              <Text style={styles.practiceTitle}>Weather</Text>
              <Text style={styles.practiceText}>Avoid rainy or windy conditions</Text>
            </View>
            <View style={styles.practiceItem}>
              <Text style={styles.practiceIcon}>👕</Text>
              <Text style={styles.practiceTitle}>Clothing</Text>
              <Text style={styles.practiceText}>Wear contrasting colors to crop</Text>
            </View>
          </View>
        </View>

        {/* Audio Guidance */}
        <TouchableOpacity style={styles.audioGuidanceCard}>
          <View style={styles.audioHeader}>
            <Text style={styles.audioIcon}>🔊</Text>
            <Text style={styles.audioTitle}>Listen to Audio Instructions</Text>
          </View>
          <Text style={styles.audioDescription}>
            Tap to hear voice guidance in your selected language
          </Text>
          <View style={styles.audioControls}>
            <TouchableOpacity style={styles.audioButton}>
              <Text style={styles.audioButtonText}>Play in English</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.audioButton, styles.hindiButton]}>
              <Text style={styles.audioButtonText}>हिंदी में सुनें</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>

        {/* Image Quality Check */}
        <View style={styles.qualityCard}>
          <Text style={styles.sectionTitle}>📊 Image Quality Checklist</Text>
          <View style={styles.checklist}>
            <View style={styles.checkItem}>
              <Text style={styles.checkIcon}>✅</Text>
              <Text style={styles.checkText}>Clear and sharp focus</Text>
            </View>
            <View style={styles.checkItem}>
              <Text style={styles.checkIcon}>✅</Text>
              <Text style={styles.checkText}>Good lighting (no shadows)</Text>
            </View>
            <View style={styles.checkItem}>
              <Text style={styles.checkIcon}>✅</Text>
              <Text style={styles.checkText}>Crop fills 70% of frame</Text>
            </View>
            <View style={styles.checkItem}>
              <Text style={styles.checkIcon}>✅</Text>
              <Text style={styles.checkText}>Multiple angles captured</Text>
            </View>
            <View style={styles.checkItem}>
              <Text style={styles.checkIcon}>✅</Text>
              <Text style={styles.checkText}>Background is not distracting</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Continue Button */}
      <Animated.View style={[styles.continueContainer, { transform: [{ scale: pulseAnim }] }]}>
        <TouchableOpacity style={styles.continueButton} onPress={handleStartCamera}>
          <Text style={styles.continueButtonText}>Start Camera with Smart Guide</Text>
          <Text style={styles.continueSubtext}>
            Smart assistance for perfect crop photos
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.skipButton}
          onPress={() => router.push('/farmer/capture/camera')}
        >
          <Text style={styles.skipButtonText}>Skip Guidance →</Text>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingBottom: 150,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 15,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  backButton: {
    padding: 5,
  },
  backButtonText: {
    fontSize: 24,
    color: COLORS.content,
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.content,
    flex: 1,
    textAlign: 'center',
  },
  stageBadge: {
    backgroundColor: COLORS.tertiary + '30',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: COLORS.tertiary,
  },
  stageBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  progressContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  progressBackground: {
    height: 6,
    backgroundColor: COLORS.lightGray,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: COLORS.gray,
    textAlign: 'center',
  },
  tipCard: {
    backgroundColor: COLORS.white,
    marginHorizontal: 20,
    marginTop: 10,
    padding: 20,
    borderRadius: 15,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  tipIcon: {
    fontSize: 32,
    marginRight: 15,
  },
  tipTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.content,
    flex: 1,
  },
  tipDescription: {
    fontSize: 16,
    color: COLORS.gray,
    lineHeight: 24,
    marginBottom: 20,
  },
  imagePlaceholder: {
    height: 150,
    backgroundColor: COLORS.tertiary + '20',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: COLORS.tertiary,
    borderStyle: 'dashed',
  },
  placeholderIcon: {
    fontSize: 48,
    marginBottom: 10,
  },
  placeholderText: {
    fontSize: 14,
    color: COLORS.gray,
    fontStyle: 'italic',
  },
  tipNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  navButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: COLORS.tertiary,
    borderRadius: 8,
  },
  navButtonDisabled: {
    backgroundColor: COLORS.lightGray,
    opacity: 0.5,
  },
  navButtonText: {
    color: COLORS.white,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.content,
    marginBottom: 15,
  },
  stageGuidanceCard: {
    backgroundColor: COLORS.white,
    marginHorizontal: 20,
    marginTop: 20,
    padding: 20,
    borderRadius: 15,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  guidanceContent: {
    gap: 15,
  },
  guidanceItem: {
    gap: 5,
  },
  guidanceLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.gray,
  },
  guidanceValue: {
    fontSize: 16,
    color: COLORS.content,
    lineHeight: 22,
  },
  exampleItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 5,
  },
  exampleBullet: {
    fontSize: 16,
    color: COLORS.primary,
    marginRight: 8,
  },
  exampleText: {
    fontSize: 14,
    color: COLORS.gray,
    flex: 1,
    lineHeight: 20,
  },
  mistakesCard: {
    backgroundColor: COLORS.white,
    marginHorizontal: 20,
    marginTop: 20,
    padding: 20,
    borderRadius: 15,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.error,
  },
  mistakesList: {
    gap: 12,
  },
  mistakeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  mistakeIcon: {
    fontSize: 20,
  },
  mistakeText: {
    fontSize: 14,
    color: COLORS.content,
    flex: 1,
  },
  bestPracticesCard: {
    backgroundColor: COLORS.white,
    marginHorizontal: 20,
    marginTop: 20,
    padding: 20,
    borderRadius: 15,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.success,
  },
  practicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 15,
  },
  practiceItem: {
    width: '48%',
    backgroundColor: COLORS.tertiary + '10',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  practiceIcon: {
    fontSize: 28,
    marginBottom: 10,
  },
  practiceTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.content,
    marginBottom: 5,
    textAlign: 'center',
  },
  practiceText: {
    fontSize: 12,
    color: COLORS.gray,
    textAlign: 'center',
    lineHeight: 16,
  },
  audioGuidanceCard: {
    backgroundColor: COLORS.white,
    marginHorizontal: 20,
    marginTop: 20,
    padding: 20,
    borderRadius: 15,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  audioHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  audioIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  audioTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.content,
    flex: 1,
  },
  audioDescription: {
    fontSize: 14,
    color: COLORS.gray,
    marginBottom: 15,
  },
  audioControls: {
    flexDirection: 'row',
    gap: 10,
  },
  audioButton: {
    flex: 1,
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  hindiButton: {
    backgroundColor: COLORS.secondary,
  },
  audioButtonText: {
    color: COLORS.white,
    fontWeight: '600',
  },
  qualityCard: {
    backgroundColor: COLORS.white,
    marginHorizontal: 20,
    marginTop: 20,
    padding: 20,
    borderRadius: 15,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  checklist: {
    gap: 10,
  },
  checkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  checkIcon: {
    fontSize: 20,
    color: COLORS.success,
  },
  checkText: {
    fontSize: 14,
    color: COLORS.content,
    flex: 1,
  },
  continueContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.white,
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  continueButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 18,
    alignItems: 'center',
    marginBottom: 10,
  },
  continueButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  continueSubtext: {
    color: COLORS.white,
    fontSize: 12,
    opacity: 0.9,
  },
  skipButton: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  skipButtonText: {
    color: COLORS.gray,
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});