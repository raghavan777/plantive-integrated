import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Animated,
  Dimensions,
  Alert,
  Image,
} from 'react-native';
import { router } from 'expo-router';
import { COLORS } from '../../../constants/colors';

const { width } = Dimensions.get('window');

// Crop stage data with detailed information
const CROP_STAGES = [
  {
    id: 'sowing',
    name: 'Sowing',
    nameHindi: 'बुआई',
    icon: '🌱',
    description: 'Seed planting and germination stage',
    descriptionHindi: 'बीज रोपण और अंकुरण चरण',
    color: '#8B4513', // Brown
    gradient: ['#8B4513', '#A0522D'],
    keyFeatures: ['Seed distribution', 'Soil moisture', 'Seed depth', 'Spacing'],
    timing: 'Day 1-30',
    recommendedShots: 3,
    focusAreas: ['Seed rows', 'Soil condition', 'Irrigation'],
    exampleImage: 'sowing_example',
  },
  {
    id: 'vegetative',
    name: 'Vegetative',
    nameHindi: 'वनस्पति',
    icon: '🌿',
    description: 'Leaf, stem, and root development',
    descriptionHindi: 'पत्ती, तना और जड़ विकास',
    color: '#228B22', // Forest Green
    gradient: ['#228B22', '#32CD32'],
    keyFeatures: ['Leaf color', 'Plant height', 'Tiller count', 'Weed presence'],
    timing: 'Day 30-60',
    recommendedShots: 4,
    focusAreas: ['Leaf health', 'Plant density', 'Weed control'],
    exampleImage: 'vegetative_example',
  },
  {
    id: 'flowering',
    name: 'Flowering',
    nameHindi: 'फूल आना',
    icon: '🌸',
    description: 'Flower development and pollination',
    descriptionHindi: 'फूल विकास और परागण',
    color: '#FF69B4', // Hot Pink
    gradient: ['#FF69B4', '#FF1493'],
    keyFeatures: ['Flower density', 'Pollination', 'Flower health', 'Pest activity'],
    timing: 'Day 60-90',
    recommendedShots: 5,
    focusAreas: ['Flower clusters', 'Pollinators', 'Pest signs'],
    exampleImage: 'flowering_example',
  },
  {
    id: 'maturity',
    name: 'Maturity',
    nameHindi: 'परिपक्वता',
    icon: '🌾',
    description: 'Grain filling and ripening',
    descriptionHindi: 'दाना भरना और पकना',
    color: '#DAA520', // Goldenrod
    gradient: ['#DAA520', '#FFD700'],
    keyFeatures: ['Grain filling', 'Color change', 'Moisture content', 'Harvest readiness'],
    timing: 'Day 90-120',
    recommendedShots: 4,
    focusAreas: ['Grain development', 'Plant color', 'Field uniformity'],
    exampleImage: 'maturity_example',
  },
  {
    id: 'harvest',
    name: 'Harvest',
    nameHindi: 'कटाई',
    icon: '🚜',
    description: 'Harvesting and post-harvest',
    descriptionHindi: 'फसल कटाई और कटाई के बाद',
    color: '#A0522D', // Sienna
    gradient: ['#A0522D', '#CD853F'],
    keyFeatures: ['Yield quantity', 'Crop quality', 'Harvest losses', 'Storage condition'],
    timing: 'Day 120+',
    recommendedShots: 6,
    focusAreas: ['Harvested crop', 'Quality check', 'Storage facility'],
    exampleImage: 'harvest_example',
  },
];

// Recent stage selections (mock data)
const RECENT_SELECTIONS = [
  { stage: 'vegetative', date: 'Yesterday', count: 3 },
  { stage: 'flowering', date: 'Jan 10', count: 5 },
  { stage: 'sowing', date: 'Jan 5', count: 2 },
];

