// /home/ashith/Plantive/app/official/history.tsx

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  RefreshControl,
  Alert,
  FlatList,
  Modal,
  Share,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import * as Clipboard from 'expo-clipboard';

// Import colors
import { COLORS } from '../../constants/colors';

// Mock data for official visit reports
const MOCK_VISITS = [
  {
    id: 'VISIT-1701234567-001',
    date: 'Today, 11:30 AM',
    farmerName: 'Ramesh Kumar',
    crop: 'Paddy',
    location: 'Chengalpattu, TN',
    status: 'completed',
    damageLevel: 'Low',
    visitType: 'Scheduled',
    images: [
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=400&auto=format&fit=crop',
    ],
    aiMatch: 'Yes',
    officerNotes: 'Crop healthy, no visible damage. AI assessment matches field observation.',
    reportId: 'RPT-001',
  },
  {
    id: 'VISIT-1701223456-002',
    date: 'Yesterday, 2:45 PM',
    farmerName: 'Suresh Patel',
    crop: 'Wheat',
    location: 'Kanchipuram, TN',
    status: 'completed',
    damageLevel: 'High',
    visitType: 'Emergency',
    images: [
      'https://images.unsplash.com/photo-1621451537084-482c73073a0f?w=400&auto=format&fit=crop',
    ],
    aiMatch: 'No',
    officerNotes: 'Pest damage detected. Recommended immediate intervention. AI missed the early signs.',
    reportId: 'RPT-002',
  },
  {
    id: 'VISIT-1701212345-003',
    date: 'Dec 21, 10:15 AM',
    farmerName: 'Anita Sharma',
    crop: 'Maize',
    location: 'Vellore, TN',
    status: 'completed',
    damageLevel: 'Medium',
    visitType: 'Follow-up',
    images: [
      'https://images.unsplash.com/photo-1592924357228-91a4daadcfe3?w=400&auto=format&fit=crop',
    ],
    aiMatch: 'Yes',
    officerNotes: 'Water stress observed. AI correctly identified moisture deficiency.',
    reportId: 'RPT-003',
  },
  {
    id: 'VISIT-1701201234-004',
    date: 'Dec 20, 3:30 PM',
    farmerName: 'Gopal Reddy',
    crop: 'Sugarcane',
    location: 'Tiruvallur, TN',
    status: 'in-progress',
    damageLevel: 'Pending',
    visitType: 'Scheduled',
    images: [],
    aiMatch: 'Pending',
    officerNotes: 'Visit completed, report submission pending.',
    reportId: 'RPT-004',
  },
  {
    id: 'VISIT-1701190123-005',
    date: 'Dec 19, 9:00 AM',
    farmerName: 'Meena Devi',
    crop: 'Cotton',
    location: 'Krishnagiri, TN',
    status: 'scheduled',
    damageLevel: 'N/A',
    visitType: 'Scheduled',
    images: [],
    aiMatch: 'N/A',
    officerNotes: 'Visit scheduled for tomorrow.',
    reportId: 'RPT-005',
  },
];

