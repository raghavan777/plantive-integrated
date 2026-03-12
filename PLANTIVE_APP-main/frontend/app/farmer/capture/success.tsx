// /home/ashith/Plantive/app/farmer/capture/success.tsx

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
  Share,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import * as Clipboard from 'expo-clipboard';

// Import colors from constants (adjust path as needed)
import { COLORS } from '../../../constants/colors';

// Colors from constants
// COLORS is already imported above

export default function SubmissionSuccessScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  // Get data from previous screens
  const imageUri = params.imageUri as string;
  const cropStage = params.cropStage as string;
  const cropType = params.cropType || 'Paddy'; // Default value
  const submissionId = generateSubmissionId();
  const timestamp = new Date().toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
  
  const [aiResult, setAiResult] = useState({
    cropDetected: 'Paddy',
    stageDetected: 'Flowering',
    stressLevel: 'Low',
    confidence: '85%',
  });

  // Generate a unique submission ID
  function generateSubmissionId() {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    return `PMFBY-${timestamp}-${random}`;
  }

  // Copy submission ID to clipboard
  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(submissionId);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert('Copied!', 'Submission ID copied to clipboard');
  };

  // Share submission details
  const shareSubmission = async () => {
    try {
      await Share.share({
        message: `PMFBY Crop Image Submission\n\nSubmission ID: ${submissionId}\nCrop: ${cropType}\nStage: ${cropStage}\nDate: ${timestamp}\n\nSubmitted via PMFBY-CROPIC App`,
        title: 'PMFBY Crop Submission',
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  // Navigate to status tracker
  const viewStatus = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push({
      pathname: '/farmer/status',
      params: { submissionId: submissionId }
    });
  };

  // Navigate to home
  const goToHome = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.replace('/farmer/home');
  };

  // Navigate to history
  const viewInHistory = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push({
      pathname: '/farmer/history',
      params: { submissionId: submissionId }
    });
  };

  // Auto-redirect after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/farmer/home');
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <ScrollView 
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <LinearGradient
        colors={[COLORS.background, COLORS.white]}
        style={styles.gradient}
      >
        {/* Success Icon */}
        <View style={styles.successIconContainer}>
          <LinearGradient
            colors={[COLORS.success, COLORS.primary]}
            style={styles.successIcon}
          >
            <Ionicons name="checkmark" size={48} color={COLORS.white} />
          </LinearGradient>
          <Text style={styles.successTitle}>Submission Successful!</Text>
          <Text style={styles.successMessage}>
            Your crop image has been submitted for analysis
          </Text>
        </View>

        {/* Submission Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Submission Details</Text>
            <TouchableOpacity onPress={shareSubmission}>
              <Ionicons name="share-outline" size={24} color={COLORS.primary} />
            </TouchableOpacity>
          </View>

          {/* Submission ID */}
          <View style={styles.fieldRow}>
            <View style={styles.fieldLabelContainer}>
              <Ionicons name="document-text" size={20} color={COLORS.gray} />
              <Text style={styles.fieldLabel}>Submission ID</Text>
            </View>
            <View style={styles.fieldValueContainer}>
              <Text style={styles.fieldValue}>{submissionId}</Text>
              <TouchableOpacity
                style={styles.copyButton}
                onPress={copyToClipboard}
              >
                <Ionicons name="copy" size={16} color={COLORS.primary} />
                <Text style={styles.copyText}>Copy</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Timestamp */}
          <View style={styles.fieldRow}>
            <View style={styles.fieldLabelContainer}>
              <Ionicons name="time" size={20} color={COLORS.gray} />
              <Text style={styles.fieldLabel}>Submitted On</Text>
            </View>
            <Text style={styles.fieldValue}>{timestamp}</Text>
          </View>

          {/* Crop Type */}
          <View style={styles.fieldRow}>
            <View style={styles.fieldLabelContainer}>
              <FontAwesome5 name="seedling" size={18} color={COLORS.gray} />
              <Text style={styles.fieldLabel}>Crop Type</Text>
            </View>
            <Text style={styles.fieldValue}>{cropType}</Text>
          </View>

          {/* Crop Stage */}
          <View style={styles.fieldRow}>
            <View style={styles.fieldLabelContainer}>
              <MaterialIcons name="grass" size={20} color={COLORS.gray} />
              <Text style={styles.fieldLabel}>Crop Stage</Text>
            </View>
            <Text style={styles.fieldValue}>{cropStage}</Text>
          </View>

          {/* Quick AI Analysis */}
          <View style={styles.aiAnalysisContainer}>
            <Text style={styles.aiAnalysisTitle}>Quick AI Analysis</Text>
            <View style={styles.aiResultGrid}>
              <View style={styles.aiResultItem}>
                <View style={styles.aiResultIcon}>
                  <Ionicons name="leaf" size={20} color={COLORS.success} />
                </View>
                <Text style={styles.aiResultLabel}>Crop Detected</Text>
                <Text style={styles.aiResultValue}>{aiResult.cropDetected}</Text>
              </View>

              <View style={styles.aiResultItem}>
                <View style={styles.aiResultIcon}>
                  <Ionicons name="analytics" size={20} color={COLORS.info} />
                </View>
                <Text style={styles.aiResultLabel}>Stage</Text>
                <Text style={styles.aiResultValue}>{aiResult.stageDetected}</Text>
              </View>

              <View style={styles.aiResultItem}>
                <View style={styles.aiResultIcon}>
                  <Ionicons 
                    name="warning" 
                    size={20} 
                    color={aiResult.stressLevel === 'Low' ? COLORS.success : COLORS.warning} 
                  />
                </View>
                <Text style={styles.aiResultLabel}>Stress Level</Text>
                <Text style={[
                  styles.aiResultValue,
                  aiResult.stressLevel === 'Low' ? styles.lowStress : styles.highStress
                ]}>
                  {aiResult.stressLevel}
                </Text>
              </View>

              <View style={styles.aiResultItem}>
                <View style={styles.aiResultIcon}>
                  <Ionicons name="shield-checkmark" size={20} color={COLORS.primary} />
                </View>
                <Text style={styles.aiResultLabel}>Confidence</Text>
                <Text style={styles.aiResultValue}>{aiResult.confidence}</Text>
              </View>
            </View>
          </View>

          {/* Image Preview */}
          {imageUri && (
            <View style={styles.imageContainer}>
              <Text style={styles.imageTitle}>Submitted Image</Text>
              <Image
                source={{ uri: imageUri }}
                style={styles.imagePreview}
                resizeMode="cover"
              />
              <Text style={styles.imageNote}>
                This image will be analyzed for crop health assessment
              </Text>
            </View>
          )}

          {/* Next Steps */}
          <View style={styles.nextStepsContainer}>
            <Text style={styles.nextStepsTitle}>What Happens Next?</Text>
            
            <View style={styles.timeline}>
              <View style={styles.timelineItem}>
                <View style={styles.timelineDot}>
                  <Ionicons name="cloud-upload" size={16} color={COLORS.white} />
                </View>
                <View style={styles.timelineContent}>
                  <Text style={styles.timelineTitle}>Image Processing</Text>
                  <Text style={styles.timelineDescription}>
                    AI analyzes crop health, disease detection, and growth stage
                  </Text>
                </View>
              </View>

              <View style={styles.timelineConnector} />

              <View style={styles.timelineItem}>
                <View style={[styles.timelineDot, styles.timelineDotPending]}>
                  <Ionicons name="document-text" size={16} color={COLORS.white} />
                </View>
                <View style={styles.timelineContent}>
                  <Text style={styles.timelineTitle}>Official Verification</Text>
                  <Text style={styles.timelineDescription}>
                    Field officer may visit for physical verification if needed
                  </Text>
                </View>
              </View>

              <View style={styles.timelineConnector} />

              <View style={styles.timelineItem}>
                <View style={[styles.timelineDot, styles.timelineDotPending]}>
                  <Ionicons name="checkmark-done" size={16} color={COLORS.white} />
                </View>
                <View style={styles.timelineContent}>
                  <Text style={styles.timelineTitle}>Claim Processing</Text>
                  <Text style={styles.timelineDescription}>
                    Final assessment and claim processing by insurance company
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity
            style={[styles.actionButton, styles.primaryButton]}
            onPress={viewStatus}
          >
            <LinearGradient
              colors={[COLORS.primary, COLORS.secondary]}
              style={styles.actionButtonGradient}
            >
              <Ionicons name="time" size={20} color={COLORS.white} />
              <Text style={styles.primaryButtonText}>Track Status</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.secondaryButton]}
            onPress={viewInHistory}
          >
            <View style={styles.secondaryButtonContent}>
              <Ionicons name="list" size={20} color={COLORS.primary} />
              <Text style={styles.secondaryButtonText}>View in History</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.tertiaryButton]}
            onPress={goToHome}
          >
            <View style={styles.tertiaryButtonContent}>
              <Ionicons name="home" size={20} color={COLORS.gray} />
              <Text style={styles.tertiaryButtonText}>Return to Home</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Auto Redirect Notice */}
        <View style={styles.autoRedirectContainer}>
          <Ionicons name="information-circle" size={16} color={COLORS.gray} />
          <Text style={styles.autoRedirectText}>
            Redirecting to home screen in 5 seconds...
          </Text>
        </View>
      </LinearGradient>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  gradient: {
    flex: 1,
    paddingBottom: 40,
  },
  successIconContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  successIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    elevation: 5,
    shadowColor: COLORS.success,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  successTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.content,
    textAlign: 'center',
    marginBottom: 10,
  },
  successMessage: {
    fontSize: 16,
    color: COLORS.gray,
    textAlign: 'center',
    lineHeight: 24,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 25,
    marginHorizontal: 20,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.content,
  },
  fieldRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  fieldLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  fieldLabel: {
    fontSize: 15,
    color: COLORS.gray,
    marginLeft: 10,
  },
  fieldValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-end',
  },
  fieldValue: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.content,
    textAlign: 'right',
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(56, 168, 86, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginLeft: 10,
  },
  copyText: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '600',
    marginLeft: 4,
  },
  aiAnalysisContainer: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
  },
  aiAnalysisTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.content,
    marginBottom: 15,
  },
  aiResultGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  aiResultItem: {
    width: '48%',
    backgroundColor: COLORS.background,
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    alignItems: 'center',
  },
  aiResultIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(56, 168, 86, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  aiResultLabel: {
    fontSize: 12,
    color: COLORS.gray,
    marginBottom: 4,
  },
  aiResultValue: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.content,
  },
  lowStress: {
    color: COLORS.success,
  },
  highStress: {
    color: COLORS.warning,
  },
  imageContainer: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
  },
  imageTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.content,
    marginBottom: 15,
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    backgroundColor: COLORS.lightGray,
  },
  imageNote: {
    fontSize: 12,
    color: COLORS.gray,
    fontStyle: 'italic',
    marginTop: 8,
    textAlign: 'center',
  },
  nextStepsContainer: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
  },
  nextStepsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.content,
    marginBottom: 20,
  },
  timeline: {
    marginLeft: 10,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  timelineDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    zIndex: 1,
  },
  timelineDotPending: {
    backgroundColor: COLORS.gray,
  },
  timelineContent: {
    flex: 1,
    paddingTop: 4,
  },
  timelineTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.content,
    marginBottom: 4,
  },
  timelineDescription: {
    fontSize: 14,
    color: COLORS.gray,
    lineHeight: 20,
  },
  timelineConnector: {
    position: 'absolute',
    top: 32,
    left: 16,
    width: 2,
    height: '100%',
    backgroundColor: COLORS.lightGray,
    zIndex: 0,
  },
  actionButtonsContainer: {
    paddingHorizontal: 20,
    gap: 12,
  },
  actionButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  primaryButton: {
    elevation: 3,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  actionButtonGradient: {
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  secondaryButton: {
    backgroundColor: COLORS.white,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  secondaryButtonContent: {
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  tertiaryButton: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
  },
  tertiaryButtonContent: {
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tertiaryButtonText: {
    color: COLORS.gray,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
  autoRedirectContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    paddingHorizontal: 20,
  },
  autoRedirectText: {
    fontSize: 14,
    color: COLORS.gray,
    marginLeft: 8,
    fontStyle: 'italic',
  },
});