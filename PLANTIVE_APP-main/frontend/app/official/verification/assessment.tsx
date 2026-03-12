import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// Types
type DamageType = 
  | 'flood'
  | 'pest'
  | 'disease'
  | 'drought'
  | 'hailstorm'
  | 'lodging'
  | 'fire'
  | 'other';

const damageTypes: Array<{value: DamageType, label: string}> = [
  { value: 'flood', label: 'Flood Damage' },
  { value: 'pest', label: 'Pest Attack' },
  { value: 'disease', label: 'Crop Disease' },
  { value: 'drought', label: 'Drought' },
  { value: 'hailstorm', label: 'Hailstorm' },
  { value: 'lodging', label: 'Lodging' },
  { value: 'fire', label: 'Fire Damage' },
  { value: 'other', label: 'Other' },
];

export default function AssessmentScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  // Get data from previous screens
  const farmerName = params.farmerName as string || 'Rajesh Kumar';
  const cropType = params.cropType as string || 'Paddy';
  const cropStage = params.cropStage as string || 'Flowering';
  const location = params.location as string || 'Village: Shantinagar';
  
  // Form state
  const [cropStageForm, setCropStageForm] = useState(cropStage);
  const [damagePercentage, setDamagePercentage] = useState(0);
  const [damageType, setDamageType] = useState<DamageType | null>(null);
  const [notes, setNotes] = useState('');
  
  // Crop stage options
  const cropStages = ['Sowing', 'Vegetative', 'Flowering', 'Maturity', 'Harvest'];

  const handleSubmit = () => {
    if (damagePercentage > 0 && !damageType) {
      Alert.alert('Select Damage Type', 'Please select the type of damage before submitting.');
      return;
    }

    if (damagePercentage > 0 && notes.trim() === '') {
      Alert.alert('Add Notes', 'Please add notes explaining the damage.');
      return;
    }

    // Navigate to review screen with assessment data
    router.push({
      pathname: '/official/verification/review' as any,
      params: {
        farmerName,
        cropType,
        cropStage: cropStageForm,
        damagePercentage: damagePercentage.toString(),
        damageType: damageType || '',
        notes,
        location,
        timestamp: new Date().toISOString(),
      }
    });
  };

  const renderSlider = () => {
    const handleSliderChange = (value: number) => {
      setDamagePercentage(Math.round(value));
    };

    return (
      <View style={styles.sliderContainer}>
        <View style={styles.sliderTrack}>
          <View 
            style={[
              styles.sliderFill,
              { 
                width: `${damagePercentage}%`,
                backgroundColor: getDamageColor(damagePercentage)
              }
            ]} 
          />
        </View>
        <View style={styles.sliderHandleContainer}>
          <TouchableOpacity
            style={[
              styles.sliderHandle,
              { left: `${damagePercentage}%`, marginLeft: -12 }
            ]}
            onPressIn={() => {/* Start sliding */}}
          >
            <View style={[styles.handleCircle, { backgroundColor: getDamageColor(damagePercentage) }]} />
          </TouchableOpacity>
        </View>
        <View style={styles.sliderMarks}>
          {[0, 25, 50, 75, 100].map((mark) => (
            <TouchableOpacity
              key={mark}
              style={styles.sliderMark}
              onPress={() => setDamagePercentage(mark)}
            >
              <Text style={styles.sliderMarkText}>{mark}%</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#062905" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Damage Assessment</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Farm Info Card */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Farm Details</Text>
          <View style={styles.infoRow}>
            <Ionicons name="person-outline" size={16} color="#76a06a" />
            <Text style={styles.infoText}>Farmer: {farmerName}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="leaf-outline" size={16} color="#76a06a" />
            <Text style={styles.infoText}>Crop: {cropType}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="location-outline" size={16} color="#76a06a" />
            <Text style={styles.infoText}>{location}</Text>
          </View>
        </View>

        {/* Assessment Form */}
        <View style={styles.formContainer}>
          {/* Crop Stage Selection */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Crop Stage *</Text>
            <View style={styles.stageContainer}>
              {cropStages.map((stage) => (
                <TouchableOpacity
                  key={stage}
                  style={[
                    styles.stageButton,
                    cropStageForm === stage && styles.stageButtonActive,
                  ]}
                  onPress={() => setCropStageForm(stage)}
                >
                  <Text
                    style={[
                      styles.stageButtonText,
                      cropStageForm === stage && styles.stageButtonTextActive,
                    ]}
                  >
                    {stage}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Damage Percentage */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Damage Percentage: {damagePercentage}%
            </Text>
            {renderSlider()}
            <View style={styles.damageIndicator}>
              <View style={styles.indicatorRow}>
                <View style={[styles.indicatorDot, { backgroundColor: '#4CAF50' }]} />
                <Text style={styles.indicatorText}>Minor (0-25%)</Text>
              </View>
              <View style={styles.indicatorRow}>
                <View style={[styles.indicatorDot, { backgroundColor: '#FF9800' }]} />
                <Text style={styles.indicatorText}>Moderate (26-50%)</Text>
              </View>
              <View style={styles.indicatorRow}>
                <View style={[styles.indicatorDot, { backgroundColor: '#F44336' }]} />
                <Text style={styles.indicatorText}>Severe (51-100%)</Text>
              </View>
            </View>
          </View>

          {/* Damage Type Selection */}
          {damagePercentage > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Type of Damage *</Text>
              <View style={styles.damageTypeGrid}>
                {damageTypes.map((type) => (
                  <TouchableOpacity
                    key={type.value}
                    style={[
                      styles.damageTypeButton,
                      damageType === type.value && styles.damageTypeButtonActive,
                    ]}
                    onPress={() => setDamageType(type.value)}
                  >
                    <Ionicons
                      name={getDamageIcon(type.value)}
                      size={20}
                      color={damageType === type.value ? '#FFFFFF' : '#76a06a'}
                    />
                    <Text
                      style={[
                        styles.damageTypeText,
                        damageType === type.value && styles.damageTypeTextActive,
                      ]}
                    >
                      {type.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Quick Checklist */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quick Checklist</Text>
            {[
              { id: 1, label: 'Crop appears healthy', value: damagePercentage === 0 },
              { id: 2, label: 'Signs of water stress', value: damageType === 'drought' },
              { id: 3, label: 'Pest infestation visible', value: damageType === 'pest' },
              { id: 4, label: 'Disease symptoms present', value: damageType === 'disease' },
              { id: 5, label: 'Lodging observed', value: damageType === 'lodging' },
              { id: 6, label: 'Flood damage visible', value: damageType === 'flood' },
            ].map((item) => (
              <View key={item.id} style={styles.checklistItem}>
                <View style={styles.checkbox}>
                  {item.value && <View style={styles.checkboxInner} />}
                </View>
                <Text style={styles.checklistText}>{item.label}</Text>
              </View>
            ))}
          </View>

          {/* Notes */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Notes & Observations {damagePercentage > 0 && '*'}
            </Text>
            <TextInput
              style={styles.notesInput}
              placeholder={
                damagePercentage === 0 
                  ? 'Enter any observations about the crop condition...' 
                  : 'Describe the damage in detail. Include affected area, symptoms, and probable cause...'
              }
              placeholderTextColor="#98be91"
              multiline
              numberOfLines={4}
              value={notes}
              onChangeText={setNotes}
            />
            {damagePercentage > 0 && (
              <Text style={styles.helperText}>
                * Required for damage reports above 25%
              </Text>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Submit Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.submitButton,
            damagePercentage > 0 && (!damageType || notes.trim() === '') && styles.submitButtonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={damagePercentage > 0 && (!damageType || notes.trim() === '')}
        >
          <Text style={styles.submitButtonText}>Review & Submit</Text>
          <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// Helper functions
function getDamageColor(percentage: number): string {
  if (percentage <= 25) return '#4CAF50'; // Green
  if (percentage <= 50) return '#FF9800'; // Orange
  return '#F44336'; // Red
}

function getDamageIcon(type: DamageType): any {
  const icons = {
    'flood': 'water-outline',
    'pest': 'bug-outline',
    'disease': 'medical-outline',
    'drought': 'sunny-outline',
    'hailstorm': 'cloud-outline',
    'lodging': 'trending-down-outline',
    'fire': 'flame-outline',
    'other': 'help-circle-outline',
  };
  return icons[type];
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eff3ec',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#062905',
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#062905',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#062905',
  },
  formContainer: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  section: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#062905',
    marginBottom: 12,
  },
  stageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  stageButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  stageButtonActive: {
    backgroundColor: '#38a856',
    borderColor: '#38a856',
  },
  stageButtonText: {
    fontSize: 14,
    color: '#062905',
  },
  stageButtonTextActive: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  sliderContainer: {
    marginVertical: 20,
  },
  sliderTrack: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  sliderFill: {
    height: '100%',
    borderRadius: 4,
  },
  sliderHandleContainer: {
    position: 'absolute',
    top: -12,
    left: 0,
    right: 0,
  },
  sliderHandle: {
    position: 'absolute',
    top: 0,
  },
  handleCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  sliderMarks: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  sliderMark: {
    alignItems: 'center',
  },
  sliderMarkText: {
    fontSize: 12,
    color: '#76a06a',
    fontWeight: '500',
  },
  damageIndicator: {
    marginTop: 24,
    gap: 8,
  },
  indicatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  indicatorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  indicatorText: {
    fontSize: 12,
    color: '#062905',
  },
  damageTypeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  damageTypeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    minWidth: '48%',
  },
  damageTypeButtonActive: {
    backgroundColor: '#38a856',
    borderColor: '#38a856',
  },
  damageTypeText: {
    marginLeft: 8,
    fontSize: 12,
    color: '#062905',
    flex: 1,
  },
  damageTypeTextActive: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  checklistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#98be91',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxInner: {
    width: 12,
    height: 12,
    borderRadius: 2,
    backgroundColor: '#38a856',
  },
  checklistText: {
    marginLeft: 12,
    fontSize: 14,
    color: '#062905',
    flex: 1,
  },
  notesInput: {
    minHeight: 100,
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    fontSize: 14,
    color: '#062905',
    textAlignVertical: 'top',
  },
  helperText: {
    fontSize: 12,
    color: '#ff6b6b',
    marginTop: 8,
    fontStyle: 'italic',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  submitButton: {
    backgroundColor: '#38a856',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
  },
  submitButtonDisabled: {
    backgroundColor: '#98be91',
    opacity: 0.7,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
});