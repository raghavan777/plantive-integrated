import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { COLORS } from '../../../constants/colors';
import { router } from 'expo-router';

export default function VerificationScreen() {
  const [currentFarm] = useState({
    id: 'A123',
    farmerName: 'Ramesh Patel',
    crop: 'Rice',
    location: 'Ramgarh Village',
    deadline: 'Today, 4 PM',
  });

  const handleStartVerification = () => {
    Alert.alert(
      'Begin Verification',
      'You are about to start the verification process for:\n\n' +
      `Farm: #${currentFarm.id}\n` +
      `Farmer: ${currentFarm.farmerName}\n` +
      `Crop: ${currentFarm.crop}\n\n` +
      'Make sure you are at the farm location.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Continue', onPress: () => router.push('/official/verification/gps') },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Field Verification</Text>
        <Text style={styles.subtitle}>Complete farm inspection process</Text>
      </View>

      {/* Current Farm Info */}
      <View style={styles.farmCard}>
        <Text style={styles.farmTitle}>Current Assignment</Text>
        <View style={styles.farmInfo}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Farm ID:</Text>
            <Text style={styles.infoValue}>#{currentFarm.id}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Farmer:</Text>
            <Text style={styles.infoValue}>{currentFarm.farmerName}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Crop:</Text>
            <Text style={styles.infoValue}>{currentFarm.crop}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Location:</Text>
            <Text style={styles.infoValue}>{currentFarm.location}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Deadline:</Text>
            <Text style={[styles.infoValue, styles.deadlineText]}>
              {currentFarm.deadline}
            </Text>
          </View>
        </View>
      </View>

      {/* Verification Steps */}
      <View style={styles.stepsContainer}>
        <Text style={styles.sectionTitle}>Verification Steps</Text>
        
        <View style={styles.stepList}>
          <View style={styles.stepItem}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>1</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>GPS Location Check</Text>
              <Text style={styles.stepDescription}>
                Verify you are within 50-100 meters of the farm
              </Text>
            </View>
          </View>

          <View style={styles.stepDivider} />

          <View style={styles.stepItem}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>2</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Capture Field Photos</Text>
              <Text style={styles.stepDescription}>
                Take wide field, close crop, and damage specific photos
              </Text>
            </View>
          </View>

          <View style={styles.stepDivider} />

          <View style={styles.stepItem}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>3</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Damage Assessment</Text>
              <Text style={styles.stepDescription}>
                Fill damage assessment form with crop details
              </Text>
            </View>
          </View>

          <View style={styles.stepDivider} />

          <View style={styles.stepItem}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>4</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Review & Submit</Text>
              <Text style={styles.stepDescription}>
                Review all data and submit verification report
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Requirements */}
      <View style={styles.requirementsCard}>
        <Text style={styles.requirementsTitle}>Requirements:</Text>
        <Text style={styles.requirementsText}>
          • Must be at farm location{'\n'}
          • Good lighting conditions{'\n'}
          • Stable internet connection (or offline mode){'\n'}
          • GPS enabled on device{'\n'}
          • Camera permission granted
        </Text>
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.startButton}
          onPress={handleStartVerification}
        >
          <Text style={styles.startButtonText}>Start Verification Process</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Back to Assignments</Text>
        </TouchableOpacity>
      </View>

      {/* Offline Mode Info */}
      <View style={styles.offlineCard}>
        <Text style={styles.offlineTitle}>📶 Offline Mode Available</Text>
        <Text style={styles.offlineText}>
          If you lose internet connection, you can still complete verification.
          Data will auto-sync when connection is restored.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.content,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.gray,
    textAlign: 'center',
  },
  farmCard: {
    backgroundColor: COLORS.white,
    borderRadius: 15,
    padding: 20,
    marginBottom: 25,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  farmTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.content,
    marginBottom: 15,
  },
  farmInfo: {
    gap: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 14,
    color: COLORS.gray,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.content,
  },
  deadlineText: {
    color: COLORS.error,
    fontWeight: 'bold',
  },
  stepsContainer: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.content,
    marginBottom: 15,
  },
  stepList: {
    backgroundColor: COLORS.white,
    borderRadius: 15,
    padding: 20,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  stepNumberText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.content,
    marginBottom: 5,
  },
  stepDescription: {
    fontSize: 14,
    color: COLORS.gray,
    lineHeight: 20,
  },
  stepDivider: {
    height: 20,
    width: 2,
    backgroundColor: COLORS.lightGray,
    marginLeft: 20,
    marginVertical: 10,
  },
  requirementsCard: {
    backgroundColor: COLORS.tertiary + '20',
    borderRadius: 10,
    padding: 20,
    marginBottom: 25,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  requirementsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.content,
    marginBottom: 10,
  },
  requirementsText: {
    fontSize: 14,
    color: COLORS.gray,
    lineHeight: 22,
  },
  buttonContainer: {
    gap: 15,
    marginBottom: 25,
  },
  startButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    paddingVertical: 18,
    alignItems: 'center',
  },
  startButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  backButton: {
    backgroundColor: COLORS.white,
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderRadius: 10,
    paddingVertical: 18,
    alignItems: 'center',
  },
  backButtonText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  offlineCard: {
    backgroundColor: COLORS.secondary + '20',
    borderRadius: 10,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  offlineTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.content,
    flex: 1,
  },
  offlineText: {
    fontSize: 12,
    color: COLORS.gray,
    flex: 3,
    lineHeight: 18,
  },
});