export default function OfficialHistoryScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const selectedId = params.id as string;
  
  const [visits, setVisits] = useState(MOCK_VISITS);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'scheduled' | 'in-progress' | 'completed'>('all');
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedVisit, setSelectedVisit] = useState<any>(null);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    inProgress: 0,
    scheduled: 0,
  });

  // Calculate stats
  useEffect(() => {
    const total = visits.length;
    const completed = visits.filter(v => v.status === 'completed').length;
    const inProgress = visits.filter(v => v.status === 'in-progress').length;
    const scheduled = visits.filter(v => v.status === 'scheduled').length;
    
    setStats({ total, completed, inProgress, scheduled });
  }, [visits]);

  // Set selected visit if ID is provided
  useEffect(() => {
    if (selectedId) {
      const visit = visits.find(v => v.id === selectedId);
      if (visit) {
        setSelectedVisit(visit);
        setShowDetailsModal(true);
      }
    }
  }, [selectedId]);

  // Filter visits based on selected filter
  const filteredVisits = visits.filter(visit => {
    if (selectedFilter === 'all') return true;
    return visit.status === selectedFilter;
  });

  // Refresh visits
  const onRefresh = () => {
    setRefreshing(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    // Simulate API call
    setTimeout(() => {
      setVisits(MOCK_VISITS);
      setRefreshing(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }, 1000);
  };

  // View visit details
  const viewVisitDetails = (visit: any) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSelectedVisit(visit);
    setShowDetailsModal(true);
  };

  const closeDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedVisit(null);
  };

  // Share visit report
  const shareVisitReport = async (visit: any) => {
    try {
      await Share.share({
        message: `PMFBY Field Visit Report\n\nReport ID: ${visit.reportId}\nFarmer: ${visit.farmerName}\nCrop: ${visit.crop}\nLocation: ${visit.location}\nDate: ${visit.date}\nStatus: ${getStatusInfo(visit.status).text}\nDamage Level: ${visit.damageLevel}\nAI Match: ${visit.aiMatch}\nOfficer Notes: ${visit.officerNotes}\n\nVerified via PMFBY-CROPIC App`,
        title: 'PMFBY Field Visit Report',
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  // Copy report ID to clipboard
  const copyToClipboard = async (id: string) => {
    await Clipboard.setStringAsync(id);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert('Copied!', 'Report ID copied to clipboard');
  };

  // Get status color and text
  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'completed':
        return { color: COLORS.success, text: 'Completed', icon: 'checkmark-circle' };
      case 'in-progress':
        return { color: COLORS.info, text: 'In Progress', icon: 'time' };
      case 'scheduled':
        return { color: COLORS.warning, text: 'Scheduled', icon: 'calendar' };
      default:
        return { color: COLORS.gray, text: 'Unknown', icon: 'help-circle' };
    }
  };

  // Get damage level color
  const getDamageColor = (level: string) => {
    switch (level) {
      case 'Low':
        return COLORS.success;
      case 'Medium':
        return COLORS.warning;
      case 'High':
        return COLORS.warning;
      case 'Pending':
        return COLORS.gray;
      default:
        return COLORS.gray;
    }
  };

  // Get AI match color
  const getAIMatchColor = (match: string) => {
    switch (match) {
      case 'Yes':
        return COLORS.success;
      case 'No':
        return COLORS.warning;
      case 'Pending':
        return COLORS.info;
      default:
        return COLORS.gray;
    }
  };

  // Render visit item
  const renderVisitItem = ({ item }: { item: any }) => {
    const statusInfo = getStatusInfo(item.status);
    
    return (
      <TouchableOpacity
        style={styles.visitCard}
        onPress={() => viewVisitDetails(item)}
        activeOpacity={0.7}
      >
        <View style={styles.visitHeader}>
          <View style={styles.visitIdContainer}>
            <Ionicons name="document-text" size={16} color={COLORS.gray} />
            <Text style={styles.visitId} numberOfLines={1}>
              {item.reportId}
            </Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: `${statusInfo.color}20` }]}>
            <Ionicons name={statusInfo.icon as any} size={14} color={statusInfo.color} />
            <Text style={[styles.statusText, { color: statusInfo.color }]}>
              {statusInfo.text}
            </Text>
          </View>
        </View>

        <View style={styles.visitContent}>
          {/* Farmer Info */}
          <View style={styles.farmerInfo}>
            <View style={styles.farmerAvatar}>
              <Ionicons name="person" size={20} color={COLORS.primary} />
            </View>
            <View style={styles.farmerDetails}>
              <Text style={styles.farmerName}>{item.farmerName}</Text>
              <Text style={styles.farmerCrop}>{item.crop} • {item.location}</Text>
            </View>
          </View>

          {/* Visit Details */}
          <View style={styles.detailsGrid}>
            <View style={styles.detailItem}>
              <Ionicons name="calendar" size={14} color={COLORS.gray} />
              <Text style={styles.detailLabel}>Date</Text>
              <Text style={styles.detailValue}>{item.date}</Text>
            </View>
            
            <View style={styles.detailItem}>
              <MaterialIcons name="grass" size={14} color={COLORS.gray} />
              <Text style={styles.detailLabel}>Damage</Text>
              <Text style={[styles.detailValue, { color: getDamageColor(item.damageLevel) }]}>
                {item.damageLevel}
              </Text>
            </View>
            
            <View style={styles.detailItem}>
              <Ionicons name="analytics" size={14} color={COLORS.gray} />
              <Text style={styles.detailLabel}>AI Match</Text>
              <Text style={[styles.detailValue, { color: getAIMatchColor(item.aiMatch) }]}>
                {item.aiMatch}
              </Text>
            </View>
            
            <View style={styles.detailItem}>
              <FontAwesome5 name="walking" size={14} color={COLORS.gray} />
              <Text style={styles.detailLabel}>Type</Text>
              <Text style={styles.detailValue}>{item.visitType}</Text>
            </View>
          </View>

          {/* Images Preview */}
          {item.images.length > 0 && (
            <View style={styles.imagesContainer}>
              <Text style={styles.imagesLabel}>Field Photos:</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {item.images.map((image: string, index: number) => (
                  <Image
                    key={index}
                    source={{ uri: image }}
                    style={styles.visitImage}
                    resizeMode="cover"
                  />
                ))}
              </ScrollView>
            </View>
          )}

          {/* Quick Notes */}
          {item.officerNotes && (
            <View style={styles.notesContainer}>
              <Ionicons name="document-text" size={14} color={COLORS.secondary} />
              <Text style={styles.notesText} numberOfLines={2}>
                {item.officerNotes}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.visitFooter}>
          <TouchableOpacity
            style={styles.viewDetailsButton}
            onPress={() => viewVisitDetails(item)}
          >
            <Text style={styles.viewDetailsText}>View Full Report</Text>
            <Ionicons name="chevron-forward" size={16} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  // Render filter buttons
  const renderFilterButton = (filter: 'all' | 'scheduled' | 'in-progress' | 'completed', label: string) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        selectedFilter === filter && styles.filterButtonActive,
      ]}
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setSelectedFilter(filter);
      }}
    >
      <Text
        style={[
          styles.filterButtonText,
          selectedFilter === filter && styles.filterButtonTextActive,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
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
          <Text style={styles.title}>Visit History</Text>
          <TouchableOpacity
            style={styles.filterIcon}
            onPress={() => {
              Alert.alert(
                'Sort Options',
                'Select sorting option',
                [
                  { text: 'Date (Newest First)', onPress: () => {} },
                  { text: 'Date (Oldest First)', onPress: () => {} },
                  { text: 'Farmer Name (A-Z)', onPress: () => {} },
                  { text: 'Damage Level', onPress: () => {} },
                  { text: 'Cancel', style: 'cancel' },
                ]
              );
            }}
          >
            <Ionicons name="filter" size={20} color={COLORS.content} />
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <LinearGradient
              colors={[COLORS.primary, COLORS.secondary]}
              style={styles.statIcon}
            >
              <Ionicons name="document-text" size={20} color={COLORS.white} />
            </LinearGradient>
            <Text style={styles.statNumber}>{stats.total}</Text>
            <Text style={styles.statLabel}>Total Visits</Text>
          </View>
          
          <View style={styles.statCard}>
            <LinearGradient
              colors={[COLORS.success, '#00cc00']}
              style={styles.statIcon}
            >
              <Ionicons name="checkmark-done" size={20} color={COLORS.white} />
            </LinearGradient>
            <Text style={styles.statNumber}>{stats.completed}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
          
          <View style={styles.statCard}>
            <LinearGradient
              colors={[COLORS.info, '#0066cc']}
              style={styles.statIcon}
            >
              <Ionicons name="time" size={20} color={COLORS.white} />
            </LinearGradient>
            <Text style={styles.statNumber}>{stats.inProgress}</Text>
            <Text style={styles.statLabel}>In Progress</Text>
          </View>
          
          <View style={styles.statCard}>
            <LinearGradient
              colors={[COLORS.warning, '#ffaa33']}
              style={styles.statIcon}
            >
              <Ionicons name="calendar" size={20} color={COLORS.white} />
            </LinearGradient>
            <Text style={styles.statNumber}>{stats.scheduled}</Text>
            <Text style={styles.statLabel}>Scheduled</Text>
          </View>
        </View>

        {/* Filter Buttons */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterContainer}
          contentContainerStyle={styles.filterContent}
        >
          {renderFilterButton('all', 'All Visits')}
          {renderFilterButton('completed', 'Completed')}
          {renderFilterButton('in-progress', 'In Progress')}
          {renderFilterButton('scheduled', 'Scheduled')}
        </ScrollView>

        {/* Visits List */}
        {filteredVisits.length > 0 ? (
          <FlatList
            data={filteredVisits}
            renderItem={renderVisitItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[COLORS.primary]}
                tintColor={COLORS.primary}
              />
            }
            ListFooterComponent={<View style={styles.footerSpacer} />}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons name="document-text" size={64} color={COLORS.lightGray} />
            <Text style={styles.emptyTitle}>No Visits Found</Text>
            <Text style={styles.emptyText}>
              {selectedFilter === 'all'
                ? 'No field visits recorded yet'
                : `No ${selectedFilter} visits found`}
            </Text>
            <TouchableOpacity
              style={styles.newVisitButton}
              onPress={() => router.push('/official/assignments')}
            >
              <LinearGradient
                colors={[COLORS.primary, COLORS.secondary]}
                style={styles.newVisitGradient}
              >
                <Ionicons name="add-circle" size={20} color={COLORS.white} />
                <Text style={styles.newVisitText}>View Assignments</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}
      </LinearGradient>

      {/* Details Modal */}
      <Modal
        visible={showDetailsModal}
        animationType="slide"
        transparent={true}
        onRequestClose={closeDetailsModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {selectedVisit && (
              <ScrollView 
                style={styles.modalContent}
                showsVerticalScrollIndicator={false}
              >
                {/* Modal Header */}
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Visit Report</Text>
                  <TouchableOpacity 
                    onPress={closeDetailsModal}
                    style={styles.closeButton}
                  >
                    <Ionicons name="close" size={24} color={COLORS.gray} />
                  </TouchableOpacity>
                </View>

                {/* Report ID */}
                <View style={styles.modalField}>
                  <Text style={styles.modalLabel}>Report ID</Text>
                  <View style={styles.idContainer}>
                    <Text style={styles.idText}>{selectedVisit.reportId}</Text>
                    <TouchableOpacity
                      style={styles.copyButton}
                      onPress={() => copyToClipboard(selectedVisit.reportId)}
                    >
                      <Ionicons name="copy" size={16} color={COLORS.primary} />
                      <Text style={styles.copyText}>Copy</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Farmer Information */}
                <View style={styles.modalSection}>
                  <Text style={styles.sectionTitle}>Farmer Information</Text>
                  <View style={styles.farmerModalInfo}>
                    <View style={styles.farmerModalAvatar}>
                      <Ionicons name="person" size={24} color={COLORS.primary} />
                    </View>
                    <View style={styles.farmerModalDetails}>
                      <Text style={styles.farmerModalName}>{selectedVisit.farmerName}</Text>
                      <Text style={styles.farmerModalCrop}>{selectedVisit.crop}</Text>
                      <Text style={styles.farmerModalLocation}>{selectedVisit.location}</Text>
                    </View>
                  </View>
                </View>

                {/* Visit Details */}
                <View style={styles.modalSection}>
                  <Text style={styles.sectionTitle}>Visit Details</Text>
                  
                  <View style={styles.detailsGridModal}>
                    <View style={styles.detailColumn}>
                      <View style={styles.detailRow}>
                        <Ionicons name="calendar" size={16} color={COLORS.gray} />
                        <Text style={styles.detailLabelModal}>Date & Time</Text>
                      </View>
                      <Text style={styles.detailValueModal}>{selectedVisit.date}</Text>
                    </View>
                    
                    <View style={styles.detailColumn}>
                      <View style={styles.detailRow}>
                        <FontAwesome5 name="walking" size={16} color={COLORS.gray} />
                        <Text style={styles.detailLabelModal}>Visit Type</Text>
                      </View>
                      <Text style={styles.detailValueModal}>{selectedVisit.visitType}</Text>
                    </View>
                  </View>

                  <View style={styles.detailsGridModal}>
                    <View style={styles.detailColumn}>
                      <View style={styles.detailRow}>
                        <MaterialIcons name="grass" size={16} color={COLORS.gray} />
                        <Text style={styles.detailLabelModal}>Damage Level</Text>
                      </View>
                      <View style={[styles.damageBadge, { backgroundColor: `${getDamageColor(selectedVisit.damageLevel)}20` }]}>
                        <Text style={[styles.damageText, { color: getDamageColor(selectedVisit.damageLevel) }]}>
                          {selectedVisit.damageLevel}
                        </Text>
                      </View>
                    </View>
                    
                    <View style={styles.detailColumn}>
                      <View style={styles.detailRow}>
                        <Ionicons name="analytics" size={16} color={COLORS.gray} />
                        <Text style={styles.detailLabelModal}>AI Match</Text>
                      </View>
                      <View style={[styles.aiBadge, { backgroundColor: `${getAIMatchColor(selectedVisit.aiMatch)}20` }]}>
                        <Text style={[styles.aiText, { color: getAIMatchColor(selectedVisit.aiMatch) }]}>
                          {selectedVisit.aiMatch}
                        </Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.detailsGridModal}>
                    <View style={styles.detailColumn}>
                      <View style={styles.detailRow}>
                        <Ionicons name="document-text" size={16} color={COLORS.gray} />
                        <Text style={styles.detailLabelModal}>Status</Text>
                      </View>
                      <View style={[styles.statusBadgeModal, { backgroundColor: `${getStatusInfo(selectedVisit.status).color}20` }]}>
                        <Ionicons name={getStatusInfo(selectedVisit.status).icon as any} size={14} color={getStatusInfo(selectedVisit.status).color} />
                        <Text style={[styles.statusTextModal, { color: getStatusInfo(selectedVisit.status).color }]}>
                          {getStatusInfo(selectedVisit.status).text}
                        </Text>
                      </View>
                    </View>
                    
                    <View style={styles.detailColumn}>
                      <View style={styles.detailRow}>
                        <Ionicons name="time" size={16} color={COLORS.gray} />
                        <Text style={styles.detailLabelModal}>Duration</Text>
                      </View>
                      <Text style={styles.detailValueModal}>45 mins</Text>
                    </View>
                  </View>
                </View>

                {/* Field Photos */}
                {selectedVisit.images.length > 0 && (
                  <View style={styles.modalSection}>
                    <Text style={styles.sectionTitle}>Field Photos ({selectedVisit.images.length})</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                      {selectedVisit.images.map((image: string, index: number) => (
                        <Image
                          key={index}
                          source={{ uri: image }}
                          style={styles.modalImage}
                          resizeMode="cover"
                        />
                      ))}
                    </ScrollView>
                  </View>
                )}

                {/* Officer Notes */}
                <View style={styles.modalSection}>
                  <Text style={styles.sectionTitle}>Officer Notes</Text>
                  <View style={styles.notesBox}>
                    <Ionicons name="document-text" size={20} color={COLORS.secondary} style={styles.notesIcon} />
                    <Text style={styles.notesTextModal}>{selectedVisit.officerNotes}</Text>
                  </View>
                </View>

                {/* Recommendations (if any) */}
                <View style={styles.modalSection}>
                  <Text style={styles.sectionTitle}>Recommendations</Text>
                  <View style={styles.recommendationsBox}>
                    {selectedVisit.damageLevel === 'High' ? (
                      <>
                        <Text style={styles.recommendationText}>• Immediate pesticide application required</Text>
                        <Text style={styles.recommendationText}>• Schedule follow-up visit in 7 days</Text>
                        <Text style={styles.recommendationText}>• Notify agriculture department</Text>
                      </>
                    ) : selectedVisit.damageLevel === 'Medium' ? (
                      <>
                        <Text style={styles.recommendationText}>• Preventive measures recommended</Text>
                        <Text style={styles.recommendationText}>• Monitor crop for next 14 days</Text>
                      </>
                    ) : (
                      <Text style={styles.recommendationText}>• No immediate action required</Text>
                    )}
                  </View>
                </View>

                {/* Action Buttons */}
                <View style={styles.modalActions}>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.shareButton]}
                    onPress={() => shareVisitReport(selectedVisit)}
                  >
                    <Ionicons name="share" size={20} color={COLORS.primary} />
                    <Text style={styles.shareButtonText}>Share Report</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[styles.modalButton, styles.closeModalButton]}
                    onPress={closeDetailsModal}
                  >
                    <Text style={styles.closeModalButtonText}>Close</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
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
  filterIcon: {
    padding: 8,
  },
  statsContainer: {
    flexDirection: 'row',
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
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.content,
  },
  statLabel: {
    fontSize: 11,
    color: COLORS.gray,
    marginTop: 4,
    textAlign: 'center',
  },
  filterContainer: {
    marginTop: 15,
    marginHorizontal: 20,
  },
  filterContent: {
    paddingVertical: 5,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.background,
    marginRight: 10,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
  },
  filterButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterButtonText: {
    fontSize: 14,
    color: COLORS.gray,
    fontWeight: '500',
  },
  filterButtonTextActive: {
    color: COLORS.white,
    fontWeight: 'bold',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 20,
  },
  visitCard: {
    backgroundColor: COLORS.white,
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  visitHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  visitIdContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  visitId: {
    fontSize: 12,
    color: COLORS.gray,
    marginLeft: 6,
    flex: 1,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  visitContent: {
    marginBottom: 12,
  },
  farmerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  farmerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(56, 168, 86, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  farmerDetails: {
    flex: 1,
  },
  farmerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.content,
    marginBottom: 2,
  },
  farmerCrop: {
    fontSize: 14,
    color: COLORS.gray,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 15,
  },
  detailItem: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: COLORS.background,
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 10,
    color: COLORS.gray,
    marginTop: 4,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.content,
    textAlign: 'center',
  },
  imagesContainer: {
    marginBottom: 12,
  },
  imagesLabel: {
    fontSize: 12,
    color: COLORS.gray,
    marginBottom: 8,
    fontWeight: '500',
  },
  visitImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 8,
    backgroundColor: COLORS.lightGray,
  },
  notesContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(118, 160, 106, 0.1)',
    borderRadius: 8,
    padding: 10,
  },
  notesText: {
    fontSize: 12,
    color: COLORS.darkGray,
    marginLeft: 8,
    flex: 1,
    fontStyle: 'italic',
  },
  visitFooter: {
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
    paddingTop: 12,
  },
  viewDetailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewDetailsText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600',
    marginRight: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    marginTop: 50,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.content,
    marginTop: 20,
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.gray,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
  },
  newVisitButton: {
    borderRadius: 12,
    overflow: 'hidden',
    width: '100%',
  },
  newVisitGradient: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  newVisitText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  footerSpacer: {
    height: 20,
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    maxHeight: '90%',
  },
  modalContent: {
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.content,
  },
  closeButton: {
    padding: 4,
  },
  modalField: {
    marginBottom: 20,
  },
  modalLabel: {
    fontSize: 14,
    color: COLORS.gray,
    marginBottom: 8,
    fontWeight: '500',
  },
  modalValue: {
    fontSize: 16,
    color: COLORS.content,
    fontWeight: '600',
  },
  idContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.background,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
  },
  idText: {
    fontSize: 14,
    color: COLORS.content,
    fontWeight: '500',
    flex: 1,
    marginRight: 10,
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(56, 168, 86, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  copyText: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '600',
    marginLeft: 4,
  },
  modalSection: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.content,
    marginBottom: 15,
  },
  farmerModalInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: 10,
    padding: 15,
  },
  farmerModalAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(56, 168, 86, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  farmerModalDetails: {
    flex: 1,
  },
  farmerModalName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.content,
    marginBottom: 4,
  },
  farmerModalCrop: {
    fontSize: 16,
    color: COLORS.primary,
    marginBottom: 2,
  },
  farmerModalLocation: {
    fontSize: 14,
    color: COLORS.gray,
  },
  detailsGridModal: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 15,
  },
  detailColumn: {
    flex: 1,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  detailLabelModal: {
    fontSize: 13,
    color: COLORS.gray,
    marginLeft: 6,
  },
  detailValueModal: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.content,
  },
  damageBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  damageText: {
    fontSize: 14,
    fontWeight: '600',
  },
  aiBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  aiText: {
    fontSize: 14,
    fontWeight: '600',
  },
  statusBadgeModal: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  statusTextModal: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  modalImage: {
    width: 120,
    height: 120,
    borderRadius: 10,
    marginRight: 10,
    backgroundColor: COLORS.lightGray,
  },
  notesBox: {
    backgroundColor: 'rgba(118, 160, 106, 0.1)',
    borderRadius: 10,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  notesIcon: {
    marginRight: 10,
    marginTop: 2,
  },
  notesTextModal: {
    flex: 1,
    fontSize: 15,
    color: COLORS.content,
    lineHeight: 22,
  },
  recommendationsBox: {
    backgroundColor: 'rgba(56, 168, 86, 0.1)',
    borderRadius: 10,
    padding: 15,
  },
  recommendationText: {
    fontSize: 14,
    color: COLORS.content,
    marginBottom: 8,
    lineHeight: 20,
  },
  modalActions: {
    marginTop: 25,
    gap: 12,
  },
  modalButton: {
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  shareButton: {
    backgroundColor: 'rgba(56, 168, 86, 0.1)',
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  shareButtonText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  closeModalButton: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
  },
  closeModalButtonText: {
    color: COLORS.gray,
    fontSize: 16,
    fontWeight: '600',
  },
});