export default function CropStageSelectionScreen() {
  const [selectedStage, setSelectedStage] = useState<string | null>(null);
  const [language, setLanguage] = useState<'english' | 'hindi'>('english');
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.9));
  const [selectedStageAnim] = useState(new Animated.Value(0));
  const [pulseAnim] = useState(new Animated.Value(1));

  useEffect(() => {
    // Entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    // Pulse animation for selected stage
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.02,
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

  useEffect(() => {
    // Animation when stage is selected
    if (selectedStage) {
      Animated.spring(selectedStageAnim, {
        toValue: 1,
        tension: 100,
        friction: 10,
        useNativeDriver: true,
      }).start();
    }
  }, [selectedStage]);

  const handleStageSelect = (stageId: string) => {
    setSelectedStage(stageId);
  };

  const handleContinue = () => {
    if (!selectedStage) {
      Alert.alert(
        'Select Stage',
        'Please select your crop growth stage before continuing.',
        [{ text: 'OK' }]
      );
      return;
    }

    const selectedStageData = CROP_STAGES.find(stage => stage.id === selectedStage);
    
    Alert.alert(
      'Confirm Selection',
      `You selected: ${selectedStageData?.name} stage\n\nContinue to capture guidance?`,
      [
        { text: 'Change', style: 'cancel' },
        { 
          text: 'Continue', 
          onPress: () => {
            router.push({
              pathname: '/farmer/capture/guidance',
              params: { cropStage: selectedStage },
            });
          }
        },
      ]
    );
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'english' ? 'hindi' : 'english');
  };

  const getStageById = (id: string) => {
    return CROP_STAGES.find(stage => stage.id === id);
  };

  const renderStageCard = (stage: typeof CROP_STAGES[0]) => {
    const isSelected = selectedStage === stage.id;
    
    return (
      <Animated.View
        key={stage.id}
        style={[
          styles.stageCard,
          {
            transform: [
              { scale: isSelected ? pulseAnim : 1 },
            ],
            borderColor: isSelected ? stage.color : COLORS.lightGray,
            backgroundColor: isSelected ? stage.color + '10' : COLORS.white,
          },
        ]}
      >
        <TouchableOpacity
          style={styles.stageCardTouchable}
          onPress={() => handleStageSelect(stage.id)}
          activeOpacity={0.7}
        >
          {/* Stage Icon */}
          <View style={[styles.stageIconContainer, { backgroundColor: stage.color + '20' }]}>
            <Text style={styles.stageIcon}>{stage.icon}</Text>
          </View>

          {/* Stage Name */}
          <Text style={[styles.stageName, { color: stage.color }]}>
            {language === 'english' ? stage.name : stage.nameHindi}
          </Text>

          {/* Stage Description */}
          <Text style={styles.stageDescription} numberOfLines={2}>
            {language === 'english' ? stage.description : stage.descriptionHindi}
          </Text>

          {/* Key Features */}
          <View style={styles.featuresContainer}>
            {stage.keyFeatures.slice(0, 2).map((feature, index) => (
              <View key={index} style={styles.featureTag}>
                <Text style={styles.featureText}>{feature}</Text>
              </View>
            ))}
          </View>

          {/* Timing and Shots */}
          <View style={styles.metaContainer}>
            <View style={styles.metaItem}>
              <Text style={styles.metaIcon}>⏰</Text>
              <Text style={styles.metaText}>{stage.timing}</Text>
            </View>
            <View style={styles.metaItem}>
              <Text style={styles.metaIcon}>📸</Text>
              <Text style={styles.metaText}>{stage.recommendedShots} shots</Text>
            </View>
          </View>

          {/* Selection Indicator */}
          {isSelected && (
            <Animated.View 
              style={[
                styles.selectedIndicator,
                {
                  transform: [
                    { scale: selectedStageAnim },
                  ],
                }
              ]}
            >
              <Text style={styles.selectedIndicatorText}>✓ Selected</Text>
            </Animated.View>
          )}
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const renderSelectedStageDetails = () => {
    if (!selectedStage) return null;

    const stage = getStageById(selectedStage);
    if (!stage) return null;

    return (
      <Animated.View 
        style={[
          styles.detailsCard,
          {
            opacity: selectedStageAnim,
            transform: [
              { translateY: selectedStageAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [20, 0],
              })},
            ],
          },
        ]}
      >
        <View style={styles.detailsHeader}>
          <View style={styles.detailsTitleContainer}>
            <Text style={styles.detailsTitle}>{stage.name} Stage Details</Text>
            <Text style={styles.detailsSubtitle}>{stage.nameHindi}</Text>
          </View>
          <View style={[styles.stageBadge, { backgroundColor: stage.color }]}>
            <Text style={styles.stageBadgeText}>{stage.icon}</Text>
          </View>
        </View>

        {/* Key Information */}
        <View style={styles.detailsGrid}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Timing</Text>
            <Text style={styles.detailValue}>{stage.timing}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Recommended Photos</Text>
            <Text style={styles.detailValue}>{stage.recommendedShots}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Focus Areas</Text>
            <Text style={styles.detailValue}>{stage.focusAreas.length}</Text>
          </View>
        </View>

        {/* Focus Areas */}
        <Text style={styles.sectionLabel}>Focus on these areas:</Text>
        <View style={styles.focusList}>
          {stage.focusAreas.map((area, index) => (
            <View key={index} style={styles.focusItem}>
              <Text style={styles.focusBullet}>•</Text>
              <Text style={styles.focusText}>{area}</Text>
            </View>
          ))}
        </View>

        {/* Example Image Placeholder */}
        <View style={styles.exampleContainer}>
          <Text style={styles.exampleLabel}>Example:</Text>
          <View style={styles.exampleImagePlaceholder}>
            <Text style={styles.exampleIcon}>{stage.icon}</Text>
            <Text style={styles.exampleText}>
              {stage.name} stage photo example
            </Text>
          </View>
        </View>

        {/* Important Notes */}
        <View style={styles.notesContainer}>
          <Text style={styles.notesIcon}>💡</Text>
          <Text style={styles.notesText}>
            Capture clear images showing {stage.keyFeatures.join(', ').toLowerCase()}
          </Text>
        </View>
      </Animated.View>
    );
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
              transform: [
                { scale: scaleAnim },
              ],
            }
          ]}
        >
          <View style={styles.headerTop}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Text style={styles.backButtonText}>←</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={toggleLanguage} style={styles.languageButton}>
              <Text style={styles.languageButtonText}>
                {language === 'english' ? 'हिंदी' : 'English'}
              </Text>
            </TouchableOpacity>
          </View>
          
          <Text style={styles.headerTitle}>
            {language === 'english' ? 'Select Crop Stage' : 'फसल चरण चुनें'}
          </Text>
          <Text style={styles.headerSubtitle}>
            {language === 'english' 
              ? 'Choose the current growth stage of your crop' 
              : 'अपनी फसल का वर्तमान विकास चरण चुनें'
            }
          </Text>
        </Animated.View>

        {/* Recent Selections */}
        {RECENT_SELECTIONS.length > 0 && (
          <Animated.View 
            style={[
              styles.recentContainer,
              {
                opacity: fadeAnim,
                transform: [
                  { scale: scaleAnim },
                ],
              }
            ]}
          >
            <Text style={styles.recentTitle}>
              {language === 'english' ? 'Recently Selected' : 'हाल ही में चुने गए'}
            </Text>
            <View style={styles.recentList}>
              {RECENT_SELECTIONS.map((item, index) => {
                const stage = getStageById(item.stage);
                if (!stage) return null;
                
                return (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.recentItem,
                      { borderColor: stage.color + '40' },
                    ]}
                    onPress={() => handleStageSelect(item.stage)}
                  >
                    <View style={[styles.recentIcon, { backgroundColor: stage.color + '20' }]}>
                      <Text style={styles.recentIconText}>{stage.icon}</Text>
                    </View>
                    <View style={styles.recentContent}>
                      <Text style={[styles.recentStage, { color: stage.color }]}>
                        {language === 'english' ? stage.name : stage.nameHindi}
                      </Text>
                      <Text style={styles.recentInfo}>
                        {item.date} • {item.count} photos
                      </Text>
                    </View>
                    <Text style={styles.recentSelect}>Select →</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </Animated.View>
        )}

        {/* Main Stage Selection */}
        <Animated.View 
          style={[
            styles.mainContainer,
            {
              opacity: fadeAnim,
              transform: [
                { scale: scaleAnim },
              ],
            }
          ]}
        >
          <Text style={styles.sectionTitle}>
            {language === 'english' 
              ? 'Crop Growth Stages' 
              : 'फसल विकास चरण'
            }
          </Text>
          <Text style={styles.sectionSubtitle}>
            {language === 'english'
              ? 'Tap to select your current stage'
              : 'अपने वर्तमान चरण का चयन करने के लिए टैप करें'
            }
          </Text>

          <View style={styles.stagesGrid}>
            {CROP_STAGES.map(stage => renderStageCard(stage))}
          </View>
        </Animated.View>

        {/* Selected Stage Details */}
        {renderSelectedStageDetails()}

        {/* Help Card */}
        <Animated.View 
          style={[
            styles.helpCard,
            {
              opacity: fadeAnim,
              transform: [
                { scale: scaleAnim },
              ],
            }
          ]}
        >
          <View style={styles.helpHeader}>
            <Text style={styles.helpIcon}>❓</Text>
            <Text style={styles.helpTitle}>
              {language === 'english' 
                ? 'Not sure about the stage?' 
                : 'चरण के बारे में सुनिश्चित नहीं हैं?'
              }
            </Text>
          </View>
          
          <Text style={styles.helpText}>
            {language === 'english'
              ? 'Take a photo and our AI will help identify the stage. Look for signs like:'
              : 'एक फोटो लें और हमारी AI चरण की पहचान करने में मदद करेगी। संकेतों की तलाश करें जैसे:'
            }
          </Text>
          
          <View style={styles.signsList}>
            <View style={styles.signItem}>
              <Text style={styles.signIcon}>🌱</Text>
              <Text style={styles.signText}>
                {language === 'english' ? 'Small seedlings' : 'छोटे पौधे'}
              </Text>
            </View>
            <View style={styles.signItem}>
              <Text style={styles.signIcon}>🌸</Text>
              <Text style={styles.signText}>
                {language === 'english' ? 'Flowers present' : 'फूल मौजूद हैं'}
              </Text>
            </View>
            <View style={styles.signItem}>
              <Text style={styles.signIcon}>🌾</Text>
              <Text style={styles.signText}>
                {language === 'english' ? 'Grains forming' : 'दाने बन रहे हैं'}
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* Audio Guide */}
        <TouchableOpacity style={styles.audioCard}>
          <View style={styles.audioHeader}>
            <Text style={styles.audioIcon}>🔊</Text>
            <View>
              <Text style={styles.audioTitle}>
                {language === 'english' 
                  ? 'Listen to Stage Guide' 
                  : 'चरण गाइड सुनें'
                }
              </Text>
              <Text style={styles.audioSubtitle}>
                {language === 'english'
                  ? 'Audio explanation of each stage'
                  : 'प्रत्येक चरण की ऑडियो व्याख्या'
                }
              </Text>
            </View>
          </View>
          <View style={styles.audioButtons}>
            <TouchableOpacity style={styles.audioButton}>
              <Text style={styles.audioButtonText}>
                {language === 'english' ? 'Play English' : 'English में सुनें'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.audioButton, styles.hindiAudioButton]}>
              <Text style={styles.audioButtonText}>हिंदी में सुनें</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </ScrollView>

      {/* Continue Button */}
      <Animated.View 
        style={[
          styles.continueContainer,
          {
            opacity: fadeAnim,
            transform: [
              { scale: scaleAnim },
            ],
          }
        ]}
      >
        <View style={styles.continueContent}>
          {selectedStage ? (
            <View style={styles.selectedInfo}>
              <View style={[styles.selectedIcon, { 
                backgroundColor: getStageById(selectedStage)?.color + '20' 
              }]}>
                <Text style={styles.selectedIconText}>
                  {getStageById(selectedStage)?.icon}
                </Text>
              </View>
              <View>
                <Text style={styles.selectedStageText}>
                  {language === 'english'
                    ? getStageById(selectedStage)?.name
                    : getStageById(selectedStage)?.nameHindi
                  } Stage
                </Text>
                <Text style={styles.selectedStageSubtext}>
                  {getStageById(selectedStage)?.recommendedShots} photos recommended
                </Text>
              </View>
            </View>
          ) : (
            <Text style={styles.noSelectionText}>
              {language === 'english'
                ? 'Select a crop stage to continue'
                : 'जारी रखने के लिए फसल चरण चुनें'
              }
            </Text>
          )}

          <TouchableOpacity
            style={[
              styles.continueButton,
              !selectedStage && styles.continueButtonDisabled,
            ]}
            onPress={handleContinue}
            disabled={!selectedStage}
          >
            <Text style={styles.continueButtonText}>
              {language === 'english' ? 'Continue to Guidance' : 'मार्गदर्शन के लिए जारी रखें'}
            </Text>
            <Text style={styles.continueButtonSubtext}>
              {language === 'english' ? 'Smart photography tips' : 'स्मार्ट फोटोग्राफी टिप्स'}
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={styles.skipButton}
          onPress={() => router.push('/farmer/capture/guidance')}
        >
          <Text style={styles.skipButtonText}>
            {language === 'english' ? 'Skip stage selection →' : 'चरण चयन छोड़ें →'}
          </Text>
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
    paddingBottom: 180,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 20,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 24,
    color: COLORS.content,
    fontWeight: 'bold',
  },
  languageButton: {
    backgroundColor: COLORS.tertiary + '20',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: COLORS.tertiary,
  },
  languageButtonText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.content,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: COLORS.gray,
    lineHeight: 22,
  },
  recentContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  recentTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.content,
    marginBottom: 12,
  },
  recentList: {
    gap: 10,
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  recentIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  recentIconText: {
    fontSize: 20,
  },
  recentContent: {
    flex: 1,
  },
  recentStage: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 3,
  },
  recentInfo: {
    fontSize: 12,
    color: COLORS.gray,
  },
  recentSelect: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '600',
  },
  mainContainer: {
    paddingHorizontal: 20,
    paddingTop: 25,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.content,
    marginBottom: 5,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: COLORS.gray,
    marginBottom: 20,
  },
  stagesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 15,
  },
  stageCard: {
    width: (width - 55) / 2,
    backgroundColor: COLORS.white,
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    borderWidth: 2,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  stageCardTouchable: {
    alignItems: 'center',
  },
  stageIconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  stageIcon: {
    fontSize: 32,
  },
  stageName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  stageDescription: {
    fontSize: 12,
    color: COLORS.gray,
    textAlign: 'center',
    marginBottom: 15,
    lineHeight: 16,
    height: 32,
  },
  featuresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 5,
    marginBottom: 15,
  },
  featureTag: {
    backgroundColor: COLORS.tertiary + '10',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  featureText: {
    fontSize: 10,
    color: COLORS.content,
  },
  metaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 10,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaIcon: {
    fontSize: 12,
  },
  metaText: {
    fontSize: 10,
    color: COLORS.gray,
  },
  selectedIndicator: {
    backgroundColor: COLORS.success + '20',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    marginTop: 5,
  },
  selectedIndicatorText: {
    fontSize: 10,
    color: COLORS.success,
    fontWeight: 'bold',
  },
  detailsCard: {
    backgroundColor: COLORS.white,
    marginHorizontal: 20,
    marginTop: 20,
    padding: 20,
    borderRadius: 15,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  detailsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  detailsTitleContainer: {
    flex: 1,
  },
  detailsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.content,
    marginBottom: 3,
  },
  detailsSubtitle: {
    fontSize: 14,
    color: COLORS.gray,
  },
  stageBadge: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stageBadgeText: {
    fontSize: 24,
    color: COLORS.white,
  },
  detailsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  detailItem: {
    alignItems: 'center',
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: COLORS.gray,
    marginBottom: 5,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.content,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.content,
    marginBottom: 10,
  },
  focusList: {
    marginBottom: 20,
  },
  focusItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  focusBullet: {
    fontSize: 16,
    color: COLORS.primary,
    marginRight: 10,
    marginTop: 2,
  },
  focusText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.content,
    lineHeight: 20,
  },
  exampleContainer: {
    marginBottom: 20,
  },
  exampleLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.content,
    marginBottom: 10,
  },
  exampleImagePlaceholder: {
    height: 100,
    backgroundColor: COLORS.tertiary + '20',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.tertiary,
    borderStyle: 'dashed',
  },
  exampleIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  exampleText: {
    fontSize: 12,
    color: COLORS.gray,
    fontStyle: 'italic',
  },
  notesContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: COLORS.primary + '10',
    padding: 15,
    borderRadius: 10,
    gap: 12,
  },
  notesIcon: {
    fontSize: 20,
    marginTop: 2,
  },
  notesText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.content,
    lineHeight: 20,
  },
  helpCard: {
    backgroundColor: COLORS.white,
    marginHorizontal: 20,
    marginTop: 20,
    padding: 20,
    borderRadius: 15,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  helpHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  helpIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  helpTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.content,
    flex: 1,
  },
  helpText: {
    fontSize: 14,
    color: COLORS.gray,
    lineHeight: 20,
    marginBottom: 15,
  },
  signsList: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  signItem: {
    alignItems: 'center',
    flex: 1,
  },
  signIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  signText: {
    fontSize: 12,
    color: COLORS.content,
    textAlign: 'center',
    lineHeight: 16,
  },
  audioCard: {
    backgroundColor: COLORS.white,
    marginHorizontal: 20,
    marginTop: 20,
    padding: 20,
    borderRadius: 15,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  audioHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  audioIcon: {
    fontSize: 28,
    marginRight: 15,
  },
  audioTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.content,
    marginBottom: 3,
  },
  audioSubtitle: {
    fontSize: 14,
    color: COLORS.gray,
  },
  audioButtons: {
    flexDirection: 'row',
    gap: 15,
  },
  audioButton: {
    flex: 1,
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  hindiAudioButton: {
    backgroundColor: COLORS.secondary,
  },
  audioButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '600',
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
  continueContent: {
    gap: 15,
  },
  selectedInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.tertiary + '10',
    padding: 15,
    borderRadius: 12,
    gap: 15,
  },
  selectedIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedIconText: {
    fontSize: 24,
  },
  selectedStageText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.content,
    marginBottom: 3,
  },
  selectedStageSubtext: {
    fontSize: 12,
    color: COLORS.gray,
  },
  noSelectionText: {
    fontSize: 16,
    color: COLORS.gray,
    textAlign: 'center',
    paddingVertical: 10,
  },
  continueButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  continueButtonDisabled: {
    backgroundColor: COLORS.gray,
    opacity: 0.7,
  },
  continueButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  continueButtonSubtext: {
    color: COLORS.white,
    fontSize: 12,
    opacity: 0.9,
  },
  skipButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  skipButtonText: {
    color: COLORS.gray,
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});