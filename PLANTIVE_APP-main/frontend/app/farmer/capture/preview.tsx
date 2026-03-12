import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Alert,
  Animated,
  Dimensions,
  Share,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { COLORS } from '../../../constants/colors';
import * as Location from 'expo-location';
import * as FileSystem from 'expo-file-system';

const { width } = Dimensions.get('window');

// Mock AI Analysis Data
const AI_ANALYSIS = {
  cropType: 'Paddy (Rice)',
  cropStage: 'Flowering',
  healthStatus: 'Healthy',
  confidence: 92,
  detectedIssues: [
    { type: 'Pest', severity: 'Low', confidence: 78 },
    { type: 'Nutrient Deficiency', severity: 'None', confidence: 95 },
    { type: 'Water Stress', severity: 'None', confidence: 96 },
  ],
  recommendations: [
    'Continue current irrigation schedule',
    'Monitor for pest activity',
    'Next fertilizer application in 2 weeks',
  ],
};

export default function CapturePreviewScreen() {
  const { imageUri, cropStage, latitude, longitude } = useLocalSearchParams();
  const [analysis, setAnalysis] = useState(AI_ANALYSIS);
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [locationDetails, setLocationDetails] = useState<any>(null);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(30));
  const [pulseAnim] = useState(new Animated.Value(1));
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Start animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    // Simulate AI analysis
    simulateAIAnalysis();
    
    // Get location details
    getLocationDetails();
    
    // Pulse animation for submit button
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
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
  }, []);

  const simulateAIAnalysis = () => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 20;
      if (progress >= 100) {
        progress = 100;
        setIsAnalyzing(false);
        clearInterval(interval);
      }
      setAnalysisProgress(Math.min(progress, 100));
    }, 300);
  };

  const getLocationDetails = async () => {
    try {
      if (latitude && longitude) {
        const location = await Location.reverseGeocodeAsync({
          latitude: parseFloat(latitude as string),
          longitude: parseFloat(longitude as string),
        });
        
        if (location.length > 0) {
          setLocationDetails(location[0]);
        }
      }
    } catch (error) {
      console.error('Error getting location details:', error);
    }
  };

  const handleRetake = () => {
    Alert.alert(
      'Retake Photo',
      'Are you sure you want to retake this photo?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Retake', style: 'destructive', onPress: () => router.back() },
      ]
    );
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      
      // Simulate API submission
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate submission ID
      const submissionId = 'SUB' + Date.now().toString().slice(-8);
      
      // Navigate to success screen
      router.replace({
        pathname: '/farmer/capture/success',
        params: {
          submissionId,
          cropStage: analysis.cropStage,
          imageUri: imageUri as string,
        },
      });
      
    } catch (error) {
      Alert.alert('Submission Failed', 'Please try again');
      setIsSubmitting(false);
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Crop Analysis: ${analysis.cropType} - ${analysis.cropStage} stage\nHealth: ${analysis.healthStatus}\nConfidence: ${analysis.confidence}%`,
        title: 'Crop Analysis Results',
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const getHealthColor = () => {
    switch (analysis.healthStatus.toLowerCase()) {
      case 'healthy': return COLORS.success;
      case 'moderate': return COLORS.warning;
      case 'poor': return COLORS.error;
      default: return COLORS.gray;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'none': return COLORS.success;
      case 'low': return COLORS.warning;
      case 'medium': return COLORS.warning;
      case 'high': return COLORS.error;
      default: return COLORS.gray;
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return COLORS.success;
    if (confidence >= 70) return COLORS.warning;
    return COLORS.error;
  };

  const renderAnalysisProgress = () => {
    if (isAnalyzing) {
      return (
        <View style={styles.analysisProgressCard}>
          <Text style={styles.analysisTitle}>AI Analysis in Progress</Text>
          <View style={styles.progressContainer}>
            <View style={styles.progressBackground}>
              <Animated.View
                style={[
                  styles.progressFill,
                  {
                    width: `${analysisProgress}%`,
                  },
                ]}
              />
            </View>
            <Text style={styles.progressText}>{Math.round(analysisProgress)}%</Text>
          </View>
          <Text style={styles.analysisSubtext}>
            Analyzing crop health, disease detection, and growth stage...
          </Text>
        </View>
      );
    }

    return null;
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Animated.View 
          style={[
            styles.header,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }
          ]}
        >
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Preview & Analysis</Text>
          <TouchableOpacity onPress={handleShare} style={styles.shareButton}>
            <Text style={styles.shareButtonText}>↗</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Captured Image Preview */}
        <Animated.View 
          style={[
            styles.imageCard,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }
          ]}
        >
          <Text style={styles.cardTitle}>Captured Image</Text>
          {imageUri ? (
            <Image 
              source={{ uri: imageUri as string }} 
              style={styles.capturedImage}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Text style={styles.placeholderText}>No Image Available</Text>
            </View>
          )}
          
          <View style={styles.imageInfo}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Crop Stage:</Text>
              <Text style={styles.infoValue}>{cropStage || 'Not specified'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Capture Time:</Text>
              <Text style={styles.infoValue}>
                {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Date:</Text>
              <Text style={styles.infoValue}>
                {new Date().toLocaleDateString()}
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* Location Details */}
        <Animated.View 
          style={[
            styles.locationCard,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }
          ]}
        >
          <View style={styles.locationHeader}>
            <Text style={styles.locationIcon}>📍</Text>
            <Text style={styles.cardTitle}>Location Details</Text>
          </View>
          
          {locationDetails ? (
            <View style={styles.locationDetails}>
              <View style={styles.locationRow}>
                <Text style={styles.locationLabel}>Address:</Text>
                <Text style={styles.locationValue} numberOfLines={2}>
                  {locationDetails.street}, {locationDetails.city}
                </Text>
              </View>
              <View style={styles.locationRow}>
                <Text style={styles.locationLabel}>District:</Text>
                <Text style={styles.locationValue}>{locationDetails.district}</Text>
              </View>
              <View style={styles.locationRow}>
                <Text style={styles.locationLabel}>State:</Text>
                <Text style={styles.locationValue}>{locationDetails.region}</Text>
              </View>
              <View style={styles.locationRow}>
                <Text style={styles.locationLabel}>Coordinates:</Text>
                <Text style={styles.locationValue}>
                  {latitude}, {longitude}
                </Text>
              </View>
            </View>
          ) : (
            <Text style={styles.locationLoading}>Fetching location details...</Text>
          )}
          
          <View style={styles.gpsBadge}>
            <Text style={styles.gpsBadgeText}>GPS Verified ✓</Text>
          </View>
        </Animated.View>

        {/* AI Analysis Progress/Results */}
        {renderAnalysisProgress()}

        {!isAnalyzing && (
          <Animated.View 
            style={[
              styles.resultsContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              }
            ]}
          >
            {/* Overall Health Summary */}
            <View style={styles.healthSummaryCard}>
              <Text style={styles.cardTitle}>AI Analysis Results</Text>
              
              <View style={styles.healthGrid}>
                <View style={styles.healthItem}>
                  <Text style={styles.healthIcon}>🌾</Text>
                  <Text style={styles.healthLabel}>Crop Type</Text>
                  <Text style={styles.healthValue}>{analysis.cropType}</Text>
                </View>
                
                <View style={styles.healthItem}>
                  <Text style={styles.healthIcon}>📈</Text>
                  <Text style={styles.healthLabel}>Growth Stage</Text>
                  <Text style={styles.healthValue}>{analysis.cropStage}</Text>
                </View>
                
                <View style={styles.healthItem}>
                  <Text style={[styles.healthIcon, { color: getHealthColor() }]}>❤️</Text>
                  <Text style={styles.healthLabel}>Health Status</Text>
                  <Text style={[styles.healthValue, { color: getHealthColor() }]}>
                    {analysis.healthStatus}
                  </Text>
                </View>
                
                <View style={styles.healthItem}>
                  <Text style={styles.healthIcon}>🎯</Text>
                  <Text style={styles.healthLabel}>AI Confidence</Text>
                  <Text style={[
                    styles.healthValue,
                    { color: getConfidenceColor(analysis.confidence) }
                  ]}>
                    {analysis.confidence}%
                  </Text>
                </View>
              </View>
            </View>

            {/* Detected Issues */}
            <View style={styles.issuesCard}>
              <Text style={styles.cardTitle}>Detected Issues</Text>
              
              {analysis.detectedIssues.map((issue, index) => (
                <View key={index} style={styles.issueItem}>
                  <View style={styles.issueHeader}>
                    <Text style={styles.issueType}>{issue.type}</Text>
                    <View style={[
                      styles.severityBadge,
                      { backgroundColor: getSeverityColor(issue.severity) + '20' }
                    ]}>
                      <Text style={[
                        styles.severityText,
                        { color: getSeverityColor(issue.severity) }
                      ]}>
                        {issue.severity}
                      </Text>
                    </View>
                  </View>
                  
                  <View style={styles.confidenceBar}>
                    <View 
                      style={[
                        styles.confidenceFill,
                        { 
                          width: `${issue.confidence}%`,
                          backgroundColor: getConfidenceColor(issue.confidence),
                        }
                      ]} 
                    />
                    <Text style={styles.confidenceText}>
                      Confidence: {issue.confidence}%
                    </Text>
                  </View>
                </View>
              ))}
              
              {analysis.detectedIssues.every(issue => issue.severity === 'None') && (
                <View style={styles.noIssues}>
                  <Text style={styles.noIssuesIcon}>✅</Text>
                  <Text style={styles.noIssuesText}>No major issues detected</Text>
                </View>
              )}
            </View>

            {/* Recommendations */}
            <View style={styles.recommendationsCard}>
              <Text style={styles.cardTitle}>AI Recommendations</Text>
              
              <View style={styles.recommendationsList}>
                {analysis.recommendations.map((rec, index) => (
                  <View key={index} style={styles.recommendationItem}>
                    <Text style={styles.recommendationNumber}>{index + 1}</Text>
                    <Text style={styles.recommendationText}>{rec}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Image Quality Assessment */}
            <View style={styles.qualityCard}>
              <Text style={styles.cardTitle}>Image Quality Assessment</Text>
              
              <View style={styles.qualityMetrics}>
                <View style={styles.metricItem}>
                  <Text style={styles.metricIcon}>📸</Text>
                  <View>
                    <Text style={styles.metricLabel}>Focus Quality</Text>
                    <Text style={[styles.metricValue, styles.metricGood]}>Excellent</Text>
                  </View>
                </View>
                
                <View style={styles.metricItem}>
                  <Text style={styles.metricIcon}>☀️</Text>
                  <View>
                    <Text style={styles.metricLabel}>Lighting</Text>
                    <Text style={[styles.metricValue, styles.metricGood]}>Optimal</Text>
                  </View>
                </View>
                
                <View style={styles.metricItem}>
                  <Text style={styles.metricIcon}>🎯</Text>
                  <View>
                    <Text style={styles.metricLabel}>Composition</Text>
                    <Text style={[styles.metricValue, styles.metricGood]}>Good</Text>
                  </View>
                </View>
              </View>
              
              <View style={styles.qualityBadge}>
                <Text style={styles.qualityBadgeText}>✅ Image Quality: Excellent</Text>
              </View>
            </View>

            {/* Next Steps */}
            <View style={styles.nextStepsCard}>
              <Text style={styles.cardTitle}>Next Steps</Text>
              
              <View style={styles.stepsList}>
                <View style={styles.stepItem}>
                  <Text style={styles.stepIcon}>1</Text>
                  <Text style={styles.stepText}>
                    Submit for official verification and claim processing
                  </Text>
                </View>
                
                <View style={styles.stepItem}>
                  <Text style={styles.stepIcon}>2</Text>
                  <Text style={styles.stepText}>
                    Field officer may visit for physical verification
                  </Text>
                </View>
                
                <View style={styles.stepItem}>
                  <Text style={styles.stepIcon}>3</Text>
                  <Text style={styles.stepText}>
                    Track claim status in the Status section
                  </Text>
                </View>
              </View>
            </View>
          </Animated.View>
        )}

        {/* Action Buttons */}
        <Animated.View 
          style={[
            styles.actionContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }
          ]}
        >
          <View style={styles.buttonRow}>
            <TouchableOpacity 
              style={[styles.actionButton, styles.secondaryButton]}
              onPress={handleRetake}
              disabled={isAnalyzing || isSubmitting}
            >
              <Text style={styles.secondaryButtonText}>Retake Photo</Text>
            </TouchableOpacity>
            
            <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
              <TouchableOpacity 
                style={[
                  styles.actionButton, 
                  styles.primaryButton,
                  (isAnalyzing || isSubmitting) && styles.buttonDisabled,
                ]}
                onPress={handleSubmit}
                disabled={isAnalyzing || isSubmitting}
              >
                {isSubmitting ? (
                  <Text style={styles.primaryButtonText}>Submitting...</Text>
                ) : (
                  <Text style={styles.primaryButtonText}>
                    {isAnalyzing ? 'Please Wait...' : 'Submit for Verification'}
                  </Text>
                )}
              </TouchableOpacity>
            </Animated.View>
          </View>
          
          {isAnalyzing && (
            <Text style={styles.analysisNote}>
              ⏳ AI analysis must complete before submission
            </Text>
          )}
        </Animated.View>

        {/* Submission Details */}
        <Animated.View 
          style={[
            styles.submissionInfo,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }
          ]}
        >
          <Text style={styles.infoIcon}>ℹ️</Text>
          <Text style={styles.infoText}>
            Submitting creates a verifiable record for insurance claims.
            You can track progress in the Status section.
          </Text>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingBottom: 30,
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
  shareButton: {
    padding: 8,
    backgroundColor: COLORS.tertiary + '20',
    borderRadius: 8,
  },
  shareButtonText: {
    fontSize: 18,
    color: COLORS.content,
    fontWeight: 'bold',
  },
  imageCard: {
    backgroundColor: COLORS.white,
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.content,
    padding: 20,
    paddingBottom: 10,
  },
  capturedImage: {
    width: '100%',
    height: 250,
    backgroundColor: COLORS.lightGray,
  },
  imagePlaceholder: {
    width: '100%',
    height: 250,
    backgroundColor: COLORS.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: COLORS.gray,
    fontSize: 16,
  },
  imageInfo: {
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: COLORS.gray,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.content,
  },
  locationCard: {
    backgroundColor: COLORS.white,
    marginHorizontal: 20,
    marginTop: 15,
    borderRadius: 15,
    padding: 20,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  locationIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  locationDetails: {
    gap: 10,
    marginBottom: 15,
  },
  locationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  locationLabel: {
    fontSize: 14,
    color: COLORS.gray,
    flex: 1,
  },
  locationValue: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.content,
    flex: 2,
    textAlign: 'right',
  },
  locationLoading: {
    fontSize: 14,
    color: COLORS.gray,
    fontStyle: 'italic',
    textAlign: 'center',
    padding: 20,
  },
  gpsBadge: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.success + '20',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginTop: 5,
  },
  gpsBadgeText: {
    fontSize: 12,
    color: COLORS.success,
    fontWeight: '600',
  },
  analysisProgressCard: {
    backgroundColor: COLORS.white,
    marginHorizontal: 20,
    marginTop: 15,
    borderRadius: 15,
    padding: 20,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: 'center',
  },
  analysisTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.content,
    marginBottom: 15,
  },
  progressContainer: {
    width: '100%',
    marginBottom: 15,
  },
  progressBackground: {
    height: 8,
    backgroundColor: COLORS.lightGray,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 4,
  },
  progressText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
    textAlign: 'center',
    marginTop: 5,
  },
  analysisSubtext: {
    fontSize: 14,
    color: COLORS.gray,
    textAlign: 'center',
  },
  resultsContainer: {
    gap: 15,
    marginTop: 15,
    paddingHorizontal: 20,
  },
  healthSummaryCard: {
    backgroundColor: COLORS.white,
    borderRadius: 15,
    padding: 20,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  healthGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 15,
    marginTop: 10,
  },
  healthItem: {
    width: '48%',
    alignItems: 'center',
    padding: 15,
    backgroundColor: COLORS.tertiary + '10',
    borderRadius: 10,
  },
  healthIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  healthLabel: {
    fontSize: 12,
    color: COLORS.gray,
    marginBottom: 4,
  },
  healthValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.content,
  },
  issuesCard: {
    backgroundColor: COLORS.white,
    borderRadius: 15,
    padding: 20,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  issueItem: {
    backgroundColor: COLORS.background,
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  issueHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  issueType: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.content,
  },
  severityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  severityText: {
    fontSize: 12,
    fontWeight: '600',
  },
  confidenceBar: {
    height: 6,
    backgroundColor: COLORS.lightGray,
    borderRadius: 3,
    overflow: 'hidden',
    marginTop: 5,
  },
  confidenceFill: {
    height: '100%',
    borderRadius: 3,
  },
  confidenceText: {
    fontSize: 12,
    color: COLORS.gray,
    marginTop: 5,
  },
  noIssues: {
    alignItems: 'center',
    padding: 20,
  },
  noIssuesIcon: {
    fontSize: 40,
    marginBottom: 10,
  },
  noIssuesText: {
    fontSize: 16,
    color: COLORS.success,
    fontWeight: '600',
  },
  recommendationsCard: {
    backgroundColor: COLORS.white,
    borderRadius: 15,
    padding: 20,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  recommendationsList: {
    gap: 12,
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  recommendationNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    color: COLORS.white,
    textAlign: 'center',
    lineHeight: 24,
    fontWeight: 'bold',
  },
  recommendationText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.content,
    lineHeight: 20,
  },
  qualityCard: {
    backgroundColor: COLORS.white,
    borderRadius: 15,
    padding: 20,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  qualityMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  metricItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  metricIcon: {
    fontSize: 20,
  },
  metricLabel: {
    fontSize: 12,
    color: COLORS.gray,
  },
  metricValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  metricGood: {
    color: COLORS.success,
  },
  qualityBadge: {
    backgroundColor: COLORS.success + '20',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  qualityBadgeText: {
    color: COLORS.success,
    fontWeight: '600',
  },
  nextStepsCard: {
    backgroundColor: COLORS.white,
    borderRadius: 15,
    padding: 20,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  stepsList: {
    gap: 15,
    marginTop: 10,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  stepIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    color: COLORS.white,
    textAlign: 'center',
    lineHeight: 28,
    fontWeight: 'bold',
    fontSize: 14,
  },
  stepText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.content,
    lineHeight: 20,
  },
  actionContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 15,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 15,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
  },
  secondaryButton: {
    backgroundColor: COLORS.white,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  buttonDisabled: {
    backgroundColor: COLORS.gray,
    opacity: 0.7,
  },
  primaryButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButtonText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  analysisNote: {
    fontSize: 12,
    color: COLORS.gray,
    textAlign: 'center',
    marginTop: 10,
    fontStyle: 'italic',
  },
  submissionInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: COLORS.tertiary + '20',
    marginHorizontal: 20,
    padding: 15,
    borderRadius: 10,
    gap: 12,
  },
  infoIcon: {
    fontSize: 18,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: COLORS.gray,
    lineHeight: 18,
  },
});