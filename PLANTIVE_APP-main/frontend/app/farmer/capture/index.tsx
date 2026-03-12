  // /home/ashith/Plantive/app/farmer/capture/index.tsx

  import React, { useState } from 'react';
  import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
  } from 'react-native';
  import { useRouter } from 'expo-router';
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
  };

  const CROP_STAGES = [
    { id: 'sowing', name: 'Sowing', icon: 'seedling' },
    { id: 'vegetative', name: 'Vegetative', icon: 'leaf' },
    { id: 'flowering', name: 'Flowering', icon: 'flower' },
    { id: 'maturity', name: 'Maturity', icon: 'wheat' },
    { id: 'harvest', name: 'Harvest', icon: 'tractor' },
  ];

  export default function CaptureIndex() {
    const router = useRouter();
    const [selectedStage, setSelectedStage] = useState<string | null>(null);

    const handleStageSelect = (stageId: string) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setSelectedStage(stageId);
      
      // Navigate to guidance screen
      setTimeout(() => {
        router.push({
          pathname: '/farmer/capture/guidance',
          params: { cropStage: stageId }
        });
      }, 300);
    };

    const navigateToHistory = (captureId?: string) => {
      if (captureId) {
        // FIXED: Use backticks for template literals
        router.push(`/farmer/history?captureId=${captureId}`);
      } else {
        router.push('/farmer/history');
      }
    };

    const handleRecentCapturePress = (captureId: string) => {
      // FIXED: Correct syntax for navigation with parameters
      navigateToHistory(captureId);
    };

    // Mock recent captures
    const recentCaptures = [
      { id: '1', date: 'Today, 10:30 AM', crop: 'Paddy', stage: 'Flowering' },
      { id: '2', date: 'Yesterday, 3:15 PM', crop: 'Wheat', stage: 'Vegetative' },
      { id: '3', date: 'Dec 20, 9:45 AM', crop: 'Maize', stage: 'Maturity' },
    ];

    return (
      <View style={styles.container}>
        <LinearGradient
          colors={[COLORS.background, COLORS.white]}
          style={styles.gradient}
        >
          <ScrollView style={styles.scrollView}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>Capture Crop Image</Text>
              <Text style={styles.subtitle}>Select crop stage for image capture</Text>
            </View>

            {/* Crop Stage Selection */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Select Crop Stage</Text>
              <Text style={styles.sectionDescription}>
                Choose the current stage of your crop for accurate analysis
              </Text>
              
              <View style={styles.stageGrid}>
                {CROP_STAGES.map(stage => (
                  <TouchableOpacity
                    key={stage.id}
                    style={[
                      styles.stageCard,
                      selectedStage === stage.id && styles.stageCardSelected,
                    ]}
                    onPress={() => handleStageSelect(stage.id)}
                  >
                    <LinearGradient
                      colors={
                        selectedStage === stage.id
                          ? [COLORS.primary, COLORS.secondary]
                          : [COLORS.white, COLORS.lightGray]
                      }
                      style={styles.stageGradient}
                    >
                      <MaterialIcons
                        name={stage.icon as any}
                        size={32}
                        color={selectedStage === stage.id ? COLORS.white : COLORS.content}
                      />
                      <Text
                        style={[
                          styles.stageName,
                          selectedStage === stage.id && styles.stageNameSelected,
                        ]}
                      >
                        {stage.name}
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Quick Guide */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Capture Guide</Text>
              <View style={styles.guideContainer}>
                <View style={styles.guideItem}>
                  <View style={styles.guideIcon}>
                    <Ionicons name="sunny" size={24} color={COLORS.primary} />
                  </View>
                  <View style={styles.guideContent}>
                    <Text style={styles.guideTitle}>Good Lighting</Text>
                    <Text style={styles.guideText}>
                      Ensure adequate natural light. Avoid shadows on the crop.
                    </Text>
                  </View>
                </View>

                <View style={styles.guideItem}>
                  <View style={styles.guideIcon}>
                    <Ionicons name="scan" size={24} color={COLORS.primary} />
                  </View>
                  <View style={styles.guideContent}>
                    <Text style={styles.guideTitle}>Proper Distance</Text>
                    <Text style={styles.guideText}>
                      Maintain 1-2 meters distance. Entire crop should be in frame.
                    </Text>
                  </View>
                </View>

                <View style={styles.guideItem}>
                  <View style={styles.guideIcon}>
                    <Ionicons name="camera" size={24} color={COLORS.primary} />
                  </View>
                  <View style={styles.guideContent}>
                    <Text style={styles.guideTitle}>Steady Camera</Text>
                    <Text style={styles.guideText}>
                      Hold phone steady. Auto-capture when conditions are perfect.
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Recent Captures */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Recent Captures</Text>
                <TouchableOpacity onPress={() => navigateToHistory()}>
                  <Text style={styles.viewAllText}>View All</Text>
                </TouchableOpacity>
              </View>
              
              {recentCaptures.map(capture => (
                <TouchableOpacity
                  key={capture.id}
                  style={styles.recentCaptureCard}
                  onPress={() => handleRecentCapturePress(capture.id)}
                >
                  <View style={styles.captureInfo}>
                    <View style={styles.captureIcon}>
                      <Ionicons name="image" size={24} color={COLORS.primary} />
                    </View>
                    <View style={styles.captureDetails}>
                      <Text style={styles.captureCrop}>{capture.crop}</Text>
                      <Text style={styles.captureStage}>{capture.stage} Stage</Text>
                      <Text style={styles.captureDate}>{capture.date}</Text>
                    </View>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={COLORS.gray} />
                </TouchableOpacity>
              ))}
            </View>

            {/* Help Section */}
            <View style={styles.helpSection}>
              <Text style={styles.helpTitle}>Need Help?</Text>
              <TouchableOpacity
                style={styles.helpButton}
                onPress={() => router.push('/farmer/profile')}
              >
                <LinearGradient
                  colors={[COLORS.tertiary, COLORS.secondary]}
                  style={styles.helpButtonGradient}
                >
                  <Ionicons name="help-circle" size={20} color={COLORS.white} />
                  <Text style={styles.helpButtonText}>View Capture Guide</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </LinearGradient>
      </View>
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
    scrollView: {
      flex: 1,
      paddingHorizontal: 20,
    },
    header: {
      paddingTop: 60,
      paddingBottom: 20,
      alignItems: 'center',
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: COLORS.content,
      textAlign: 'center',
    },
    subtitle: {
      fontSize: 16,
      color: COLORS.gray,
      textAlign: 'center',
      marginTop: 8,
    },
    section: {
      backgroundColor: COLORS.white,
      borderRadius: 15,
      padding: 20,
      marginBottom: 20,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 5,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: COLORS.content,
      marginBottom: 8,
    },
    sectionDescription: {
      fontSize: 14,
      color: COLORS.gray,
      marginBottom: 20,
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 15,
    },
    stageGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      gap: 10,
    },
    stageCard: {
      width: '48%',
      borderRadius: 12,
      overflow: 'hidden',
      marginBottom: 10,
    },
    stageCardSelected: {
      elevation: 5,
      shadowColor: COLORS.primary,
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.3,
      shadowRadius: 6,
    },
    stageGradient: {
      padding: 20,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 12,
    },
    stageName: {
      fontSize: 16,
      fontWeight: '600',
      color: COLORS.content,
      marginTop: 10,
    },
    stageNameSelected: {
      color: COLORS.white,
      fontWeight: 'bold',
    },
    guideContainer: {
      gap: 15,
    },
    guideItem: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: COLORS.background,
      borderRadius: 10,
      padding: 15,
    },
    guideIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: 'rgba(56, 168, 86, 0.1)',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 15,
    },
    guideContent: {
      flex: 1,
    },
    guideTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: COLORS.content,
      marginBottom: 4,
    },
    guideText: {
      fontSize: 14,
      color: COLORS.gray,
      lineHeight: 20,
    },
    recentCaptureCard: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: COLORS.background,
      borderRadius: 10,
      padding: 15,
      marginBottom: 10,
    },
    captureInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    captureIcon: {
      marginRight: 15,
    },
    captureDetails: {
      flex: 1,
    },
    captureCrop: {
      fontSize: 16,
      fontWeight: '600',
      color: COLORS.content,
    },
    captureStage: {
      fontSize: 14,
      color: COLORS.primary,
      marginVertical: 2,
    },
    captureDate: {
      fontSize: 12,
      color: COLORS.gray,
    },
    viewAllText: {
      fontSize: 14,
      color: COLORS.primary,
      fontWeight: '600',
    },
    helpSection: {
      alignItems: 'center',
      paddingVertical: 30,
      paddingHorizontal: 20,
    },
    helpTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: COLORS.content,
      marginBottom: 15,
    },
    helpButton: {
      borderRadius: 12,
      overflow: 'hidden',
      width: '100%',
    },
    helpButtonGradient: {
      paddingVertical: 15,
      paddingHorizontal: 20,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    helpButtonText: {
      color: COLORS.white,
      fontSize: 16,
      fontWeight: '600',
      marginLeft: 10,
    },
  });