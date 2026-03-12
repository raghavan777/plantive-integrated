import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { COLORS } from '../../constants/colors';
import { router, useLocalSearchParams } from 'expo-router';

export default function FarmDetailsScreen() {
  const { farmId } = useLocalSearchParams();
  
  // Mock data - in real app, fetch from API based on farmId
  const farmData = {
    id: farmId || 'A123',
    farmerName: 'Ramesh Patel',
    crop: 'Rice',
    stage: 'Flowering',
    area: '2.5 acres',
    location: 'Ramgarh Village',
    coordinates: '28.4595° N, 77.0266° E',
    lastInspection: '2024-01-10',
    nextInspection: 'Today, 4 PM',
    status: 'urgent',
    farmerContact: '9876543210',
    insuranceId: 'PMFBY-RICE-2024-001',
    sumInsured: '₹ 50,000',
    premium: '₹ 2,500',
  };

  const handleStartVerification = () => {
    router.push('/official/verification');
  };

  const handleCallFarmer = () => {
    Alert.alert('Call Farmer', `Call ${farmData.farmerName} at ${farmData.farmerContact}?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Call', style: 'default' },
    ]);
  };

  const handleViewLocation = () => {
    Alert.alert('View Location', 'Open in Maps?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Open', style: 'default' },
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.farmId}>Farm #{farmData.id}</Text>
          <Text style={styles.farmerName}>{farmData.farmerName}</Text>
          <View style={[styles.statusBadge, styles.statusUrgent]}>
            <Text style={styles.statusText}>URGENT VERIFICATION</Text>
          </View>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerButton} onPress={handleCallFarmer}>
            <Text style={styles.headerButtonIcon}>📞</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton} onPress={handleViewLocation}>
            <Text style={styles.headerButtonIcon}>📍</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Farm Info Cards */}
      <View style={styles.cardsContainer}>
        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>Crop Details</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoKey}>Crop Type:</Text>
            <Text style={styles.infoValue}>{farmData.crop}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoKey}>Growth Stage:</Text>
            <Text style={styles.infoValue}>{farmData.stage}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoKey}>Cultivation Area:</Text>
            <Text style={styles.infoValue}>{farmData.area}</Text>
          </View>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>Location Details</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoKey}>Village:</Text>
            <Text style={styles.infoValue}>{farmData.location}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoKey}>Coordinates:</Text>
            <Text style={styles.infoValue}>{farmData.coordinates}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoKey}>Contact:</Text>
            <Text style={styles.infoValue}>{farmData.farmerContact}</Text>
          </View>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>Insurance Details</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoKey}>Policy ID:</Text>
            <Text style={styles.infoValue}>{farmData.insuranceId}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoKey}>Sum Insured:</Text>
            <Text style={styles.infoValue}>{farmData.sumInsured}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoKey}>Premium:</Text>
            <Text style={styles.infoValue}>{farmData.premium}</Text>
          </View>
        </View>
      </View>

      {/* Inspection Timeline */}
      <View style={styles.timelineContainer}>
        <Text style={styles.sectionTitle}>Inspection Timeline</Text>
        <View style={styles.timeline}>
          <View style={styles.timelineItem}>
            <View style={styles.timelineDot} />
            <View style={styles.timelineContent}>
              <Text style={styles.timelineTitle}>Last Inspection</Text>
              <Text style={styles.timelineDate}>{farmData.lastInspection}</Text>
              <Text style={styles.timelineStatus}>Completed - No Issues</Text>
            </View>
          </View>
          <View style={styles.timelineItem}>
            <View style={[styles.timelineDot, styles.timelineDotCurrent]} />
            <View style={styles.timelineContent}>
              <Text style={styles.timelineTitle}>Current Inspection</Text>
              <Text style={styles.timelineDate}>{farmData.nextInspection}</Text>
              <Text style={[styles.timelineStatus, styles.timelineStatusUrgent]}>
                PENDING - URGENT
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Recent Farmer Uploads */}
      <View style={styles.uploadsContainer}>
        <Text style={styles.sectionTitle}>Recent Farmer Uploads</Text>
        <View style={styles.uploadCard}>
          <View style={styles.uploadHeader}>
            <Text style={styles.uploadDate}>Uploaded: Today, 10:30 AM</Text>
            <View style={styles.uploadStatus}>
              <Text style={styles.uploadStatusText}>AI Processing</Text>
            </View>
          </View>
          <Text style={styles.uploadCrop}>Crop: {farmData.crop} - {farmData.stage}</Text>
          <Text style={styles.uploadNote}>
            Farmer reported possible pest infestation. Needs verification.
          </Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionContainer}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.primaryAction]}
          onPress={handleStartVerification}
        >
          <Text style={styles.actionButtonText}>Start Verification Visit</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, styles.secondaryAction]}
          onPress={() => router.back()}
        >
          <Text style={[styles.actionButtonText, styles.secondaryActionText]}>Back to List</Text>
        </TouchableOpacity>
      </View>

      {/* Important Notes */}
      <View style={styles.notesContainer}>
        <Text style={styles.notesTitle}>Important Notes:</Text>
        <Text style={styles.notesText}>
          • GPS verification required within 50-100 meters of farm{'\n'}
          • Capture minimum 3 photos: Wide field, close crop, damage specific{'\n'}
          • Complete damage assessment form on-site{'\n'}
          • Submit report before deadline
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 20,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  farmId: {
    fontSize: 14,
    color: COLORS.gray,
    marginBottom: 5,
  },
  farmerName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.content,
    marginBottom: 10,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 15,
  },
  statusUrgent: {
    backgroundColor: COLORS.error + '20',
    borderWidth: 1,
    borderColor: COLORS.error,
  },
  statusText: {
    color: COLORS.error,
    fontSize: 12,
    fontWeight: 'bold',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 10,
  },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.tertiary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerButtonIcon: {
    fontSize: 20,
  },
  cardsContainer: {
    padding: 20,
    gap: 15,
  },
  infoCard: {
    backgroundColor: COLORS.white,
    borderRadius: 15,
    padding: 20,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.content,
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  infoKey: {
    fontSize: 14,
    color: COLORS.gray,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.content,
  },
  timelineContainer: {
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.content,
    marginBottom: 15,
  },
  timeline: {
    backgroundColor: COLORS.white,
    borderRadius: 15,
    padding: 20,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 25,
  },
  timelineDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: COLORS.success,
    marginTop: 4,
    marginRight: 15,
  },
  timelineDotCurrent: {
    backgroundColor: COLORS.error,
  },
  timelineContent: {
    flex: 1,
  },
  timelineTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.content,
    marginBottom: 5,
  },
  timelineDate: {
    fontSize: 14,
    color: COLORS.gray,
    marginBottom: 5,
  },
  timelineStatus: {
    fontSize: 12,
    color: COLORS.success,
    fontWeight: '600',
  },
  timelineStatusUrgent: {
    color: COLORS.error,
  },
  uploadsContainer: {
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  uploadCard: {
    backgroundColor: COLORS.white,
    borderRadius: 15,
    padding: 20,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  uploadHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  uploadDate: {
    fontSize: 14,
    color: COLORS.gray,
  },
  uploadStatus: {
    backgroundColor: COLORS.warning + '20',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  uploadStatusText: {
    fontSize: 12,
    color: COLORS.warning,
    fontWeight: '600',
  },
  uploadCrop: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.content,
    marginBottom: 10,
  },
  uploadNote: {
    fontSize: 14,
    color: COLORS.gray,
    lineHeight: 20,
  },
  actionContainer: {
    paddingHorizontal: 20,
    gap: 15,
    marginBottom: 30,
  },
  actionButton: {
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: 'center',
  },
  primaryAction: {
    backgroundColor: COLORS.primary,
  },
  secondaryAction: {
    backgroundColor: COLORS.white,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  secondaryActionText: {
    color: COLORS.primary,
  },
  notesContainer: {
    padding: 20,
    backgroundColor: COLORS.tertiary + '20',
    margin: 20,
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  notesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.content,
    marginBottom: 10,
  },
  notesText: {
    fontSize: 14,
    color: COLORS.gray,
    lineHeight: 22,
  },
});